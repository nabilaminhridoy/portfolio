import createMiddleware from 'next-intl/middleware';
import { NextResponse, type NextRequest } from 'next/server';
import { getToken } from 'next-auth/jwt';
import { db } from '@/lib/db';

import { routing } from '@/i18n/routing';

const intlMiddleware = createMiddleware(routing);

// Routes that should NOT be locale-prefixed (auth + admin + api)
const nonLocalePrefixRoutes = [
  '/login',
  '/forgot-password',
  '/reset-password',
  '/logout',
  '/admin',
  '/api',
];

function isNonLocaleRoute(pathname: string): boolean {
  return nonLocalePrefixRoutes.some((route) => pathname.startsWith(route));
}

// Public admin-accessible auth endpoints that don't require an existing session
const publicAdminPaths = ['/admin/login'];

// --- Known AI crawler user agents ---
const AI_CRAWLERS = [
  'GPTBot', 'ClaudeBot', 'Google-Extended', 'CCBot', 'Bytespider',
  'Amazonbot', 'PerplexityBot', 'Applebot-Extended', 'anthropic-ai',
  'cohere-ai', 'ImagesiftBot', 'Diffbot', 'Omgilibot', 'Omgili',
  'ChatGPT-User', 'Meta-ExternalAgent',
];

// --- Suspicious bot indicators ---
const SUSPICIOUS_AGENTS = [
  'curl/', 'wget/', 'python-requests/', 'scrapy', 'httpx/',
  'Go-http-client/', 'Java/', 'node-fetch/', 'axios/',
  'PostmanRuntime/', 'python-urllib/', 'aiohttp/', 'httpie/',
];

// --- In-memory rate limit store ---
const rateLimitStore = new Map<string, { count: number; resetTime: number }>();

const RATE_LIMITS: Record<string, { max: number; windowMs: number }> = {
  '/login': { max: 5, windowMs: 60_000 },
  '/forgot-password': { max: 3, windowMs: 60_000 },
  '/reset-password': { max: 3, windowMs: 60_000 },
};

function checkRateLimit(ip: string, route: string): boolean {
  const config = RATE_LIMITS[route];
  if (!config) return true;

  const key = `${ip}:${route}`;
  const now = Date.now();
  const entry = rateLimitStore.get(key);

  if (!entry || now > entry.resetTime) {
    rateLimitStore.set(key, { count: 1, resetTime: now + config.windowMs });
    return true;
  }

  if (entry.count >= config.max) {
    return false;
  }

  entry.count += 1;
  return true;
}

function getClientIP(request: NextRequest): string {
  return (
    request.headers.get('x-forwarded-for')?.split(',')[0]?.trim() ??
    request.headers.get('x-real-ip') ??
    'unknown'
  );
}

function isAICrawler(ua: string): boolean {
  const lower = ua.toLowerCase();
  return AI_CRAWLERS.some(c => lower.includes(c.toLowerCase()));
}

function isSuspiciousBot(ua: string | null, accept: string | null, method: string, referer: string | null): boolean {
  const signals: string[] = [];

  if (!ua || ua.trim() === '' || ua === 'unknown') signals.push('missing_ua');
  if (!accept || accept.trim() === '') signals.push('missing_accept');
  if (method === 'POST' && !referer) signals.push('post_no_referer');
  if (ua && ua.length < 20) signals.push('short_ua');

  if (ua) {
    const lower = ua.toLowerCase();
    for (const agent of SUSPICIOUS_AGENTS) {
      if (lower.includes(agent.toLowerCase())) {
        signals.push('suspicious_ua');
        break;
      }
    }
  }

  // Require 2+ signals to reduce false positives
  return signals.length >= 2;
}

// --- Security headers ---
const SECURITY_HEADERS: Record<string, string> = {
  'X-Content-Type-Options': 'nosniff',
  'Referrer-Policy': 'strict-origin-when-cross-origin',
  'X-Frame-Options': 'SAMEORIGIN',
  'Permissions-Policy': 'camera=(), microphone=(), geolocation=(), browsing-topics=()',
};

/**
 * Fix Server Actions origin mismatch.
 */
function fixForwardedHost(request: NextRequest): Headers | null {
  const origin = request.headers.get('origin');
  const forwardedHost = request.headers.get('x-forwarded-host');

  if (origin && forwardedHost) {
    try {
      const originHost = new URL(origin).hostname;
      if (originHost && originHost !== forwardedHost) {
        const headers = new Headers(request.headers);
        headers.delete('x-forwarded-host');
        return headers;
      }
    } catch { /* ignore */ }
  }
  return null;
}

/**
 * Combined proxy:
 *  - Fixes x-forwarded-host mismatch for Server Actions
 *  - Anti-bot detection + AI crawler blocking
 *  - Rate limiting on sensitive endpoints
 *  - Security headers
 *  - Locale routing
 *  - Admin auth guard
 */
export async function proxy(request: NextRequest) {
  const { pathname } = request.nextUrl;
  const userAgent = request.headers.get('user-agent') ?? '';
  const acceptHeader = request.headers.get('accept') ?? '';
  const referer = request.headers.get('referer');
  const clientIP = getClientIP(request);

  // Fetch anti-bot settings (cached at module level for 60s)
  let antiBotConfig = { antiBotEnabled: false, aiCrawlerRestricted: false, aggressiveBotProtection: false, rateLimitingEnabled: false };
  try {
    const settings = await db.settings.findUnique({ where: { id: 'global' } });
    if (settings) {
      antiBotConfig = {
        antiBotEnabled: settings.antiBotEnabled,
        aiCrawlerRestricted: settings.aiCrawlerRestricted,
        aggressiveBotProtection: settings.aggressiveBotProtection,
        rateLimitingEnabled: settings.rateLimitingEnabled,
      };
    }
  } catch { /* DB might not be ready */ }

  // === Anti-Bot checks (skip for static assets + _next) ===
  if (antiBotConfig.antiBotEnabled) {
    // Block AI crawlers if restriction is enabled
    if (antiBotConfig.aiCrawlerRestricted && isAICrawler(userAgent)) {
      return new NextResponse('Forbidden', { status: 403, headers: { 'Content-Type': 'text/plain' } });
    }

    // Aggressive bot protection — check multiple signals
    if (antiBotConfig.aggressiveBotProtection) {
      if (isSuspiciousBot(userAgent || null, acceptHeader || null, request.method, referer)) {
        // Log suspicious activity (fire-and-forget)
        console.warn(`[AntiBot] Blocked suspicious request: IP=${clientIP} UA="${userAgent.slice(0, 50)}" Path=${pathname}`);
        return new NextResponse('Forbidden', { status: 403, headers: { 'Content-Type': 'text/plain' } });
      }
    }
  }

  // === Rate limiting on sensitive endpoints ===
  if (antiBotConfig.rateLimitingEnabled) {
    for (const route of Object.keys(RATE_LIMITS)) {
      if (pathname.startsWith(route)) {
        if (!checkRateLimit(clientIP, route)) {
          return new NextResponse('Too Many Requests', {
            status: 429,
            headers: { 'Content-Type': 'text/plain', 'Retry-After': '60' },
          });
        }
        break;
      }
    }
  }

  // === Fix Server Actions origin mismatch ===
  const fixedHeaders = fixForwardedHost(request);

  // === Add security headers to all responses ===
  const addSecurityHeaders = (response: NextResponse) => {
    for (const [key, value] of Object.entries(SECURITY_HEADERS)) {
      response.headers.set(key, value);
    }
    return response;
  };

  // === Auth + admin + api routes ===
  if (isNonLocaleRoute(pathname)) {
    // Admin route protection
    if (pathname.startsWith('/admin') && !publicAdminPaths.some(p => pathname.startsWith(p))) {
      const token = await getToken({
        req: request,
        secret: process.env.NEXTAUTH_SECRET,
      });
      if (!token) {
        const loginUrl = new URL('/login', request.url);
        loginUrl.searchParams.set('callbackUrl', pathname);
        return addSecurityHeaders(NextResponse.redirect(loginUrl));
      }
      if (token.role && token.role !== 'ADMIN' && token.role !== 'EDITOR') {
        const loginUrl = new URL('/login', request.url);
        loginUrl.searchParams.set('error', 'InsufficientPermissions');
        return addSecurityHeaders(NextResponse.redirect(loginUrl));
      }
    }

    const response = fixedHeaders
      ? NextResponse.next({ request: { headers: fixedHeaders } })
      : NextResponse.next();
    return addSecurityHeaders(response);
  }

  // === Locale-prefixed routes ===
  const intlResponse = intlMiddleware(request);
  if (intlResponse) {
    return addSecurityHeaders(intlResponse);
  }
  return addSecurityHeaders(NextResponse.next());
}

// Matcher: matches all except static assets, _next, _vercel, files with dots, api
export const config = {
  matcher: [
    '/((?!_next|_vercel|.*\\..*|api).*)',
  ],
};

import { db } from '@/lib/db';

/**
 * Anti-Bot / Anti-Scraping utilities
 *
 * Server-side bot detection, rate limiting, and AI crawler restriction.
 * All settings are CMS-controlled via the Settings model.
 * Cloudflare handles the first layer; this is the application-level second layer.
 */

interface AntiBotConfig {
  antiBotEnabled: boolean;
  aiCrawlerRestricted: boolean;
  aggressiveBotProtection: boolean;
  rateLimitingEnabled: boolean;
}

export async function getAntiBotConfig(): Promise<AntiBotConfig> {
  try {
    const settings = await db.settings.findUnique({ where: { id: 'global' } });
    return {
      antiBotEnabled: settings?.antiBotEnabled ?? false,
      aiCrawlerRestricted: settings?.aiCrawlerRestricted ?? false,
      aggressiveBotProtection: settings?.aggressiveBotProtection ?? false,
      rateLimitingEnabled: settings?.rateLimitingEnabled ?? false,
    };
  } catch {
    return { antiBotEnabled: false, aiCrawlerRestricted: false, aggressiveBotProtection: false, rateLimitingEnabled: false };
  }
}

// --- Known AI crawler user agents ---
const AI_CRAWLER_AGENTS = [
  'GPTBot',
  'ClaudeBot',
  'Google-Extended',
  'CCBot',
  'Bytespider',
  'Amazonbot',
  'PerplexityBot',
  'Applebot-Extended',
  'FacebookBot',
  'LinkedInBot',
  'anthropic-ai',
  'cohere-ai',
  'ImagesiftBot',
  'Diffbot',
  'Omgilibot',
  'Omgili',
  'ChatGPT-User',
  'facebookexternalhit',
  'Meta-ExternalAgent',
];

// --- Suspicious bot indicators ---
const SUSPICIOUS_AGENTS = [
  'curl/',
  'wget/',
  'python-requests/',
  'scrapy',
  'httpx/',
  'Go-http-client/',
  'Java/',
  'node-fetch/',
  'axios/',
  'PostmanRuntime/',
  'python-urllib/',
  'aiohttp/',
  'httpie/',
  'http.rb/',
];

// --- In-memory rate limit store ---
// Key: IP + route-type → { count, resetTime }
const rateLimitStore = new Map<string, { count: number; resetTime: number }>();

interface RateLimitConfig {
  maxRequests: number;
  windowMs: number;
}

const RATE_LIMITS: Record<string, RateLimitConfig> = {
  login: { maxRequests: 5, windowMs: 60_000 },       // 5/min
  contact: { maxRequests: 3, windowMs: 60_000 },      // 3/min
  passwordReset: { maxRequests: 3, windowMs: 60_000 }, // 3/min
  default: { maxRequests: 30, windowMs: 60_000 },     // 30/min
};

/**
 * Check if a request is from a known AI crawler.
 */
export function isAICrawler(userAgent: string | null): boolean {
  if (!userAgent) return false;
  const ua = userAgent.toLowerCase();
  return AI_CRAWLER_AGENTS.some(agent => ua.includes(agent.toLowerCase()));
}

/**
 * Check if a request has suspicious bot indicators.
 * Uses multiple signals — never blocks on a single signal alone.
 */
export function isSuspiciousBot(
  userAgent: string | null,
  acceptHeader: string | null,
  method: string,
  hasReferer: boolean
): { suspicious: boolean; signals: string[] } {
  const signals: string[] = [];

  // Signal 1: Known scraping user agents
  if (userAgent) {
    const ua = userAgent.toLowerCase();
    for (const agent of SUSPICIOUS_AGENTS) {
      if (ua.includes(agent.toLowerCase())) {
        signals.push(`suspicious_ua:${agent}`);
        break;
      }
    }
  }

  // Signal 2: No user agent at all
  if (!userAgent || userAgent.trim() === '' || userAgent === 'unknown') {
    signals.push('missing_user_agent');
  }

  // Signal 3: Missing Accept header (browsers always send this)
  if (!acceptHeader || acceptHeader.trim() === '') {
    signals.push('missing_accept_header');
  }

  // Signal 4: POST without Referer (browsers always send Referer on POST)
  if (method === 'POST' && !hasReferer) {
    signals.push('post_without_referer');
  }

  // Signal 5: Suspiciously short user agent (< 20 chars)
  if (userAgent && userAgent.length < 20) {
    signals.push('short_user_agent');
  }

  // Only flag as suspicious if 2+ signals (reduces false positives)
  return {
    suspicious: signals.length >= 2,
    signals,
  };
}

/**
 * Check rate limit for a given IP + route type.
 * Returns true if the request is allowed, false if rate-limited.
 */
export function checkRateLimit(
  ip: string,
  routeType: keyof typeof RATE_LIMITS | 'default'
): { allowed: boolean; remaining: number; resetIn: number } {
  const config = RATE_LIMITS[routeType] ?? RATE_LIMITS.default;
  const key = `${ip}:${routeType}`;
  const now = Date.now();

  const entry = rateLimitStore.get(key);
  if (!entry || now > entry.resetTime) {
    // First request or window expired — start fresh
    rateLimitStore.set(key, { count: 1, resetTime: now + config.windowMs });
    return { allowed: true, remaining: config.maxRequests - 1, resetIn: config.windowMs };
  }

  if (entry.count >= config.maxRequests) {
    // Rate limited
    return { allowed: false, remaining: 0, resetIn: entry.resetTime - now };
  }

  // Increment count
  entry.count += 1;
  rateLimitStore.set(key, entry);
  return { allowed: true, remaining: config.maxRequests - entry.count, resetIn: entry.resetTime - now };
}

/**
 * Get the route type for rate limiting based on the path.
 */
export function getRouteType(pathname: string): keyof typeof RATE_LIMITS | 'default' {
  if (pathname.includes('/login') || pathname.includes('/api/auth')) return 'login';
  if (pathname.includes('/contact') || pathname.includes('/api/contact')) return 'contact';
  if (pathname.includes('/reset-password') || pathname.includes('/forgot-password')) return 'passwordReset';
  return 'default';
}

/**
 * Generate robots.txt content based on admin settings.
 * When AI Crawler Restriction is enabled, blocks known AI crawlers.
 */
export function generateRobotsTxt(
  aiCrawlerRestricted: boolean,
  sitemapUrl: string
): string {
  const lines: string[] = [
    '# Nabil Amin Hridoy — Portfolio CMS',
    '# Crawler Policy',
    '',
    '# === Legitimate search engines — always allowed ===',
    'User-agent: Googlebot',
    'Allow: /',
    '',
    'User-agent: Bingbot',
    'Allow: /',
    '',
    'User-agent: Slurp',
    'Allow: /',
    '',
    'User-agent: DuckDuckBot',
    'Allow: /',
    '',
    'User-agent: Baiduspider',
    'Allow: /',
    '',
    'User-agent: YandexBot',
    'Allow: /',
    '',
    'User-agent: facebookexternalhit',
    'Allow: /',
    '',
    'User-agent: Twitterbot',
    'Allow: /',
    '',
    '# === Protected areas — blocked for all ===',
    'User-agent: *',
    'Disallow: /admin/',
    'Disallow: /api/',
    'Disallow: /login',
    'Disallow: /forgot-password',
    'Disallow: /reset-password',
    'Disallow: /logout',
    '',
  ];

  if (aiCrawlerRestricted) {
    lines.push('# === AI Crawlers — restricted ===');
    const aiCrawlers = [
      'GPTBot',
      'ClaudeBot',
      'Google-Extended',
      'CCBot',
      'Bytespider',
      'Amazonbot',
      'PerplexityBot',
      'Applebot-Extended',
      'FacebookBot',
      'LinkedInBot',
      'anthropic-ai',
      'cohere-ai',
      'ImagesiftBot',
      'Diffbot',
      'Omgilibot',
      'Omgili',
      'ChatGPT-User',
      'Meta-ExternalAgent',
    ];

    for (const crawler of aiCrawlers) {
      lines.push(`User-agent: ${crawler}`, 'Disallow: /', '');
    }
  }

  lines.push('# === Sitemap ===');
  lines.push(`Sitemap: ${sitemapUrl}`);

  return lines.join('\n');
}

/**
 * Security headers for HTTP responses.
 * Applied via next.config.ts headers or middleware.
 */
export const SECURITY_HEADERS: Record<string, string> = {
  'X-Content-Type-Options': 'nosniff',
  'Referrer-Policy': 'strict-origin-when-cross-origin',
  'X-Frame-Options': 'SAMEORIGIN',
  'Permissions-Policy': 'camera=(), microphone=(), geolocation=(), browsing-topics=()',
  'X-DNS-Prefetch-Control': 'on',
};

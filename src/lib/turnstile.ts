import { db } from '@/lib/db';

/**
 * Turnstile utilities — server-side only.
 * The secret key is NEVER exposed to the client.
 */

interface TurnstileConfig {
  enabled: boolean;
  siteKey: string | null;
}

/**
 * Get the public Turnstile configuration (enabled + site key only).
 * Safe to return to the client — does NOT include the secret key.
 */
export async function getTurnstileConfig(): Promise<TurnstileConfig> {
  try {
    const settings = await db.settings.findUnique({ where: { id: 'global' } });
    return {
      enabled: settings?.turnstileEnabled ?? false,
      siteKey: settings?.turnstileSiteKey ?? null,
    };
  } catch {
    return { enabled: false, siteKey: null };
  }
}

/**
 * Get the Turnstile secret key (server-side only — NEVER expose to client).
 */
async function getTurnstileSecretKey(): Promise<string | null> {
  try {
    const settings = await db.settings.findUnique({ where: { id: 'global' } });
    return settings?.turnstileSecretKey ?? null;
  } catch {
    return null;
  }
}

/**
 * Verify a Turnstile token server-side using Cloudflare's official verification API.
 *
 * Flow:
 * 1. User submits form with Turnstile token
 * 2. Backend calls this function to verify the token with Cloudflare
 * 3. If verification fails → reject the request
 * 4. If verification succeeds → continue processing
 *
 * If Turnstile is disabled, returns true (no verification needed).
 * If Turnstile is enabled but token is missing/invalid → returns false.
 * If Cloudflare API is unreachable → returns false (fail securely, no bypass).
 */
export async function verifyTurnstileToken(token: string | null | undefined): Promise<{
  success: boolean;
  error?: string;
}> {
  const config = await getTurnstileConfig();

  // If Turnstile is disabled, skip verification
  if (!config.enabled) {
    return { success: true };
  }

  // If enabled but no secret key configured → fail securely
  const secretKey = await getTurnstileSecretKey();
  if (!secretKey) {
    return { success: false, error: 'Turnstile is enabled but not properly configured.' };
  }

  // If no token provided → fail
  if (!token) {
    return { success: false, error: 'Security verification is required.' };
  }

  // Verify with Cloudflare's official API
  try {
    const res = await fetch('https://challenges.cloudflare.com/turnstile/v0/siteverify', {
      method: 'POST',
      headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
      body: new URLSearchParams({
        secret: secretKey,
        response: token,
      }),
      // Timeout after 5 seconds to prevent hanging
      signal: AbortSignal.timeout(5000),
    });

    const data = await res.json();

    if (data.success === true) {
      return { success: true };
    }

    // Verification failed — do NOT reveal technical details
    return { success: false, error: 'Security verification failed. Please try again.' };
  } catch {
    // Cloudflare API unreachable → fail securely (no bypass)
    return { success: false, error: 'Security verification failed. Please try again.' };
  }
}

import { NextResponse } from 'next/server';
import { getTurnstileConfig } from '@/lib/turnstile';

/**
 * GET /api/turnstile/config
 *
 * Returns the PUBLIC Turnstile configuration:
 * - enabled (boolean)
 * - siteKey (string | null) — safe to expose, this is the PUBLIC site key
 *
 * Does NOT return the secret key. Ever.
 */
export async function GET() {
  const config = await getTurnstileConfig();

  return NextResponse.json({
    enabled: config.enabled,
    siteKey: config.siteKey,
  });
}

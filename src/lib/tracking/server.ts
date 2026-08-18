/**
 * Server-side tracking helpers — Meta Conversions API + Google Measurement Protocol.
 * Used to send server-side events (more reliable than client-side for conversions).
 */

interface ServerTrackingConfig {
  metaConversionsApiToken: string | null;
  googleMeasurementProtocolSecret: string | null;
  metaPixelId: string | null;
  googleAnalyticsId: string | null;
}

interface ServerEvent {
  eventName: string;
  eventId?: string;
  email?: string;
  value?: number;
  currency?: string;
  customData?: Record<string, unknown>;
}

/**
 * Send a server-side event to Meta Conversions API.
 * Requires: metaConversionsApiToken + metaPixelId
 */
export async function sendMetaConversionEvent(
  config: ServerTrackingConfig,
  event: ServerEvent
): Promise<void> {
  if (!config.metaConversionsApiToken || !config.metaPixelId) return;

  try {
    const url = `https://graph.facebook.com/v18.0/${config.metaPixelId}/events`;
    const body = {
      data: [
        {
          event_name: event.eventName,
          event_id: event.eventId,
          event_time: Math.floor(Date.now() / 1000),
          action_source: 'website',
          user_data: event.email
            ? {
                em: [hashEmail(event.email)],
              }
            : {},
          custom_data: event.customData ?? {},
        },
      ],
      access_token: config.metaConversionsApiToken,
    };

    const res = await fetch(url, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(body),
    });

    if (!res.ok) {
      console.error('[Meta CAPI] Failed:', res.status, await res.text());
    }
  } catch (err) {
    console.error('[Meta CAPI] Error:', err);
  }
}

/**
 * Send a server-side event to Google Measurement Protocol.
 * Requires: googleMeasurementProtocolSecret + googleAnalyticsId
 */
export async function sendGoogleMPEvent(
  config: ServerTrackingConfig,
  event: ServerEvent
): Promise<void> {
  if (!config.googleMeasurementProtocolSecret || !config.googleAnalyticsId) return;

  try {
    const clientId = 'admin-portfolio-server';
    const url = `https://www.google-analytics.com/mp/collect?measurement_id=${config.googleAnalyticsId}&api_secret=${config.googleMeasurementProtocolSecret}`;

    const body = {
      client_id: clientId,
      events: [
        {
          name: event.eventName,
          params: {
            ...event.customData,
            ...(event.value ? { value: event.value } : {}),
            ...(event.currency ? { currency: event.currency } : {}),
          },
        },
      ],
    };

    const res = await fetch(url, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(body),
    });

    if (!res.ok) {
      console.error('[Google MP] Failed:', res.status, await res.text());
    }
  } catch (err) {
    console.error('[Google MP] Error:', err);
  }
}

/**
 * Hash an email using SHA-256 for Meta CAPI (PII hashing requirement).
 */
async function hashEmail(email: string): Promise<string> {
  try {
    const encoder = new TextEncoder();
    const data = encoder.encode(email.trim().toLowerCase());
    const hashBuffer = await crypto.subtle.digest('SHA-256', data);
    return Array.from(new Uint8Array(hashBuffer))
      .map((b) => b.toString(16).padStart(2, '0'))
      .join('');
  } catch {
    // Fallback: return as-is (Meta will hash on their end if needed)
    return email;
  }
}

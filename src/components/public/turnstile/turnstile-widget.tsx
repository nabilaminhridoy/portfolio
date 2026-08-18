'use client';

import * as React from 'react';
import Script from 'next/script';

/**
 * TurnstileWidget — renders the Cloudflare Turnstile challenge widget.
 *
 * Props:
 * - siteKey: the PUBLIC site key (safe to expose)
 * - onVerify: callback when verification succeeds (receives the token)
 * - onExpire: callback when the token expires
 * - onError: callback when verification fails
 *
 * The widget automatically adapts to the current theme (light/dark) via
 * Cloudflare's built-in `theme="auto"` parameter.
 *
 * The token is collected via the hidden `cf-turnstile-response` input that
 * Cloudflare injects. We read it via the callback for reliability.
 */
export function TurnstileWidget({
  siteKey,
  onVerify,
  onExpire,
  onError,
}: {
  siteKey: string;
  onVerify: (token: string) => void;
  onExpire?: () => void;
  onError?: () => void;
}) {
  const containerRef = React.useRef<HTMLDivElement>(null);
  const widgetId = React.useRef<string | null>(null);
  const [scriptLoaded, setScriptLoaded] = React.useState(false);

  // Render the widget when the script loads
  React.useEffect(() => {
    if (!scriptLoaded || !containerRef.current || !siteKey) return;
    if (widgetId.current !== null) return; // already rendered

    // Use the global turnstile API to render
    const turnstile = (window as unknown as { turnstile?: { render: (el: HTMLElement, opts: Record<string, unknown>) => string } }).turnstile;
    if (!turnstile) return;

    widgetId.current = turnstile.render(containerRef.current, {
      sitekey: siteKey,
      theme: 'auto', // adapts to light/dark/system
      callback: (token: string) => onVerify(token),
      'expired-callback': () => onExpire?.(),
      'error-callback': () => onError?.(),
    });
  }, [scriptLoaded, siteKey, onVerify, onExpire, onError]);

  // Cleanup on unmount
  React.useEffect(() => {
    return () => {
      const turnstile = (window as unknown as { turnstile?: { remove: (id: string) => void } }).turnstile;
      if (widgetId.current && turnstile) {
        turnstile.remove(widgetId.current);
        widgetId.current = null;
      }
    };
  }, []);

  return (
    <>
      <Script
        id="cf-turnstile-script"
        src="https://challenges.cloudflare.com/turnstile/v0/api.js"
        strategy="afterInteractive"
        onLoad={() => setScriptLoaded(true)}
      />
      <div ref={containerRef} className="cf-turnstile-container min-h-[65px]" />
    </>
  );
}

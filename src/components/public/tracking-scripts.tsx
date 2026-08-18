'use client';

import * as React from 'react';
import Script from 'next/script';

interface TrackingConfig {
  googleAnalyticsId: string | null;
  googleTagManagerId: string | null;
  metaPixelId: string | null;
  googleAdsId: string | null;
  isEnabled: boolean;
}

/**
 * TrackingScripts — conditionally injects GA4, GTM, Meta Pixel, and Google Ads
 * scripts based on TrackingSetting from DB. Only renders if tracking is enabled.
 */
export function TrackingScripts({ config }: { config: TrackingConfig }) {
  if (!config.isEnabled) return null;

  const scripts: React.ReactNode[] = [];

  // Google Analytics 4
  if (config.googleAnalyticsId) {
    scripts.push(
      <Script
        key="ga4"
        src={`https://www.googletagmanager.com/gtag/js?id=${config.googleAnalyticsId}`}
        strategy="afterInteractive"
      />
    );
    scripts.push(
      <Script
        key="ga4-init"
        id="ga4-init"
        strategy="afterInteractive"
        dangerouslySetInnerHTML={{
          __html: `
            window.dataLayer = window.dataLayer || [];
            function gtag(){dataLayer.push(arguments);}
            gtag('js', new Date());
            gtag('config', '${config.googleAnalyticsId}', { send_page_view: true });
            ${config.googleAdsId ? `gtag('config', '${config.googleAdsId}');` : ''}
          `,
        }}
      />
    );
  }

  // Google Tag Manager
  if (config.googleTagManagerId) {
    scripts.push(
      <Script
        key="gtm"
        id="gtm-init"
        strategy="afterInteractive"
        dangerouslySetInnerHTML={{
          __html: `
            (function(w,d,s,l,i){w[l]=w[l]||[];w[l].push({'gtm.start':
            new Date().getTime(),event:'gtm.js'});var f=d.getElementsByTagName(s)[0],
            j=d.createElement(s),dl=l!='dataLayer'?'&l='+l:'';j.async=true;j.src=
            'https://www.googletagmanager.com/gtm.js?id='+i+dl;f.parentNode.insertBefore(j,f);
            })(window,document,'script','dataLayer','${config.googleTagManagerId}');
          `,
        }}
      />
    );
  }

  // Meta Pixel
  if (config.metaPixelId) {
    scripts.push(
      <Script
        key="meta-pixel"
        id="meta-pixel-init"
        strategy="afterInteractive"
        dangerouslySetInnerHTML={{
          __html: `
            !function(f,b,e,v,n,t,s)
            {if(f.fbq)return;n=f.fbq=function(){n.callMethod?
            n.callMethod.apply(n,arguments):n.queue.push(arguments)};
            if(!f._fbq)f._fbq=n;n.push=n;n.loaded=!0;n.version='2.0';
            n.queue=[];t=b.createElement(e);t.async=!0;
            t.src=v;s=b.getElementsByTagName(e)[0];
            s.parentNode.insertBefore(t,s)}(window, document,'script',
            'https://connect.facebook.net/en_US/fbevents.js');
            fbq('init', '${config.metaPixelId}');
            fbq('track', 'PageView');
          `,
        }}
      />
    );
  }

  return <>{scripts}</>;
}

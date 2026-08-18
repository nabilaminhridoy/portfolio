import { NextIntlClientProvider, hasLocale } from 'next-intl';
import { notFound } from 'next/navigation';
import { getMessages, setRequestLocale } from 'next-intl/server';
import { routing, type Locale } from '@/i18n/routing';

import { db } from '@/lib/db';
import { Navbar } from '@/components/public/navbar';
import { Footer } from '@/components/public/footer';
import { TrackingScripts } from '@/components/public/tracking-scripts';
import { PageViewTracker } from '@/components/public/page-view-tracker';
import { GlobalBackground } from '@/components/public/global-background';

export function generateStaticParams() {
  return routing.locales.map((locale) => ({ locale }));
}

export default async function LocaleLayout({
  children,
  params,
}: {
  children: React.ReactNode;
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;

  if (!hasLocale(routing.locales, locale)) {
    notFound();
  }

  setRequestLocale(locale);

  const messages = await getMessages();

  // Fetch tracking settings for script injection (only on public pages)
  let trackingConfig = {
    googleAnalyticsId: null as string | null,
    googleTagManagerId: null as string | null,
    metaPixelId: null as string | null,
    googleAdsId: null as string | null,
    isEnabled: false,
  };

  try {
    const tracking = await db.trackingSetting.findUnique({ where: { id: 'global' } });
    if (tracking) {
      trackingConfig = {
        googleAnalyticsId: tracking.googleAnalyticsId,
        googleTagManagerId: tracking.googleTagManagerId,
        metaPixelId: tracking.metaPixelId,
        googleAdsId: tracking.googleAdsId,
        isEnabled: tracking.isEnabled,
      };
    }
  } catch {
    // DB might not be ready — skip tracking
  }

  return (
    <NextIntlClientProvider locale={locale} messages={messages}>
      {/* Global background motion — fixed, behind all content */}
      <GlobalBackground />

      <div lang={locale} className="relative flex min-h-screen flex-col" style={{ fontFamily: locale === 'bn' ? 'var(--font-bengali), var(--font-sans), sans-serif' : undefined }}>
        <Navbar />
        <main className="flex-1">{children}</main>
        <Footer />
      </div>
      <TrackingScripts config={trackingConfig} />
      <PageViewTracker />
    </NextIntlClientProvider>
  );
}

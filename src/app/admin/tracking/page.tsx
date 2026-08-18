import { db } from '@/lib/db';
import { TrackingForm } from './_components/tracking-form';

export const metadata = {
  title: 'Tracking',
};

export const dynamic = 'force-dynamic';

export default async function TrackingPage() {
  const tracking = await db.trackingSetting.findUnique({ where: { id: 'global' } });

  return (
    <TrackingForm
      initial={
        tracking
          ? {
              googleAnalyticsId: tracking.googleAnalyticsId ?? '',
              googleTagManagerId: tracking.googleTagManagerId ?? '',
              metaPixelId: tracking.metaPixelId ?? '',
              googleAdsId: tracking.googleAdsId ?? '',
              metaConversionsApiToken: tracking.metaConversionsApiToken ?? '',
              googleMeasurementProtocolSecret:
                tracking.googleMeasurementProtocolSecret ?? '',
              isEnabled: tracking.isEnabled,
            }
          : undefined
      }
    />
  );
}

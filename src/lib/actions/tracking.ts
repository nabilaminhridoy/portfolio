'use server';

import { revalidatePath } from 'next/cache';
import { db } from '@/lib/db';
import { requireAdmin } from '@/lib/session';
import { logActivity } from '@/lib/activity';

interface ActionResult {
  ok: boolean;
  error?: string;
}

export async function updateTrackingSettings(formData: FormData): Promise<ActionResult> {
  const user = await requireAdmin().catch(() => {
    throw new Error('UNAUTHORIZED');
  });

  const googleAnalyticsId = (formData.get('googleAnalyticsId') as string | null)?.trim() ?? null;
  const googleTagManagerId = (formData.get('googleTagManagerId') as string | null)?.trim() ?? null;
  const metaPixelId = (formData.get('metaPixelId') as string | null)?.trim() ?? null;
  const googleAdsId = (formData.get('googleAdsId') as string | null)?.trim() ?? null;
  const metaConversionsApiToken =
    (formData.get('metaConversionsApiToken') as string | null)?.trim() ?? null;
  const googleMeasurementProtocolSecret =
    (formData.get('googleMeasurementProtocolSecret') as string | null)?.trim() ?? null;
  const isEnabled = formData.get('isEnabled') === 'on';

  await db.trackingSetting.upsert({
    where: { id: 'global' },
    update: {
      googleAnalyticsId,
      googleTagManagerId,
      metaPixelId,
      googleAdsId,
      metaConversionsApiToken,
      googleMeasurementProtocolSecret,
      isEnabled,
    },
    create: {
      id: 'global',
      googleAnalyticsId,
      googleTagManagerId,
      metaPixelId,
      googleAdsId,
      metaConversionsApiToken,
      googleMeasurementProtocolSecret,
      isEnabled,
    },
  });

  await logActivity({
    userId: user.id,
    action: 'UPDATE_SETTINGS',
    entity: 'TrackingSetting',
    entityId: 'global',
    metadata: {
      googleAnalyticsId: googleAnalyticsId ? 'set' : 'cleared',
      googleTagManagerId: googleTagManagerId ? 'set' : 'cleared',
      metaPixelId: metaPixelId ? 'set' : 'cleared',
      isEnabled,
    },
  });

  revalidatePath('/admin/tracking');
  revalidatePath('/en');
  revalidatePath('/bn');

  return { ok: true };
}

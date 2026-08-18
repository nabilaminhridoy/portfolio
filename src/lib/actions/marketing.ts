'use server';

import { revalidatePath } from 'next/cache';
import { db } from '@/lib/db';
import { requireAdmin } from '@/lib/session';
import { logActivity } from '@/lib/activity';

interface ActionResult {
  ok: boolean;
  error?: string;
}

export async function updateMarketingSettings(formData: FormData): Promise<ActionResult> {
  const user = await requireAdmin().catch(() => {
    throw new Error('UNAUTHORIZED');
  });

  const bannerTitleEn = (formData.get('bannerTitleEn') as string | null)?.trim() ?? null;
  const bannerTitleBn = (formData.get('bannerTitleBn') as string | null)?.trim() ?? null;
  const bannerTextEn = (formData.get('bannerTextEn') as string | null)?.trim() ?? null;
  const bannerTextBn = (formData.get('bannerTextBn') as string | null)?.trim() ?? null;
  const bannerCtaLabelEn =
    (formData.get('bannerCtaLabelEn') as string | null)?.trim() ?? null;
  const bannerCtaLabelBn =
    (formData.get('bannerCtaLabelBn') as string | null)?.trim() ?? null;
  const bannerCtaUrl = (formData.get('bannerCtaUrl') as string | null)?.trim() ?? null;
  const isBannerActive = formData.get('isBannerActive') === 'on';

  await db.marketingSetting.upsert({
    where: { id: 'global' },
    update: {
      bannerTitleEn,
      bannerTitleBn,
      bannerTextEn,
      bannerTextBn,
      bannerCtaLabelEn,
      bannerCtaLabelBn,
      bannerCtaUrl,
      isBannerActive,
    },
    create: {
      id: 'global',
      bannerTitleEn,
      bannerTitleBn,
      bannerTextEn,
      bannerTextBn,
      bannerCtaLabelEn,
      bannerCtaLabelBn,
      bannerCtaUrl,
      isBannerActive,
    },
  });

  await logActivity({
    userId: user.id,
    action: 'UPDATE_SETTINGS',
    entity: 'MarketingSetting',
    entityId: 'global',
    metadata: {
      bannerTitleEn: bannerTitleEn ? 'set' : 'cleared',
      isBannerActive,
    },
  });

  revalidatePath('/admin/marketing');
  revalidatePath('/en');
  revalidatePath('/bn');

  return { ok: true };
}

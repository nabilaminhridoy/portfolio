'use server';

import { revalidatePath } from 'next/cache';
import { db } from '@/lib/db';
import { requireAdmin } from '@/lib/session';
import { logActivity } from '@/lib/activity';

interface ActionResult {
  ok: boolean;
  error?: string;
}

export async function updateSeoSettings(formData: FormData): Promise<ActionResult> {
  const user = await requireAdmin().catch(() => {
    throw new Error('UNAUTHORIZED');
  });

  const siteName = (formData.get('siteName') as string | null)?.trim() ?? null;
  const metaTitleEn = (formData.get('metaTitleEn') as string | null)?.trim() ?? null;
  const metaTitleBn = (formData.get('metaTitleBn') as string | null)?.trim() ?? null;
  const metaDescriptionEn = (formData.get('metaDescriptionEn') as string | null)?.trim() ?? null;
  const metaDescriptionBn = (formData.get('metaDescriptionBn') as string | null)?.trim() ?? null;
  const ogTitleEn = (formData.get('ogTitleEn') as string | null)?.trim() ?? null;
  const ogTitleBn = (formData.get('ogTitleBn') as string | null)?.trim() ?? null;
  const ogDescriptionEn = (formData.get('ogDescriptionEn') as string | null)?.trim() ?? null;
  const ogDescriptionBn = (formData.get('ogDescriptionBn') as string | null)?.trim() ?? null;
  const ogImageUrl = (formData.get('ogImageUrl') as string | null)?.trim() ?? null;
  const twitterCard = (formData.get('twitterCard') as string | null)?.trim() ?? 'summary_large_image';
  const twitterSite = (formData.get('twitterSite') as string | null)?.trim() ?? null;
  const twitterCreator = (formData.get('twitterCreator') as string | null)?.trim() ?? null;
  const canonicalUrl = (formData.get('canonicalUrl') as string | null)?.trim() ?? null;
  const robotsTxt = (formData.get('robotsTxt') as string | null)?.trim() ?? null;

  await db.seoSetting.upsert({
    where: { id: 'global' },
    update: {
      siteName, metaTitleEn, metaTitleBn, metaDescriptionEn, metaDescriptionBn,
      ogTitleEn, ogTitleBn, ogDescriptionEn, ogDescriptionBn, ogImageUrl,
      twitterCard, twitterSite, twitterCreator, canonicalUrl, robotsTxt,
    },
    create: {
      id: 'global',
      siteName, metaTitleEn, metaTitleBn, metaDescriptionEn, metaDescriptionBn,
      ogTitleEn, ogTitleBn, ogDescriptionEn, ogDescriptionBn, ogImageUrl,
      twitterCard, twitterSite, twitterCreator, canonicalUrl, robotsTxt,
    },
  });

  await logActivity({
    userId: user.id,
    action: 'UPDATE_SETTINGS',
    entity: 'SeoSetting',
    entityId: 'global',
    metadata: { siteName },
  });

  revalidatePath('/admin/seo');
  revalidatePath('/en');
  revalidatePath('/bn');
  revalidatePath('/sitemap.xml');
  revalidatePath('/robots.txt');

  return { ok: true };
}

export async function updateGoogleVerification(formData: FormData): Promise<ActionResult> {
  const user = await requireAdmin().catch(() => {
    throw new Error('UNAUTHORIZED');
  });

  const googleVerification = (formData.get('googleVerification') as string | null)?.trim() ?? null;

  await db.seoSetting.upsert({
    where: { id: 'global' },
    update: { googleVerification },
    create: { id: 'global', googleVerification },
  });

  await logActivity({
    userId: user.id,
    action: 'UPDATE_SETTINGS',
    entity: 'SeoSetting',
    entityId: 'global',
    metadata: { googleVerification: googleVerification ? 'set' : 'cleared' },
  });

  revalidatePath('/admin/seo/google');
  revalidatePath('/en');
  revalidatePath('/bn');

  return { ok: true };
}

export async function updateBingVerification(formData: FormData): Promise<ActionResult> {
  const user = await requireAdmin().catch(() => {
    throw new Error('UNAUTHORIZED');
  });

  const bingVerification = (formData.get('bingVerification') as string | null)?.trim() ?? null;

  await db.seoSetting.upsert({
    where: { id: 'global' },
    update: { bingVerification },
    create: { id: 'global', bingVerification },
  });

  await logActivity({
    userId: user.id,
    action: 'UPDATE_SETTINGS',
    entity: 'SeoSetting',
    entityId: 'global',
    metadata: { bingVerification: bingVerification ? 'set' : 'cleared' },
  });

  revalidatePath('/admin/seo/bing');
  revalidatePath('/en');
  revalidatePath('/bn');

  return { ok: true };
}

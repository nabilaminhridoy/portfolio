'use server';

import { revalidatePath } from 'next/cache';
import { db } from '@/lib/db';
import { requireAdmin } from '@/lib/session';
import { logActivity } from '@/lib/activity';

interface ActionResult {
  ok: boolean;
  error?: string;
}

const VALID_PLATFORMS = [
  'website',
  'facebook',
  'instagram',
  'whatsapp',
  'linkedin',
  'x',
  'github',
  'discord',
];

export async function upsertSocialLink(formData: FormData): Promise<ActionResult> {
  const user = await requireAdmin().catch(() => {
    throw new Error('UNAUTHORIZED');
  });

  const id = (formData.get('id') as string | null)?.trim() ?? '';
  const platform = (formData.get('platform') as string | null)?.trim() ?? '';
  const label = (formData.get('label') as string | null)?.trim() ?? null;
  const url = (formData.get('url') as string | null)?.trim() ?? '';
  const iconUrl = (formData.get('iconUrl') as string | null)?.trim() ?? null;
  const isActive = formData.get('isActive') === 'on';
  const orderStr = (formData.get('order') as string | null) ?? '0';

  if (!platform || !VALID_PLATFORMS.includes(platform)) {
    return { ok: false, error: 'Valid platform is required.' };
  }
  if (!url) {
    return { ok: false, error: 'URL is required.' };
  }

  const order = parseInt(orderStr, 10) || 0;

  let record;
  if (id) {
    record = await db.socialLink.update({
      where: { id },
      data: { platform, label: label || null, url, iconUrl: iconUrl || null, isActive, order },
    });
  } else {
    const existing = await db.socialLink.findUnique({ where: { platform } });
    if (existing) {
      return { ok: false, error: `A link for ${platform} already exists. Edit it instead.` };
    }
    record = await db.socialLink.create({
      data: { platform, label: label || null, url, iconUrl: iconUrl || null, isActive, order },
    });
  }

  await logActivity({
    userId: user.id,
    action: id ? 'UPDATE_SOCIAL' : 'CREATE_SOCIAL',
    entity: 'SocialLink',
    entityId: record.id,
    metadata: { platform, url },
  });

  revalidatePath('/admin/social-links');
  return { ok: true };
}

export async function deleteSocialLink(id: string): Promise<ActionResult> {
  const user = await requireAdmin().catch(() => {
    throw new Error('UNAUTHORIZED');
  });

  const link = await db.socialLink.findUnique({ where: { id } });
  if (!link) {
    return { ok: false, error: 'Social link not found.' };
  }

  await db.socialLink.delete({ where: { id } });

  await logActivity({
    userId: user.id,
    action: 'DELETE_SOCIAL',
    entity: 'SocialLink',
    entityId: id,
    metadata: { platform: link.platform },
  });

  revalidatePath('/admin/social-links');
  return { ok: true };
}

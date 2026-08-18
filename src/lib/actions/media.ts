'use server';

import { revalidatePath } from 'next/cache';
import { db } from '@/lib/db';
import { requireAdmin } from '@/lib/session';
import { logActivity } from '@/lib/activity';

interface ActionResult {
  ok: boolean;
  error?: string;
}

export async function uploadMedia(formData: FormData): Promise<ActionResult> {
  const user = await requireAdmin().catch(() => {
    throw new Error('UNAUTHORIZED');
  });

  const url = (formData.get('url') as string | null)?.trim() ?? '';
  const filename = (formData.get('filename') as string | null)?.trim() ?? '';
  const mimeType = (formData.get('mimeType') as string | null)?.trim() ?? '';
  const sizeStr = (formData.get('size') as string | null) ?? '0';
  const altEn = (formData.get('altEn') as string | null)?.trim() ?? null;
  const altBn = (formData.get('altBn') as string | null)?.trim() ?? null;
  const folder = (formData.get('folder') as string | null)?.trim() ?? 'root';

  if (!url || !filename) {
    return { ok: false, error: 'URL and filename are required.' };
  }

  const size = parseInt(sizeStr, 10) || 0;

  const media = await db.media.create({
    data: {
      url, filename,
      mimeType: mimeType || 'application/octet-stream',
      size,
      altEn: altEn || null,
      altBn: altBn || null,
      folder: folder || 'root',
    },
  });

  await logActivity({
    userId: user.id,
    action: 'CREATE_MEDIA',
    entity: 'Media',
    entityId: media.id,
    metadata: { filename, mimeType, folder },
  });

  revalidatePath('/admin/media');
  return { ok: true };
}

export async function updateMedia(id: string, formData: FormData): Promise<ActionResult> {
  const user = await requireAdmin().catch(() => {
    throw new Error('UNAUTHORIZED');
  });

  const existing = await db.media.findUnique({ where: { id } });
  if (!existing) {
    return { ok: false, error: 'Media not found.' };
  }

  const altEn = (formData.get('altEn') as string | null)?.trim() ?? null;
  const altBn = (formData.get('altBn') as string | null)?.trim() ?? null;
  const folder = (formData.get('folder') as string | null)?.trim() ?? 'root';

  const updated = await db.media.update({
    where: { id },
    data: {
      altEn: altEn || null,
      altBn: altBn || null,
      folder: folder || 'root',
    },
  });

  await logActivity({
    userId: user.id,
    action: 'UPDATE_MEDIA',
    entity: 'Media',
    entityId: updated.id,
  });

  revalidatePath('/admin/media');
  return { ok: true };
}

export async function deleteMedia(id: string): Promise<ActionResult> {
  const user = await requireAdmin().catch(() => {
    throw new Error('UNAUTHORIZED');
  });

  const media = await db.media.findUnique({ where: { id } });
  if (!media) {
    return { ok: false, error: 'Media not found.' };
  }

  await db.media.delete({ where: { id } });

  await logActivity({
    userId: user.id,
    action: 'DELETE_MEDIA',
    entity: 'Media',
    entityId: id,
    metadata: { filename: media.filename },
  });

  revalidatePath('/admin/media');
  return { ok: true };
}

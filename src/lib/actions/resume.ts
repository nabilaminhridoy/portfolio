'use server';

import { revalidatePath } from 'next/cache';
import { db } from '@/lib/db';
import { requireAdmin } from '@/lib/session';
import { logActivity } from '@/lib/activity';

interface ActionResult {
  ok: boolean;
  error?: string;
}

export async function updateResume(formData: FormData): Promise<ActionResult> {
  const user = await requireAdmin().catch(() => {
    throw new Error('UNAUTHORIZED');
  });

  const fileUrl = (formData.get('fileUrl') as string | null)?.trim() ?? '';
  const version = (formData.get('version') as string | null)?.trim() ?? 'v1';
  const summaryEn = (formData.get('summaryEn') as string | null)?.trim() ?? null;
  const summaryBn = (formData.get('summaryBn') as string | null)?.trim() ?? null;
  const isActive = formData.get('isActive') === 'on';
  const resumeId = (formData.get('resumeId') as string | null)?.trim() ?? null;

  if (!fileUrl) {
    return { ok: false, error: 'File URL is required.' };
  }

  let record;
  if (resumeId) {
    record = await db.resume.update({
      where: { id: resumeId },
      data: {
        fileUrl, version,
        summaryEn: summaryEn || null,
        summaryBn: summaryBn || null,
        isActive,
      },
    });
  } else {
    // Create new resume — if marked active, deactivate others first
    if (isActive) {
      await db.resume.updateMany({
        where: { isActive: true },
        data: { isActive: false },
      });
    }
    record = await db.resume.create({
      data: {
        fileUrl, version,
        summaryEn: summaryEn || null,
        summaryBn: summaryBn || null,
        isActive,
      },
    });
  }

  await logActivity({
    userId: user.id,
    action: 'UPDATE_RESUME',
    entity: 'Resume',
    entityId: record.id,
    metadata: { version, isActive, fileUrl },
  });

  revalidatePath('/admin/resume');

  return { ok: true };
}

export async function setActiveResume(id: string): Promise<ActionResult> {
  const user = await requireAdmin().catch(() => {
    throw new Error('UNAUTHORIZED');
  });

  const existing = await db.resume.findUnique({ where: { id } });
  if (!existing) {
    return { ok: false, error: 'Resume version not found.' };
  }

  // Deactivate all others, then activate the selected one
  await db.$transaction([
    db.resume.updateMany({
      where: { isActive: true },
      data: { isActive: false },
    }),
    db.resume.update({
      where: { id },
      data: { isActive: true },
    }),
  ]);

  await logActivity({
    userId: user.id,
    action: 'UPDATE_RESUME',
    entity: 'Resume',
    entityId: id,
    metadata: { action: 'set_active', version: existing.version },
  });

  revalidatePath('/admin/resume');
  return { ok: true };
}

export async function deleteResume(id: string): Promise<ActionResult> {
  const user = await requireAdmin().catch(() => {
    throw new Error('UNAUTHORIZED');
  });

  const resume = await db.resume.findUnique({ where: { id } });
  if (!resume) {
    return { ok: false, error: 'Resume not found.' };
  }

  await db.resume.delete({ where: { id } });

  await logActivity({
    userId: user.id,
    action: 'DELETE_RESUME',
    entity: 'Resume',
    entityId: id,
    metadata: { version: resume.version },
  });

  revalidatePath('/admin/resume');
  return { ok: true };
}

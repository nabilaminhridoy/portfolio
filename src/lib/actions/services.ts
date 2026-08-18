'use server';

import { revalidatePath } from 'next/cache';
import { db } from '@/lib/db';
import { requireAdmin } from '@/lib/session';
import { logActivity } from '@/lib/activity';

interface ActionResult {
  ok: boolean;
  error?: string;
  data?: { id: string };
}

export async function createService(formData: FormData): Promise<ActionResult> {
  const user = await requireAdmin().catch(() => {
    throw new Error('UNAUTHORIZED');
  });

  const titleEn = (formData.get('titleEn') as string | null)?.trim() ?? '';
  const titleBn = (formData.get('titleBn') as string | null)?.trim() ?? '';
  const descriptionEn = (formData.get('descriptionEn') as string | null)?.trim() ?? '';
  const descriptionBn = (formData.get('descriptionBn') as string | null)?.trim() ?? '';
  const icon = (formData.get('icon') as string | null)?.trim() ?? '';
  const featuresEn = (formData.get('featuresEn') as string | null)?.trim() ?? '';
  const featuresBn = (formData.get('featuresBn') as string | null)?.trim() ?? '';
  const status = (formData.get('status') as string | null) ?? 'ACTIVE';
  const orderStr = (formData.get('order') as string | null) ?? '0';

  if (!titleEn || !titleBn || !descriptionEn || !descriptionBn) {
    return { ok: false, error: 'Title (EN/BN) and description (EN/BN) are required.' };
  }

  const order = parseInt(orderStr, 10) || 0;

  const service = await db.service.create({
    data: {
      titleEn,
      titleBn,
      descriptionEn,
      descriptionBn,
      icon: icon || 'Sparkles',
      featuresEn: featuresEn || '',
      featuresBn: featuresBn || '',
      status,
      order,
    },
  });

  await logActivity({
    userId: user.id,
    action: 'CREATE_SERVICE',
    entity: 'Service',
    entityId: service.id,
    metadata: { titleEn, titleBn, icon },
  });

  revalidatePath('/admin/services');

  return { ok: true, data: { id: service.id } };
}

export async function updateService(id: string, formData: FormData): Promise<ActionResult> {
  const user = await requireAdmin().catch(() => {
    throw new Error('UNAUTHORIZED');
  });

  const existing = await db.service.findUnique({ where: { id } });
  if (!existing) {
    return { ok: false, error: 'Service not found.' };
  }

  const titleEn = (formData.get('titleEn') as string | null)?.trim() ?? '';
  const titleBn = (formData.get('titleBn') as string | null)?.trim() ?? '';
  const descriptionEn = (formData.get('descriptionEn') as string | null)?.trim() ?? '';
  const descriptionBn = (formData.get('descriptionBn') as string | null)?.trim() ?? '';
  const icon = (formData.get('icon') as string | null)?.trim() ?? '';
  const featuresEn = (formData.get('featuresEn') as string | null)?.trim() ?? '';
  const featuresBn = (formData.get('featuresBn') as string | null)?.trim() ?? '';
  const status = (formData.get('status') as string | null) ?? 'ACTIVE';
  const orderStr = (formData.get('order') as string | null) ?? '0';

  if (!titleEn || !titleBn || !descriptionEn || !descriptionBn) {
    return { ok: false, error: 'Title (EN/BN) and description (EN/BN) are required.' };
  }

  const order = parseInt(orderStr, 10) || 0;

  const updated = await db.service.update({
    where: { id },
    data: {
      titleEn,
      titleBn,
      descriptionEn,
      descriptionBn,
      icon: icon || 'Sparkles',
      featuresEn: featuresEn || '',
      featuresBn: featuresBn || '',
      status,
      order,
    },
  });

  await logActivity({
    userId: user.id,
    action: 'UPDATE_SERVICE',
    entity: 'Service',
    entityId: updated.id,
    metadata: { titleEn, titleBn, icon },
  });

  revalidatePath('/admin/services');

  return { ok: true, data: { id: updated.id } };
}

export async function deleteService(id: string): Promise<ActionResult> {
  const user = await requireAdmin().catch(() => {
    throw new Error('UNAUTHORIZED');
  });

  const service = await db.service.findUnique({ where: { id } });
  if (!service) {
    return { ok: false, error: 'Service not found.' };
  }

  await db.service.delete({ where: { id } });

  await logActivity({
    userId: user.id,
    action: 'DELETE_SERVICE',
    entity: 'Service',
    entityId: id,
    metadata: { titleEn: service.titleEn, titleBn: service.titleBn, icon: service.icon },
  });

  revalidatePath('/admin/services');

  return { ok: true };
}

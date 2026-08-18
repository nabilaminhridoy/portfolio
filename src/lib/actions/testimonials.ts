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

export async function createTestimonial(formData: FormData): Promise<ActionResult> {
  const user = await requireAdmin().catch(() => {
    throw new Error('UNAUTHORIZED');
  });

  const authorName = (formData.get('authorName') as string | null)?.trim() ?? '';
  const authorRoleEn = (formData.get('authorRoleEn') as string | null)?.trim() ?? null;
  const authorRoleBn = (formData.get('authorRoleBn') as string | null)?.trim() ?? null;
  const companyEn = (formData.get('companyEn') as string | null)?.trim() ?? null;
  const companyBn = (formData.get('companyBn') as string | null)?.trim() ?? null;
  const avatarUrl = (formData.get('avatarUrl') as string | null)?.trim() ?? null;
  const contentEn = (formData.get('contentEn') as string | null)?.trim() ?? '';
  const contentBn = (formData.get('contentBn') as string | null)?.trim() ?? '';
  const ratingStr = (formData.get('rating') as string | null) ?? '5';
  const status = (formData.get('status') as string | null) ?? 'ACTIVE';
  const orderStr = (formData.get('order') as string | null) ?? '0';

  if (!authorName || !contentEn || !contentBn) {
    return { ok: false, error: 'Author name and content (EN + BN) are required.' };
  }

  const rating = Math.min(5, Math.max(1, parseInt(ratingStr, 10) || 5));
  const normalizedStatus = status === 'DRAFT' ? 'DRAFT' : 'ACTIVE';
  const order = parseInt(orderStr, 10) || 0;

  const testimonial = await db.testimonial.create({
    data: {
      authorName,
      authorRoleEn: authorRoleEn || null,
      authorRoleBn: authorRoleBn || null,
      companyEn: companyEn || null,
      companyBn: companyBn || null,
      avatarUrl: avatarUrl || null,
      contentEn,
      contentBn,
      rating,
      status: normalizedStatus,
      order,
    },
  });

  await logActivity({
    userId: user.id,
    action: 'CREATE_TESTIMONIAL',
    entity: 'Testimonial',
    entityId: testimonial.id,
    metadata: { authorName, rating, status: normalizedStatus },
  });

  revalidatePath('/admin/testimonials');

  return { ok: true, data: { id: testimonial.id } };
}

export async function updateTestimonial(id: string, formData: FormData): Promise<ActionResult> {
  const user = await requireAdmin().catch(() => {
    throw new Error('UNAUTHORIZED');
  });

  const existing = await db.testimonial.findUnique({ where: { id } });
  if (!existing) {
    return { ok: false, error: 'Testimonial not found.' };
  }

  const authorName = (formData.get('authorName') as string | null)?.trim() ?? '';
  const authorRoleEn = (formData.get('authorRoleEn') as string | null)?.trim() ?? null;
  const authorRoleBn = (formData.get('authorRoleBn') as string | null)?.trim() ?? null;
  const companyEn = (formData.get('companyEn') as string | null)?.trim() ?? null;
  const companyBn = (formData.get('companyBn') as string | null)?.trim() ?? null;
  const avatarUrl = (formData.get('avatarUrl') as string | null)?.trim() ?? null;
  const contentEn = (formData.get('contentEn') as string | null)?.trim() ?? '';
  const contentBn = (formData.get('contentBn') as string | null)?.trim() ?? '';
  const ratingStr = (formData.get('rating') as string | null) ?? '5';
  const status = (formData.get('status') as string | null) ?? 'ACTIVE';
  const orderStr = (formData.get('order') as string | null) ?? '0';

  if (!authorName || !contentEn || !contentBn) {
    return { ok: false, error: 'Author name and content (EN + BN) are required.' };
  }

  const rating = Math.min(5, Math.max(1, parseInt(ratingStr, 10) || 5));
  const normalizedStatus = status === 'DRAFT' ? 'DRAFT' : 'ACTIVE';
  const order = parseInt(orderStr, 10) || 0;

  const updated = await db.testimonial.update({
    where: { id },
    data: {
      authorName,
      authorRoleEn: authorRoleEn || null,
      authorRoleBn: authorRoleBn || null,
      companyEn: companyEn || null,
      companyBn: companyBn || null,
      avatarUrl: avatarUrl || null,
      contentEn,
      contentBn,
      rating,
      status: normalizedStatus,
      order,
    },
  });

  await logActivity({
    userId: user.id,
    action: 'UPDATE_TESTIMONIAL',
    entity: 'Testimonial',
    entityId: updated.id,
    metadata: { authorName, rating, status: normalizedStatus },
  });

  revalidatePath('/admin/testimonials');

  return { ok: true, data: { id: updated.id } };
}

export async function deleteTestimonial(id: string): Promise<ActionResult> {
  const user = await requireAdmin().catch(() => {
    throw new Error('UNAUTHORIZED');
  });

  const testimonial = await db.testimonial.findUnique({ where: { id } });
  if (!testimonial) {
    return { ok: false, error: 'Testimonial not found.' };
  }

  await db.testimonial.delete({ where: { id } });

  await logActivity({
    userId: user.id,
    action: 'DELETE_TESTIMONIAL',
    entity: 'Testimonial',
    entityId: id,
    metadata: { authorName: testimonial.authorName, rating: testimonial.rating },
  });

  revalidatePath('/admin/testimonials');

  return { ok: true };
}

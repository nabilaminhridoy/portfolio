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

function parseDate(value: string | null | undefined): Date | null {
  if (!value) return null;
  // Accept yyyy-mm-dd or full ISO
  const d = new Date(value);
  if (isNaN(d.getTime())) return null;
  return d;
}

export async function createCertification(formData: FormData): Promise<ActionResult> {
  const user = await requireAdmin().catch(() => {
    throw new Error('UNAUTHORIZED');
  });

  const titleEn = (formData.get('titleEn') as string | null)?.trim() ?? '';
  const titleBn = (formData.get('titleBn') as string | null)?.trim() ?? '';
  const organization = (formData.get('organization') as string | null)?.trim() ?? '';
  const credentialId = (formData.get('credentialId') as string | null)?.trim() ?? null;
  const credentialUrl = (formData.get('credentialUrl') as string | null)?.trim() ?? null;
  const issueDateStr = (formData.get('issueDate') as string | null)?.trim() ?? '';
  const expiryDateStr = (formData.get('expiryDate') as string | null)?.trim() ?? null;
  const certificateImageUrl = (formData.get('certificateImageUrl') as string | null)?.trim() ?? null;
  const descriptionEn = (formData.get('descriptionEn') as string | null)?.trim() ?? null;
  const descriptionBn = (formData.get('descriptionBn') as string | null)?.trim() ?? null;
  const skills = (formData.get('skills') as string | null)?.trim() ?? '';
  const isFeatured = formData.get('isFeatured') === 'on';
  const status = (formData.get('status') as string | null) ?? 'ACTIVE';
  const orderStr = (formData.get('order') as string | null) ?? '0';

  if (!titleEn || !titleBn || !organization || !issueDateStr) {
    return { ok: false, error: 'Title (EN + BN), organization, and issue date are required.' };
  }

  const issueDate = parseDate(issueDateStr);
  if (!issueDate) {
    return { ok: false, error: 'Invalid issue date.' };
  }
  const expiryDate = expiryDateStr ? parseDate(expiryDateStr) : null;

  const order = parseInt(orderStr, 10) || 0;

  const cert = await db.certification.create({
    data: {
      titleEn, titleBn, organization,
      credentialId: credentialId || null,
      credentialUrl: credentialUrl || null,
      issueDate,
      expiryDate: expiryDate,
      certificateImageUrl: certificateImageUrl || null,
      descriptionEn: descriptionEn || null,
      descriptionBn: descriptionBn || null,
      skills,
      isFeatured,
      status,
      order,
    },
  });

  await logActivity({
    userId: user.id,
    action: 'CREATE_CERTIFICATION',
    entity: 'Certification',
    entityId: cert.id,
    metadata: { titleEn, organization },
  });

  revalidatePath('/admin/certifications');

  return { ok: true, data: { id: cert.id } };
}

export async function updateCertification(id: string, formData: FormData): Promise<ActionResult> {
  const user = await requireAdmin().catch(() => {
    throw new Error('UNAUTHORIZED');
  });

  const existing = await db.certification.findUnique({ where: { id } });
  if (!existing) {
    return { ok: false, error: 'Certification not found.' };
  }

  const titleEn = (formData.get('titleEn') as string | null)?.trim() ?? '';
  const titleBn = (formData.get('titleBn') as string | null)?.trim() ?? '';
  const organization = (formData.get('organization') as string | null)?.trim() ?? '';
  const credentialId = (formData.get('credentialId') as string | null)?.trim() ?? null;
  const credentialUrl = (formData.get('credentialUrl') as string | null)?.trim() ?? null;
  const issueDateStr = (formData.get('issueDate') as string | null)?.trim() ?? '';
  const expiryDateStr = (formData.get('expiryDate') as string | null)?.trim() ?? null;
  const certificateImageUrl = (formData.get('certificateImageUrl') as string | null)?.trim() ?? null;
  const descriptionEn = (formData.get('descriptionEn') as string | null)?.trim() ?? null;
  const descriptionBn = (formData.get('descriptionBn') as string | null)?.trim() ?? null;
  const skills = (formData.get('skills') as string | null)?.trim() ?? '';
  const isFeatured = formData.get('isFeatured') === 'on';
  const status = (formData.get('status') as string | null) ?? 'ACTIVE';
  const orderStr = (formData.get('order') as string | null) ?? '0';

  if (!titleEn || !titleBn || !organization || !issueDateStr) {
    return { ok: false, error: 'Title (EN + BN), organization, and issue date are required.' };
  }

  const issueDate = parseDate(issueDateStr);
  if (!issueDate) {
    return { ok: false, error: 'Invalid issue date.' };
  }
  const expiryDate = expiryDateStr ? parseDate(expiryDateStr) : null;

  const order = parseInt(orderStr, 10) || 0;

  const updated = await db.certification.update({
    where: { id },
    data: {
      titleEn, titleBn, organization,
      credentialId: credentialId || null,
      credentialUrl: credentialUrl || null,
      issueDate,
      expiryDate: expiryDate,
      certificateImageUrl: certificateImageUrl || null,
      descriptionEn: descriptionEn || null,
      descriptionBn: descriptionBn || null,
      skills,
      isFeatured,
      status,
      order,
    },
  });

  await logActivity({
    userId: user.id,
    action: 'UPDATE_CERTIFICATION',
    entity: 'Certification',
    entityId: updated.id,
    metadata: { titleEn, organization },
  });

  revalidatePath('/admin/certifications');

  return { ok: true, data: { id: updated.id } };
}

export async function deleteCertification(id: string): Promise<ActionResult> {
  const user = await requireAdmin().catch(() => {
    throw new Error('UNAUTHORIZED');
  });

  const cert = await db.certification.findUnique({ where: { id } });
  if (!cert) {
    return { ok: false, error: 'Certification not found.' };
  }

  await db.certification.delete({ where: { id } });

  await logActivity({
    userId: user.id,
    action: 'DELETE_CERTIFICATION',
    entity: 'Certification',
    entityId: id,
    metadata: { titleEn: cert.titleEn, organization: cert.organization },
  });

  revalidatePath('/admin/certifications');

  return { ok: true };
}

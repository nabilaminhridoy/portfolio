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

function toDate(value: string | null | undefined): Date | null {
  if (!value) return null;
  const trimmed = value.trim();
  if (!trimmed) return null;
  // Accept full ISO strings or yyyy-mm-dd strings by appending T00:00:00.
  const iso = trimmed.length === 10 ? `${trimmed}T00:00:00.000Z` : trimmed;
  const parsed = new Date(iso);
  return Number.isNaN(parsed.getTime()) ? null : parsed;
}

export async function createEducation(formData: FormData): Promise<ActionResult> {
  const user = await requireAdmin().catch(() => {
    throw new Error('UNAUTHORIZED');
  });

  const institutionEn = (formData.get('institutionEn') as string | null)?.trim() ?? '';
  const institutionBn = (formData.get('institutionBn') as string | null)?.trim() ?? '';
  const degreeEn = (formData.get('degreeEn') as string | null)?.trim() ?? '';
  const degreeBn = (formData.get('degreeBn') as string | null)?.trim() ?? '';
  const fieldEn = (formData.get('fieldEn') as string | null)?.trim() ?? null;
  const fieldBn = (formData.get('fieldBn') as string | null)?.trim() ?? null;
  const descriptionEn = (formData.get('descriptionEn') as string | null)?.trim() ?? null;
  const descriptionBn = (formData.get('descriptionBn') as string | null)?.trim() ?? null;
  const startDateRaw = (formData.get('startDate') as string | null)?.trim() ?? '';
  const endDateRaw = (formData.get('endDate') as string | null)?.trim() ?? '';
  const currentFlag = formData.get('current') === 'on' || formData.get('current') === 'true';
  const orderStr = (formData.get('order') as string | null) ?? '0';

  if (!institutionEn || !institutionBn || !degreeEn || !degreeBn) {
    return { ok: false, error: 'Institution and degree are required in both EN and BN.' };
  }

  const startDate = toDate(startDateRaw);
  if (!startDate) {
    return { ok: false, error: 'A valid start date is required.' };
  }

  // endDate is optional when "current" is true
  const endDate = currentFlag ? null : toDate(endDateRaw);
  if (!currentFlag && !endDate) {
    return { ok: false, error: 'End date is required when this is not a current enrollment (or tick "I currently study here").' };
  }

  if (endDate && endDate < startDate) {
    return { ok: false, error: 'End date cannot be before start date.' };
  }

  const order = parseInt(orderStr, 10) || 0;

  const education = await db.education.create({
    data: {
      institutionEn,
      institutionBn,
      degreeEn,
      degreeBn,
      fieldEn: fieldEn || null,
      fieldBn: fieldBn || null,
      descriptionEn: descriptionEn || null,
      descriptionBn: descriptionBn || null,
      startDate,
      endDate: endDate ?? null,
      current: currentFlag,
      order,
    },
  });

  await logActivity({
    userId: user.id,
    action: 'CREATE_EDUCATION',
    entity: 'Education',
    entityId: education.id,
    metadata: { institutionEn, institutionBn, degreeEn, degreeBn, current: currentFlag },
  });

  revalidatePath('/admin/education');

  return { ok: true, data: { id: education.id } };
}

export async function updateEducation(id: string, formData: FormData): Promise<ActionResult> {
  const user = await requireAdmin().catch(() => {
    throw new Error('UNAUTHORIZED');
  });

  const existing = await db.education.findUnique({ where: { id } });
  if (!existing) {
    return { ok: false, error: 'Education record not found.' };
  }

  const institutionEn = (formData.get('institutionEn') as string | null)?.trim() ?? '';
  const institutionBn = (formData.get('institutionBn') as string | null)?.trim() ?? '';
  const degreeEn = (formData.get('degreeEn') as string | null)?.trim() ?? '';
  const degreeBn = (formData.get('degreeBn') as string | null)?.trim() ?? '';
  const fieldEn = (formData.get('fieldEn') as string | null)?.trim() ?? null;
  const fieldBn = (formData.get('fieldBn') as string | null)?.trim() ?? null;
  const descriptionEn = (formData.get('descriptionEn') as string | null)?.trim() ?? null;
  const descriptionBn = (formData.get('descriptionBn') as string | null)?.trim() ?? null;
  const startDateRaw = (formData.get('startDate') as string | null)?.trim() ?? '';
  const endDateRaw = (formData.get('endDate') as string | null)?.trim() ?? '';
  const currentFlag = formData.get('current') === 'on' || formData.get('current') === 'true';
  const orderStr = (formData.get('order') as string | null) ?? '0';

  if (!institutionEn || !institutionBn || !degreeEn || !degreeBn) {
    return { ok: false, error: 'Institution and degree are required in both EN and BN.' };
  }

  const startDate = toDate(startDateRaw);
  if (!startDate) {
    return { ok: false, error: 'A valid start date is required.' };
  }

  const endDate = currentFlag ? null : toDate(endDateRaw);
  if (!currentFlag && !endDate) {
    return { ok: false, error: 'End date is required when this is not a current enrollment (or tick "I currently study here").' };
  }

  if (endDate && endDate < startDate) {
    return { ok: false, error: 'End date cannot be before start date.' };
  }

  const order = parseInt(orderStr, 10) || 0;

  const updated = await db.education.update({
    where: { id },
    data: {
      institutionEn,
      institutionBn,
      degreeEn,
      degreeBn,
      fieldEn: fieldEn || null,
      fieldBn: fieldBn || null,
      descriptionEn: descriptionEn || null,
      descriptionBn: descriptionBn || null,
      startDate,
      endDate: endDate ?? null,
      current: currentFlag,
      order,
    },
  });

  await logActivity({
    userId: user.id,
    action: 'UPDATE_EDUCATION',
    entity: 'Education',
    entityId: updated.id,
    metadata: { institutionEn, institutionBn, degreeEn, degreeBn, current: currentFlag },
  });

  revalidatePath('/admin/education');

  return { ok: true, data: { id: updated.id } };
}

export async function deleteEducation(id: string): Promise<ActionResult> {
  const user = await requireAdmin().catch(() => {
    throw new Error('UNAUTHORIZED');
  });

  const education = await db.education.findUnique({ where: { id } });
  if (!education) {
    return { ok: false, error: 'Education record not found.' };
  }

  await db.education.delete({ where: { id } });

  await logActivity({
    userId: user.id,
    action: 'DELETE_EDUCATION',
    entity: 'Education',
    entityId: id,
    metadata: { institutionEn: education.institutionEn, degreeEn: education.degreeEn },
  });

  revalidatePath('/admin/education');

  return { ok: true };
}

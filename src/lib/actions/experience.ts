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

export async function createExperience(formData: FormData): Promise<ActionResult> {
  const user = await requireAdmin().catch(() => {
    throw new Error('UNAUTHORIZED');
  });

  const companyEn = (formData.get('companyEn') as string | null)?.trim() ?? '';
  const companyBn = (formData.get('companyBn') as string | null)?.trim() ?? '';
  const roleEn = (formData.get('roleEn') as string | null)?.trim() ?? '';
  const roleBn = (formData.get('roleBn') as string | null)?.trim() ?? '';
  const descriptionEn = (formData.get('descriptionEn') as string | null)?.trim() ?? '';
  const descriptionBn = (formData.get('descriptionBn') as string | null)?.trim() ?? '';
  const locationEn = (formData.get('locationEn') as string | null)?.trim() ?? null;
  const locationBn = (formData.get('locationBn') as string | null)?.trim() ?? null;
  const startDateRaw = (formData.get('startDate') as string | null)?.trim() ?? '';
  const endDateRaw = (formData.get('endDate') as string | null)?.trim() ?? '';
  const currentFlag = formData.get('current') === 'on' || formData.get('current') === 'true';
  const orderStr = (formData.get('order') as string | null) ?? '0';

  if (!companyEn || !companyBn || !roleEn || !roleBn || !descriptionEn || !descriptionBn) {
    return { ok: false, error: 'Company, role, and description are required in both EN and BN.' };
  }

  const startDate = toDate(startDateRaw);
  if (!startDate) {
    return { ok: false, error: 'A valid start date is required.' };
  }

  // endDate is optional when "current" is true
  const endDate = currentFlag ? null : toDate(endDateRaw);
  if (!currentFlag && !endDate) {
    return { ok: false, error: 'End date is required when this is not a current position (or tick "I currently work here").' };
  }

  if (endDate && endDate < startDate) {
    return { ok: false, error: 'End date cannot be before start date.' };
  }

  const order = parseInt(orderStr, 10) || 0;

  const experience = await db.experience.create({
    data: {
      companyEn,
      companyBn,
      roleEn,
      roleBn,
      descriptionEn,
      descriptionBn,
      locationEn: locationEn || null,
      locationBn: locationBn || null,
      startDate,
      endDate: endDate ?? null,
      current: currentFlag,
      order,
    },
  });

  await logActivity({
    userId: user.id,
    action: 'CREATE_EXPERIENCE',
    entity: 'Experience',
    entityId: experience.id,
    metadata: { companyEn, companyBn, roleEn, roleBn, current: currentFlag },
  });

  revalidatePath('/admin/experience');

  return { ok: true, data: { id: experience.id } };
}

export async function updateExperience(id: string, formData: FormData): Promise<ActionResult> {
  const user = await requireAdmin().catch(() => {
    throw new Error('UNAUTHORIZED');
  });

  const existing = await db.experience.findUnique({ where: { id } });
  if (!existing) {
    return { ok: false, error: 'Experience record not found.' };
  }

  const companyEn = (formData.get('companyEn') as string | null)?.trim() ?? '';
  const companyBn = (formData.get('companyBn') as string | null)?.trim() ?? '';
  const roleEn = (formData.get('roleEn') as string | null)?.trim() ?? '';
  const roleBn = (formData.get('roleBn') as string | null)?.trim() ?? '';
  const descriptionEn = (formData.get('descriptionEn') as string | null)?.trim() ?? '';
  const descriptionBn = (formData.get('descriptionBn') as string | null)?.trim() ?? '';
  const locationEn = (formData.get('locationEn') as string | null)?.trim() ?? null;
  const locationBn = (formData.get('locationBn') as string | null)?.trim() ?? null;
  const startDateRaw = (formData.get('startDate') as string | null)?.trim() ?? '';
  const endDateRaw = (formData.get('endDate') as string | null)?.trim() ?? '';
  const currentFlag = formData.get('current') === 'on' || formData.get('current') === 'true';
  const orderStr = (formData.get('order') as string | null) ?? '0';

  if (!companyEn || !companyBn || !roleEn || !roleBn || !descriptionEn || !descriptionBn) {
    return { ok: false, error: 'Company, role, and description are required in both EN and BN.' };
  }

  const startDate = toDate(startDateRaw);
  if (!startDate) {
    return { ok: false, error: 'A valid start date is required.' };
  }

  const endDate = currentFlag ? null : toDate(endDateRaw);
  if (!currentFlag && !endDate) {
    return { ok: false, error: 'End date is required when this is not a current position (or tick "I currently work here").' };
  }

  if (endDate && endDate < startDate) {
    return { ok: false, error: 'End date cannot be before start date.' };
  }

  const order = parseInt(orderStr, 10) || 0;

  const updated = await db.experience.update({
    where: { id },
    data: {
      companyEn,
      companyBn,
      roleEn,
      roleBn,
      descriptionEn,
      descriptionBn,
      locationEn: locationEn || null,
      locationBn: locationBn || null,
      startDate,
      endDate: endDate ?? null,
      current: currentFlag,
      order,
    },
  });

  await logActivity({
    userId: user.id,
    action: 'UPDATE_EXPERIENCE',
    entity: 'Experience',
    entityId: updated.id,
    metadata: { companyEn, companyBn, roleEn, roleBn, current: currentFlag },
  });

  revalidatePath('/admin/experience');

  return { ok: true, data: { id: updated.id } };
}

export async function deleteExperience(id: string): Promise<ActionResult> {
  const user = await requireAdmin().catch(() => {
    throw new Error('UNAUTHORIZED');
  });

  const experience = await db.experience.findUnique({ where: { id } });
  if (!experience) {
    return { ok: false, error: 'Experience record not found.' };
  }

  await db.experience.delete({ where: { id } });

  await logActivity({
    userId: user.id,
    action: 'DELETE_EXPERIENCE',
    entity: 'Experience',
    entityId: id,
    metadata: { companyEn: experience.companyEn, roleEn: experience.roleEn },
  });

  revalidatePath('/admin/experience');

  return { ok: true };
}

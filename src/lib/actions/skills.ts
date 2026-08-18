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

function slugify(input: string): string {
  return input
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9\s-]/g, '')
    .replace(/\s+/g, '-')
    .replace(/-+/g, '-')
    .replace(/^-|-$/g, '');
}

export async function createSkill(formData: FormData): Promise<ActionResult> {
  const user = await requireAdmin().catch(() => {
    throw new Error('UNAUTHORIZED');
  });

  const name = (formData.get('name') as string | null)?.trim() ?? '';
  const slugInput = (formData.get('slug') as string | null)?.trim() ?? '';
  const category = (formData.get('category') as string | null)?.trim() ?? '';
  const descriptionEn = (formData.get('descriptionEn') as string | null)?.trim() ?? '';
  const descriptionBn = (formData.get('descriptionBn') as string | null)?.trim() ?? '';
  const logoUrl = (formData.get('logoUrl') as string | null)?.trim() ?? null;
  const levelStr = (formData.get('level') as string | null) ?? '50';
  const status = (formData.get('status') as string | null) ?? 'ACTIVE';
  const orderStr = (formData.get('order') as string | null) ?? '0';

  if (!name || !category) {
    return { ok: false, error: 'Name and category are required.' };
  }

  const slug = slugify(slugInput || name);
  if (!slug) {
    return { ok: false, error: 'Could not generate a valid slug.' };
  }

  // Ensure slug is unique
  const existing = await db.skill.findUnique({ where: { slug } });
  if (existing) {
    return { ok: false, error: `A skill with slug "${slug}" already exists.` };
  }

  const level = Math.min(100, Math.max(0, parseInt(levelStr, 10) || 50));
  const order = parseInt(orderStr, 10) || 0;

  const skill = await db.skill.create({
    data: {
      name, slug, category,
      descriptionEn: descriptionEn || null,
      descriptionBn: descriptionBn || null,
      logoUrl: logoUrl || null,
      level, status, order,
    },
  });

  await logActivity({
    userId: user.id,
    action: 'CREATE_SKILL',
    entity: 'Skill',
    entityId: skill.id,
    metadata: { name, slug, category },
  });

  revalidatePath('/admin/skills');

  return { ok: true, data: { id: skill.id } };
}

export async function updateSkill(id: string, formData: FormData): Promise<ActionResult> {
  const user = await requireAdmin().catch(() => {
    throw new Error('UNAUTHORIZED');
  });

  const existing = await db.skill.findUnique({ where: { id } });
  if (!existing) {
    return { ok: false, error: 'Skill not found.' };
  }

  const name = (formData.get('name') as string | null)?.trim() ?? '';
  const slugInput = (formData.get('slug') as string | null)?.trim() ?? '';
  const category = (formData.get('category') as string | null)?.trim() ?? '';
  const descriptionEn = (formData.get('descriptionEn') as string | null)?.trim() ?? '';
  const descriptionBn = (formData.get('descriptionBn') as string | null)?.trim() ?? '';
  const logoUrl = (formData.get('logoUrl') as string | null)?.trim() ?? null;
  const levelStr = (formData.get('level') as string | null) ?? '50';
  const status = (formData.get('status') as string | null) ?? 'ACTIVE';
  const orderStr = (formData.get('order') as string | null) ?? '0';

  if (!name || !category) {
    return { ok: false, error: 'Name and category are required.' };
  }

  const slug = slugify(slugInput || name);
  if (slug !== existing.slug) {
    const conflict = await db.skill.findUnique({ where: { slug } });
    if (conflict) {
      return { ok: false, error: `Slug "${slug}" is taken by another skill.` };
    }
  }

  const level = Math.min(100, Math.max(0, parseInt(levelStr, 10) || 50));
  const order = parseInt(orderStr, 10) || 0;

  const updated = await db.skill.update({
    where: { id },
    data: {
      name, slug, category,
      descriptionEn: descriptionEn || null,
      descriptionBn: descriptionBn || null,
      logoUrl: logoUrl || null,
      level, status, order,
    },
  });

  await logActivity({
    userId: user.id,
    action: 'UPDATE_SKILL',
    entity: 'Skill',
    entityId: updated.id,
    metadata: { name, slug, category },
  });

  revalidatePath('/admin/skills');

  return { ok: true, data: { id: updated.id } };
}

export async function deleteSkill(id: string): Promise<ActionResult> {
  const user = await requireAdmin().catch(() => {
    throw new Error('UNAUTHORIZED');
  });

  const skill = await db.skill.findUnique({ where: { id } });
  if (!skill) {
    return { ok: false, error: 'Skill not found.' };
  }

  await db.skill.delete({ where: { id } });

  await logActivity({
    userId: user.id,
    action: 'DELETE_SKILL',
    entity: 'Skill',
    entityId: id,
    metadata: { name: skill.name, slug: skill.slug },
  });

  revalidatePath('/admin/skills');

  return { ok: true };
}

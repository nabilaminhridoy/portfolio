'use server';

import { revalidatePath } from 'next/cache';
import { db } from '@/lib/db';
import { requireAdmin } from '@/lib/session';
import { logActivity } from '@/lib/activity';

interface ActionResult {
  ok: boolean;
  error?: string;
  data?: { id: string; slug: string };
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

export async function createProject(formData: FormData): Promise<ActionResult> {
  const user = await requireAdmin().catch(() => {
    throw new Error('UNAUTHORIZED');
  });

  const titleEn = (formData.get('titleEn') as string | null)?.trim() ?? '';
  const titleBn = (formData.get('titleBn') as string | null)?.trim() ?? '';
  const slugInput = (formData.get('slug') as string | null)?.trim() ?? '';
  const summaryEn = (formData.get('summaryEn') as string | null)?.trim() ?? null;
  const summaryBn = (formData.get('summaryBn') as string | null)?.trim() ?? null;
  const descriptionEn = (formData.get('descriptionEn') as string | null)?.trim() ?? '';
  const descriptionBn = (formData.get('descriptionBn') as string | null)?.trim() ?? '';
  const thumbnailUrl = (formData.get('thumbnailUrl') as string | null)?.trim() ?? null;
  const demoUrl = (formData.get('demoUrl') as string | null)?.trim() ?? null;
  const githubUrl = (formData.get('githubUrl') as string | null)?.trim() ?? null;
  const technologies = (formData.get('technologies') as string | null)?.trim() ?? '';
  const status = (formData.get('status') as string | null) ?? 'PUBLISHED';
  const isFeatured = formData.get('isFeatured') === 'on';
  const orderStr = (formData.get('order') as string | null) ?? '0';

  if (!titleEn || !titleBn || !descriptionEn || !descriptionBn) {
    return { ok: false, error: 'Title and description are required (EN + BN).' };
  }

  const slug = slugify(slugInput || titleEn);
  if (!slug) {
    return { ok: false, error: 'Could not generate a valid slug.' };
  }

  const existing = await db.project.findUnique({ where: { slug } });
  if (existing) {
    return { ok: false, error: `A project with slug "${slug}" already exists.` };
  }

  const order = parseInt(orderStr, 10) || 0;

  const project = await db.project.create({
    data: {
      titleEn, titleBn, slug,
      summaryEn, summaryBn,
      descriptionEn, descriptionBn,
      thumbnailUrl: thumbnailUrl || null,
      demoUrl: demoUrl || null,
      githubUrl: githubUrl || null,
      technologies,
      status,
      isFeatured,
      order,
    },
  });

  await logActivity({
    userId: user.id,
    action: 'CREATE_PROJECT',
    entity: 'Project',
    entityId: project.id,
    metadata: { titleEn, slug, technologies },
  });

  revalidatePath('/admin/projects');
  revalidatePath(`/en/projects`);
  revalidatePath(`/bn/projects`);

  return { ok: true, data: { id: project.id, slug: project.slug } };
}

export async function updateProject(id: string, formData: FormData): Promise<ActionResult> {
  const user = await requireAdmin().catch(() => {
    throw new Error('UNAUTHORIZED');
  });

  const existing = await db.project.findUnique({ where: { id } });
  if (!existing) {
    return { ok: false, error: 'Project not found.' };
  }

  const titleEn = (formData.get('titleEn') as string | null)?.trim() ?? '';
  const titleBn = (formData.get('titleBn') as string | null)?.trim() ?? '';
  const slugInput = (formData.get('slug') as string | null)?.trim() ?? '';
  const summaryEn = (formData.get('summaryEn') as string | null)?.trim() ?? null;
  const summaryBn = (formData.get('summaryBn') as string | null)?.trim() ?? null;
  const descriptionEn = (formData.get('descriptionEn') as string | null)?.trim() ?? '';
  const descriptionBn = (formData.get('descriptionBn') as string | null)?.trim() ?? '';
  const thumbnailUrl = (formData.get('thumbnailUrl') as string | null)?.trim() ?? null;
  const demoUrl = (formData.get('demoUrl') as string | null)?.trim() ?? null;
  const githubUrl = (formData.get('githubUrl') as string | null)?.trim() ?? null;
  const technologies = (formData.get('technologies') as string | null)?.trim() ?? '';
  const status = (formData.get('status') as string | null) ?? 'PUBLISHED';
  const isFeatured = formData.get('isFeatured') === 'on';
  const orderStr = (formData.get('order') as string | null) ?? '0';

  if (!titleEn || !titleBn || !descriptionEn || !descriptionBn) {
    return { ok: false, error: 'Title and description are required (EN + BN).' };
  }

  const slug = slugify(slugInput || titleEn);
  if (slug !== existing.slug) {
    const conflict = await db.project.findUnique({ where: { slug } });
    if (conflict) {
      return { ok: false, error: `Slug "${slug}" is taken by another project.` };
    }
  }

  const order = parseInt(orderStr, 10) || 0;

  const updated = await db.project.update({
    where: { id },
    data: {
      titleEn, titleBn, slug,
      summaryEn, summaryBn,
      descriptionEn, descriptionBn,
      thumbnailUrl: thumbnailUrl || null,
      demoUrl: demoUrl || null,
      githubUrl: githubUrl || null,
      technologies,
      status,
      isFeatured,
      order,
    },
  });

  await logActivity({
    userId: user.id,
    action: 'UPDATE_PROJECT',
    entity: 'Project',
    entityId: updated.id,
    metadata: { titleEn, slug, technologies },
  });

  revalidatePath('/admin/projects');
  revalidatePath(`/en/projects/${updated.slug}`);
  revalidatePath(`/bn/projects/${updated.slug}`);

  return { ok: true, data: { id: updated.id, slug: updated.slug } };
}

export async function deleteProject(id: string): Promise<ActionResult> {
  const user = await requireAdmin().catch(() => {
    throw new Error('UNAUTHORIZED');
  });

  const project = await db.project.findUnique({ where: { id } });
  if (!project) {
    return { ok: false, error: 'Project not found.' };
  }

  await db.project.delete({ where: { id } });

  await logActivity({
    userId: user.id,
    action: 'DELETE_PROJECT',
    entity: 'Project',
    entityId: id,
    metadata: { titleEn: project.titleEn, slug: project.slug },
  });

  revalidatePath('/admin/projects');

  return { ok: true };
}

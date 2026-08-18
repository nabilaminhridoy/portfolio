'use server';

import { revalidatePath } from 'next/cache';
import { db } from '@/lib/db';
import { requireAdmin } from '@/lib/session';
import { logActivity } from '@/lib/activity';

interface ActionResult {
  ok: boolean;
  error?: string;
}

export async function updateAbout(formData: FormData): Promise<ActionResult> {
  const user = await requireAdmin().catch(() => {
    throw new Error('UNAUTHORIZED');
  });

  const nameEn = (formData.get('nameEn') as string | null)?.trim() ?? '';
  const nameBn = (formData.get('nameBn') as string | null)?.trim() ?? '';
  const roleEn = (formData.get('roleEn') as string | null)?.trim() ?? '';
  const roleBn = (formData.get('roleBn') as string | null)?.trim() ?? '';
  const bioEn = (formData.get('bioEn') as string | null)?.trim() ?? '';
  const bioBn = (formData.get('bioBn') as string | null)?.trim() ?? '';
  const locationEn = (formData.get('locationEn') as string | null)?.trim() ?? null;
  const locationBn = (formData.get('locationBn') as string | null)?.trim() ?? null;
  const email = (formData.get('email') as string | null)?.trim() ?? null;
  const phone = (formData.get('phone') as string | null)?.trim() ?? null;
  const profileImageUrl = (formData.get('profileImageUrl') as string | null)?.trim() ?? null;
  const available = formData.get('available') === 'on';

  // CMS-controlled stats — empty string = null (hidden on public site)
  const yearsExperienceStr = (formData.get('yearsExperience') as string | null)?.trim() ?? '';
  const projectsCompletedStr = (formData.get('projectsCompleted') as string | null)?.trim() ?? '';
  const happyClientsStr = (formData.get('happyClients') as string | null)?.trim() ?? '';
  const technologiesCountStr = (formData.get('technologiesCount') as string | null)?.trim() ?? '';

  const yearsExperience = yearsExperienceStr ? parseInt(yearsExperienceStr, 10) : null;
  const projectsCompleted = projectsCompletedStr ? parseInt(projectsCompletedStr, 10) : null;
  const happyClients = happyClientsStr ? parseInt(happyClientsStr, 10) : null;
  const technologiesCount = technologiesCountStr ? parseInt(technologiesCountStr, 10) : null;

  // Validate stats (if provided, must be ≥ 0)
  if (yearsExperience != null && (isNaN(yearsExperience) || yearsExperience < 0)) {
    return { ok: false, error: 'Years of experience must be a non-negative number.' };
  }
  if (projectsCompleted != null && (isNaN(projectsCompleted) || projectsCompleted < 0)) {
    return { ok: false, error: 'Projects completed must be a non-negative number.' };
  }
  if (happyClients != null && (isNaN(happyClients) || happyClients < 0)) {
    return { ok: false, error: 'Happy clients must be a non-negative number.' };
  }
  if (technologiesCount != null && (isNaN(technologiesCount) || technologiesCount < 0)) {
    return { ok: false, error: 'Technologies count must be a non-negative number.' };
  }

  if (!nameEn || !nameBn || !roleEn || !roleBn) {
    return { ok: false, error: 'Name and role are required (EN + BN).' };
  }

  // bioEn / bioBn are optional (defaulted to empty string by Prisma)
  const bioEnValue = bioEn || '';
  const bioBnValue = bioBn || '';

  const existing = await db.about.findFirst({});

  let record;
  if (existing) {
    record = await db.about.update({
      where: { id: existing.id },
      data: {
        nameEn, nameBn, roleEn, roleBn,
        bioEn: bioEnValue, bioBn: bioBnValue,
        locationEn, locationBn, email, phone,
        profileImageUrl: profileImageUrl || null,
        available,
        yearsExperience,
        projectsCompleted,
        happyClients,
        technologiesCount,
      },
    });
  } else {
    record = await db.about.create({
      data: {
        nameEn, nameBn, roleEn, roleBn,
        bioEn: bioEnValue, bioBn: bioBnValue,
        locationEn, locationBn, email, phone,
        profileImageUrl: profileImageUrl || null,
        available,
        yearsExperience,
        projectsCompleted,
        happyClients,
        technologiesCount,
      },
    });
  }

  await logActivity({
    userId: user.id,
    action: 'UPDATE_ABOUT',
    entity: 'About',
    entityId: record.id,
  });

  revalidatePath('/admin/about');
  revalidatePath('/en');
  revalidatePath('/bn');

  return { ok: true };
}

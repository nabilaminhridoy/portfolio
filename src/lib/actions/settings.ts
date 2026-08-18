'use server';

import { revalidatePath } from 'next/cache';
import { db } from '@/lib/db';
import { requireAdmin } from '@/lib/session';
import { logActivity } from '@/lib/activity';

interface ActionResult {
  ok: boolean;
  error?: string;
}

export async function updateSettings(formData: FormData): Promise<ActionResult> {
  const user = await requireAdmin().catch(() => {
    throw new Error('UNAUTHORIZED');
  });

  // General
  const defaultLocale = (formData.get('defaultLocale') as string | null) ?? 'en';
  const defaultTheme = (formData.get('defaultTheme') as string | null) ?? 'system';
  const maintenanceMode = formData.get('maintenanceMode') === 'on';

  // Branding
  const favicon = (formData.get('favicon') as string | null)?.trim() || null;
  const logo = (formData.get('logo') as string | null)?.trim() || null;
  const siteName = (formData.get('siteName') as string | null)?.trim() || null;
  const tagline = (formData.get('tagline') as string | null)?.trim() || null;

  // Contact info
  const location = (formData.get('location') as string | null)?.trim() || null;
  const phone = (formData.get('phone') as string | null)?.trim() || null;
  const email = (formData.get('email') as string | null)?.trim() || null;

  // Localization
  const timezone = (formData.get('timezone') as string | null)?.trim() || 'Asia/Dhaka';
  const timeFormat = (formData.get('timeFormat') as string | null) ?? '12h';
  const dateFormat = (formData.get('dateFormat') as string | null) ?? 'DD/MM/YYYY';

  if (!['en', 'bn'].includes(defaultLocale)) {
    return { ok: false, error: 'Default locale must be en or bn.' };
  }
  if (!['light', 'dark', 'system'].includes(defaultTheme)) {
    return { ok: false, error: 'Default theme must be light, dark, or system.' };
  }

  await db.settings.upsert({
    where: { id: 'global' },
    update: {
      defaultLocale, defaultTheme, maintenanceMode,
      favicon, logo, siteName, tagline,
      location, phone, email,
      timezone, timeFormat, dateFormat,
    },
    create: {
      id: 'global', defaultLocale, defaultTheme, maintenanceMode,
      favicon, logo, siteName, tagline,
      location, phone, email,
      timezone, timeFormat, dateFormat,
    },
  });

  await logActivity({
    userId: user.id,
    action: 'UPDATE_SETTINGS',
    entity: 'Settings',
    entityId: 'global',
    metadata: { defaultLocale, defaultTheme, siteName, logo: logo ? 'set' : 'none' },
  });

  revalidatePath('/admin/settings');
  revalidatePath('/en');
  revalidatePath('/bn');

  return { ok: true };
}

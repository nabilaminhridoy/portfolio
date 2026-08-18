'use server';

import { revalidatePath } from 'next/cache';
import { db } from '@/lib/db';
import { requireAdmin } from '@/lib/session';
import { logActivity } from '@/lib/activity';

interface ActionResult {
  ok: boolean;
  error?: string;
}

/**
 * Update Cloudflare Turnstile settings from the admin Security page.
 * The secret key is stored in the DB but never returned to the client.
 * If the secret key field is empty on update, the existing value is preserved.
 */
export async function updateTurnstileSettings(formData: FormData): Promise<ActionResult> {
  const user = await requireAdmin().catch(() => {
    throw new Error('UNAUTHORIZED');
  });

  const enabled = formData.get('turnstileEnabled') === 'on';
  const siteKey = (formData.get('turnstileSiteKey') as string | null)?.trim() || null;
  const secretKeyRaw = (formData.get('turnstileSecretKey') as string | null)?.trim() || '';

  // Validation: if enabled, both site key and secret key are required
  if (enabled) {
    if (!siteKey) {
      return { ok: false, error: 'Site Key is required when Turnstile is enabled.' };
    }
    // If secret key is empty, check if there's an existing one in the DB
    if (!secretKeyRaw) {
      const existing = await db.settings.findUnique({ where: { id: 'global' } });
      if (!existing?.turnstileSecretKey) {
        return { ok: false, error: 'Secret Key is required when Turnstile is enabled.' };
      }
      // Keep existing secret key
    }
  }

  // Fetch existing settings to preserve secret key if not provided
  const existing = await db.settings.findUnique({ where: { id: 'global' } });
  const secretKey = secretKeyRaw || existing?.turnstileSecretKey || null;

  await db.settings.upsert({
    where: { id: 'global' },
    update: {
      turnstileEnabled: enabled,
      turnstileSiteKey: siteKey,
      turnstileSecretKey: secretKey,
    },
    create: {
      id: 'global',
      turnstileEnabled: enabled,
      turnstileSiteKey: siteKey,
      turnstileSecretKey: secretKey,
    },
  });

  await logActivity({
    userId: user.id,
    action: 'UPDATE_SECURITY',
    entity: 'Settings',
    entityId: 'global',
    metadata: { turnstileEnabled: enabled, siteKey: siteKey ? 'set' : 'none' },
  });

  revalidatePath('/admin/security');
  revalidatePath('/login');
  revalidatePath('/en');
  revalidatePath('/bn');

  return { ok: true };
}

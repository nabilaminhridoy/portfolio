'use server';

import { revalidatePath } from 'next/cache';
import { db } from '@/lib/db';
import { requireAdmin } from '@/lib/session';
import { logActivity } from '@/lib/activity';

interface ActionResult {
  ok: boolean;
  error?: string;
}

export async function updateAntiBotSettings(formData: FormData): Promise<ActionResult> {
  const user = await requireAdmin().catch(() => {
    throw new Error('UNAUTHORIZED');
  });

  const antiBotEnabled = formData.get('antiBotEnabled') === 'on';
  const aiCrawlerRestricted = formData.get('aiCrawlerRestricted') === 'on';
  const aggressiveBotProtection = formData.get('aggressiveBotProtection') === 'on';
  const rateLimitingEnabled = formData.get('rateLimitingEnabled') === 'on';

  await db.settings.upsert({
    where: { id: 'global' },
    update: {
      antiBotEnabled,
      aiCrawlerRestricted,
      aggressiveBotProtection,
      rateLimitingEnabled,
    },
    create: {
      id: 'global',
      antiBotEnabled,
      aiCrawlerRestricted,
      aggressiveBotProtection,
      rateLimitingEnabled,
    },
  });

  await logActivity({
    userId: user.id,
    action: 'UPDATE_SECURITY',
    entity: 'Settings',
    entityId: 'global',
    metadata: { antiBotEnabled, aiCrawlerRestricted, aggressiveBotProtection, rateLimitingEnabled },
  });

  revalidatePath('/admin/security');
  revalidatePath('/en');
  revalidatePath('/bn');

  return { ok: true };
}

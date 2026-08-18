'use server';

import { revalidatePath } from 'next/cache';
import { db } from '@/lib/db';
import { requireAdmin } from '@/lib/session';
import { logActivity } from '@/lib/activity';

interface ActionResult {
  ok: boolean;
  error?: string;
  message?: string;
}

export async function updateSmtpSettings(formData: FormData): Promise<ActionResult> {
  const user = await requireAdmin().catch(() => {
    throw new Error('UNAUTHORIZED');
  });

  const host = (formData.get('host') as string | null)?.trim() ?? null;
  const portStr = (formData.get('port') as string | null)?.trim() ?? '';
  const encryption = (formData.get('encryption') as string | null)?.trim() ?? null;
  const username = (formData.get('username') as string | null)?.trim() ?? null;
  const password = (formData.get('password') as string | null)?.trim() ?? null;
  const fromName = (formData.get('fromName') as string | null)?.trim() ?? null;
  const fromEmail = (formData.get('fromEmail') as string | null)?.trim() ?? null;
  const isEnabled = formData.get('isEnabled') === 'on';

  // Validate port
  let port: number | null = null;
  if (portStr) {
    const parsed = parseInt(portStr, 10);
    if (isNaN(parsed) || parsed < 1 || parsed > 65535) {
      return { ok: false, error: 'Port must be a number between 1 and 65535.' };
    }
    port = parsed;
  }

  // Validate encryption
  if (encryption && !['SSL', 'TLS', 'NONE'].includes(encryption)) {
    return { ok: false, error: 'Encryption must be SSL, TLS, or NONE.' };
  }

  // Validate fromEmail if provided
  if (fromEmail && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(fromEmail)) {
    return { ok: false, error: 'From email must be a valid email address.' };
  }

  await db.smtpSetting.upsert({
    where: { id: 'global' },
    update: {
      host,
      port,
      encryption,
      username,
      password,
      fromName,
      fromEmail,
      isEnabled,
    },
    create: {
      id: 'global',
      host,
      port,
      encryption,
      username,
      password,
      fromName,
      fromEmail,
      isEnabled,
    },
  });

  await logActivity({
    userId: user.id,
    action: 'UPDATE_SETTINGS',
    entity: 'SmtpSetting',
    entityId: 'global',
    metadata: {
      host: host ? 'set' : 'cleared',
      port,
      encryption,
      isEnabled,
    },
  });

  revalidatePath('/admin/smtp');

  return { ok: true };
}

export async function sendTestEmail(formData: FormData): Promise<ActionResult> {
  const user = await requireAdmin().catch(() => {
    throw new Error('UNAUTHORIZED');
  });

  const recipient = (formData.get('recipient') as string | null)?.trim() ?? '';

  if (!recipient || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(recipient)) {
    return { ok: false, error: 'A valid recipient email is required.' };
  }

  const smtp = await db.smtpSetting.findUnique({ where: { id: 'global' } });

  if (!smtp || !smtp.isEnabled || !smtp.host || !smtp.port || !smtp.fromEmail) {
    return {
      ok: false,
      error:
        'SMTP is not configured or not enabled. Save valid SMTP settings and enable it first.',
    };
  }

  await logActivity({
    userId: user.id,
    action: 'UPDATE_SETTINGS',
    entity: 'SmtpSetting',
    entityId: 'global',
    metadata: {
      testEmail: 'attempt',
      recipient,
    },
  });

  // NOTE: Actual email sending requires nodemailer (not yet installed).
  // For now we return a friendly message indicating the feature is wired up.
  // When nodemailer is installed, replace this block with a real transport call.
  revalidatePath('/admin/smtp');

  return {
    ok: true,
    message:
      'Test email feature ready — install nodemailer for actual sending. Recipient: ' +
      recipient,
  };
}

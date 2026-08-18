'use server';

import { revalidatePath } from 'next/cache';
import { db } from '@/lib/db';
import { logActivity } from '@/lib/activity';
import { verifyTurnstileToken } from '@/lib/turnstile';

interface ContactResult {
  ok: boolean;
  error?: string;
}

export async function submitContactMessage(formData: FormData): Promise<ContactResult> {
  const name = (formData.get('name') as string | null)?.trim() ?? '';
  const email = (formData.get('email') as string | null)?.trim().toLowerCase() ?? '';
  const subject = (formData.get('subject') as string | null)?.trim() ?? null;
  const message = (formData.get('message') as string | null)?.trim() ?? '';
  const ip = (formData.get('ip') as string | null)?.trim() ?? null;
  const userAgent = (formData.get('userAgent') as string | null)?.trim() ?? null;
  const turnstileToken = (formData.get('turnstileToken') as string | null) ?? null;

  // Validation
  if (!name || name.length < 2) {
    return { ok: false, error: 'Name must be at least 2 characters.' };
  }
  if (!email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
    return { ok: false, error: 'A valid email is required.' };
  }
  if (!message || message.length < 10) {
    return { ok: false, error: 'Message must be at least 10 characters.' };
  }
  if (message.length > 5000) {
    return { ok: false, error: 'Message must be less than 5000 characters.' };
  }

  // Server-side Turnstile verification — runs BEFORE processing the message.
  // If Turnstile is disabled, verifyTurnstileToken returns { success: true }.
  // If enabled but token is missing/invalid → reject (fail securely, no bypass).
  const turnstileResult = await verifyTurnstileToken(turnstileToken);
  if (!turnstileResult.success) {
    return { ok: false, error: turnstileResult.error ?? 'Security verification failed. Please try again.' };
  }

  try {
    const record = await db.contactMessage.create({
      data: {
        name,
        email,
        subject: subject || null,
        message,
        ip: ip || null,
        userAgent: userAgent || null,
      },
    });

    await logActivity({
      action: 'CONTACT_SUBMIT',
      entity: 'ContactMessage',
      entityId: record.id,
      ip: ip,
      userAgent: userAgent,
      metadata: { name, email, subject: subject || null },
    });

    revalidatePath('/admin');
    return { ok: true };
  } catch {
    return { ok: false, error: 'Failed to save your message. Please try again later.' };
  }
}

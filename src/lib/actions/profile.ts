'use server';

import { revalidatePath } from 'next/cache';
import { db } from '@/lib/db';
import { requireAdmin } from '@/lib/session';
import { logActivity } from '@/lib/activity';
import { hashPassword, verifyPassword } from '@/lib/password';

interface ActionResult {
  ok: boolean;
  error?: string;
}

export async function updateProfile(formData: FormData): Promise<ActionResult> {
  const user = await requireAdmin().catch(() => {
    throw new Error('UNAUTHORIZED');
  });

  const name = (formData.get('name') as string | null)?.trim() ?? '';
  const email = (formData.get('email') as string | null)?.trim().toLowerCase() ?? '';
  const avatarUrl = (formData.get('avatarUrl') as string | null)?.trim() ?? null;

  if (!name || name.length < 2) {
    return { ok: false, error: 'Name must be at least 2 characters.' };
  }
  if (!email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
    return { ok: false, error: 'A valid email is required.' };
  }

  // Ensure email is not taken by another user
  const existing = await db.user.findUnique({ where: { email } });
  if (existing && existing.id !== user.id) {
    return { ok: false, error: 'This email is already taken.' };
  }

  await db.user.update({
    where: { id: user.id },
    data: { name, email, avatarUrl: avatarUrl || null },
  });

  await logActivity({
    userId: user.id,
    action: 'UPDATE_PROFILE',
    entity: 'User',
    entityId: user.id,
    metadata: { name, email },
  });

  revalidatePath('/admin/profile');
  revalidatePath('/admin');

  return { ok: true };
}

export async function changePassword(formData: FormData): Promise<ActionResult> {
  const user = await requireAdmin().catch(() => {
    throw new Error('UNAUTHORIZED');
  });

  const current = formData.get('currentPassword') as string | null ?? '';
  const next = formData.get('newPassword') as string | null ?? '';
  const confirm = formData.get('confirmPassword') as string | null ?? '';

  if (!current || !next) {
    return { ok: false, error: 'All password fields are required.' };
  }
  if (next !== confirm) {
    return { ok: false, error: 'New password and confirmation do not match.' };
  }
  if (next.length < 8) {
    return { ok: false, error: 'New password must be at least 8 characters.' };
  }
  if (!/[A-Z]/.test(next) || !/[a-z]/.test(next) || !/[0-9]/.test(next)) {
    return { ok: false, error: 'Password must include uppercase, lowercase, and a number.' };
  }

  const userRecord = await db.user.findUnique({ where: { id: user.id } });
  if (!userRecord) {
    return { ok: false, error: 'User not found.' };
  }

  const isCorrect = await verifyPassword(current, userRecord.password);
  if (!isCorrect) {
    return { ok: false, error: 'Current password is incorrect.' };
  }

  const hashed = await hashPassword(next);
  await db.user.update({
    where: { id: user.id },
    data: { password: hashed },
  });

  await logActivity({
    userId: user.id,
    action: 'UPDATE_SECURITY',
    entity: 'User',
    entityId: user.id,
    metadata: { changed: 'password' },
  });

  revalidatePath('/admin/security');

  return { ok: true };
}

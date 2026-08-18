import { NextResponse, type NextRequest } from 'next/server';
import { db } from '@/lib/db';
import { hashPassword } from '@/lib/password';
import { logActivity } from '@/lib/activity';

const MIN_PASSWORD_LENGTH = 8;

export async function POST(request: NextRequest) {
  let token: string;
  let password: string;
  try {
    const body = (await request.json()) as { token?: string; password?: string };
    token = body.token ?? '';
    password = body.password ?? '';
  } catch {
    return NextResponse.json({ error: 'Invalid request body' }, { status: 400 });
  }

  if (!token || !password) {
    return NextResponse.json({ error: 'Token and password are required' }, { status: 400 });
  }

  // Password policy
  if (password.length < MIN_PASSWORD_LENGTH) {
    return NextResponse.json(
      { error: `Password must be at least ${MIN_PASSWORD_LENGTH} characters` },
      { status: 400 }
    );
  }
  if (!/[A-Z]/.test(password) || !/[a-z]/.test(password) || !/[0-9]/.test(password)) {
    return NextResponse.json(
      { error: 'Password must include uppercase, lowercase, and a number' },
      { status: 400 }
    );
  }

  // Look up token
  const resetToken = await db.passwordResetToken.findUnique({
    where: { token },
  });

  if (!resetToken || resetToken.usedAt || resetToken.expiresAt <= new Date()) {
    return NextResponse.json(
      { error: 'Reset link is invalid or expired' },
      { status: 400 }
    );
  }

  // Hash + update password
  const hashed = await hashPassword(password);

  await db.$transaction([
    db.user.update({
      where: { id: resetToken.userId ?? undefined },
      data: { password: hashed },
    }),
    db.passwordResetToken.update({
      where: { token },
      data: { usedAt: new Date() },
    }),
  ]);

  // Invalidate any other pending tokens for this email
  await db.passwordResetToken.updateMany({
    where: { email: resetToken.email, usedAt: null },
    data: { usedAt: new Date() },
  });

  await logActivity({
    userId: resetToken.userId ?? undefined,
    action: 'PASSWORD_RESET_COMPLETED',
    entity: 'User',
    entityId: resetToken.userId ?? undefined,
    ip: request.headers.get('x-forwarded-for') ?? request.headers.get('x-real-ip') ?? null,
    userAgent: request.headers.get('user-agent'),
    metadata: { email: resetToken.email },
  });

  return NextResponse.json({ ok: true });
}

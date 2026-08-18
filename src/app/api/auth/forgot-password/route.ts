import { NextResponse, type NextRequest } from 'next/server';
import { db } from '@/lib/db';
import { generateToken } from '@/lib/password';
import { logActivity } from '@/lib/activity';

const RESET_TTL_MINUTES = 30;

export async function POST(request: NextRequest) {
  let email: string;
  try {
    const body = (await request.json()) as { email?: string };
    email = (body.email ?? '').trim().toLowerCase();
  } catch {
    return NextResponse.json({ error: 'Invalid request body' }, { status: 400 });
  }

  if (!email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
    return NextResponse.json({ error: 'Valid email is required' }, { status: 400 });
  }

  // Always return generic success (do NOT leak whether email exists)
  const genericResponse = NextResponse.json({ ok: true });

  // Look up user
  const user = await db.user.findUnique({ where: { email } });
  if (!user) {
    return genericResponse;
  }

  // Generate token + persist
  const token = generateToken();
  const expiresAt = new Date(Date.now() + RESET_TTL_MINUTES * 60 * 1000);

  // Invalidate any prior tokens for this user (one valid at a time)
  await db.passwordResetToken.updateMany({
    where: { userId: user.id, usedAt: null },
    data: { usedAt: new Date() },
  });

  await db.passwordResetToken.create({
    data: {
      token,
      email: user.email,
      userId: user.id,
      expiresAt,
    },
  });

  await logActivity({
    userId: user.id,
    action: 'PASSWORD_RESET_REQUESTED',
    entity: 'User',
    entityId: user.id,
    ip: request.headers.get('x-forwarded-for') ?? request.headers.get('x-real-ip') ?? null,
    userAgent: request.headers.get('user-agent'),
    metadata: { email: user.email },
  });

  // === SMTP integration (Phase 7) ===
  // For Phase 3: return the reset URL in dev only so we can test without SMTP.
  // In production, fetch SMTP settings from DB and send the email instead.
  const isDev = process.env.NODE_ENV !== 'production';
  if (isDev) {
    return NextResponse.json({
      ok: true,
      resetUrl: `/reset-password/${token}`,
    });
  }

  return genericResponse;
}

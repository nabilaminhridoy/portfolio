import 'server-only';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';

export interface SessionUser {
  id?: string;
  email?: string | null;
  name?: string | null;
  role?: string;
}

/**
 * Get the current authenticated user's session.
 * Server-only — used in server components, server actions, API routes.
 */
export async function getSession() {
  return getServerSession(authOptions);
}

/**
 * Get the current user's id (or null if not authenticated).
 * Convenience wrapper for admin guards.
 */
export async function getCurrentUserId(): Promise<string | null> {
  const session = await getSession();
  const id = (session?.user as SessionUser | undefined)?.id;
  return id ?? null;
}

/**
 * Strict admin-only guard. Throws on unauthorized access.
 * Use in server actions / API routes / RSC that require auth.
 */
export async function requireAdmin(): Promise<SessionUser> {
  const session = await getSession();
  const user = session?.user as SessionUser | undefined;
  if (!user?.id) {
    throw new Error('UNAUTHORIZED');
  }
  return user;
}

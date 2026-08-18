import type { NextAuthOptions } from 'next-auth';

/**
 * Base NextAuth config — safe to import in the proxy (Edge runtime).
 * Only contains config that doesn't touch the DB.
 *
 * NEXTAUTH_SECRET MUST be set via the deployment environment — no hardcoded fallback.
 * If unset, NextAuth will throw at request time (preferred over silent default).
 */
export const authConfig: Pick<
  NextAuthOptions,
  'providers' | 'pages' | 'session' | 'secret'
> = {
  session: {
    strategy: 'jwt',
    maxAge: 30 * 24 * 60 * 60, // 30 days
  },
  pages: {
    signIn: '/login',
    error: '/login',
    verifyRequest: '/login',
  },
  secret: process.env.NEXTAUTH_SECRET,
  providers: [],
};

import type { NextAuthOptions } from 'next-auth';
import CredentialsProvider from 'next-auth/providers/credentials';

import { db } from '@/lib/db';
import { verifyPassword } from '@/lib/password';
import { logActivity } from '@/lib/activity';
import { authConfig } from '@/lib/auth.config';
import { verifyTurnstileToken } from '@/lib/turnstile';

/**
 * Full NextAuth options — safe for Node runtime (server actions, API routes).
 * Must NOT be imported from the proxy (Edge runtime) — use authConfig there.
 */
export const authOptions: NextAuthOptions = {
  ...authConfig,
  session: {
    strategy: 'jwt',
    maxAge: 30 * 24 * 60 * 60,
  },
  providers: [
    CredentialsProvider({
      name: 'Credentials',
      credentials: {
        email: { label: 'Email', type: 'email', placeholder: 'you@example.com' },
        password: { label: 'Password', type: 'password' },
        turnstileToken: { label: 'Turnstile Token', type: 'text' },
      },
      async authorize(credentials) {
        const email = credentials?.email?.trim().toLowerCase();
        const password = credentials?.password ?? '';
        const turnstileToken = credentials?.turnstileToken as string | undefined;

        if (!email || !password) return null;

        // Server-side Turnstile verification — runs BEFORE authentication.
        // If Turnstile is disabled, verifyTurnstileToken returns { success: true }.
        // If enabled but token is missing/invalid → reject before auth.
        const turnstileResult = await verifyTurnstileToken(turnstileToken);
        if (!turnstileResult.success) {
          // Return null — treated as auth failure.
          // The client-side pre-verification shows the specific Turnstile error.
          return null;
        }

        const user = await db.user.findUnique({
          where: { email },
        });

        if (!user || !user.isActive) return null;

        const isValid = await verifyPassword(password, user.password);
        if (!isValid) return null;

        // Update lastLoginAt in the background (don't block auth)
        db.user
          .update({
            where: { id: user.id },
            data: { lastLoginAt: new Date() },
          })
          .catch(() => {
            // Non-critical; silently ignore
          });

        return {
          id: user.id,
          email: user.email,
          name: user.name ?? undefined,
          role: user.role,
        };
      },
    }),
  ],
  callbacks: {
    async jwt({ token, user }) {
      // Initial sign-in: persist user id + role in token
      if (user) {
        token.id = user.id;
        token.role = (user as { role?: string }).role ?? 'ADMIN';
      }
      return token;
    },
    async session({ session, token }) {
      // Expose id + role on session.user for server-side use
      if (session.user) {
        (session.user as { id?: string }).id = token.id as string | undefined;
        (session.user as { role?: string }).role = token.role as string | undefined;
      }
      return session;
    },
  },
  events: {
    async signIn({ user, account }) {
      // Log successful login (fire-and-forget)
      const id = (user as { id?: string }).id;
      if (id) {
        await logActivity({
          userId: id,
          action: 'LOGIN',
          entity: 'User',
          entityId: id,
          metadata: account ? { provider: account.provider } : undefined,
        }).catch(() => {});
      }
    },
    async signOut(message) {
      // Log logout — works for both JWT and session strategies
      const token = message as { token?: { id?: string } };
      const id = token?.token?.id;
      if (id) {
        await logActivity({
          userId: id,
          action: 'LOGOUT',
          entity: 'User',
          entityId: id,
        }).catch(() => {});
      }
    },
  },
};

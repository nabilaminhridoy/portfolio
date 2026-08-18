import { db } from '@/lib/db';
import { ResetPasswordForm } from './_components/reset-form';
import { AuthShell } from '@/components/public/auth-shell';

export const metadata = {
  title: 'Reset Password',
  description: 'Set a new password for your admin account.',
};

export default async function ResetPasswordPage({
  params,
}: {
  params: Promise<{ token: string }>;
}) {
  const { token } = await params;

  const resetToken = await db.passwordResetToken.findUnique({
    where: { token },
  });

  const isValid =
    resetToken &&
    !resetToken.usedAt &&
    resetToken.expiresAt > new Date();

  return (
    <AuthShell>
      {isValid ? (
        <ResetPasswordForm token={token} />
      ) : (
        <div className="w-full max-w-md rounded-lg border border-border bg-card p-6 text-center shadow-card">
          <h1 className="text-h3 font-bold">Invalid or Expired Link</h1>
          <p className="mt-2 text-sm text-muted-foreground">
            This password reset link is invalid or has expired. Please request a new one.
          </p>
          <a
            href="/forgot-password"
            className="mt-6 inline-block rounded-md bg-primary px-4 py-2 text-sm font-medium text-primary-foreground hover:bg-primary/90"
          >
            Request new link
          </a>
        </div>
      )}
    </AuthShell>
  );
}

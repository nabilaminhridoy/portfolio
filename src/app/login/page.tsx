import { getServerSession } from 'next-auth';
import { redirect } from 'next/navigation';
import { authOptions } from '@/lib/auth';
import { LoginForm } from './_components/login-form';
import { AuthShell } from '@/components/public/auth-shell';
import { getTurnstileConfig } from '@/lib/turnstile';

export const metadata = {
  title: 'Login',
  description: 'Sign in to Nabil Amin Hridoy Portfolio CMS admin.',
};

export const dynamic = 'force-dynamic';

export default async function LoginPage({
  searchParams,
}: {
  searchParams: Promise<{ callbackUrl?: string; error?: string }>;
}) {
  const session = await getServerSession(authOptions);

  if (session) {
    redirect('/admin/dashboard');
  }

  const { callbackUrl, error } = await searchParams;
  const turnstile = await getTurnstileConfig();

  return (
    <AuthShell>
      <LoginForm
        callbackUrl={callbackUrl}
        initialError={error}
        turnstile={turnstile}
      />
    </AuthShell>
  );
}

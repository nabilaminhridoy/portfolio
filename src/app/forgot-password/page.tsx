import { ForgotPasswordForm } from './_components/forgot-form';
import { AuthShell } from '@/components/public/auth-shell';

export const metadata = {
  title: 'Forgot Password',
  description: 'Reset your Nabil Amin Hridoy Portfolio CMS admin password.',
};

export default function ForgotPasswordPage() {
  return (
    <AuthShell>
      <ForgotPasswordForm />
    </AuthShell>
  );
}

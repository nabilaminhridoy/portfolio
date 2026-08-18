import { AuthShell } from '@/components/public/auth-shell';
import { NotFoundContent } from '@/components/public/sections/not-found-content';

export default function RootNotFound() {
  return (
    <AuthShell>
      <NotFoundContent />
    </AuthShell>
  );
}

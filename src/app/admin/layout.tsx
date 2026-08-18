import { redirect } from 'next/navigation';
import { getServerSession } from 'next-auth';

import { authOptions } from '@/lib/auth';
import { db } from '@/lib/db';
import { AdminShell } from './_components/admin-shell';
import { AuthSessionProvider } from '@/components/auth/session-provider';

export const metadata = {
  title: {
    default: 'Admin — Nabil Amin Hridoy',
    template: '%s | Admin — Nabil Amin Hridoy',
  },
  description: 'Nabil Amin Hridoy Portfolio CMS admin dashboard.',
  robots: { index: false, follow: false },
};

export const dynamic = 'force-dynamic';

export default async function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const session = await getServerSession(authOptions);

  if (!session?.user) {
    redirect('/login?callbackUrl=/admin/dashboard');
  }

  const userObj = session.user as { name?: string | null; email?: string | null };

  // Fetch recent activity logs + settings (for logo) in parallel
  const [recentActivities, settings] = await Promise.all([
    db.activityLog.findMany({
      take: 10,
      orderBy: { createdAt: 'desc' },
      include: { user: { select: { email: true, name: true } } },
    }).catch(() => []),
    db.settings.findUnique({ where: { id: 'global' } }).catch(() => null),
  ]);

  const notifications = recentActivities.map((a) => ({
    id: a.id,
    action: a.action,
    entity: a.entity,
    createdAt: a.createdAt.toISOString(),
    userEmail: a.user?.email ?? null,
  }));

  return (
    <AuthSessionProvider>
      <AdminShell
        user={{
          name: userObj.name,
          email: userObj.email,
        }}
        notifications={notifications}
        logoUrl={settings?.logo ?? undefined}
      >
        {children}
      </AdminShell>
    </AuthSessionProvider>
  );
}

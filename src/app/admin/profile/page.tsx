import { db } from '@/lib/db';
import { getCurrentUserId } from '@/lib/session';
import { ProfileForm } from './_components/profile-form';

export const metadata = {
  title: 'Profile',
};

export const dynamic = 'force-dynamic';

export default async function ProfilePage() {
  const userId = await getCurrentUserId();
  if (!userId) return null;

  const user = await db.user.findUnique({
    where: { id: userId },
    select: {
      id: true,
      name: true,
      email: true,
      avatarUrl: true,
      role: true,
      lastLoginAt: true,
      createdAt: true,
    },
  });

  if (!user) return null;

  return <ProfileForm user={user} />;
}

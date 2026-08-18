import { db } from '@/lib/db';
import { getCurrentUserId } from '@/lib/session';
import { SecurityForm } from './_components/security-form';
import { TurnstileConfigCard } from './_components/turnstile-config-card';
import { AntiBotConfigCard } from './_components/antibot-config-card';

export const metadata = {
  title: 'Security',
};

export const dynamic = 'force-dynamic';

export default async function SecurityPage() {
  const userId = await getCurrentUserId();
  if (!userId) return null;

  const [user, recentActivity, passwordResets, settings] = await Promise.all([
    db.user.findUnique({
      where: { id: userId },
      select: {
        email: true,
        name: true,
        lastLoginAt: true,
        updatedAt: true,
      },
    }),
    db.activityLog.findMany({
      where: { userId },
      orderBy: { createdAt: 'desc' },
      take: 8,
    }),
    db.passwordResetToken.findMany({
      where: { userId },
      orderBy: { createdAt: 'desc' },
      take: 5,
      select: { id: true, createdAt: true, expiresAt: true, usedAt: true },
    }),
    db.settings.findUnique({ where: { id: 'global' } }),
  ]);

  if (!user) return null;

  return (
    <div className="space-y-6">
      <SecurityForm
        user={user}
        recentActivity={recentActivity}
        passwordResets={passwordResets}
      />
      <TurnstileConfigCard
        enabled={settings?.turnstileEnabled ?? false}
        siteKey={settings?.turnstileSiteKey ?? ''}
        hasSecretKey={!!settings?.turnstileSecretKey}
      />
      <AntiBotConfigCard
        antiBotEnabled={settings?.antiBotEnabled ?? false}
        aiCrawlerRestricted={settings?.aiCrawlerRestricted ?? false}
        aggressiveBotProtection={settings?.aggressiveBotProtection ?? false}
        rateLimitingEnabled={settings?.rateLimitingEnabled ?? false}
      />
    </div>
  );
}

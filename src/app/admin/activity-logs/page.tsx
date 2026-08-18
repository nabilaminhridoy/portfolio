import { db } from '@/lib/db';
import { ArrowRight, History } from 'lucide-react';

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { EmptyState } from '@/components/feedback/empty-state';
import { ActivityTableClient, type ActivityLogRow } from './_components/activity-table-client';

export const metadata = {
  title: 'Activity Logs',
};

export const dynamic = 'force-dynamic';

export default async function ActivityLogsPage() {
  const logs = await db.activityLog.findMany({
    take: 100,
    orderBy: { createdAt: 'desc' },
    include: { user: { select: { email: true, name: true } } },
  });

  // Convert Date objects (server side) — they get serialized as ISO strings
  // when passed to the client component. Convert back on client if needed.
  const rows: ActivityLogRow[] = logs.map((l) => ({
    id: l.id,
    action: l.action,
    entity: l.entity,
    entityId: l.entityId,
    user: l.user ? { email: l.user.email, name: l.user.name } : null,
    ip: l.ip,
    userAgent: l.userAgent,
    metadata: l.metadata,
    createdAt: l.createdAt,
  }));

  return (
    <div className="space-y-6">
      <Card className="border-border bg-card shadow-card">
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-base">
            <History className="h-4 w-4 text-brand-blue" aria-hidden="true" />
            Audit Log
          </CardTitle>
          <CardDescription>
            Last 100 actions performed in the CMS. Use the search box to filter by user email.
          </CardDescription>
        </CardHeader>
        <CardContent>
          {rows.length === 0 ? (
            <EmptyState
              title="No activity logs"
              description="Activity will be logged automatically as you use the CMS."
              icon={<History className="h-7 w-7" />}
            />
          ) : (
            <ActivityTableClient data={rows} />
          )}
        </CardContent>
      </Card>

      <p className="flex items-center gap-2 text-xs text-muted-foreground">
        <ArrowRight className="h-3 w-3" aria-hidden="true" />
        Activity is logged automatically. You cannot manually delete log entries.
      </p>
    </div>
  );
}

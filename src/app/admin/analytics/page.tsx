import { db } from '@/lib/db';

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { ActivityCharts, ContentDistribution, TopSkillsByCategory } from './_components/analytics-charts';

export const metadata = {
  title: 'Analytics',
};

export const dynamic = 'force-dynamic';

export default async function AnalyticsPage() {
  // Real data we have access to (tracking integration comes in Phase 7)
  const [
    activityByAction,
    skillsByCategory,
    projectsByStatus,
    recentActivityDaily,
    testimonialsByRating,
    contentCounts,
  ] = await Promise.all([
    // Group activity logs by action type
    db.activityLog.groupBy({
      by: ['action'],
      _count: { _all: true },
      orderBy: { _count: { action: 'desc' } },
    }),
    // Group skills by category
    db.skill.groupBy({
      by: ['category'],
      _count: { _all: true },
      orderBy: { _count: { category: 'desc' } },
    }),
    // Group projects by status
    db.project.groupBy({
      by: ['status'],
      _count: { _all: true },
    }),
    // Daily activity for the last 14 days — grouped by date
    db.activityLog.findMany({
      where: { createdAt: { gte: new Date(Date.now() - 14 * 24 * 60 * 60 * 1000) } },
      select: { createdAt: true, action: true },
    }),
    // Testimonials by rating
    db.testimonial.groupBy({
      by: ['rating'],
      _count: { _all: true },
      orderBy: { rating: 'asc' },
    }),
    // Content counts for the distribution chart
    Promise.all([
      db.project.count(),
      db.skill.count(),
      db.service.count(),
      db.experience.count(),
      db.education.count(),
      db.testimonial.count(),
      db.media.count(),
      db.socialLink.count(),
    ]),
  ]);

  // Aggregate daily activity: { date: 'YYYY-MM-DD', count: n, login: x, logout: y, ... }
  const dailyMap = new Map<string, { date: string; total: number; login: number; logout: number; reset: number; other: number }>();
  for (const log of recentActivityDaily) {
    const dateStr = log.createdAt.toISOString().slice(0, 10);
    const entry = dailyMap.get(dateStr) ?? { date: dateStr, total: 0, login: 0, logout: 0, reset: 0, other: 0 };
    entry.total += 1;
    if (log.action === 'LOGIN') entry.login += 1;
    else if (log.action === 'LOGOUT') entry.logout += 1;
    else if (log.action.startsWith('PASSWORD_RESET')) entry.reset += 1;
    else entry.other += 1;
    dailyMap.set(dateStr, entry);
  }
  const dailyActivity = Array.from(dailyMap.values()).sort((a, b) => a.date.localeCompare(b.date));

  const contentDistribution = [
    { label: 'Projects', value: contentCounts[0], color: '#175bea' },
    { label: 'Skills', value: contentCounts[1], color: '#00c5fb' },
    { label: 'Services', value: contentCounts[2], color: '#030f2b' },
    { label: 'Experience', value: contentCounts[3], color: '#5a6485' },
    { label: 'Education', value: contentCounts[4], color: '#8b9bc7' },
    { label: 'Testimonials', value: contentCounts[5], color: '#94a3b8' },
    { label: 'Media', value: contentCounts[6], color: '#a8b3d1' },
    { label: 'Social', value: contentCounts[7], color: '#bdc7e0' },
  ];

  return (
    <div className="space-y-6">
      <Card className="border-border bg-card shadow-card">
        <CardHeader>
          <CardTitle>Activity Overview</CardTitle>
          <CardDescription>
            Audit log activity grouped by action type and timeline. Full tracking (page views, project clicks, etc.) will appear here after Phase 7.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <ActivityCharts
            actionBreakdown={activityByAction.map((a) => ({ name: a.action, count: a._count._all }))}
            dailyActivity={dailyActivity}
          />
        </CardContent>
      </Card>

      <div className="grid grid-cols-1 gap-4 lg:grid-cols-2">
        <Card className="border-border bg-card shadow-card">
          <CardHeader>
            <CardTitle className="text-base">Content Distribution</CardTitle>
            <CardDescription>How content is spread across modules</CardDescription>
          </CardHeader>
          <CardContent>
            <ContentDistribution data={contentDistribution} />
          </CardContent>
        </Card>

        <Card className="border-border bg-card shadow-card">
          <CardHeader>
            <CardTitle className="text-base">Skills by Category</CardTitle>
            <CardDescription>Technology stack distribution</CardDescription>
          </CardHeader>
          <CardContent>
            <TopSkillsByCategory
              data={skillsByCategory.map((s) => ({ name: s.category, count: s._count._all }))}
            />
          </CardContent>
        </Card>
      </div>

      <Card className="border-border bg-card shadow-card">
        <CardHeader>
          <CardTitle className="text-base">Project Status & Testimonial Ratings</CardTitle>
          <CardDescription>Distribution of project lifecycle states and customer rating breakdown</CardDescription>
        </CardHeader>
        <CardContent className="grid grid-cols-1 gap-6 sm:grid-cols-2">
          <div>
            <p className="mb-3 text-xs font-semibold uppercase tracking-wider text-muted-foreground">Project Status</p>
            <ul className="space-y-1.5">
              {projectsByStatus.map((p) => (
                <li key={p.status} className="flex items-center justify-between text-sm">
                  <span className="font-medium text-foreground">{p.status}</span>
                  <span className="rounded-md bg-muted px-2 py-0.5 text-xs font-semibold">{p._count._all}</span>
                </li>
              ))}
            </ul>
          </div>
          <div>
            <p className="mb-3 text-xs font-semibold uppercase tracking-wider text-muted-foreground">Testimonial Ratings</p>
            <ul className="space-y-1.5">
              {testimonialsByRating.map((t) => (
                <li key={t.rating} className="flex items-center justify-between text-sm">
                  <span className="font-medium text-foreground">{t.rating} Star{t.rating === 1 ? '' : 's'}</span>
                  <span className="rounded-md bg-muted px-2 py-0.5 text-xs font-semibold">{t._count._all}</span>
                </li>
              ))}
            </ul>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

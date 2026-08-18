import { db } from '@/lib/db';

import { DashboardCard } from '@/components/admin/dashboard-card';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { EmptyState } from '@/components/feedback/empty-state';
import { ActivityLogList } from './_components/activity-list';
import { RecentProjectsList } from './_components/recent-projects';
import { QuickActions } from './_components/quick-actions';

import {
  FolderGit2,
  Code2,
  Briefcase,
  Quote,
  Wrench,
  Mail,
  Eye,
  History,
} from 'lucide-react';

export const metadata = {
  title: 'Dashboard',
};

// Force dynamic rendering — admin pages always need fresh data
export const dynamic = 'force-dynamic';

export default async function DashboardPage() {
  // Fetch all KPIs in parallel
  const [
    projectCount,
    publishedProjectCount,
    skillCount,
    serviceCount,
    experienceCount,
    testimonialCount,
    messageCount,
    unreadMessageCount,
    mediaCount,
    activityCount,
    recentActivity,
    recentProjects,
  ] = await Promise.all([
    db.project.count(),
    db.project.count({ where: { status: 'PUBLISHED' } }),
    db.skill.count(),
    db.service.count({ where: { status: 'ACTIVE' } }),
    db.experience.count(),
    db.testimonial.count({ where: { status: 'ACTIVE' } }),
    db.contactMessage.count(),
    db.contactMessage.count({ where: { isRead: false } }),
    db.media.count(),
    db.activityLog.count(),
    db.activityLog.findMany({
      take: 8,
      orderBy: { createdAt: 'desc' },
      include: { user: { select: { email: true, name: true } } },
    }),
    db.project.findMany({
      take: 5,
      orderBy: { createdAt: 'desc' },
      select: {
        id: true,
        slug: true,
        titleEn: true,
        status: true,
        isFeatured: true,
        createdAt: true,
      },
    }),
  ]);

  return (
    <div className="space-y-6">
      {/* KPI grid */}
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <DashboardCard
          title="Projects"
          value={projectCount}
          description={`${publishedProjectCount} published`}
          icon={<FolderGit2 className="h-4 w-4" />}
          accent="blue"
          trend={{ direction: 'up', value: `+${recentProjects.length} recent` }}
        />
        <DashboardCard
          title="Skills"
          value={skillCount}
          description="across 4 categories"
          icon={<Code2 className="h-4 w-4" />}
          accent="cyan"
        />
        <DashboardCard
          title="Services"
          value={serviceCount}
          description="active offerings"
          icon={<Wrench className="h-4 w-4" />}
          accent="dark"
        />
        <DashboardCard
          title="Testimonials"
          value={testimonialCount}
          description="published"
          icon={<Quote className="h-4 w-4" />}
          accent="muted"
        />
      </div>

      {/* Secondary KPI grid */}
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <DashboardCard
          title="Experience"
          value={experienceCount}
          description="career entries"
          icon={<Briefcase className="h-4 w-4" />}
          accent="muted"
        />
        <DashboardCard
          title="Messages"
          value={messageCount}
          description={`${unreadMessageCount} unread`}
          icon={<Mail className="h-4 w-4" />}
          accent={unreadMessageCount > 0 ? 'cyan' : 'muted'}
        />
        <DashboardCard
          title="Media"
          value={mediaCount}
          description="uploaded assets"
          icon={<Eye className="h-4 w-4" />}
          accent="blue"
        />
        <DashboardCard
          title="Activity"
          value={activityCount}
          description="total events logged"
          icon={<History className="h-4 w-4" />}
          accent="dark"
        />
      </div>

      {/* Quick actions */}
      <QuickActions />

      {/* Recent activity + recent projects */}
      <div className="grid grid-cols-1 gap-4 lg:grid-cols-2">
        <Card className="border-border bg-card shadow-card">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-base">
              <History className="h-4 w-4 text-brand-blue" aria-hidden="true" />
              Recent Activity
            </CardTitle>
            <CardDescription>Last 8 actions performed in the CMS</CardDescription>
          </CardHeader>
          <CardContent>
            {recentActivity.length === 0 ? (
              <EmptyState
                title="No activity yet"
                description="Actions performed in the CMS will appear here."
                icon={<History className="h-5 w-5" />}
                compact
              />
            ) : (
              <ActivityLogList items={recentActivity} />
            )}
          </CardContent>
        </Card>

        <Card className="border-border bg-card shadow-card">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-base">
              <FolderGit2 className="h-4 w-4 text-brand-cyan" aria-hidden="true" />
              Recent Projects
            </CardTitle>
            <CardDescription>5 most recently added projects</CardDescription>
          </CardHeader>
          <CardContent>
            {recentProjects.length === 0 ? (
              <EmptyState
                title="No projects yet"
                description="Create your first project to see it here."
                icon={<FolderGit2 className="h-5 w-5" />}
                compact
              />
            ) : (
              <RecentProjectsList items={recentProjects} />
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}

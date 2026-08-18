import { db } from '@/lib/db';

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { CrudPageHeader } from '@/components/admin/crud/crud-page-header';
import { ProjectListClient } from './_components/project-list-client';
import type { ProjectRow } from './_components/types';

export const metadata = {
  title: 'Projects',
};

export const dynamic = 'force-dynamic';

export default async function ProjectsListPage() {
  const projects = await db.project.findMany({
    orderBy: [{ order: 'asc' }, { createdAt: 'desc' }],
  });

  const rows: ProjectRow[] = projects.map((p) => ({
    id: p.id,
    titleEn: p.titleEn,
    titleBn: p.titleBn,
    slug: p.slug,
    thumbnailUrl: p.thumbnailUrl,
    technologies: p.technologies,
    status: p.status,
    isFeatured: p.isFeatured,
    order: p.order,
    createdAt: p.createdAt,
  }));

  return (
    <div className="space-y-6">
      <CrudPageHeader
        title="Projects"
        description={`${rows.length} project${rows.length === 1 ? '' : 's'} in your portfolio`}
        newHref="/admin/projects/new"
        newLabel="Add Project"
      />

      <Card className="border-border bg-card shadow-card">
        <CardHeader className="pb-3">
          <CardTitle className="text-base">All Projects</CardTitle>
          <CardDescription>Manage portfolio projects with bilingual content and tech tags.</CardDescription>
        </CardHeader>
        <CardContent>
          <ProjectListClient data={rows} />
        </CardContent>
      </Card>
    </div>
  );
}

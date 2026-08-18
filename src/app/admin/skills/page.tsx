import { db } from '@/lib/db';

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { CrudPageHeader } from '@/components/admin/crud/crud-page-header';
import { SkillListClient } from './_components/skill-list-client';
import type { SkillRow } from './_components/types';

export const metadata = {
  title: 'Skills',
};

export const dynamic = 'force-dynamic';

export default async function SkillsListPage() {
  const skills = await db.skill.findMany({
    orderBy: [{ order: 'asc' }, { createdAt: 'desc' }],
  });

  const rows: SkillRow[] = skills.map((s) => ({
    id: s.id,
    name: s.name,
    slug: s.slug,
    logoUrl: s.logoUrl,
    category: s.category,
    level: s.level,
    status: s.status,
    order: s.order,
    createdAt: s.createdAt,
  }));

  return (
    <div className="space-y-6">
      <CrudPageHeader
        title="Skills"
        description={`${rows.length} skill${rows.length === 1 ? '' : 's'} in your technology stack`}
        newHref="/admin/skills/new"
        newLabel="Add Skill"
      />

      <Card className="border-border bg-card shadow-card">
        <CardHeader className="pb-3">
          <CardTitle className="text-base">All Skills</CardTitle>
          <CardDescription>Manage your technology skills. Categories group related technologies.</CardDescription>
        </CardHeader>
        <CardContent>
          <SkillListClient data={rows} />
        </CardContent>
      </Card>
    </div>
  );
}

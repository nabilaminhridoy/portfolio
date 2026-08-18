import { db } from '@/lib/db';

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { CrudPageHeader } from '@/components/admin/crud/crud-page-header';
import { ExperienceListClient } from './_components/experience-list-client';
import type { ExperienceRow } from './_components/types';

export const metadata = {
  title: 'Experience',
};

export const dynamic = 'force-dynamic';

export default async function ExperienceListPage() {
  const experiences = await db.experience.findMany({
    // Sort newest → oldest: current first, then most recent start date desc, manual order as tiebreak
    orderBy: [{ current: 'desc' }, { startDate: 'desc' }, { order: 'asc' }],
  });

  const rows: ExperienceRow[] = experiences.map((e) => ({
    id: e.id,
    companyEn: e.companyEn,
    companyBn: e.companyBn,
    roleEn: e.roleEn,
    roleBn: e.roleBn,
    locationEn: e.locationEn,
    locationBn: e.locationBn,
    startDate: e.startDate,
    endDate: e.endDate,
    current: e.current,
    order: e.order,
    createdAt: e.createdAt,
  }));

  return (
    <div className="space-y-6">
      <CrudPageHeader
        title="Experience"
        description={`${rows.length} position${rows.length === 1 ? '' : 's'} in your work history`}
        newHref="/admin/experience/new"
        newLabel="Add Experience"
      />

      <Card className="border-border bg-card shadow-card">
        <CardHeader className="pb-3">
          <CardTitle className="text-base">All Experience</CardTitle>
          <CardDescription>
            Manage your professional work history. Bilingual entries are shown in the public Experience section.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <ExperienceListClient data={rows} />
        </CardContent>
      </Card>
    </div>
  );
}

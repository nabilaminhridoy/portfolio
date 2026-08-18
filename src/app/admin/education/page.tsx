import { db } from '@/lib/db';

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { CrudPageHeader } from '@/components/admin/crud/crud-page-header';
import { EducationListClient } from './_components/education-list-client';
import type { EducationRow } from './_components/types';

export const metadata = {
  title: 'Education',
};

export const dynamic = 'force-dynamic';

export default async function EducationListPage() {
  const education = await db.education.findMany({
    // Sort newest → oldest: current first, then most recent start date desc, manual order as tiebreak
    orderBy: [{ current: 'desc' }, { startDate: 'desc' }, { order: 'asc' }],
  });

  const rows: EducationRow[] = education.map((e) => ({
    id: e.id,
    institutionEn: e.institutionEn,
    institutionBn: e.institutionBn,
    degreeEn: e.degreeEn,
    degreeBn: e.degreeBn,
    fieldEn: e.fieldEn,
    fieldBn: e.fieldBn,
    startDate: e.startDate,
    endDate: e.endDate,
    current: e.current,
    order: e.order,
    createdAt: e.createdAt,
  }));

  return (
    <div className="space-y-6">
      <CrudPageHeader
        title="Education"
        description={`${rows.length} record${rows.length === 1 ? '' : 's'} in your academic history`}
        newHref="/admin/education/new"
        newLabel="Add Education"
      />

      <Card className="border-border bg-card shadow-card">
        <CardHeader className="pb-3">
          <CardTitle className="text-base">All Education</CardTitle>
          <CardDescription>
            Manage your academic background. Bilingual entries are shown in the public Education section.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <EducationListClient data={rows} />
        </CardContent>
      </Card>
    </div>
  );
}

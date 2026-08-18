import { db } from '@/lib/db';
import { ResumeListClient } from './_components/resume-list-client';
import { CrudPageHeader } from '@/components/admin/crud/crud-page-header';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';

export const metadata = {
  title: 'Resume',
};

export const dynamic = 'force-dynamic';

export default async function ResumePage() {
  const resumes = await db.resume.findMany({
    orderBy: [{ isActive: 'desc' }, { createdAt: 'desc' }],
  });

  const rows = resumes.map((r) => ({
    id: r.id,
    fileUrl: r.fileUrl,
    version: r.version,
    summaryEn: r.summaryEn ?? '',
    summaryBn: r.summaryBn ?? '',
    isActive: r.isActive,
    downloadedCount: r.downloadedCount,
    createdAt: r.createdAt,
  }));

  return (
    <div className="space-y-6">
      <CrudPageHeader
        title="Resume"
        description={`${rows.length} resume version${rows.length === 1 ? '' : 's'} — only one can be active at a time`}
        newHref="#new"
        newLabel="Upload New"
      />

      <Card id="new" className="border-border bg-card shadow-card">
        <CardHeader>
          <CardTitle className="text-base">Resume Versions</CardTitle>
          <CardDescription>Manage resume file URLs and mark one as active for the public Resume page</CardDescription>
        </CardHeader>
        <CardContent>
          <ResumeListClient rows={rows} />
        </CardContent>
      </Card>
    </div>
  );
}

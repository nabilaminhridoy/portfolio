import { db } from '@/lib/db';

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { CrudPageHeader } from '@/components/admin/crud/crud-page-header';
import { CertificationListClient } from './_components/certification-list-client';
import type { CertificationRow } from './_components/types';

export const metadata = {
  title: 'Certifications',
};

export const dynamic = 'force-dynamic';

export default async function CertificationsListPage() {
  // Sort newest → oldest: most recent issue date first, manual order as tiebreak
  const certifications = await db.certification.findMany({
    orderBy: [{ issueDate: 'desc' }, { order: 'asc' }],
  });

  const rows: CertificationRow[] = certifications.map((c) => ({
    id: c.id,
    titleEn: c.titleEn,
    titleBn: c.titleBn,
    organization: c.organization,
    credentialId: c.credentialId,
    credentialUrl: c.credentialUrl,
    issueDate: c.issueDate,
    expiryDate: c.expiryDate,
    certificateImageUrl: c.certificateImageUrl,
    skills: c.skills,
    isFeatured: c.isFeatured,
    status: c.status,
    order: c.order,
    createdAt: c.createdAt,
  }));

  return (
    <div className="space-y-6">
      <CrudPageHeader
        title="Certifications"
        description={`${rows.length} certification${rows.length === 1 ? '' : 's'} in your portfolio`}
        newHref="/admin/certifications/new"
        newLabel="Add Certification"
      />

      <Card className="border-border bg-card shadow-card">
        <CardHeader className="pb-3">
          <CardTitle className="text-base">All Certifications</CardTitle>
          <CardDescription>
            Professional certifications — shown on the public Certifications section (conditional).
          </CardDescription>
        </CardHeader>
        <CardContent>
          <CertificationListClient data={rows} />
        </CardContent>
      </Card>
    </div>
  );
}

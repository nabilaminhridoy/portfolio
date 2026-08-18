import { db } from '@/lib/db';

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { CrudPageHeader } from '@/components/admin/crud/crud-page-header';
import { ServiceListClient } from './_components/service-list-client';
import type { ServiceRow } from './_components/types';

export const metadata = {
  title: 'Services',
};

export const dynamic = 'force-dynamic';

export default async function ServicesListPage() {
  const services = await db.service.findMany({
    orderBy: [{ order: 'asc' }, { createdAt: 'desc' }],
  });

  const rows: ServiceRow[] = services.map((s) => ({
    id: s.id,
    titleEn: s.titleEn,
    titleBn: s.titleBn,
    icon: s.icon,
    featuresEn: s.featuresEn,
    featuresBn: s.featuresBn,
    status: s.status,
    order: s.order,
    createdAt: s.createdAt,
  }));

  return (
    <div className="space-y-6">
      <CrudPageHeader
        title="Services"
        description={`${rows.length} service${rows.length === 1 ? '' : 's'} in your portfolio`}
        newHref="/admin/services/new"
        newLabel="Add Service"
      />

      <Card className="border-border bg-card shadow-card">
        <CardHeader className="pb-3">
          <CardTitle className="text-base">All Services</CardTitle>
          <CardDescription>
            Manage the services you offer. Each service has bilingual title, description, and feature list.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <ServiceListClient data={rows} />
        </CardContent>
      </Card>
    </div>
  );
}

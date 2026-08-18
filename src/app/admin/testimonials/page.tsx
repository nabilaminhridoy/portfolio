import { db } from '@/lib/db';

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { CrudPageHeader } from '@/components/admin/crud/crud-page-header';
import { TestimonialListClient } from './_components/testimonial-list-client';
import type { TestimonialRow } from './_components/types';

export const metadata = {
  title: 'Testimonials',
};

export const dynamic = 'force-dynamic';

export default async function TestimonialsListPage() {
  const testimonials = await db.testimonial.findMany({
    orderBy: [{ order: 'asc' }, { createdAt: 'desc' }],
  });

  const rows: TestimonialRow[] = testimonials.map((t) => ({
    id: t.id,
    authorName: t.authorName,
    authorRoleEn: t.authorRoleEn,
    authorRoleBn: t.authorRoleBn,
    companyEn: t.companyEn,
    companyBn: t.companyBn,
    avatarUrl: t.avatarUrl,
    contentEn: t.contentEn,
    contentBn: t.contentBn,
    rating: t.rating,
    status: t.status,
    order: t.order,
    createdAt: t.createdAt,
  }));

  return (
    <div className="space-y-6">
      <CrudPageHeader
        title="Testimonials"
        description={`${rows.length} testimonial${rows.length === 1 ? '' : 's'} from clients and colleagues`}
        newHref="/admin/testimonials/new"
        newLabel="Add Testimonial"
      />

      <Card className="border-border bg-card shadow-card">
        <CardHeader className="pb-3">
          <CardTitle className="text-base">All Testimonials</CardTitle>
          <CardDescription>
            Manage client quotes. Bilingual entries are shown in the public Testimonials section.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <TestimonialListClient data={rows} />
        </CardContent>
      </Card>
    </div>
  );
}

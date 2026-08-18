import { db } from '@/lib/db';
import { SocialLinksClient } from './_components/social-links-client';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { CrudPageHeader } from '@/components/admin/crud/crud-page-header';

export const metadata = {
  title: 'Social Links',
};

export const dynamic = 'force-dynamic';

export default async function SocialLinksPage() {
  const links = await db.socialLink.findMany({
    orderBy: [{ order: 'asc' }, { platform: 'asc' }],
  });

  const rows = links.map((l) => ({
    id: l.id,
    platform: l.platform,
    label: l.label ?? '',
    url: l.url,
    iconUrl: l.iconUrl ?? '',
    isActive: l.isActive,
    order: l.order,
    createdAt: l.createdAt,
    updatedAt: l.updatedAt,
  }));

  return (
    <div className="space-y-6">
      <CrudPageHeader
        title="Social Links"
        description={`${rows.length} link${rows.length === 1 ? '' : 's'} — manage your social media profiles`}
      />

      <Card className="border-border bg-card shadow-card">
        <CardHeader className="pb-3">
          <CardTitle className="text-base">All Social Links</CardTitle>
          <CardDescription>Each platform can have one link. Toggle inactive to hide from public Footer.</CardDescription>
        </CardHeader>
        <CardContent>
          <SocialLinksClient rows={rows} />
        </CardContent>
      </Card>
    </div>
  );
}

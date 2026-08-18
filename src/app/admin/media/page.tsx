import { db } from '@/lib/db';
import { MediaGrid, MediaUploadForm } from './_components/media-grid';
import { CrudPageHeader } from '@/components/admin/crud/crud-page-header';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';

export const metadata = {
  title: 'Media',
};

export const dynamic = 'force-dynamic';

export default async function MediaPage() {
  const mediaItems = await db.media.findMany({
    orderBy: [{ folder: 'asc' }, { createdAt: 'desc' }],
  });

  const rows = mediaItems.map((m) => ({
    id: m.id,
    url: m.url,
    filename: m.filename,
    mimeType: m.mimeType,
    size: m.size,
    altEn: m.altEn ?? '',
    altBn: m.altBn ?? '',
    folder: m.folder,
    createdAt: m.createdAt,
  }));

  const folders = Array.from(new Set(rows.map((r) => r.folder))).sort();

  return (
    <div className="space-y-6">
      <CrudPageHeader
        title="Media Library"
        description={`${rows.length} file${rows.length === 1 ? '' : 's'} in ${folders.length} folder${folders.length === 1 ? '' : 's'}`}
      />

      <MediaUploadForm />

      {folders.length === 0 ? (
        <Card className="border-dashed border-2 border-border bg-muted/30">
          <CardContent className="py-12">
            <p className="text-center text-sm text-muted-foreground">
              No media uploaded yet. Use the form above to add your first file.
            </p>
          </CardContent>
        </Card>
      ) : (
        folders.map((folder) => {
          const items = rows.filter((r) => r.folder === folder);
          return (
            <Card key={folder} className="border-border bg-card shadow-card">
              <CardHeader className="pb-3">
                <CardTitle className="flex items-center gap-2 text-base">
                  <span className="font-mono text-xs text-muted-foreground">/{folder}</span>
                  <Badge className="text-xs">{items.length}</Badge>
                </CardTitle>
                <CardDescription>Folder: {folder}</CardDescription>
              </CardHeader>
              <CardContent>
                <MediaGrid items={items} />
              </CardContent>
            </Card>
          );
        })
      )}
    </div>
  );
}

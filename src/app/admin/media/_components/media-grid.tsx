'use client';

import * as React from 'react';
import { useRouter } from 'next/navigation';
import { toast } from 'sonner';
import { formatDistanceToNow } from 'date-fns';
import { Copy, Trash2, Plus, Loader2, ImageIcon, FileText, File, Check, Pencil } from 'lucide-react';

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { FormField } from '@/components/admin/form-layout';
import { BilingualInput } from '@/components/admin/crud/bilingual-field';
import { DeleteConfirmDialog } from '@/components/admin/crud/delete-confirm-dialog';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from '@/components/ui/dialog';
import { uploadMedia, updateMedia, deleteMedia } from '@/lib/actions/media';

export interface MediaRow {
  id: string;
  url: string;
  filename: string;
  mimeType: string;
  size: number;
  altEn: string;
  altBn: string;
  folder: string;
  createdAt: Date;
}

function formatFileSize(bytes: number): string {
  if (bytes < 1024) return `${bytes} B`;
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
  return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
}

function isImage(mimeType: string): boolean {
  return mimeType.startsWith('image/');
}

function getMediaIcon(mimeType: string): React.ReactNode {
  if (isImage(mimeType)) return <ImageIcon className="h-6 w-6" />;
  if (mimeType.startsWith('text/')) return <FileText className="h-6 w-6" />;
  return <File className="h-6 w-6" />;
}

export function MediaGrid({ items }: { items: MediaRow[] }) {
  const router = useRouter();

  return (
    <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5">
      {items.map((item) => (
        <MediaCard key={item.id} item={item} />
      ))}
    </div>
  );
}

function MediaCard({ item }: { item: MediaRow }) {
  const router = useRouter();
  const [copied, setCopied] = React.useState(false);
  const [isDeleting, setIsDeleting] = React.useState(false);
  const [editOpen, setEditOpen] = React.useState(false);

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(item.url);
      setCopied(true);
      toast.success('URL copied to clipboard');
      setTimeout(() => setCopied(false), 2000);
    } catch {
      toast.error('Failed to copy URL');
    }
  };

  const handleDelete = async () => {
    setIsDeleting(true);
    try {
      const result = await deleteMedia(item.id);
      if (!result.ok) {
        toast.error(result.error ?? 'Failed to delete');
      } else {
        toast.success(`Deleted "${item.filename}"`);
        router.refresh();
      }
    } finally {
      setIsDeleting(false);
    }
  };

  return (
    <div className="group relative flex flex-col overflow-hidden rounded-md border border-border bg-background transition-all hover:shadow-card-hover">
      {/* Preview */}
      <div className="relative aspect-square overflow-hidden bg-muted">
        {isImage(item.mimeType) ? (
          <img
            src={item.url}
            alt={item.altEn || item.filename}
            className="h-full w-full object-cover transition-transform group-hover:scale-105"
            loading="lazy"
          />
        ) : (
          <div className="flex h-full w-full items-center justify-center text-muted-foreground">
            {getMediaIcon(item.mimeType)}
          </div>
        )}
      </div>

      {/* Filename + size */}
      <div className="flex flex-col gap-0.5 p-2.5">
        <p className="truncate text-xs font-medium text-foreground" title={item.filename}>
          {item.filename}
        </p>
        <div className="flex items-center gap-1 text-[10px] text-muted-foreground">
          <span>{formatFileSize(item.size)}</span>
          <span>•</span>
          <time dateTime={item.createdAt.toISOString()}>
            {formatDistanceToNow(item.createdAt, { addSuffix: true })}
          </time>
        </div>
      </div>

      {/* Actions */}
      <div className="flex items-center justify-end gap-1 border-t border-border bg-muted/20 px-2 py-1.5">
        <Button
          size="icon"
          variant="ghost"
          className="h-7 w-7"
          onClick={handleCopy}
          aria-label="Copy URL"
        >
          {copied ? <Check className="h-3 w-3 text-emerald-500" /> : <Copy className="h-3 w-3" />}
        </Button>
        <Button
          size="icon"
          variant="ghost"
          className="h-7 w-7"
          onClick={() => setEditOpen(true)}
          aria-label="Edit media"
        >
          <Pencil className="h-3 w-3" />
        </Button>
        <DeleteConfirmDialog
          trigger={
            <Button
              size="icon"
              variant="ghost"
              className="h-7 w-7 text-destructive hover:bg-destructive/10 hover:text-destructive"
              aria-label="Delete media"
              disabled={isDeleting}
            >
              <Trash2 className="h-3 w-3" />
            </Button>
          }
          title={`Delete "${item.filename}"?`}
          description="This media will be permanently removed. If it's referenced in any content, those references will break."
          confirmLabel="Delete"
          onConfirm={handleDelete}
        />
      </div>

      {/* Edit dialog */}
      <MediaEditDialog
        item={item}
        open={editOpen}
        onOpenChange={setEditOpen}
      />
    </div>
  );
}

function MediaEditDialog({
  item,
  open,
  onOpenChange,
}: {
  item: MediaRow;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}) {
  const router = useRouter();
  const [altEn, setAltEn] = React.useState(item.altEn);
  const [altBn, setAltBn] = React.useState(item.altBn);
  const [folder, setFolder] = React.useState(item.folder);
  const [isSubmitting, setIsSubmitting] = React.useState(false);

  const onSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    try {
      const formData = new FormData();
      formData.set('altEn', altEn);
      formData.set('altBn', altBn);
      formData.set('folder', folder);
      const result = await updateMedia(item.id, formData);
      if (!result.ok) {
        toast.error(result.error ?? 'Failed to update');
      } else {
        toast.success('Media updated');
        onOpenChange(false);
        router.refresh();
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Pencil className="h-4 w-4" />
            Edit Media
          </DialogTitle>
          <DialogDescription>
            Update alt text (for accessibility + SEO) and folder organization
          </DialogDescription>
        </DialogHeader>
        <form onSubmit={onSubmit} className="space-y-4">
          <div className="rounded-md border border-border bg-muted/30 p-3 text-xs">
            <p className="font-medium text-foreground">{item.filename}</p>
            <p className="mt-1 truncate font-mono text-muted-foreground">{item.url}</p>
            <p className="mt-1 text-muted-foreground">{item.mimeType} • {formatFileSize(item.size)}</p>
          </div>

          <BilingualInput
            label="Alt Text"
            enId="altEn" bnId="altBn"
            enValue={altEn} bnValue={altBn}
            onEnChange={setAltEn} onBnChange={setAltBn}
            placeholderEn="Describe the image for screen readers..."
            placeholderBn="স্ক্রিন রিডারের জন্য ছবি বর্ণনা করুন..."
          />

          <FormField label="Folder" htmlFor="folder" description="Lowercase, no spaces. Use 'root' for top-level files.">
            <Input
              id="folder"
              type="text"
              value={folder}
              onChange={(e) => setFolder(e.target.value)}
              placeholder="root"
            />
          </FormField>

          <DialogFooter>
            <Button type="button" variant="outline" onClick={() => onOpenChange(false)}>Cancel</Button>
            <Button type="submit" disabled={isSubmitting} className="gap-2">
              {isSubmitting && <Loader2 className="h-4 w-4 animate-spin" />}
              {isSubmitting ? 'Saving...' : 'Save Changes'}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}

export function MediaUploadForm() {
  const router = useRouter();
  const [url, setUrl] = React.useState('');
  const [filename, setFilename] = React.useState('');
  const [mimeType, setMimeType] = React.useState('image/jpeg');
  const [size, setSize] = React.useState('0');
  const [altEn, setAltEn] = React.useState('');
  const [altBn, setAltBn] = React.useState('');
  const [folder, setFolder] = React.useState('root');
  const [isSubmitting, setIsSubmitting] = React.useState(false);
  const [error, setError] = React.useState<string | null>(null);

  // Auto-guess filename from URL
  React.useEffect(() => {
    if (url && !filename) {
      try {
        const u = new URL(url);
        const last = u.pathname.split('/').pop();
        if (last) setFilename(decodeURIComponent(last));
      } catch {
        // ignore
      }
    }
  }, [url, filename]);

  // Auto-guess mime type from filename extension
  React.useEffect(() => {
    if (filename) {
      const ext = filename.split('.').pop()?.toLowerCase();
      const guesses: Record<string, string> = {
        jpg: 'image/jpeg',
        jpeg: 'image/jpeg',
        png: 'image/png',
        gif: 'image/gif',
        webp: 'image/webp',
        svg: 'image/svg+xml',
        pdf: 'application/pdf',
        txt: 'text/plain',
        json: 'application/json',
        mp4: 'video/mp4',
        webm: 'video/webm',
        mp3: 'audio/mpeg',
        wav: 'audio/wav',
      };
      if (ext && guesses[ext]) {
        setMimeType(guesses[ext]);
      }
    }
  }, [filename]);

  const onSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setError(null);
    setIsSubmitting(true);

    try {
      const formData = new FormData();
      formData.set('url', url);
      formData.set('filename', filename);
      formData.set('mimeType', mimeType);
      formData.set('size', size);
      formData.set('altEn', altEn);
      formData.set('altBn', altBn);
      formData.set('folder', folder);

      const result = await uploadMedia(formData);
      if (!result.ok) {
        setError(result.error ?? 'Failed to upload.');
        toast.error(result.error ?? 'Failed to upload media');
      } else {
        toast.success('Media uploaded');
        setUrl('');
        setFilename('');
        setAltEn('');
        setAltBn('');
        setSize('0');
        router.refresh();
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Card className="border-dashed border-2 border-border bg-muted/30">
      <CardHeader>
        <CardTitle className="flex items-center gap-2 text-base">
          <Plus className="h-4 w-4 text-brand-blue" aria-hidden="true" />
          Add Media by URL
        </CardTitle>
      </CardHeader>
      <CardContent>
        <form onSubmit={onSubmit} className="space-y-5">
          <FormField label="File URL" htmlFor="url" required description="Public URL of the file. Filename + MIME type auto-guess from URL when possible.">
            <Input
              id="url"
              type="url"
              value={url}
              onChange={(e) => setUrl(e.target.value)}
              placeholder="https://example.com/path/to/file.jpg"
              required
            />
          </FormField>

          <div className="grid grid-cols-1 gap-5 sm:grid-cols-3">
            <FormField label="Filename" htmlFor="filename" required>
              <Input
                id="filename"
                type="text"
                value={filename}
                onChange={(e) => setFilename(e.target.value)}
                placeholder="file.jpg"
                required
              />
            </FormField>
            <FormField label="MIME Type" htmlFor="mimeType">
              <Input
                id="mimeType"
                type="text"
                value={mimeType}
                onChange={(e) => setMimeType(e.target.value)}
                placeholder="image/jpeg"
              />
            </FormField>
            <FormField label="Size (bytes)" htmlFor="size">
              <Input
                id="size"
                type="number"
                min={0}
                value={size}
                onChange={(e) => setSize(e.target.value)}
              />
            </FormField>
          </div>

          <BilingualInput
            label="Alt Text"
            enId="altEn" bnId="altBn"
            enValue={altEn} bnValue={altBn}
            onEnChange={setAltEn} onBnChange={setAltBn}
            placeholderEn="Describe for screen readers..."
            placeholderBn="স্ক্রিন রিডারের জন্য বর্ণনা..."
          />

          <FormField label="Folder" htmlFor="folder" description="Use 'root' for top-level files. Create custom folders by typing a new name.">
            <Input
              id="folder"
              type="text"
              value={folder}
              onChange={(e) => setFolder(e.target.value.toLowerCase().replace(/\s+/g, '-'))}
              placeholder="root"
            />
          </FormField>

          {error && (
            <p className="text-sm text-destructive" role="alert">
              {error}
            </p>
          )}

          <div className="flex justify-end">
            <Button type="submit" disabled={isSubmitting} className="gap-2">
              {isSubmitting ? <Loader2 className="h-4 w-4 animate-spin" /> : <Plus className="h-4 w-4" />}
              {isSubmitting ? 'Uploading...' : 'Add Media'}
            </Button>
          </div>
        </form>
      </CardContent>
    </Card>
  );
}

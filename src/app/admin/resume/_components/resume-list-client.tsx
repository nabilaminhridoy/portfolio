'use client';

import * as React from 'react';
import { toast } from 'sonner';
import { formatDistanceToNow } from 'date-fns';
import { FileText, Check, Trash2, Plus, Loader2, ExternalLink } from 'lucide-react';

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import { BilingualTextarea } from '@/components/admin/crud/bilingual-field';
import { FormField } from '@/components/admin/form-layout';
import { DeleteConfirmDialog } from '@/components/admin/crud/delete-confirm-dialog';
import { updateResume, deleteResume, setActiveResume } from '@/lib/actions/resume';

export interface ResumeRow {
  id: string;
  fileUrl: string;
  version: string;
  summaryEn: string;
  summaryBn: string;
  isActive: boolean;
  downloadedCount: number;
  createdAt: Date;
}

export function ResumeListClient({ rows }: { rows: ResumeRow[] }) {
  return (
    <div className="space-y-6">
      {/* Existing resume versions */}
      {rows.length > 0 && (
        <div className="space-y-3">
          {rows.map((r) => (
            <ResumeRowItem key={r.id} row={r} />
          ))}
        </div>
      )}

      {/* New resume upload form */}
      <NewResumeForm />
    </div>
  );
}

function ResumeRowItem({ row }: { row: ResumeRow }) {
  const [isActivating, setIsActivating] = React.useState(false);
  const [isDeleting, setIsDeleting] = React.useState(false);

  const handleActivate = async () => {
    setIsActivating(true);
    try {
      const result = await setActiveResume(row.id);
      if (!result.ok) {
        toast.error(result.error ?? 'Failed to activate');
      } else {
        toast.success(`Resume ${row.version} is now active`);
      }
    } finally {
      setIsActivating(false);
    }
  };

  const handleDelete = async () => {
    setIsDeleting(true);
    try {
      const result = await deleteResume(row.id);
      if (!result.ok) {
        toast.error(result.error ?? 'Failed to delete');
      } else {
        toast.success(`Deleted resume version ${row.version}`);
      }
    } finally {
      setIsDeleting(false);
    }
  };

  return (
    <div className="flex items-start gap-3 rounded-md border border-border bg-background p-4">
      <span className={`mt-0.5 flex h-10 w-10 items-center justify-center rounded-md ${row.isActive ? 'bg-emerald-500/10 text-emerald-600 dark:text-emerald-400' : 'bg-muted text-muted-foreground'}`}>
        <FileText className="h-5 w-5" />
      </span>

      <div className="min-w-0 flex-1 space-y-1">
        <div className="flex items-center gap-2">
          <p className="text-sm font-semibold text-foreground">{row.version}</p>
          {row.isActive && (
            <Badge className="bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 gap-1">
              <Check className="h-3 w-3" />
              Active
            </Badge>
          )}
        </div>
        <p className="truncate font-mono text-xs text-muted-foreground">{row.fileUrl}</p>
        <div className="flex items-center gap-3 text-xs text-muted-foreground">
          <span>{row.downloadedCount} downloads</span>
          <span>•</span>
          <time dateTime={row.createdAt.toISOString()}>
            added {formatDistanceToNow(row.createdAt, { addSuffix: true })}
          </time>
        </div>
      </div>

      <div className="flex items-center gap-1">
        <Button asChild size="icon" variant="ghost" className="h-8 w-8" aria-label="Open file">
          <a href={row.fileUrl} target="_blank" rel="noreferrer">
            <ExternalLink className="h-3.5 w-3.5" />
          </a>
        </Button>
        {!row.isActive && (
          <Button
            size="sm"
            variant="outline"
            onClick={handleActivate}
            disabled={isActivating}
            className="gap-1.5"
          >
            {isActivating ? <Loader2 className="h-3 w-3 animate-spin" /> : <Check className="h-3 w-3" />}
            Set Active
          </Button>
        )}
        <DeleteConfirmDialog
          trigger={
            <Button
              size="icon"
              variant="ghost"
              className="h-8 w-8 text-destructive hover:bg-destructive/10 hover:text-destructive"
              aria-label="Delete resume"
              disabled={isDeleting}
            >
              <Trash2 className="h-3.5 w-3.5" />
            </Button>
          }
          title={`Delete resume ${row.version}?`}
          description="This resume version will be permanently removed. The file URL will no longer be referenced."
          confirmLabel="Delete Resume"
          onConfirm={handleDelete}
        />
      </div>
    </div>
  );
}

function NewResumeForm() {
  const [fileUrl, setFileUrl] = React.useState('');
  const [version, setVersion] = React.useState('');
  const [summaryEn, setSummaryEn] = React.useState('');
  const [summaryBn, setSummaryBn] = React.useState('');
  const [isActive, setIsActive] = React.useState(true);
  const [isSubmitting, setIsSubmitting] = React.useState(false);
  const [error, setError] = React.useState<string | null>(null);

  const onSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setError(null);
    setIsSubmitting(true);

    try {
      const formData = new FormData();
      formData.set('fileUrl', fileUrl);
      formData.set('version', version || 'v1');
      formData.set('summaryEn', summaryEn);
      formData.set('summaryBn', summaryBn);
      if (isActive) formData.set('isActive', 'on');

      const result = await updateResume(formData);
      if (!result.ok) {
        setError(result.error ?? 'Failed to save.');
        toast.error(result.error ?? 'Failed to save resume');
      } else {
        toast.success('Resume added successfully');
        // Reset form
        setFileUrl('');
        setVersion('');
        setSummaryEn('');
        setSummaryBn('');
        setIsActive(true);
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
          Upload New Resume Version
        </CardTitle>
      </CardHeader>
      <CardContent>
        <form onSubmit={onSubmit} className="space-y-5">
          <div className="grid grid-cols-1 gap-5 sm:grid-cols-2">
            <FormField label="File URL" htmlFor="fileUrl" required description="Public URL to your PDF resume file">
              <Input
                id="fileUrl"
                type="url"
                value={fileUrl}
                onChange={(e) => setFileUrl(e.target.value)}
                placeholder="https://...resume-v1.pdf"
                required
              />
            </FormField>
            <FormField label="Version Label" htmlFor="version" description="e.g. v1, v2, 2024-edition">
              <Input
                id="version"
                type="text"
                value={version}
                onChange={(e) => setVersion(e.target.value)}
                placeholder="v1"
              />
            </FormField>
          </div>

          <BilingualTextarea
            label="Summary"
            enId="summaryEn" bnId="summaryBn"
            enValue={summaryEn} bnValue={summaryBn}
            onEnChange={setSummaryEn} onBnChange={setSummaryBn}
            rows={3}
            placeholderEn="Full Stack Developer with 5+ years of experience..."
            placeholderBn="৫+ বছরের অভিজ্ঞতা সহ ফুল স্ট্যাক ডেভেলপার..."
          />

          <div className="flex items-center justify-between rounded-md border border-border bg-background p-3">
            <div className="space-y-0.5">
              <Label htmlFor="isActive" className="text-sm font-medium">
                Set as active resume
              </Label>
              <p className="text-xs text-muted-foreground">
                Only one resume can be active at a time. Other versions will be deactivated.
              </p>
            </div>
            <Switch
              id="isActive"
              checked={isActive}
              onCheckedChange={setIsActive}
              aria-label="Set as active"
            />
          </div>

          {error && (
            <p className="text-sm text-destructive" role="alert">
              {error}
            </p>
          )}

          <div className="flex justify-end">
            <Button type="submit" disabled={isSubmitting} className="gap-2">
              {isSubmitting ? <Loader2 className="h-4 w-4 animate-spin" /> : <Plus className="h-4 w-4" />}
              {isSubmitting ? 'Saving...' : 'Add Resume'}
            </Button>
          </div>
        </form>
      </CardContent>
    </Card>
  );
}

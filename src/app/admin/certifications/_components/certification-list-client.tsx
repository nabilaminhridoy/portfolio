'use client';

import * as React from 'react';
import type { ColumnDef } from '@tanstack/react-table';
import Link from 'next/link';
import { formatDistanceToNow } from 'date-fns';
import { ExternalLink, Pencil, Plus, Award, Star } from 'lucide-react';

import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { DataTable } from '@/components/admin/data-table';
import { EmptyState } from '@/components/feedback/empty-state';
import { CertificationListActions } from './certification-list-actions';
import type { CertificationRow } from './types';

const statusClasses: Record<string, string> = {
  ACTIVE: 'bg-emerald-500/10 text-emerald-600 dark:text-emerald-400',
  DRAFT: 'bg-amber-500/10 text-amber-600 dark:text-amber-400',
};

function formatDate(d: Date): string {
  return d.toLocaleDateString('en-US', { month: 'short', year: 'numeric' });
}

const columns: ColumnDef<CertificationRow>[] = [
  {
    accessorKey: 'titleEn',
    header: 'Certification',
    cell: ({ row }) => (
      <div className="flex items-center gap-3">
        {row.original.certificateImageUrl ? (
          <img
            src={row.original.certificateImageUrl}
            alt={row.original.titleEn}
            className="h-9 w-9 rounded-md border border-border object-contain p-1"
          />
        ) : (
          <span className="flex h-9 w-9 items-center justify-center rounded-md border border-border bg-muted text-muted-foreground">
            <Award className="h-4 w-4" />
          </span>
        )}
        <div className="min-w-0">
          <div className="flex items-center gap-1.5">
            <p className="truncate text-sm font-medium text-foreground">{row.original.titleEn}</p>
            {row.original.isFeatured && (
              <Star className="h-3 w-3 shrink-0 fill-brand-cyan text-brand-cyan" aria-hidden="true" />
            )}
          </div>
          <p className="truncate text-xs text-muted-foreground">{row.original.organization}</p>
        </div>
      </div>
    ),
  },
  {
    accessorKey: 'issueDate',
    header: 'Issued',
    cell: ({ row }) => (
      <div className="text-xs">
        <p className="text-foreground">{formatDate(row.original.issueDate)}</p>
        {row.original.expiryDate && (
          <p className="text-muted-foreground">→ {formatDate(row.original.expiryDate)}</p>
        )}
      </div>
    ),
  },
  {
    accessorKey: 'credentialId',
    header: 'Credential',
    cell: ({ row }) => (
      <div className="text-xs">
        {row.original.credentialId ? (
          <p className="font-mono text-muted-foreground">{row.original.credentialId}</p>
        ) : (
          <span className="text-muted-foreground">—</span>
        )}
      </div>
    ),
  },
  {
    accessorKey: 'status',
    header: 'Status',
    cell: ({ row }) => (
      <Badge className={`text-xs ${statusClasses[row.original.status] ?? statusClasses.DRAFT}`}>
        {row.original.status}
      </Badge>
    ),
  },
  {
    accessorKey: 'order',
    header: 'Order',
    cell: ({ row }) => (
      <span className="font-mono text-xs text-muted-foreground">{row.original.order}</span>
    ),
  },
  {
    id: 'actions',
    header: '',
    cell: ({ row }) => (
      <div className="flex items-center justify-end gap-1">
        {row.original.credentialUrl && (
          <Button asChild size="icon" variant="ghost" className="h-8 w-8" aria-label="Verify credential">
            <a href={row.original.credentialUrl} target="_blank" rel="noreferrer">
              <ExternalLink className="h-3.5 w-3.5" />
            </a>
          </Button>
        )}
        <Button asChild size="icon" variant="ghost" className="h-8 w-8" aria-label="Edit certification">
          <Link href={`/admin/certifications/${row.original.id}`}>
            <Pencil className="h-3.5 w-3.5" />
          </Link>
        </Button>
        <CertificationListActions certification={row.original} />
      </div>
    ),
  },
];

export function CertificationListClient({ data }: { data: CertificationRow[] }) {
  if (data.length === 0) {
    return (
      <EmptyState
        title="No certifications yet"
        description="Add your professional certifications to showcase them on your portfolio."
        icon={<Plus className="h-7 w-7" />}
        actionLabel="Add Certification"
        onAction={() => {
          window.location.href = '/admin/certifications/new';
        }}
      />
    );
  }

  return <DataTable columns={columns} data={data} searchKey="titleEn" searchPlaceholder="Search certifications..." pageSize={10} />;
}

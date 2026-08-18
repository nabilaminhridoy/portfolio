'use client';

import * as React from 'react';
import type { ColumnDef } from '@tanstack/react-table';
import Link from 'next/link';
import { ExternalLink, Pencil, Plus, Star } from 'lucide-react';

import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { DataTable } from '@/components/admin/data-table';
import { EmptyState } from '@/components/feedback/empty-state';
import { ProjectListActions } from './project-list-actions';
import type { ProjectRow } from './types';

const statusClasses: Record<string, string> = {
  PUBLISHED: 'bg-emerald-500/10 text-emerald-600 dark:text-emerald-400',
  DRAFT: 'bg-amber-500/10 text-amber-600 dark:text-amber-400',
  ARCHIVED: 'bg-muted text-muted-foreground',
};

const columns: ColumnDef<ProjectRow>[] = [
  {
    accessorKey: 'titleEn',
    header: 'Project',
    cell: ({ row }) => (
      <div className="flex items-center gap-3">
        {row.original.thumbnailUrl ? (
          <img
            src={row.original.thumbnailUrl}
            alt={row.original.titleEn}
            className="h-10 w-10 rounded-md border border-border object-cover"
          />
        ) : (
          <span className="flex h-10 w-10 items-center justify-center rounded-md border border-border bg-muted text-[10px] font-bold text-muted-foreground">
            {row.original.titleEn.slice(0, 2).toUpperCase()}
          </span>
        )}
        <div className="min-w-0">
          <div className="flex items-center gap-1.5">
            <p className="truncate text-sm font-medium text-foreground">{row.original.titleEn}</p>
            {row.original.isFeatured && (
              <Star className="h-3 w-3 shrink-0 fill-brand-cyan text-brand-cyan" aria-hidden="true" />
            )}
          </div>
          <p className="truncate font-mono text-xs text-muted-foreground">/{row.original.slug}</p>
        </div>
      </div>
    ),
  },
  {
    accessorKey: 'technologies',
    header: 'Tech',
    cell: ({ row }) => {
      const techs = row.original.technologies.split(',').map((t) => t.trim()).filter(Boolean).slice(0, 4);
      if (techs.length === 0) {
        return <span className="text-xs text-muted-foreground">—</span>;
      }
      return (
        <div className="flex flex-wrap gap-1">
          {techs.map((t) => (
            <Badge key={t} variant="outline" className="font-mono text-[10px]">
              {t}
            </Badge>
          ))}
        </div>
      );
    },
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
        {row.original.thumbnailUrl && (
          <Button asChild size="icon" variant="ghost" className="h-8 w-8" aria-label="View thumbnail">
            <a href={row.original.thumbnailUrl} target="_blank" rel="noreferrer">
              <ExternalLink className="h-3.5 w-3.5" />
            </a>
          </Button>
        )}
        <Button asChild size="icon" variant="ghost" className="h-8 w-8" aria-label="Edit project">
          <Link href={`/admin/projects/${row.original.id}`}>
            <Pencil className="h-3.5 w-3.5" />
          </Link>
        </Button>
        <ProjectListActions project={row.original} />
      </div>
    ),
  },
];

export function ProjectListClient({ data }: { data: ProjectRow[] }) {
  if (data.length === 0) {
    return (
      <EmptyState
        title="No projects yet"
        description="Create your first portfolio project to showcase your work."
        icon={<Plus className="h-7 w-7" />}
        actionLabel="Add Project"
        onAction={() => {
          window.location.href = '/admin/projects/new';
        }}
      />
    );
  }

  return <DataTable columns={columns} data={data} searchKey="titleEn" searchPlaceholder="Search projects..." pageSize={10} />;
}

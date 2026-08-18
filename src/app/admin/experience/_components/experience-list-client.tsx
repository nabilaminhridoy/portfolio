'use client';

import * as React from 'react';
import type { ColumnDef } from '@tanstack/react-table';
import Link from 'next/link';
import { formatDistanceToNow } from 'date-fns';
import { Briefcase, Pencil, Plus } from 'lucide-react';

import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { DataTable } from '@/components/admin/data-table';
import { EmptyState } from '@/components/feedback/empty-state';
import { ExperienceListActions } from './experience-list-actions';
import type { ExperienceRow } from './types';

function formatMonthYear(date: Date): string {
  return date.toLocaleDateString('en-US', { month: 'short', year: 'numeric' });
}

function formatPeriod(row: ExperienceRow): string {
  const start = formatMonthYear(row.startDate);
  if (row.current || !row.endDate) return `${start} → Present`;
  return `${start} → ${formatMonthYear(row.endDate)}`;
}

const columns: ColumnDef<ExperienceRow>[] = [
  {
    accessorKey: 'roleEn',
    header: 'Role',
    cell: ({ row }) => (
      <div className="flex items-center gap-3">
        <span className="flex h-7 w-7 shrink-0 items-center justify-center rounded-md border border-border bg-muted text-muted-foreground">
          <Briefcase className="h-3.5 w-3.5" aria-hidden="true" />
        </span>
        <div className="min-w-0">
          <p className="truncate text-sm font-medium text-foreground">{row.original.roleEn}</p>
          <p className="truncate text-xs text-muted-foreground" dir="auto">
            {row.original.roleBn}
          </p>
        </div>
      </div>
    ),
  },
  {
    accessorKey: 'companyEn',
    header: 'Company',
    cell: ({ row }) => (
      <div className="min-w-0">
        <p className="truncate text-sm font-medium text-foreground">{row.original.companyEn}</p>
        {row.original.locationEn && (
          <p className="truncate text-xs text-muted-foreground">{row.original.locationEn}</p>
        )}
      </div>
    ),
  },
  {
    id: 'period',
    header: 'Period',
    cell: ({ row }) => (
      <div className="flex flex-col gap-1">
        <span className="text-xs font-medium text-foreground">{formatPeriod(row.original)}</span>
        <span className="text-[10px] text-muted-foreground">
          {formatDistanceToNow(row.original.createdAt, { addSuffix: true })}
        </span>
      </div>
    ),
  },
  {
    accessorKey: 'current',
    header: 'Status',
    cell: ({ row }) =>
      row.original.current ? (
        <Badge className="bg-emerald-500/10 text-emerald-600 dark:text-emerald-400">Current</Badge>
      ) : (
        <Badge variant="outline" className="text-muted-foreground">
          Past
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
        <Button asChild size="icon" variant="ghost" className="h-8 w-8" aria-label="Edit experience">
          <Link href={`/admin/experience/${row.original.id}`}>
            <Pencil className="h-3.5 w-3.5" />
          </Link>
        </Button>
        <ExperienceListActions experience={row.original} />
      </div>
    ),
  },
];

export function ExperienceListClient({ data }: { data: ExperienceRow[] }) {
  if (data.length === 0) {
    return (
      <EmptyState
        title="No experience yet"
        description="Add your first work experience to showcase your career history."
        icon={<Plus className="h-7 w-7" />}
        actionLabel="Add Experience"
        onAction={() => {
          window.location.href = '/admin/experience/new';
        }}
      />
    );
  }

  return (
    <DataTable
      columns={columns}
      data={data}
      searchKey="companyEn"
      searchPlaceholder="Search by company..."
      pageSize={10}
    />
  );
}

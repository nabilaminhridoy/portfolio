'use client';

import * as React from 'react';
import type { ColumnDef } from '@tanstack/react-table';
import Link from 'next/link';
import { formatDistanceToNow } from 'date-fns';
import { GraduationCap, Pencil, Plus } from 'lucide-react';

import { Button } from '@/components/ui/button';
import { DataTable } from '@/components/admin/data-table';
import { EmptyState } from '@/components/feedback/empty-state';
import { EducationListActions } from './education-list-actions';
import type { EducationRow } from './types';

function formatMonthYear(date: Date): string {
  return date.toLocaleDateString('en-US', { month: 'short', year: 'numeric' });
}

function formatPeriod(row: EducationRow): string {
  const start = formatMonthYear(row.startDate);
  if (row.current || !row.endDate) return `${start} → Present`;
  return `${start} → ${formatMonthYear(row.endDate)}`;
}

const columns: ColumnDef<EducationRow>[] = [
  {
    accessorKey: 'degreeEn',
    header: 'Degree',
    cell: ({ row }) => (
      <div className="flex items-center gap-3">
        <span className="flex h-7 w-7 shrink-0 items-center justify-center rounded-md border border-border bg-muted text-muted-foreground">
          <GraduationCap className="h-3.5 w-3.5" aria-hidden="true" />
        </span>
        <div className="min-w-0">
          <p className="truncate text-sm font-medium text-foreground">{row.original.degreeEn}</p>
          <p className="truncate text-xs text-muted-foreground" dir="auto">
            {row.original.degreeBn}
          </p>
        </div>
      </div>
    ),
  },
  {
    accessorKey: 'institutionEn',
    header: 'Institution',
    cell: ({ row }) => (
      <div className="min-w-0">
        <p className="truncate text-sm font-medium text-foreground">{row.original.institutionEn}</p>
        {row.original.fieldEn && (
          <p className="truncate text-xs text-muted-foreground">{row.original.fieldEn}</p>
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
        <Button asChild size="icon" variant="ghost" className="h-8 w-8" aria-label="Edit education">
          <Link href={`/admin/education/${row.original.id}`}>
            <Pencil className="h-3.5 w-3.5" />
          </Link>
        </Button>
        <EducationListActions education={row.original} />
      </div>
    ),
  },
];

export function EducationListClient({ data }: { data: EducationRow[] }) {
  if (data.length === 0) {
    return (
      <EmptyState
        title="No education records yet"
        description="Add your first degree or certification to showcase your academic background."
        icon={<Plus className="h-7 w-7" />}
        actionLabel="Add Education"
        onAction={() => {
          window.location.href = '/admin/education/new';
        }}
      />
    );
  }

  return (
    <DataTable
      columns={columns}
      data={data}
      searchKey="institutionEn"
      searchPlaceholder="Search by institution..."
      pageSize={10}
    />
  );
}

'use client';

import * as React from 'react';
import type { ColumnDef } from '@tanstack/react-table';
import Link from 'next/link';
import { Pencil, Plus } from 'lucide-react';

import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { DataTable } from '@/components/admin/data-table';
import { EmptyState } from '@/components/feedback/empty-state';
import { SkillListActions } from './skill-list-actions';
import type { SkillRow } from './types';
import { Code2 } from 'lucide-react';

const columns: ColumnDef<SkillRow>[] = [
  {
    accessorKey: 'name',
    header: 'Skill',
    cell: ({ row }) => (
      <div className="flex items-center gap-3">
        {row.original.logoUrl ? (
          <img
            src={row.original.logoUrl}
            alt={row.original.name}
            className="h-7 w-7 rounded-md border border-border object-contain p-1"
          />
        ) : (
          // Clean Code2 fallback for techs without official logos
          <span className="flex h-7 w-7 items-center justify-center rounded-md border border-border bg-muted text-muted-foreground">
            <Code2 className="h-3.5 w-3.5" />
          </span>
        )}
        <div>
          <p className="text-sm font-medium text-foreground">{row.original.name}</p>
          <p className="font-mono text-xs text-muted-foreground">/{row.original.slug}</p>
        </div>
      </div>
    ),
  },
  {
    accessorKey: 'category',
    header: 'Category',
    cell: ({ row }) => (
      <Badge variant="outline" className="font-mono text-xs">
        {row.original.category}
      </Badge>
    ),
  },
  {
    accessorKey: 'level',
    header: 'Level',
    cell: ({ row }) => (
      <div className="flex items-center gap-2">
        <div className="h-1.5 w-16 overflow-hidden rounded-full bg-muted">
          <div
            className="h-full bg-gradient-brand"
            style={{ width: `${row.original.level}%` }}
          />
        </div>
        <span className="text-xs font-semibold text-foreground">{row.original.level}%</span>
      </div>
    ),
  },
  {
    accessorKey: 'status',
    header: 'Status',
    cell: ({ row }) => (
      <Badge
        className={
          row.original.status === 'ACTIVE'
            ? 'bg-emerald-500/10 text-emerald-600 dark:text-emerald-400'
            : 'bg-muted text-muted-foreground'
        }
      >
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
        <Button asChild size="icon" variant="ghost" className="h-8 w-8" aria-label="Edit skill">
          <Link href={`/admin/skills/${row.original.id}`}>
            <Pencil className="h-3.5 w-3.5" />
          </Link>
        </Button>
        <SkillListActions skill={row.original} />
      </div>
    ),
  },
];

export function SkillListClient({ data }: { data: SkillRow[] }) {
  if (data.length === 0) {
    return (
      <EmptyState
        title="No skills yet"
        description="Add your first skill to showcase your tech stack."
        icon={<Plus className="h-7 w-7" />}
        actionLabel="Add Skill"
        onAction={() => {
          window.location.href = '/admin/skills/new';
        }}
      />
    );
  }

  return <DataTable columns={columns} data={data} searchKey="name" searchPlaceholder="Search skills..." pageSize={10} />;
}

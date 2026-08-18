'use client';

import * as React from 'react';
import type { ColumnDef } from '@tanstack/react-table';
import Link from 'next/link';
import {
  Cloud,
  Code2,
  Database,
  Pencil,
  Plus,
  Server,
  Smartphone,
  Palette,
  Globe,
  Zap,
  Layers,
  Cpu,
  ShoppingCart,
  Lock,
  Search,
  LineChart,
  PenTool,
  Sparkles,
  type LucideIcon,
} from 'lucide-react';

import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { DataTable } from '@/components/admin/data-table';
import { EmptyState } from '@/components/feedback/empty-state';
import { ServiceListActions } from './service-list-actions';
import type { ServiceRow } from './types';

const ICON_MAP: Record<string, LucideIcon> = {
  Code2,
  Server,
  Database,
  Cloud,
  Smartphone,
  Palette,
  Globe,
  Zap,
  Layers,
  Cpu,
  ShoppingCart,
  Lock,
  Search,
  LineChart,
  PenTool,
  Sparkles,
};

function countFeatures(features: string): number {
  if (!features) return 0;
  return features
    .split('\n')
    .map((l) => l.trim())
    .filter((l) => l.length > 0)
    .length;
}

function ServiceIcon({ name, title }: { name: string; title: string }) {
  const Icon = ICON_MAP[name] ?? Sparkles;
  return (
    <span className="flex h-7 w-7 items-center justify-center rounded-md border border-border bg-muted text-muted-foreground">
      <Icon className="h-3.5 w-3.5" aria-label={title} />
    </span>
  );
}

const columns: ColumnDef<ServiceRow>[] = [
  {
    accessorKey: 'titleEn',
    header: 'Service',
    cell: ({ row }) => (
      <div className="flex items-center gap-3">
        <ServiceIcon name={row.original.icon} title={row.original.titleEn} />
        <div>
          <p className="text-sm font-medium text-foreground">{row.original.titleEn}</p>
          <p className="text-xs text-muted-foreground" dir="auto">{row.original.titleBn}</p>
        </div>
      </div>
    ),
  },
  {
    id: 'features',
    header: 'Features',
    cell: ({ row }) => {
      const count = countFeatures(row.original.featuresEn);
      return (
        <Badge variant="outline" className="font-mono text-xs">
          {count} feature{count === 1 ? '' : 's'}
        </Badge>
      );
    },
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
        <Button asChild size="icon" variant="ghost" className="h-8 w-8" aria-label="Edit service">
          <Link href={`/admin/services/${row.original.id}`}>
            <Pencil className="h-3.5 w-3.5" />
          </Link>
        </Button>
        <ServiceListActions service={row.original} />
      </div>
    ),
  },
];

export function ServiceListClient({ data }: { data: ServiceRow[] }) {
  if (data.length === 0) {
    return (
      <EmptyState
        title="No services yet"
        description="Add your first service to showcase what you offer."
        icon={<Plus className="h-7 w-7" />}
        actionLabel="Add Service"
        onAction={() => {
          window.location.href = '/admin/services/new';
        }}
      />
    );
  }

  return (
    <DataTable
      columns={columns}
      data={data}
      searchKey="titleEn"
      searchPlaceholder="Search services..."
      pageSize={10}
    />
  );
}

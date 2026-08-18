'use client';

import * as React from 'react';
import type { ColumnDef } from '@tanstack/react-table';
import { formatDistanceToNow } from 'date-fns';

import { Badge } from '@/components/ui/badge';
import { DataTable } from '@/components/admin/data-table';

export interface ActivityLogRow {
  id: string;
  action: string;
  entity: string | null;
  entityId: string | null;
  user: { email: string; name: string | null } | null;
  ip: string | null;
  userAgent: string | null;
  metadata: string | null;
  createdAt: Date;
}

function formatAction(action: string): string {
  return action
    .toLowerCase()
    .split('_')
    .map((w) => w.charAt(0).toUpperCase() + w.slice(1))
    .join(' ');
}

const actionTone = (action: string): string => {
  if (action === 'LOGIN') return 'bg-emerald-500/10 text-emerald-600 dark:text-emerald-400';
  if (action === 'LOGOUT') return 'bg-muted text-muted-foreground';
  if (action === 'PASSWORD_RESET_COMPLETED')
    return 'bg-emerald-500/10 text-emerald-600 dark:text-emerald-400';
  if (action === 'PASSWORD_RESET_REQUESTED')
    return 'bg-amber-500/10 text-amber-600 dark:text-amber-400';
  if (action.startsWith('DELETE')) return 'bg-destructive/10 text-destructive';
  if (action.startsWith('CREATE')) return 'bg-brand-blue/10 text-brand-blue';
  if (action.startsWith('UPDATE')) return 'bg-accent/15 text-foreground dark:text-accent';
  return 'bg-muted text-muted-foreground';
};

/**
 * Client-side wrapper that defines the column shape (which contains
 * `cell` render functions) and forwards data to the DataTable.
 *
 * The page (server component) only fetches data; this client component
 * owns the column defs because they cannot cross the RSC boundary.
 */
export function ActivityTableClient({ data }: { data: ActivityLogRow[] }) {
  const columns: ColumnDef<ActivityLogRow>[] = React.useMemo(
    () => [
      {
        accessorKey: 'action',
        header: 'Action',
        cell: ({ row }) => (
          <div className="flex items-center gap-2">
            <Badge className={`font-mono text-xs ${actionTone(row.original.action)}`}>
              {row.original.action}
            </Badge>
            <span className="text-sm text-foreground">{formatAction(row.original.action)}</span>
          </div>
        ),
      },
      {
        id: 'user',
        accessorKey: 'user.email',
        header: 'User',
        cell: ({ row }) => (
          <div className="flex flex-col">
            <span className="text-sm text-foreground">{row.original.user?.name ?? '—'}</span>
            <span className="font-mono text-xs text-muted-foreground">
              {row.original.user?.email ?? 'unknown'}
            </span>
          </div>
        ),
      },
      {
        accessorKey: 'entity',
        header: 'Entity',
        cell: ({ row }) => (
          <div className="text-sm text-muted-foreground">
            {row.original.entity ? (
              <span>
                {row.original.entity}
                {row.original.entityId && (
                  <span className="ml-1 font-mono text-xs text-muted-foreground/70">
                    #{row.original.entityId.slice(0, 8)}
                  </span>
                )}
              </span>
            ) : (
              '—'
            )}
          </div>
        ),
      },
      {
        accessorKey: 'ip',
        header: 'IP',
        cell: ({ row }) => (
          <span className="font-mono text-xs text-muted-foreground">{row.original.ip ?? '—'}</span>
        ),
      },
      {
        accessorKey: 'createdAt',
        header: 'When',
        cell: ({ row }) => (
          <time
            className="text-xs text-muted-foreground"
            dateTime={row.original.createdAt.toISOString()}
            title={row.original.createdAt.toLocaleString()}
          >
            {formatDistanceToNow(row.original.createdAt, { addSuffix: true })}
          </time>
        ),
      },
    ],
    []
  );

  return (
    <DataTable
      columns={columns}
      data={data}
      searchKey="user.email"
      searchPlaceholder="Search by user email..."
      pageSize={10}
    />
  );
}

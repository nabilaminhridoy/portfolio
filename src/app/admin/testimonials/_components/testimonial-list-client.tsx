'use client';

import * as React from 'react';
import type { ColumnDef } from '@tanstack/react-table';
import Link from 'next/link';
import { formatDistanceToNow } from 'date-fns';
import { Pencil, Plus, Star } from 'lucide-react';

import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { DataTable } from '@/components/admin/data-table';
import { EmptyState } from '@/components/feedback/empty-state';
import { TestimonialListActions } from './testimonial-list-actions';
import type { TestimonialRow } from './types';

function getInitials(name: string): string {
  return name
    .split(/\s+/)
    .filter(Boolean)
    .slice(0, 2)
    .map((part) => part[0]?.toUpperCase() ?? '')
    .join('');
}

function truncate(text: string, max = 60): string {
  if (text.length <= max) return text;
  return `${text.slice(0, max).trimEnd()}…`;
}

function RatingStars({ value }: { value: number }) {
  return (
    <div className="flex items-center gap-0.5" aria-label={`${value} out of 5 stars`}>
      {Array.from({ length: 5 }).map((_, i) => (
        <Star
          key={i}
          className={
            i < value
              ? 'h-3.5 w-3.5 fill-amber-400 text-amber-400'
              : 'h-3.5 w-3.5 text-muted-foreground/40'
          }
          aria-hidden="true"
        />
      ))}
    </div>
  );
}

const columns: ColumnDef<TestimonialRow>[] = [
  {
    accessorKey: 'authorName',
    header: 'Author',
    cell: ({ row }) => (
      <div className="flex items-center gap-3">
        <Avatar className="h-8 w-8 border border-border">
          {row.original.avatarUrl ? (
            <AvatarImage src={row.original.avatarUrl} alt={row.original.authorName} />
          ) : null}
          <AvatarFallback className="text-[10px] font-bold text-muted-foreground">
            {getInitials(row.original.authorName) || '?'}
          </AvatarFallback>
        </Avatar>
        <div className="min-w-0">
          <p className="truncate text-sm font-medium text-foreground">{row.original.authorName}</p>
          {row.original.authorRoleEn && (
            <p className="truncate text-xs text-muted-foreground">{row.original.authorRoleEn}</p>
          )}
        </div>
      </div>
    ),
  },
  {
    accessorKey: 'contentEn',
    header: 'Content',
    cell: ({ row }) => (
      <div className="max-w-md">
        <p className="truncate text-sm text-foreground">{truncate(row.original.contentEn)}</p>
        <p className="mt-0.5 text-[10px] text-muted-foreground">
          {formatDistanceToNow(row.original.createdAt, { addSuffix: true })}
        </p>
      </div>
    ),
  },
  {
    accessorKey: 'rating',
    header: 'Rating',
    cell: ({ row }) => (
      <div className="flex items-center gap-2">
        <RatingStars value={row.original.rating} />
        <span className="font-mono text-xs text-muted-foreground">{row.original.rating}/5</span>
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
        <Button asChild size="icon" variant="ghost" className="h-8 w-8" aria-label="Edit testimonial">
          <Link href={`/admin/testimonials/${row.original.id}`}>
            <Pencil className="h-3.5 w-3.5" />
          </Link>
        </Button>
        <TestimonialListActions testimonial={row.original} />
      </div>
    ),
  },
];

export function TestimonialListClient({ data }: { data: TestimonialRow[] }) {
  if (data.length === 0) {
    return (
      <EmptyState
        title="No testimonials yet"
        description="Add your first testimonial to showcase social proof from clients and colleagues."
        icon={<Plus className="h-7 w-7" />}
        actionLabel="Add Testimonial"
        onAction={() => {
          window.location.href = '/admin/testimonials/new';
        }}
      />
    );
  }

  return (
    <DataTable
      columns={columns}
      data={data}
      searchKey="authorName"
      searchPlaceholder="Search by author..."
      pageSize={10}
    />
  );
}

import * as React from 'react';
import { formatDistanceToNow } from 'date-fns';
import { ExternalLink, Star } from 'lucide-react';
import { cn } from '@/lib/utils';

interface ProjectEntry {
  id: string;
  slug: string;
  titleEn: string;
  status: string;
  isFeatured: boolean;
  createdAt: Date;
}

const statusClasses: Record<string, string> = {
  PUBLISHED: 'bg-emerald-500/10 text-emerald-600 dark:text-emerald-400',
  DRAFT: 'bg-amber-500/10 text-amber-600 dark:text-amber-400',
  ARCHIVED: 'bg-muted text-muted-foreground',
};

export function RecentProjectsList({ items }: { items: ProjectEntry[] }) {
  return (
    <ul className="space-y-1">
      {items.map((item) => (
        <li
          key={item.id}
          className="flex items-center gap-3 rounded-md px-2 py-1.5 transition-colors hover:bg-muted/40"
        >
          <div className="min-w-0 flex-1 space-y-0.5">
            <div className="flex items-center gap-1.5">
              <p className="truncate text-sm font-medium text-foreground">{item.titleEn}</p>
              {item.isFeatured && (
                <Star className="h-3 w-3 shrink-0 fill-brand-cyan text-brand-cyan" aria-hidden="true" />
              )}
            </div>
            <p className="truncate font-mono text-xs text-muted-foreground">/{item.slug}</p>
          </div>
          <span
            className={cn(
              'shrink-0 rounded-md px-2 py-0.5 text-[10px] font-semibold uppercase tracking-wider',
              statusClasses[item.status] ?? statusClasses.DRAFT
            )}
          >
            {item.status}
          </span>
          <time
            className="shrink-0 text-xs text-muted-foreground"
            dateTime={item.createdAt.toISOString()}
            title={item.createdAt.toLocaleString()}
          >
            {formatDistanceToNow(item.createdAt, { addSuffix: true })}
          </time>
          <a
            href={`/#projects`}
            className="shrink-0 text-muted-foreground hover:text-foreground"
            aria-label="View project"
          >
            <ExternalLink className="h-3.5 w-3.5" />
          </a>
        </li>
      ))}
    </ul>
  );
}

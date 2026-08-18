import * as React from 'react';
import { formatDistanceToNow } from 'date-fns';
import { Activity, LogIn, LogOut, KeyRound } from 'lucide-react';

import { cn } from '@/lib/utils';

interface ActivityEntry {
  id: string;
  action: string;
  entity?: string | null;
  entityId?: string | null;
  user?: { email: string; name?: string | null } | null;
  createdAt: Date;
}

const actionIcons: Record<string, { icon: React.ElementType; tone: string }> = {
  LOGIN: { icon: LogIn, tone: 'bg-emerald-500/10 text-emerald-600 dark:text-emerald-400' },
  LOGOUT: { icon: LogOut, tone: 'bg-muted text-muted-foreground' },
  PASSWORD_RESET_REQUESTED: { icon: KeyRound, tone: 'bg-amber-500/10 text-amber-600 dark:text-amber-400' },
  PASSWORD_RESET_COMPLETED: { icon: KeyRound, tone: 'bg-emerald-500/10 text-emerald-600 dark:text-emerald-400' },
};

const defaultIcon = Activity;
const defaultTone = 'bg-brand-blue/10 text-brand-blue';

function formatAction(action: string): string {
  return action
    .toLowerCase()
    .split('_')
    .map((w) => w.charAt(0).toUpperCase() + w.slice(1))
    .join(' ');
}

export function ActivityLogList({ items }: { items: ActivityEntry[] }) {
  return (
    <ul className="space-y-1">
      {items.map((item) => {
        const meta = actionIcons[item.action] ?? { icon: defaultIcon, tone: defaultTone };
        const Icon = meta.icon;
        return (
          <li
            key={item.id}
            className="flex items-start gap-3 rounded-md px-2 py-1.5 transition-colors hover:bg-muted/40"
          >
            <span
              className={cn(
                'mt-0.5 flex h-7 w-7 shrink-0 items-center justify-center rounded-md',
                meta.tone
              )}
            >
              <Icon className="h-3.5 w-3.5" aria-hidden="true" />
            </span>
            <div className="min-w-0 flex-1 space-y-0.5">
              <p className="text-sm font-medium text-foreground">
                {formatAction(item.action)}
              </p>
              <p className="truncate text-xs text-muted-foreground">
                {item.user?.email ?? 'Unknown user'}
                {item.entity ? ` · ${item.entity}` : ''}
              </p>
            </div>
            <time
              className="shrink-0 text-xs text-muted-foreground"
              dateTime={item.createdAt.toISOString()}
              title={item.createdAt.toLocaleString()}
            >
              {formatDistanceToNow(item.createdAt, { addSuffix: true })}
            </time>
          </li>
        );
      })}
    </ul>
  );
}

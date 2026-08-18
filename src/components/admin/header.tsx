'use client';

import * as React from 'react';
import { Search, Bell, Settings, ShieldCheck, History, LogOut, User } from 'lucide-react';
import { formatDistanceToNow } from 'date-fns';
import { cn } from '@/lib/utils';

import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { LogoMark } from '@/components/public/logo-mark';
import { SidebarTrigger } from '@/components/ui/sidebar';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from '@/components/ui/breadcrumb';

export interface BreadcrumbItemData {
  label: string;
  href?: string;
}

export interface NotificationItem {
  id: string;
  action: string;
  entity: string | null;
  createdAt: string;
  userEmail: string | null;
}

export interface AdminHeaderProps {
  breadcrumbs?: BreadcrumbItemData[];
  userName?: string;
  userEmail?: string;
  notifications?: NotificationItem[];
  logoUrl?: string;
  onSearch?: (value: string) => void;
  className?: string;
}

function formatAction(action: string): string {
  return action
    .toLowerCase()
    .split('_')
    .map((w) => w.charAt(0).toUpperCase() + w.slice(1))
    .join(' ');
}

const actionColor: Record<string, string> = {
  LOGIN: 'bg-emerald-500/10 text-emerald-600 dark:text-emerald-400',
  LOGOUT: 'bg-muted text-muted-foreground',
  CREATE: 'bg-brand-blue/10 text-brand-blue',
  UPDATE: 'bg-accent/15 text-foreground dark:text-accent',
  DELETE: 'bg-destructive/10 text-destructive',
};

function getActionColor(action: string): string {
  if (action.startsWith('CREATE')) return actionColor.CREATE;
  if (action.startsWith('UPDATE')) return actionColor.UPDATE;
  if (action.startsWith('DELETE')) return actionColor.DELETE;
  if (action === 'LOGIN') return actionColor.LOGIN;
  if (action === 'LOGOUT') return actionColor.LOGOUT;
  return 'bg-muted text-muted-foreground';
}

export function AdminHeader({
  breadcrumbs = [],
  userName = 'Nabil Amin Hridoy',
  userEmail = '',
  notifications = [],
  logoUrl,
  onSearch,
  className,
}: AdminHeaderProps) {
  return (
    <header
      className={cn(
        'sticky top-0 z-30 flex h-16 items-center gap-3 border-b border-border bg-background/80 px-4 backdrop-blur supports-[backdrop-filter]:bg-background/60 sm:px-6',
        className
      )}
    >
      {/* Sidebar trigger */}
      <SidebarTrigger className="lg:hidden" />

      {/* Breadcrumb */}
      {breadcrumbs.length > 0 && (
        <Breadcrumb className="hidden md:flex">
          <BreadcrumbList>
            {breadcrumbs.map((item, idx) => {
              const isLast = idx === breadcrumbs.length - 1;
              return (
                <React.Fragment key={`${item.label}-${idx}`}>
                  <BreadcrumbItem>
                    {isLast || !item.href ? (
                      <BreadcrumbPage className="text-sm font-medium text-foreground">
                        {item.label}
                      </BreadcrumbPage>
                    ) : (
                      <BreadcrumbLink href={item.href} className="text-sm text-muted-foreground">
                        {item.label}
                      </BreadcrumbLink>
                    )}
                  </BreadcrumbItem>
                  {!isLast && <BreadcrumbSeparator />}
                </React.Fragment>
              );
            })}
          </BreadcrumbList>
        </Breadcrumb>
      )}

      {/* Right side: search + notifications + profile */}
      <div className="ml-auto flex items-center gap-2">
        {/* Search */}
        <div className="hidden items-center gap-2 md:flex">
          <div className="relative">
            <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
            <Input
              type="search"
              placeholder="Search..."
              onChange={(e) => onSearch?.(e.target.value)}
              className="h-9 w-48 pl-9 text-sm lg:w-64"
              aria-label="Admin search"
            />
          </div>
        </div>

        {/* Notifications dropdown */}
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button
              variant="ghost"
              size="icon"
              className="relative h-9 w-9"
              aria-label="Notifications"
            >
              <Bell className="h-4 w-4" />
              {notifications.length > 0 && (
                <span className="absolute right-1.5 top-1.5 flex h-2.5 w-2.5 items-center justify-center rounded-full bg-brand-cyan">
                  <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-brand-cyan opacity-75" />
                </span>
              )}
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="w-80">
            <DropdownMenuLabel className="flex items-center justify-between">
              <span>Notifications</span>
              <span className="text-xs font-normal text-muted-foreground">{notifications.length} recent</span>
            </DropdownMenuLabel>
            <DropdownMenuSeparator />
            {notifications.length === 0 ? (
              <div className="py-6 text-center text-sm text-muted-foreground">
                No recent activity
              </div>
            ) : (
              <div className="max-h-80 overflow-y-auto">
                {notifications.map((n) => (
                  <DropdownMenuItem key={n.id} className="flex items-start gap-2 py-2">
                    <span className={cn('mt-0.5 flex h-7 w-7 shrink-0 items-center justify-center rounded-md text-[10px] font-bold', getActionColor(n.action))}>
                      {n.action.charAt(0)}
                    </span>
                    <div className="min-w-0 flex-1 space-y-0.5">
                      <p className="truncate text-sm font-medium text-foreground">
                        {formatAction(n.action)}
                      </p>
                      <p className="truncate text-xs text-muted-foreground">
                        {n.entity ? `${n.entity}` : n.userEmail ?? 'System'}
                      </p>
                      <p className="text-[10px] text-muted-foreground/70">
                        {formatDistanceToNow(new Date(n.createdAt), { addSuffix: true })}
                      </p>
                    </div>
                  </DropdownMenuItem>
                ))}
              </div>
            )}
            <DropdownMenuSeparator />
            <DropdownMenuItem asChild>
              <a href="/admin/activity-logs" className="flex items-center justify-center gap-2 text-sm font-medium text-primary">
                <History className="h-3.5 w-3.5" />
                View All Activity Logs
              </a>
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>

        {/* Profile dropdown — shows logo image if configured, otherwise LogoMark */}
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <button
              className="flex h-9 w-9 items-center justify-center overflow-hidden rounded-full border border-border bg-gradient-brand p-0 cursor-pointer focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
              aria-label="Profile menu"
            >
              {logoUrl ? (
                <img src={logoUrl} alt="Logo" className="h-full w-full object-cover" />
              ) : (
                <LogoMark size={22} />
              )}
            </button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="w-56">
            <DropdownMenuLabel className="flex flex-col gap-0.5">
              <span className="text-sm font-semibold">{userName}</span>
              <span className="text-xs font-normal text-muted-foreground">{userEmail}</span>
            </DropdownMenuLabel>
            <DropdownMenuSeparator />
            <DropdownMenuItem asChild>
              <a href="/admin/profile" className="flex items-center gap-2 text-sm">
                <User className="h-4 w-4" />
                Profile
              </a>
            </DropdownMenuItem>
            <DropdownMenuItem asChild>
              <a href="/admin/security" className="flex items-center gap-2 text-sm">
                <ShieldCheck className="h-4 w-4" />
                Security
              </a>
            </DropdownMenuItem>
            <DropdownMenuItem asChild>
              <a href="/admin/activity-logs" className="flex items-center gap-2 text-sm">
                <History className="h-4 w-4" />
                Activity Logs
              </a>
            </DropdownMenuItem>
            <DropdownMenuSeparator />
            <DropdownMenuItem asChild>
              <a href="/logout" className="flex items-center gap-2 text-sm text-destructive hover:text-destructive">
                <LogOut className="h-4 w-4" />
                Logout
              </a>
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </header>
  );
}

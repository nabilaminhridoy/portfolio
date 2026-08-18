'use client';

import * as React from 'react';
import { usePathname } from 'next/navigation';
import { useSession } from 'next-auth/react';

import { AdminSidebar } from '@/components/admin/sidebar';
import { AdminHeader } from '@/components/admin/header';
import { SidebarInset, SidebarProvider } from '@/components/ui/sidebar';
import { getRouteMeta } from '../_lib/breadcrumbs';

export interface NotificationItem {
  id: string;
  action: string;
  entity: string | null;
  createdAt: string;
  userEmail: string | null;
}

export interface AdminShellProps {
  children: React.ReactNode;
  user?: { name?: string | null; email?: string | null };
  notifications?: NotificationItem[];
  logoUrl?: string;
}

export function AdminShell({ children, user, notifications = [], logoUrl }: AdminShellProps) {
  const pathname = usePathname();
  const { data: session } = useSession();
  const [mounted, setMounted] = React.useState(false);

  React.useEffect(() => setMounted(true), []);

  const userName = session?.user?.name ?? user?.name ?? 'Admin';
  const email = session?.user?.email ?? user?.email ?? '';

  const { breadcrumbs, title } = getRouteMeta(pathname);

  // Prevent Radix UI hydration mismatch — only render interactive Radix components
  // (DropdownMenu, AlertDialog, etc.) after client mount.
  // Admin pages don't benefit from SSR (they require auth anyway).
  if (!mounted) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-muted/20">
        <div className="text-sm text-muted-foreground">Loading admin panel...</div>
      </div>
    );
  }

  return (
    <div className="flex min-h-screen flex-col">
      <SidebarProvider style={{ '--sidebar-height': 'auto' } as React.CSSProperties}>
        <AdminSidebar activeHref={pathname} />
        <SidebarInset className="flex-1">
          <AdminHeader
            breadcrumbs={breadcrumbs}
            userName={userName ?? undefined}
            userEmail={email}
            notifications={notifications}
            logoUrl={logoUrl}
          />
          <main className="flex-1 space-y-6 bg-muted/20 p-4 sm:p-6">
            <div className="space-y-1">
              <h1 className="text-h3 font-bold tracking-tight text-foreground">
                {title}
              </h1>
              <p className="text-sm text-muted-foreground">{email}</p>
            </div>
            {children}
          </main>
        </SidebarInset>
      </SidebarProvider>
      <footer className="border-t border-border bg-background px-6 py-3 text-center text-xs text-muted-foreground">
        &copy; {new Date().getFullYear()} Nabil Amin Hridoy. All rights reserved.
      </footer>
    </div>
  );
}

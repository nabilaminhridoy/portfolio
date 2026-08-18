'use client';

import * as React from 'react';
import {
  LayoutDashboard,
  BarChart3,
  User,
  Code2,
  FolderGit2,
  Wrench,
  Briefcase,
  GraduationCap,
  Award,
  Quote,
  FileText,
  Image as ImageIcon,
  Megaphone,
  LineChart,
  Search,
  Mail,
  Share2,
  Globe,
  type LucideIcon,
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { LogoMark } from '@/components/public/logo-mark';

import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarGroupLabel,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuSub,
  SidebarMenuSubButton,
  SidebarTrigger,
} from '@/components/ui/sidebar';

type NavItem = {
  label: string;
  href: string;
  icon: LucideIcon;
  badge?: string;
};

type NavGroup = {
  label: string;
  items: NavItem[];
};

const navGroups: NavGroup[] = [
  {
    label: 'Admin',
    items: [
      { label: 'Dashboard', href: '/admin/dashboard', icon: LayoutDashboard },
      { label: 'Analytics', href: '/admin/analytics', icon: BarChart3 },
    ],
  },
  {
    label: 'Content',
    items: [
      { label: 'About', href: '/admin/about', icon: User },
      { label: 'Skills', href: '/admin/skills', icon: Code2 },
      { label: 'Projects', href: '/admin/projects', icon: FolderGit2 },
      { label: 'Services', href: '/admin/services', icon: Wrench },
      { label: 'Experience', href: '/admin/experience', icon: Briefcase },
      { label: 'Education', href: '/admin/education', icon: GraduationCap },
      { label: 'Certifications', href: '/admin/certifications', icon: Award },
      { label: 'Testimonials', href: '/admin/testimonials', icon: Quote },
      { label: 'Resume', href: '/admin/resume', icon: FileText },
      { label: 'Media', href: '/admin/media', icon: ImageIcon },
    ],
  },
  {
    label: 'Marketing',
    items: [
      { label: 'Marketing', href: '/admin/marketing', icon: Megaphone },
      { label: 'Tracking', href: '/admin/tracking', icon: LineChart },
    ],
  },
  {
    label: 'SEO',
    items: [
      { label: 'SEO Settings', href: '/admin/seo', icon: Search },
      { label: 'Google', href: '/admin/seo/google', icon: Search },
      { label: 'Bing', href: '/admin/seo/bing', icon: Search },
    ],
  },
  {
    label: 'Integrations',
    items: [
      { label: 'SMTP', href: '/admin/smtp', icon: Mail },
      { label: 'Social Links', href: '/admin/social-links', icon: Share2 },
    ],
  },
  {
    label: 'System',
    items: [
      { label: 'Settings', href: '/admin/settings', icon: Globe },
    ],
  },
];

export interface AdminSidebarProps {
  activeHref?: string;
  onNavigate?: (href: string) => void;
}

/**
 * AdminSidebar — collapsible premium sidebar for the CMS.
 * Uses shadcn/ui sidebar primitive, grouped nav with lucide icons.
 * Brand-tinted: dark sidebar in both themes for premium feel.
 */
export function AdminSidebar({ activeHref, onNavigate }: AdminSidebarProps) {
  return (
    <Sidebar className="border-r border-sidebar-border bg-sidebar" style={{ position: 'sticky', bottom: 'auto', height: 'auto' } as React.CSSProperties}>
      <SidebarHeader className="flex h-16 items-center border-b border-sidebar-border px-4">
        <div className="flex items-center gap-2">
          <LogoMark size={28} />
          <div className="flex flex-col">
            <span className="text-sm font-semibold leading-tight text-sidebar-foreground">
              Nabil Amin Hridoy
            </span>
            <span className="text-xs text-muted-foreground">Portfolio CMS</span>
          </div>
        </div>
      </SidebarHeader>

      <SidebarContent className="overflow-y-auto px-2 py-3">
        {navGroups.map((group) => (
          <SidebarGroup key={group.label}>
            <SidebarGroupLabel className="px-3 text-xs font-semibold uppercase tracking-wider text-muted-foreground">
              {group.label}
            </SidebarGroupLabel>
            <SidebarMenu>
              {group.items.map((item) => {
                const isActive = activeHref === item.href;
                const Icon = item.icon;
                return (
                  <SidebarMenuButton
                    key={item.href}
                    asChild
                    isActive={isActive}
                    onClick={() => onNavigate?.(item.href)}
                    className="gap-3 px-3 text-sm"
                  >
                    <a href={item.href} className={cn('group', isActive && 'font-medium')}>
                      <Icon className="h-4 w-4 shrink-0" aria-hidden="true" />
                      <span>{item.label}</span>
                      {item.badge && (
                        <span className="ml-auto rounded-full bg-primary/10 px-1.5 py-0.5 text-xs font-medium text-primary">
                          {item.badge}
                        </span>
                      )}
                    </a>
                  </SidebarMenuButton>
                );
              })}
            </SidebarMenu>
          </SidebarGroup>
        ))}
      </SidebarContent>

    </Sidebar>
  );
}

export { SidebarTrigger };

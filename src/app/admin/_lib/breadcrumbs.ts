import type { BreadcrumbItemData } from '@/components/admin/header';

interface RouteMeta {
  breadcrumbs: BreadcrumbItemData[];
  title: string;
}

const NOT_FOUND: RouteMeta = {
  breadcrumbs: [{ label: 'Admin', href: '/admin/dashboard' }],
  title: 'Admin',
};

/**
 * Build breadcrumbs + page title for a given admin route.
 * Single source of truth for admin route metadata.
 */
const ROUTE_MAP: Record<string, RouteMeta> = {
  '/admin/dashboard': {
    breadcrumbs: [
      { label: 'Admin', href: '/admin/dashboard' },
      { label: 'Dashboard' },
    ],
    title: 'Dashboard',
  },
  '/admin/analytics': {
    breadcrumbs: [
      { label: 'Admin', href: '/admin/dashboard' },
      { label: 'Analytics' },
    ],
    title: 'Analytics',
  },
  '/admin/about': {
    breadcrumbs: [
      { label: 'Admin', href: '/admin/dashboard' },
      { label: 'Content', href: '/admin/about' },
      { label: 'About' },
    ],
    title: 'About',
  },
  '/admin/skills': {
    breadcrumbs: [
      { label: 'Admin', href: '/admin/dashboard' },
      { label: 'Content', href: '/admin/skills' },
      { label: 'Skills' },
    ],
    title: 'Skills',
  },
  '/admin/projects': {
    breadcrumbs: [
      { label: 'Admin', href: '/admin/dashboard' },
      { label: 'Content', href: '/admin/projects' },
      { label: 'Projects' },
    ],
    title: 'Projects',
  },
  '/admin/services': {
    breadcrumbs: [
      { label: 'Admin', href: '/admin/dashboard' },
      { label: 'Content', href: '/admin/services' },
      { label: 'Services' },
    ],
    title: 'Services',
  },
  '/admin/experience': {
    breadcrumbs: [
      { label: 'Admin', href: '/admin/dashboard' },
      { label: 'Content', href: '/admin/experience' },
      { label: 'Experience' },
    ],
    title: 'Experience',
  },
  '/admin/education': {
    breadcrumbs: [
      { label: 'Admin', href: '/admin/dashboard' },
      { label: 'Content', href: '/admin/education' },
      { label: 'Education' },
    ],
    title: 'Education',
  },
  '/admin/certifications': {
    breadcrumbs: [
      { label: 'Admin', href: '/admin/dashboard' },
      { label: 'Content', href: '/admin/certifications' },
      { label: 'Certifications' },
    ],
    title: 'Certifications',
  },
  '/admin/testimonials': {
    breadcrumbs: [
      { label: 'Admin', href: '/admin/dashboard' },
      { label: 'Content', href: '/admin/testimonials' },
      { label: 'Testimonials' },
    ],
    title: 'Testimonials',
  },
  '/admin/resume': {
    breadcrumbs: [
      { label: 'Admin', href: '/admin/dashboard' },
      { label: 'Content', href: '/admin/resume' },
      { label: 'Resume' },
    ],
    title: 'Resume',
  },
  '/admin/media': {
    breadcrumbs: [
      { label: 'Admin', href: '/admin/dashboard' },
      { label: 'Content', href: '/admin/media' },
      { label: 'Media' },
    ],
    title: 'Media',
  },
  '/admin/marketing': {
    breadcrumbs: [
      { label: 'Admin', href: '/admin/dashboard' },
      { label: 'Marketing', href: '/admin/marketing' },
      { label: 'Marketing' },
    ],
    title: 'Marketing',
  },
  '/admin/tracking': {
    breadcrumbs: [
      { label: 'Admin', href: '/admin/dashboard' },
      { label: 'Marketing', href: '/admin/tracking' },
      { label: 'Tracking' },
    ],
    title: 'Tracking',
  },
  '/admin/seo': {
    breadcrumbs: [
      { label: 'Admin', href: '/admin/dashboard' },
      { label: 'SEO', href: '/admin/seo' },
      { label: 'SEO Settings' },
    ],
    title: 'SEO Settings',
  },
  '/admin/seo/google': {
    breadcrumbs: [
      { label: 'Admin', href: '/admin/dashboard' },
      { label: 'SEO', href: '/admin/seo' },
      { label: 'Google Search Console' },
    ],
    title: 'Google Search Console',
  },
  '/admin/seo/bing': {
    breadcrumbs: [
      { label: 'Admin', href: '/admin/dashboard' },
      { label: 'SEO', href: '/admin/seo' },
      { label: 'Bing Webmaster' },
    ],
    title: 'Bing Webmaster',
  },
  '/admin/smtp': {
    breadcrumbs: [
      { label: 'Admin', href: '/admin/dashboard' },
      { label: 'Integrations', href: '/admin/smtp' },
      { label: 'SMTP' },
    ],
    title: 'SMTP',
  },
  '/admin/social-links': {
    breadcrumbs: [
      { label: 'Admin', href: '/admin/dashboard' },
      { label: 'Integrations', href: '/admin/social-links' },
      { label: 'Social Links' },
    ],
    title: 'Social Links',
  },
  '/admin/profile': {
    breadcrumbs: [
      { label: 'Admin', href: '/admin/dashboard' },
      { label: 'System', href: '/admin/profile' },
      { label: 'Profile' },
    ],
    title: 'Profile',
  },
  '/admin/security': {
    breadcrumbs: [
      { label: 'Admin', href: '/admin/dashboard' },
      { label: 'System', href: '/admin/security' },
      { label: 'Security' },
    ],
    title: 'Security',
  },
  '/admin/activity-logs': {
    breadcrumbs: [
      { label: 'Admin', href: '/admin/dashboard' },
      { label: 'System', href: '/admin/activity-logs' },
      { label: 'Activity Logs' },
    ],
    title: 'Activity Logs',
  },
  '/admin/settings': {
    breadcrumbs: [
      { label: 'Admin', href: '/admin/dashboard' },
      { label: 'System', href: '/admin/settings' },
      { label: 'Settings' },
    ],
    title: 'Settings',
  },
};

export function getRouteMeta(pathname: string): RouteMeta {
  // Exact match first
  if (ROUTE_MAP[pathname]) return ROUTE_MAP[pathname];

  // Try matching with sub-paths stripped (e.g. /admin/projects/some-id → /admin/projects)
  for (const route of Object.keys(ROUTE_MAP).sort((a, b) => b.length - a.length)) {
    if (pathname.startsWith(route + '/')) {
      return ROUTE_MAP[route]!;
    }
  }

  return NOT_FOUND;
}

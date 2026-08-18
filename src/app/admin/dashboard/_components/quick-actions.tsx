'use client';

import * as React from 'react';
import Link from 'next/link';
import { Plus, FileText, Code2, FolderGit2, Settings as SettingsIcon } from 'lucide-react';

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

const actions = [
  {
    label: 'Add Project',
    href: '/admin/projects',
    icon: FolderGit2,
    description: 'Create a new portfolio project',
  },
  {
    label: 'Add Skill',
    href: '/admin/skills',
    icon: Code2,
    description: 'Add a new technology to your skill set',
  },
  {
    label: 'Update About',
    href: '/admin/about',
    icon: Plus,
    description: 'Edit your bio and personal info',
  },
  {
    label: 'Resume',
    href: '/admin/resume',
    icon: FileText,
    description: 'Upload a new resume version',
  },
  {
    label: 'Site Settings',
    href: '/admin/settings',
    icon: SettingsIcon,
    description: 'Configure default locale and theme',
  },
];

export function QuickActions() {
  return (
    <Card className="border-border bg-card shadow-card">
      <CardHeader>
        <CardTitle className="text-base">Quick Actions</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-1 gap-2 sm:grid-cols-2 lg:grid-cols-5">
          {actions.map((action) => {
            const Icon = action.icon;
            return (
              <Link
                key={action.href}
                href={action.href}
                className="group flex flex-col gap-1.5 rounded-md border border-border bg-background p-3 transition-all hover:border-primary/40 hover:shadow-card-hover"
              >
                <div className="flex items-center gap-2">
                  <span className="flex h-8 w-8 items-center justify-center rounded-md bg-primary/10 text-primary transition-colors group-hover:bg-primary group-hover:text-primary-foreground">
                    <Icon className="h-4 w-4" aria-hidden="true" />
                  </span>
                  <p className="text-sm font-medium text-foreground">{action.label}</p>
                </div>
                <p className="text-xs text-muted-foreground">{action.description}</p>
              </Link>
            );
          })}
        </div>
      </CardContent>
    </Card>
  );
}

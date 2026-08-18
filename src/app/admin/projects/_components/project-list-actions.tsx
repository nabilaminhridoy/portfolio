'use client';

import * as React from 'react';
import { useRouter } from 'next/navigation';
import { toast } from 'sonner';
import { Trash2 } from 'lucide-react';

import { Button } from '@/components/ui/button';
import { DeleteConfirmDialog } from '@/components/admin/crud/delete-confirm-dialog';
import { deleteProject } from '@/lib/actions/projects';
import type { ProjectRow } from './types';

export function ProjectListActions({ project }: { project: ProjectRow }) {
  const router = useRouter();
  const [isDeleting, setIsDeleting] = React.useState(false);

  const handleDelete = async () => {
    setIsDeleting(true);
    try {
      const result = await deleteProject(project.id);
      if (!result.ok) {
        toast.error(result.error ?? 'Failed to delete project');
      } else {
        toast.success(`Deleted "${project.titleEn}"`);
        router.refresh();
      }
    } finally {
      setIsDeleting(false);
    }
  };

  return (
    <DeleteConfirmDialog
      trigger={
        <Button
          size="icon"
          variant="ghost"
          className="h-8 w-8 text-destructive hover:bg-destructive/10 hover:text-destructive"
          aria-label="Delete project"
          disabled={isDeleting}
        >
          <Trash2 className="h-3.5 w-3.5" />
        </Button>
      }
      title={`Delete "${project.titleEn}"?`}
      description="This project will be permanently removed. This action cannot be undone."
      confirmLabel="Delete Project"
      onConfirm={handleDelete}
    />
  );
}

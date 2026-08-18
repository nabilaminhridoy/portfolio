'use client';

import * as React from 'react';
import { useRouter } from 'next/navigation';
import { toast } from 'sonner';
import { Trash2 } from 'lucide-react';

import { Button } from '@/components/ui/button';
import { DeleteConfirmDialog } from '@/components/admin/crud/delete-confirm-dialog';
import { deleteEducation } from '@/lib/actions/education';
import type { EducationRow } from './types';

export function EducationListActions({ education }: { education: EducationRow }) {
  const router = useRouter();
  const [isDeleting, setIsDeleting] = React.useState(false);

  const handleDelete = async () => {
    setIsDeleting(true);
    try {
      const result = await deleteEducation(education.id);
      if (!result.ok) {
        toast.error(result.error ?? 'Failed to delete education record');
      } else {
        toast.success(`Deleted "${education.degreeEn}" at ${education.institutionEn}`);
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
          aria-label="Delete education record"
          disabled={isDeleting}
        >
          <Trash2 className="h-3.5 w-3.5" />
        </Button>
      }
      title={`Delete "${education.degreeEn}" at "${education.institutionEn}"?`}
      description="This education record will be permanently removed from your portfolio. This action cannot be undone."
      confirmLabel="Delete Education"
      onConfirm={handleDelete}
    />
  );
}

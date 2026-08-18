'use client';

import * as React from 'react';
import { useRouter } from 'next/navigation';
import { toast } from 'sonner';
import { Trash2 } from 'lucide-react';

import { Button } from '@/components/ui/button';
import { DeleteConfirmDialog } from '@/components/admin/crud/delete-confirm-dialog';
import { deleteCertification } from '@/lib/actions/certifications';
import type { CertificationRow } from './types';

export function CertificationListActions({ certification }: { certification: CertificationRow }) {
  const router = useRouter();
  const [isDeleting, setIsDeleting] = React.useState(false);

  const handleDelete = async () => {
    setIsDeleting(true);
    try {
      const result = await deleteCertification(certification.id);
      if (!result.ok) {
        toast.error(result.error ?? 'Failed to delete certification');
      } else {
        toast.success(`Deleted "${certification.titleEn}"`);
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
          aria-label="Delete certification"
          disabled={isDeleting}
        >
          <Trash2 className="h-3.5 w-3.5" />
        </Button>
      }
      title={`Delete "${certification.titleEn}"?`}
      description="This certification will be permanently removed. This action cannot be undone."
      confirmLabel="Delete Certification"
      onConfirm={handleDelete}
    />
  );
}

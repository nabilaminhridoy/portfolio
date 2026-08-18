'use client';

import * as React from 'react';
import { useRouter } from 'next/navigation';
import { toast } from 'sonner';
import { Trash2 } from 'lucide-react';

import { Button } from '@/components/ui/button';
import { DeleteConfirmDialog } from '@/components/admin/crud/delete-confirm-dialog';
import { deleteService } from '@/lib/actions/services';
import type { ServiceRow } from './types';

export function ServiceListActions({ service }: { service: ServiceRow }) {
  const router = useRouter();
  const [isDeleting, setIsDeleting] = React.useState(false);

  const handleDelete = async () => {
    setIsDeleting(true);
    try {
      const result = await deleteService(service.id);
      if (!result.ok) {
        toast.error(result.error ?? 'Failed to delete service');
      } else {
        toast.success(`Deleted "${service.titleEn}"`);
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
          aria-label="Delete service"
          disabled={isDeleting}
        >
          <Trash2 className="h-3.5 w-3.5" />
        </Button>
      }
      title={`Delete "${service.titleEn}"?`}
      description="This service will be permanently removed from your portfolio. This action cannot be undone."
      confirmLabel="Delete Service"
      onConfirm={handleDelete}
    />
  );
}

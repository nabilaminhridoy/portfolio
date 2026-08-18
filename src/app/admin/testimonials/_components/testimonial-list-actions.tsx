'use client';

import * as React from 'react';
import { useRouter } from 'next/navigation';
import { toast } from 'sonner';
import { Trash2 } from 'lucide-react';

import { Button } from '@/components/ui/button';
import { DeleteConfirmDialog } from '@/components/admin/crud/delete-confirm-dialog';
import { deleteTestimonial } from '@/lib/actions/testimonials';
import type { TestimonialRow } from './types';

export function TestimonialListActions({ testimonial }: { testimonial: TestimonialRow }) {
  const router = useRouter();
  const [isDeleting, setIsDeleting] = React.useState(false);

  const handleDelete = async () => {
    setIsDeleting(true);
    try {
      const result = await deleteTestimonial(testimonial.id);
      if (!result.ok) {
        toast.error(result.error ?? 'Failed to delete testimonial');
      } else {
        toast.success(`Deleted testimonial from "${testimonial.authorName}"`);
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
          aria-label="Delete testimonial"
          disabled={isDeleting}
        >
          <Trash2 className="h-3.5 w-3.5" />
        </Button>
      }
      title={`Delete testimonial from "${testimonial.authorName}"?`}
      description="This testimonial will be permanently removed from your portfolio. This action cannot be undone."
      confirmLabel="Delete Testimonial"
      onConfirm={handleDelete}
    />
  );
}

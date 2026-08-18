'use client';

import * as React from 'react';
import { useRouter } from 'next/navigation';
import { toast } from 'sonner';
import { Star } from 'lucide-react';

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Slider } from '@/components/ui/slider';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { FormField } from '@/components/admin/form-layout';
import {
  BilingualInput,
  BilingualTextarea,
} from '@/components/admin/crud/bilingual-field';
import { RecordFormShell } from '@/components/admin/crud/record-form-shell';
import { createTestimonial, updateTestimonial } from '@/lib/actions/testimonials';

export interface TestimonialFormData {
  id?: string;
  authorName: string;
  authorRoleEn: string;
  authorRoleBn: string;
  companyEn: string;
  companyBn: string;
  avatarUrl: string;
  contentEn: string;
  contentBn: string;
  rating: number;
  status: string;
  order: number;
}

const STATUS_OPTIONS = [
  { value: 'ACTIVE', label: 'Active' },
  { value: 'DRAFT', label: 'Draft' },
];

function RatingPreview({ value }: { value: number }) {
  return (
    <div className="flex items-center gap-1" aria-label={`${value} out of 5 stars`}>
      {Array.from({ length: 5 }).map((_, i) => (
        <Star
          key={i}
          className={
            i < value
              ? 'h-5 w-5 fill-amber-400 text-amber-400'
              : 'h-5 w-5 text-muted-foreground/40'
          }
          aria-hidden="true"
        />
      ))}
    </div>
  );
}

export function TestimonialForm({
  initial,
  mode,
}: {
  initial: TestimonialFormData;
  mode: 'create' | 'edit';
}) {
  const router = useRouter();
  const [authorName, setAuthorName] = React.useState(initial.authorName);
  const [authorRoleEn, setAuthorRoleEn] = React.useState(initial.authorRoleEn);
  const [authorRoleBn, setAuthorRoleBn] = React.useState(initial.authorRoleBn);
  const [companyEn, setCompanyEn] = React.useState(initial.companyEn);
  const [companyBn, setCompanyBn] = React.useState(initial.companyBn);
  const [avatarUrl, setAvatarUrl] = React.useState(initial.avatarUrl);
  const [contentEn, setContentEn] = React.useState(initial.contentEn);
  const [contentBn, setContentBn] = React.useState(initial.contentBn);
  const [rating, setRating] = React.useState(initial.rating);
  const [status, setStatus] = React.useState(initial.status);
  const [order, setOrder] = React.useState(initial.order);
  const [isSubmitting, setIsSubmitting] = React.useState(false);
  const [error, setError] = React.useState<string | null>(null);

  const onSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setError(null);
    setIsSubmitting(true);

    try {
      const formData = new FormData();
      formData.set('authorName', authorName);
      formData.set('authorRoleEn', authorRoleEn);
      formData.set('authorRoleBn', authorRoleBn);
      formData.set('companyEn', companyEn);
      formData.set('companyBn', companyBn);
      formData.set('avatarUrl', avatarUrl);
      formData.set('contentEn', contentEn);
      formData.set('contentBn', contentBn);
      formData.set('rating', String(rating));
      formData.set('status', status);
      formData.set('order', String(order));

      const result =
        mode === 'create'
          ? await createTestimonial(formData)
          : await updateTestimonial(initial.id!, formData);

      if (!result.ok) {
        setError(result.error ?? 'Failed to save.');
        toast.error(result.error ?? 'Failed to save testimonial');
      } else {
        toast.success(
          mode === 'create'
            ? 'Testimonial created successfully'
            : 'Testimonial updated successfully',
        );
        router.push('/admin/testimonials');
        router.refresh();
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <RecordFormShell
      title={mode === 'create' ? 'Add Testimonial' : `Edit: ${initial.authorName}`}
      description={
        mode === 'create'
          ? 'Add a new client or colleague quote to your testimonials'
          : `Editing testimonial from ${initial.authorName}`
      }
      backHref="/admin/testimonials"
      onSubmit={onSubmit}
      submitLabel={mode === 'create' ? 'Create Testimonial' : 'Save Changes'}
      isSubmitting={isSubmitting}
    >
      {/* Author + company card */}
      <Card className="border-border bg-card shadow-card">
        <CardHeader>
          <CardTitle className="text-lg">Author & Company</CardTitle>
          <CardDescription>Who wrote this testimonial?</CardDescription>
        </CardHeader>
        <CardContent className="space-y-5">
          <FormField label="Author Name" htmlFor="authorName" required>
            <Input
              id="authorName"
              type="text"
              value={authorName}
              onChange={(e) => setAuthorName(e.target.value)}
              placeholder="Jane Doe"
              required
              autoFocus
            />
          </FormField>

          <BilingualInput
            label="Author Role"
            enId="authorRoleEn" bnId="authorRoleBn"
            enValue={authorRoleEn} bnValue={authorRoleBn}
            onEnChange={setAuthorRoleEn} onBnChange={setAuthorRoleBn}
            description="Optional — e.g. Senior Product Manager."
            placeholderEn="Senior Product Manager"
            placeholderBn="সিনিয়র প্রোডাক্ট ম্যানেজার"
          />

          <BilingualInput
            label="Company"
            enId="companyEn" bnId="companyBn"
            enValue={companyEn} bnValue={companyBn}
            onEnChange={setCompanyEn} onBnChange={setCompanyBn}
            description="Optional — company / organization name."
            placeholderEn="Acme Corporation"
            placeholderBn="অ্যাকমি কর্পোরেশন"
          />

          <FormField label="Avatar URL" htmlFor="avatarUrl" description="Optional — square image works best (e.g. 128x128).">
            <Input
              id="avatarUrl"
              type="url"
              value={avatarUrl}
              onChange={(e) => setAvatarUrl(e.target.value)}
              placeholder="https://example.com/jane-doe.jpg"
            />
          </FormField>
        </CardContent>
      </Card>

      {/* Content card */}
      <Card className="border-border bg-card shadow-card">
        <CardHeader>
          <CardTitle className="text-lg">Testimonial Content</CardTitle>
          <CardDescription>Bilingual quote text. Keep it concise and authentic.</CardDescription>
        </CardHeader>
        <CardContent>
          <BilingualTextarea
            label="Content"
            enId="contentEn" bnId="contentBn"
            enValue={contentEn} bnValue={contentBn}
            onEnChange={setContentEn} onBnChange={setContentBn}
            required
            rows={3}
            placeholderEn="Working with Nabil was an absolute pleasure — he shipped ahead of schedule..."
            placeholderBn="নাবিলের সাথে কাজ করা একটি চমৎকার অভিজ্ঞতা ছিল — তিনি সময়ের আগেই ডেলিভারি দিয়েছিলেন..."
          />
        </CardContent>
      </Card>

      {/* Rating + status + order card */}
      <Card className="border-border bg-card shadow-card">
        <CardHeader>
          <CardTitle className="text-lg">Rating & Visibility</CardTitle>
          <CardDescription>Star rating, status, and ordering for the public Testimonials section.</CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <Label htmlFor="rating" className="text-sm font-medium">
                Rating
              </Label>
              <div className="flex items-center gap-3">
                <RatingPreview value={rating} />
                <span className="font-mono text-sm font-semibold text-foreground">{rating}/5</span>
              </div>
            </div>
            <Slider
              id="rating"
              value={[rating]}
              onValueChange={(vals) => setRating(vals[0] ?? 5)}
              min={1}
              max={5}
              step={1}
              aria-label="Testimonial rating"
            />
            <p className="text-xs text-muted-foreground">1 (poor) → 5 (excellent). Shown as filled stars.</p>
          </div>

          <div className="grid grid-cols-1 gap-5 sm:grid-cols-2">
            <FormField label="Status" htmlFor="status" description="Draft testimonials are hidden from the public site.">
              <Select value={status} onValueChange={setStatus}>
                <SelectTrigger id="status">
                  <SelectValue placeholder="Select status" />
                </SelectTrigger>
                <SelectContent>
                  {STATUS_OPTIONS.map((opt) => (
                    <SelectItem key={opt.value} value={opt.value}>{opt.label}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </FormField>

            <FormField label="Display Order" htmlFor="order" description="Lower numbers appear first.">
              <Input
                id="order"
                type="number"
                min={0}
                value={order}
                onChange={(e) => setOrder(parseInt(e.target.value, 10) || 0)}
              />
            </FormField>
          </div>
        </CardContent>
      </Card>

      {error && (
        <p className="text-sm text-destructive" role="alert">
          {error}
        </p>
      )}
    </RecordFormShell>
  );
}

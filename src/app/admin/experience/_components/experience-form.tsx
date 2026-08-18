'use client';

import * as React from 'react';
import { useRouter } from 'next/navigation';
import { toast } from 'sonner';

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import { FormField } from '@/components/admin/form-layout';
import {
  BilingualInput,
  BilingualTextarea,
} from '@/components/admin/crud/bilingual-field';
import { RecordFormShell } from '@/components/admin/crud/record-form-shell';
import { createExperience, updateExperience } from '@/lib/actions/experience';

export interface ExperienceFormData {
  id?: string;
  companyEn: string;
  companyBn: string;
  roleEn: string;
  roleBn: string;
  descriptionEn: string;
  descriptionBn: string;
  locationEn: string;
  locationBn: string;
  /** ISO yyyy-mm-dd */
  startDate: string;
  /** ISO yyyy-mm-dd, or '' if none */
  endDate: string;
  current: boolean;
  order: number;
}

/** Convert a Date (or ISO string) into the yyyy-mm-dd format required by <input type="date">. */
function toDateInputValue(date: Date | string | null | undefined): string {
  if (!date) return '';
  const d = typeof date === 'string' ? new Date(date) : date;
  if (Number.isNaN(d.getTime())) return '';
  const year = d.getUTCFullYear();
  const month = String(d.getUTCMonth() + 1).padStart(2, '0');
  const day = String(d.getUTCDate()).padStart(2, '0');
  return `${year}-${month}-${day}`;
}

export function ExperienceForm({
  initial,
  mode,
}: {
  initial: ExperienceFormData;
  mode: 'create' | 'edit';
}) {
  const router = useRouter();
  const [companyEn, setCompanyEn] = React.useState(initial.companyEn);
  const [companyBn, setCompanyBn] = React.useState(initial.companyBn);
  const [roleEn, setRoleEn] = React.useState(initial.roleEn);
  const [roleBn, setRoleBn] = React.useState(initial.roleBn);
  const [descriptionEn, setDescriptionEn] = React.useState(initial.descriptionEn);
  const [descriptionBn, setDescriptionBn] = React.useState(initial.descriptionBn);
  const [locationEn, setLocationEn] = React.useState(initial.locationEn);
  const [locationBn, setLocationBn] = React.useState(initial.locationBn);
  const [startDate, setStartDate] = React.useState(initial.startDate);
  const [endDate, setEndDate] = React.useState(initial.endDate);
  const [current, setCurrent] = React.useState(initial.current);
  const [order, setOrder] = React.useState(initial.order);
  const [isSubmitting, setIsSubmitting] = React.useState(false);
  const [error, setError] = React.useState<string | null>(null);

  // When "current" is enabled, end date is irrelevant — clear it so the server
  // always sees an empty string and persists null.
  React.useEffect(() => {
    if (current && endDate) {
      setEndDate('');
    }
  }, [current, endDate]);

  const onSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setError(null);
    setIsSubmitting(true);

    try {
      const formData = new FormData();
      formData.set('companyEn', companyEn);
      formData.set('companyBn', companyBn);
      formData.set('roleEn', roleEn);
      formData.set('roleBn', roleBn);
      formData.set('descriptionEn', descriptionEn);
      formData.set('descriptionBn', descriptionBn);
      formData.set('locationEn', locationEn);
      formData.set('locationBn', locationBn);
      formData.set('startDate', startDate);
      formData.set('endDate', endDate);
      formData.set('current', current ? 'on' : 'off');
      formData.set('order', String(order));

      const result =
        mode === 'create'
          ? await createExperience(formData)
          : await updateExperience(initial.id!, formData);

      if (!result.ok) {
        setError(result.error ?? 'Failed to save.');
        toast.error(result.error ?? 'Failed to save experience');
      } else {
        toast.success(
          mode === 'create'
            ? 'Experience created successfully'
            : 'Experience updated successfully',
        );
        router.push('/admin/experience');
        router.refresh();
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <RecordFormShell
      title={mode === 'create' ? 'Add Experience' : `Edit: ${initial.roleEn}`}
      description={
        mode === 'create'
          ? 'Add a new role to your professional work history'
          : `Editing ${initial.roleEn} at ${initial.companyEn}`
      }
      backHref="/admin/experience"
      onSubmit={onSubmit}
      submitLabel={mode === 'create' ? 'Create Experience' : 'Save Changes'}
      isSubmitting={isSubmitting}
    >
      {/* Role + Company card */}
      <Card className="border-border bg-card shadow-card">
        <CardHeader>
          <CardTitle className="text-lg">Role & Company</CardTitle>
          <CardDescription>Bilingual — appears in the public Experience section header.</CardDescription>
        </CardHeader>
        <CardContent className="space-y-5">
          <BilingualInput
            label="Role"
            enId="roleEn" bnId="roleBn"
            enValue={roleEn} bnValue={roleBn}
            onEnChange={setRoleEn} onBnChange={setRoleBn}
            required
            placeholderEn="Senior Software Engineer"
            placeholderBn="সিনিয়র সফটওয়্যার ইঞ্জিনিয়ার"
          />

          <BilingualInput
            label="Company"
            enId="companyEn" bnId="companyBn"
            enValue={companyEn} bnValue={companyBn}
            onEnChange={setCompanyEn} onBnChange={setCompanyBn}
            required
            placeholderEn="Acme Corporation"
            placeholderBn="অ্যাকমি কর্পোরেশন"
          />

          <BilingualInput
            label="Location"
            enId="locationEn" bnId="locationBn"
            enValue={locationEn} bnValue={locationBn}
            onEnChange={setLocationEn} onBnChange={setLocationBn}
            description="Optional — city / remote / hybrid."
            placeholderEn="Dhaka, Bangladesh (Remote)"
            placeholderBn="ঢাকা, বাংলাদেশ (রিমোট)"
          />
        </CardContent>
      </Card>

      {/* Description card */}
      <Card className="border-border bg-card shadow-card">
        <CardHeader>
          <CardTitle className="text-lg">Description</CardTitle>
          <CardDescription>Bilingual summary of responsibilities and achievements.</CardDescription>
        </CardHeader>
        <CardContent>
          <BilingualTextarea
            label="Description"
            enId="descriptionEn" bnId="descriptionBn"
            enValue={descriptionEn} bnValue={descriptionBn}
            onEnChange={setDescriptionEn} onBnChange={setDescriptionBn}
            required
            rows={4}
            placeholderEn="Led a team of 5 engineers building the core API platform..."
            placeholderBn="৫ জন ইঞ্জিনিয়ারের একটি দলকে নেতৃত্ব দিয়ে কোর এপিআই প্ল্যাটফর্ম তৈরি..."
          />
        </CardContent>
      </Card>

      {/* Dates + current + order card */}
      <Card className="border-border bg-card shadow-card">
        <CardHeader>
          <CardTitle className="text-lg">Timeline & Ordering</CardTitle>
          <CardDescription>
            Start date is required. End date is optional only if this is a current position.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-5">
          <div className="grid grid-cols-1 gap-5 sm:grid-cols-2">
            <FormField label="Start Date" htmlFor="startDate" required>
              <Input
                id="startDate"
                type="date"
                value={startDate}
                onChange={(e) => setStartDate(e.target.value)}
                required
              />
            </FormField>
            <FormField
              label="End Date"
              htmlFor="endDate"
              description={current ? 'Disabled — you currently work here.' : 'Required if not current.'}
            >
              <Input
                id="endDate"
                type="date"
                value={endDate}
                onChange={(e) => setEndDate(e.target.value)}
                disabled={current}
              />
            </FormField>
          </div>

          <div className="flex items-center justify-between rounded-lg border border-border bg-muted/30 px-4 py-3">
            <div className="space-y-0.5">
              <Label htmlFor="current" className="text-sm font-medium">
                I currently work here
              </Label>
              <p className="text-xs text-muted-foreground">
                Toggling this on clears the end date and shows &quot;Present&quot; in the public timeline.
              </p>
            </div>
            <Switch
              id="current"
              checked={current}
              onCheckedChange={setCurrent}
              aria-label="I currently work here"
            />
          </div>

          <FormField label="Display Order" htmlFor="order" description="Lower numbers appear first in the Experience section.">
            <Input
              id="order"
              type="number"
              min={0}
              value={order}
              onChange={(e) => setOrder(parseInt(e.target.value, 10) || 0)}
            />
          </FormField>
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

/** Exported so server pages can normalise Date → yyyy-mm-dd for the form. */
export { toDateInputValue };

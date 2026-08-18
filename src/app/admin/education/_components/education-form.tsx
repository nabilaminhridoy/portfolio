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
import { createEducation, updateEducation } from '@/lib/actions/education';

export interface EducationFormData {
  id?: string;
  institutionEn: string;
  institutionBn: string;
  degreeEn: string;
  degreeBn: string;
  fieldEn: string;
  fieldBn: string;
  descriptionEn: string;
  descriptionBn: string;
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

export function EducationForm({
  initial,
  mode,
}: {
  initial: EducationFormData;
  mode: 'create' | 'edit';
}) {
  const router = useRouter();
  const [institutionEn, setInstitutionEn] = React.useState(initial.institutionEn);
  const [institutionBn, setInstitutionBn] = React.useState(initial.institutionBn);
  const [degreeEn, setDegreeEn] = React.useState(initial.degreeEn);
  const [degreeBn, setDegreeBn] = React.useState(initial.degreeBn);
  const [fieldEn, setFieldEn] = React.useState(initial.fieldEn);
  const [fieldBn, setFieldBn] = React.useState(initial.fieldBn);
  const [descriptionEn, setDescriptionEn] = React.useState(initial.descriptionEn);
  const [descriptionBn, setDescriptionBn] = React.useState(initial.descriptionBn);
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
      formData.set('institutionEn', institutionEn);
      formData.set('institutionBn', institutionBn);
      formData.set('degreeEn', degreeEn);
      formData.set('degreeBn', degreeBn);
      formData.set('fieldEn', fieldEn);
      formData.set('fieldBn', fieldBn);
      formData.set('descriptionEn', descriptionEn);
      formData.set('descriptionBn', descriptionBn);
      formData.set('startDate', startDate);
      formData.set('endDate', endDate);
      formData.set('current', current ? 'on' : 'off');
      formData.set('order', String(order));

      const result =
        mode === 'create'
          ? await createEducation(formData)
          : await updateEducation(initial.id!, formData);

      if (!result.ok) {
        setError(result.error ?? 'Failed to save.');
        toast.error(result.error ?? 'Failed to save education record');
      } else {
        toast.success(
          mode === 'create'
            ? 'Education record created successfully'
            : 'Education record updated successfully',
        );
        router.push('/admin/education');
        router.refresh();
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <RecordFormShell
      title={mode === 'create' ? 'Add Education' : `Edit: ${initial.degreeEn}`}
      description={
        mode === 'create'
          ? 'Add a new degree or certification to your academic history'
          : `Editing ${initial.degreeEn} at ${initial.institutionEn}`
      }
      backHref="/admin/education"
      onSubmit={onSubmit}
      submitLabel={mode === 'create' ? 'Create Education' : 'Save Changes'}
      isSubmitting={isSubmitting}
    >
      {/* Degree + Institution card */}
      <Card className="border-border bg-card shadow-card">
        <CardHeader>
          <CardTitle className="text-lg">Degree & Institution</CardTitle>
          <CardDescription>Bilingual — appears in the public Education section header.</CardDescription>
        </CardHeader>
        <CardContent className="space-y-5">
          <BilingualInput
            label="Degree"
            enId="degreeEn" bnId="degreeBn"
            enValue={degreeEn} bnValue={degreeBn}
            onEnChange={setDegreeEn} onBnChange={setDegreeBn}
            required
            placeholderEn="B.Sc. in Computer Science"
            placeholderBn="বিএসসি ইন কম্পিউটার সায়েন্স"
          />

          <BilingualInput
            label="Institution"
            enId="institutionEn" bnId="institutionBn"
            enValue={institutionEn} bnValue={institutionBn}
            onEnChange={setInstitutionEn} onBnChange={setInstitutionBn}
            required
            placeholderEn="University of Dhaka"
            placeholderBn="ঢাকা বিশ্ববিদ্যালয়"
          />

          <BilingualInput
            label="Field of Study"
            enId="fieldEn" bnId="fieldBn"
            enValue={fieldEn} bnValue={fieldBn}
            onEnChange={setFieldEn} onBnChange={setFieldBn}
            description="Optional — e.g. Software Engineering, Data Science."
            placeholderEn="Software Engineering"
            placeholderBn="সফটওয়্যার ইঞ্জিনিয়ারিং"
          />
        </CardContent>
      </Card>

      {/* Description card */}
      <Card className="border-border bg-card shadow-card">
        <CardHeader>
          <CardTitle className="text-lg">Description</CardTitle>
          <CardDescription>Bilingual summary of coursework, achievements, or thesis.</CardDescription>
        </CardHeader>
        <CardContent>
          <BilingualTextarea
            label="Description"
            enId="descriptionEn" bnId="descriptionBn"
            enValue={descriptionEn} bnValue={descriptionBn}
            onEnChange={setDescriptionEn} onBnChange={setDescriptionBn}
            rows={4}
            placeholderEn="Graduated with honors. Thesis on distributed systems..."
            placeholderBn="স্নাতক সম্মান সহ। বিতরণকৃত সিস্টেমের উপর থিসিস..."
          />
        </CardContent>
      </Card>

      {/* Dates + current + order card */}
      <Card className="border-border bg-card shadow-card">
        <CardHeader>
          <CardTitle className="text-lg">Timeline & Ordering</CardTitle>
          <CardDescription>
            Start date is required. End date is optional only if you are currently enrolled.
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
              description={current ? 'Disabled — you currently study here.' : 'Required if not currently enrolled.'}
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
                I currently study here
              </Label>
              <p className="text-xs text-muted-foreground">
                Toggling this on clears the end date and shows &quot;Present&quot; in the public timeline.
              </p>
            </div>
            <Switch
              id="current"
              checked={current}
              onCheckedChange={setCurrent}
              aria-label="I currently study here"
            />
          </div>

          <FormField label="Display Order" htmlFor="order" description="Lower numbers appear first in the Education section.">
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

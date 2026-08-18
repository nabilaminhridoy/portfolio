'use client';

import * as React from 'react';
import { useRouter } from 'next/navigation';
import { toast } from 'sonner';

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { FormField } from '@/components/admin/form-layout';
import { BilingualInput, BilingualTextarea } from '@/components/admin/crud/bilingual-field';
import { RecordFormShell } from '@/components/admin/crud/record-form-shell';
import { createService, updateService } from '@/lib/actions/services';

export interface ServiceFormData {
  id?: string;
  titleEn: string;
  titleBn: string;
  descriptionEn: string;
  descriptionBn: string;
  icon: string;
  featuresEn: string;
  featuresBn: string;
  status: string;
  order: number;
}

const STATUS_OPTIONS = [
  { value: 'ACTIVE', label: 'Active' },
  { value: 'DRAFT', label: 'Draft' },
];

const ICON_PRESETS = ['Code2', 'Server', 'Database', 'Cloud', 'Smartphone', 'Palette', 'Globe', 'Zap', 'Layers', 'Cpu'];

export function ServiceForm({ initial, mode }: { initial: ServiceFormData; mode: 'create' | 'edit' }) {
  const router = useRouter();
  const [titleEn, setTitleEn] = React.useState(initial.titleEn);
  const [titleBn, setTitleBn] = React.useState(initial.titleBn);
  const [descriptionEn, setDescriptionEn] = React.useState(initial.descriptionEn);
  const [descriptionBn, setDescriptionBn] = React.useState(initial.descriptionBn);
  const [icon, setIcon] = React.useState(initial.icon);
  const [featuresEn, setFeaturesEn] = React.useState(initial.featuresEn);
  const [featuresBn, setFeaturesBn] = React.useState(initial.featuresBn);
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
      formData.set('titleEn', titleEn);
      formData.set('titleBn', titleBn);
      formData.set('descriptionEn', descriptionEn);
      formData.set('descriptionBn', descriptionBn);
      formData.set('icon', icon);
      formData.set('featuresEn', featuresEn);
      formData.set('featuresBn', featuresBn);
      formData.set('status', status);
      formData.set('order', String(order));

      const result =
        mode === 'create' ? await createService(formData) : await updateService(initial.id!, formData);

      if (!result.ok) {
        setError(result.error ?? 'Failed to save.');
        toast.error(result.error ?? 'Failed to save service');
      } else {
        toast.success(mode === 'create' ? 'Service created successfully' : 'Service updated successfully');
        router.push('/admin/services');
        router.refresh();
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <RecordFormShell
      title={mode === 'create' ? 'Add Service' : `Edit: ${initial.titleEn}`}
      description={
        mode === 'create'
          ? 'Add a new service to your portfolio'
          : `Editing "${initial.titleEn}" / "${initial.titleBn}"`
      }
      backHref="/admin/services"
      onSubmit={onSubmit}
      submitLabel={mode === 'create' ? 'Create Service' : 'Save Changes'}
      isSubmitting={isSubmitting}
    >
      {/* Identity card */}
      <Card className="border-border bg-card shadow-card">
        <CardHeader>
          <CardTitle className="text-lg">Identity</CardTitle>
          <CardDescription>Bilingual title and Lucide icon name</CardDescription>
        </CardHeader>
        <CardContent className="space-y-5">
          <BilingualInput
            label="Title"
            enId="titleEn"
            bnId="titleBn"
            enValue={titleEn}
            bnValue={titleBn}
            onEnChange={setTitleEn}
            onBnChange={setTitleBn}
            required
            placeholderEn="Web Development"
            placeholderBn="ওয়েব ডেভেলপমেন্ট"
          />

          <FormField
            label="Icon (Lucide name)"
            htmlFor="icon"
            description="A Lucide icon name rendered on the service card. Examples: Code2, Server, Database, Cloud."
          >
            <Input
              id="icon"
              type="text"
              value={icon}
              onChange={(e) => setIcon(e.target.value)}
              placeholder="Code2"
            />
            <div className="flex flex-wrap gap-1.5 pt-2">
              {ICON_PRESETS.map((name) => (
                <button
                  key={name}
                  type="button"
                  onClick={() => setIcon(name)}
                  className={`rounded-md border px-2 py-0.5 text-[11px] font-mono transition-colors ${
                    icon === name
                      ? 'border-primary bg-primary/10 text-primary'
                      : 'border-border bg-muted text-muted-foreground hover:bg-muted/70'
                  }`}
                >
                  {name}
                </button>
              ))}
            </div>
          </FormField>
        </CardContent>
      </Card>

      {/* Description card */}
      <Card className="border-border bg-card shadow-card">
        <CardHeader>
          <CardTitle className="text-lg">Description</CardTitle>
          <CardDescription>Bilingual — shown on the service card and detail page</CardDescription>
        </CardHeader>
        <CardContent>
          <BilingualTextarea
            label="Description"
            enId="descriptionEn"
            bnId="descriptionBn"
            enValue={descriptionEn}
            bnValue={descriptionBn}
            onEnChange={setDescriptionEn}
            onBnChange={setDescriptionBn}
            required
            rows={3}
            placeholderEn="Modern, performant web apps built with the latest stack."
            placeholderBn="সর্বশেষ প্রযুক্তি দিয়ে তৈরি আধুনিক ও দ্রুত ওয়েব অ্যাপ।"
          />
        </CardContent>
      </Card>

      {/* Features card */}
      <Card className="border-border bg-card shadow-card">
        <CardHeader>
          <CardTitle className="text-lg">Features</CardTitle>
          <CardDescription>
            One feature per line — rendered as a bulleted list on the public site.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <BilingualTextarea
            label="Features"
            enId="featuresEn"
            bnId="featuresBn"
            enValue={featuresEn}
            bnValue={featuresBn}
            onEnChange={setFeaturesEn}
            onBnChange={setFeaturesBn}
            rows={5}
            placeholderEn={'Responsive design\nSEO optimization\nPerformance tuning'}
            placeholderBn={'রেসপন্সিভ ডিজাইন\nএসইও অপটিমাইজেশন\nপারফরম্যান্স টিউনিং'}
          />
        </CardContent>
      </Card>

      {/* Status & Order card */}
      <Card className="border-border bg-card shadow-card">
        <CardHeader>
          <CardTitle className="text-lg">Status & Ordering</CardTitle>
          <CardDescription>Draft hides from public site; lower order appears first</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 gap-5 sm:grid-cols-2">
            <FormField label="Status" htmlFor="status">
              <Select value={status} onValueChange={setStatus}>
                <SelectTrigger id="status">
                  <SelectValue placeholder="Select status" />
                </SelectTrigger>
                <SelectContent>
                  {STATUS_OPTIONS.map((opt) => (
                    <SelectItem key={opt.value} value={opt.value}>
                      {opt.label}
                    </SelectItem>
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

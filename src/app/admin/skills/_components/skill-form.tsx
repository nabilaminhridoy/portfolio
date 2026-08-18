'use client';

import * as React from 'react';
import { useRouter } from 'next/navigation';
import { toast } from 'sonner';
import { Save } from 'lucide-react';

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import { Slider } from '@/components/ui/slider';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { FormField } from '@/components/admin/form-layout';
import { BilingualTextarea } from '@/components/admin/crud/bilingual-field';
import { RecordFormShell } from '@/components/admin/crud/record-form-shell';
import { createSkill, updateSkill } from '@/lib/actions/skills';

export interface SkillFormData {
  id?: string;
  name: string;
  slug: string;
  category: string;
  descriptionEn: string;
  descriptionBn: string;
  logoUrl: string;
  level: number;
  status: string;
  order: number;
}

const CATEGORY_OPTIONS = [
  { value: 'Frontend', label: 'Frontend' },
  { value: 'Backend', label: 'Backend' },
  { value: 'Database', label: 'Database' },
  { value: 'DevOps', label: 'DevOps' },
  { value: 'Tools', label: 'Tools' },
];

const STATUS_OPTIONS = [
  { value: 'ACTIVE', label: 'Active' },
  { value: 'DRAFT', label: 'Draft' },
];

export function SkillForm({ initial, mode }: { initial: SkillFormData; mode: 'create' | 'edit' }) {
  const router = useRouter();
  const [name, setName] = React.useState(initial.name);
  const [slug, setSlug] = React.useState(initial.slug);
  const [category, setCategory] = React.useState(initial.category);
  const [descriptionEn, setDescriptionEn] = React.useState(initial.descriptionEn);
  const [descriptionBn, setDescriptionBn] = React.useState(initial.descriptionBn);
  const [logoUrl, setLogoUrl] = React.useState(initial.logoUrl);
  const [level, setLevel] = React.useState(initial.level);
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
      formData.set('name', name);
      formData.set('slug', slug);
      formData.set('category', category);
      formData.set('descriptionEn', descriptionEn);
      formData.set('descriptionBn', descriptionBn);
      formData.set('logoUrl', logoUrl);
      formData.set('level', String(level));
      formData.set('status', status);
      formData.set('order', String(order));

      const result = mode === 'create'
        ? await createSkill(formData)
        : await updateSkill(initial.id!, formData);

      if (!result.ok) {
        setError(result.error ?? 'Failed to save.');
        toast.error(result.error ?? 'Failed to save skill');
      } else {
        toast.success(mode === 'create' ? 'Skill created successfully' : 'Skill updated successfully');
        router.push('/admin/skills');
        router.refresh();
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <RecordFormShell
      title={mode === 'create' ? 'Add Skill' : `Edit: ${initial.name}`}
      description={mode === 'create' ? 'Add a new technology to your skill set' : `Editing ${initial.name} (${initial.slug})`}
      backHref="/admin/skills"
      onSubmit={onSubmit}
      submitLabel={mode === 'create' ? 'Create Skill' : 'Save Changes'}
      isSubmitting={isSubmitting}
    >
      {/* Identity card */}
      <Card className="border-border bg-card shadow-card">
        <CardHeader>
          <CardTitle className="text-lg">Identity</CardTitle>
          <CardDescription>Name, slug, category, and logo</CardDescription>
        </CardHeader>
        <CardContent className="space-y-5">
          <div className="grid grid-cols-1 gap-5 sm:grid-cols-2">
            <FormField label="Name" htmlFor="name" required>
              <Input
                id="name"
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="React.js"
                required
                autoFocus
              />
            </FormField>
            <FormField label="Slug" htmlFor="slug" description="URL-friendly. Auto-generated from name if left blank.">
              <Input
                id="slug"
                type="text"
                value={slug}
                onChange={(e) => setSlug(e.target.value)}
                placeholder="react"
              />
            </FormField>
          </div>

          <div className="grid grid-cols-1 gap-5 sm:grid-cols-2">
            <FormField label="Category" htmlFor="category" required>
              <Select value={category} onValueChange={setCategory}>
                <SelectTrigger id="category">
                  <SelectValue placeholder="Select category" />
                </SelectTrigger>
                <SelectContent>
                  {CATEGORY_OPTIONS.map((opt) => (
                    <SelectItem key={opt.value} value={opt.value}>{opt.label}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </FormField>
            <FormField label="Status" htmlFor="status">
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
          </div>

          <FormField label="Logo URL" htmlFor="logoUrl" description="Optional. Use official technology logos (e.g. from devicon or simpleicons.org)">
            <Input
              id="logoUrl"
              type="url"
              value={logoUrl}
              onChange={(e) => setLogoUrl(e.target.value)}
              placeholder="https://cdn.simpleicons.org/react/61DAFB"
            />
          </FormField>
        </CardContent>
      </Card>

      {/* Description card */}
      <Card className="border-border bg-card shadow-card">
        <CardHeader>
          <CardTitle className="text-lg">Description</CardTitle>
          <CardDescription>Bilingual — shown under the skill name in the public Skills section</CardDescription>
        </CardHeader>
        <CardContent>
          <BilingualTextarea
            label="Description"
            enId="descriptionEn" bnId="descriptionBn"
            enValue={descriptionEn} bnValue={descriptionBn}
            onEnChange={setDescriptionEn} onBnChange={setDescriptionBn}
            rows={3}
            placeholderEn="Modern JavaScript framework for building UIs"
            placeholderBn="ইউআই তৈরির জন্য আধুনিক জাভাস্ক্রিপ্ট ফ্রেমওয়ার্ক"
          />
        </CardContent>
      </Card>

      {/* Level + Order card */}
      <Card className="border-border bg-card shadow-card">
        <CardHeader>
          <CardTitle className="text-lg">Level & Ordering</CardTitle>
          <CardDescription>Skill level shown as a progress bar; lower order = appears first</CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <Label htmlFor="level" className="text-sm font-medium">
                Skill Level
              </Label>
              <span className="font-mono text-sm font-semibold text-foreground">{level}%</span>
            </div>
            <Slider
              id="level"
              value={[level]}
              onValueChange={(vals) => setLevel(vals[0] ?? 50)}
              min={0}
              max={100}
              step={1}
              aria-label="Skill level"
            />
            <p className="text-xs text-muted-foreground">0% (beginner) → 100% (expert). Shown as a gradient progress bar.</p>
          </div>

          <FormField label="Display Order" htmlFor="order" description="Lower numbers appear first in the Skills section.">
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

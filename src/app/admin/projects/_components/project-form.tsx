'use client';

import * as React from 'react';
import { useRouter } from 'next/navigation';
import { toast } from 'sonner';
import { Star } from 'lucide-react';

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import { Badge } from '@/components/ui/badge';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { FormField } from '@/components/admin/form-layout';
import { BilingualInput, BilingualTextarea } from '@/components/admin/crud/bilingual-field';
import { RecordFormShell } from '@/components/admin/crud/record-form-shell';
import { createProject, updateProject } from '@/lib/actions/projects';

export interface ProjectFormData {
  id?: string;
  titleEn: string;
  titleBn: string;
  slug: string;
  summaryEn: string;
  summaryBn: string;
  descriptionEn: string;
  descriptionBn: string;
  thumbnailUrl: string;
  demoUrl: string;
  githubUrl: string;
  technologies: string;
  status: string;
  isFeatured: boolean;
  order: number;
}

const STATUS_OPTIONS = [
  { value: 'PUBLISHED', label: 'Published' },
  { value: 'DRAFT', label: 'Draft' },
  { value: 'ARCHIVED', label: 'Archived' },
];

export function ProjectForm({ initial, mode }: { initial: ProjectFormData; mode: 'create' | 'edit' }) {
  const router = useRouter();
  const [titleEn, setTitleEn] = React.useState(initial.titleEn);
  const [titleBn, setTitleBn] = React.useState(initial.titleBn);
  const [slug, setSlug] = React.useState(initial.slug);
  const [summaryEn, setSummaryEn] = React.useState(initial.summaryEn);
  const [summaryBn, setSummaryBn] = React.useState(initial.summaryBn);
  const [descriptionEn, setDescriptionEn] = React.useState(initial.descriptionEn);
  const [descriptionBn, setDescriptionBn] = React.useState(initial.descriptionBn);
  const [thumbnailUrl, setThumbnailUrl] = React.useState(initial.thumbnailUrl);
  const [demoUrl, setDemoUrl] = React.useState(initial.demoUrl);
  const [githubUrl, setGithubUrl] = React.useState(initial.githubUrl);
  const [technologies, setTechnologies] = React.useState(initial.technologies);
  const [status, setStatus] = React.useState(initial.status);
  const [isFeatured, setIsFeatured] = React.useState(initial.isFeatured);
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
      formData.set('slug', slug);
      formData.set('summaryEn', summaryEn);
      formData.set('summaryBn', summaryBn);
      formData.set('descriptionEn', descriptionEn);
      formData.set('descriptionBn', descriptionBn);
      formData.set('thumbnailUrl', thumbnailUrl);
      formData.set('demoUrl', demoUrl);
      formData.set('githubUrl', githubUrl);
      formData.set('technologies', technologies);
      formData.set('status', status);
      if (isFeatured) formData.set('isFeatured', 'on');
      formData.set('order', String(order));

      const result = mode === 'create'
        ? await createProject(formData)
        : await updateProject(initial.id!, formData);

      if (!result.ok) {
        setError(result.error ?? 'Failed to save.');
        toast.error(result.error ?? 'Failed to save project');
      } else {
        toast.success(mode === 'create' ? 'Project created successfully' : 'Project updated successfully');
        router.push('/admin/projects');
        router.refresh();
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  // Tech tag preview
  const techs = technologies.split(',').map((t) => t.trim()).filter(Boolean);

  return (
    <RecordFormShell
      title={mode === 'create' ? 'Add Project' : `Edit: ${initial.titleEn}`}
      description={mode === 'create' ? 'Add a new portfolio project' : `Editing ${initial.titleEn}`}
      backHref="/admin/projects"
      onSubmit={onSubmit}
      submitLabel={mode === 'create' ? 'Create Project' : 'Save Changes'}
      isSubmitting={isSubmitting}
      viewOnSiteHref={mode === 'edit' && initial.slug ? `/en/projects/${initial.slug}` : undefined}
    >
      {/* Title card */}
      <Card className="border-border bg-card shadow-card">
        <CardHeader>
          <CardTitle className="text-lg">Title & Slug</CardTitle>
          <CardDescription>Bilingual title + URL slug (auto-generated if blank)</CardDescription>
        </CardHeader>
        <CardContent className="space-y-5">
          <BilingualInput
            label="Title"
            enId="titleEn" bnId="titleBn"
            enValue={titleEn} bnValue={titleBn}
            onEnChange={setTitleEn} onBnChange={setTitleBn}
            required
            placeholderEn="Portfolio CMS"
            placeholderBn="পোর্টফোলিও সিএমএস"
          />
          <div className="grid grid-cols-1 gap-5 sm:grid-cols-2">
            <FormField label="Slug" htmlFor="slug" description="URL: /en/projects/[slug]. Auto-generated from English title if blank.">
              <Input
                id="slug"
                type="text"
                value={slug}
                onChange={(e) => setSlug(e.target.value)}
                placeholder="portfolio-cms"
              />
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
        </CardContent>
      </Card>

      {/* Summary card */}
      <Card className="border-border bg-card shadow-card">
        <CardHeader>
          <CardTitle className="text-lg">Summary</CardTitle>
          <CardDescription>Short 1-2 sentence teaser shown in the project card</CardDescription>
        </CardHeader>
        <CardContent>
          <BilingualTextarea
            label="Summary"
            enId="summaryEn" bnId="summaryBn"
            enValue={summaryEn} bnValue={summaryBn}
            onEnChange={setSummaryEn} onBnChange={setSummaryBn}
            rows={2}
            placeholderEn="A premium bilingual portfolio CMS"
            placeholderBn="একটি প্রিমিয়াম দ্বিভাষিক পোর্টফোলিও সিএমএস"
          />
        </CardContent>
      </Card>

      {/* Description card */}
      <Card className="border-border bg-card shadow-card">
        <CardHeader>
          <CardTitle className="text-lg">Description</CardTitle>
          <CardDescription>Long-form project description (supports line breaks)</CardDescription>
        </CardHeader>
        <CardContent>
          <BilingualTextarea
            label="Description"
            enId="descriptionEn" bnId="descriptionBn"
            enValue={descriptionEn} bnValue={descriptionBn}
            onEnChange={setDescriptionEn} onBnChange={setDescriptionBn}
            required
            rows={6}
            placeholderEn="Full description of the project..."
            placeholderBn="প্রজেক্টের সম্পূর্ণ বিবরণ..."
          />
        </CardContent>
      </Card>

      {/* URLs card */}
      <Card className="border-border bg-card shadow-card">
        <CardHeader>
          <CardTitle className="text-lg">URLs & Media</CardTitle>
          <CardDescription>Thumbnail, live demo, and GitHub links</CardDescription>
        </CardHeader>
        <CardContent className="space-y-5">
          <FormField label="Thumbnail URL" htmlFor="thumbnailUrl" description="Square image, 1200x1200 recommended">
            <Input
              id="thumbnailUrl"
              type="url"
              value={thumbnailUrl}
              onChange={(e) => setThumbnailUrl(e.target.value)}
              placeholder="https://..."
            />
          </FormField>
          <div className="grid grid-cols-1 gap-5 sm:grid-cols-2">
            <FormField label="Live Demo URL" htmlFor="demoUrl">
              <Input
                id="demoUrl"
                type="url"
                value={demoUrl}
                onChange={(e) => setDemoUrl(e.target.value)}
                placeholder="https://demo.example.com"
              />
            </FormField>
            <FormField label="GitHub URL" htmlFor="githubUrl">
              <Input
                id="githubUrl"
                type="url"
                value={githubUrl}
                onChange={(e) => setGithubUrl(e.target.value)}
                placeholder="https://github.com/user/repo"
              />
            </FormField>
          </div>
        </CardContent>
      </Card>

      {/* Technologies + Featured card */}
      <Card className="border-border bg-card shadow-card">
        <CardHeader>
          <CardTitle className="text-lg">Technologies & Featured</CardTitle>
          <CardDescription>Comma-separated tech tags + featured flag</CardDescription>
        </CardHeader>
        <CardContent className="space-y-5">
          <FormField label="Technologies" htmlFor="technologies" description="Comma-separated slugs (matching skill slugs when possible)">
            <Input
              id="technologies"
              type="text"
              value={technologies}
              onChange={(e) => setTechnologies(e.target.value)}
              placeholder="nextjs,typescript,tailwind,prisma"
            />
            {techs.length > 0 && (
              <div className="mt-2 flex flex-wrap gap-1.5">
                {techs.map((t) => (
                  <Badge key={t} variant="outline" className="font-mono text-[10px]">
                    {t}
                  </Badge>
                ))}
              </div>
            )}
          </FormField>
          <div className="flex items-center justify-between rounded-md border border-border bg-muted/20 p-4">
            <div className="space-y-0.5">
              <Label htmlFor="isFeatured" className="flex items-center gap-1.5 text-sm font-medium">
                <Star className="h-3.5 w-3.5" />
                Featured Project
              </Label>
              <p className="text-xs text-muted-foreground">
                Featured projects are highlighted in the home page Projects section
              </p>
            </div>
            <Switch
              id="isFeatured"
              checked={isFeatured}
              onCheckedChange={setIsFeatured}
              aria-label="Toggle featured"
            />
          </div>
          <FormField label="Display Order" htmlFor="order" description="Lower = appears first">
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

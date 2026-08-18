'use client';

import * as React from 'react';
import { useRouter } from 'next/navigation';
import { toast } from 'sonner';
import { Award, Star, ExternalLink } from 'lucide-react';

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import { Badge } from '@/components/ui/badge';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { FormField } from '@/components/admin/form-layout';
import { BilingualInput, BilingualTextarea } from '@/components/admin/crud/bilingual-field';
import { RecordFormShell } from '@/components/admin/crud/record-form-shell';
import { createCertification, updateCertification } from '@/lib/actions/certifications';

export interface CertificationFormData {
  id?: string;
  titleEn: string;
  titleBn: string;
  organization: string;
  credentialId: string;
  credentialUrl: string;
  issueDate: string; // yyyy-mm-dd
  expiryDate: string;
  certificateImageUrl: string;
  descriptionEn: string;
  descriptionBn: string;
  skills: string;
  isFeatured: boolean;
  status: string;
  order: number;
}

const STATUS_OPTIONS = [
  { value: 'ACTIVE', label: 'Active' },
  { value: 'DRAFT', label: 'Draft' },
];

// Helper to convert Date to yyyy-mm-dd for input[type=date]
function toDateInputValue(d: Date | string | null): string {
  if (!d) return '';
  const date = typeof d === 'string' ? new Date(d) : d;
  if (isNaN(date.getTime())) return '';
  return date.toISOString().slice(0, 10);
}

export function CertificationForm({
  initial,
  mode,
}: {
  initial: CertificationFormData;
  mode: 'create' | 'edit';
}) {
  const router = useRouter();
  const [titleEn, setTitleEn] = React.useState(initial.titleEn);
  const [titleBn, setTitleBn] = React.useState(initial.titleBn);
  const [organization, setOrganization] = React.useState(initial.organization);
  const [credentialId, setCredentialId] = React.useState(initial.credentialId);
  const [credentialUrl, setCredentialUrl] = React.useState(initial.credentialUrl);
  const [issueDate, setIssueDate] = React.useState(initial.issueDate);
  const [expiryDate, setExpiryDate] = React.useState(initial.expiryDate);
  const [certificateImageUrl, setCertificateImageUrl] = React.useState(initial.certificateImageUrl);
  const [descriptionEn, setDescriptionEn] = React.useState(initial.descriptionEn);
  const [descriptionBn, setDescriptionBn] = React.useState(initial.descriptionBn);
  const [skills, setSkills] = React.useState(initial.skills);
  const [isFeatured, setIsFeatured] = React.useState(initial.isFeatured);
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
      formData.set('organization', organization);
      formData.set('credentialId', credentialId);
      formData.set('credentialUrl', credentialUrl);
      formData.set('issueDate', issueDate);
      formData.set('expiryDate', expiryDate);
      formData.set('certificateImageUrl', certificateImageUrl);
      formData.set('descriptionEn', descriptionEn);
      formData.set('descriptionBn', descriptionBn);
      formData.set('skills', skills);
      if (isFeatured) formData.set('isFeatured', 'on');
      formData.set('status', status);
      formData.set('order', String(order));

      const result = mode === 'create'
        ? await createCertification(formData)
        : await updateCertification(initial.id!, formData);

      if (!result.ok) {
        setError(result.error ?? 'Failed to save.');
        toast.error(result.error ?? 'Failed to save certification');
      } else {
        toast.success(mode === 'create' ? 'Certification created successfully' : 'Certification updated successfully');
        router.push('/admin/certifications');
        router.refresh();
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  const techs = skills.split(',').map((t) => t.trim()).filter(Boolean);

  return (
    <RecordFormShell
      title={mode === 'create' ? 'Add Certification' : `Edit: ${initial.titleEn}`}
      description={mode === 'create' ? 'Add a new professional certification' : `Editing ${initial.titleEn}`}
      backHref="/admin/certifications"
      onSubmit={onSubmit}
      submitLabel={mode === 'create' ? 'Create Certification' : 'Save Changes'}
      isSubmitting={isSubmitting}
      viewOnSiteHref={mode === 'edit' && credentialUrl ? credentialUrl : undefined}
    >
      {/* Title + Organization card */}
      <Card className="border-border bg-card shadow-card">
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-lg">
            <Award className="h-4 w-4 text-brand-blue" aria-hidden="true" />
            Title & Organization
          </CardTitle>
          <CardDescription>Bilingual title + the issuing organization</CardDescription>
        </CardHeader>
        <CardContent className="space-y-5">
          <BilingualInput
            label="Title"
            enId="titleEn" bnId="titleBn"
            enValue={titleEn} bnValue={titleBn}
            onEnChange={setTitleEn} onBnChange={setTitleBn}
            required
            placeholderEn="AWS Certified Solutions Architect"
            placeholderBn="এডব্লিউএস সার্টিফাইড সলিউশনস আর্কিটেক্ট"
          />
          <FormField label="Issuing Organization" htmlFor="organization" required>
            <Input
              id="organization"
              type="text"
              value={organization}
              onChange={(e) => setOrganization(e.target.value)}
              placeholder="Amazon Web Services"
              required
              autoFocus
            />
          </FormField>
        </CardContent>
      </Card>

      {/* Credential + Dates card */}
      <Card className="border-border bg-card shadow-card">
        <CardHeader>
          <CardTitle className="text-lg">Credential & Dates</CardTitle>
          <CardDescription>Credential ID, URL, and issue/expiry dates</CardDescription>
        </CardHeader>
        <CardContent className="space-y-5">
          <div className="grid grid-cols-1 gap-5 sm:grid-cols-2">
            <FormField label="Credential ID" htmlFor="credentialId" description="Shown on certificate and verifiable at issuer URL">
              <Input
                id="credentialId"
                type="text"
                value={credentialId}
                onChange={(e) => setCredentialId(e.target.value)}
                placeholder="ABC-123-456"
              />
            </FormField>
            <FormField label="Credential URL" htmlFor="credentialUrl" description="Public verification link at issuer site">
              <Input
                id="credentialUrl"
                type="url"
                value={credentialUrl}
                onChange={(e) => setCredentialUrl(e.target.value)}
                placeholder="https://www.credly.com/..."
              />
            </FormField>
          </div>

          <div className="grid grid-cols-1 gap-5 sm:grid-cols-2">
            <FormField label="Issue Date" htmlFor="issueDate" required>
              <Input
                id="issueDate"
                type="date"
                value={issueDate}
                onChange={(e) => setIssueDate(e.target.value)}
                required
              />
            </FormField>
            <FormField label="Expiry Date" htmlFor="expiryDate" description="Leave blank if it does not expire">
              <Input
                id="expiryDate"
                type="date"
                value={expiryDate}
                onChange={(e) => setExpiryDate(e.target.value)}
              />
            </FormField>
          </div>
        </CardContent>
      </Card>

      {/* Certificate image + description card */}
      <Card className="border-border bg-card shadow-card">
        <CardHeader>
          <CardTitle className="text-lg">Certificate Preview & Description</CardTitle>
          <CardDescription>Optional image of the certificate + bilingual description</CardDescription>
        </CardHeader>
        <CardContent className="space-y-5">
          <FormField label="Certificate Image URL" htmlFor="certificateImageUrl" description="Optional. Image or PDF preview of the certificate">
            <Input
              id="certificateImageUrl"
              type="url"
              value={certificateImageUrl}
              onChange={(e) => setCertificateImageUrl(e.target.value)}
              placeholder="https://..."
            />
          </FormField>
          <BilingualTextarea
            label="Description"
            enId="descriptionEn" bnId="descriptionBn"
            enValue={descriptionEn} bnValue={descriptionBn}
            onEnChange={setDescriptionEn} onBnChange={setDescriptionBn}
            rows={3}
            placeholderEn="What this certification covers..."
            placeholderBn="এই সার্টিফিকেশন কী কভার করে..."
          />
        </CardContent>
      </Card>

      {/* Skills + Featured + Status card */}
      <Card className="border-border bg-card shadow-card">
        <CardHeader>
          <CardTitle className="text-lg">Skills, Featured & Status</CardTitle>
          <CardDescription>Related skills + featured flag + status + display order</CardDescription>
        </CardHeader>
        <CardContent className="space-y-5">
          <FormField label="Skills / Technologies" htmlFor="skills" description="Comma-separated tech slugs (matching skill slugs when possible)">
            <Input
              id="skills"
              type="text"
              value={skills}
              onChange={(e) => setSkills(e.target.value)}
              placeholder="aws,docker,cloud"
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
                Featured Certification
              </Label>
              <p className="text-xs text-muted-foreground">
                Featured certifications are highlighted on the public Certifications section
              </p>
            </div>
            <Switch
              id="isFeatured"
              checked={isFeatured}
              onCheckedChange={setIsFeatured}
              aria-label="Toggle featured"
            />
          </div>

          <div className="grid grid-cols-1 gap-5 sm:grid-cols-2">
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
            <FormField label="Display Order" htmlFor="order" description="Lower = appears first">
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

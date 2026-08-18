'use client';

import * as React from 'react';
import { useRouter } from 'next/navigation';
import { toast } from 'sonner';
import { formatDistanceToNow } from 'date-fns';
import { Globe, Facebook, Instagram, MessageCircle, Linkedin, Twitter, Github, MessageSquare, Plus, Save, Trash2, Loader2, ExternalLink, Check } from 'lucide-react';

import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { FormField } from '@/components/admin/form-layout';
import { DeleteConfirmDialog } from '@/components/admin/crud/delete-confirm-dialog';
import { upsertSocialLink, deleteSocialLink } from '@/lib/actions/social-links';

export interface SocialLinkRow {
  id: string;
  platform: string;
  label: string;
  url: string;
  iconUrl: string;
  isActive: boolean;
  order: number;
  createdAt: Date;
  updatedAt: Date;
}

const PLATFORMS = [
  { value: 'website', label: 'Website', icon: Globe, color: '#175bea' },
  { value: 'facebook', label: 'Facebook', icon: Facebook, color: '#1877F2' },
  { value: 'instagram', label: 'Instagram', icon: Instagram, color: '#E4405F' },
  { value: 'whatsapp', label: 'WhatsApp', icon: MessageCircle, color: '#25D366' },
  { value: 'linkedin', label: 'LinkedIn', icon: Linkedin, color: '#0A66C2' },
  { value: 'x', label: 'X (Twitter)', icon: Twitter, color: '#000000' },
  { value: 'github', label: 'GitHub', icon: Github, color: '#181717' },
  { value: 'discord', label: 'Discord', icon: MessageSquare, color: '#5865F2' },
];

const usedPlatforms = (rows: SocialLinkRow[]) => new Set(rows.map((r) => r.platform));

export function SocialLinksClient({ rows }: { rows: SocialLinkRow[] }) {
  const used = usedPlatforms(rows);
  const availableToAdd = PLATFORMS.filter((p) => !used.has(p.value));

  return (
    <div className="space-y-6">
      {rows.length > 0 && (
        <div className="space-y-3">
          {rows.map((row) => (
            <SocialLinkRowItem key={row.id} row={row} />
          ))}
        </div>
      )}

      {availableToAdd.length > 0 && (
        <AddSocialLinkForm platforms={availableToAdd} />
      )}

      {rows.length === 0 && availableToAdd.length === 0 && (
        <div className="rounded-md border border-dashed border-border bg-muted/30 p-8 text-center text-sm text-muted-foreground">
          All social platforms have been configured.
        </div>
      )}
    </div>
  );
}

function SocialLinkRowItem({ row }: { row: SocialLinkRow }) {
  const router = useRouter();
  const [label, setLabel] = React.useState(row.label);
  const [url, setUrl] = React.useState(row.url);
  const [iconUrl, setIconUrl] = React.useState(row.iconUrl);
  const [isActive, setIsActive] = React.useState(row.isActive);
  const [order, setOrder] = React.useState(row.order);
  const [isSaving, setIsSaving] = React.useState(false);
  const [isDeleting, setIsDeleting] = React.useState(false);

  const platform = PLATFORMS.find((p) => p.value === row.platform);
  const PlatformIcon = platform?.icon ?? Globe;

  const dirty = label !== row.label || url !== row.url || iconUrl !== row.iconUrl || isActive !== row.isActive || order !== row.order;

  const handleSave = async () => {
    setIsSaving(true);
    try {
      const formData = new FormData();
      formData.set('id', row.id);
      formData.set('platform', row.platform);
      formData.set('label', label);
      formData.set('url', url);
      formData.set('iconUrl', iconUrl);
      if (isActive) formData.set('isActive', 'on');
      formData.set('order', String(order));

      const result = await upsertSocialLink(formData);
      if (!result.ok) {
        toast.error(result.error ?? 'Failed to save');
      } else {
        toast.success('Saved');
        router.refresh();
      }
    } finally {
      setIsSaving(false);
    }
  };

  const handleDelete = async () => {
    setIsDeleting(true);
    try {
      const result = await deleteSocialLink(row.id);
      if (!result.ok) {
        toast.error(result.error ?? 'Failed to delete');
      } else {
        toast.success(`Deleted ${row.platform} link`);
        router.refresh();
      }
    } finally {
      setIsDeleting(false);
    }
  };

  return (
    <div className="rounded-md border border-border bg-background p-4">
      <div className="flex items-start gap-3">
        <span
          className="flex h-10 w-10 items-center justify-center rounded-md text-white"
          style={{ background: platform?.color ?? '#5a6485' }}
        >
          <PlatformIcon className="h-5 w-5" />
        </span>

        <div className="min-w-0 flex-1 space-y-3">
          <div className="flex flex-wrap items-center gap-2">
            <Badge className="font-mono text-xs">{row.platform}</Badge>
            {row.label && <span className="text-sm font-medium text-foreground">{row.label}</span>}
            <a href={row.url} target="_blank" rel="noreferrer" className="ml-auto text-xs text-muted-foreground hover:text-foreground flex items-center gap-1">
              <ExternalLink className="h-3 w-3" />
              Open
            </a>
            <Badge className={isActive ? 'bg-emerald-500/10 text-emerald-600 dark:text-emerald-400' : 'bg-muted text-muted-foreground'}>
              {isActive ? 'Active' : 'Hidden'}
            </Badge>
            <span className="text-xs text-muted-foreground">Updated {formatDistanceToNow(row.updatedAt, { addSuffix: true })}</span>
          </div>

          <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
            <FormField label="Label" htmlFor={`label-${row.id}`}>
              <Input
                id={`label-${row.id}`}
                type="text"
                value={label}
                onChange={(e) => setLabel(e.target.value)}
                placeholder={platform?.label}
              />
            </FormField>
            <FormField label="URL" htmlFor={`url-${row.id}`} required>
              <Input
                id={`url-${row.id}`}
                type="url"
                value={url}
                onChange={(e) => setUrl(e.target.value)}
                required
              />
            </FormField>
            <FormField label="Icon URL (optional)" htmlFor={`icon-${row.id}`}>
              <Input
                id={`icon-${row.id}`}
                type="url"
                value={iconUrl}
                onChange={(e) => setIconUrl(e.target.value)}
                placeholder="https://cdn.example.com/icon.svg"
              />
            </FormField>
            <FormField label="Order" htmlFor={`order-${row.id}`}>
              <Input
                id={`order-${row.id}`}
                type="number"
                min={0}
                value={order}
                onChange={(e) => setOrder(parseInt(e.target.value, 10) || 0)}
              />
            </FormField>
          </div>

          <div className="flex items-center justify-between gap-2 pt-1">
            <div className="flex items-center gap-2">
              <Switch
                id={`active-${row.id}`}
                checked={isActive}
                onCheckedChange={setIsActive}
                aria-label="Toggle active"
              />
              <Label htmlFor={`active-${row.id}`} className="text-xs font-normal text-muted-foreground">
                Active
              </Label>
            </div>

            <div className="flex items-center gap-2">
              <Button
                size="sm"
                variant="outline"
                onClick={handleSave}
                disabled={isSaving || !dirty}
                className="gap-1.5"
              >
                {isSaving ? <Loader2 className="h-3 w-3 animate-spin" /> : <Save className="h-3 w-3" />}
                Save
              </Button>
              <DeleteConfirmDialog
                trigger={
                  <Button
                    size="sm"
                    variant="ghost"
                    className="gap-1.5 text-destructive hover:bg-destructive/10 hover:text-destructive"
                    disabled={isDeleting}
                    aria-label="Delete"
                  >
                    <Trash2 className="h-3 w-3" />
                  </Button>
                }
                title={`Delete ${row.platform} link?`}
                description="This social link will be permanently removed."
                confirmLabel="Delete"
                onConfirm={handleDelete}
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

function AddSocialLinkForm({ platforms }: { platforms: typeof PLATFORMS }) {
  const router = useRouter();
  const [selectedPlatform, setSelectedPlatform] = React.useState('');
  const [label, setLabel] = React.useState('');
  const [url, setUrl] = React.useState('');
  const [iconUrl, setIconUrl] = React.useState('');
  const [isActive, setIsActive] = React.useState(true);
  const [order, setOrder] = React.useState(0);
  const [isSubmitting, setIsSubmitting] = React.useState(false);
  const [error, setError] = React.useState<string | null>(null);

  const onSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setError(null);
    setIsSubmitting(true);

    try {
      const formData = new FormData();
      formData.set('platform', selectedPlatform);
      formData.set('label', label);
      formData.set('url', url);
      formData.set('iconUrl', iconUrl);
      if (isActive) formData.set('isActive', 'on');
      formData.set('order', String(order));

      const result = await upsertSocialLink(formData);
      if (!result.ok) {
        setError(result.error ?? 'Failed to add');
        toast.error(result.error ?? 'Failed to add social link');
      } else {
        toast.success('Social link added');
        setSelectedPlatform('');
        setLabel('');
        setUrl('');
        setIconUrl('');
        setIsActive(true);
        setOrder(0);
        router.refresh();
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  const selectedPlatformMeta = platforms.find((p) => p.value === selectedPlatform);
  const SelectedIcon = selectedPlatformMeta?.icon ?? Plus;

  return (
    <Card className="border-dashed border-2 border-border bg-muted/30">
      <CardHeader>
        <CardTitle className="flex items-center gap-2 text-base">
          <Plus className="h-4 w-4 text-brand-blue" aria-hidden="true" />
          Add New Social Link
        </CardTitle>
      </CardHeader>
      <CardContent>
        <form onSubmit={onSubmit} className="space-y-5">
          <div>
            <Label className="mb-2 block text-sm font-medium">Platform</Label>
            <div className="grid grid-cols-2 gap-2 sm:grid-cols-4">
              {platforms.map((p) => {
                const Icon = p.icon;
                const selected = selectedPlatform === p.value;
                return (
                  <button
                    key={p.value}
                    type="button"
                    onClick={() => setSelectedPlatform(p.value)}
                    className={`flex items-center gap-2 rounded-md border p-3 text-sm transition-all ${
                      selected
                        ? 'border-primary bg-primary/10 text-primary'
                        : 'border-border bg-background text-foreground hover:border-primary/40'
                    }`}
                    aria-pressed={selected}
                  >
                    <span
                      className="flex h-7 w-7 items-center justify-center rounded-md text-white"
                      style={{ background: p.color }}
                    >
                      <Icon className="h-3.5 w-3.5" />
                    </span>
                    <span className="truncate">{p.label}</span>
                    {selected && <Check className="ml-auto h-3.5 w-3.5" />}
                  </button>
                );
              })}
            </div>
          </div>

          <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
            <FormField label="Label (optional)" htmlFor="new-label">
              <Input
                id="new-label"
                type="text"
                value={label}
                onChange={(e) => setLabel(e.target.value)}
                placeholder={selectedPlatformMeta?.label}
              />
            </FormField>
            <FormField label="URL" htmlFor="new-url" required>
              <Input
                id="new-url"
                type="url"
                value={url}
                onChange={(e) => setUrl(e.target.value)}
                placeholder="https://..."
                required
              />
            </FormField>
          </div>

          <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
            <FormField label="Icon URL (optional)" htmlFor="new-icon">
              <Input
                id="new-icon"
                type="url"
                value={iconUrl}
                onChange={(e) => setIconUrl(e.target.value)}
                placeholder="https://cdn.example.com/icon.svg"
              />
            </FormField>
            <FormField label="Order" htmlFor="new-order">
              <Input
                id="new-order"
                type="number"
                min={0}
                value={order}
                onChange={(e) => setOrder(parseInt(e.target.value, 10) || 0)}
              />
            </FormField>
          </div>

          <div className="flex items-center gap-2">
            <Switch
              id="new-active"
              checked={isActive}
              onCheckedChange={setIsActive}
              aria-label="Active by default"
            />
            <Label htmlFor="new-active" className="text-xs font-normal text-muted-foreground">
              Active (visible in public Footer)
            </Label>
          </div>

          {error && (
            <p className="text-sm text-destructive" role="alert">
              {error}
            </p>
          )}

          <div className="flex justify-end">
            <Button type="submit" disabled={isSubmitting || !selectedPlatform} className="gap-2">
              {isSubmitting ? <Loader2 className="h-4 w-4 animate-spin" /> : <Plus className="h-4 w-4" />}
              {isSubmitting ? 'Adding...' : 'Add Social Link'}
            </Button>
          </div>
        </form>
      </CardContent>
    </Card>
  );
}

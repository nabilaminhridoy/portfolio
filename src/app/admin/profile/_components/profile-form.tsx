'use client';

import * as React from 'react';
import { toast } from 'sonner';
import { UserCircle, Calendar, ShieldCheck } from 'lucide-react';

import { Input } from '@/components/ui/input';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { FormField, FormActions } from '@/components/admin/form-layout';
import { LogoMark } from '@/components/public/logo-mark';
import { updateProfile } from '@/lib/actions/profile';

interface UserData {
  id: string;
  name: string | null;
  email: string;
  avatarUrl: string | null;
  role: string;
  lastLoginAt: Date | null;
  createdAt: Date;
}

export function ProfileForm({ user }: { user: UserData }) {
  const [name, setName] = React.useState(user.name ?? '');
  const [email, setEmail] = React.useState(user.email);
  const [avatarUrl, setAvatarUrl] = React.useState(user.avatarUrl ?? '');
  const [error, setError] = React.useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = React.useState(false);

  const onSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setError(null);
    setIsSubmitting(true);

    try {
      const formData = new FormData();
      formData.set('name', name);
      formData.set('email', email);
      formData.set('avatarUrl', avatarUrl);

      const result = await updateProfile(formData);
      if (!result.ok) {
        setError(result.error ?? 'Failed to save.');
        toast.error(result.error ?? 'Failed to save profile');
      } else {
        toast.success('Profile updated successfully');
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
      {/* Profile summary card */}
      <Card className="border-border bg-card shadow-card lg:col-span-1">
        <CardHeader className="items-center text-center">
          <div className="mx-auto flex h-20 w-20 items-center justify-center overflow-hidden rounded-full bg-gradient-brand shadow-glow">
            {user.avatarUrl ? (
              <img
                src={user.avatarUrl}
                alt={user.name ?? 'Admin'}
                className="h-full w-full object-cover"
              />
            ) : (
              <LogoMark size={48} className="rounded-full" />
            )}
          </div>
          <CardTitle className="mt-3">{user.name ?? 'Admin'}</CardTitle>
          <CardDescription>{user.email}</CardDescription>
          <Badge className="mt-2 gap-1.5">
            <ShieldCheck className="h-3 w-3" aria-hidden="true" />
            {user.role}
          </Badge>
        </CardHeader>
        <CardContent className="space-y-3 border-t border-border pt-4 text-sm">
          <div className="flex items-center gap-2 text-muted-foreground">
            <UserCircle className="h-4 w-4" aria-hidden="true" />
            <span>User ID:</span>
            <span className="ml-auto font-mono text-xs text-foreground">{user.id.slice(0, 12)}...</span>
          </div>
          <div className="flex items-center gap-2 text-muted-foreground">
            <Calendar className="h-4 w-4" aria-hidden="true" />
            <span>Member since:</span>
            <span className="ml-auto text-xs text-foreground">
              {user.createdAt.toLocaleDateString('en-US', { year: 'numeric', month: 'short', day: 'numeric' })}
            </span>
          </div>
          {user.lastLoginAt && (
            <div className="flex items-center gap-2 text-muted-foreground">
              <Calendar className="h-4 w-4" aria-hidden="true" />
              <span>Last login:</span>
              <span className="ml-auto text-xs text-foreground">
                {user.lastLoginAt.toLocaleString('en-US', {
                  year: 'numeric',
                  month: 'short',
                  day: 'numeric',
                  hour: '2-digit',
                  minute: '2-digit',
                })}
              </span>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Edit form */}
      <Card className="border-border bg-card shadow-card lg:col-span-2">
        <CardHeader>
          <CardTitle className="text-lg">Edit Profile</CardTitle>
          <CardDescription>Update your admin profile information</CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={onSubmit} className="space-y-5">
            <FormField label="Name" htmlFor="name" required>
              <Input
                id="name"
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                required
                minLength={2}
                autoFocus
              />
            </FormField>

            <FormField label="Email" htmlFor="email" required description="Used for login and notifications">
              <Input
                id="email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
            </FormField>

            <FormField label="Avatar URL" htmlFor="avatarUrl" description="Optional. Leave blank to use the brand logo mark.">
              <Input
                id="avatarUrl"
                type="url"
                value={avatarUrl}
                onChange={(e) => setAvatarUrl(e.target.value)}
                placeholder="https://..."
              />
            </FormField>

            {error && (
              <p className="text-sm text-destructive" role="alert">
                {error}
              </p>
            )}

            <FormActions
              submitLabel="Save Changes"
              cancelLabel="Reset"
              isSubmitting={isSubmitting}
              onCancel={() => {
                setName(user.name ?? '');
                setEmail(user.email);
                setAvatarUrl(user.avatarUrl ?? '');
                setError(null);
              }}
            />
          </form>
        </CardContent>
      </Card>
    </div>
  );
}

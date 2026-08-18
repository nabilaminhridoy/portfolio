'use client';

import * as React from 'react';
import { toast } from 'sonner';
import { formatDistanceToNow } from 'date-fns';
import { KeyRound, Eye, EyeOff, ShieldCheck, Clock, History, Lock } from 'lucide-react';

import { Input } from '@/components/ui/input';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { FormField, FormActions } from '@/components/admin/form-layout';
import { changePassword } from '@/lib/actions/profile';

interface UserData {
  email: string;
  name: string | null;
  lastLoginAt: Date | null;
  updatedAt: Date;
}

interface ActivityEntry {
  id: string;
  action: string;
  ip: string | null;
  userAgent: string | null;
  createdAt: Date;
}

interface PasswordResetEntry {
  id: string;
  createdAt: Date;
  expiresAt: Date;
  usedAt: Date | null;
}

const actionIconFor = (action: string) => {
  if (action === 'LOGIN') return <Lock className="h-3 w-3" />;
  if (action === 'LOGOUT') return <Lock className="h-3 w-3" />;
  if (action.startsWith('PASSWORD_RESET')) return <KeyRound className="h-3 w-3" />;
  return <History className="h-3 w-3" />;
};

const actionToneFor = (action: string) => {
  if (action === 'LOGIN') return 'bg-emerald-500/10 text-emerald-600 dark:text-emerald-400';
  if (action === 'LOGOUT') return 'bg-muted text-muted-foreground';
  if (action === 'PASSWORD_RESET_COMPLETED') return 'bg-emerald-500/10 text-emerald-600 dark:text-emerald-400';
  if (action === 'PASSWORD_RESET_REQUESTED') return 'bg-amber-500/10 text-amber-600 dark:text-amber-400';
  return 'bg-brand-blue/10 text-brand-blue';
};

function formatAction(action: string): string {
  return action
    .toLowerCase()
    .split('_')
    .map((w) => w.charAt(0).toUpperCase() + w.slice(1))
    .join(' ');
}

export function SecurityForm({
  user,
  recentActivity,
  passwordResets,
}: {
  user: UserData;
  recentActivity: ActivityEntry[];
  passwordResets: PasswordResetEntry[];
}) {
  const [current, setCurrent] = React.useState('');
  const [next, setNext] = React.useState('');
  const [confirm, setConfirm] = React.useState('');
  const [showCurrent, setShowCurrent] = React.useState(false);
  const [showNext, setShowNext] = React.useState(false);
  const [showConfirm, setShowConfirm] = React.useState(false);
  const [error, setError] = React.useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = React.useState(false);

  const onSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setError(null);
    setIsSubmitting(true);

    try {
      const formData = new FormData();
      formData.set('currentPassword', current);
      formData.set('newPassword', next);
      formData.set('confirmPassword', confirm);

      const result = await changePassword(formData);
      if (!result.ok) {
        setError(result.error ?? 'Failed to change password.');
        toast.error(result.error ?? 'Failed to change password');
      } else {
        toast.success('Password changed successfully');
        setCurrent('');
        setNext('');
        setConfirm('');
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
      {/* Password change card */}
      <Card className="border-border bg-card shadow-card">
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-lg">
            <KeyRound className="h-4 w-4 text-brand-blue" aria-hidden="true" />
            Change Password
          </CardTitle>
          <CardDescription>
            Use a strong password with at least 8 characters including uppercase, lowercase, and a number.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={onSubmit} className="space-y-5">
            <FormField label="Current Password" htmlFor="current" required>
              <div className="relative">
                <Input
                  id="current"
                  type={showCurrent ? 'text' : 'password'}
                  value={current}
                  onChange={(e) => setCurrent(e.target.value)}
                  required
                  autoComplete="current-password"
                  className="pr-9"
                />
                <button
                  type="button"
                  onClick={() => setShowCurrent((s) => !s)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-xs text-muted-foreground hover:text-foreground"
                  aria-label={showCurrent ? 'Hide password' : 'Show password'}
                >
                  {showCurrent ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                </button>
              </div>
            </FormField>

            <FormField label="New Password" htmlFor="new" required>
              <div className="relative">
                <Input
                  id="new"
                  type={showNext ? 'text' : 'password'}
                  value={next}
                  onChange={(e) => setNext(e.target.value)}
                  required
                  autoComplete="new-password"
                  className="pr-9"
                  minLength={8}
                />
                <button
                  type="button"
                  onClick={() => setShowNext((s) => !s)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-xs text-muted-foreground hover:text-foreground"
                  aria-label={showNext ? 'Hide password' : 'Show password'}
                >
                  {showNext ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                </button>
              </div>
            </FormField>

            <FormField label="Confirm New Password" htmlFor="confirm" required>
              <div className="relative">
                <Input
                  id="confirm"
                  type={showConfirm ? 'text' : 'password'}
                  value={confirm}
                  onChange={(e) => setConfirm(e.target.value)}
                  required
                  autoComplete="new-password"
                  className="pr-9"
                />
                <button
                  type="button"
                  onClick={() => setShowConfirm((s) => !s)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-xs text-muted-foreground hover:text-foreground"
                  aria-label={showConfirm ? 'Hide password' : 'Show password'}
                >
                  {showConfirm ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                </button>
              </div>
            </FormField>

            {error && (
              <p className="text-sm text-destructive" role="alert">
                {error}
              </p>
            )}

            <FormActions submitLabel="Change Password" cancelLabel="Clear" isSubmitting={isSubmitting} onCancel={() => {
              setCurrent('');
              setNext('');
              setConfirm('');
              setError(null);
            }} />
          </form>
        </CardContent>
      </Card>

      {/* Sessions + Activity card */}
      <div className="space-y-6">
        <Card className="border-border bg-card shadow-card">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-lg">
              <ShieldCheck className="h-4 w-4 text-emerald-500" aria-hidden="true" />
              Account Status
            </CardTitle>
            <CardDescription>Your account security overview</CardDescription>
          </CardHeader>
          <CardContent className="space-y-3 text-sm">
            <div className="flex items-center justify-between">
              <span className="text-muted-foreground">Email</span>
              <span className="font-medium text-foreground">{user.email}</span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-muted-foreground">Status</span>
              <Badge className="bg-emerald-500/10 text-emerald-600 dark:text-emerald-400">Active</Badge>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-muted-foreground">Role</span>
              <Badge>ADMIN</Badge>
            </div>
            {user.lastLoginAt && (
              <div className="flex items-center justify-between">
                <span className="flex items-center gap-1 text-muted-foreground">
                  <Clock className="h-3 w-3" />
                  Last login
                </span>
                <span className="text-xs text-foreground" title={user.lastLoginAt.toLocaleString()}>
                  {formatDistanceToNow(user.lastLoginAt, { addSuffix: true })}
                </span>
              </div>
            )}
            <div className="flex items-center justify-between">
              <span className="flex items-center gap-1 text-muted-foreground">
                <Clock className="h-3 w-3" />
                Last update
              </span>
              <span className="text-xs text-foreground" title={user.updatedAt.toLocaleString()}>
                {formatDistanceToNow(user.updatedAt, { addSuffix: true })}
              </span>
            </div>
          </CardContent>
        </Card>

        <Card className="border-border bg-card shadow-card">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-base">
              <History className="h-4 w-4 text-brand-cyan" aria-hidden="true" />
              Recent Activity
            </CardTitle>
            <CardDescription>Your last 8 actions in the CMS</CardDescription>
          </CardHeader>
          <CardContent>
            <ul className="space-y-1">
              {recentActivity.length === 0 ? (
                <li className="py-4 text-center text-sm text-muted-foreground">No activity yet.</li>
              ) : (
                recentActivity.map((entry) => (
                  <li
                    key={entry.id}
                    className="flex items-center gap-2 rounded-md px-2 py-1.5 transition-colors hover:bg-muted/40"
                  >
                    <span className={`flex h-7 w-7 items-center justify-center rounded-md ${actionToneFor(entry.action)}`}>
                      {actionIconFor(entry.action)}
                    </span>
                    <div className="min-w-0 flex-1">
                      <p className="text-sm font-medium text-foreground">{formatAction(entry.action)}</p>
                      {entry.ip && (
                        <p className="truncate text-xs text-muted-foreground">IP: {entry.ip}</p>
                      )}
                    </div>
                    <time className="shrink-0 text-xs text-muted-foreground" dateTime={entry.createdAt.toISOString()}>
                      {formatDistanceToNow(entry.createdAt, { addSuffix: true })}
                    </time>
                  </li>
                ))
              )}
            </ul>
          </CardContent>
        </Card>

        {passwordResets.length > 0 && (
          <Card className="border-border bg-card shadow-card">
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-base">
                <KeyRound className="h-4 w-4 text-amber-500" aria-hidden="true" />
                Password Reset History
              </CardTitle>
              <CardDescription>Recent password reset requests for this account</CardDescription>
            </CardHeader>
            <CardContent>
              <ul className="space-y-1.5 text-sm">
                {passwordResets.map((reset) => (
                  <li key={reset.id} className="flex items-center justify-between border-b border-border/40 py-1.5 last:border-0">
                    <span className="text-muted-foreground">
                      {formatDistanceToNow(reset.createdAt, { addSuffix: true })}
                    </span>
                    {reset.usedAt ? (
                      <Badge className="bg-emerald-500/10 text-emerald-600 dark:text-emerald-400">Used</Badge>
                    ) : reset.expiresAt > new Date() ? (
                      <Badge className="bg-amber-500/10 text-amber-600 dark:text-amber-400">Active</Badge>
                    ) : (
                      <Badge className="bg-muted text-muted-foreground">Expired</Badge>
                    )}
                  </li>
                ))}
              </ul>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
}

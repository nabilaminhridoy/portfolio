'use client';

import * as React from 'react';
import { toast } from 'sonner';
import { Save, Mail, Server, Send, Power, Eye, EyeOff } from 'lucide-react';

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Switch } from '@/components/ui/switch';
import { Label } from '@/components/ui/label';
import { FormField } from '@/components/admin/form-layout';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { updateSmtpSettings, sendTestEmail } from '@/lib/actions/smtp';

interface SmtpData {
  host: string;
  port: string;
  encryption: string;
  username: string;
  password: string;
  fromName: string;
  fromEmail: string;
  isEnabled: boolean;
}

export function SmtpForm({ initial }: { initial?: SmtpData }) {
  const [host, setHost] = React.useState(initial?.host ?? '');
  const [port, setPort] = React.useState(initial?.port ?? '');
  const [encryption, setEncryption] = React.useState(initial?.encryption ?? 'TLS');
  const [username, setUsername] = React.useState(initial?.username ?? '');
  const [password, setPassword] = React.useState(initial?.password ?? '');
  const [fromName, setFromName] = React.useState(initial?.fromName ?? '');
  const [fromEmail, setFromEmail] = React.useState(initial?.fromEmail ?? '');
  const [isEnabled, setIsEnabled] = React.useState(initial?.isEnabled ?? false);
  const [isSubmitting, setIsSubmitting] = React.useState(false);
  const [error, setError] = React.useState<string | null>(null);

  // Test email state
  const [recipient, setRecipient] = React.useState('');
  const [isSendingTest, setIsSendingTest] = React.useState(false);

  const [showPassword, setShowPassword] = React.useState(false);

  const onSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setError(null);
    setIsSubmitting(true);

    try {
      const formData = new FormData();
      formData.set('host', host);
      formData.set('port', port);
      formData.set('encryption', encryption);
      formData.set('username', username);
      formData.set('password', password);
      formData.set('fromName', fromName);
      formData.set('fromEmail', fromEmail);
      if (isEnabled) formData.set('isEnabled', 'on');

      const result = await updateSmtpSettings(formData);
      if (!result.ok) {
        setError(result.error ?? 'Failed to save.');
        toast.error(result.error ?? 'Failed to save SMTP settings');
      } else {
        toast.success('SMTP settings saved successfully');
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  const onSendTest = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setError(null);
    setIsSendingTest(true);

    try {
      const formData = new FormData();
      formData.set('recipient', recipient);

      const result = await sendTestEmail(formData);
      if (!result.ok) {
        setError(result.error ?? 'Failed to send test email.');
        toast.error(result.error ?? 'Failed to send test email');
      } else {
        toast.success(result.message ?? 'Test email sent successfully');
      }
    } finally {
      setIsSendingTest(false);
    }
  };

  return (
    <div className="space-y-6">
      <form onSubmit={onSubmit} className="space-y-6">
        {/* Connection */}
        <Card className="border-border bg-card shadow-card">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-lg">
              <Server className="h-4 w-4 text-brand-blue" aria-hidden="true" />
              Connection
            </CardTitle>
            <CardDescription>
              SMTP server details used for outgoing emails (contact form, notifications)
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-5">
            <div className="grid grid-cols-1 gap-5 sm:grid-cols-2">
              <FormField label="SMTP Host" htmlFor="host" description="Server hostname (e.g. smtp.gmail.com).">
                <Input
                  id="host"
                  type="text"
                  value={host}
                  onChange={(e) => setHost(e.target.value)}
                  placeholder="smtp.gmail.com"
                  autoComplete="off"
                  spellCheck={false}
                />
              </FormField>
              <FormField label="Port" htmlFor="port" description="Common: 587 (TLS), 465 (SSL), 25 (none).">
                <Input
                  id="port"
                  type="number"
                  min={1}
                  max={65535}
                  value={port}
                  onChange={(e) => setPort(e.target.value)}
                  placeholder="587"
                />
              </FormField>
            </div>
            <FormField label="Encryption" htmlFor="encryption" description="TLS uses STARTTLS (recommended). SSL uses implicit TLS. NONE disables encryption.">
              <Select value={encryption} onValueChange={setEncryption}>
                <SelectTrigger id="encryption" className="w-full sm:w-64">
                  <SelectValue placeholder="Select encryption" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="TLS">TLS (STARTTLS)</SelectItem>
                  <SelectItem value="SSL">SSL (implicit)</SelectItem>
                  <SelectItem value="NONE">None</SelectItem>
                </SelectContent>
              </Select>
            </FormField>
            <div className="grid grid-cols-1 gap-5 sm:grid-cols-2">
              <FormField label="Username" htmlFor="username" description="Typically the full email used for authentication.">
                <Input
                  id="username"
                  type="text"
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  placeholder="you@example.com"
                  autoComplete="off"
                  spellCheck={false}
                />
              </FormField>
              <FormField label="Password" htmlFor="password" description="SMTP password or app-specific password (Gmail).">
                <div className="relative">
                  <Input
                    id="password"
                    type={showPassword ? 'text' : 'password'}
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="••••••••"
                    autoComplete="off"
                    className="pr-9"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword((s) => !s)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-xs text-muted-foreground hover:text-foreground"
                    aria-label={showPassword ? 'Hide password' : 'Show password'}
                  >
                    {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                  </button>
                </div>
              </FormField>
            </div>
          </CardContent>
        </Card>

        {/* Sender */}
        <Card className="border-border bg-card shadow-card">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-lg">
              <Mail className="h-4 w-4 text-brand-cyan" aria-hidden="true" />
              Sender
            </CardTitle>
            <CardDescription>
              The name and email shown on outgoing messages
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-5">
            <div className="grid grid-cols-1 gap-5 sm:grid-cols-2">
              <FormField label="From Name" htmlFor="fromName" description="Display name shown in recipients' inboxes.">
                <Input
                  id="fromName"
                  type="text"
                  value={fromName}
                  onChange={(e) => setFromName(e.target.value)}
                  placeholder="Nabil Amin Hridoy"
                />
              </FormField>
              <FormField label="From Email" htmlFor="fromEmail" description="Address that appears in the From field.">
                <Input
                  id="fromEmail"
                  type="email"
                  value={fromEmail}
                  onChange={(e) => setFromEmail(e.target.value)}
                  placeholder="noreply@example.com"
                />
              </FormField>
            </div>
          </CardContent>
        </Card>

        {/* Master toggle */}
        <Card className="border-amber-500/30 bg-amber-500/5 shadow-card">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-lg">
              <Power className="h-4 w-4 text-amber-500" aria-hidden="true" />
              Master Toggle
            </CardTitle>
            <CardDescription>
              Disable to suppress all outgoing emails (useful for staging)
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="flex items-center justify-between rounded-md border border-border bg-card p-4">
              <div className="space-y-0.5">
                <Label htmlFor="isEnabled" className="text-sm font-medium">
                  Enable SMTP
                </Label>
                <p className="text-xs text-muted-foreground">
                  When off, the contact form will save messages but skip email delivery.
                </p>
              </div>
              <Switch
                id="isEnabled"
                checked={isEnabled}
                onCheckedChange={setIsEnabled}
                aria-label="Toggle SMTP"
              />
            </div>
          </CardContent>
        </Card>

        {error && (
          <p className="text-sm text-destructive" role="alert">
            {error}
          </p>
        )}

        <div className="flex justify-end border-t border-border pt-4">
          <Button type="submit" disabled={isSubmitting} className="gap-2">
            <Save className="h-4 w-4" aria-hidden="true" />
            {isSubmitting ? 'Saving...' : 'Save SMTP'}
          </Button>
        </div>
      </form>

      {/* Test email */}
      <Card className="border-border bg-card shadow-card">
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-lg">
            <Send className="h-4 w-4 text-brand-blue" aria-hidden="true" />
            Test Email
          </CardTitle>
          <CardDescription>
            Send a test message to verify your SMTP configuration. Save settings first.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={onSendTest} className="space-y-4">
            <FormField
              label="Recipient Email"
              htmlFor="recipient"
              description="The address that will receive the test message."
            >
              <Input
                id="recipient"
                type="email"
                value={recipient}
                onChange={(e) => setRecipient(e.target.value)}
                placeholder="you@example.com"
                required
              />
            </FormField>
            <div className="flex justify-end">
              <Button
                type="submit"
                variant="outline"
                disabled={isSendingTest || !isEnabled}
                className="gap-2"
              >
                <Send className="h-4 w-4" aria-hidden="true" />
                {isSendingTest ? 'Sending...' : 'Send Test Email'}
              </Button>
            </div>
            {!isEnabled && (
              <p className="text-xs text-muted-foreground">
                Enable and save SMTP settings above before sending a test email.
              </p>
            )}
          </form>
        </CardContent>
      </Card>
    </div>
  );
}

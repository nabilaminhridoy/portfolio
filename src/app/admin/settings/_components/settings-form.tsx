'use client';

import * as React from 'react';
import { toast } from 'sonner';
import { Globe, Wrench, Image as ImageIcon, Phone, Mail, MapPin, Clock, Calendar, Type } from 'lucide-react';

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Switch } from '@/components/ui/switch';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { FormField, FormActions } from '@/components/admin/form-layout';
import { updateSettings } from '@/lib/actions/settings';

interface SettingsData {
  defaultLocale: string;
  defaultTheme: string;
  maintenanceMode: boolean;
  favicon: string;
  logo: string;
  siteName: string;
  tagline: string;
  location: string;
  phone: string;
  email: string;
  timezone: string;
  timeFormat: string;
  dateFormat: string;
}

const TIMEZONES = [
  'Asia/Dhaka',
  'Asia/Kolkata',
  'Asia/Karachi',
  'Asia/Dubai',
  'Asia/Singapore',
  'Europe/London',
  'America/New_York',
  'America/Los_Angeles',
  'UTC',
];

export function SettingsForm({ initial }: { initial: SettingsData }) {
  const [defaultLocale, setDefaultLocale] = React.useState(initial.defaultLocale);
  const [defaultTheme, setDefaultTheme] = React.useState(initial.defaultTheme);
  const [maintenanceMode, setMaintenanceMode] = React.useState(initial.maintenanceMode);
  const [favicon, setFavicon] = React.useState(initial.favicon);
  const [logo, setLogo] = React.useState(initial.logo);
  const [siteName, setSiteName] = React.useState(initial.siteName);
  const [tagline, setTagline] = React.useState(initial.tagline);
  const [location, setLocation] = React.useState(initial.location);
  const [phone, setPhone] = React.useState(initial.phone);
  const [email, setEmail] = React.useState(initial.email);
  const [timezone, setTimezone] = React.useState(initial.timezone);
  const [timeFormat, setTimeFormat] = React.useState(initial.timeFormat);
  const [dateFormat, setDateFormat] = React.useState(initial.dateFormat);
  const [isSubmitting, setIsSubmitting] = React.useState(false);

  const onSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      const formData = new FormData();
      formData.set('defaultLocale', defaultLocale);
      formData.set('defaultTheme', defaultTheme);
      if (maintenanceMode) formData.set('maintenanceMode', 'on');
      formData.set('favicon', favicon);
      formData.set('logo', logo);
      formData.set('siteName', siteName);
      formData.set('tagline', tagline);
      formData.set('location', location);
      formData.set('phone', phone);
      formData.set('email', email);
      formData.set('timezone', timezone);
      formData.set('timeFormat', timeFormat);
      formData.set('dateFormat', dateFormat);

      const result = await updateSettings(formData);
      if (!result.ok) {
        toast.error(result.error ?? 'Failed to save settings');
      } else {
        toast.success('Settings saved successfully');
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <form onSubmit={onSubmit} className="space-y-6">
      {/* Branding */}
      <Card className="border-border bg-card shadow-card">
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-lg">
            <ImageIcon className="h-4 w-4 text-brand-blue" aria-hidden="true" />
            Branding
          </CardTitle>
          <CardDescription>Favicon, logo, site name, and tagline</CardDescription>
        </CardHeader>
        <CardContent className="space-y-5">
          <div className="grid grid-cols-1 gap-5 sm:grid-cols-2">
            <FormField label="Favicon URL" htmlFor="favicon" description="Icon shown in browser tab (e.g. .ico or .png)">
              <Input id="favicon" type="url" value={favicon} onChange={(e) => setFavicon(e.target.value)} placeholder="https://..." />
            </FormField>
            <FormField label="Logo URL" htmlFor="logo" description="Logo shown in admin header + public navbar">
              <Input id="logo" type="url" value={logo} onChange={(e) => setLogo(e.target.value)} placeholder="https://..." />
            </FormField>
          </div>
          <div className="grid grid-cols-1 gap-5 sm:grid-cols-2">
            <FormField label="Site Name" htmlFor="siteName" description="Display name for the site">
              <Input id="siteName" type="text" value={siteName} onChange={(e) => setSiteName(e.target.value)} placeholder="Nabil Amin Hridoy" />
            </FormField>
            <FormField label="Tagline" htmlFor="tagline" description="Short one-line description">
              <Input id="tagline" type="text" value={tagline} onChange={(e) => setTagline(e.target.value)} placeholder="Full Stack Developer" />
            </FormField>
          </div>
        </CardContent>
      </Card>

      {/* Contact Info */}
      <Card className="border-border bg-card shadow-card">
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-lg">
            <Mail className="h-4 w-4 text-brand-blue" aria-hidden="true" />
            Contact Information
          </CardTitle>
          <CardDescription>Shown in the public Contact section (Get in Touch)</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 gap-5 sm:grid-cols-3">
            <FormField label="Email" htmlFor="email">
              <Input id="email" type="email" value={email} onChange={(e) => setEmail(e.target.value)} placeholder="you@example.com" />
            </FormField>
            <FormField label="Phone" htmlFor="phone">
              <Input id="phone" type="tel" value={phone} onChange={(e) => setPhone(e.target.value)} placeholder="+880 1XXX-XXXXXX" />
            </FormField>
            <FormField label="Location" htmlFor="location">
              <Input id="location" type="text" value={location} onChange={(e) => setLocation(e.target.value)} placeholder="Dhaka, Bangladesh" />
            </FormField>
          </div>
        </CardContent>
      </Card>

      {/* Localization */}
      <Card className="border-border bg-card shadow-card">
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-lg">
            <Clock className="h-4 w-4 text-brand-blue" aria-hidden="true" />
            Localization
          </CardTitle>
          <CardDescription>Timezone, time format, date format</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 gap-5 sm:grid-cols-3">
            <FormField label="Timezone" htmlFor="timezone">
              <Select value={timezone} onValueChange={setTimezone}>
                <SelectTrigger id="timezone"><SelectValue placeholder="Select timezone" /></SelectTrigger>
                <SelectContent>
                  {TIMEZONES.map((tz) => <SelectItem key={tz} value={tz}>{tz}</SelectItem>)}
                </SelectContent>
              </Select>
            </FormField>
            <FormField label="Time Format" htmlFor="timeFormat">
              <Select value={timeFormat} onValueChange={setTimeFormat}>
                <SelectTrigger id="timeFormat"><SelectValue placeholder="Select format" /></SelectTrigger>
                <SelectContent>
                  <SelectItem value="12h">12-hour (e.g. 2:30 PM)</SelectItem>
                  <SelectItem value="24h">24-hour (e.g. 14:30)</SelectItem>
                </SelectContent>
              </Select>
            </FormField>
            <FormField label="Date Format" htmlFor="dateFormat">
              <Select value={dateFormat} onValueChange={setDateFormat}>
                <SelectTrigger id="dateFormat"><SelectValue placeholder="Select format" /></SelectTrigger>
                <SelectContent>
                  <SelectItem value="DD/MM/YYYY">DD/MM/YYYY (31/12/2026)</SelectItem>
                  <SelectItem value="MM/DD/YYYY">MM/DD/YYYY (12/31/2026)</SelectItem>
                  <SelectItem value="YYYY-MM-DD">YYYY-MM-DD (2026-12-31)</SelectItem>
                </SelectContent>
              </Select>
            </FormField>
          </div>
        </CardContent>
      </Card>

      {/* General Settings */}
      <Card className="border-border bg-card shadow-card">
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-lg">
            <Globe className="h-4 w-4 text-brand-blue" aria-hidden="true" />
            General
          </CardTitle>
          <CardDescription>Default language, theme, maintenance mode</CardDescription>
        </CardHeader>
        <CardContent className="space-y-5">
          <div className="grid grid-cols-1 gap-5 sm:grid-cols-2">
            <FormField label="Default Language" htmlFor="defaultLocale">
              <Select value={defaultLocale} onValueChange={setDefaultLocale}>
                <SelectTrigger id="defaultLocale"><SelectValue placeholder="Select language" /></SelectTrigger>
                <SelectContent>
                  <SelectItem value="en">English</SelectItem>
                  <SelectItem value="bn">বাংলা (Bangla)</SelectItem>
                </SelectContent>
              </Select>
            </FormField>
            <FormField label="Default Theme" htmlFor="defaultTheme">
              <Select value={defaultTheme} onValueChange={setDefaultTheme}>
                <SelectTrigger id="defaultTheme"><SelectValue placeholder="Select theme" /></SelectTrigger>
                <SelectContent>
                  <SelectItem value="light">Light</SelectItem>
                  <SelectItem value="dark">Dark</SelectItem>
                  <SelectItem value="system">System (auto)</SelectItem>
                </SelectContent>
              </Select>
            </FormField>
          </div>
          <div className="flex items-center justify-between rounded-md border border-amber-500/30 bg-amber-500/5 p-4">
            <div className="space-y-0.5">
              <Label htmlFor="maintenanceMode" className="flex items-center gap-1.5 text-sm font-medium">
                <Wrench className="h-3.5 w-3.5" />
                Maintenance Mode
              </Label>
              <p className="text-xs text-muted-foreground">Visitors see a maintenance page. Admin stays accessible.</p>
            </div>
            <Switch id="maintenanceMode" checked={maintenanceMode} onCheckedChange={setMaintenanceMode} />
          </div>
        </CardContent>
      </Card>

      <div className="flex justify-end">
        <FormActions submitLabel="Save Settings" isSubmitting={isSubmitting} />
      </div>
    </form>
  );
}

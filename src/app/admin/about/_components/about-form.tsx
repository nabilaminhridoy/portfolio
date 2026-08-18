'use client';

import * as React from 'react';
import { toast } from 'sonner';
import { Save, UserCircle } from 'lucide-react';

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import { FormField } from '@/components/admin/form-layout';
import { BilingualInput, BilingualTextarea } from '@/components/admin/crud/bilingual-field';
import { updateAbout } from '@/lib/actions/about';

interface AboutData {
  id?: string;
  nameEn: string;
  nameBn: string;
  roleEn: string;
  roleBn: string;
  bioEn: string;
  bioBn: string;
  locationEn: string;
  locationBn: string;
  email: string;
  phone: string;
  profileImageUrl: string;
  available: boolean;
  // CMS-controlled stats — null = hidden on public site
  yearsExperience: number | null;
  projectsCompleted: number | null;
  happyClients: number | null;
  technologiesCount: number | null;
}

export function AboutForm({ initial }: { initial?: AboutData }) {
  const [nameEn, setNameEn] = React.useState(initial?.nameEn ?? '');
  const [nameBn, setNameBn] = React.useState(initial?.nameBn ?? '');
  const [roleEn, setRoleEn] = React.useState(initial?.roleEn ?? '');
  const [roleBn, setRoleBn] = React.useState(initial?.roleBn ?? '');
  const [bioEn, setBioEn] = React.useState(initial?.bioEn ?? '');
  const [bioBn, setBioBn] = React.useState(initial?.bioBn ?? '');
  const [locationEn, setLocationEn] = React.useState(initial?.locationEn ?? '');
  const [locationBn, setLocationBn] = React.useState(initial?.locationBn ?? '');
  const [email, setEmail] = React.useState(initial?.email ?? '');
  const [phone, setPhone] = React.useState(initial?.phone ?? '');
  const [profileImageUrl, setProfileImageUrl] = React.useState(initial?.profileImageUrl ?? '');
  const [available, setAvailable] = React.useState(initial?.available ?? true);
  const [yearsExperience, setYearsExperience] = React.useState(
    initial?.yearsExperience != null ? String(initial.yearsExperience) : ''
  );
  const [projectsCompleted, setProjectsCompleted] = React.useState(
    initial?.projectsCompleted != null ? String(initial.projectsCompleted) : ''
  );
  const [happyClients, setHappyClients] = React.useState(
    initial?.happyClients != null ? String(initial.happyClients) : ''
  );
  const [technologiesCount, setTechnologiesCount] = React.useState(
    initial?.technologiesCount != null ? String(initial.technologiesCount) : ''
  );
  const [isSubmitting, setIsSubmitting] = React.useState(false);
  const [error, setError] = React.useState<string | null>(null);

  const onSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setError(null);
    setIsSubmitting(true);

    try {
      const formData = new FormData();
      formData.set('nameEn', nameEn);
      formData.set('nameBn', nameBn);
      formData.set('roleEn', roleEn);
      formData.set('roleBn', roleBn);
      formData.set('bioEn', bioEn);
      formData.set('bioBn', bioBn);
      formData.set('locationEn', locationEn);
      formData.set('locationBn', locationBn);
      formData.set('email', email);
      formData.set('phone', phone);
      formData.set('profileImageUrl', profileImageUrl);
      // Stats — empty = null (hidden on public site)
      formData.set('yearsExperience', yearsExperience);
      formData.set('projectsCompleted', projectsCompleted);
      formData.set('happyClients', happyClients);
      formData.set('technologiesCount', technologiesCount);
      if (available) formData.set('available', 'on');

      const result = await updateAbout(formData);
      if (!result.ok) {
        setError(result.error ?? 'Failed to save.');
        toast.error(result.error ?? 'Failed to save about content');
      } else {
        toast.success('About content saved successfully');
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <form onSubmit={onSubmit} className="space-y-6">
      {/* Identity card */}
      <Card className="border-border bg-card shadow-card">
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-lg">
            <UserCircle className="h-4 w-4 text-brand-blue" aria-hidden="true" />
            Identity
          </CardTitle>
          <CardDescription>Your name, role, and profile photo</CardDescription>
        </CardHeader>
        <CardContent className="space-y-5">
          <BilingualInput
            label="Name"
            enId="nameEn" bnId="nameBn"
            enValue={nameEn} bnValue={nameBn}
            onEnChange={setNameEn} onBnChange={setNameBn}
            required
            placeholderEn="Nabil Amin Hridoy"
            placeholderBn="নাবিল আমিন হৃদয়"
          />
          <BilingualInput
            label="Role"
            enId="roleEn" bnId="roleBn"
            enValue={roleEn} bnValue={roleBn}
            onEnChange={setRoleEn} onBnChange={setRoleBn}
            required
            placeholderEn="Full Stack Developer"
            placeholderBn="ফুল স্ট্যাক ডেভেলপার"
          />
          <FormField label="Profile Image URL" htmlFor="profileImageUrl" description="Optional. URL to your profile photo.">
            <Input
              id="profileImageUrl"
              type="url"
              value={profileImageUrl}
              onChange={(e) => setProfileImageUrl(e.target.value)}
              placeholder="https://..."
            />
          </FormField>
        </CardContent>
      </Card>

      {/* Bio card */}
      <Card className="border-border bg-card shadow-card">
        <CardHeader>
          <CardTitle className="text-lg">Biography</CardTitle>
          <CardDescription>Long-form intro shown on the About section</CardDescription>
        </CardHeader>
        <CardContent>
          <BilingualTextarea
            label="Bio"
            enId="bioEn" bnId="bioBn"
            enValue={bioEn} bnValue={bioBn}
            onEnChange={setBioEn} onBnChange={setBioBn}
            required
            rows={6}
            placeholderEn="I'm a Full Stack Developer..."
            placeholderBn="আমি একজন ফুল স্ট্যাক ডেভেলপার..."
          />
        </CardContent>
      </Card>

      {/* Contact card */}
      <Card className="border-border bg-card shadow-card">
        <CardHeader>
          <CardTitle className="text-lg">Contact</CardTitle>
          <CardDescription>Location, email, phone, availability</CardDescription>
        </CardHeader>
        <CardContent className="space-y-5">
          <BilingualInput
            label="Location"
            enId="locationEn" bnId="locationBn"
            enValue={locationEn} bnValue={locationBn}
            onEnChange={setLocationEn} onBnChange={setLocationBn}
            placeholderEn="Dhaka, Bangladesh"
            placeholderBn="ঢাকা, বাংলাদেশ"
          />
          <div className="grid grid-cols-1 gap-5 sm:grid-cols-2">
            <FormField label="Email" htmlFor="email">
              <Input
                id="email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="you@example.com"
              />
            </FormField>
            <FormField label="Phone" htmlFor="phone">
              <Input
                id="phone"
                type="tel"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                placeholder="+880 1XXX-XXXXXX"
              />
            </FormField>
          </div>
          <div className="flex items-center justify-between rounded-md border border-border bg-muted/20 p-4">
            <div className="space-y-0.5">
              <Label htmlFor="available" className="text-sm font-medium">
                Available for freelance
              </Label>
              <p className="text-xs text-muted-foreground">
                Toggle on to show the &quot;Available&quot; badge in the Hero section
              </p>
            </div>
            <Switch
              id="available"
              checked={available}
              onCheckedChange={setAvailable}
              aria-label="Toggle availability"
            />
          </div>
        </CardContent>
      </Card>

      {/* Stats card — CMS-controlled, empty = hidden on public site */}
      <Card className="border-border bg-card shadow-card">
        <CardHeader>
          <CardTitle className="text-lg">Statistics</CardTitle>
          <CardDescription>
            Optional. Leave blank to hide that stat from the public About section. Set real values when you have them.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4">
            <FormField
              label="Years of Experience"
              htmlFor="yearsExperience"
              description="Leave blank = hidden"
            >
              <Input
                id="yearsExperience"
                type="number"
                min={0}
                value={yearsExperience}
                onChange={(e) => setYearsExperience(e.target.value)}
                placeholder="e.g. 5"
              />
            </FormField>
            <FormField
              label="Projects Completed"
              htmlFor="projectsCompleted"
              description="Leave blank = hidden"
            >
              <Input
                id="projectsCompleted"
                type="number"
                min={0}
                value={projectsCompleted}
                onChange={(e) => setProjectsCompleted(e.target.value)}
                placeholder="e.g. 24"
              />
            </FormField>
            <FormField
              label="Happy Clients"
              htmlFor="happyClients"
              description="Leave blank = hidden"
            >
              <Input
                id="happyClients"
                type="number"
                min={0}
                value={happyClients}
                onChange={(e) => setHappyClients(e.target.value)}
                placeholder="e.g. 18"
              />
            </FormField>
            <FormField
              label="Technologies Count"
              htmlFor="technologiesCount"
              description="Leave blank = auto-computed"
            >
              <Input
                id="technologiesCount"
                type="number"
                min={0}
                value={technologiesCount}
                onChange={(e) => setTechnologiesCount(e.target.value)}
                placeholder="e.g. 27"
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

      <div className="flex justify-end border-t border-border pt-4">
        <Button type="submit" disabled={isSubmitting} className="gap-2">
          <Save className="h-4 w-4" aria-hidden="true" />
          {isSubmitting ? 'Saving...' : 'Save About'}
        </Button>
      </div>
    </form>
  );
}

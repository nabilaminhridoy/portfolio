import { db } from '@/lib/db';
import { SettingsForm } from './_components/settings-form';

export const metadata = {
  title: 'Settings',
};

export const dynamic = 'force-dynamic';

export default async function SettingsPage() {
  const settings = await db.settings.findUnique({ where: { id: 'global' } });

  return (
    <SettingsForm
      initial={{
        defaultLocale: settings?.defaultLocale ?? 'en',
        defaultTheme: settings?.defaultTheme ?? 'system',
        maintenanceMode: settings?.maintenanceMode ?? false,
        favicon: settings?.favicon ?? '',
        logo: settings?.logo ?? '',
        siteName: settings?.siteName ?? '',
        tagline: settings?.tagline ?? '',
        location: settings?.location ?? '',
        phone: settings?.phone ?? '',
        email: settings?.email ?? '',
        timezone: settings?.timezone ?? 'Asia/Dhaka',
        timeFormat: settings?.timeFormat ?? '12h',
        dateFormat: settings?.dateFormat ?? 'DD/MM/YYYY',
      }}
    />
  );
}

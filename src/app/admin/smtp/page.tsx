import { db } from '@/lib/db';
import { SmtpForm } from './_components/smtp-form';

export const metadata = {
  title: 'SMTP',
};

export const dynamic = 'force-dynamic';

export default async function SmtpPage() {
  const smtp = await db.smtpSetting.findUnique({ where: { id: 'global' } });

  return (
    <SmtpForm
      initial={
        smtp
          ? {
              host: smtp.host ?? '',
              port: smtp.port != null ? String(smtp.port) : '',
              encryption: smtp.encryption ?? 'TLS',
              username: smtp.username ?? '',
              password: smtp.password ?? '',
              fromName: smtp.fromName ?? '',
              fromEmail: smtp.fromEmail ?? '',
              isEnabled: smtp.isEnabled,
            }
          : undefined
      }
    />
  );
}

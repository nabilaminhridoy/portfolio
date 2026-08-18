import * as React from 'react';
import { NextIntlClientProvider } from 'next-intl';

import enMessages from '../../../messages/en.json';
import { Navbar } from '@/components/public/navbar';
import { Footer } from '@/components/public/footer';
import { GlobalBackground } from '@/components/public/global-background';

/**
 * AuthShell — wraps auth/error pages (login, forgot-password, reset-password, 404)
 * with the same floating glass Navbar + minimal Footer used on the public site.
 *
 * Uses English locale + messages since these pages are at root level (not locale-prefixed).
 * Nav links point to /#section which redirects to /en (the home page).
 */
export function AuthShell({ children }: { children: React.ReactNode }) {
  return (
    <NextIntlClientProvider locale="en" messages={enMessages} timeZone="Asia/Dhaka">
      <GlobalBackground />
      <div className="relative flex min-h-screen flex-col">
        <Navbar />
        <main className="flex flex-1 items-center justify-center px-4 py-12">
          {children}
        </main>
        <Footer />
      </div>
    </NextIntlClientProvider>
  );
}

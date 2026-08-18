'use client';

import * as React from 'react';
import { useTranslations } from 'next-intl';
import { Link } from '@/i18n/routing';
import { Container } from '@/components/layout/container';
import { Button } from '@/components/ui/button';
import { AlertTriangle, RotateCcw } from 'lucide-react';

export default function LocaleError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  const t = useTranslations('Error');
  const tNotFound = useTranslations('NotFound');

  React.useEffect(() => {
    console.error('[LocaleError]', error);
  }, [error]);

  return (
    <Container className="py-32">
      <div className="mx-auto flex max-w-md flex-col items-center text-center">
        <div className="mb-6 flex h-16 w-16 items-center justify-center rounded-full bg-destructive/10 text-destructive">
          <AlertTriangle className="h-8 w-8" />
        </div>
        <h1 className="text-h2 font-bold tracking-tight text-foreground">
          {t('title')}
        </h1>
        <p className="mt-2 text-sm text-muted-foreground">
          {t('description')}
        </p>
        <div className="mt-8 flex flex-wrap gap-3">
          <Button onClick={reset} variant="default" className="gap-2">
            <RotateCcw className="h-4 w-4" />
            {t('tryAgain')}
          </Button>
          <Button asChild variant="outline" className="gap-2">
            <Link href="/">
              {tNotFound('backHome')}
            </Link>
          </Button>
        </div>
      </div>
    </Container>
  );
}

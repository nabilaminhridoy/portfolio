'use client';

import * as React from 'react';
import { signOut } from 'next-auth/react';
import { Loader2 } from 'lucide-react';
import { MeshBackground } from '@/components/shared/mesh-background';

export default function LogoutPage() {
  const [signedOut, setSignedOut] = React.useState(false);

  React.useEffect(() => {
    if (signedOut) return;
    setSignedOut(true);

    // Fire-and-forget signOut — redirect to /login once cookies are cleared
    void signOut({ redirect: false }).then(() => {
      window.location.href = '/login';
    }).catch(() => {
      window.location.href = '/login';
    });
  }, [signedOut]);

  return (
    <div className="relative flex min-h-screen items-center justify-center bg-background">
      <MeshBackground variant="subtle" />
      <div className="flex flex-col items-center gap-4 text-center">
        <Loader2 className="h-8 w-8 animate-spin text-primary" aria-hidden="true" />
        <p className="text-sm text-muted-foreground">Signing out…</p>
      </div>
    </div>
  );
}

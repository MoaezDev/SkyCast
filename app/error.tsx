'use client';

import { useEffect } from 'react';
import { ErrorMessage } from '@/components/ErrorMessage';

export default function GlobalError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    console.error(error);
  }, [error]);

  return (
    <main className="grid min-h-dvh place-items-center bg-gradient-to-br from-slate-800 to-slate-950 p-6">
      <ErrorMessage
        title="App crashed"
        message={error.message || 'An unexpected error occurred.'}
        onRetry={reset}
      />
    </main>
  );
}

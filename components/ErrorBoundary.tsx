'use client';

import { useEffect } from 'react';

export default function ErrorBoundary({ error }: { error: Error }) {
  useEffect(() => {
    console.error('Error Boundary:', error);
  }, [error]);

  return (
    <div className="p-4 bg-red-50 text-red-700 rounded-lg border border-red-200">
      <h2 className="text-lg font-semibold">Application Error</h2>
      <p className="mt-2 text-sm">{error.message}</p>
    </div>
  );
}

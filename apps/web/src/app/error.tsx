'use client';

import { useEffect } from 'react';

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    // The original error (e.g. StrapiError with status/path) is already logged
    // server-side where it was thrown; this just surfaces it in the browser console too.
    console.error(error);
  }, [error]);

  return (
    <div
      role="alert"
      className="flex flex-1 flex-col items-center justify-center gap-4 p-16 text-center"
    >
      <p className="text-sm text-gray-500">Something went wrong loading this page.</p>
      <button
        type="button"
        onClick={() => reset()}
        className="rounded border border-gray-300 px-4 py-2 text-sm text-gray-700"
      >
        Try again
      </button>
    </div>
  );
}

'use client';

import React, { useEffect } from 'react';
import Link from 'next/link';

export default function GlobalError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    // Log error to console or error tracking service (e.g., Sentry) in production
    console.error('OnFresh Application Error:', error);
  }, [error]);

  return (
    <div className="min-h-screen bg-[#fafaf9] flex flex-col items-center justify-center p-6 text-center">
      <div className="max-w-md w-full bg-white p-8 rounded-3xl border border-stone-200 shadow-sm">
        <div className="w-16 h-16 bg-red-100 text-red-600 rounded-2xl flex items-center justify-center text-3xl mx-auto mb-4">
          ⚠️
        </div>
        <h2 className="text-xl font-bold text-stone-900 mb-2">Something went wrong</h2>
        <p className="text-sm text-stone-600 mb-6 leading-relaxed">
          An unexpected error occurred while loading this page. Our team in Vandiperiyar has been notified.
        </p>

        <div className="flex gap-2.5 justify-center">
          <button
            onClick={() => reset()}
            className="px-5 py-2.5 bg-[#093725] text-amber-300 font-bold text-xs rounded-xl hover:bg-[#062519] transition"
          >
            Try Again
          </button>
          <Link
            href="/"
            className="px-5 py-2.5 bg-stone-100 text-stone-700 font-semibold text-xs rounded-xl hover:bg-stone-200 transition"
          >
            Return Home
          </Link>
        </div>
      </div>
    </div>
  );
}


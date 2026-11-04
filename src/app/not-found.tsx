import React from 'react';
import Link from 'next/link';

export default function NotFound() {
  return (
    <div className="min-h-screen bg-[#fafaf9] flex flex-col items-center justify-center p-6 text-center">
      <div className="max-w-md w-full bg-white p-8 rounded-3xl border border-stone-200 shadow-sm">
        <div className="w-20 h-20 bg-amber-100 text-amber-900 rounded-3xl flex items-center justify-center text-4xl mx-auto mb-5 shadow-xs">
          🍌
        </div>
        <span className="text-xs font-bold uppercase tracking-widest text-emerald-800 bg-emerald-50 px-3 py-1 rounded-full">
          Error 404
        </span>
        <h1 className="text-2xl font-black text-stone-900 mt-4 mb-2">
          Packet Not Found
        </h1>
        <p className="text-sm text-stone-600 leading-relaxed mb-6">
          The page or Kerala snack you are looking for has been moved, finished, or does not exist.
        </p>

        <div className="flex flex-col sm:flex-row gap-2.5 justify-center">
          <Link
            href="/"
            className="px-5 py-2.5 bg-[#093725] text-amber-300 font-bold text-xs rounded-xl hover:bg-[#062519] transition shadow-xs"
          >
            Back to Home
          </Link>
          <Link
            href="/products"
            className="px-5 py-2.5 bg-stone-100 text-stone-800 font-semibold text-xs rounded-xl hover:bg-stone-200 transition"
          >
            Explore Snacks
          </Link>
        </div>
      </div>

      <p className="text-xs text-stone-400 mt-8">
        OnFresh Foods · Vandiperiyar, Idukki District, Kerala
      </p>
    </div>
  );
}


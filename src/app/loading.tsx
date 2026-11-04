import React from 'react';

export default function Loading() {
  return (
    <div className="min-h-[50vh] flex flex-col items-center justify-center p-8">
      <div className="relative w-12 h-12 mb-3">
        <div className="absolute inset-0 rounded-full border-4 border-emerald-200 animate-ping opacity-30"></div>
        <div className="w-12 h-12 rounded-full border-4 border-[#093725] border-t-amber-400 animate-spin"></div>
      </div>
      <p className="text-xs font-semibold text-stone-500 uppercase tracking-wider">
        Loading OnFresh...
      </p>
    </div>
  );
}


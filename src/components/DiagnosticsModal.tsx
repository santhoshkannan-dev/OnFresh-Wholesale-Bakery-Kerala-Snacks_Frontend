'use client';

import HealthStatusCard from '@/components/HealthStatusCard';

interface DiagnosticsModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function DiagnosticsModal({ isOpen, onClose }: DiagnosticsModalProps) {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs transition-opacity animate-fade-in">
      <div className="relative w-full max-w-3xl bg-white rounded-3xl shadow-2xl overflow-hidden border border-emerald-900/40">
        <div className="bg-[#093725] px-6 py-4 flex items-center justify-between text-white">
          <div className="flex items-center gap-2">
            <span className="w-2.5 h-2.5 rounded-full bg-emerald-400 animate-pulse" />
            <h3 className="text-sm font-bold uppercase tracking-wider text-amber-300">
              System Architecture & Health Diagnostics
            </h3>
          </div>
          <button
            onClick={onClose}
            className="text-emerald-200 hover:text-white p-1 rounded-lg text-lg font-bold"
            aria-label="Close modal"
          >
            ✕
          </button>
        </div>

        <div className="p-6 bg-stone-50 max-h-[80vh] overflow-y-auto">
          <HealthStatusCard />
        </div>

        <div className="bg-stone-100 px-6 py-3 border-t border-stone-200 flex items-center justify-between text-xs text-stone-500">
          <span>Django REST Framework + PostgreSQL + Next.js</span>
          <button
            onClick={onClose}
            className="px-4 py-1.5 rounded-lg bg-[#093725] text-white font-semibold text-xs hover:bg-[#0d4a32] transition"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
}

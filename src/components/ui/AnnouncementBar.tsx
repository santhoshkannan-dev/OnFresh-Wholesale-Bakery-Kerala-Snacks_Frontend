'use client';

import { useState } from 'react';
import Link from 'next/link';
import { Sparkles, Truck, Building2, X } from 'lucide-react';

export default function AnnouncementBar() {
  const [visible, setVisible] = useState(true);

  if (!visible) return null;

  return (
    <div className="relative bg-[#281411] text-[#FFF9F1] text-xs py-2 px-4 border-b border-[#351C18]/60 overflow-hidden z-50">
      <div className="max-w-7xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-2">
        {/* Left Notice: Retail Free Shipping */}
        <div className="flex items-center gap-2">
          <span className="flex items-center gap-1.5 px-2 py-0.5 rounded-full bg-[#FFD83D] text-[#281411] font-bold text-[10px] tracking-wide uppercase">
            <Sparkles className="w-3 h-3 text-[#F47735]" />
            Free Shipping
          </span>
          <span className="font-medium text-[#FFF9F1]/90 text-[11px] sm:text-xs">
            Free delivery across Kerala on retail orders above ₹500!
          </span>
        </div>

        {/* Center/Right: Wholesale & Factory Badge */}
        <div className="flex items-center gap-4 text-[11px] sm:text-xs text-[#E8DCCF]">
          <div className="hidden md:flex items-center gap-1.5">
            <Building2 className="w-3.5 h-3.5 text-[#FFD83D]" />
            <span>Wholesale Supply for Supermarkets & Bakeries</span>
          </div>

          <Link
            href="/wholesale"
            className="inline-flex items-center gap-1 font-bold text-[#FFD83D] hover:text-[#FFF9F1] underline underline-offset-2 transition-colors"
          >
            Apply for Business Account &rarr;
          </Link>

          <button
            onClick={() => setVisible(false)}
            aria-label="Dismiss announcement"
            className="text-[#E8DCCF]/60 hover:text-[#FFF9F1] transition-colors p-0.5 ml-1"
          >
            <X className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>
    </div>
  );
}


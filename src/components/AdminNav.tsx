'use client';

import React from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';

export default function AdminNav() {
  const pathname = usePathname();

  const links = [
    { href: '/admin/dashboard', label: '📊 Dashboard' },
    { href: '/admin/orders', label: '📦 Orders' },
    { href: '/admin/invoices', label: '🧾 Invoices' },
    { href: '/admin/customers', label: '👥 Customers' },
    { href: '/admin/inventory', label: '📦 Stock' },
    { href: '/admin/inventory/stock-in', label: '📥 Stock In' },
    { href: '/admin/inventory/movements', label: '📝 Movements' },
    { href: '/admin/production', label: '🏭 Production' },
    { href: '/admin/production/batches', label: '🏷️ Batches' },
    { href: '/admin/inventory/expiry', label: '⏳ Expiry & FEFO' },
    { href: '/admin/reports', label: '📑 Reports' },
    { href: '/admin/staff', label: '🛡️ Staff' },
  ];

  return (
    <div className="bg-white rounded-2xl border border-stone-200 p-2 shadow-xs mb-8 flex flex-wrap items-center justify-between gap-2">
      <div className="flex flex-wrap items-center gap-1.5">
        {links.map((link) => {
          const isActive = pathname === link.href;
          return (
            <Link
              key={link.href}
              href={link.href}
              className={`px-3.5 py-1.5 rounded-xl text-xs font-bold transition ${
                isActive
                  ? 'bg-[#093725] text-amber-300 shadow-xs'
                  : 'text-stone-600 hover:text-stone-900 hover:bg-stone-100'
              }`}
            >
              {link.label}
            </Link>
          );
        })}
      </div>

      <div className="text-[11px] text-stone-400 font-semibold px-3 py-1 bg-stone-50 rounded-lg">
        Facility: Vandiperiyar Kitchen & Warehouse
      </div>
    </div>
  );
}


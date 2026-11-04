'use client';

import React, { useState, useEffect, useCallback } from 'react';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import AdminNav from '@/components/AdminNav';
import { useAuth } from '@/context/AuthContext';
import { apiGetStockMovements } from '@/lib/api';
import { StockMovement } from '@/types/api';

export default function StockMovementsPage() {
  const { user, loading: authLoading } = useAuth();
  const [movements, setMovements] = useState<StockMovement[]>([]);
  const [loading, setLoading] = useState(true);
  const [typeFilter, setTypeFilter] = useState<string>('all');
  const [referenceQuery, setReferenceQuery] = useState<string>('');

  const loadMovements = useCallback(() => {
    setLoading(true);
    apiGetStockMovements({
      movement_type: typeFilter === 'all' ? undefined : typeFilter,
      reference: referenceQuery.trim() || undefined,
    }).then((res) => {
      if (res.data) setMovements(res.data);
      setLoading(false);
    });
  }, [typeFilter, referenceQuery]);

  useEffect(() => {
    if (user?.is_staff) {
      loadMovements();
    }
  }, [user, loadMovements]);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    loadMovements();
  };

  const getMovementBadge = (type: string) => {
    switch (type) {
      case 'production_in':
        return 'bg-emerald-100 text-emerald-800 border-emerald-300';
      case 'purchase_in':
        return 'bg-teal-100 text-teal-800 border-teal-300';
      case 'order_reservation':
        return 'bg-amber-100 text-amber-800 border-amber-300';
      case 'reservation_release':
        return 'bg-blue-100 text-blue-800 border-blue-300';
      case 'order_dispatch':
        return 'bg-purple-100 text-purple-800 border-purple-300';
      case 'damage':
        return 'bg-red-100 text-red-800 border-red-300';
      case 'expiry':
        return 'bg-red-200 text-red-900 border-red-400';
      case 'adjustment':
        return 'bg-stone-200 text-stone-800 border-stone-300';
      default:
        return 'bg-stone-100 text-stone-700 border-stone-300';
    }
  };

  if (!authLoading && !user?.is_staff) {
    return (
      <div className="min-h-screen bg-[#fbf8f1] flex flex-col justify-between text-[#1c2621]">
        <Navbar />
        <main className="flex-1 py-20 max-w-md mx-auto px-4 text-center">
          <div className="bg-white rounded-3xl border border-stone-200 p-8 shadow-xs">
            <span className="text-4xl block mb-2">🔒</span>
            <h1 className="text-xl font-bold text-stone-900">Staff Authorization Required</h1>
          </div>
        </main>
        <Footer />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#fbf8f1] flex flex-col justify-between text-[#1c2621]">
      <Navbar />

      <main className="flex-1 py-10 sm:py-14 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 w-full">
        <div className="mb-6">
          <div className="flex items-center gap-2 text-xs font-semibold uppercase tracking-wider text-amber-700">
            <span>Audit Ledger</span>
            <span>•</span>
            <span>Immutable Inventory History</span>
          </div>
          <h1 className="text-3xl font-black text-[#093725] tracking-tight mt-1">
            Stock Movements & Audit Trail
          </h1>
          <p className="text-sm text-stone-600 mt-1">
            Trace every incoming production batch, order reservation, order dispatch, and warehouse reconciliation.
          </p>
        </div>

        <AdminNav />

        <div className="bg-white rounded-3xl border border-stone-200/80 p-6 shadow-xs">
          {/* Controls */}
          <div className="flex flex-col sm:flex-row items-center justify-between gap-4 mb-6">
            <div className="flex flex-wrap items-center gap-1.5">
              {[
                { id: 'all', label: 'All Transactions' },
                { id: 'production_in', label: 'Production In' },
                { id: 'order_reservation', label: 'Order Reservations' },
                { id: 'reservation_release', label: 'Reservation Releases' },
                { id: 'order_dispatch', label: 'Dispatches' },
                { id: 'damage', label: 'Damages / Expiry' },
                { id: 'adjustment', label: 'Adjustments' },
              ].map((tab) => (
                <button
                  key={tab.id}
                  onClick={() => setTypeFilter(tab.id)}
                  className={`px-3 py-1.5 rounded-full text-xs font-bold transition cursor-pointer ${
                    typeFilter === tab.id
                      ? 'bg-[#093725] text-white shadow-xs'
                      : 'bg-stone-100 text-stone-600 hover:bg-stone-200'
                  }`}
                >
                  {tab.label}
                </button>
              ))}
            </div>

            <form onSubmit={handleSearch} className="flex items-center gap-2 w-full sm:w-auto">
              <input
                type="text"
                placeholder="Search Reference #..."
                value={referenceQuery}
                onChange={(e) => setReferenceQuery(e.target.value)}
                className="px-3.5 py-1.5 text-xs border border-stone-300 rounded-xl focus:ring-2 focus:ring-[#093725] focus:outline-none w-full sm:w-56"
              />
              <button
                type="submit"
                className="px-3.5 py-1.5 bg-[#093725] text-white text-xs font-bold rounded-xl hover:bg-[#062619] transition cursor-pointer"
              >
                Search
              </button>
            </form>
          </div>

          {/* Table */}
          {loading ? (
            <div className="py-16 text-center text-xs text-stone-400">Loading audit movements...</div>
          ) : movements.length === 0 ? (
            <div className="py-12 text-center text-xs text-stone-500">No stock movements found.</div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs">
                <thead>
                  <tr className="border-b border-stone-200 text-stone-400 font-bold uppercase tracking-wider">
                    <th className="pb-3">Timestamp</th>
                    <th className="pb-3">Type</th>
                    <th className="pb-3">Product Variant</th>
                    <th className="pb-3 text-right">Units</th>
                    <th className="pb-3 text-right">Balance After</th>
                    <th className="pb-3">Reference #</th>
                    <th className="pb-3">Notes / Reason</th>
                    <th className="pb-3 text-right">Operator</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-stone-100">
                  {movements.map((m) => (
                    <tr key={m.id} className="hover:bg-stone-50/60 transition">
                      <td className="py-3 font-mono text-stone-500 text-[11px] whitespace-nowrap">
                        {new Date(m.created_at).toLocaleString('en-IN', {
                          dateStyle: 'short',
                          timeStyle: 'short',
                        })}
                      </td>
                      <td className="py-3">
                        <span
                          className={`px-2 py-0.5 rounded text-[10px] font-bold uppercase border ${getMovementBadge(
                            m.movement_type
                          )}`}
                        >
                          {m.movement_type_display}
                        </span>
                      </td>
                      <td className="py-3">
                        <span className="font-bold text-stone-900 block">{m.product_name}</span>
                        <span className="text-[10px] text-stone-500 font-mono">
                          {m.sku} ({m.display_weight})
                        </span>
                      </td>
                      <td className="py-3 text-right font-black text-sm">
                        {m.movement_type.includes('in') || m.movement_type.includes('return')
                          ? `+${m.quantity}`
                          : `-${m.quantity}`}
                      </td>
                      <td className="py-3 text-right font-black text-stone-900 text-sm">
                        {m.balance_after}
                      </td>
                      <td className="py-3 font-mono text-[11px] text-[#093725] font-bold">
                        {m.reference_number || '—'}
                      </td>
                      <td className="py-3 text-stone-600 max-w-xs truncate" title={m.reason}>
                        {m.reason || '—'}
                      </td>
                      <td className="py-3 text-right text-stone-500 text-[11px]">
                        {m.user_email || 'System'}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </main>

      <Footer />
    </div>
  );
}


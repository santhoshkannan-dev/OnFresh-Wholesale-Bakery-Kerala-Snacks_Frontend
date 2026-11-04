'use client';

import React, { useState, useEffect } from 'react';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import AdminNav from '@/components/AdminNav';
import { useAuth } from '@/context/AuthContext';
import { apiGetExpiryReport } from '@/lib/api';
import { ExpiryReport } from '@/types/api';

export default function ExpiryManagementPage() {
  const { user, loading: authLoading } = useAuth();
  const [report, setReport] = useState<ExpiryReport | null>(null);
  const [warningDays, setWarningDays] = useState<number>(30);
  const [loading, setLoading] = useState(true);

  const loadReport = (days: number) => {
    setLoading(true);
    apiGetExpiryReport(days).then((res) => {
      if (res.data) setReport(res.data);
      setLoading(false);
    });
  };

  useEffect(() => {
    if (user?.is_staff) {
      loadReport(warningDays);
    }
  }, [user, warningDays]);

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
            <span>Quality Control</span>
            <span>•</span>
            <span>FEFO Order Allocation & Shelf Life</span>
          </div>
          <h1 className="text-3xl font-black text-[#093725] tracking-tight mt-1">
            Batch Expiry & Shelf Life Monitoring
          </h1>
          <p className="text-sm text-stone-600 mt-1">
            Monitor batch expiration timelines, prevent dispatch of expired products, and audit First-Expired-First-Out fulfillment.
          </p>
        </div>

        <AdminNav />

        {/* Warning Threshold Selector */}
        <div className="bg-white rounded-3xl border border-stone-200/80 p-6 shadow-xs mb-8 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <span className="text-xs font-bold uppercase tracking-wider text-stone-400 block">
              Configurable Expiry Warning Horizon
            </span>
            <span className="text-sm text-stone-700">
              Highlight batches approaching expiration within:
            </span>
          </div>

          <div className="flex items-center gap-2">
            {[15, 30, 45, 60].map((days) => (
              <button
                key={days}
                onClick={() => setWarningDays(days)}
                className={`px-4 py-2 rounded-xl text-xs font-bold transition cursor-pointer ${
                  warningDays === days
                    ? 'bg-[#093725] text-amber-300 shadow-xs'
                    : 'bg-stone-100 text-stone-700 hover:bg-stone-200'
                }`}
              >
                {days} Days
              </button>
            ))}
          </div>
        </div>

        {/* Expiry Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-8">
          <div className="bg-amber-50 rounded-3xl border border-amber-300 p-6 shadow-xs flex items-center justify-between">
            <div>
              <span className="text-xs uppercase font-bold text-amber-800 tracking-wider block">
                Expiring Soon (Within {warningDays} Days)
              </span>
              <span className="text-3xl font-black text-amber-950 mt-1 block">
                {report?.expiring_soon_count ?? 0} batch(es)
              </span>
              <p className="text-xs text-amber-700 mt-1">Prioritized for immediate order fulfillment via FEFO.</p>
            </div>
            <span className="text-4xl">⏳</span>
          </div>

          <div className="bg-red-50 rounded-3xl border border-red-300 p-6 shadow-xs flex items-center justify-between">
            <div>
              <span className="text-xs uppercase font-bold text-red-800 tracking-wider block">
                Expired Batches
              </span>
              <span className="text-3xl font-black text-red-950 mt-1 block">
                {report?.expired_count ?? 0} batch(es)
              </span>
              <p className="text-xs text-red-700 mt-1">Automatically quarantined from customer order allocation.</p>
            </div>
            <span className="text-4xl">🚫</span>
          </div>
        </div>

        {/* Expiring Soon Table */}
        <div className="bg-white rounded-3xl border border-stone-200/80 p-6 sm:p-8 shadow-xs mb-8">
          <h2 className="text-base font-black text-stone-900 border-b border-stone-100 pb-3 mb-4 flex items-center justify-between">
            <span>Batches Approaching Expiry ({report?.expiring_soon_count ?? 0})</span>
            <span className="text-xs font-bold text-amber-800 bg-amber-100 px-3 py-1 rounded-full">
              FEFO Priority Dispatch
            </span>
          </h2>

          {loading ? (
            <div className="py-12 text-center text-xs text-stone-400">Loading expiry data...</div>
          ) : (report?.expiring_soon_batches.length ?? 0) === 0 ? (
            <div className="py-8 text-center text-xs text-stone-500">
              No batches expiring within the next {warningDays} days. All active stock is fresh.
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs">
                <thead>
                  <tr className="border-b border-stone-200 text-stone-400 font-bold uppercase tracking-wider">
                    <th className="pb-3">Batch #</th>
                    <th className="pb-3">Product Name</th>
                    <th className="pb-3 text-right">Remaining Units</th>
                    <th className="pb-3">Expiry Date</th>
                    <th className="pb-3 text-right">Countdown</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-stone-100">
                  {report?.expiring_soon_batches.map((b) => (
                    <tr key={b.id} className="hover:bg-amber-50/40 transition">
                      <td className="py-3 font-mono font-bold text-stone-900">{b.batch_number}</td>
                      <td className="py-3">
                        <span className="font-bold text-stone-900 block">{b.product_name}</span>
                        <span className="text-[10px] text-stone-500 font-mono">
                          {b.variant_sku} ({b.display_weight})
                        </span>
                      </td>
                      <td className="py-3 text-right font-black text-amber-900 text-sm">
                        {b.remaining_quantity} pkts
                      </td>
                      <td className="py-3 font-semibold text-stone-800">{b.expiry_date}</td>
                      <td className="py-3 text-right">
                        <span className="px-2.5 py-1 rounded-full text-xs font-black bg-amber-100 text-amber-900 border border-amber-300">
                          {b.days_until_expiry} days left
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>

        {/* Expired Batches Table */}
        <div className="bg-white rounded-3xl border border-stone-200/80 p-6 sm:p-8 shadow-xs mb-8">
          <h2 className="text-base font-black text-stone-900 border-b border-stone-100 pb-3 mb-4">
            Expired Batches Quarantined ({report?.expired_count ?? 0})
          </h2>

          {(report?.expired_batches.length ?? 0) === 0 ? (
            <div className="py-8 text-center text-xs text-stone-500">
              Zero expired batches in facility. Excellent kitchen turnaround!
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs">
                <thead>
                  <tr className="border-b border-stone-200 text-stone-400 font-bold uppercase tracking-wider">
                    <th className="pb-3">Batch #</th>
                    <th className="pb-3">Product Name</th>
                    <th className="pb-3 text-right">Units Quarantined</th>
                    <th className="pb-3">Expired On</th>
                    <th className="pb-3 text-right">Status</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-stone-100">
                  {report?.expired_batches.map((b) => (
                    <tr key={b.id} className="bg-red-50/30">
                      <td className="py-3 font-mono font-bold text-red-900">{b.batch_number}</td>
                      <td className="py-3">
                        <span className="font-bold text-stone-900 block">{b.product_name}</span>
                        <span className="text-[10px] text-stone-500 font-mono">
                          {b.variant_sku} ({b.display_weight})
                        </span>
                      </td>
                      <td className="py-3 text-right font-black text-red-700 text-sm">
                        {b.remaining_quantity} pkts
                      </td>
                      <td className="py-3 font-bold text-red-700">{b.expiry_date}</td>
                      <td className="py-3 text-right">
                        <span className="px-2.5 py-1 rounded-full text-xs font-black bg-red-100 text-red-800 border border-red-300">
                          EXCLUDED FROM SALES
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>

        {/* FEFO Technical Explanation Note */}
        <div className="p-5 rounded-3xl bg-[#093725] text-white flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 text-xs">
          <div>
            <span className="font-bold text-amber-300 block mb-1">
              How OnFresh FEFO Algorithm Works:
            </span>
            <p className="text-emerald-100 leading-relaxed max-w-2xl">
              During customer order dispatch, our backend automatically queries all non-expired batches for each variant in ascending order of expiry date (<code className="bg-emerald-950 px-1 py-0.5 rounded text-amber-300 font-mono">order_by(&apos;expiry_date&apos;)</code>). Units are deducted from the earliest expiring batch first. Batches where <code className="bg-emerald-950 px-1 py-0.5 rounded text-amber-300 font-mono">expiry_date &lt; today</code> are strictly excluded from dispatch.
            </p>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}


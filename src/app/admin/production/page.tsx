'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import AdminNav from '@/components/AdminNav';
import { useAuth } from '@/context/AuthContext';
import { apiGetProductionBatches, apiCompleteProductionBatch } from '@/lib/api';
import { ProductionBatch } from '@/types/api';

export default function ProductionOverviewPage() {
  const { user, loading: authLoading } = useAuth();
  const [batches, setBatches] = useState<ProductionBatch[]>([]);
  const [loading, setLoading] = useState(true);
  const [actionMessage, setActionMessage] = useState<string | null>(null);

  const loadBatches = () => {
    setLoading(true);
    apiGetProductionBatches().then((res) => {
      if (res.data) setBatches(res.data);
      setLoading(false);
    });
  };

  useEffect(() => {
    if (user?.is_staff) {
      loadBatches();
    }
  }, [user]);

  const handleComplete = async (batchNumber: string) => {
    setActionMessage(null);
    const res = await apiCompleteProductionBatch(batchNumber);
    if (res.success) {
      setActionMessage(res.message);
      loadBatches();
    } else {
      alert(res.message);
    }
  };

  const inProductionCount = batches.filter((b) => b.status === 'in_production').length;
  const completedCount = batches.filter((b) => b.status === 'completed').length;
  const totalManufactured = batches.reduce((acc, b) => acc + b.manufactured_quantity, 0);
  const totalRemaining = batches.reduce((acc, b) => acc + b.remaining_quantity, 0);

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
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
          <div>
            <div className="flex items-center gap-2 text-xs font-semibold uppercase tracking-wider text-amber-700">
              <span>Kitchen Facility</span>
              <span>•</span>
              <span>Vandiperiyar, Idukki</span>
            </div>
            <h1 className="text-3xl font-black text-[#093725] tracking-tight mt-1">
              Snack Production & Kitchen Batches
            </h1>
            <p className="text-sm text-stone-600 mt-1">
              Schedule, track, and complete bakery cooking, frying shifts, and packaging batches.
            </p>
          </div>

          <Link
            href="/admin/production/batches"
            className="px-5 py-2.5 rounded-full text-xs font-bold uppercase tracking-wider text-emerald-950 bg-gradient-to-r from-amber-400 to-amber-500 hover:from-amber-300 hover:to-amber-400 shadow-md shadow-amber-500/20 transition self-start sm:self-auto"
          >
            + Create New Batch →
          </Link>
        </div>

        <AdminNav />

        {actionMessage && (
          <div className="mb-6 p-4 rounded-2xl bg-emerald-50 border border-emerald-300 text-emerald-900 text-xs">
            ✅ {actionMessage}
          </div>
        )}

        {/* Metrics */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mb-8">
          <div className="bg-white p-5 rounded-3xl border border-stone-200 shadow-xs">
            <span className="text-xs uppercase font-bold text-stone-400 block">Total Batches</span>
            <span className="text-3xl font-black text-stone-900 mt-1 block">{batches.length}</span>
          </div>
          <div className="bg-white p-5 rounded-3xl border border-stone-200 shadow-xs">
            <span className="text-xs uppercase font-bold text-stone-400 block">In Production</span>
            <span className="text-3xl font-black text-blue-600 mt-1 block">{inProductionCount}</span>
          </div>
          <div className="bg-white p-5 rounded-3xl border border-stone-200 shadow-xs">
            <span className="text-xs uppercase font-bold text-stone-400 block">Completed Batches</span>
            <span className="text-3xl font-black text-[#093725] mt-1 block">{completedCount}</span>
          </div>
          <div className="bg-white p-5 rounded-3xl border border-stone-200 shadow-xs">
            <span className="text-xs uppercase font-bold text-stone-400 block">Remaining Stock Units</span>
            <span className="text-3xl font-black text-amber-600 mt-1 block">{totalRemaining} / {totalManufactured}</span>
          </div>
        </div>

        {/* Batch Cards */}
        <div className="bg-white rounded-3xl border border-stone-200/80 p-6 sm:p-8 shadow-xs">
          <h2 className="text-base font-black text-stone-900 border-b border-stone-100 pb-3 mb-6">
            Active Production Shifts & Batches
          </h2>

          {loading ? (
            <div className="py-16 text-center text-xs text-stone-400">Loading batches...</div>
          ) : batches.length === 0 ? (
            <div className="py-12 text-center text-xs text-stone-500">No production batches scheduled yet.</div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {batches.map((batch) => (
                <div
                  key={batch.id}
                  className="p-5 rounded-2xl border border-stone-200/80 hover:border-emerald-300 transition flex flex-col justify-between space-y-4"
                >
                  <div>
                    <div className="flex items-center justify-between mb-2">
                      <span className="font-mono text-xs font-bold text-[#093725]">
                        {batch.batch_number}
                      </span>
                      <span
                        className={`px-2 py-0.5 rounded text-[10px] font-bold uppercase ${
                          batch.status === 'completed'
                            ? 'bg-emerald-100 text-emerald-800'
                            : batch.status === 'in_production'
                            ? 'bg-blue-100 text-blue-800'
                            : 'bg-stone-100 text-stone-700'
                        }`}
                      >
                        {batch.status_display}
                      </span>
                    </div>

                    <h3 className="font-bold text-stone-900 text-sm">{batch.product_name}</h3>
                    <p className="text-xs text-stone-500 font-mono mt-0.5">
                      {batch.variant_sku} ({batch.display_weight})
                    </p>

                    <div className="mt-3 pt-3 border-t border-stone-100 grid grid-cols-2 gap-2 text-xs">
                      <div>
                        <span className="text-stone-400 block text-[10px]">Produced On</span>
                        <span className="font-semibold text-stone-800">{batch.production_date}</span>
                      </div>
                      <div>
                        <span className="text-stone-400 block text-[10px]">Best Before / Expiry</span>
                        <span
                          className={`font-semibold ${
                            batch.is_expired
                              ? 'text-red-600'
                              : batch.is_expiring_soon
                              ? 'text-amber-600'
                              : 'text-stone-800'
                          }`}
                        >
                          {batch.expiry_date}
                        </span>
                      </div>
                    </div>

                    <div className="mt-2 text-xs flex justify-between items-center text-stone-600">
                      <span>Remaining / Total:</span>
                      <span className="font-black text-sm text-[#093725]">
                        {batch.remaining_quantity} / {batch.manufactured_quantity} pkts
                      </span>
                    </div>

                    {batch.manufacturing_notes && (
                      <p className="mt-2 text-[11px] text-stone-500 italic bg-stone-50 p-2 rounded-lg">
                        &ldquo;{batch.manufacturing_notes}&rdquo;
                      </p>
                    )}
                  </div>

                  <div>
                    {batch.status === 'in_production' ? (
                      <button
                        onClick={() => handleComplete(batch.batch_number)}
                        className="w-full py-2.5 rounded-xl bg-[#093725] text-amber-300 hover:bg-[#062619] font-bold text-xs shadow-xs transition cursor-pointer"
                      >
                        ✓ Complete Shift & Add to Stock
                      </button>
                    ) : (
                      <div className="text-[11px] text-center font-bold text-emerald-800 bg-emerald-50 py-2 rounded-xl border border-emerald-200">
                        ✓ Quality Passed • Stock Credited
                      </div>
                    )}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </main>

      <Footer />
    </div>
  );
}


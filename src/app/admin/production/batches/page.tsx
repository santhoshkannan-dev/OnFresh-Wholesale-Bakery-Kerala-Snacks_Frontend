'use client';

import React, { useState, useEffect, useCallback } from 'react';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import AdminNav from '@/components/AdminNav';
import { useAuth } from '@/context/AuthContext';
import { apiGetInventory, apiGetProductionBatches, apiCreateProductionBatch } from '@/lib/api';
import { StockItem, ProductionBatch } from '@/types/api';

export default function ProductionBatchesPage() {
  const { user, loading: authLoading } = useAuth();
  const [stockItems, setStockItems] = useState<StockItem[]>([]);
  const [batches, setBatches] = useState<ProductionBatch[]>([]);
  const [loading, setLoading] = useState(true);

  // Form state
  const [selectedVariantId, setSelectedVariantId] = useState<number | ''>('');
  const [manufacturedQty, setManufacturedQty] = useState<number>(200);
  const [prodDate, setProdDate] = useState<string>('');
  const [expDate, setExpDate] = useState<string>('');
  const [notes, setNotes] = useState<string>('Pure coconut oil batch, 100% Nendran bananas.');
  const [autoComplete, setAutoComplete] = useState<boolean>(true);
  const [submitting, setSubmitting] = useState(false);
  const [successMsg, setSuccessMsg] = useState<string | null>(null);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  useEffect(() => {
    const today = new Date();
    setProdDate(today.toISOString().split('T')[0]);
    const future = new Date();
    future.setDate(future.getDate() + 90);
    setExpDate(future.toISOString().split('T')[0]);
  }, []);

  const loadData = useCallback(() => {
    setLoading(true);
    Promise.all([apiGetInventory(), apiGetProductionBatches()]).then(([invRes, batRes]) => {
      if (invRes.data) {
        setStockItems(invRes.data);
        if (invRes.data.length > 0 && selectedVariantId === '') {
          setSelectedVariantId(invRes.data[0].variant_id);
        }
      }
      if (batRes.data) setBatches(batRes.data);
      setLoading(false);
    });
  }, [selectedVariantId]);

  useEffect(() => {
    if (user?.is_staff) {
      loadData();
    }
  }, [user, loadData]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedVariantId) return;
    setSubmitting(true);
    setErrorMsg(null);
    setSuccessMsg(null);

    const res = await apiCreateProductionBatch({
      variant_id: Number(selectedVariantId),
      manufactured_quantity: Number(manufacturedQty),
      production_date: prodDate,
      expiry_date: expDate,
      manufacturing_notes: notes.trim(),
      auto_complete: autoComplete,
    });

    setSubmitting(false);
    if (res.success && res.batch) {
      setSuccessMsg(`Created production batch ${res.batch.batch_number} successfully.`);
      loadData();
    } else {
      setErrorMsg(res.message);
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
            <span>Batch Registry</span>
            <span>•</span>
            <span>Traceability & Quality Standards</span>
          </div>
          <h1 className="text-3xl font-black text-[#093725] tracking-tight mt-1">
            Production Batch Management
          </h1>
          <p className="text-sm text-stone-600 mt-1">
            Assign unique batch numbers, record frying shift parameters, and configure FEFO expiry dates.
          </p>
        </div>

        <AdminNav />

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          {/* Creation Form */}
          <div className="lg:col-span-5 bg-white rounded-3xl border border-stone-200/80 p-6 sm:p-8 shadow-xs">
            <h2 className="text-base font-black text-stone-900 border-b border-stone-100 pb-3 mb-6">
              Create New Production Batch
            </h2>

            {successMsg && (
              <div className="mb-4 p-3.5 rounded-xl bg-emerald-50 border border-emerald-300 text-emerald-900 text-xs">
                ✅ {successMsg}
              </div>
            )}

            {errorMsg && (
              <div className="mb-4 p-3.5 rounded-xl bg-red-50 border border-red-300 text-red-900 text-xs">
                ⚠️ {errorMsg}
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-4 text-xs">
              <div>
                <label className="font-bold text-stone-700 block mb-1">
                  Product Variant & Package *
                </label>
                <select
                  required
                  value={selectedVariantId}
                  onChange={(e) => setSelectedVariantId(Number(e.target.value))}
                  className="w-full px-3.5 py-2.5 border border-stone-300 rounded-xl bg-white font-semibold focus:ring-2 focus:ring-[#093725] focus:outline-none"
                >
                  {stockItems.map((item) => (
                    <option key={item.variant_id} value={item.variant_id}>
                      {item.product_name} — {item.display_weight} ({item.sku})
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="font-bold text-stone-700 block mb-1">
                  Manufactured Packets Quantity *
                </label>
                <input
                  type="number"
                  min={1}
                  required
                  value={manufacturedQty}
                  onChange={(e) => setManufacturedQty(Math.max(1, parseInt(e.target.value) || 1))}
                  className="w-full px-3.5 py-2.5 border border-stone-300 rounded-xl font-black text-base text-[#093725] focus:ring-2 focus:ring-[#093725] focus:outline-none"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="font-bold text-stone-700 block mb-1">
                    Production Date *
                  </label>
                  <input
                    type="date"
                    required
                    value={prodDate}
                    onChange={(e) => setProdDate(e.target.value)}
                    className="w-full px-3 py-2 border border-stone-300 rounded-xl focus:ring-2 focus:ring-[#093725] focus:outline-none"
                  />
                </div>

                <div>
                  <label className="font-bold text-stone-700 block mb-1">
                    Expiry / Best Before *
                  </label>
                  <input
                    type="date"
                    required
                    value={expDate}
                    onChange={(e) => setExpDate(e.target.value)}
                    className="w-full px-3 py-2 border border-stone-300 rounded-xl focus:ring-2 focus:ring-[#093725] focus:outline-none"
                  />
                </div>
              </div>

              <div>
                <label className="font-bold text-stone-700 block mb-1">
                  Manufacturing Notes / Raw Lot
                </label>
                <textarea
                  rows={3}
                  value={notes}
                  onChange={(e) => setNotes(e.target.value)}
                  className="w-full p-2.5 border border-stone-300 rounded-xl focus:ring-2 focus:ring-[#093725] focus:outline-none"
                />
              </div>

              <div className="p-3 rounded-xl bg-amber-50/70 border border-amber-200 flex items-center gap-2">
                <input
                  type="checkbox"
                  id="autoComplete"
                  checked={autoComplete}
                  onChange={(e) => setAutoComplete(e.target.checked)}
                  className="rounded text-[#093725] focus:ring-[#093725] cursor-pointer"
                />
                <label htmlFor="autoComplete" className="text-stone-800 font-semibold cursor-pointer">
                  Immediately complete and add to available stock
                </label>
              </div>

              <button
                type="submit"
                disabled={submitting}
                className="w-full py-3.5 px-6 rounded-2xl text-xs font-bold uppercase tracking-wider text-emerald-950 bg-gradient-to-r from-amber-400 to-amber-500 hover:from-amber-300 hover:to-amber-400 shadow-md shadow-amber-500/20 transition cursor-pointer disabled:opacity-50"
              >
                {submitting ? 'Registering Batch...' : 'Register Batch in System →'}
              </button>
            </form>
          </div>

          {/* Batches Table */}
          <div className="lg:col-span-7 bg-white rounded-3xl border border-stone-200/80 p-6 sm:p-8 shadow-xs">
            <h2 className="text-base font-black text-stone-900 border-b border-stone-100 pb-3 mb-4">
              Registered Batches ({batches.length})
            </h2>

            {loading ? (
              <div className="py-12 text-center text-xs text-stone-400">Loading batches...</div>
            ) : batches.length === 0 ? (
              <div className="py-8 text-center text-xs text-stone-500">No batches recorded yet.</div>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full text-left text-xs">
                  <thead>
                    <tr className="border-b border-stone-200 text-stone-400 font-bold uppercase tracking-wider">
                      <th className="pb-3">Batch #</th>
                      <th className="pb-3">Snack SKU</th>
                      <th className="pb-3 text-right">Units</th>
                      <th className="pb-3">Dates</th>
                      <th className="pb-3 text-center">Status</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-stone-100">
                    {batches.map((b) => (
                      <tr key={b.id} className="hover:bg-stone-50/60 transition">
                        <td className="py-3 font-mono font-bold text-[#093725]">
                          {b.batch_number}
                        </td>
                        <td className="py-3">
                          <span className="font-bold text-stone-900 block">{b.product_name}</span>
                          <span className="text-[10px] text-stone-500 font-mono">
                            {b.variant_sku} ({b.display_weight})
                          </span>
                        </td>
                        <td className="py-3 text-right font-black text-stone-900">
                          {b.remaining_quantity} / {b.manufactured_quantity}
                        </td>
                        <td className="py-3 text-[11px] text-stone-600">
                          <div>Prod: {b.production_date}</div>
                          <div className={b.is_expired ? 'text-red-600 font-bold' : ''}>
                            Exp: {b.expiry_date}
                          </div>
                        </td>
                        <td className="py-3 text-center">
                          <span
                            className={`px-2 py-0.5 rounded text-[10px] font-bold uppercase ${
                              b.status === 'completed'
                                ? 'bg-emerald-100 text-emerald-800'
                                : b.status === 'in_production'
                                ? 'bg-blue-100 text-blue-800'
                                : 'bg-stone-100 text-stone-700'
                            }`}
                          >
                            {b.status_display}
                          </span>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}


'use client';

import React, { useState, useEffect, useCallback } from 'react';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import AdminNav from '@/components/AdminNav';
import { useAuth } from '@/context/AuthContext';
import { apiGetInventory, apiRecordStockIn, apiGetStockMovements } from '@/lib/api';
import { StockItem, StockMovement } from '@/types/api';

export default function StockInPage() {
  const { user, loading: authLoading } = useAuth();
  const [stockItems, setStockItems] = useState<StockItem[]>([]);
  const [recentMovements, setRecentMovements] = useState<StockMovement[]>([]);
  const [loading, setLoading] = useState(true);

  // Form state
  const [selectedVariantId, setSelectedVariantId] = useState<number | ''>('');
  const [quantity, setQuantity] = useState<number>(100);
  const [movementType, setMovementType] = useState<string>('production_in');
  const [referenceNumber, setReferenceNumber] = useState<string>('');
  const [reason, setReason] = useState<string>('Fresh kitchen batch completion');
  const [submitting, setSubmitting] = useState(false);
  const [successMsg, setSuccessMsg] = useState<string | null>(null);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  const loadData = useCallback(() => {
    setLoading(true);
    Promise.all([
      apiGetInventory(),
      apiGetStockMovements({ movement_type: 'production_in' }),
    ]).then(([invRes, movRes]) => {
      if (invRes.data) {
        setStockItems(invRes.data);
        if (invRes.data.length > 0 && selectedVariantId === '') {
          setSelectedVariantId(invRes.data[0].variant_id);
        }
      }
      if (movRes.data) setRecentMovements(movRes.data.slice(0, 8));
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

    const res = await apiRecordStockIn({
      variant_id: Number(selectedVariantId),
      quantity: Number(quantity),
      movement_type: movementType,
      reference_number: referenceNumber.trim() || undefined,
      reason: reason.trim() || undefined,
    });

    setSubmitting(false);
    if (res.success) {
      setSuccessMsg(res.message);
      loadData();
      setReferenceNumber('');
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
            <span>Inbound Logistics</span>
            <span>•</span>
            <span>Vandiperiyar Manufacturing</span>
          </div>
          <h1 className="text-3xl font-black text-[#093725] tracking-tight mt-1">
            Record Stock In
          </h1>
          <p className="text-sm text-stone-600 mt-1">
            Add manufactured packets from kitchen production batches or supplier deliveries into warehouse inventory.
          </p>
        </div>

        <AdminNav />

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          {/* Stock In Form */}
          <div className="lg:col-span-6 bg-white rounded-3xl border border-stone-200/80 p-6 sm:p-8 shadow-xs">
            <h2 className="text-base font-black text-stone-900 border-b border-stone-100 pb-3 mb-6">
              Receive New Stock
            </h2>

            {successMsg && (
              <div className="mb-4 p-3.5 rounded-xl bg-emerald-50 border border-emerald-300 text-emerald-900 text-xs flex items-center gap-2">
                <span>✅</span>
                <span>{successMsg}</span>
              </div>
            )}

            {errorMsg && (
              <div className="mb-4 p-3.5 rounded-xl bg-red-50 border border-red-300 text-red-900 text-xs flex items-center gap-2">
                <span>⚠️</span>
                <span>{errorMsg}</span>
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-4 text-xs">
              <div>
                <label className="font-bold text-stone-700 block mb-1">
                  Select Product Variant SKU *
                </label>
                <select
                  required
                  value={selectedVariantId}
                  onChange={(e) => setSelectedVariantId(Number(e.target.value))}
                  className="w-full px-3.5 py-2.5 border border-stone-300 rounded-xl bg-white text-stone-900 font-semibold focus:ring-2 focus:ring-[#093725] focus:outline-none"
                >
                  {stockItems.map((item) => (
                    <option key={item.variant_id} value={item.variant_id}>
                      {item.product_name} — {item.display_weight} (SKU: {item.sku}) [Current: {item.quantity_on_hand}]
                    </option>
                  ))}
                </select>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="font-bold text-stone-700 block mb-1">
                    Units Quantity to Add *
                  </label>
                  <input
                    type="number"
                    min={1}
                    required
                    value={quantity}
                    onChange={(e) => setQuantity(Math.max(1, parseInt(e.target.value) || 1))}
                    className="w-full px-3.5 py-2.5 border border-stone-300 rounded-xl font-black text-base text-[#093725] focus:ring-2 focus:ring-[#093725] focus:outline-none"
                  />
                </div>

                <div>
                  <label className="font-bold text-stone-700 block mb-1">
                    Movement Inflow Type *
                  </label>
                  <select
                    value={movementType}
                    onChange={(e) => setMovementType(e.target.value)}
                    className="w-full px-3.5 py-2.5 border border-stone-300 rounded-xl bg-white font-medium focus:ring-2 focus:ring-[#093725] focus:outline-none"
                  >
                    <option value="production_in">Kitchen Production In</option>
                    <option value="purchase_in">Purchase / Raw Supplier In</option>
                    <option value="customer_return">Customer Restock Return</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="font-bold text-stone-700 block mb-1">
                  Reference Identifier (Optional)
                </label>
                <input
                  type="text"
                  placeholder="e.g. BATCH-20261104-01 or PO-9842"
                  value={referenceNumber}
                  onChange={(e) => setReferenceNumber(e.target.value)}
                  className="w-full px-3.5 py-2.5 border border-stone-300 rounded-xl focus:ring-2 focus:ring-[#093725] focus:outline-none"
                />
              </div>

              <div>
                <label className="font-bold text-stone-700 block mb-1">
                  Reason / Production Notes (Optional)
                </label>
                <textarea
                  rows={2}
                  value={reason}
                  onChange={(e) => setReason(e.target.value)}
                  placeholder="Details regarding kitchen shift, frying batch, packaging lot..."
                  className="w-full p-2.5 border border-stone-300 rounded-xl focus:ring-2 focus:ring-[#093725] focus:outline-none"
                />
              </div>

              <button
                type="submit"
                disabled={submitting}
                className="w-full py-3.5 px-6 rounded-2xl text-xs font-bold uppercase tracking-wider text-emerald-950 bg-gradient-to-r from-amber-400 to-amber-500 hover:from-amber-300 hover:to-amber-400 shadow-md shadow-amber-500/20 transition cursor-pointer disabled:opacity-50"
              >
                {submitting ? 'Recording Inflow...' : 'Confirm Stock Addition →'}
              </button>
            </form>
          </div>

          {/* Recent Inbound Ledger */}
          <div className="lg:col-span-6 bg-white rounded-3xl border border-stone-200/80 p-6 sm:p-8 shadow-xs">
            <h2 className="text-base font-black text-stone-900 border-b border-stone-100 pb-3 mb-4">
              Recent Production Inflows
            </h2>

            {loading ? (
              <div className="py-12 text-center text-xs text-stone-400">Loading recent movements...</div>
            ) : recentMovements.length === 0 ? (
              <div className="py-8 text-center text-xs text-stone-500">No recent production inflows.</div>
            ) : (
              <div className="divide-y divide-stone-100 text-xs">
                {recentMovements.map((m) => (
                  <div key={m.id} className="py-3 flex items-start justify-between gap-3">
                    <div>
                      <span className="font-bold text-stone-900 block">{m.product_name}</span>
                      <div className="flex items-center gap-2 mt-0.5 text-[11px] text-stone-500">
                        <span className="font-mono">{m.sku}</span>
                        <span>•</span>
                        <span>Ref: {m.reference_number || 'Direct In'}</span>
                      </div>
                      {m.reason && <p className="text-[10px] text-stone-400 mt-0.5">{m.reason}</p>}
                    </div>

                    <div className="text-right flex-shrink-0">
                      <span className="font-black text-sm text-[#093725] block">
                        +{m.quantity} pkts
                      </span>
                      <span className="text-[10px] text-stone-400">
                        {new Date(m.created_at).toLocaleTimeString('en-IN', { hour: '2-digit', minute: '2-digit' })}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}


'use client';

import React, { useState, useEffect, useCallback } from 'react';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import AdminNav from '@/components/AdminNav';
import { useAuth } from '@/context/AuthContext';
import { apiGetInventory, apiGetInventoryReportSummary, apiAdjustStock } from '@/lib/api';
import { StockItem, InventorySummary } from '@/types/api';

export default function AdminInventoryPage() {
  const { user, loading: authLoading } = useAuth();
  const [stockItems, setStockItems] = useState<StockItem[]>([]);
  const [summary, setSummary] = useState<InventorySummary | null>(null);
  const [loading, setLoading] = useState(true);
  const [filterMode, setFilterMode] = useState<'all' | 'low' | 'out'>('all');
  const [search, setSearch] = useState('');

  // Stock Adjustment Modal State
  const [adjustingItem, setAdjustingItem] = useState<StockItem | null>(null);
  const [newCount, setNewCount] = useState<number>(0);
  const [adjustReason, setAdjustReason] = useState<string>('');
  const [adjustSubmitting, setAdjustSubmitting] = useState(false);
  const [adjustError, setAdjustError] = useState<string | null>(null);

  const loadData = useCallback(() => {
    setLoading(true);
    Promise.all([
      apiGetInventory({
        low_stock: filterMode === 'low',
        out_of_stock: filterMode === 'out',
        search: search.trim() || undefined,
      }),
      apiGetInventoryReportSummary(),
    ]).then(([invRes, sumRes]) => {
      if (invRes.data) setStockItems(invRes.data);
      if (sumRes.data) setSummary(sumRes.data);
      setLoading(false);
    });
  }, [filterMode, search]);

  useEffect(() => {
    if (user?.is_staff) {
      loadData();
    }
  }, [user, loadData]);

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    loadData();
  };

  const handleOpenAdjust = (item: StockItem) => {
    setAdjustingItem(item);
    setNewCount(item.quantity_on_hand);
    setAdjustReason('Physical warehouse cycle audit count.');
    setAdjustError(null);
  };

  const handleAdjustSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!adjustingItem) return;
    setAdjustSubmitting(true);
    setAdjustError(null);

    const res = await apiAdjustStock({
      variant_id: adjustingItem.variant_id,
      new_quantity_on_hand: newCount,
      reason: adjustReason.trim(),
    });

    setAdjustSubmitting(false);
    if (res.success) {
      setAdjustingItem(null);
      loadData();
    } else {
      setAdjustError(res.message);
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
            <p className="text-xs text-stone-600 mt-2">
              You must be an authorized OnFresh staff administrator to access warehouse inventory records.
            </p>
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
        {/* Header */}
        <div className="mb-6">
          <div className="flex items-center gap-2 text-xs font-semibold uppercase tracking-wider text-amber-700">
            <span>OnFresh Operations</span>
            <span>•</span>
            <span>Vandiperiyar, Idukki</span>
          </div>
          <h1 className="text-3xl font-black text-[#093725] tracking-tight mt-1">
            Warehouse Inventory & Stock
          </h1>
          <p className="text-sm text-stone-600 mt-1">
            Real-time physical stock on hand, customer order reservations, and available-to-sell inventory.
          </p>
        </div>

        <AdminNav />

        {/* Metric Cards */}
        {summary && (
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3 mb-8">
            <div className="bg-white p-4 rounded-2xl border border-stone-200 shadow-xs">
              <span className="text-[10px] uppercase font-bold text-stone-400 block">Total SKUs</span>
              <span className="text-2xl font-black text-stone-900">{summary.total_skus}</span>
            </div>
            <div className="bg-white p-4 rounded-2xl border border-stone-200 shadow-xs">
              <span className="text-[10px] uppercase font-bold text-stone-400 block">On Hand</span>
              <span className="text-2xl font-black text-[#093725]">{summary.total_units_on_hand}</span>
            </div>
            <div className="bg-white p-4 rounded-2xl border border-stone-200 shadow-xs">
              <span className="text-[10px] uppercase font-bold text-stone-400 block">Reserved</span>
              <span className="text-2xl font-black text-amber-600">{summary.total_reserved_units}</span>
            </div>
            <div className="bg-white p-4 rounded-2xl border border-stone-200 shadow-xs">
              <span className="text-[10px] uppercase font-bold text-stone-400 block">Available to Sell</span>
              <span className="text-2xl font-black text-emerald-700">{summary.total_available_units}</span>
            </div>
            <div className="bg-white p-4 rounded-2xl border border-stone-200 shadow-xs">
              <span className="text-[10px] uppercase font-bold text-stone-400 block">Low Stock</span>
              <span className={`text-2xl font-black ${summary.low_stock_count > 0 ? 'text-amber-600' : 'text-stone-900'}`}>
                {summary.low_stock_count}
              </span>
            </div>
            <div className="bg-white p-4 rounded-2xl border border-stone-200 shadow-xs">
              <span className="text-[10px] uppercase font-bold text-stone-400 block">Out of Stock</span>
              <span className={`text-2xl font-black ${summary.out_of_stock_count > 0 ? 'text-red-600' : 'text-stone-900'}`}>
                {summary.out_of_stock_count}
              </span>
            </div>
          </div>
        )}

        {/* Filters and Search Bar */}
        <div className="bg-white rounded-3xl border border-stone-200/80 p-6 shadow-xs mb-8">
          <div className="flex flex-col sm:flex-row items-center justify-between gap-4 mb-6">
            <div className="flex items-center gap-2">
              <button
                onClick={() => setFilterMode('all')}
                className={`px-3.5 py-1.5 rounded-full text-xs font-bold transition cursor-pointer ${
                  filterMode === 'all'
                    ? 'bg-[#093725] text-white'
                    : 'bg-stone-100 text-stone-600 hover:bg-stone-200'
                }`}
              >
                All Variants
              </button>
              <button
                onClick={() => setFilterMode('low')}
                className={`px-3.5 py-1.5 rounded-full text-xs font-bold transition cursor-pointer ${
                  filterMode === 'low'
                    ? 'bg-amber-600 text-white'
                    : 'bg-stone-100 text-stone-600 hover:bg-stone-200'
                }`}
              >
                ⚠️ Low Stock ({summary?.low_stock_count ?? 0})
              </button>
              <button
                onClick={() => setFilterMode('out')}
                className={`px-3.5 py-1.5 rounded-full text-xs font-bold transition cursor-pointer ${
                  filterMode === 'out'
                    ? 'bg-red-600 text-white'
                    : 'bg-stone-100 text-stone-600 hover:bg-stone-200'
                }`}
              >
                ❌ Out of Stock ({summary?.out_of_stock_count ?? 0})
              </button>
            </div>

            <form onSubmit={handleSearchSubmit} className="flex items-center gap-2 w-full sm:w-auto">
              <input
                type="text"
                placeholder="Search SKU or product..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="px-3.5 py-1.5 text-xs border border-stone-300 rounded-xl focus:ring-2 focus:ring-[#093725] focus:outline-none w-full sm:w-64"
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
            <div className="py-16 text-center text-xs text-stone-400">Loading inventory records...</div>
          ) : stockItems.length === 0 ? (
            <div className="py-12 text-center text-xs text-stone-500">No inventory items found.</div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs">
                <thead>
                  <tr className="border-b border-stone-200 text-stone-400 font-bold uppercase tracking-wider">
                    <th className="pb-3">SKU & Snack Name</th>
                    <th className="pb-3">Weight</th>
                    <th className="pb-3 text-right">Physical On Hand</th>
                    <th className="pb-3 text-right">Reserved (Orders)</th>
                    <th className="pb-3 text-right">Available to Sell</th>
                    <th className="pb-3 text-center">Status</th>
                    <th className="pb-3 text-right">Action</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-stone-100">
                  {stockItems.map((item) => (
                    <tr key={item.id} className="hover:bg-stone-50/60 transition">
                      <td className="py-3">
                        <span className="font-mono text-[10px] text-stone-400 block">{item.sku}</span>
                        <span className="font-bold text-stone-900 text-sm">{item.product_name}</span>
                        <span className="text-[10px] text-stone-500 block">{item.category_name}</span>
                      </td>
                      <td className="py-3 font-semibold text-stone-700">
                        {item.display_weight}
                      </td>
                      <td className="py-3 text-right font-black text-stone-900 text-sm">
                        {item.quantity_on_hand}
                      </td>
                      <td className="py-3 text-right font-bold text-amber-600 text-sm">
                        {item.reserved_quantity}
                      </td>
                      <td className="py-3 text-right font-black text-[#093725] text-base">
                        {item.available_to_sell}
                      </td>
                      <td className="py-3 text-center">
                        {item.is_out_of_stock ? (
                          <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-red-100 text-red-800 border border-red-300">
                            OUT OF STOCK
                          </span>
                        ) : item.is_low_stock ? (
                          <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-amber-100 text-amber-800 border border-amber-300">
                            LOW STOCK (≤{item.low_stock_threshold})
                          </span>
                        ) : (
                          <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-emerald-100 text-emerald-800 border border-emerald-300">
                            IN STOCK
                          </span>
                        )}
                      </td>
                      <td className="py-3 text-right">
                        <button
                          onClick={() => handleOpenAdjust(item)}
                          className="px-3 py-1.5 rounded-lg border border-stone-300 bg-white hover:bg-stone-100 text-[11px] font-bold text-stone-700 transition cursor-pointer"
                        >
                          Adjust Count
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>

        {/* Stock Adjustment Modal */}
        {adjustingItem && (
          <div className="fixed inset-0 z-50 bg-black/50 backdrop-blur-xs flex items-center justify-center p-4">
            <div className="bg-white rounded-3xl border border-stone-200 max-w-md w-full p-6 shadow-xl space-y-4">
              <div className="flex items-center justify-between border-b border-stone-100 pb-3">
                <h3 className="font-black text-base text-[#093725]">
                  Adjust Physical Stock Count
                </h3>
                <button
                  onClick={() => setAdjustingItem(null)}
                  className="text-stone-400 hover:text-stone-700 font-bold"
                >
                  ✕
                </button>
              </div>

              <div>
                <span className="text-xs text-stone-400 block font-mono">{adjustingItem.sku}</span>
                <span className="font-bold text-stone-900 text-sm">
                  {adjustingItem.product_name} ({adjustingItem.display_weight})
                </span>
                <div className="flex gap-4 text-xs text-stone-500 mt-2">
                  <span>Current On Hand: <strong>{adjustingItem.quantity_on_hand}</strong></span>
                  <span>Reserved: <strong>{adjustingItem.reserved_quantity}</strong></span>
                </div>
              </div>

              {adjustError && (
                <div className="p-3 rounded-xl bg-red-50 border border-red-300 text-red-900 text-xs">
                  {adjustError}
                </div>
              )}

              <form onSubmit={handleAdjustSubmit} className="space-y-4 text-xs">
                <div>
                  <label className="font-bold text-stone-700 block mb-1">
                    Verified Physical Count On Hand *
                  </label>
                  <input
                    type="number"
                    min={adjustingItem.reserved_quantity}
                    required
                    value={newCount}
                    onChange={(e) => setNewCount(parseInt(e.target.value) || 0)}
                    className="w-full px-3 py-2 border border-stone-300 rounded-xl font-bold text-base text-[#093725] focus:ring-2 focus:ring-[#093725] focus:outline-none"
                  />
                  <span className="text-[10px] text-stone-400 mt-1 block">
                    Cannot be less than currently reserved order stock ({adjustingItem.reserved_quantity} units).
                  </span>
                </div>

                <div>
                  <label className="font-bold text-stone-700 block mb-1">
                    Audit Reason / Notes *
                  </label>
                  <textarea
                    required
                    rows={3}
                    value={adjustReason}
                    onChange={(e) => setAdjustReason(e.target.value)}
                    className="w-full p-2.5 border border-stone-300 rounded-xl focus:ring-2 focus:ring-[#093725] focus:outline-none"
                    placeholder="Provide mandatory reason for manual stock reconciliation..."
                  />
                </div>

                <div className="flex items-center justify-end gap-2 pt-2">
                  <button
                    type="button"
                    onClick={() => setAdjustingItem(null)}
                    className="px-4 py-2 rounded-xl text-stone-600 hover:bg-stone-100 font-bold"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    disabled={adjustSubmitting}
                    className="px-5 py-2 rounded-xl bg-[#093725] text-white hover:bg-[#062619] font-bold shadow-xs disabled:opacity-50"
                  >
                    {adjustSubmitting ? 'Saving...' : 'Save Adjustment'}
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}
      </main>

      <Footer />
    </div>
  );
}


'use client';

import React, { useState, useEffect, useCallback } from 'react';
import Link from 'next/link';
import AdminLayout from '@/components/AdminLayout';
import { apiGetRawMaterials } from '@/lib/api';
import { RawMaterial } from '@/types/api';

export default function PackagingManagementPage() {
  const [packagingItems, setPackagingItems] = useState<RawMaterial[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const loadData = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const res = await apiGetRawMaterials({ category: 'packaging-materials' });
      setPackagingItems(res.data || []);
      if (res.error) setError(res.error);
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : 'Failed to load packaging stock');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    loadData();
  }, [loadData]);

  const pouches = packagingItems.filter((i) => i.material_code.includes('POUCH'));
  const cartons = packagingItems.filter((i) => i.material_code.includes('BOX') || i.material_code.includes('CRT'));
  const others = packagingItems.filter(
    (i) => !i.material_code.includes('POUCH') && !i.material_code.includes('BOX') && !i.material_code.includes('CRT')
  );

  return (
    <AdminLayout
      title="Packaging Materials & Carton Inventory"
      subtitle="Retail pouches (250g, 500g, 1kg), corrugated shipping master cartons, and seal supplies."
      actions={
        <div className="flex items-center gap-2">
          <Link
            href="/admin/purchases"
            className="px-4 py-2 bg-gradient-to-r from-[#093725] to-[#15803d] text-amber-300 rounded-xl text-xs font-bold hover:shadow-md transition"
          >
            + Reorder Packaging (PO)
          </Link>
          <button
            onClick={loadData}
            className="p-2 text-slate-500 hover:text-slate-700 bg-white border border-slate-200 rounded-xl hover:bg-slate-50 transition"
            title="Refresh"
          >
            🔄
          </button>
        </div>
      }
    >
      {error && (
        <div className="mb-4 p-4 bg-amber-50 border border-amber-200 rounded-2xl text-amber-800 text-xs">
          ⚠️ {error}
        </div>
      )}

      {/* 1. Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-5 mb-8">
        <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-2xs">
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs font-semibold uppercase tracking-wider text-slate-400">
              Retail Barrier Pouches
            </span>
            <span className="text-xl">🛍️</span>
          </div>
          <div className="text-2xl font-black text-slate-900">
            {pouches.reduce((acc, p) => acc + Number(p.current_stock), 0).toLocaleString()} pcs
          </div>
          <p className="text-xs text-slate-500 mt-1">
            Across {pouches.length} packet size variants (250g, 500g, 1kg)
          </p>
        </div>

        <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-2xs">
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs font-semibold uppercase tracking-wider text-slate-400">
              Corrugated Shipping Cartons
            </span>
            <span className="text-xl">📦</span>
          </div>
          <div className="text-2xl font-black text-slate-900">
            {cartons.reduce((acc, c) => acc + Number(c.current_stock), 0).toLocaleString()} boxes
          </div>
          <p className="text-xs text-slate-500 mt-1">Master shipper cases for wholesale B2B dispatch</p>
        </div>

        <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-2xs">
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs font-semibold uppercase tracking-wider text-slate-400">
              Packaging Inventory Value
            </span>
            <span className="text-xl">₹</span>
          </div>
          <div className="text-2xl font-black text-emerald-800">
            ₹
            {packagingItems
              .reduce((acc, item) => acc + Number(item.total_stock_value || 0), 0)
              .toLocaleString('en-IN', { maximumFractionDigits: 0 })}
          </div>
          <p className="text-xs text-slate-500 mt-1">Valuation in Vandiperiyar packaging loft</p>
        </div>
      </div>

      {/* 2. Retail Pouches Breakdown */}
      <div className="mb-8 bg-white rounded-2xl border border-slate-200 shadow-2xs overflow-hidden">
        <div className="p-4 border-b border-slate-100 flex items-center justify-between">
          <h3 className="font-bold text-slate-900 text-sm flex items-center gap-2">
            <span>🛍️</span> Retail Nitrogen-Barrier Pouches (Retail B2C & B2B Units)
          </h3>
          <span className="text-xs text-slate-500">{pouches.length} active formats</span>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-slate-50/75 border-b border-slate-100 text-slate-500 uppercase tracking-wider font-semibold">
              <tr>
                <th className="py-3 px-4">SKU / Item</th>
                <th className="py-3 px-4">Format</th>
                <th className="py-3 px-4">Available Stock</th>
                <th className="py-3 px-4">Min Reorder Level</th>
                <th className="py-3 px-4">Unit Cost</th>
                <th className="py-3 px-4">Total Value</th>
                <th className="py-3 px-4">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {loading ? (
                <tr>
                  <td colSpan={7} className="py-8 text-center text-slate-400">
                    Loading packaging materials...
                  </td>
                </tr>
              ) : pouches.length === 0 ? (
                <tr>
                  <td colSpan={7} className="py-8 text-center text-slate-400">
                    No pouch inventory found.
                  </td>
                </tr>
              ) : (
                pouches.map((p) => (
                  <tr key={p.id} className="hover:bg-slate-50/60 transition">
                    <td className="py-3 px-4">
                      <div className="font-bold text-slate-900">{p.name}</div>
                      <div className="text-[10px] font-mono text-slate-400">{p.material_code}</div>
                    </td>
                    <td className="py-3 px-4 text-slate-600 font-semibold">{p.unit_of_measure}</td>
                    <td className="py-3 px-4 font-bold text-slate-900 text-sm">
                      {Number(p.current_stock).toLocaleString()} pcs
                    </td>
                    <td className="py-3 px-4 text-slate-500 font-medium">
                      {Number(p.minimum_stock_level).toLocaleString()} pcs
                    </td>
                    <td className="py-3 px-4 font-semibold text-slate-900">
                      ₹{Number(p.unit_cost).toFixed(2)}
                    </td>
                    <td className="py-3 px-4 font-bold text-slate-900">
                      ₹{Number(p.total_stock_value || 0).toFixed(2)}
                    </td>
                    <td className="py-3 px-4">
                      <span
                        className={`inline-flex px-2 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider ${
                          p.is_low_stock
                            ? 'bg-amber-100 text-amber-800'
                            : p.is_out_of_stock
                            ? 'bg-red-100 text-red-800'
                            : 'bg-emerald-100 text-emerald-800'
                        }`}
                      >
                        {p.is_out_of_stock ? 'Depleted' : p.is_low_stock ? 'Low Stock' : 'Ample'}
                      </span>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* 3. Outer Corrugated Master Cartons */}
      <div className="bg-white rounded-2xl border border-slate-200 shadow-2xs overflow-hidden">
        <div className="p-4 border-b border-slate-100 flex items-center justify-between">
          <h3 className="font-bold text-slate-900 text-sm flex items-center gap-2">
            <span>📦</span> Corrugated Master Shipping Boxes & Other Supplies
          </h3>
          <span className="text-xs text-slate-500">{cartons.length + others.length} items</span>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-slate-50/75 border-b border-slate-100 text-slate-500 uppercase tracking-wider font-semibold">
              <tr>
                <th className="py-3 px-4">Material Code & Name</th>
                <th className="py-3 px-4">Available Stock</th>
                <th className="py-3 px-4">Min Reorder Level</th>
                <th className="py-3 px-4">Unit Cost</th>
                <th className="py-3 px-4">Total Value</th>
                <th className="py-3 px-4">Location</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {[...cartons, ...others].map((item) => (
                <tr key={item.id} className="hover:bg-slate-50/60 transition">
                  <td className="py-3 px-4">
                    <div className="font-bold text-slate-900">{item.name}</div>
                    <div className="text-[10px] font-mono text-slate-400">{item.material_code}</div>
                  </td>
                  <td className="py-3 px-4 font-bold text-slate-900 text-sm">
                    {Number(item.current_stock).toLocaleString()} {item.unit_of_measure}
                  </td>
                  <td className="py-3 px-4 text-slate-500">
                    {Number(item.minimum_stock_level).toLocaleString()} {item.unit_of_measure}
                  </td>
                  <td className="py-3 px-4 font-semibold text-slate-900">
                    ₹{Number(item.unit_cost).toFixed(2)}
                  </td>
                  <td className="py-3 px-4 font-bold text-slate-900">
                    ₹{Number(item.total_stock_value || 0).toFixed(2)}
                  </td>
                  <td className="py-3 px-4 text-slate-500">{item.storage_location || '—'}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </AdminLayout>
  );
}


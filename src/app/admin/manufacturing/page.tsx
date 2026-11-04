'use client';

import React, { useState, useEffect, useCallback } from 'react';
import Link from 'next/link';
import AdminLayout from '@/components/AdminLayout';
import { apiGetManufacturingDashboard } from '@/lib/api';
import { ManufacturingDashboardData } from '@/types/api';

export default function ManufacturingDashboardPage() {
  const [loading, setLoading] = useState(true);
  const [data, setData] = useState<ManufacturingDashboardData | null>(null);
  const [error, setError] = useState<string | null>(null);

  const loadData = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const res = await apiGetManufacturingDashboard();
      if (res.data) {
        setData(res.data);
      } else {
        setError(res.error || 'Failed to load manufacturing metrics.');
      }
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : 'Error connecting to manufacturing backend');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    loadData();
  }, [loadData]);

  const kpis = data?.kpis;

  return (
    <AdminLayout
      title="Manufacturing & Production Hub"
      subtitle="Raw materials, suppliers, recipes (BOM), kitchen production batches, and QC in Vandiperiyar, Kerala."
      actions={
        <div className="flex items-center gap-2">
          <Link
            href="/admin/production/orders"
            className="px-4 py-2 bg-gradient-to-r from-[#093725] to-[#15803d] text-amber-300 rounded-xl text-xs font-bold hover:shadow-md transition flex items-center gap-1.5"
          >
            <span>+</span> Plan Production
          </Link>
          <Link
            href="/admin/purchases"
            className="px-4 py-2 bg-white border border-slate-200 text-slate-700 rounded-xl text-xs font-semibold hover:bg-slate-50 transition"
          >
            Raise PO
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
        <div className="mb-6 p-4 bg-amber-50 border border-amber-200 rounded-2xl text-amber-800 text-sm flex items-center justify-between">
          <span>⚠️ {error}</span>
          <button onClick={loadData} className="font-semibold underline ml-2">
            Retry
          </button>
        </div>
      )}

      {/* 1. Core KPIs Header */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
        <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-2xs">
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs font-semibold uppercase tracking-wider text-slate-400">
              Active Production
            </span>
            <span className="w-8 h-8 rounded-lg bg-emerald-50 text-emerald-600 flex items-center justify-center text-sm font-bold">
              ⚙️
            </span>
          </div>
          <div className="text-2xl font-black text-slate-900">
            {loading ? '...' : kpis?.active_production_orders || 0}
          </div>
          <p className="text-xs text-slate-500 mt-1">Orders in planning or kitchen frying</p>
        </div>

        <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-2xs">
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs font-semibold uppercase tracking-wider text-slate-400">
              Pending QC Checks
            </span>
            <span className="w-8 h-8 rounded-lg bg-amber-50 text-amber-600 flex items-center justify-center text-sm font-bold">
              🔬
            </span>
          </div>
          <div className="text-2xl font-black text-slate-900">
            {loading ? '...' : kpis?.pending_qc_count || 0}
          </div>
          <p className="text-xs text-slate-500 mt-1">Batches awaiting sensory & seal pass</p>
        </div>

        <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-2xs">
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs font-semibold uppercase tracking-wider text-slate-400">
              Low-Stock Alerts
            </span>
            <span className="w-8 h-8 rounded-lg bg-red-50 text-red-600 flex items-center justify-center text-sm font-bold">
              ⚠️
            </span>
          </div>
          <div className="text-2xl font-black text-red-600">
            {loading ? '...' : kpis?.low_stock_materials || 0}
          </div>
          <p className="text-xs text-slate-500 mt-1">Materials at or below reorder level</p>
        </div>

        <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-2xs">
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs font-semibold uppercase tracking-wider text-slate-400">
              Raw Inventory Value
            </span>
            <span className="w-8 h-8 rounded-lg bg-blue-50 text-blue-600 flex items-center justify-center text-sm font-bold">
              ₹
            </span>
          </div>
          <div className="text-2xl font-black text-slate-900">
            {loading
              ? '...'
              : `₹${(kpis?.total_raw_valuation || 0).toLocaleString('en-IN', {
                  maximumFractionDigits: 0,
                })}`}
          </div>
          <p className="text-xs text-slate-500 mt-1">
            Across {kpis?.total_raw_materials || 0} active materials
          </p>
        </div>
      </div>

      {/* 2. Interactive Navigation Shortcuts */}
      <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-6 gap-3 mb-6">
        {[
          { href: '/admin/raw-materials', label: 'Raw Materials', icon: '🌾', desc: 'Stock & Reorder' },
          { href: '/admin/suppliers', label: 'Suppliers', icon: '🤝', desc: 'Directory & Pricing' },
          { href: '/admin/purchases', label: 'Purchase Orders', icon: '🛒', desc: 'PO & Receiving' },
          { href: '/admin/recipes', label: 'Recipes (BOM)', icon: '📖', desc: 'Costing & Yield' },
          { href: '/admin/production/orders', label: 'Production Runs', icon: '⚙️', desc: 'Work Orders' },
          { href: '/admin/production/quality', label: 'Quality Control', icon: '🔬', desc: 'Inspection Gate' },
        ].map((item) => (
          <Link
            key={item.href}
            href={item.href}
            className="p-4 bg-white rounded-2xl border border-slate-200 hover:border-emerald-500 hover:shadow-xs transition group text-left"
          >
            <div className="text-2xl mb-2 group-hover:scale-110 transition-transform">
              {item.icon}
            </div>
            <div className="font-bold text-sm text-slate-900 group-hover:text-emerald-700 transition">
              {item.label}
            </div>
            <div className="text-xs text-slate-500 mt-0.5">{item.desc}</div>
          </Link>
        ))}
      </div>

      {/* 3. Main Operational Grids */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Active Production Runs */}
        <div className="lg:col-span-2 bg-white rounded-2xl border border-slate-200 shadow-2xs overflow-hidden">
          <div className="p-5 border-b border-slate-100 flex items-center justify-between">
            <div>
              <h2 className="font-bold text-slate-900">Recent Production Orders</h2>
              <p className="text-xs text-slate-500 mt-0.5">
                Work orders running through Vandiperiyar kitchen facility
              </p>
            </div>
            <Link
              href="/admin/production/orders"
              className="text-xs font-semibold text-emerald-600 hover:text-emerald-700"
            >
              View all →
            </Link>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-slate-50/75 border-b border-slate-100 text-slate-500 uppercase tracking-wider font-semibold">
                <tr>
                  <th className="py-3 px-4">Order / Batch</th>
                  <th className="py-3 px-4">Product Variant</th>
                  <th className="py-3 px-4">Target / Produced</th>
                  <th className="py-3 px-4">Unit Cost</th>
                  <th className="py-3 px-4">Status</th>
                  <th className="py-3 px-4 text-right">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {loading ? (
                  <tr>
                    <td colSpan={6} className="py-8 text-center text-slate-400">
                      Loading production orders...
                    </td>
                  </tr>
                ) : data?.recent_production_orders?.length === 0 ? (
                  <tr>
                    <td colSpan={6} className="py-8 text-center text-slate-400">
                      No production orders recorded yet.
                    </td>
                  </tr>
                ) : (
                  data?.recent_production_orders?.map((ord) => (
                    <tr key={ord.id} className="hover:bg-slate-50/60 transition">
                      <td className="py-3 px-4">
                        <div className="font-mono font-bold text-slate-800">{ord.order_number}</div>
                        <div className="text-[11px] text-slate-400">
                          {ord.batch_number ? `Batch: ${ord.batch_number}` : `Start: ${ord.start_date}`}
                        </div>
                      </td>
                      <td className="py-3 px-4">
                        <div className="font-semibold text-slate-900">{ord.product_name}</div>
                        <div className="text-[11px] text-slate-500">{ord.variant_sku}</div>
                      </td>
                      <td className="py-3 px-4">
                        <span className="font-bold text-slate-800">{ord.produced_quantity}</span>
                        <span className="text-slate-400"> / {ord.planned_quantity} pkts</span>
                      </td>
                      <td className="py-3 px-4">
                        <span className="font-semibold text-slate-900">
                          ₹{Number(ord.cost_per_unit || 0).toFixed(2)}
                        </span>
                      </td>
                      <td className="py-3 px-4">
                        <span
                          className={`inline-flex items-center px-2 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider ${
                            ord.status === 'completed'
                              ? 'bg-emerald-100 text-emerald-800'
                              : ord.status === 'quality_check'
                              ? 'bg-amber-100 text-amber-800'
                              : ord.status === 'in_progress'
                              ? 'bg-blue-100 text-blue-800'
                              : 'bg-slate-100 text-slate-800'
                          }`}
                        >
                          {ord.status.replace('_', ' ')}
                        </span>
                      </td>
                      <td className="py-3 px-4 text-right">
                        <Link
                          href="/admin/production/orders"
                          className="px-2.5 py-1 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-lg text-[11px] font-semibold transition"
                        >
                          Manage
                        </Link>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>

        {/* Right Column: Low Stock Alerts & Recent QC */}
        <div className="space-y-6">
          {/* Low Stock Material Warnings */}
          <div className="bg-white rounded-2xl border border-slate-200 shadow-2xs overflow-hidden">
            <div className="p-4 border-b border-slate-100 flex items-center justify-between">
              <h3 className="font-bold text-slate-900 text-sm flex items-center gap-1.5">
                <span className="text-amber-500">⚠️</span> Low Raw Material Stock
              </h3>
              <Link
                href="/admin/raw-materials?low_stock=true"
                className="text-xs font-semibold text-emerald-600 hover:text-emerald-700"
              >
                View all
              </Link>
            </div>
            <div className="divide-y divide-slate-100">
              {loading ? (
                <div className="p-4 text-center text-xs text-slate-400">Checking stock...</div>
              ) : data?.low_stock_materials?.length === 0 ? (
                <div className="p-4 text-center text-xs text-emerald-600 bg-emerald-50/50">
                  ✅ All raw materials & packaging above minimum reorder levels.
                </div>
              ) : (
                data?.low_stock_materials?.map((mat) => (
                  <div
                    key={mat.id}
                    className="p-3.5 flex items-center justify-between hover:bg-slate-50/70 transition"
                  >
                    <div>
                      <div className="font-semibold text-slate-900 text-xs">{mat.name}</div>
                      <div className="text-[11px] text-slate-400 font-mono">
                        {mat.material_code} · {mat.category_name}
                      </div>
                    </div>
                    <div className="text-right">
                      <div className="text-xs font-bold text-red-600">
                        {Number(mat.current_stock).toFixed(1)} {mat.unit_of_measure}
                      </div>
                      <div className="text-[10px] text-slate-400">
                        Min: {Number(mat.minimum_stock_level).toFixed(1)} {mat.unit_of_measure}
                      </div>
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>

          {/* Recent Quality Inspections */}
          <div className="bg-white rounded-2xl border border-slate-200 shadow-2xs overflow-hidden">
            <div className="p-4 border-b border-slate-100 flex items-center justify-between">
              <h3 className="font-bold text-slate-900 text-sm flex items-center gap-1.5">
                <span>🔬</span> QC Inspection Gate
              </h3>
              <Link
                href="/admin/production/quality"
                className="text-xs font-semibold text-emerald-600 hover:text-emerald-700"
              >
                Queue
              </Link>
            </div>
            <div className="divide-y divide-slate-100">
              {loading ? (
                <div className="p-4 text-center text-xs text-slate-400">Loading QC logs...</div>
              ) : data?.recent_quality_inspections?.length === 0 ? (
                <div className="p-4 text-center text-xs text-slate-400">
                  No quality inspections recorded yet.
                </div>
              ) : (
                data?.recent_quality_inspections?.map((qc) => (
                  <div
                    key={qc.id}
                    className="p-3.5 flex items-center justify-between hover:bg-slate-50/70 transition"
                  >
                    <div>
                      <div className="font-mono font-bold text-slate-800 text-xs">
                        {qc.inspection_number}
                      </div>
                      <div className="text-[11px] text-slate-500">
                        Order {qc.order_number} · {qc.inspector_name}
                      </div>
                    </div>
                    <div>
                      <span
                        className={`inline-flex px-2 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider ${
                          qc.overall_result === 'passed'
                            ? 'bg-emerald-100 text-emerald-800'
                            : qc.overall_result === 'failed'
                            ? 'bg-red-100 text-red-800'
                            : 'bg-amber-100 text-amber-800'
                        }`}
                      >
                        {qc.overall_result}
                      </span>
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>
        </div>
      </div>
    </AdminLayout>
  );
}


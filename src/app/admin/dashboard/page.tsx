'use client';

import React, { useState, useEffect, useCallback } from 'react';
import Link from 'next/link';
import AdminLayout from '@/components/AdminLayout';
import {
  apiGetDashboardSummary,
  apiGetSalesAnalytics,
  apiGetB2BvsB2CComparison,
  apiGetProductAnalytics,
  getReportExportUrl,
} from '@/lib/api';
import {
  DashboardSummary,
  SalesAnalyticsData,
  B2BvsB2CComparisonData,
  ProductAnalyticsData,
} from '@/types/api';

export default function AdminDashboardPage() {
  const [period, setPeriod] = useState<string>('this_month');
  const [interval, setInterval] = useState<'daily' | 'monthly'>('daily');
  const [loading, setLoading] = useState(true);
  const [summary, setSummary] = useState<DashboardSummary | null>(null);
  const [salesData, setSalesData] = useState<SalesAnalyticsData | null>(null);
  const [comparison, setComparison] = useState<B2BvsB2CComparisonData | null>(null);
  const [productsData, setProductsData] = useState<ProductAnalyticsData | null>(null);
  const [hoveredBar, setHoveredBar] = useState<number | null>(null);

  const loadData = useCallback(async () => {
    setLoading(true);
    try {
      const [sumRes, salesRes, compRes, prodRes] = await Promise.all([
        apiGetDashboardSummary(period),
        apiGetSalesAnalytics(period, interval),
        apiGetB2BvsB2CComparison(period),
        apiGetProductAnalytics(period),
      ]);

      if (sumRes.data) setSummary(sumRes.data);
      if (salesRes.data) setSalesData(salesRes.data);
      if (compRes.data) setComparison(compRes.data);
      if (prodRes.data) setProductsData(prodRes.data);
    } catch (err) {
      console.error('Failed to load dashboard metrics', err);
    } finally {
      setLoading(false);
    }
  }, [period, interval]);

  useEffect(() => {
    loadData();
  }, [loadData]);

  const maxRevenue = salesData?.time_series?.length
    ? Math.max(...salesData.time_series.map((d) => d.total_revenue), 1)
    : 1;

  return (
    <AdminLayout
      title="Executive Overview"
      subtitle="Real-time sales, order processing, and manufacturing metrics for OnFresh Vandiperiyar."
      actions={
        <div className="flex items-center gap-2">
          {/* Period selector */}
          <div className="inline-flex bg-slate-100 p-1 rounded-xl text-xs font-semibold">
            {[
              { id: 'today', label: 'Today' },
              { id: '7days', label: '7 Days' },
              { id: '30days', label: '30 Days' },
              { id: 'this_month', label: 'This Month' },
              { id: 'this_year', label: 'This Year' },
            ].map((p) => (
              <button
                key={p.id}
                onClick={() => setPeriod(p.id)}
                className={`px-3 py-1.5 rounded-lg transition ${
                  period === p.id
                    ? 'bg-white text-slate-900 shadow-xs font-bold'
                    : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                {p.label}
              </button>
            ))}
          </div>

          {/* Export Report button */}
          <a
            href={getReportExportUrl('sales', 'csv', period)}
            download
            className="inline-flex items-center gap-1.5 px-3.5 py-1.5 bg-[#093725] text-amber-300 rounded-xl text-xs font-bold hover:bg-[#062519] transition shadow-xs"
          >
            <span>📥</span> Export CSV
          </a>
        </div>
      }
    >
      {loading ? (
        <div className="py-24 text-center">
          <div className="w-10 h-10 border-4 border-emerald-600 border-t-transparent rounded-full animate-spin mx-auto mb-3" />
          <p className="text-xs font-bold text-slate-500 uppercase tracking-wider">
            Loading OnFresh Business Metrics...
          </p>
        </div>
      ) : (
        <div className="space-y-6">
          {/* 1. Top KPI Summary Row */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {/* Net Revenue */}
            <div className="bg-white p-5 rounded-2xl border border-slate-200/80 shadow-xs">
              <div className="flex items-center justify-between text-xs font-bold text-slate-400 uppercase tracking-wider">
                <span>Net Sales Revenue</span>
                <span className="p-1.5 bg-emerald-50 text-emerald-700 rounded-lg">₹</span>
              </div>
              <div className="mt-2 text-2xl font-black text-slate-900">
                ₹{summary?.total_revenue?.toLocaleString('en-IN', { minimumFractionDigits: 2 }) || '0.00'}
              </div>
              <div className="mt-2 flex items-center justify-between text-xs text-slate-500">
                <span>Gross Value: ₹{summary?.gross_order_value?.toLocaleString('en-IN') || '0'}</span>
                <span className="text-[11px] text-emerald-700 font-bold bg-emerald-50 px-2 py-0.5 rounded-full">
                  Excl. Cancelled
                </span>
              </div>
            </div>

            {/* Collected vs Outstanding Payments */}
            <div className="bg-white p-5 rounded-2xl border border-slate-200/80 shadow-xs">
              <div className="flex items-center justify-between text-xs font-bold text-slate-400 uppercase tracking-wider">
                <span>Payment Collections</span>
                <span className="p-1.5 bg-blue-50 text-blue-700 rounded-lg">💳</span>
              </div>
              <div className="mt-2 text-2xl font-black text-slate-900">
                ₹{summary?.collected_payments?.toLocaleString('en-IN', { minimumFractionDigits: 2 }) || '0.00'}
              </div>
              <div className="mt-2 flex items-center justify-between text-xs text-slate-500">
                <span>Pending: ₹{summary?.outstanding_payments?.toLocaleString('en-IN') || '0'}</span>
                <span className="text-[11px] text-amber-700 font-bold bg-amber-50 px-2 py-0.5 rounded-full">
                  Outstanding
                </span>
              </div>
            </div>

            {/* Total Orders & Volume */}
            <div className="bg-white p-5 rounded-2xl border border-slate-200/80 shadow-xs">
              <div className="flex items-center justify-between text-xs font-bold text-slate-400 uppercase tracking-wider">
                <span>Total Orders</span>
                <span className="p-1.5 bg-amber-50 text-amber-700 rounded-lg">📦</span>
              </div>
              <div className="mt-2 text-2xl font-black text-slate-900">
                {summary?.valid_orders_count || 0}
                <span className="text-xs font-medium text-slate-400 ml-1.5">
                  ({summary?.total_orders || 0} total)
                </span>
              </div>
              <div className="mt-2 flex items-center justify-between text-xs text-slate-500">
                <span>AOV: ₹{summary?.aov?.toLocaleString('en-IN', { maximumFractionDigits: 0 }) || '0'}</span>
                <span className="text-[11px] text-slate-600 font-semibold">
                  {summary?.delivered_orders || 0} Delivered
                </span>
              </div>
            </div>

            {/* Customer Base & Approvals */}
            <div className="bg-white p-5 rounded-2xl border border-slate-200/80 shadow-xs">
              <div className="flex items-center justify-between text-xs font-bold text-slate-400 uppercase tracking-wider">
                <span>Active Customers</span>
                <span className="p-1.5 bg-purple-50 text-purple-700 rounded-lg">👥</span>
              </div>
              <div className="mt-2 text-2xl font-black text-slate-900">
                {(summary?.total_individual_customers || 0) + (summary?.total_wholesale_customers || 0)}
              </div>
              <div className="mt-2 flex items-center justify-between text-xs text-slate-500">
                <span>
                  B2C: {summary?.total_individual_customers || 0} &bull; B2B: {summary?.total_wholesale_customers || 0}
                </span>
                {(summary?.pending_wholesale_applications || 0) > 0 && (
                  <Link
                    href="/admin/customers?wholesale_status=pending"
                    className="text-[11px] text-rose-700 font-bold bg-rose-50 px-2 py-0.5 rounded-full hover:bg-rose-100 transition"
                  >
                    {summary?.pending_wholesale_applications} Pending
                  </Link>
                )}
              </div>
            </div>
          </div>

          {/* 2. Secondary Operational KPI Row */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 bg-white p-4 rounded-2xl border border-slate-200/80 shadow-xs">
            <div className="p-3 bg-slate-50 rounded-xl text-center">
              <div className="text-[11px] font-bold text-slate-500 uppercase">Active Products</div>
              <div className="text-xl font-extrabold text-slate-800 mt-0.5">
                {summary?.total_active_products || 0}
              </div>
            </div>
            <div className="p-3 bg-amber-50/70 rounded-xl text-center">
              <div className="text-[11px] font-bold text-amber-800 uppercase">Low Stock Variants</div>
              <div className="text-xl font-extrabold text-amber-700 mt-0.5">
                {summary?.low_stock_variants || 0}
              </div>
            </div>
            <div className="p-3 bg-red-50/70 rounded-xl text-center">
              <div className="text-[11px] font-bold text-red-800 uppercase">Out of Stock</div>
              <div className="text-xl font-extrabold text-red-600 mt-0.5">
                {summary?.out_of_stock_variants || 0}
              </div>
            </div>
            <div className="p-3 bg-emerald-50/70 rounded-xl text-center">
              <div className="text-[11px] font-bold text-emerald-800 uppercase">Active Batches</div>
              <div className="text-xl font-extrabold text-emerald-700 mt-0.5">
                {summary?.active_production_batches || 0}
              </div>
            </div>
          </div>

          {/* 3. Sales Analytics Bar Chart & B2C/B2B Split */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Sales Analytics Chart (Left 2 cols) */}
            <div className="lg:col-span-2 bg-white p-6 rounded-2xl border border-slate-200/80 shadow-xs">
              <div className="flex items-center justify-between mb-4">
                <div>
                  <h3 className="text-base font-bold text-slate-900">Sales Analytics & Volume</h3>
                  <p className="text-xs text-slate-500 mt-0.5">Daily revenue trend and order frequency</p>
                </div>
                <div className="inline-flex bg-slate-100 p-1 rounded-xl text-xs font-semibold">
                  <button
                    onClick={() => setInterval('daily')}
                    className={`px-3 py-1 rounded-lg transition ${
                      interval === 'daily' ? 'bg-white text-slate-900 font-bold shadow-xs' : 'text-slate-500'
                    }`}
                  >
                    Daily
                  </button>
                  <button
                    onClick={() => setInterval('monthly')}
                    className={`px-3 py-1 rounded-lg transition ${
                      interval === 'monthly' ? 'bg-white text-slate-900 font-bold shadow-xs' : 'text-slate-500'
                    }`}
                  >
                    Monthly
                  </button>
                </div>
              </div>

              {/* Chart container */}
              <div className="h-64 flex items-end gap-2 pt-8 pb-4 px-2 border-b border-slate-100">
                {salesData?.time_series?.length === 0 ? (
                  <div className="w-full h-full flex items-center justify-center text-xs text-slate-400 font-semibold">
                    No sales recorded in this date range.
                  </div>
                ) : (
                  salesData?.time_series?.map((pt, idx) => {
                    const heightPercent = Math.max(6, (pt.total_revenue / maxRevenue) * 100);
                    const isHovered = hoveredBar === idx;
                    return (
                      <div
                        key={pt.date || idx}
                        className="flex-1 flex flex-col items-center h-full justify-end relative group cursor-pointer"
                        onMouseEnter={() => setHoveredBar(idx)}
                        onMouseLeave={() => setHoveredBar(null)}
                      >
                        {/* Hover Tooltip */}
                        {isHovered && (
                          <div className="absolute -top-16 z-30 bg-slate-900 text-white px-2.5 py-1.5 rounded-lg shadow-lg text-[11px] whitespace-nowrap pointer-events-none">
                            <div className="font-bold">{pt.label || pt.date}</div>
                            <div>Revenue: ₹{pt.total_revenue.toLocaleString('en-IN')}</div>
                            <div className="text-[10px] text-slate-400">
                              Orders: {pt.order_count} (B2C: {pt.retail_orders}, B2B: {pt.wholesale_orders})
                            </div>
                          </div>
                        )}

                        {/* Bar */}
                        <div
                          style={{ height: `${heightPercent}%` }}
                          className={`w-full max-w-[28px] rounded-t-md transition-all ${
                            isHovered
                              ? 'bg-amber-400 shadow-md scale-y-105'
                              : 'bg-emerald-600 hover:bg-emerald-500'
                          }`}
                        />
                        {/* Label */}
                        <span className="text-[10px] text-slate-400 mt-2 truncate w-full text-center">
                          {pt.label}
                        </span>
                      </div>
                    );
                  })
                )}
              </div>

              {/* Legend */}
              <div className="flex items-center justify-between text-xs text-slate-500 mt-3 px-2">
                <div className="flex items-center gap-4">
                  <div className="flex items-center gap-1.5">
                    <div className="w-3 h-3 rounded-xs bg-emerald-600" />
                    <span>Completed Sales</span>
                  </div>
                  <div className="flex items-center gap-1.5">
                    <div className="w-3 h-3 rounded-xs bg-amber-400" />
                    <span>Hovered Period</span>
                  </div>
                </div>
                <div className="text-[11px] text-slate-400">
                  Peak: ₹{maxRevenue.toLocaleString('en-IN')}
                </div>
              </div>
            </div>

            {/* B2C vs B2B Comparison Widget (Right col) */}
            <div className="bg-white p-6 rounded-2xl border border-slate-200/80 shadow-xs flex flex-col justify-between">
              <div>
                <h3 className="text-base font-bold text-slate-900">B2C vs B2B Performance</h3>
                <p className="text-xs text-slate-500 mt-0.5">Retail consumers vs wholesale business clients</p>

                {/* Progress bar ratio */}
                <div className="mt-5">
                  <div className="flex justify-between text-xs font-bold mb-1.5">
                    <span className="text-emerald-700">
                      Retail ({comparison?.revenue_split?.retail_percent || 0}%)
                    </span>
                    <span className="text-[#093725]">
                      Wholesale ({comparison?.revenue_split?.wholesale_percent || 0}%)
                    </span>
                  </div>
                  <div className="h-3 w-full bg-slate-100 rounded-full overflow-hidden flex">
                    <div
                      style={{ width: `${comparison?.revenue_split?.retail_percent || 0}%` }}
                      className="bg-emerald-500 transition-all duration-500"
                    />
                    <div
                      style={{ width: `${comparison?.revenue_split?.wholesale_percent || 0}%` }}
                      className="bg-[#093725] transition-all duration-500"
                    />
                  </div>
                </div>

                {/* Metrics comparison cards */}
                <div className="grid grid-cols-2 gap-3 mt-6">
                  {/* Retail */}
                  <div className="p-3 bg-emerald-50/50 rounded-xl border border-emerald-100">
                    <div className="text-[11px] font-bold text-emerald-800">🛒 Retail (B2C)</div>
                    <div className="mt-1 text-base font-black text-slate-900">
                      ₹{comparison?.retail?.total_revenue?.toLocaleString('en-IN') || '0'}
                    </div>
                    <div className="text-[11px] text-slate-500 mt-1">
                      {comparison?.retail?.order_count || 0} orders &bull; AOV: ₹
                      {comparison?.retail?.aov?.toFixed(0) || '0'}
                    </div>
                  </div>

                  {/* Wholesale */}
                  <div className="p-3 bg-slate-50 rounded-xl border border-slate-200">
                    <div className="text-[11px] font-bold text-slate-700">🏢 Wholesale (B2B)</div>
                    <div className="mt-1 text-base font-black text-slate-900">
                      ₹{comparison?.wholesale?.total_revenue?.toLocaleString('en-IN') || '0'}
                    </div>
                    <div className="text-[11px] text-slate-500 mt-1">
                      {comparison?.wholesale?.order_count || 0} orders &bull; AOV: ₹
                      {comparison?.wholesale?.aov?.toFixed(0) || '0'}
                    </div>
                  </div>
                </div>
              </div>

              {/* Repeat Customer Rate */}
              <div className="mt-6 pt-4 border-t border-slate-100">
                <div className="flex items-center justify-between text-xs">
                  <span className="text-slate-500">B2B Repeat Order Rate</span>
                  <span className="font-bold text-slate-900">
                    {comparison?.wholesale?.repeat_rate || 0}%
                  </span>
                </div>
                <div className="flex items-center justify-between text-xs mt-1.5">
                  <span className="text-slate-500">B2C Distinct Buyers</span>
                  <span className="font-bold text-slate-900">
                    {comparison?.retail?.distinct_customers || 0}
                  </span>
                </div>
              </div>
            </div>
          </div>

          {/* 4. Best-Selling Products & Recent Orders Grid */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Top Products */}
            <div className="bg-white p-6 rounded-2xl border border-slate-200/80 shadow-xs">
              <div className="flex items-center justify-between mb-4">
                <div>
                  <h3 className="text-base font-bold text-slate-900">Best-Selling Kerala Snacks</h3>
                  <p className="text-xs text-slate-500 mt-0.5">Top revenue contributors this period</p>
                </div>
                <Link
                  href="/admin/inventory"
                  className="text-xs font-bold text-emerald-700 hover:text-emerald-800 transition"
                >
                  View Inventory &rarr;
                </Link>
              </div>

              {productsData?.best_selling?.length === 0 ? (
                <div className="py-12 text-center text-xs text-slate-400">
                  No sales recorded for this period yet.
                </div>
              ) : (
                <div className="divide-y divide-slate-100">
                  {productsData?.best_selling?.slice(0, 5).map((item, idx) => (
                    <div key={item.sku} className="py-3 flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <div className="w-6 h-6 rounded-full bg-slate-100 text-slate-700 flex items-center justify-center font-bold text-xs">
                          {idx + 1}
                        </div>
                        <div>
                          <div className="text-xs font-bold text-slate-900">
                            {item.product_name}
                          </div>
                          <div className="text-[11px] text-slate-400">
                            {item.sku} &bull; Pack: {item.package_size}
                          </div>
                        </div>
                      </div>
                      <div className="text-right">
                        <div className="text-xs font-black text-slate-900">
                          ₹{item.total_revenue.toLocaleString('en-IN')}
                        </div>
                        <div className="text-[11px] text-slate-500">
                          {item.total_units} units sold
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* Recent Orders */}
            <div className="bg-white p-6 rounded-2xl border border-slate-200/80 shadow-xs">
              <div className="flex items-center justify-between mb-4">
                <div>
                  <h3 className="text-base font-bold text-slate-900">Recent Customer Orders</h3>
                  <p className="text-xs text-slate-500 mt-0.5">Latest retail and wholesale activity</p>
                </div>
                <Link
                  href="/admin/orders"
                  className="text-xs font-bold text-emerald-700 hover:text-emerald-800 transition"
                >
                  All Orders &rarr;
                </Link>
              </div>

              {summary?.recent_orders?.length === 0 ? (
                <div className="py-12 text-center text-xs text-slate-400">
                  No orders placed yet.
                </div>
              ) : (
                <div className="divide-y divide-slate-100">
                  {summary?.recent_orders?.map((ord) => (
                    <div key={ord.order_number} className="py-3 flex items-center justify-between">
                      <div>
                        <div className="flex items-center gap-2">
                          <span className="text-xs font-bold text-slate-900">
                            {ord.order_number}
                          </span>
                          <span
                            className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${
                              ord.customer_type === 'business'
                                ? 'bg-purple-100 text-purple-800'
                                : 'bg-emerald-100 text-emerald-800'
                            }`}
                          >
                            {ord.customer_type === 'business' ? 'Wholesale' : 'Retail'}
                          </span>
                        </div>
                        <div className="text-[11px] text-slate-500 mt-0.5">
                          {ord.customer_name || ord.customer_email}
                        </div>
                      </div>
                      <div className="text-right">
                        <div className="text-xs font-black text-slate-900">
                          ₹{ord.total_amount.toLocaleString('en-IN', { minimumFractionDigits: 2 })}
                        </div>
                        <span
                          className={`inline-block text-[10px] font-bold px-2 py-0.5 rounded-md mt-0.5 ${
                            ord.order_status === 'delivered'
                              ? 'bg-emerald-50 text-emerald-700'
                              : ord.order_status === 'cancelled'
                              ? 'bg-red-50 text-red-700'
                              : 'bg-amber-50 text-amber-700'
                          }`}
                        >
                          {ord.order_status_display}
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </AdminLayout>
  );
}


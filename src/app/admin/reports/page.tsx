'use client';

import React, { useState } from 'react';
import AdminLayout from '@/components/AdminLayout';
import { getReportExportUrl } from '@/lib/api';

export default function AdminReportsPage() {
  const [format, setFormat] = useState<'csv' | 'excel'>('excel');
  const [period, setPeriod] = useState<string>('this_month');

  const reportTypes = [
    {
      id: 'sales',
      title: 'Sales & Revenue Report',
      description: 'Comprehensive financial breakdown by order: gross order value, discounts, GST breakdown (CGST/SGST/IGST), delivery fees, and net revenue.',
      icon: '💰',
      tag: 'Finance & Tax',
    },
    {
      id: 'orders',
      title: 'Order Fulfillment Report',
      description: 'Detailed logistics and shipping report: customer shipping addresses, delivery districts, fulfillment status, and order totals.',
      icon: '📦',
      tag: 'Operations',
    },
    {
      id: 'customers',
      title: 'Customer Directory & Accounts',
      description: 'Directory of all retail and wholesale customer accounts, business names, GSTIN, wholesale approval states, and contact numbers.',
      icon: '👥',
      tag: 'CRM',
    },
    {
      id: 'inventory',
      title: 'Inventory & Stock Balance',
      description: 'Real-time stock ledger across all snack packages: quantity on hand, reserved quantities, available-to-sell, and low-stock alerts.',
      icon: '📊',
      tag: 'Warehouse',
    },
    {
      id: 'products',
      title: 'Product Performance & SKUs',
      description: 'Volume and revenue generated per product variant, package size comparisons, and warehouse stock turnover.',
      icon: '🏷️',
      tag: 'Merchandising',
    },
  ];

  return (
    <AdminLayout
      title="Data Reports & Business Export"
      subtitle="Download structured CSV and Microsoft Excel (.xlsx) reports for accounting, auditing, and logistics."
    >
      <div className="space-y-6">
        {/* Export Configuration Controls */}
        <div className="bg-white p-6 rounded-2xl border border-slate-200/80 shadow-xs flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div>
            <h3 className="text-sm font-bold text-slate-900">Export Parameters</h3>
            <p className="text-xs text-slate-500 mt-0.5">Select time period and output document format</p>
          </div>

          <div className="flex items-center gap-3 flex-wrap">
            {/* Period Selector */}
            <select
              value={period}
              onChange={(e) => setPeriod(e.target.value)}
              className="px-3 py-2 text-xs rounded-xl border border-slate-200 bg-white font-medium text-slate-700"
            >
              <option value="today">Today</option>
              <option value="7days">Last 7 Days</option>
              <option value="30days">Last 30 Days</option>
              <option value="this_month">This Month</option>
              <option value="last_month">Last Month</option>
              <option value="this_year">This Year</option>
              <option value="all">All Time</option>
            </select>

            {/* Format Toggle */}
            <div className="inline-flex bg-slate-100 p-1 rounded-xl text-xs font-semibold">
              <button
                onClick={() => setFormat('excel')}
                className={`px-3 py-1.5 rounded-lg transition flex items-center gap-1.5 ${
                  format === 'excel'
                    ? 'bg-white text-slate-900 font-bold shadow-xs'
                    : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                <span>📊</span> Excel (.xlsx)
              </button>
              <button
                onClick={() => setFormat('csv')}
                className={`px-3 py-1.5 rounded-lg transition flex items-center gap-1.5 ${
                  format === 'csv'
                    ? 'bg-white text-slate-900 font-bold shadow-xs'
                    : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                <span>📄</span> CSV
              </button>
            </div>
          </div>
        </div>

        {/* Report Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
          {reportTypes.map((rep) => {
            const downloadUrl = getReportExportUrl(rep.id, format, period);
            return (
              <div
                key={rep.id}
                className="bg-white p-6 rounded-2xl border border-slate-200/80 shadow-xs flex flex-col justify-between hover:border-emerald-300 transition"
              >
                <div>
                  <div className="flex items-center justify-between mb-3">
                    <span className="text-2xl p-2 bg-slate-50 rounded-xl">{rep.icon}</span>
                    <span className="text-[10px] font-bold text-slate-500 bg-slate-100 px-2.5 py-0.5 rounded-full uppercase tracking-wider">
                      {rep.tag}
                    </span>
                  </div>

                  <h4 className="text-base font-bold text-slate-900">{rep.title}</h4>
                  <p className="text-xs text-slate-500 mt-2 leading-relaxed">
                    {rep.description}
                  </p>
                </div>

                <div className="mt-6 pt-4 border-t border-slate-100 flex items-center justify-between">
                  <span className="text-[11px] text-slate-400 font-semibold">
                    Format: {format === 'excel' ? 'Excel Spreadsheet' : 'Comma Separated'}
                  </span>
                  <a
                    href={downloadUrl}
                    download
                    className="inline-flex items-center gap-1.5 px-3.5 py-2 bg-[#093725] text-amber-300 hover:bg-[#062519] rounded-xl text-xs font-bold transition shadow-xs"
                  >
                    <span>📥</span> Download
                  </a>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </AdminLayout>
  );
}


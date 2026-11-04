'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import { useAuth } from '@/context/AuthContext';
import { apiGetOrders } from '@/lib/api';
import { OrderSummary } from '@/types/api';

export default function CustomerOrdersPage() {
  const { user } = useAuth();
  const [orders, setOrders] = useState<OrderSummary[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [statusFilter, setStatusFilter] = useState<string>('all');

  useEffect(() => {
    if (user) {
      apiGetOrders().then((res) => {
        if (res.data) {
          setOrders(res.data);
        } else {
          setError(res.error || 'Failed to load orders.');
        }
        setLoading(false);
      });
    }
  }, [user]);

  const filteredOrders = orders.filter((o) => {
    if (statusFilter === 'all') return true;
    return o.order_status === statusFilter;
  });

  const getStatusColor = (st: string) => {
    switch (st) {
      case 'pending':
        return 'bg-amber-100 text-amber-800 border-amber-300';
      case 'confirmed':
        return 'bg-blue-100 text-blue-800 border-blue-300';
      case 'processing':
        return 'bg-purple-100 text-purple-800 border-purple-300';
      case 'ready_for_dispatch':
        return 'bg-teal-100 text-teal-800 border-teal-300';
      case 'dispatched':
        return 'bg-indigo-100 text-indigo-800 border-indigo-300';
      case 'delivered':
        return 'bg-emerald-100 text-emerald-800 border-emerald-300';
      case 'cancelled':
        return 'bg-red-100 text-red-800 border-red-300';
      default:
        return 'bg-stone-100 text-stone-800 border-stone-300';
    }
  };

  const getPaymentColor = (pst: string) => {
    switch (pst) {
      case 'paid':
        return 'bg-emerald-50 text-emerald-700 border-emerald-200';
      case 'pending':
        return 'bg-amber-50 text-amber-700 border-amber-200';
      case 'failed':
        return 'bg-red-50 text-red-700 border-red-200';
      default:
        return 'bg-stone-50 text-stone-700 border-stone-200';
    }
  };

  return (
    <div className="min-h-screen bg-[#fbf8f1] flex flex-col justify-between text-[#1c2621]">
      <Navbar />

      <main className="flex-1 py-10 sm:py-16 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 w-full">
        {/* Navigation Breadcrumb */}
        <nav className="flex items-center gap-2 text-xs text-stone-500 mb-4">
          <Link href="/account" className="hover:text-[#093725]">
            Account Overview
          </Link>
          <span>/</span>
          <span className="text-stone-800 font-bold">Order History</span>
        </nav>

        {/* Page Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8">
          <div>
            <h1 className="text-3xl font-black text-[#093725] tracking-tight">
              My Orders & Invoices
            </h1>
            <p className="text-sm text-stone-600 mt-1">
              Track order production, dispatch, and download historical itemized bills.
            </p>
          </div>

          <div className="flex items-center gap-2 text-xs">
            <Link
              href="/account/profile"
              className="px-3.5 py-2 rounded-xl bg-white border border-stone-200 text-stone-700 hover:bg-stone-50 transition font-medium"
            >
              Profile
            </Link>
            <Link
              href="/account/addresses"
              className="px-3.5 py-2 rounded-xl bg-white border border-stone-200 text-stone-700 hover:bg-stone-50 transition font-medium"
            >
              Addresses
            </Link>
          </div>
        </div>

        {/* Status Filters */}
        <div className="flex flex-wrap items-center gap-2 mb-6">
          {[
            { id: 'all', label: 'All Orders' },
            { id: 'pending', label: 'Pending' },
            { id: 'confirmed', label: 'Confirmed' },
            { id: 'processing', label: 'Processing' },
            { id: 'dispatched', label: 'Dispatched' },
            { id: 'delivered', label: 'Delivered' },
            { id: 'cancelled', label: 'Cancelled' },
          ].map((tab) => (
            <button
              key={tab.id}
              onClick={() => setStatusFilter(tab.id)}
              className={`px-3.5 py-1.5 rounded-full text-xs font-bold transition cursor-pointer ${statusFilter === tab.id
                  ? 'bg-[#093725] text-white shadow-xs'
                  : 'bg-white text-stone-600 border border-stone-200 hover:bg-stone-50'
                }`}
            >
              {tab.label}
            </button>
          ))}
        </div>

        {/* Orders Listing */}
        {loading ? (
          <div className="py-20 text-center text-xs text-stone-400">Loading your orders...</div>
        ) : error ? (
          <div className="p-4 rounded-2xl bg-red-50 border border-red-300 text-red-900 text-sm">
            {error}
          </div>
        ) : filteredOrders.length === 0 ? (
          <div className="text-center py-16 bg-white rounded-3xl border border-stone-200/80 p-8 shadow-xs max-w-md mx-auto">
            <span className="text-4xl block mb-2">📦</span>
            <h2 className="text-lg font-black text-stone-900">No Orders Found</h2>
            <p className="text-xs text-stone-600 mt-1 mb-6">
              {statusFilter === 'all'
                ? "You haven't placed any orders with OnFresh yet."
                : `No orders matching filter '${statusFilter}'.`}
            </p>
            <Link
              href="/products"
              className="px-6 py-3 rounded-full text-xs font-bold uppercase tracking-wider text-emerald-950 bg-gradient-to-r from-amber-400 to-amber-500 hover:from-amber-300 hover:to-amber-400 shadow-md inline-block"
            >
              Start Ordering Snacks →
            </Link>
          </div>
        ) : (
          <div className="space-y-4">
            {filteredOrders.map((ord) => (
              <div
                key={ord.id}
                className="bg-white rounded-3xl border border-stone-200/80 p-6 shadow-xs hover:border-emerald-300 transition flex flex-col sm:flex-row sm:items-center justify-between gap-4"
              >
                <div>
                  <div className="flex flex-wrap items-center gap-2 mb-1.5">
                    <span className="text-base font-black text-[#093725] font-mono">
                      {ord.order_number}
                    </span>
                    <span
                      className={`text-[10px] font-bold uppercase px-2 py-0.5 rounded border ${getStatusColor(
                        ord.order_status
                      )}`}
                    >
                      {ord.order_status_display}
                    </span>
                    <span
                      className={`text-[10px] font-bold uppercase px-2 py-0.5 rounded border ${getPaymentColor(
                        ord.payment_status
                      )}`}
                    >
                      Payment: {ord.payment_status_display}
                    </span>
                    <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-stone-100 text-stone-700">
                      {ord.customer_type === 'business' ? 'Wholesale B2B' : 'Retail B2C'}
                    </span>
                  </div>

                  <div className="text-xs text-stone-500 flex flex-wrap items-center gap-3">
                    <span>Placed on {new Date(ord.created_at).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' })}</span>
                    <span>•</span>
                    <span>{ord.items_count} package(s)</span>
                    <span>•</span>
                    <span>Via {ord.payment_method_display}</span>
                  </div>
                </div>

                <div className="flex items-center justify-between sm:justify-end gap-6 pt-3 sm:pt-0 border-t sm:border-0 border-stone-100">
                  <div className="text-left sm:text-right">
                    <span className="text-[10px] uppercase font-bold text-stone-400 block">
                      Total Amount
                    </span>
                    <span className="text-xl font-black text-[#093725]">
                      ₹{Number(ord.total_amount).toFixed(2)}
                    </span>
                  </div>

                  <Link
                    href={`/account/orders/${encodeURIComponent(ord.order_number)}`}
                    className="px-4 py-2.5 rounded-xl text-xs font-bold bg-[#093725] text-white hover:bg-[#062619] transition"
                  >
                    View Details →
                  </Link>
                </div>
              </div>
            ))}
          </div>
        )}
      </main>

      <Footer />
    </div>
  );
}

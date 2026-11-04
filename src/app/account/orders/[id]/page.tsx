'use client';

import React, { useState, useEffect, useCallback, Suspense } from 'react';
import Link from 'next/link';
import { useParams } from 'next/navigation';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import { apiGetOrder, apiCancelOrder, getOrderInvoicePDFUrl } from '@/lib/api';
import { OrderDetail } from '@/types/api';

function OrderDetailContent() {
  const params = useParams();
  const orderNumber = (params?.id as string) || '';

  const [order, setOrder] = useState<OrderDetail | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [cancelling, setCancelling] = useState(false);
  const [cancelMessage, setCancelMessage] = useState<string | null>(null);

  const fetchOrder = useCallback(() => {
    if (orderNumber) {
      setLoading(true);
      apiGetOrder(orderNumber).then((res) => {
        if (res.data) {
          setOrder(res.data);
          setError(null);
        } else {
          setError(res.error || 'Failed to load order.');
        }
        setLoading(false);
      });
    }
  }, [orderNumber]);

  useEffect(() => {
    fetchOrder();
  }, [fetchOrder]);

  const handleCancel = async () => {
    if (!order) return;
    if (!confirm('Are you sure you want to cancel this order?')) return;

    setCancelling(true);
    const res = await apiCancelOrder(order.order_number, 'Customer cancelled via account dashboard.');
    setCancelling(false);

    if (res.success) {
      setCancelMessage('Order has been successfully cancelled.');
      fetchOrder();
    } else {
      alert(res.message);
    }
  };

  const statusSteps = [
    { key: 'pending', label: 'Order Placed' },
    { key: 'confirmed', label: 'Confirmed' },
    { key: 'processing', label: 'In Kitchen / Production' },
    { key: 'ready_for_dispatch', label: 'Packed' },
    { key: 'dispatched', label: 'Dispatched' },
    { key: 'delivered', label: 'Delivered' },
  ];

  const getStepIndex = (status: string) => {
    switch (status) {
      case 'pending':
        return 0;
      case 'confirmed':
        return 1;
      case 'processing':
        return 2;
      case 'ready_for_dispatch':
        return 3;
      case 'dispatched':
        return 4;
      case 'delivered':
        return 5;
      case 'cancelled':
        return -1;
      default:
        return 0;
    }
  };

  const currentStep = order ? getStepIndex(order.order_status) : 0;

  if (loading) {
    return (
      <div className="min-h-screen bg-[#fbf8f1] flex flex-col justify-between text-[#1c2621]">
        <Navbar />
        <div className="flex-1 flex items-center justify-center py-20 text-xs text-stone-400">
          Loading order details...
        </div>
        <Footer />
      </div>
    );
  }

  if (error || !order) {
    return (
      <div className="min-h-screen bg-[#fbf8f1] flex flex-col justify-between text-[#1c2621]">
        <Navbar />
        <main className="flex-1 py-16 max-w-xl mx-auto px-4 w-full text-center">
          <div className="bg-white rounded-3xl border border-stone-200 p-8 shadow-xs">
            <span className="text-4xl block mb-2">⚠️</span>
            <h1 className="text-xl font-bold text-stone-900">Order Not Found</h1>
            <p className="text-xs text-stone-600 mt-2 mb-6">
              {error || `Could not find order ${orderNumber}.`}
            </p>
            <Link
              href="/account/orders"
              className="px-6 py-2.5 rounded-full text-xs font-bold bg-[#093725] text-white"
            >
              Back to Orders
            </Link>
          </div>
        </main>
        <Footer />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#fbf8f1] flex flex-col justify-between text-[#1c2621]">
      <Navbar />

      <main className="flex-1 py-10 sm:py-16 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 w-full">
        {/* Navigation Breadcrumb */}
        <nav className="flex items-center gap-2 text-xs text-stone-500 mb-6">
          <Link href="/account" className="hover:text-[#093725]">
            Account
          </Link>
          <span>/</span>
          <Link href="/account/orders" className="hover:text-[#093725]">
            Orders
          </Link>
          <span>/</span>
          <span className="text-stone-800 font-bold font-mono">{order.order_number}</span>
        </nav>

        {cancelMessage && (
          <div className="mb-6 p-4 rounded-2xl bg-amber-50 border border-amber-300 text-amber-900 text-xs">
            {cancelMessage}
          </div>
        )}

        {/* Order Header Card */}
        <div className="bg-white rounded-3xl border border-stone-200/80 p-6 sm:p-8 shadow-xs mb-8 flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div>
            <div className="flex flex-wrap items-center gap-2 mb-2">
              <span className="text-2xl sm:text-3xl font-black text-[#093725] font-mono">
                {order.order_number}
              </span>
              <span className="text-xs font-bold px-3 py-1 rounded-full bg-stone-100 text-stone-800 border border-stone-200">
                {order.customer_type === 'business' ? 'Wholesale Order' : 'Retail Order'}
              </span>
              <span className="text-xs font-bold px-3 py-1 rounded-full bg-emerald-100 text-emerald-800 border border-emerald-300">
                {order.order_status_display}
              </span>
            </div>
            <p className="text-xs text-stone-500">
              Placed on {new Date(order.created_at).toLocaleString('en-IN', { dateStyle: 'long', timeStyle: 'short' })}
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-3">
            <a
              href={getOrderInvoicePDFUrl(order.order_number)}
              download
              className="px-4 py-2.5 rounded-xl border border-emerald-300 bg-emerald-50 hover:bg-emerald-100 text-xs font-bold text-emerald-800 transition flex items-center gap-1.5"
            >
              <span>📥</span> Download PDF Invoice
            </a>
            <button
              onClick={() => window.print()}
              className="px-4 py-2.5 rounded-xl border border-stone-300 bg-white hover:bg-stone-50 text-xs font-bold text-stone-700 transition"
            >
              🖨️ Print Invoice
            </button>
            {order.can_cancel && (
              <button
                onClick={handleCancel}
                disabled={cancelling}
                className="px-4 py-2.5 rounded-xl border border-red-300 bg-red-50 hover:bg-red-100 text-xs font-bold text-red-700 transition disabled:opacity-50"
              >
                {cancelling ? 'Cancelling...' : 'Cancel Order'}
              </button>
            )}
          </div>
        </div>

        {/* Order Lifecycle Progress Tracker */}
        {order.order_status !== 'cancelled' ? (
          <div className="bg-white rounded-3xl border border-stone-200/80 p-6 sm:p-8 shadow-xs mb-8">
            <h2 className="text-xs font-bold uppercase tracking-wider text-stone-500 mb-6">
              Order Fulfillment Progress
            </h2>
            <div className="relative">
              {/* Progress Line */}
              <div className="hidden sm:block absolute top-1/2 left-0 right-0 h-1 bg-stone-200 -translate-y-1/2 z-0">
                <div
                  className="h-1 bg-[#093725] transition-all duration-500"
                  style={{ width: `${(Math.max(0, currentStep) / (statusSteps.length - 1)) * 100}%` }}
                />
              </div>

              {/* Progress Nodes */}
              <div className="grid grid-cols-2 sm:grid-cols-6 gap-4 relative z-10">
                {statusSteps.map((step, idx) => {
                  const isDone = idx <= currentStep;
                  const isCurrent = idx === currentStep;

                  return (
                    <div key={step.key} className="flex flex-col items-center text-center">
                      <div
                        className={`w-9 h-9 rounded-full flex items-center justify-center font-bold text-xs transition-all shadow-sm ${isDone
                            ? 'bg-[#093725] text-amber-300'
                            : 'bg-white border-2 border-stone-300 text-stone-400'
                          } ${isCurrent ? 'ring-4 ring-amber-400/50' : ''}`}
                      >
                        {isDone ? '✓' : idx + 1}
                      </div>
                      <span
                        className={`text-[11px] font-bold mt-2 ${isDone ? 'text-stone-900' : 'text-stone-400'
                          }`}
                      >
                        {step.label}
                      </span>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>
        ) : (
          <div className="p-4 rounded-2xl bg-red-50 border border-red-300 text-red-900 text-xs mb-8">
            ⚠️ This order was cancelled.
          </div>
        )}

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          {/* Order Items List */}
          <div className="lg:col-span-8 space-y-6">
            <div className="bg-white rounded-3xl border border-stone-200/80 p-6 shadow-xs space-y-4">
              <h2 className="text-base font-black text-stone-900 border-b border-stone-100 pb-3">
                Items in This Order ({order.items.length})
              </h2>

              <div className="divide-y divide-stone-100">
                {order.items.map((item) => (
                  <div key={item.id} className="py-4 flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs">
                    <div>
                      <div className="font-bold text-stone-900 text-sm">{item.product_name}</div>
                      <div className="flex flex-wrap items-center gap-2 mt-1">
                        <span className="px-2 py-0.5 rounded bg-stone-100 text-stone-800 font-semibold">
                          {item.display_weight}
                        </span>
                        <span className="font-mono text-stone-400">SKU: {item.sku}</span>
                        {item.pricing_rule_applied && (
                          <span className="px-2 py-0.5 rounded bg-emerald-50 text-emerald-800 border border-emerald-200">
                            {item.pricing_rule_applied}
                          </span>
                        )}
                      </div>
                    </div>

                    <div className="text-left sm:text-right">
                      <div className="font-black text-sm text-[#093725]">
                        ₹{Number(item.line_total).toFixed(2)}
                      </div>
                      <div className="text-[11px] text-stone-500">
                        {item.quantity} × ₹{Number(item.unit_price).toFixed(2)}
                      </div>
                      {Number(item.discount_amount) > 0 && (
                        <div className="text-[10px] text-emerald-700 font-bold">
                          Discount: -₹{Number(item.discount_amount).toFixed(2)}
                        </div>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Address Snapshots */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="bg-white rounded-3xl border border-stone-200/80 p-6 shadow-xs text-xs space-y-2">
                <span className="font-bold uppercase tracking-wider text-stone-400 block">
                  📍 Shipping Address Snapshot
                </span>
                <p className="font-bold text-stone-900 text-sm">
                  {order.shipping_address_snapshot.recipient_name}
                </p>
                <p className="text-stone-600">
                  Phone: {order.shipping_address_snapshot.phone_number}
                </p>
                <p className="text-stone-600">
                  {order.shipping_address_snapshot.address_line_1}
                  {order.shipping_address_snapshot.address_line_2
                    ? `, ${order.shipping_address_snapshot.address_line_2}`
                    : ''}
                </p>
                <p className="text-stone-500">
                  {order.shipping_address_snapshot.city}, {order.shipping_address_snapshot.district} —{' '}
                  {order.shipping_address_snapshot.pincode}
                </p>
              </div>

              <div className="bg-white rounded-3xl border border-stone-200/80 p-6 shadow-xs text-xs space-y-2">
                <span className="font-bold uppercase tracking-wider text-stone-400 block">
                  🏢 Billing Address Snapshot
                </span>
                <p className="font-bold text-stone-900 text-sm">
                  {order.billing_address_snapshot.recipient_name}
                </p>
                <p className="text-stone-600">
                  Phone: {order.billing_address_snapshot.phone_number}
                </p>
                <p className="text-stone-600">
                  {order.billing_address_snapshot.address_line_1}
                  {order.billing_address_snapshot.address_line_2
                    ? `, ${order.billing_address_snapshot.address_line_2}`
                    : ''}
                </p>
                <p className="text-stone-500">
                  {order.billing_address_snapshot.city}, {order.billing_address_snapshot.district} —{' '}
                  {order.billing_address_snapshot.pincode}
                </p>
              </div>
            </div>

            {/* Status History Audit Log */}
            {order.status_history && order.status_history.length > 0 && (
              <div className="bg-white rounded-3xl border border-stone-200/80 p-6 shadow-xs space-y-3">
                <h3 className="font-black text-sm text-stone-900 border-b border-stone-100 pb-2">
                  Order Status Audit Trail
                </h3>
                <div className="space-y-2 text-xs">
                  {order.status_history.map((hist) => (
                    <div key={hist.id} className="flex items-start justify-between gap-4 py-1">
                      <div>
                        <span className="font-bold text-stone-800 capitalize">
                          {hist.new_status.replace(/_/g, ' ')}
                        </span>
                        {hist.notes && (
                          <p className="text-stone-500 text-[11px] mt-0.5">{hist.notes}</p>
                        )}
                      </div>
                      <span className="text-[10px] text-stone-400 font-mono flex-shrink-0">
                        {new Date(hist.created_at).toLocaleString('en-IN', { dateStyle: 'short', timeStyle: 'short' })}
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* Right Summary Sidebar */}
          <div className="lg:col-span-4 space-y-6">
            <div className="bg-white rounded-3xl border border-stone-200/80 p-6 shadow-xs space-y-4">
              <h2 className="text-base font-black text-stone-900 border-b border-stone-100 pb-3">
                Payment & Totals
              </h2>

              <div className="space-y-2.5 text-xs">
                <div className="flex justify-between text-stone-600">
                  <span>Subtotal:</span>
                  <span className="font-semibold text-stone-900">₹{order.subtotal}</span>
                </div>

                {Number(order.discount_amount) > 0 && (
                  <div className="flex justify-between text-emerald-700">
                    <span>Wholesale Savings:</span>
                    <span className="font-bold">-₹{order.discount_amount}</span>
                  </div>
                )}

                <div className="flex justify-between text-stone-600">
                  <span>Delivery Charge:</span>
                  <span className="font-semibold text-stone-900">
                    {Number(order.delivery_charge) === 0 ? 'FREE' : `₹${order.delivery_charge}`}
                  </span>
                </div>

                <div className="border-t border-stone-200 pt-3 flex justify-between items-center">
                  <span className="text-base font-bold text-stone-900">Total Paid/Payable:</span>
                  <span className="text-2xl font-black text-[#093725]">₹{order.total_amount}</span>
                </div>
              </div>

              <div className="pt-3 border-t border-stone-100 space-y-2 text-xs">
                <div className="flex justify-between">
                  <span className="text-stone-500">Method:</span>
                  <span className="font-bold text-stone-800">{order.payment_method_display}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-stone-500">Payment Status:</span>
                  <span className="font-bold uppercase text-stone-800">
                    {order.payment_status_display}
                  </span>
                </div>
              </div>

              {/* Bank Transfer Instructions reminder */}
              {order.payment_method === 'bank_transfer' && order.payment_status !== 'paid' && (
                <div className="mt-4 p-3.5 rounded-xl bg-amber-50 border border-amber-200 text-xs text-amber-950 space-y-1">
                  <span className="font-bold block">SBI Vandiperiyar Bank Transfer:</span>
                  <p className="text-[11px]">
                    A/C: 39485720192 | IFSC: SBIN0070123. Quote <strong>{order.order_number}</strong>.
                  </p>
                </div>
              )}
            </div>

            {order.customer_notes && (
              <div className="bg-white rounded-3xl border border-stone-200/80 p-6 shadow-xs text-xs space-y-1">
                <span className="font-bold uppercase tracking-wider text-stone-400 block">
                  Customer Instructions
                </span>
                <p className="text-stone-700">{order.customer_notes}</p>
              </div>
            )}
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}

export default function OrderDetailPage() {
  return (
    <Suspense
      fallback={
        <div className="min-h-screen bg-[#fbf8f1] flex flex-col justify-between text-[#1c2621]">
          <Navbar />
          <div className="flex-1 flex items-center justify-center py-20 text-xs text-stone-400">
            Loading order details...
          </div>
          <Footer />
        </div>
      }
    >
      <OrderDetailContent />
    </Suspense>
  );
}

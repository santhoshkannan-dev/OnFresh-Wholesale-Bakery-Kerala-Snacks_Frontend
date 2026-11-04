'use client';

import React, { useState, useEffect, useCallback } from 'react';
import AdminLayout from '@/components/AdminLayout';
import {
  apiGetAdminOrders,
  apiGetOrderDetail,
  apiUpdateOrderStatus,
  getOrderInvoicePDFUrl,
} from '@/lib/api';
import { OrderSummary, OrderDetail } from '@/types/api';

const VALID_TRANSITIONS: Record<string, string[]> = {
  pending: ['confirmed', 'cancelled'],
  confirmed: ['processing', 'cancelled'],
  processing: ['ready_for_dispatch', 'cancelled'],
  ready_for_dispatch: ['dispatched', 'cancelled'],
  dispatched: ['delivered'],
  delivered: [],
  cancelled: [],
};

export default function AdminOrdersPage() {
  const [orders, setOrders] = useState<OrderSummary[]>([]);
  const [totalCount, setTotalCount] = useState(0);
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(1);

  // Filters
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState('');
  const [paymentFilter, setPaymentFilter] = useState('');
  const [typeFilter, setTypeFilter] = useState('');

  // Selected Order for Detail / Status Update
  const [selectedOrderNumber, setSelectedOrderNumber] = useState<string | null>(null);
  const [detailOrder, setDetailOrder] = useState<OrderDetail | null>(null);
  const [detailLoading, setDetailLoading] = useState(false);

  // Status Update Modal State
  const [updateModalOpen, setUpdateModalOpen] = useState(false);
  const [newStatus, setNewStatus] = useState('');
  const [newPaymentStatus, setNewPaymentStatus] = useState('');
  const [adminNotes, setAdminNotes] = useState('');
  const [updating, setUpdating] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');

  const loadOrders = useCallback(async () => {
    setLoading(true);
    try {
      const res = await apiGetAdminOrders({
        order_status: statusFilter || undefined,
        payment_status: paymentFilter || undefined,
        customer_type: typeFilter || undefined,
        search: search || undefined,
        page,
      });
      if (res.data) {
        setOrders(res.data.results || []);
        setTotalCount(res.data.count || 0);
      }
    } catch (err) {
      console.error('Failed to load orders', err);
    } finally {
      setLoading(false);
    }
  }, [statusFilter, paymentFilter, typeFilter, search, page]);

  useEffect(() => {
    loadOrders();
  }, [loadOrders]);

  const openOrderDetail = async (orderNumber: string) => {
    setSelectedOrderNumber(orderNumber);
    setDetailLoading(true);
    const res = await apiGetOrderDetail(orderNumber);
    if (res.data) {
      setDetailOrder(res.data);
    }
    setDetailLoading(false);
  };

  const openStatusModal = (ord: OrderSummary) => {
    setSelectedOrderNumber(ord.order_number);
    setNewStatus('');
    setNewPaymentStatus(ord.payment_status);
    setAdminNotes('');
    setErrorMsg('');
    setUpdateModalOpen(true);
  };

  const handleStatusUpdate = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedOrderNumber) return;

    setUpdating(true);
    setErrorMsg('');

    const payload: { order_status?: string; payment_status?: string; admin_notes?: string } = {};
    if (newStatus) payload.order_status = newStatus;
    if (newPaymentStatus) payload.payment_status = newPaymentStatus;
    if (adminNotes) payload.admin_notes = adminNotes;

    const res = await apiUpdateOrderStatus(selectedOrderNumber, payload);
    setUpdating(false);

    if (res.success) {
      setUpdateModalOpen(false);
      loadOrders();
      if (detailOrder && detailOrder.order_number === selectedOrderNumber) {
        openOrderDetail(selectedOrderNumber);
      }
    } else {
      setErrorMsg(res.message || 'Status update failed.');
    }
  };

  return (
    <AdminLayout
      title="Order Management"
      subtitle="Track, process, and update retail (B2C) and wholesale (B2B) orders."
      actions={
        <div className="text-xs font-semibold text-slate-500">
          Total Orders: <span className="font-bold text-slate-900">{totalCount}</span>
        </div>
      }
    >
      <div className="space-y-6">
        {/* 1. Filter and Search Bar */}
        <div className="bg-white p-4 rounded-2xl border border-slate-200/80 shadow-xs flex flex-wrap items-center justify-between gap-3">
          <div className="flex-1 min-w-[240px]">
            <input
              type="text"
              placeholder="Search by order number, customer name, email, phone..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full px-3.5 py-2 text-xs rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500"
            />
          </div>

          <div className="flex items-center gap-2 flex-wrap">
            {/* Customer Type Filter */}
            <select
              value={typeFilter}
              onChange={(e) => {
                setTypeFilter(e.target.value);
                setPage(1);
              }}
              className="px-3 py-2 text-xs rounded-xl border border-slate-200 bg-white font-medium text-slate-700"
            >
              <option value="">All Segments</option>
              <option value="individual">Retail (B2C)</option>
              <option value="business">Wholesale (B2B)</option>
            </select>

            {/* Order Status Filter */}
            <select
              value={statusFilter}
              onChange={(e) => {
                setStatusFilter(e.target.value);
                setPage(1);
              }}
              className="px-3 py-2 text-xs rounded-xl border border-slate-200 bg-white font-medium text-slate-700"
            >
              <option value="">All Order Statuses</option>
              <option value="pending">Pending</option>
              <option value="confirmed">Confirmed</option>
              <option value="processing">Processing</option>
              <option value="ready_for_dispatch">Ready for Dispatch</option>
              <option value="dispatched">Dispatched</option>
              <option value="delivered">Delivered</option>
              <option value="cancelled">Cancelled</option>
            </select>

            {/* Payment Status Filter */}
            <select
              value={paymentFilter}
              onChange={(e) => {
                setPaymentFilter(e.target.value);
                setPage(1);
              }}
              className="px-3 py-2 text-xs rounded-xl border border-slate-200 bg-white font-medium text-slate-700"
            >
              <option value="">All Payment Statuses</option>
              <option value="pending">Pending Payment</option>
              <option value="partially_paid">Partially Paid</option>
              <option value="paid">Paid</option>
              <option value="failed">Failed</option>
              <option value="refunded">Refunded</option>
            </select>
          </div>
        </div>

        {/* 2. Orders Table */}
        <div className="bg-white rounded-2xl border border-slate-200/80 shadow-xs overflow-hidden">
          {loading ? (
            <div className="py-20 text-center text-xs font-semibold text-slate-500">
              Loading orders...
            </div>
          ) : orders.length === 0 ? (
            <div className="py-16 text-center text-xs font-semibold text-slate-400">
              No orders found matching the selected filters.
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs">
                <thead className="bg-slate-50 border-b border-slate-200 text-slate-500 font-bold uppercase tracking-wider">
                  <tr>
                    <th className="py-3.5 px-4">Order #</th>
                    <th className="py-3.5 px-4">Customer</th>
                    <th className="py-3.5 px-4">Segment</th>
                    <th className="py-3.5 px-4">Order Status</th>
                    <th className="py-3.5 px-4">Payment</th>
                    <th className="py-3.5 px-4 text-right">Amount (₹)</th>
                    <th className="py-3.5 px-4 text-center">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {orders.map((ord) => (
                    <tr key={ord.order_number} className="hover:bg-slate-50/70 transition">
                      <td className="py-3.5 px-4 font-mono font-bold text-slate-900">
                        <button
                          onClick={() => openOrderDetail(ord.order_number)}
                          className="hover:text-emerald-700 transition hover:underline"
                        >
                          {ord.order_number}
                        </button>
                        <div className="text-[10px] text-slate-400 font-sans mt-0.5">
                          {new Date(ord.created_at).toLocaleDateString('en-IN', {
                            day: 'numeric',
                            month: 'short',
                            year: 'numeric',
                          })}
                        </div>
                      </td>

                      <td className="py-3.5 px-4">
                        <div className="font-semibold text-slate-900">
                          {ord.customer_name || ord.customer_email}
                        </div>
                        <div className="text-[10.5px] text-slate-500">{ord.customer_email}</div>
                      </td>

                      <td className="py-3.5 px-4">
                        <span
                          className={`inline-block px-2 py-0.5 rounded-full text-[10px] font-bold ${
                            ord.customer_type === 'business'
                              ? 'bg-purple-100 text-purple-800'
                              : 'bg-emerald-100 text-emerald-800'
                          }`}
                        >
                          {ord.customer_type === 'business' ? 'Wholesale (B2B)' : 'Retail (B2C)'}
                        </span>
                      </td>

                      <td className="py-3.5 px-4">
                        <span
                          className={`inline-block px-2.5 py-1 rounded-md text-[10.5px] font-bold ${
                            ord.order_status === 'delivered'
                              ? 'bg-emerald-50 text-emerald-700 border border-emerald-200'
                              : ord.order_status === 'cancelled'
                              ? 'bg-red-50 text-red-700 border border-red-200'
                              : ord.order_status === 'dispatched'
                              ? 'bg-blue-50 text-blue-700 border border-blue-200'
                              : 'bg-amber-50 text-amber-700 border border-amber-200'
                          }`}
                        >
                          {ord.order_status_display}
                        </span>
                      </td>

                      <td className="py-3.5 px-4">
                        <span
                          className={`inline-block px-2 py-0.5 rounded-md text-[10.5px] font-semibold ${
                            ord.payment_status === 'paid'
                              ? 'bg-emerald-50 text-emerald-700'
                              : ord.payment_status === 'refunded'
                              ? 'bg-purple-50 text-purple-700'
                              : 'bg-slate-100 text-slate-600'
                          }`}
                        >
                          {ord.payment_status_display}
                        </span>
                      </td>

                      <td className="py-3.5 px-4 text-right font-black text-slate-900 text-sm">
                        ₹{Number(ord.total_amount).toLocaleString('en-IN', { minimumFractionDigits: 2 })}
                      </td>

                      <td className="py-3.5 px-4 text-center">
                        <div className="flex items-center justify-center gap-1.5">
                          <button
                            onClick={() => openStatusModal(ord)}
                            className="px-2.5 py-1 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-lg text-xs font-semibold transition"
                            title="Update Status"
                          >
                            Update
                          </button>
                          <button
                            onClick={() => openOrderDetail(ord.order_number)}
                            className="px-2.5 py-1 bg-emerald-50 hover:bg-emerald-100 text-emerald-700 rounded-lg text-xs font-semibold transition"
                            title="View Details"
                          >
                            Details
                          </button>
                          <a
                            href={getOrderInvoicePDFUrl(ord.order_number)}
                            download
                            className="p-1 text-slate-400 hover:text-slate-700 rounded transition"
                            title="Download Tax Invoice PDF"
                          >
                            🧾
                          </a>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}

          {/* Pagination Footer */}
          {totalCount > 20 && (
            <div className="p-4 border-t border-slate-100 flex items-center justify-between text-xs text-slate-500">
              <div>
                Showing {(page - 1) * 20 + 1} to {Math.min(page * 20, totalCount)} of {totalCount} orders
              </div>
              <div className="flex gap-2">
                <button
                  disabled={page <= 1}
                  onClick={() => setPage((p) => p - 1)}
                  className="px-3 py-1 rounded-lg border border-slate-200 disabled:opacity-40"
                >
                  Previous
                </button>
                <button
                  disabled={page * 20 >= totalCount}
                  onClick={() => setPage((p) => p + 1)}
                  className="px-3 py-1 rounded-lg border border-slate-200 disabled:opacity-40"
                >
                  Next
                </button>
              </div>
            </div>
          )}
        </div>

        {/* 3. Status Update Modal */}
        {updateModalOpen && (
          <div className="fixed inset-0 z-50 bg-slate-900/40 backdrop-blur-xs flex items-center justify-center p-4">
            <div className="bg-white rounded-2xl max-w-md w-full p-6 shadow-xl border border-slate-200">
              <div className="flex items-center justify-between pb-3 border-b border-slate-100">
                <h3 className="text-base font-bold text-slate-900">
                  Update Order: {selectedOrderNumber}
                </h3>
                <button
                  onClick={() => setUpdateModalOpen(false)}
                  className="text-slate-400 hover:text-slate-700 text-lg leading-none"
                >
                  &times;
                </button>
              </div>

              {errorMsg && (
                <div className="mt-3 p-3 bg-red-50 border border-red-200 rounded-xl text-xs text-red-700">
                  {errorMsg}
                </div>
              )}

              <form onSubmit={handleStatusUpdate} className="mt-4 space-y-4">
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">
                    Transition Order Status (Allowed Next States)
                  </label>
                  {(() => {
                    const currentOrder = orders.find((o) => o.order_number === selectedOrderNumber);
                    const currentStatus = currentOrder?.order_status || '';
                    const allowedNext = VALID_TRANSITIONS[currentStatus] || [];
                    return (
                      <select
                        value={newStatus}
                        onChange={(e) => setNewStatus(e.target.value)}
                        className="w-full px-3 py-2 text-xs rounded-xl border border-slate-200 bg-white"
                      >
                        <option value="">Keep Current Status ({currentOrder?.order_status_display || currentStatus})</option>
                        {allowedNext.map((st) => (
                          <option key={st} value={st}>
                            Move to: {st.replace(/_/g, ' ').toUpperCase()}
                          </option>
                        ))}
                      </select>
                    );
                  })()}
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">
                    Payment Status
                  </label>
                  <select
                    value={newPaymentStatus}
                    onChange={(e) => setNewPaymentStatus(e.target.value)}
                    className="w-full px-3 py-2 text-xs rounded-xl border border-slate-200 bg-white"
                  >
                    <option value="pending">Pending Payment</option>
                    <option value="partially_paid">Partially Paid</option>
                    <option value="paid">Paid</option>
                    <option value="failed">Failed</option>
                    <option value="refunded">Refunded</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">
                    Administrative Notes / Reason
                  </label>
                  <textarea
                    rows={3}
                    placeholder="E.g. Dispatched via KSRTC logistics / Bank transfer UTR confirmed..."
                    value={adminNotes}
                    onChange={(e) => setAdminNotes(e.target.value)}
                    className="w-full px-3 py-2 text-xs rounded-xl border border-slate-200"
                  />
                </div>

                <div className="flex justify-end gap-2 pt-2">
                  <button
                    type="button"
                    onClick={() => setUpdateModalOpen(false)}
                    className="px-4 py-2 text-xs font-semibold text-slate-600 hover:bg-slate-100 rounded-xl"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    disabled={updating}
                    className="px-5 py-2 text-xs font-bold bg-[#093725] text-amber-300 rounded-xl hover:bg-[#062519] transition disabled:opacity-50"
                  >
                    {updating ? 'Saving...' : 'Update Order'}
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}

        {/* 4. Order Detail Slideover / Modal */}
        {selectedOrderNumber && !updateModalOpen && (
          <div className="fixed inset-0 z-50 bg-slate-900/40 backdrop-blur-xs flex items-center justify-end">
            <div className="bg-white w-full max-w-xl h-full shadow-2xl overflow-y-auto p-6 flex flex-col justify-between">
              <div>
                <div className="flex items-center justify-between pb-4 border-b border-slate-100">
                  <div>
                    <span className="text-[11px] font-bold text-emerald-700 uppercase tracking-wider block">
                      Order Details
                    </span>
                    <h2 className="text-xl font-black text-slate-900">
                      {selectedOrderNumber}
                    </h2>
                  </div>
                  <button
                    onClick={() => setSelectedOrderNumber(null)}
                    className="p-1.5 text-slate-400 hover:text-slate-800 rounded-lg text-lg"
                  >
                    &times;
                  </button>
                </div>

                {detailLoading || !detailOrder ? (
                  <div className="py-20 text-center text-xs font-semibold text-slate-400">
                    Loading order details...
                  </div>
                ) : (
                  <div className="mt-6 space-y-6">
                    {/* Status badges */}
                    <div className="flex items-center justify-between p-3 bg-slate-50 rounded-xl border border-slate-200">
                      <div>
                        <div className="text-[10px] uppercase font-bold text-slate-400">Status</div>
                        <div className="text-xs font-extrabold text-slate-900 mt-0.5">
                          {detailOrder.order_status_display}
                        </div>
                      </div>
                      <div>
                        <div className="text-[10px] uppercase font-bold text-slate-400">Payment</div>
                        <div className="text-xs font-extrabold text-slate-900 mt-0.5">
                          {detailOrder.payment_status_display} ({detailOrder.payment_method_display})
                        </div>
                      </div>
                      <div>
                        <div className="text-[10px] uppercase font-bold text-slate-400">Segment</div>
                        <div className="text-xs font-extrabold text-emerald-800 mt-0.5 capitalize">
                          {detailOrder.customer_type}
                        </div>
                      </div>
                    </div>

                    {/* Customer & Shipping Details */}
                    <div>
                      <h4 className="text-xs font-bold text-slate-900 uppercase tracking-wider mb-2">
                        Delivery Address
                      </h4>
                      <div className="p-3 bg-white border border-slate-200 rounded-xl text-xs space-y-1 text-slate-700">
                        <div className="font-bold text-slate-900">
                          {detailOrder.shipping_address_snapshot?.recipient_name || detailOrder.customer_name}
                        </div>
                        <div>{detailOrder.shipping_address_snapshot?.address_line_1}</div>
                        <div>
                          {detailOrder.shipping_address_snapshot?.city},{' '}
                          {detailOrder.shipping_address_snapshot?.district},{' '}
                          {detailOrder.shipping_address_snapshot?.state} -{' '}
                          {detailOrder.shipping_address_snapshot?.pincode}
                        </div>
                        <div className="text-slate-500 font-semibold pt-1">
                          Phone: {detailOrder.shipping_address_snapshot?.phone_number} &bull; Email:{' '}
                          {detailOrder.customer_email}
                        </div>
                      </div>
                    </div>

                    {/* Line Items */}
                    <div>
                      <h4 className="text-xs font-bold text-slate-900 uppercase tracking-wider mb-2">
                        Purchased Items ({detailOrder.items?.length || 0})
                      </h4>
                      <div className="divide-y divide-slate-100 border border-slate-200 rounded-xl overflow-hidden">
                        {detailOrder.items?.map((item) => (
                          <div key={item.id} className="p-3 flex items-center justify-between text-xs">
                            <div>
                              <div className="font-bold text-slate-900">{item.product_name}</div>
                              <div className="text-[11px] text-slate-400">
                                {item.sku} &bull; {item.display_weight} &bull; Qty: {item.quantity}
                              </div>
                              {item.pricing_rule_applied && (
                                <span className="inline-block text-[9.5px] font-semibold text-emerald-700 bg-emerald-50 px-1.5 rounded mt-0.5">
                                  {item.pricing_rule_applied}
                                </span>
                              )}
                            </div>
                            <div className="text-right">
                              <div className="font-black text-slate-900">
                                ₹{Number(item.line_total).toFixed(2)}
                              </div>
                              <div className="text-[10px] text-slate-400">
                                ₹{Number(item.unit_price).toFixed(2)} / unit
                              </div>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>

                    {/* Financial Summary */}
                    <div className="p-4 bg-slate-50 rounded-xl border border-slate-200 space-y-1.5 text-xs text-slate-600">
                      <div className="flex justify-between">
                        <span>Subtotal:</span>
                        <span>₹{Number(detailOrder.subtotal).toFixed(2)}</span>
                      </div>
                      <div className="flex justify-between">
                        <span>Discount / Savings:</span>
                        <span className="text-emerald-700">-₹{Number(detailOrder.discount_amount).toFixed(2)}</span>
                      </div>
                      <div className="flex justify-between">
                        <span>Taxes (GST):</span>
                        <span>₹{Number(detailOrder.tax_amount).toFixed(2)}</span>
                      </div>
                      <div className="flex justify-between">
                        <span>Delivery Charge:</span>
                        <span>₹{Number(detailOrder.delivery_charge).toFixed(2)}</span>
                      </div>
                      <div className="flex justify-between pt-2 border-t border-slate-200 text-sm font-black text-slate-900">
                        <span>Grand Total:</span>
                        <span>₹{Number(detailOrder.total_amount).toFixed(2)}</span>
                      </div>
                    </div>
                  </div>
                )}
              </div>

              {/* Action Buttons in Slideover Footer */}
              <div className="pt-6 border-t border-slate-200 flex items-center justify-between gap-3">
                <a
                  href={getOrderInvoicePDFUrl(selectedOrderNumber)}
                  download
                  className="px-4 py-2.5 bg-slate-100 hover:bg-slate-200 text-slate-800 rounded-xl text-xs font-bold transition flex items-center gap-1.5"
                >
                  <span>🧾</span> Download PDF Invoice
                </a>

                <button
                  onClick={() => {
                    if (detailOrder) openStatusModal(detailOrder);
                  }}
                  className="px-5 py-2.5 bg-[#093725] text-amber-300 hover:bg-[#062519] rounded-xl text-xs font-bold transition"
                >
                  Update Order
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </AdminLayout>
  );
}

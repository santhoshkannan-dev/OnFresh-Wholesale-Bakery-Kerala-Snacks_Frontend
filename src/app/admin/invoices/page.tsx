'use client';

import React, { useState, useEffect, useCallback } from 'react';
import AdminLayout from '@/components/AdminLayout';
import { apiGetAdminInvoices, apiGetAdminInvoiceDetail, getInvoicePDFUrl } from '@/lib/api';
import { Invoice } from '@/types/api';

export default function AdminInvoicesPage() {
  const [invoices, setInvoices] = useState<Invoice[]>([]);
  const [totalCount, setTotalCount] = useState(0);
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(1);

  // Filters
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState('');
  const [paymentFilter, setPaymentFilter] = useState('');
  const [typeFilter, setTypeFilter] = useState('');

  // Selected Invoice for Preview Modal
  const [selectedInvoice, setSelectedInvoice] = useState<Invoice | null>(null);

  const loadInvoices = useCallback(async () => {
    setLoading(true);
    try {
      const res = await apiGetAdminInvoices({
        status: statusFilter || undefined,
        payment_status: paymentFilter || undefined,
        customer_type: typeFilter || undefined,
        search: search || undefined,
        page,
      });
      if (res.data) {
        setInvoices(res.data.results || []);
        setTotalCount(res.data.count || 0);
      }
    } catch (err) {
      console.error('Failed to load invoices', err);
    } finally {
      setLoading(false);
    }
  }, [statusFilter, paymentFilter, typeFilter, search, page]);

  useEffect(() => {
    loadInvoices();
  }, [loadInvoices]);

  const openInvoicePreview = async (invoiceNumber: string) => {
    const res = await apiGetAdminInvoiceDetail(invoiceNumber);
    if (res.invoice) {
      setSelectedInvoice(res.invoice);
    }
  };

  const handlePrint = () => {
    window.print();
  };

  return (
    <AdminLayout
      title="Tax Invoice Management"
      subtitle="GST-compliant billing, historical order snapshots, and printable PDF records."
      actions={
        <div className="text-xs font-semibold text-slate-500">
          Invoices Issued: <span className="font-bold text-slate-900">{totalCount}</span>
        </div>
      }
    >
      <div className="space-y-6">
        {/* 1. Filters & Search */}
        <div className="bg-white p-4 rounded-2xl border border-slate-200/80 shadow-xs flex flex-wrap items-center justify-between gap-3">
          <div className="flex-1 min-w-[240px]">
            <input
              type="text"
              placeholder="Search by invoice number, order number, customer name, GSTIN..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full px-3.5 py-2 text-xs rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500"
            />
          </div>

          <div className="flex items-center gap-2 flex-wrap">
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

            <select
              value={statusFilter}
              onChange={(e) => {
                setStatusFilter(e.target.value);
                setPage(1);
              }}
              className="px-3 py-2 text-xs rounded-xl border border-slate-200 bg-white font-medium text-slate-700"
            >
              <option value="">All Invoice Statuses</option>
              <option value="issued">Issued</option>
              <option value="paid">Paid</option>
              <option value="cancelled">Cancelled</option>
            </select>

            <select
              value={paymentFilter}
              onChange={(e) => {
                setPaymentFilter(e.target.value);
                setPage(1);
              }}
              className="px-3 py-2 text-xs rounded-xl border border-slate-200 bg-white font-medium text-slate-700"
            >
              <option value="">All Payment States</option>
              <option value="pending">Pending Payment</option>
              <option value="paid">Paid</option>
              <option value="partially_paid">Partially Paid</option>
              <option value="refunded">Refunded</option>
            </select>
          </div>
        </div>

        {/* 2. Invoices List Table */}
        <div className="bg-white rounded-2xl border border-slate-200/80 shadow-xs overflow-hidden">
          {loading ? (
            <div className="py-20 text-center text-xs font-semibold text-slate-500">
              Loading invoices...
            </div>
          ) : invoices.length === 0 ? (
            <div className="py-16 text-center text-xs font-semibold text-slate-400">
              No tax invoices found. Invoices are generated automatically as orders are confirmed.
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs">
                <thead className="bg-slate-50 border-b border-slate-200 text-slate-500 font-bold uppercase tracking-wider">
                  <tr>
                    <th className="py-3.5 px-4">Invoice #</th>
                    <th className="py-3.5 px-4">Order #</th>
                    <th className="py-3.5 px-4">Customer & Business</th>
                    <th className="py-3.5 px-4">Segment</th>
                    <th className="py-3.5 px-4">Date</th>
                    <th className="py-3.5 px-4 text-right">Total (₹)</th>
                    <th className="py-3.5 px-4">Status</th>
                    <th className="py-3.5 px-4 text-center">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {invoices.map((inv) => (
                    <tr key={inv.invoice_number} className="hover:bg-slate-50/70 transition">
                      <td className="py-3.5 px-4 font-mono font-bold text-slate-900">
                        <button
                          onClick={() => openInvoicePreview(inv.invoice_number)}
                          className="hover:text-emerald-700 transition hover:underline"
                        >
                          {inv.invoice_number}
                        </button>
                      </td>

                      <td className="py-3.5 px-4 font-mono text-slate-600">
                        {inv.order_number}
                      </td>

                      <td className="py-3.5 px-4">
                        <div className="font-semibold text-slate-900">{inv.customer_name}</div>
                        {inv.business_name && (
                          <div className="text-[11px] text-purple-700 font-bold">
                            {inv.business_name} {inv.customer_gstin && `(${inv.customer_gstin})`}
                          </div>
                        )}
                        <div className="text-[10px] text-slate-400">{inv.customer_email}</div>
                      </td>

                      <td className="py-3.5 px-4">
                        <span
                          className={`inline-block px-2 py-0.5 rounded-full text-[10px] font-bold ${
                            inv.customer_type === 'business'
                              ? 'bg-purple-100 text-purple-800'
                              : 'bg-emerald-100 text-emerald-800'
                          }`}
                        >
                          {inv.customer_type === 'business' ? 'Wholesale' : 'Retail'}
                        </span>
                      </td>

                      <td className="py-3.5 px-4 text-slate-600">
                        {new Date(inv.invoice_date).toLocaleDateString('en-IN', {
                          day: 'numeric',
                          month: 'short',
                          year: 'numeric',
                        })}
                      </td>

                      <td className="py-3.5 px-4 text-right font-black text-slate-900 text-sm">
                        ₹{Number(inv.grand_total).toLocaleString('en-IN', { minimumFractionDigits: 2 })}
                      </td>

                      <td className="py-3.5 px-4">
                        <span
                          className={`inline-block px-2 py-0.5 rounded-md text-[10.5px] font-bold ${
                            inv.status === 'paid'
                              ? 'bg-emerald-50 text-emerald-700'
                              : inv.status === 'cancelled'
                              ? 'bg-red-50 text-red-700'
                              : 'bg-blue-50 text-blue-700'
                          }`}
                        >
                          {inv.status_display}
                        </span>
                      </td>

                      <td className="py-3.5 px-4 text-center">
                        <div className="flex items-center justify-center gap-2">
                          <button
                            onClick={() => openInvoicePreview(inv.invoice_number)}
                            className="px-2.5 py-1 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-lg text-xs font-semibold transition"
                          >
                            Preview
                          </button>
                          <a
                            href={getInvoicePDFUrl(inv.invoice_number)}
                            download
                            className="px-2.5 py-1 bg-emerald-50 hover:bg-emerald-100 text-emerald-700 rounded-lg text-xs font-bold transition flex items-center gap-1"
                          >
                            <span>📥</span> PDF
                          </a>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}

          {/* Pagination */}
          {totalCount > 20 && (
            <div className="p-4 border-t border-slate-100 flex items-center justify-between text-xs text-slate-500">
              <div>
                Showing {(page - 1) * 20 + 1} to {Math.min(page * 20, totalCount)} of {totalCount} invoices
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

        {/* 3. Printable Invoice Preview Modal */}
        {selectedInvoice && (
          <div className="fixed inset-0 z-50 bg-slate-900/50 backdrop-blur-xs flex items-center justify-center p-4 overflow-y-auto">
            <div className="bg-white rounded-2xl max-w-3xl w-full my-8 p-6 sm:p-8 shadow-2xl border border-slate-200 print:p-0 print:border-none print:shadow-none print:my-0">
              {/* Modal Header (Hidden on print) */}
              <div className="flex items-center justify-between pb-4 border-b border-slate-100 print:hidden">
                <div className="flex items-center gap-2">
                  <span className="text-xs font-bold text-emerald-700 bg-emerald-50 px-2.5 py-1 rounded-full uppercase tracking-wider">
                    Official Tax Invoice
                  </span>
                  <span className="text-xs font-mono font-bold text-slate-600">
                    {selectedInvoice.invoice_number}
                  </span>
                </div>
                <div className="flex items-center gap-2">
                  <button
                    onClick={handlePrint}
                    className="px-3 py-1.5 bg-slate-100 hover:bg-slate-200 text-slate-800 text-xs font-bold rounded-xl transition"
                  >
                    🖨️ Print
                  </button>
                  <a
                    href={getInvoicePDFUrl(selectedInvoice.invoice_number)}
                    download
                    className="px-3.5 py-1.5 bg-[#093725] text-amber-300 hover:bg-[#062519] text-xs font-bold rounded-xl transition"
                  >
                    📥 Download PDF
                  </a>
                  <button
                    onClick={() => setSelectedInvoice(null)}
                    className="p-1.5 text-slate-400 hover:text-slate-800 rounded-lg text-lg"
                  >
                    &times;
                  </button>
                </div>
              </div>

              {/* Printable Invoice Document Body */}
              <div className="mt-6 space-y-6 text-slate-800 text-xs">
                {/* Company & Invoice Header */}
                <div className="flex flex-col sm:flex-row justify-between gap-4 pb-6 border-b-2 border-emerald-700">
                  <div>
                    <h2 className="text-xl font-black text-emerald-800 tracking-tight">
                      {selectedInvoice.company_name}
                    </h2>
                    <div className="text-slate-600 mt-1 leading-relaxed">
                      {selectedInvoice.company_address}
                    </div>
                    <div className="text-slate-600 mt-1 font-semibold">
                      GSTIN: <span className="font-mono text-slate-900">{selectedInvoice.company_gstin}</span> &bull;{' '}
                      Phone: {selectedInvoice.company_phone}
                    </div>
                    <div className="text-slate-500">
                      Email: {selectedInvoice.company_email} &bull; Website: onfresh.in
                    </div>
                  </div>

                  <div className="sm:text-right bg-slate-50 p-4 rounded-xl border border-slate-100">
                    <div className="text-base font-black text-slate-900">
                      TAX INVOICE
                    </div>
                    <div className="text-slate-500 mt-1">
                      Invoice #: <span className="font-mono font-bold text-slate-900">{selectedInvoice.invoice_number}</span>
                    </div>
                    <div className="text-slate-500">
                      Order #: <span className="font-mono text-slate-900">{selectedInvoice.order_number}</span>
                    </div>
                    <div className="text-slate-500">
                      Date: <span className="font-bold text-slate-900">{selectedInvoice.invoice_date}</span>
                    </div>
                    <div className="mt-2">
                      <span className="inline-block px-2 py-0.5 rounded-full text-[10px] font-bold bg-emerald-100 text-emerald-800 uppercase">
                        {selectedInvoice.payment_status} ({selectedInvoice.payment_method})
                      </span>
                    </div>
                  </div>
                </div>

                {/* Bill To & Ship To */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 p-4 bg-slate-50 rounded-xl border border-slate-200">
                  <div>
                    <div className="font-bold text-slate-400 text-[10px] uppercase tracking-wider mb-1">
                      Billed To
                    </div>
                    <div className="font-bold text-sm text-slate-900">{selectedInvoice.customer_name}</div>
                    {selectedInvoice.business_name && (
                      <div className="font-semibold text-purple-700 mt-0.5">
                        {selectedInvoice.business_name}
                      </div>
                    )}
                    {selectedInvoice.customer_gstin && (
                      <div className="font-mono text-[11px] text-slate-700 mt-0.5">
                        GSTIN: {selectedInvoice.customer_gstin}
                      </div>
                    )}
                    <div className="text-slate-600 mt-1">
                      {selectedInvoice.billing_address?.address_line_1 || selectedInvoice.shipping_address?.address_line_1}
                    </div>
                    <div className="text-slate-600">
                      {selectedInvoice.billing_address?.city || selectedInvoice.shipping_address?.city},{' '}
                      {selectedInvoice.billing_address?.state || selectedInvoice.shipping_address?.state} -{' '}
                      {selectedInvoice.billing_address?.pincode || selectedInvoice.shipping_address?.pincode}
                    </div>
                    <div className="text-slate-500 text-[11px] mt-1">
                      Phone: {selectedInvoice.customer_phone} &bull; Email: {selectedInvoice.customer_email}
                    </div>
                  </div>

                  <div>
                    <div className="font-bold text-slate-400 text-[10px] uppercase tracking-wider mb-1">
                      Shipped To
                    </div>
                    <div className="font-bold text-sm text-slate-900">
                      {selectedInvoice.shipping_address?.recipient_name || selectedInvoice.customer_name}
                    </div>
                    <div className="text-slate-600 mt-1">
                      {selectedInvoice.shipping_address?.address_line_1}
                    </div>
                    <div className="text-slate-600">
                      {selectedInvoice.shipping_address?.city}, {selectedInvoice.shipping_address?.state} -{' '}
                      {selectedInvoice.shipping_address?.pincode}
                    </div>
                    <div className="mt-2 text-slate-500 font-semibold">
                      Customer Segment: <span className="capitalize">{selectedInvoice.customer_type}</span>
                    </div>
                  </div>
                </div>

                {/* Items Table */}
                <div className="border border-slate-200 rounded-xl overflow-hidden">
                  <table className="w-full text-left">
                    <thead className="bg-emerald-700 text-white font-bold text-[11px]">
                      <tr>
                        <th className="py-2.5 px-3">#</th>
                        <th className="py-2.5 px-3">Product Description</th>
                        <th className="py-2.5 px-3">SKU</th>
                        <th className="py-2.5 px-3 text-center">Qty</th>
                        <th className="py-2.5 px-3 text-right">Unit Price</th>
                        <th className="py-2.5 px-3 text-right">Disc.</th>
                        <th className="py-2.5 px-3 text-right">Total (₹)</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100">
                      {selectedInvoice.items?.map((item, idx) => (
                        <tr key={item.id} className="text-slate-700">
                          <td className="py-2 px-3 text-slate-400">{idx + 1}</td>
                          <td className="py-2 px-3">
                            <div className="font-bold text-slate-900">{item.product_name}</div>
                            <div className="text-[10px] text-slate-400">Pack: {item.display_weight}</div>
                          </td>
                          <td className="py-2 px-3 font-mono text-[11px]">{item.sku}</td>
                          <td className="py-2 px-3 text-center font-bold">{item.quantity}</td>
                          <td className="py-2 px-3 text-right">₹{Number(item.unit_price).toFixed(2)}</td>
                          <td className="py-2 px-3 text-right text-emerald-700">
                            -₹{Number(item.discount_amount).toFixed(2)}
                          </td>
                          <td className="py-2 px-3 text-right font-black text-slate-900">
                            ₹{Number(item.line_total).toFixed(2)}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>

                {/* Summary & Taxes Calculation */}
                <div className="flex flex-col sm:flex-row justify-between gap-6 pt-2">
                  <div className="sm:max-w-xs text-[11px] text-slate-500 space-y-1">
                    <div className="font-bold text-slate-700">Terms & FSSAI Declarations:</div>
                    <div>1. Freshly prepared in Vandiperiyar, Idukki District, Kerala.</div>
                    <div>2. Store in a cool, dry place away from direct sunlight.</div>
                    <div>3. Computer-generated tax invoice under Kerala GST provisions.</div>
                  </div>

                  <div className="w-full sm:max-w-xs space-y-1.5 p-4 bg-slate-50 rounded-xl border border-slate-200">
                    <div className="flex justify-between text-slate-600">
                      <span>Subtotal:</span>
                      <span>₹{Number(selectedInvoice.subtotal).toFixed(2)}</span>
                    </div>
                    <div className="flex justify-between text-emerald-700">
                      <span>Discounts:</span>
                      <span>-₹{Number(selectedInvoice.discount_amount).toFixed(2)}</span>
                    </div>
                    {Number(selectedInvoice.cgst_amount) > 0 && (
                      <>
                        <div className="flex justify-between text-slate-500 text-[11px]">
                          <span>CGST (2.5%):</span>
                          <span>₹{Number(selectedInvoice.cgst_amount).toFixed(2)}</span>
                        </div>
                        <div className="flex justify-between text-slate-500 text-[11px]">
                          <span>SGST (2.5%):</span>
                          <span>₹{Number(selectedInvoice.sgst_amount).toFixed(2)}</span>
                        </div>
                      </>
                    )}
                    {Number(selectedInvoice.igst_amount) > 0 && (
                      <div className="flex justify-between text-slate-500 text-[11px]">
                        <span>IGST (5.0%):</span>
                        <span>₹{Number(selectedInvoice.igst_amount).toFixed(2)}</span>
                      </div>
                    )}
                    <div className="flex justify-between text-slate-600">
                      <span>Delivery Fee:</span>
                      <span>₹{Number(selectedInvoice.delivery_charge).toFixed(2)}</span>
                    </div>
                    <div className="flex justify-between pt-2 border-t border-slate-200 font-black text-slate-900 text-sm">
                      <span>Grand Total:</span>
                      <span>₹{Number(selectedInvoice.grand_total).toFixed(2)}</span>
                    </div>
                  </div>
                </div>

                {/* Signatory Footer */}
                <div className="pt-8 flex justify-end text-right">
                  <div>
                    <div className="font-bold text-slate-900">For OnFresh Foods & Bakery</div>
                    <div className="h-10" />
                    <div className="text-[11px] font-semibold text-slate-600">Authorised Signatory</div>
                    <div className="text-[10px] text-slate-400">Vandiperiyar Facility</div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </AdminLayout>
  );
}

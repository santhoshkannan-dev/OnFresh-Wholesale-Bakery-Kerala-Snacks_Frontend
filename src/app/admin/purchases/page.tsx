'use client';

import React, { useState, useEffect, useCallback } from 'react';
import AdminLayout from '@/components/AdminLayout';
import {
  apiGetPurchaseOrders,
  apiCreatePurchaseOrder,
  apiReceivePurchaseOrder,
  apiRecordSupplierPayment,
  apiGetSuppliers,
  apiGetRawMaterials,
} from '@/lib/api';
import { PurchaseOrder, Supplier, RawMaterial } from '@/types/api';

interface LineItemForm {
  material_id: number | '';
  ordered_quantity: string;
  unit_cost: string;
  tax_rate: string;
}

export default function PurchaseOrdersPage() {
  const [purchaseOrders, setPurchaseOrders] = useState<PurchaseOrder[]>([]);
  const [suppliers, setSuppliers] = useState<Supplier[]>([]);
  const [materials, setMaterials] = useState<RawMaterial[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState('');

  // Create PO Modal
  const [createModalOpen, setCreateModalOpen] = useState(false);
  const [selectedSupplierId, setSelectedSupplierId] = useState<number | ''>('');
  const [orderDate, setOrderDate] = useState('');
  const [expectedDate, setExpectedDate] = useState('');
  const [poNotes, setPoNotes] = useState('');
  const [lines, setLines] = useState<LineItemForm[]>([
    { material_id: '', ordered_quantity: '100', unit_cost: '45', tax_rate: '0' },
  ]);
  const [createSubmitting, setCreateSubmitting] = useState(false);

  useEffect(() => {
    setOrderDate(new Date().toISOString().split('T')[0]);
  }, []);

  // Receive Modal
  const [receiveModalOpen, setReceiveModalOpen] = useState(false);
  const [activePo, setActivePo] = useState<PurchaseOrder | null>(null);
  const [vendorInvoice, setVendorInvoice] = useState('');
  const [receiveLines, setReceiveLines] = useState<{ [id: number]: string }>({});
  const [receiveSubmitting, setReceiveSubmitting] = useState(false);

  // Payment Modal
  const [paymentModalOpen, setPaymentModalOpen] = useState(false);
  const [payAmount, setPayAmount] = useState('');
  const [payMethod, setPayMethod] = useState('bank_transfer');
  const [payRef, setPayRef] = useState('');
  const [payNotes, setPayNotes] = useState('');
  const [paymentSubmitting, setPaymentSubmitting] = useState(false);

  const loadData = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const [poRes, supRes, matRes] = await Promise.all([
        apiGetPurchaseOrders({
          status: statusFilter || undefined,
          search: search || undefined,
        }),
        apiGetSuppliers(),
        apiGetRawMaterials(),
      ]);
      setPurchaseOrders(poRes.data || []);
      setSuppliers(supRes.data || []);
      setMaterials(matRes.data || []);
      if (poRes.error) setError(poRes.error);
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : 'Failed to load purchase orders');
    } finally {
      setLoading(false);
    }
  }, [statusFilter, search]);

  useEffect(() => {
    loadData();
  }, [loadData]);

  // Handle PO line additions
  const addLineItem = () => {
    setLines([...lines, { material_id: '', ordered_quantity: '50', unit_cost: '0', tax_rate: '0' }]);
  };

  const removeLineItem = (index: number) => {
    if (lines.length > 1) {
      setLines(lines.filter((_, i) => i !== index));
    }
  };

  const updateLine = (index: number, field: keyof LineItemForm, value: string | number) => {
    const updated = [...lines];
    updated[index] = { ...updated[index], [field]: value };
    // Auto fill unit cost when material changes
    if (field === 'material_id') {
      const mat = materials.find((m) => m.id === Number(value));
      if (mat) {
        updated[index].unit_cost = String(mat.unit_cost);
      }
    }
    setLines(updated);
  };

  const handleCreatePo = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedSupplierId) {
      alert('Please choose a supplier');
      return;
    }
    setCreateSubmitting(true);
    try {
      const itemsPayload = lines
        .filter((l) => l.material_id)
        .map((l) => ({
          material_id: Number(l.material_id),
          ordered_quantity: l.ordered_quantity,
          unit_cost: l.unit_cost,
          tax_rate: l.tax_rate || 0,
        }));

      if (itemsPayload.length === 0) {
        alert('Please add at least one line item');
        setCreateSubmitting(false);
        return;
      }

      const res = await apiCreatePurchaseOrder({
        supplier: Number(selectedSupplierId),
        order_date: orderDate,
        expected_delivery_date: expectedDate || undefined,
        notes: poNotes,
        items: itemsPayload,
      });

      if (res.success) {
        setCreateModalOpen(false);
        setSelectedSupplierId('');
        loadData();
      } else {
        alert(res.message || 'Failed to create PO');
      }
    } catch (err: unknown) {
      alert(err instanceof Error ? err.message : 'Error creating PO');
    } finally {
      setCreateSubmitting(false);
    }
  };

  const openReceiveModal = (po: PurchaseOrder) => {
    setActivePo(po);
    setVendorInvoice(po.vendor_invoice_number || '');
    const map: { [id: number]: string } = {};
    po.items?.forEach((item) => {
      map[item.id] = String(item.ordered_quantity);
    });
    setReceiveLines(map);
    setReceiveModalOpen(true);
  };

  const handleReceiveGoods = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!activePo) return;
    setReceiveSubmitting(true);
    try {
      const payloadItems = Object.entries(receiveLines).map(([id, qty]) => ({
        id: Number(id),
        received_quantity: qty,
      }));

      const res = await apiReceivePurchaseOrder(activePo.id, {
        vendor_invoice_number: vendorInvoice,
        items: payloadItems,
      });

      if (res.success) {
        setReceiveModalOpen(false);
        loadData();
      } else {
        alert(res.message || 'Failed to receive goods');
      }
    } catch (err: unknown) {
      alert(err instanceof Error ? err.message : 'Error receiving goods');
    } finally {
      setReceiveSubmitting(false);
    }
  };

  const openPaymentModal = (po: PurchaseOrder) => {
    setActivePo(po);
    const balance = Number(po.total_amount) - Number(po.amount_paid);
    setPayAmount(String(Math.max(0, balance)));
    setPayRef('');
    setPayNotes('');
    setPaymentModalOpen(true);
  };

  const handleRecordPayment = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!activePo) return;
    setPaymentSubmitting(true);
    try {
      const res = await apiRecordSupplierPayment(activePo.id, {
        amount: payAmount,
        payment_method: payMethod,
        reference_number: payRef,
        notes: payNotes,
      });

      if (res.success) {
        setPaymentModalOpen(false);
        loadData();
      } else {
        alert(res.message || 'Failed to record payment');
      }
    } catch (err: unknown) {
      alert(err instanceof Error ? err.message : 'Error recording payment');
    } finally {
      setPaymentSubmitting(false);
    }
  };

  return (
    <AdminLayout
      title="Purchase Orders & Receiving"
      subtitle="Procure agricultural produce, oils, and packaging materials. Inventory is credited upon physical receipt."
      actions={
        <div className="flex items-center gap-2">
          <button
            onClick={() => setCreateModalOpen(true)}
            className="px-4 py-2 bg-gradient-to-r from-[#093725] to-[#15803d] text-amber-300 rounded-xl text-xs font-bold hover:shadow-md transition"
          >
            + Raise Purchase Order
          </button>
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

      {/* Filter Toolbar */}
      <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-2xs mb-6 flex flex-wrap items-center justify-between gap-3">
        <div className="flex flex-wrap items-center gap-3">
          <input
            type="text"
            placeholder="Search PO #, supplier, vendor invoice..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="px-3.5 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs focus:outline-emerald-600 w-72"
          />
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-700"
          >
            <option value="">All Statuses</option>
            <option value="draft">Draft</option>
            <option value="ordered">Ordered</option>
            <option value="received">Received / Stocked</option>
            <option value="cancelled">Cancelled</option>
          </select>
        </div>
        <div className="text-xs font-semibold text-slate-500">
          Showing <span className="text-slate-900 font-bold">{purchaseOrders.length}</span> purchase orders
        </div>
      </div>

      {/* Purchase Orders Table */}
      <div className="bg-white rounded-2xl border border-slate-200 shadow-2xs overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-slate-50/75 border-b border-slate-100 text-slate-500 uppercase tracking-wider font-semibold">
              <tr>
                <th className="py-3.5 px-4">PO Number & Date</th>
                <th className="py-3.5 px-4">Supplier</th>
                <th className="py-3.5 px-4">Items Summary</th>
                <th className="py-3.5 px-4">Total Amount (₹)</th>
                <th className="py-3.5 px-4">Order Status</th>
                <th className="py-3.5 px-4">Payment</th>
                <th className="py-3.5 px-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {loading ? (
                <tr>
                  <td colSpan={7} className="py-8 text-center text-slate-400">
                    Loading purchase orders...
                  </td>
                </tr>
              ) : purchaseOrders.length === 0 ? (
                <tr>
                  <td colSpan={7} className="py-8 text-center text-slate-400">
                    No purchase orders recorded yet.
                  </td>
                </tr>
              ) : (
                purchaseOrders.map((po) => (
                  <tr key={po.id} className="hover:bg-slate-50/60 transition">
                    <td className="py-3.5 px-4">
                      <div className="font-mono font-bold text-slate-900">{po.po_number}</div>
                      <div className="text-[11px] text-slate-400">Date: {po.order_date}</div>
                    </td>
                    <td className="py-3.5 px-4">
                      <div className="font-semibold text-slate-900">{po.supplier_name}</div>
                      <div className="text-[11px] text-slate-400 font-mono">
                        GST: {po.supplier_gstin || 'N/A'}
                      </div>
                    </td>
                    <td className="py-3.5 px-4">
                      <div className="space-y-0.5">
                        {po.items?.map((item) => (
                          <div key={item.id} className="text-slate-700 text-[11px]">
                            • {item.material_name}:{' '}
                            <strong>
                              {Number(item.ordered_quantity).toFixed(0)} {item.unit_of_measure}
                            </strong>
                          </div>
                        ))}
                      </div>
                    </td>
                    <td className="py-3.5 px-4">
                      <div className="font-bold text-slate-900">
                        ₹{Number(po.total_amount).toLocaleString('en-IN', { minimumFractionDigits: 2 })}
                      </div>
                      <div className="text-[10px] text-slate-400">
                        Paid: ₹{Number(po.amount_paid).toFixed(2)}
                      </div>
                    </td>
                    <td className="py-3.5 px-4">
                      <span
                        className={`inline-flex px-2 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider ${
                          po.status === 'received'
                            ? 'bg-emerald-100 text-emerald-800'
                            : po.status === 'ordered'
                            ? 'bg-blue-100 text-blue-800'
                            : po.status === 'draft'
                            ? 'bg-slate-100 text-slate-800'
                            : 'bg-red-100 text-red-800'
                        }`}
                      >
                        {po.status}
                      </span>
                      {po.is_stock_added && (
                        <div className="text-[10px] text-emerald-700 font-semibold mt-0.5">
                          ✓ Stock credited
                        </div>
                      )}
                    </td>
                    <td className="py-3.5 px-4">
                      <span
                        className={`inline-flex px-2 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider ${
                          po.payment_status === 'paid'
                            ? 'bg-emerald-100 text-emerald-800'
                            : po.payment_status === 'partially_paid'
                            ? 'bg-amber-100 text-amber-800'
                            : 'bg-slate-100 text-slate-700'
                        }`}
                      >
                        {po.payment_status.replace('_', ' ')}
                      </span>
                    </td>
                    <td className="py-3.5 px-4 text-right">
                      <div className="flex items-center justify-end gap-1.5">
                        {!po.is_stock_added && po.status !== 'cancelled' && (
                          <button
                            onClick={() => openReceiveModal(po)}
                            className="px-2.5 py-1 bg-emerald-600 hover:bg-emerald-700 text-white rounded-lg text-[11px] font-bold transition shadow-xs"
                          >
                            Receive Goods
                          </button>
                        )}
                        {po.payment_status !== 'paid' && po.status !== 'cancelled' && (
                          <button
                            onClick={() => openPaymentModal(po)}
                            className="px-2.5 py-1 bg-amber-50 hover:bg-amber-100 text-amber-900 rounded-lg text-[11px] font-bold transition"
                          >
                            Pay
                          </button>
                        )}
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Create Purchase Order Modal */}
      {createModalOpen && (
        <div className="fixed inset-0 z-50 bg-black/40 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl max-w-2xl w-full p-6 shadow-2xl border border-slate-200 max-h-[90vh] overflow-y-auto">
            <h3 className="text-base font-bold text-slate-900 mb-1">Raise Purchase Order</h3>
            <p className="text-xs text-slate-500 mb-4">
              Send formal procurement request to agricultural grower or packaging supplier.
            </p>

            <form onSubmit={handleCreatePo} className="space-y-4">
              <div className="grid grid-cols-3 gap-3">
                <div className="col-span-2">
                  <label className="block text-xs font-semibold text-slate-700 mb-1">
                    Select Supplier *
                  </label>
                  <select
                    required
                    value={selectedSupplierId}
                    onChange={(e) => setSelectedSupplierId(Number(e.target.value))}
                    className="w-full px-3 py-2 border border-slate-200 rounded-xl text-xs focus:outline-emerald-600"
                  >
                    <option value="">Choose Supplier</option>
                    {suppliers.map((s) => (
                      <option key={s.id} value={s.id}>
                        {s.name} ({s.supplier_code}) [{s.city}]
                      </option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">
                    Order Date *
                  </label>
                  <input
                    type="date"
                    required
                    value={orderDate}
                    onChange={(e) => setOrderDate(e.target.value)}
                    className="w-full px-3 py-2 border border-slate-200 rounded-xl text-xs"
                  />
                </div>
              </div>

              {/* Line Items */}
              <div className="border border-slate-200 rounded-2xl p-4 bg-slate-50/50">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-xs font-bold text-slate-800 uppercase tracking-wider">
                    Procured Items
                  </span>
                  <button
                    type="button"
                    onClick={addLineItem}
                    className="text-xs font-bold text-emerald-700 hover:text-emerald-800"
                  >
                    + Add Item
                  </button>
                </div>

                <div className="space-y-2">
                  {lines.map((line, idx) => (
                    <div key={idx} className="flex items-center gap-2 bg-white p-2.5 rounded-xl border border-slate-200">
                      <div className="flex-1">
                        <select
                          required
                          value={line.material_id}
                          onChange={(e) => updateLine(idx, 'material_id', Number(e.target.value))}
                          className="w-full px-2 py-1.5 border border-slate-200 rounded-lg text-xs"
                        >
                          <option value="">Select Material</option>
                          {materials.map((m) => (
                            <option key={m.id} value={m.id}>
                              {m.name} ({m.unit_of_measure})
                            </option>
                          ))}
                        </select>
                      </div>
                      <div className="w-24">
                        <input
                          type="number"
                          step="0.001"
                          min="0.001"
                          placeholder="Qty"
                          required
                          value={line.ordered_quantity}
                          onChange={(e) => updateLine(idx, 'ordered_quantity', e.target.value)}
                          className="w-full px-2 py-1.5 border border-slate-200 rounded-lg text-xs"
                        />
                      </div>
                      <div className="w-24">
                        <input
                          type="number"
                          step="0.01"
                          min="0"
                          placeholder="Price ₹"
                          required
                          value={line.unit_cost}
                          onChange={(e) => updateLine(idx, 'unit_cost', e.target.value)}
                          className="w-full px-2 py-1.5 border border-slate-200 rounded-lg text-xs"
                        />
                      </div>
                      <button
                        type="button"
                        onClick={() => removeLineItem(idx)}
                        className="text-slate-400 hover:text-red-600 px-1 font-bold"
                        title="Remove line"
                      >
                        ✕
                      </button>
                    </div>
                  ))}
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Procurement Notes / Delivery Instructions
                </label>
                <textarea
                  rows={2}
                  placeholder="e.g. Deliver to Vandiperiyar facility gate by 9:00 AM."
                  value={poNotes}
                  onChange={(e) => setPoNotes(e.target.value)}
                  className="w-full px-3 py-2 border border-slate-200 rounded-xl text-xs"
                />
              </div>

              <div className="flex justify-end gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setCreateModalOpen(false)}
                  className="px-4 py-2 border border-slate-200 text-slate-600 text-xs font-semibold rounded-xl hover:bg-slate-50"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={createSubmitting}
                  className="px-4 py-2 bg-emerald-700 text-white text-xs font-bold rounded-xl hover:bg-emerald-800 disabled:opacity-50"
                >
                  {createSubmitting ? 'Raising...' : 'Place Purchase Order'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Receive Goods Modal */}
      {receiveModalOpen && activePo && (
        <div className="fixed inset-0 z-50 bg-black/40 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl max-w-md w-full p-6 shadow-2xl border border-slate-200">
            <h3 className="text-base font-bold text-slate-900 mb-1">
              Receive Incoming Goods: {activePo.po_number}
            </h3>
            <p className="text-xs text-slate-500 mb-4">
              Supplier: {activePo.supplier_name}. Confirmed quantities will be added to Vandiperiyar stock.
            </p>

            <form onSubmit={handleReceiveGoods} className="space-y-4">
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Vendor Bill / Invoice Number
                </label>
                <input
                  type="text"
                  placeholder="e.g. INV-AGR-2026-901"
                  value={vendorInvoice}
                  onChange={(e) => setVendorInvoice(e.target.value)}
                  className="w-full px-3 py-2 border border-slate-200 rounded-xl text-xs font-mono font-bold"
                />
              </div>

              <div className="space-y-2">
                <label className="block text-xs font-semibold text-slate-700">
                  Verified Physical Received Quantities
                </label>
                {activePo.items?.map((item) => (
                  <div key={item.id} className="p-3 bg-slate-50 rounded-xl border border-slate-200 flex items-center justify-between">
                    <div>
                      <div className="font-bold text-slate-900 text-xs">{item.material_name}</div>
                      <div className="text-[10px] text-slate-400">
                        Ordered: {item.ordered_quantity} {item.unit_of_measure}
                      </div>
                    </div>
                    <div className="w-28 flex items-center gap-1">
                      <input
                        type="number"
                        step="0.001"
                        min="0"
                        value={receiveLines[item.id] || ''}
                        onChange={(e) =>
                          setReceiveLines({ ...receiveLines, [item.id]: e.target.value })
                        }
                        className="w-full px-2 py-1.5 border border-slate-200 rounded-lg text-xs font-bold text-right"
                      />
                      <span className="text-[10px] text-slate-500 uppercase">{item.unit_of_measure}</span>
                    </div>
                  </div>
                ))}
              </div>

              <div className="p-3 bg-emerald-50 rounded-xl border border-emerald-200 text-[11px] text-emerald-800">
                🔒 <strong>Traceability Note:</strong> Submitting will record inward inventory ledger movements and update current physical stock automatically.
              </div>

              <div className="flex justify-end gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setReceiveModalOpen(false)}
                  className="px-4 py-2 border border-slate-200 text-slate-600 text-xs font-semibold rounded-xl hover:bg-slate-50"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={receiveSubmitting}
                  className="px-4 py-2 bg-emerald-700 text-white text-xs font-bold rounded-xl hover:bg-emerald-800 disabled:opacity-50"
                >
                  {receiveSubmitting ? 'Stocking...' : 'Confirm Stock Receipt'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Record Payment Modal */}
      {paymentModalOpen && activePo && (
        <div className="fixed inset-0 z-50 bg-black/40 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl max-w-md w-full p-6 shadow-2xl border border-slate-200">
            <h3 className="text-base font-bold text-slate-900 mb-1">
              Record Supplier Payment
            </h3>
            <p className="text-xs text-slate-500 mb-4">
              PO {activePo.po_number} · Total: ₹{activePo.total_amount} · Paid: ₹{activePo.amount_paid}
            </p>

            <form onSubmit={handleRecordPayment} className="space-y-3">
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Payment Amount (₹) *
                </label>
                <input
                  type="number"
                  step="0.01"
                  min="0.01"
                  required
                  value={payAmount}
                  onChange={(e) => setPayAmount(e.target.value)}
                  className="w-full px-3 py-2 border border-slate-200 rounded-xl text-xs font-bold"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Payment Method *
                </label>
                <select
                  value={payMethod}
                  onChange={(e) => setPayMethod(e.target.value)}
                  className="w-full px-3 py-2 border border-slate-200 rounded-xl text-xs"
                >
                  <option value="bank_transfer">Bank Transfer (NEFT / RTGS)</option>
                  <option value="upi">UPI Transfer</option>
                  <option value="cheque">Cheque</option>
                  <option value="cash">Cash</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Reference / UTR Number
                </label>
                <input
                  type="text"
                  placeholder="e.g. UTR123456789"
                  value={payRef}
                  onChange={(e) => setPayRef(e.target.value)}
                  className="w-full px-3 py-2 border border-slate-200 rounded-xl text-xs font-mono"
                />
              </div>

              <div className="flex justify-end gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setPaymentModalOpen(false)}
                  className="px-4 py-2 border border-slate-200 text-slate-600 text-xs font-semibold rounded-xl hover:bg-slate-50"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={paymentSubmitting}
                  className="px-4 py-2 bg-emerald-700 text-white text-xs font-bold rounded-xl hover:bg-emerald-800 disabled:opacity-50"
                >
                  {paymentSubmitting ? 'Recording...' : 'Record Payment'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </AdminLayout>
  );
}

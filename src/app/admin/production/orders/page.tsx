'use client';

import React, { useState, useEffect, useCallback } from 'react';
import AdminLayout from '@/components/AdminLayout';
import {
  apiGetProductionOrders,
  apiCreateProductionOrder,
  apiApproveProductionOrder,
  apiStartProductionOrder,
  apiExecuteProductionRun,
  apiGetRecipes,
} from '@/lib/api';
import { ProductionOrder, Recipe } from '@/types/api';

export default function ProductionOrdersPage() {
  const [orders, setOrders] = useState<ProductionOrder[]>([]);
  const [recipes, setRecipes] = useState<Recipe[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [statusFilter, setStatusFilter] = useState('');
  const [search, setSearch] = useState('');

  // Plan Order Modal
  const [createModalOpen, setCreateModalOpen] = useState(false);
  const [selectedRecipeId, setSelectedRecipeId] = useState<number | ''>('');
  const [plannedQuantity, setPlannedQuantity] = useState('200');
  const [startDate, setStartDate] = useState('');
  const [orderNotes, setOrderNotes] = useState('');
  const [createSubmitting, setCreateSubmitting] = useState(false);

  // Execute / Complete Run Modal
  const [executeModalOpen, setExecuteModalOpen] = useState(false);
  const [activeOrder, setActiveOrder] = useState<ProductionOrder | null>(null);
  const [producedQty, setProducedQty] = useState('198');
  const [rejectedQty, setRejectedQty] = useState('2');
  const [expiryDate, setExpiryDate] = useState('');
  const [executeSubmitting, setExecuteSubmitting] = useState(false);

  useEffect(() => {
    const today = new Date();
    setStartDate(today.toISOString().split('T')[0]);
    const exp = new Date();
    exp.setDate(exp.getDate() + 90);
    setExpiryDate(exp.toISOString().split('T')[0]);
  }, []);

  const loadData = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const [ordRes, recRes] = await Promise.all([
        apiGetProductionOrders({
          status: statusFilter || undefined,
          search: search || undefined,
        }),
        apiGetRecipes({ is_active: true }),
      ]);
      setOrders(ordRes.data || []);
      setRecipes(recRes.data || []);
      if (ordRes.error) setError(ordRes.error);
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : 'Failed to load production orders');
    } finally {
      setLoading(false);
    }
  }, [statusFilter, search]);

  useEffect(() => {
    loadData();
  }, [loadData]);

  const handlePlanOrder = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedRecipeId) {
      alert('Please choose a recipe');
      return;
    }
    setCreateSubmitting(true);
    try {
      const res = await apiCreateProductionOrder({
        recipe: Number(selectedRecipeId),
        planned_quantity: Number(plannedQuantity),
        start_date: startDate,
        notes: orderNotes,
      });
      if (res.success) {
        setCreateModalOpen(false);
        loadData();
      } else {
        alert(res.message || 'Failed to create work order');
      }
    } catch (err: unknown) {
      alert(err instanceof Error ? err.message : 'Error planning order');
    } finally {
      setCreateSubmitting(false);
    }
  };

  const handleApprove = async (id: number) => {
    try {
      const res = await apiApproveProductionOrder(id);
      if (res.success) {
        loadData();
      } else {
        alert(res.message || 'Approval failed');
      }
    } catch (err) {
      console.error(err);
    }
  };

  const handleStart = async (id: number) => {
    try {
      const res = await apiStartProductionOrder(id);
      if (res.success) {
        loadData();
      } else {
        alert(res.message || 'Failed to start kitchen run');
      }
    } catch (err) {
      console.error(err);
    }
  };

  const openExecuteModal = (order: ProductionOrder) => {
    setActiveOrder(order);
    setProducedQty(String(order.planned_quantity));
    setRejectedQty('0');
    setExecuteModalOpen(true);
  };

  const handleExecuteRun = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!activeOrder) return;
    setExecuteSubmitting(true);
    try {
      const res = await apiExecuteProductionRun(activeOrder.id, {
        produced_quantity: Number(producedQty),
        rejected_quantity: Number(rejectedQty),
        expiry_date: expiryDate,
      });

      if (res.success) {
        setExecuteModalOpen(false);
        loadData();
      } else {
        alert(res.message || 'Execution failed');
      }
    } catch (err: unknown) {
      alert(err instanceof Error ? err.message : 'Error completing production run');
    } finally {
      setExecuteSubmitting(false);
    }
  };

  return (
    <AdminLayout
      title="Production Orders & Kitchen Workflows"
      subtitle="Plan batches, dispatch to Vandiperiyar frying lines, track material consumptions, and send to QC."
      actions={
        <div className="flex items-center gap-2">
          <button
            onClick={() => setCreateModalOpen(true)}
            className="px-4 py-2 bg-gradient-to-r from-[#093725] to-[#15803d] text-amber-300 rounded-xl text-xs font-bold hover:shadow-md transition"
          >
            + Plan Work Order
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

      {/* Filter Bar */}
      <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-2xs mb-6 flex flex-wrap items-center justify-between gap-3">
        <div className="flex flex-wrap items-center gap-3">
          <input
            type="text"
            placeholder="Search order #, product variant, recipe..."
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
            <option value="planned">Planned</option>
            <option value="approved">Approved</option>
            <option value="in_progress">In Progress</option>
            <option value="quality_check">Quality Check</option>
            <option value="completed">Completed & Released</option>
            <option value="cancelled">Cancelled</option>
          </select>
        </div>
        <div className="text-xs font-semibold text-slate-500">
          Showing <span className="text-slate-900 font-bold">{orders.length}</span> production orders
        </div>
      </div>

      {/* Production Orders Table */}
      <div className="bg-white rounded-2xl border border-slate-200 shadow-2xs overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-slate-50/75 border-b border-slate-100 text-slate-500 uppercase tracking-wider font-semibold">
              <tr>
                <th className="py-3.5 px-4">Order Number & Date</th>
                <th className="py-3.5 px-4">Product Variant</th>
                <th className="py-3.5 px-4">Target vs Produced</th>
                <th className="py-3.5 px-4">Finished Batch</th>
                <th className="py-3.5 px-4">True Unit Cost</th>
                <th className="py-3.5 px-4">Status</th>
                <th className="py-3.5 px-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {loading ? (
                <tr>
                  <td colSpan={7} className="py-8 text-center text-slate-400">
                    Loading production orders...
                  </td>
                </tr>
              ) : orders.length === 0 ? (
                <tr>
                  <td colSpan={7} className="py-8 text-center text-slate-400">
                    No production orders found. Click &quot;+ Plan Work Order&quot; to begin.
                  </td>
                </tr>
              ) : (
                orders.map((ord) => (
                  <tr key={ord.id} className="hover:bg-slate-50/60 transition">
                    <td className="py-3.5 px-4">
                      <div className="font-mono font-bold text-slate-900">{ord.order_number}</div>
                      <div className="text-[11px] text-slate-400 font-mono">
                        Started: {ord.start_date}
                      </div>
                    </td>
                    <td className="py-3.5 px-4">
                      <div className="font-semibold text-slate-900">{ord.product_name}</div>
                      <div className="text-[11px] text-slate-500 font-mono">
                        {ord.variant_sku} ({ord.variant_weight})
                      </div>
                    </td>
                    <td className="py-3.5 px-4">
                      <div className="text-sm font-bold text-slate-900">
                        {ord.produced_quantity || '—'} / {ord.planned_quantity} pkts
                      </div>
                      {ord.rejected_quantity > 0 && (
                        <div className="text-[10px] text-red-600 font-semibold">
                          Rejects: {ord.rejected_quantity}
                        </div>
                      )}
                    </td>
                    <td className="py-3.5 px-4">
                      {ord.batch_number ? (
                        <div>
                          <div className="font-mono font-bold text-slate-900 text-xs">
                            {ord.batch_number}
                          </div>
                          <span
                            className={`inline-flex px-1.5 py-0.5 rounded text-[9px] font-bold uppercase tracking-wider ${
                              ord.batch_status === 'completed'
                                ? 'bg-emerald-100 text-emerald-800'
                                : ord.batch_status === 'quarantined'
                                ? 'bg-amber-100 text-amber-800'
                                : 'bg-slate-100 text-slate-700'
                            }`}
                          >
                            {ord.batch_status}
                          </span>
                        </div>
                      ) : (
                        <span className="text-slate-400 text-[11px] italic">Pending run completion</span>
                      )}
                    </td>
                    <td className="py-3.5 px-4 font-semibold text-slate-900">
                      <div>₹{Number(ord.cost_per_unit || 0).toFixed(2)} / pkt</div>
                      <div className="text-[10px] text-slate-400">
                        Total: ₹{Number(ord.total_production_cost || 0).toFixed(2)}
                      </div>
                    </td>
                    <td className="py-3.5 px-4">
                      <span
                        className={`inline-flex px-2 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider ${
                          ord.status === 'completed'
                            ? 'bg-emerald-100 text-emerald-800'
                            : ord.status === 'quality_check'
                            ? 'bg-amber-100 text-amber-800'
                            : ord.status === 'in_progress'
                            ? 'bg-blue-100 text-blue-800'
                            : ord.status === 'approved'
                            ? 'bg-purple-100 text-purple-800'
                            : 'bg-slate-100 text-slate-700'
                        }`}
                      >
                        {ord.status.replace('_', ' ')}
                      </span>
                    </td>
                    <td className="py-3.5 px-4 text-right">
                      <div className="flex items-center justify-end gap-1.5">
                        {ord.status === 'planned' && (
                          <button
                            onClick={() => handleApprove(ord.id)}
                            className="px-2.5 py-1 bg-purple-50 hover:bg-purple-100 text-purple-900 rounded-lg text-[11px] font-bold transition"
                          >
                            Approve
                          </button>
                        )}
                        {(ord.status === 'planned' || ord.status === 'approved') && (
                          <button
                            onClick={() => handleStart(ord.id)}
                            className="px-2.5 py-1 bg-blue-50 hover:bg-blue-100 text-blue-900 rounded-lg text-[11px] font-bold transition"
                          >
                            Start Run
                          </button>
                        )}
                        {ord.status === 'in_progress' && (
                          <button
                            onClick={() => openExecuteModal(ord)}
                            className="px-2.5 py-1 bg-emerald-600 hover:bg-emerald-700 text-white rounded-lg text-[11px] font-bold transition shadow-xs"
                          >
                            Complete & QC
                          </button>
                        )}
                        {ord.status === 'quality_check' && (
                          <span className="text-[11px] font-bold text-amber-700 bg-amber-50 px-2 py-0.5 rounded-md">
                            At QC Inspection
                          </span>
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

      {/* Plan Work Order Modal */}
      {createModalOpen && (
        <div className="fixed inset-0 z-50 bg-black/40 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl max-w-lg w-full p-6 shadow-2xl border border-slate-200">
            <h3 className="text-base font-bold text-slate-900 mb-1">Plan Production Order</h3>
            <p className="text-xs text-slate-500 mb-4">
              Schedule cooking, frying, seasoning, and packaging batch in Vandiperiyar kitchen.
            </p>

            <form onSubmit={handlePlanOrder} className="space-y-3">
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Master Recipe (BOM) *
                </label>
                <select
                  required
                  value={selectedRecipeId}
                  onChange={(e) => setSelectedRecipeId(Number(e.target.value))}
                  className="w-full px-3 py-2 border border-slate-200 rounded-xl text-xs focus:outline-emerald-600"
                >
                  <option value="">Select Recipe</option>
                  {recipes.map((r) => (
                    <option key={r.id} value={r.id}>
                      {r.name} ({r.recipe_code}) [{r.product_name}]
                    </option>
                  ))}
                </select>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">
                    Planned Quantity (Packets) *
                  </label>
                  <input
                    type="number"
                    min="1"
                    required
                    value={plannedQuantity}
                    onChange={(e) => setPlannedQuantity(e.target.value)}
                    className="w-full px-3 py-2 border border-slate-200 rounded-xl text-xs font-bold"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">
                    Scheduled Start Date *
                  </label>
                  <input
                    type="date"
                    required
                    value={startDate}
                    onChange={(e) => setStartDate(e.target.value)}
                    className="w-full px-3 py-2 border border-slate-200 rounded-xl text-xs"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Production Notes / Shift Instructions
                </label>
                <textarea
                  rows={2}
                  placeholder="e.g. Early morning shift, extra crispy batch for B2B export cartons"
                  value={orderNotes}
                  onChange={(e) => setOrderNotes(e.target.value)}
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
                  {createSubmitting ? 'Creating...' : 'Schedule Order'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Complete Run & Send to QC Modal */}
      {executeModalOpen && activeOrder && (
        <div className="fixed inset-0 z-50 bg-black/40 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl max-w-lg w-full p-6 shadow-2xl border border-slate-200">
            <h3 className="text-base font-bold text-slate-900 mb-1">
              Complete Kitchen Production: {activeOrder.order_number}
            </h3>
            <p className="text-xs text-slate-500 mb-4">
              {activeOrder.product_name} ({activeOrder.variant_sku}). Records actual finished yield,
              deducts raw ingredients from inventory, and generates a quarantined batch for QC testing.
            </p>

            <form onSubmit={handleExecuteRun} className="space-y-4">
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">
                    Accepted Finished Units (Pkts) *
                  </label>
                  <input
                    type="number"
                    min="1"
                    required
                    value={producedQty}
                    onChange={(e) => setProducedQty(e.target.value)}
                    className="w-full px-3 py-2 border border-slate-200 rounded-xl text-xs font-bold text-emerald-800 text-lg"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">
                    Rejected / Damaged Units
                  </label>
                  <input
                    type="number"
                    min="0"
                    value={rejectedQty}
                    onChange={(e) => setRejectedQty(e.target.value)}
                    className="w-full px-3 py-2 border border-slate-200 rounded-xl text-xs font-bold text-red-600"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Batch Expiry Date (Best Before) *
                </label>
                <input
                  type="date"
                  required
                  value={expiryDate}
                  onChange={(e) => setExpiryDate(e.target.value)}
                  className="w-full px-3 py-2 border border-slate-200 rounded-xl text-xs font-bold"
                />
              </div>

              <div className="p-3.5 bg-amber-50 rounded-2xl border border-amber-200 text-xs text-amber-900 leading-relaxed">
                🛡️ <strong>Quality Assurance Gate:</strong> This batch will be registered in{' '}
                <strong>Quarantined</strong> status and cannot be sold to retail or wholesale customers
                until passed by the Quality Inspector.
              </div>

              <div className="flex justify-end gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setExecuteModalOpen(false)}
                  className="px-4 py-2 border border-slate-200 text-slate-600 text-xs font-semibold rounded-xl hover:bg-slate-50"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={executeSubmitting}
                  className="px-4 py-2 bg-emerald-700 text-white text-xs font-bold rounded-xl hover:bg-emerald-800 disabled:opacity-50"
                >
                  {executeSubmitting ? 'Processing...' : 'Deduct Stock & Send to QC'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </AdminLayout>
  );
}

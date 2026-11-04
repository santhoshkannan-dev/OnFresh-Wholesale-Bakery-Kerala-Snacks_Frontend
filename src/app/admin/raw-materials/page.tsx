'use client';

import React, { useState, useEffect, useCallback } from 'react';
import AdminLayout from '@/components/AdminLayout';
import {
  apiGetRawMaterials,
  apiGetRawMaterialCategories,
  apiCreateRawMaterial,
  apiAdjustRawMaterialStock,
  apiGetRawMaterialMovements,
} from '@/lib/api';
import { RawMaterial, RawMaterialCategory, RawMaterialMovement } from '@/types/api';

export default function RawMaterialsPage() {
  const [materials, setMaterials] = useState<RawMaterial[]>([]);
  const [categories, setCategories] = useState<RawMaterialCategory[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Filters
  const [search, setSearch] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('');
  const [lowStockOnly, setLowStockOnly] = useState(false);

  // Adjust stock modal
  const [adjustModalOpen, setAdjustModalOpen] = useState(false);
  const [selectedMaterial, setSelectedMaterial] = useState<RawMaterial | null>(null);
  const [newStockInput, setNewStockInput] = useState('');
  const [adjustNotes, setAdjustNotes] = useState('');
  const [adjustSubmitting, setAdjustSubmitting] = useState(false);

  // Create material modal
  const [createModalOpen, setCreateModalOpen] = useState(false);
  const [newCode, setNewCode] = useState('');
  const [newName, setNewName] = useState('');
  const [newCategory, setNewCategory] = useState<number | ''>('');
  const [newUnit, setNewUnit] = useState('kg');
  const [newStock, setNewStock] = useState('0');
  const [newMinStock, setNewMinStock] = useState('10');
  const [newReorderQty, setNewReorderQty] = useState('50');
  const [newUnitCost, setNewUnitCost] = useState('0');
  const [newLocation, setNewLocation] = useState('');
  const [newNotes, setNewNotes] = useState('');
  const [createSubmitting, setCreateSubmitting] = useState(false);

  // Movement history modal
  const [movementsModalOpen, setMovementsModalOpen] = useState(false);
  const [movements, setMovements] = useState<RawMaterialMovement[]>([]);
  const [movementsLoading, setMovementsLoading] = useState(false);

  const loadData = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const [matRes, catRes] = await Promise.all([
        apiGetRawMaterials({
          category: selectedCategory || undefined,
          low_stock: lowStockOnly || undefined,
          search: search || undefined,
        }),
        apiGetRawMaterialCategories(),
      ]);
      setMaterials(matRes.data || []);
      setCategories(catRes.data || []);
      if (matRes.error) setError(matRes.error);
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : 'Failed to load materials');
    } finally {
      setLoading(false);
    }
  }, [selectedCategory, lowStockOnly, search]);

  useEffect(() => {
    loadData();
  }, [loadData]);

  const openAdjustModal = (mat: RawMaterial) => {
    setSelectedMaterial(mat);
    setNewStockInput(String(mat.current_stock));
    setAdjustNotes('');
    setAdjustModalOpen(true);
  };

  const handleAdjustSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedMaterial) return;
    setAdjustSubmitting(true);
    try {
      const res = await apiAdjustRawMaterialStock(selectedMaterial.id, {
        new_quantity: newStockInput,
        notes: adjustNotes || 'Physical inventory audit adjustment',
      });
      if (res.success) {
        setAdjustModalOpen(false);
        loadData();
      } else {
        alert(res.message || 'Failed to adjust stock');
      }
    } catch (err: unknown) {
      alert(err instanceof Error ? err.message : 'Error adjusting stock');
    } finally {
      setAdjustSubmitting(false);
    }
  };

  const handleCreateSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newCategory) {
      alert('Please select a category');
      return;
    }
    setCreateSubmitting(true);
    try {
      const res = await apiCreateRawMaterial({
        material_code: newCode,
        name: newName,
        category: Number(newCategory),
        unit_of_measure: newUnit,
        current_stock: newStock,
        minimum_stock_level: newMinStock,
        reorder_quantity: newReorderQty,
        unit_cost: newUnitCost,
        storage_location: newLocation,
        notes: newNotes,
      });
      if (res.success) {
        setCreateModalOpen(false);
        setNewCode('');
        setNewName('');
        setNewStock('0');
        loadData();
      } else {
        alert(res.message || 'Failed to create material');
      }
    } catch (err: unknown) {
      alert(err instanceof Error ? err.message : 'Error creating material');
    } finally {
      setCreateSubmitting(false);
    }
  };

  const openMovementsModal = async (mat: RawMaterial) => {
    setSelectedMaterial(mat);
    setMovementsModalOpen(true);
    setMovementsLoading(true);
    try {
      const res = await apiGetRawMaterialMovements({ material_id: mat.id });
      setMovements(res.data || []);
    } catch (err) {
      console.error(err);
    } finally {
      setMovementsLoading(false);
    }
  };

  return (
    <AdminLayout
      title="Raw Materials & Packaging Inventory"
      subtitle="Track agricultural ingredients, oils, spices, pouches, cartons, and physical audits in Vandiperiyar."
      actions={
        <div className="flex items-center gap-2">
          <button
            onClick={() => setCreateModalOpen(true)}
            className="px-4 py-2 bg-gradient-to-r from-[#093725] to-[#15803d] text-amber-300 rounded-xl text-xs font-bold hover:shadow-md transition"
          >
            + Add Material
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
            placeholder="Search code, name, location..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs focus:outline-emerald-600 w-64"
          />
          <select
            value={selectedCategory}
            onChange={(e) => setSelectedCategory(e.target.value)}
            className="px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-700 focus:outline-emerald-600"
          >
            <option value="">All Categories</option>
            {categories.map((c) => (
              <option key={c.id} value={c.slug}>
                {c.name}
              </option>
            ))}
          </select>
          <label className="flex items-center gap-2 text-xs font-semibold text-slate-700 cursor-pointer select-none">
            <input
              type="checkbox"
              checked={lowStockOnly}
              onChange={(e) => setLowStockOnly(e.target.checked)}
              className="rounded text-emerald-600 focus:ring-emerald-500"
            />
            <span>Low Stock Alerts Only</span>
          </label>
        </div>

        <div className="text-xs font-semibold text-slate-500">
          Showing <span className="text-slate-900 font-bold">{materials.length}</span> materials
        </div>
      </div>

      {/* Materials Table */}
      <div className="bg-white rounded-2xl border border-slate-200 shadow-2xs overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-slate-50/75 border-b border-slate-100 text-slate-500 uppercase tracking-wider font-semibold">
              <tr>
                <th className="py-3.5 px-4">Material Code & Name</th>
                <th className="py-3.5 px-4">Category</th>
                <th className="py-3.5 px-4">Current Stock</th>
                <th className="py-3.5 px-4">Min / Reorder</th>
                <th className="py-3.5 px-4">Unit Cost</th>
                <th className="py-3.5 px-4">Total Value</th>
                <th className="py-3.5 px-4">Location</th>
                <th className="py-3.5 px-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {loading ? (
                <tr>
                  <td colSpan={8} className="py-8 text-center text-slate-400">
                    Loading raw materials inventory...
                  </td>
                </tr>
              ) : materials.length === 0 ? (
                <tr>
                  <td colSpan={8} className="py-8 text-center text-slate-400">
                    No materials found matching your criteria.
                  </td>
                </tr>
              ) : (
                materials.map((m) => (
                  <tr key={m.id} className="hover:bg-slate-50/60 transition">
                    <td className="py-3.5 px-4">
                      <div className="font-bold text-slate-900">{m.name}</div>
                      <div className="text-[11px] font-mono text-slate-400">{m.material_code}</div>
                    </td>
                    <td className="py-3.5 px-4">
                      <span className="inline-flex px-2 py-0.5 rounded-md text-[11px] font-medium bg-slate-100 text-slate-700">
                        {m.category_name}
                      </span>
                    </td>
                    <td className="py-3.5 px-4">
                      <div className="flex items-center gap-1.5">
                        <span
                          className={`font-black text-sm ${
                            m.is_out_of_stock
                              ? 'text-red-600'
                              : m.is_low_stock
                              ? 'text-amber-600'
                              : 'text-slate-900'
                          }`}
                        >
                          {Number(m.current_stock).toFixed(2)}
                        </span>
                        <span className="text-[11px] text-slate-400 font-semibold uppercase">
                          {m.unit_of_measure}
                        </span>
                      </div>
                      {m.is_low_stock && (
                        <div className="text-[10px] text-amber-600 font-bold">⚠️ Reorder needed</div>
                      )}
                      {m.is_out_of_stock && (
                        <div className="text-[10px] text-red-600 font-bold">❌ Depleted</div>
                      )}
                    </td>
                    <td className="py-3.5 px-4 text-slate-500">
                      <div>Min: {Number(m.minimum_stock_level).toFixed(1)}</div>
                      <div className="text-[10px] text-slate-400">
                        Reorder: {Number(m.reorder_quantity).toFixed(1)}
                      </div>
                    </td>
                    <td className="py-3.5 px-4 font-semibold text-slate-900">
                      ₹{Number(m.unit_cost).toFixed(2)} / {m.unit_of_measure}
                    </td>
                    <td className="py-3.5 px-4 font-bold text-slate-900">
                      ₹{Number(m.total_stock_value || 0).toLocaleString('en-IN', {
                        minimumFractionDigits: 2,
                      })}
                    </td>
                    <td className="py-3.5 px-4 text-slate-500 text-[11px]">
                      {m.storage_location || '—'}
                    </td>
                    <td className="py-3.5 px-4 text-right">
                      <div className="flex items-center justify-end gap-1.5">
                        <button
                          onClick={() => openAdjustModal(m)}
                          className="px-2.5 py-1 bg-amber-50 hover:bg-amber-100 text-amber-900 rounded-lg text-[11px] font-bold transition"
                          title="Record physical count audit adjustment"
                        >
                          Audit
                        </button>
                        <button
                          onClick={() => openMovementsModal(m)}
                          className="px-2.5 py-1 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-lg text-[11px] font-semibold transition"
                          title="View inward/outward history"
                        >
                          History
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Audit / Adjust Stock Modal */}
      {adjustModalOpen && selectedMaterial && (
        <div className="fixed inset-0 z-50 bg-black/40 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl max-w-md w-full p-6 shadow-2xl border border-slate-200">
            <h3 className="text-base font-bold text-slate-900 mb-1">
              Adjust Physical Stock Balance
            </h3>
            <p className="text-xs text-slate-500 mb-4">
              {selectedMaterial.name} ({selectedMaterial.material_code})
            </p>

            <form onSubmit={handleAdjustSubmit} className="space-y-4">
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Current System Balance
                </label>
                <div className="px-3 py-2 bg-slate-100 rounded-xl text-xs font-bold text-slate-700">
                  {selectedMaterial.current_stock} {selectedMaterial.unit_of_measure}
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Verified Physical Count ({selectedMaterial.unit_of_measure}) *
                </label>
                <input
                  type="number"
                  step="0.001"
                  min="0"
                  required
                  value={newStockInput}
                  onChange={(e) => setNewStockInput(e.target.value)}
                  className="w-full px-3 py-2 border border-slate-200 rounded-xl text-xs focus:outline-emerald-600 font-bold"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Audit Notes / Reason *
                </label>
                <textarea
                  required
                  rows={2}
                  placeholder="e.g. Month-end physical stock taking discrepancy"
                  value={adjustNotes}
                  onChange={(e) => setAdjustNotes(e.target.value)}
                  className="w-full px-3 py-2 border border-slate-200 rounded-xl text-xs focus:outline-emerald-600"
                />
              </div>

              <div className="flex justify-end gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setAdjustModalOpen(false)}
                  className="px-4 py-2 border border-slate-200 text-slate-600 text-xs font-semibold rounded-xl hover:bg-slate-50"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={adjustSubmitting}
                  className="px-4 py-2 bg-emerald-700 text-white text-xs font-bold rounded-xl hover:bg-emerald-800 disabled:opacity-50"
                >
                  {adjustSubmitting ? 'Saving...' : 'Confirm Adjustment'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Create Material Modal */}
      {createModalOpen && (
        <div className="fixed inset-0 z-50 bg-black/40 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl max-w-lg w-full p-6 shadow-2xl border border-slate-200 max-h-[90vh] overflow-y-auto">
            <h3 className="text-base font-bold text-slate-900 mb-1">Add New Material</h3>
            <p className="text-xs text-slate-500 mb-4">
              Register agricultural crops, oils, spices, or packaging items into Vandiperiyar inventory.
            </p>

            <form onSubmit={handleCreateSubmit} className="space-y-3">
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">
                    Material Code *
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. RM-BAN-002"
                    value={newCode}
                    onChange={(e) => setNewCode(e.target.value)}
                    className="w-full px-3 py-2 border border-slate-200 rounded-xl text-xs font-mono font-bold focus:outline-emerald-600"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">
                    Category *
                  </label>
                  <select
                    required
                    value={newCategory}
                    onChange={(e) => setNewCategory(Number(e.target.value))}
                    className="w-full px-3 py-2 border border-slate-200 rounded-xl text-xs focus:outline-emerald-600"
                  >
                    <option value="">Select Category</option>
                    {categories.map((c) => (
                      <option key={c.id} value={c.id}>
                        {c.name}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Material Name *
                </label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Raw Nendran Banana Grade A"
                  value={newName}
                  onChange={(e) => setNewName(e.target.value)}
                  className="w-full px-3 py-2 border border-slate-200 rounded-xl text-xs focus:outline-emerald-600"
                />
              </div>

              <div className="grid grid-cols-3 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">Unit *</label>
                  <select
                    value={newUnit}
                    onChange={(e) => setNewUnit(e.target.value)}
                    className="w-full px-3 py-2 border border-slate-200 rounded-xl text-xs"
                  >
                    <option value="kg">kg</option>
                    <option value="g">g</option>
                    <option value="l">l</option>
                    <option value="ml">ml</option>
                    <option value="pcs">pcs</option>
                    <option value="box">box</option>
                  </select>
                </div>
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">
                    Initial Stock
                  </label>
                  <input
                    type="number"
                    step="0.001"
                    min="0"
                    value={newStock}
                    onChange={(e) => setNewStock(e.target.value)}
                    className="w-full px-3 py-2 border border-slate-200 rounded-xl text-xs"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">
                    Unit Cost (₹)
                  </label>
                  <input
                    type="number"
                    step="0.01"
                    min="0"
                    value={newUnitCost}
                    onChange={(e) => setNewUnitCost(e.target.value)}
                    className="w-full px-3 py-2 border border-slate-200 rounded-xl text-xs"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">
                    Reorder Min Level
                  </label>
                  <input
                    type="number"
                    step="0.001"
                    min="0"
                    value={newMinStock}
                    onChange={(e) => setNewMinStock(e.target.value)}
                    className="w-full px-3 py-2 border border-slate-200 rounded-xl text-xs"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">
                    Suggested Reorder Qty
                  </label>
                  <input
                    type="number"
                    step="0.001"
                    min="0"
                    value={newReorderQty}
                    onChange={(e) => setNewReorderQty(e.target.value)}
                    className="w-full px-3 py-2 border border-slate-200 rounded-xl text-xs"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Storage Location
                </label>
                <input
                  type="text"
                  placeholder="e.g. Cold Store Bay 1, Spice Loft"
                  value={newLocation}
                  onChange={(e) => setNewLocation(e.target.value)}
                  className="w-full px-3 py-2 border border-slate-200 rounded-xl text-xs"
                />
              </div>

              <div className="flex justify-end gap-2 pt-3">
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
                  {createSubmitting ? 'Adding...' : 'Create Material'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Movement History Drawer Modal */}
      {movementsModalOpen && selectedMaterial && (
        <div className="fixed inset-0 z-50 bg-black/40 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl max-w-2xl w-full p-6 shadow-2xl border border-slate-200 max-h-[85vh] flex flex-col">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <div>
                <h3 className="text-base font-bold text-slate-900">
                  Inventory Movements: {selectedMaterial.name}
                </h3>
                <p className="text-xs font-mono text-slate-500">
                  {selectedMaterial.material_code} · Current: {selectedMaterial.current_stock}{' '}
                  {selectedMaterial.unit_of_measure}
                </p>
              </div>
              <button
                onClick={() => setMovementsModalOpen(false)}
                className="w-8 h-8 rounded-full bg-slate-100 hover:bg-slate-200 text-slate-600 flex items-center justify-center text-sm font-bold"
              >
                ✕
              </button>
            </div>

            <div className="flex-1 overflow-y-auto my-4">
              {movementsLoading ? (
                <div className="p-8 text-center text-xs text-slate-400">Loading history...</div>
              ) : movements.length === 0 ? (
                <div className="p-8 text-center text-xs text-slate-400">
                  No inward or outward stock movements recorded for this item yet.
                </div>
              ) : (
                <table className="w-full text-left text-xs">
                  <thead className="bg-slate-50 text-slate-500 uppercase tracking-wider font-semibold">
                    <tr>
                      <th className="py-2.5 px-3">Date</th>
                      <th className="py-2.5 px-3">Type</th>
                      <th className="py-2.5 px-3">Quantity</th>
                      <th className="py-2.5 px-3">Balance After</th>
                      <th className="py-2.5 px-3">Ref & Notes</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100">
                    {movements.map((mv) => (
                      <tr key={mv.id}>
                        <td className="py-2.5 px-3 text-slate-500">
                          {new Date(mv.created_at).toLocaleDateString('en-IN', {
                            day: 'numeric',
                            month: 'short',
                            hour: '2-digit',
                            minute: '2-digit',
                          })}
                        </td>
                        <td className="py-2.5 px-3">
                          <span
                            className={`inline-flex px-2 py-0.5 rounded text-[10px] font-bold uppercase tracking-wider ${
                              mv.movement_type === 'purchase_in'
                                ? 'bg-emerald-100 text-emerald-800'
                                : mv.movement_type === 'production_consumption'
                                ? 'bg-blue-100 text-blue-800'
                                : mv.movement_type === 'wastage'
                                ? 'bg-red-100 text-red-800'
                                : 'bg-amber-100 text-amber-800'
                            }`}
                          >
                            {mv.movement_type.replace('_', ' ')}
                          </span>
                        </td>
                        <td className="py-2.5 px-3 font-bold text-slate-900">
                          {mv.movement_type === 'purchase_in' ? '+' : '-'}
                          {Number(mv.quantity).toFixed(2)} {mv.unit}
                        </td>
                        <td className="py-2.5 px-3 font-semibold text-slate-700">
                          {Number(mv.balance_after).toFixed(2)} {mv.unit}
                        </td>
                        <td className="py-2.5 px-3 text-slate-500">
                          <div className="font-mono text-[11px] text-slate-700">
                            {mv.reference_number || '—'}
                          </div>
                          <div className="text-[10px] text-slate-400">{mv.notes}</div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              )}
            </div>

            <div className="pt-2 border-t border-slate-100 flex justify-end">
              <button
                onClick={() => setMovementsModalOpen(false)}
                className="px-4 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-semibold rounded-xl"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </AdminLayout>
  );
}


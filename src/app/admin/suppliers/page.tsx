'use client';

import React, { useState, useEffect, useCallback } from 'react';
import AdminLayout from '@/components/AdminLayout';
import {
  apiGetSuppliers,
  apiCreateSupplier,
  apiGetRawMaterials,
  apiAssignSupplierMaterial,
} from '@/lib/api';
import { Supplier, RawMaterial } from '@/types/api';

export default function SuppliersPage() {
  const [suppliers, setSuppliers] = useState<Supplier[]>([]);
  const [materials, setMaterials] = useState<RawMaterial[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [search, setSearch] = useState('');

  // Create supplier modal
  const [createModalOpen, setCreateModalOpen] = useState(false);
  const [newCode, setNewCode] = useState('');
  const [newName, setNewName] = useState('');
  const [newContact, setNewContact] = useState('');
  const [newPhone, setNewPhone] = useState('');
  const [newEmail, setNewEmail] = useState('');
  const [newAddress, setNewAddress] = useState('');
  const [newCity, setNewCity] = useState('Vandiperiyar');
  const [newGstin, setNewGstin] = useState('');
  const [newTerms, setNewTerms] = useState('Net 15 days');
  const [newLeadTime, setNewLeadTime] = useState(3);
  const [createSubmitting, setCreateSubmitting] = useState(false);

  // Assign material modal
  const [assignModalOpen, setAssignModalOpen] = useState(false);
  const [selectedSupplier, setSelectedSupplier] = useState<Supplier | null>(null);
  const [selectedMaterialId, setSelectedMaterialId] = useState<number | ''>('');
  const [quotedPrice, setQuotedPrice] = useState('');
  const [minOrderQty, setMinOrderQty] = useState('1');
  const [isPreferred, setIsPreferred] = useState(false);
  const [assignSubmitting, setAssignSubmitting] = useState(false);

  const loadData = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const [supRes, matRes] = await Promise.all([
        apiGetSuppliers(search || undefined),
        apiGetRawMaterials(),
      ]);
      setSuppliers(supRes.data || []);
      setMaterials(matRes.data || []);
      if (supRes.error) setError(supRes.error);
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : 'Failed to load suppliers');
    } finally {
      setLoading(false);
    }
  }, [search]);

  useEffect(() => {
    loadData();
  }, [loadData]);

  const handleCreateSupplier = async (e: React.FormEvent) => {
    e.preventDefault();
    setCreateSubmitting(true);
    try {
      const res = await apiCreateSupplier({
        supplier_code: newCode,
        name: newName,
        contact_person: newContact,
        phone: newPhone,
        email: newEmail,
        address_line1: newAddress,
        city: newCity,
        state: 'Kerala',
        gstin: newGstin,
        payment_terms: newTerms,
        lead_time_days: Number(newLeadTime),
      });
      if (res.success) {
        setCreateModalOpen(false);
        setNewCode('');
        setNewName('');
        setNewPhone('');
        loadData();
      } else {
        alert(res.message || 'Failed to create supplier');
      }
    } catch (err: unknown) {
      alert(err instanceof Error ? err.message : 'Error creating supplier');
    } finally {
      setCreateSubmitting(false);
    }
  };

  const openAssignModal = (sup: Supplier) => {
    setSelectedSupplier(sup);
    setSelectedMaterialId('');
    setQuotedPrice('');
    setMinOrderQty('1');
    setIsPreferred(false);
    setAssignModalOpen(true);
  };

  const handleAssignMaterial = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedSupplier || !selectedMaterialId) return;
    setAssignSubmitting(true);
    try {
      const res = await apiAssignSupplierMaterial(selectedSupplier.id, {
        material_id: Number(selectedMaterialId),
        quoted_price: quotedPrice || 0,
        minimum_order_qty: minOrderQty || 1,
        is_preferred: isPreferred,
      });
      if (res.success) {
        setAssignModalOpen(false);
        loadData();
      } else {
        alert(res.message || 'Failed to link material');
      }
    } catch (err: unknown) {
      alert(err instanceof Error ? err.message : 'Error linking material');
    } finally {
      setAssignSubmitting(false);
    }
  };

  return (
    <AdminLayout
      title="Supplier Management"
      subtitle="Directory of agricultural growers, oil mills, spice farms, and packaging converters supplying Vandiperiyar."
      actions={
        <div className="flex items-center gap-2">
          <button
            onClick={() => setCreateModalOpen(true)}
            className="px-4 py-2 bg-gradient-to-r from-[#093725] to-[#15803d] text-amber-300 rounded-xl text-xs font-bold hover:shadow-md transition"
          >
            + New Supplier
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

      {/* Search Header */}
      <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-2xs mb-6 flex flex-wrap items-center justify-between gap-3">
        <input
          type="text"
          placeholder="Search by vendor name, contact person, phone, GSTIN..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="px-3.5 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs focus:outline-emerald-600 w-80"
        />
        <div className="text-xs font-semibold text-slate-500">
          Showing <span className="text-slate-900 font-bold">{suppliers.length}</span> verified suppliers
        </div>
      </div>

      {/* Supplier Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-5">
        {loading ? (
          <div className="col-span-full py-12 text-center text-slate-400 text-xs">
            Loading supplier directory...
          </div>
        ) : suppliers.length === 0 ? (
          <div className="col-span-full py-12 text-center text-slate-400 text-xs">
            No suppliers found. Click &quot;+ New Supplier&quot; to add your first vendor.
          </div>
        ) : (
          suppliers.map((sup) => (
            <div
              key={sup.id}
              className="bg-white rounded-2xl border border-slate-200 p-5 shadow-2xs hover:shadow-xs transition flex flex-col justify-between"
            >
              <div>
                <div className="flex items-start justify-between mb-3">
                  <div>
                    <h3 className="font-bold text-slate-900 text-sm">{sup.name}</h3>
                    <div className="text-[11px] font-mono text-emerald-700 font-semibold">
                      {sup.supplier_code} · {sup.city}, {sup.state}
                    </div>
                  </div>
                  <span className="px-2 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider bg-emerald-100 text-emerald-800">
                    Active
                  </span>
                </div>

                <div className="space-y-1.5 text-xs text-slate-600 mb-4 bg-slate-50 p-3 rounded-xl border border-slate-100">
                  <div className="flex justify-between">
                    <span className="text-slate-400">Contact:</span>
                    <span className="font-semibold text-slate-800">
                      {sup.contact_person || 'N/A'}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-slate-400">Phone:</span>
                    <span className="font-mono font-bold text-slate-900">{sup.phone}</span>
                  </div>
                  {sup.email && (
                    <div className="flex justify-between">
                      <span className="text-slate-400">Email:</span>
                      <span className="text-slate-700 truncate max-w-[180px]">{sup.email}</span>
                    </div>
                  )}
                  <div className="flex justify-between">
                    <span className="text-slate-400">GSTIN:</span>
                    <span className="font-mono font-semibold text-slate-800">
                      {sup.gstin || 'Unregistered'}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-slate-400">Payment Terms:</span>
                    <span className="font-semibold text-slate-800">{sup.payment_terms}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-slate-400">Lead Time:</span>
                    <span className="font-semibold text-slate-800">{sup.lead_time_days} Days</span>
                  </div>
                </div>

                {/* Supplied Materials */}
                <div className="mb-4">
                  <div className="text-[11px] font-bold text-slate-500 uppercase tracking-wider mb-2 flex items-center justify-between">
                    <span>Supplied Materials ({sup.supplied_materials?.length || 0})</span>
                  </div>
                  <div className="flex flex-wrap gap-1.5">
                    {sup.supplied_materials?.length ? (
                      sup.supplied_materials.map((sm) => (
                        <span
                          key={sm.id}
                          className="px-2 py-1 bg-white border border-slate-200 rounded-lg text-[10px] font-semibold text-slate-700 shadow-2xs"
                        >
                          {sm.material_name} · ₹{Number(sm.quoted_price).toFixed(0)}/{sm.unit_of_measure}
                        </span>
                      ))
                    ) : (
                      <span className="text-[11px] text-slate-400 italic">No materials assigned</span>
                    )}
                  </div>
                </div>
              </div>

              <div className="pt-3 border-t border-slate-100 flex items-center justify-between">
                <span className="text-xs text-slate-500 font-semibold">
                  Orders: <strong className="text-slate-800">{sup.total_orders}</strong>
                </span>
                <button
                  onClick={() => openAssignModal(sup)}
                  className="px-3 py-1.5 bg-slate-100 hover:bg-slate-200 text-slate-800 rounded-xl text-xs font-bold transition"
                >
                  + Link Material
                </button>
              </div>
            </div>
          ))
        )}
      </div>

      {/* Create Supplier Modal */}
      {createModalOpen && (
        <div className="fixed inset-0 z-50 bg-black/40 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl max-w-lg w-full p-6 shadow-2xl border border-slate-200 max-h-[90vh] overflow-y-auto">
            <h3 className="text-base font-bold text-slate-900 mb-1">Add New Vendor</h3>
            <p className="text-xs text-slate-500 mb-4">
              Enter supplier business credentials and payment terms.
            </p>

            <form onSubmit={handleCreateSupplier} className="space-y-3">
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">
                    Supplier Code *
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="SUP-AGR-005"
                    value={newCode}
                    onChange={(e) => setNewCode(e.target.value)}
                    className="w-full px-3 py-2 border border-slate-200 rounded-xl text-xs font-mono font-bold"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">
                    Company Name *
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. Periyar Agro Traders"
                    value={newName}
                    onChange={(e) => setNewName(e.target.value)}
                    className="w-full px-3 py-2 border border-slate-200 rounded-xl text-xs"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">
                    Contact Person
                  </label>
                  <input
                    type="text"
                    placeholder="e.g. K. Krishnan"
                    value={newContact}
                    onChange={(e) => setNewContact(e.target.value)}
                    className="w-full px-3 py-2 border border-slate-200 rounded-xl text-xs"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">Phone *</label>
                  <input
                    type="tel"
                    required
                    placeholder="9447XXXXXX"
                    value={newPhone}
                    onChange={(e) => setNewPhone(e.target.value)}
                    className="w-full px-3 py-2 border border-slate-200 rounded-xl text-xs font-mono"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">Email</label>
                <input
                  type="email"
                  placeholder="vendor@example.com"
                  value={newEmail}
                  onChange={(e) => setNewEmail(e.target.value)}
                  className="w-full px-3 py-2 border border-slate-200 rounded-xl text-xs"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">
                    Address Line
                  </label>
                  <input
                    type="text"
                    placeholder="Main Bazaar"
                    value={newAddress}
                    onChange={(e) => setNewAddress(e.target.value)}
                    className="w-full px-3 py-2 border border-slate-200 rounded-xl text-xs"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">City</label>
                  <input
                    type="text"
                    value={newCity}
                    onChange={(e) => setNewCity(e.target.value)}
                    className="w-full px-3 py-2 border border-slate-200 rounded-xl text-xs"
                  />
                </div>
              </div>

              <div className="grid grid-cols-3 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">GSTIN</label>
                  <input
                    type="text"
                    placeholder="32AAAAA0000A1Z5"
                    value={newGstin}
                    onChange={(e) => setNewGstin(e.target.value)}
                    className="w-full px-3 py-2 border border-slate-200 rounded-xl text-xs font-mono"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">
                    Payment Terms
                  </label>
                  <input
                    type="text"
                    value={newTerms}
                    onChange={(e) => setNewTerms(e.target.value)}
                    className="w-full px-3 py-2 border border-slate-200 rounded-xl text-xs"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">
                    Lead Days
                  </label>
                  <input
                    type="number"
                    min="1"
                    value={newLeadTime}
                    onChange={(e) => setNewLeadTime(Number(e.target.value))}
                    className="w-full px-3 py-2 border border-slate-200 rounded-xl text-xs"
                  />
                </div>
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
                  {createSubmitting ? 'Saving...' : 'Add Supplier'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Assign Material Modal */}
      {assignModalOpen && selectedSupplier && (
        <div className="fixed inset-0 z-50 bg-black/40 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl max-w-md w-full p-6 shadow-2xl border border-slate-200">
            <h3 className="text-base font-bold text-slate-900 mb-1">
              Link Material to {selectedSupplier.name}
            </h3>
            <p className="text-xs text-slate-500 mb-4">
              Set standard contract price and minimum order quantity.
            </p>

            <form onSubmit={handleAssignMaterial} className="space-y-3">
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Select Raw Material / Packaging *
                </label>
                <select
                  required
                  value={selectedMaterialId}
                  onChange={(e) => setSelectedMaterialId(Number(e.target.value))}
                  className="w-full px-3 py-2 border border-slate-200 rounded-xl text-xs focus:outline-emerald-600"
                >
                  <option value="">Select Material</option>
                  {materials.map((m) => (
                    <option key={m.id} value={m.id}>
                      {m.name} ({m.material_code}) [{m.unit_of_measure}]
                    </option>
                  ))}
                </select>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">
                    Quoted Price (₹) *
                  </label>
                  <input
                    type="number"
                    step="0.01"
                    min="0"
                    required
                    placeholder="45.00"
                    value={quotedPrice}
                    onChange={(e) => setQuotedPrice(e.target.value)}
                    className="w-full px-3 py-2 border border-slate-200 rounded-xl text-xs"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">
                    Min Order Qty
                  </label>
                  <input
                    type="number"
                    step="1"
                    min="1"
                    value={minOrderQty}
                    onChange={(e) => setMinOrderQty(e.target.value)}
                    className="w-full px-3 py-2 border border-slate-200 rounded-xl text-xs"
                  />
                </div>
              </div>

              <label className="flex items-center gap-2 text-xs font-semibold text-slate-700 cursor-pointer pt-1">
                <input
                  type="checkbox"
                  checked={isPreferred}
                  onChange={(e) => setIsPreferred(e.target.checked)}
                  className="rounded text-emerald-600 focus:ring-emerald-500"
                />
                <span>Set as Preferred Supplier for this item</span>
              </label>

              <div className="flex justify-end gap-2 pt-3">
                <button
                  type="button"
                  onClick={() => setAssignModalOpen(false)}
                  className="px-4 py-2 border border-slate-200 text-slate-600 text-xs font-semibold rounded-xl hover:bg-slate-50"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={assignSubmitting}
                  className="px-4 py-2 bg-emerald-700 text-white text-xs font-bold rounded-xl hover:bg-emerald-800 disabled:opacity-50"
                >
                  {assignSubmitting ? 'Linking...' : 'Confirm Assignment'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </AdminLayout>
  );
}


'use client';

import React, { useState, useEffect, useCallback } from 'react';
import AdminLayout from '@/components/AdminLayout';
import {
  apiGetAdminCustomers,
  apiGetAdminCustomerDetail,
  apiToggleCustomerActive,
  apiAdminWholesaleDecision,
} from '@/lib/api';
import { AdminCustomer } from '@/types/api';

export default function AdminCustomersPage() {
  const [customers, setCustomers] = useState<AdminCustomer[]>([]);
  const [totalCount, setTotalCount] = useState(0);
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(1);

  // Filters
  const [search, setSearch] = useState('');
  const [typeFilter, setTypeFilter] = useState('');
  const [statusFilter, setStatusFilter] = useState('');
  const [activeFilter, setActiveFilter] = useState('');

  // Selected Customer for Details
  const [selectedCustomer, setSelectedCustomer] = useState<AdminCustomer | null>(null);
  const [detailLoading, setDetailLoading] = useState(false);

  // Wholesale Decision Modal
  const [decisionModalOpen, setDecisionModalOpen] = useState(false);
  const [decisionProfileId, setDecisionProfileId] = useState<number | null>(null);
  const [decisionAction, setDecisionAction] = useState<'approve' | 'reject'>('approve');
  const [rejectReason, setRejectReason] = useState('');
  const [processingDecision, setProcessingDecision] = useState(false);

  const loadCustomers = useCallback(async () => {
    setLoading(true);
    try {
      const res = await apiGetAdminCustomers({
        customer_type: typeFilter || undefined,
        wholesale_status: statusFilter || undefined,
        is_active: activeFilter || undefined,
        search: search || undefined,
        page,
      });
      if (res.data) {
        setCustomers(res.data.results || []);
        setTotalCount(res.data.count || 0);
      }
    } catch (err) {
      console.error('Failed to load customers', err);
    } finally {
      setLoading(false);
    }
  }, [typeFilter, statusFilter, activeFilter, search, page]);

  useEffect(() => {
    loadCustomers();
  }, [loadCustomers]);

  const openCustomerDetail = async (id: number) => {
    setDetailLoading(true);
    const res = await apiGetAdminCustomerDetail(id);
    if (res.customer) {
      setSelectedCustomer(res.customer);
    }
    setDetailLoading(false);
  };

  const handleToggleActive = async (cust: AdminCustomer) => {
    const ok = window.confirm(
      `Are you sure you want to ${cust.is_active ? 'deactivate' : 'activate'} ${cust.email}?`
    );
    if (!ok) return;

    const res = await apiToggleCustomerActive(cust.id, !cust.is_active);
    if (res.success) {
      loadCustomers();
      if (selectedCustomer && selectedCustomer.id === cust.id) {
        openCustomerDetail(cust.id);
      }
    }
  };

  const openDecisionModal = (profileId: number, action: 'approve' | 'reject') => {
    setDecisionProfileId(profileId);
    setDecisionAction(action);
    setRejectReason('');
    setDecisionModalOpen(true);
  };

  const submitDecision = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!decisionProfileId) return;

    setProcessingDecision(true);
    const res = await apiAdminWholesaleDecision(
      decisionProfileId,
      decisionAction,
      decisionAction === 'reject' ? rejectReason : undefined
    );
    setProcessingDecision(false);

    if (res.success) {
      setDecisionModalOpen(false);
      loadCustomers();
      if (selectedCustomer && selectedCustomer.id === decisionProfileId) {
        openCustomerDetail(decisionProfileId);
      }
    } else {
      alert(res.message || 'Failed to update wholesale status.');
    }
  };

  return (
    <AdminLayout
      title="Customer Directory"
      subtitle="Manage individual retail shoppers and approved Kerala wholesale business accounts."
      actions={
        <div className="text-xs font-semibold text-slate-500">
          Registered Accounts: <span className="font-bold text-slate-900">{totalCount}</span>
        </div>
      }
    >
      <div className="space-y-6">
        {/* 1. Search and Segment Filters */}
        <div className="bg-white p-4 rounded-2xl border border-slate-200/80 shadow-xs flex flex-wrap items-center justify-between gap-3">
          <div className="flex-1 min-w-[240px]">
            <input
              type="text"
              placeholder="Search by customer name, business, email, phone, GSTIN..."
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
              <option value="">All Wholesale States</option>
              <option value="pending">Pending Approval</option>
              <option value="approved">Approved</option>
              <option value="rejected">Rejected</option>
              <option value="none">Not Requested</option>
            </select>

            <select
              value={activeFilter}
              onChange={(e) => {
                setActiveFilter(e.target.value);
                setPage(1);
              }}
              className="px-3 py-2 text-xs rounded-xl border border-slate-200 bg-white font-medium text-slate-700"
            >
              <option value="">All Account States</option>
              <option value="true">Active Only</option>
              <option value="false">Inactive / Suspended</option>
            </select>
          </div>
        </div>

        {/* 2. Customer Table */}
        <div className="bg-white rounded-2xl border border-slate-200/80 shadow-xs overflow-hidden">
          {loading ? (
            <div className="py-20 text-center text-xs font-semibold text-slate-500">
              Loading customers...
            </div>
          ) : customers.length === 0 ? (
            <div className="py-16 text-center text-xs font-semibold text-slate-400">
              No customer accounts found matching current filters.
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs">
                <thead className="bg-slate-50 border-b border-slate-200 text-slate-500 font-bold uppercase tracking-wider">
                  <tr>
                    <th className="py-3.5 px-4">Customer</th>
                    <th className="py-3.5 px-4">Segment & Business</th>
                    <th className="py-3.5 px-4">Wholesale Status</th>
                    <th className="py-3.5 px-4">Contact</th>
                    <th className="py-3.5 px-4 text-center">Orders</th>
                    <th className="py-3.5 px-4 text-right">Spend (₹)</th>
                    <th className="py-3.5 px-4 text-center">Account</th>
                    <th className="py-3.5 px-4 text-center">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {customers.map((cust) => (
                    <tr key={cust.id} className="hover:bg-slate-50/70 transition">
                      <td className="py-3.5 px-4">
                        <button
                          onClick={() => openCustomerDetail(cust.id)}
                          className="font-bold text-slate-900 hover:text-emerald-700 transition hover:underline text-left block"
                        >
                          {cust.full_name || cust.email}
                        </button>
                        <div className="text-[10.5px] text-slate-500">{cust.email}</div>
                      </td>

                      <td className="py-3.5 px-4">
                        <span
                          className={`inline-block px-2 py-0.5 rounded-full text-[10px] font-bold ${
                            cust.customer_type === 'business'
                              ? 'bg-purple-100 text-purple-800'
                              : 'bg-emerald-100 text-emerald-800'
                          }`}
                        >
                          {cust.customer_type_display}
                        </span>
                        {cust.business_name && (
                          <div className="text-[11px] font-bold text-slate-800 mt-1">
                            {cust.business_name}
                            <span className="text-[10px] text-slate-400 font-normal ml-1">
                              ({cust.business_type_display})
                            </span>
                          </div>
                        )}
                        {cust.gstin && (
                          <div className="text-[10px] font-mono text-slate-400 mt-0.5">
                            GSTIN: {cust.gstin}
                          </div>
                        )}
                      </td>

                      <td className="py-3.5 px-4">
                        <span
                          className={`inline-block px-2 py-0.5 rounded-md text-[10.5px] font-bold ${
                            cust.wholesale_status === 'approved'
                              ? 'bg-emerald-50 text-emerald-700'
                              : cust.wholesale_status === 'pending'
                              ? 'bg-amber-50 text-amber-800 font-extrabold border border-amber-300'
                              : cust.wholesale_status === 'rejected'
                              ? 'bg-red-50 text-red-700'
                              : 'bg-slate-100 text-slate-500'
                          }`}
                        >
                          {cust.wholesale_status_display}
                        </span>
                        {cust.wholesale_status === 'pending' && (
                          <div className="flex gap-1.5 mt-1.5">
                            <button
                              onClick={() => openDecisionModal(cust.id, 'approve')}
                              className="px-2 py-0.5 bg-emerald-600 hover:bg-emerald-700 text-white rounded text-[10px] font-bold transition"
                            >
                              Approve
                            </button>
                            <button
                              onClick={() => openDecisionModal(cust.id, 'reject')}
                              className="px-2 py-0.5 bg-red-100 hover:bg-red-200 text-red-700 rounded text-[10px] font-bold transition"
                            >
                              Reject
                            </button>
                          </div>
                        )}
                      </td>

                      <td className="py-3.5 px-4 text-slate-600">
                        <div>{cust.phone_number}</div>
                        {cust.contact_person && cust.contact_person !== cust.full_name && (
                          <div className="text-[10px] text-slate-400">Attn: {cust.contact_person}</div>
                        )}
                      </td>

                      <td className="py-3.5 px-4 text-center font-bold text-slate-800">
                        {cust.orders_count}
                      </td>

                      <td className="py-3.5 px-4 text-right font-black text-slate-900 text-xs">
                        ₹{Number(cust.total_spent || 0).toLocaleString('en-IN', { minimumFractionDigits: 2 })}
                      </td>

                      <td className="py-3.5 px-4 text-center">
                        <button
                          onClick={() => handleToggleActive(cust)}
                          className={`px-2.5 py-0.5 rounded-full text-[10.5px] font-bold transition ${
                            cust.is_active
                              ? 'bg-emerald-50 text-emerald-700 hover:bg-emerald-100'
                              : 'bg-red-50 text-red-700 hover:bg-red-100'
                          }`}
                          title="Click to toggle active status"
                        >
                          {cust.is_active ? 'Active' : 'Suspended'}
                        </button>
                      </td>

                      <td className="py-3.5 px-4 text-center">
                        <button
                          onClick={() => openCustomerDetail(cust.id)}
                          className="px-2.5 py-1 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-lg text-xs font-semibold transition"
                        >
                          View
                        </button>
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
                Showing {(page - 1) * 20 + 1} to {Math.min(page * 20, totalCount)} of {totalCount} accounts
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

        {/* 3. Customer Details Slideover */}
        {selectedCustomer && (
          <div className="fixed inset-0 z-50 bg-slate-900/40 backdrop-blur-xs flex items-center justify-end">
            <div className="bg-white w-full max-w-lg h-full shadow-2xl overflow-y-auto p-6 flex flex-col justify-between">
              <div>
                <div className="flex items-center justify-between pb-4 border-b border-slate-100">
                  <div>
                    <span className="text-[11px] font-bold text-emerald-700 uppercase tracking-wider block">
                      Customer Profile
                    </span>
                    <h2 className="text-xl font-black text-slate-900">
                      {selectedCustomer.full_name || selectedCustomer.email}
                    </h2>
                  </div>
                  <button
                    onClick={() => setSelectedCustomer(null)}
                    className="p-1.5 text-slate-400 hover:text-slate-800 rounded-lg text-lg"
                  >
                    &times;
                  </button>
                </div>

                {detailLoading ? (
                  <div className="py-20 text-center text-xs font-semibold text-slate-400">
                    Loading profile...
                  </div>
                ) : (
                  <div className="mt-6 space-y-6 text-xs text-slate-700">
                    {/* Status & Segment */}
                    <div className="p-4 bg-slate-50 rounded-xl border border-slate-200 space-y-2">
                      <div className="flex justify-between">
                        <span className="text-slate-500">Segment:</span>
                        <span className="font-bold text-slate-900 capitalize">
                          {selectedCustomer.customer_type}
                        </span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-slate-500">Wholesale Status:</span>
                        <span className="font-bold text-emerald-700">
                          {selectedCustomer.wholesale_status_display}
                        </span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-slate-500">Account Status:</span>
                        <span className="font-bold">
                          {selectedCustomer.is_active ? 'Active' : 'Suspended'}
                        </span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-slate-500">Joined Date:</span>
                        <span>{new Date(selectedCustomer.date_joined).toLocaleDateString('en-IN')}</span>
                      </div>
                    </div>

                    {/* Business Information */}
                    {selectedCustomer.customer_type === 'business' && (
                      <div className="p-4 bg-purple-50/50 rounded-xl border border-purple-100 space-y-2">
                        <div className="font-bold text-purple-900 uppercase tracking-wider text-[11px]">
                          Business Verification
                        </div>
                        <div className="flex justify-between">
                          <span className="text-slate-500">Business Name:</span>
                          <span className="font-bold text-slate-900">{selectedCustomer.business_name}</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-slate-500">Business Type:</span>
                          <span>{selectedCustomer.business_type_display}</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-slate-500">GSTIN:</span>
                          <span className="font-mono font-bold text-slate-900">
                            {selectedCustomer.gstin || 'Not Provided'}
                          </span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-slate-500">Contact Person:</span>
                          <span>{selectedCustomer.contact_person || 'N/A'}</span>
                        </div>
                      </div>
                    )}

                    {/* Lifetime Statistics */}
                    <div className="grid grid-cols-2 gap-3">
                      <div className="p-3 bg-slate-50 rounded-xl text-center">
                        <div className="text-[10px] font-bold text-slate-400 uppercase">Total Orders</div>
                        <div className="text-lg font-black text-slate-900 mt-1">
                          {selectedCustomer.orders_count}
                        </div>
                      </div>
                      <div className="p-3 bg-slate-50 rounded-xl text-center">
                        <div className="text-[10px] font-bold text-slate-400 uppercase">Total Spent</div>
                        <div className="text-lg font-black text-slate-900 mt-1">
                          ₹{Number(selectedCustomer.total_spent || 0).toLocaleString('en-IN')}
                        </div>
                      </div>
                    </div>

                    {/* Saved Addresses */}
                    <div>
                      <h4 className="text-xs font-bold text-slate-900 uppercase tracking-wider mb-2">
                        Saved Delivery Addresses ({selectedCustomer.addresses?.length || 0})
                      </h4>
                      {selectedCustomer.addresses?.length === 0 ? (
                        <div className="text-slate-400 p-3 bg-slate-50 rounded-xl text-center">
                          No saved addresses yet.
                        </div>
                      ) : (
                        <div className="space-y-2">
                          {selectedCustomer.addresses?.map((addr) => (
                            <div key={addr.id} className="p-3 border border-slate-200 rounded-xl">
                              <div className="font-bold text-slate-900">{addr.recipient_name}</div>
                              <div>{addr.address_line_1}</div>
                              <div>
                                {addr.city}, {addr.district}, {addr.state} - {addr.pincode}
                              </div>
                              <div className="text-slate-500 text-[11px] mt-0.5">Phone: {addr.phone_number}</div>
                            </div>
                          ))}
                        </div>
                      )}
                    </div>
                  </div>
                )}
              </div>

              {/* Slideover Footer */}
              <div className="pt-6 border-t border-slate-200 flex items-center justify-between gap-3">
                <button
                  onClick={() => handleToggleActive(selectedCustomer)}
                  className={`px-4 py-2 text-xs font-bold rounded-xl transition ${
                    selectedCustomer.is_active
                      ? 'bg-red-50 text-red-700 hover:bg-red-100'
                      : 'bg-emerald-50 text-emerald-700 hover:bg-emerald-100'
                  }`}
                >
                  {selectedCustomer.is_active ? 'Suspend Account' : 'Activate Account'}
                </button>

                {selectedCustomer.wholesale_status === 'pending' && (
                  <div className="flex gap-2">
                    <button
                      onClick={() => openDecisionModal(selectedCustomer.id, 'approve')}
                      className="px-4 py-2 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl text-xs font-bold transition"
                    >
                      Approve B2B
                    </button>
                    <button
                      onClick={() => openDecisionModal(selectedCustomer.id, 'reject')}
                      className="px-4 py-2 bg-red-100 hover:bg-red-200 text-red-700 rounded-xl text-xs font-bold transition"
                    >
                      Reject B2B
                    </button>
                  </div>
                )}
              </div>
            </div>
          </div>
        )}

        {/* 4. Wholesale Decision Approval/Rejection Modal */}
        {decisionModalOpen && (
          <div className="fixed inset-0 z-50 bg-slate-900/40 backdrop-blur-xs flex items-center justify-center p-4">
            <div className="bg-white rounded-2xl max-w-md w-full p-6 shadow-xl border border-slate-200">
              <h3 className="text-base font-bold text-slate-900 mb-2">
                {decisionAction === 'approve' ? 'Approve Wholesale Account' : 'Reject Wholesale Request'}
              </h3>
              <p className="text-xs text-slate-600 mb-4">
                {decisionAction === 'approve'
                  ? 'Approving this request will grant the customer access to wholesale tiered pricing and bulk packaging sizes.'
                  : 'Please state the reason for rejecting this wholesale application.'}
              </p>

              <form onSubmit={submitDecision} className="space-y-4">
                {decisionAction === 'reject' && (
                  <div>
                    <label className="block text-xs font-bold text-slate-700 mb-1">
                      Rejection Reason (Visible to Customer)
                    </label>
                    <textarea
                      rows={3}
                      required
                      placeholder="E.g. Unable to verify GSTIN registration with GST portal..."
                      value={rejectReason}
                      onChange={(e) => setRejectReason(e.target.value)}
                      className="w-full px-3 py-2 text-xs rounded-xl border border-slate-200"
                    />
                  </div>
                )}

                <div className="flex justify-end gap-2 pt-2">
                  <button
                    type="button"
                    onClick={() => setDecisionModalOpen(false)}
                    className="px-4 py-2 text-xs font-semibold text-slate-600 hover:bg-slate-100 rounded-xl"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    disabled={processingDecision}
                    className={`px-5 py-2 text-xs font-bold text-white rounded-xl transition ${
                      decisionAction === 'approve'
                        ? 'bg-emerald-600 hover:bg-emerald-700'
                        : 'bg-red-600 hover:bg-red-700'
                    }`}
                  >
                    {processingDecision
                      ? 'Processing...'
                      : decisionAction === 'approve'
                      ? 'Confirm Approval'
                      : 'Confirm Rejection'}
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}
      </div>
    </AdminLayout>
  );
}


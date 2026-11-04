'use client';

import React, { useState, useEffect, useCallback } from 'react';
import AdminLayout from '@/components/AdminLayout';
import {
  apiGetAdminStaff,
  apiCreateStaffMember,
  apiUpdateStaffMember,
  apiGetStaffRoles,
} from '@/lib/api';
import { StaffMember, StaffRole } from '@/types/api';

export default function AdminStaffPage() {
  const [staffList, setStaffList] = useState<StaffMember[]>([]);
  const [roles, setRoles] = useState<StaffRole[]>([]);
  const [loading, setLoading] = useState(true);

  // Add Staff Modal
  const [createModalOpen, setCreateModalOpen] = useState(false);
  const [fullName, setFullName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [selectedRoles, setSelectedRoles] = useState<string[]>(['Order Manager']);
  const [submitting, setSubmitting] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');

  // Edit Staff Modal
  const [editStaff, setEditStaff] = useState<StaffMember | null>(null);
  const [editRoles, setEditRoles] = useState<string[]>([]);
  const [editActive, setEditActive] = useState(true);
  const [editSubmitting, setEditSubmitting] = useState(false);

  const loadData = useCallback(async () => {
    setLoading(true);
    try {
      const [staffRes, rolesRes] = await Promise.all([
        apiGetAdminStaff(),
        apiGetStaffRoles(),
      ]);
      setStaffList(staffRes.staff || []);
      setRoles(rolesRes.roles || []);
    } catch (err) {
      console.error('Failed to load staff list', err);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    loadData();
  }, [loadData]);

  const handleCreateStaff = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);
    setErrorMsg('');

    const res = await apiCreateStaffMember({
      full_name: fullName,
      email,
      password: password || undefined,
      roles: selectedRoles,
    });
    setSubmitting(false);

    if (res.success) {
      setCreateModalOpen(false);
      setFullName('');
      setEmail('');
      setPassword('');
      setSelectedRoles(['Order Manager']);
      loadData();
    } else {
      setErrorMsg(res.message || 'Failed to create staff member.');
    }
  };

  const openEditModal = (member: StaffMember) => {
    setEditStaff(member);
    setEditRoles(member.roles || []);
    setEditActive(member.is_active);
    setErrorMsg('');
  };

  const handleUpdateStaff = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editStaff) return;

    setEditSubmitting(true);
    setErrorMsg('');

    const res = await apiUpdateStaffMember(editStaff.id, {
      is_active: editActive,
      roles: editRoles,
    });
    setEditSubmitting(false);

    if (res.success) {
      setEditStaff(null);
      loadData();
    } else {
      setErrorMsg(res.message || 'Failed to update staff member.');
    }
  };

  const toggleRoleSelection = (roleName: string, isCreate: boolean) => {
    if (isCreate) {
      setSelectedRoles((prev) =>
        prev.includes(roleName) ? prev.filter((r) => r !== roleName) : [...prev, roleName]
      );
    } else {
      setEditRoles((prev) =>
        prev.includes(roleName) ? prev.filter((r) => r !== roleName) : [...prev, roleName]
      );
    }
  };

  return (
    <AdminLayout
      title="Staff & Role Management"
      subtitle="Role-based permissions for order managers, warehouse supervisors, and accountants."
      actions={
        <button
          onClick={() => setCreateModalOpen(true)}
          className="inline-flex items-center gap-1.5 px-4 py-2 bg-[#093725] text-amber-300 hover:bg-[#062519] rounded-xl text-xs font-bold transition shadow-xs"
        >
          <span>➕</span> Add Staff Member
        </button>
      }
    >
      <div className="space-y-6">
        {/* 1. Staff Members Table */}
        <div className="bg-white rounded-2xl border border-slate-200/80 shadow-xs overflow-hidden">
          {loading ? (
            <div className="py-20 text-center text-xs font-semibold text-slate-500">
              Loading staff directory...
            </div>
          ) : staffList.length === 0 ? (
            <div className="py-16 text-center text-xs font-semibold text-slate-400">
              No staff members found.
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs">
                <thead className="bg-slate-50 border-b border-slate-200 text-slate-500 font-bold uppercase tracking-wider">
                  <tr>
                    <th className="py-3.5 px-4">Staff Member</th>
                    <th className="py-3.5 px-4">Primary Role</th>
                    <th className="py-3.5 px-4">Assigned Roles</th>
                    <th className="py-3.5 px-4">Account Status</th>
                    <th className="py-3.5 px-4">Date Joined</th>
                    <th className="py-3.5 px-4 text-center">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {staffList.map((member) => (
                    <tr key={member.id} className="hover:bg-slate-50/70 transition">
                      <td className="py-3.5 px-4">
                        <div className="font-bold text-slate-900">{member.full_name || member.username}</div>
                        <div className="text-[10.5px] text-slate-500">{member.email}</div>
                      </td>

                      <td className="py-3.5 px-4">
                        <span
                          className={`inline-block px-2.5 py-0.5 rounded-full text-[10.5px] font-bold ${
                            member.is_superuser || member.primary_role === 'Super Admin'
                              ? 'bg-purple-100 text-purple-800'
                              : member.primary_role === 'Admin'
                              ? 'bg-blue-100 text-blue-800'
                              : member.primary_role === 'Order Manager'
                              ? 'bg-emerald-100 text-emerald-800'
                              : 'bg-amber-100 text-amber-800'
                          }`}
                        >
                          {member.primary_role || (member.is_superuser ? 'Super Admin' : 'Staff')}
                        </span>
                      </td>

                      <td className="py-3.5 px-4">
                        <div className="flex flex-wrap gap-1">
                          {member.roles?.map((r) => (
                            <span
                              key={r}
                              className="text-[10px] font-semibold bg-slate-100 text-slate-700 px-2 py-0.5 rounded"
                            >
                              {r}
                            </span>
                          ))}
                        </div>
                      </td>

                      <td className="py-3.5 px-4">
                        <span
                          className={`inline-block px-2 py-0.5 rounded-full text-[10.5px] font-bold ${
                            member.is_active
                              ? 'bg-emerald-50 text-emerald-700'
                              : 'bg-red-50 text-red-700'
                          }`}
                        >
                          {member.is_active ? 'Active' : 'Suspended'}
                        </span>
                      </td>

                      <td className="py-3.5 px-4 text-slate-500">
                        {new Date(member.date_joined).toLocaleDateString('en-IN', {
                          day: 'numeric',
                          month: 'short',
                          year: 'numeric',
                        })}
                      </td>

                      <td className="py-3.5 px-4 text-center">
                        <button
                          onClick={() => openEditModal(member)}
                          className="px-2.5 py-1 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-lg text-xs font-semibold transition"
                        >
                          Configure
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>

        {/* 2. Roles & Capabilities Reference Cards */}
        <div className="bg-white p-6 rounded-2xl border border-slate-200/80 shadow-xs">
          <h3 className="text-sm font-bold text-slate-900 mb-1">Standard Role Hierarchy</h3>
          <p className="text-xs text-slate-500 mb-4">
            Responsibilities and access scopes configured for the Vandiperiyar operations team:
          </p>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
            {roles.map((r) => (
              <div key={r.name} className="p-3.5 bg-slate-50 rounded-xl border border-slate-200">
                <div className="font-bold text-xs text-slate-900">{r.name}</div>
                <div className="text-[11px] text-slate-500 mt-1 leading-relaxed">
                  {r.description}
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* 3. Add Staff Member Modal */}
        {createModalOpen && (
          <div className="fixed inset-0 z-50 bg-slate-900/40 backdrop-blur-xs flex items-center justify-center p-4">
            <div className="bg-white rounded-2xl max-w-md w-full p-6 shadow-xl border border-slate-200">
              <div className="flex items-center justify-between pb-3 border-b border-slate-100">
                <h3 className="text-base font-bold text-slate-900">Add New Staff Member</h3>
                <button
                  onClick={() => setCreateModalOpen(false)}
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

              <form onSubmit={handleCreateStaff} className="mt-4 space-y-3.5 text-xs">
                <div>
                  <label className="block font-bold text-slate-700 mb-1">Full Name</label>
                  <input
                    type="text"
                    required
                    placeholder="E.g. Rajesh Nair"
                    value={fullName}
                    onChange={(e) => setFullName(e.target.value)}
                    className="w-full px-3 py-2 rounded-xl border border-slate-200"
                  />
                </div>

                <div>
                  <label className="block font-bold text-slate-700 mb-1">Email Address</label>
                  <input
                    type="email"
                    required
                    placeholder="rajesh@onfresh.in"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="w-full px-3 py-2 rounded-xl border border-slate-200"
                  />
                </div>

                <div>
                  <label className="block font-bold text-slate-700 mb-1">Initial Password (Optional)</label>
                  <input
                    type="password"
                    placeholder="Default: OnFreshStaff@2026"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="w-full px-3 py-2 rounded-xl border border-slate-200"
                  />
                </div>

                <div>
                  <label className="block font-bold text-slate-700 mb-1.5">Assign Roles</label>
                  <div className="space-y-1.5">
                    {roles.map((r) => (
                      <label key={r.name} className="flex items-center gap-2 cursor-pointer">
                        <input
                          type="checkbox"
                          checked={selectedRoles.includes(r.name)}
                          onChange={() => toggleRoleSelection(r.name, true)}
                          className="rounded text-emerald-600 focus:ring-emerald-500"
                        />
                        <span className="font-semibold text-slate-800">{r.name}</span>
                      </label>
                    ))}
                  </div>
                </div>

                <div className="flex justify-end gap-2 pt-3">
                  <button
                    type="button"
                    onClick={() => setCreateModalOpen(false)}
                    className="px-4 py-2 font-semibold text-slate-600 hover:bg-slate-100 rounded-xl"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    disabled={submitting}
                    className="px-5 py-2 font-bold bg-[#093725] text-amber-300 rounded-xl hover:bg-[#062519] transition disabled:opacity-50"
                  >
                    {submitting ? 'Creating...' : 'Create Account'}
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}

        {/* 4. Edit Staff Member Modal */}
        {editStaff && (
          <div className="fixed inset-0 z-50 bg-slate-900/40 backdrop-blur-xs flex items-center justify-center p-4">
            <div className="bg-white rounded-2xl max-w-md w-full p-6 shadow-xl border border-slate-200">
              <div className="flex items-center justify-between pb-3 border-b border-slate-100">
                <h3 className="text-base font-bold text-slate-900">
                  Configure Staff: {editStaff.full_name || editStaff.email}
                </h3>
                <button
                  onClick={() => setEditStaff(null)}
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

              <form onSubmit={handleUpdateStaff} className="mt-4 space-y-4 text-xs">
                <div>
                  <label className="block font-bold text-slate-700 mb-1">Account Active Status</label>
                  <select
                    value={editActive ? 'true' : 'false'}
                    onChange={(e) => setEditActive(e.target.value === 'true')}
                    className="w-full px-3 py-2 rounded-xl border border-slate-200 bg-white"
                  >
                    <option value="true">Active Account</option>
                    <option value="false">Suspended / Deactivated</option>
                  </select>
                </div>

                <div>
                  <label className="block font-bold text-slate-700 mb-1.5">Assign Roles</label>
                  <div className="space-y-1.5">
                    {roles.map((r) => (
                      <label key={r.name} className="flex items-center gap-2 cursor-pointer">
                        <input
                          type="checkbox"
                          checked={editRoles.includes(r.name)}
                          onChange={() => toggleRoleSelection(r.name, false)}
                          className="rounded text-emerald-600 focus:ring-emerald-500"
                        />
                        <span className="font-semibold text-slate-800">{r.name}</span>
                      </label>
                    ))}
                  </div>
                </div>

                <div className="flex justify-end gap-2 pt-2">
                  <button
                    type="button"
                    onClick={() => setEditStaff(null)}
                    className="px-4 py-2 font-semibold text-slate-600 hover:bg-slate-100 rounded-xl"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    disabled={editSubmitting}
                    className="px-5 py-2 font-bold bg-[#093725] text-amber-300 rounded-xl hover:bg-[#062519] transition disabled:opacity-50"
                  >
                    {editSubmitting ? 'Saving...' : 'Save Changes'}
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


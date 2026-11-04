'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import AccountNav from '@/components/AccountNav';
import { useAuth } from '@/context/AuthContext';
import {
  apiGetAddresses,
  apiCreateAddress,
  apiUpdateAddress,
  apiDeleteAddress,
} from '@/lib/api';
import { Address } from '@/types/api';

const KERALA_DISTRICTS = [
  'Idukki',
  'Kottayam',
  'Ernakulam',
  'Pathanamthitta',
  'Alappuzha',
  'Thrissur',
  'Palakkad',
  'Kollam',
  'Thiruvananthapuram',
  'Malappuram',
  'Kozhikode',
  'Wayanad',
  'Kannur',
  'Kasaragod',
];

export default function AddressesPage() {
  const router = useRouter();
  const { user, loading: authLoading } = useAuth();

  const [addresses, setAddresses] = useState<Address[]>([]);
  const [loading, setLoading] = useState(true);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [successMsg, setSuccessMsg] = useState<string | null>(null);

  // Form modal state
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingAddress, setEditingAddress] = useState<Address | null>(null);
  const [saving, setSaving] = useState(false);
  const [formErrors, setFormErrors] = useState<Record<string, string>>({});

  const [formData, setFormData] = useState({
    address_type: 'shipping' as 'shipping' | 'billing',
    recipient_name: '',
    phone_number: '',
    address_line_1: '',
    address_line_2: '',
    city: '',
    district: 'Idukki',
    state: 'Kerala',
    pincode: '',
    is_default: false,
  });

  useEffect(() => {
    if (!authLoading && !user) {
      router.push('/login?redirect=/account/addresses');
    }
  }, [user, authLoading, router]);

  const loadAddresses = async () => {
    setLoading(true);
    const res = await apiGetAddresses();
    if (res.data) {
      setAddresses(res.data);
    } else {
      setErrorMsg(res.error || 'Failed to load addresses');
    }
    setLoading(false);
  };

  useEffect(() => {
    if (user) {
      loadAddresses();
    }
  }, [user]);

  const openCreateModal = () => {
    setEditingAddress(null);
    setFormData({
      address_type: 'shipping',
      recipient_name: user?.full_name || '',
      phone_number: user?.profile?.phone_number || '',
      address_line_1: '',
      address_line_2: '',
      city: '',
      district: 'Idukki',
      state: 'Kerala',
      pincode: '',
      is_default: addresses.length === 0,
    });
    setFormErrors({});
    setIsModalOpen(true);
  };

  const openEditModal = (addr: Address) => {
    setEditingAddress(addr);
    setFormData({
      address_type: addr.address_type,
      recipient_name: addr.recipient_name,
      phone_number: addr.phone_number,
      address_line_1: addr.address_line_1,
      address_line_2: addr.address_line_2 || '',
      city: addr.city,
      district: addr.district,
      state: addr.state,
      pincode: addr.pincode,
      is_default: addr.is_default,
    });
    setFormErrors({});
    setIsModalOpen(true);
  };

  const handleFormSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    setFormErrors({});

    if (editingAddress) {
      const res = await apiUpdateAddress(editingAddress.id, formData);
      setSaving(false);
      if (res.data) {
        setSuccessMsg('Address updated successfully.');
        setIsModalOpen(false);
        loadAddresses();
      } else {
        if (res.errors) {
          const mapped: Record<string, string> = {};
          Object.entries(res.errors).forEach(([k, v]) => {
            mapped[k] = Array.isArray(v) ? v.join(' ') : String(v);
          });
          setFormErrors(mapped);
        }
      }
    } else {
      const res = await apiCreateAddress(formData);
      setSaving(false);
      if (res.data) {
        setSuccessMsg('Address added successfully.');
        setIsModalOpen(false);
        loadAddresses();
      } else {
        if (res.errors) {
          const mapped: Record<string, string> = {};
          Object.entries(res.errors).forEach(([k, v]) => {
            mapped[k] = Array.isArray(v) ? v.join(' ') : String(v);
          });
          setFormErrors(mapped);
        }
      }
    }
  };

  const handleSetDefault = async (addr: Address) => {
    const res = await apiUpdateAddress(addr.id, { is_default: true });
    if (res.data) {
      setSuccessMsg(`"${addr.recipient_name}" is now your default ${addr.address_type} address.`);
      loadAddresses();
    }
  };

  const handleDelete = async (id: number) => {
    if (confirm('Are you sure you want to delete this address?')) {
      const res = await apiDeleteAddress(id);
      if (res.success) {
        setSuccessMsg('Address removed.');
        loadAddresses();
      } else {
        setErrorMsg(res.error || 'Failed to delete address.');
      }
    }
  };

  if (authLoading || !user) {
    return (
      <div className="min-h-screen bg-[#fbf8f1] flex flex-col justify-between text-[#1c2621]">
        <Navbar />
        <main className="flex-1 py-20 flex items-center justify-center">
          <p className="text-xs text-stone-500">Loading delivery addresses...</p>
        </main>
        <Footer />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#fbf8f1] flex flex-col justify-between text-[#1c2621]">
      <Navbar />

      <main className="flex-1 py-10 sm:py-14 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 w-full">
        {/* Breadcrumb */}
        <nav className="flex items-center gap-2 text-xs text-stone-500 mb-6 font-medium">
          <Link href="/" className="hover:text-[#0d4a32] transition">
            Home
          </Link>
          <span>/</span>
          <Link href="/account" className="hover:text-[#0d4a32] transition">
            Wholesale Account
          </Link>
          <span>/</span>
          <span className="text-[#093725] font-semibold">Delivery Addresses</span>
        </nav>

        <div className="flex flex-col lg:flex-row gap-8 items-start">
          <AccountNav />

          <div className="flex-1 w-full space-y-6">
            <div className="bg-white rounded-3xl border border-stone-200 p-8 sm:p-10 shadow-xs">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-6 border-b border-stone-100 gap-4 mb-6">
                <div>
                  <h1 className="text-2xl font-black text-[#093725] tracking-tight">
                    Wholesale Delivery & Billing Addresses
                  </h1>
                  <p className="text-xs text-stone-500 mt-1">
                    Store addresses for store dispatch, branch outlets, and billing accounts.
                  </p>
                </div>

                <button
                  onClick={openCreateModal}
                  className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-[#093725] hover:bg-[#0d4a32] text-white text-xs font-bold uppercase tracking-wider transition shadow-sm cursor-pointer"
                >
                  <span>+</span>
                  <span>Add New Address</span>
                </button>
              </div>

              {/* Feedback messages */}
              {successMsg && (
                <div className="mb-6 p-4 rounded-2xl bg-emerald-50 border border-emerald-200 text-emerald-900 text-xs flex items-center justify-between">
                  <span>✓ {successMsg}</span>
                  <button onClick={() => setSuccessMsg(null)} className="text-emerald-700 font-bold">
                    ✕
                  </button>
                </div>
              )}
              {errorMsg && (
                <div className="mb-6 p-4 rounded-2xl bg-rose-50 border border-rose-200 text-rose-800 text-xs flex items-center justify-between">
                  <span>⚠️ {errorMsg}</span>
                  <button onClick={() => setErrorMsg(null)} className="text-rose-700 font-bold">
                    ✕
                  </button>
                </div>
              )}

              {/* Loading State */}
              {loading && (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 animate-pulse">
                  {[1, 2].map((i) => (
                    <div key={i} className="h-40 bg-stone-100 rounded-2xl" />
                  ))}
                </div>
              )}

              {/* Empty State */}
              {!loading && addresses.length === 0 && (
                <div className="text-center py-12 max-w-sm mx-auto">
                  <div className="w-14 h-14 rounded-2xl bg-amber-50 text-amber-800 flex items-center justify-center text-2xl mx-auto mb-3">
                    📍
                  </div>
                  <h4 className="font-bold text-stone-800 text-sm">No Addresses Registered</h4>
                  <p className="text-xs text-stone-500 mt-1 leading-relaxed">
                    Add your store, retail shop, or supermarket warehouse location for seamless wholesale order dispatch.
                  </p>
                  <button
                    onClick={openCreateModal}
                    className="mt-4 px-5 py-2.5 rounded-xl bg-[#093725] text-amber-300 font-bold text-xs hover:bg-[#0d4a32] transition"
                  >
                    Add First Address
                  </button>
                </div>
              )}

              {/* Addresses Grid */}
              {!loading && addresses.length > 0 && (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                  {addresses.map((addr) => (
                    <div
                      key={addr.id}
                      className={`rounded-2xl border p-5 flex flex-col justify-between transition-all ${
                        addr.is_default
                          ? 'bg-amber-50/40 border-amber-300 shadow-xs'
                          : 'bg-white border-stone-200 hover:border-stone-300'
                      }`}
                    >
                      <div>
                        {/* Header Badges */}
                        <div className="flex items-center justify-between mb-3">
                          <span
                            className={`text-[10px] font-bold uppercase tracking-wider px-2.5 py-0.5 rounded-full ${
                              addr.address_type === 'shipping'
                                ? 'bg-emerald-100 text-[#093725]'
                                : 'bg-blue-100 text-blue-900'
                            }`}
                          >
                            {addr.address_type === 'shipping' ? 'Shipping / Store' : 'Billing'}
                          </span>

                          {addr.is_default && (
                            <span className="text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded bg-amber-200 text-amber-950 font-mono">
                              ★ Default
                            </span>
                          )}
                        </div>

                        <h4 className="font-bold text-stone-900 text-sm">
                          {addr.recipient_name}
                        </h4>
                        <p className="text-xs text-stone-600 mt-1 leading-relaxed">
                          {addr.address_line_1}
                          {addr.address_line_2 && `, ${addr.address_line_2}`}
                          <br />
                          {addr.city}, {addr.district}, {addr.state} — {addr.pincode}
                        </p>
                        <p className="text-xs font-mono text-stone-500 mt-2">
                          📞 {addr.phone_number}
                        </p>
                      </div>

                      {/* Action buttons */}
                      <div className="mt-5 pt-3 border-t border-stone-100 flex items-center justify-between text-xs">
                        <div className="flex items-center gap-3">
                          <button
                            onClick={() => openEditModal(addr)}
                            className="font-bold text-[#0d4a32] hover:underline cursor-pointer"
                          >
                            Edit
                          </button>
                          <button
                            onClick={() => handleDelete(addr.id)}
                            className="text-rose-600 hover:underline cursor-pointer"
                          >
                            Delete
                          </button>
                        </div>

                        {!addr.is_default && (
                          <button
                            onClick={() => handleSetDefault(addr)}
                            className="text-[11px] font-semibold text-stone-500 hover:text-stone-900 cursor-pointer"
                          >
                            Set as Default
                          </button>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>
      </main>

      {/* Address Create / Edit Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs">
          <div className="relative w-full max-w-lg bg-white rounded-3xl shadow-2xl border border-stone-200 overflow-hidden max-h-[90vh] flex flex-col">
            <div className="bg-[#093725] px-6 py-4 flex items-center justify-between text-white">
              <h3 className="text-sm font-bold uppercase tracking-wider text-amber-300">
                {editingAddress ? 'Edit Address' : 'Add Wholesale Delivery Address'}
              </h3>
              <button
                onClick={() => setIsModalOpen(false)}
                className="text-emerald-200 hover:text-white p-1 text-lg font-bold"
              >
                ✕
              </button>
            </div>

            <form onSubmit={handleFormSubmit} className="p-6 overflow-y-auto space-y-4 text-xs">
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-bold text-stone-700 uppercase mb-1">
                    Address Type
                  </label>
                  <select
                    value={formData.address_type}
                    onChange={(e) =>
                      setFormData({
                        ...formData,
                        address_type: e.target.value as 'shipping' | 'billing',
                      })
                    }
                    className="w-full px-3 py-2 rounded-xl border border-stone-300 bg-white"
                  >
                    <option value="shipping">Shipping Address</option>
                    <option value="billing">Billing Address</option>
                  </select>
                </div>

                <div>
                  <label className="block font-bold text-stone-700 uppercase mb-1">
                    Recipient / Store Name *
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. Anand Menon"
                    value={formData.recipient_name}
                    onChange={(e) => setFormData({ ...formData, recipient_name: e.target.value })}
                    className="w-full px-3 py-2 rounded-xl border border-stone-300"
                  />
                  {formErrors.recipient_name && (
                    <p className="text-[10px] text-rose-600 mt-0.5">{formErrors.recipient_name}</p>
                  )}
                </div>
              </div>

              <div>
                <label className="block font-bold text-stone-700 uppercase mb-1">
                  Contact Phone Number *
                </label>
                <input
                  type="tel"
                  required
                  placeholder="e.g. 9846011223"
                  value={formData.phone_number}
                  onChange={(e) => setFormData({ ...formData, phone_number: e.target.value })}
                  className="w-full px-3 py-2 rounded-xl border border-stone-300"
                />
                {formErrors.phone_number && (
                  <p className="text-[10px] text-rose-600 mt-0.5">{formErrors.phone_number}</p>
                )}
              </div>

              <div>
                <label className="block font-bold text-stone-700 uppercase mb-1">
                  Address Line 1 (Building, Street, Landmark) *
                </label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Door No. 12, Main Bazaar Road"
                  value={formData.address_line_1}
                  onChange={(e) => setFormData({ ...formData, address_line_1: e.target.value })}
                  className="w-full px-3 py-2 rounded-xl border border-stone-300"
                />
                {formErrors.address_line_1 && (
                  <p className="text-[10px] text-rose-600 mt-0.5">{formErrors.address_line_1}</p>
                )}
              </div>

              <div>
                <label className="block font-bold text-stone-700 uppercase mb-1">
                  Address Line 2 (Area, Floor)
                </label>
                <input
                  type="text"
                  placeholder="e.g. Near Central Bus Stand"
                  value={formData.address_line_2}
                  onChange={(e) => setFormData({ ...formData, address_line_2: e.target.value })}
                  className="w-full px-3 py-2 rounded-xl border border-stone-300"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-bold text-stone-700 uppercase mb-1">City / Town *</label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. Vandiperiyar"
                    value={formData.city}
                    onChange={(e) => setFormData({ ...formData, city: e.target.value })}
                    className="w-full px-3 py-2 rounded-xl border border-stone-300"
                  />
                  {formErrors.city && (
                    <p className="text-[10px] text-rose-600 mt-0.5">{formErrors.city}</p>
                  )}
                </div>

                <div>
                  <label className="block font-bold text-stone-700 uppercase mb-1">District *</label>
                  <select
                    value={formData.district}
                    onChange={(e) => setFormData({ ...formData, district: e.target.value })}
                    className="w-full px-3 py-2 rounded-xl border border-stone-300 bg-white"
                  >
                    {KERALA_DISTRICTS.map((d) => (
                      <option key={d} value={d}>
                        {d}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-bold text-stone-700 uppercase mb-1">State</label>
                  <input
                    type="text"
                    readOnly
                    value="Kerala"
                    className="w-full px-3 py-2 rounded-xl border border-stone-200 bg-stone-100 text-stone-600"
                  />
                </div>

                <div>
                  <label className="block font-bold text-stone-700 uppercase mb-1">PIN Code *</label>
                  <input
                    type="text"
                    required
                    maxLength={6}
                    placeholder="685533"
                    value={formData.pincode}
                    onChange={(e) => setFormData({ ...formData, pincode: e.target.value })}
                    className="w-full px-3 py-2 rounded-xl border border-stone-300 font-mono"
                  />
                  {formErrors.pincode && (
                    <p className="text-[10px] text-rose-600 mt-0.5">{formErrors.pincode}</p>
                  )}
                </div>
              </div>

              <div className="pt-2 flex items-center gap-2">
                <input
                  type="checkbox"
                  id="is_default"
                  checked={formData.is_default}
                  onChange={(e) => setFormData({ ...formData, is_default: e.target.checked })}
                  className="rounded border-stone-300 text-[#093725] focus:ring-[#0d4a32] h-4 w-4"
                />
                <label htmlFor="is_default" className="text-stone-700 font-medium">
                  Set as default {formData.address_type} address
                </label>
              </div>

              <div className="pt-4 border-t border-stone-100 flex items-center justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="px-4 py-2 rounded-xl bg-stone-100 hover:bg-stone-200 text-stone-700 font-semibold"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={saving}
                  className="px-5 py-2 rounded-xl bg-[#093725] hover:bg-[#0d4a32] text-white font-bold disabled:opacity-50"
                >
                  {saving ? 'Saving...' : editingAddress ? 'Save Changes' : 'Add Address'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      <Footer />
    </div>
  );
}


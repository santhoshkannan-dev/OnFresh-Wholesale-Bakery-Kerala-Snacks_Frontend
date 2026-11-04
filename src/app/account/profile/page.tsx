'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import AccountNav from '@/components/AccountNav';
import { useAuth } from '@/context/AuthContext';
import { apiUpdateCustomerProfile, apiUpgradeToWholesale } from '@/lib/api';
import type { BusinessType } from '@/types/api';

export default function ProfilePage() {
  const router = useRouter();
  const { user, profile, loading: authLoading, refreshUser } = useAuth();

  const isBusiness = profile?.customer_type === 'business';

  const [formData, setFormData] = useState({
    fullName: '',
    contactPerson: '',
    phoneNumber: '',
    businessName: '',
    businessType: 'retail_shop',
    gstin: '',
  });

  const [saving, setSaving] = useState(false);
  const [successMsg, setSuccessMsg] = useState<string | null>(null);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [fieldErrors, setFieldErrors] = useState<Record<string, string>>({});

  // Individual upgrade to wholesale form state
  const [showUpgradeSection, setShowUpgradeSection] = useState(false);
  const [upgradeData, setUpgradeData] = useState({
    businessName: '',
    businessType: 'retail_shop',
    gstin: '',
  });
  const [upgradeLoading, setUpgradeLoading] = useState(false);

  useEffect(() => {
    if (!authLoading && !user) {
      router.push('/login?redirect=/account/profile');
    }
  }, [user, authLoading, router]);

  useEffect(() => {
    if (user) {
      setFormData({
        fullName: user.full_name || '',
        contactPerson: profile?.contact_person || user.full_name || '',
        phoneNumber: profile?.phone_number || '',
        businessName: profile?.business_name || '',
        businessType: profile?.business_type || 'retail_shop',
        gstin: profile?.gstin || '',
      });
    }
  }, [user, profile]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    setSuccessMsg(null);
    if (fieldErrors[name]) {
      setFieldErrors((prev) => {
        const copy = { ...prev };
        delete copy[name];
        return copy;
      });
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    setErrorMsg(null);
    setSuccessMsg(null);
    setFieldErrors({});

    const res = await apiUpdateCustomerProfile({
      full_name: formData.fullName.trim(),
      contact_person: formData.contactPerson.trim() || formData.fullName.trim(),
      phone_number: formData.phoneNumber.trim(),
      business_name: isBusiness ? formData.businessName.trim() : undefined,
      business_type: isBusiness ? (formData.businessType as BusinessType) : undefined,
      gstin: isBusiness ? formData.gstin.trim() : undefined,
    });

    setSaving(false);

    if (res.data) {
      setSuccessMsg('Profile details updated successfully.');
      await refreshUser();
    } else {
      setErrorMsg(res.error || 'Failed to update profile.');
      if (res.errors) {
        const mappedErrors: Record<string, string> = {};
        Object.entries(res.errors).forEach(([k, v]) => {
          mappedErrors[k] = Array.isArray(v) ? v.join(' ') : String(v);
        });
        setFieldErrors(mappedErrors);
      }
    }
  };

  const handleUpgradeSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setUpgradeLoading(true);
    setErrorMsg(null);
    setSuccessMsg(null);

    const res = await apiUpgradeToWholesale({
      business_name: upgradeData.businessName.trim(),
      business_type: upgradeData.businessType,
      phone_number: formData.phoneNumber.trim() || '9846000000',
      contact_person: formData.fullName.trim(),
      gstin: upgradeData.gstin.trim() || undefined,
    });

    setUpgradeLoading(false);
    if (res.status === 'success') {
      setSuccessMsg('Your wholesale application has been submitted and is pending administrator review.');
      await refreshUser();
      setShowUpgradeSection(false);
    } else {
      setErrorMsg(res.message || 'Failed to submit wholesale application.');
    }
  };

  if (authLoading || !user) {
    return (
      <div className="min-h-screen bg-[#fbf8f1] flex flex-col justify-between text-[#1c2621]">
        <Navbar />
        <main className="flex-1 py-20 flex items-center justify-center">
          <p className="text-xs text-stone-500">Loading profile details...</p>
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
            Account Dashboard
          </Link>
          <span>/</span>
          <span className="text-[#093725] font-semibold">
            {isBusiness ? 'Business Profile' : 'Customer Profile'}
          </span>
        </nav>

        <div className="flex flex-col lg:flex-row gap-8 items-start">
          <AccountNav />

          <div className="flex-1 w-full space-y-6">
            <div className="bg-white rounded-3xl border border-stone-200 p-8 sm:p-10 shadow-xs">
              <div className="border-b border-stone-100 pb-5 mb-8">
                <h1 className="text-2xl font-black text-[#093725] tracking-tight">
                  {isBusiness ? 'Wholesale Business Profile' : 'Personal Customer Profile'}
                </h1>
                <p className="text-xs text-stone-500 mt-1">
                  {isBusiness
                    ? 'Keep your business contact details and GST credentials current for invoice generation and bulk delivery.'
                    : 'Manage your contact information for retail deliveries and order tracking.'}
                </p>
              </div>

              {/* Success Notification */}
              {successMsg && (
                <div className="mb-6 p-4 rounded-2xl bg-emerald-50 border border-emerald-200 text-emerald-900 text-xs flex items-center gap-2.5">
                  <span className="text-emerald-600 font-bold text-sm">✓</span>
                  <p className="font-medium">{successMsg}</p>
                </div>
              )}

              {/* Error Notification */}
              {errorMsg && (
                <div className="mb-6 p-4 rounded-2xl bg-rose-50 border border-rose-200 text-rose-800 text-xs flex items-start gap-2.5">
                  <span className="text-rose-600 font-bold">⚠️</span>
                  <p className="leading-relaxed">{errorMsg}</p>
                </div>
              )}

              <form onSubmit={handleSubmit} className="space-y-6">
                {/* Account Credentials (Read-Only) */}
                <div className="bg-stone-50 rounded-2xl p-4 border border-stone-200/80">
                  <h3 className="text-xs font-bold uppercase tracking-wider text-stone-600 mb-3">
                    Account Classification & Identity
                  </h3>
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 text-xs">
                    <div>
                      <span className="font-semibold text-stone-500 block">Registered Email</span>
                      <span className="font-mono text-stone-900 font-medium">{user.email}</span>
                    </div>
                    <div>
                      <span className="font-semibold text-stone-500 block">Customer Segment</span>
                      <span className="font-bold text-[#093725]">
                        {isBusiness ? 'Wholesale Business (B2B)' : 'Individual Retail (B2C)'}
                      </span>
                    </div>
                    <div>
                      <span className="font-semibold text-stone-500 block">Wholesale Status</span>
                      {isBusiness ? (
                        profile?.is_wholesale_approved ? (
                          <span className="inline-block mt-0.5 text-[10px] font-bold uppercase px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-800">
                            Approved Partner
                          </span>
                        ) : (
                          <span className="inline-block mt-0.5 text-[10px] font-bold uppercase px-2 py-0.5 rounded-full bg-amber-100 text-amber-900">
                            Pending Review
                          </span>
                        )
                      ) : (
                        <span className="inline-block mt-0.5 text-[10px] font-bold uppercase px-2 py-0.5 rounded-full bg-stone-200 text-stone-700">
                          Standard Retail
                        </span>
                      )}
                    </div>
                  </div>
                </div>

                {/* Personal & Contact Person */}
                <div>
                  <h3 className="text-xs font-bold uppercase tracking-wider text-stone-400 mb-3 pb-1 border-b border-stone-100">
                    Contact Details
                  </h3>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-xs font-bold uppercase tracking-wider text-stone-700 mb-1.5">
                        Full Name *
                      </label>
                      <input
                        type="text"
                        required
                        name="fullName"
                        value={formData.fullName}
                        onChange={handleChange}
                        className="w-full px-4 py-2.5 rounded-xl border border-stone-300 text-sm focus:outline-none focus:ring-2 focus:ring-[#0d4a32] transition"
                      />
                      {fieldErrors.full_name && (
                        <p className="text-[11px] text-rose-600 mt-1">{fieldErrors.full_name}</p>
                      )}
                    </div>

                    <div>
                      <label className="block text-xs font-bold uppercase tracking-wider text-stone-700 mb-1.5">
                        Direct Phone / WhatsApp *
                      </label>
                      <input
                        type="tel"
                        required
                        name="phoneNumber"
                        value={formData.phoneNumber}
                        onChange={handleChange}
                        className="w-full px-4 py-2.5 rounded-xl border border-stone-300 text-sm focus:outline-none focus:ring-2 focus:ring-[#0d4a32] transition"
                      />
                      {fieldErrors.phone_number && (
                        <p className="text-[11px] text-rose-600 mt-1">{fieldErrors.phone_number}</p>
                      )}
                    </div>
                  </div>
                </div>

                {/* Business Information (Only for B2B) */}
                {isBusiness && (
                  <div>
                    <h3 className="text-xs font-bold uppercase tracking-wider text-stone-400 mb-3 pb-1 border-b border-stone-100">
                      Wholesale Commercial Information
                    </h3>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <div>
                        <label className="block text-xs font-bold uppercase tracking-wider text-stone-700 mb-1.5">
                          Business / Store Name *
                        </label>
                        <input
                          type="text"
                          required
                          name="businessName"
                          value={formData.businessName}
                          onChange={handleChange}
                          className="w-full px-4 py-2.5 rounded-xl border border-stone-300 text-sm focus:outline-none focus:ring-2 focus:ring-[#0d4a32] transition"
                        />
                        {fieldErrors.business_name && (
                          <p className="text-[11px] text-rose-600 mt-1">{fieldErrors.business_name}</p>
                        )}
                      </div>

                      <div>
                        <label className="block text-xs font-bold uppercase tracking-wider text-stone-700 mb-1.5">
                          Business Category
                        </label>
                        <select
                          name="businessType"
                          value={formData.businessType}
                          onChange={handleChange}
                          className="w-full px-4 py-2.5 rounded-xl border border-stone-300 text-sm focus:outline-none focus:ring-2 focus:ring-[#0d4a32] transition bg-white"
                        >
                          <option value="retail_shop">Retail Shop / Kirana</option>
                          <option value="supermarket">Supermarket</option>
                          <option value="bakery">Bakery</option>
                          <option value="distributor">Wholesale Distributor</option>
                          <option value="restaurant">Tea Stall / Cafe</option>
                          <option value="other">Other Business</option>
                        </select>
                      </div>

                      <div className="sm:col-span-2">
                        <label className="block text-xs font-bold uppercase tracking-wider text-stone-700 mb-1.5">
                          GSTIN (Optional)
                        </label>
                        <input
                          type="text"
                          name="gstin"
                          maxLength={15}
                          value={formData.gstin}
                          onChange={handleChange}
                          className="w-full px-4 py-2.5 rounded-xl border border-stone-300 text-sm font-mono uppercase focus:outline-none focus:ring-2 focus:ring-[#0d4a32] transition"
                        />
                        {fieldErrors.gstin && (
                          <p className="text-[11px] text-rose-600 mt-1">{fieldErrors.gstin}</p>
                        )}
                        <span className="text-[10px] text-stone-400 mt-1 block">
                          Optional for unregistered shops. Required if you need B2B tax credit invoices.
                        </span>
                      </div>
                    </div>
                  </div>
                )}

                <div className="pt-4 flex items-center justify-end gap-3 border-t border-stone-100">
                  <button
                    type="submit"
                    disabled={saving}
                    className="px-6 py-3 rounded-xl text-xs font-bold uppercase tracking-wider text-emerald-950 bg-gradient-to-r from-amber-400 to-amber-500 hover:from-amber-300 hover:to-amber-400 transition-all shadow-md shadow-amber-500/20 disabled:opacity-50 cursor-pointer flex items-center gap-2"
                  >
                    {saving ? 'Saving...' : 'Save Profile Changes'}
                  </button>
                </div>
              </form>

              {/* Individual Customer: Upgrade to Wholesale Access Section */}
              {!isBusiness && (
                <div className="mt-10 pt-8 border-t border-stone-200">
                  {!showUpgradeSection ? (
                    <div className="p-5 rounded-2xl bg-amber-50/70 border border-amber-200/80 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                      <div>
                        <h3 className="font-bold text-sm text-[#093725]">
                          Upgrade to a Wholesale Business Account
                        </h3>
                        <p className="text-xs text-stone-600 mt-0.5">
                          Are you a retailer, bakery, or distributor? Submit your business credentials to unlock wholesale bulk carton pricing.
                        </p>
                      </div>
                      <button
                        type="button"
                        onClick={() => setShowUpgradeSection(true)}
                        className="px-4 py-2 rounded-xl text-xs font-bold bg-[#093725] text-amber-300 hover:bg-[#14532d] transition cursor-pointer whitespace-nowrap shadow-sm"
                      >
                        Apply for Wholesale →
                      </button>
                    </div>
                  ) : (
                    <div className="p-6 rounded-2xl bg-amber-50/80 border border-amber-300/80 space-y-4">
                      <div className="flex items-center justify-between">
                        <h3 className="font-bold text-sm text-[#093725]">
                          Wholesale Business Application
                        </h3>
                        <button
                          type="button"
                          onClick={() => setShowUpgradeSection(false)}
                          className="text-xs text-stone-500 hover:text-stone-800"
                        >
                          Cancel
                        </button>
                      </div>

                      <form onSubmit={handleUpgradeSubmit} className="space-y-4">
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                          <div>
                            <label className="block text-xs font-bold uppercase tracking-wider text-stone-700 mb-1">
                              Business / Store Name *
                            </label>
                            <input
                              type="text"
                              required
                              placeholder="e.g. Malabar Bakery"
                              value={upgradeData.businessName}
                              onChange={(e) =>
                                setUpgradeData({ ...upgradeData, businessName: e.target.value })
                              }
                              className="w-full px-3.5 py-2 rounded-xl border border-stone-300 text-xs bg-white focus:outline-none focus:ring-2 focus:ring-emerald-700"
                            />
                          </div>

                          <div>
                            <label className="block text-xs font-bold uppercase tracking-wider text-stone-700 mb-1">
                              Business Category
                            </label>
                            <select
                              value={upgradeData.businessType}
                              onChange={(e) =>
                                setUpgradeData({ ...upgradeData, businessType: e.target.value })
                              }
                              className="w-full px-3.5 py-2 rounded-xl border border-stone-300 text-xs bg-white"
                            >
                              <option value="retail_shop">Retail Shop</option>
                              <option value="supermarket">Supermarket</option>
                              <option value="bakery">Bakery</option>
                              <option value="distributor">Distributor</option>
                              <option value="restaurant">Tea Stall / Cafe</option>
                              <option value="other">Other Business</option>
                            </select>
                          </div>

                          <div className="sm:col-span-2">
                            <label className="block text-xs font-bold uppercase tracking-wider text-stone-700 mb-1">
                              GSTIN (Optional)
                            </label>
                            <input
                              type="text"
                              maxLength={15}
                              placeholder="e.g. 32AAAAA0000A1Z5"
                              value={upgradeData.gstin}
                              onChange={(e) =>
                                setUpgradeData({ ...upgradeData, gstin: e.target.value.toUpperCase() })
                              }
                              className="w-full px-3.5 py-2 rounded-xl border border-stone-300 text-xs font-mono uppercase bg-white"
                            />
                          </div>
                        </div>

                        <div className="flex justify-end gap-2 pt-2">
                          <button
                            type="button"
                            onClick={() => setShowUpgradeSection(false)}
                            className="px-4 py-2 rounded-xl text-xs font-bold text-stone-600 hover:bg-stone-100"
                          >
                            Cancel
                          </button>
                          <button
                            type="submit"
                            disabled={upgradeLoading}
                            className="px-5 py-2 rounded-xl text-xs font-bold bg-amber-500 hover:bg-amber-400 text-emerald-950 transition cursor-pointer"
                          >
                            {upgradeLoading ? 'Submitting...' : 'Submit Wholesale Application'}
                          </button>
                        </div>
                      </form>
                    </div>
                  )}
                </div>
              )}
            </div>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}

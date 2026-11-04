'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import {
  Building2,
  Sparkles,
  ShoppingBag,
  MapPin,
  Clock,
  CheckCircle2,
  AlertTriangle,
  ArrowRight,
  Package,
  FileText,
  User,
  X,
  Loader2,
} from 'lucide-react';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import AccountNav from '@/components/AccountNav';
import { useAuth } from '@/context/AuthContext';
import { apiGetAddresses, apiUpgradeToWholesale } from '@/lib/api';
import { Address } from '@/types/api';

export default function AccountDashboardPage() {
  const router = useRouter();
  const { user, profile, loading: authLoading, refreshUser } = useAuth();
  const [addresses, setAddresses] = useState<Address[]>([]);
  const [addressLoading, setAddressLoading] = useState(true);

  // Wholesale application state
  const [showUpgradeModal, setShowUpgradeModal] = useState(false);
  const [upgradeData, setUpgradeData] = useState({
    businessName: '',
    businessType: 'retail_shop',
    phoneNumber: '',
    contactPerson: '',
    gstin: '',
  });
  const [upgradeLoading, setUpgradeLoading] = useState(false);
  const [upgradeError, setUpgradeError] = useState<string | null>(null);
  const [upgradeSuccess, setUpgradeSuccess] = useState<string | null>(null);

  useEffect(() => {
    if (!authLoading && !user) {
      router.push('/login?redirect=/account');
    }
  }, [user, authLoading, router]);

  useEffect(() => {
    if (user) {
      apiGetAddresses().then((res) => {
        if (res.data) setAddresses(res.data);
        setAddressLoading(false);
      });
    }
  }, [user]);

  if (authLoading || !user) {
    return (
      <div className="min-h-screen bg-[#FFF9F1] flex flex-col justify-between text-[#281411]">
        <Navbar />
        <main className="flex-1 py-20 flex items-center justify-center">
          <Loader2 className="w-8 h-8 text-[#F47735] animate-spin" />
        </main>
        <Footer />
      </div>
    );
  }

  const isBusiness = profile?.customer_type === 'business';
  const isWholesaleApproved = Boolean(isBusiness && profile?.wholesale_status === 'approved');
  const isWholesalePending = Boolean(isBusiness && profile?.wholesale_status === 'pending');
  const isWholesaleRejected = Boolean(isBusiness && profile?.wholesale_status === 'rejected');

  const handleUpgradeSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setUpgradeError(null);
    setUpgradeSuccess(null);
    setUpgradeLoading(true);

    const res = await apiUpgradeToWholesale({
      business_name: upgradeData.businessName.trim(),
      business_type: upgradeData.businessType,
      phone_number: upgradeData.phoneNumber.trim() || profile?.phone_number || '9846000000',
      contact_person: upgradeData.contactPerson.trim() || user.full_name,
      gstin: upgradeData.gstin.trim() || undefined,
    });

    setUpgradeLoading(false);
    if (res.status === 'success') {
      setUpgradeSuccess('Wholesale application submitted! Our team will review within 4 hours.');
      await refreshUser();
      setTimeout(() => setShowUpgradeModal(false), 2000);
    } else {
      setUpgradeError(res.message || 'Failed to submit application.');
    }
  };

  return (
    <div className="min-h-screen bg-[#FFF9F1] flex flex-col justify-between text-[#281411]">
      <Navbar />

      <main className="flex-1 py-10 sm:py-14 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 w-full">
        {/* Breadcrumb Navigation */}
        <nav aria-label="Breadcrumb" className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-[#735C57] mb-6">
          <Link href="/" className="hover:text-[#F47735] transition-colors">Home</Link>
          <span>/</span>
          <span className="text-[#281411]">Customer Account</span>
        </nav>

        {/* Dashboard Shell */}
        <div className="flex flex-col lg:flex-row gap-8 items-start">
          <AccountNav />

          {/* Main Dashboard Panel */}
          <div className="flex-1 space-y-6 w-full">
            
            {/* Wholesale Status Alerts */}
            {isWholesalePending && (
              <div className="p-5 rounded-3xl bg-[#FFF9DC] border border-[#FFD83D] text-[#281411] flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 shadow-sm">
                <div className="flex items-start gap-3">
                  <Clock className="w-5 h-5 text-[#F47735] shrink-0 mt-0.5" />
                  <div>
                    <h3 className="font-display font-black text-sm text-[#281411]">
                      Wholesale Business Verification Pending
                    </h3>
                    <p className="text-xs text-[#735C57] mt-0.5">
                      Your business application for <strong>{profile?.business_name}</strong> is under review by our Vandiperiyar facility team. You can place retail orders in the meantime.
                    </p>
                  </div>
                </div>
                <Link
                  href="/products"
                  className="px-4 py-2 rounded-full text-xs font-bold bg-[#F47735] hover:bg-[#E06322] text-white transition-colors shrink-0"
                >
                  Shop Retail &rarr;
                </Link>
              </div>
            )}

            {isWholesaleApproved && (
              <div className="p-5 rounded-3xl bg-[#E8F4EE] border border-[#287B52]/30 text-[#281411] flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 shadow-sm">
                <div className="flex items-start gap-3">
                  <CheckCircle2 className="w-5 h-5 text-[#287B52] shrink-0 mt-0.5" />
                  <div>
                    <h3 className="font-display font-black text-sm text-[#287B52]">
                      Approved Wholesale Partner
                    </h3>
                    <p className="text-xs text-[#735C57] mt-0.5">
                      Verified wholesale B2B pricing and bulk master carton ordering are active for <strong>{profile?.business_name}</strong>.
                    </p>
                  </div>
                </div>
                <Link
                  href="/products?segment=wholesale"
                  className="px-4 py-2 rounded-full text-xs font-bold bg-[#287B52] hover:bg-[#1E6040] text-white transition-colors shrink-0"
                >
                  Shop Wholesale Bulk &rarr;
                </Link>
              </div>
            )}

            {/* Welcome Banner */}
            <div className="bg-[#351C18] text-[#FFF9F1] rounded-3xl p-6 sm:p-8 shadow-md relative overflow-hidden flex flex-col sm:flex-row justify-between items-start sm:items-center gap-6">
              <div className="relative z-10">
                <span className="text-[10px] font-bold uppercase tracking-wider px-3 py-1 rounded-full bg-[#281411] text-[#FFD83D] border border-[#EADBCC]/20 inline-block mb-2">
                  {isBusiness
                    ? isWholesaleApproved
                      ? 'Approved Wholesale Business'
                      : 'Wholesale Application Pending'
                    : 'Individual Retail Customer'}
                </span>
                <h1 className="editorial-headline text-2xl sm:text-4xl font-black text-[#FFF9F1] tracking-tight">
                  WELCOME, {user.full_name || user.email.split('@')[0]}!
                </h1>
                <p className="text-xs sm:text-sm text-[#E8DCCF]/80 mt-1 max-w-md">
                  {isBusiness
                    ? 'Manage your store supply orders, shipping destinations, and GST invoices.'
                    : 'Authentic Kerala snacks freshly fried in pure coconut oil, delivered to your door.'}
                </p>
              </div>

              {!isBusiness && (
                <button
                  onClick={() => setShowUpgradeModal(true)}
                  className="px-6 py-3 rounded-full bg-[#FFD83D] hover:bg-[#F2C71E] text-[#281411] font-display font-black text-xs uppercase tracking-wider shrink-0 transition-colors shadow-sm"
                >
                  Apply for Wholesale
                </button>
              )}
            </div>

            {/* KPI Cards Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <div className="p-5 rounded-3xl bg-[#FFFFFF] border border-[#EADBCC] shadow-xs">
                <div className="flex items-center justify-between text-[#735C57] mb-2">
                  <span className="text-xs font-bold uppercase tracking-wider">Account Segment</span>
                  <User className="w-4 h-4 text-[#F47735]" />
                </div>
                <div className="font-display font-black text-xl text-[#281411]">
                  {isBusiness ? 'B2B Wholesale' : 'B2C Retail'}
                </div>
                <span className="text-[11px] text-[#A89088] mt-1 block">
                  {isWholesaleApproved ? 'Approved Tier' : 'Standard Delivery'}
                </span>
              </div>

              <div className="p-5 rounded-3xl bg-[#FFFFFF] border border-[#EADBCC] shadow-xs">
                <div className="flex items-center justify-between text-[#735C57] mb-2">
                  <span className="text-xs font-bold uppercase tracking-wider">Saved Addresses</span>
                  <MapPin className="w-4 h-4 text-[#287B52]" />
                </div>
                <div className="font-display font-black text-xl text-[#281411]">
                  {addresses.length} {addresses.length === 1 ? 'Location' : 'Locations'}
                </div>
                <Link href="/account/addresses" className="text-[11px] font-bold text-[#F47735] hover:underline mt-1 block">
                  Manage Addresses &rarr;
                </Link>
              </div>

              <div className="p-5 rounded-3xl bg-[#FFFFFF] border border-[#EADBCC] shadow-xs">
                <div className="flex items-center justify-between text-[#735C57] mb-2">
                  <span className="text-xs font-bold uppercase tracking-wider">Quick Reorder</span>
                  <ShoppingBag className="w-4 h-4 text-[#FFD83D]" />
                </div>
                <div className="font-display font-black text-xl text-[#281411]">
                  Fresh Snacks
                </div>
                <Link href="/products" className="text-[11px] font-bold text-[#F47735] hover:underline mt-1 block">
                  Browse Catalogue &rarr;
                </Link>
              </div>
            </div>

            {/* Recent Orders Action Block */}
            <div className="p-6 rounded-3xl bg-[#FFFFFF] border border-[#EADBCC] shadow-xs flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
              <div>
                <h3 className="font-display font-black text-lg text-[#281411]">Order History & GST Invoices</h3>
                <p className="text-xs text-[#735C57] mt-0.5">
                  Track delivery progress, review previous orders, or download official GST tax invoices.
                </p>
              </div>
              <Link
                href="/account/orders"
                className="px-6 py-2.5 rounded-full bg-[#351C18] hover:bg-[#281411] text-[#FFD83D] font-display font-black text-xs uppercase tracking-wider transition-colors shrink-0"
              >
                View Orders &rarr;
              </Link>
            </div>

          </div>
        </div>
      </main>

      {/* Upgrade to Wholesale Modal */}
      {showUpgradeModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div onClick={() => setShowUpgradeModal(false)} className="fixed inset-0 bg-[#281411]/60 backdrop-blur-sm" />
          <div className="relative bg-[#FFFFFF] rounded-3xl border border-[#EADBCC] p-6 sm:p-8 max-w-lg w-full shadow-2xl z-10 animate-in zoom-in-95 duration-200">
            <div className="flex items-center justify-between pb-4 border-b border-[#F7EFE6] mb-4">
              <div className="flex items-center gap-2">
                <Building2 className="w-5 h-5 text-[#F47735]" />
                <h3 className="font-display font-black text-xl text-[#281411]">Apply for Wholesale Access</h3>
              </div>
              <button onClick={() => setShowUpgradeModal(false)} className="w-8 h-8 rounded-full bg-[#F7EFE6] text-[#281411] flex items-center justify-center">
                <X className="w-4 h-4" />
              </button>
            </div>

            {upgradeSuccess ? (
              <div className="py-6 text-center text-[#287B52] font-bold text-sm">
                {upgradeSuccess}
              </div>
            ) : (
              <form onSubmit={handleUpgradeSubmit} className="space-y-4">
                {upgradeError && (
                  <div className="p-3 rounded-xl bg-red-50 text-red-600 text-xs font-bold">
                    {upgradeError}
                  </div>
                )}

                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-[#281411] mb-1">
                    Store / Business Name *
                  </label>
                  <input
                    type="text"
                    required
                    value={upgradeData.businessName}
                    onChange={(e) => setUpgradeData({ ...upgradeData, businessName: e.target.value })}
                    placeholder="e.g. Malabar Supermarket"
                    className="w-full px-4 py-2.5 rounded-xl bg-[#F7EFE6] border border-[#EADBCC] text-xs font-semibold text-[#281411] outline-none focus:border-[#F47735]"
                  />
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block text-xs font-bold uppercase tracking-wider text-[#281411] mb-1">
                      Business Type
                    </label>
                    <select
                      value={upgradeData.businessType}
                      onChange={(e) => setUpgradeData({ ...upgradeData, businessType: e.target.value })}
                      className="w-full px-3 py-2.5 rounded-xl bg-[#F7EFE6] border border-[#EADBCC] text-xs font-semibold text-[#281411] outline-none"
                    >
                      <option value="retail_shop">Supermarket / Grocery</option>
                      <option value="bakery">Bakery / Confectionery</option>
                      <option value="distributor">Regional Distributor</option>
                      <option value="restaurant">Tea Stall / Cafe</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-xs font-bold uppercase tracking-wider text-[#281411] mb-1">
                      GSTIN (Optional)
                    </label>
                    <input
                      type="text"
                      maxLength={15}
                      value={upgradeData.gstin}
                      onChange={(e) => setUpgradeData({ ...upgradeData, gstin: e.target.value })}
                      placeholder="32AAAAA0000A1Z5"
                      className="w-full px-3 py-2.5 rounded-xl bg-[#F7EFE6] border border-[#EADBCC] text-xs font-mono font-semibold text-[#281411] outline-none"
                    />
                  </div>
                </div>

                <button
                  type="submit"
                  disabled={upgradeLoading}
                  className="w-full py-3.5 rounded-full bg-[#F47735] hover:bg-[#E06322] text-[#FFFFFF] font-display font-black text-xs uppercase tracking-wider shadow-md hover:shadow-lg transition-all flex items-center justify-center gap-2 mt-2"
                >
                  {upgradeLoading ? <Loader2 className="w-4 h-4 animate-spin" /> : <span>Submit Wholesale Request</span>}
                </button>
              </form>
            )}
          </div>
        </div>
      )}

      <Footer />
    </div>
  );
}

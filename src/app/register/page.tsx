'use client';

import { useState, useEffect, Suspense } from 'react';
import Link from 'next/link';
import { useRouter, useSearchParams } from 'next/navigation';
import { User, Mail, Phone, Lock, Building2, Eye, EyeOff, ArrowRight, Sparkles, CheckCircle2, Loader2 } from 'lucide-react';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import { useAuth } from '@/context/AuthContext';

function RegisterFormContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const initialType = searchParams.get('type') === 'business' ? 'business' : 'individual';

  const { user, register } = useAuth();

  const [customerType, setCustomerType] = useState<'individual' | 'business'>(initialType);
  const [formData, setFormData] = useState({
    fullName: '',
    email: '',
    mobileNumber: '',
    password: '',
    passwordConfirmation: '',
    businessName: '',
    businessType: 'retail_shop',
    gstin: '',
  });

  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [fieldErrors, setFieldErrors] = useState<Record<string, string>>({});

  useEffect(() => {
    if (user) {
      router.push('/account');
    }
  }, [user, router]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
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
    setError(null);
    setFieldErrors({});

    if (formData.password !== formData.passwordConfirmation) {
      setError('Passwords do not match.');
      return;
    }

    if (formData.password.length < 8) {
      setError('Password must be at least 8 characters long.');
      return;
    }

    if (customerType === 'business' && !formData.businessName.trim()) {
      setError('Business name is required when registering a wholesale business account.');
      setFieldErrors({ business_name: 'Please enter your business or store name.' });
      return;
    }

    setLoading(true);
    const result = await register({
      full_name: formData.fullName.trim(),
      email: formData.email.trim(),
      mobile_number: formData.mobileNumber.trim(),
      customer_type: customerType,
      password: formData.password,
      password_confirmation: formData.passwordConfirmation,
      business_name: customerType === 'business' ? formData.businessName.trim() : undefined,
      business_type: customerType === 'business' ? formData.businessType : undefined,
      gstin: customerType === 'business' ? formData.gstin.trim() || undefined : undefined,
    });
    setLoading(false);

    if (result.success) {
      router.push('/account');
    } else {
      setError(result.error || 'Registration failed. Please check the fields below.');
      if (result.errors) {
        const mappedErrors: Record<string, string> = {};
        Object.entries(result.errors).forEach(([k, v]) => {
          mappedErrors[k] = Array.isArray(v) ? v.join(' ') : String(v);
        });
        setFieldErrors(mappedErrors);
      }
    }
  };

  return (
    <div className="min-h-screen bg-[#FFF9F1] flex flex-col justify-between text-[#281411]">
      <Navbar />

      <main className="flex-1 py-12 sm:py-20 flex items-center justify-center px-4 sm:px-6">
        <div className="w-full max-w-2xl bg-[#FFFFFF] rounded-3xl border border-[#EADBCC] p-8 sm:p-12 shadow-xl">
          {/* Header */}
          <div className="text-center mb-8">
            <span className="text-[10px] font-bold uppercase tracking-wider text-[#F47735] bg-[#FEECE2] px-3 py-1 rounded-full">
              OnFresh Account Registration
            </span>
            <h1 className="editorial-headline text-3xl sm:text-4xl font-black text-[#281411] tracking-tight mt-3">
              JOIN ONFRESH
            </h1>
            <p className="text-xs sm:text-sm text-[#735C57] mt-1 max-w-md mx-auto">
              Select your customer segment to get started with individual snacks or wholesale bulk supply.
            </p>
          </div>

          {/* Customer Segment Toggle */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mb-8">
            <button
              type="button"
              onClick={() => setCustomerType('individual')}
              className={`p-4 rounded-2xl border text-left transition-all cursor-pointer flex flex-col justify-between ${
                customerType === 'individual'
                  ? 'border-[#F47735] bg-[#FEECE2] shadow-sm ring-1 ring-[#F47735]'
                  : 'border-[#EADBCC] bg-[#F7EFE6] hover:border-[#F47735]'
              }`}
            >
              <div className="flex items-center justify-between mb-2">
                <span className="text-xl">🛍️</span>
                <span
                  className={`text-[10px] font-bold uppercase px-2 py-0.5 rounded-full ${
                    customerType === 'individual'
                      ? 'bg-[#F47735] text-white'
                      : 'bg-[#FFFFFF] text-[#735C57]'
                  }`}
                >
                  Retail Customer
                </span>
              </div>
              <div>
                <h4 className="font-display font-black text-sm text-[#281411]">Individual Account</h4>
                <p className="text-[11px] text-[#735C57] mt-0.5">
                  Order individual snack packets for home delivery across Kerala.
                </p>
              </div>
            </button>

            <button
              type="button"
              onClick={() => setCustomerType('business')}
              className={`p-4 rounded-2xl border text-left transition-all cursor-pointer flex flex-col justify-between ${
                customerType === 'business'
                  ? 'border-[#287B52] bg-[#E8F4EE] shadow-sm ring-1 ring-[#287B52]'
                  : 'border-[#EADBCC] bg-[#F7EFE6] hover:border-[#287B52]'
              }`}
            >
              <div className="flex items-center justify-between mb-2">
                <span className="text-xl">📦</span>
                <span
                  className={`text-[10px] font-bold uppercase px-2 py-0.5 rounded-full ${
                    customerType === 'business'
                      ? 'bg-[#287B52] text-white'
                      : 'bg-[#FFFFFF] text-[#735C57]'
                  }`}
                >
                  Wholesale Business
                </span>
              </div>
              <div>
                <h4 className="font-display font-black text-sm text-[#281411]">Business Account</h4>
                <p className="text-[11px] text-[#735C57] mt-0.5">
                  Access approved wholesale rates, volume tiers, and GST invoices.
                </p>
              </div>
            </button>
          </div>

          {error && (
            <div className="mb-6 p-3.5 rounded-2xl bg-red-50 border border-red-200 text-xs text-red-600 font-bold">
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-[#281411] mb-1">
                  Full Name *
                </label>
                <div className="relative">
                  <User className="w-4 h-4 text-[#A89088] absolute left-3.5 top-3" />
                  <input
                    type="text"
                    required
                    name="fullName"
                    value={formData.fullName}
                    onChange={handleChange}
                    placeholder="e.g. Anand Kumar"
                    className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-[#F7EFE6] border border-[#EADBCC] text-xs font-semibold text-[#281411] outline-none focus:border-[#F47735] focus:bg-[#FFFFFF]"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-[#281411] mb-1">
                  Mobile Number *
                </label>
                <div className="relative">
                  <Phone className="w-4 h-4 text-[#A89088] absolute left-3.5 top-3" />
                  <input
                    type="tel"
                    required
                    name="mobileNumber"
                    value={formData.mobileNumber}
                    onChange={handleChange}
                    placeholder="e.g. 9447000000"
                    className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-[#F7EFE6] border border-[#EADBCC] text-xs font-semibold text-[#281411] outline-none focus:border-[#F47735] focus:bg-[#FFFFFF]"
                  />
                </div>
              </div>
            </div>

            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-[#281411] mb-1">
                Email Address *
              </label>
              <div className="relative">
                <Mail className="w-4 h-4 text-[#A89088] absolute left-3.5 top-3" />
                <input
                  type="email"
                  required
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  placeholder="name@example.com"
                  className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-[#F7EFE6] border border-[#EADBCC] text-xs font-semibold text-[#281411] outline-none focus:border-[#F47735] focus:bg-[#FFFFFF]"
                />
              </div>
            </div>

            {/* Business Specific Fields */}
            {customerType === 'business' && (
              <div className="p-4 rounded-2xl bg-[#E8F4EE] border border-[#287B52]/30 space-y-3">
                <span className="text-[10px] font-bold uppercase tracking-wider text-[#287B52] block">
                  Wholesale Business Verification Details
                </span>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <label className="block text-[11px] font-bold text-[#281411] mb-1">
                      Business / Store Name *
                    </label>
                    <input
                      type="text"
                      required={customerType === 'business'}
                      name="businessName"
                      value={formData.businessName}
                      onChange={handleChange}
                      placeholder="e.g. Malabar Supermarket"
                      className="w-full px-3 py-2 rounded-xl bg-[#FFFFFF] border border-[#EADBCC] text-xs font-semibold text-[#281411] outline-none focus:border-[#287B52]"
                    />
                  </div>

                  <div>
                    <label className="block text-[11px] font-bold text-[#281411] mb-1">
                      Business Type
                    </label>
                    <select
                      name="businessType"
                      value={formData.businessType}
                      onChange={handleChange}
                      className="w-full px-3 py-2 rounded-xl bg-[#FFFFFF] border border-[#EADBCC] text-xs font-semibold text-[#281411] outline-none focus:border-[#287B52]"
                    >
                      <option value="retail_shop">Supermarket / Retail Store</option>
                      <option value="bakery">Bakery / Confectionery</option>
                      <option value="distributor">Regional Distributor</option>
                      <option value="restaurant">Restaurant / Tea Stall</option>
                      <option value="caterer">Event Caterer</option>
                    </select>
                  </div>
                </div>

                <div>
                  <label className="block text-[11px] font-bold text-[#281411] mb-1">
                    GSTIN (Optional, for Input Tax Credit)
                  </label>
                  <input
                    type="text"
                    name="gstin"
                    maxLength={15}
                    value={formData.gstin}
                    onChange={handleChange}
                    placeholder="32AAAAA0000A1Z5"
                    className="w-full px-3 py-2 rounded-xl bg-[#FFFFFF] border border-[#EADBCC] text-xs font-mono font-semibold text-[#281411] outline-none focus:border-[#287B52]"
                  />
                </div>
              </div>
            )}

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-[#281411] mb-1">
                  Password *
                </label>
                <div className="relative">
                  <Lock className="w-4 h-4 text-[#A89088] absolute left-3.5 top-3" />
                  <input
                    type={showPassword ? 'text' : 'password'}
                    required
                    name="password"
                    value={formData.password}
                    onChange={handleChange}
                    placeholder="••••••••"
                    className="w-full pl-10 pr-10 py-2.5 rounded-xl bg-[#F7EFE6] border border-[#EADBCC] text-xs font-semibold text-[#281411] outline-none focus:border-[#F47735] focus:bg-[#FFFFFF]"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    aria-label={showPassword ? 'Hide password' : 'Show password'}
                    className="absolute right-3 top-3 text-[#A89088] hover:text-[#281411]"
                  >
                    {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </button>
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-[#281411] mb-1">
                  Confirm Password *
                </label>
                <div className="relative">
                  <Lock className="w-4 h-4 text-[#A89088] absolute left-3.5 top-3" />
                  <input
                    type={showPassword ? 'text' : 'password'}
                    required
                    name="passwordConfirmation"
                    value={formData.passwordConfirmation}
                    onChange={handleChange}
                    placeholder="••••••••"
                    className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-[#F7EFE6] border border-[#EADBCC] text-xs font-semibold text-[#281411] outline-none focus:border-[#F47735] focus:bg-[#FFFFFF]"
                  />
                </div>
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className={`w-full py-4 rounded-full font-display font-black text-xs uppercase tracking-wider shadow-lg hover:shadow-xl transition-all flex items-center justify-center gap-2 mt-4 text-[#FFFFFF] ${
                customerType === 'business'
                  ? 'bg-[#287B52] hover:bg-[#1E6040]'
                  : 'bg-[#F47735] hover:bg-[#E06322]'
              }`}
            >
              {loading ? (
                <Loader2 className="w-4 h-4 animate-spin" />
              ) : (
                <>
                  <span>
                    {customerType === 'business'
                      ? 'Submit Wholesale Application'
                      : 'Create Retail Account'}
                  </span>
                  <ArrowRight className="w-4 h-4" />
                </>
              )}
            </button>
          </form>

          <div className="mt-8 pt-6 border-t border-[#F7EFE6] text-center">
            <p className="text-xs text-[#735C57]">
              Already registered with OnFresh?{' '}
              <Link href="/login" className="font-bold text-[#F47735] hover:underline">
                Sign in to your account
              </Link>
            </p>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}

export default function RegisterPage() {
  return (
    <Suspense
      fallback={
        <div className="min-h-screen bg-[#FFF9F1] flex items-center justify-center">
          <Loader2 className="w-8 h-8 text-[#F47735] animate-spin" />
        </div>
      }
    >
      <RegisterFormContent />
    </Suspense>
  );
}

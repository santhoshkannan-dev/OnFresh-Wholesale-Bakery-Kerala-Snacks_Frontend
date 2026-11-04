'use client';

import { useState, useEffect, Suspense } from 'react';
import Link from 'next/link';
import { useRouter, useSearchParams } from 'next/navigation';
import { Lock, Mail, Eye, EyeOff, ArrowRight, Sparkles, Building2, Loader2 } from 'lucide-react';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import { useAuth } from '@/context/AuthContext';

function LoginFormContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const redirectPath = searchParams.get('redirect') || '/account';

  const { user, login } = useAuth();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (user) {
      router.push(redirectPath);
    }
  }, [user, router, redirectPath]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    if (!email.trim() || !password) {
      setError('Please enter both your email address and password.');
      return;
    }

    setLoading(true);
    const result = await login(email.trim(), password);
    setLoading(false);

    if (result.success) {
      router.push(redirectPath);
    } else {
      setError(result.error || 'Invalid email or password.');
    }
  };

  return (
    <div className="min-h-screen bg-[#FFF9F1] flex flex-col justify-between text-[#281411]">
      <Navbar />

      <main className="flex-1 py-12 sm:py-20 flex items-center justify-center px-4 sm:px-6">
        <div className="w-full max-w-md bg-[#FFFFFF] rounded-3xl border border-[#EADBCC] p-8 sm:p-10 shadow-xl">
          {/* Form Header */}
          <div className="text-center mb-8">
            <div className="w-12 h-12 rounded-2xl bg-[#F47735] text-white flex items-center justify-center font-display font-black text-2xl mx-auto mb-3 shadow-md">
              O
            </div>
            <h1 className="editorial-headline text-3xl font-black text-[#281411] tracking-tight">
              WELCOME BACK
            </h1>
            <p className="text-xs text-[#735C57] mt-1 font-medium">
              Sign in to manage your retail orders or wholesale business account.
            </p>
          </div>

          {error && (
            <div className="mb-6 p-3.5 rounded-2xl bg-red-50 border border-red-200 text-xs text-red-600 font-bold">
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-[#281411] mb-1.5">
                Email Address
              </label>
              <div className="relative">
                <Mail className="w-4 h-4 text-[#A89088] absolute left-3.5 top-3.5" />
                <input
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="name@example.com"
                  className="w-full pl-10 pr-4 py-3 rounded-2xl bg-[#F7EFE6] border border-[#EADBCC] text-xs font-semibold text-[#281411] placeholder:text-[#A89088] outline-none focus:border-[#F47735] focus:bg-[#FFFFFF] transition-all"
                />
              </div>
            </div>

            <div>
              <div className="flex items-center justify-between mb-1.5">
                <label className="text-xs font-bold uppercase tracking-wider text-[#281411]">
                  Password
                </label>
              </div>
              <div className="relative">
                <Lock className="w-4 h-4 text-[#A89088] absolute left-3.5 top-3.5" />
                <input
                  type={showPassword ? 'text' : 'password'}
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••"
                  className="w-full pl-10 pr-10 py-3 rounded-2xl bg-[#F7EFE6] border border-[#EADBCC] text-xs font-semibold text-[#281411] placeholder:text-[#A89088] outline-none focus:border-[#F47735] focus:bg-[#FFFFFF] transition-all"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  aria-label={showPassword ? 'Hide password' : 'Show password'}
                  className="absolute right-3.5 top-3.5 text-[#A89088] hover:text-[#281411]"
                >
                  {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full py-4 rounded-full bg-[#F47735] hover:bg-[#E06322] text-[#FFFFFF] font-display font-black text-xs uppercase tracking-wider shadow-lg hover:shadow-xl transition-all flex items-center justify-center gap-2 mt-2 disabled:opacity-50"
            >
              {loading ? (
                <Loader2 className="w-4 h-4 animate-spin" />
              ) : (
                <>
                  <span>Sign In</span>
                  <ArrowRight className="w-4 h-4" />
                </>
              )}
            </button>
          </form>

          {/* Registration Links */}
          <div className="mt-8 pt-6 border-t border-[#F7EFE6] text-center space-y-2">
            <p className="text-xs text-[#735C57]">
              Don&apos;t have an account yet?{' '}
              <Link href="/register" className="font-bold text-[#F47735] hover:underline">
                Create retail account
              </Link>
            </p>
            <p className="text-xs text-[#735C57]">
              Need wholesale bulk pricing?{' '}
              <Link href="/register?type=business" className="font-bold text-[#287B52] hover:underline">
                Register as Business Partner
              </Link>
            </p>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}

export default function LoginPage() {
  return (
    <Suspense
      fallback={
        <div className="min-h-screen bg-[#FFF9F1] flex items-center justify-center">
          <Loader2 className="w-8 h-8 text-[#F47735] animate-spin" />
        </div>
      }
    >
      <LoginFormContent />
    </Suspense>
  );
}

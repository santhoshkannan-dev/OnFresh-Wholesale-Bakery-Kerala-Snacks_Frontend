'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { ArrowRight, Sparkles, Building2, ShieldCheck, Heart, Mail, CheckCircle2 } from 'lucide-react';

export default function Footer() {
  const [email, setEmail] = useState('');
  const [subscribed, setSubscribed] = useState(false);

  const handleSubscribe = (e: React.FormEvent) => {
    e.preventDefault();
    if (!email) return;
    setSubscribed(true);
    setEmail('');
  };

  return (
    <footer className="bg-[#281411] text-[#FFF9F1] border-t border-[#351C18] relative overflow-hidden">
      {/* Crave Bakery Inspired Bottom CTA Banner */}
      <div className="bg-[#F47735] text-[#FFFFFF] py-12 px-4 sm:px-6 lg:px-8 border-b border-[#E06322] relative overflow-hidden">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center justify-between gap-6 text-center md:text-left relative z-10">
          <div>
            <span className="text-[11px] font-black uppercase tracking-widest text-[#FFD83D] block mb-1">
              Fresh Daily From Vandiperiyar, Idukki
            </span>
            <h3 className="editorial-headline text-3xl sm:text-4xl lg:text-5xl font-black text-[#FFFFFF] tracking-tight">
              Ready For Delicious Bakes & Snacks?
            </h3>
            <p className="text-xs sm:text-sm text-[#FFF9F1]/90 max-w-xl mt-1">
              Crisp banana chips fried in 100% pure coconut oil, authentic Kerala bakery treats, and bulk wholesale supply.
            </p>
          </div>

          <div className="flex flex-wrap items-center justify-center gap-3 shrink-0">
            <Link
              href="/products"
              className="px-7 py-3.5 rounded-full bg-[#FFFFFF] hover:bg-[#FFF9F1] text-[#281411] font-display font-black text-xs uppercase tracking-wider transition-all shadow-md hover:scale-105"
            >
              Order Online
            </Link>
            <Link
              href="/wholesale"
              className="px-7 py-3.5 rounded-full bg-[#281411] hover:bg-[#351C18] text-[#FFD83D] font-display font-black text-xs uppercase tracking-wider border border-[#FFD83D]/40 transition-all hover:scale-105"
            >
              Wholesale Portal
            </Link>
          </div>
        </div>
      </div>

      {/* Top Newsletter Strip */}
      <div className="border-b border-[#351C18] py-12 lg:py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col lg:flex-row items-center justify-between gap-8">
            <div className="text-center lg:text-left max-w-xl">
              <span className="text-[10px] font-black uppercase tracking-widest text-[#FFD83D] flex items-center justify-center lg:justify-start gap-1.5 mb-2">
                <Sparkles className="w-3.5 h-3.5 text-[#F47735]" />
                Fresh From The Ovens of Vandiperiyar
              </span>
              <h3 className="editorial-headline text-3xl sm:text-4xl font-black text-[#FFF9F1] tracking-tight">
                JOIN THE ONFRESH COMMUNITY
              </h3>
              <p className="text-xs sm:text-sm text-[#E8DCCF]/80 mt-1">
                Receive secret recipes, festival snack releases, and exclusive wholesale batch deals.
              </p>
            </div>

            {/* Newsletter Input Box */}
            <div className="w-full lg:w-auto">
              {subscribed ? (
                <div className="flex items-center gap-2 px-6 py-3.5 rounded-full bg-[#287B52] text-white text-xs font-bold shadow-md">
                  <CheckCircle2 className="w-4 h-4" />
                  <span>Welcome! You are on our VIP tasting list.</span>
                </div>
              ) : (
                <form onSubmit={handleSubscribe} className="flex flex-col sm:flex-row gap-2 max-w-md w-full">
                  <input
                    type="email"
                    required
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="Enter your email address..."
                    className="px-5 py-3.5 rounded-full bg-[#351C18] border border-[#EADBCC]/20 text-[#FFF9F1] placeholder:text-[#A89088] text-xs font-medium outline-none focus:border-[#FFD83D] w-full transition-colors"
                  />
                  <button
                    type="submit"
                    className="px-6 py-3.5 rounded-full bg-[#FFD83D] hover:bg-[#F2C71E] text-[#281411] font-display font-black text-xs uppercase tracking-wider shrink-0 transition-all shadow-md flex items-center justify-center gap-1.5"
                  >
                    <span>Subscribe</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </button>
                </form>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Main Footer Directory */}
      <div className="py-16 sm:py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-10 lg:gap-8">
            
            {/* Column 1 & 2: Brand Identity & Location (2 Cols) */}
            <div className="lg:col-span-2 space-y-4">
              <Link href="/" className="flex items-center gap-3 group">
                <div className="w-11 h-11 rounded-2xl bg-[#F47735] text-white flex items-center justify-center font-display font-black text-2xl shadow-md group-hover:scale-105 transition-transform">
                  O
                </div>
                <div className="flex flex-col">
                  <span className="font-display font-black text-2xl text-[#FFF9F1] tracking-tight">
                    ON<span className="text-[#FFD83D]">FRESH</span>
                  </span>
                  <span className="text-[10px] font-bold text-[#FFD83D] uppercase tracking-wider">
                    Wholesale Bakery & Traditional Snacks
                  </span>
                </div>
              </Link>

              <p className="text-xs text-[#E8DCCF]/75 leading-relaxed max-w-sm">
                Authentic Kerala snack manufacturing facility located in Vandiperiyar, Idukki District. Sliced fresh daily and fried in 100% pure coconut oil for individual tea tables and wholesale supermarkets.
              </p>

              <div className="pt-2 text-xs text-[#E8DCCF]/90 space-y-1">
                <p><span className="text-[#FFD83D] font-bold">Facility:</span> Main Road, NH 183 Corridor, Vandiperiyar, Idukki, Kerala 685533</p>
                <p><span className="text-[#FFD83D] font-bold">Support:</span> support@onfresh.in • +91 94470 00000</p>
              </div>

              {/* Trust Badges */}
              <div className="pt-2 flex flex-wrap items-center gap-2">
                <span className="px-3 py-1 rounded-full bg-[#351C18] border border-[#EADBCC]/20 text-[10px] font-bold text-[#FFD83D] uppercase tracking-wider">
                  FSSAI Certified
                </span>
                <span className="px-3 py-1 rounded-full bg-[#351C18] border border-[#EADBCC]/20 text-[10px] font-bold text-[#FFF9F1] uppercase tracking-wider">
                  GST Invoiced
                </span>
                <span className="px-3 py-1 rounded-full bg-[#351C18] border border-[#EADBCC]/20 text-[10px] font-bold text-[#287B52] uppercase tracking-wider">
                  100% Coconut Oil
                </span>
              </div>
            </div>

            {/* Column 3: Traditional Snacks */}
            <div>
              <h4 className="font-display font-black text-sm uppercase tracking-wider text-[#FFD83D] mb-4">
                Snack Varieties
              </h4>
              <ul className="space-y-2.5 text-xs text-[#E8DCCF]/80">
                <li>
                  <Link href="/categories/banana-chips" className="hover:text-[#FFD83D] transition-colors">
                    Kerala Banana Chips
                  </Link>
                </li>
                <li>
                  <Link href="/categories/tapioca-jackfruit-chips" className="hover:text-[#FFD83D] transition-colors">
                    Tapioca & Jackfruit Chips
                  </Link>
                </li>
                <li>
                  <Link href="/categories/murukku-traditional-snacks" className="hover:text-[#FFD83D] transition-colors">
                    Butter & Kai Murukku
                  </Link>
                </li>
                <li>
                  <Link href="/categories/mixture-savouries" className="hover:text-[#FFD83D] transition-colors">
                    Special Kerala Mixture
                  </Link>
                </li>
                <li>
                  <Link href="/categories/banana-chips" className="hover:text-[#FFD83D] transition-colors">
                    Sweet Sharkkara Varatti
                  </Link>
                </li>
                <li>
                  <Link href="/categories/bakery-products" className="hover:text-[#FFD83D] transition-colors">
                    Cardamom Tea Rusks
                  </Link>
                </li>
              </ul>
            </div>

            {/* Column 4: Wholesale B2B */}
            <div>
              <h4 className="font-display font-black text-sm uppercase tracking-wider text-[#FFD83D] mb-4">
                Wholesale B2B
              </h4>
              <ul className="space-y-2.5 text-xs text-[#E8DCCF]/80">
                <li>
                  <Link href="/wholesale" className="hover:text-[#FFD83D] transition-colors flex items-center gap-1 font-bold text-[#FFD83D]">
                    <Building2 className="w-3.5 h-3.5" />
                    <span>Wholesale Portal</span>
                  </Link>
                </li>
                <li>
                  <Link href="/register?type=business" className="hover:text-[#FFD83D] transition-colors">
                    Apply for Business Account
                  </Link>
                </li>
                <li>
                  <Link href="/wholesale#pricing" className="hover:text-[#FFD83D] transition-colors">
                    Tiered Volume Margins
                  </Link>
                </li>
                <li>
                  <Link href="/wholesale#logistics" className="hover:text-[#FFD83D] transition-colors">
                    Regional Master Cartons
                  </Link>
                </li>
                <li>
                  <Link href="/#enquiry" className="hover:text-[#FFD83D] transition-colors">
                    Request Price Catalogue
                  </Link>
                </li>
              </ul>
            </div>

            {/* Column 5: Customer & Support */}
            <div>
              <h4 className="font-display font-black text-sm uppercase tracking-wider text-[#FFD83D] mb-4">
                Customer Care
              </h4>
              <ul className="space-y-2.5 text-xs text-[#E8DCCF]/80">
                <li>
                  <Link href="/account/orders" className="hover:text-[#FFD83D] transition-colors">
                    Track Orders & Invoices
                  </Link>
                </li>
                <li>
                  <Link href="/account/profile" className="hover:text-[#FFD83D] transition-colors">
                    My Profile & Addresses
                  </Link>
                </li>
                <li>
                  <Link href="/cart" className="hover:text-[#FFD83D] transition-colors">
                    Shopping Cart
                  </Link>
                </li>
                <li>
                  <Link href="/login" className="hover:text-[#FFD83D] transition-colors">
                    Sign In / Register
                  </Link>
                </li>
                <li>
                  <Link href="/#about" className="hover:text-[#FFD83D] transition-colors">
                    Our Vandiperiyar Story
                  </Link>
                </li>
                <li>
                  <Link href="/admin/dashboard" className="text-stone-400 hover:text-white transition-colors text-[11px]">
                    Admin Portal (Staff)
                  </Link>
                </li>
              </ul>
            </div>

          </div>
        </div>
      </div>

      {/* Copyright Bar */}
      <div className="border-t border-[#351C18] py-6 text-xs text-[#A89088]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col sm:flex-row items-center justify-between gap-3">
          <p>
            &copy; {new Date().getFullYear()} OnFresh Foods Private Limited. All rights reserved. Vandiperiyar, Idukki District, Kerala.
          </p>
          <div className="flex items-center gap-4 text-[11px]">
            <span>100% Pure Coconut Oil</span>
            <span>•</span>
            <span>B2C & B2B E-Commerce</span>
            <span>•</span>
            <span>Direct Farm Sourcing</span>
          </div>
        </div>
      </div>
    </footer>
  );
}

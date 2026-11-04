'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { Building2, Sparkles, CheckCircle2, ArrowRight, ShieldCheck, PhoneCall, Mail } from 'lucide-react';
import SectionHeading from './ui/SectionHeading';
import DecorativeBadge from './ui/DecorativeBadge';

interface WholesaleEnquirySectionProps {
  initialProductName?: string;
  initialPackageSize?: string;
}

export default function WholesaleEnquirySection({
  initialProductName = '',
  initialPackageSize = '',
}: WholesaleEnquirySectionProps) {
  const [businessName, setBusinessName] = useState('');
  const [contactName, setContactName] = useState('');
  const [phone, setPhone] = useState('');
  const [email, setEmail] = useState('');
  const [city, setCity] = useState('');
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!businessName || !phone) return;
    setSubmitted(true);
  };

  return (
    <section id="enquiry" className="py-20 sm:py-28 bg-[#FFF9F1] border-b border-[#EADBCC] relative overflow-hidden">
      {/* Decorative background glow */}
      <div className="absolute top-1/2 left-0 w-80 h-80 bg-[#FFD83D]/20 rounded-full blur-3xl pointer-events-none -translate-y-1/2" />
      <div className="absolute top-1/2 right-0 w-80 h-80 bg-[#F47735]/15 rounded-full blur-3xl pointer-events-none -translate-y-1/2" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-16 items-center">
          
          {/* Left Column: Business Value Proposition (6 Cols) */}
          <div className="lg:col-span-6 flex flex-col items-start">
            <DecorativeBadge variant="chocolate" icon={<Building2 className="w-3.5 h-3.5 text-[#FFD83D]" />}>
              B2B Wholesale Partnerships
            </DecorativeBadge>

            <h2 className="editorial-headline text-4xl sm:text-6xl font-black text-[#281411] tracking-tight leading-[0.95] mt-4 mb-6">
              YOUR BUSINESS<br />
              <span className="text-[#F47735] underline decoration-[#FFD83D] decoration-wavy decoration-2">
                DESERVES BETTER
              </span>{' '}
              SUPPLY.
            </h2>

            <p className="text-base sm:text-lg text-[#735C57] font-medium leading-relaxed mb-8">
              Reliable bakery and traditional snack supply for retailers, supermarkets, distributors, caterers, and food businesses. Benefit from direct factory wholesale pricing, fresh batch dates, and consistent supply.
            </p>

            {/* Benefit Checkmarks */}
            <div className="space-y-4 w-full mb-8">
              {[
                {
                  title: 'Factory-Direct Wholesale Pricing',
                  desc: 'Save 15% to 30% compared to middleman distributors with volume-tiered rates.',
                },
                {
                  title: 'Airtight Master Carton Packaging',
                  desc: 'Robust corrugated outer boxes with tamper-evident nitrogen-flushed retail pouches.',
                },
                {
                  title: 'Official GST Tax Invoices',
                  desc: 'Full GST compliant billing for claiming legitimate input tax credit (ITC).',
                },
                {
                  title: 'Flexible Minimum Order Quantities',
                  desc: 'Low threshold trial cartons available for new partner supermarkets and retailers.',
                },
              ].map((b, i) => (
                <div key={i} className="flex items-start gap-3.5 p-3.5 rounded-2xl bg-[#FFFFFF] border border-[#EADBCC] shadow-xs">
                  <div className="w-6 h-6 rounded-full bg-[#E8F4EE] text-[#287B52] flex items-center justify-center shrink-0 mt-0.5">
                    <CheckCircle2 className="w-4 h-4" />
                  </div>
                  <div>
                    <h4 className="font-display font-black text-sm text-[#281411]">{b.title}</h4>
                    <p className="text-xs text-[#735C57] mt-0.5">{b.desc}</p>
                  </div>
                </div>
              ))}
            </div>

            <div className="flex flex-wrap items-center gap-4">
              <Link
                href="/wholesale"
                className="px-8 py-3.5 rounded-full bg-[#F47735] hover:bg-[#E06322] text-[#FFFFFF] font-display font-black text-xs uppercase tracking-wider shadow-lg hover:shadow-xl transition-all flex items-center gap-2"
              >
                <span>Visit Wholesale Portal</span>
                <ArrowRight className="w-4 h-4" />
              </Link>

              <Link
                href="/register?type=business"
                className="px-8 py-3.5 rounded-full bg-[#351C18] hover:bg-[#281411] text-[#FFD83D] font-display font-black text-xs uppercase tracking-wider shadow-md transition-colors"
              >
                Apply for Business Account
              </Link>
            </div>
          </div>

          {/* Right Column: Direct Quick Callback Form (6 Cols) */}
          <div className="lg:col-span-6">
            <div className="bg-[#FFFFFF] rounded-3xl p-6 sm:p-10 border border-[#EADBCC] shadow-xl relative">
              <div className="mb-6">
                <span className="text-[10px] font-bold uppercase tracking-widest text-[#F47735] block">
                  Quick Commercial Enquiry
                </span>
                <h3 className="font-display font-black text-2xl text-[#281411]">
                  Request Wholesale Supply Rates
                </h3>
                <p className="text-xs text-[#735C57] mt-1">
                  Our Vandiperiyar factory team responds within 4 business hours.
                </p>
              </div>

              {submitted ? (
                <div className="py-12 text-center flex flex-col items-center">
                  <div className="w-16 h-16 rounded-full bg-[#E8F4EE] text-[#287B52] flex items-center justify-center mb-4">
                    <CheckCircle2 className="w-8 h-8" />
                  </div>
                  <h4 className="font-display font-black text-2xl text-[#281411]">Thank You!</h4>
                  <p className="text-xs sm:text-sm text-[#735C57] max-w-sm mt-2 mb-6">
                    We received your business enquiry for <span className="font-bold text-[#281411]">{businessName}</span>. Our wholesale executive will contact you at <span className="font-bold text-[#281411]">{phone}</span> shortly.
                  </p>
                  <button
                    onClick={() => setSubmitted(false)}
                    className="px-6 py-2 rounded-full bg-[#F7EFE6] text-[#281411] font-bold text-xs hover:bg-[#EADBCC] transition-colors"
                  >
                    Submit Another Enquiry
                  </button>
                </div>
              ) : (
                <form onSubmit={handleSubmit} className="space-y-4">
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-xs font-bold uppercase tracking-wider text-[#281411] mb-1.5">
                        Business / Store Name *
                      </label>
                      <input
                        type="text"
                        required
                        value={businessName}
                        onChange={(e) => setBusinessName(e.target.value)}
                        placeholder="e.g. Malabar Supermarket"
                        className="w-full px-4 py-3 rounded-2xl bg-[#F7EFE6] border border-[#EADBCC] text-[#281411] placeholder:text-[#A89088] text-sm font-semibold outline-none focus:border-[#F47735] focus:bg-[#FFFFFF] transition-all"
                      />
                    </div>

                    <div>
                      <label className="block text-xs font-bold uppercase tracking-wider text-[#281411] mb-1.5">
                        Contact Person *
                      </label>
                      <input
                        type="text"
                        required
                        value={contactName}
                        onChange={(e) => setContactName(e.target.value)}
                        placeholder="e.g. Suresh Kumar"
                        className="w-full px-4 py-3 rounded-2xl bg-[#F7EFE6] border border-[#EADBCC] text-[#281411] placeholder:text-[#A89088] text-sm font-semibold outline-none focus:border-[#F47735] focus:bg-[#FFFFFF] transition-all"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-xs font-bold uppercase tracking-wider text-[#281411] mb-1.5">
                        Mobile Phone / WhatsApp *
                      </label>
                      <input
                        type="tel"
                        required
                        value={phone}
                        onChange={(e) => setPhone(e.target.value)}
                        placeholder="e.g. 9447000000"
                        className="w-full px-4 py-3 rounded-2xl bg-[#F7EFE6] border border-[#EADBCC] text-[#281411] placeholder:text-[#A89088] text-sm font-semibold outline-none focus:border-[#F47735] focus:bg-[#FFFFFF] transition-all"
                      />
                    </div>

                    <div>
                      <label className="block text-xs font-bold uppercase tracking-wider text-[#281411] mb-1.5">
                        Town / District (Kerala) *
                      </label>
                      <input
                        type="text"
                        required
                        value={city}
                        onChange={(e) => setCity(e.target.value)}
                        placeholder="e.g. Kottayam, Kochi, Vandiperiyar"
                        className="w-full px-4 py-3 rounded-2xl bg-[#F7EFE6] border border-[#EADBCC] text-[#281411] placeholder:text-[#A89088] text-sm font-semibold outline-none focus:border-[#F47735] focus:bg-[#FFFFFF] transition-all"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-xs font-bold uppercase tracking-wider text-[#281411] mb-1.5">
                      Products of Interest
                    </label>
                    <input
                      type="text"
                      defaultValue={initialProductName ? `${initialProductName} (${initialPackageSize})` : 'Kerala Banana Chips, Mixture, Murukku'}
                      className="w-full px-4 py-3 rounded-2xl bg-[#F7EFE6] border border-[#EADBCC] text-[#281411] text-sm font-semibold outline-none focus:border-[#F47735] focus:bg-[#FFFFFF] transition-all"
                    />
                  </div>

                  <button
                    type="submit"
                    className="w-full py-4 rounded-full bg-[#351C18] hover:bg-[#281411] text-[#FFD83D] font-display font-black text-xs uppercase tracking-wider shadow-lg hover:shadow-xl transition-all flex items-center justify-center gap-2 mt-4"
                  >
                    <span>Request Wholesale Catalogue & Price List</span>
                    <ArrowRight className="w-4 h-4 text-[#FFD83D]" />
                  </button>
                </form>
              )}

              {/* Bottom Phone Link */}
              <div className="mt-6 pt-4 border-t border-[#F7EFE6] flex items-center justify-between text-xs text-[#735C57]">
                <span className="flex items-center gap-1.5">
                  <PhoneCall className="w-3.5 h-3.5 text-[#287B52]" />
                  <span>Direct Desk: +91 94470 00000</span>
                </span>
                <span className="flex items-center gap-1.5">
                  <Mail className="w-3.5 h-3.5 text-[#F47735]" />
                  <span>wholesale@onfresh.in</span>
                </span>
              </div>
            </div>
          </div>

        </div>
      </div>
    </section>
  );
}

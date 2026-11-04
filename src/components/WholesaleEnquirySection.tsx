'use client';

import React, { useState, useRef } from 'react';
import Link from 'next/link';
import { motion } from 'framer-motion';
import {
  Building2,
  Sparkles,
  CheckCircle2,
  ArrowRight,
  ShieldCheck,
  PhoneCall,
  Mail,
  TrendingUp,
  Boxes,
} from 'lucide-react';
import { useGSAP } from '@gsap/react';
import { registerGSAP, isReducedMotion } from '@/lib/animation/gsapUtils';
import { buttonTap } from '@/lib/animation/motionVariants';

interface WholesaleEnquirySectionProps {
  initialProductName?: string;
  initialPackageSize?: string;
}

export default function WholesaleEnquirySection({
  initialProductName = '',
  initialPackageSize = '',
}: WholesaleEnquirySectionProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const leftColRef = useRef<HTMLDivElement>(null);
  const formCardRef = useRef<HTMLDivElement>(null);

  const [businessName, setBusinessName] = useState('');
  const [contactName, setContactName] = useState('');
  const [phone, setPhone] = useState('');
  const [email, setEmail] = useState('');
  const [city, setCity] = useState('');
  const [submitted, setSubmitted] = useState(false);

  useGSAP(
    () => {
      if (isReducedMotion()) return;
      const { gsap } = registerGSAP();

      if (leftColRef.current) {
        gsap.from(leftColRef.current.children, {
          scrollTrigger: {
            trigger: leftColRef.current,
            start: 'top 80%',
          },
          y: 35,
          opacity: 0,
          stagger: 0.1,
          duration: 0.8,
          ease: 'power3.out',
        });
      }

      if (formCardRef.current) {
        gsap.from(formCardRef.current, {
          scrollTrigger: {
            trigger: formCardRef.current,
            start: 'top 80%',
          },
          y: 40,
          opacity: 0,
          duration: 0.9,
          ease: 'power3.out',
        });
      }

      // Continuous floating animation on decorative icons
      gsap.to('.floating-shape-1', {
        y: -12,
        rotation: 6,
        duration: 3.5,
        repeat: -1,
        yoyo: true,
        ease: 'sine.inOut',
      });
      gsap.to('.floating-shape-2', {
        y: 10,
        rotation: -8,
        duration: 4.2,
        repeat: -1,
        yoyo: true,
        ease: 'sine.inOut',
      });
    },
    { scope: containerRef }
  );

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!businessName || !phone) return;
    setSubmitted(true);
  };

  return (
    <section
      id="enquiry"
      ref={containerRef}
      className="py-20 sm:py-28 bg-[#FFF9EF] border-b border-[#EADBCC] relative overflow-hidden"
    >
      {/* Floating Decorative Elements */}
      <div className="floating-shape-1 absolute top-12 left-10 w-16 h-16 rounded-3xl bg-[#FFB928]/20 border border-[#FFB928]/40 flex items-center justify-center pointer-events-none z-0">
        <Boxes className="w-8 h-8 text-[#542817]/40" />
      </div>
      <div className="floating-shape-2 absolute bottom-16 right-12 w-20 h-20 rounded-full bg-[#287B35]/15 border border-[#287B35]/30 flex items-center justify-center pointer-events-none z-0">
        <TrendingUp className="w-9 h-9 text-[#287B35]/50" />
      </div>

      {/* Decorative background glow */}
      <div className="absolute top-1/2 left-0 w-96 h-96 bg-[#FFB928]/15 rounded-full blur-3xl pointer-events-none -translate-y-1/2" />
      <div className="absolute top-1/2 right-0 w-96 h-96 bg-[#287B35]/10 rounded-full blur-3xl pointer-events-none -translate-y-1/2" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-16 items-center">
          {/* Left Column: Business Value Proposition (6 Cols) */}
          <div ref={leftColRef} className="lg:col-span-6 flex flex-col items-start">
            <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-[#542817] text-[#FFB928] text-xs font-bold tracking-wider uppercase mb-4 shadow-sm">
              <Building2 className="w-3.5 h-3.5 text-[#FFB928]" />
              <span>B2B Wholesale Partnerships</span>
            </div>

            <h2 className="editorial-headline text-4xl sm:text-6xl font-black text-[#542817] tracking-tight leading-[0.95] mb-6">
              LET&apos;S GROW<br />
              <span className="text-[#287B35] underline decoration-[#FFB928] decoration-wavy decoration-2">
                YOUR BUSINESS.
              </span>
            </h2>

            <p className="text-base sm:text-lg text-[#735C57] font-medium leading-relaxed mb-8">
              Your trusted partner for bakery products and traditional Kerala snacks. Direct factory wholesale pricing, daily batch freshness, and dependable dispatch across Kerala and South India.
            </p>

            {/* Benefit Checkmarks */}
            <div className="space-y-4 w-full mb-8">
              {[
                {
                  title: 'Factory-Direct Wholesale Pricing',
                  desc: 'Save 15% to 30% compared to middleman distributors with clear volume-tiered rates.',
                },
                {
                  title: 'Airtight Master Carton Packaging',
                  desc: 'Robust 5-ply corrugated outer boxes with tamper-evident nitrogen-flushed retail pouches.',
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
                <div
                  key={i}
                  className="flex items-start gap-3.5 p-3.5 rounded-2xl bg-[#FFFFFF] border border-[#EADBCC] shadow-xs"
                >
                  <div className="w-6 h-6 rounded-full bg-[#E8F5E9] text-[#287B35] flex items-center justify-center shrink-0 mt-0.5">
                    <CheckCircle2 className="w-4 h-4" />
                  </div>
                  <div>
                    <h4 className="font-display font-black text-sm text-[#542817]">{b.title}</h4>
                    <p className="text-xs text-[#735C57] mt-0.5">{b.desc}</p>
                  </div>
                </div>
              ))}
            </div>

            <div className="flex flex-wrap items-center gap-4">
              <motion.div variants={buttonTap} initial="rest" whileHover="hover" whileTap="tap">
                <Link
                  href="/wholesale"
                  className="px-8 py-3.5 rounded-full bg-[#287B35] hover:bg-[#20632a] text-[#FFFFFF] font-display font-black text-xs uppercase tracking-wider shadow-lg hover:shadow-xl transition-all flex items-center gap-2"
                >
                  <span>Visit Wholesale Portal</span>
                  <ArrowRight className="w-4 h-4" />
                </Link>
              </motion.div>

              <motion.div variants={buttonTap} initial="rest" whileHover="hover" whileTap="tap">
                <Link
                  href="/register?type=business"
                  className="px-8 py-3.5 rounded-full bg-[#542817] hover:bg-[#3D1C10] text-[#FFB928] font-display font-black text-xs uppercase tracking-wider shadow-md transition-colors"
                >
                  Apply for Business Account
                </Link>
              </motion.div>
            </div>
          </div>

          {/* Right Column: Direct Quick Callback Form (6 Cols) */}
          <div ref={formCardRef} className="lg:col-span-6">
            <div className="bg-[#FFFFFF] rounded-3xl p-6 sm:p-10 border border-[#EADBCC] shadow-xl relative">
              <div className="mb-6">
                <span className="text-[10px] font-bold uppercase tracking-widest text-[#287B35] block">
                  Quick Commercial Enquiry
                </span>
                <h3 className="font-display font-black text-2xl text-[#542817]">
                  Request Wholesale Supply Rates
                </h3>
                <p className="text-xs text-[#735C57] mt-1">
                  Our Vandiperiyar factory team responds within 4 business hours.
                </p>
              </div>

              {submitted ? (
                <div className="py-12 text-center flex flex-col items-center">
                  <div className="w-16 h-16 rounded-full bg-[#E8F5E9] text-[#287B35] flex items-center justify-center mb-4">
                    <CheckCircle2 className="w-8 h-8" />
                  </div>
                  <h4 className="font-display font-black text-2xl text-[#542817]">Thank You!</h4>
                  <p className="text-xs sm:text-sm text-[#735C57] max-w-sm mt-2 mb-6">
                    We received your business enquiry for{' '}
                    <span className="font-bold text-[#542817]">{businessName}</span>. Our wholesale
                    executive will contact you at{' '}
                    <span className="font-bold text-[#542817]">{phone}</span> shortly.
                  </p>
                  <button
                    onClick={() => setSubmitted(false)}
                    className="px-6 py-2 rounded-full bg-[#FFF9EF] text-[#542817] font-bold text-xs hover:bg-[#EADBCC] transition-colors"
                  >
                    Submit Another Enquiry
                  </button>
                </div>
              ) : (
                <form onSubmit={handleSubmit} className="space-y-4">
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-xs font-bold uppercase tracking-wider text-[#542817] mb-1.5">
                        Business / Store Name *
                      </label>
                      <input
                        type="text"
                        required
                        value={businessName}
                        onChange={(e) => setBusinessName(e.target.value)}
                        placeholder="e.g. High Range Supermarket"
                        className="w-full px-4 py-3 rounded-2xl bg-[#FFF9EF] border border-[#EADBCC] text-[#542817] placeholder:text-[#A89088] text-sm font-semibold outline-none focus:border-[#287B35] focus:bg-[#FFFFFF] transition-all"
                      />
                    </div>

                    <div>
                      <label className="block text-xs font-bold uppercase tracking-wider text-[#542817] mb-1.5">
                        Contact Person *
                      </label>
                      <input
                        type="text"
                        required
                        value={contactName}
                        onChange={(e) => setContactName(e.target.value)}
                        placeholder="e.g. Thomas Varghese"
                        className="w-full px-4 py-3 rounded-2xl bg-[#FFF9EF] border border-[#EADBCC] text-[#542817] placeholder:text-[#A89088] text-sm font-semibold outline-none focus:border-[#287B35] focus:bg-[#FFFFFF] transition-all"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-xs font-bold uppercase tracking-wider text-[#542817] mb-1.5">
                        Mobile Phone / WhatsApp *
                      </label>
                      <input
                        type="tel"
                        required
                        value={phone}
                        onChange={(e) => setPhone(e.target.value)}
                        placeholder="+91 94470 00000"
                        className="w-full px-4 py-3 rounded-2xl bg-[#FFF9EF] border border-[#EADBCC] text-[#542817] placeholder:text-[#A89088] text-sm font-semibold outline-none focus:border-[#287B35] focus:bg-[#FFFFFF] transition-all"
                      />
                    </div>

                    <div>
                      <label className="block text-xs font-bold uppercase tracking-wider text-[#542817] mb-1.5">
                        City / Town in Kerala
                      </label>
                      <input
                        type="text"
                        value={city}
                        onChange={(e) => setCity(e.target.value)}
                        placeholder="e.g. Vandiperiyar / Kottayam"
                        className="w-full px-4 py-3 rounded-2xl bg-[#FFF9EF] border border-[#EADBCC] text-[#542817] placeholder:text-[#A89088] text-sm font-semibold outline-none focus:border-[#287B35] focus:bg-[#FFFFFF] transition-all"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-xs font-bold uppercase tracking-wider text-[#542817] mb-1.5">
                      Business Email (Optional)
                    </label>
                    <input
                      type="email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      placeholder="buyer@yourcompany.com"
                      className="w-full px-4 py-3 rounded-2xl bg-[#FFF9EF] border border-[#EADBCC] text-[#542817] placeholder:text-[#A89088] text-sm font-semibold outline-none focus:border-[#287B35] focus:bg-[#FFFFFF] transition-all"
                    />
                  </div>

                  <motion.button
                    variants={buttonTap}
                    initial="rest"
                    whileHover="hover"
                    whileTap="tap"
                    type="submit"
                    className="w-full py-4 rounded-full bg-[#542817] hover:bg-[#3D1C10] text-[#FFB928] font-display font-black text-xs uppercase tracking-wider shadow-lg transition-all flex items-center justify-center gap-2 mt-2"
                  >
                    <span>Request Wholesale Catalogue & Price List</span>
                    <ArrowRight className="w-4 h-4" />
                  </motion.button>
                </form>
              )}

              <div className="mt-6 pt-6 border-t border-[#EADBCC] flex items-center justify-between text-xs text-[#735C57]">
                <div className="flex items-center gap-1.5">
                  <ShieldCheck className="w-4 h-4 text-[#287B35]" />
                  <span>Verified B2B Direct</span>
                </div>
                <span>Call Us: +91 94470 12345</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

'use client';

import React, { useState, useRef } from 'react';
import Link from 'next/link';
import { motion, AnimatePresence } from 'framer-motion';
import {
  MapPin,
  Phone,
  Mail,
  Clock,
  Star,
  MessageSquare,
  Building2,
  Sparkles,
  ChevronLeft,
  ChevronRight,
  ExternalLink,
} from 'lucide-react';
import { useGSAP } from '@gsap/react';
import { registerGSAP, isReducedMotion } from '@/lib/animation/gsapUtils';
import { cardHover, buttonTap } from '@/lib/animation/motionVariants';

const TESTIMONIALS = [
  {
    id: 1,
    name: 'Thomas Varghese',
    role: 'Proprietor, High Range Supermarket',
    location: 'Kattappana, Idukki',
    comment:
      'The coconut oil aroma and crunch of OnFresh banana chips is consistent every single week. Our supermarket customers specifically ask for the 500g pouches over commercial packaged chips.',
    rating: 5,
    type: 'Wholesale Partner',
    metric: '400+ Cartons Ordered',
    initials: 'TV',
  },
  {
    id: 2,
    name: 'Dr. Lakshmi Nair',
    role: 'Individual Customer',
    location: 'Kochi, Kerala',
    comment:
      'Ordered 4 packets of Sharkkara Varatti and classic chips online. Arrived within 48 hours in perfect condition without being broken or crushed. Reminds me of the authentic taste from my childhood.',
    rating: 5,
    type: 'Retail Customer',
    metric: 'Verified Online Purchase',
    initials: 'LN',
  },
  {
    id: 3,
    name: 'M. K. Rasheed',
    role: 'Manager, Tea Valley Bakery & Cafe',
    location: 'Kumily / Thekkady',
    comment:
      'We stock OnFresh cardamom tea rusks, butter murukku, and mixture on our display counter. Tourists visiting Periyar Tiger Reserve love taking them back as authentic Kerala gifts.',
    rating: 5,
    type: 'Bakery Partner',
    metric: 'Daily Counter Supply',
    initials: 'MR',
  },
  {
    id: 4,
    name: 'Anjali Menon',
    role: 'Corporate Gifting Coordinator',
    location: 'Thiruvananthapuram',
    comment:
      'We curated 200 festive gift hampers for Onam using OnFresh snacks. The team at Vandiperiyar managed custom labelling and on-time courier dispatch seamlessly. Exceptional feedback!',
    rating: 5,
    type: 'Bulk Corporate Buyer',
    metric: '200 Gift Hampers',
    initials: 'AM',
  },
];

export default function ContactSection() {
  const containerRef = useRef<HTMLDivElement>(null);
  const headerRef = useRef<HTMLDivElement>(null);
  const [activeIdx, setActiveIdx] = useState(0);

  useGSAP(
    () => {
      if (isReducedMotion()) return;
      const { gsap } = registerGSAP();

      if (headerRef.current) {
        gsap.from(headerRef.current.children, {
          scrollTrigger: {
            trigger: headerRef.current,
            start: 'top 85%',
          },
          y: 30,
          opacity: 0,
          stagger: 0.1,
          duration: 0.8,
          ease: 'power3.out',
        });
      }

      const cards = containerRef.current?.querySelectorAll('.contact-card');
      if (cards && cards.length > 0) {
        gsap.from(cards, {
          scrollTrigger: {
            trigger: containerRef.current?.querySelector('.contact-grid'),
            start: 'top 85%',
          },
          y: 35,
          opacity: 0,
          stagger: 0.1,
          duration: 0.8,
          ease: 'power3.out',
        });
      }
    },
    { scope: containerRef }
  );

  const prevReview = () => {
    setActiveIdx((curr) => (curr === 0 ? TESTIMONIALS.length - 1 : curr - 1));
  };

  const nextReview = () => {
    setActiveIdx((curr) => (curr === TESTIMONIALS.length - 1 ? 0 : curr + 1));
  };

  const current = TESTIMONIALS[activeIdx];

  return (
    <section
      id="contact"
      ref={containerRef}
      className="py-20 sm:py-28 bg-[#FFF9EF] relative overflow-hidden"
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        {/* Section Header */}
        <div ref={headerRef} className="text-center max-w-3xl mx-auto mb-16">
          <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-[#FFB928]/30 border border-[#FFB928] text-[#542817] text-xs font-bold tracking-wider uppercase mb-3">
            <Sparkles className="w-3.5 h-3.5 text-[#287B35]" />
            Community & Partner Voices
          </div>
          <h2 className="editorial-headline text-3xl sm:text-5xl font-black text-[#542817] tracking-tight mb-4">
            LOVED BY FAMILIES. TRUSTED BY STORES.
          </h2>
          <p className="text-sm sm:text-base text-[#735C57] font-medium max-w-xl mx-auto leading-relaxed">
            From evening tea lovers across Kerala to busy supermarkets, see what our customers and wholesale partners say about OnFresh.
          </p>
        </div>

        {/* Interactive Featured Review Carousel & Mini Grid */}
        <div className="mb-20">
          <div className="rounded-[2.5rem] bg-[#542817] text-[#FFF9EF] p-8 sm:p-14 border border-[#FFB928]/30 shadow-2xl relative overflow-hidden">
            {/* Background SVG decorative swirl */}
            <div className="absolute top-0 right-0 w-80 h-80 bg-[#FFB928]/10 rounded-full blur-3xl pointer-events-none" />
            <div className="absolute bottom-0 left-0 w-80 h-80 bg-[#287B35]/15 rounded-full blur-3xl pointer-events-none" />

            <div className="relative z-10 max-w-4xl mx-auto">
              <div className="flex items-center justify-between gap-4 mb-8">
                <div className="flex items-center gap-1.5 text-[#FFB928]">
                  {[...Array(5)].map((_, i) => (
                    <Star key={i} className="w-5 h-5 fill-current" />
                  ))}
                  <span className="ml-2 text-xs font-bold text-[#FFF9EF]/80">5.0 Star Rating</span>
                </div>

                {/* Carousel Controls */}
                <div className="flex items-center gap-2">
                  <motion.button
                    variants={buttonTap}
                    initial="rest"
                    whileHover="hover"
                    whileTap="tap"
                    onClick={prevReview}
                    aria-label="Previous review"
                    className="w-10 h-10 rounded-full bg-[#3D1C10] border border-[#FFB928]/30 hover:border-[#FFB928] text-[#FFB928] flex items-center justify-center transition-colors shadow-sm"
                  >
                    <ChevronLeft className="w-5 h-5" />
                  </motion.button>
                  <span className="text-xs font-bold text-[#FFB928] px-1">
                    {activeIdx + 1} / {TESTIMONIALS.length}
                  </span>
                  <motion.button
                    variants={buttonTap}
                    initial="rest"
                    whileHover="hover"
                    whileTap="tap"
                    onClick={nextReview}
                    aria-label="Next review"
                    className="w-10 h-10 rounded-full bg-[#3D1C10] border border-[#FFB928]/30 hover:border-[#FFB928] text-[#FFB928] flex items-center justify-center transition-colors shadow-sm"
                  >
                    <ChevronRight className="w-5 h-5" />
                  </motion.button>
                </div>
              </div>

              {/* Animated Review Quote */}
              <AnimatePresence mode="wait">
                <motion.div
                  key={current.id}
                  initial={{ opacity: 0, y: 15 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -15 }}
                  transition={{ duration: 0.35, ease: 'easeOut' }}
                  className="min-h-[160px] flex flex-col justify-between"
                >
                  <p className="font-serif italic text-xl sm:text-2xl lg:text-3xl text-[#FFF9EF] leading-relaxed mb-8">
                    &ldquo;{current.comment}&rdquo;
                  </p>

                  <div className="flex flex-wrap items-center justify-between gap-4 pt-6 border-t border-[#FFB928]/20">
                    <div className="flex items-center gap-4">
                      <div className="w-12 h-12 rounded-full bg-[#FFB928] text-[#542817] font-display font-black text-base flex items-center justify-center shadow-md">
                        {current.initials}
                      </div>
                      <div>
                        <h4 className="font-display font-black text-lg text-[#FFF9EF]">
                          {current.name}
                        </h4>
                        <p className="text-xs text-[#EADBCC]">
                          {current.role} • {current.location}
                        </p>
                      </div>
                    </div>

                    <div className="flex items-center gap-3">
                      <span className="text-xs font-bold uppercase tracking-wider px-3.5 py-1.5 rounded-full bg-[#287B35] text-white">
                        {current.type}
                      </span>
                      <span className="text-xs text-[#FFB928] font-semibold hidden sm:inline-block">
                        {current.metric}
                      </span>
                    </div>
                  </div>
                </motion.div>
              </AnimatePresence>
            </div>
          </div>
        </div>

        {/* Factory Location & Direct Desk Info */}
        <div className="p-8 sm:p-12 rounded-[2.5rem] bg-[#F7EFE6] border border-[#EADBCC]">
          <div className="text-center max-w-2xl mx-auto mb-10">
            <span className="text-[10px] font-black uppercase tracking-widest text-[#287B35] block mb-1">
              Direct Contact & Visiting Desk
            </span>
            <h3 className="editorial-headline text-3xl font-black text-[#542817]">
              VISIT OUR VANDIPERIYAR FACILITY
            </h3>
            <p className="text-xs sm:text-sm text-[#735C57] mt-1">
              For wholesale inquiries, direct retail pickup, or factory dispatch logistics.
            </p>
          </div>

          <div className="contact-grid grid grid-cols-1 md:grid-cols-3 gap-6">
            {/* Manufacturing Location */}
            <motion.div
              variants={cardHover}
              initial="rest"
              whileHover="hover"
              className="contact-card p-6 rounded-3xl bg-[#FFFFFF] border border-[#EADBCC] flex flex-col justify-between shadow-xs"
            >
              <div>
                <div className="flex items-center gap-3 mb-4">
                  <div className="w-10 h-10 rounded-2xl bg-[#E8F5E9] text-[#287B35] flex items-center justify-center">
                    <MapPin className="w-5 h-5" />
                  </div>
                  <h4 className="font-display font-black text-base text-[#542817]">
                    Manufacturing Facility
                  </h4>
                </div>
                <p className="text-xs sm:text-sm text-[#735C57] leading-relaxed">
                  OnFresh Bakery & Snacks Works
                  <br />
                  NH 183 Highway Corridor, Vandiperiyar
                  <br />
                  Idukki District, Kerala — PIN 685533
                </p>
              </div>

              <div className="pt-4 mt-4 border-t border-[#EADBCC]/60 flex items-center justify-between">
                <span className="text-[11px] text-[#A89088] font-semibold">Near Thekkady Belt</span>
                <a
                  href="https://maps.google.com/?q=Vandiperiyar,+Idukki,+Kerala"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-1 text-xs font-bold text-[#287B35] hover:underline"
                >
                  <span>Open Maps</span>
                  <ExternalLink className="w-3 h-3" />
                </a>
              </div>
            </motion.div>

            {/* Direct Phone & WhatsApp */}
            <motion.div
              variants={cardHover}
              initial="rest"
              whileHover="hover"
              className="contact-card p-6 rounded-3xl bg-[#FFFFFF] border border-[#EADBCC] flex flex-col justify-between shadow-xs"
            >
              <div>
                <div className="flex items-center gap-3 mb-4">
                  <div className="w-10 h-10 rounded-2xl bg-[#FFF9DC] text-[#542817] flex items-center justify-center">
                    <Phone className="w-5 h-5" />
                  </div>
                  <h4 className="font-display font-black text-base text-[#542817]">
                    Phone & WhatsApp
                  </h4>
                </div>
                <p className="text-xs sm:text-sm text-[#735C57] leading-relaxed">
                  Wholesale Desk: +91 94470 00000
                  <br />
                  Retail Customer Care: +91 94471 00000
                  <br />
                  Email: support@onfresh.in
                </p>
              </div>

              <div className="pt-4 mt-4 border-t border-[#EADBCC]/60 flex items-center justify-between">
                <span className="text-[11px] text-[#287B35] font-bold">
                  Mon - Sat: 8:00 AM - 7:00 PM IST
                </span>
                <span className="w-2.5 h-2.5 rounded-full bg-[#287B35]" />
              </div>
            </motion.div>

            {/* Dispatch Schedules */}
            <motion.div
              variants={cardHover}
              initial="rest"
              whileHover="hover"
              className="contact-card p-6 rounded-3xl bg-[#FFFFFF] border border-[#EADBCC] flex flex-col justify-between shadow-xs"
            >
              <div>
                <div className="flex items-center gap-3 mb-4">
                  <div className="w-10 h-10 rounded-2xl bg-[#EBF7F8] text-[#542817] flex items-center justify-center">
                    <Clock className="w-5 h-5" />
                  </div>
                  <h4 className="font-display font-black text-base text-[#542817]">
                    Dispatch Schedules
                  </h4>
                </div>
                <p className="text-xs sm:text-sm text-[#735C57] leading-relaxed">
                  Individual retail orders packed fresh & dispatched next morning.
                  <br />
                  Bulk wholesale cartons dispatched via dedicated carriers in 24-48 hrs.
                </p>
              </div>

              <div className="pt-4 mt-4 border-t border-[#EADBCC]/60 flex items-center justify-between">
                <span className="text-[11px] text-[#542817] font-bold">
                  100% Fresh Batch Guarantee
                </span>
                <Sparkles className="w-4 h-4 text-[#FFB928]" />
              </div>
            </motion.div>
          </div>
        </div>
      </div>
    </section>
  );
}

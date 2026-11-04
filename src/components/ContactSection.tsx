'use client';

import React from 'react';
import Link from 'next/link';
import { MapPin, Phone, Mail, Clock, Star, MessageSquare, Building2, Sparkles } from 'lucide-react';
import SectionHeading from './ui/SectionHeading';
import DecorativeBadge from './ui/DecorativeBadge';

export default function ContactSection() {
  const testimonials = [
    {
      name: 'Thomas Varghese',
      role: 'Proprietor, High Range Supermarket',
      location: 'Kattappana, Idukki',
      comment:
        'The coconut oil aroma and crunch of OnFresh banana chips is consistent every week. Our supermarket customers specifically ask for the 500 g pouches.',
      rating: 5,
      type: 'Wholesale Partner',
      badgeColor: 'bg-[#FFD83D] text-[#281411]',
    },
    {
      name: 'Dr. Lakshmi Nair',
      role: 'Individual Customer',
      location: 'Kochi, Kerala',
      comment:
        'Ordered 4 packets of Sharkkara Varatti and classic chips online. Arrived within 48 hours in perfect condition without being broken or crushed. Reminds me of home.',
      rating: 5,
      type: 'Retail Customer',
      badgeColor: 'bg-[#F5A477] text-[#281411]',
    },
    {
      name: 'M. K. Rasheed',
      role: 'Manager, Tea Valley Bakery & Cafe',
      location: 'Kumily / Thekkady',
      comment:
        'We stock OnFresh cardamom tea rusks and butter murukku on our display counter. The tourists love taking them back as authentic Kerala gifts.',
      rating: 5,
      type: 'Bakery Partner',
      badgeColor: 'bg-[#A5DCE0] text-[#281411]',
    },
  ];

  return (
    <section id="contact" className="py-20 sm:py-28 bg-[#FFF9F1] relative">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* 1. Testimonial Header & Grid */}
        <div className="text-center max-w-3xl mx-auto mb-16">
          <SectionHeading
            badge="Community & Partner Voices"
            badgeVariant="peach"
            title="LOVED BY FAMILIES."
            highlight="TRUSTED BY STORES."
            subtitle="From evening tea lovers across Kerala to busy supermarkets, see what our customers and partners say about OnFresh."
          />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 sm:gap-8 mb-24">
          {testimonials.map((t, idx) => (
            <div
              key={idx}
              className="p-6 sm:p-8 rounded-3xl bg-[#FFFFFF] border border-[#EADBCC] shadow-sm hover:shadow-xl hover:-translate-y-1 transition-all duration-300 flex flex-col justify-between"
            >
              <div>
                <div className="flex items-center justify-between mb-4">
                  <div className="flex items-center gap-1 text-[#F47735]">
                    {[...Array(t.rating)].map((_, i) => (
                      <Star key={i} className="w-4 h-4 fill-current" />
                    ))}
                  </div>
                  <span className={`text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-full ${t.badgeColor}`}>
                    {t.type}
                  </span>
                </div>

                <p className="text-sm font-medium text-[#735C57] italic leading-relaxed mb-6">
                  &ldquo;{t.comment}&rdquo;
                </p>
              </div>

              <div className="pt-4 border-t border-[#F7EFE6] flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-[#351C18] text-[#FFF9F1] font-display font-black text-sm flex items-center justify-center">
                  {t.name.charAt(0)}
                </div>
                <div>
                  <h4 className="font-display font-black text-sm text-[#281411]">{t.name}</h4>
                  <p className="text-[11px] text-[#A89088]">{t.role} • {t.location}</p>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* 2. Factory Location & Contact Cards */}
        <div className="p-8 sm:p-12 rounded-[2.5rem] bg-[#F7EFE6] border border-[#EADBCC]">
          <div className="text-center max-w-2xl mx-auto mb-10">
            <span className="text-[10px] font-black uppercase tracking-widest text-[#F47735] block mb-1">
              Direct Contact
            </span>
            <h3 className="font-display font-black text-3xl text-[#281411]">
              Visit or Contact Our Vandiperiyar Desk
            </h3>
            <p className="text-xs sm:text-sm text-[#735C57] mt-1">
              For wholesale inquiries, direct retail pickup, or dispatch queries.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {/* Location */}
            <div className="p-6 rounded-2xl bg-[#FFFFFF] border border-[#EADBCC] flex flex-col justify-between shadow-xs">
              <div className="flex items-center gap-3 mb-3">
                <div className="w-10 h-10 rounded-xl bg-[#E8F4EE] text-[#287B52] flex items-center justify-center">
                  <MapPin className="w-5 h-5" />
                </div>
                <h4 className="font-display font-black text-base text-[#281411]">Manufacturing Facility</h4>
              </div>
              <p className="text-xs text-[#735C57] leading-relaxed">
                OnFresh Snacks & Bakery Works<br />
                NH 183 Highway Corridor, Vandiperiyar<br />
                Idukki District, Kerala — PIN 685533
              </p>
              <span className="text-[10px] text-[#A89088] mt-3 block font-semibold">Near Thekkady Tourism Belt</span>
            </div>

            {/* Direct Phone & WhatsApp */}
            <div className="p-6 rounded-2xl bg-[#FFFFFF] border border-[#EADBCC] flex flex-col justify-between shadow-xs">
              <div className="flex items-center gap-3 mb-3">
                <div className="w-10 h-10 rounded-xl bg-[#FFF9DC] text-[#F47735] flex items-center justify-center">
                  <Phone className="w-5 h-5" />
                </div>
                <h4 className="font-display font-black text-base text-[#281411]">Phone & WhatsApp</h4>
              </div>
              <p className="text-xs text-[#735C57] leading-relaxed">
                Wholesale Desk: +91 94470 00000<br />
                Retail Enquiries: +91 94471 00000<br />
                Email: support@onfresh.in
              </p>
              <span className="text-[10px] text-[#287B52] mt-3 block font-bold">Mon - Sat: 8:00 AM - 7:00 PM IST</span>
            </div>

            {/* Order Timelines */}
            <div className="p-6 rounded-2xl bg-[#FFFFFF] border border-[#EADBCC] flex flex-col justify-between shadow-xs">
              <div className="flex items-center gap-3 mb-3">
                <div className="w-10 h-10 rounded-xl bg-[#EBF7F8] text-[#351C18] flex items-center justify-center">
                  <Clock className="w-5 h-5" />
                </div>
                <h4 className="font-display font-black text-base text-[#281411]">Dispatch Schedules</h4>
              </div>
              <p className="text-xs text-[#735C57] leading-relaxed">
                Retail orders dispatched next business morning.<br />
                Bulk wholesale cartons shipped via logistics within 24-48 hours.
              </p>
              <span className="text-[10px] text-[#F47735] mt-3 block font-bold">100% Fresh Batch Guaranteed</span>
            </div>
          </div>
        </div>

      </div>
    </section>
  );
}

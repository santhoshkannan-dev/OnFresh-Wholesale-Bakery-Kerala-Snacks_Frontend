'use client';

import { useState, useEffect } from 'react';
import Navbar from '@/components/Navbar';
import HeroSection from '@/components/HeroSection';
import CategoryShowcase from '@/components/CategoryShowcase';
import FeaturedProducts from '@/components/FeaturedProducts';
import WhyChooseOnFresh from '@/components/WhyChooseOnFresh';
import WholesaleEnquirySection from '@/components/WholesaleEnquirySection';
import AboutSection from '@/components/AboutSection';
import ContactSection from '@/components/ContactSection';
import Footer from '@/components/Footer';
import DiagnosticsModal from '@/components/DiagnosticsModal';
import HealthStatusCard from '@/components/HealthStatusCard';
import { getBackendHealth } from '@/lib/api';

export default function Home() {
  const [diagnosticsOpen, setDiagnosticsOpen] = useState(false);
  const [apiConnected, setApiConnected] = useState<boolean | null>(null);
  const [selectedEnquiryProduct, setSelectedEnquiryProduct] = useState<{
    productName: string;
    packageSize: string;
  } | null>(null);

  useEffect(() => {
    // Quick background check for API connection state
    getBackendHealth().then((res) => {
      setApiConnected(res.data !== null && res.data.status === 'healthy');
    });
  }, []);

  const handleSelectProductForEnquiry = (productName: string, packageSize: string) => {
    setSelectedEnquiryProduct({ productName, packageSize });
    // Smooth scroll down to enquiry form
    const enquiryElem = document.getElementById('enquiry');
    if (enquiryElem) {
      enquiryElem.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <div className="min-h-screen bg-[#FFF9F1] text-[#281411] selection:bg-[#FFD83D] selection:text-[#281411] flex flex-col justify-between">
      {/* Navigation */}
      <Navbar
        onOpenDiagnostics={() => setDiagnosticsOpen(true)}
        apiConnected={apiConnected}
      />

      <main className="flex-1">
        {/* 1. Hero Section */}
        <HeroSection
          onWholesaleClick={() => {
            const elem = document.getElementById('enquiry');
            if (elem) elem.scrollIntoView({ behavior: 'smooth' });
          }}
        />

        {/* 2. Product Categories */}
        <CategoryShowcase />

        {/* 3. Featured Products with Interactive Packaging Selector */}
        <FeaturedProducts />

        {/* 4. Why Choose OnFresh */}
        <WhyChooseOnFresh />

        {/* 5. Wholesale Enquiry Form */}
        <WholesaleEnquirySection
          initialProductName={selectedEnquiryProduct?.productName}
          initialPackageSize={selectedEnquiryProduct?.packageSize}
        />

        {/* 6. About OnFresh & Vandiperiyar, Idukki Location */}
        <AboutSection />

        {/* 7. Contact Details & Testimonials */}
        <ContactSection />

        {/* 8. Dedicated Architecture & Live Health-Check Section */}
        <section className="py-12 bg-[#FFFFFF] border-t border-[#EADBCC]">
          <div className="max-w-4xl mx-auto px-4 sm:px-6">
            <div className="text-center mb-6">
              <span className="text-xs font-bold uppercase tracking-wider text-[#287B52] bg-[#E8F4EE] border border-[#287B52]/30 px-3 py-1 rounded-full">
                Infrastructure & System Status
              </span>
              <h3 className="font-display font-black text-2xl text-[#281411] mt-2">
                Live Backend & PostgreSQL Diagnostic
              </h3>
              <p className="text-xs text-[#735C57] mt-1">
                Real-time connection verification between Next.js frontend and Django REST Framework API.
              </p>
            </div>

            <HealthStatusCard />
          </div>
        </section>
      </main>

      {/* Footer */}
      <Footer />

      {/* Diagnostics Modal */}
      <DiagnosticsModal
        isOpen={diagnosticsOpen}
        onClose={() => setDiagnosticsOpen(false)}
      />

      {/* Floating Diagnostics Trigger Button (Bottom-Right) */}
      <div className="fixed bottom-5 right-5 z-30">
        <button
          onClick={() => setDiagnosticsOpen(true)}
          className="flex items-center gap-2 px-3.5 py-2 rounded-full bg-[#351C18]/95 hover:bg-[#281411] text-[#FFF9F1] text-xs font-bold shadow-xl border border-[#EADBCC]/30 backdrop-blur transition hover:scale-105 active:scale-95 cursor-pointer"
          title="Open Backend & Database Diagnostics"
        >
          <span
            className={`w-2 h-2 rounded-full ${
              apiConnected ? 'bg-[#287B52] animate-pulse' : 'bg-amber-400'
            }`}
          />
          <span className="hidden sm:inline font-mono">System Health</span>
        </button>
      </div>
    </div>
  );
}

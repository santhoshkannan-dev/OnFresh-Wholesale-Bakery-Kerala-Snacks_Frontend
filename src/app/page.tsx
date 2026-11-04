'use client';

import Navbar from '@/components/Navbar';
import HeroSection from '@/components/HeroSection';
import CategoryShowcase from '@/components/CategoryShowcase';
import FeaturedProducts from '@/components/FeaturedProducts';
import WhyChooseOnFresh from '@/components/WhyChooseOnFresh';
import WholesaleEnquirySection from '@/components/WholesaleEnquirySection';
import AboutSection from '@/components/AboutSection';
import ContactSection from '@/components/ContactSection';
import Footer from '@/components/Footer';

export default function Home() {
  return (
    <div className="min-h-screen bg-[#FFF9F1] text-[#281411] selection:bg-[#FFD83D] selection:text-[#281411] flex flex-col justify-between">
      {/* Navigation */}
      <Navbar />

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

        {/* 3. Featured Snacks & Real-Time DRF Pricing */}
        <FeaturedProducts />

        {/* 4. Why Choose OnFresh & Heritage USPs */}
        <WhyChooseOnFresh />

        {/* 5. Wholesale Enquiry Form */}
        <WholesaleEnquirySection />

        {/* 6. About OnFresh & Vandiperiyar, Idukki Location */}
        <AboutSection />

        {/* 7. Contact Details & Testimonials */}
        <ContactSection />
      </main>

      {/* Footer */}
      <Footer />
    </div>
  );
}

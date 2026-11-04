'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { ArrowRight, Sparkles, Building2, ChevronRight, ChevronLeft } from 'lucide-react';
import SectionHeading from './ui/SectionHeading';
import ProductCard from './ui/ProductCard';
import { getProducts } from '@/lib/api';
import { Product } from '@/types/api';

export default function FeaturedProducts() {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState<'all' | 'chips' | 'savouries' | 'bakery'>('all');

  // Fallback products if database has fresh instance
  const fallbackProducts: Product[] = [
    {
      id: 1,
      name: 'Kerala Banana Chips (Classic Salted)',
      slug: 'kerala-banana-chips',
      category: { id: 1, name: 'Banana Chips', slug: 'banana-chips' },
      short_description: 'Thinly sliced premium Nendran raw bananas fried in 100% pure cold-pressed coconut oil.',
      description: 'Thinly sliced premium Nendran raw bananas fried in 100% pure cold-pressed coconut oil, seasoned with turmeric and rock salt.',
      is_active: true,
      is_featured: true,
      min_price: '80.00',
      max_price: '300.00',
      created_at: '',
      main_image: 'https://images.unsplash.com/photo-1621996346565-e3d5d6281292?auto=format&fit=crop&w=600&q=80',
      variants: [
        {
          id: 101,
          sku: 'ONF-CHIP-250',
          package_weight: '250',
          package_unit: 'g',
          display_weight: '250 g',
          price: '80.00',
          retail_price: '80.00',
          wholesale_price: '65.00',
          minimum_order_quantity: 1,
          is_available: true,
        },
        {
          id: 102,
          sku: 'ONF-CHIP-500',
          package_weight: '500',
          package_unit: 'g',
          display_weight: '500 g',
          price: '155.00',
          retail_price: '155.00',
          wholesale_price: '125.00',
          minimum_order_quantity: 1,
          is_available: true,
        },
        {
          id: 103,
          sku: 'ONF-CHIP-1000',
          package_weight: '1000',
          package_unit: 'g',
          display_weight: '1 kg Bulk',
          price: '300.00',
          retail_price: '300.00',
          wholesale_price: '240.00',
          minimum_order_quantity: 1,
          is_available: true,
        },
      ],
    },
    {
      id: 2,
      name: 'Spicy Peri-Peri Banana Chips',
      slug: 'peri-peri-banana-chips',
      category: { id: 1, name: 'Banana Chips', slug: 'banana-chips' },
      short_description: 'Thin Nendran crisps dusted with fiery red chili, roasted black pepper, and tangy spices.',
      description: 'Thin Nendran crisps dusted with fiery red chili, roasted black pepper, and tangy spices.',
      is_active: true,
      is_featured: true,
      min_price: '85.00',
      max_price: '165.00',
      created_at: '',
      main_image: 'https://images.unsplash.com/photo-1599490659213-e2b9527bd087?auto=format&fit=crop&w=600&q=80',
      variants: [
        {
          id: 104,
          sku: 'ONF-PERI-250',
          package_weight: '250',
          package_unit: 'g',
          display_weight: '250 g',
          price: '85.00',
          retail_price: '85.00',
          wholesale_price: '70.00',
          minimum_order_quantity: 1,
          is_available: true,
        },
        {
          id: 105,
          sku: 'ONF-PERI-500',
          package_weight: '500',
          package_unit: 'g',
          display_weight: '500 g',
          price: '165.00',
          retail_price: '165.00',
          wholesale_price: '135.00',
          minimum_order_quantity: 1,
          is_available: true,
        },
      ],
    },
    {
      id: 3,
      name: 'Butter Murukku Twists',
      slug: 'butter-murukku',
      category: { id: 3, name: 'Murukku & Savouries', slug: 'murukku-traditional-snacks' },
      short_description: 'Melt-in-mouth artisanal murukku made with rich churned dairy butter, rice flour, and roasted cumin.',
      description: 'Melt-in-mouth artisanal murukku made with rich churned dairy butter, rice flour, and roasted cumin.',
      is_active: true,
      is_featured: true,
      min_price: '75.00',
      max_price: '160.00',
      created_at: '',
      main_image: 'https://images.unsplash.com/photo-1601050690597-df0568f70950?auto=format&fit=crop&w=600&q=80',
      variants: [
        {
          id: 106,
          sku: 'ONF-MUR-200',
          package_weight: '200',
          package_unit: 'g',
          display_weight: '200 g',
          price: '75.00',
          retail_price: '75.00',
          wholesale_price: '60.00',
          minimum_order_quantity: 1,
          is_available: true,
        },
        {
          id: 107,
          sku: 'ONF-MUR-500',
          package_weight: '500',
          package_unit: 'g',
          display_weight: '500 g',
          price: '160.00',
          retail_price: '160.00',
          wholesale_price: '130.00',
          minimum_order_quantity: 1,
          is_available: true,
        },
      ],
    },
    {
      id: 4,
      name: 'Special Kerala Savoury Mixture',
      slug: 'kerala-mixture',
      category: { id: 4, name: 'Mixture & Savouries', slug: 'mixture-savouries' },
      short_description: 'A traditional crunchy mix of sev, fried peanuts, roasted curry leaves, and spices.',
      description: 'A traditional crunchy mix of sev, fried peanuts, roasted curry leaves, roasted garlic, and asafoetida.',
      is_active: true,
      is_featured: true,
      min_price: '70.00',
      max_price: '260.00',
      created_at: '',
      main_image: 'https://images.unsplash.com/photo-1541592106381-b31e9677c0e5?auto=format&fit=crop&w=600&q=80',
      variants: [
        {
          id: 108,
          sku: 'ONF-MIX-250',
          package_weight: '250',
          package_unit: 'g',
          display_weight: '250 g',
          price: '70.00',
          retail_price: '70.00',
          wholesale_price: '55.00',
          minimum_order_quantity: 1,
          is_available: true,
        },
        {
          id: 109,
          sku: 'ONF-MIX-1000',
          package_weight: '1000',
          package_unit: 'g',
          display_weight: '1 kg Sack',
          price: '260.00',
          retail_price: '260.00',
          wholesale_price: '210.00',
          minimum_order_quantity: 1,
          is_available: true,
        },
      ],
    },
    {
      id: 5,
      name: 'Twice-Baked Cardamom Tea Rusks',
      slug: 'tea-rusks',
      category: { id: 5, name: 'Bakery Products', slug: 'bakery-products' },
      short_description: 'Slow-baked crunchy bakery rusks infused with fragrant Idukki hill cardamom.',
      description: 'Slow-baked crunchy bakery rusks infused with fragrant Idukki hill cardamom.',
      is_active: true,
      is_featured: true,
      min_price: '65.00',
      max_price: '65.00',
      created_at: '',
      main_image: 'https://images.unsplash.com/photo-1509440159596-0249088772ff?auto=format&fit=crop&w=600&q=80',
      variants: [
        {
          id: 110,
          sku: 'ONF-RUSK-300',
          package_weight: '300',
          package_unit: 'g',
          display_weight: '300 g',
          price: '65.00',
          retail_price: '65.00',
          wholesale_price: '50.00',
          minimum_order_quantity: 1,
          is_available: true,
        },
      ],
    },
    {
      id: 6,
      name: 'Heritage Sweet Sharkkara Varatti',
      slug: 'sharkkara-varatti',
      category: { id: 1, name: 'Banana Chips', slug: 'banana-chips' },
      short_description: 'Thickly sliced Nendran banana chunks fried crisp and coated in thick jaggery syrup and dried ginger.',
      description: 'Thickly sliced Nendran banana chunks fried crisp and coated in thick jaggery syrup, dried ginger (chukku), and ground cardamom.',
      is_active: true,
      is_featured: true,
      min_price: '95.00',
      max_price: '95.00',
      created_at: '',
      main_image: 'https://images.unsplash.com/photo-1558961363-fa8fdf82db35?auto=format&fit=crop&w=600&q=80',
      variants: [
        {
          id: 111,
          sku: 'ONF-SHARK-250',
          package_weight: '250',
          package_unit: 'g',
          display_weight: '250 g',
          price: '95.00',
          retail_price: '95.00',
          wholesale_price: '78.00',
          minimum_order_quantity: 1,
          is_available: true,
        },
      ],
    },
  ];

  useEffect(() => {
    getProducts({ is_featured: true })
      .then((res) => {
        if (res.data && res.data.results && res.data.results.length > 0) {
          setProducts(res.data.results);
        } else {
          setProducts(fallbackProducts);
        }
      })
      .catch(() => setProducts(fallbackProducts))
      .finally(() => setLoading(false));
  }, []);

  const displayedProducts = products.length > 0 ? products : fallbackProducts;

  const filtered = displayedProducts.filter((p) => {
    if (activeTab === 'all') return true;
    const cat = (p.category?.name || '').toLowerCase();
    if (activeTab === 'chips') return cat.includes('chip') || cat.includes('banana');
    if (activeTab === 'savouries') return cat.includes('murukku') || cat.includes('mixture');
    if (activeTab === 'bakery') return cat.includes('bakery') || cat.includes('biscuit') || cat.includes('rusk');
    return true;
  });

  return (
    <section id="featured" className="py-16 sm:py-24 bg-[#F7EFE6] border-b border-[#EADBCC] relative">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Section Heading */}
        <div className="text-center max-w-3xl mx-auto mb-10">
          <SectionHeading
            badge="Customer Favourites"
            badgeVariant="yellow"
            title="FEATURED KERALA"
            highlight="SPECIALTIES"
            subtitle="Explore our top-selling traditional snacks and bakery creations. Available for retail delivery and wholesale bulk dispatch."
          />

          {/* Filter Tabs */}
          <div className="flex flex-wrap items-center justify-center gap-2 mt-8">
            {[
              { id: 'all', label: 'All Specialties' },
              { id: 'chips', label: 'Banana & Tapioca Chips' },
              { id: 'savouries', label: 'Murukku & Mixture' },
              { id: 'bakery', label: 'Bakery & Rusks' },
            ].map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id as any)}
                className={`px-5 py-2 rounded-full text-xs font-bold uppercase tracking-wider transition-all border ${
                  activeTab === tab.id
                    ? 'bg-[#351C18] text-[#FFF9F1] border-[#351C18] shadow-sm'
                    : 'bg-[#FFF9F1] text-[#735C57] border-[#EADBCC] hover:border-[#F47735]'
                }`}
              >
                {tab.label}
              </button>
            ))}
          </div>
        </div>

        {/* Product Cards Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8">
          {filtered.map((prod) => (
            <ProductCard key={prod.id} product={prod} />
          ))}
        </div>

        {/* Bottom Callout: Wholesale Information */}
        <div className="mt-14 p-6 sm:p-8 rounded-3xl bg-[#FFF9F1] border border-[#EADBCC] flex flex-col md:flex-row items-center justify-between gap-6 shadow-sm">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 rounded-2xl bg-[#FFD83D] text-[#281411] flex items-center justify-center shrink-0">
              <Building2 className="w-6 h-6" />
            </div>
            <div>
              <h4 className="font-display font-black text-xl text-[#281411]">
                Buying for your Store, Supermarket or Bakery?
              </h4>
              <p className="text-xs sm:text-sm text-[#735C57] mt-0.5">
                OnFresh delivers direct wholesale cartons with competitive margins, fresh batch dates, and GST invoices.
              </p>
            </div>
          </div>

          <Link
            href="/wholesale"
            className="px-6 py-3.5 rounded-full bg-[#351C18] hover:bg-[#281411] text-[#FFD83D] font-display font-black text-xs uppercase tracking-wider shrink-0 transition-colors shadow-md hover:shadow-lg flex items-center gap-2"
          >
            <span>Explore Wholesale Benefits</span>
            <ArrowRight className="w-4 h-4" />
          </Link>
        </div>

      </div>
    </section>
  );
}

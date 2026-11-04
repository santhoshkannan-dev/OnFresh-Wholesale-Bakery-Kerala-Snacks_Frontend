'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { ArrowRight, Building2, Sparkles } from 'lucide-react';
import ProductCard from './ui/ProductCard';
import { getProducts } from '@/lib/api';
import { Product } from '@/types/api';

export default function FeaturedProducts() {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState<'all' | 'chips' | 'savouries' | 'bakery' | 'sweets'>('all');

  // Comprehensive HDR Product Showcase Catalog
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
      main_image: 'https://images.unsplash.com/photo-1621996346565-e3d5d6281292?auto=format&fit=crop&w=1200&q=85',
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
      main_image: 'https://images.unsplash.com/photo-1599490659213-e2b9527bd087?auto=format&fit=crop&w=1200&q=85',
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
      name: 'Authentic Kerala Mixture',
      slug: 'kerala-mixture',
      category: { id: 2, name: 'Traditional Savouries', slug: 'traditional-savouries' },
      short_description: 'Crunchy sev, roasted peanuts, fried curry leaves, and boondi seasoned with chili and asafoetida.',
      description: 'Crunchy sev, roasted peanuts, fried curry leaves, and boondi seasoned with authentic spices.',
      is_active: true,
      is_featured: true,
      min_price: '75.00',
      max_price: '145.00',
      created_at: '',
      main_image: 'https://images.unsplash.com/photo-1589301760014-d929f3979dbc?auto=format&fit=crop&w=1200&q=85',
      variants: [
        {
          id: 106,
          sku: 'ONF-MIX-250',
          package_weight: '250',
          package_unit: 'g',
          display_weight: '250 g',
          price: '75.00',
          retail_price: '75.00',
          wholesale_price: '60.00',
          minimum_order_quantity: 1,
          is_available: true,
        },
        {
          id: 107,
          sku: 'ONF-MIX-500',
          package_weight: '500',
          package_unit: 'g',
          display_weight: '500 g',
          price: '145.00',
          retail_price: '145.00',
          wholesale_price: '115.00',
          minimum_order_quantity: 1,
          is_available: true,
        },
      ],
    },
    {
      id: 4,
      name: 'Kerala Ribbon Pakkavada',
      slug: 'ribbon-pakkavada',
      category: { id: 2, name: 'Traditional Savouries', slug: 'traditional-savouries' },
      short_description: 'Golden crunchy rice and gram flour ribbon crisps infused with fresh garlic, cumin, and red chili.',
      description: 'Golden crunchy rice and gram flour ribbon crisps infused with fresh garlic, cumin, and red chili.',
      is_active: true,
      is_featured: true,
      min_price: '70.00',
      max_price: '135.00',
      created_at: '',
      main_image: 'https://images.unsplash.com/photo-1601050690597-df0568f70950?auto=format&fit=crop&w=1200&q=85',
      variants: [
        {
          id: 108,
          sku: 'ONF-PAK-250',
          package_weight: '250',
          package_unit: 'g',
          display_weight: '250 g',
          price: '70.00',
          retail_price: '70.00',
          wholesale_price: '55.00',
          minimum_order_quantity: 1,
          is_available: true,
        },
      ],
    },
    {
      id: 5,
      name: 'Vandiperiyar Butter Rusk & Biscuits',
      slug: 'butter-rusk',
      category: { id: 3, name: 'Kerala Bakery', slug: 'kerala-bakery' },
      short_description: 'Twice-baked crispy golden tea rusks with pure cow ghee and cardamom, perfect for morning chai.',
      description: 'Twice-baked crispy golden tea rusks with pure cow ghee and cardamom, perfect for morning chai.',
      is_active: true,
      is_featured: true,
      min_price: '65.00',
      max_price: '120.00',
      created_at: '',
      main_image: 'https://images.unsplash.com/photo-1509440159596-0249088772ff?auto=format&fit=crop&w=1200&q=85',
      variants: [
        {
          id: 109,
          sku: 'ONF-RUSK-300',
          package_weight: '300',
          package_unit: 'g',
          display_weight: '300 g',
          price: '65.00',
          retail_price: '65.00',
          wholesale_price: '52.00',
          minimum_order_quantity: 1,
          is_available: true,
        },
      ],
    },
    {
      id: 6,
      name: 'Heritage Sweet Sharkkara Varatti',
      slug: 'sharkkara-varatti',
      category: { id: 4, name: 'Halwa & Sweets', slug: 'halwa-sweets' },
      short_description: 'Thickly sliced Nendran banana chunks fried crisp and coated in thick jaggery syrup and dried ginger.',
      description: 'Thickly sliced Nendran banana chunks fried crisp and coated in thick jaggery syrup, dried ginger (chukku), and ground cardamom.',
      is_active: true,
      is_featured: true,
      min_price: '95.00',
      max_price: '95.00',
      created_at: '',
      main_image: 'https://images.unsplash.com/photo-1558961363-fa8fdf82db35?auto=format&fit=crop&w=1200&q=85',
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
    {
      id: 7,
      name: 'Crispy Tapioca Chips (Kappa Chips)',
      slug: 'tapioca-chips',
      category: { id: 1, name: 'Banana Chips', slug: 'banana-chips' },
      short_description: 'Thinly sliced sun-dried Kerala tapioca roots crisped in pure coconut oil with sea salt and curry leaves.',
      description: 'Thinly sliced sun-dried Kerala tapioca roots crisped in pure coconut oil with sea salt and curry leaves.',
      is_active: true,
      is_featured: true,
      min_price: '70.00',
      max_price: '135.00',
      created_at: '',
      main_image: 'https://images.unsplash.com/photo-1566478989037-eec170784d0b?auto=format&fit=crop&w=1200&q=85',
      variants: [
        {
          id: 112,
          sku: 'ONF-KAP-250',
          package_weight: '250',
          package_unit: 'g',
          display_weight: '250 g',
          price: '70.00',
          retail_price: '70.00',
          wholesale_price: '55.00',
          minimum_order_quantity: 1,
          is_available: true,
        },
      ],
    },
    {
      id: 8,
      name: 'Kerala Plum Cake (Traditional Rich Fruit Cake)',
      slug: 'kerala-plum-cake',
      category: { id: 3, name: 'Kerala Bakery', slug: 'kerala-bakery' },
      short_description: 'Dark, moist holiday fruit cake loaded with caramel-soaked black raisins, candied peel, and spices.',
      description: 'Dark, moist holiday fruit cake loaded with caramel-soaked black raisins, candied peel, nutmeg, and aromatic cloves.',
      is_active: true,
      is_featured: true,
      min_price: '180.00',
      max_price: '450.00',
      created_at: '',
      main_image: 'https://images.unsplash.com/photo-1578985545062-69928b1d9587?auto=format&fit=crop&w=1200&q=85',
      variants: [
        {
          id: 113,
          sku: 'ONF-PLUM-500',
          package_weight: '500',
          package_unit: 'g',
          display_weight: '500 g Box',
          price: '220.00',
          retail_price: '220.00',
          wholesale_price: '175.00',
          minimum_order_quantity: 1,
          is_available: true,
        },
      ],
    },
    {
      id: 9,
      name: 'Handcrafted Butter Murukku Rings',
      slug: 'butter-murukku',
      category: { id: 2, name: 'Traditional Savouries', slug: 'traditional-savouries' },
      short_description: 'Golden spiral snack rings prepared from rich roasted rice flour, white sesame, and butter.',
      description: 'Golden spiral snack rings prepared from rich roasted rice flour, white sesame, and fragrant cow butter.',
      is_active: true,
      is_featured: true,
      min_price: '75.00',
      max_price: '140.00',
      created_at: '',
      main_image: 'https://images.unsplash.com/photo-1599488615731-7e5c2823ff28?auto=format&fit=crop&w=1200&q=85',
      variants: [
        {
          id: 114,
          sku: 'ONF-MUR-250',
          package_weight: '250',
          package_unit: 'g',
          display_weight: '250 g',
          price: '75.00',
          retail_price: '75.00',
          wholesale_price: '60.00',
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
    if (activeTab === 'savouries') return cat.includes('murukku') || cat.includes('mixture') || cat.includes('pakkavada');
    if (activeTab === 'bakery') return cat.includes('bakery') || cat.includes('biscuit') || cat.includes('rusk') || cat.includes('cake');
    if (activeTab === 'sweets') return cat.includes('sweet') || cat.includes('halwa') || cat.includes('sharkkara');
    return true;
  });

  return (
    <section id="featured" className="py-16 sm:py-24 bg-[#FFF9F1] border-b border-[#EADBCC] relative">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Crave Bakery Style Section Heading */}
        <div className="text-center max-w-3xl mx-auto mb-10">
          <div className="inline-flex items-center gap-1.5 px-3.5 py-1 rounded-full bg-[#FFD83D]/30 border border-[#FFD83D] text-[#281411] text-xs font-bold tracking-wider uppercase mb-3">
            <Sparkles className="w-3.5 h-3.5 text-[#F47735]" />
            High-Definition Fresh Showcase
          </div>
          <h2 className="editorial-headline text-3xl sm:text-5xl font-black text-[#281411] tracking-tight mb-3">
            Our Premium Products
          </h2>
          <p className="text-sm sm:text-base text-[#735C57] font-medium max-w-xl mx-auto">
            Traditional Kerala snacks, crisp chips, and daily bakery specialties made from natural ingredients and 100% pure coconut oil.
          </p>

          {/* Clean Rounded Filter Pills */}
          <div className="flex flex-wrap items-center justify-center gap-2 mt-8">
            {[
              { id: 'all', label: 'All Items' },
              { id: 'chips', label: 'Banana & Tapioca Chips' },
              { id: 'savouries', label: 'Savouries & Mixture' },
              { id: 'bakery', label: 'Bakery & Cakes' },
              { id: 'sweets', label: 'Sweets & Halwa' },
            ].map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id as any)}
                className={`px-5 py-2.5 rounded-full text-xs font-display font-bold tracking-wider transition-all cursor-pointer ${
                  activeTab === tab.id
                    ? 'bg-[#2B1510] text-[#FFF9F1] shadow-md scale-105'
                    : 'bg-[#FFFFFF] text-[#735C57] border border-[#EADBCC] hover:border-[#F47735] hover:text-[#281411]'
                }`}
              >
                {tab.label}
              </button>
            ))}
          </div>
        </div>

        {/* Product Cards Grid (3 Columns, Crave Bakery Card Layout) */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8">
          {filtered.map((prod) => (
            <ProductCard key={prod.id} product={prod} />
          ))}
        </div>

        {/* Wholesale Quick Banner (Dual B2C / B2B) */}
        <div className="mt-14 p-6 sm:p-8 rounded-3xl bg-[#2B1510] text-[#FFF9F1] border border-[#FFD83D]/30 flex flex-col md:flex-row items-center justify-between gap-6 shadow-xl">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 rounded-2xl bg-[#FFD83D] text-[#281411] flex items-center justify-center shrink-0 font-black text-xl">
              🏢
            </div>
            <div>
              <h4 className="font-display font-black text-xl text-[#FFF9F1]">
                Need Bulk Supply for your Supermarket, Store or Bakery?
              </h4>
              <p className="text-xs sm:text-sm text-[#EADBCC] mt-0.5">
                OnFresh delivers direct wholesale cartons with approved GST pricing, tiered volume rates, and weekly dispatch across India.
              </p>
            </div>
          </div>

          <Link
            href="/wholesale"
            className="px-6 py-3.5 rounded-full bg-[#F47735] hover:bg-[#E06322] text-[#FFFFFF] font-display font-black text-xs uppercase tracking-wider shrink-0 transition-transform hover:scale-105 shadow-md flex items-center gap-2"
          >
            <span>Open Wholesale Portal</span>
            <ArrowRight className="w-4 h-4" />
          </Link>
        </div>

      </div>
    </section>
  );
}

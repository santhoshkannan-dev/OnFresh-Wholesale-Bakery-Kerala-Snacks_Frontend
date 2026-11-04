'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { ArrowRight, Sparkles } from 'lucide-react';
import SectionHeading from './ui/SectionHeading';
import ProductCategoryCard from './ui/ProductCategoryCard';
import { getCategories } from '@/lib/api';
import { Category } from '@/types/api';

export default function CategoryShowcase() {
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);

  // Fallback defaults if API is cold
  const fallbackCategories: Category[] = [
    {
      id: 1,
      name: 'Banana Chips',
      slug: 'banana-chips',
      description: 'Thinly sliced Nendran raw bananas fried in 100% pure cold-pressed coconut oil.',
      is_active: true,
      product_count: 4,
      image: 'https://images.unsplash.com/photo-1621996346565-e3d5d6281292?auto=format&fit=crop&w=1200&q=85',
      created_at: '',
      updated_at: '',
    },
    {
      id: 2,
      name: 'Tapioca & Jackfruit Chips',
      slug: 'tapioca-jackfruit-chips',
      description: 'Sun-dried Kerala tapioca crisps and fragrant golden jackfruit chips with mountain salt.',
      is_active: true,
      product_count: 3,
      image: 'https://images.unsplash.com/photo-1566478989037-eec170784d0b?auto=format&fit=crop&w=1200&q=85',
      created_at: '',
      updated_at: '',
    },
    {
      id: 3,
      name: 'Murukku & Traditional Snacks',
      slug: 'murukku-traditional-snacks',
      description: 'Crispy butter murukku, ribbon pakkavada, and crunchy Kai Murukku seasoned with cumin and sesame.',
      is_active: true,
      product_count: 6,
      image: 'https://images.unsplash.com/photo-1601050690597-df0568f70950?auto=format&fit=crop&w=1200&q=85',
      created_at: '',
      updated_at: '',
    },
    {
      id: 4,
      name: 'Mixture & Savouries',
      slug: 'mixture-savouries',
      description: 'Signature Kerala savoury mixture with spicy sev, roasted peanuts, fried dal, and curry leaves.',
      is_active: true,
      product_count: 5,
      image: 'https://images.unsplash.com/photo-1589301760014-d929f3979dbc?auto=format&fit=crop&w=1200&q=85',
      created_at: '',
      updated_at: '',
    },
    {
      id: 5,
      name: 'Bakery Products & Rusks',
      slug: 'bakery-products',
      description: 'Crisp twice-baked cardamom tea rusks, fresh sandwich loaves, and festive fruit cakes.',
      is_active: true,
      product_count: 4,
      image: 'https://images.unsplash.com/photo-1509440159596-0249088772ff?auto=format&fit=crop&w=1200&q=85',
      created_at: '',
      updated_at: '',
    },
    {
      id: 6,
      name: 'Biscuits & Cookies',
      slug: 'biscuits-cookies',
      description: 'Handmade coconut biscuits, melt-in-mouth butter cookies, and golden tea-time cookies.',
      is_active: true,
      product_count: 4,
      image: 'https://images.unsplash.com/photo-1499636136210-6f4ee915583e?auto=format&fit=crop&w=1200&q=85',
      created_at: '',
      updated_at: '',
    },
  ];

  useEffect(() => {
    getCategories()
      .then((res) => {
        if (res.data && res.data.length > 0) {
          setCategories(res.data);
        } else {
          setCategories(fallbackCategories);
        }
      })
      .catch(() => setCategories(fallbackCategories))
      .finally(() => setLoading(false));
  }, []);

  const colorSchemes: Array<'peach' | 'blue' | 'yellow' | 'green' | 'cream'> = [
    'yellow',
    'blue',
    'peach',
    'green',
    'yellow',
    'cream',
  ];

  const displayedList = categories.length > 0 ? categories : fallbackCategories;

  return (
    <section id="categories" className="py-16 sm:py-24 bg-[#FFF9F1] border-b border-[#EADBCC] relative">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Section Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-12 sm:mb-16">
          <SectionHeading
            align="left"
            badge="Authentic Kerala Pantry"
            badgeVariant="orange"
            title="EXPLORE OUR"
            highlight="SNACK CATEGORIES"
            subtitle="From fresh Nendran raw banana chips to crunchy murukku and oven-baked rusks, every item is crafted to perfection in Vandiperiyar, Kerala."
          />

          <Link
            href="/products"
            className="inline-flex items-center gap-2 font-display font-black text-sm uppercase tracking-wider text-[#F47735] hover:text-[#E06322] shrink-0 group pb-2"
          >
            <span>View All Products</span>
            <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
          </Link>
        </div>

        {/* Colorful Category Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8">
          {displayedList.map((cat, idx) => (
            <ProductCategoryCard
              key={cat.id || cat.slug}
              category={cat}
              colorScheme={colorSchemes[idx % colorSchemes.length]}
            />
          ))}
        </div>

      </div>
    </section>
  );
}

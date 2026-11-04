'use client';

import React, { useState, useEffect, useRef } from 'react';
import Link from 'next/link';
import { ArrowRight, Sparkles } from 'lucide-react';
import ProductCategoryCard from './ui/ProductCategoryCard';
import { getCategories } from '@/lib/api';
import { Category } from '@/types/api';
import { registerGSAP } from '@/lib/animation/gsapUtils';
import { animationConfig, prefersReducedMotion } from '@/config/animationConfig';

export default function CategoryShowcase() {
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);
  const sectionRef = useRef<HTMLElement>(null);

  // 8 Canonical Categories matching prompt
  const fallbackCategories: Category[] = [
    {
      id: 1,
      name: 'Banana Chips',
      slug: 'banana-chips',
      description: 'Thinly sliced Nendran raw bananas fried in 100% pure cold-pressed coconut oil with rock salt and turmeric.',
      is_active: true,
      product_count: 4,
      image: 'https://images.unsplash.com/photo-1621996346565-e3d5d6281292?auto=format&fit=crop&w=1200&q=85',
      created_at: '',
      updated_at: '',
    },
    {
      id: 2,
      name: 'Tapioca Chips',
      slug: 'tapioca-chips',
      description: 'Sun-dried Kerala cassava crisps tossed with hot red chili and sea salt.',
      is_active: true,
      product_count: 3,
      image: 'https://images.unsplash.com/photo-1566478989037-eec170784d0b?auto=format&fit=crop&w=1200&q=85',
      created_at: '',
      updated_at: '',
    },
    {
      id: 3,
      name: 'Jackfruit Chips',
      slug: 'jackfruit-chips',
      description: 'Fragrant golden wild jackfruit chips sliced thin and fried to delicate crunchiness.',
      is_active: true,
      product_count: 2,
      image: 'https://images.unsplash.com/photo-1618160702438-9b02ab6515c9?auto=format&fit=crop&w=1200&q=85',
      created_at: '',
      updated_at: '',
    },
    {
      id: 4,
      name: 'Murukku',
      slug: 'murukku-traditional-snacks',
      description: 'Crispy butter murukku, ribbon pakkavada, and Kai Murukku seasoned with cumin and sesame.',
      is_active: true,
      product_count: 5,
      image: 'https://images.unsplash.com/photo-1601050690597-df0568f70950?auto=format&fit=crop&w=1200&q=85',
      created_at: '',
      updated_at: '',
    },
    {
      id: 5,
      name: 'Mixture',
      slug: 'mixture-savouries',
      description: 'Signature Kerala savoury mixture with spicy sev, roasted peanuts, fried dal, and curry leaves.',
      is_active: true,
      product_count: 4,
      image: 'https://images.unsplash.com/photo-1589301760014-d929f3979dbc?auto=format&fit=crop&w=1200&q=85',
      created_at: '',
      updated_at: '',
    },
    {
      id: 6,
      name: 'Bakery Products',
      slug: 'bakery-products',
      description: 'Twice-baked cardamom tea rusks, fresh sandwich loaves, and festive fruit cakes.',
      is_active: true,
      product_count: 4,
      image: 'https://images.unsplash.com/photo-1509440159596-0249088772ff?auto=format&fit=crop&w=1200&q=85',
      created_at: '',
      updated_at: '',
    },
    {
      id: 7,
      name: 'Biscuits & Cookies',
      slug: 'biscuits-cookies',
      description: 'Handmade coconut biscuits, melt-in-mouth butter cookies, and golden tea accompaniments.',
      is_active: true,
      product_count: 4,
      image: 'https://images.unsplash.com/photo-1499636136210-6f4ee915583e?auto=format&fit=crop&w=1200&q=85',
      created_at: '',
      updated_at: '',
    },
    {
      id: 8,
      name: 'Traditional Snacks',
      slug: 'traditional-snacks',
      description: 'Sharkkara Varatti jaggery chunks, Madhuraseva, and authentic heritage festival savouries.',
      is_active: true,
      product_count: 6,
      image: 'https://images.unsplash.com/photo-1558961363-fa8fdf82db35?auto=format&fit=crop&w=1200&q=85',
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

  const displayedList = categories.length > 0 ? categories : fallbackCategories;

  // GSAP ScrollTrigger Animations
  useEffect(() => {
    if (!animationConfig.enabled || prefersReducedMotion()) return;

    const gsap = registerGSAP();
    const ctx = gsap.context(() => {
      // Heading Scroll Entrance
      gsap.from('.cat-header', {
        scrollTrigger: {
          trigger: sectionRef.current,
          start: 'top 80%',
        },
        y: 35,
        opacity: 0,
        duration: 0.8,
        ease: 'power3.out',
      });

      // Staggered Cards Entrance
      gsap.from('.cat-card-anim', {
        scrollTrigger: {
          trigger: '.cat-grid',
          start: 'top 85%',
        },
        y: 40,
        opacity: 0,
        stagger: 0.1,
        duration: 0.7,
        ease: 'power3.out',
      });

      // Subtle Parallax on Background Blobs
      gsap.to('.cat-parallax-blob', {
        scrollTrigger: {
          trigger: sectionRef.current,
          start: 'top bottom',
          end: 'bottom top',
          scrub: 1.5,
        },
        y: -40,
        ease: 'none',
      });
    }, sectionRef);

    return () => ctx.revert();
  }, [displayedList]);

  const colorSchemes: Array<'yellow' | 'blue' | 'peach' | 'green' | 'cream'> = [
    'yellow',
    'blue',
    'peach',
    'green',
    'cream',
    'yellow',
    'blue',
    'peach',
  ];

  return (
    <section ref={sectionRef} id="categories" className="py-16 sm:py-24 bg-[#FFF9EF] border-b border-[#EADBCC] relative overflow-hidden">
      
      {/* Decorative Parallax Shapes */}
      <div className="cat-parallax-blob absolute -top-10 -right-10 w-96 h-96 bg-[#FFB928]/10 rounded-full blur-3xl pointer-events-none" />
      <div className="cat-parallax-blob absolute -bottom-10 -left-10 w-80 h-80 bg-[#F47735]/10 rounded-full blur-3xl pointer-events-none" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        
        {/* Section Header */}
        <div className="cat-header flex flex-col md:flex-row md:items-end justify-between gap-6 mb-12 sm:mb-16">
          <div>
            <div className="inline-flex items-center gap-1.5 px-3.5 py-1 rounded-full bg-[#F47735]/15 border border-[#F47735]/30 text-[#F47735] text-xs font-bold uppercase tracking-wider mb-3">
              <Sparkles className="w-3.5 h-3.5 text-[#F47735]" />
              Authentic Kerala Pantry
            </div>
            <h2 className="editorial-headline text-3xl sm:text-5xl lg:text-6xl font-black text-[#542817] tracking-tight">
              EXPLORE OUR FLAVOURS.
            </h2>
            <p className="text-xs sm:text-sm text-[#735C57] font-medium max-w-xl mt-2 leading-relaxed">
              From fresh Nendran raw banana chips to crunchy murukku and double-baked rusks, every item is crafted to perfection in Vandiperiyar, Kerala.
            </p>
          </div>

          <Link
            href="/products"
            className="inline-flex items-center gap-2 font-display font-black text-xs sm:text-sm uppercase tracking-wider text-[#F47735] hover:text-[#E06322] shrink-0 group pb-2"
          >
            <span>View All Products</span>
            <ArrowRight className="w-4 h-4 group-hover:translate-x-1.5 transition-transform" />
          </Link>
        </div>

        {/* Colorful Category Grid */}
        <div className="cat-grid grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5 sm:gap-6">
          {displayedList.map((cat, idx) => (
            <div key={cat.id || cat.slug} className="cat-card-anim">
              <ProductCategoryCard
                category={cat}
                colorScheme={colorSchemes[idx % colorSchemes.length]}
              />
            </div>
          ))}
        </div>

      </div>
    </section>
  );
}

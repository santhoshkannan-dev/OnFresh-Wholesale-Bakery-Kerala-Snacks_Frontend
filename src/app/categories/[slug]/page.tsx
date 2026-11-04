'use client';

import { useState, useEffect, Suspense } from 'react';
import Link from 'next/link';
import { useParams } from 'next/navigation';
import { ArrowLeft, Sparkles, Building2, Loader2 } from 'lucide-react';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import ProductCard from '@/components/ui/ProductCard';
import { getCategoryBySlug, getProducts } from '@/lib/api';
import { Category, Product } from '@/types/api';

function CategoryDetailContent() {
  const params = useParams();
  const slug = params?.slug as string;

  const [category, setCategory] = useState<Category | null>(null);
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!slug) return;
    let isSubscribed = true;

    Promise.all([
      getCategoryBySlug(slug),
      getProducts({ category: slug }),
    ]).then(([catRes, prodRes]) => {
      if (isSubscribed) {
        if (catRes.data) {
          setCategory(catRes.data);
          setProducts(prodRes.data?.results || []);
          setError(null);
        } else {
          setError(catRes.error || 'Category not found');
        }
        setLoading(false);
      }
    });

    return () => {
      isSubscribed = false;
    };
  }, [slug]);

  return (
    <div className="min-h-screen bg-[#FFF9F1] flex flex-col justify-between text-[#281411]">
      <Navbar />

      <main className="flex-1 py-10 sm:py-16 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 w-full">
        {/* Breadcrumbs */}
        <nav aria-label="Breadcrumb" className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-[#735C57] mb-6">
          <Link href="/" className="hover:text-[#F47735] transition-colors">
            Home
          </Link>
          <span>/</span>
          <Link href="/products" className="hover:text-[#F47735] transition-colors">
            Categories
          </Link>
          <span>/</span>
          <span className="text-[#281411]">{category?.name || slug}</span>
        </nav>

        {/* Loading State */}
        {loading && (
          <div className="py-20 text-center flex flex-col items-center">
            <Loader2 className="w-8 h-8 text-[#F47735] animate-spin mb-3" />
            <p className="text-xs font-bold text-[#735C57] uppercase tracking-wider">
              Loading category specialties...
            </p>
          </div>
        )}

        {/* Error State */}
        {error && !loading && (
          <div className="text-center py-16 bg-[#FFFFFF] rounded-3xl border border-[#EADBCC] p-8 max-w-md mx-auto">
            <div className="text-3xl mb-2">⚠️</div>
            <h3 className="font-display font-black text-[#281411] text-lg">Category Not Found</h3>
            <p className="text-xs text-[#735C57] mt-1 mb-6">{error}</p>
            <Link
              href="/products"
              className="px-6 py-2.5 bg-[#F47735] text-white text-xs font-bold uppercase rounded-full hover:bg-[#E06322] transition-colors"
            >
              Back to All Products
            </Link>
          </div>
        )}

        {/* Category Header & Product Grid */}
        {!loading && category && (
          <>
            <div className="mb-10 sm:mb-14">
              <span className="px-3 py-1 rounded-full bg-[#FFD83D] text-[#281411] text-xs font-bold uppercase tracking-wider inline-block mb-3 shadow-xs">
                {products.length} Varieties Available
              </span>
              <h1 className="editorial-headline text-4xl sm:text-6xl font-black text-[#281411] tracking-tight">
                {category.name}
              </h1>
              <p className="text-sm sm:text-base text-[#735C57] max-w-2xl mt-2 leading-relaxed font-medium">
                {category.description || 'Authentic traditional recipe prepared with fresh ingredients in Vandiperiyar, Kerala.'}
              </p>
            </div>

            {/* Product Cards Grid */}
            {products.length === 0 ? (
              <div className="text-center py-16 bg-[#FFFFFF] rounded-3xl border border-[#EADBCC] p-8 max-w-md mx-auto">
                <p className="font-display font-black text-xl text-[#281411]">No products currently in this category.</p>
                <Link
                  href="/products"
                  className="mt-4 inline-block px-6 py-2.5 bg-[#351C18] text-[#FFD83D] text-xs font-bold uppercase rounded-full hover:bg-[#281411] transition-colors"
                >
                  Browse Other Categories
                </Link>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8">
                {products.map((product) => (
                  <ProductCard key={product.id} product={product} />
                ))}
              </div>
            )}
          </>
        )}
      </main>

      <Footer />
    </div>
  );
}

export default function CategoryDetailPage() {
  return (
    <Suspense
      fallback={
        <div className="min-h-screen bg-[#FFF9F1] flex items-center justify-center">
          <Loader2 className="w-8 h-8 text-[#F47735] animate-spin" />
        </div>
      }
    >
      <CategoryDetailContent />
    </Suspense>
  );
}

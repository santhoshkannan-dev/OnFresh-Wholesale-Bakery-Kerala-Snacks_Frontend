'use client';

import { useState, useEffect, Suspense } from 'react';
import Link from 'next/link';
import { useSearchParams } from 'next/navigation';
import { Search, Sparkles, Building2, ShoppingBag, SlidersHorizontal, Loader2 } from 'lucide-react';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import ProductCard from '@/components/ui/ProductCard';
import SectionHeading from '@/components/ui/SectionHeading';
import { getProducts, getCategories } from '@/lib/api';
import { Product, Category } from '@/types/api';
import { useAuth } from '@/context/AuthContext';

function ProductsCatalogueContent() {
  const searchParams = useSearchParams();
  const initialCategory = searchParams.get('category') || '';
  const initialSearch = searchParams.get('search') || '';
  const initialSegment = searchParams.get('segment') || '';

  const { profile } = useAuth();
  const isApprovedWholesale = Boolean(
    profile?.customer_type === 'business' && profile?.wholesale_status === 'approved'
  );

  const [products, setProducts] = useState<Product[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Filters & Search state
  const [segment, setSegment] = useState<string>(initialSegment);
  const [selectedCategory, setSelectedCategory] = useState<string>(initialCategory);
  const [searchQuery, setSearchQuery] = useState<string>(initialSearch);
  const [sortBy, setSortBy] = useState<string>('-created_at');
  const [totalCount, setTotalCount] = useState<number>(0);

  // Sync segment with URL if changed
  useEffect(() => {
    const urlSegment = searchParams.get('segment');
    if (urlSegment !== null) {
      setSegment(urlSegment);
    }
  }, [searchParams]);

  // Fetch categories on mount
  useEffect(() => {
    let isSubscribed = true;
    getCategories().then((res) => {
      if (isSubscribed && res.data) {
        setCategories(res.data);
      }
    });
    return () => {
      isSubscribed = false;
    };
  }, []);

  // Fetch products whenever filters change
  useEffect(() => {
    let isSubscribed = true;
    setLoading(true);
    setError(null);

    const params: {
      category?: string;
      search?: string;
      ordering?: string;
      segment?: string;
    } = {};

    if (selectedCategory) params.category = selectedCategory;
    if (searchQuery.trim()) params.search = searchQuery.trim();
    if (sortBy) params.ordering = sortBy;
    if (segment) params.segment = segment;

    getProducts(params)
      .then((res) => {
        if (!isSubscribed) return;
        if (res.error) {
          setError(res.error);
        } else if (res.data) {
          setProducts(res.data.results);
          setTotalCount(res.data.count);
        }
      })
      .catch((err) => {
        if (!isSubscribed) return;
        setError(err.message || 'Failed to load products');
      })
      .finally(() => {
        if (isSubscribed) setLoading(false);
      });

    return () => {
      isSubscribed = false;
    };
  }, [selectedCategory, searchQuery, sortBy, segment]);

  return (
    <div className="min-h-screen bg-[#FFF9F1] text-[#281411] flex flex-col justify-between">
      <Navbar />

      <main className="flex-1 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12 w-full">
        {/* Breadcrumb Navigation */}
        <nav aria-label="Breadcrumb" className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-[#735C57] mb-6">
          <Link href="/" className="hover:text-[#F47735] transition-colors">
            Home
          </Link>
          <span>/</span>
          <span className="text-[#281411]">
            {segment === 'retail'
              ? 'Shop Retail Packets'
              : segment === 'wholesale'
              ? 'Shop Wholesale Bulk'
              : 'Product Catalogue'}
          </span>
        </nav>

        {/* Page Header */}
        <div className="mb-8">
          <div className="flex flex-wrap items-center gap-2 mb-3">
            <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#FFD83D] text-[#281411] text-xs font-bold uppercase tracking-wider">
              {segment === 'retail'
                ? '🛍️ Retail Shop (Single Packets)'
                : segment === 'wholesale'
                ? '📦 Wholesale Supply (Bulk & Cartons)'
                : 'All Products (Retail & Wholesale)'}
            </span>
            {isApprovedWholesale && (
              <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#E8F4EE] text-[#287B52] text-xs font-bold">
                ✓ Approved Wholesale Pricing Active
              </span>
            )}
          </div>

          <h1 className="editorial-headline text-4xl sm:text-6xl font-black text-[#281411] tracking-tight">
            {segment === 'retail'
              ? 'FRESH KERALA SNACKS'
              : segment === 'wholesale'
              ? 'WHOLESALE BULK SUPPLY'
              : 'ONFRESH PRODUCT CATALOGUE'}
          </h1>
          <p className="mt-2 text-sm sm:text-base text-[#735C57] max-w-2xl leading-relaxed">
            {segment === 'retail'
              ? 'Enjoy our signature banana chips, murukku, and tea rusks in convenient 250g, 500g, and 1kg packets for home delivery.'
              : segment === 'wholesale'
              ? 'Direct manufacturing rates, quantity-based volume tiers, and reliable dispatch from our Vandiperiyar bakery to supermarkets, retail stores, and tea stalls.'
              : 'Authentic Kerala snacks sliced fresh daily and fried in 100% pure cold-pressed coconut oil. Available for retail and wholesale orders.'}
          </p>
        </div>

        {/* Customer Segment Mode Switcher */}
        <div className="bg-[#FFFFFF] rounded-2xl border border-[#EADBCC] p-2 mb-6 shadow-sm flex flex-wrap gap-2 items-center">
          <span className="text-xs font-bold uppercase tracking-wider text-[#735C57] px-3">
            Catalogue Mode:
          </span>
          <button
            type="button"
            onClick={() => setSegment('')}
            className={`px-4 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer ${
              segment === ''
                ? 'bg-[#351C18] text-[#FFF9F1] shadow-xs'
                : 'bg-[#F7EFE6] text-[#281411] hover:bg-[#EADBCC]'
            }`}
          >
            All Items
          </button>
          <button
            type="button"
            onClick={() => setSegment('retail')}
            className={`px-4 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer flex items-center gap-1.5 ${
              segment === 'retail'
                ? 'bg-[#F47735] text-[#FFFFFF] shadow-xs'
                : 'bg-[#F7EFE6] text-[#281411] hover:bg-[#EADBCC]'
            }`}
          >
            <ShoppingBag className="w-3.5 h-3.5" />
            <span>Retail (Single Packets)</span>
          </button>
          <button
            type="button"
            onClick={() => setSegment('wholesale')}
            className={`px-4 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer flex items-center gap-1.5 ${
              segment === 'wholesale'
                ? 'bg-[#287B52] text-[#FFFFFF] shadow-xs'
                : 'bg-[#F7EFE6] text-[#281411] hover:bg-[#EADBCC]'
            }`}
          >
            <Building2 className="w-3.5 h-3.5" />
            <span>Wholesale (Bulk & Cartons)</span>
          </button>
        </div>

        {/* Filter & Search Bar */}
        <div className="bg-[#FFFFFF] rounded-3xl border border-[#EADBCC] p-4 sm:p-6 mb-8 shadow-sm">
          <div className="flex flex-col md:flex-row items-stretch md:items-center justify-between gap-4">
            {/* Search Input */}
            <div className="relative flex-1">
              <Search className="w-4 h-4 text-[#A89088] absolute left-4 top-3.5" />
              <input
                type="text"
                placeholder="Search by snack name, ingredients, or variety..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-11 pr-14 py-3 rounded-2xl bg-[#F7EFE6] border border-[#EADBCC] text-xs font-semibold text-[#281411] placeholder:text-[#A89088] outline-none focus:border-[#F47735] focus:bg-[#FFFFFF] transition-all"
              />
              {searchQuery && (
                <button
                  onClick={() => setSearchQuery('')}
                  className="absolute right-3.5 top-3 text-xs text-[#735C57] hover:text-[#281411] font-bold"
                >
                  Clear
                </button>
              )}
            </div>

            {/* Sorting Dropdown */}
            <div className="flex items-center gap-2 min-w-[200px]">
              <label
                htmlFor="sortSelect"
                className="text-xs font-bold uppercase tracking-wider text-[#735C57] whitespace-nowrap"
              >
                Sort:
              </label>
              <select
                id="sortSelect"
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value)}
                className="w-full py-3 px-4 rounded-2xl border border-[#EADBCC] text-xs font-bold text-[#281411] bg-[#F7EFE6] outline-none focus:border-[#F47735] cursor-pointer"
              >
                <option value="-created_at">Featured & Newest</option>
                <option value="min_price">Price: Low to High</option>
                <option value="-min_price">Price: High to Low</option>
                <option value="name">Name: A to Z</option>
              </select>
            </div>
          </div>

          {/* Category Filter Pills */}
          <div className="mt-4 pt-4 border-t border-[#F7EFE6] flex items-center gap-2 overflow-x-auto pb-1 scrollbar-none">
            <button
              onClick={() => setSelectedCategory('')}
              className={`px-4 py-2 rounded-full text-xs font-bold whitespace-nowrap transition-all cursor-pointer ${
                selectedCategory === ''
                  ? 'bg-[#351C18] text-[#FFF9F1] shadow-xs'
                  : 'bg-[#F7EFE6] text-[#735C57] hover:bg-[#EADBCC]'
              }`}
            >
              All Categories ({totalCount})
            </button>
            {categories.map((cat) => (
              <button
                key={cat.id}
                onClick={() => setSelectedCategory(cat.slug)}
                className={`px-4 py-2 rounded-full text-xs font-bold whitespace-nowrap transition-all cursor-pointer ${
                  selectedCategory === cat.slug
                    ? 'bg-[#F47735] text-[#FFFFFF] shadow-xs'
                    : 'bg-[#F7EFE6] text-[#735C57] hover:bg-[#EADBCC]'
                }`}
              >
                {cat.name} {cat.product_count !== undefined ? `(${cat.product_count})` : ''}
              </button>
            ))}
          </div>
        </div>

        {/* Loading State */}
        {loading && (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 py-12">
            {[1, 2, 3, 4, 5, 6].map((idx) => (
              <div
                key={idx}
                className="bg-[#FFFFFF] rounded-3xl border border-[#EADBCC] overflow-hidden p-4 space-y-4 animate-pulse"
              >
                <div className="aspect-[4/3] bg-[#F7EFE6] rounded-2xl" />
                <div className="h-6 bg-[#F7EFE6] rounded w-2/3" />
                <div className="h-4 bg-[#F7EFE6] rounded w-full" />
                <div className="h-10 bg-[#F7EFE6] rounded-xl" />
              </div>
            ))}
          </div>
        )}

        {/* Error State */}
        {error && !loading && (
          <div className="text-center py-16 bg-[#FFFFFF] rounded-3xl border border-[#EADBCC] p-8 max-w-md mx-auto">
            <div className="text-3xl mb-2">⚠️</div>
            <h3 className="font-display font-black text-[#281411] text-lg">Error Loading Catalogue</h3>
            <p className="text-xs text-[#735C57] mt-1 mb-4">{error}</p>
            <button
              onClick={() => {
                setSelectedCategory('');
                setSearchQuery('');
                setSegment('');
              }}
              className="px-5 py-2.5 bg-[#F47735] text-white text-xs font-bold uppercase rounded-full hover:bg-[#E06322] transition-colors"
            >
              Reset Filters
            </button>
          </div>
        )}

        {/* Empty State */}
        {!loading && !error && products.length === 0 && (
          <div className="text-center py-16 bg-[#FFFFFF] rounded-3xl border border-[#EADBCC] p-8 max-w-md mx-auto">
            <div className="text-4xl mb-3">🔍</div>
            <h3 className="font-display font-black text-[#281411] text-xl">No Snacks Found</h3>
            <p className="text-xs text-[#735C57] mt-1 mb-6">
              No products match your selected category or search keyword.
            </p>
            <button
              onClick={() => {
                setSelectedCategory('');
                setSearchQuery('');
                setSegment('');
              }}
              className="px-6 py-2.5 bg-[#351C18] text-[#FFD83D] text-xs font-bold uppercase rounded-full hover:bg-[#281411] transition-colors"
            >
              Reset All Filters
            </button>
          </div>
        )}

        {/* Products Grid */}
        {!loading && !error && products.length > 0 && (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8">
            {products.map((product) => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>
        )}
      </main>

      <Footer />
    </div>
  );
}

export default function ProductsPage() {
  return (
    <Suspense
      fallback={
        <div className="min-h-screen bg-[#FFF9F1] flex items-center justify-center">
          <Loader2 className="w-8 h-8 text-[#F47735] animate-spin" />
        </div>
      }
    >
      <ProductsCatalogueContent />
    </Suspense>
  );
}

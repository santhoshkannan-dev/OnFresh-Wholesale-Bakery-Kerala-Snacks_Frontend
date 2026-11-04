'use client';

import { useState, useEffect, Suspense } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { useParams } from 'next/navigation';
import {
  ArrowLeft,
  Sparkles,
  Building2,
  CheckCircle2,
  ShoppingBag,
  Plus,
  Minus,
  Check,
  ShieldCheck,
  Flame,
  Award,
  Loader2,
} from 'lucide-react';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import DecorativeBadge from '@/components/ui/DecorativeBadge';
import { getProductBySlug, apiCalculatePricing, getHdrProductImage } from '@/lib/api';
import { Product, ProductVariant, PricingCalculationResponse } from '@/types/api';
import { useAuth } from '@/context/AuthContext';
import { useCart } from '@/context/CartContext';

function ProductDetailContent() {
  const params = useParams();
  const slug = params?.slug as string;

  const { profile } = useAuth();
  const { addToCart } = useCart();
  const isApprovedWholesale = Boolean(
    profile?.customer_type === 'business' && profile?.wholesale_status === 'approved'
  );

  const [product, setProduct] = useState<Product | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [selectedVariantIndex, setSelectedVariantIndex] = useState(0);

  // Live order quantity & backend pricing calculation
  const [orderQuantity, setOrderQuantity] = useState<number>(1);
  const [pricingCalc, setPricingCalc] = useState<PricingCalculationResponse | null>(null);
  const [addingToCart, setAddingToCart] = useState(false);
  const [addSuccess, setAddSuccess] = useState(false);
  const [addError, setAddError] = useState<string | null>(null);

  useEffect(() => {
    if (!slug) return;
    let isSubscribed = true;

    getProductBySlug(slug).then((res) => {
      if (isSubscribed) {
        if (res.data) {
          setProduct(res.data);
          setError(null);
        } else {
          setError(res.error || 'Product not found');
        }
        setLoading(false);
      }
    });

    return () => {
      isSubscribed = false;
    };
  }, [slug]);

  const activeVariant: ProductVariant | undefined =
    product?.variants && product.variants.length > 0
      ? product.variants[selectedVariantIndex] || product.variants[0]
      : undefined;

  // Set initial MOQ depending on customer status
  useEffect(() => {
    if (activeVariant) {
      const defaultQty = isApprovedWholesale ? activeVariant.minimum_order_quantity : 1;
      setOrderQuantity(defaultQty);
    }
  }, [activeVariant, isApprovedWholesale]);

  // Call authoritative backend pricing calculation whenever variant or quantity changes
  useEffect(() => {
    if (!activeVariant) return;
    let isSubscribed = true;

    apiCalculatePricing([{ variant_id: activeVariant.id, quantity: orderQuantity }]).then((res) => {
      if (isSubscribed && res) {
        setPricingCalc(res);
      }
    });

    return () => {
      isSubscribed = false;
    };
  }, [activeVariant, orderQuantity]);

  const handleAddToCart = async () => {
    if (!activeVariant || !product) return;
    setAddingToCart(true);
    setAddError(null);

    const res = await addToCart(
      activeVariant,
      {
        name: product.name,
        slug: product.slug,
        main_image: product.main_image,
      },
      orderQuantity
    );

    setAddingToCart(false);
    if (res.success) {
      setAddSuccess(true);
      setTimeout(() => setAddSuccess(false), 2500);
    } else {
      setAddError(res.error || 'Failed to add item to bag');
    }
  };

  const retailPrice = activeVariant?.retail_price
    ? Number(activeVariant.retail_price)
    : Number(product?.min_price || 80);

  const wholesalePrice = activeVariant?.wholesale_price
    ? Number(activeVariant.wholesale_price)
    : retailPrice;

  return (
    <div className="min-h-screen bg-[#FFF9F1] flex flex-col justify-between text-[#281411]">
      <Navbar />

      <main className="flex-1 py-8 sm:py-14 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 w-full">
        {/* Breadcrumb Navigation */}
        <nav aria-label="Breadcrumb" className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-[#735C57] mb-6">
          <Link href="/" className="hover:text-[#F47735] transition-colors">
            Home
          </Link>
          <span>/</span>
          <Link href="/products" className="hover:text-[#F47735] transition-colors">
            Shop
          </Link>
          <span>/</span>
          <span className="text-[#281411] truncate max-w-xs">{product?.name || slug}</span>
        </nav>

        {loading && (
          <div className="py-24 text-center flex flex-col items-center">
            <Loader2 className="w-8 h-8 text-[#F47735] animate-spin mb-3" />
            <p className="text-xs font-bold text-[#735C57] uppercase tracking-wider">
              Loading snack specifications...
            </p>
          </div>
        )}

        {error && !loading && (
          <div className="text-center py-16 bg-[#FFFFFF] rounded-3xl border border-[#EADBCC] p-8 max-w-md mx-auto">
            <div className="text-3xl mb-2">⚠️</div>
            <h3 className="font-display font-black text-[#281411] text-lg">Product Not Found</h3>
            <p className="text-xs text-[#735C57] mt-1 mb-6">{error}</p>
            <Link
              href="/products"
              className="px-6 py-2.5 bg-[#F47735] text-white text-xs font-bold uppercase rounded-full hover:bg-[#E06322] transition-colors"
            >
              Back to Catalogue
            </Link>
          </div>
        )}

        {!loading && product && (
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-14 items-start">
            
            {/* Left Column: Visual Photography (5 Cols) */}
            <div className="lg:col-span-5 space-y-4">
              <div className="relative w-full aspect-square rounded-[2.5rem] bg-[#FFFFFF] border border-[#EADBCC] shadow-xl overflow-hidden group flex items-center justify-center">
                <Image
                  src={getHdrProductImage(product.slug, product.main_image)}
                  alt={product.name}
                  fill
                  priority
                  className="object-cover group-hover:scale-105 transition-transform duration-700 ease-out"
                  sizes="(max-width: 1024px) 100vw, 40vw"
                />

                {/* Floating Badges */}
                <div className="absolute top-4 left-4 flex flex-col gap-2">
                  <DecorativeBadge variant="yellow" icon={<Sparkles className="w-3 h-3 text-[#F47735]" />}>
                    {product.category?.name}
                  </DecorativeBadge>
                  {product.is_featured && (
                    <DecorativeBadge variant="orange">
                      Customer Favourite
                    </DecorativeBadge>
                  )}
                </div>
              </div>

              {/* Manufacturing Origin Guarantee Card */}
              <div className="p-5 rounded-2xl bg-[#FFFFFF] border border-[#EADBCC] flex items-center justify-between text-xs shadow-xs">
                <div className="flex items-center gap-2 text-[#287B52] font-bold">
                  <ShieldCheck className="w-4 h-4" />
                  <span>100% Pure Coconut Oil</span>
                </div>
                <span className="text-[#735C57] font-semibold">
                  Fresh Batch • Vandiperiyar, Kerala
                </span>
              </div>
            </div>

            {/* Right Column: Title, Variants, Pricing & Actions (7 Cols) */}
            <div className="lg:col-span-7 bg-[#FFFFFF] rounded-[2.5rem] border border-[#EADBCC] p-6 sm:p-10 shadow-lg space-y-6">
              <div>
                <div className="flex flex-wrap items-center gap-2 mb-2">
                  <span className="text-[10px] font-black uppercase tracking-wider text-[#F47735] bg-[#FEECE2] px-3 py-1 rounded-full">
                    {product.category?.name}
                  </span>
                  {isApprovedWholesale ? (
                    <span className="text-[10px] font-bold text-[#287B52] bg-[#E8F4EE] px-2.5 py-1 rounded-full flex items-center gap-1">
                      <Building2 className="w-3 h-3" />
                      Approved Wholesale Account
                    </span>
                  ) : (
                    <span className="text-[10px] font-bold text-[#735C57] bg-[#F7EFE6] px-2.5 py-1 rounded-full">
                      Retail & Wholesale Available
                    </span>
                  )}
                </div>

                <h1 className="editorial-headline text-3xl sm:text-5xl font-black text-[#281411] tracking-tight leading-tight">
                  {product.name}
                </h1>
                <p className="text-xs sm:text-sm text-[#735C57] mt-3 leading-relaxed font-medium">
                  {product.description || 'Authentic traditional recipe prepared with fresh ingredients in Vandiperiyar, Kerala.'}
                </p>
              </div>

              {/* Package Variants Selection */}
              {product.variants && product.variants.length > 0 && (
                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-[#281411] mb-2.5">
                    Select Packaging Size:
                  </label>
                  <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                    {product.variants.map((v, idx) => (
                      <button
                        key={v.id || v.sku}
                        type="button"
                        onClick={() => setSelectedVariantIndex(idx)}
                        className={`p-3.5 rounded-2xl border text-left transition-all cursor-pointer ${
                          selectedVariantIndex === idx
                            ? 'bg-[#351C18] text-[#FFF9F1] border-[#351C18] shadow-md'
                            : 'bg-[#F7EFE6] text-[#281411] border-[#EADBCC] hover:border-[#F47735]'
                        }`}
                      >
                        <div className={`text-sm font-black ${selectedVariantIndex === idx ? 'text-[#FFD83D]' : 'text-[#281411]'}`}>
                          {v.display_weight}
                        </div>
                        <div className={`text-[10px] mt-0.5 ${selectedVariantIndex === idx ? 'text-[#E8DCCF]' : 'text-[#735C57]'}`}>
                          SKU: {v.sku}
                        </div>
                        <div className={`text-sm font-black mt-2 ${selectedVariantIndex === idx ? 'text-[#FFF9F1]' : 'text-[#F47735]'}`}>
                          ₹{isApprovedWholesale ? v.wholesale_price || v.retail_price : v.retail_price}
                          <span className="text-[10px] font-normal opacity-70"> / pack</span>
                        </div>
                      </button>
                    ))}
                  </div>
                </div>
              )}

              {/* Price Banner */}
              <div className="p-5 rounded-2xl bg-[#FFF9DC] border border-[#FFD83D]/60 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                <div>
                  <span className="text-[10px] uppercase font-bold text-[#735C57] tracking-wider block">
                    {isApprovedWholesale ? 'Approved Wholesale Tier Price' : 'Retail Price (Individual Packet)'}
                  </span>
                  <div className="text-3xl font-display font-black text-[#281411] mt-0.5">
                    ₹{isApprovedWholesale ? wholesalePrice.toFixed(2) : retailPrice.toFixed(2)}
                    <span className="text-xs font-medium text-[#735C57]"> / packet</span>
                  </div>
                  {isApprovedWholesale && (
                    <span className="text-xs text-[#A89088] line-through block mt-0.5">
                      Standard Retail: ₹{retailPrice.toFixed(2)}
                    </span>
                  )}
                </div>

                <div className="sm:text-right">
                  <span className="text-[10px] uppercase font-bold text-[#735C57] tracking-wider block">
                    Minimum Order Quantity
                  </span>
                  <span className="text-xs font-bold text-[#281411] bg-[#FFD83D] px-3 py-1 rounded-full inline-block mt-1">
                    {isApprovedWholesale
                      ? `${activeVariant?.minimum_order_quantity || 1} packets (Wholesale MOQ)`
                      : '1 packet (Retail)'}
                  </span>
                </div>
              </div>

              {/* Quantity Stepper & Add To Cart Button */}
              <div className="space-y-4 pt-2 border-t border-[#F7EFE6]">
                <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-4">
                  {/* Quantity Stepper */}
                  <div className="flex items-center justify-between sm:justify-start gap-3 bg-[#F7EFE6] p-1.5 rounded-full border border-[#EADBCC]">
                    <button
                      type="button"
                      onClick={() => {
                        const min = isApprovedWholesale ? (activeVariant?.minimum_order_quantity || 1) : 1;
                        if (orderQuantity > min) setOrderQuantity(orderQuantity - 1);
                      }}
                      disabled={orderQuantity <= (isApprovedWholesale ? (activeVariant?.minimum_order_quantity || 1) : 1)}
                      className="w-9 h-9 rounded-full bg-[#FFFFFF] hover:bg-[#FFD83D] text-[#281411] flex items-center justify-center transition-colors disabled:opacity-40"
                    >
                      <Minus className="w-4 h-4" />
                    </button>

                    <div className="px-4 text-center">
                      <span className="font-display font-black text-lg text-[#281411]">
                        {orderQuantity}
                      </span>
                      <span className="text-[10px] text-[#735C57] block leading-none">packs</span>
                    </div>

                    <button
                      type="button"
                      onClick={() => setOrderQuantity(orderQuantity + 1)}
                      className="w-9 h-9 rounded-full bg-[#FFFFFF] hover:bg-[#FFD83D] text-[#281411] flex items-center justify-center transition-colors"
                    >
                      <Plus className="w-4 h-4" />
                    </button>
                  </div>

                  {/* Add to Cart CTA */}
                  <button
                    type="button"
                    onClick={handleAddToCart}
                    disabled={addingToCart || !activeVariant}
                    className={`flex-1 py-4 px-8 rounded-full font-display font-black text-xs uppercase tracking-wider transition-all flex items-center justify-center gap-2 shadow-lg hover:shadow-xl ${
                      addSuccess
                        ? 'bg-[#287B52] text-[#FFFFFF]'
                        : 'bg-[#F47735] hover:bg-[#E06322] text-[#FFFFFF]'
                    }`}
                  >
                    {addingToCart ? (
                      <Loader2 className="w-4 h-4 animate-spin" />
                    ) : addSuccess ? (
                      <>
                        <Check className="w-4 h-4" />
                        <span>Added to Cart!</span>
                      </>
                    ) : (
                      <>
                        <ShoppingBag className="w-4 h-4" />
                        <span>Add {orderQuantity} to Cart</span>
                      </>
                    )}
                  </button>
                </div>

                {addError && (
                  <p className="text-xs text-red-600 font-bold bg-red-50 p-2.5 rounded-xl border border-red-200">
                    {addError}
                  </p>
                )}

                {/* Real Authoritative Backend Subtotal */}
                {pricingCalc && (
                  <div className="p-3.5 rounded-2xl bg-[#F7EFE6] border border-[#EADBCC] flex items-center justify-between text-xs text-[#735C57]">
                    <span>Calculated Subtotal ({orderQuantity} pkts):</span>
                    <span className="font-display font-black text-base text-[#281411]">
                      ₹{Number(pricingCalc.subtotal).toFixed(2)}
                    </span>
                  </div>
                )}
              </div>
            </div>

          </div>
        )}
      </main>

      <Footer />
    </div>
  );
}

export default function ProductDetailPage() {
  return (
    <Suspense
      fallback={
        <div className="min-h-screen bg-[#FFF9F1] flex items-center justify-center">
          <Loader2 className="w-8 h-8 text-[#F47735] animate-spin" />
        </div>
      }
    >
      <ProductDetailContent />
    </Suspense>
  );
}

'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { ShoppingBag, Check, Building2, Sparkles } from 'lucide-react';
import { Product, ProductVariant } from '@/types/api';
import { useCart } from '@/context/CartContext';
import { useAuth } from '@/context/AuthContext';

interface ProductCardProps {
  product: Product;
  className?: string;
}

export default function ProductCard({ product, className = '' }: ProductCardProps) {
  const { addToCart, loading: cartLoading } = useCart();
  const { profile } = useAuth();
  const [selectedVariantIndex, setSelectedVariantIndex] = useState(0);
  const [isAdded, setIsAdded] = useState(false);

  const variants = product.variants && product.variants.length > 0 ? product.variants : [];
  const activeVariant: ProductVariant | null = variants[selectedVariantIndex] || null;

  const isApprovedWholesale =
    profile?.customer_type === 'business' && profile?.wholesale_status === 'approved';

  // Determine displayed price
  const retailPrice = activeVariant?.retail_price
    ? Number(activeVariant.retail_price)
    : Number(product.min_price || 80);

  const wholesalePrice = activeVariant?.wholesale_price
    ? Number(activeVariant.wholesale_price)
    : null;

  const handleAddToCart = async (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (!activeVariant) return;

    const res = await addToCart(
      activeVariant,
      {
        name: product.name,
        slug: product.slug,
        main_image: product.main_image,
      },
      1
    );

    if (res.success) {
      setIsAdded(true);
      setTimeout(() => setIsAdded(false), 1800);
    }
  };

  return (
    <div
      className={`group card-bakery p-4 sm:p-5 flex flex-col justify-between relative bg-[#FFFFFF] rounded-3xl border border-[#EADBCC] shadow-sm hover:shadow-xl hover:-translate-y-1 transition-all duration-300 ${className}`}
    >
      {/* Top Image Container with Crave Bakery Style Price Badge */}
      <Link href={`/products/${product.slug}`} className="block relative">
        <div className="w-full aspect-[4/3] rounded-2xl bg-[#FFF9F1] relative overflow-hidden flex items-center justify-center border border-[#EADBCC]/60">
          {product.main_image ? (
            <Image
              src={product.main_image}
              alt={product.name}
              fill
              className="object-cover group-hover:scale-105 transition-transform duration-500 ease-out"
              sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
            />
          ) : (
            <div className="flex flex-col items-center justify-center p-4 text-center">
              <span className="font-display font-black text-3xl text-[#F47735]/40 mb-1">ONFRESH</span>
              <span className="text-[10px] font-bold text-[#735C57] uppercase tracking-wider">Traditional Snack</span>
            </div>
          )}

          {/* Floating Category & Featured Badge (Top-Left) */}
          <div className="absolute top-3 left-3 flex flex-col gap-1.5 z-10">
            <span className="px-2.5 py-0.5 rounded-full bg-[#FFF9F1]/95 backdrop-blur-sm text-[10px] font-bold text-[#281411] border border-[#EADBCC] uppercase tracking-wider shadow-sm">
              {product.category?.name || 'Kerala Snack'}
            </span>
            {product.is_featured && (
              <span className="px-2 py-0.5 rounded-full bg-[#FFD83D] text-[10px] font-black text-[#281411] shadow-sm flex items-center gap-1 w-fit">
                <Sparkles className="w-2.5 h-2.5 text-[#F47735]" />
                Fresh
              </span>
            )}
          </div>

          {/* Crave Bakery Style Price Pill (Top-Right) */}
          <div className="absolute top-3 right-3 z-10">
            <span className="px-3 py-1 rounded-full bg-[#2B1510]/90 backdrop-blur-sm text-xs font-display font-black text-[#FFD83D] shadow-md border border-[#FFD83D]/30">
              {isApprovedWholesale && wholesalePrice !== null
                ? `₹${wholesalePrice.toFixed(0)} (B2B)`
                : `₹${retailPrice.toFixed(0)}`}
            </span>
          </div>
        </div>
      </Link>

      {/* Product Information */}
      <div className="pt-4 flex-1 flex flex-col justify-between">
        <div>
          <Link href={`/products/${product.slug}`}>
            <h3 className="font-display font-black text-xl text-[#281411] group-hover:text-[#F47735] transition-colors leading-snug line-clamp-1">
              {product.name}
            </h3>
          </Link>

          <p className="text-xs text-[#735C57] line-clamp-2 mt-1 mb-3 leading-relaxed">
            {product.description || 'Authentic traditional recipe prepared with fresh ingredients in Vandiperiyar, Kerala.'}
          </p>

          {/* Variant Selector Pills */}
          {variants.length > 0 && (
            <div className="flex flex-wrap gap-1.5 mb-4">
              {variants.map((v, idx) => (
                <button
                  key={v.id || idx}
                  onClick={(e) => {
                    e.preventDefault();
                    setSelectedVariantIndex(idx);
                  }}
                  className={`px-2.5 py-1 rounded-full text-[11px] font-bold tracking-wide transition-all border ${
                    selectedVariantIndex === idx
                      ? 'bg-[#2B1510] text-[#FFF9F1] border-[#2B1510]'
                      : 'bg-[#FFF9F1] text-[#735C57] border-[#EADBCC] hover:border-[#F47735]'
                  }`}
                >
                  {v.display_weight || `${v.package_weight} ${v.package_unit}`}
                </button>
              ))}
            </div>
          )}
        </div>

        {/* Pricing Summary & Crave Bakery Prominent Rounded Add-to-Cart Button */}
        <div className="pt-3 border-t border-[#F7EFE6] space-y-2.5">
          <div className="flex items-center justify-between text-xs">
            <div>
              {isApprovedWholesale && wholesalePrice !== null ? (
                <div className="flex items-center gap-1.5">
                  <span className="font-display font-black text-lg text-[#287B52]">
                    ₹{wholesalePrice.toFixed(2)}
                  </span>
                  <span className="text-[11px] line-through text-[#A89088]">
                    ₹{retailPrice.toFixed(2)}
                  </span>
                  <span className="text-[10px] font-bold text-[#287B52] bg-[#E8F4EE] px-1.5 py-0.5 rounded ml-1">
                    Wholesale
                  </span>
                </div>
              ) : (
                <div className="flex items-baseline gap-1">
                  <span className="font-display font-black text-lg text-[#281411]">
                    ₹{retailPrice.toFixed(2)}
                  </span>
                  <span className="text-[10px] text-[#A89088]">/ packet</span>
                </div>
              )}
            </div>

            <span className="text-[10px] font-bold text-[#287B52]">
              100% Coconut Oil
            </span>
          </div>

          {/* Full-width Rounded Pill CTA Button (Crave Bakery Style) */}
          <button
            onClick={handleAddToCart}
            disabled={cartLoading || !activeVariant}
            aria-label="Add product to cart"
            className={`w-full py-2.5 rounded-full font-display font-bold text-xs uppercase tracking-wider transition-all flex items-center justify-center gap-2 cursor-pointer ${
              isAdded
                ? 'bg-[#287B52] text-[#FFFFFF]'
                : 'bg-[#F47735] hover:bg-[#E06322] text-[#FFFFFF] shadow-md hover:shadow-lg hover:scale-[1.02] active:scale-[0.98]'
            }`}
          >
            {isAdded ? (
              <>
                <Check className="w-4 h-4 text-[#FFFFFF]" />
                <span>Added to Basket!</span>
              </>
            ) : (
              <>
                <ShoppingBag className="w-4 h-4" />
                <span>Add To Cart</span>
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  );
}

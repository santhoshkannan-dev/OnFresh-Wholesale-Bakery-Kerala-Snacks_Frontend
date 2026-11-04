'use client';

import React from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { ShoppingBag, ArrowRight, Trash2, Plus, Minus, Sparkles, Building2, ShieldCheck, ArrowLeft } from 'lucide-react';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import { useCart } from '@/context/CartContext';
import { useAuth } from '@/context/AuthContext';

export default function CartPage() {
  const { cart, loading, updateQuantity, removeFromCart, clearCart } = useCart();
  const { user, profile } = useAuth();

  const isApprovedWholesale = Boolean(
    profile?.customer_type === 'business' && profile?.wholesale_status === 'approved'
  );
  const items = cart?.items || [];
  const hasItems = items.length > 0;

  const currentSubtotal = cart?.subtotal ? Number(cart.subtotal) : 0;
  const freeThreshold = cart?.free_delivery_threshold ? Number(cart.free_delivery_threshold) : (isApprovedWholesale ? 5000 : 500);
  const deliveryCharge = cart?.delivery_charge ? Number(cart.delivery_charge) : (currentSubtotal >= freeThreshold ? 0 : 50);
  const remainingForFree = Math.max(0, freeThreshold - currentSubtotal);
  const progressPercent = Math.min(100, (currentSubtotal / freeThreshold) * 100);

  return (
    <div className="min-h-screen bg-[#FFF9F1] flex flex-col justify-between text-[#281411]">
      <Navbar />

      <main className="flex-1 py-10 sm:py-16 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 w-full">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-[#F47735] mb-2">
            <span>Direct from Vandiperiyar Factory</span>
            <span>•</span>
            <span>{isApprovedWholesale ? 'B2B Wholesale Cart' : 'Retail Shopping Cart'}</span>
          </div>
          <h1 className="editorial-headline text-4xl sm:text-6xl font-black text-[#281411] tracking-tight">
            YOUR BAKERY CART
          </h1>
          <p className="text-sm text-[#735C57] mt-1 font-medium">
            Review your Kerala snack packages, quantities, and backend-calculated pricing.
          </p>
        </div>

        {/* Wholesale Pending Notice */}
        {user && profile?.customer_type === 'business' && profile?.wholesale_status === 'pending' && (
          <div className="mb-6 p-4 rounded-2xl bg-[#FFF9DC] border border-[#FFD83D] text-[#281411] text-xs flex items-center justify-between">
            <div className="flex items-center gap-2">
              <span className="text-base">⏳</span>
              <span>
                Your wholesale business account is currently <strong>pending administrator approval</strong>. Standard retail pricing applies until verified.
              </span>
            </div>
            <Link href="/account" className="font-bold underline text-[#F47735]">
              Check Status &rarr;
            </Link>
          </div>
        )}

        {!hasItems && !loading ? (
          <div className="text-center py-20 bg-[#FFFFFF] rounded-3xl border border-[#EADBCC] p-8 shadow-sm max-w-xl mx-auto">
            <div className="w-20 h-20 rounded-full bg-[#F7EFE6] flex items-center justify-center mx-auto mb-4 text-[#F47735]">
              <ShoppingBag className="w-10 h-10 opacity-60" />
            </div>
            <h2 className="font-display font-black text-2xl text-[#281411]">Your Cart is Empty</h2>
            <p className="text-sm text-[#735C57] mt-2 max-w-md mx-auto">
              Explore our freshly fried banana chips, traditional tapioca crisps, spicy murukku, and tea-time Kerala savouries.
            </p>
            <div className="mt-8 flex flex-col sm:flex-row gap-3 justify-center">
              <Link
                href="/products"
                className="px-8 py-3.5 rounded-full bg-[#F47735] hover:bg-[#E06322] text-[#FFFFFF] font-display font-black text-xs uppercase tracking-wider shadow-md hover:shadow-lg transition-all"
              >
                Browse All Snacks
              </Link>
              <Link
                href="/categories/banana-chips"
                className="px-8 py-3.5 rounded-full bg-[#351C18] hover:bg-[#281411] text-[#FFD83D] font-display font-black text-xs uppercase tracking-wider transition-colors"
              >
                Banana Chips Varieties
              </Link>
            </div>
          </div>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
            
            {/* Left Column: Cart Items (8 Cols) */}
            <div className="lg:col-span-8 space-y-4">
              {/* Free Delivery Bar */}
              <div className="p-4 rounded-2xl bg-[#FFFFFF] border border-[#EADBCC] shadow-xs">
                <div className="flex items-center justify-between text-xs font-bold text-[#281411] mb-2">
                  <span className="flex items-center gap-1.5">
                    <Sparkles className="w-4 h-4 text-[#F47735]" />
                    {remainingForFree === 0
                      ? 'Congratulations! You unlocked FREE delivery across Kerala!'
                      : `Add ₹${remainingForFree.toFixed(0)} more for FREE delivery`}
                  </span>
                  <span>{progressPercent.toFixed(0)}%</span>
                </div>
                <div className="w-full bg-[#F7EFE6] h-2.5 rounded-full overflow-hidden border border-[#EADBCC]">
                  <div
                    className="bg-[#287B52] h-full rounded-full transition-all duration-500 ease-out"
                    style={{ width: `${progressPercent}%` }}
                  />
                </div>
              </div>

              {/* Items Card List */}
              <div className="bg-[#FFFFFF] rounded-3xl border border-[#EADBCC] shadow-sm divide-y divide-[#F7EFE6] overflow-hidden">
                {items.map((item) => (
                  <div key={item.id || item.variant_id} className="p-5 sm:p-6 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                    <div className="flex items-center gap-4">
                      {/* Image Thumbnail */}
                      <div className="w-20 h-20 rounded-2xl bg-[#F7EFE6] relative overflow-hidden shrink-0 border border-[#EADBCC] flex items-center justify-center">
                        {item.image ? (
                          <Image
                            src={item.image}
                            alt={item.product_name}
                            fill
                            className="object-cover"
                            sizes="80px"
                          />
                        ) : (
                          <span className="font-display font-black text-xl text-[#F47735]/40">OF</span>
                        )}
                      </div>

                      {/* Title & Variant Info */}
                      <div>
                        <Link
                          href={`/products/${item.product_slug}`}
                          className="font-display font-black text-lg text-[#281411] hover:text-[#F47735] transition-colors line-clamp-1"
                        >
                          {item.product_name}
                        </Link>
                        <div className="flex items-center gap-2 mt-1">
                          <span className="text-xs font-bold px-2.5 py-0.5 rounded-md bg-[#F7EFE6] text-[#735C57]">
                            {item.display_weight || `${item.package_weight} ${item.package_unit}`}
                          </span>
                          <span className="text-[10px] text-[#A89088] font-mono">
                            SKU: {item.sku}
                          </span>
                        </div>
                        {item.pricing_rule_applied === 'wholesale' && (
                          <span className="inline-flex items-center gap-1 text-[10px] font-bold text-[#287B52] bg-[#E8F4EE] px-2 py-0.5 rounded mt-1">
                            <Building2 className="w-2.5 h-2.5" />
                            Wholesale Tier Applied
                          </span>
                        )}
                      </div>
                    </div>

                    {/* Quantity Stepper & Price */}
                    <div className="flex items-center justify-between sm:justify-end gap-6 pt-3 sm:pt-0 border-t sm:border-t-0 border-[#F7EFE6]">
                      {/* Quantity Stepper */}
                      <div className="flex items-center gap-1.5 bg-[#F7EFE6] p-1 rounded-full border border-[#EADBCC]">
                        <button
                          onClick={() => {
                            const newQty = item.quantity - 1;
                            if (newQty <= 0) {
                              removeFromCart(item.id || item.variant_id);
                            } else {
                              updateQuantity(item.id || item.variant_id, newQty);
                            }
                          }}
                          disabled={loading}
                          aria-label="Decrease quantity"
                          className="w-7 h-7 rounded-full bg-[#FFFFFF] hover:bg-[#FFD83D] text-[#281411] flex items-center justify-center transition-colors disabled:opacity-50"
                        >
                          {item.quantity === 1 ? <Trash2 className="w-3.5 h-3.5 text-red-500" /> : <Minus className="w-3.5 h-3.5" />}
                        </button>

                        <span className="w-8 text-center text-xs font-bold text-[#281411]">
                          {item.quantity}
                        </span>

                        <button
                          onClick={() => updateQuantity(item.id || item.variant_id, item.quantity + 1)}
                          disabled={loading}
                          aria-label="Increase quantity"
                          className="w-7 h-7 rounded-full bg-[#FFFFFF] hover:bg-[#FFD83D] text-[#281411] flex items-center justify-center transition-colors disabled:opacity-50"
                        >
                          <Plus className="w-3.5 h-3.5" />
                        </button>
                      </div>

                      {/* Total */}
                      <div className="text-right min-w-[90px]">
                        <span className="font-display font-black text-lg text-[#281411] block">
                          ₹{Number(item.line_total || (item.unit_price * item.quantity)).toFixed(2)}
                        </span>
                        <span className="text-[10px] text-[#735C57] block">
                          ₹{Number(item.unit_price).toFixed(2)} / pack
                        </span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>

              {/* Bottom Actions */}
              <div className="flex items-center justify-between pt-2">
                <Link
                  href="/products"
                  className="inline-flex items-center gap-1.5 text-xs font-bold text-[#F47735] hover:text-[#E06322] uppercase tracking-wider"
                >
                  <ArrowLeft className="w-3.5 h-3.5" />
                  <span>Continue Shopping</span>
                </Link>

                <button
                  onClick={clearCart}
                  className="text-xs font-semibold text-[#A89088] hover:text-red-600 transition-colors"
                >
                  Clear Cart
                </button>
              </div>
            </div>

            {/* Right Column: Order Summary (4 Cols) */}
            <div className="lg:col-span-4 bg-[#FFFFFF] rounded-3xl border border-[#EADBCC] p-6 sm:p-8 shadow-sm space-y-6">
              <h3 className="font-display font-black text-xl text-[#281411] pb-4 border-b border-[#F7EFE6]">
                Order Summary
              </h3>

              <div className="space-y-3 text-xs">
                <div className="flex justify-between text-[#735C57]">
                  <span>Subtotal ({cart?.items_count || 0} items)</span>
                  <span className="font-bold text-[#281411]">₹{currentSubtotal.toFixed(2)}</span>
                </div>

                <div className="flex justify-between text-[#735C57]">
                  <span>Estimated Delivery</span>
                  <span className="font-bold text-[#281411]">
                    {deliveryCharge === 0 ? (
                      <span className="text-[#287B52] uppercase font-bold">FREE</span>
                    ) : (
                      `₹${deliveryCharge.toFixed(2)}`
                    )}
                  </span>
                </div>

                {Number(cart?.discount_amount) > 0 && (
                  <div className="flex justify-between text-[#287B52]">
                    <span>Wholesale Bulk Discount</span>
                    <span className="font-bold">-₹{Number(cart?.discount_amount).toFixed(2)}</span>
                  </div>
                )}

                <div className="flex justify-between text-base font-black text-[#281411] pt-4 border-t border-[#EADBCC]">
                  <span className="font-display">Total Amount</span>
                  <span>₹{(currentSubtotal + deliveryCharge).toFixed(2)}</span>
                </div>
              </div>

              <Link
                href="/checkout"
                className="w-full py-4 rounded-full bg-[#F47735] hover:bg-[#E06322] text-[#FFFFFF] font-display font-black text-xs uppercase tracking-wider shadow-lg hover:shadow-xl transition-all flex items-center justify-center gap-2 text-center"
              >
                <span>Proceed to Checkout</span>
                <ArrowRight className="w-4 h-4" />
              </Link>

              <div className="p-4 rounded-2xl bg-[#F7EFE6] border border-[#EADBCC] text-[11px] text-[#735C57] space-y-1.5">
                <div className="flex items-center gap-1.5 font-bold text-[#281411]">
                  <ShieldCheck className="w-3.5 h-3.5 text-[#287B52]" />
                  <span>OnFresh Safe Dispatch Guarantee</span>
                </div>
                <p>
                  Airtight multilayer nitrogen-flushed pouches protect chips from light and humidity. Dispatched fresh from Vandiperiyar.
                </p>
              </div>
            </div>

          </div>
        )}
      </main>

      <Footer />
    </div>
  );
}

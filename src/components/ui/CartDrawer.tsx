'use client';

import React from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { X, ShoppingBag, Plus, Minus, Trash2, ArrowRight, Sparkles } from 'lucide-react';
import { useCart } from '@/context/CartContext';
import { useAuth } from '@/context/AuthContext';
import { getHdrProductImage } from '@/lib/api';

interface CartDrawerProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function CartDrawer({ isOpen, onClose }: CartDrawerProps) {
  const { cart, itemsCount, updateQuantity, removeFromCart, loading } = useCart();
  const { profile } = useAuth();

  if (!isOpen) return null;

  const freeDeliveryThreshold = cart?.free_delivery_threshold ? Number(cart.free_delivery_threshold) : 500;
  const currentSubtotal = cart?.subtotal ? Number(cart.subtotal) : 0;
  const deliveryCharge = cart?.delivery_charge ? Number(cart.delivery_charge) : (currentSubtotal >= freeDeliveryThreshold ? 0 : 50);
  const remainingForFree = Math.max(0, freeDeliveryThreshold - currentSubtotal);
  const progressPercent = Math.min(100, (currentSubtotal / freeDeliveryThreshold) * 100);

  const isWholesale = profile?.customer_type === 'business' && profile?.wholesale_status === 'approved';

  return (
    <div className="fixed inset-0 z-50 overflow-hidden">
      {/* Backdrop */}
      <div
        onClick={onClose}
        className="fixed inset-0 bg-[#281411]/60 backdrop-blur-sm transition-opacity duration-300"
      />

      <div className="fixed inset-y-0 right-0 max-w-full flex pl-10">
        <div className="w-screen max-w-md bg-[#FFF9F1] shadow-2xl border-l border-[#EADBCC] flex flex-col justify-between animate-in slide-in-from-right duration-300">
          {/* Header */}
          <div className="p-5 border-b border-[#EADBCC] bg-[#FFFFFF] flex items-center justify-between">
            <div className="flex items-center gap-2.5">
              <div className="w-9 h-9 rounded-xl bg-[#FFD83D] flex items-center justify-center text-[#281411]">
                <ShoppingBag className="w-5 h-5" />
              </div>
              <div>
                <h2 className="font-display font-black text-xl text-[#281411] tracking-tight">Your Bakery Cart</h2>
                <p className="text-xs text-[#735C57]">
                  {itemsCount} {itemsCount === 1 ? 'item' : 'items'} in bag
                </p>
              </div>
            </div>

            <button
              onClick={onClose}
              aria-label="Close cart"
              className="w-8 h-8 rounded-full bg-[#F7EFE6] hover:bg-[#EADBCC] text-[#281411] flex items-center justify-center transition-colors"
            >
              <X className="w-4 h-4" />
            </button>
          </div>

          {/* Free Delivery Bar (Retail or Wholesale) */}
          <div className="px-5 py-3 bg-[#F7EFE6] border-b border-[#EADBCC]">
            {isWholesale ? (
              <div className="flex items-center gap-2 text-xs font-semibold text-[#287B52]">
                <Sparkles className="w-4 h-4" />
                <span>Wholesale Business Tier: Orders above ₹5,000 ship free</span>
              </div>
            ) : (
              <div>
                <div className="flex items-center justify-between text-xs font-bold text-[#281411] mb-1.5">
                  <span className="flex items-center gap-1.5">
                    <Sparkles className="w-3.5 h-3.5 text-[#F47735]" />
                    {remainingForFree === 0
                      ? 'You unlocked FREE delivery!'
                      : `Add ₹${remainingForFree.toFixed(0)} more for FREE delivery`}
                  </span>
                  <span>{progressPercent.toFixed(0)}%</span>
                </div>
                <div className="w-full bg-[#EADBCC] h-2 rounded-full overflow-hidden">
                  <div
                    className="bg-[#287B52] h-full rounded-full transition-all duration-500 ease-out"
                    style={{ width: `${progressPercent}%` }}
                  />
                </div>
              </div>
            )}
          </div>

          {/* Cart Item List */}
          <div className="flex-1 overflow-y-auto p-5 space-y-4">
            {!cart || cart.items.length === 0 ? (
              <div className="text-center py-16 flex flex-col items-center">
                <div className="w-20 h-20 rounded-full bg-[#F7EFE6] border border-[#EADBCC] flex items-center justify-center mb-4 text-[#735C57]">
                  <ShoppingBag className="w-10 h-10 opacity-40" />
                </div>
                <h3 className="font-display font-black text-xl text-[#281411] mb-1">Your cart is empty</h3>
                <p className="text-sm text-[#735C57] max-w-xs mb-6">
                  Explore our fresh Nendran banana chips, tapioca crisps, and artisanal bakery delights.
                </p>
                <Link
                  href="/products"
                  onClick={onClose}
                  className="px-6 py-3 rounded-full bg-[#F47735] hover:bg-[#E06322] text-[#FFFFFF] font-bold text-sm tracking-wide shadow-md hover:shadow-lg transition-all"
                >
                  Browse Fresh Snacks
                </Link>
              </div>
            ) : (
              cart.items.map((item) => (
                <div
                  key={item.id || item.variant_id}
                  className="flex gap-4 p-3.5 rounded-2xl bg-[#FFFFFF] border border-[#EADBCC] shadow-sm relative group"
                >
                  {/* Thumbnail */}
                  <div className="w-20 h-20 rounded-xl bg-[#F7EFE6] overflow-hidden shrink-0 relative flex items-center justify-center border border-[#EADBCC]">
                    <Image
                      src={getHdrProductImage(item.product_name, item.image)}
                      alt={item.product_name}
                      fill
                      className="object-cover"
                      sizes="80px"
                    />
                  </div>

                  {/* Details */}
                  <div className="flex-1 min-w-0 flex flex-col justify-between">
                    <div>
                      <h4 className="font-bold text-sm text-[#281411] truncate">{item.product_name}</h4>
                      <div className="flex items-center gap-2 mt-0.5">
                        <span className="text-xs font-semibold px-2 py-0.5 rounded bg-[#F7EFE6] text-[#735C57]">
                          {item.display_weight || `${item.package_weight} ${item.package_unit}`}
                        </span>
                        {item.pricing_rule_applied === 'wholesale' && (
                          <span className="text-[10px] font-bold px-1.5 py-0.5 rounded bg-[#287B52]/10 text-[#287B52]">
                            Wholesale Tier
                          </span>
                        )}
                      </div>
                    </div>

                    <div className="flex items-center justify-between mt-3">
                      {/* Price */}
                      <div>
                        <span className="font-black text-sm text-[#281411]">
                          ₹{Number(item.line_total || (item.unit_price * item.quantity)).toFixed(2)}
                        </span>
                        <span className="text-[10px] text-[#735C57] block">
                          ₹{Number(item.unit_price).toFixed(2)} / pack
                        </span>
                      </div>

                      {/* Quantity Selector */}
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
                          className="w-6 h-6 rounded-full bg-[#FFFFFF] hover:bg-[#FFD83D] text-[#281411] flex items-center justify-center transition-colors disabled:opacity-50"
                        >
                          {item.quantity === 1 ? <Trash2 className="w-3 h-3 text-red-500" /> : <Minus className="w-3 h-3" />}
                        </button>

                        <span className="w-6 text-center text-xs font-bold text-[#281411]">
                          {item.quantity}
                        </span>

                        <button
                          onClick={() => updateQuantity(item.id || item.variant_id, item.quantity + 1)}
                          disabled={loading}
                          aria-label="Increase quantity"
                          className="w-6 h-6 rounded-full bg-[#FFFFFF] hover:bg-[#FFD83D] text-[#281411] flex items-center justify-center transition-colors disabled:opacity-50"
                        >
                          <Plus className="w-3 h-3" />
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>

          {/* Footer with totals & Checkout */}
          {cart && cart.items.length > 0 && (
            <div className="p-5 border-t border-[#EADBCC] bg-[#FFFFFF] space-y-3">
              <div className="space-y-1.5 text-xs text-[#735C57]">
                <div className="flex justify-between">
                  <span>Subtotal</span>
                  <span className="font-bold text-[#281411]">₹{currentSubtotal.toFixed(2)}</span>
                </div>
                <div className="flex justify-between">
                  <span>Estimated Delivery</span>
                  <span className="font-bold text-[#281411]">
                    {deliveryCharge === 0 ? (
                      <span className="text-[#287B52] uppercase font-bold">FREE</span>
                    ) : (
                      `₹${deliveryCharge.toFixed(2)}`
                    )}
                  </span>
                </div>
                {Number(cart.discount_amount) > 0 && (
                  <div className="flex justify-between text-[#287B52]">
                    <span>Wholesale Bulk Discount</span>
                    <span className="font-bold">-₹{Number(cart.discount_amount).toFixed(2)}</span>
                  </div>
                )}
                <div className="flex justify-between text-base font-black text-[#281411] pt-2 border-t border-[#EADBCC]">
                  <span className="font-display">Total Amount</span>
                  <span>₹{(currentSubtotal + deliveryCharge).toFixed(2)}</span>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-2.5 pt-2">
                <Link
                  href="/cart"
                  onClick={onClose}
                  className="px-4 py-3 rounded-full border border-[#EADBCC] bg-[#F7EFE6] hover:bg-[#EADBCC] text-[#281411] font-bold text-xs text-center uppercase tracking-wider transition-colors"
                >
                  View Full Cart
                </Link>

                <Link
                  href="/checkout"
                  onClick={onClose}
                  className="px-4 py-3 rounded-full bg-[#F47735] hover:bg-[#E06322] text-[#FFFFFF] font-bold text-xs text-center uppercase tracking-wider shadow-md hover:shadow-lg transition-all flex items-center justify-center gap-1.5"
                >
                  <span>Checkout</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </Link>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}


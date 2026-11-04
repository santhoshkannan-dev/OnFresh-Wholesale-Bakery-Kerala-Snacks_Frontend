'use client';

import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { Cart, CartItem, ProductVariant } from '@/types/api';
import { useAuth } from './AuthContext';
import {
  apiGetCart,
  apiAddToCart,
  apiUpdateCartItem,
  apiRemoveCartItem,
  apiClearCart,
  apiSyncCart,
  apiCalculatePricing,
} from '@/lib/api';

interface GuestCartItem {
  variant_id: number;
  sku: string;
  product_name: string;
  product_slug: string;
  image: string | null;
  package_weight: number;
  package_unit: string;
  display_weight: string;
  quantity: number;
}

interface CartContextType {
  cart: Cart | null;
  itemsCount: number;
  loading: boolean;
  addToCart: (
    variant: ProductVariant,
    product: { name: string; slug: string; main_image: string | null },
    quantity?: number
  ) => Promise<{ success: boolean; error?: string }>;
  updateQuantity: (identifier: number, quantity: number) => Promise<void>;
  removeFromCart: (identifier: number) => Promise<void>;
  clearCart: () => Promise<void>;
  refreshCart: () => Promise<void>;
}

const CartContext = createContext<CartContextType>({
  cart: null,
  itemsCount: 0,
  loading: false,
  addToCart: async () => ({ success: false }),
  updateQuantity: async () => {},
  removeFromCart: async () => {},
  clearCart: async () => {},
  refreshCart: async () => {},
});

const GUEST_CART_STORAGE_KEY = 'onfresh_guest_cart_v1';

export function CartProvider({ children }: { children: React.ReactNode }) {
  const { user } = useAuth();
  const [cart, setCart] = useState<Cart | null>(null);
  const [loading, setLoading] = useState<boolean>(true);

  // Recalculate guest cart via backend pricing endpoint
  const evaluateGuestCart = useCallback(async (guestItems: GuestCartItem[]): Promise<Cart> => {
    if (guestItems.length === 0) {
      return {
        items: [],
        items_count: 0,
        subtotal: 0,
        discount_amount: 0,
        delivery_charge: 0,
        tax_amount: 0,
        total_amount: 0,
        free_delivery_threshold: 500,
        amount_for_free_delivery: 500,
        customer_segment: 'retail',
        is_wholesale_approved: false,
        is_valid: true,
        errors: [],
        currency: 'INR',
      };
    }

    const payload = guestItems.map((item) => ({
      variant_id: item.variant_id,
      quantity: item.quantity,
    }));

    const pricing = await apiCalculatePricing(payload);
    const subtotal = pricing?.subtotal || 0;
    const delivery_charge = subtotal >= 500 ? 0 : 50;
    const total_amount = subtotal + delivery_charge;

    const evaluatedItems: CartItem[] = (pricing?.items || []).map((pItem) => {
      const meta = guestItems.find((g) => g.variant_id === pItem.variant_id);
      return {
        variant_id: pItem.variant_id,
        sku: pItem.sku,
        product_name: pItem.product_name || meta?.product_name || 'Kerala Snack',
        product_slug: meta?.product_slug || '',
        image: meta?.image || null,
        package_weight: pItem.package_weight,
        package_unit: pItem.package_unit,
        display_weight: pItem.display_weight,
        quantity: pItem.quantity,
        moq: pItem.moq,
        moq_met: pItem.moq_satisfied,
        retail_unit_price: pItem.retail_unit_price,
        unit_price: pItem.effective_unit_price,
        line_subtotal: pItem.retail_unit_price * pItem.quantity,
        line_total: pItem.line_total,
        line_discount: Math.max(0, pItem.retail_unit_price * pItem.quantity - pItem.line_total),
        pricing_rule_applied: pItem.rule_applied,
        errors: [],
      };
    });

    return {
      items: evaluatedItems,
      items_count: evaluatedItems.reduce((acc, it) => acc + it.quantity, 0),
      subtotal,
      discount_amount: 0,
      delivery_charge,
      tax_amount: 0,
      total_amount,
      free_delivery_threshold: 500,
      amount_for_free_delivery: Math.max(0, 500 - subtotal),
      customer_segment: 'retail',
      is_wholesale_approved: false,
      is_valid: (pricing?.all_moq_met ?? true) && (pricing?.warnings?.length ?? 0) === 0,
      errors: pricing?.warnings || [],
      currency: 'INR',
    };
  }, []);

  const refreshCart = useCallback(async () => {
    setLoading(true);
    if (user) {
      // Check if any guest items exist in localStorage to sync
      try {
        const stored = localStorage.getItem(GUEST_CART_STORAGE_KEY);
        if (stored) {
          const guestItems: GuestCartItem[] = JSON.parse(stored);
          if (guestItems.length > 0) {
            await apiSyncCart(
              guestItems.map((i) => ({ variant_id: i.variant_id, quantity: i.quantity }))
            );
            localStorage.removeItem(GUEST_CART_STORAGE_KEY);
          }
        }
      } catch {
        // Continue if parse failed
      }

      const res = await apiGetCart();
      if (res.data) {
        setCart(res.data);
      }
    } else {
      // Guest user mode
      try {
        const stored = localStorage.getItem(GUEST_CART_STORAGE_KEY);
        if (stored) {
          const items: GuestCartItem[] = JSON.parse(stored);
          const computed = await evaluateGuestCart(items);
          setCart(computed);
        } else {
          setCart(await evaluateGuestCart([]));
        }
      } catch {
        setCart(await evaluateGuestCart([]));
      }
    }
    setLoading(false);
  }, [user, evaluateGuestCart]);

  useEffect(() => {
    refreshCart();
  }, [refreshCart]);

  const addToCart = async (
    variant: ProductVariant,
    product: { name: string; slug: string; main_image: string | null },
    quantity: number = 1
  ): Promise<{ success: boolean; error?: string }> => {
    setLoading(true);
    if (user) {
      const res = await apiAddToCart(variant.id, quantity);
      setLoading(false);
      if (res.data) {
        setCart(res.data);
        return { success: true };
      }
      return { success: false, error: res.error || 'Failed to add item to cart.' };
    } else {
      // Guest mode
      try {
        const stored = localStorage.getItem(GUEST_CART_STORAGE_KEY);
        const guestItems: GuestCartItem[] = stored ? JSON.parse(stored) : [];
        const existingIndex = guestItems.findIndex((it) => it.variant_id === variant.id);

        if (existingIndex > -1) {
          guestItems[existingIndex].quantity += quantity;
        } else {
          guestItems.push({
            variant_id: variant.id,
            sku: variant.sku,
            product_name: product.name,
            product_slug: product.slug,
            image: product.main_image,
            package_weight: parseFloat(variant.package_weight),
            package_unit: variant.package_unit,
            display_weight: variant.display_weight,
            quantity,
          });
        }

        localStorage.setItem(GUEST_CART_STORAGE_KEY, JSON.stringify(guestItems));
        const updated = await evaluateGuestCart(guestItems);
        setCart(updated);
        setLoading(false);
        return { success: true };
      } catch {
        setLoading(false);
        return { success: false, error: 'Could not store item in browser.' };
      }
    }
  };

  const updateQuantity = async (identifier: number, quantity: number) => {
    if (quantity < 1) return;
    setLoading(true);
    if (user) {
      // identifier is cart_item_id
      const res = await apiUpdateCartItem(identifier, quantity);
      if (res.data) setCart(res.data);
    } else {
      // identifier is variant_id in guest mode
      try {
        const stored = localStorage.getItem(GUEST_CART_STORAGE_KEY);
        const guestItems: GuestCartItem[] = stored ? JSON.parse(stored) : [];
        const index = guestItems.findIndex(
          (it) => it.variant_id === identifier || it.variant_id === identifier
        );
        if (index > -1) {
          guestItems[index].quantity = quantity;
          localStorage.setItem(GUEST_CART_STORAGE_KEY, JSON.stringify(guestItems));
          const updated = await evaluateGuestCart(guestItems);
          setCart(updated);
        }
      } catch {
        // ignore
      }
    }
    setLoading(false);
  };

  const removeFromCart = async (identifier: number) => {
    setLoading(true);
    if (user) {
      const res = await apiRemoveCartItem(identifier);
      if (res.data) setCart(res.data);
    } else {
      try {
        const stored = localStorage.getItem(GUEST_CART_STORAGE_KEY);
        const guestItems: GuestCartItem[] = stored ? JSON.parse(stored) : [];
        const filtered = guestItems.filter(
          (it) => it.variant_id !== identifier
        );
        localStorage.setItem(GUEST_CART_STORAGE_KEY, JSON.stringify(filtered));
        const updated = await evaluateGuestCart(filtered);
        setCart(updated);
      } catch {
        // ignore
      }
    }
    setLoading(false);
  };

  const clearCart = async () => {
    setLoading(true);
    if (user) {
      const res = await apiClearCart();
      if (res.data) setCart(res.data);
    } else {
      localStorage.removeItem(GUEST_CART_STORAGE_KEY);
      setCart(await evaluateGuestCart([]));
    }
    setLoading(false);
  };

  return (
    <CartContext.Provider
      value={{
        cart,
        itemsCount: cart?.items_count ?? 0,
        loading,
        addToCart,
        updateQuantity,
        removeFromCart,
        clearCart,
        refreshCart,
      }}
    >
      {children}
    </CartContext.Provider>
  );
}

export function useCart() {
  return useContext(CartContext);
}


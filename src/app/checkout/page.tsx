'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import {
  ShieldCheck,
  Truck,
  ArrowRight,
  Building2,
  Sparkles,
  CheckCircle2,
  CreditCard,
  Banknote,
  Receipt,
  Loader2,
  Lock,
} from 'lucide-react';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import { useAuth } from '@/context/AuthContext';
import { useCart } from '@/context/CartContext';
import { apiGetCustomerProfile, apiCheckout } from '@/lib/api';
import { Address, CustomerProfile, PaymentMethod } from '@/types/api';

const KERALA_DISTRICTS = [
  'Idukki',
  'Ernakulam',
  'Kottayam',
  'Alappuzha',
  'Pathanamthitta',
  'Kollam',
  'Thiruvananthapuram',
  'Thrissur',
  'Palakkad',
  'Malappuram',
  'Kozhikode',
  'Wayanad',
  'Kannur',
  'Kasaragod',
];

export default function CheckoutPage() {
  const router = useRouter();
  const { user, profile, loading: authLoading } = useAuth();
  const { cart, clearCart } = useCart();

  const [customerAddresses, setCustomerAddresses] = useState<Address[]>([]);
  const [selectedShippingAddressId, setSelectedShippingAddressId] = useState<number | null>(null);
  const [useNewShippingAddress, setUseNewShippingAddress] = useState(false);

  // New shipping address form state
  const [newShipping, setNewShipping] = useState({
    recipient_name: '',
    phone_number: '',
    address_line_1: '',
    address_line_2: '',
    city: '',
    district: 'Idukki',
    state: 'Kerala',
    pincode: '',
  });

  // Billing address state
  const [sameAsShipping, setSameAsShipping] = useState(true);
  const [selectedBillingAddressId, setSelectedBillingAddressId] = useState<number | null>(null);

  // Payment method selection
  const [paymentMethod, setPaymentMethod] = useState<PaymentMethod>('cod');
  const [customerNotes, setCustomerNotes] = useState('');

  // Submission state
  const [submitting, setSubmitting] = useState(false);
  const [checkoutError, setCheckoutError] = useState<string | null>(null);

  const isApprovedWholesale = Boolean(
    profile?.customer_type === 'business' && profile?.wholesale_status === 'approved'
  );

  // Fetch saved customer addresses if logged in
  useEffect(() => {
    if (user) {
      apiGetCustomerProfile().then((res) => {
        if (res.data?.addresses && res.data.addresses.length > 0) {
          setCustomerAddresses(res.data.addresses);
          const defaultShipping = res.data.addresses.find((a) => a.is_default) || res.data.addresses[0];
          setSelectedShippingAddressId(defaultShipping.id);
        } else {
          setUseNewShippingAddress(true);
        }
      });
    } else {
      setUseNewShippingAddress(true);
    }
  }, [user]);

  const items = cart?.items || [];
  const currentSubtotal = cart?.subtotal ? Number(cart.subtotal) : 0;
  const freeThreshold = cart?.free_delivery_threshold ? Number(cart.free_delivery_threshold) : (isApprovedWholesale ? 5000 : 500);
  const deliveryCharge = cart?.delivery_charge ? Number(cart.delivery_charge) : (currentSubtotal >= freeThreshold ? 0 : 50);
  const totalAmount = currentSubtotal + deliveryCharge;

  const handlePlaceOrder = async (e: React.FormEvent) => {
    e.preventDefault();
    setCheckoutError(null);

    if (!user) {
      router.push('/login?redirect=/checkout');
      return;
    }

    if (!cart || items.length === 0) {
      setCheckoutError('Your cart is empty.');
      return;
    }

    setSubmitting(true);

    try {
      const payload: any = {
        payment_method: paymentMethod,
        customer_notes: customerNotes,
        same_as_shipping: sameAsShipping,
      };

      if (!useNewShippingAddress && selectedShippingAddressId) {
        payload.shipping_address_id = selectedShippingAddressId;
      } else {
        payload.new_shipping_address = newShipping;
      }

      if (!sameAsShipping && selectedBillingAddressId) {
        payload.billing_address_id = selectedBillingAddressId;
      }

      const res = await apiCheckout(payload);

      if (res.status === 'success' && res.order) {
        await clearCart();
        router.push(`/order-success?order_number=${res.order.order_number}`);
      } else {
        setCheckoutError(res.message || 'Failed to complete order. Please review your address details.');
      }
    } catch (err: any) {
      setCheckoutError(err.message || 'An unexpected error occurred during checkout.');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#FFF9F1] flex flex-col justify-between text-[#281411]">
      <Navbar />

      <main className="flex-1 py-10 sm:py-16 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 w-full">
        {/* Breadcrumb Navigation */}
        <nav aria-label="Breadcrumb" className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-[#735C57] mb-6">
          <Link href="/" className="hover:text-[#F47735] transition-colors">Home</Link>
          <span>/</span>
          <Link href="/cart" className="hover:text-[#F47735] transition-colors">Cart</Link>
          <span>/</span>
          <span className="text-[#281411]">Secure Checkout</span>
        </nav>

        {/* Page Header */}
        <div className="mb-8">
          <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-[#287B52] mb-1.5">
            <Lock className="w-3.5 h-3.5" />
            <span>256-Bit SSL Encrypted Checkout</span>
          </div>
          <h1 className="editorial-headline text-4xl sm:text-5xl font-black text-[#281411] tracking-tight">
            FINALISE YOUR ORDER
          </h1>
        </div>

        {items.length === 0 ? (
          <div className="text-center py-20 bg-[#FFFFFF] rounded-3xl border border-[#EADBCC] p-8 shadow-sm max-w-md mx-auto">
            <h2 className="font-display font-black text-2xl text-[#281411]">Your cart is empty</h2>
            <p className="text-xs text-[#735C57] mt-2 mb-6">Add snacks before checking out.</p>
            <Link
              href="/products"
              className="px-6 py-3 rounded-full bg-[#F47735] hover:bg-[#E06322] text-[#FFFFFF] font-bold text-xs uppercase tracking-wider shadow-md"
            >
              Browse Products
            </Link>
          </div>
        ) : (
          <form onSubmit={handlePlaceOrder} className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
            
            {/* Left Steps: Details, Address, Payment (8 Cols) */}
            <div className="lg:col-span-8 space-y-6">
              
              {/* Step 1: Customer Account Status */}
              <div className="bg-[#FFFFFF] rounded-3xl border border-[#EADBCC] p-6 sm:p-8 shadow-sm space-y-4">
                <div className="flex items-center justify-between pb-3 border-b border-[#F7EFE6]">
                  <div className="flex items-center gap-3">
                    <span className="w-8 h-8 rounded-full bg-[#351C18] text-[#FFF9F1] font-display font-black text-sm flex items-center justify-center">
                      1
                    </span>
                    <h3 className="font-display font-black text-xl text-[#281411]">Account Details</h3>
                  </div>
                  {user && (
                    <span className="text-xs font-bold text-[#287B52] bg-[#E8F4EE] px-3 py-1 rounded-full">
                      Signed In
                    </span>
                  )}
                </div>

                {user ? (
                  <div className="text-xs space-y-1 text-[#735C57]">
                    <p><span className="font-bold text-[#281411]">Account:</span> {user.email}</p>
                    <p><span className="font-bold text-[#281411]">Segment:</span> {isApprovedWholesale ? 'Approved B2B Wholesale Customer' : 'Individual Retail Customer'}</p>
                  </div>
                ) : (
                  <div className="p-4 rounded-2xl bg-[#FFF9DC] border border-[#FFD83D] flex items-center justify-between text-xs">
                    <span>You must be logged in to place an order.</span>
                    <Link href="/login?redirect=/checkout" className="font-bold text-[#F47735] underline">
                      Sign In Now &rarr;
                    </Link>
                  </div>
                )}
              </div>

              {/* Step 2: Delivery Address */}
              <div className="bg-[#FFFFFF] rounded-3xl border border-[#EADBCC] p-6 sm:p-8 shadow-sm space-y-4">
                <div className="flex items-center gap-3 pb-3 border-b border-[#F7EFE6]">
                  <span className="w-8 h-8 rounded-full bg-[#351C18] text-[#FFF9F1] font-display font-black text-sm flex items-center justify-center">
                    2
                  </span>
                  <h3 className="font-display font-black text-xl text-[#281411]">Delivery Address</h3>
                </div>

                {/* Saved Addresses Selector */}
                {customerAddresses.length > 0 && (
                  <div className="space-y-3">
                    <label className="block text-xs font-bold uppercase tracking-wider text-[#281411]">
                      Select Saved Address:
                    </label>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                      {customerAddresses.map((addr) => (
                        <div
                          key={addr.id}
                          onClick={() => {
                            setSelectedShippingAddressId(addr.id);
                            setUseNewShippingAddress(false);
                          }}
                          className={`p-4 rounded-2xl border cursor-pointer transition-all ${
                            !useNewShippingAddress && selectedShippingAddressId === addr.id
                              ? 'border-[#F47735] bg-[#FEECE2] shadow-sm'
                              : 'border-[#EADBCC] bg-[#F7EFE6] hover:border-[#F47735]'
                          }`}
                        >
                          <div className="flex items-center justify-between mb-1">
                            <span className="font-display font-black text-sm text-[#281411]">
                              {addr.recipient_name}
                            </span>
                            {addr.is_default && (
                              <span className="text-[10px] font-bold text-[#287B52] bg-[#E8F4EE] px-2 py-0.5 rounded">
                                Default
                              </span>
                            )}
                          </div>
                          <p className="text-xs text-[#735C57]">
                            {addr.address_line_1}, {addr.city}, {addr.district} - {addr.pincode}
                          </p>
                          <p className="text-[11px] text-[#A89088] mt-1">Phone: {addr.phone_number}</p>
                        </div>
                      ))}
                    </div>

                    <div className="pt-2">
                      <button
                        type="button"
                        onClick={() => setUseNewShippingAddress(!useNewShippingAddress)}
                        className="text-xs font-bold text-[#F47735] hover:text-[#E06322] underline"
                      >
                        {useNewShippingAddress ? 'Use a saved address above' : '+ Enter a new delivery address'}
                      </button>
                    </div>
                  </div>
                )}

                {/* New Address Form */}
                {useNewShippingAddress && (
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2">
                    <div>
                      <label className="block text-xs font-bold uppercase tracking-wider text-[#281411] mb-1">Recipient Name *</label>
                      <input
                        type="text"
                        required
                        value={newShipping.recipient_name}
                        onChange={(e) => setNewShipping({ ...newShipping, recipient_name: e.target.value })}
                        placeholder="e.g. Anand Kumar"
                        className="w-full px-4 py-2.5 rounded-xl bg-[#F7EFE6] border border-[#EADBCC] text-xs font-semibold text-[#281411] outline-none focus:border-[#F47735]"
                      />
                    </div>

                    <div>
                      <label className="block text-xs font-bold uppercase tracking-wider text-[#281411] mb-1">Phone Number *</label>
                      <input
                        type="tel"
                        required
                        value={newShipping.phone_number}
                        onChange={(e) => setNewShipping({ ...newShipping, phone_number: e.target.value })}
                        placeholder="e.g. 9447000000"
                        className="w-full px-4 py-2.5 rounded-xl bg-[#F7EFE6] border border-[#EADBCC] text-xs font-semibold text-[#281411] outline-none focus:border-[#F47735]"
                      />
                    </div>

                    <div className="sm:col-span-2">
                      <label className="block text-xs font-bold uppercase tracking-wider text-[#281411] mb-1">Address Line 1 *</label>
                      <input
                        type="text"
                        required
                        value={newShipping.address_line_1}
                        onChange={(e) => setNewShipping({ ...newShipping, address_line_1: e.target.value })}
                        placeholder="House / Flat / Shop Number, Street Name"
                        className="w-full px-4 py-2.5 rounded-xl bg-[#F7EFE6] border border-[#EADBCC] text-xs font-semibold text-[#281411] outline-none focus:border-[#F47735]"
                      />
                    </div>

                    <div>
                      <label className="block text-xs font-bold uppercase tracking-wider text-[#281411] mb-1">City / Town *</label>
                      <input
                        type="text"
                        required
                        value={newShipping.city}
                        onChange={(e) => setNewShipping({ ...newShipping, city: e.target.value })}
                        placeholder="e.g. Vandiperiyar, Kottayam"
                        className="w-full px-4 py-2.5 rounded-xl bg-[#F7EFE6] border border-[#EADBCC] text-xs font-semibold text-[#281411] outline-none focus:border-[#F47735]"
                      />
                    </div>

                    <div>
                      <label className="block text-xs font-bold uppercase tracking-wider text-[#281411] mb-1">District (Kerala) *</label>
                      <select
                        value={newShipping.district}
                        onChange={(e) => setNewShipping({ ...newShipping, district: e.target.value })}
                        className="w-full py-2.5 px-3 rounded-xl bg-[#F7EFE6] border border-[#EADBCC] text-xs font-semibold text-[#281411] outline-none focus:border-[#F47735]"
                      >
                        {KERALA_DISTRICTS.map((d) => (
                          <option key={d} value={d}>{d}</option>
                        ))}
                      </select>
                    </div>

                    <div>
                      <label className="block text-xs font-bold uppercase tracking-wider text-[#281411] mb-1">Pincode *</label>
                      <input
                        type="text"
                        required
                        maxLength={6}
                        value={newShipping.pincode}
                        onChange={(e) => setNewShipping({ ...newShipping, pincode: e.target.value })}
                        placeholder="685533"
                        className="w-full px-4 py-2.5 rounded-xl bg-[#F7EFE6] border border-[#EADBCC] text-xs font-semibold text-[#281411] outline-none focus:border-[#F47735]"
                      />
                    </div>
                  </div>
                )}
              </div>

              {/* Step 3: Payment Method */}
              <div className="bg-[#FFFFFF] rounded-3xl border border-[#EADBCC] p-6 sm:p-8 shadow-sm space-y-4">
                <div className="flex items-center gap-3 pb-3 border-b border-[#F7EFE6]">
                  <span className="w-8 h-8 rounded-full bg-[#351C18] text-[#FFF9F1] font-display font-black text-sm flex items-center justify-center">
                    3
                  </span>
                  <h3 className="font-display font-black text-xl text-[#281411]">Payment Method</h3>
                </div>

                <div className="space-y-3">
                  {/* COD */}
                  <label
                    onClick={() => setPaymentMethod('cod')}
                    className={`flex items-start gap-3 p-4 rounded-2xl border cursor-pointer transition-all ${
                      paymentMethod === 'cod'
                        ? 'border-[#F47735] bg-[#FEECE2]'
                        : 'border-[#EADBCC] bg-[#F7EFE6] hover:border-[#F47735]'
                    }`}
                  >
                    <input
                      type="radio"
                      name="payment_method"
                      checked={paymentMethod === 'cod'}
                      onChange={() => setPaymentMethod('cod')}
                      className="mt-1"
                    />
                    <div>
                      <span className="font-display font-black text-sm text-[#281411] block">
                        Cash on Delivery (COD)
                      </span>
                      <span className="text-xs text-[#735C57]">
                        Pay cash or UPI to the delivery executive upon package arrival.
                      </span>
                    </div>
                  </label>

                  {/* Bank Transfer (Wholesale & Bulk Orders) */}
                  <label
                    onClick={() => setPaymentMethod('bank_transfer')}
                    className={`flex items-start gap-3 p-4 rounded-2xl border cursor-pointer transition-all ${
                      paymentMethod === 'bank_transfer'
                        ? 'border-[#F47735] bg-[#FEECE2]'
                        : 'border-[#EADBCC] bg-[#F7EFE6] hover:border-[#F47735]'
                    }`}
                  >
                    <input
                      type="radio"
                      name="payment_method"
                      checked={paymentMethod === 'bank_transfer'}
                      onChange={() => setPaymentMethod('bank_transfer')}
                      className="mt-1"
                    />
                    <div>
                      <span className="font-display font-black text-sm text-[#281411] block">
                        Direct Bank Transfer (NEFT / RTGS)
                      </span>
                      <span className="text-xs text-[#735C57]">
                        Recommended for commercial cartons and wholesale purchases. Bank details will be issued on proforma invoice.
                      </span>
                    </div>
                  </label>
                </div>

                {/* Delivery Notes */}
                <div className="pt-2">
                  <label className="block text-xs font-bold uppercase tracking-wider text-[#281411] mb-1">
                    Order / Delivery Instructions (Optional):
                  </label>
                  <textarea
                    rows={2}
                    value={customerNotes}
                    onChange={(e) => setCustomerNotes(e.target.value)}
                    placeholder="e.g. Deliver before 5 PM, call upon arrival at store..."
                    className="w-full px-4 py-2.5 rounded-xl bg-[#F7EFE6] border border-[#EADBCC] text-xs font-medium text-[#281411] outline-none focus:border-[#F47735]"
                  />
                </div>
              </div>

            </div>

            {/* Right Column: Order Summary (4 Cols) */}
            <div className="lg:col-span-4 bg-[#FFFFFF] rounded-3xl border border-[#EADBCC] p-6 sm:p-8 shadow-sm space-y-6">
              <h3 className="font-display font-black text-xl text-[#281411] pb-4 border-b border-[#F7EFE6]">
                Order Items ({items.length})
              </h3>

              <div className="space-y-3 max-h-60 overflow-y-auto pr-1 text-xs">
                {items.map((item) => (
                  <div key={item.id || item.variant_id} className="flex justify-between items-center gap-2">
                    <div>
                      <p className="font-bold text-[#281411] truncate max-w-[170px]">{item.product_name}</p>
                      <p className="text-[10px] text-[#735C57]">{item.display_weight} × {item.quantity}</p>
                    </div>
                    <span className="font-bold text-[#281411]">
                      ₹{Number(item.line_total || (item.unit_price * item.quantity)).toFixed(2)}
                    </span>
                  </div>
                ))}
              </div>

              <div className="pt-4 border-t border-[#F7EFE6] space-y-2 text-xs">
                <div className="flex justify-between text-[#735C57]">
                  <span>Subtotal</span>
                  <span className="font-bold text-[#281411]">₹{currentSubtotal.toFixed(2)}</span>
                </div>
                <div className="flex justify-between text-[#735C57]">
                  <span>Delivery</span>
                  <span className="font-bold text-[#281411]">
                    {deliveryCharge === 0 ? <span className="text-[#287B52] font-bold">FREE</span> : `₹${deliveryCharge.toFixed(2)}`}
                  </span>
                </div>
                {Number(cart?.discount_amount) > 0 && (
                  <div className="flex justify-between text-[#287B52]">
                    <span>Wholesale Bulk Discount</span>
                    <span className="font-bold">-₹{Number(cart?.discount_amount).toFixed(2)}</span>
                  </div>
                )}
                <div className="flex justify-between text-base font-black text-[#281411] pt-3 border-t border-[#EADBCC]">
                  <span className="font-display">Total Amount</span>
                  <span>₹{totalAmount.toFixed(2)}</span>
                </div>
              </div>

              {checkoutError && (
                <div className="p-3 rounded-xl bg-red-50 border border-red-200 text-xs text-red-600 font-bold">
                  {checkoutError}
                </div>
              )}

              <button
                type="submit"
                disabled={submitting || !user}
                className="w-full py-4 rounded-full bg-[#F47735] hover:bg-[#E06322] text-[#FFFFFF] font-display font-black text-xs uppercase tracking-wider shadow-lg hover:shadow-xl transition-all flex items-center justify-center gap-2 disabled:opacity-50"
              >
                {submitting ? (
                  <Loader2 className="w-4 h-4 animate-spin" />
                ) : (
                  <>
                    <span>Confirm & Place Order</span>
                    <ArrowRight className="w-4 h-4" />
                  </>
                )}
              </button>

              <p className="text-[10px] text-center text-[#735C57]">
                By placing this order you agree to OnFresh Terms & Conditions. Dispatched directly from Vandiperiyar, Idukki.
              </p>
            </div>

          </form>
        )}
      </main>

      <Footer />
    </div>
  );
}

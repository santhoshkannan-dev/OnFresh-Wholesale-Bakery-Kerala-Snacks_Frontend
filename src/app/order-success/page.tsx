'use client';

import React, { useEffect, useState, Suspense } from 'react';
import Link from 'next/link';
import { useSearchParams } from 'next/navigation';
import confetti from 'canvas-confetti';
import { CheckCircle2, ShoppingBag, ArrowRight, Download, PackageCheck, Sparkles, Loader2 } from 'lucide-react';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import { apiGetOrder, getOrderInvoicePDFUrl } from '@/lib/api';
import { OrderDetail } from '@/types/api';

function OrderSuccessContent() {
  const searchParams = useSearchParams();
  const orderNumber = searchParams?.get('order_number') || '';

  const [order, setOrder] = useState<OrderDetail | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Fire festive celebration confetti!
    confetti({
      particleCount: 80,
      spread: 70,
      origin: { y: 0.6 },
      colors: ['#F47735', '#FFD83D', '#287B52', '#351C18', '#A5DCE0'],
    });

    if (orderNumber) {
      apiGetOrder(orderNumber).then((res) => {
        if (res.data) {
          setOrder(res.data);
        }
        setLoading(false);
      });
    } else {
      setLoading(false);
    }
  }, [orderNumber]);

  return (
    <div className="min-h-screen bg-[#FFF9F1] flex flex-col justify-between text-[#281411]">
      <Navbar />

      <main className="flex-1 py-12 sm:py-20 max-w-3xl mx-auto px-4 w-full">
        <div className="bg-[#FFFFFF] rounded-3xl border border-[#EADBCC] p-6 sm:p-10 shadow-lg text-center space-y-6">
          {/* Success Checkmark Badge */}
          <div className="w-20 h-20 rounded-full bg-[#E8F4EE] text-[#287B52] flex items-center justify-center mx-auto shadow-inner">
            <CheckCircle2 className="w-10 h-10" />
          </div>

          <div>
            <span className="text-xs font-bold uppercase tracking-wider text-[#F47735] block">
              Order Confirmed & Placed
            </span>
            <h1 className="editorial-headline text-3xl sm:text-5xl font-black text-[#281411] tracking-tight mt-1">
              THANK YOU FOR YOUR ORDER!
            </h1>
            <p className="text-sm text-[#735C57] mt-2 max-w-md mx-auto">
              Your snack order has been registered in our Vandiperiyar bakery facility and will be freshly packed.
            </p>
          </div>

          {/* Order Details Card */}
          {loading ? (
            <div className="py-8 text-center flex flex-col items-center">
              <Loader2 className="w-6 h-6 text-[#F47735] animate-spin mb-2" />
              <p className="text-xs text-[#735C57]">Retrieving order summary...</p>
            </div>
          ) : order ? (
            <div className="bg-[#F7EFE6] rounded-2xl border border-[#EADBCC] p-6 text-left space-y-4">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-[#EADBCC] pb-3">
                <div>
                  <span className="text-[10px] uppercase font-bold text-[#735C57] block">Order Number</span>
                  <span className="font-mono font-bold text-sm text-[#281411]">{order.order_number}</span>
                </div>
                <div className="sm:text-right">
                  <span className="text-[10px] uppercase font-bold text-[#735C57] block">Status</span>
                  <span className="px-2.5 py-0.5 rounded-full bg-[#E8F4EE] text-[#287B52] font-bold text-xs">
                    {order.order_status_display || order.order_status}
                  </span>
                </div>
              </div>

              {/* Items summary */}
              <div className="space-y-2 text-xs">
                <span className="text-[10px] uppercase font-bold text-[#735C57] block">Items in Batch:</span>
                {order.items.map((it) => (
                  <div key={it.id} className="flex justify-between items-center text-[#281411]">
                    <span>{it.product_name} ({it.display_weight}) × {it.quantity}</span>
                    <span className="font-bold">₹{Number(it.line_total).toFixed(2)}</span>
                  </div>
                ))}
              </div>

              {/* Financial Totals */}
              <div className="pt-3 border-t border-[#EADBCC] space-y-1.5 text-xs">
                <div className="flex justify-between text-[#735C57]">
                  <span>Subtotal</span>
                  <span className="font-bold text-[#281411]">₹{Number(order.subtotal).toFixed(2)}</span>
                </div>
                <div className="flex justify-between text-[#735C57]">
                  <span>Delivery Charge</span>
                  <span className="font-bold text-[#281411]">
                    {Number(order.delivery_charge) === 0 ? 'FREE' : `₹${Number(order.delivery_charge).toFixed(2)}`}
                  </span>
                </div>
                <div className="flex justify-between text-sm font-black text-[#281411] pt-2 border-t border-[#EADBCC]">
                  <span>Total Amount</span>
                  <span>₹{Number(order.total_amount).toFixed(2)}</span>
                </div>
              </div>

              {/* PDF Invoice Button */}
              {order.order_number && (
                <div className="pt-2">
                  <a
                    href={getOrderInvoicePDFUrl(order.order_number)}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-[#FFFFFF] border border-[#EADBCC] hover:border-[#F47735] text-xs font-bold text-[#281411] transition-colors"
                  >
                    <Download className="w-3.5 h-3.5 text-[#F47735]" />
                    <span>Download GST Invoice PDF</span>
                  </a>
                </div>
              )}
            </div>
          ) : (
            <div className="text-xs text-[#735C57]">
              Order #{orderNumber} has been received. You will receive SMS & WhatsApp status updates.
            </div>
          )}

          {/* Action CTAs */}
          <div className="flex flex-col sm:flex-row gap-3 justify-center pt-4">
            <Link
              href="/account/orders"
              className="px-6 py-3.5 rounded-full bg-[#351C18] hover:bg-[#281411] text-[#FFD83D] font-display font-black text-xs uppercase tracking-wider transition-colors"
            >
              View Order History
            </Link>
            <Link
              href="/products"
              className="px-6 py-3.5 rounded-full bg-[#F47735] hover:bg-[#E06322] text-[#FFFFFF] font-display font-black text-xs uppercase tracking-wider shadow-md hover:shadow-lg transition-all"
            >
              Continue Shopping
            </Link>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}

export default function OrderSuccessPage() {
  return (
    <Suspense
      fallback={
        <div className="min-h-screen bg-[#FFF9F1] flex items-center justify-center">
          <Loader2 className="w-8 h-8 text-[#F47735] animate-spin" />
        </div>
      }
    >
      <OrderSuccessContent />
    </Suspense>
  );
}

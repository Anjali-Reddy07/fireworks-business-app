'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import { useCart } from '@/components/cart/CartContext';
import {
  ArrowLeft,
  Trash2,
  Plus,
  Minus,
  Sparkles,
  ShoppingBag,
  ShieldCheck,
  CheckCircle2,
  Loader2,
  Calendar,
  User,
  Phone,
  Mail,
  AlertCircle,
} from 'lucide-react';
import { BUSINESS_CONFIG } from '@/lib/data/sample-products';

export default function CheckoutPage() {
  const { items, total, removeItem, updateQuantity, clearCart } = useCart();
  const router = useRouter();

  const [customerName, setCustomerName] = useState('');
  const [customerPhone, setCustomerPhone] = useState('');
  const [customerEmail, setCustomerEmail] = useState('');
  const [festivalDate, setFestivalDate] = useState('2026-11-01');
  const [pickupNote, setPickupNote] = useState('');
  const [loading, setLoading] = useState(false);
  const [orderPlaced, setOrderPlaced] = useState(false);
  const [placedOrderId, setPlacedOrderId] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  const totalItemsCount = items.reduce((sum, it) => sum + it.quantity, 0);

  const handlePlaceOrder = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    if (!customerName.trim()) {
      setError('Please provide your full name for the booking record.');
      return;
    }

    const cleanPhone = customerPhone.trim().replace(/[^\d]/g, '');
    if (cleanPhone.length < 10) {
      setError('Please enter a valid 10-digit mobile number for order confirmation.');
      return;
    }

    setLoading(true);

    const payload = {
      customerName: customerName.trim(),
      customerEmail: customerEmail.trim() || 'counter@fireworks.local',
      customerPhone: cleanPhone,
      festivalDate,
      pickupNote: pickupNote.trim(),
      items: items.map((it) => ({
        productId: it.product.id,
        name: it.product.name,
        quantity: it.quantity,
        price: it.product.retailPrice,
      })),
      total,
    };

    try {
      const res = await fetch('/api/orders', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });

      if (res.ok) {
        const data = await res.json();
        setPlacedOrderId(data.orderId || null);
        setOrderPlaced(true);
        clearCart();
      } else {
        const err = await res.json();
        setError(err.error || 'Failed to place booking. Please try again.');
      }
    } catch (e: unknown) {
      console.error(e);
      setError('Unexpected error while connecting to server. Please call us directly.');
    } finally {
      setLoading(false);
    }
  };

  if (orderPlaced) {
    return (
      <div className="min-h-screen bg-slate-950 flex flex-col justify-center items-center p-4">
        <div className="max-w-md w-full bg-slate-900 border border-slate-800 rounded-3xl p-6 sm:p-8 text-center space-y-4 shadow-2xl animate-in">
          <div className="w-16 h-16 rounded-full bg-emerald-500/20 text-emerald-400 border border-emerald-500/40 flex items-center justify-center mx-auto">
            <CheckCircle2 className="w-8 h-8" />
          </div>
          <h2 className="text-2xl font-extrabold text-white">Festive Pre-Order Received!</h2>
          {placedOrderId && (
            <div className="p-3.5 rounded-2xl bg-slate-950 border border-amber-500/30 max-w-xs mx-auto">
              <span className="text-xs text-slate-400 block mb-1">Your Order Booking Reference:</span>
              <span className="font-mono text-xl font-extrabold text-amber-400 tracking-wider">
                {placedOrderId}
              </span>
            </div>
          )}
          <p className="text-xs sm:text-sm text-slate-300 leading-relaxed">
            Thank you, <strong>{customerName}</strong>! Your festive cracker booking has been registered. Our counter team will contact you via WhatsApp / Call at <strong className="text-amber-400">{customerPhone}</strong> to confirm the stock allocation and handover timing.
          </p>
          <div className="p-3.5 rounded-xl bg-slate-950 border border-slate-800 text-left text-xs text-slate-400 space-y-1">
            <p><strong>Counter Support:</strong> {BUSINESS_CONFIG.phone}</p>
            <p><strong>License:</strong> {BUSINESS_CONFIG.pesoLicense}</p>
          </div>
          <button
            onClick={() => router.push('/')}
            className="w-full py-3 rounded-xl bg-amber-500 text-slate-950 font-bold text-sm cursor-pointer shadow-md hover:bg-amber-400 transition"
          >
            Return to Catalogue
          </button>
        </div>
      </div>
    );
  }

  if (items.length === 0) {
    return (
      <div className="min-h-screen bg-slate-950 flex flex-col justify-center items-center p-4">
        <div className="max-w-md w-full text-center space-y-5 animate-in">
          <div className="w-20 h-20 rounded-3xl bg-slate-900 border border-slate-800 text-slate-500 flex items-center justify-center mx-auto">
            <ShoppingBag className="w-10 h-10" />
          </div>
          <div>
            <h2 className="text-2xl font-bold text-white mb-2">Your Festive Cart is Empty</h2>
            <p className="text-xs sm:text-sm text-slate-400">
              You haven&apos;t added any sparklers, flower pots, or aerial cakes to your selection yet.
            </p>
          </div>
          <button
            onClick={() => router.push('/')}
            className="px-6 py-3 rounded-xl bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-400 hover:to-amber-500 text-slate-950 font-bold text-sm transition shadow-lg shadow-amber-500/20 cursor-pointer"
          >
            Explore Catalogue & Rates
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col">
      {/* Top Header */}
      <header className="sticky top-0 z-40 border-b border-slate-800 bg-slate-950/90 backdrop-blur-md px-4 sm:px-6 py-3.5">
        <div className="max-w-6xl mx-auto flex items-center justify-between">
          <Link
            href="/"
            className="inline-flex items-center gap-2 text-xs sm:text-sm font-semibold text-slate-300 hover:text-amber-400 transition-colors"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>Back to Catalogue</span>
          </Link>

          <div className="flex items-center gap-2">
            <div className="w-7 h-7 rounded-lg bg-amber-500 flex items-center justify-center text-slate-950 font-bold">
              <Sparkles className="w-4 h-4" />
            </div>
            <span className="font-bold text-white text-sm hidden xs:inline">{BUSINESS_CONFIG.name}</span>
          </div>
        </div>
      </header>

      {/* Main Checkout Area */}
      <main className="flex-1 max-w-6xl w-full mx-auto p-4 sm:p-6 lg:p-8 space-y-6">
        <div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-white">Festive Pre-Order Checkout</h1>
          <p className="text-xs sm:text-sm text-slate-400 mt-1">
            Review your selected fireworks and provide your contact information for seasonal allocation.
          </p>
        </div>

        {error && (
          <div className="p-3.5 rounded-xl bg-rose-950/40 border border-rose-500/30 text-rose-300 text-xs flex items-center gap-2">
            <AlertCircle className="w-4 h-4 shrink-0 text-rose-400" />
            <span>{error}</span>
          </div>
        )}

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 sm:gap-8 items-start">
          {/* Left Column: Cart items */}
          <div className="lg:col-span-2 space-y-4">
            <div className="bg-slate-900 border border-slate-800 rounded-2xl p-4 sm:p-6 shadow-xl">
              <div className="flex items-center justify-between pb-3 border-b border-slate-800 mb-4">
                <h2 className="text-sm sm:text-base font-bold text-white flex items-center gap-2">
                  <ShoppingBag className="w-4 h-4 text-amber-400" />
                  <span>Selected Fireworks ({totalItemsCount} boxes)</span>
                </h2>
                <button
                  onClick={clearCart}
                  className="text-xs text-rose-400 hover:text-rose-300 hover:underline cursor-pointer"
                >
                  Clear All
                </button>
              </div>

              <div className="divide-y divide-slate-800/80">
                {items.map((it) => {
                  const p = it.product;
                  const isExternal = p.imageUrl && p.imageUrl.startsWith('http');
                  const src = isExternal ? p.imageUrl : p.imageUrl ? `/images/${p.imageUrl}` : '';

                  return (
                    <div
                      key={p.id}
                      className="py-4 first:pt-0 last:pb-0 flex flex-col xs:flex-row items-start xs:items-center justify-between gap-3 sm:gap-4"
                    >
                      <div className="flex items-center gap-3 w-full xs:w-auto">
                        <div className="relative w-14 h-14 rounded-xl bg-slate-950 border border-slate-800 overflow-hidden shrink-0">
                          {src ? (
                            <Image src={src} alt={p.name} fill className="object-cover" />
                          ) : (
                            <div className="w-full h-full flex items-center justify-center text-[10px] text-slate-500">
                              Preview
                            </div>
                          )}
                        </div>
                        <div className="min-w-0 flex-1">
                          <span className="font-bold text-white text-xs sm:text-sm block line-clamp-1">
                            {p.name}
                          </span>
                          <span className="text-[11px] text-amber-400 font-semibold block">
                            ₹{p.retailPrice.toLocaleString('en-IN')} / box
                          </span>
                          <span className="text-[10px] text-slate-400 block">
                            {p.piecesPerPack} Pcs • {p.soundLevel}
                          </span>
                        </div>
                      </div>

                      {/* Quantity & Actions */}
                      <div className="flex items-center justify-between xs:justify-end gap-3 w-full xs:w-auto pt-2 xs:pt-0 border-t xs:border-t-0 border-slate-800/60">
                        {/* Adjuster */}
                        <div className="flex items-center gap-1.5 bg-slate-950 border border-slate-800 rounded-xl p-1">
                          <button
                            type="button"
                            onClick={() => updateQuantity(p.id, it.quantity - 1)}
                            className="w-7 h-7 rounded-lg bg-slate-900 hover:bg-slate-800 flex items-center justify-center text-slate-300 hover:text-white cursor-pointer"
                            aria-label="Decrease quantity"
                          >
                            <Minus className="w-3 h-3" />
                          </button>
                          <span className="w-7 text-center font-bold text-xs text-white">
                            {it.quantity}
                          </span>
                          <button
                            type="button"
                            onClick={() => updateQuantity(p.id, it.quantity + 1)}
                            className="w-7 h-7 rounded-lg bg-slate-900 hover:bg-slate-800 flex items-center justify-center text-slate-300 hover:text-white cursor-pointer"
                            aria-label="Increase quantity"
                          >
                            <Plus className="w-3 h-3" />
                          </button>
                        </div>

                        {/* Line Total */}
                        <div className="text-right min-w-[70px]">
                          <span className="font-extrabold text-amber-400 text-sm block">
                            ₹{(p.retailPrice * it.quantity).toLocaleString('en-IN')}
                          </span>
                        </div>

                        {/* Remove */}
                        <button
                          type="button"
                          onClick={() => removeItem(p.id)}
                          className="p-1.5 text-slate-500 hover:text-rose-400 transition cursor-pointer"
                          title="Remove item"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Compliance notice */}
            <div className="p-3.5 sm:p-4 rounded-2xl bg-amber-950/20 border border-amber-500/20 text-amber-200/90 text-xs flex items-start gap-2.5">
              <ShieldCheck className="w-4 h-4 text-amber-400 shrink-0 mt-0.5" />
              <p className="leading-relaxed">
                <strong>Statutory Notice:</strong> No payment is charged right now online. This reservation locks your festive rates and allocates stock from our licensed retail counter.
              </p>
            </div>
          </div>

          {/* Right Column: Customer details & Order Summary */}
          <div className="space-y-4">
            <div className="bg-slate-900 border border-slate-800 rounded-2xl p-4 sm:p-6 shadow-xl">
              <h2 className="text-sm sm:text-base font-bold text-white mb-4">
                Booking Details & Summary
              </h2>

              <form onSubmit={handlePlaceOrder} className="space-y-3.5">
                <div>
                  <label className="text-xs font-semibold text-slate-300 mb-1 flex items-center gap-1.5">
                    <User className="w-3.5 h-3.5 text-amber-400" />
                    <span>Full Name *</span>
                  </label>
                  <input
                    type="text"
                    required
                    value={customerName}
                    onChange={(e) => setCustomerName(e.target.value)}
                    placeholder="Enter your name"
                    className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3.5 py-2 text-xs text-white focus:outline-none focus:border-amber-500"
                  />
                </div>

                <div>
                  <label className="text-xs font-semibold text-slate-300 mb-1 flex items-center gap-1.5">
                    <Phone className="w-3.5 h-3.5 text-emerald-400" />
                    <span>WhatsApp / Mobile Number *</span>
                  </label>
                  <input
                    type="tel"
                    required
                    value={customerPhone}
                    onChange={(e) => setCustomerPhone(e.target.value)}
                    placeholder="10-digit mobile number"
                    className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3.5 py-2 text-xs text-white focus:outline-none focus:border-amber-500"
                  />
                </div>

                <div>
                  <label className="text-xs font-semibold text-slate-300 mb-1 flex items-center gap-1.5">
                    <Mail className="w-3.5 h-3.5 text-sky-400" />
                    <span>Email (Optional)</span>
                  </label>
                  <input
                    type="email"
                    value={customerEmail}
                    onChange={(e) => setCustomerEmail(e.target.value)}
                    placeholder="name@example.com"
                    className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3.5 py-2 text-xs text-white focus:outline-none focus:border-amber-500"
                  />
                </div>

                <div>
                  <label className="text-xs font-semibold text-slate-300 mb-1 flex items-center gap-1.5">
                    <Calendar className="w-3.5 h-3.5 text-amber-400" />
                    <span>Target Festival Date</span>
                  </label>
                  <input
                    type="date"
                    required
                    min="2026-10-01"
                    value={festivalDate}
                    onChange={(e) => setFestivalDate(e.target.value)}
                    className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3.5 py-2 text-xs text-white focus:outline-none focus:border-amber-500"
                  />
                </div>

                <div>
                  <label className="text-xs font-semibold text-slate-300 mb-1 block">
                    Special Notes / Handover Preference
                  </label>
                  <textarea
                    rows={2}
                    value={pickupNote}
                    onChange={(e) => setPickupNote(e.target.value)}
                    placeholder="e.g. Please pack in festive family gift bags."
                    className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3.5 py-2 text-xs text-white focus:outline-none focus:border-amber-500 resize-none"
                  />
                </div>

                {/* Price Breakdown */}
                <div className="pt-3 border-t border-slate-800 space-y-2 text-xs">
                  <div className="flex justify-between text-slate-400">
                    <span>Total Boxes</span>
                    <span>{totalItemsCount}</span>
                  </div>
                  <div className="flex justify-between text-slate-400">
                    <span>Applicable Taxes</span>
                    <span className="text-emerald-400">Included</span>
                  </div>
                  <div className="flex justify-between text-base font-extrabold text-white pt-2 border-t border-slate-800">
                    <span>Total Retail Value</span>
                    <span className="text-amber-400">₹{total.toLocaleString('en-IN')}</span>
                  </div>
                </div>

                <button
                  type="submit"
                  disabled={loading}
                  className="w-full mt-2 py-3 rounded-xl bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-400 hover:to-amber-500 text-slate-950 font-bold text-xs sm:text-sm shadow-lg shadow-amber-500/20 transition cursor-pointer flex items-center justify-center gap-2 disabled:opacity-50"
                >
                  {loading ? (
                    <>
                      <Loader2 className="w-4 h-4 animate-spin" />
                      <span>Confirming Festive Pre-Order...</span>
                    </>
                  ) : (
                    <span>Confirm Booking & Pre-Order</span>
                  )}
                </button>
              </form>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}

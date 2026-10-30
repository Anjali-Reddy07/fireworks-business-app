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
      <div className="min-h-screen bg-slate-50 flex flex-col justify-center items-center p-4">
        <div className="max-w-md w-full bg-white border border-blue-200 rounded-3xl p-6 sm:p-8 text-center space-y-4 shadow-xl animate-in">
          <div className="w-16 h-16 rounded-full bg-emerald-50 text-emerald-600 border border-emerald-200 flex items-center justify-center mx-auto">
            <CheckCircle2 className="w-8 h-8" />
          </div>
          <h2 className="text-2xl font-black text-slate-900">Festive Pre-Order Received!</h2>
          {placedOrderId && (
            <div className="p-3.5 rounded-2xl bg-blue-50 border border-blue-200 max-w-xs mx-auto">
              <span className="text-xs text-slate-500 block mb-1">Your Order Booking Reference:</span>
              <span className="font-mono text-xl font-black text-blue-700 tracking-wider">
                {placedOrderId}
              </span>
            </div>
          )}
          <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">
            Thank you, <strong>{customerName}</strong>! Your festive cracker booking has been registered. Our counter team will contact you via WhatsApp / Call at <strong className="text-blue-700">{customerPhone}</strong> to confirm the stock allocation and handover timing.
          </p>
          <div className="p-3.5 rounded-2xl bg-slate-50 border border-slate-200 text-left text-xs text-slate-600 space-y-1">
            <p><strong>Counter Support:</strong> {BUSINESS_CONFIG.phone}</p>
            <p><strong>License:</strong> {BUSINESS_CONFIG.pesoLicense}</p>
          </div>
          <button
            onClick={() => router.push('/')}
            className="w-full py-3 rounded-xl bg-blue-600 text-white font-bold text-sm cursor-pointer shadow-md hover:bg-blue-700 transition"
          >
            Return to Catalogue
          </button>
        </div>
      </div>
    );
  }

  if (items.length === 0) {
    return (
      <div className="min-h-screen bg-slate-50 flex flex-col justify-center items-center p-4">
        <div className="max-w-md w-full text-center space-y-5 animate-in">
          <div className="w-20 h-20 rounded-3xl bg-white border border-slate-200 text-slate-400 flex items-center justify-center mx-auto shadow-sm">
            <ShoppingBag className="w-10 h-10" />
          </div>
          <div>
            <h2 className="text-2xl font-black text-slate-900 mb-2">Your Festive Cart is Empty</h2>
            <p className="text-xs sm:text-sm text-slate-500">
              You haven&apos;t added any sparklers, flower pots, or aerial cakes to your selection yet.
            </p>
          </div>
          <button
            onClick={() => router.push('/')}
            className="px-6 py-3 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-bold text-sm transition shadow-lg shadow-blue-500/20 cursor-pointer"
          >
            Explore Catalogue & Rates
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900 flex flex-col">
      {/* Top Header */}
      <header className="sticky top-0 z-40 border-b border-blue-100 bg-white/95 backdrop-blur-md px-4 sm:px-6 py-3.5 shadow-xs">
        <div className="max-w-6xl mx-auto flex items-center justify-between">
          <Link
            href="/"
            className="inline-flex items-center gap-2 text-xs sm:text-sm font-bold text-slate-600 hover:text-blue-600 transition-colors"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>Back to Catalogue</span>
          </Link>

          <div className="flex items-center gap-2">
            <div className="w-7 h-7 rounded-lg bg-blue-600 flex items-center justify-center text-white font-bold">
              <Sparkles className="w-4 h-4" />
            </div>
            <span className="font-black text-slate-900 text-sm hidden xs:inline">{BUSINESS_CONFIG.name}</span>
          </div>
        </div>
      </header>

      {/* Main Checkout Area */}
      <main className="flex-1 max-w-6xl w-full mx-auto p-4 sm:p-6 lg:p-8 space-y-6">
        <div>
          <h1 className="text-2xl sm:text-3xl font-black text-slate-900">Festive Pre-Order Checkout</h1>
          <p className="text-xs sm:text-sm text-slate-500 mt-1">
            Review your selected fireworks and provide your contact information for seasonal allocation.
          </p>
        </div>

        {error && (
          <div className="p-3.5 rounded-xl bg-rose-50 border border-rose-200 text-rose-700 text-xs flex items-center gap-2">
            <AlertCircle className="w-4 h-4 shrink-0 text-rose-600" />
            <span>{error}</span>
          </div>
        )}

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 sm:gap-8 items-start">
          {/* Left Column: Cart items */}
          <div className="lg:col-span-2 space-y-4">
            <div className="bg-white border border-slate-200 rounded-3xl p-4 sm:p-6 shadow-sm">
              <div className="flex items-center justify-between pb-3 border-b border-slate-100 mb-4">
                <h2 className="text-sm sm:text-base font-bold text-slate-900 flex items-center gap-2">
                  <ShoppingBag className="w-4 h-4 text-blue-600" />
                  <span>Selected Fireworks ({totalItemsCount} boxes)</span>
                </h2>
                <button
                  onClick={clearCart}
                  className="text-xs text-rose-600 hover:text-rose-700 font-bold hover:underline cursor-pointer"
                >
                  Clear All
                </button>
              </div>

              <div className="divide-y divide-slate-100">
                {items.map((it) => {
                  const p = it.product;
                  const isExternal = p.imageUrl && p.imageUrl.startsWith('http');
                  const isAbsoluteLocal = p.imageUrl && p.imageUrl.startsWith('/');
                  const src = isExternal || isAbsoluteLocal ? p.imageUrl : p.imageUrl ? `/images/${p.imageUrl}` : '';

                  return (
                    <div
                      key={p.id}
                      className="py-4 first:pt-0 last:pb-0 flex flex-col xs:flex-row items-start xs:items-center justify-between gap-3 sm:gap-4"
                    >
                      <div className="flex items-center gap-3 w-full xs:w-auto">
                        <div className="relative w-14 h-14 rounded-xl bg-slate-100 border border-slate-200 overflow-hidden shrink-0">
                          {src ? (
                            <Image src={src} alt={p.name} fill className="object-cover" />
                          ) : (
                            <div className="w-full h-full flex items-center justify-center text-[10px] text-slate-400">
                              Preview
                            </div>
                          )}
                        </div>
                        <div className="min-w-0 flex-1">
                          <span className="font-bold text-slate-900 text-xs sm:text-sm block line-clamp-1">
                            {p.name}
                          </span>
                          <span className="text-[11px] text-blue-600 font-bold block">
                            ₹{p.retailPrice.toLocaleString('en-IN')} / box
                          </span>
                          <span className="text-[10px] text-slate-500 block">
                            {p.piecesPerPack} Pcs • {p.soundLevel}
                          </span>
                        </div>
                      </div>

                      {/* Quantity & Actions */}
                      <div className="flex items-center justify-between xs:justify-end gap-3 w-full xs:w-auto pt-2 xs:pt-0 border-t xs:border-t-0 border-slate-100">
                        {/* Adjuster */}
                        <div className="flex items-center gap-1.5 bg-slate-50 border border-slate-200 rounded-xl p-1">
                          <button
                            type="button"
                            onClick={() => updateQuantity(p.id, it.quantity - 1)}
                            className="w-7 h-7 rounded-lg bg-white hover:bg-slate-100 flex items-center justify-center text-slate-700 cursor-pointer shadow-xs"
                            aria-label="Decrease quantity"
                          >
                            <Minus className="w-3 h-3" />
                          </button>
                          <span className="w-7 text-center font-bold text-xs text-slate-900">
                            {it.quantity}
                          </span>
                          <button
                            type="button"
                            onClick={() => updateQuantity(p.id, it.quantity + 1)}
                            className="w-7 h-7 rounded-lg bg-white hover:bg-slate-100 flex items-center justify-center text-slate-700 cursor-pointer shadow-xs"
                            aria-label="Increase quantity"
                          >
                            <Plus className="w-3 h-3" />
                          </button>
                        </div>

                        {/* Line Total */}
                        <div className="text-right min-w-[70px]">
                          <span className="font-black text-blue-600 text-sm block">
                            ₹{(p.retailPrice * it.quantity).toLocaleString('en-IN')}
                          </span>
                        </div>

                        {/* Remove */}
                        <button
                          type="button"
                          onClick={() => removeItem(p.id)}
                          className="p-1.5 text-slate-400 hover:text-rose-600 transition cursor-pointer"
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
            <div className="p-4 rounded-2xl bg-blue-50 border border-blue-200 text-blue-900 text-xs flex items-start gap-2.5">
              <ShieldCheck className="w-4 h-4 text-blue-600 shrink-0 mt-0.5" />
              <p className="leading-relaxed">
                <strong>Statutory Notice:</strong> No payment is charged right now online. This reservation locks your festive rates and allocates stock from our licensed retail counter.
              </p>
            </div>
          </div>

          {/* Right Column: Customer details & Order Summary */}
          <div className="space-y-4">
            <div className="bg-white border border-slate-200 rounded-3xl p-5 sm:p-6 shadow-sm">
              <h2 className="text-sm sm:text-base font-bold text-slate-900 mb-4">
                Booking Details & Summary
              </h2>

              <form onSubmit={handlePlaceOrder} className="space-y-3.5">
                <div>
                  <label className="text-xs font-bold text-slate-700 mb-1 flex items-center gap-1.5">
                    <User className="w-3.5 h-3.5 text-blue-600" />
                    <span>Full Name *</span>
                  </label>
                  <input
                    type="text"
                    required
                    value={customerName}
                    onChange={(e) => setCustomerName(e.target.value)}
                    placeholder="Enter your name"
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3.5 py-2.5 text-xs text-slate-900 focus:outline-none focus:border-blue-500 focus:bg-white"
                  />
                </div>

                <div>
                  <label className="text-xs font-bold text-slate-700 mb-1 flex items-center gap-1.5">
                    <Phone className="w-3.5 h-3.5 text-emerald-600" />
                    <span>WhatsApp / Mobile Number *</span>
                  </label>
                  <input
                    type="tel"
                    required
                    value={customerPhone}
                    onChange={(e) => setCustomerPhone(e.target.value)}
                    placeholder="10-digit mobile number"
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3.5 py-2.5 text-xs text-slate-900 focus:outline-none focus:border-blue-500 focus:bg-white font-mono"
                  />
                </div>

                <div>
                  <label className="text-xs font-bold text-slate-700 mb-1 flex items-center gap-1.5">
                    <Mail className="w-3.5 h-3.5 text-blue-500" />
                    <span>Email (Optional)</span>
                  </label>
                  <input
                    type="email"
                    value={customerEmail}
                    onChange={(e) => setCustomerEmail(e.target.value)}
                    placeholder="name@example.com"
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3.5 py-2.5 text-xs text-slate-900 focus:outline-none focus:border-blue-500 focus:bg-white"
                  />
                </div>

                <div>
                  <label className="text-xs font-bold text-slate-700 mb-1 flex items-center gap-1.5">
                    <Calendar className="w-3.5 h-3.5 text-blue-600" />
                    <span>Target Festival Date</span>
                  </label>
                  <input
                    type="date"
                    required
                    min="2026-10-01"
                    value={festivalDate}
                    onChange={(e) => setFestivalDate(e.target.value)}
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3.5 py-2.5 text-xs text-slate-900 focus:outline-none focus:border-blue-500 focus:bg-white"
                  />
                </div>

                <div>
                  <label className="text-xs font-bold text-slate-700 mb-1 block">
                    Special Notes / Handover Preference
                  </label>
                  <textarea
                    rows={2}
                    value={pickupNote}
                    onChange={(e) => setPickupNote(e.target.value)}
                    placeholder="e.g. Please pack in festive family gift bags."
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3.5 py-2 text-xs text-slate-900 focus:outline-none focus:border-blue-500 focus:bg-white resize-none"
                  />
                </div>

                {/* Price Breakdown */}
                <div className="pt-3 border-t border-slate-100 space-y-2 text-xs">
                  <div className="flex justify-between text-slate-600">
                    <span>Total Boxes</span>
                    <span className="font-bold">{totalItemsCount}</span>
                  </div>
                  <div className="flex justify-between text-slate-600">
                    <span>Applicable Taxes</span>
                    <span className="text-emerald-700 font-bold">Included</span>
                  </div>
                  <div className="flex justify-between text-base font-black text-slate-900 pt-2 border-t border-slate-100">
                    <span>Total Retail Value</span>
                    <span className="text-blue-600 font-mono">₹{total.toLocaleString('en-IN')}</span>
                  </div>
                </div>

                <button
                  type="submit"
                  disabled={loading}
                  className="w-full mt-2 py-3 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs sm:text-sm shadow-md shadow-blue-500/25 transition cursor-pointer flex items-center justify-center gap-2 disabled:opacity-50"
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

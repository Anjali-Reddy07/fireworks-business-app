'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { Sparkles, Phone, ShieldCheck, Menu, X, Lock, Calendar, UserCircle, ShoppingCart } from 'lucide-react';
import { BUSINESS_CONFIG } from '@/lib/data/sample-products';
import { useCart } from '@/components/cart/CartContext';

interface NavbarProps {
  onOpenInquiry?: () => void;
}

export function Navbar({ onOpenInquiry }: NavbarProps) {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const { items } = useCart();
  const cartItemCount = items.reduce((sum, it) => sum + it.quantity, 0);

  // Close menu on resize to desktop
  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth >= 768) {
        setMobileMenuOpen(false);
      }
    };
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  // Prevent background scroll when mobile menu is open
  useEffect(() => {
    if (mobileMenuOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
    return () => {
      document.body.style.overflow = '';
    };
  }, [mobileMenuOpen]);

  return (
    <header className="sticky top-0 z-40 w-full border-b border-amber-500/20 bg-slate-950/90 backdrop-blur-md">
      {/* Top seasonal statutory mini banner */}
      <div className="bg-gradient-to-r from-amber-950/80 via-slate-900 to-amber-950/80 border-b border-amber-500/10 px-3 py-1.5 text-[11px] sm:text-xs text-amber-200/90 text-center flex items-center justify-center gap-1.5 sm:gap-2 leading-tight">
        <ShieldCheck className="w-3.5 h-3.5 text-amber-400 shrink-0" />
        <span className="truncate sm:overflow-visible">
          <strong>Seasonal Festive Business</strong>: {BUSINESS_CONFIG.pesoLicense}
          <span className="hidden sm:inline"> | 100% CSIR-NEERI Certified Green Crackers</span>
        </span>
      </div>

      <div className="max-w-7xl mx-auto px-3 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16 sm:h-20">
          {/* Logo & Brand Name */}
          <Link href="/" className="flex items-center gap-2.5 sm:gap-3 group shrink-0 min-w-0 max-w-[65%] sm:max-w-none">
            <div className="w-9 h-9 sm:w-11 sm:h-11 rounded-xl bg-gradient-to-br from-amber-500 to-red-600 flex items-center justify-center shadow-lg shadow-amber-500/20 group-hover:scale-105 transition-transform shrink-0">
              <Sparkles className="w-5 h-5 sm:w-6 sm:h-6 text-slate-950" />
            </div>
            <div className="min-w-0">
              <span className="text-base sm:text-lg lg:text-xl font-bold tracking-tight text-white block group-hover:text-amber-400 transition-colors truncate">
                {BUSINESS_CONFIG.name}
              </span>
              <span className="text-[10px] sm:text-xs text-amber-300/80 tracking-wide hidden xs:block truncate">
                Seasonal Festive Showcase & Price Guide
              </span>
            </div>
          </Link>

          {/* Desktop Navigation Links */}
          <nav className="hidden lg:flex items-center gap-6 xl:gap-8">
            <Link
              href="#catalogue"
              className="text-sm font-medium text-slate-300 hover:text-amber-400 transition-colors"
            >
              Catalogue & Rates
            </Link>
            <Link
              href="#safety"
              className="text-sm font-medium text-slate-300 hover:text-amber-400 transition-colors"
            >
              Green Safety Guide
            </Link>
            <Link
              href="#seasonal-outlet"
              className="text-sm font-medium text-slate-300 hover:text-amber-400 transition-colors"
            >
              Festive Dates & Contact
            </Link>
            <Link
              href="/login"
              className="inline-flex items-center gap-1.5 text-xs font-medium text-slate-300 hover:text-white bg-slate-900/80 px-3 py-1.5 rounded-lg border border-slate-800 hover:border-amber-500/50 transition-colors"
            >
              <UserCircle className="w-3.5 h-3.5 text-amber-400" />
              <span>Sign In</span>
            </Link>
            <Link
              href="/admin"
              className="inline-flex items-center gap-1.5 text-xs font-medium text-slate-400 hover:text-white bg-slate-900/80 px-3 py-1.5 rounded-lg border border-slate-800 hover:border-slate-700 transition-colors"
            >
              <Lock className="w-3 h-3 text-amber-400" />
              <span>Admin</span>
            </Link>
          </nav>

          {/* Right Action CTAs */}
          <div className="flex items-center gap-2 sm:gap-3">
            {/* Cart Icon Button (Visible on all devices) */}
            <Link
              href="/checkout"
              className="relative p-2 sm:px-3 sm:py-2 rounded-xl bg-slate-900 border border-slate-800 hover:border-amber-500/50 text-slate-300 hover:text-white transition-colors flex items-center gap-1.5"
              aria-label={`Shopping Cart with ${cartItemCount} items`}
            >
              <ShoppingCart className="w-4 h-4 text-amber-400" />
              <span className="hidden sm:inline text-xs font-semibold">Cart</span>
              {cartItemCount > 0 && (
                <span className="min-w-5 h-5 px-1 rounded-full bg-amber-500 text-slate-950 font-bold text-[10px] flex items-center justify-center animate-in">
                  {cartItemCount}
                </span>
              )}
            </Link>

            {/* Desktop Phone Link */}
            <a
              href={`tel:${BUSINESS_CONFIG.phone.replace(/\s+/g, '')}`}
              className="hidden xl:flex items-center gap-2 text-xs text-slate-300 hover:text-white px-3 py-2 rounded-xl bg-slate-900/60 border border-slate-800"
            >
              <Phone className="w-3.5 h-3.5 text-emerald-400" />
              <span className="font-semibold">{BUSINESS_CONFIG.phone}</span>
            </a>

            {/* Desktop Festive Pre-Booking CTA */}
            {onOpenInquiry && (
              <button
                onClick={onOpenInquiry}
                className="hidden sm:inline-flex items-center gap-2 bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-400 hover:to-amber-500 text-slate-950 font-bold px-4 lg:px-5 py-2 sm:py-2.5 rounded-xl shadow-md shadow-amber-500/20 hover:shadow-amber-500/40 text-xs sm:text-sm transition-all cursor-pointer"
              >
                <Calendar className="w-4 h-4" />
                <span>Pre-Book & Quote</span>
              </button>
            )}

            {/* Mobile menu trigger */}
            <div className="lg:hidden flex items-center">
              <button
                onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                className="p-2 rounded-lg text-slate-400 hover:text-white bg-slate-900 border border-slate-800 focus:outline-none cursor-pointer"
                aria-label="Toggle Navigation"
              >
                {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Mobile Drawer & Backdrop */}
      {mobileMenuOpen && (
        <>
          <div
            className="fixed inset-0 top-[100px] bg-slate-950/80 backdrop-blur-sm z-30 lg:hidden"
            onClick={() => setMobileMenuOpen(false)}
          />
          <div className="lg:hidden relative z-40 border-b border-slate-800 bg-slate-950 px-4 pt-4 pb-6 space-y-3 shadow-2xl animate-in">
            <Link
              href="#catalogue"
              onClick={() => setMobileMenuOpen(false)}
              className="flex items-center justify-between py-2.5 px-3 rounded-lg text-sm font-semibold text-slate-200 hover:bg-slate-900 hover:text-amber-400 transition-colors"
            >
              <span>Product Catalogue & Rates</span>
              <span className="text-xs text-amber-400 font-normal">Explore &rarr;</span>
            </Link>

            <Link
              href="#safety"
              onClick={() => setMobileMenuOpen(false)}
              className="flex items-center justify-between py-2.5 px-3 rounded-lg text-sm font-semibold text-slate-200 hover:bg-slate-900 hover:text-amber-400 transition-colors"
            >
              <span>Safety & Green Crackers Guide</span>
              <span className="text-xs text-emerald-400 font-normal">NEERI &rarr;</span>
            </Link>

            <Link
              href="#seasonal-outlet"
              onClick={() => setMobileMenuOpen(false)}
              className="flex items-center justify-between py-2.5 px-3 rounded-lg text-sm font-semibold text-slate-200 hover:bg-slate-900 hover:text-amber-400 transition-colors"
            >
              <span>Festive Counter & Location</span>
              <span className="text-xs text-sky-400 font-normal">Contact &rarr;</span>
            </Link>

            <Link
              href="/checkout"
              onClick={() => setMobileMenuOpen(false)}
              className="flex items-center justify-between py-2.5 px-3 rounded-lg text-sm font-semibold text-slate-200 hover:bg-slate-900 hover:text-amber-400 transition-colors"
            >
              <div className="flex items-center gap-2">
                <ShoppingCart className="w-4 h-4 text-amber-400" />
                <span>My Festive Cart</span>
              </div>
              {cartItemCount > 0 ? (
                <span className="px-2 py-0.5 rounded-full bg-amber-500 text-slate-950 font-bold text-xs">
                  {cartItemCount} items
                </span>
              ) : (
                <span className="text-xs text-slate-500">Empty</span>
              )}
            </Link>

            <div className="pt-2 border-t border-slate-800 grid grid-cols-2 gap-2">
              <Link
                href="/login"
                onClick={() => setMobileMenuOpen(false)}
                className="flex items-center justify-center gap-1.5 py-2.5 rounded-lg text-xs font-semibold bg-slate-900 border border-slate-800 text-amber-300 hover:text-white"
              >
                <UserCircle className="w-3.5 h-3.5" />
                <span>Sign In</span>
              </Link>

              <Link
                href="/admin"
                onClick={() => setMobileMenuOpen(false)}
                className="flex items-center justify-center gap-1.5 py-2.5 rounded-lg text-xs font-semibold bg-slate-900 border border-slate-800 text-slate-300 hover:text-white"
              >
                <Lock className="w-3 h-3 text-amber-400" />
                <span>Admin Portal</span>
              </Link>
            </div>

            <div className="pt-3 border-t border-slate-800 space-y-2">
              <a
                href={`tel:${BUSINESS_CONFIG.phone.replace(/\s+/g, '')}`}
                className="flex items-center justify-center gap-2 w-full py-2.5 text-xs font-semibold rounded-xl bg-slate-900 border border-slate-800 text-slate-200"
              >
                <Phone className="w-4 h-4 text-emerald-400" />
                <span>Call Counter: {BUSINESS_CONFIG.phone}</span>
              </a>

              {onOpenInquiry && (
                <button
                  onClick={() => {
                    setMobileMenuOpen(false);
                    onOpenInquiry();
                  }}
                  className="w-full py-3 text-center text-xs font-bold rounded-xl bg-gradient-to-r from-amber-500 to-amber-600 text-slate-950 shadow-md shadow-amber-500/20 cursor-pointer"
                >
                  Festive Quote & Pre-Book
                </button>
              )}
            </div>
          </div>
        </>
      )}
    </header>
  );
}

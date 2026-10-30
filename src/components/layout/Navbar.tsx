'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { 
  Sparkles, 
  Phone, 
  ShieldCheck, 
  Menu, 
  X, 
  Lock, 
  Calendar, 
  UserCircle, 
  ShoppingCart,
  CheckCircle2
} from 'lucide-react';
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
      if (window.innerWidth >= 1024) {
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
    <header className="sticky top-0 z-50 w-full bg-slate-950/95 backdrop-blur-xl border-b border-amber-500/15 shadow-2xl shadow-black/60">
      {/* Top seasonal statutory & trust banner */}
      <div className="bg-gradient-to-r from-slate-950 via-amber-950/40 to-slate-950 border-b border-amber-500/10 py-1.5 px-3">
        <div className="max-w-7xl mx-auto flex items-center justify-between text-[11px] sm:text-xs">
          <div className="flex items-center gap-2 overflow-hidden text-amber-200/90 mx-auto sm:mx-0">
            <span className="inline-flex items-center gap-1 bg-amber-500/10 border border-amber-500/30 text-amber-400 px-2 py-0.5 rounded-full text-[10px] font-semibold tracking-wide shrink-0">
              <ShieldCheck className="w-3 h-3 text-amber-400" />
              Licensed Outlet
            </span>
            <span className="font-mono text-amber-100/90 hidden md:inline">
              {BUSINESS_CONFIG.pesoLicense}
            </span>
            <span className="text-amber-500/40 hidden sm:inline">•</span>
            <span className="inline-flex items-center gap-1 text-emerald-400 font-medium">
              <CheckCircle2 className="w-3 h-3 text-emerald-400 shrink-0" />
              100% CSIR-NEERI Certified Green Crackers
            </span>
          </div>

          <div className="hidden lg:flex items-center gap-3 text-slate-400 text-[11px]">
            <span className="flex items-center gap-1.5 text-amber-300/80">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
              Festive Counters Active
            </span>
            <span className="text-slate-700">|</span>
            <span className="text-slate-400">Direct Sivakasi Pricing</span>
          </div>
        </div>
      </div>

      {/* Main Navbar */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-18 sm:h-20 gap-4">
          
          {/* Logo & Brand Identity */}
          <Link href="/" className="flex items-center gap-3 group shrink-0 select-none">
            <div className="relative">
              <div className="w-10 h-10 sm:w-11 sm:h-11 rounded-xl bg-gradient-to-tr from-amber-500 via-orange-500 to-red-600 flex items-center justify-center shadow-lg shadow-amber-500/25 group-hover:shadow-amber-500/40 group-hover:scale-105 transition-all duration-300">
                <Sparkles className="w-5 h-5 sm:w-6 sm:h-6 text-slate-950" />
              </div>
              <div className="absolute -inset-0.5 rounded-xl bg-amber-400/30 blur-sm opacity-0 group-hover:opacity-100 transition-opacity -z-10" />
            </div>
            
            <div className="flex flex-col">
              <div className="flex items-center gap-1.5">
                <span className="text-base sm:text-lg lg:text-xl font-extrabold tracking-tight bg-gradient-to-r from-white via-slate-100 to-amber-200 bg-clip-text text-transparent group-hover:to-amber-400 transition-colors">
                  {BUSINESS_CONFIG.name}
                </span>
              </div>
              <span className="text-[10px] sm:text-[11px] font-medium text-amber-400/80 tracking-wider uppercase">
                Festive Assortment & Direct Rates
              </span>
            </div>
          </Link>

          {/* Desktop Navigation Links */}
          <nav className="hidden lg:flex items-center gap-1 bg-slate-900/60 p-1.5 rounded-2xl border border-slate-800/80 backdrop-blur-md">
            <Link
              href="#catalogue"
              className="px-3.5 py-1.5 rounded-xl text-xs font-semibold text-slate-300 hover:text-white hover:bg-slate-800/80 transition-all duration-200"
            >
              Catalogue & Rates
            </Link>
            <Link
              href="#safety"
              className="px-3.5 py-1.5 rounded-xl text-xs font-semibold text-slate-300 hover:text-white hover:bg-slate-800/80 transition-all duration-200"
            >
              Green Safety Guide
            </Link>
            <Link
              href="#seasonal-outlet"
              className="px-3.5 py-1.5 rounded-xl text-xs font-semibold text-slate-300 hover:text-white hover:bg-slate-800/80 transition-all duration-200"
            >
              Outlet & Dates
            </Link>
          </nav>

          {/* Right Action Controls */}
          <div className="flex items-center gap-2 sm:gap-2.5 shrink-0">
            {/* Sign in & Admin buttons (Desktop) */}
            <div className="hidden xl:flex items-center gap-1.5 pr-1 border-r border-slate-800">
              <Link
                href="/login"
                className="inline-flex items-center gap-1.5 text-xs font-medium text-slate-400 hover:text-amber-300 hover:bg-slate-900/80 px-2.5 py-1.5 rounded-lg transition-colors"
                title="Customer Login"
              >
                <UserCircle className="w-3.5 h-3.5 text-amber-400" />
                <span>Sign In</span>
              </Link>
              <Link
                href="/admin/login"
                className="inline-flex items-center gap-1 text-[11px] font-medium text-slate-500 hover:text-slate-300 hover:bg-slate-900/80 px-2 py-1.5 rounded-lg transition-colors"
                title="Admin Control Panel"
              >
                <Lock className="w-3 h-3 text-slate-400" />
                <span>Admin</span>
              </Link>
            </div>

            {/* Shopping Cart Button */}
            <Link
              href="/checkout"
              className="relative flex items-center gap-2 px-3 py-2 rounded-xl bg-slate-900/90 hover:bg-slate-800 border border-slate-800 hover:border-amber-500/40 text-slate-200 hover:text-white transition-all shadow-sm group"
              aria-label={`Cart with ${cartItemCount} items`}
            >
              <ShoppingCart className="w-4 h-4 text-amber-400 group-hover:scale-110 transition-transform" />
              <span className="hidden sm:inline text-xs font-semibold">Cart</span>
              {cartItemCount > 0 ? (
                <span className="min-w-5 h-5 px-1.5 rounded-full bg-gradient-to-r from-amber-500 to-orange-500 text-slate-950 font-black text-[10px] flex items-center justify-center shadow-sm shadow-amber-500/50 animate-pulse">
                  {cartItemCount}
                </span>
              ) : (
                <span className="hidden sm:inline text-[10px] text-slate-500 font-medium">0</span>
              )}
            </Link>

            {/* Direct Phone Call Button */}
            <a
              href={`tel:${BUSINESS_CONFIG.phone.replace(/\s+/g, '')}`}
              className="hidden md:flex items-center gap-2 text-xs font-semibold text-emerald-300 hover:text-emerald-200 px-3 py-2 rounded-xl bg-emerald-950/40 hover:bg-emerald-900/40 border border-emerald-500/25 transition-all shadow-sm"
              title="Call Counter Hotline"
            >
              <Phone className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
              <span>{BUSINESS_CONFIG.phone}</span>
            </a>

            {/* Primary Action Button: Pre-Book / Get Quote */}
            {onOpenInquiry && (
              <button
                onClick={onOpenInquiry}
                className="inline-flex items-center gap-2 bg-gradient-to-r from-amber-500 via-orange-500 to-amber-600 hover:from-amber-400 hover:to-orange-400 text-slate-950 font-bold px-3.5 sm:px-4 lg:px-5 py-2 sm:py-2.5 rounded-xl shadow-lg shadow-amber-500/20 hover:shadow-amber-500/35 hover:scale-[1.02] active:scale-[0.98] text-xs sm:text-sm transition-all cursor-pointer shrink-0"
              >
                <Calendar className="w-4 h-4 text-slate-950" />
                <span className="whitespace-nowrap">Pre-Book & Quote</span>
              </button>
            )}

            {/* Mobile Hamburger Button */}
            <div className="lg:hidden flex items-center">
              <button
                onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                className="p-2 rounded-xl text-slate-400 hover:text-white bg-slate-900 border border-slate-800 hover:border-slate-700 transition-colors focus:outline-none cursor-pointer"
                aria-label="Toggle navigation"
              >
                {mobileMenuOpen ? <X className="w-5 h-5 text-amber-400" /> : <Menu className="w-5 h-5" />}
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Mobile Drawer */}
      {mobileMenuOpen && (
        <>
          <div
            className="fixed inset-0 top-[90px] bg-slate-950/80 backdrop-blur-md z-40 lg:hidden"
            onClick={() => setMobileMenuOpen(false)}
          />
          <div className="lg:hidden relative z-50 border-b border-amber-500/20 bg-slate-950/98 px-4 pt-4 pb-6 space-y-3 shadow-2xl animate-in">
            <div className="space-y-1">
              <Link
                href="#catalogue"
                onClick={() => setMobileMenuOpen(false)}
                className="flex items-center justify-between py-2.5 px-3.5 rounded-xl text-sm font-semibold text-slate-200 hover:bg-slate-900 hover:text-amber-400 transition-colors"
              >
                <span>Product Catalogue & Rates</span>
                <span className="text-xs text-amber-400 font-medium">Explore &rarr;</span>
              </Link>

              <Link
                href="#safety"
                onClick={() => setMobileMenuOpen(false)}
                className="flex items-center justify-between py-2.5 px-3.5 rounded-xl text-sm font-semibold text-slate-200 hover:bg-slate-900 hover:text-amber-400 transition-colors"
              >
                <span>Safety & Green Crackers Guide</span>
                <span className="text-xs text-emerald-400 font-medium">NEERI &rarr;</span>
              </Link>

              <Link
                href="#seasonal-outlet"
                onClick={() => setMobileMenuOpen(false)}
                className="flex items-center justify-between py-2.5 px-3.5 rounded-xl text-sm font-semibold text-slate-200 hover:bg-slate-900 hover:text-amber-400 transition-colors"
              >
                <span>Festive Counter & Location</span>
                <span className="text-xs text-amber-300 font-medium">Contact &rarr;</span>
              </Link>
            </div>

            <div className="pt-3 border-t border-slate-800/80 grid grid-cols-2 gap-2">
              <Link
                href="/login"
                onClick={() => setMobileMenuOpen(false)}
                className="flex items-center justify-center gap-1.5 py-2.5 rounded-xl text-xs font-semibold bg-slate-900 border border-slate-800 text-amber-300 hover:text-white"
              >
                <UserCircle className="w-4 h-4 text-amber-400" />
                <span>Customer Login</span>
              </Link>

              <Link
                href="/admin/login"
                onClick={() => setMobileMenuOpen(false)}
                className="flex items-center justify-center gap-1.5 py-2.5 rounded-xl text-xs font-semibold bg-slate-900 border border-slate-800 text-slate-400 hover:text-white"
              >
                <Lock className="w-3.5 h-3.5 text-amber-400" />
                <span>Admin Portal</span>
              </Link>
            </div>

            <div className="pt-2 space-y-2">
              <a
                href={`tel:${BUSINESS_CONFIG.phone.replace(/\s+/g, '')}`}
                className="flex items-center justify-center gap-2 w-full py-2.5 text-xs font-semibold rounded-xl bg-emerald-950/40 border border-emerald-500/30 text-emerald-300"
              >
                <Phone className="w-4 h-4 text-emerald-400" />
                <span>Call Hotline: {BUSINESS_CONFIG.phone}</span>
              </a>

              {onOpenInquiry && (
                <button
                  onClick={() => {
                    setMobileMenuOpen(false);
                    onOpenInquiry();
                  }}
                  className="w-full py-3 text-center text-xs font-bold rounded-xl bg-gradient-to-r from-amber-500 via-orange-500 to-amber-600 text-slate-950 shadow-md shadow-amber-500/25 cursor-pointer"
                >
                  Get Instant Festive Quote & Pre-Book
                </button>
              )}
            </div>
          </div>
        </>
      )}
    </header>
  );
}

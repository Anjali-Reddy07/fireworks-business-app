'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { 
  Sparkles, 
  Phone, 
  ShieldCheck, 
  Menu, 
  X, 
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
    <header className="sticky top-0 z-50 w-full bg-white/95 backdrop-blur-xl border-b border-blue-100 shadow-sm">
      {/* Top seasonal statutory & trust banner */}
      <div className="bg-gradient-to-r from-blue-950 via-blue-900 to-indigo-950 text-white py-1.5 px-3">
        <div className="max-w-7xl mx-auto flex items-center justify-between text-[11px] sm:text-xs">
          <div className="flex items-center gap-2 overflow-hidden text-blue-100 mx-auto sm:mx-0">
            <span className="inline-flex items-center gap-1 bg-blue-500/20 border border-blue-400/30 text-blue-200 px-2 py-0.5 rounded-full text-[10px] font-bold tracking-wide shrink-0">
              <ShieldCheck className="w-3 h-3 text-blue-300" />
              Licensed Outlet
            </span>
            <span className="font-mono text-white/90 hidden md:inline">
              {BUSINESS_CONFIG.pesoLicense}
            </span>
            <span className="text-blue-300/40 hidden sm:inline">•</span>
            <span className="inline-flex items-center gap-1 text-emerald-300 font-medium">
              <CheckCircle2 className="w-3 h-3 text-emerald-400 shrink-0" />
              100% CSIR-NEERI Certified Green Crackers
            </span>
          </div>

          <div className="hidden lg:flex items-center gap-3 text-blue-200 text-[11px]">
            <span className="flex items-center gap-1.5 text-blue-100">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
              Seasonal Counter Active
            </span>
            <span className="text-blue-400/40">|</span>
            <span className="text-blue-200">Direct Sivakasi Rates</span>
          </div>
        </div>
      </div>

      {/* Main Navbar */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-18 sm:h-20 gap-4">
          
          {/* Logo & Brand Identity */}
          <Link href="/" className="flex items-center gap-3 group shrink-0 select-none">
            <div className="relative">
              <div className="w-10 h-10 sm:w-11 sm:h-11 rounded-xl bg-gradient-to-tr from-blue-600 via-indigo-600 to-sky-500 flex items-center justify-center shadow-lg shadow-blue-500/20 group-hover:scale-105 transition-all duration-300 text-white">
                <Sparkles className="w-5 h-5 sm:w-6 sm:h-6" />
              </div>
              <div className="absolute -inset-0.5 rounded-xl bg-blue-400/30 blur-sm opacity-0 group-hover:opacity-100 transition-opacity -z-10" />
            </div>
            
            <div className="flex flex-col">
              <span className="text-base sm:text-lg lg:text-xl font-black tracking-tight text-slate-900 group-hover:text-blue-600 transition-colors">
                {BUSINESS_CONFIG.name}
              </span>
              <span className="text-[10px] sm:text-[11px] font-semibold text-blue-600 tracking-wider uppercase">
                Festive Assortment & Direct Rates
              </span>
            </div>
          </Link>

          {/* Desktop Navigation Links */}
          <nav className="hidden lg:flex items-center gap-1 bg-blue-50/80 p-1.5 rounded-2xl border border-blue-100/90">
            <Link
              href="#catalogue"
              className="px-3.5 py-1.5 rounded-xl text-xs font-semibold text-slate-700 hover:text-blue-700 hover:bg-white hover:shadow-xs transition-all duration-200"
            >
              Catalogue & Rates
            </Link>
            <Link
              href="#safety"
              className="px-3.5 py-1.5 rounded-xl text-xs font-semibold text-slate-700 hover:text-blue-700 hover:bg-white hover:shadow-xs transition-all duration-200"
            >
              Green Safety Guide
            </Link>
            <Link
              href="#seasonal-outlet"
              className="px-3.5 py-1.5 rounded-xl text-xs font-semibold text-slate-700 hover:text-blue-700 hover:bg-white hover:shadow-xs transition-all duration-200"
            >
              Outlet & Dates
            </Link>
          </nav>

          {/* Right Action Controls */}
          <div className="flex items-center gap-2 sm:gap-2.5 shrink-0">
            {/* Customer Account Sign In (Desktop) */}
            <div className="hidden sm:flex items-center pr-1 border-r border-slate-200">
              <Link
                href="/login"
                className="inline-flex items-center gap-1.5 text-xs font-semibold text-slate-700 hover:text-blue-700 hover:bg-blue-50/80 px-3 py-2 rounded-xl border border-slate-200 transition-colors"
                title="Customer Sign In & Orders"
              >
                <UserCircle className="w-4 h-4 text-blue-600" />
                <span>My Account</span>
              </Link>
            </div>

            {/* Shopping Cart Button */}
            <Link
              href="/checkout"
              className="relative flex items-center gap-2 px-3 py-2 rounded-xl bg-white hover:bg-blue-50 border border-blue-200 text-slate-800 hover:text-blue-700 transition-all shadow-xs group"
              aria-label={`Cart with ${cartItemCount} items`}
            >
              <ShoppingCart className="w-4 h-4 text-blue-600 group-hover:scale-110 transition-transform" />
              <span className="hidden sm:inline text-xs font-bold">Cart</span>
              {cartItemCount > 0 ? (
                <span className="min-w-5 h-5 px-1.5 rounded-full bg-blue-600 text-white font-black text-[10px] flex items-center justify-center shadow-xs shadow-blue-500/50 animate-pulse">
                  {cartItemCount}
                </span>
              ) : (
                <span className="hidden sm:inline text-[10px] text-slate-400 font-semibold">0</span>
              )}
            </Link>

            {/* Direct Phone Call Button */}
            <a
              href={`tel:${BUSINESS_CONFIG.phone.replace(/\s+/g, '')}`}
              className="hidden md:flex items-center gap-2 text-xs font-semibold text-emerald-800 hover:text-emerald-900 px-3 py-2 rounded-xl bg-emerald-50 hover:bg-emerald-100/70 border border-emerald-200 transition-all shadow-xs"
              title="Call Counter Hotline"
            >
              <Phone className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
              <span>{BUSINESS_CONFIG.phone}</span>
            </a>

            {/* Primary Action Button: Pre-Book / Get Quote */}
            {onOpenInquiry && (
              <button
                onClick={onOpenInquiry}
                className="inline-flex items-center gap-2 bg-gradient-to-r from-blue-600 via-blue-700 to-indigo-700 hover:from-blue-500 hover:to-indigo-600 text-white font-bold px-3.5 sm:px-4 lg:px-5 py-2 sm:py-2.5 rounded-xl shadow-md shadow-blue-500/25 hover:shadow-blue-500/40 hover:scale-[1.02] active:scale-[0.98] text-xs sm:text-sm transition-all cursor-pointer shrink-0"
              >
                <Calendar className="w-4 h-4 text-white" />
                <span className="whitespace-nowrap">Pre-Book & Quote</span>
              </button>
            )}

            {/* Mobile Hamburger Button */}
            <div className="lg:hidden flex items-center">
              <button
                onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                className="p-2 rounded-xl text-slate-600 hover:text-slate-900 bg-white border border-slate-200 hover:border-slate-300 transition-colors focus:outline-none cursor-pointer shadow-xs"
                aria-label="Toggle navigation"
              >
                {mobileMenuOpen ? <X className="w-5 h-5 text-blue-600" /> : <Menu className="w-5 h-5" />}
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Mobile Drawer */}
      {mobileMenuOpen && (
        <>
          <div
            className="fixed inset-0 top-[90px] bg-slate-900/40 backdrop-blur-xs z-40 lg:hidden"
            onClick={() => setMobileMenuOpen(false)}
          />
          <div className="lg:hidden relative z-50 border-b border-blue-100 bg-white px-4 pt-4 pb-6 space-y-3 shadow-xl animate-in">
            <div className="space-y-1">
              <Link
                href="#catalogue"
                onClick={() => setMobileMenuOpen(false)}
                className="flex items-center justify-between py-2.5 px-3.5 rounded-xl text-sm font-semibold text-slate-800 hover:bg-blue-50 hover:text-blue-600 transition-colors"
              >
                <span>Product Catalogue & Rates</span>
                <span className="text-xs text-blue-600 font-medium">Explore &rarr;</span>
              </Link>

              <Link
                href="#safety"
                onClick={() => setMobileMenuOpen(false)}
                className="flex items-center justify-between py-2.5 px-3.5 rounded-xl text-sm font-semibold text-slate-800 hover:bg-blue-50 hover:text-blue-600 transition-colors"
              >
                <span>Safety & Green Crackers Guide</span>
                <span className="text-xs text-emerald-600 font-medium">NEERI &rarr;</span>
              </Link>

              <Link
                href="#seasonal-outlet"
                onClick={() => setMobileMenuOpen(false)}
                className="flex items-center justify-between py-2.5 px-3.5 rounded-xl text-sm font-semibold text-slate-800 hover:bg-blue-50 hover:text-blue-600 transition-colors"
              >
                <span>Festive Counter & Location</span>
                <span className="text-xs text-blue-600 font-medium">Contact &rarr;</span>
              </Link>
            </div>

            <div className="pt-3 border-t border-slate-200">
              <Link
                href="/login"
                onClick={() => setMobileMenuOpen(false)}
                className="flex items-center justify-center gap-2 py-3 rounded-xl text-xs font-bold bg-blue-50 border border-blue-200 text-blue-700 hover:bg-blue-100"
              >
                <UserCircle className="w-4 h-4 text-blue-600" />
                <span>Customer Sign In & My Orders</span>
              </Link>
            </div>

            <div className="pt-2 space-y-2">
              <a
                href={`tel:${BUSINESS_CONFIG.phone.replace(/\s+/g, '')}`}
                className="flex items-center justify-center gap-2 w-full py-2.5 text-xs font-semibold rounded-xl bg-emerald-50 border border-emerald-200 text-emerald-800"
              >
                <Phone className="w-4 h-4 text-emerald-600" />
                <span>Call Hotline: {BUSINESS_CONFIG.phone}</span>
              </a>

              {onOpenInquiry && (
                <button
                  onClick={() => {
                    setMobileMenuOpen(false);
                    onOpenInquiry();
                  }}
                  className="w-full py-3 text-center text-xs font-bold rounded-xl bg-gradient-to-r from-blue-600 to-indigo-600 text-white shadow-md shadow-blue-500/25 cursor-pointer"
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

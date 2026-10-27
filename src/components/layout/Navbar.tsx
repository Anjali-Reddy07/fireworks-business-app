'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { Sparkles, Phone, ShieldCheck, MapPin, Menu, X, Lock } from 'lucide-react';
import { BUSINESS_CONFIG } from '@/lib/data/sample-products';

interface NavbarProps {
  onOpenInquiry?: () => void;
}

export function Navbar({ onOpenInquiry }: NavbarProps) {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  return (
    <header className="sticky top-0 z-40 w-full border-b border-amber-500/20 bg-slate-950/85 backdrop-blur-md">
      {/* Top statutory mini banner */}
      <div className="bg-gradient-to-r from-amber-950/80 via-slate-900 to-amber-950/80 border-b border-amber-500/10 px-4 py-1 text-xs text-amber-200/90 text-center flex items-center justify-center gap-2">
        <ShieldCheck className="w-3.5 h-3.5 text-amber-400 shrink-0" />
        <span>
          <strong>PESO Licensed Store</strong>: {BUSINESS_CONFIG.pesoLicense} | 100% CSIR-NEERI Certified Green Crackers
        </span>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-20">
          {/* Logo & Brand Name */}
          <Link href="/" className="flex items-center gap-3 group">
            <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-amber-500 to-red-600 flex items-center justify-center shadow-lg shadow-amber-500/20 group-hover:scale-105 transition-transform">
              <Sparkles className="w-6 h-6 text-slate-950" />
            </div>
            <div>
              <span className="text-xl font-bold tracking-tight text-white block group-hover:text-amber-400 transition-colors">
                {BUSINESS_CONFIG.name}
              </span>
              <span className="text-xs text-amber-300/80 tracking-wide block">
                Authorized Retail Showcase & Price Guide
              </span>
            </div>
          </Link>

          {/* Desktop Navigation Links */}
          <nav className="hidden md:flex items-center gap-8">
            <Link
              href="#catalogue"
              className="text-sm font-medium text-slate-300 hover:text-amber-400 transition-colors"
            >
              Catalogue & Prices
            </Link>
            <Link
              href="#safety"
              className="text-sm font-medium text-slate-300 hover:text-amber-400 transition-colors"
            >
              Green Safety Guide
            </Link>
            <Link
              href="#store-location"
              className="text-sm font-medium text-slate-300 hover:text-amber-400 transition-colors"
            >
              Store Hours & Map
            </Link>
            <Link
              href="/admin"
              className="inline-flex items-center gap-1.5 text-xs font-medium text-slate-400 hover:text-white bg-slate-900/80 px-3 py-1.5 rounded-lg border border-slate-800 hover:border-slate-700 transition-colors"
            >
              <Lock className="w-3 h-3 text-amber-400" />
              <span>Admin</span>
            </Link>
          </nav>

          {/* Action CTAs */}
          <div className="hidden lg:flex items-center gap-4">
            <a
              href={`tel:${BUSINESS_CONFIG.phone.replace(/\s+/g, '')}`}
              className="flex items-center gap-2 text-sm text-slate-300 hover:text-white px-3 py-2 rounded-lg bg-slate-900/60 border border-slate-800"
            >
              <Phone className="w-4 h-4 text-emerald-400" />
              <span className="font-semibold">{BUSINESS_CONFIG.phone}</span>
            </a>

            {onOpenInquiry ? (
              <button
                onClick={onOpenInquiry}
                className="inline-flex items-center gap-2 bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-400 hover:to-amber-500 text-slate-950 font-bold px-5 py-2.5 rounded-xl shadow-md shadow-amber-500/20 hover:shadow-amber-500/40 transition-all cursor-pointer"
              >
                <span>Store Visit Booking</span>
              </button>
            ) : (
              <Link
                href="#inquiry"
                className="inline-flex items-center gap-2 bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-400 hover:to-amber-500 text-slate-950 font-bold px-5 py-2.5 rounded-xl shadow-md shadow-amber-500/20 hover:shadow-amber-500/40 transition-all"
              >
                <span>Store Visit Booking</span>
              </Link>
            )}
          </div>

          {/* Mobile menu trigger */}
          <div className="md:hidden flex items-center gap-2">
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="p-2 text-slate-400 hover:text-white focus:outline-none"
              aria-label="Toggle Navigation"
            >
              {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Drawer */}
      {mobileMenuOpen && (
        <div className="md:hidden border-b border-slate-800 bg-slate-950/95 px-4 pt-3 pb-6 space-y-4">
          <Link
            href="#catalogue"
            onClick={() => setMobileMenuOpen(false)}
            className="block py-2 text-base font-medium text-slate-200 hover:text-amber-400"
          >
            Product Catalogue & Rates
          </Link>
          <Link
            href="#safety"
            onClick={() => setMobileMenuOpen(false)}
            className="block py-2 text-base font-medium text-slate-200 hover:text-amber-400"
          >
            Safety Instructions & Green Crackers
          </Link>
          <Link
            href="#store-location"
            onClick={() => setMobileMenuOpen(false)}
            className="block py-2 text-base font-medium text-slate-200 hover:text-amber-400"
          >
            Store Directions & Timings
          </Link>
          <Link
            href="/admin"
            onClick={() => setMobileMenuOpen(false)}
            className="flex items-center gap-2 py-2 text-base font-medium text-amber-400"
          >
            <Lock className="w-4 h-4" />
            <span>Admin Dashboard</span>
          </Link>

          <div className="pt-4 border-t border-slate-800 space-y-3">
            <a
              href={`tel:${BUSINESS_CONFIG.phone.replace(/\s+/g, '')}`}
              className="flex items-center justify-center gap-2 w-full py-2.5 text-sm font-semibold rounded-lg bg-slate-900 border border-slate-800 text-slate-200"
            >
              <Phone className="w-4 h-4 text-emerald-400" />
              <span>Call Us: {BUSINESS_CONFIG.phone}</span>
            </a>

            {onOpenInquiry && (
              <button
                onClick={() => {
                  setMobileMenuOpen(false);
                  onOpenInquiry();
                }}
                className="w-full py-3 text-center text-sm font-bold rounded-lg bg-amber-500 text-slate-950 shadow-md shadow-amber-500/20"
              >
                Book Store Visit / Inquire Stock
              </button>
            )}
          </div>
        </div>
      )}
    </header>
  );
}

import React from 'react';
import Link from 'next/link';
import { Sparkles, ShieldAlert, MapPin, Clock, Phone, Mail } from 'lucide-react';
import { BUSINESS_CONFIG } from '@/lib/data/sample-products';

export function Footer() {
  return (
    <footer className="bg-slate-950 border-t border-slate-900 text-slate-400">
      {/* Supreme Court / PESO Legal Notice Strip */}
      <div className="border-b border-amber-950/40 bg-amber-950/20 px-4 py-4 sm:py-6">
        <div className="max-w-7xl mx-auto flex flex-col sm:flex-row items-start sm:items-center gap-3 sm:gap-4 text-xs text-amber-200/80">
          <div className="p-2 sm:p-2.5 rounded-xl bg-amber-500/10 border border-amber-500/20 text-amber-400 shrink-0">
            <ShieldAlert className="w-5 h-5 sm:w-6 sm:h-6" />
          </div>
          <div>
            <h4 className="font-bold text-amber-300 uppercase tracking-wider text-xs sm:text-sm mb-1">
              Statutory Regulatory Compliance & Seasonal Operations Notice
            </h4>
            <p className="leading-relaxed text-[11px] sm:text-xs">
              In strict adherence to the directions of the <strong>Hon&apos;ble Supreme Court of India</strong> and circulars issued by 
              the <strong>Petroleum and Explosives Safety Organisation (PESO)</strong>, online shopping cart checkouts, courier dispatch, 
              and postal delivery of firecrackers are strictly prohibited. <strong>{BUSINESS_CONFIG.name}</strong> operates as an informational 
              <strong> digital price guide and seasonal showcase</strong> for our authorized seasonal licensed operations. 
              All product handovers take place strictly in person in compliance with applicable explosives regulations.
            </p>
          </div>
        </div>
      </div>

      {/* Main Footer Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 sm:py-12">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
          {/* Brand Info */}
          <div>
            <div className="flex items-center gap-2 mb-3 sm:mb-4">
              <div className="w-8 h-8 rounded-lg bg-amber-500 flex items-center justify-center text-slate-950 font-bold">
                <Sparkles className="w-4 h-4" />
              </div>
              <h3 className="text-white font-bold text-base sm:text-lg">{BUSINESS_CONFIG.name}</h3>
            </div>
            <p className="text-xs sm:text-sm text-slate-400 leading-relaxed mb-4">
              Premium festive fireworks & sparklers directly from the manufacturing heartland of Sivakasi. 100% CSIR-NEERI certified green crackers with reduced emissions.
            </p>
            <div className="space-y-1 text-xs text-slate-500">
              <p><strong className="text-slate-400">License:</strong> {BUSINESS_CONFIG.pesoLicense}</p>
              <p><strong className="text-slate-400">GSTIN:</strong> {BUSINESS_CONFIG.gstin}</p>
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="text-white font-semibold text-xs sm:text-sm uppercase tracking-wider mb-3 sm:mb-4">
              Explore Showcase
            </h4>
            <ul className="space-y-2 text-xs sm:text-sm">
              <li>
                <Link href="#catalogue" className="hover:text-amber-400 transition-colors">
                  Product Catalogue & Rates
                </Link>
              </li>
              <li>
                <Link href="#safety" className="hover:text-amber-400 transition-colors">
                  Green Cracker Safety Guidelines
                </Link>
              </li>
              <li>
                <Link href="#seasonal-outlet" className="hover:text-amber-400 transition-colors">
                  Seasonal Counter & Dates
                </Link>
              </li>
              <li>
                <Link href="/checkout" className="hover:text-amber-400 transition-colors">
                  My Festive Order Cart
                </Link>
              </li>
              <li>
                <Link href="/admin" className="hover:text-amber-400 transition-colors">
                  Internal Staff & Admin Portal
                </Link>
              </li>
            </ul>
          </div>

          {/* Seasonal Outlet Location */}
          <div>
            <h4 className="text-white font-semibold text-xs sm:text-sm uppercase tracking-wider mb-3 sm:mb-4">
              Seasonal Outlet & Counter
            </h4>
            <div className="space-y-3 text-xs sm:text-sm">
              <div className="flex items-start gap-2.5">
                <MapPin className="w-4 h-4 text-amber-400 shrink-0 mt-0.5" />
                <span>
                  {BUSINESS_CONFIG.address}, {BUSINESS_CONFIG.city} - {BUSINESS_CONFIG.pincode}
                </span>
              </div>
              <div className="flex items-start gap-2.5">
                <Clock className="w-4 h-4 text-amber-400 shrink-0 mt-0.5" />
                <span>{BUSINESS_CONFIG.seasonalOperatingNote}</span>
              </div>
            </div>
          </div>

          {/* Direct Contact */}
          <div>
            <h4 className="text-white font-semibold text-xs sm:text-sm uppercase tracking-wider mb-3 sm:mb-4">
              Festive Orders & Inquiries
            </h4>
            <div className="space-y-3 text-xs sm:text-sm">
              <a
                href={`tel:${BUSINESS_CONFIG.phone.replace(/\s+/g, '')}`}
                className="flex items-center gap-2.5 text-white font-bold hover:text-amber-400 transition-colors"
              >
                <Phone className="w-4 h-4 text-emerald-400" />
                <span>{BUSINESS_CONFIG.phone}</span>
              </a>
              <a
                href={`mailto:${BUSINESS_CONFIG.email}`}
                className="flex items-center gap-2.5 hover:text-white transition-colors"
              >
                <Mail className="w-4 h-4 text-sky-400" />
                <span className="truncate">{BUSINESS_CONFIG.email}</span>
              </a>
              <div className="pt-2">
                <span className="inline-block text-xs bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 px-2.5 py-1 rounded-full font-medium">
                  ● Seasonal Pre-Booking Active
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* Bottom copyright */}
        <div className="mt-8 sm:mt-12 pt-6 sm:pt-8 border-t border-slate-900 flex flex-col sm:flex-row items-center justify-between text-[11px] sm:text-xs text-slate-500 gap-3 sm:gap-4 text-center sm:text-left">
          <p>© 2026 {BUSINESS_CONFIG.name}. All rights reserved.</p>
          <p className="flex items-center gap-2">
            <span>Compliant with Indian Explosives Act & PESO Guidelines</span>
          </p>
        </div>
      </div>
    </footer>
  );
}

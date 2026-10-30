import React from 'react';
import Link from 'next/link';
import { Sparkles, ShieldCheck, Phone, Calendar, Award, CheckCircle2 } from 'lucide-react';
import { BUSINESS_CONFIG } from '@/lib/data/sample-products';

interface HeroProps {
  onOpenInquiry: () => void;
}

export function Hero({ onOpenInquiry }: HeroProps) {
  return (
    <section className="relative overflow-hidden bg-gradient-to-b from-blue-50/60 via-white to-slate-50 pt-8 pb-14 sm:pt-16 sm:pb-24 lg:pt-20 lg:pb-28">
      {/* Background glow and decorative ambient blue firework lights */}
      <div className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[320px] sm:w-[600px] h-[250px] sm:h-[350px] bg-blue-400/10 rounded-full blur-[100px] sm:blur-[140px] pointer-events-none" />
      <div className="absolute top-1/3 left-1/4 w-[200px] sm:w-[300px] h-[200px] sm:h-[300px] bg-indigo-500/10 rounded-full blur-[90px] sm:blur-[120px] pointer-events-none" />
      <div className="absolute bottom-10 right-1/4 w-[250px] sm:w-[400px] h-[200px] sm:h-[250px] bg-sky-400/10 rounded-full blur-[90px] sm:blur-[120px] pointer-events-none" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="text-center max-w-3xl mx-auto">
          {/* Trust Badge */}
          <div className="inline-flex items-center gap-1.5 sm:gap-2 px-3.5 py-1.5 rounded-full bg-blue-50 border border-blue-200 text-blue-700 text-[11px] sm:text-xs font-bold mb-4 sm:mb-6 max-w-full shadow-xs">
            <Sparkles className="w-3.5 h-3.5 text-blue-600 animate-pulse shrink-0" />
            <span className="truncate">Diwali & Festive Season 2026 Ready</span>
            <span className="w-1.5 h-1.5 rounded-full bg-blue-400 shrink-0 hidden xs:inline-block" />
            <span className="hidden xs:inline-block truncate">Authorized Seasonal License</span>
          </div>

          {/* Main Headline */}
          <h1 className="text-3xl xs:text-4xl sm:text-5xl lg:text-6xl font-black tracking-tight text-slate-900 mb-4 sm:mb-6 leading-tight">
            Celebrate with Joy &{' '}
            <span className="bg-gradient-to-r from-blue-700 via-blue-600 to-sky-600 bg-clip-text text-transparent">
              Sparklers & Smiles
            </span>
          </h1>

          {/* Subtitle */}
          <p className="text-sm sm:text-base lg:text-lg text-slate-600 mb-6 sm:mb-8 leading-relaxed max-w-2xl mx-auto px-2">
            Welcome to <strong>{BUSINESS_CONFIG.name}</strong>. Explore our digital catalogue of genuine Sivakasi sparklers, 
            flower pots, chakkars, and multi-shot aerials. Fully verified with CSIR-NEERI green certification. 
            Pre-book your festive requirements and get customized family package quotations.
          </p>

          {/* Action CTAs */}
          <div className="flex flex-col sm:flex-row items-center justify-center gap-3 sm:gap-4 mb-10 sm:mb-14 w-full max-w-md mx-auto sm:max-w-none">
            <Link
              href="#catalogue"
              className="w-full sm:w-auto inline-flex items-center justify-center gap-2 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white font-bold px-6 sm:px-8 py-3.5 rounded-xl shadow-lg shadow-blue-500/25 hover:shadow-blue-500/40 transition-all text-sm sm:text-base cursor-pointer"
            >
              <Sparkles className="w-4 h-4 sm:w-5 sm:h-5" />
              <span>Browse Catalogue & Rates</span>
            </Link>

            <button
              onClick={onOpenInquiry}
              className="w-full sm:w-auto inline-flex items-center justify-center gap-2 bg-white hover:bg-blue-50 text-blue-700 font-bold px-6 sm:px-8 py-3.5 rounded-xl border border-blue-200 hover:border-blue-300 shadow-xs transition-all text-sm sm:text-base cursor-pointer"
            >
              <Calendar className="w-4 h-4 sm:w-5 sm:h-5 text-blue-600" />
              <span>Festive Pre-Booking & Quote</span>
            </button>
          </div>

          {/* Trust Highlights Grid */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-2.5 sm:gap-4 text-left">
            <div className="p-3.5 sm:p-4 rounded-2xl bg-white border border-blue-100 shadow-xs">
              <div className="flex items-center gap-1.5 sm:gap-2 text-blue-700 font-bold text-sm sm:text-base mb-1">
                <Award className="w-4 h-4 sm:w-5 sm:h-5 shrink-0 text-blue-600" />
                <span className="truncate">CSIR-NEERI</span>
              </div>
              <p className="text-[11px] sm:text-xs text-slate-500 line-clamp-2">Authentic Green QR verification</p>
            </div>

            <div className="p-3.5 sm:p-4 rounded-2xl bg-white border border-blue-100 shadow-xs">
              <div className="flex items-center gap-1.5 sm:gap-2 text-blue-700 font-bold text-sm sm:text-base mb-1">
                <ShieldCheck className="w-4 h-4 sm:w-5 sm:h-5 shrink-0 text-emerald-600" />
                <span className="truncate">PESO Licensed</span>
              </div>
              <p className="text-[11px] sm:text-xs text-slate-500 line-clamp-2">Government seasonal approved outlet</p>
            </div>

            <div className="p-3.5 sm:p-4 rounded-2xl bg-white border border-blue-100 shadow-xs">
              <div className="flex items-center gap-1.5 sm:gap-2 text-blue-700 font-bold text-sm sm:text-base mb-1">
                <Sparkles className="w-4 h-4 sm:w-5 sm:h-5 shrink-0 text-amber-500" />
                <span className="truncate">Direct Sivakasi</span>
              </div>
              <p className="text-[11px] sm:text-xs text-slate-500 line-clamp-2">Direct wholesale manufacturer pricing</p>
            </div>

            <div className="p-3.5 sm:p-4 rounded-2xl bg-white border border-blue-100 shadow-xs">
              <div className="flex items-center gap-1.5 sm:gap-2 text-blue-700 font-bold text-sm sm:text-base mb-1">
                <CheckCircle2 className="w-4 h-4 sm:w-5 sm:h-5 shrink-0 text-blue-600" />
                <span className="truncate">Safe Payment</span>
              </div>
              <p className="text-[11px] sm:text-xs text-slate-500 line-clamp-2">Pay securely at festival counter pickup</p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

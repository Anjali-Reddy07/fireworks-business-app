import React from 'react';
import Link from 'next/link';
import { Sparkles, ShieldCheck, Phone, Calendar, Award, CheckCircle2 } from 'lucide-react';
import { BUSINESS_CONFIG } from '@/lib/data/sample-products';

interface HeroProps {
  onOpenInquiry: () => void;
}

export function Hero({ onOpenInquiry }: HeroProps) {
  return (
    <section className="relative overflow-hidden pt-8 pb-14 sm:pt-16 sm:pb-24 lg:pt-20 lg:pb-28">
      {/* Background glow and decorative ambient firework lights */}
      <div className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[320px] sm:w-[600px] h-[250px] sm:h-[350px] bg-amber-500/10 rounded-full blur-[100px] sm:blur-[140px] pointer-events-none" />
      <div className="absolute top-1/3 left-1/4 w-[200px] sm:w-[300px] h-[200px] sm:h-[300px] bg-red-600/10 rounded-full blur-[90px] sm:blur-[120px] pointer-events-none" />
      <div className="absolute bottom-10 right-1/4 w-[250px] sm:w-[400px] h-[200px] sm:h-[250px] bg-amber-600/10 rounded-full blur-[90px] sm:blur-[120px] pointer-events-none" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="text-center max-w-3xl mx-auto">
          {/* Trust Badge */}
          <div className="inline-flex items-center gap-1.5 sm:gap-2 px-3 py-1.5 rounded-full bg-amber-500/10 border border-amber-500/30 text-amber-300 text-[11px] sm:text-xs font-semibold mb-4 sm:mb-6 max-w-full">
            <Sparkles className="w-3.5 h-3.5 text-amber-400 animate-pulse shrink-0" />
            <span className="truncate">Diwali & Festive Season 2026 Ready</span>
            <span className="w-1.5 h-1.5 rounded-full bg-amber-400 shrink-0 hidden xs:inline-block" />
            <span className="hidden xs:inline-block truncate">Authorized Seasonal License</span>
          </div>

          {/* Main Headline */}
          <h1 className="text-3xl xs:text-4xl sm:text-5xl lg:text-6xl font-extrabold tracking-tight text-white mb-4 sm:mb-6 leading-tight">
            Celebrate with Joy &{' '}
            <span className="bg-gradient-to-r from-amber-400 via-yellow-300 to-amber-500 bg-clip-text text-transparent">
              Sparklers & Smiles
            </span>
          </h1>

          {/* Subtitle */}
          <p className="text-sm sm:text-base lg:text-lg text-slate-300 mb-6 sm:mb-8 leading-relaxed max-w-2xl mx-auto px-2">
            Welcome to <strong>{BUSINESS_CONFIG.name}</strong>. Explore our digital catalogue of genuine Sivakasi sparklers, 
            flower pots, chakkars, and multi-shot aerials. Fully verified with CSIR-NEERI green certification. 
            Pre-book your festive requirements and get customized family package quotations.
          </p>

          {/* Action CTAs */}
          <div className="flex flex-col sm:flex-row items-center justify-center gap-3 sm:gap-4 mb-10 sm:mb-14 w-full max-w-md mx-auto sm:max-w-none">
            <Link
              href="#catalogue"
              className="w-full sm:w-auto inline-flex items-center justify-center gap-2 bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-400 hover:to-amber-500 text-slate-950 font-bold px-6 sm:px-8 py-3.5 rounded-xl shadow-lg shadow-amber-500/25 hover:shadow-amber-500/40 transition-all text-sm sm:text-base cursor-pointer"
            >
              <Sparkles className="w-4 h-4 sm:w-5 sm:h-5" />
              <span>Browse Catalogue & Rates</span>
            </Link>

            <button
              onClick={onOpenInquiry}
              className="w-full sm:w-auto inline-flex items-center justify-center gap-2 bg-slate-900/90 hover:bg-slate-800 text-amber-300 hover:text-white font-semibold px-6 sm:px-8 py-3.5 rounded-xl border border-amber-500/30 hover:border-amber-400/60 transition-all text-sm sm:text-base cursor-pointer"
            >
              <Calendar className="w-4 h-4 sm:w-5 sm:h-5 text-amber-400" />
              <span>Festive Pre-Booking & Quote</span>
            </button>
          </div>

          {/* Trust Highlights Grid */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-2.5 sm:gap-4 text-left">
            <div className="p-3 sm:p-4 rounded-xl bg-slate-900/60 border border-slate-800/80 backdrop-blur-sm">
              <div className="flex items-center gap-1.5 sm:gap-2 text-amber-400 font-bold text-sm sm:text-base mb-1">
                <Award className="w-4 h-4 sm:w-5 sm:h-5 shrink-0" />
                <span className="truncate">CSIR-NEERI</span>
              </div>
              <p className="text-[11px] sm:text-xs text-slate-400 line-clamp-2">Authentic Green QR verification</p>
            </div>

            <div className="p-3 sm:p-4 rounded-xl bg-slate-900/60 border border-slate-800/80 backdrop-blur-sm">
              <div className="flex items-center gap-1.5 sm:gap-2 text-emerald-400 font-bold text-sm sm:text-base mb-1">
                <CheckCircle2 className="w-4 h-4 sm:w-5 sm:h-5 shrink-0" />
                <span className="truncate">30% Less Emission</span>
              </div>
              <p className="text-[11px] sm:text-xs text-slate-400 line-clamp-2">Zero barium nitrate, low smoke</p>
            </div>

            <div className="p-3 sm:p-4 rounded-xl bg-slate-900/60 border border-slate-800/80 backdrop-blur-sm">
              <div className="flex items-center gap-1.5 sm:gap-2 text-sky-400 font-bold text-sm sm:text-base mb-1">
                <ShieldCheck className="w-4 h-4 sm:w-5 sm:h-5 shrink-0" />
                <span className="truncate">PESO Compliant</span>
              </div>
              <p className="text-[11px] sm:text-xs text-slate-400 line-clamp-2">Statutory seasonal license</p>
            </div>

            <div className="p-3 sm:p-4 rounded-xl bg-slate-900/60 border border-slate-800/80 backdrop-blur-sm">
              <div className="flex items-center gap-1.5 sm:gap-2 text-rose-400 font-bold text-sm sm:text-base mb-1">
                <Phone className="w-4 h-4 sm:w-5 sm:h-5 shrink-0" />
                <span className="truncate">Direct Support</span>
              </div>
              <p className="text-[11px] sm:text-xs text-slate-400 line-clamp-2">Phone: {BUSINESS_CONFIG.phone}</p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

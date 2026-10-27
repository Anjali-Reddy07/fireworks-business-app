import React from 'react';
import Link from 'next/link';
import { Sparkles, ShieldCheck, MapPin, Calendar, Award, CheckCircle2 } from 'lucide-react';
import { BUSINESS_CONFIG } from '@/lib/data/sample-products';

interface HeroProps {
  onOpenInquiry: () => void;
}

export function Hero({ onOpenInquiry }: HeroProps) {
  return (
    <section className="relative overflow-hidden pt-12 pb-20 lg:pt-20 lg:pb-28">
      {/* Background glow and decorative ambient firework lights */}
      <div className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[350px] bg-amber-500/10 rounded-full blur-[140px] pointer-events-none" />
      <div className="absolute top-1/3 left-1/4 w-[300px] h-[300px] bg-red-600/10 rounded-full blur-[120px] pointer-events-none" />
      <div className="absolute bottom-10 right-1/4 w-[400px] h-[250px] bg-amber-600/10 rounded-full blur-[120px] pointer-events-none" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="text-center max-w-3xl mx-auto">
          {/* Trust Badge */}
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-amber-500/10 border border-amber-500/30 text-amber-300 text-xs sm:text-sm font-semibold mb-6">
            <Sparkles className="w-4 h-4 text-amber-400 animate-pulse" />
            <span>Diwali & Festive Season 2026 Ready</span>
            <span className="w-1.5 h-1.5 rounded-full bg-amber-400" />
            <span>Authorized PESO Licensed</span>
          </div>

          {/* Main Headline */}
          <h1 className="text-4xl sm:text-5xl lg:text-6xl font-extrabold tracking-tight text-white mb-6 leading-tight">
            Celebrate with Joy, Safety &{' '}
            <span className="bg-gradient-to-r from-amber-400 via-yellow-300 to-amber-500 bg-clip-text text-transparent">
              Certified Green Crackers
            </span>
          </h1>

          {/* Subtitle */}
          <p className="text-lg sm:text-xl text-slate-300 mb-8 leading-relaxed">
            Welcome to <strong>{BUSINESS_CONFIG.name}</strong>. Explore our digital showroom of genuine Sivakasi sparklers, 
            flower pots, chakkars, and multi-shot aerials. Fully verified with CSIR-NEERI green certification and available 
            exclusively at our licensed retail outlet.
          </p>

          {/* Action CTAs */}
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4 mb-12">
            <Link
              href="#catalogue"
              className="w-full sm:w-auto inline-flex items-center justify-center gap-2 bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-400 hover:to-amber-500 text-slate-950 font-bold px-8 py-3.5 rounded-xl shadow-lg shadow-amber-500/25 hover:shadow-amber-500/40 transition-all text-base cursor-pointer"
            >
              <Sparkles className="w-5 h-5" />
              <span>Browse Catalogue & Rates</span>
            </Link>

            <button
              onClick={onOpenInquiry}
              className="w-full sm:w-auto inline-flex items-center justify-center gap-2 bg-slate-900/80 hover:bg-slate-800 text-amber-300 hover:text-white font-semibold px-8 py-3.5 rounded-xl border border-amber-500/30 hover:border-amber-400/60 transition-all text-base cursor-pointer"
            >
              <Calendar className="w-5 h-5 text-amber-400" />
              <span>Book Store Visit / Bulk Inquiry</span>
            </button>
          </div>

          {/* Trust Highlights Grid */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-left">
            <div className="p-4 rounded-xl bg-slate-900/60 border border-slate-800/80 backdrop-blur-sm">
              <div className="flex items-center gap-2 text-amber-400 font-bold text-lg mb-1">
                <Award className="w-5 h-5" />
                <span>100% CSIR-NEERI</span>
              </div>
              <p className="text-xs text-slate-400">Green cracker formulas with authentic QR codes</p>
            </div>

            <div className="p-4 rounded-xl bg-slate-900/60 border border-slate-800/80 backdrop-blur-sm">
              <div className="flex items-center gap-2 text-emerald-400 font-bold text-lg mb-1">
                <CheckCircle2 className="w-5 h-5" />
                <span>30% Less Emission</span>
              </div>
              <p className="text-xs text-slate-400">Zero barium nitrate, low particulate smoke</p>
            </div>

            <div className="p-4 rounded-xl bg-slate-900/60 border border-slate-800/80 backdrop-blur-sm">
              <div className="flex items-center gap-2 text-sky-400 font-bold text-lg mb-1">
                <ShieldCheck className="w-5 h-5" />
                <span>PESO Regulated</span>
              </div>
              <p className="text-xs text-slate-400">Valid statutory explosives sales license</p>
            </div>

            <div className="p-4 rounded-xl bg-slate-900/60 border border-slate-800/80 backdrop-blur-sm">
              <div className="flex items-center gap-2 text-rose-400 font-bold text-lg mb-1">
                <MapPin className="w-5 h-5" />
                <span>Direct In-Store</span>
              </div>
              <p className="text-xs text-slate-400">Handpicked & inspected at our retail outlet</p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

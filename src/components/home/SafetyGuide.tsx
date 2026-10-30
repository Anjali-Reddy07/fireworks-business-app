import React from 'react';
import { ShieldCheck, QrCode, AlertOctagon, Flame, Droplet, Users, Sparkles } from 'lucide-react';

export function SafetyGuide() {
  return (
    <section id="safety" className="py-12 sm:py-16 bg-gradient-to-b from-slate-50 to-blue-50/40 border-t border-b border-blue-100">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center max-w-3xl mx-auto mb-10 sm:mb-14">
          <div className="inline-flex items-center gap-1.5 sm:gap-2 px-3.5 py-1.5 rounded-full bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs font-bold mb-3 shadow-xs">
            <ShieldCheck className="w-4 h-4 shrink-0 text-emerald-600" />
            <span className="truncate">CSIR-NEERI Certified Green Crackers</span>
          </div>
          <h2 className="text-2xl xs:text-3xl sm:text-4xl font-black text-slate-900 tracking-tight mb-3 sm:mb-4">
            Safety First & Green Cracker Guide
          </h2>
          <p className="text-xs sm:text-sm text-slate-600 leading-relaxed px-2">
            Our retail store exclusively stocks genuine green fireworks developed by CSIR-NEERI. They produce 30-35% lower particulate emissions, zero barium salts, and minimal smoke for cleaner celebrations.
          </p>
        </div>

        {/* CSIR-NEERI Green Cracker Verification Feature Box */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 sm:gap-6 lg:gap-8 mb-10 sm:mb-14">
          <div className="p-5 sm:p-6 rounded-3xl bg-white border border-blue-100 shadow-sm flex flex-col justify-between">
            <div>
              <div className="w-10 h-10 sm:w-12 sm:h-12 rounded-2xl bg-emerald-50 border border-emerald-200 text-emerald-600 flex items-center justify-center mb-3 sm:mb-4">
                <QrCode className="w-5 h-5 sm:w-6 sm:h-6" />
              </div>
              <h3 className="text-base sm:text-lg font-bold text-slate-900 mb-2">CSIR-NEERI Green QR Verification</h3>
              <p className="text-xs text-slate-500 leading-relaxed">
                Every genuine green cracker box features a green logo and a tamper-evident QR code. Scan it using the CSIR-NEERI app to verify the manufacturer license and emission test results before lighting.
              </p>
            </div>
            <div className="mt-4 pt-4 border-t border-slate-100 text-xs text-emerald-700 font-bold flex items-center gap-1.5">
              <span>● 100% QR Scannable Boxes at Store</span>
            </div>
          </div>

          <div className="p-5 sm:p-6 rounded-3xl bg-white border border-blue-100 shadow-sm flex flex-col justify-between">
            <div>
              <div className="w-10 h-10 sm:w-12 sm:h-12 rounded-2xl bg-blue-50 border border-blue-200 text-blue-600 flex items-center justify-center mb-3 sm:mb-4">
                <Sparkles className="w-5 h-5 sm:w-6 sm:h-6" />
              </div>
              <h3 className="text-base sm:text-lg font-bold text-slate-900 mb-2">SWAS, STAR & SAFAL Formulas</h3>
              <p className="text-xs text-slate-500 leading-relaxed">
                Formulated using Safe Water Releaser (SWAS), Safe Thermite Cracker (STAR), and Safe Minimal Aluminium (SAFAL) scientific patents that trap particulate matter and eliminate harmful chemical odors.
              </p>
            </div>
            <div className="mt-4 pt-4 border-t border-slate-100 text-xs text-blue-700 font-bold flex items-center gap-1.5">
              <span>● Free of Barium, Lead, and Antimony</span>
            </div>
          </div>

          <div className="p-5 sm:p-6 rounded-3xl bg-white border border-blue-100 shadow-sm flex flex-col justify-between">
            <div>
              <div className="w-10 h-10 sm:w-12 sm:h-12 rounded-2xl bg-sky-50 border border-sky-200 text-sky-600 flex items-center justify-center mb-3 sm:mb-4">
                <AlertOctagon className="w-5 h-5 sm:w-6 sm:h-6" />
              </div>
              <h3 className="text-base sm:text-lg font-bold text-slate-900 mb-2">Standard Decibel Compliance</h3>
              <p className="text-xs text-slate-500 leading-relaxed">
                All sound crackers strictly comply with the Ministry of Environment and PESO mandated limit of 125 dB at a distance of 4 meters, keeping neighborhood celebrations safe and enjoyable.
              </p>
            </div>
            <div className="mt-4 pt-4 border-t border-slate-100 text-xs text-sky-700 font-bold flex items-center gap-1.5">
              <span>● Permissible Decibels strictly checked</span>
            </div>
          </div>
        </div>

        {/* 6 Essential Lighting Safety Rules */}
        <div>
          <h3 className="text-lg sm:text-xl font-bold text-slate-900 text-center mb-6 sm:mb-8">
            Essential Fireworks Safety Dos & Don&apos;ts
          </h3>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3.5 sm:gap-6">
            <div className="flex items-start gap-3.5 p-4 rounded-2xl bg-white border border-slate-200 shadow-xs">
              <div className="w-9 h-9 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center shrink-0">
                <Droplet className="w-4 h-4" />
              </div>
              <div>
                <h4 className="text-xs sm:text-sm font-bold text-slate-900 mb-1">Bucket of Water & Sand</h4>
                <p className="text-xs text-slate-500">
                  Always keep 2 buckets of clean water and dry sand nearby to extinguish used sparklers and soak misfired crackers safely.
                </p>
              </div>
            </div>

            <div className="flex items-start gap-3.5 p-4 rounded-2xl bg-white border border-slate-200 shadow-xs">
              <div className="w-9 h-9 rounded-xl bg-amber-50 text-amber-600 flex items-center justify-center shrink-0">
                <Flame className="w-4 h-4" />
              </div>
              <div>
                <h4 className="text-xs sm:text-sm font-bold text-slate-900 mb-1">Use an Extended Agarbatti</h4>
                <p className="text-xs text-slate-500">
                  Ignite fuses at arm&apos;s length using a long incense stick (agarbatti). Never use open matchsticks or lighters directly over fireworks.
                </p>
              </div>
            </div>

            <div className="flex items-start gap-3.5 p-4 rounded-2xl bg-white border border-slate-200 shadow-xs">
              <div className="w-9 h-9 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center shrink-0">
                <Users className="w-4 h-4" />
              </div>
              <div>
                <h4 className="text-xs sm:text-sm font-bold text-slate-900 mb-1">Mandatory Adult Supervision</h4>
                <p className="text-xs text-slate-500">
                  Children under 16 years must never handle or ignite fireworks without continuous, direct adult guidance and supervision.
                </p>
              </div>
            </div>

            <div className="flex items-start gap-3.5 p-4 rounded-2xl bg-white border border-slate-200 shadow-xs">
              <div className="w-9 h-9 rounded-xl bg-rose-50 text-rose-600 flex items-center justify-center shrink-0">
                <AlertOctagon className="w-4 h-4" />
              </div>
              <div>
                <h4 className="text-xs sm:text-sm font-bold text-slate-900 mb-1">Never Relight a Dud</h4>
                <p className="text-xs text-slate-500">
                  If a cracker fails to ignite, never lean over it. Wait 15 minutes, then immerse it safely in a bucket of water.
                </p>
              </div>
            </div>

            <div className="flex items-start gap-3.5 p-4 rounded-2xl bg-white border border-slate-200 shadow-xs">
              <div className="w-9 h-9 rounded-xl bg-purple-50 text-purple-600 flex items-center justify-center shrink-0">
                <ShieldCheck className="w-4 h-4" />
              </div>
              <div>
                <h4 className="text-xs sm:text-sm font-bold text-slate-900 mb-1">Wear Cotton Clothing</h4>
                <p className="text-xs text-slate-500">
                  Wear well-fitted, pure cotton garments and closed footwear. Avoid loose synthetic, silk, or polyester clothing near fireworks.
                </p>
              </div>
            </div>

            <div className="flex items-start gap-3.5 p-4 rounded-2xl bg-white border border-slate-200 shadow-xs">
              <div className="w-9 h-9 rounded-xl bg-sky-50 text-sky-600 flex items-center justify-center shrink-0">
                <Sparkles className="w-4 h-4" />
              </div>
              <div>
                <h4 className="text-xs sm:text-sm font-bold text-slate-900 mb-1">Only Open Outdoor Grounds</h4>
                <p className="text-xs text-slate-500">
                  Light aerial shots and repeaters on flat, hard open ground at least 15-20 meters away from trees, cars, windows, and overhead wires.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

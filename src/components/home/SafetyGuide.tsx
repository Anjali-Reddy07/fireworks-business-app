import React from 'react';
import { ShieldCheck, QrCode, AlertOctagon, Flame, Droplet, Users, Sparkles } from 'lucide-react';

export function SafetyGuide() {
  return (
    <section id="safety" className="py-16 bg-slate-950/60 border-t border-b border-slate-900">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center max-w-3xl mx-auto mb-14">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 text-xs font-semibold mb-3">
            <ShieldCheck className="w-4 h-4" />
            <span>National Environmental Engineering Research Institute (CSIR-NEERI) Certified</span>
          </div>
          <h2 className="text-3xl sm:text-4xl font-extrabold text-white tracking-tight mb-4">
            Safety First & Green Cracker Guide
          </h2>
          <p className="text-sm text-slate-400 leading-relaxed">
            Our retail store exclusively stocks genuine green fireworks developed by CSIR-NEERI. They produce 30-35% lower particulate emissions, zero barium salts, and minimal smoke for cleaner celebrations.
          </p>
        </div>

        {/* CSIR-NEERI Green Cracker Verification Feature Box */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mb-14">
          <div className="p-6 rounded-2xl bg-slate-900/90 border border-slate-800 flex flex-col justify-between">
            <div>
              <div className="w-12 h-12 rounded-xl bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 flex items-center justify-center mb-4">
                <QrCode className="w-6 h-6" />
              </div>
              <h3 className="text-lg font-bold text-white mb-2">CSIR-NEERI Green QR Verification</h3>
              <p className="text-xs text-slate-400 leading-relaxed">
                Every genuine green cracker box features a green logo and a tamper-evident QR code. Scan it using the CSIR-NEERI app to verify the manufacturer license and emission test results before lighting.
              </p>
            </div>
            <div className="mt-4 pt-4 border-t border-slate-800 text-xs text-emerald-400 font-semibold flex items-center gap-1.5">
              <span>● 100% QR Scannable Boxes at Store</span>
            </div>
          </div>

          <div className="p-6 rounded-2xl bg-slate-900/90 border border-slate-800 flex flex-col justify-between">
            <div>
              <div className="w-12 h-12 rounded-xl bg-amber-500/10 border border-amber-500/30 text-amber-400 flex items-center justify-center mb-4">
                <Sparkles className="w-6 h-6" />
              </div>
              <h3 className="text-lg font-bold text-white mb-2">SWAS, STAR & SAFAL Formulas</h3>
              <p className="text-xs text-slate-400 leading-relaxed">
                Formulated using Safe Water Releaser (SWAS), Safe Thermite Cracker (STAR), and Safe Minimal Aluminium (SAFAL) scientific patents that trap particulate matter and eliminate harmful chemical odors.
              </p>
            </div>
            <div className="mt-4 pt-4 border-t border-slate-800 text-xs text-amber-400 font-semibold flex items-center gap-1.5">
              <span>● Free of Barium, Lead, and Antimony</span>
            </div>
          </div>

          <div className="p-6 rounded-2xl bg-slate-900/90 border border-slate-800 flex flex-col justify-between">
            <div>
              <div className="w-12 h-12 rounded-xl bg-sky-500/10 border border-sky-500/30 text-sky-400 flex items-center justify-center mb-4">
                <AlertOctagon className="w-6 h-6" />
              </div>
              <h3 className="text-lg font-bold text-white mb-2">Standard Decibel Compliance</h3>
              <p className="text-xs text-slate-400 leading-relaxed">
                All sound crackers strictly comply with the Ministry of Environment and PESO mandated limit of 125 dB at a distance of 4 meters, keeping neighborhood celebrations safe and enjoyable.
              </p>
            </div>
            <div className="mt-4 pt-4 border-t border-slate-800 text-xs text-sky-400 font-semibold flex items-center gap-1.5">
              <span>● Permissible Decibels strictly checked</span>
            </div>
          </div>
        </div>

        {/* 6 Essential Lighting Safety Rules */}
        <div>
          <h3 className="text-xl font-bold text-white text-center mb-8">
            Essential Fireworks Safety Dos & Don&apos;ts
          </h3>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            <div className="flex items-start gap-3.5 p-4 rounded-xl bg-slate-900/60 border border-slate-800">
              <div className="w-8 h-8 rounded-lg bg-emerald-500/10 text-emerald-400 flex items-center justify-center shrink-0">
                <Droplet className="w-4 h-4" />
              </div>
              <div>
                <h4 className="text-sm font-bold text-slate-200 mb-1">Bucket of Water & Sand</h4>
                <p className="text-xs text-slate-400">
                  Always keep 2 buckets of clean water and dry sand nearby to extinguish used sparklers and soak misfired crackers safely.
                </p>
              </div>
            </div>

            <div className="flex items-start gap-3.5 p-4 rounded-xl bg-slate-900/60 border border-slate-800">
              <div className="w-8 h-8 rounded-lg bg-amber-500/10 text-amber-400 flex items-center justify-center shrink-0">
                <Flame className="w-4 h-4" />
              </div>
              <div>
                <h4 className="text-sm font-bold text-slate-200 mb-1">Use an Extended Agarbatti</h4>
                <p className="text-xs text-slate-400">
                  Ignite fuses at arm&apos;s length using a long incense stick (agarbatti) or safety sparkler candle. Never use open matchsticks or lighters directly over the firework.
                </p>
              </div>
            </div>

            <div className="flex items-start gap-3.5 p-4 rounded-xl bg-slate-900/60 border border-slate-800">
              <div className="w-8 h-8 rounded-lg bg-sky-500/10 text-sky-400 flex items-center justify-center shrink-0">
                <Users className="w-4 h-4" />
              </div>
              <div>
                <h4 className="text-sm font-bold text-slate-200 mb-1">Mandatory Adult Supervision</h4>
                <p className="text-xs text-slate-400">
                  Children under 16 years must never handle or ignite fireworks without continuous, direct adult guidance and supervision.
                </p>
              </div>
            </div>

            <div className="flex items-start gap-3.5 p-4 rounded-xl bg-slate-900/60 border border-slate-800">
              <div className="w-8 h-8 rounded-lg bg-rose-500/10 text-rose-400 flex items-center justify-center shrink-0">
                <AlertOctagon className="w-4 h-4" />
              </div>
              <div>
                <h4 className="text-sm font-bold text-slate-200 mb-1">Never Relight a Dud</h4>
                <p className="text-xs text-slate-400">
                  If a cracker fails to ignite, never lean over it or attempt to relight it. Wait 15 minutes, then immerse it in a bucket of water.
                </p>
              </div>
            </div>

            <div className="flex items-start gap-3.5 p-4 rounded-xl bg-slate-900/60 border border-slate-800">
              <div className="w-8 h-8 rounded-lg bg-purple-500/10 text-purple-400 flex items-center justify-center shrink-0">
                <ShieldCheck className="w-4 h-4" />
              </div>
              <div>
                <h4 className="text-sm font-bold text-slate-200 mb-1">Wear Cotton Clothing</h4>
                <p className="text-xs text-slate-400">
                  Wear well-fitted, pure cotton garments and closed footwear. Avoid loose synthetic, silk, or polyester clothing near fireworks.
                </p>
              </div>
            </div>

            <div className="flex items-start gap-3.5 p-4 rounded-xl bg-slate-900/60 border border-slate-800">
              <div className="w-8 h-8 rounded-lg bg-teal-500/10 text-teal-400 flex items-center justify-center shrink-0">
                <Sparkles className="w-4 h-4" />
              </div>
              <div>
                <h4 className="text-sm font-bold text-slate-200 mb-1">Only Open Outdoor Grounds</h4>
                <p className="text-xs text-slate-400">
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

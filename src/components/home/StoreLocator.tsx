import React from 'react';
import { Clock, Phone, MessageSquare, Sparkles, ShieldCheck, Calendar } from 'lucide-react';
import { BUSINESS_CONFIG } from '@/lib/data/sample-products';

export function StoreLocator() {
  const whatsappUrl = `https://wa.me/${BUSINESS_CONFIG.whatsapp.replace(/[^\d]/g, '')}?text=${encodeURIComponent(
    `Hello ${BUSINESS_CONFIG.name}! I would like to inquire about festive fireworks pre-booking and price lists.`
  )}`;

  return (
    <section id="seasonal-outlet" className="py-12 sm:py-16 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      <div className="bg-gradient-to-br from-slate-900 to-slate-950 border border-slate-800 rounded-2xl sm:rounded-3xl p-5 sm:p-8 lg:p-12 overflow-hidden relative shadow-2xl">
        {/* Ambient glow */}
        <div className="absolute top-0 right-0 w-80 sm:w-96 h-80 sm:h-96 bg-amber-500/5 rounded-full blur-[100px] pointer-events-none" />

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 sm:gap-10 items-center">
          {/* Seasonal Outlet Information */}
          <div className="space-y-4 sm:space-y-6">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-amber-500/10 border border-amber-500/30 text-amber-400 text-xs font-semibold">
              <Sparkles className="w-4 h-4" />
              <span>Diwali 2026 Seasonal Festive Counter</span>
            </div>

            <h2 className="text-2xl xs:text-3xl sm:text-4xl font-extrabold text-white tracking-tight">
              Seasonal Festive Counter & Inquiries
            </h2>

            <p className="text-xs sm:text-sm text-slate-300 leading-relaxed">
              <strong>{BUSINESS_CONFIG.name}</strong> operates exclusively for festive seasons to bring you factory-fresh, genuine Sivakasi green crackers. Pre-book your festive hampers early to avoid the peak Diwali rush and secure guaranteed availability.
            </p>

            <div className="space-y-3 sm:space-y-4 text-xs sm:text-sm">
              <div className="flex items-start gap-3 p-3.5 sm:p-4 rounded-xl bg-slate-950/80 border border-slate-800/80">
                <Calendar className="w-5 h-5 text-amber-400 shrink-0 mt-0.5" />
                <div>
                  <h4 className="font-bold text-white mb-0.5">Seasonal Pre-Booking Active</h4>
                  <p className="text-slate-300 text-xs leading-relaxed">
                    Now accepting advance festive inquiries and family combo pre-orders for Diwali, weddings, and community celebrations.
                  </p>
                  <p className="text-xs text-amber-400/90 mt-1 font-semibold">Special discounts on early festive bulk requests!</p>
                </div>
              </div>

              <div className="flex items-start gap-3 p-3.5 sm:p-4 rounded-xl bg-slate-950/80 border border-slate-800/80">
                <Clock className="w-5 h-5 text-emerald-400 shrink-0 mt-0.5" />
                <div>
                  <h4 className="font-bold text-white mb-0.5">Festive Season Operating Timings</h4>
                  <p className="text-emerald-300 text-xs font-semibold">
                    {BUSINESS_CONFIG.seasonalOperatingNote}
                  </p>
                  <p className="text-xs text-slate-400 mt-0.5">
                    Direct phone & WhatsApp support available daily.
                  </p>
                </div>
              </div>

              <div className="flex items-start gap-3 p-3.5 sm:p-4 rounded-xl bg-slate-950/80 border border-slate-800/80">
                <ShieldCheck className="w-5 h-5 text-sky-400 shrink-0 mt-0.5" />
                <div>
                  <h4 className="font-bold text-white mb-0.5">PESO Statutory Seasonal License</h4>
                  <p className="text-slate-300 text-xs">
                    License Reference: <span className="font-mono text-amber-300">{BUSINESS_CONFIG.pesoLicense}</span>
                  </p>
                  <p className="text-xs text-slate-400">100% CSIR-NEERI Green Cracker Certified</p>
                </div>
              </div>
            </div>

            {/* Quick Action Buttons */}
            <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3 pt-2">
              <a
                href={`tel:${BUSINESS_CONFIG.phone.replace(/\s+/g, '')}`}
                className="inline-flex items-center justify-center gap-2 bg-slate-800 hover:bg-slate-700 text-white text-xs font-bold px-5 py-3 rounded-xl border border-slate-700 transition-colors"
              >
                <Phone className="w-4 h-4 text-emerald-400" />
                <span>Call Directly: {BUSINESS_CONFIG.phone}</span>
              </a>

              <a
                href={whatsappUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center justify-center gap-2 bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-bold px-5 py-3 rounded-xl shadow-lg shadow-emerald-600/20 transition-colors"
              >
                <MessageSquare className="w-4 h-4" />
                <span>WhatsApp: {BUSINESS_CONFIG.phone}</span>
              </a>
            </div>
          </div>

          {/* Seasonal Festive Pre-Booking Benefits Card */}
          <div className="relative rounded-2xl overflow-hidden border border-slate-800 bg-slate-950 p-5 sm:p-6 flex flex-col justify-between min-h-[360px]">
            <div>
              <div className="flex items-center justify-between mb-4 flex-wrap gap-2">
                <span className="text-xs font-bold text-amber-400 uppercase tracking-wider flex items-center gap-1.5">
                  <Sparkles className="w-4 h-4" />
                  <span>Why Pre-Book With Us?</span>
                </span>
                <span className="text-xs bg-amber-950 text-amber-400 border border-amber-500/30 px-2.5 py-0.5 rounded-full font-semibold">
                  Festive Special 2026
                </span>
              </div>

              <h3 className="text-lg sm:text-xl font-bold text-white mb-3">Seasonal Pre-Order Benefits</h3>
              <ul className="space-y-3 text-xs text-slate-300 mb-6">
                <li className="flex items-start gap-2.5">
                  <span className="w-5 h-5 rounded-full bg-amber-500/10 text-amber-400 flex items-center justify-center shrink-0 font-bold text-[11px]">✓</span>
                  <span><strong>Zero Last-Minute Rush:</strong> Get your entire festive requirement reserved well before peak festival days.</span>
                </li>
                <li className="flex items-start gap-2.5">
                  <span className="w-5 h-5 rounded-full bg-emerald-500/10 text-emerald-400 flex items-center justify-center shrink-0 font-bold text-[11px]">✓</span>
                  <span><strong>Guaranteed Factory-Fresh Quality:</strong> Sourced straight from certified Sivakasi manufacturers with authentic QR seals.</span>
                </li>
                <li className="flex items-start gap-2.5">
                  <span className="w-5 h-5 rounded-full bg-sky-500/10 text-sky-400 flex items-center justify-center shrink-0 font-bold text-[11px]">✓</span>
                  <span><strong>Customized Family Combos:</strong> Tailored assortments of sparklers, pots, chakkars, and aerials matching your specific budget.</span>
                </li>
              </ul>
            </div>

            {/* Direct Contact Action Card */}
            <div className="p-3.5 sm:p-4 rounded-xl bg-slate-900 border border-slate-800 text-center">
              <p className="text-xs text-slate-300 mb-1.5 font-semibold">
                Have questions or need a custom price quotation?
              </p>
              <p className="text-[11px] text-slate-400 mb-3">
                Reach out directly via phone or WhatsApp at <strong className="text-white">{BUSINESS_CONFIG.phone}</strong>
              </p>
              <a
                href={whatsappUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center justify-center gap-2 w-full bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500 text-white font-bold py-2.5 rounded-xl text-xs transition-colors"
              >
                <MessageSquare className="w-4 h-4" />
                <span>Message on WhatsApp Now</span>
              </a>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

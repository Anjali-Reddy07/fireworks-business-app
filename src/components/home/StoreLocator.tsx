import React from 'react';
import { Clock, Phone, MessageSquare, Sparkles, ShieldCheck, Calendar } from 'lucide-react';
import { BUSINESS_CONFIG } from '@/lib/data/sample-products';

export function StoreLocator() {
  const whatsappUrl = `https://wa.me/${BUSINESS_CONFIG.whatsapp.replace(/[^\d]/g, '')}?text=${encodeURIComponent(
    `Hello ${BUSINESS_CONFIG.name}! I would like to inquire about festive fireworks pre-booking and price lists.`
  )}`;

  return (
    <section id="seasonal-outlet" className="py-12 sm:py-16 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      <div className="bg-gradient-to-br from-blue-50/80 via-white to-blue-50/40 border border-blue-200 rounded-3xl p-6 sm:p-8 lg:p-12 overflow-hidden relative shadow-md">
        {/* Ambient glow */}
        <div className="absolute top-0 right-0 w-80 sm:w-96 h-80 sm:h-96 bg-blue-500/10 rounded-full blur-[100px] pointer-events-none" />

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 sm:gap-10 items-center">
          {/* Seasonal Outlet Information */}
          <div className="space-y-4 sm:space-y-6">
            <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-blue-100 border border-blue-200 text-blue-800 text-xs font-bold">
              <Sparkles className="w-4 h-4 text-blue-600" />
              <span>Diwali 2026 Seasonal Festive Counter</span>
            </div>

            <h2 className="text-2xl xs:text-3xl sm:text-4xl font-black text-slate-900 tracking-tight">
              Seasonal Festive Counter & Inquiries
            </h2>

            <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">
              <strong>{BUSINESS_CONFIG.name}</strong> operates exclusively for festive seasons to bring you factory-fresh, genuine Sivakasi green crackers. Pre-book your festive hampers early to avoid the peak Diwali rush and secure guaranteed availability.
            </p>

            <div className="space-y-3 sm:space-y-4 text-xs sm:text-sm">
              <div className="flex items-start gap-3 p-4 rounded-2xl bg-white border border-blue-100 shadow-xs">
                <Calendar className="w-5 h-5 text-blue-600 shrink-0 mt-0.5" />
                <div>
                  <h4 className="font-bold text-slate-900 mb-0.5">Seasonal Pre-Booking Active</h4>
                  <p className="text-slate-600 text-xs leading-relaxed">
                    Now accepting advance festive inquiries and family combo pre-orders for Diwali, weddings, and community celebrations.
                  </p>
                  <p className="text-xs text-blue-600 mt-1 font-bold">Special discounts on early festive bulk requests!</p>
                </div>
              </div>

              <div className="flex items-start gap-3 p-4 rounded-2xl bg-white border border-blue-100 shadow-xs">
                <Clock className="w-5 h-5 text-emerald-600 shrink-0 mt-0.5" />
                <div>
                  <h4 className="font-bold text-slate-900 mb-0.5">Festive Season Operating Timings</h4>
                  <p className="text-emerald-700 text-xs font-bold">
                    {BUSINESS_CONFIG.seasonalOperatingNote}
                  </p>
                  <p className="text-xs text-slate-500 mt-0.5">
                    Direct phone & WhatsApp support available daily.
                  </p>
                </div>
              </div>

              <div className="flex items-start gap-3 p-4 rounded-2xl bg-white border border-blue-100 shadow-xs">
                <ShieldCheck className="w-5 h-5 text-blue-600 shrink-0 mt-0.5" />
                <div>
                  <h4 className="font-bold text-slate-900 mb-0.5">PESO Statutory Seasonal License</h4>
                  <p className="text-slate-600 text-xs">
                    License Reference: <span className="font-mono text-blue-700 font-bold">{BUSINESS_CONFIG.pesoLicense}</span>
                  </p>
                  <p className="text-xs text-slate-500">100% CSIR-NEERI Green Cracker Certified</p>
                </div>
              </div>
            </div>

            {/* Quick Action Buttons */}
            <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3 pt-2">
              <a
                href={`tel:${BUSINESS_CONFIG.phone.replace(/\s+/g, '')}`}
                className="inline-flex items-center justify-center gap-2 px-5 py-3 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs shadow-md shadow-blue-500/20 transition-all cursor-pointer"
              >
                <Phone className="w-4 h-4" />
                <span>Call Hotline: {BUSINESS_CONFIG.phone}</span>
              </a>

              <a
                href={whatsappUrl}
                target="_blank"
                rel="noreferrer"
                className="inline-flex items-center justify-center gap-2 px-5 py-3 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs shadow-md shadow-emerald-500/20 transition-all cursor-pointer"
              >
                <MessageSquare className="w-4 h-4" />
                <span>Chat on WhatsApp</span>
              </a>
            </div>
          </div>

          {/* Location Card Details */}
          <div className="p-6 sm:p-8 rounded-3xl bg-white border border-blue-100 shadow-sm space-y-4">
            <h3 className="text-base sm:text-lg font-bold text-slate-900">
              Seasonal Retail Storefront Location
            </h3>
            <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">
              <strong>{BUSINESS_CONFIG.address}</strong><br />
              {BUSINESS_CONFIG.city}, {BUSINESS_CONFIG.state} - {BUSINESS_CONFIG.pincode}
            </p>
            <div className="pt-3 border-t border-slate-100 space-y-1.5 text-xs text-slate-500">
              <p>● Authorized temporary storage & retail dispensing point</p>
              <p>● Fire-safe open counter layout with safety sand buckets</p>
              <p>● Digital UPI, Cash, and Card payments accepted at counter</p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

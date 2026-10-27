import React from 'react';
import { MapPin, Clock, Phone, MessageSquare, Navigation, ShieldCheck } from 'lucide-react';
import { BUSINESS_CONFIG } from '@/lib/data/sample-products';

export function StoreLocator() {
  const whatsappUrl = `https://wa.me/${BUSINESS_CONFIG.whatsapp.replace(/[^\d]/g, '')}?text=${encodeURIComponent(
    `Hello Sri Vijaya Fireworks! I am planning a store visit and would like to inquire about festive stock availability.`
  )}`;

  return (
    <section id="store-location" className="py-16 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      <div className="bg-gradient-to-br from-slate-900 to-slate-950 border border-slate-800 rounded-3xl p-6 sm:p-10 lg:p-12 overflow-hidden relative shadow-2xl">
        {/* Ambient glow */}
        <div className="absolute top-0 right-0 w-96 h-96 bg-amber-500/5 rounded-full blur-[100px] pointer-events-none" />

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 items-center">
          {/* Store Information */}
          <div className="space-y-6">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-amber-500/10 border border-amber-500/30 text-amber-400 text-xs font-semibold">
              <MapPin className="w-4 h-4" />
              <span>Licensed Physical Retail Showroom</span>
            </div>

            <h2 className="text-3xl sm:text-4xl font-extrabold text-white tracking-tight">
              Visit Our Sivakasi Retail Showroom
            </h2>

            <p className="text-sm text-slate-300 leading-relaxed">
              We welcome you and your family to visit our fully licensed showroom. Inspect packaging, verify green cracker QR authenticity, and enjoy factory-direct rates with safe, air-conditioned parking.
            </p>

            <div className="space-y-4 text-sm">
              <div className="flex items-start gap-3.5 p-4 rounded-xl bg-slate-950/80 border border-slate-800/80">
                <MapPin className="w-5 h-5 text-amber-400 shrink-0 mt-0.5" />
                <div>
                  <h4 className="font-bold text-white mb-0.5">Physical Store Address</h4>
                  <p className="text-slate-300 text-xs leading-relaxed">
                    {BUSINESS_CONFIG.address}, {BUSINESS_CONFIG.city}, {BUSINESS_CONFIG.state} - {BUSINESS_CONFIG.pincode}
                  </p>
                  <p className="text-xs text-slate-500 mt-1">Landmark: 200m from Sivakasi Main Bus Terminus & Bypass Junction</p>
                </div>
              </div>

              <div className="flex items-start gap-3.5 p-4 rounded-xl bg-slate-950/80 border border-slate-800/80">
                <Clock className="w-5 h-5 text-emerald-400 shrink-0 mt-0.5" />
                <div>
                  <h4 className="font-bold text-white mb-0.5">Showroom Operating Hours</h4>
                  <p className="text-emerald-300 text-xs font-semibold">
                    {BUSINESS_CONFIG.operatingHours}
                  </p>
                  <p className="text-xs text-slate-400 mt-0.5">
                    Open all 7 days during festive season. Dedicated staff for family guidance.
                  </p>
                </div>
              </div>

              <div className="flex items-start gap-3.5 p-4 rounded-xl bg-slate-950/80 border border-slate-800/80">
                <ShieldCheck className="w-5 h-5 text-sky-400 shrink-0 mt-0.5" />
                <div>
                  <h4 className="font-bold text-white mb-0.5">PESO Statutory Retail License</h4>
                  <p className="text-slate-300 text-xs">
                    License No: <span className="font-mono text-amber-300">{BUSINESS_CONFIG.pesoLicense}</span>
                  </p>
                  <p className="text-xs text-slate-400">GSTIN: {BUSINESS_CONFIG.gstin}</p>
                </div>
              </div>
            </div>

            {/* Quick Action Buttons */}
            <div className="flex flex-wrap items-center gap-4 pt-2">
              <a
                href={`tel:${BUSINESS_CONFIG.phone.replace(/\s+/g, '')}`}
                className="inline-flex items-center gap-2 bg-slate-800 hover:bg-slate-700 text-white text-xs font-bold px-5 py-3 rounded-xl border border-slate-700 transition-colors"
              >
                <Phone className="w-4 h-4 text-emerald-400" />
                <span>Call Store: {BUSINESS_CONFIG.phone}</span>
              </a>

              <a
                href={whatsappUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-bold px-5 py-3 rounded-xl shadow-lg shadow-emerald-600/20 transition-colors"
              >
                <MessageSquare className="w-4 h-4" />
                <span>Chat on WhatsApp</span>
              </a>
            </div>
          </div>

          {/* Interactive Directions & Visual Map Card */}
          <div className="relative rounded-2xl overflow-hidden border border-slate-800 bg-slate-950 p-6 flex flex-col justify-between min-h-[380px]">
            <div>
              <div className="flex items-center justify-between mb-4">
                <span className="text-xs font-bold text-amber-400 uppercase tracking-wider flex items-center gap-1.5">
                  <Navigation className="w-4 h-4" />
                  <span>Driving Directions</span>
                </span>
                <span className="text-xs bg-emerald-950 text-emerald-400 border border-emerald-500/30 px-2.5 py-0.5 rounded-full font-semibold">
                  Free Customer Parking
                </span>
              </div>

              <h3 className="text-xl font-bold text-white mb-2">How to Reach Us</h3>
              <ul className="space-y-3 text-xs text-slate-300 mb-6">
                <li className="flex items-start gap-2">
                  <span className="w-5 h-5 rounded-full bg-slate-800 text-amber-400 flex items-center justify-center shrink-0 font-bold text-[10px]">1</span>
                  <span>From Madurai Airport (IXM): 72 km via NH44 & SH41 (~1 hr 25 mins drive).</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="w-5 h-5 rounded-full bg-slate-800 text-amber-400 flex items-center justify-center shrink-0 font-bold text-[10px]">2</span>
                  <span>From Virudhunagar Junction: 25 km via Sivakasi Main Road.</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="w-5 h-5 rounded-full bg-slate-800 text-amber-400 flex items-center justify-center shrink-0 font-bold text-[10px]">3</span>
                  <span>From Sivakasi Railway Station: 2.5 km (Autos & Taxis readily available).</span>
                </li>
              </ul>
            </div>

            {/* Map Action Box */}
            <div className="p-4 rounded-xl bg-slate-900 border border-slate-800 text-center">
              <p className="text-xs text-slate-400 mb-3">
                Tap below to open Google Maps for direct turn-by-turn navigation:
              </p>
              <a
                href={`https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(
                  `${BUSINESS_CONFIG.name}, ${BUSINESS_CONFIG.address}, ${BUSINESS_CONFIG.city}`
                )}`}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center justify-center gap-2 w-full bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-400 hover:to-amber-500 text-slate-950 font-bold py-2.5 rounded-lg text-xs transition-colors"
              >
                <Navigation className="w-4 h-4" />
                <span>Open in Google Maps Navigation</span>
              </a>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

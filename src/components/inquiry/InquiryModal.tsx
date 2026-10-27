'use client';

import React, { useState } from 'react';
import { X, Calendar, Phone, User, Mail, MessageSquare, CheckCircle, ShieldCheck, AlertCircle, Loader2 } from 'lucide-react';
import { Product, RequirementType } from '@/types';
import { BUSINESS_CONFIG } from '@/lib/data/sample-products';

interface InquiryModalProps {
  isOpen: boolean;
  onClose: () => void;
  preselectedProduct?: Product | null;
}

export function InquiryModal({ isOpen, onClose, preselectedProduct }: InquiryModalProps) {
  const [customerName, setCustomerName] = useState('');
  const [phone, setPhone] = useState('');
  const [email, setEmail] = useState('');
  const [visitDate, setVisitDate] = useState('');
  const [requirementType, setRequirementType] = useState<RequirementType>(
    preselectedProduct ? 'Diwali / Festive Family Pack' : 'General In-Store Visit'
  );
  const [notes, setNotes] = useState(
    preselectedProduct ? `Inquiring about availability of: ${preselectedProduct.name} (Counter Rate: ₹${preselectedProduct.retailPrice})` : ''
  );

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [successRef, setSuccessRef] = useState<string | null>(null);

  if (!isOpen) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    // Validation
    if (!customerName.trim()) {
      setError('Please enter your full name');
      return;
    }

    const cleanPhone = phone.trim().replace(/[^\d]/g, '');
    if (cleanPhone.length < 10) {
      setError('Please provide a valid 10-digit Indian mobile number so our team can send your visit confirmation.');
      return;
    }

    if (!visitDate) {
      setError('Please select an estimated store visit date');
      return;
    }

    setLoading(true);

    try {
      const response = await fetch('/api/inquiries', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          customerName: customerName.trim(),
          phone: cleanPhone,
          email: email.trim() || undefined,
          visitDate,
          requirementType,
          notes: notes.trim() || undefined,
          productId: preselectedProduct?.id,
          productName: preselectedProduct?.name,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Failed to submit inquiry. Please try again.');
      }

      setSuccessRef(data.refId);
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : 'Something went wrong. Please call us directly.';
      setError(msg);
    } finally {
      setLoading(false);
    }
  };

  const handleResetAndClose = () => {
    setSuccessRef(null);
    setError(null);
    setCustomerName('');
    setPhone('');
    setEmail('');
    setVisitDate('');
    setNotes('');
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/85 backdrop-blur-md animate-in fade-in duration-200">
      <div 
        className="relative w-full max-w-xl bg-slate-900 border border-slate-800 rounded-3xl overflow-hidden shadow-2xl max-h-[92vh] flex flex-col"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="flex items-center justify-between p-5 border-b border-slate-800 bg-slate-950/80">
          <div>
            <span className="text-xs font-bold text-amber-400 uppercase tracking-wider block">
              Direct Store Visit & Stock Reservation
            </span>
            <h3 className="text-xl font-bold text-white">Book Store Visit / Inquire Availability</h3>
          </div>
          <button
            onClick={handleResetAndClose}
            className="p-1.5 rounded-full text-slate-400 hover:text-white hover:bg-slate-800 transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Modal Body */}
        <div className="overflow-y-auto p-6">
          {successRef ? (
            /* Success confirmation screen */
            <div className="text-center py-6 space-y-4">
              <div className="w-16 h-16 rounded-full bg-emerald-500/20 text-emerald-400 flex items-center justify-center mx-auto border border-emerald-500/40">
                <CheckCircle className="w-8 h-8" />
              </div>
              <h4 className="text-2xl font-extrabold text-white">Inquiry Confirmed!</h4>
              <div className="p-4 rounded-2xl bg-slate-950 border border-amber-500/30 max-w-sm mx-auto">
                <span className="text-xs text-slate-400 block mb-1">Your Reference Number:</span>
                <span className="font-mono text-xl font-extrabold text-amber-400 tracking-wider">
                  {successRef}
                </span>
              </div>
              <p className="text-xs text-slate-300 max-w-md mx-auto leading-relaxed">
                Thank you, <strong>{customerName}</strong>. Our staff has been alerted via WhatsApp. We will ensure stock is set aside for your planned visit on <strong>{visitDate}</strong>.
              </p>
              <div className="p-3 rounded-xl bg-slate-800/80 text-[11px] text-slate-400 max-w-md mx-auto text-left">
                <strong>Store Location:</strong> {BUSINESS_CONFIG.address}, {BUSINESS_CONFIG.city} ({BUSINESS_CONFIG.operatingHours}).
              </div>
              <button
                onClick={handleResetAndClose}
                className="mt-4 px-6 py-2.5 rounded-xl bg-amber-500 text-slate-950 font-bold text-xs"
              >
                Done
              </button>
            </div>
          ) : (
            /* Form */
            <form onSubmit={handleSubmit} className="space-y-4">
              {/* Statutory Note */}
              <div className="p-3 rounded-xl bg-amber-950/30 border border-amber-500/20 text-amber-300 text-xs flex items-center gap-2">
                <ShieldCheck className="w-4 h-4 shrink-0 text-amber-400" />
                <span>
                  No online payment is collected. Products will be inspected and collected in-person at our Sivakasi retail store.
                </span>
              </div>

              {error && (
                <div className="p-3 rounded-xl bg-rose-950/40 border border-rose-500/30 text-rose-300 text-xs flex items-center gap-2">
                  <AlertCircle className="w-4 h-4 shrink-0 text-rose-400" />
                  <span>{error}</span>
                </div>
              )}

              {/* Name & Phone */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="text-xs font-semibold text-slate-300 mb-1.5 flex items-center gap-1.5">
                    <User className="w-3.5 h-3.5 text-amber-400" />
                    <span>Your Full Name *</span>
                  </label>
                  <input
                    type="text"
                    required
                    value={customerName}
                    onChange={(e) => setCustomerName(e.target.value)}
                    placeholder="e.g. Senthil Nathan"
                    className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3.5 py-2.5 text-sm text-white placeholder-slate-500 focus:outline-none focus:border-amber-500"
                  />
                </div>

                <div>
                  <label className="text-xs font-semibold text-slate-300 mb-1.5 flex items-center gap-1.5">
                    <Phone className="w-3.5 h-3.5 text-emerald-400" />
                    <span>Mobile Number *</span>
                  </label>
                  <input
                    type="tel"
                    required
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    placeholder="10-digit mobile number"
                    className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3.5 py-2.5 text-sm text-white placeholder-slate-500 focus:outline-none focus:border-amber-500"
                  />
                </div>
              </div>

              {/* Email & Date */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="text-xs font-semibold text-slate-300 mb-1.5 flex items-center gap-1.5">
                    <Mail className="w-3.5 h-3.5 text-sky-400" />
                    <span>Email (Optional)</span>
                  </label>
                  <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="name@gmail.com"
                    className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3.5 py-2.5 text-sm text-white placeholder-slate-500 focus:outline-none focus:border-amber-500"
                  />
                </div>

                <div>
                  <label className="text-xs font-semibold text-slate-300 mb-1.5 flex items-center gap-1.5">
                    <Calendar className="w-3.5 h-3.5 text-amber-400" />
                    <span>Planned Store Visit Date *</span>
                  </label>
                  <input
                    type="date"
                    required
                    min="2026-10-01"
                    value={visitDate}
                    onChange={(e) => setVisitDate(e.target.value)}
                    className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3.5 py-2.5 text-sm text-white placeholder-slate-500 focus:outline-none focus:border-amber-500"
                  />
                </div>
              </div>

              {/* Requirement Category */}
              <div>
                <label className="text-xs font-semibold text-slate-300 mb-1.5 block">
                  Requirement Category
                </label>
                <select
                  value={requirementType}
                  onChange={(e) => setRequirementType(e.target.value as RequirementType)}
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3.5 py-2.5 text-sm text-white focus:outline-none focus:border-amber-500"
                >
                  <option value="Diwali / Festive Family Pack">Diwali / Festive Family Assortment</option>
                  <option value="Wedding & Celebration">Wedding Reception & Grand Celebration</option>
                  <option value="Temple / Community Festival">Temple / Community Festival</option>
                  <option value="Institutional Bulk Purchase">Institutional / Corporate Bulk Inquiry</option>
                  <option value="General In-Store Visit">General Walk-in Store Visit</option>
                </select>
              </div>

              {/* Notes */}
              <div>
                <label className="text-xs font-semibold text-slate-300 mb-1.5 flex items-center gap-1.5">
                  <MessageSquare className="w-3.5 h-3.5 text-slate-400" />
                  <span>Items of Interest or Special Requests</span>
                </label>
                <textarea
                  rows={3}
                  value={notes}
                  onChange={(e) => setNotes(e.target.value)}
                  placeholder="e.g. Please keep 2 family gift boxes and kid-friendly electric sparklers reserved."
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3.5 py-2 text-sm text-white placeholder-slate-500 focus:outline-none focus:border-amber-500 resize-none"
                />
              </div>

              {/* Submit CTA */}
              <div className="pt-2">
                <button
                  type="submit"
                  disabled={loading}
                  className="w-full py-3 rounded-xl bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-400 hover:to-amber-500 text-slate-950 font-bold text-sm shadow-lg shadow-amber-500/20 transition-all flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50"
                >
                  {loading ? (
                    <>
                      <Loader2 className="w-4 h-4 animate-spin" />
                      <span>Sending Reservation...</span>
                    </>
                  ) : (
                    <span>Submit Store Visit Booking & Alert Store</span>
                  )}
                </button>
              </div>
            </form>
          )}
        </div>
      </div>
    </div>
  );
}

'use client';

import React, { useState } from 'react';
import { X, Calendar, Phone, User, Mail, MessageSquare, CheckCircle, ShieldCheck, AlertCircle, Loader2 } from 'lucide-react';
import { Product, RequirementType } from '@/types';
import { BUSINESS_CONFIG } from '@/lib/data/sample-products';
import { collection, addDoc } from 'firebase/firestore';
import { db } from '@/lib/firebase';

interface InquiryModalProps {
  isOpen: boolean;
  onClose: () => void;
  preselectedProduct?: Product | null;
}

export function InquiryModal({ isOpen, onClose, preselectedProduct }: InquiryModalProps) {
  const [customerName, setCustomerName] = useState('');
  const [phone, setPhone] = useState('');
  const [email, setEmail] = useState('');
  const [festivalDate, setFestivalDate] = useState('');
  const [requirementType, setRequirementType] = useState<RequirementType>(
    'Diwali Festive Family Pack'
  );
  const [customNotes, setCustomNotes] = useState<string | null>(null);
  const notes = customNotes ?? (
    preselectedProduct
      ? `Inquiring about price quote for: ${preselectedProduct.name} (Catalogue Rate: ₹${preselectedProduct.retailPrice})`
      : ''
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
      setError('Please provide a valid 10-digit Indian mobile number so our team can send your festive quotation.');
      return;
    }

    if (!festivalDate) {
      setError('Please select your celebration / festival date');
      return;
    }

    setLoading(true);
    try {
      // Build raw inquiry payload with null fallbacks for non-existent values
      const rawPayload = {
        customerName: customerName.trim(),
        phone: cleanPhone,
        email: email.trim() || null,
        festivalDate,
        requirementType,
        notes: notes.trim() || null,
        productId: preselectedProduct?.id || null,
        productName: preselectedProduct?.name || null,
        createdAt: new Date().toISOString(),
      };

      // Sanitize payload to strip any undefined values that Firestore rejects
      const sanitizedPayload = Object.fromEntries(
        Object.entries(rawPayload).filter(([, v]) => v !== undefined)
      );

      const docRef = await addDoc(collection(db, 'inquiries'), sanitizedPayload);
      setSuccessRef(docRef.id);

      // Trigger email notification safely
      try {
        await fetch('/api/send-email', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            type: 'inquiry',
            inquiry: {
              ...sanitizedPayload,
              email: email.trim() || '',
              notes: notes.trim() || '',
            },
          }),
        });
      } catch (emailErr) {
        console.warn('Email notification error (inquiry saved to Firestore):', emailErr);
      }
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
    setFestivalDate('');
    setCustomNotes(null);
    onClose();
  };

  return (
    <div 
      className="fixed inset-0 z-50 flex items-center justify-center p-2 sm:p-4 bg-slate-900/60 backdrop-blur-md animate-in fade-in duration-200"
      onClick={handleResetAndClose}
    >
      <div 
        className="relative w-full max-w-xl bg-white border border-slate-200 rounded-2xl sm:rounded-3xl overflow-hidden shadow-2xl max-h-[92vh] flex flex-col"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="flex items-center justify-between p-4 sm:p-5 border-b border-slate-100 bg-slate-50">
          <div>
            <span className="text-[11px] font-bold text-blue-600 uppercase tracking-wider block">
              Seasonal Pre-Booking & Quotation
            </span>
            <h3 className="text-base sm:text-xl font-bold text-slate-900">Festive Stock & Price Quote Inquiry</h3>
          </div>
          <button
            onClick={handleResetAndClose}
            className="p-1.5 rounded-full text-slate-400 hover:text-slate-700 hover:bg-slate-200/60 transition-colors cursor-pointer shrink-0"
            aria-label="Close modal"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Modal Body */}
        <div className="overflow-y-auto p-4 sm:p-6">
          {successRef ? (
            /* Success confirmation screen */
            <div className="text-center py-4 sm:py-6 space-y-4">
              <div className="w-14 h-14 sm:w-16 sm:h-16 rounded-full bg-emerald-50 text-emerald-600 flex items-center justify-center mx-auto border border-emerald-200">
                <CheckCircle className="w-7 h-7 sm:w-8 sm:h-8" />
              </div>
              <h4 className="text-xl sm:text-2xl font-extrabold text-slate-900">Festive Inquiry Confirmed!</h4>
              <div className="p-3.5 sm:p-4 rounded-2xl bg-slate-50 border border-blue-200 max-w-sm mx-auto">
                <span className="text-xs text-slate-500 block mb-1">Your Quote Reference ID:</span>
                <span className="font-mono text-lg sm:text-xl font-extrabold text-blue-600 tracking-wider">
                  {successRef}
                </span>
              </div>
              <p className="text-xs text-slate-600 max-w-md mx-auto leading-relaxed">
                Thank you, <strong>{customerName}</strong>! Our <strong>{BUSINESS_CONFIG.name}</strong> team has received your inquiry for <strong>{festivalDate}</strong>. We will share your festive quotation and available combo options via WhatsApp / Call.
              </p>
              <div className="p-3 rounded-xl bg-blue-50 border border-blue-100 text-[11px] text-blue-900 max-w-md mx-auto text-left">
                <strong>Need instant assistance?</strong> Call or message our team directly at <strong className="text-blue-700 font-bold">{BUSINESS_CONFIG.phone}</strong>.
              </div>
              <button
                onClick={handleResetAndClose}
                className="mt-4 w-full sm:w-auto px-6 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs cursor-pointer shadow-md shadow-blue-600/20"
              >
                Close
              </button>
            </div>
          ) : (
            /* Form */
            <form onSubmit={handleSubmit} className="space-y-3.5 sm:space-y-4">
              {/* Statutory Note */}
              <div className="p-3 rounded-xl bg-blue-50 border border-blue-200 text-blue-800 text-[11px] sm:text-xs flex items-center gap-2">
                <ShieldCheck className="w-4 h-4 shrink-0 text-blue-600" />
                <span>
                  No online payment collected. This inquiry reserves your festive stock and requests custom package rates.
                </span>
              </div>

              {error && (
                <div className="p-3 rounded-xl bg-rose-50 border border-rose-200 text-rose-700 text-xs flex items-center gap-2">
                  <AlertCircle className="w-4 h-4 shrink-0 text-rose-500" />
                  <span>{error}</span>
                </div>
              )}

              {/* Name & Phone */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4">
                <div>
                  <label className="text-xs font-semibold text-slate-700 mb-1 flex items-center gap-1.5">
                    <User className="w-3.5 h-3.5 text-blue-600" />
                    <span>Your Full Name *</span>
                  </label>
                  <input
                    type="text"
                    required
                    value={customerName}
                    onChange={(e) => setCustomerName(e.target.value)}
                    placeholder="e.g. Senthil Nathan"
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3.5 py-2.5 text-xs sm:text-sm text-slate-900 placeholder-slate-400 focus:outline-none focus:bg-white focus:border-blue-600"
                  />
                </div>

                <div>
                  <label className="text-xs font-semibold text-slate-700 mb-1 flex items-center gap-1.5">
                    <Phone className="w-3.5 h-3.5 text-emerald-600" />
                    <span>Mobile Number *</span>
                  </label>
                  <input
                    type="tel"
                    required
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    placeholder="10-digit mobile number"
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3.5 py-2.5 text-xs sm:text-sm text-slate-900 placeholder-slate-400 focus:outline-none focus:bg-white focus:border-blue-600 font-mono"
                  />
                </div>
              </div>

              {/* Email & Date */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4">
                <div>
                  <label className="text-xs font-semibold text-slate-700 mb-1 flex items-center gap-1.5">
                    <Mail className="w-3.5 h-3.5 text-blue-600" />
                    <span>Email (Optional)</span>
                  </label>
                  <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="name@gmail.com"
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3.5 py-2.5 text-xs sm:text-sm text-slate-900 placeholder-slate-400 focus:outline-none focus:bg-white focus:border-blue-600"
                  />
                </div>

                <div>
                  <label className="text-xs font-semibold text-slate-700 mb-1 flex items-center gap-1.5">
                    <Calendar className="w-3.5 h-3.5 text-blue-600" />
                    <span>Festival / Celebration Date *</span>
                  </label>
                  <input
                    type="date"
                    required
                    min="2026-10-01"
                    value={festivalDate}
                    onChange={(e) => setFestivalDate(e.target.value)}
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3.5 py-2.5 text-xs sm:text-sm text-slate-900 placeholder-slate-400 focus:outline-none focus:bg-white focus:border-blue-600"
                  />
                </div>
              </div>

              {/* Requirement Category */}
              <div>
                <label className="text-xs font-semibold text-slate-700 mb-1 block">
                  Requirement Category
                </label>
                <select
                  value={requirementType}
                  onChange={(e) => setRequirementType(e.target.value as RequirementType)}
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3.5 py-2.5 text-xs sm:text-sm text-slate-900 focus:outline-none focus:bg-white focus:border-blue-600"
                >
                  <option value="Diwali Festive Family Pack">Diwali Festive Family Assortment Pack</option>
                  <option value="Wedding & Celebration Special">Wedding & Celebration Grand Package</option>
                  <option value="Temple / Community Festival">Temple / Community Festival Requirement</option>
                  <option value="Corporate & Bulk Gift Hampers">Corporate & Institutional Bulk Hampers</option>
                  <option value="Custom Cracker Selection">Custom Selected Crackers List</option>
                </select>
              </div>

              {/* Notes */}
              <div>
                <label className="text-xs font-semibold text-slate-700 mb-1 flex items-center gap-1.5">
                  <MessageSquare className="w-3.5 h-3.5 text-slate-400" />
                  <span>Items of Interest, Budget, or Special Requests</span>
                </label>
                <textarea
                  rows={3}
                  value={notes}
                  onChange={(e) => setCustomNotes(e.target.value)}
                  placeholder="e.g. Please share quotation for 2 family gift hampers within ₹5,000 budget."
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3.5 py-2 text-xs sm:text-sm text-slate-900 placeholder-slate-400 focus:outline-none focus:bg-white focus:border-blue-600 resize-none"
                />
              </div>

              {/* Submit CTA */}
              <div className="pt-2">
                <button
                  type="submit"
                  disabled={loading}
                  className="w-full py-3 rounded-xl bg-gradient-to-r from-blue-600 via-indigo-600 to-blue-700 hover:from-blue-700 hover:to-indigo-700 text-white font-bold text-xs sm:text-sm shadow-md shadow-blue-600/25 transition-all flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50"
                >
                  {loading ? (
                    <>
                      <Loader2 className="w-4 h-4 animate-spin" />
                      <span>Sending Festive Inquiry...</span>
                    </>
                  ) : (
                    <span>Submit Festive Inquiry & Request Quote</span>
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

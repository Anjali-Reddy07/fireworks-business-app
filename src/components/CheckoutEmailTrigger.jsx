'use client';

import React, { useState } from 'react';
import {
  Sparkles,
  Send,
  Loader2,
  CheckCircle2,
  AlertCircle,
  ShoppingBag,
  User,
  Mail,
  FileText,
  ShieldCheck,
  RefreshCw,
} from 'lucide-react';

/**
 * CheckoutEmailTrigger Component
 * 
 * A Tailwind CSS styled checkout component with customer inputs,
 * order summary details, and a primary action button that triggers
 * the Resend email notification system.
 */
export default function CheckoutEmailTrigger({
  initialName = '',
  initialEmail = '',
  initialOrderDetails = null,
  onOrderSuccess = null,
}) {
  const [customerName, setCustomerName] = useState(initialName);
  const [customerEmail, setCustomerEmail] = useState(initialEmail);
  const [orderDetails, setOrderDetails] = useState(
    initialOrderDetails
      ? typeof initialOrderDetails === 'string'
        ? initialOrderDetails
        : JSON.stringify(initialOrderDetails, null, 2)
      : '• 30cm Royal Golden Sparklers (10 Pcs) × 2 (₹360)\n• Golden Mega Fountains (Anar Deluxe - 5 Pcs) × 1 (₹350)\n• Zamin Special Speed Chakkar (10 Pcs) × 1 (₹260)\nTotal: ₹970'
  );
  const [totalAmount, setTotalAmount] = useState('970');

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [successData, setSuccessData] = useState(null);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(null);
    setSuccessData(null);

    // Validation
    if (!customerName.trim()) {
      setError('Please provide your full name.');
      return;
    }

    if (!customerEmail.trim() || !customerEmail.includes('@') || !customerEmail.includes('.')) {
      setError('Please enter a valid email address.');
      return;
    }

    if (!orderDetails.trim()) {
      setError('Please provide order details.');
      return;
    }

    setLoading(true);

    try {
      // Build order payload
      const payload = {
        customerName: customerName.trim(),
        customerEmail: customerEmail.trim(),
        orderDetails: {
          summary: orderDetails.trim(),
          total: Number(totalAmount) || 970,
          festivalDate: '2026-11-01',
          items: [
            { name: '30cm Royal Golden Sparklers (10 Pcs)', quantity: 2, price: 180 },
            { name: 'Golden Mega Fountains (Anar Deluxe - 5 Pcs)', quantity: 1, price: 350 },
            { name: 'Zamin Special Speed Chakkar (10 Pcs)', quantity: 1, price: 260 },
          ],
        },
      };

      const res = await fetch('/api/send-email', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.error || 'Failed to send confirmation emails.');
      }

      setSuccessData(data);
      if (onOrderSuccess) {
        onOrderSuccess(data);
      }
    } catch (err) {
      console.error('[CheckoutEmailTrigger Error]:', err);
      setError(err instanceof Error ? err.message : 'An unexpected error occurred.');
    } finally {
      setLoading(false);
    }
  };

  const handleReset = () => {
    setSuccessData(null);
    setError(null);
  };

  return (
    <div className="w-full max-w-xl mx-auto bg-white border border-blue-100 rounded-3xl shadow-xl shadow-blue-500/5 p-6 sm:p-8 space-y-6">
      
      {/* Header */}
      <div className="flex items-center justify-between pb-4 border-b border-slate-100">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-2xl bg-gradient-to-tr from-blue-600 to-indigo-600 text-white flex items-center justify-center shadow-md shadow-blue-500/25">
            <Sparkles className="w-5 h-5" />
          </div>
          <div>
            <h3 className="text-base sm:text-lg font-black text-slate-900">
              Resend Order Notification
            </h3>
            <span className="text-[11px] font-semibold text-blue-600 block">
              Automated Customer Confirmation & Admin Alert
            </span>
          </div>
        </div>

        <span className="px-2.5 py-1 rounded-full text-[10px] font-bold bg-blue-50 border border-blue-200 text-blue-700 uppercase tracking-wider">
          Resend API
        </span>
      </div>

      {/* Success Notification */}
      {successData && (
        <div className="p-4 sm:p-5 rounded-2xl bg-emerald-50 border border-emerald-200 text-emerald-900 space-y-3 animate-in">
          <div className="flex items-center gap-2.5">
            <CheckCircle2 className="w-5 h-5 text-emerald-600 shrink-0" />
            <span className="font-bold text-sm">Order Placed & Confirmation Sent!</span>
          </div>

          <div className="text-xs space-y-1.5 text-emerald-800">
            <p>
              <strong>Order Reference ID:</strong> <span className="font-mono font-bold">{successData.orderId}</span>
            </p>
            <p>
              <strong>Customer Email:</strong> {successData.customerEmail}
            </p>
            <p>
              <strong>Admin Alert Recipient:</strong> {successData.adminRecipient}
            </p>
            {successData.delivery?.customerEmailId && (
              <p className="text-[11px] text-emerald-700">
                Resend Message ID: <code className="font-mono text-[10px] bg-emerald-100 px-1 py-0.5 rounded">{successData.delivery.customerEmailId}</code>
              </p>
            )}
          </div>

          <button
            onClick={handleReset}
            className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-semibold shadow-sm transition-colors cursor-pointer"
          >
            <RefreshCw className="w-3.5 h-3.5" />
            <span>Send Another Test</span>
          </button>
        </div>
      )}

      {/* Error Notification */}
      {error && (
        <div className="p-3.5 rounded-2xl bg-rose-50 border border-rose-200 text-rose-800 text-xs flex items-start gap-2.5 animate-in">
          <AlertCircle className="w-4 h-4 text-rose-600 shrink-0 mt-0.5" />
          <div className="space-y-1">
            <span className="font-bold block">Delivery Failed:</span>
            <span>{error}</span>
          </div>
        </div>
      )}

      {/* Checkout Form */}
      <form onSubmit={handleSubmit} className="space-y-4">
        {/* Customer Name */}
        <div>
          <label className="text-xs font-bold text-slate-700 mb-1.5 flex items-center gap-1.5">
            <User className="w-3.5 h-3.5 text-blue-600" />
            <span>Customer Name *</span>
          </label>
          <input
            type="text"
            required
            value={customerName}
            onChange={(e) => setCustomerName(e.target.value)}
            placeholder="e.g. Laxmi Reddy"
            className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3.5 py-2.5 text-xs text-slate-900 placeholder:text-slate-400 focus:outline-none focus:border-blue-500 focus:bg-white focus:ring-2 focus:ring-blue-500/10 transition-all"
          />
        </div>

        {/* Customer Email */}
        <div>
          <label className="text-xs font-bold text-slate-700 mb-1.5 flex items-center gap-1.5">
            <Mail className="w-3.5 h-3.5 text-blue-600" />
            <span>Customer Email * (Receives Confirmation)</span>
          </label>
          <input
            type="email"
            required
            value={customerEmail}
            onChange={(e) => setCustomerEmail(e.target.value)}
            placeholder="e.g. customer@example.com"
            className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3.5 py-2.5 text-xs text-slate-900 placeholder:text-slate-400 focus:outline-none focus:border-blue-500 focus:bg-white focus:ring-2 focus:ring-blue-500/10 transition-all"
          />
        </div>

        {/* Order Details */}
        <div>
          <label className="text-xs font-bold text-slate-700 mb-1.5 flex items-center justify-between">
            <span className="flex items-center gap-1.5">
              <FileText className="w-3.5 h-3.5 text-blue-600" />
              <span>Order Details & Fireworks Selection *</span>
            </span>
            <span className="text-[10px] text-slate-400 font-mono">Summary</span>
          </label>
          <textarea
            rows={4}
            required
            value={orderDetails}
            onChange={(e) => setOrderDetails(e.target.value)}
            placeholder="List crackers, quantities, and festive notes..."
            className="w-full bg-slate-50 border border-slate-200 rounded-xl p-3 text-xs text-slate-900 placeholder:text-slate-400 focus:outline-none focus:border-blue-500 focus:bg-white focus:ring-2 focus:ring-blue-500/10 transition-all font-mono"
          />
        </div>

        {/* Total Price */}
        <div>
          <label className="text-xs font-bold text-slate-700 mb-1.5 flex items-center gap-1.5">
            <ShoppingBag className="w-3.5 h-3.5 text-emerald-600" />
            <span>Estimated Total (₹)</span>
          </label>
          <div className="relative">
            <span className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400 font-bold text-xs">₹</span>
            <input
              type="number"
              value={totalAmount}
              onChange={(e) => setTotalAmount(e.target.value)}
              placeholder="Total amount"
              className="w-full bg-slate-50 border border-slate-200 rounded-xl pl-8 pr-3.5 py-2.5 text-xs text-slate-900 font-bold focus:outline-none focus:border-blue-500 focus:bg-white focus:ring-2 focus:ring-blue-500/10 transition-all"
            />
          </div>
        </div>

        {/* Trust & Compliance Badge */}
        <div className="p-3 rounded-xl bg-blue-50/70 border border-blue-200/80 text-[11px] text-blue-900 flex items-center gap-2">
          <ShieldCheck className="w-4 h-4 text-blue-600 shrink-0" />
          <span>Emails are dispatched from <strong>Fireworks Store &lt;onboarding@resend.dev&gt;</strong></span>
        </div>

        {/* Primary Action Button */}
        <button
          type="submit"
          disabled={loading}
          className="w-full py-3 px-4 rounded-xl bg-gradient-to-r from-blue-600 via-blue-700 to-indigo-700 hover:from-blue-500 hover:to-indigo-600 disabled:from-blue-300 disabled:to-indigo-300 text-white font-bold text-sm shadow-lg shadow-blue-500/25 hover:shadow-blue-500/35 transition-all duration-200 flex items-center justify-center gap-2 cursor-pointer disabled:cursor-not-allowed"
        >
          {loading ? (
            <>
              <Loader2 className="w-4 h-4 animate-spin" />
              <span>Sending Emails via Resend...</span>
            </>
          ) : (
            <>
              <Send className="w-4 h-4" />
              <span>Place Order & Send Confirmation</span>
            </>
          )}
        </button>
      </form>
    </div>
  );
}


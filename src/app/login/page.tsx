'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import {
  Sparkles,
  Lock,
  User,
  Mail,
  Phone,
  Eye,
  EyeOff,
  AlertCircle,
  Loader2,
  ArrowLeft,
  ShieldCheck,
  CheckCircle2,
  ShoppingBag,
} from 'lucide-react';
import { BUSINESS_CONFIG } from '@/lib/data/sample-products';

type CustomerMode = 'login' | 'signup';

export default function CustomerLoginPage() {
  const router = useRouter();
  const [customerMode, setCustomerMode] = useState<CustomerMode>('login');

  // Customer form states
  const [custName, setCustName] = useState('');
  const [custPhone, setCustPhone] = useState('');
  const [custEmail, setCustEmail] = useState('');
  const [custPassword, setCustPassword] = useState('');
  const [custConfirmPassword, setCustConfirmPassword] = useState('');
  const [showCustPass, setShowCustPass] = useState(false);

  // Status states
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);

  const resetErrors = () => {
    setError(null);
    setSuccessMessage(null);
  };

  // ── Customer Login ──────────────────────────────────────────────────────────
  const handleCustomerLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    resetErrors();
    setLoading(true);
    try {
      const res = await fetch('/api/customer/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email: custEmail, password: custPassword }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || 'Invalid email or password');
      setSuccessMessage(`Welcome back, ${data.customer.name}! Redirecting to shop...`);
      setTimeout(() => router.push('/'), 1200);
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : 'Login failed');
    } finally {
      setLoading(false);
    }
  };

  // ── Customer Signup ─────────────────────────────────────────────────────────
  const handleCustomerSignup = async (e: React.FormEvent) => {
    e.preventDefault();
    resetErrors();
    if (custPassword !== custConfirmPassword) {
      setError('Passwords do not match.');
      return;
    }
    if (custPassword.length < 6) {
      setError('Password must be at least 6 characters.');
      return;
    }
    setLoading(true);
    try {
      const res = await fetch('/api/customer/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name: custName, phone: custPhone, email: custEmail, password: custPassword }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || 'Registration failed');
      setSuccessMessage(`Account created! Welcome, ${data.customer.name}! Redirecting...`);
      setTimeout(() => router.push('/'), 1200);
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : 'Registration failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-blue-50/70 via-white to-slate-50 flex flex-col justify-center py-12 px-4 sm:px-6 relative overflow-hidden select-none">
      {/* Background atmosphere */}
      <div className="absolute top-0 left-1/4 w-[600px] h-[600px] bg-blue-500/10 rounded-full blur-[140px] pointer-events-none" />
      <div className="absolute bottom-0 right-1/4 w-[400px] h-[400px] bg-indigo-500/10 rounded-full blur-[120px] pointer-events-none" />

      <div className="sm:mx-auto sm:w-full sm:max-w-md relative z-10">
        {/* Brand Header */}
        <div className="text-center mb-8">
          <Link href="/" className="inline-flex items-center gap-3 group mb-4">
            <div className="w-12 h-12 rounded-2xl bg-gradient-to-tr from-blue-600 via-indigo-600 to-blue-700 flex items-center justify-center text-white shadow-xl shadow-blue-500/25 group-hover:scale-105 transition-all">
              <Sparkles className="w-6 h-6" />
            </div>
            <div className="text-left">
              <span className="text-xl font-black text-slate-900 block leading-tight group-hover:text-blue-600 transition-colors">
                {BUSINESS_CONFIG.name}
              </span>
              <span className="text-[11px] text-blue-600 font-bold uppercase tracking-wider flex items-center gap-1">
                <ShoppingBag className="w-3.5 h-3.5 text-blue-600" />
                Buyer & Shopper Portal
              </span>
            </div>
          </Link>
          <p className="text-slate-600 text-xs">
            Sign in to track your festive pre-bookings, view quotation status & fast-track checkout.
          </p>
        </div>

        {/* Card */}
        <div className="bg-white/95 backdrop-blur-2xl border border-slate-200/90 rounded-3xl shadow-xl shadow-blue-900/5 overflow-hidden">
          {/* Tab switcher: Sign In vs Create Account */}
          <div className="grid grid-cols-2 border-b border-slate-100 bg-slate-50 p-1 m-2 rounded-2xl">
            <button
              type="button"
              onClick={() => { setCustomerMode('login'); resetErrors(); }}
              className={`py-2.5 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                customerMode === 'login'
                  ? 'bg-blue-600 text-white shadow-md shadow-blue-600/25'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              Buyer Sign In
            </button>
            <button
              type="button"
              onClick={() => { setCustomerMode('signup'); resetErrors(); }}
              className={`py-2.5 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                customerMode === 'signup'
                  ? 'bg-blue-600 text-white shadow-md shadow-blue-600/25'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              Create Account
            </button>
          </div>

          <div className="p-6 sm:p-7 space-y-4">
            {/* Alert messages */}
            {error && (
              <div className="flex items-start gap-2.5 p-3 rounded-xl bg-rose-50 border border-rose-200 text-rose-700 text-xs animate-in slide-in-from-top-1">
                <AlertCircle className="w-4 h-4 shrink-0 mt-0.5 text-rose-500" />
                <span>{error}</span>
              </div>
            )}
            {successMessage && (
              <div className="flex items-start gap-2.5 p-3 rounded-xl bg-emerald-50 border border-emerald-200 text-emerald-700 text-xs animate-in slide-in-from-top-1">
                <CheckCircle2 className="w-4 h-4 shrink-0 mt-0.5 text-emerald-600" />
                <span>{successMessage}</span>
              </div>
            )}

            {/* Buyer LOGIN Form */}
            {customerMode === 'login' && (
              <form onSubmit={handleCustomerLogin} className="space-y-4">
                <div>
                  <label className="text-xs font-bold text-slate-700 mb-1.5 block">Email Address</label>
                  <div className="relative">
                    <Mail className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                    <input
                      type="email"
                      required
                      value={custEmail}
                      onChange={(e) => setCustEmail(e.target.value)}
                      placeholder="your@email.com"
                      className="w-full bg-slate-50/80 border border-slate-200 rounded-xl pl-10 pr-4 py-3 text-sm text-slate-900 placeholder-slate-400 focus:outline-none focus:border-blue-600 focus:bg-white focus:ring-1 focus:ring-blue-600 transition-colors"
                    />
                  </div>
                </div>

                <div>
                  <label className="text-xs font-bold text-slate-700 mb-1.5 block">Password</label>
                  <div className="relative">
                    <Lock className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                    <input
                      type={showCustPass ? 'text' : 'password'}
                      required
                      value={custPassword}
                      onChange={(e) => setCustPassword(e.target.value)}
                      placeholder="Enter your password"
                      className="w-full bg-slate-50/80 border border-slate-200 rounded-xl pl-10 pr-11 py-3 text-sm text-slate-900 placeholder-slate-400 focus:outline-none focus:border-blue-600 focus:bg-white focus:ring-1 focus:ring-blue-600 transition-colors"
                    />
                    <button
                      type="button"
                      onClick={() => setShowCustPass(!showCustPass)}
                      className="absolute right-3.5 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 transition-colors cursor-pointer"
                    >
                      {showCustPass ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                    </button>
                  </div>
                </div>

                <button
                  type="submit"
                  disabled={loading}
                  className="w-full py-3.5 rounded-xl bg-gradient-to-r from-blue-600 via-indigo-600 to-blue-700 hover:from-blue-700 hover:to-indigo-700 text-white font-bold text-sm shadow-lg shadow-blue-600/25 hover:shadow-blue-600/40 hover:scale-[1.01] active:scale-[0.99] transition-all flex items-center justify-center gap-2 cursor-pointer disabled:opacity-60 disabled:cursor-not-allowed"
                >
                  {loading ? <Loader2 className="w-4 h-4 animate-spin" /> : <User className="w-4 h-4" />}
                  <span>{loading ? 'Signing In...' : 'Sign In as Buyer'}</span>
                </button>

                <p className="text-center text-xs text-slate-500 pt-1">
                  New to {BUSINESS_CONFIG.name}?{' '}
                  <button
                    type="button"
                    onClick={() => { setCustomerMode('signup'); resetErrors(); }}
                    className="text-blue-600 hover:text-blue-700 font-bold cursor-pointer underline underline-offset-2"
                  >
                    Create free buyer account
                  </button>
                </p>
              </form>
            )}

            {/* Buyer SIGNUP Form */}
            {customerMode === 'signup' && (
              <form onSubmit={handleCustomerSignup} className="space-y-4">
                <div>
                  <label className="text-xs font-bold text-slate-700 mb-1.5 block">Full Name *</label>
                  <div className="relative">
                    <User className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                    <input
                      type="text"
                      required
                      value={custName}
                      onChange={(e) => setCustName(e.target.value)}
                      placeholder="e.g. Anjali Reddy"
                      className="w-full bg-slate-50/80 border border-slate-200 rounded-xl pl-10 pr-4 py-3 text-sm text-slate-900 placeholder-slate-400 focus:outline-none focus:border-blue-600 focus:bg-white focus:ring-1 focus:ring-blue-600 transition-colors"
                    />
                  </div>
                </div>

                <div>
                  <label className="text-xs font-bold text-slate-700 mb-1.5 block">WhatsApp / Phone Number *</label>
                  <div className="relative">
                    <Phone className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                    <input
                      type="tel"
                      required
                      value={custPhone}
                      onChange={(e) => setCustPhone(e.target.value)}
                      placeholder="+91 98765 43210"
                      className="w-full bg-slate-50/80 border border-slate-200 rounded-xl pl-10 pr-4 py-3 text-sm text-slate-900 placeholder-slate-400 focus:outline-none focus:border-blue-600 focus:bg-white focus:ring-1 focus:ring-blue-600 transition-colors font-mono"
                    />
                  </div>
                </div>

                <div>
                  <label className="text-xs font-bold text-slate-700 mb-1.5 block">Email Address *</label>
                  <div className="relative">
                    <Mail className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                    <input
                      type="email"
                      required
                      value={custEmail}
                      onChange={(e) => setCustEmail(e.target.value)}
                      placeholder="your@email.com"
                      className="w-full bg-slate-50/80 border border-slate-200 rounded-xl pl-10 pr-4 py-3 text-sm text-slate-900 placeholder-slate-400 focus:outline-none focus:border-blue-600 focus:bg-white focus:ring-1 focus:ring-blue-600 transition-colors"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <label className="text-xs font-bold text-slate-700 mb-1.5 block">Password *</label>
                    <div className="relative">
                      <Lock className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                      <input
                        type={showCustPass ? 'text' : 'password'}
                        required
                        value={custPassword}
                        onChange={(e) => setCustPassword(e.target.value)}
                        placeholder="Min 6 chars"
                        className="w-full bg-slate-50/80 border border-slate-200 rounded-xl pl-10 pr-10 py-3 text-sm text-slate-900 placeholder-slate-400 focus:outline-none focus:border-blue-600 focus:bg-white focus:ring-1 focus:ring-blue-600 transition-colors"
                      />
                      <button
                        type="button"
                        onClick={() => setShowCustPass(!showCustPass)}
                        className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 transition-colors cursor-pointer"
                      >
                        {showCustPass ? <EyeOff className="w-3.5 h-3.5" /> : <Eye className="w-3.5 h-3.5" />}
                      </button>
                    </div>
                  </div>

                  <div>
                    <label className="text-xs font-bold text-slate-700 mb-1.5 block">Confirm Password *</label>
                    <input
                      type={showCustPass ? 'text' : 'password'}
                      required
                      value={custConfirmPassword}
                      onChange={(e) => setCustConfirmPassword(e.target.value)}
                      placeholder="Repeat"
                      className="w-full bg-slate-50/80 border border-slate-200 rounded-xl px-4 py-3 text-sm text-slate-900 placeholder-slate-400 focus:outline-none focus:border-blue-600 focus:bg-white focus:ring-1 focus:ring-blue-600 transition-colors"
                    />
                  </div>
                </div>

                <button
                  type="submit"
                  disabled={loading}
                  className="w-full py-3.5 rounded-xl bg-gradient-to-r from-blue-600 via-indigo-600 to-blue-700 hover:from-blue-700 hover:to-indigo-700 text-white font-bold text-sm shadow-lg shadow-blue-600/25 transition-all flex items-center justify-center gap-2 cursor-pointer disabled:opacity-60 disabled:cursor-not-allowed"
                >
                  {loading ? <Loader2 className="w-4 h-4 animate-spin" /> : <User className="w-4 h-4" />}
                  <span>{loading ? 'Creating Account...' : 'Complete Buyer Registration'}</span>
                </button>

                <p className="text-center text-xs text-slate-500 pt-1">
                  Already registered?{' '}
                  <button
                    type="button"
                    onClick={() => { setCustomerMode('login'); resetErrors(); }}
                    className="text-blue-600 hover:text-blue-700 font-bold cursor-pointer underline underline-offset-2"
                  >
                    Sign in here
                  </button>
                </p>
              </form>
            )}
          </div>
        </div>

        {/* Footnotes: Return to Storefront & Discrete Staff Link */}
        <div className="mt-6 flex flex-col sm:flex-row items-center justify-between gap-3 text-center">
          <Link
            href="/"
            className="inline-flex items-center gap-1.5 text-xs text-slate-600 hover:text-blue-600 transition-colors font-medium"
          >
            <ArrowLeft className="w-3.5 h-3.5" />
            <span>Return to Storefront</span>
          </Link>

          <Link
            href="/admin/login"
            className="inline-flex items-center gap-1.5 text-xs text-slate-500 hover:text-blue-600 transition-colors font-medium"
          >
            <ShieldCheck className="w-3.5 h-3.5 text-slate-500" />
            <span>Store Staff & Admin Portal &rarr;</span>
          </Link>
        </div>
      </div>
    </div>
  );
}

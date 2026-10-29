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
  UserCheck,
  CheckCircle2,
} from 'lucide-react';
import { BUSINESS_CONFIG } from '@/lib/data/sample-products';

type AuthTab = 'customer' | 'admin';
type CustomerMode = 'login' | 'signup';

export default function LoginPage() {
  const router = useRouter();
  const [activeTab, setActiveTab] = useState<AuthTab>('customer');
  const [customerMode, setCustomerMode] = useState<CustomerMode>('login');

  // Customer form states
  const [custName, setCustName] = useState('');
  const [custPhone, setCustPhone] = useState('');
  const [custEmail, setCustEmail] = useState('');
  const [custPassword, setCustPassword] = useState('');
  const [custConfirmPassword, setCustConfirmPassword] = useState('');
  const [showCustPass, setShowCustPass] = useState(false);

  // Admin form states
  const [adminUsername, setAdminUsername] = useState('');
  const [adminPassword, setAdminPassword] = useState('');
  const [showAdminPass, setShowAdminPass] = useState(false);

  // Shared states
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
      if (!res.ok) throw new Error(data.error || 'Login failed');
      setSuccessMessage(`Welcome back, ${data.customer.name}! Redirecting...`);
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

  // ── Admin Login ─────────────────────────────────────────────────────────────
  const handleAdminLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    resetErrors();
    setLoading(true);
    try {
      const res = await fetch('/api/admin/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ username: adminUsername, password: adminPassword }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || 'Invalid credentials');
      setSuccessMessage('Admin access granted! Redirecting to dashboard...');
      setTimeout(() => { router.push('/admin'); router.refresh(); }, 1000);
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : 'Login failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-950 flex flex-col justify-center py-12 px-4 sm:px-6 relative overflow-hidden">
      {/* Animated background glows */}
      <div className="absolute top-0 left-1/4 w-[600px] h-[600px] bg-amber-500/8 rounded-full blur-[140px] pointer-events-none animate-pulse" />
      <div className="absolute bottom-0 right-1/4 w-[400px] h-[400px] bg-orange-600/6 rounded-full blur-[120px] pointer-events-none" />
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[400px] bg-amber-500/4 rounded-full blur-[160px] pointer-events-none" />

      {/* Decorative sparkle dots */}
      <div className="absolute top-20 left-10 w-2 h-2 bg-amber-400 rounded-full opacity-60 animate-ping" style={{ animationDuration: '2s' }} />
      <div className="absolute top-40 right-16 w-1.5 h-1.5 bg-orange-400 rounded-full opacity-40 animate-ping" style={{ animationDuration: '3s', animationDelay: '1s' }} />
      <div className="absolute bottom-32 left-20 w-1 h-1 bg-yellow-400 rounded-full opacity-50 animate-ping" style={{ animationDuration: '2.5s', animationDelay: '0.5s' }} />

      <div className="sm:mx-auto sm:w-full sm:max-w-md relative z-10">
        {/* Logo */}
        <div className="text-center mb-8">
          <Link href="/" className="inline-flex items-center gap-3 group mb-6">
            <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-amber-400 via-amber-500 to-orange-600 flex items-center justify-center text-slate-950 shadow-lg shadow-amber-500/30 group-hover:scale-105 transition-transform">
              <Sparkles className="w-6 h-6" />
            </div>
            <div className="text-left">
              <span className="text-xl font-extrabold text-white block leading-tight group-hover:text-amber-300 transition-colors">
                {BUSINESS_CONFIG.name}
              </span>
              <span className="text-[11px] text-amber-400 font-semibold uppercase tracking-widest">
                Certified Fireworks
              </span>
            </div>
          </Link>
          <p className="text-slate-400 text-sm">Sign in to access your account or manage the store</p>
        </div>

        {/* Card */}
        <div className="bg-slate-900/90 backdrop-blur-md border border-slate-800 rounded-3xl shadow-2xl shadow-black/40 overflow-hidden">
          {/* Tab switcher */}
          <div className="flex border-b border-slate-800">
            <button
              onClick={() => { setActiveTab('customer'); resetErrors(); }}
              className={`flex-1 flex items-center justify-center gap-2 py-4 text-sm font-semibold transition-all cursor-pointer ${
                activeTab === 'customer'
                  ? 'text-amber-300 border-b-2 border-amber-400 bg-amber-500/5'
                  : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/40'
              }`}
            >
              <UserCheck className="w-4 h-4" />
              <span>Customer</span>
            </button>
            <button
              onClick={() => { setActiveTab('admin'); resetErrors(); }}
              className={`flex-1 flex items-center justify-center gap-2 py-4 text-sm font-semibold transition-all cursor-pointer ${
                activeTab === 'admin'
                  ? 'text-amber-300 border-b-2 border-amber-400 bg-amber-500/5'
                  : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/40'
              }`}
            >
              <ShieldCheck className="w-4 h-4" />
              <span>Admin</span>
            </button>
          </div>

          <div className="p-7 space-y-5">
            {/* Alert messages */}
            {error && (
              <div className="flex items-start gap-2.5 p-3.5 rounded-xl bg-rose-950/50 border border-rose-500/30 text-rose-300 text-sm animate-in slide-in-from-top-2">
                <AlertCircle className="w-4 h-4 shrink-0 mt-0.5 text-rose-400" />
                <span>{error}</span>
              </div>
            )}
            {successMessage && (
              <div className="flex items-start gap-2.5 p-3.5 rounded-xl bg-emerald-950/50 border border-emerald-500/30 text-emerald-300 text-sm animate-in slide-in-from-top-2">
                <CheckCircle2 className="w-4 h-4 shrink-0 mt-0.5 text-emerald-400" />
                <span>{successMessage}</span>
              </div>
            )}

            {/* ─── CUSTOMER TAB ───────────────────────────────────────── */}
            {activeTab === 'customer' && (
              <>
                {/* Login / Signup sub-tabs */}
                <div className="flex bg-slate-950 rounded-xl p-1 gap-1">
                  <button
                    onClick={() => { setCustomerMode('login'); resetErrors(); }}
                    className={`flex-1 py-2 rounded-lg text-xs font-bold transition-all cursor-pointer ${
                      customerMode === 'login'
                        ? 'bg-amber-500 text-slate-950 shadow-md shadow-amber-500/20'
                        : 'text-slate-400 hover:text-white'
                    }`}
                  >
                    Sign In
                  </button>
                  <button
                    onClick={() => { setCustomerMode('signup'); resetErrors(); }}
                    className={`flex-1 py-2 rounded-lg text-xs font-bold transition-all cursor-pointer ${
                      customerMode === 'signup'
                        ? 'bg-amber-500 text-slate-950 shadow-md shadow-amber-500/20'
                        : 'text-slate-400 hover:text-white'
                    }`}
                  >
                    Create Account
                  </button>
                </div>

                {/* Customer LOGIN form */}
                {customerMode === 'login' && (
                  <form onSubmit={handleCustomerLogin} className="space-y-4">
                    <div>
                      <label className="text-xs font-semibold text-slate-300 mb-1.5 block">Email Address</label>
                      <div className="relative">
                        <Mail className="w-4 h-4 text-slate-500 absolute left-3.5 top-1/2 -translate-y-1/2" />
                        <input
                          id="cust-login-email"
                          type="email"
                          required
                          value={custEmail}
                          onChange={(e) => setCustEmail(e.target.value)}
                          placeholder="your@email.com"
                          className="w-full bg-slate-950 border border-slate-800 rounded-xl pl-10 pr-4 py-2.5 text-sm text-white placeholder-slate-600 focus:outline-none focus:border-amber-500 transition-colors"
                        />
                      </div>
                    </div>
                    <div>
                      <label className="text-xs font-semibold text-slate-300 mb-1.5 block">Password</label>
                      <div className="relative">
                        <Lock className="w-4 h-4 text-slate-500 absolute left-3.5 top-1/2 -translate-y-1/2" />
                        <input
                          id="cust-login-password"
                          type={showCustPass ? 'text' : 'password'}
                          required
                          value={custPassword}
                          onChange={(e) => setCustPassword(e.target.value)}
                          placeholder="Enter your password"
                          className="w-full bg-slate-950 border border-slate-800 rounded-xl pl-10 pr-11 py-2.5 text-sm text-white placeholder-slate-600 focus:outline-none focus:border-amber-500 transition-colors"
                        />
                        <button
                          type="button"
                          onClick={() => setShowCustPass(!showCustPass)}
                          className="absolute right-3.5 top-1/2 -translate-y-1/2 text-slate-500 hover:text-slate-300 transition-colors cursor-pointer"
                        >
                          {showCustPass ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                        </button>
                      </div>
                    </div>
                    <button
                      type="submit"
                      disabled={loading}
                      className="w-full py-3 rounded-xl bg-gradient-to-r from-amber-500 to-orange-500 hover:from-amber-400 hover:to-orange-400 text-slate-950 font-bold text-sm shadow-lg shadow-amber-500/25 transition-all flex items-center justify-center gap-2 cursor-pointer disabled:opacity-60 disabled:cursor-not-allowed"
                    >
                      {loading ? <Loader2 className="w-4 h-4 animate-spin" /> : <User className="w-4 h-4" />}
                      <span>{loading ? 'Signing In...' : 'Sign In to Account'}</span>
                    </button>
                    <p className="text-center text-xs text-slate-500">
                      No account?{' '}
                      <button
                        type="button"
                        onClick={() => { setCustomerMode('signup'); resetErrors(); }}
                        className="text-amber-400 hover:text-amber-300 font-semibold cursor-pointer"
                      >
                        Create one free
                      </button>
                    </p>
                  </form>
                )}

                {/* Customer SIGNUP form */}
                {customerMode === 'signup' && (
                  <form onSubmit={handleCustomerSignup} className="space-y-4">
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <div>
                        <label className="text-xs font-semibold text-slate-300 mb-1.5 block">Full Name *</label>
                        <div className="relative">
                          <User className="w-4 h-4 text-slate-500 absolute left-3.5 top-1/2 -translate-y-1/2" />
                          <input
                            id="cust-signup-name"
                            type="text"
                            required
                            value={custName}
                            onChange={(e) => setCustName(e.target.value)}
                            placeholder="Your full name"
                            className="w-full bg-slate-950 border border-slate-800 rounded-xl pl-10 pr-4 py-2.5 text-sm text-white placeholder-slate-600 focus:outline-none focus:border-amber-500 transition-colors"
                          />
                        </div>
                      </div>
                      <div>
                        <label className="text-xs font-semibold text-slate-300 mb-1.5 block">Mobile Number *</label>
                        <div className="relative">
                          <Phone className="w-4 h-4 text-slate-500 absolute left-3.5 top-1/2 -translate-y-1/2" />
                          <input
                            id="cust-signup-phone"
                            type="tel"
                            required
                            value={custPhone}
                            onChange={(e) => setCustPhone(e.target.value)}
                            placeholder="+91 98765 43210"
                            className="w-full bg-slate-950 border border-slate-800 rounded-xl pl-10 pr-4 py-2.5 text-sm text-white placeholder-slate-600 focus:outline-none focus:border-amber-500 transition-colors"
                          />
                        </div>
                      </div>
                    </div>
                    <div>
                      <label className="text-xs font-semibold text-slate-300 mb-1.5 block">Email Address *</label>
                      <div className="relative">
                        <Mail className="w-4 h-4 text-slate-500 absolute left-3.5 top-1/2 -translate-y-1/2" />
                        <input
                          id="cust-signup-email"
                          type="email"
                          required
                          value={custEmail}
                          onChange={(e) => setCustEmail(e.target.value)}
                          placeholder="your@email.com"
                          className="w-full bg-slate-950 border border-slate-800 rounded-xl pl-10 pr-4 py-2.5 text-sm text-white placeholder-slate-600 focus:outline-none focus:border-amber-500 transition-colors"
                        />
                      </div>
                    </div>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <div>
                        <label className="text-xs font-semibold text-slate-300 mb-1.5 block">Password *</label>
                        <div className="relative">
                          <Lock className="w-4 h-4 text-slate-500 absolute left-3.5 top-1/2 -translate-y-1/2" />
                          <input
                            id="cust-signup-password"
                            type={showCustPass ? 'text' : 'password'}
                            required
                            value={custPassword}
                            onChange={(e) => setCustPassword(e.target.value)}
                            placeholder="Min 6 characters"
                            className="w-full bg-slate-950 border border-slate-800 rounded-xl pl-10 pr-11 py-2.5 text-sm text-white placeholder-slate-600 focus:outline-none focus:border-amber-500 transition-colors"
                          />
                          <button
                            type="button"
                            onClick={() => setShowCustPass(!showCustPass)}
                            className="absolute right-3.5 top-1/2 -translate-y-1/2 text-slate-500 hover:text-slate-300 transition-colors cursor-pointer"
                          >
                            {showCustPass ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                          </button>
                        </div>
                      </div>
                      <div>
                        <label className="text-xs font-semibold text-slate-300 mb-1.5 block">Confirm Password *</label>
                        <div className="relative">
                          <Lock className="w-4 h-4 text-slate-500 absolute left-3.5 top-1/2 -translate-y-1/2" />
                          <input
                            id="cust-signup-confirm-password"
                            type={showCustPass ? 'text' : 'password'}
                            required
                            value={custConfirmPassword}
                            onChange={(e) => setCustConfirmPassword(e.target.value)}
                            placeholder="Repeat password"
                            className="w-full bg-slate-950 border border-slate-800 rounded-xl pl-10 pr-4 py-2.5 text-sm text-white placeholder-slate-600 focus:outline-none focus:border-amber-500 transition-colors"
                          />
                        </div>
                      </div>
                    </div>
                    <button
                      type="submit"
                      disabled={loading}
                      className="w-full py-3 rounded-xl bg-gradient-to-r from-amber-500 to-orange-500 hover:from-amber-400 hover:to-orange-400 text-slate-950 font-bold text-sm shadow-lg shadow-amber-500/25 transition-all flex items-center justify-center gap-2 cursor-pointer disabled:opacity-60 disabled:cursor-not-allowed"
                    >
                      {loading ? <Loader2 className="w-4 h-4 animate-spin" /> : <Sparkles className="w-4 h-4" />}
                      <span>{loading ? 'Creating Account...' : 'Create My Account'}</span>
                    </button>
                    <p className="text-center text-xs text-slate-500">
                      Already have an account?{' '}
                      <button
                        type="button"
                        onClick={() => { setCustomerMode('login'); resetErrors(); }}
                        className="text-amber-400 hover:text-amber-300 font-semibold cursor-pointer"
                      >
                        Sign in
                      </button>
                    </p>
                  </form>
                )}
              </>
            )}

            {/* ─── ADMIN TAB ──────────────────────────────────────────── */}
            {activeTab === 'admin' && (
              <form onSubmit={handleAdminLogin} className="space-y-5">
                <div className="flex items-center gap-3 p-3.5 rounded-xl bg-amber-950/30 border border-amber-500/20">
                  <ShieldCheck className="w-5 h-5 text-amber-400 shrink-0" />
                  <div>
                    <p className="text-xs font-semibold text-amber-300">Restricted Access</p>
                    <p className="text-[11px] text-amber-400/70 mt-0.5">Administrator credentials required for dashboard access</p>
                  </div>
                </div>

                <div>
                  <label className="text-xs font-semibold text-slate-300 mb-1.5 block">Administrator Username</label>
                  <div className="relative">
                    <User className="w-4 h-4 text-slate-500 absolute left-3.5 top-1/2 -translate-y-1/2" />
                    <input
                      id="admin-username"
                      type="text"
                      required
                      value={adminUsername}
                      onChange={(e) => setAdminUsername(e.target.value)}
                      placeholder="admin"
                      className="w-full bg-slate-950 border border-slate-800 rounded-xl pl-10 pr-4 py-2.5 text-sm text-white placeholder-slate-600 focus:outline-none focus:border-amber-500 transition-colors"
                    />
                  </div>
                </div>

                <div>
                  <label className="text-xs font-semibold text-slate-300 mb-1.5 block">Admin Password</label>
                  <div className="relative">
                    <Lock className="w-4 h-4 text-slate-500 absolute left-3.5 top-1/2 -translate-y-1/2" />
                    <input
                      id="admin-password"
                      type={showAdminPass ? 'text' : 'password'}
                      required
                      value={adminPassword}
                      onChange={(e) => setAdminPassword(e.target.value)}
                      placeholder="Enter admin password"
                      className="w-full bg-slate-950 border border-slate-800 rounded-xl pl-10 pr-11 py-2.5 text-sm text-white placeholder-slate-600 focus:outline-none focus:border-amber-500 transition-colors"
                    />
                    <button
                      type="button"
                      onClick={() => setShowAdminPass(!showAdminPass)}
                      className="absolute right-3.5 top-1/2 -translate-y-1/2 text-slate-500 hover:text-slate-300 transition-colors cursor-pointer"
                    >
                      {showAdminPass ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                    </button>
                  </div>
                  <p className="mt-1.5 text-[11px] text-slate-600">
                    Dev default: <span className="text-slate-500 font-mono">admin</span> / <span className="text-slate-500 font-mono">SriVijaya@2026!</span>
                  </p>
                </div>

                <button
                  type="submit"
                  disabled={loading}
                  className="w-full py-3 rounded-xl bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-400 hover:to-amber-500 text-slate-950 font-bold text-sm shadow-lg shadow-amber-500/25 transition-all flex items-center justify-center gap-2 cursor-pointer disabled:opacity-60 disabled:cursor-not-allowed"
                >
                  {loading ? <Loader2 className="w-4 h-4 animate-spin" /> : <ShieldCheck className="w-4 h-4" />}
                  <span>{loading ? 'Verifying...' : 'Access Admin Dashboard'}</span>
                </button>
              </form>
            )}
          </div>
        </div>

        {/* Back to storefront */}
        <div className="mt-6 text-center">
          <Link
            href="/"
            className="inline-flex items-center gap-1.5 text-sm text-slate-500 hover:text-amber-400 transition-colors"
          >
            <ArrowLeft className="w-3.5 h-3.5" />
            <span>Back to Storefront</span>
          </Link>
        </div>
      </div>
    </div>
  );
}

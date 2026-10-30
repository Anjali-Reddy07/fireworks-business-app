'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { 
  ShieldCheck, 
  Sparkles, 
  ArrowLeft, 
  AlertCircle, 
  Loader2, 
  UserPlus, 
  Eye, 
  EyeOff, 
  Lock, 
  KeyRound,
  CheckCircle2,
  Store,
  HelpCircle
} from 'lucide-react';
import { BUSINESS_CONFIG } from '@/lib/data/sample-products';

type AuthMode = 'login' | 'setup';

export default function AdminLoginPage() {
  const router = useRouter();
  const [mode, setMode] = useState<AuthMode>('login');

  // Form fields
  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);

  const resetMessages = () => {
    setError(null);
    setSuccess(null);
  };

  // 1-Click Fill Demo Credentials
  const fillDemoCredentials = () => {
    setUsername('admin');
    setPassword('password123');
    resetMessages();
  };

  // ── Handle Login ──────────────────────────────────────────────────────────
  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    resetMessages();
    setLoading(true);
    try {
      const res = await fetch('/api/admin/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ username, password }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || 'Invalid administrator credentials');
      
      setSuccess('Access verified! Entering administration portal...');
      setTimeout(() => {
        router.push('/admin');
        router.refresh();
      }, 1000);
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : 'Login failed. Please check credentials.');
    } finally {
      setLoading(false);
    }
  };

  // ── Handle Setup / Register ───────────────────────────────────────────────
  const handleSetup = async (e: React.FormEvent) => {
    e.preventDefault();
    resetMessages();
    if (password !== confirmPassword) {
      setError('Passwords do not match.');
      return;
    }
    if (password.length < 8) {
      setError('Password must be at least 8 characters long.');
      return;
    }
    setLoading(true);
    try {
      const res = await fetch('/api/admin/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ username, email, password, confirmPassword }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || 'Admin registration failed');
      
      setSuccess('Admin account created! Entering administration portal...');
      setTimeout(() => {
        router.push('/admin');
        router.refresh();
      }, 1000);
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : 'Registration failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-950 flex flex-col justify-center py-12 px-4 sm:px-6 lg:px-8 relative overflow-hidden select-none">
      {/* Background radial atmosphere */}
      <div className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[700px] h-[400px] bg-amber-500/10 rounded-full blur-[150px] pointer-events-none" />
      <div className="absolute bottom-10 right-10 w-[400px] h-[300px] bg-orange-600/8 rounded-full blur-[130px] pointer-events-none" />

      <div className="sm:mx-auto sm:w-full sm:max-w-md relative z-10">
        
        {/* Brand Header */}
        <div className="text-center mb-8">
          <Link href="/" className="inline-flex items-center gap-3 mb-4 group">
            <div className="w-12 h-12 rounded-2xl bg-gradient-to-tr from-amber-500 via-orange-500 to-red-600 flex items-center justify-center shadow-xl shadow-amber-500/25 group-hover:scale-105 transition-all">
              <Sparkles className="w-6 h-6 text-slate-950" />
            </div>
            <div className="text-left">
              <span className="text-xl font-black text-white block group-hover:text-amber-300 transition-colors">
                {BUSINESS_CONFIG.name}
              </span>
              <span className="text-[11px] font-semibold text-amber-400 tracking-wider uppercase flex items-center gap-1">
                <ShieldCheck className="w-3.5 h-3.5 text-amber-400" />
                Store Management
              </span>
            </div>
          </Link>

          <div className="space-y-1">
            <h1 className="text-2xl font-black text-white tracking-tight flex items-center justify-center gap-2">
              <KeyRound className="w-5 h-5 text-amber-400" />
              <span>Admin Authentication</span>
            </h1>
            <p className="text-xs text-slate-400">
              Authorized personnel only. Manage fireworks inventory, orders & quotations.
            </p>
          </div>
        </div>

        {/* Card Container */}
        <div className="bg-slate-900/90 backdrop-blur-2xl border border-slate-800 rounded-3xl shadow-2xl shadow-black/80 overflow-hidden">
          
          {/* Tab Selector */}
          <div className="grid grid-cols-2 border-b border-slate-800 bg-slate-950/60 p-1 m-2 rounded-2xl">
            <button
              type="button"
              onClick={() => { setMode('login'); resetMessages(); }}
              className={`flex items-center justify-center gap-2 py-2.5 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                mode === 'login'
                  ? 'bg-amber-500 text-slate-950 shadow-md shadow-amber-500/30'
                  : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              <Lock className="w-3.5 h-3.5" />
              <span>Sign In</span>
            </button>

            <button
              type="button"
              onClick={() => { setMode('setup'); resetMessages(); }}
              className={`flex items-center justify-center gap-2 py-2.5 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                mode === 'setup'
                  ? 'bg-amber-500 text-slate-950 shadow-md shadow-amber-500/30'
                  : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              <UserPlus className="w-3.5 h-3.5" />
              <span>Register Admin</span>
            </button>
          </div>

          <div className="p-6 sm:p-8 space-y-5">
            {/* Demo Credentials Helper Pill */}
            {mode === 'login' && (
              <div className="flex items-center justify-between p-3 rounded-2xl bg-amber-500/10 border border-amber-500/20 text-amber-200 text-xs">
                <div className="flex items-center gap-2">
                  <HelpCircle className="w-4 h-4 text-amber-400 shrink-0" />
                  <span>Demo Admin: <strong className="font-mono text-amber-300">admin / password123</strong></span>
                </div>
                <button
                  type="button"
                  onClick={fillDemoCredentials}
                  className="px-2.5 py-1 rounded-lg bg-amber-500/20 hover:bg-amber-500/30 text-amber-300 font-semibold text-[11px] transition-colors cursor-pointer"
                >
                  Auto-fill
                </button>
              </div>
            )}

            {/* Error Message */}
            {error && (
              <div className="flex items-start gap-2.5 p-3.5 rounded-xl bg-rose-950/60 border border-rose-500/30 text-rose-300 text-xs animate-in slide-in-from-top-1">
                <AlertCircle className="w-4 h-4 shrink-0 mt-0.5 text-rose-400" />
                <span>{error}</span>
              </div>
            )}

            {/* Success Message */}
            {success && (
              <div className="flex items-start gap-2.5 p-3.5 rounded-xl bg-emerald-950/60 border border-emerald-500/30 text-emerald-300 text-xs animate-in slide-in-from-top-1">
                <CheckCircle2 className="w-4 h-4 shrink-0 mt-0.5 text-emerald-400" />
                <span>{success}</span>
              </div>
            )}

            <form onSubmit={mode === 'setup' ? handleSetup : handleLogin} className="space-y-4">
              {/* Username */}
              <div>
                <label className="text-xs font-bold text-slate-300 mb-1.5 block">
                  Admin Username
                </label>
                <input
                  type="text"
                  required
                  autoComplete="username"
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  placeholder="e.g. admin"
                  className="w-full bg-slate-950/90 border border-slate-800 rounded-xl px-4 py-3 text-sm text-white placeholder-slate-600 focus:outline-none focus:border-amber-500 focus:ring-1 focus:ring-amber-500 transition-all font-mono"
                />
              </div>

              {/* Email (Setup Mode only) */}
              {mode === 'setup' && (
                <div>
                  <label className="text-xs font-bold text-slate-300 mb-1.5 block">
                    Admin Email Address
                  </label>
                  <input
                    type="email"
                    required
                    autoComplete="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="admin@example.com"
                    className="w-full bg-slate-950/90 border border-slate-800 rounded-xl px-4 py-3 text-sm text-white placeholder-slate-600 focus:outline-none focus:border-amber-500 focus:ring-1 focus:ring-amber-500 transition-all"
                  />
                </div>
              )}

              {/* Password */}
              <div>
                <label className="text-xs font-bold text-slate-300 mb-1.5 block">
                  Password
                </label>
                <div className="relative">
                  <input
                    type={showPassword ? 'text' : 'password'}
                    required
                    autoComplete={mode === 'setup' ? 'new-password' : 'current-password'}
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder={mode === 'setup' ? 'Min. 8 characters' : 'Enter admin password'}
                    className="w-full bg-slate-950/90 border border-slate-800 rounded-xl px-4 py-3 pr-11 text-sm text-white placeholder-slate-600 focus:outline-none focus:border-amber-500 focus:ring-1 focus:ring-amber-500 transition-all font-mono"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3.5 top-1/2 -translate-y-1/2 text-slate-500 hover:text-slate-300 transition-colors cursor-pointer"
                  >
                    {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </button>
                </div>
              </div>

              {/* Confirm Password (Setup Mode only) */}
              {mode === 'setup' && (
                <div>
                  <label className="text-xs font-bold text-slate-300 mb-1.5 block">
                    Confirm Password
                  </label>
                  <input
                    type={showPassword ? 'text' : 'password'}
                    required
                    autoComplete="new-password"
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    placeholder="Repeat password"
                    className="w-full bg-slate-950/90 border border-slate-800 rounded-xl px-4 py-3 text-sm text-white placeholder-slate-600 focus:outline-none focus:border-amber-500 focus:ring-1 focus:ring-amber-500 transition-all font-mono"
                  />
                </div>
              )}

              {/* Submit Button */}
              <button
                type="submit"
                disabled={loading}
                className="w-full py-3.5 mt-2 rounded-xl bg-gradient-to-r from-amber-500 via-orange-500 to-amber-600 hover:from-amber-400 hover:to-orange-400 text-slate-950 font-black text-sm shadow-lg shadow-amber-500/25 hover:shadow-amber-500/40 hover:scale-[1.01] active:scale-[0.99] transition-all flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {loading ? (
                  <>
                    <Loader2 className="w-4 h-4 animate-spin" />
                    <span>Verifying...</span>
                  </>
                ) : (
                  <>
                    {mode === 'setup' ? <UserPlus className="w-4 h-4" /> : <Lock className="w-4 h-4" />}
                    <span>{mode === 'setup' ? 'Create Admin Account' : 'Sign In to Admin Portal'}</span>
                  </>
                )}
              </button>
            </form>

            {/* Navigation Footnotes */}
            <div className="pt-4 border-t border-slate-800/80 flex flex-col sm:flex-row items-center justify-between gap-3 text-xs text-slate-400">
              <Link
                href="/"
                className="inline-flex items-center gap-1.5 hover:text-amber-400 transition-colors"
              >
                <ArrowLeft className="w-3.5 h-3.5" />
                <span>Return to Storefront</span>
              </Link>

              <Link
                href="/login"
                className="inline-flex items-center gap-1.5 text-amber-400/90 hover:text-amber-300 transition-colors"
              >
                <Store className="w-3.5 h-3.5" />
                <span>Customer Login &rarr;</span>
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

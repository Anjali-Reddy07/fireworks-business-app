'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { Lock, Sparkles, ArrowLeft, AlertCircle, Loader2, UserPlus, Eye, EyeOff } from 'lucide-react';
import { BUSINESS_CONFIG } from '@/lib/data/sample-products';

type Mode = 'loading' | 'login' | 'setup';

export default function AdminLoginPage() {
  const router = useRouter();
  const [mode, setMode] = useState<Mode>('loading');

  // Setup fields
  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Check if any admin exists yet
  useEffect(() => {
    fetch('/api/admin/register')
      .then((r) => r.json())
      .then((d) => setMode(d.hasAdmin ? 'login' : 'setup'))
      .catch(() => setMode('login'));
  }, []);

  // ── Login ────────────────────────────────────────────────────────────────
  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setLoading(true);
    try {
      const res = await fetch('/api/admin/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ username, password }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || 'Invalid credentials');
      router.push('/admin');
      router.refresh();
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : 'Login failed');
    } finally {
      setLoading(false);
    }
  };

  // ── First-time Setup ─────────────────────────────────────────────────────
  const handleSetup = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    if (password !== confirmPassword) {
      setError('Passwords do not match.');
      return;
    }
    if (password.length < 8) {
      setError('Password must be at least 8 characters.');
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
      if (!res.ok) throw new Error(data.error || 'Registration failed');
      router.push('/admin');
      router.refresh();
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : 'Setup failed');
    } finally {
      setLoading(false);
    }
  };

  if (mode === 'loading') {
    return (
      <div className="min-h-screen bg-slate-950 flex items-center justify-center">
        <Loader2 className="w-8 h-8 text-amber-400 animate-spin" />
      </div>
    );
  }

  const isSetup = mode === 'setup';

  return (
    <div className="min-h-screen bg-slate-950 flex flex-col justify-center py-12 px-4 sm:px-6 lg:px-8 relative overflow-hidden">
      {/* Ambient background glows */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[350px] bg-amber-500/8 rounded-full blur-[140px] pointer-events-none" />
      <div className="absolute top-1/4 right-1/4 w-[300px] h-[300px] bg-red-600/6 rounded-full blur-[120px] pointer-events-none" />

      <div className="sm:mx-auto sm:w-full sm:max-w-md relative z-10">
        {/* Brand */}
        <div className="text-center mb-8">
          <Link href="/" className="inline-flex items-center gap-2.5 mb-5 group">
            <div className="w-11 h-11 rounded-2xl bg-gradient-to-br from-amber-400 via-amber-500 to-red-600 flex items-center justify-center shadow-lg shadow-amber-500/25">
              <Sparkles className="w-5 h-5 text-slate-950" />
            </div>
            <span className="text-xl font-bold text-white group-hover:text-amber-300 transition-colors">
              {BUSINESS_CONFIG.name}
            </span>
          </Link>

          <div className="space-y-1">
            <h1 className="text-2xl font-extrabold text-white tracking-tight">
              {isSetup ? 'Create Your Admin Account' : 'Administrator Portal'}
            </h1>
            <p className="text-xs text-slate-500">
              {isSetup
                ? 'Set up your secure owner account to access the dashboard'
                : 'Secure access to inventory, catalogue & inquiries'}
            </p>
          </div>
        </div>

        {/* Card */}
        <div className="bg-slate-900/70 backdrop-blur-xl border border-slate-800/80 py-6 sm:py-8 px-4 sm:px-10 rounded-2xl sm:rounded-3xl shadow-2xl shadow-slate-950/50 space-y-5">

          {/* Setup info banner */}
          {isSetup && (
            <div className="flex items-start gap-3 p-3.5 rounded-2xl bg-amber-500/8 border border-amber-500/20 text-amber-200/80 text-xs leading-relaxed">
              <UserPlus className="w-4 h-4 text-amber-400 shrink-0 mt-0.5" />
              <span>
                No admin account found. Create your owner account now — this is a one-time setup.
                After this, new admins can only be added from inside the dashboard.
              </span>
            </div>
          )}

          {/* Error */}
          {error && (
            <div className="flex items-center gap-2 p-3 rounded-xl bg-rose-950/40 border border-rose-500/25 text-rose-300 text-xs">
              <AlertCircle className="w-4 h-4 shrink-0 text-rose-400" />
              <span>{error}</span>
            </div>
          )}

          <form onSubmit={isSetup ? handleSetup : handleLogin} className="space-y-4">
            {/* Username */}
            <div>
              <label className="text-xs font-semibold text-slate-400 mb-1.5 block">
                {isSetup ? 'Choose a Username' : 'Administrator Username'}
              </label>
              <input
                id="admin-username"
                type="text"
                required
                autoComplete="username"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                placeholder={isSetup ? 'e.g. owner' : 'Enter username'}
                className="w-full bg-slate-950/80 border border-slate-800 rounded-xl px-4 py-3 text-sm text-white placeholder-slate-600 focus:outline-none focus:border-amber-500/60 focus:ring-1 focus:ring-amber-500/20 transition-all"
              />
            </div>

            {/* Email (setup only) */}
            {isSetup && (
              <div>
                <label className="text-xs font-semibold text-slate-400 mb-1.5 block">
                  Email Address
                </label>
                <input
                  id="admin-email"
                  type="email"
                  required
                  autoComplete="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="you@example.com"
                  className="w-full bg-slate-950/80 border border-slate-800 rounded-xl px-4 py-3 text-sm text-white placeholder-slate-600 focus:outline-none focus:border-amber-500/60 focus:ring-1 focus:ring-amber-500/20 transition-all"
                />
              </div>
            )}

            {/* Password */}
            <div>
              <label className="text-xs font-semibold text-slate-400 mb-1.5 block">
                {isSetup ? 'Create Password' : 'Password'}
              </label>
              <div className="relative">
                <input
                  id="admin-password"
                  type={showPassword ? 'text' : 'password'}
                  required
                  autoComplete={isSetup ? 'new-password' : 'current-password'}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder={isSetup ? 'Min. 8 characters' : 'Enter password'}
                  className="w-full bg-slate-950/80 border border-slate-800 rounded-xl px-4 py-3 pr-11 text-sm text-white placeholder-slate-600 focus:outline-none focus:border-amber-500/60 focus:ring-1 focus:ring-amber-500/20 transition-all"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3.5 top-1/2 -translate-y-1/2 text-slate-500 hover:text-slate-300 transition-colors"
                >
                  {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
            </div>

            {/* Confirm Password (setup only) */}
            {isSetup && (
              <div>
                <label className="text-xs font-semibold text-slate-400 mb-1.5 block">
                  Confirm Password
                </label>
                <input
                  id="admin-confirm-password"
                  type={showPassword ? 'text' : 'password'}
                  required
                  autoComplete="new-password"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  placeholder="Repeat password"
                  className="w-full bg-slate-950/80 border border-slate-800 rounded-xl px-4 py-3 text-sm text-white placeholder-slate-600 focus:outline-none focus:border-amber-500/60 focus:ring-1 focus:ring-amber-500/20 transition-all"
                />
              </div>
            )}

            {/* Submit */}
            <button
              id="admin-submit-btn"
              type="submit"
              disabled={loading}
              className="w-full py-3 mt-2 rounded-xl bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-400 hover:to-amber-500 text-slate-950 font-bold text-sm shadow-lg shadow-amber-500/20 hover:shadow-amber-500/30 transition-all flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {loading ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin" />
                  <span>{isSetup ? 'Creating Account...' : 'Signing In...'}</span>
                </>
              ) : (
                <>
                  {isSetup ? <UserPlus className="w-4 h-4" /> : <Lock className="w-4 h-4" />}
                  <span>{isSetup ? 'Create Admin Account & Sign In' : 'Sign In to Dashboard'}</span>
                </>
              )}
            </button>
          </form>

          <div className="pt-4 border-t border-slate-800/60 text-center">
            <Link
              href="/"
              className="inline-flex items-center gap-1.5 text-xs text-slate-500 hover:text-slate-300 transition-colors"
            >
              <ArrowLeft className="w-3.5 h-3.5" />
              <span>Back to Public Storefront</span>
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}

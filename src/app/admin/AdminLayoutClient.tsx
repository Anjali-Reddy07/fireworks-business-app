'use client';

import React from 'react';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import {
  Sparkles,
  LayoutDashboard,
  Package,
  ShoppingBag,
  Boxes,
  MessageSquare,
  ClipboardList,
  LogOut,
  ExternalLink,
  Users,
  UserCheck,
} from 'lucide-react';
import { BUSINESS_CONFIG } from '@/lib/data/sample-products';

interface AdminLayoutClientProps {
  children: React.ReactNode;
}

export function AdminLayoutClient({ children }: AdminLayoutClientProps) {
  const pathname = usePathname();
  const router = useRouter();

  // If on the login page, render child directly without admin shell
  if (pathname === '/admin/login') {
    return <>{children}</>;
  }

  const handleLogout = async () => {
    try {
      await fetch('/api/admin/logout', { method: 'POST' });
      router.push('/admin/login');
      router.refresh();
    } catch (err) {
      console.error(err);
    }
  };

  const navLinks = [
    { href: '/admin', label: 'Overview', icon: LayoutDashboard },
    { href: '/admin/products', label: 'Products', icon: Package },
    { href: '/admin/orders', label: 'Orders', icon: ShoppingBag },
    { href: '/admin/users', label: 'Customers', icon: UserCheck },
    { href: '/admin/inventory', label: 'Inventory', icon: Boxes },
    { href: '/admin/inquiries', label: 'Inquiries', icon: MessageSquare },
    { href: '/admin/logs', label: 'Audit Logs', icon: ClipboardList },
    { href: '/admin/admins', label: 'Admins', icon: Users },
  ];

  return (
    <div className="min-h-screen bg-slate-950 flex flex-col">
      {/* Admin Header */}
      <header className="sticky top-0 z-40 border-b border-slate-800 bg-slate-900/95 backdrop-blur-md">
        <div className="max-w-7xl mx-auto px-3 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-14 sm:h-16">
            {/* Brand */}
            <div className="flex items-center gap-2 sm:gap-3 min-w-0">
              <Link href="/admin" className="flex items-center gap-2 sm:gap-2.5 min-w-0">
                <div className="w-8 h-8 rounded-lg bg-amber-500 flex items-center justify-center text-slate-950 font-bold shrink-0">
                  <Sparkles className="w-4 h-4" />
                </div>
                <div className="min-w-0">
                  <span className="font-bold text-white text-xs sm:text-sm block truncate">{BUSINESS_CONFIG.name}</span>
                  <span className="text-[9px] sm:text-[10px] text-amber-400 font-semibold uppercase tracking-wider block">Admin Control</span>
                </div>
              </Link>
            </div>

            {/* Navigation links (Desktop lg+) */}
            <nav className="hidden lg:flex items-center gap-1">
              {navLinks.map((link) => {
                const Icon = link.icon;
                const isActive = pathname === link.href;

                return (
                  <Link
                    key={link.href}
                    href={link.href}
                    className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-semibold transition-all ${
                      isActive
                        ? 'bg-amber-500/20 text-amber-300 border border-amber-500/40'
                        : 'text-slate-400 hover:text-white hover:bg-slate-800/60'
                    }`}
                  >
                    <Icon className="w-3.5 h-3.5" />
                    <span>{link.label}</span>
                  </Link>
                );
              })}
            </nav>

            {/* Right CTAs */}
            <div className="flex items-center gap-2 sm:gap-3 shrink-0">
              <Link
                href="/"
                target="_blank"
                className="inline-flex items-center gap-1.5 text-xs font-bold text-amber-300 hover:text-white bg-amber-500/10 hover:bg-amber-500/20 px-3 py-1.5 rounded-xl border border-amber-500/30 transition-colors"
                title="Open public buyer storefront in new tab"
              >
                <span>View Buyer Store</span>
                <ExternalLink className="w-3 h-3 text-amber-400" />
              </Link>

              <button
                onClick={handleLogout}
                className="inline-flex items-center gap-1.5 text-xs font-semibold text-rose-400 hover:text-rose-300 bg-rose-950/30 hover:bg-rose-950/50 border border-rose-500/30 px-2.5 sm:px-3 py-1.5 rounded-lg transition-colors cursor-pointer"
              >
                <LogOut className="w-3.5 h-3.5" />
                <span className="hidden xs:inline">Logout</span>
              </button>
            </div>
          </div>
        </div>

        {/* Mobile / Tablet Navigation Sub-bar with smooth horizontal scroll */}
        <div className="lg:hidden border-t border-slate-800/80 px-2 sm:px-4 py-2 flex items-center gap-1 overflow-x-auto touch-scroll scrollbar-none bg-slate-950">
          {navLinks.map((link) => {
            const Icon = link.icon;
            const isActive = pathname === link.href;

            return (
              <Link
                key={link.href}
                href={link.href}
                className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold whitespace-nowrap shrink-0 transition-all ${
                  isActive
                    ? 'bg-amber-500 text-slate-950 font-bold shadow-sm'
                    : 'text-slate-400 hover:text-white hover:bg-slate-900'
                }`}
              >
                <Icon className="w-3.5 h-3.5" />
                <span>{link.label}</span>
              </Link>
            );
          })}
        </div>
      </header>

      {/* Main Admin Content */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-3 sm:px-6 lg:px-8 py-4 sm:py-8">
        {children}
      </main>
    </div>
  );
}

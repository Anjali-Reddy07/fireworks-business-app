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
    <div className="min-h-screen bg-slate-50 flex flex-col text-slate-800">
      {/* Admin Header */}
      <header className="sticky top-0 z-40 border-b border-slate-200 bg-white/95 backdrop-blur-md shadow-xs">
        <div className="max-w-7xl mx-auto px-3 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-14 sm:h-16">
            {/* Brand */}
            <div className="flex items-center gap-2 sm:gap-3 min-w-0">
              <Link href="/admin" className="flex items-center gap-2 sm:gap-2.5 min-w-0">
                <div className="w-8 h-8 rounded-lg bg-blue-600 flex items-center justify-center text-white font-bold shrink-0 shadow-sm shadow-blue-600/30">
                  <Sparkles className="w-4 h-4" />
                </div>
                <div className="min-w-0">
                  <span className="font-bold text-slate-900 text-xs sm:text-sm block truncate">{BUSINESS_CONFIG.name}</span>
                  <span className="text-[9px] sm:text-[10px] text-blue-600 font-bold uppercase tracking-wider block">Admin Control</span>
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
                        ? 'bg-blue-50 text-blue-700 border border-blue-200 font-bold shadow-xs'
                        : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
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
                className="inline-flex items-center gap-1.5 text-xs font-bold text-blue-700 hover:text-blue-800 bg-blue-50 hover:bg-blue-100 px-3 py-1.5 rounded-xl border border-blue-200 transition-colors"
                title="Open public buyer storefront in new tab"
              >
                <span>View Buyer Store</span>
                <ExternalLink className="w-3 h-3 text-blue-600" />
              </Link>

              <button
                onClick={handleLogout}
                className="inline-flex items-center gap-1.5 text-xs font-semibold text-rose-600 hover:text-rose-700 bg-rose-50 hover:bg-rose-100 border border-rose-200 px-2.5 sm:px-3 py-1.5 rounded-lg transition-colors cursor-pointer"
              >
                <LogOut className="w-3.5 h-3.5" />
                <span className="hidden xs:inline">Logout</span>
              </button>
            </div>
          </div>
        </div>

        {/* Mobile / Tablet Navigation Sub-bar with smooth horizontal scroll */}
        <div className="lg:hidden border-t border-slate-200 px-2 sm:px-4 py-2 flex items-center gap-1 overflow-x-auto touch-scroll scrollbar-none bg-white">
          {navLinks.map((link) => {
            const Icon = link.icon;
            const isActive = pathname === link.href;

            return (
              <Link
                key={link.href}
                href={link.href}
                className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold whitespace-nowrap shrink-0 transition-all ${
                  isActive
                    ? 'bg-blue-600 text-white font-bold shadow-sm'
                    : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
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

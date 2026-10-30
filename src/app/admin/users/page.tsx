'use client';

import React, { useEffect, useState } from 'react';
import { 
  Users, 
  Search, 
  RefreshCw, 
  Mail, 
  Phone, 
  Calendar, 
  ShieldCheck, 
  UserCheck,
  ExternalLink,
  MessageCircle,
  Database
} from 'lucide-react';
import { CustomerUserDTO } from '@/app/api/admin/users/route';

export default function AdminUsersPage() {
  const [users, setUsers] = useState<CustomerUserDTO[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');

  const fetchUsers = async () => {
    setLoading(true);
    try {
      const res = await fetch('/api/admin/users');
      if (res.ok) {
        const data = await res.json();
        setUsers(data.users || []);
      }
    } catch (err) {
      console.error('Failed to load customers:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  const filteredUsers = users.filter((u) => {
    const q = searchTerm.toLowerCase();
    return (
      u.name.toLowerCase().includes(q) ||
      u.email.toLowerCase().includes(q) ||
      u.phone.toLowerCase().includes(q)
    );
  });

  return (
    <div className="space-y-6 sm:space-y-8">
      {/* Page Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <h1 className="text-xl sm:text-2xl lg:text-3xl font-black text-white">Registered Customers</h1>
            <span className="px-2.5 py-0.5 rounded-full text-xs font-bold bg-amber-500/10 border border-amber-500/30 text-amber-400">
              {users.length} Total
            </span>
          </div>
          <p className="text-xs text-slate-400">
            View and manage customer accounts registered in your Firebase Firestore store database
          </p>
        </div>

        <button
          onClick={fetchUsers}
          disabled={loading}
          className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-slate-900 border border-slate-800 text-xs font-semibold text-slate-300 hover:text-white hover:bg-slate-800 transition-colors cursor-pointer shrink-0"
        >
          <RefreshCw className={`w-3.5 h-3.5 ${loading ? 'animate-spin' : ''}`} />
          <span>Refresh Customers</span>
        </button>
      </div>

      {/* Metrics & Search Bar */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {/* Metric 1: Total Users */}
        <div className="p-4 sm:p-5 rounded-2xl bg-slate-900 border border-slate-800 flex items-center justify-between">
          <div>
            <span className="text-xs font-bold text-slate-400 block mb-1">Registered Accounts</span>
            <span className="text-2xl sm:text-3xl font-black text-white">{users.length}</span>
            <span className="text-[11px] text-emerald-400 block mt-1">● Firestore `users` Collection</span>
          </div>
          <div className="w-12 h-12 rounded-2xl bg-amber-500/10 border border-amber-500/20 text-amber-400 flex items-center justify-center">
            <Users className="w-6 h-6" />
          </div>
        </div>

        {/* Metric 2: Active Accounts */}
        <div className="p-4 sm:p-5 rounded-2xl bg-slate-900 border border-slate-800 flex items-center justify-between">
          <div>
            <span className="text-xs font-bold text-slate-400 block mb-1">Active Shoppers</span>
            <span className="text-2xl sm:text-3xl font-black text-amber-400">{users.length}</span>
            <span className="text-[11px] text-amber-300 block mt-1">100% Verified Phone/Email</span>
          </div>
          <div className="w-12 h-12 rounded-2xl bg-amber-500/10 border border-amber-500/20 text-amber-400 flex items-center justify-center">
            <UserCheck className="w-6 h-6" />
          </div>
        </div>

        {/* Metric 3: Database Status */}
        <div className="p-4 sm:p-5 rounded-2xl bg-slate-900 border border-slate-800 flex items-center justify-between">
          <div>
            <span className="text-xs font-bold text-slate-400 block mb-1">Database Sync</span>
            <span className="text-base sm:text-lg font-bold text-emerald-400">Firebase Cloud</span>
            <span className="text-[11px] text-slate-400 block mt-1">Real-time authentication</span>
          </div>
          <div className="w-12 h-12 rounded-2xl bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 flex items-center justify-center">
            <Database className="w-6 h-6" />
          </div>
        </div>
      </div>

      {/* Search Filter Box */}
      <div className="p-4 rounded-2xl bg-slate-900 border border-slate-800">
        <div className="relative">
          <Search className="w-4 h-4 text-slate-500 absolute left-3.5 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="Search customer by name, email, or phone number..."
            className="w-full bg-slate-950/80 border border-slate-800 rounded-xl pl-10 pr-4 py-2.5 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-amber-500/60"
          />
        </div>
      </div>

      {/* Users Table */}
      <div className="rounded-2xl bg-slate-900 border border-slate-800 overflow-hidden shadow-xl">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-slate-950/60 text-slate-400 font-bold border-b border-slate-800 uppercase tracking-wider text-[10px]">
              <tr>
                <th className="py-3 px-4">Customer</th>
                <th className="py-3 px-4">Contact Info</th>
                <th className="py-3 px-4">Role / Type</th>
                <th className="py-3 px-4">Joined Date</th>
                <th className="py-3 px-4 text-right">Quick Contact</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800/80">
              {loading ? (
                <tr>
                  <td colSpan={5} className="py-8 text-center text-slate-500">
                    <RefreshCw className="w-6 h-6 animate-spin mx-auto mb-2 text-amber-400" />
                    <span>Loading registered users from Firebase...</span>
                  </td>
                </tr>
              ) : filteredUsers.length === 0 ? (
                <tr>
                  <td colSpan={5} className="py-8 text-center text-slate-500">
                    No customers found matching &quot;{searchTerm}&quot;.
                  </td>
                </tr>
              ) : (
                filteredUsers.map((u) => {
                  const cleanPhone = u.phone.replace(/[^\d]/g, '');
                  const whatsappLink = cleanPhone ? `https://wa.me/${cleanPhone.length === 10 ? '91' + cleanPhone : cleanPhone}` : null;

                  return (
                    <tr key={u.id} className="hover:bg-slate-800/30 transition-colors">
                      {/* Name & Avatar */}
                      <td className="py-3.5 px-4">
                        <div className="flex items-center gap-3">
                          <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-amber-500 to-orange-500 text-slate-950 font-black flex items-center justify-center text-xs shrink-0 shadow-sm shadow-amber-500/20">
                            {u.name.slice(0, 2).toUpperCase()}
                          </div>
                          <div>
                            <span className="font-bold text-white block text-sm">{u.name}</span>
                            <span className="text-[10px] text-slate-500 font-mono">ID: {u.id}</span>
                          </div>
                        </div>
                      </td>

                      {/* Contact Info */}
                      <td className="py-3.5 px-4 space-y-1">
                        <div className="flex items-center gap-1.5 text-slate-300">
                          <Mail className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                          <span>{u.email}</span>
                        </div>
                        {u.phone && (
                          <div className="flex items-center gap-1.5 text-slate-400">
                            <Phone className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
                            <span>{u.phone}</span>
                          </div>
                        )}
                      </td>

                      {/* Role */}
                      <td className="py-3.5 px-4">
                        <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-amber-500/10 border border-amber-500/20 text-amber-300 uppercase tracking-wide">
                          <ShieldCheck className="w-3 h-3 text-amber-400" />
                          {u.role || 'Customer'}
                        </span>
                      </td>

                      {/* Joined Date */}
                      <td className="py-3.5 px-4 text-slate-400">
                        <div className="flex items-center gap-1.5">
                          <Calendar className="w-3.5 h-3.5 text-slate-500 shrink-0" />
                          <span>{u.createdAt ? new Date(u.createdAt).toLocaleDateString('en-IN', { day: '2-digit', month: 'short', year: 'numeric' }) : 'Recent'}</span>
                        </div>
                      </td>

                      {/* Quick Contact CTA */}
                      <td className="py-3.5 px-4 text-right">
                        <div className="flex items-center justify-end gap-2">
                          {whatsappLink && (
                            <a
                              href={whatsappLink}
                              target="_blank"
                              rel="noreferrer"
                              className="inline-flex items-center gap-1 px-2.5 py-1.5 rounded-lg bg-emerald-950/60 border border-emerald-500/30 text-emerald-300 hover:bg-emerald-900/60 text-xs font-semibold transition-colors"
                              title="Message via WhatsApp"
                            >
                              <MessageCircle className="w-3.5 h-3.5 text-emerald-400" />
                              <span>WhatsApp</span>
                            </a>
                          )}
                          <a
                            href={`mailto:${u.email}`}
                            className="p-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white transition-colors"
                            title="Send Email"
                          >
                            <Mail className="w-3.5 h-3.5" />
                          </a>
                        </div>
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}


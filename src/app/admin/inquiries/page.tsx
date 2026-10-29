'use client';

import React, { useEffect, useState } from 'react';
import { MessageSquare, RefreshCw, Calendar, Search, Upload, Loader2, X } from 'lucide-react';
import { Inquiry, InquiryStatus } from '@/types';
import { BUSINESS_CONFIG } from '@/lib/data/sample-products';

export default function AdminInquiriesPage() {
  const [inquiries, setInquiries] = useState<Inquiry[]>([]);
  const [loading, setLoading] = useState(true);
  const [filterStatus, setFilterStatus] = useState<string>('all');
  const [search, setSearch] = useState('');
  const [syncingFirebase, setSyncingFirebase] = useState(false);
  const [syncMessage, setSyncMessage] = useState<string | null>(null);

  const handleSyncToFirebase = async () => {
    setSyncingFirebase(true);
    setSyncMessage(null);
    try {
      const res = await fetch('/api/seed-firestore');
      const data = await res.json();
      if (data.success) {
        setSyncMessage(`Successfully seeded all e-commerce tables into Firebase Firestore!`);
        fetchInquiries();
      } else {
        alert(data.error || 'Failed to sync to Firebase');
      }
    } catch {
      alert('Error connecting to Firebase seed endpoint');
    } finally {
      setSyncingFirebase(false);
    }
  };

  const fetchInquiries = async () => {
    setLoading(true);
    try {
      const res = await fetch('/api/admin/inquiries');
      if (res.ok) {
        const data = await res.json();
        setInquiries(data.inquiries || []);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchInquiries();
  }, []);

  const handleUpdateStatus = async (id: string, status: InquiryStatus) => {
    try {
      const res = await fetch('/api/admin/inquiries', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ id, status }),
      });
      if (res.ok) {
        setInquiries((prev) =>
          prev.map((inq) => (inq.id === id ? { ...inq, status } : inq))
        );
      }
    } catch (err) {
      console.error(err);
    }
  };

  const filtered = inquiries.filter((i) => {
    if (filterStatus !== 'all' && i.status !== filterStatus) return false;
    if (search.trim()) {
      const q = search.toLowerCase();
      return (
        i.customerName.toLowerCase().includes(q) ||
        i.refId.toLowerCase().includes(q) ||
        i.phone.includes(q)
      );
    }
    return true;
  });

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-white">Festive Inquiries & Quotation Tracker</h1>
          <p className="text-xs text-slate-400 mt-1">
            Manage seasonal pre-bookings, festive family package requests, and send custom quotations via WhatsApp
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-2 sm:gap-3">
          <button
            onClick={handleSyncToFirebase}
            disabled={syncingFirebase}
            className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-slate-900 border border-amber-500/40 hover:bg-slate-800 text-amber-400 font-bold text-xs shadow-md cursor-pointer disabled:opacity-50"
            title="Upload e-commerce tables to Firebase Firestore"
          >
            {syncingFirebase ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : <Upload className="w-3.5 h-3.5" />}
            <span>{syncingFirebase ? 'Syncing...' : 'Sync to Firebase'}</span>
          </button>

          <button
            onClick={fetchInquiries}
            disabled={loading}
            className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-slate-900 border border-slate-800 text-xs text-slate-300 hover:text-white transition-colors cursor-pointer"
          >
            <RefreshCw className={`w-3.5 h-3.5 ${loading ? 'animate-spin' : ''}`} />
            <span>Refresh List</span>
          </button>
        </div>
      </div>

      {/* Sync notification message */}
      {syncMessage && (
        <div className="p-3.5 rounded-2xl bg-emerald-950/70 border border-emerald-500/40 text-emerald-300 text-xs flex items-center justify-between shadow-lg">
          <span className="font-semibold">{syncMessage}</span>
          <button
            onClick={() => setSyncMessage(null)}
            className="text-emerald-400 hover:text-white cursor-pointer ml-3 p-1"
          >
            <X className="w-4 h-4" />
          </button>
        </div>
      )}

      {/* Filter and Search Bar */}
      <div className="bg-slate-900 border border-slate-800 rounded-2xl p-4 flex flex-col sm:flex-row gap-3 items-center justify-between">
        <div className="relative w-full sm:max-w-xs">
          <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search by name, ref ID, phone..."
            className="w-full bg-slate-950 border border-slate-800 rounded-xl pl-9 pr-4 py-2 text-xs text-white focus:outline-none focus:border-amber-500"
          />
        </div>

        <div className="flex items-center gap-1.5 sm:gap-2 overflow-x-auto pb-1 touch-scroll scrollbar-none">
          {['all', 'Pending', 'Contacted', 'Quote Sent', 'Confirmed'].map((st) => (
            <button
              key={st}
              onClick={() => setFilterStatus(st)}
              className={`px-3 py-1.5 rounded-lg text-xs font-semibold whitespace-nowrap cursor-pointer transition-all shrink-0 ${
                filterStatus === st
                  ? 'bg-amber-500 text-slate-950 font-bold'
                  : 'bg-slate-950 text-slate-400 border border-slate-800 hover:text-white'
              }`}
            >
              {st === 'all' ? `All (${inquiries.length})` : st}
            </button>
          ))}
        </div>
      </div>

      {/* Mobile Card View (Visible on < md) */}
      <div className="md:hidden space-y-3">
        {filtered.map((inq) => {
          const cleanedPhone = inq.phone.replace(/[^\d]/g, '');
          const whatsappMessage = encodeURIComponent(
            `Namaste ${inq.customerName}, this is ${BUSINESS_CONFIG.name}! Thank you for your festive crackers inquiry (#${inq.refId}) for ${inq.festivalDate}. Here is our special seasonal price list and package quote...`
          );
          const whatsappLink = `https://wa.me/${cleanedPhone}?text=${whatsappMessage}`;

          return (
            <div key={inq.id} className="p-4 rounded-2xl bg-slate-900 border border-slate-800 space-y-3 shadow-lg">
              <div className="flex items-start justify-between gap-2">
                <div>
                  <span className="font-mono font-bold text-amber-400 text-xs block mb-0.5">{inq.refId}</span>
                  <span className="font-bold text-white text-sm block">{inq.customerName}</span>
                </div>
                <select
                  value={inq.status}
                  onChange={(e) => handleUpdateStatus(inq.id, e.target.value as InquiryStatus)}
                  className={`text-xs font-semibold rounded-lg px-2 py-1 border focus:outline-none cursor-pointer ${
                    inq.status === 'Pending'
                      ? 'bg-rose-950 text-rose-300 border-rose-500/40'
                      : inq.status === 'Contacted'
                      ? 'bg-amber-950 text-amber-300 border-amber-500/40'
                      : inq.status === 'Quote Sent'
                      ? 'bg-sky-950 text-sky-300 border-sky-500/40'
                      : 'bg-emerald-950 text-emerald-300 border-emerald-500/40'
                  }`}
                >
                  <option value="Pending">Pending</option>
                  <option value="Contacted">Contacted</option>
                  <option value="Quote Sent">Quote Sent</option>
                  <option value="Confirmed">Confirmed</option>
                  <option value="Cancelled">Cancelled</option>
                </select>
              </div>

              <div className="grid grid-cols-2 gap-2 text-xs bg-slate-950/60 p-2.5 rounded-xl border border-slate-800">
                <div>
                  <span className="text-slate-500 text-[10px] block">Occasion Date</span>
                  <span className="font-semibold text-slate-200">{inq.festivalDate}</span>
                </div>
                <div>
                  <span className="text-slate-500 text-[10px] block">Phone</span>
                  <a href={`tel:${inq.phone.replace(/\s+/g, '')}`} className="font-semibold text-amber-400">
                    {inq.phone}
                  </a>
                </div>
              </div>

              <div>
                <span className="text-xs font-semibold text-slate-300 block mb-0.5">{inq.requirementType}</span>
                {inq.notes ? (
                  <p className="text-slate-400 text-xs leading-relaxed italic bg-slate-950/40 p-2 rounded-lg border border-slate-800/60">
                    &ldquo;{inq.notes}&rdquo;
                  </p>
                ) : (
                  <span className="text-slate-600 text-xs">No extra notes</span>
                )}
              </div>

              <div className="pt-2 border-t border-slate-800 flex items-center justify-between gap-3">
                <span className="text-[10px] text-slate-500">
                  {new Date(inq.createdAt).toLocaleDateString('en-IN')}
                </span>
                <a
                  href={whatsappLink}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex-1 max-w-[200px] text-center inline-flex items-center justify-center gap-1.5 py-2 px-3 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs shadow-md transition-colors"
                >
                  <MessageSquare className="w-3.5 h-3.5" />
                  <span>Send Quote</span>
                </a>
              </div>
            </div>
          );
        })}

        {filtered.length === 0 && (
          <div className="p-8 text-center bg-slate-900 border border-slate-800 rounded-2xl text-xs text-slate-500">
            No customer inquiries found for this filter.
          </div>
        )}
      </div>

      {/* Desktop Inquiries Table (Hidden on mobile < md) */}
      <div className="hidden md:block bg-slate-900 border border-slate-800 rounded-2xl overflow-hidden shadow-xl">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-slate-950 border-b border-slate-800 text-slate-400 uppercase font-semibold">
              <tr>
                <th className="px-5 py-3.5">Ref ID & Customer</th>
                <th className="px-5 py-3.5">Phone & Contact</th>
                <th className="px-5 py-3.5">Festival Date</th>
                <th className="px-5 py-3.5">Requirement & Notes</th>
                <th className="px-5 py-3.5">Status</th>
                <th className="px-5 py-3.5 text-right">Send WhatsApp Quote</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800">
              {filtered.map((inq) => {
                const cleanedPhone = inq.phone.replace(/[^\d]/g, '');
                const whatsappMessage = encodeURIComponent(
                  `Namaste ${inq.customerName}, this is ${BUSINESS_CONFIG.name}! Thank you for your festive crackers inquiry (#${inq.refId}) for ${inq.festivalDate}. Here is our special seasonal price list and package quote...`
                );
                const whatsappLink = `https://wa.me/${cleanedPhone}?text=${whatsappMessage}`;

                return (
                  <tr key={inq.id} className="hover:bg-slate-800/40 transition-colors">
                    <td className="px-5 py-4">
                      <span className="font-mono font-bold text-amber-400 block mb-0.5">{inq.refId}</span>
                      <span className="font-bold text-white block text-sm">{inq.customerName}</span>
                      <span className="text-slate-500 text-[10px]">
                        Recd: {new Date(inq.createdAt).toLocaleDateString('en-IN')}
                      </span>
                    </td>

                    <td className="px-5 py-4">
                      <a
                        href={`tel:${inq.phone.replace(/\s+/g, '')}`}
                        className="text-white hover:text-amber-400 font-semibold block"
                      >
                        {inq.phone}
                      </a>
                      {inq.email && <span className="text-slate-400 text-[11px] block">{inq.email}</span>}
                    </td>

                    <td className="px-5 py-4">
                      <div className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-slate-950 border border-slate-800 text-slate-200">
                        <Calendar className="w-3.5 h-3.5 text-amber-400" />
                        <span className="font-medium">{inq.festivalDate}</span>
                      </div>
                    </td>

                    <td className="px-5 py-4 max-w-xs">
                      <span className="font-semibold text-slate-200 block mb-0.5">{inq.requirementType}</span>
                      {inq.notes ? (
                        <p className="text-slate-400 text-[11px] line-clamp-2 leading-relaxed">
                          &ldquo;{inq.notes}&rdquo;
                        </p>
                      ) : (
                        <span className="text-slate-600 text-[11px]">No additional notes</span>
                      )}
                    </td>

                    <td className="px-5 py-4">
                      <select
                        value={inq.status}
                        onChange={(e) => handleUpdateStatus(inq.id, e.target.value as InquiryStatus)}
                        className={`text-xs font-semibold rounded-lg px-2.5 py-1 border focus:outline-none cursor-pointer ${
                          inq.status === 'Pending'
                            ? 'bg-rose-950 text-rose-300 border-rose-500/40'
                            : inq.status === 'Contacted'
                            ? 'bg-amber-950 text-amber-300 border-amber-500/40'
                            : inq.status === 'Quote Sent'
                            ? 'bg-sky-950 text-sky-300 border-sky-500/40'
                            : 'bg-emerald-950 text-emerald-300 border-emerald-500/40'
                        }`}
                      >
                        <option value="Pending">Pending</option>
                        <option value="Contacted">Contacted</option>
                        <option value="Quote Sent">Quote Sent</option>
                        <option value="Confirmed">Confirmed</option>
                        <option value="Cancelled">Cancelled</option>
                      </select>
                    </td>

                    <td className="px-5 py-4 text-right">
                      <a
                        href={whatsappLink}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-emerald-950/80 hover:bg-emerald-900 text-emerald-300 border border-emerald-500/30 font-semibold text-xs transition-colors"
                        title="Chat with customer on WhatsApp"
                      >
                        <MessageSquare className="w-3.5 h-3.5" />
                        <span>WhatsApp</span>
                      </a>
                    </td>
                  </tr>
                );
              })}

              {filtered.length === 0 && (
                <tr>
                  <td colSpan={6} className="px-5 py-12 text-center text-slate-500">
                    No customer inquiries found for this filter.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}

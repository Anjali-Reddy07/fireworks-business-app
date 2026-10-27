'use client';

import React, { useEffect, useState } from 'react';
import { MessageSquare, RefreshCw, Phone, Calendar, User, Search, CheckCircle, ExternalLink } from 'lucide-react';
import { Inquiry, InquiryStatus } from '@/types';
import { BUSINESS_CONFIG } from '@/lib/data/sample-products';

export default function AdminInquiriesPage() {
  const [inquiries, setInquiries] = useState<Inquiry[]>([]);
  const [loading, setLoading] = useState(true);
  const [filterStatus, setFilterStatus] = useState<string>('all');
  const [search, setSearch] = useState('');

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
          <h1 className="text-2xl sm:text-3xl font-extrabold text-white">Store Visit & Quote Inquiries</h1>
          <p className="text-xs text-slate-400 mt-1">
            Track permitted walk-in customer reservations, festive family inquiries, and dispatch direct WhatsApp follow-ups
          </p>
        </div>

        <button
          onClick={fetchInquiries}
          disabled={loading}
          className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-slate-900 border border-slate-800 text-xs text-slate-300 hover:text-white transition-colors cursor-pointer"
        >
          <RefreshCw className={`w-3.5 h-3.5 ${loading ? 'animate-spin' : ''}`} />
          <span>Refresh List</span>
        </button>
      </div>

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

        <div className="flex items-center gap-2">
          {['all', 'Pending', 'Contacted', 'Store Visited', 'Completed'].map((st) => (
            <button
              key={st}
              onClick={() => setFilterStatus(st)}
              className={`px-3 py-1.5 rounded-lg text-xs font-semibold cursor-pointer transition-all ${
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

      {/* Inquiries Table */}
      <div className="bg-slate-900 border border-slate-800 rounded-2xl overflow-hidden shadow-xl">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-slate-950 border-b border-slate-800 text-slate-400 uppercase font-semibold">
              <tr>
                <th className="px-5 py-3.5">Ref ID & Customer</th>
                <th className="px-5 py-3.5">Phone & Contact</th>
                <th className="px-5 py-3.5">Visit Date</th>
                <th className="px-5 py-3.5">Requirement & Notes</th>
                <th className="px-5 py-3.5">Status</th>
                <th className="px-5 py-3.5 text-right">Quick Follow-up</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800">
              {filtered.map((inq) => {
                const cleanedPhone = inq.phone.replace(/[^\d]/g, '');
                const whatsappMessage = encodeURIComponent(
                  `Namaste ${inq.customerName}, this is ${BUSINESS_CONFIG.name}. We received your visit inquiry (#${inq.refId}) for ${inq.visitDate}. Our retail showroom at ${BUSINESS_CONFIG.address} is ready to welcome you with our complete green crackers collection!`
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
                        <span className="font-medium">{inq.visitDate}</span>
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
                            : inq.status === 'Store Visited'
                            ? 'bg-sky-950 text-sky-300 border-sky-500/40'
                            : 'bg-emerald-950 text-emerald-300 border-emerald-500/40'
                        }`}
                      >
                        <option value="Pending">Pending</option>
                        <option value="Contacted">Contacted</option>
                        <option value="Store Visited">Store Visited</option>
                        <option value="Completed">Completed</option>
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

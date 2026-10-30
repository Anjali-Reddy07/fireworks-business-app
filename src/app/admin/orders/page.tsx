'use client';

import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import {
  ShoppingBag,
  Search,
  RefreshCw,
  Clock,
  CheckCircle2,
  Truck,
  PackageCheck,
  AlertCircle,
  Phone,
  Mail,
  Calendar,
  MessageCircle,
  ChevronDown,
  ChevronUp,
} from 'lucide-react';
import { OrderRecord } from '@/app/api/orders/route';

type FilterStatus = 'all' | 'Pending' | 'Confirmed' | 'Dispatched' | 'Delivered' | 'Cancelled';

export default function AdminOrdersPage() {
  const router = useRouter();
  const [orders, setOrders] = useState<OrderRecord[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [filter, setFilter] = useState<FilterStatus>('all');
  const [expandedOrderId, setExpandedOrderId] = useState<string | null>(null);
  const [updatingId, setUpdatingId] = useState<string | null>(null);

  const fetchOrders = async () => {
    setLoading(true);
    try {
      const res = await fetch('/api/admin/orders');
      if (res.status === 401) {
        router.push('/admin/login');
        return;
      }
      if (res.ok) {
        const data = await res.json();
        setOrders(data.orders || []);
      }
    } catch (err) {
      console.error('Failed to fetch orders:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchOrders();
  }, []);

  const handleUpdateStatus = async (
    orderId: string,
    newStatus: OrderRecord['status'],
    paymentStatus?: OrderRecord['paymentStatus']
  ) => {
    setUpdatingId(orderId);
    try {
      const res = await fetch('/api/admin/orders', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ id: orderId, status: newStatus, paymentStatus }),
      });

      if (res.ok) {
        setOrders((prev) =>
          prev.map((o) =>
            o.orderId === orderId || o.id === orderId
              ? { ...o, status: newStatus, ...(paymentStatus ? { paymentStatus } : {}) }
              : o
          )
        );
      }
    } catch (err) {
      console.error('Failed to update order status:', err);
    } finally {
      setUpdatingId(null);
    }
  };

  const filteredOrders = orders.filter((o) => {
    if (filter !== 'all' && o.status !== filter) return false;
    if (search.trim()) {
      const q = search.toLowerCase();
      const matchId = (o.orderId || o.id || '').toLowerCase().includes(q);
      const matchName = (o.customerName || '').toLowerCase().includes(q);
      const matchPhone = (o.customerPhone || '').toLowerCase().includes(q);
      const matchEmail = (o.customerEmail || '').toLowerCase().includes(q);
      return matchId || matchName || matchPhone || matchEmail;
    }
    return true;
  });

  // Metric counts
  const totalRevenue = orders
    .filter((o) => o.status !== 'Cancelled')
    .reduce((sum, o) => sum + (o.total || 0), 0);
  const pendingCount = orders.filter((o) => o.status === 'Pending').length;
  const confirmedCount = orders.filter((o) => o.status === 'Confirmed').length;
  const dispatchedCount = orders.filter((o) => o.status === 'Dispatched').length;

  const getStatusBadge = (status: OrderRecord['status']) => {
    switch (status) {
      case 'Pending':
        return 'bg-amber-950/80 text-amber-400 border-amber-500/30';
      case 'Confirmed':
        return 'bg-blue-950/80 text-blue-400 border-blue-500/30';
      case 'Dispatched':
        return 'bg-purple-950/80 text-purple-400 border-purple-500/30';
      case 'Delivered':
        return 'bg-emerald-950/80 text-emerald-400 border-emerald-500/30';
      case 'Cancelled':
        return 'bg-rose-950/80 text-rose-400 border-rose-500/30';
      default:
        return 'bg-slate-800 text-slate-300 border-slate-700';
    }
  };

  return (
    <div className="space-y-6 sm:space-y-8">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 sm:gap-4">
        <div>
          <h1 className="text-xl sm:text-2xl lg:text-3xl font-extrabold text-white">
            Customer Orders & Festive Pre-Bookings
          </h1>
          <p className="text-xs text-slate-400 mt-0.5 sm:mt-1">
            Real-time orders stored in Firebase Firestore with counter pickup scheduling
          </p>
        </div>

        <button
          onClick={fetchOrders}
          disabled={loading}
          className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-slate-900 border border-slate-800 text-xs text-slate-300 hover:text-white hover:bg-slate-800 transition-colors cursor-pointer w-fit"
        >
          <RefreshCw className={`w-3.5 h-3.5 ${loading ? 'animate-spin' : ''}`} />
          <span>Refresh Orders</span>
        </button>
      </div>

      {/* Metrics Grid */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-5">
        <div className="p-4 rounded-2xl bg-slate-900 border border-slate-800 flex items-center justify-between">
          <div>
            <span className="text-[11px] font-semibold text-slate-400 block mb-0.5">Total Orders</span>
            <span className="text-2xl sm:text-3xl font-extrabold text-white">{orders.length}</span>
            <span className="text-[10px] text-amber-400 block mt-0.5">Firebase Synced</span>
          </div>
          <div className="w-10 h-10 rounded-xl bg-amber-500/10 border border-amber-500/20 text-amber-400 flex items-center justify-center shrink-0">
            <ShoppingBag className="w-5 h-5" />
          </div>
        </div>

        <div className="p-4 rounded-2xl bg-slate-900 border border-slate-800 flex items-center justify-between">
          <div>
            <span className="text-[11px] font-semibold text-slate-400 block mb-0.5">Awaiting Confirmation</span>
            <span className="text-2xl sm:text-3xl font-extrabold text-amber-400">{pendingCount}</span>
            <span className="text-[10px] text-slate-400 block mt-0.5">Action required</span>
          </div>
          <div className="w-10 h-10 rounded-xl bg-amber-500/10 border border-amber-500/20 text-amber-400 flex items-center justify-center shrink-0">
            <Clock className="w-5 h-5" />
          </div>
        </div>

        <div className="p-4 rounded-2xl bg-slate-900 border border-slate-800 flex items-center justify-between">
          <div>
            <span className="text-[11px] font-semibold text-slate-400 block mb-0.5">Ready / Dispatched</span>
            <span className="text-2xl sm:text-3xl font-extrabold text-purple-400">{confirmedCount + dispatchedCount}</span>
            <span className="text-[10px] text-purple-300 block mt-0.5">Packaged for pickup</span>
          </div>
          <div className="w-10 h-10 rounded-xl bg-purple-500/10 border border-purple-500/20 text-purple-400 flex items-center justify-center shrink-0">
            <Truck className="w-5 h-5" />
          </div>
        </div>

        <div className="p-4 rounded-2xl bg-slate-900 border border-slate-800 flex items-center justify-between">
          <div>
            <span className="text-[11px] font-semibold text-slate-400 block mb-0.5">Booking Revenue</span>
            <span className="text-xl sm:text-2xl font-extrabold text-emerald-400">
              ₹{totalRevenue.toLocaleString('en-IN')}
            </span>
            <span className="text-[10px] text-emerald-300 block mt-0.5">Total Value</span>
          </div>
          <div className="w-10 h-10 rounded-xl bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 flex items-center justify-center shrink-0">
            <CheckCircle2 className="w-5 h-5" />
          </div>
        </div>
      </div>

      {/* Filter and Search Bar */}
      <div className="bg-slate-900 border border-slate-800 rounded-2xl p-3.5 sm:p-4 flex flex-col sm:flex-row gap-3 items-stretch sm:items-center justify-between">
        <div className="relative w-full sm:max-w-xs">
          <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search by order ID, name, phone..."
            className="w-full bg-slate-950 border border-slate-800 rounded-xl pl-9 pr-4 py-2 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-amber-500"
          />
        </div>

        {/* Filter Pills */}
        <div className="flex items-center gap-1.5 overflow-x-auto pb-1 sm:pb-0">
          {(['all', 'Pending', 'Confirmed', 'Dispatched', 'Delivered', 'Cancelled'] as FilterStatus[]).map((st) => (
            <button
              key={st}
              onClick={() => setFilter(st)}
              className={`px-3 py-1.5 rounded-xl text-xs font-semibold whitespace-nowrap transition-colors cursor-pointer ${
                filter === st
                  ? 'bg-amber-500 text-slate-950'
                  : 'bg-slate-950 text-slate-400 hover:text-white border border-slate-800'
              }`}
            >
              {st === 'all' ? `All (${orders.length})` : st}
            </button>
          ))}
        </div>
      </div>

      {/* Orders Table */}
      <div className="bg-slate-900 border border-slate-800 rounded-2xl overflow-hidden shadow-xl">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-slate-950/80 border-b border-slate-800 text-slate-400 uppercase tracking-wider text-[10px]">
              <tr>
                <th className="py-3.5 px-4 font-semibold">Order ID & Date</th>
                <th className="py-3.5 px-4 font-semibold">Customer Details</th>
                <th className="py-3.5 px-4 font-semibold">Pickup / Festival Date</th>
                <th className="py-3.5 px-4 font-semibold">Items & Total</th>
                <th className="py-3.5 px-4 font-semibold">Admin / Status</th>
                <th className="py-3.5 px-4 font-semibold text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800/60">
              {filteredOrders.map((ord) => {
                const isExpanded = expandedOrderId === ord.orderId;
                const cleanPhone = (ord.customerPhone || '').replace(/[^\d]/g, '');
                const whatsappMsg = encodeURIComponent(
                  `Hello ${ord.customerName}, this is regarding your Fireworks Pre-Booking ${ord.orderId} (₹${ord.total}). Status: ${ord.status}. Ready for pickup on ${ord.festivalDate}.`
                );
                const whatsappUrl = `https://wa.me/91${cleanPhone.slice(-10)}?text=${whatsappMsg}`;

                return (
                  <React.Fragment key={ord.orderId || ord.id}>
                    <tr className="hover:bg-slate-800/30 transition-colors">
                      {/* Order ID & Date */}
                      <td className="py-3.5 px-4">
                        <span className="font-mono font-bold text-amber-400 block">
                          {ord.orderId || ord.id}
                        </span>
                        <span className="text-[10px] text-slate-500 block">
                          {new Date(ord.createdAt).toLocaleDateString('en-IN', {
                            day: 'numeric',
                            month: 'short',
                            hour: '2-digit',
                            minute: '2-digit',
                          })}
                        </span>
                      </td>

                      {/* Customer Details */}
                      <td className="py-3.5 px-4">
                        <span className="font-bold text-white block truncate max-w-[150px]">
                          {ord.customerName}
                        </span>
                        <div className="flex items-center gap-1.5 text-[11px] text-slate-400 mt-0.5">
                          <Phone className="w-3 h-3 text-emerald-400 shrink-0" />
                          <span>{ord.customerPhone}</span>
                        </div>
                        {ord.customerEmail && ord.customerEmail !== 'counter@fireworks.local' && (
                          <div className="flex items-center gap-1.5 text-[10px] text-slate-500 truncate max-w-[180px]">
                            <Mail className="w-3 h-3 text-sky-400 shrink-0" />
                            <span>{ord.customerEmail}</span>
                          </div>
                        )}
                      </td>

                      {/* Festival / Pickup Date */}
                      <td className="py-3.5 px-4">
                        <div className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-slate-950 border border-slate-800 text-[11px] text-amber-300">
                          <Calendar className="w-3 h-3 text-amber-400" />
                          <span>{ord.festivalDate}</span>
                        </div>
                        {ord.pickupNote && (
                          <span className="text-[10px] text-slate-400 block mt-1 italic truncate max-w-[200px]" title={ord.pickupNote}>
                            &ldquo;{ord.pickupNote}&rdquo;
                          </span>
                        )}
                      </td>

                      {/* Items & Total */}
                      <td className="py-3.5 px-4">
                        <div className="flex items-center gap-2">
                          <span className="font-bold text-white text-sm">
                            ₹{ord.total?.toLocaleString('en-IN')}
                          </span>
                          <span className="text-[10px] text-slate-400">
                            ({ord.items?.length || 0} items)
                          </span>
                        </div>
                        <button
                          onClick={() => setExpandedOrderId(isExpanded ? null : ord.orderId)}
                          className="text-[10px] text-amber-400 hover:text-amber-300 inline-flex items-center gap-0.5 mt-0.5 cursor-pointer"
                        >
                          <span>{isExpanded ? 'Hide items' : 'View items'}</span>
                          {isExpanded ? <ChevronUp className="w-3 h-3" /> : <ChevronDown className="w-3 h-3" />}
                        </button>
                      </td>

                      {/* Status & Admin Column */}
                      <td className="py-3.5 px-4 space-y-1">
                        <select
                          value={ord.status}
                          disabled={updatingId === ord.orderId}
                          onChange={(e) =>
                            handleUpdateStatus(ord.orderId, e.target.value as OrderRecord['status'])
                          }
                          className={`px-2.5 py-1 rounded-xl text-[11px] font-bold border focus:outline-none cursor-pointer ${getStatusBadge(
                            ord.status
                          )}`}
                        >
                          <option value="Pending">Pending</option>
                          <option value="Confirmed">Confirmed</option>
                          <option value="Dispatched">Dispatched</option>
                          <option value="Delivered">Delivered</option>
                          <option value="Cancelled">Cancelled</option>
                        </select>
                        <span className="text-[10px] text-slate-400 block font-mono">
                          Desk: {ord.admin || 'Store Admin'}
                        </span>
                      </td>

                      {/* Actions */}
                      <td className="py-3.5 px-4 text-right">
                        {cleanPhone.length >= 10 && (
                          <a
                            href={whatsappUrl}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="inline-flex items-center gap-1 px-2.5 py-1.5 rounded-lg bg-emerald-950/80 border border-emerald-500/30 text-emerald-400 hover:bg-emerald-900 text-[11px] font-semibold transition-colors"
                          >
                            <MessageCircle className="w-3 h-3" />
                            <span>WhatsApp</span>
                          </a>
                        )}
                      </td>
                    </tr>

                    {/* Expandable Order Items Row */}
                    {isExpanded && (
                      <tr className="bg-slate-950/60">
                        <td colSpan={6} className="py-3 px-6">
                          <div className="p-3 rounded-xl bg-slate-900/90 border border-slate-800 space-y-2">
                            <span className="text-[11px] font-bold text-slate-300 block">
                              Order Items Breakdown:
                            </span>
                            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-2">
                              {ord.items?.map((it, idx) => (
                                <div
                                  key={idx}
                                  className="p-2 rounded-lg bg-slate-950 border border-slate-800/80 flex items-center justify-between text-xs"
                                >
                                  <div className="min-w-0 pr-2">
                                    <span className="font-semibold text-white block truncate">
                                      {it.name}
                                    </span>
                                    <span className="text-[10px] text-slate-400">
                                      Qty: {it.quantity} × ₹{it.price}
                                    </span>
                                  </div>
                                  <span className="font-bold text-amber-400 shrink-0">
                                    ₹{it.price * it.quantity}
                                  </span>
                                </div>
                              ))}
                            </div>
                          </div>
                        </td>
                      </tr>
                    )}
                  </React.Fragment>
                );
              })}

              {filteredOrders.length === 0 && !loading && (
                <tr>
                  <td colSpan={6} className="text-center py-12 text-slate-500">
                    <AlertCircle className="w-8 h-8 text-slate-600 mx-auto mb-2" />
                    <p className="text-sm font-semibold text-slate-400">No orders match your filter.</p>
                    <p className="text-xs text-slate-600 mt-1">
                      New customer orders placed through the website will appear here in real-time.
                    </p>
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


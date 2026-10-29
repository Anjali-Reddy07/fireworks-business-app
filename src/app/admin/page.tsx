'use client';

import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import {
  Package,
  Boxes,
  ShoppingBag,
  MessageSquare,
  AlertTriangle,
  ArrowRight,
  Plus,
  RefreshCw,
  Clock,
} from 'lucide-react';
import { Product, Inquiry, StockMovement } from '@/types';

export default function AdminOverviewPage() {
  const [products, setProducts] = useState<Product[]>([]);
  const [inquiries, setInquiries] = useState<Inquiry[]>([]);
  const [orders, setOrders] = useState<any[]>([]);
  const [movements, setMovements] = useState<StockMovement[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchData = async () => {
    setLoading(true);
    try {
      const [prodRes, inqRes, ordRes, movRes] = await Promise.all([
        fetch('/api/admin/products'),
        fetch('/api/admin/inquiries'),
        fetch('/api/admin/orders'),
        fetch('/api/admin/inventory'),
      ]);

      if (prodRes.ok) {
        const d = await prodRes.json();
        setProducts(d.products || []);
      }
      if (inqRes.ok) {
        const d = await inqRes.json();
        setInquiries(d.inquiries || []);
      }
      if (ordRes.ok) {
        const d = await ordRes.json();
        setOrders(d.orders || []);
      }
      if (movRes.ok) {
        const d = await movRes.json();
        setMovements(d.movements || []);
      }
    } catch (err) {
      console.error('Failed to fetch dashboard data', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const lowStockCount = products.filter((p) => p.stockQuantity <= 15).length;
  const pendingInquiriesCount = inquiries.filter((i) => i.status === 'Pending').length;

  return (
    <div className="space-y-6 sm:space-y-8">
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 sm:gap-4">
        <div>
          <h1 className="text-xl sm:text-2xl lg:text-3xl font-extrabold text-white">Dashboard Overview</h1>
          <p className="text-xs text-slate-400 mt-0.5 sm:mt-1">
            Real-time status of seasonal festive inventory, pre-orders & customer price quotations
          </p>
        </div>

        <div className="flex items-center gap-2 sm:gap-3">
          <button
            onClick={fetchData}
            disabled={loading}
            className="inline-flex items-center gap-1.5 px-3 py-2 rounded-xl bg-slate-900 border border-slate-800 text-xs text-slate-300 hover:text-white hover:bg-slate-800 transition-colors cursor-pointer"
          >
            <RefreshCw className={`w-3.5 h-3.5 ${loading ? 'animate-spin' : ''}`} />
            <span>Refresh</span>
          </button>

          <Link
            href="/admin/products"
            className="inline-flex items-center gap-1.5 px-3.5 sm:px-4 py-2 rounded-xl bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-400 hover:to-amber-500 text-slate-950 font-bold text-xs shadow-md shadow-amber-500/20"
          >
            <Plus className="w-3.5 h-3.5" />
            <span>Add Product</span>
          </Link>
        </div>
      </div>

      {/* Metrics Grid */}
      <div className="grid grid-cols-1 xs:grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-5">
        {/* Total Products */}
        <Link href="/admin/products" className="p-4 sm:p-5 rounded-2xl bg-slate-900 border border-slate-800 hover:border-slate-700 transition-colors flex items-center justify-between">
          <div>
            <span className="text-xs font-semibold text-slate-400 block mb-1">Active Items</span>
            <span className="text-2xl sm:text-3xl font-extrabold text-white">{products.length}</span>
            <span className="text-[10px] sm:text-[11px] text-emerald-400 block mt-1">● Green Crackers</span>
          </div>
          <div className="w-10 h-10 sm:w-12 sm:h-12 rounded-xl bg-amber-500/10 border border-amber-500/20 text-amber-400 flex items-center justify-center shrink-0">
            <Package className="w-5 h-5 sm:w-6 sm:h-6" />
          </div>
        </Link>

        {/* Customer Orders */}
        <Link href="/admin/orders" className="p-4 sm:p-5 rounded-2xl bg-slate-900 border border-slate-800 hover:border-amber-500/40 transition-colors flex items-center justify-between">
          <div>
            <span className="text-xs font-semibold text-slate-400 block mb-1">Customer Orders</span>
            <span className="text-2xl sm:text-3xl font-extrabold text-amber-400">{orders.length}</span>
            <span className="text-[10px] sm:text-[11px] text-amber-300 block mt-1">Firestore Synced</span>
          </div>
          <div className="w-10 h-10 sm:w-12 sm:h-12 rounded-xl bg-amber-500/10 border border-amber-500/20 text-amber-400 flex items-center justify-center shrink-0">
            <ShoppingBag className="w-5 h-5 sm:w-6 sm:h-6" />
          </div>
        </Link>

        {/* Low Stock Alerts */}
        <Link href="/admin/inventory" className="p-4 sm:p-5 rounded-2xl bg-slate-900 border border-slate-800 hover:border-slate-700 transition-colors flex items-center justify-between">
          <div>
            <span className="text-xs font-semibold text-slate-400 block mb-1">Low Stock Alerts</span>
            <span className="text-2xl sm:text-3xl font-extrabold text-white">{lowStockCount}</span>
            <span className="text-[10px] sm:text-[11px] text-rose-400 block mt-1">&le; 15 boxes left</span>
          </div>
          <div className="w-10 h-10 sm:w-12 sm:h-12 rounded-xl bg-rose-500/10 border border-rose-500/20 text-rose-400 flex items-center justify-center shrink-0">
            <AlertTriangle className="w-5 h-5 sm:w-6 sm:h-6" />
          </div>
        </Link>

        {/* Total Seasonal Inquiries */}
        <Link href="/admin/inquiries" className="p-4 sm:p-5 rounded-2xl bg-slate-900 border border-slate-800 hover:border-sky-500/40 transition-colors flex items-center justify-between">
          <div>
            <span className="text-xs font-semibold text-slate-400 block mb-1">Seasonal Inquiries</span>
            <span className="text-2xl sm:text-3xl font-extrabold text-white">{inquiries.length}</span>
            <span className="text-[10px] sm:text-[11px] text-sky-400 block mt-1">({pendingInquiriesCount} Pending Quotes)</span>
          </div>
          <div className="w-10 h-10 sm:w-12 sm:h-12 rounded-xl bg-sky-500/10 border border-sky-500/20 text-sky-400 flex items-center justify-center shrink-0">
            <MessageSquare className="w-5 h-5 sm:w-6 sm:h-6" />
          </div>
        </Link>
      </div>

      {/* Three Column Section: Recent Orders, Recent Inquiries & Recent Stock Movements */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 sm:gap-6">
        {/* Recent Orders Card */}
        <div className="rounded-2xl bg-slate-900 border border-slate-800 p-4 sm:p-5 flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between mb-4">
              <div>
                <h3 className="text-base font-bold text-white">Recent Customer Orders</h3>
                <p className="text-xs text-slate-400">Pre-bookings & counter purchases</p>
              </div>
              <Link
                href="/admin/orders"
                className="text-xs font-semibold text-amber-400 hover:text-amber-300 flex items-center gap-1"
              >
                <span>View All</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </Link>
            </div>

            <div className="space-y-2.5">
              {orders.slice(0, 4).map((ord) => (
                <div
                  key={ord.orderId || ord.id}
                  className="p-3 rounded-xl bg-slate-950 border border-slate-800/80 flex items-center justify-between gap-3 text-xs"
                >
                  <div className="min-w-0 flex-1">
                    <div className="flex items-center gap-2 mb-0.5">
                      <span className="font-mono text-amber-400 font-bold shrink-0">{ord.orderId || ord.id}</span>
                      <span className="font-semibold text-white truncate">{ord.customerName}</span>
                    </div>
                    <div className="text-slate-400 text-[11px] flex items-center gap-2">
                      <span>Pickup: {ord.festivalDate}</span>
                      <span>•</span>
                      <span className="text-amber-300 font-semibold">₹{ord.total}</span>
                    </div>
                  </div>

                  <span
                    className={`px-2 py-0.5 rounded-full font-semibold text-[10px] shrink-0 ${
                      ord.status === 'Pending'
                        ? 'bg-amber-950 text-amber-400 border border-amber-500/30'
                        : ord.status === 'Confirmed'
                        ? 'bg-blue-950 text-blue-400 border border-blue-500/30'
                        : ord.status === 'Delivered'
                        ? 'bg-emerald-950 text-emerald-400 border border-emerald-500/30'
                        : 'bg-slate-800 text-slate-400'
                    }`}
                  >
                    {ord.status}
                  </span>
                </div>
              ))}

              {orders.length === 0 && (
                <p className="text-xs text-slate-500 text-center py-6">No customer orders yet.</p>
              )}
            </div>
          </div>

          <div className="mt-4 pt-4 border-t border-slate-800 text-right">
            <Link href="/admin/orders" className="text-xs text-slate-400 hover:text-white">
              Manage counter orders &rarr;
            </Link>
          </div>
        </div>

        {/* Recent Inquiries Card */}
        <div className="rounded-2xl bg-slate-900 border border-slate-800 p-4 sm:p-5 flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between mb-4">
              <div>
                <h3 className="text-base font-bold text-white">Recent Festive Inquiries</h3>
                <p className="text-xs text-slate-400">Pre-bookings & package quotes</p>
              </div>
              <Link
                href="/admin/inquiries"
                className="text-xs font-semibold text-amber-400 hover:text-amber-300 flex items-center gap-1"
              >
                <span>View All</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </Link>
            </div>

            <div className="space-y-2.5">
              {inquiries.slice(0, 4).map((inq) => (
                <div
                  key={inq.id}
                  className="p-3 rounded-xl bg-slate-950 border border-slate-800/80 flex items-center justify-between gap-3 text-xs"
                >
                  <div className="min-w-0 flex-1">
                    <div className="flex items-center gap-2 mb-0.5">
                      <span className="font-mono text-amber-400 font-bold shrink-0">{inq.refId}</span>
                      <span className="font-semibold text-white truncate">{inq.customerName}</span>
                    </div>
                    <div className="text-slate-400 text-[11px] flex flex-wrap items-center gap-2">
                      <span>Date: {inq.festivalDate}</span>
                      <span className="truncate">{inq.requirementType}</span>
                    </div>
                  </div>

                  <span
                    className={`px-2 py-0.5 rounded-full font-semibold text-[10px] shrink-0 ${
                      inq.status === 'Pending'
                        ? 'bg-rose-950 text-rose-400 border border-rose-500/30'
                        : inq.status === 'Contacted'
                        ? 'bg-amber-950 text-amber-400 border border-amber-500/30'
                        : 'bg-emerald-950 text-emerald-400 border border-emerald-500/30'
                    }`}
                  >
                    {inq.status}
                  </span>
                </div>
              ))}

              {inquiries.length === 0 && (
                <p className="text-xs text-slate-500 text-center py-6">No inquiries recorded yet.</p>
              )}
            </div>
          </div>

          <div className="mt-4 pt-4 border-t border-slate-800 text-right">
            <Link href="/admin/inquiries" className="text-xs text-slate-400 hover:text-white">
              Manage quotation responses &rarr;
            </Link>
          </div>
        </div>

        {/* Recent Stock Movements Card */}
        <div className="rounded-2xl bg-slate-900 border border-slate-800 p-4 sm:p-5 flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between mb-4">
              <div>
                <h3 className="text-base font-bold text-white">Recent Stock Movements</h3>
                <p className="text-xs text-slate-400">Audit trail of arrivals & counter sales</p>
              </div>
              <Link
                href="/admin/inventory"
                className="text-xs font-semibold text-amber-400 hover:text-amber-300 flex items-center gap-1"
              >
                <span>Manage Stock</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </Link>
            </div>

            <div className="space-y-2.5">
              {movements.slice(0, 4).map((mov) => (
                <div
                  key={mov.id}
                  className="p-3 rounded-xl bg-slate-950 border border-slate-800/80 flex items-center justify-between gap-3 text-xs"
                >
                  <div className="min-w-0 flex-1">
                    <span className="font-semibold text-white block mb-0.5 truncate">
                      {mov.productName}
                    </span>
                    <span className="text-slate-400 text-[11px] block truncate">
                      {mov.reason || mov.type} • Bal: {mov.newStockCount}
                    </span>
                  </div>

                  <span
                    className={`font-mono font-bold text-xs px-2 py-0.5 rounded-lg shrink-0 ${
                      mov.quantityChange > 0
                        ? 'bg-emerald-950/80 text-emerald-400 border border-emerald-500/30'
                        : 'bg-rose-950/80 text-rose-400 border border-rose-500/30'
                    }`}
                  >
                    {mov.quantityChange > 0 ? `+${mov.quantityChange}` : mov.quantityChange}
                  </span>
                </div>
              ))}

              {movements.length === 0 && (
                <p className="text-xs text-slate-500 text-center py-6">No stock movements logged yet.</p>
              )}
            </div>
          </div>

          <div className="mt-4 pt-4 border-t border-slate-800 text-right">
            <Link href="/admin/inventory" className="text-xs text-slate-400 hover:text-white">
              Perform quick stock adjustments &rarr;
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}

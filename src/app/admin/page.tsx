'use client';

import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import {
  Package,
  Boxes,
  MessageSquare,
  AlertTriangle,
  ArrowRight,
  Plus,
  RefreshCw,
  Phone,
  CheckCircle,
  Clock,
} from 'lucide-react';
import { Product, Inquiry, StockMovement } from '@/types';

export default function AdminOverviewPage() {
  const [products, setProducts] = useState<Product[]>([]);
  const [inquiries, setInquiries] = useState<Inquiry[]>([]);
  const [movements, setMovements] = useState<StockMovement[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchData = async () => {
    setLoading(true);
    try {
      const [prodRes, inqRes, movRes] = await Promise.all([
        fetch('/api/admin/products'),
        fetch('/api/admin/inquiries'),
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
    <div className="space-y-8">
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-white">Dashboard Overview</h1>
          <p className="text-xs text-slate-400 mt-1">
            Real-time status of fireworks inventory, store visit reservations, and retail activity
          </p>
        </div>

        <div className="flex items-center gap-3">
          <button
            onClick={fetchData}
            disabled={loading}
            className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-slate-900 border border-slate-800 text-xs text-slate-300 hover:text-white hover:bg-slate-800 transition-colors cursor-pointer"
          >
            <RefreshCw className={`w-3.5 h-3.5 ${loading ? 'animate-spin' : ''}`} />
            <span>Refresh</span>
          </button>

          <Link
            href="/admin/products"
            className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-400 hover:to-amber-500 text-slate-950 font-bold text-xs shadow-md shadow-amber-500/20"
          >
            <Plus className="w-3.5 h-3.5" />
            <span>Add Product</span>
          </Link>
        </div>
      </div>

      {/* Metrics Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
        {/* Total Products */}
        <div className="p-5 rounded-2xl bg-slate-900 border border-slate-800 flex items-center justify-between">
          <div>
            <span className="text-xs font-semibold text-slate-400 block mb-1">Active Catalogue Items</span>
            <span className="text-3xl font-extrabold text-white">{products.length}</span>
            <span className="text-[11px] text-emerald-400 block mt-1">● Certified Green Crackers</span>
          </div>
          <div className="w-12 h-12 rounded-xl bg-amber-500/10 border border-amber-500/20 text-amber-400 flex items-center justify-center">
            <Package className="w-6 h-6" />
          </div>
        </div>

        {/* Low Stock Alerts */}
        <div className="p-5 rounded-2xl bg-slate-900 border border-slate-800 flex items-center justify-between">
          <div>
            <span className="text-xs font-semibold text-slate-400 block mb-1">Low Stock Alerts</span>
            <span className="text-3xl font-extrabold text-amber-400">{lowStockCount}</span>
            <span className="text-[11px] text-amber-300/80 block mt-1">&le; 15 boxes remaining</span>
          </div>
          <div className="w-12 h-12 rounded-xl bg-amber-500/10 border border-amber-500/20 text-amber-400 flex items-center justify-center">
            <AlertTriangle className="w-6 h-6" />
          </div>
        </div>

        {/* Total Inquiries */}
        <div className="p-5 rounded-2xl bg-slate-900 border border-slate-800 flex items-center justify-between">
          <div>
            <span className="text-xs font-semibold text-slate-400 block mb-1">Store Visit Inquiries</span>
            <span className="text-3xl font-extrabold text-white">{inquiries.length}</span>
            <span className="text-[11px] text-sky-400 block mt-1">Walk-in Reservations</span>
          </div>
          <div className="w-12 h-12 rounded-xl bg-sky-500/10 border border-sky-500/20 text-sky-400 flex items-center justify-center">
            <MessageSquare className="w-6 h-6" />
          </div>
        </div>

        {/* Pending Inquiries */}
        <div className="p-5 rounded-2xl bg-slate-900 border border-slate-800 flex items-center justify-between">
          <div>
            <span className="text-xs font-semibold text-slate-400 block mb-1">Pending Follow-ups</span>
            <span className="text-3xl font-extrabold text-rose-400">{pendingInquiriesCount}</span>
            <span className="text-[11px] text-slate-400 block mt-1">Awaiting confirmation</span>
          </div>
          <div className="w-12 h-12 rounded-xl bg-rose-500/10 border border-rose-500/20 text-rose-400 flex items-center justify-center">
            <Clock className="w-6 h-6" />
          </div>
        </div>
      </div>

      {/* Two Column Section: Recent Inquiries & Recent Stock Movements */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Recent Inquiries Card */}
        <div className="rounded-2xl bg-slate-900 border border-slate-800 p-6 flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between mb-4">
              <div>
                <h3 className="text-lg font-bold text-white">Recent Customer Inquiries</h3>
                <p className="text-xs text-slate-400">Permitted store visit bookings & quotes</p>
              </div>
              <Link
                href="/admin/inquiries"
                className="text-xs font-semibold text-amber-400 hover:text-amber-300 flex items-center gap-1"
              >
                <span>View All</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </Link>
            </div>

            <div className="space-y-3">
              {inquiries.slice(0, 4).map((inq) => (
                <div
                  key={inq.id}
                  className="p-3.5 rounded-xl bg-slate-950 border border-slate-800/80 flex items-center justify-between gap-3 text-xs"
                >
                  <div>
                    <div className="flex items-center gap-2 mb-1">
                      <span className="font-mono text-amber-400 font-bold">{inq.refId}</span>
                      <span className="font-semibold text-white">{inq.customerName}</span>
                    </div>
                    <div className="text-slate-400 flex items-center gap-3">
                      <span>Visit: {inq.visitDate}</span>
                      <span>{inq.requirementType}</span>
                    </div>
                  </div>

                  <span
                    className={`px-2.5 py-1 rounded-full font-semibold text-[11px] shrink-0 ${
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
            <Link
              href="/admin/inquiries"
              className="text-xs text-slate-400 hover:text-white"
            >
              Manage inquiry follow-ups &rarr;
            </Link>
          </div>
        </div>

        {/* Recent Stock Movements Card */}
        <div className="rounded-2xl bg-slate-900 border border-slate-800 p-6 flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between mb-4">
              <div>
                <h3 className="text-lg font-bold text-white">Recent Inventory Movements</h3>
                <p className="text-xs text-slate-400">Audit trail of factory arrivals & retail sales</p>
              </div>
              <Link
                href="/admin/inventory"
                className="text-xs font-semibold text-amber-400 hover:text-amber-300 flex items-center gap-1"
              >
                <span>Manage Stock</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </Link>
            </div>

            <div className="space-y-3">
              {movements.slice(0, 4).map((mov) => (
                <div
                  key={mov.id}
                  className="p-3.5 rounded-xl bg-slate-950 border border-slate-800/80 flex items-center justify-between gap-3 text-xs"
                >
                  <div>
                    <span className="font-semibold text-white block mb-0.5 line-clamp-1">
                      {mov.productName}
                    </span>
                    <span className="text-slate-400 text-[11px] block">
                      {mov.reason || mov.type} • Balance: {mov.newStockCount}
                    </span>
                  </div>

                  <span
                    className={`font-mono font-bold text-sm px-2.5 py-1 rounded-lg shrink-0 ${
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
            <Link
              href="/admin/inventory"
              className="text-xs text-slate-400 hover:text-white"
            >
              Perform quick stock adjustments &rarr;
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}

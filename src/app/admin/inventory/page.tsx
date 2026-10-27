'use client';

import React, { useEffect, useState } from 'react';
import { Boxes, Plus, Minus, RefreshCw, AlertTriangle, ArrowUpDown, History } from 'lucide-react';
import { Product, StockMovement } from '@/types';

export default function AdminInventoryPage() {
  const [products, setProducts] = useState<Product[]>([]);
  const [movements, setMovements] = useState<StockMovement[]>([]);
  const [loading, setLoading] = useState(true);

  // Quick adjustment form
  const [selectedProductId, setSelectedProductId] = useState('');
  const [qtyChange, setQtyChange] = useState<number>(10);
  const [movementType, setMovementType] = useState<StockMovement['type']>('restock');
  const [reason, setReason] = useState('New batch delivery from Sivakasi factory');
  const [updating, setUpdating] = useState(false);
  const [feedback, setFeedback] = useState<string | null>(null);

  const fetchData = async () => {
    setLoading(true);
    try {
      const [prodRes, movRes] = await Promise.all([
        fetch('/api/admin/products'),
        fetch('/api/admin/inventory'),
      ]);

      if (prodRes.ok) {
        const d = await prodRes.json();
        setProducts(d.products || []);
        if (d.products?.length && !selectedProductId) {
          setSelectedProductId(d.products[0].id);
        }
      }

      if (movRes.ok) {
        const d = await movRes.json();
        setMovements(d.movements || []);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const handleAdjustStock = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedProductId) return;

    setUpdating(true);
    setFeedback(null);

    const actualChange = movementType === 'restock' || movementType === 'adjustment' && qtyChange > 0 
      ? Math.abs(qtyChange) 
      : -Math.abs(qtyChange);

    try {
      const res = await fetch('/api/admin/inventory', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          productId: selectedProductId,
          quantityChange: actualChange,
          type: movementType,
          reason,
        }),
      });

      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.error || 'Failed to adjust stock');
      }

      setFeedback(`Successfully recorded ${actualChange > 0 ? '+' : ''}${actualChange} units for ${data.product.name}.`);
      fetchData();
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : 'Error';
      setFeedback(`Error: ${msg}`);
    } finally {
      setUpdating(false);
    }
  };

  const handleQuickInlineAdjust = async (productId: string, change: number, reasonText: string) => {
    try {
      await fetch('/api/admin/inventory', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          productId,
          quantityChange: change,
          type: change > 0 ? 'restock' : 'sale_in_store',
          reason: reasonText,
        }),
      });
      fetchData();
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-white">Inventory & Stock Tracking</h1>
          <p className="text-xs text-slate-400 mt-1">
            Audit cracker stock counts, record retail counter sales, and view verified movement logs
          </p>
        </div>

        <button
          onClick={fetchData}
          disabled={loading}
          className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-slate-900 border border-slate-800 text-xs text-slate-300 hover:text-white transition-colors cursor-pointer"
        >
          <RefreshCw className={`w-3.5 h-3.5 ${loading ? 'animate-spin' : ''}`} />
          <span>Refresh Stock</span>
        </button>
      </div>

      {/* Stock Adjustment Form Box */}
      <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 shadow-xl">
        <h2 className="text-base font-bold text-white mb-4 flex items-center gap-2">
          <ArrowUpDown className="w-4 h-4 text-amber-400" />
          <span>Record Inventory Stock Movement</span>
        </h2>

        {feedback && (
          <div className="p-3 rounded-xl bg-amber-950/40 border border-amber-500/30 text-amber-300 text-xs mb-4">
            {feedback}
          </div>
        )}

        <form onSubmit={handleAdjustStock} className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <div>
            <label className="text-xs font-semibold text-slate-300 mb-1 block">Select Firework Item *</label>
            <select
              value={selectedProductId}
              onChange={(e) => setSelectedProductId(e.target.value)}
              className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-amber-500"
            >
              {products.map((p) => (
                <option key={p.id} value={p.id}>
                  {p.name} (Cur: {p.stockQuantity})
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="text-xs font-semibold text-slate-300 mb-1 block">Movement Type</label>
            <select
              value={movementType}
              onChange={(e) => {
                const val = e.target.value as StockMovement['type'];
                setMovementType(val);
                if (val === 'restock') setReason('New batch delivery from Sivakasi factory');
                if (val === 'sale_in_store') setReason('Walk-in retail customer billing');
                if (val === 'damaged') setReason('Damaged packaging / soaked in rain');
                if (val === 'adjustment') setReason('Physical inventory audit count correction');
              }}
              className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-amber-500"
            >
              <option value="restock">Restock / Factory Batch Arrival (+)</option>
              <option value="sale_in_store">Walk-in Counter Sale (-)</option>
              <option value="damaged">Damaged / Safe Disposal (-)</option>
              <option value="adjustment">Physical Audit Adjustment</option>
            </select>
          </div>

          <div>
            <label className="text-xs font-semibold text-slate-300 mb-1 block">Quantity (Boxes)</label>
            <input
              type="number"
              min={1}
              value={qtyChange}
              onChange={(e) => setQtyChange(Number(e.target.value))}
              className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-amber-500"
            />
          </div>

          <div className="flex items-end">
            <button
              type="submit"
              disabled={updating}
              className="w-full py-2.5 rounded-xl bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-400 hover:to-amber-500 text-slate-950 font-bold text-xs shadow-md shadow-amber-500/20 cursor-pointer disabled:opacity-50"
            >
              {updating ? 'Updating...' : 'Post Stock Entry'}
            </button>
          </div>
        </form>
      </div>

      {/* Two Column Layout: Current Stock Table & Movement History */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Current Stock Levels with Quick +/- */}
        <div className="lg:col-span-2 bg-slate-900 border border-slate-800 rounded-2xl overflow-hidden shadow-xl">
          <div className="p-4 border-b border-slate-800 flex items-center justify-between">
            <h3 className="font-bold text-white text-sm">Current Counter Inventory</h3>
            <span className="text-xs text-slate-400">{products.length} Products Tracked</span>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-slate-950 border-b border-slate-800 text-slate-400 uppercase font-semibold">
                <tr>
                  <th className="px-4 py-3">Product</th>
                  <th className="px-4 py-3">Category</th>
                  <th className="px-4 py-3">Balance</th>
                  <th className="px-4 py-3 text-right">Quick Stock Counter</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800">
                {products.map((p) => (
                  <tr key={p.id} className="hover:bg-slate-800/40 transition-colors">
                    <td className="px-4 py-3">
                      <span className="font-bold text-white block line-clamp-1">{p.name}</span>
                      <span className="text-slate-400 text-[11px]">₹{p.retailPrice} / box</span>
                    </td>
                    <td className="px-4 py-3 text-slate-300">{p.categoryName}</td>
                    <td className="px-4 py-3">
                      <span
                        className={`font-mono font-bold px-2 py-0.5 rounded-md ${
                          p.stockQuantity <= 15
                            ? 'bg-rose-950 text-rose-400 border border-rose-500/30'
                            : 'bg-emerald-950 text-emerald-400 border border-emerald-500/30'
                        }`}
                      >
                        {p.stockQuantity} Boxes
                      </span>
                    </td>
                    <td className="px-4 py-3 text-right">
                      <div className="flex items-center justify-end gap-1.5">
                        <button
                          onClick={() => handleQuickInlineAdjust(p.id, -1, 'Quick retail counter sale')}
                          disabled={p.stockQuantity <= 0}
                          className="px-2 py-1 rounded bg-slate-800 hover:bg-slate-700 text-rose-400 font-bold border border-slate-700 cursor-pointer disabled:opacity-30"
                          title="Record 1 Box Sold"
                        >
                          -1
                        </button>
                        <button
                          onClick={() => handleQuickInlineAdjust(p.id, -5, 'Bulk customer walk-in sale')}
                          disabled={p.stockQuantity < 5}
                          className="px-2 py-1 rounded bg-slate-800 hover:bg-slate-700 text-rose-400 font-bold border border-slate-700 cursor-pointer disabled:opacity-30"
                          title="Record 5 Boxes Sold"
                        >
                          -5
                        </button>
                        <button
                          onClick={() => handleQuickInlineAdjust(p.id, 10, 'Counter restocked from warehouse')}
                          className="px-2 py-1 rounded bg-slate-800 hover:bg-slate-700 text-emerald-400 font-bold border border-slate-700 cursor-pointer"
                          title="Restock 10 Boxes"
                        >
                          +10
                        </button>
                        <button
                          onClick={() => handleQuickInlineAdjust(p.id, 50, 'Factory carton unpacked')}
                          className="px-2 py-1 rounded bg-slate-800 hover:bg-slate-700 text-emerald-400 font-bold border border-slate-700 cursor-pointer"
                          title="Restock 50 Boxes"
                        >
                          +50
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Stock Movement Audit Log */}
        <div className="bg-slate-900 border border-slate-800 rounded-2xl p-4 shadow-xl flex flex-col justify-between">
          <div>
            <div className="flex items-center gap-2 mb-4 pb-2 border-b border-slate-800">
              <History className="w-4 h-4 text-amber-400" />
              <h3 className="font-bold text-white text-sm">Movement Audit Log</h3>
            </div>

            <div className="space-y-3 max-h-[600px] overflow-y-auto pr-1">
              {movements.map((m) => (
                <div
                  key={m.id}
                  className="p-3 rounded-xl bg-slate-950 border border-slate-800 text-xs space-y-1"
                >
                  <div className="flex items-center justify-between">
                    <span className="font-bold text-white line-clamp-1">{m.productName}</span>
                    <span
                      className={`font-mono font-bold px-1.5 py-0.5 rounded text-[11px] ${
                        m.quantityChange > 0 ? 'text-emerald-400 bg-emerald-950' : 'text-rose-400 bg-rose-950'
                      }`}
                    >
                      {m.quantityChange > 0 ? `+${m.quantityChange}` : m.quantityChange}
                    </span>
                  </div>
                  <p className="text-slate-400 text-[11px]">{m.reason || m.type}</p>
                  <div className="flex items-center justify-between text-[10px] text-slate-500 pt-1">
                    <span>Balance: {m.newStockCount}</span>
                    <span>{new Date(m.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</span>
                  </div>
                </div>
              ))}

              {movements.length === 0 && (
                <p className="text-xs text-slate-500 text-center py-8">No movements logged yet.</p>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

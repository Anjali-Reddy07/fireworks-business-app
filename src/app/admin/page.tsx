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
  Users,
  UserCheck,
  ShieldCheck,
  Search,
  CheckCircle2,
  FolderOpen,
  Image as ImageIcon,
  X,
  Loader2,
  Upload,
  Check,
  Sparkles,
  Phone,
  Mail
} from 'lucide-react';
import { Product, Inquiry, StockMovement, Category, SoundLevel } from '@/types';
import { INITIAL_CATEGORIES } from '@/lib/data/sample-products';
import { CustomerUserDTO } from '@/app/api/admin/users/route';

export default function AdminOverviewPage() {
  const [products, setProducts] = useState<Product[]>([]);
  const [inquiries, setInquiries] = useState<Inquiry[]>([]);
  const [orders, setOrders] = useState<any[]>([]);
  const [users, setUsers] = useState<CustomerUserDTO[]>([]);
  const [movements, setMovements] = useState<StockMovement[]>([]);
  const [loading, setLoading] = useState(true);

  // Quick Add Product Modal state
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [categories] = useState<Category[]>(INITIAL_CATEGORIES);
  const [newProdName, setNewProdName] = useState('');
  const [newProdCategory, setNewProdCategory] = useState(categories[0]?.id || 'cat-sparklers');
  const [newProdDesc, setNewProdDesc] = useState('');
  const [newProdPrice, setNewProdPrice] = useState<number>(250);
  const [newProdStock, setNewProdStock] = useState<number>(50);
  const [newProdSound, setNewProdSound] = useState<SoundLevel>('Low / Muffled');
  const [newProdPieces, setNewProdPieces] = useState<number>(10);
  const [newProdImageUrl, setNewProdImageUrl] = useState('');
  const [savingProduct, setSavingProduct] = useState(false);
  const [productError, setProductError] = useState<string | null>(null);
  const [productSuccess, setProductSuccess] = useState<string | null>(null);

  // Folder Gallery for Image Picker
  const [folderImages, setFolderImages] = useState<Array<{ filename: string; url: string; size: number }>>([]);
  const [showFolderGallery, setShowFolderGallery] = useState(false);
  const [loadingFolderImages, setLoadingFolderImages] = useState(false);

  // Search in dashboard product table
  const [productSearch, setProductSearch] = useState('');

  const fetchData = async () => {
    setLoading(true);
    try {
      const [prodRes, inqRes, ordRes, movRes, userRes] = await Promise.all([
        fetch('/api/admin/products'),
        fetch('/api/admin/inquiries'),
        fetch('/api/admin/orders'),
        fetch('/api/admin/inventory'),
        fetch('/api/admin/users'),
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
      if (userRes.ok) {
        const d = await userRes.json();
        setUsers(d.users || []);
      }
    } catch (err) {
      console.error('Failed to fetch dashboard data', err);
    } finally {
      setLoading(false);
    }
  };

  const fetchFolderImages = async () => {
    setLoadingFolderImages(true);
    try {
      const res = await fetch('/api/admin/products-images');
      if (res.ok) {
        const data = await res.json();
        setFolderImages(data.images || []);
      }
    } catch (err) {
      console.error('Failed to load folder images:', err);
    } finally {
      setLoadingFolderImages(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const lowStockCount = products.filter((p) => p.stockQuantity <= 15).length;
  const pendingInquiriesCount = inquiries.filter((i) => i.status === 'Pending').length;

  // Add Product Handler
  const handleCreateProduct = async (e: React.FormEvent) => {
    e.preventDefault();
    setProductError(null);
    setProductSuccess(null);
    setSavingProduct(true);

    try {
      const payload = {
        name: newProdName,
        categoryId: newProdCategory,
        description: newProdDesc || 'Premium festive green cracker with certified low emission.',
        retailPrice: Number(newProdPrice),
        stockQuantity: Number(newProdStock),
        soundLevel: newProdSound,
        durationSeconds: 30,
        piecesPerPack: Number(newProdPieces),
        isGreenCracker: true,
        greenCrackerCode: 'CSIR-NEERI-2026',
        safetyDistanceMeters: 5,
        imageUrl: newProdImageUrl || '/products_img/Zamin CHAKKAR.jpeg',
        active: true,
        featured: false,
      };

      const res = await fetch('/api/admin/products', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.error || 'Failed to add product');

      setProductSuccess('Product successfully added and synced with Firebase Firestore!');
      // Reset form
      setNewProdName('');
      setNewProdDesc('');
      setNewProdPrice(250);
      setNewProdStock(50);
      setNewProdImageUrl('');

      // Refresh list
      await fetchData();
      setTimeout(() => {
        setIsAddModalOpen(false);
        setProductSuccess(null);
      }, 1200);
    } catch (err: unknown) {
      setProductError(err instanceof Error ? err.message : 'Error creating product');
    } finally {
      setSavingProduct(false);
    }
  };

  const filteredProducts = products.filter((p) =>
    p.name.toLowerCase().includes(productSearch.toLowerCase()) ||
    (p.categoryName || '').toLowerCase().includes(productSearch.toLowerCase())
  );

  return (
    <div className="space-y-6 sm:space-y-8">
      {/* Top Header & Actions */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <h1 className="text-xl sm:text-2xl lg:text-3xl font-black text-slate-900">Administrator Dashboard</h1>
            <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-bold bg-emerald-50 border border-emerald-200 text-emerald-700">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
              Firebase Live
            </span>
          </div>
          <p className="text-xs text-slate-600">
            Real-time management for products, customer accounts, festive pre-orders & stock inventory
          </p>
        </div>

        <div className="flex items-center gap-2.5">
          <button
            onClick={fetchData}
            disabled={loading}
            className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-white border border-slate-200 text-xs font-semibold text-slate-700 hover:text-slate-900 hover:bg-slate-50 transition-colors cursor-pointer shadow-xs"
          >
            <RefreshCw className={`w-3.5 h-3.5 ${loading ? 'animate-spin' : ''}`} />
            <span>Refresh Data</span>
          </button>

          <button
            onClick={() => setIsAddModalOpen(true)}
            className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-gradient-to-r from-blue-600 via-indigo-600 to-blue-700 hover:from-blue-700 hover:to-indigo-700 text-white font-bold text-xs shadow-md shadow-blue-600/25 cursor-pointer transition-all"
          >
            <Plus className="w-4 h-4 text-white" />
            <span>Add New Product</span>
          </button>
        </div>
      </div>

      {/* 5-Column High-Impact Metrics Grid */}
      <div className="grid grid-cols-1 xs:grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-3 sm:gap-4">
        {/* Metric 1: Total Registered Customers */}
        <Link 
          href="/admin/users" 
          className="p-4 sm:p-5 rounded-2xl bg-white border border-slate-200 hover:border-blue-400 transition-all flex items-center justify-between group shadow-sm hover:shadow-md"
        >
          <div>
            <span className="text-xs font-bold text-slate-500 block mb-1">Customers Joined</span>
            <span className="text-2xl sm:text-3xl font-black text-blue-600 group-hover:scale-105 transition-transform block">
              {users.length}
            </span>
            <span className="text-[11px] text-blue-700 font-medium block mt-1">Users in Firebase</span>
          </div>
          <div className="w-11 h-11 rounded-xl bg-blue-50 border border-blue-200 text-blue-600 flex items-center justify-center shrink-0">
            <Users className="w-5 h-5" />
          </div>
        </Link>

        {/* Metric 2: Added Products */}
        <Link 
          href="/admin/products" 
          className="p-4 sm:p-5 rounded-2xl bg-white border border-slate-200 hover:border-blue-400 transition-all flex items-center justify-between group shadow-sm hover:shadow-md"
        >
          <div>
            <span className="text-xs font-bold text-slate-500 block mb-1">Total Products</span>
            <span className="text-2xl sm:text-3xl font-black text-slate-900 group-hover:scale-105 transition-transform block">
              {products.length}
            </span>
            <span className="text-[11px] text-emerald-600 font-medium block mt-1">● Green Crackers</span>
          </div>
          <div className="w-11 h-11 rounded-xl bg-blue-50 border border-blue-200 text-blue-600 flex items-center justify-center shrink-0">
            <Package className="w-5 h-5" />
          </div>
        </Link>

        {/* Metric 3: Customer Orders */}
        <Link 
          href="/admin/orders" 
          className="p-4 sm:p-5 rounded-2xl bg-white border border-slate-200 hover:border-blue-400 transition-all flex items-center justify-between group shadow-sm hover:shadow-md"
        >
          <div>
            <span className="text-xs font-bold text-slate-500 block mb-1">Orders Placed</span>
            <span className="text-2xl sm:text-3xl font-black text-blue-600 group-hover:scale-105 transition-transform block">
              {orders.length}
            </span>
            <span className="text-[11px] text-slate-500 font-medium block mt-1">Pre-Book & Counter</span>
          </div>
          <div className="w-11 h-11 rounded-xl bg-blue-50 border border-blue-200 text-blue-600 flex items-center justify-center shrink-0">
            <ShoppingBag className="w-5 h-5" />
          </div>
        </Link>

        {/* Metric 4: Low Stock Warnings */}
        <Link 
          href="/admin/inventory" 
          className="p-4 sm:p-5 rounded-2xl bg-white border border-slate-200 hover:border-rose-400 transition-all flex items-center justify-between group shadow-sm hover:shadow-md"
        >
          <div>
            <span className="text-xs font-bold text-slate-500 block mb-1">Low Stock Alerts</span>
            <span className="text-2xl sm:text-3xl font-black text-rose-600 group-hover:scale-105 transition-transform block">
              {lowStockCount}
            </span>
            <span className="text-[11px] text-rose-600/80 font-medium block mt-1">&le; 15 boxes left</span>
          </div>
          <div className="w-11 h-11 rounded-xl bg-rose-50 border border-rose-200 text-rose-600 flex items-center justify-center shrink-0">
            <AlertTriangle className="w-5 h-5" />
          </div>
        </Link>

        {/* Metric 5: Festive Inquiries */}
        <Link 
          href="/admin/inquiries" 
          className="p-4 sm:p-5 rounded-2xl bg-white border border-slate-200 hover:border-sky-400 transition-all flex items-center justify-between group shadow-sm hover:shadow-md"
        >
          <div>
            <span className="text-xs font-bold text-slate-500 block mb-1">Inquiries</span>
            <span className="text-2xl sm:text-3xl font-black text-sky-600 group-hover:scale-105 transition-transform block">
              {inquiries.length}
            </span>
            <span className="text-[11px] text-sky-700 font-medium block mt-1">{pendingInquiriesCount} Pending Quotes</span>
          </div>
          <div className="w-11 h-11 rounded-xl bg-sky-50 border border-sky-200 text-sky-600 flex items-center justify-center shrink-0">
            <MessageSquare className="w-5 h-5" />
          </div>
        </Link>
      </div>

      {/* Main Content Area: Products Added in Store (with Search & Quick Actions) */}
      <div className="rounded-2xl bg-white border border-slate-200 p-4 sm:p-6 shadow-sm">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-4 border-b border-slate-100">
          <div>
            <div className="flex items-center gap-2">
              <h2 className="text-base sm:text-lg font-bold text-slate-900">Products Added in Store</h2>
              <span className="px-2 py-0.5 rounded-full text-xs font-bold bg-blue-50 text-blue-700 border border-blue-200">
                {products.length} Items Live
              </span>
            </div>
            <p className="text-xs text-slate-500 mt-0.5">
              Live assortment of green crackers, retail prices, and inventory stock
            </p>
          </div>

          <div className="flex items-center gap-2.5">
            <div className="relative min-w-[200px]">
              <Search className="w-3.5 h-3.5 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                value={productSearch}
                onChange={(e) => setProductSearch(e.target.value)}
                placeholder="Search products..."
                className="w-full bg-slate-50 border border-slate-200 rounded-xl pl-8 pr-3 py-1.5 text-xs text-slate-900 placeholder-slate-400 focus:outline-none focus:bg-white focus:border-blue-600"
              />
            </div>

            <button
              onClick={() => setIsAddModalOpen(true)}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-blue-600 text-white font-bold text-xs hover:bg-blue-700 transition-colors cursor-pointer shrink-0 shadow-xs"
            >
              <Plus className="w-3.5 h-3.5" />
              <span>Add Item</span>
            </button>

            <Link
              href="/admin/products"
              className="inline-flex items-center gap-1 px-3 py-1.5 rounded-xl bg-slate-100 hover:bg-slate-200 text-xs text-slate-700 transition-colors shrink-0 font-medium"
            >
              <span>Manage All</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          </div>
        </div>

        {/* Products Table */}
        <div className="overflow-x-auto mt-4">
          <table className="w-full text-left text-xs">
            <thead className="bg-slate-50 text-slate-600 font-bold border-b border-slate-200 uppercase tracking-wider text-[10px]">
              <tr>
                <th className="py-3 px-3">Item Name & Specs</th>
                <th className="py-3 px-3">Category</th>
                <th className="py-3 px-3">Retail Rate</th>
                <th className="py-3 px-3">Stock Units</th>
                <th className="py-3 px-3">Eco Quality</th>
                <th className="py-3 px-3 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {filteredProducts.slice(0, 6).map((prod) => (
                <tr key={prod.id} className="hover:bg-slate-50 transition-colors">
                  {/* Name & Image */}
                  <td className="py-3 px-3">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-xl overflow-hidden bg-slate-100 border border-slate-200 shrink-0">
                        {prod.imageUrl ? (
                          // eslint-disable-next-line @next/next/no-img-element
                          <img
                            src={prod.imageUrl}
                            alt={prod.name}
                            className="w-full h-full object-cover"
                          />
                        ) : (
                          <div className="w-full h-full flex items-center justify-center text-slate-400">
                            <ImageIcon className="w-4 h-4" />
                          </div>
                        )}
                      </div>
                      <div className="min-w-0">
                        <span className="font-bold text-slate-900 block text-sm truncate max-w-[220px]">
                          {prod.name}
                        </span>
                        <span className="text-[11px] text-slate-500 block truncate">
                          {prod.piecesPerPack} Pcs • {prod.soundLevel}
                        </span>
                      </div>
                    </div>
                  </td>

                  {/* Category */}
                  <td className="py-3 px-3">
                    <span className="inline-block px-2.5 py-1 rounded-lg bg-slate-100 text-slate-700 font-medium text-[11px] border border-slate-200">
                      {prod.categoryName || 'General Assortment'}
                    </span>
                  </td>

                  {/* Price */}
                  <td className="py-3 px-3">
                    <span className="text-blue-600 font-extrabold text-sm font-mono">
                      ₹{prod.retailPrice}
                    </span>
                  </td>

                  {/* Stock */}
                  <td className="py-3 px-3">
                    <span
                      className={`inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-bold ${
                        prod.stockQuantity <= 15
                          ? 'bg-rose-50 text-rose-700 border border-rose-200'
                          : 'bg-emerald-50 text-emerald-700 border border-emerald-200'
                      }`}
                    >
                      {prod.stockQuantity} Boxes
                    </span>
                  </td>

                  {/* Eco Green Quality */}
                  <td className="py-3 px-3">
                    <span className="inline-flex items-center gap-1 text-[11px] text-emerald-700 font-semibold">
                      <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" />
                      Green Cracker
                    </span>
                  </td>

                  {/* Actions */}
                  <td className="py-3 px-3 text-right">
                    <Link
                      href="/admin/products"
                      className="px-2.5 py-1 rounded-lg bg-slate-100 hover:bg-blue-50 hover:text-blue-700 text-slate-700 text-xs font-semibold transition-colors"
                    >
                      Edit
                    </Link>
                  </td>
                </tr>
              ))}

              {filteredProducts.length === 0 && (
                <tr>
                  <td colSpan={6} className="py-8 text-center text-slate-500">
                    No products found. Click &quot;Add New Product&quot; to register your first item!
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>

        {products.length > 6 && (
          <div className="mt-4 pt-3 border-t border-slate-100 text-center">
            <Link
              href="/admin/products"
              className="text-xs font-semibold text-blue-600 hover:text-blue-700 inline-flex items-center gap-1"
            >
              <span>View all {products.length} products & stock records &rarr;</span>
            </Link>
          </div>
        )}
      </div>

      {/* Two Column Bottom Layout: Registered Users / Customers & Recent Orders */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        
        {/* Card 1: Registered Customers Showcase */}
        <div className="rounded-2xl bg-white border border-slate-200 p-4 sm:p-5 flex flex-col justify-between shadow-sm">
          <div>
            <div className="flex items-center justify-between mb-4 pb-3 border-b border-slate-100">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-lg bg-blue-50 text-blue-600 flex items-center justify-center">
                  <Users className="w-4 h-4" />
                </div>
                <div>
                  <h3 className="text-base font-bold text-slate-900">Registered Customers ({users.length})</h3>
                  <p className="text-xs text-slate-500">Users actively registered in Firebase</p>
                </div>
              </div>

              <Link
                href="/admin/users"
                className="text-xs font-semibold text-blue-600 hover:text-blue-700 flex items-center gap-1"
              >
                <span>View Full List</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </Link>
            </div>

            <div className="space-y-2.5">
              {users.slice(0, 4).map((u) => (
                <div
                  key={u.id}
                  className="p-3 rounded-xl bg-slate-50 border border-slate-200/80 flex items-center justify-between gap-3 text-xs"
                >
                  <div className="flex items-center gap-3 min-w-0">
                    <div className="w-8 h-8 rounded-xl bg-gradient-to-tr from-blue-600 to-indigo-600 text-white font-black flex items-center justify-center text-xs shrink-0">
                      {u.name.slice(0, 2).toUpperCase()}
                    </div>
                    <div className="min-w-0">
                      <span className="font-bold text-slate-900 block truncate">{u.name}</span>
                      <span className="text-slate-500 text-[11px] block truncate">{u.email}</span>
                    </div>
                  </div>

                  <div className="text-right shrink-0">
                    <span className="text-[11px] text-slate-500 block font-mono">
                      {u.phone || 'Phone verified'}
                    </span>
                    <span className="inline-block mt-0.5 px-2 py-0.5 rounded-full text-[10px] font-bold bg-blue-50 text-blue-700 border border-blue-200">
                      Shopper
                    </span>
                  </div>
                </div>
              ))}

              {users.length === 0 && (
                <p className="text-xs text-slate-500 text-center py-6">No registered customers found.</p>
              )}
            </div>
          </div>

          <div className="mt-4 pt-3 border-t border-slate-100 flex items-center justify-between text-xs text-slate-500">
            <span>Real-time accounts authenticated</span>
            <Link href="/admin/users" className="text-blue-600 hover:underline font-semibold">
              Manage accounts &rarr;
            </Link>
          </div>
        </div>

        {/* Card 2: Recent Customer Orders */}
        <div className="rounded-2xl bg-white border border-slate-200 p-4 sm:p-5 flex flex-col justify-between shadow-sm">
          <div>
            <div className="flex items-center justify-between mb-4 pb-3 border-b border-slate-100">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-lg bg-blue-50 text-blue-600 flex items-center justify-center">
                  <ShoppingBag className="w-4 h-4" />
                </div>
                <div>
                  <h3 className="text-base font-bold text-slate-900">Recent Customer Orders</h3>
                  <p className="text-xs text-slate-500">Pre-orders & festive hampers</p>
                </div>
              </div>

              <Link
                href="/admin/orders"
                className="text-xs font-semibold text-blue-600 hover:text-blue-700 flex items-center gap-1"
              >
                <span>View All Orders</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </Link>
            </div>

            <div className="space-y-2.5">
              {orders.slice(0, 4).map((ord) => (
                <div
                  key={ord.orderId || ord.id}
                  className="p-3 rounded-xl bg-slate-50 border border-slate-200/80 flex items-center justify-between gap-3 text-xs"
                >
                  <div className="min-w-0 flex-1">
                    <div className="flex items-center gap-2 mb-0.5">
                      <span className="font-mono text-blue-600 font-bold shrink-0">{ord.orderId || ord.id}</span>
                      <span className="font-semibold text-slate-900 truncate">{ord.customerName}</span>
                    </div>
                    <div className="text-slate-500 text-[11px] flex items-center gap-2">
                      <span>Pickup: {ord.festivalDate || 'Immediate'}</span>
                      <span>•</span>
                      <span className="text-blue-700 font-bold font-mono">₹{ord.total}</span>
                    </div>
                  </div>

                  <span
                    className={`px-2.5 py-0.5 rounded-full font-bold text-[10px] shrink-0 ${
                      ord.status === 'Pending'
                        ? 'bg-amber-50 text-amber-700 border border-amber-200'
                        : ord.status === 'Confirmed'
                        ? 'bg-blue-50 text-blue-700 border border-blue-200'
                        : ord.status === 'Delivered'
                        ? 'bg-emerald-50 text-emerald-700 border border-emerald-200'
                        : 'bg-slate-100 text-slate-600'
                    }`}
                  >
                    {ord.status || 'Received'}
                  </span>
                </div>
              ))}

              {orders.length === 0 && (
                <p className="text-xs text-slate-500 text-center py-6">No customer orders yet.</p>
              )}
            </div>
          </div>

          <div className="mt-4 pt-3 border-t border-slate-100 flex items-center justify-between text-xs text-slate-500">
            <span>Direct Counter Pickup & Pre-Booking</span>
            <Link href="/admin/orders" className="text-blue-600 hover:underline font-semibold">
              Manage counter orders &rarr;
            </Link>
          </div>
        </div>

      </div>

      {/* QUICK ADD PRODUCT MODAL (Accessible directly from Dashboard) */}
      {isAddModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/50 backdrop-blur-sm overflow-y-auto">
          <div className="relative w-full max-w-xl my-8 bg-white border border-slate-200 rounded-3xl shadow-2xl overflow-hidden animate-in">
            {/* Modal Header */}
            <div className="flex items-center justify-between p-5 border-b border-slate-100 bg-slate-50">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center">
                  <Plus className="w-4 h-4" />
                </div>
                <div>
                  <h3 className="text-base font-bold text-slate-900">Add New Festive Product</h3>
                  <p className="text-xs text-slate-500">Save directly to Firebase Firestore & live storefront</p>
                </div>
              </div>
              <button
                type="button"
                onClick={() => setIsAddModalOpen(false)}
                className="p-1.5 rounded-lg text-slate-400 hover:text-slate-700 hover:bg-slate-100 transition-colors cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Modal Form */}
            <form onSubmit={handleCreateProduct} className="p-6 space-y-4">
              {productError && (
                <div className="p-3 rounded-xl bg-rose-50 border border-rose-200 text-rose-700 text-xs">
                  {productError}
                </div>
              )}
              {productSuccess && (
                <div className="p-3 rounded-xl bg-emerald-50 border border-emerald-200 text-emerald-700 text-xs flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                  <span>{productSuccess}</span>
                </div>
              )}

              {/* Product Name */}
              <div>
                <label className="text-xs font-bold text-slate-700 mb-1.5 block">
                  Product Name *
                </label>
                <input
                  type="text"
                  required
                  value={newProdName}
                  onChange={(e) => setNewProdName(e.target.value)}
                  placeholder="e.g. 50 Shots Sky Blitz Aerial Repeater"
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3.5 py-2.5 text-xs text-slate-900 placeholder-slate-400 focus:outline-none focus:bg-white focus:border-blue-600"
                />
              </div>

              {/* Category & Sound Level */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="text-xs font-bold text-slate-700 mb-1.5 block">
                    Category *
                  </label>
                  <select
                    value={newProdCategory}
                    onChange={(e) => setNewProdCategory(e.target.value)}
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2.5 text-xs text-slate-900 focus:outline-none focus:bg-white focus:border-blue-600"
                  >
                    {categories.map((c) => (
                      <option key={c.id} value={c.id}>
                        {c.name}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="text-xs font-bold text-slate-700 mb-1.5 block">
                    Sound Intensity *
                  </label>
                  <select
                    value={newProdSound}
                    onChange={(e) => setNewProdSound(e.target.value as SoundLevel)}
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2.5 text-xs text-slate-900 focus:outline-none focus:bg-white focus:border-blue-600"
                  >
                    <option value="No Sound (Visual Sparkle)">No Sound (Visual Sparkle)</option>
                    <option value="Low / Muffled">Low / Muffled</option>
                    <option value="Medium">Medium</option>
                    <option value="High Thrill">High Thrill</option>
                  </select>
                </div>
              </div>

              {/* Price, Stock & Pieces per pack */}
              <div className="grid grid-cols-3 gap-3">
                <div>
                  <label className="text-xs font-bold text-slate-700 mb-1.5 block">
                    Rate (₹) *
                  </label>
                  <input
                    type="number"
                    required
                    min={1}
                    value={newProdPrice}
                    onChange={(e) => setNewProdPrice(Number(e.target.value))}
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-xs text-slate-900 font-mono focus:outline-none focus:bg-white focus:border-blue-600"
                  />
                </div>

                <div>
                  <label className="text-xs font-bold text-slate-700 mb-1.5 block">
                    Initial Stock (Boxes) *
                  </label>
                  <input
                    type="number"
                    required
                    min={0}
                    value={newProdStock}
                    onChange={(e) => setNewProdStock(Number(e.target.value))}
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-xs text-slate-900 font-mono focus:outline-none focus:bg-white focus:border-blue-600"
                  />
                </div>

                <div>
                  <label className="text-xs font-bold text-slate-700 mb-1.5 block">
                    Pcs/Pack *
                  </label>
                  <input
                    type="number"
                    required
                    min={1}
                    value={newProdPieces}
                    onChange={(e) => setNewProdPieces(Number(e.target.value))}
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-xs text-slate-900 font-mono focus:outline-none focus:bg-white focus:border-blue-600"
                  />
                </div>
              </div>

              {/* Image Selection with products_img folder gallery */}
              <div>
                <div className="flex items-center justify-between mb-1.5">
                  <label className="text-xs font-bold text-slate-700 block">
                    Product Image
                  </label>
                  <button
                    type="button"
                    onClick={() => {
                      setShowFolderGallery(!showFolderGallery);
                      if (!showFolderGallery && folderImages.length === 0) {
                        fetchFolderImages();
                      }
                    }}
                    className="text-xs font-semibold text-blue-600 hover:text-blue-700 flex items-center gap-1 cursor-pointer"
                  >
                    <FolderOpen className="w-3.5 h-3.5" />
                    <span>{showFolderGallery ? 'Hide Gallery' : 'Pick from products_img folder'}</span>
                  </button>
                </div>

                <input
                  type="text"
                  value={newProdImageUrl}
                  onChange={(e) => setNewProdImageUrl(e.target.value)}
                  placeholder="/products_img/Zamin CHAKKAR.jpeg"
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3.5 py-2.5 text-xs text-slate-900 placeholder-slate-400 focus:outline-none focus:bg-white focus:border-blue-600"
                />

                {/* Folder Gallery Picker Dropdown */}
                {showFolderGallery && (
                  <div className="mt-2.5 p-3 rounded-2xl bg-slate-50 border border-slate-200 space-y-2">
                    <div className="flex items-center justify-between text-xs text-slate-600 pb-2 border-b border-slate-200">
                      <span>Select an image from `products_img/` folder:</span>
                      <button
                        type="button"
                        onClick={fetchFolderImages}
                        disabled={loadingFolderImages}
                        className="text-blue-600 hover:underline flex items-center gap-1"
                      >
                        <RefreshCw className={`w-3 h-3 ${loadingFolderImages ? 'animate-spin' : ''}`} />
                        <span>Refresh</span>
                      </button>
                    </div>

                    {loadingFolderImages ? (
                      <p className="text-xs text-slate-500 py-4 text-center">Loading images from folder...</p>
                    ) : folderImages.length === 0 ? (
                      <p className="text-xs text-slate-500 py-4 text-center">No images found in products_img/ folder.</p>
                    ) : (
                      <div className="grid grid-cols-3 sm:grid-cols-4 gap-2 max-h-48 overflow-y-auto p-1">
                        {folderImages.map((img) => (
                          <div
                            key={img.filename}
                            onClick={() => {
                              setNewProdImageUrl(img.url);
                              setShowFolderGallery(false);
                            }}
                            className={`group relative aspect-square rounded-xl overflow-hidden border-2 cursor-pointer transition-all ${
                              newProdImageUrl === img.url
                                ? 'border-blue-600 ring-2 ring-blue-600/50 scale-95'
                                : 'border-slate-200 hover:border-blue-400'
                            }`}
                          >
                            {/* eslint-disable-next-line @next/next/no-img-element */}
                            <img
                              src={img.url}
                              alt={img.filename}
                              className="w-full h-full object-cover group-hover:scale-105 transition-transform"
                            />
                            {newProdImageUrl === img.url && (
                              <div className="absolute inset-0 bg-blue-600/20 flex items-center justify-center">
                                <Check className="w-5 h-5 text-blue-700 drop-shadow-md" />
                              </div>
                            )}
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                )}
              </div>

              {/* Description */}
              <div>
                <label className="text-xs font-bold text-slate-700 mb-1.5 block">
                  Short Description
                </label>
                <textarea
                  rows={2}
                  value={newProdDesc}
                  onChange={(e) => setNewProdDesc(e.target.value)}
                  placeholder="Describe the visual effects, colours, and festive performance..."
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3.5 py-2 text-xs text-slate-900 placeholder-slate-400 focus:outline-none focus:bg-white focus:border-blue-600 resize-none"
                />
              </div>

              {/* Modal Action Buttons */}
              <div className="pt-3 border-t border-slate-100 flex items-center justify-end gap-2.5">
                <button
                  type="button"
                  onClick={() => setIsAddModalOpen(false)}
                  className="px-4 py-2 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-bold transition-colors cursor-pointer"
                >
                  Cancel
                </button>

                <button
                  type="submit"
                  disabled={savingProduct}
                  className="px-5 py-2.5 rounded-xl bg-gradient-to-r from-blue-600 via-indigo-600 to-blue-700 hover:from-blue-700 hover:to-indigo-700 text-white font-bold text-xs shadow-md shadow-blue-600/30 flex items-center gap-1.5 cursor-pointer disabled:opacity-50"
                >
                  {savingProduct ? (
                    <>
                      <Loader2 className="w-3.5 h-3.5 animate-spin" />
                      <span>Saving to Firebase...</span>
                    </>
                  ) : (
                    <>
                      <Plus className="w-4 h-4 text-white" />
                      <span>Add Product to Store</span>
                    </>
                  )}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}

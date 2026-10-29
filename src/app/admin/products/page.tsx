'use client';

import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import {
  Plus,
  Search,
  Edit2,
  Trash2,
  Upload,
  X,
  AlertTriangle,
  ShieldCheck,
  Loader2,
  Image as ImageIcon,
  FolderOpen,
  Check,
  RefreshCw,
} from 'lucide-react';
import { Product, Category, SoundLevel } from '@/types';
import { INITIAL_CATEGORIES } from '@/lib/data/sample-products';

export default function AdminProductsPage() {
  const router = useRouter();
  const [products, setProducts] = useState<Product[]>([]);
  const [categories] = useState<Category[]>(INITIAL_CATEGORIES);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [selectedCat, setSelectedCat] = useState('all');

  // Modal states
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);

  // Form states
  const [name, setName] = useState('');
  const [categoryId, setCategoryId] = useState(categories[0].id);
  const [description, setDescription] = useState('');
  const [retailPrice, setRetailPrice] = useState<number>(250);
  const [stockQuantity, setStockQuantity] = useState<number>(50);
  const [soundLevel, setSoundLevel] = useState<SoundLevel>('Low / Muffled');
  const [durationSeconds, setDurationSeconds] = useState<number>(30);
  const [piecesPerPack, setPiecesPerPack] = useState<number>(10);
  const [isGreenCracker, setIsGreenCracker] = useState(true);
  const [greenCrackerCode, setGreenCrackerCode] = useState('NEERI-GC-2026');
  const [safetyDistanceMeters, setSafetyDistanceMeters] = useState<number>(5);
  const [imageUrl, setImageUrl] = useState('');
  const [active, setActive] = useState(true);
  const [featured, setFeatured] = useState(false);

  // Upload state
  const [uploading, setUploading] = useState(false);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Delete modal state
  const [productToDelete, setProductToDelete] = useState<Product | null>(null);

  // Firebase sync state
  const [syncingFirebase, setSyncingFirebase] = useState(false);
  const [syncMessage, setSyncMessage] = useState<string | null>(null);

  // products_img folder gallery state
  const [folderImages, setFolderImages] = useState<Array<{ filename: string; url: string; size: number }>>([]);
  const [showFolderGallery, setShowFolderGallery] = useState(false);
  const [loadingFolderImages, setLoadingFolderImages] = useState(false);

  const fetchFolderImages = async () => {
    setLoadingFolderImages(true);
    try {
      const res = await fetch('/api/admin/products-images');
      if (res.ok) {
        const data = await res.json();
        setFolderImages(data.images || []);
      }
    } catch (err) {
      console.error('Failed to load products_img folder images:', err);
    } finally {
      setLoadingFolderImages(false);
    }
  };

  const handleToggleGallery = () => {
    if (!showFolderGallery) {
      fetchFolderImages();
    }
    setShowFolderGallery((prev) => !prev);
  };

  const handleSyncToFirebase = async () => {
    setSyncingFirebase(true);
    setSyncMessage(null);
    try {
      const res = await fetch('/api/seed-firestore');
      const data = await res.json();
      if (data.success) {
        setSyncMessage(`Successfully saved ${data.count} products into Firebase Firestore ('fireworks' collection)! Check Firebase Console now.`);
        fetchProducts();
      } else {
        alert(data.error || 'Failed to sync to Firebase');
      }
    } catch {
      alert('Error connecting to Firebase seed endpoint');
    } finally {
      setSyncingFirebase(false);
    }
  };

  const fetchProducts = async () => {
    setLoading(true);
    try {
      const res = await fetch('/api/admin/products');
      if (res.status === 401) {
        router.push('/admin/login');
        return;
      }
      if (res.ok) {
        const data = await res.json();
        setProducts(data.products || []);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProducts();
  }, []);

  const openAddModal = () => {
    setIsEditing(false);
    setEditingId(null);
    setName('');
    setCategoryId(categories[0].id);
    setDescription('');
    setRetailPrice(250);
    setStockQuantity(50);
    setSoundLevel('Low / Muffled');
    setDurationSeconds(30);
    setPiecesPerPack(10);
    setIsGreenCracker(true);
    setGreenCrackerCode('NEERI-GC-2026');
    setSafetyDistanceMeters(5);
    setImageUrl('https://images.unsplash.com/photo-1514565131-fce0801e5785?auto=format&fit=crop&w=800&q=80');
    setActive(true);
    setFeatured(false);
    setShowFolderGallery(false);
    setError(null);
    setIsModalOpen(true);
  };

  const openEditModal = (p: Product) => {
    setIsEditing(true);
    setEditingId(p.id);
    setName(p.name);
    setCategoryId(p.categoryId);
    setDescription(p.description);
    setRetailPrice(p.retailPrice);
    setStockQuantity(p.stockQuantity);
    setSoundLevel(p.soundLevel);
    setDurationSeconds(p.durationSeconds || 0);
    setPiecesPerPack(p.piecesPerPack);
    setIsGreenCracker(p.isGreenCracker);
    setGreenCrackerCode(p.greenCrackerCode || '');
    setSafetyDistanceMeters(p.safetyDistanceMeters);
    setImageUrl(p.imageUrl);
    setActive(p.active);
    setFeatured(Boolean(p.featured));
    setShowFolderGallery(false);
    setError(null);
    setIsModalOpen(true);
  };

  const handleImageFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setUploading(true);
    setError(null);

    const formData = new FormData();
    formData.append('file', file);

    try {
      const res = await fetch('/api/admin/upload', {
        method: 'POST',
        body: formData,
      });

      if (res.status === 401) {
        router.push('/admin/login');
        return;
      }

      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.error || 'Failed to upload image');
      }

      setImageUrl(data.imageUrl);
      fetchFolderImages();
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : 'Upload error';
      setError(msg);
    } finally {
      setUploading(false);
    }
  };

  const handleSaveProduct = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) {
      setError('Product name is required.');
      return;
    }

    setSaving(true);
    setError(null);

    const catObj = categories.find((c) => c.id === categoryId);
    const categoryName = catObj?.name || 'General Fireworks';

    const payload = {
      id: editingId,
      name: name.trim(),
      categoryId,
      categoryName,
      description: description.trim(),
      retailPrice: Number(retailPrice),
      stockQuantity: Number(stockQuantity),
      soundLevel,
      durationSeconds: Number(durationSeconds),
      piecesPerPack: Number(piecesPerPack),
      isGreenCracker,
      greenCrackerCode: isGreenCracker ? greenCrackerCode.trim() : undefined,
      safetyDistanceMeters: Number(safetyDistanceMeters),
      imageUrl,
      active,
      featured,
    };

    try {
      const res = await fetch('/api/admin/products', {
        method: isEditing ? 'PUT' : 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });

      if (res.status === 401) {
        router.push('/admin/login');
        return;
      }

      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.error || 'Failed to save product');
      }

      setIsModalOpen(false);
      fetchProducts();
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : 'Save error';
      setError(msg);
    } finally {
      setSaving(false);
    }
  };

  const handleConfirmDelete = async () => {
    if (!productToDelete) return;

    try {
      const res = await fetch(`/api/admin/products?id=${productToDelete.id}`, {
        method: 'DELETE',
      });
      if (res.ok) {
        setProductToDelete(null);
        fetchProducts();
      }
    } catch (err) {
      console.error(err);
    }
  };

  const filteredProducts = products.filter((p) => {
    if (selectedCat !== 'all' && p.categoryId !== selectedCat) return false;
    if (search.trim()) {
      const q = search.toLowerCase();
      return p.name.toLowerCase().includes(q) || p.categoryName.toLowerCase().includes(q);
    }
    return true;
  });

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 sm:gap-4">
        <div>
          <h1 className="text-xl sm:text-2xl lg:text-3xl font-extrabold text-white">Catalogue & Product Manager</h1>
          <p className="text-xs text-slate-400 mt-0.5 sm:mt-1">
            Add new products, upload images, update counter prices, and manage active status
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-2 sm:gap-3 w-full sm:w-auto">
          <button
            onClick={handleSyncToFirebase}
            disabled={syncingFirebase}
            className="inline-flex items-center justify-center gap-1.5 px-3.5 py-2.5 rounded-xl bg-slate-900 border border-amber-500/40 hover:bg-slate-800 text-amber-400 font-bold text-xs shadow-md cursor-pointer disabled:opacity-50"
            title="Upload catalogue products to Firebase Firestore"
          >
            {syncingFirebase ? <Loader2 className="w-4 h-4 animate-spin" /> : <Upload className="w-4 h-4" />}
            <span>{syncingFirebase ? 'Uploading to Firebase...' : 'Sync to Firebase'}</span>
          </button>

          <button
            onClick={openAddModal}
            className="inline-flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-400 hover:to-amber-500 text-slate-950 font-bold text-xs shadow-md shadow-amber-500/20 cursor-pointer"
          >
            <Plus className="w-4 h-4" />
            <span>Add New Product</span>
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
      <div className="bg-slate-900 border border-slate-800 rounded-2xl p-3.5 sm:p-4 flex flex-col sm:flex-row gap-3 items-stretch sm:items-center justify-between">
        <div className="relative w-full sm:max-w-xs">
          <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search products..."
            className="w-full bg-slate-950 border border-slate-800 rounded-xl pl-9 pr-4 py-2 text-xs text-white focus:outline-none focus:border-amber-500"
          />
        </div>

        <div className="flex items-center gap-3 w-full sm:w-auto">
          <select
            value={selectedCat}
            onChange={(e) => setSelectedCat(e.target.value)}
            className="bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-xs text-slate-200 focus:outline-none focus:border-amber-500 w-full sm:w-auto"
          >
            <option value="all">All Categories ({products.length})</option>
            {categories.map((c) => (
              <option key={c.id} value={c.id}>
                {c.name}
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* Mobile Card View (Visible on small screens < md) */}
      <div className="md:hidden space-y-3">
        {filteredProducts.map((p) => (
          <div
            key={p.id}
            className="p-3.5 rounded-2xl bg-slate-900 border border-slate-800 space-y-3 shadow-lg"
          >
            <div className="flex items-start gap-3">
              <div className="relative w-14 h-14 rounded-xl overflow-hidden bg-slate-950 shrink-0 border border-slate-800 flex items-center justify-center">
                {p.imageUrl ? (
                  // eslint-disable-next-line @next/next/no-img-element
                  <img
                    src={p.imageUrl}
                    alt={p.name}
                    className="w-full h-full object-cover"
                    onError={(e) => { (e.target as HTMLImageElement).style.display = 'none'; }}
                  />
                ) : (
                  <ImageIcon className="w-5 h-5 text-slate-600" />
                )}
              </div>

              <div className="min-w-0 flex-1">
                <div className="flex items-start justify-between gap-2">
                  <span className="font-bold text-white text-sm block line-clamp-1">{p.name}</span>
                  <span
                    className={`px-2 py-0.5 rounded-full text-[10px] font-semibold shrink-0 ${
                      p.active
                        ? 'bg-emerald-950/80 text-emerald-400 border border-emerald-500/30'
                        : 'bg-slate-800 text-slate-400 border border-slate-700'
                    }`}
                  >
                    {p.active ? 'Active' : 'Hidden'}
                  </span>
                </div>
                <span className="text-slate-400 text-xs block">{p.categoryName}</span>
                <span className="text-amber-400 font-extrabold text-sm block mt-0.5">
                  ₹{p.retailPrice.toLocaleString('en-IN')}
                </span>
              </div>
            </div>

            <div className="flex items-center justify-between pt-2 border-t border-slate-800/80 text-xs text-slate-400">
              <div className="flex items-center gap-2">
                <span
                  className={`font-semibold px-2 py-0.5 rounded-md text-[11px] ${
                    p.stockQuantity <= 15
                      ? 'bg-rose-950 text-rose-400 border border-rose-500/30'
                      : 'bg-emerald-950 text-emerald-400 border border-emerald-500/30'
                  }`}
                >
                  {p.stockQuantity} Boxes
                </span>
                {p.isGreenCracker && (
                  <span className="text-emerald-400 text-[11px] font-medium flex items-center gap-1">
                    <ShieldCheck className="w-3 h-3" /> Green
                  </span>
                )}
              </div>

              <div className="flex items-center gap-2">
                <button
                  onClick={() => openEditModal(p)}
                  className="px-2.5 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700 text-xs flex items-center gap-1"
                >
                  <Edit2 className="w-3 h-3 text-amber-400" />
                  <span>Edit</span>
                </button>
                <button
                  onClick={() => setProductToDelete(p)}
                  className="p-1.5 rounded-lg bg-rose-950/40 hover:bg-rose-950 text-rose-400 border border-rose-500/30"
                  title="Delete"
                >
                  <Trash2 className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>
          </div>
        ))}

        {filteredProducts.length === 0 && (
          <div className="p-8 text-center bg-slate-900 border border-slate-800 rounded-2xl text-xs text-slate-500">
            No products found matching your filter.
          </div>
        )}
      </div>

      {/* Desktop Products Table (Hidden on mobile < md) */}
      <div className="hidden md:block bg-slate-900 border border-slate-800 rounded-2xl overflow-hidden shadow-xl">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-slate-950 border-b border-slate-800 text-slate-400 uppercase tracking-wider font-semibold">
              <tr>
                <th className="px-5 py-3.5">Product</th>
                <th className="px-5 py-3.5">Category</th>
                <th className="px-5 py-3.5">Counter Price</th>
                <th className="px-5 py-3.5">Stock</th>
                <th className="px-5 py-3.5">Compliance</th>
                <th className="px-5 py-3.5">Status</th>
                <th className="px-5 py-3.5 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800">
              {filteredProducts.map((p) => (
                <tr key={p.id} className="hover:bg-slate-800/40 transition-colors">
                  <td className="px-5 py-3.5">
                    <div className="flex items-center gap-3">
                      <div className="relative w-12 h-12 rounded-lg overflow-hidden bg-slate-950 shrink-0 border border-slate-800 flex items-center justify-center">
                        {p.imageUrl ? (
                          // eslint-disable-next-line @next/next/no-img-element
                          <img src={p.imageUrl} alt={p.name} className="w-full h-full object-cover" onError={(e) => { (e.target as HTMLImageElement).style.display = 'none'; }} />
                        ) : (
                          <ImageIcon className="w-5 h-5 text-slate-600" />
                        )}
                      </div>
                      <div>
                        <span className="font-bold text-white text-sm block line-clamp-1">{p.name}</span>
                        <span className="text-slate-400 text-[11px] block">{p.piecesPerPack} Pcs • {p.soundLevel}</span>
                      </div>
                    </div>
                  </td>
                  <td className="px-5 py-3.5 text-slate-300 font-medium">{p.categoryName}</td>
                  <td className="px-5 py-3.5 font-bold text-amber-400 text-sm">
                    ₹{p.retailPrice.toLocaleString('en-IN')}
                  </td>
                  <td className="px-5 py-3.5">
                    <span
                      className={`font-semibold px-2 py-0.5 rounded-md ${
                        p.stockQuantity <= 15
                          ? 'bg-rose-950 text-rose-400 border border-rose-500/30'
                          : 'bg-emerald-950 text-emerald-400 border border-emerald-500/30'
                      }`}
                    >
                      {p.stockQuantity} Boxes
                    </span>
                  </td>
                  <td className="px-5 py-3.5">
                    {p.isGreenCracker ? (
                      <span className="inline-flex items-center gap-1 text-[11px] text-emerald-400">
                        <ShieldCheck className="w-3.5 h-3.5" />
                        <span>Green Cracker</span>
                      </span>
                    ) : (
                      <span className="text-slate-500 text-[11px]">Standard</span>
                    )}
                  </td>
                  <td className="px-5 py-3.5">
                    <span
                      className={`px-2 py-0.5 rounded-full text-[11px] font-semibold ${
                        p.active
                          ? 'bg-emerald-950/80 text-emerald-400 border border-emerald-500/30'
                          : 'bg-slate-800 text-slate-400 border border-slate-700'
                      }`}
                    >
                      {p.active ? 'Active' : 'Hidden'}
                    </span>
                  </td>
                  <td className="px-5 py-3.5 text-right">
                    <div className="flex items-center justify-end gap-2">
                      <button
                        onClick={() => openEditModal(p)}
                        className="p-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-200 hover:text-white border border-slate-700 cursor-pointer"
                        title="Edit Product"
                      >
                        <Edit2 className="w-3.5 h-3.5" />
                      </button>
                      <button
                        onClick={() => setProductToDelete(p)}
                        className="p-1.5 rounded-lg bg-rose-950/40 hover:bg-rose-950 text-rose-400 border border-rose-500/30 cursor-pointer"
                        title="Delete Product"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}

              {filteredProducts.length === 0 && (
                <tr>
                  <td colSpan={7} className="px-5 py-12 text-center text-slate-500">
                    No products found matching your filter.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Add / Edit Product Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-2 sm:p-4 bg-slate-950/85 backdrop-blur-md animate-in fade-in">
          <div 
            className="relative w-full max-w-2xl bg-slate-900 border border-slate-800 rounded-2xl sm:rounded-3xl overflow-hidden shadow-2xl max-h-[92vh] sm:max-h-[90vh] flex flex-col"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-center justify-between p-4 sm:p-5 border-b border-slate-800 bg-slate-950/80">
              <h3 className="text-base sm:text-lg font-bold text-white">
                {isEditing ? 'Edit Fireworks Record' : 'Add New Certified Firework'}
              </h3>
              <button
                onClick={() => setIsModalOpen(false)}
                className="p-1 text-slate-400 hover:text-white cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSaveProduct} className="overflow-y-auto p-4 sm:p-6 space-y-3.5 sm:space-y-4">
              {error && (
                <div className="p-3 rounded-xl bg-rose-950/40 border border-rose-500/30 text-rose-300 text-xs">
                  {error}
                </div>
              )}

              {/* Title & Category */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="text-xs font-semibold text-slate-300 mb-1 block">Product Name *</label>
                  <input
                    type="text"
                    required
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    placeholder="e.g. 50 Shots Titanium Brocade"
                    className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-amber-500"
                  />
                </div>

                <div>
                  <label className="text-xs font-semibold text-slate-300 mb-1 block">Category *</label>
                  <select
                    value={categoryId}
                    onChange={(e) => setCategoryId(e.target.value)}
                    className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-amber-500"
                  >
                    {categories.map((c) => (
                      <option key={c.id} value={c.id}>
                        {c.name}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              {/* Price & Stock */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div>
                  <label className="text-xs font-semibold text-slate-300 mb-1 block">Counter Rate (₹) *</label>
                  <input
                    type="number"
                    required
                    min={0}
                    value={retailPrice}
                    onChange={(e) => setRetailPrice(Number(e.target.value))}
                    className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-amber-500"
                  />
                </div>

                <div>
                  <label className="text-xs font-semibold text-slate-300 mb-1 block">Initial Stock (Boxes) *</label>
                  <input
                    type="number"
                    required
                    min={0}
                    value={stockQuantity}
                    onChange={(e) => setStockQuantity(Number(e.target.value))}
                    className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-amber-500"
                  />
                </div>

                <div>
                  <label className="text-xs font-semibold text-slate-300 mb-1 block">Pieces per Pack</label>
                  <input
                    type="number"
                    min={1}
                    value={piecesPerPack}
                    onChange={(e) => setPiecesPerPack(Number(e.target.value))}
                    className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-amber-500"
                  />
                </div>
              </div>

              {/* Sound & Specs */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div>
                  <label className="text-xs font-semibold text-slate-300 mb-1 block">Sound Rating</label>
                  <select
                    value={soundLevel}
                    onChange={(e) => setSoundLevel(e.target.value as SoundLevel)}
                    className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-amber-500"
                  >
                    <option value="No Sound (Visual Sparkle)">No Sound (Visual Sparkle)</option>
                    <option value="Low / Muffled">Low / Muffled</option>
                    <option value="Medium">Medium</option>
                    <option value="High Thrill">High Thrill (Within 125dB limit)</option>
                  </select>
                </div>

                <div>
                  <label className="text-xs font-semibold text-slate-300 mb-1 block">Duration (Secs)</label>
                  <input
                    type="number"
                    min={0}
                    value={durationSeconds}
                    onChange={(e) => setDurationSeconds(Number(e.target.value))}
                    className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-amber-500"
                  />
                </div>

                <div>
                  <label className="text-xs font-semibold text-slate-300 mb-1 block">Safe Distance (Meters)</label>
                  <input
                    type="number"
                    min={1}
                    value={safetyDistanceMeters}
                    onChange={(e) => setSafetyDistanceMeters(Number(e.target.value))}
                    className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-amber-500"
                  />
                </div>
              </div>

              {/* Description */}
              <div>
                <label className="text-xs font-semibold text-slate-300 mb-1 block">Visual Effects & Description</label>
                <textarea
                  rows={2}
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  placeholder="Describe colors, fountain height, crackling sounds..."
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-amber-500 resize-none"
                />
              </div>

              {/* Product Image Section: Upload & Browse products_img Folder */}
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <label className="text-xs font-semibold text-slate-300 block">
                    Product Image (from <code className="text-amber-400">products_img</code> folder)
                  </label>
                  <button
                    type="button"
                    onClick={handleToggleGallery}
                    className="inline-flex items-center gap-1 text-[11px] font-semibold text-amber-400 hover:text-amber-300 cursor-pointer"
                  >
                    <FolderOpen className="w-3.5 h-3.5" />
                    <span>{showFolderGallery ? 'Hide Gallery' : 'Browse products_img'}</span>
                  </button>
                </div>

                <div className="flex items-start gap-4">
                  {/* Image Preview */}
                  <div className="relative w-20 h-20 rounded-xl bg-slate-950 border border-slate-800 overflow-hidden shrink-0 flex items-center justify-center">
                    {imageUrl ? (
                      // eslint-disable-next-line @next/next/no-img-element
                      <img
                        src={imageUrl}
                        alt="Preview"
                        className="w-full h-full object-cover"
                        onError={(e) => {
                          (e.target as HTMLImageElement).style.display = 'none';
                        }}
                      />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center text-slate-600">
                        <ImageIcon className="w-6 h-6" />
                      </div>
                    )}
                  </div>

                  <div className="flex-1 space-y-2">
                    <div className="flex flex-wrap items-center gap-2">
                      <label className="cursor-pointer inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs border border-slate-700 font-medium">
                        <Upload className="w-3.5 h-3.5 text-amber-400" />
                        <span>{uploading ? 'Uploading...' : 'Upload to products_img'}</span>
                        <input
                          type="file"
                          accept="image/png,image/jpeg,image/webp,image/jpg"
                          onChange={handleImageFileUpload}
                          className="hidden"
                          disabled={uploading}
                        />
                      </label>

                      <button
                        type="button"
                        onClick={handleToggleGallery}
                        className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-amber-500/10 hover:bg-amber-500/20 text-amber-300 text-xs border border-amber-500/30 font-medium cursor-pointer"
                      >
                        <FolderOpen className="w-3.5 h-3.5 text-amber-400" />
                        <span>Select from Folder</span>
                      </button>
                    </div>

                    <input
                      type="text"
                      value={imageUrl}
                      onChange={(e) => setImageUrl(e.target.value)}
                      placeholder="/products_img/filename.jpg or direct URL"
                      className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-1.5 text-xs text-white focus:outline-none focus:border-amber-500 font-mono"
                    />
                    <p className="text-[10px] text-slate-500">
                      Images selected or uploaded are saved in <span className="text-slate-400 font-mono">products_img/</span> and stored in Firebase Firestore.
                    </p>
                  </div>
                </div>

                {/* Collapsible Gallery of products_img folder */}
                {showFolderGallery && (
                  <div className="p-3.5 rounded-2xl bg-slate-950 border border-amber-500/30 space-y-2.5 animate-in fade-in">
                    <div className="flex items-center justify-between text-xs">
                      <div className="flex items-center gap-1.5 font-bold text-white">
                        <FolderOpen className="w-4 h-4 text-amber-400" />
                        <span>Available in products_img/ ({folderImages.length})</span>
                      </div>
                      <button
                        type="button"
                        onClick={fetchFolderImages}
                        disabled={loadingFolderImages}
                        className="inline-flex items-center gap-1 text-[11px] text-slate-400 hover:text-white cursor-pointer"
                      >
                        <RefreshCw className={`w-3 h-3 ${loadingFolderImages ? 'animate-spin' : ''}`} />
                        <span>Refresh Folder</span>
                      </button>
                    </div>

                    {loadingFolderImages ? (
                      <div className="text-center py-4 text-xs text-slate-500">
                        Scanning products_img folder...
                      </div>
                    ) : folderImages.length === 0 ? (
                      <div className="text-center py-4 text-xs text-slate-500">
                        No images found in <span className="font-mono">products_img/</span>. Put images in the folder or upload above.
                      </div>
                    ) : (
                      <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-6 gap-2 max-h-48 overflow-y-auto p-1">
                        {folderImages.map((img) => {
                          const isSelected = imageUrl === img.url || imageUrl.endsWith(img.filename);
                          return (
                            <button
                              key={img.filename}
                              type="button"
                              onClick={() => setImageUrl(img.url)}
                              className={`relative rounded-xl overflow-hidden bg-slate-900 border text-left cursor-pointer transition-all group ${
                                isSelected
                                  ? 'border-amber-500 ring-2 ring-amber-500'
                                  : 'border-slate-800 hover:border-slate-700'
                              }`}
                              title={img.filename}
                            >
                              <div className="w-full h-16 bg-slate-950 flex items-center justify-center overflow-hidden">
                                {/* eslint-disable-next-line @next/next/no-img-element */}
                                <img
                                  src={img.url}
                                  alt={img.filename}
                                  className="w-full h-full object-cover group-hover:scale-105 transition-transform"
                                />
                              </div>
                              <div className="p-1 text-[10px] text-slate-300 truncate bg-slate-900/90 font-mono">
                                {img.filename}
                              </div>
                              {isSelected && (
                                <div className="absolute top-1 right-1 w-4 h-4 rounded-full bg-amber-500 text-slate-950 flex items-center justify-center">
                                  <Check className="w-3 h-3 stroke-[3]" />
                                </div>
                              )}
                            </button>
                          );
                        })}
                      </div>
                    )}
                  </div>
                )}
              </div>

              {/* Green Cracker & Status Toggles */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2">
                <div className="flex items-center gap-3 p-3 rounded-xl bg-slate-950 border border-slate-800">
                  <input
                    type="checkbox"
                    id="gcCheck"
                    checked={isGreenCracker}
                    onChange={(e) => setIsGreenCracker(e.target.checked)}
                    className="w-4 h-4 text-emerald-500 rounded focus:ring-0"
                  />
                  <div>
                    <label htmlFor="gcCheck" className="text-xs font-semibold text-white block cursor-pointer">
                      CSIR-NEERI Green Cracker
                    </label>
                    <span className="text-[11px] text-slate-400">Certified low emission formula</span>
                  </div>
                </div>

                <div className="flex items-center gap-3 p-3 rounded-xl bg-slate-950 border border-slate-800">
                  <input
                    type="checkbox"
                    id="activeCheck"
                    checked={active}
                    onChange={(e) => setActive(e.target.checked)}
                    className="w-4 h-4 text-amber-500 rounded focus:ring-0"
                  />
                  <div>
                    <label htmlFor="activeCheck" className="text-xs font-semibold text-white block cursor-pointer">
                      Active in Catalogue
                    </label>
                    <span className="text-[11px] text-slate-400">Visible to walk-in customers</span>
                  </div>
                </div>
              </div>

              {/* Submit Buttons */}
              <div className="pt-4 border-t border-slate-800 flex items-center justify-end gap-3">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="px-4 py-2 text-xs text-slate-400 hover:text-white cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={saving}
                  className="px-5 py-2.5 rounded-xl bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-400 hover:to-amber-500 text-slate-950 font-bold text-xs shadow-md shadow-amber-500/20 cursor-pointer disabled:opacity-50 flex items-center gap-2"
                >
                  {saving ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : null}
                  <span>{isEditing ? 'Save Changes' : 'Create Product'}</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Delete Confirmation Modal */}
      {productToDelete && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/85 backdrop-blur-md animate-in fade-in">
          <div className="w-full max-w-md bg-slate-900 border border-slate-800 rounded-2xl p-6 shadow-2xl space-y-4">
            <div className="flex items-center gap-3 text-rose-400">
              <AlertTriangle className="w-6 h-6 shrink-0" />
              <h3 className="text-lg font-bold text-white">Delete Firework Record?</h3>
            </div>
            <p className="text-xs text-slate-300 leading-relaxed">
              Are you sure you want to permanently delete <strong>{productToDelete.name}</strong> from the database? This action will also be recorded in the audit logs.
            </p>
            <div className="flex items-center justify-end gap-3 pt-2">
              <button
                onClick={() => setProductToDelete(null)}
                className="px-4 py-2 text-xs text-slate-400 hover:text-white cursor-pointer"
              >
                Cancel
              </button>
              <button
                onClick={handleConfirmDelete}
                className="px-4 py-2 rounded-xl bg-rose-600 hover:bg-rose-500 text-white font-bold text-xs cursor-pointer"
              >
                Yes, Delete
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

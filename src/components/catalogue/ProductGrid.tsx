'use client';

import React, { useState, useMemo } from 'react';
import { Search, SlidersHorizontal, Sparkles, X } from 'lucide-react';
import { Category, Product, SoundLevel } from '@/types';
import { ProductCard } from './ProductCard';

interface ProductGridProps {
  products: Product[];
  categories: Category[];
  onSelectProduct: (product: Product) => void;
  onInquireProduct: (product: Product) => void;
}

export function ProductGrid({
  products,
  categories,
  onSelectProduct,
  onInquireProduct,
}: ProductGridProps) {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [selectedSound, setSelectedSound] = useState<string>('all');
  const [sortBy, setSortBy] = useState<'featured' | 'price-asc' | 'price-desc' | 'name'>('featured');
  const [greenCrackerOnly, setGreenCrackerOnly] = useState(false);

  // Filter and sort products
  const filteredProducts = useMemo(() => {
    return products.filter((p) => {
      // Must be active
      if (!p.active) return false;

      // Category filter
      if (selectedCategory !== 'all' && p.categoryId !== selectedCategory) {
        return false;
      }

      // Sound level filter
      if (selectedSound !== 'all' && p.soundLevel !== selectedSound) {
        return false;
      }

      // Green cracker toggle
      if (greenCrackerOnly && !p.isGreenCracker) {
        return false;
      }

      // Search query
      if (searchQuery.trim()) {
        const query = searchQuery.toLowerCase();
        const matchesName = p.name.toLowerCase().includes(query);
        const matchesDesc = (p.description || '').toLowerCase().includes(query);
        const matchesCat = (p.categoryName || '').toLowerCase().includes(query);
        if (!matchesName && !matchesDesc && !matchesCat) return false;
      }

      return true;
    }).sort((a, b) => {
      if (sortBy === 'price-asc') return a.retailPrice - b.retailPrice;
      if (sortBy === 'price-desc') return b.retailPrice - a.retailPrice;
      if (sortBy === 'name') return a.name.localeCompare(b.name);
      // featured default
      return (b.featured ? 1 : 0) - (a.featured ? 1 : 0);
    });
  }, [products, selectedCategory, selectedSound, greenCrackerOnly, searchQuery, sortBy]);

  const soundOptions: SoundLevel[] = [
    'No Sound (Visual Sparkle)',
    'Low / Muffled',
    'Medium',
    'High Thrill',
  ];

  return (
    <section id="catalogue" className="py-12 sm:py-16 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      {/* Section Header */}
      <div className="text-center max-w-2xl mx-auto mb-8 sm:mb-10">
        <div className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-full bg-blue-50 border border-blue-200 text-blue-700 text-xs font-bold mb-3 shadow-xs">
          <Sparkles className="w-3.5 h-3.5 text-blue-600" />
          <span>Transparent Retail Price Guide</span>
        </div>
        <h2 className="text-2xl xs:text-3xl sm:text-4xl font-black text-slate-900 tracking-tight mb-2 sm:mb-3">
          Explore Our Festive Catalogue
        </h2>
        <p className="text-xs sm:text-sm text-slate-600">
          Browse authentic fireworks manufactured in Sivakasi. Filter by category, sound level, or certified green crackers.
        </p>
      </div>

      {/* Search and Filters Bar */}
      <div className="bg-white border border-blue-100 rounded-3xl p-4 sm:p-6 mb-6 sm:mb-8 space-y-4 shadow-sm">
        {/* Search & Sort row */}
        <div className="flex flex-col sm:flex-row gap-3 items-stretch sm:items-center justify-between">
          <div className="relative w-full sm:max-w-md">
            <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search sparkler, anar, sky shot..."
              className="w-full bg-slate-50 border border-slate-200 rounded-xl pl-10 pr-10 py-2.5 text-xs sm:text-sm text-slate-900 placeholder-slate-400 focus:outline-none focus:border-blue-500 focus:bg-white transition-colors"
            />
            {searchQuery && (
              <button
                onClick={() => setSearchQuery('')}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600"
              >
                <X className="w-4 h-4" />
              </button>
            )}
          </div>

          <div className="flex items-center justify-between sm:justify-end gap-2 sm:gap-3 w-full sm:w-auto">
            {/* Sort selector */}
            <div className="flex items-center gap-1.5 sm:gap-2 text-xs text-slate-600 flex-1 sm:flex-none">
              <span className="shrink-0 hidden xs:inline font-semibold">Sort:</span>
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value as any)}
                className="w-full sm:w-auto bg-slate-50 border border-slate-200 rounded-xl px-2.5 sm:px-3 py-2 text-xs font-semibold text-slate-800 focus:outline-none focus:border-blue-500"
              >
                <option value="featured">Featured First</option>
                <option value="price-asc">Price: Low to High</option>
                <option value="price-desc">Price: High to Low</option>
                <option value="name">Name (A to Z)</option>
              </select>
            </div>

            {/* Green Cracker quick toggle */}
            <button
              onClick={() => setGreenCrackerOnly(!greenCrackerOnly)}
              className={`shrink-0 px-3 py-2 rounded-xl text-xs font-bold border transition-all cursor-pointer ${
                greenCrackerOnly
                  ? 'bg-emerald-50 border-emerald-300 text-emerald-800 shadow-xs'
                  : 'bg-slate-50 border-slate-200 text-slate-600 hover:text-slate-900 hover:bg-slate-100'
              }`}
            >
              🌿 Green Only
            </button>
          </div>
        </div>

        {/* Category Filter Pills (Touch scroll enabled) */}
        <div className="flex items-center gap-1.5 sm:gap-2 overflow-x-auto pb-2 pt-2 border-t border-slate-100 touch-scroll scrollbar-none">
          <button
            onClick={() => setSelectedCategory('all')}
            className={`px-4 py-2 rounded-full text-xs font-bold whitespace-nowrap transition-all cursor-pointer shrink-0 ${
              selectedCategory === 'all'
                ? 'bg-blue-600 text-white shadow-md shadow-blue-500/25'
                : 'bg-slate-100 text-slate-600 hover:bg-blue-50 hover:text-blue-700 border border-slate-200'
            }`}
          >
            All Categories ({products.length})
          </button>

          {categories.map((cat) => {
            const count = products.filter((p) => p.categoryId === cat.id && p.active).length;
            const isSelected = selectedCategory === cat.id;

            return (
              <button
                key={cat.id}
                onClick={() => setSelectedCategory(cat.id)}
                className={`px-4 py-2 rounded-full text-xs font-bold whitespace-nowrap transition-all cursor-pointer shrink-0 ${
                  isSelected
                    ? 'bg-blue-600 text-white shadow-md shadow-blue-500/25'
                    : 'bg-slate-100 text-slate-600 hover:bg-blue-50 hover:text-blue-700 border border-slate-200'
                }`}
              >
                {cat.name} ({count})
              </button>
            );
          })}
        </div>

        {/* Sound Level Filter Pills */}
        <div className="flex items-center gap-1.5 sm:gap-2 overflow-x-auto pb-1 text-xs text-slate-500 touch-scroll scrollbar-none">
          <span className="shrink-0 font-bold text-slate-700 hidden sm:inline">Sound:</span>
          <button
            onClick={() => setSelectedSound('all')}
            className={`px-3 py-1.5 rounded-lg text-xs font-bold cursor-pointer whitespace-nowrap shrink-0 transition-colors ${
              selectedSound === 'all'
                ? 'bg-blue-100 text-blue-700'
                : 'text-slate-600 hover:text-blue-700'
            }`}
          >
            Any Sound
          </button>
          {soundOptions.map((s) => (
            <button
              key={s}
              onClick={() => setSelectedSound(s)}
              className={`px-3 py-1.5 rounded-lg text-xs font-bold cursor-pointer whitespace-nowrap shrink-0 transition-colors ${
                selectedSound === s
                  ? 'bg-blue-100 text-blue-700'
                  : 'text-slate-600 hover:text-blue-700'
              }`}
            >
              {s}
            </button>
          ))}
        </div>
      </div>

      {/* Results Count & Active Filters Indicator */}
      <div className="flex flex-col xs:flex-row items-start xs:items-center justify-between gap-2 text-xs text-slate-500 mb-6 px-1">
        <span>
          Showing <strong className="text-slate-900">{filteredProducts.length}</strong> items available at our counter
        </span>
        {(selectedCategory !== 'all' || selectedSound !== 'all' || searchQuery || greenCrackerOnly) && (
          <button
            onClick={() => {
              setSelectedCategory('all');
              setSelectedSound('all');
              setSearchQuery('');
              setGreenCrackerOnly(false);
            }}
            className="text-blue-600 font-bold hover:underline cursor-pointer"
          >
            Reset Filters
          </button>
        )}
      </div>

      {/* Products Grid */}
      {filteredProducts.length > 0 ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
          {filteredProducts.map((product) => (
            <ProductCard
              key={product.id}
              product={product}
              onSelect={onSelectProduct}
              onInquire={onInquireProduct}
            />
          ))}
        </div>
      ) : (
        /* Empty State */
        <div className="text-center py-12 sm:py-16 px-4 bg-white rounded-3xl border border-slate-200 shadow-sm">
          <div className="w-14 h-14 sm:w-16 sm:h-16 rounded-full bg-blue-50 flex items-center justify-center mx-auto mb-4 text-blue-600">
            <SlidersHorizontal className="w-6 h-6 sm:w-8 sm:h-8" />
          </div>
          <h3 className="text-base sm:text-lg font-bold text-slate-900 mb-2">No Fireworks Match Your Filter</h3>
          <p className="text-xs text-slate-500 max-w-md mx-auto mb-6">
            Try adjusting your search terms, sound level preference, or select &quot;All Categories&quot; to see our complete in-stock assortment.
          </p>
          <button
            onClick={() => {
              setSelectedCategory('all');
              setSelectedSound('all');
              setSearchQuery('');
              setGreenCrackerOnly(false);
            }}
            className="px-5 py-2.5 rounded-xl bg-blue-600 text-white font-bold text-xs cursor-pointer shadow-md shadow-blue-500/20 hover:bg-blue-700 transition-colors"
          >
            Show All Products
          </button>
        </div>
      )}
    </section>
  );
}

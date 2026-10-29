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
        const matchesDesc = p.description.toLowerCase().includes(query);
        const matchesCat = p.categoryName.toLowerCase().includes(query);
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
        <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-amber-500/10 border border-amber-500/30 text-amber-300 text-xs font-semibold mb-3">
          <Sparkles className="w-3.5 h-3.5" />
          <span>Transparent Retail Price Guide</span>
        </div>
        <h2 className="text-2xl xs:text-3xl sm:text-4xl font-extrabold text-white tracking-tight mb-2 sm:mb-3">
          Explore Our Festive Catalogue
        </h2>
        <p className="text-xs sm:text-sm text-slate-400">
          Browse authentic fireworks manufactured in Sivakasi. Filter by category, sound level, or certified green crackers.
        </p>
      </div>

      {/* Search and Filters Bar */}
      <div className="bg-slate-900/80 border border-slate-800 rounded-2xl p-3.5 sm:p-6 mb-6 sm:mb-8 space-y-3 sm:space-y-4">
        {/* Search & Sort row */}
        <div className="flex flex-col sm:flex-row gap-3 items-stretch sm:items-center justify-between">
          <div className="relative w-full sm:max-w-md">
            <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search sparkler, anar, sky shot..."
              className="w-full bg-slate-950 border border-slate-800 rounded-xl pl-10 pr-10 py-2.5 text-xs sm:text-sm text-white placeholder-slate-500 focus:outline-none focus:border-amber-500 transition-colors"
            />
            {searchQuery && (
              <button
                onClick={() => setSearchQuery('')}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-white"
              >
                <X className="w-4 h-4" />
              </button>
            )}
          </div>

          <div className="flex items-center justify-between sm:justify-end gap-2 sm:gap-3 w-full sm:w-auto">
            {/* Sort selector */}
            <div className="flex items-center gap-1.5 sm:gap-2 text-xs text-slate-400 flex-1 sm:flex-none">
              <span className="shrink-0 hidden xs:inline">Sort:</span>
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value as any)}
                className="w-full sm:w-auto bg-slate-950 border border-slate-800 rounded-xl px-2.5 sm:px-3 py-2 text-xs text-slate-200 focus:outline-none focus:border-amber-500"
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
              className={`shrink-0 px-3 py-2 rounded-xl text-xs font-semibold border transition-all cursor-pointer ${
                greenCrackerOnly
                  ? 'bg-emerald-950 border-emerald-500 text-emerald-300'
                  : 'bg-slate-950 border-slate-800 text-slate-400 hover:text-white'
              }`}
            >
              🌿 Green Only
            </button>
          </div>
        </div>

        {/* Category Filter Pills (Touch scroll enabled) */}
        <div className="flex items-center gap-1.5 sm:gap-2 overflow-x-auto pb-2 pt-2 border-t border-slate-800/80 touch-scroll scrollbar-none">
          <button
            onClick={() => setSelectedCategory('all')}
            className={`px-3.5 sm:px-4 py-1.5 rounded-full text-xs font-semibold whitespace-nowrap transition-all cursor-pointer shrink-0 ${
              selectedCategory === 'all'
                ? 'bg-amber-500 text-slate-950 shadow-md shadow-amber-500/20'
                : 'bg-slate-950 text-slate-400 border border-slate-800 hover:border-slate-700 hover:text-white'
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
                className={`px-3.5 sm:px-4 py-1.5 rounded-full text-xs font-semibold whitespace-nowrap transition-all cursor-pointer shrink-0 ${
                  isSelected
                    ? 'bg-amber-500 text-slate-950 shadow-md shadow-amber-500/20'
                    : 'bg-slate-950 text-slate-400 border border-slate-800 hover:border-slate-700 hover:text-white'
                }`}
              >
                {cat.name} ({count})
              </button>
            );
          })}
        </div>

        {/* Sound Level Filter Pills */}
        <div className="flex items-center gap-1.5 sm:gap-2 overflow-x-auto pb-1 text-xs text-slate-400 touch-scroll scrollbar-none">
          <span className="shrink-0 text-slate-500 hidden sm:inline">Sound:</span>
          <button
            onClick={() => setSelectedSound('all')}
            className={`px-2.5 py-1 rounded-lg text-xs cursor-pointer whitespace-nowrap shrink-0 ${
              selectedSound === 'all'
                ? 'bg-slate-800 text-amber-400 font-bold'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            Any Sound
          </button>
          {soundOptions.map((s) => (
            <button
              key={s}
              onClick={() => setSelectedSound(s)}
              className={`px-2.5 py-1 rounded-lg text-xs cursor-pointer whitespace-nowrap shrink-0 ${
                selectedSound === s
                  ? 'bg-slate-800 text-amber-400 font-bold'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              {s}
            </button>
          ))}
        </div>
      </div>

      {/* Results Count & Active Filters Indicator */}
      <div className="flex flex-col xs:flex-row items-start xs:items-center justify-between gap-2 text-xs text-slate-400 mb-6 px-1">
        <span>
          Showing <strong>{filteredProducts.length}</strong> items available at our counter
        </span>
        {(selectedCategory !== 'all' || selectedSound !== 'all' || searchQuery || greenCrackerOnly) && (
          <button
            onClick={() => {
              setSelectedCategory('all');
              setSelectedSound('all');
              setSearchQuery('');
              setGreenCrackerOnly(false);
            }}
            className="text-amber-400 hover:underline cursor-pointer"
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
        <div className="text-center py-12 sm:py-16 px-4 bg-slate-900/50 rounded-3xl border border-slate-800">
          <div className="w-14 h-14 sm:w-16 sm:h-16 rounded-full bg-slate-800/80 flex items-center justify-center mx-auto mb-4 text-slate-400">
            <SlidersHorizontal className="w-6 h-6 sm:w-8 sm:h-8" />
          </div>
          <h3 className="text-base sm:text-lg font-bold text-white mb-2">No Fireworks Match Your Filter</h3>
          <p className="text-xs text-slate-400 max-w-md mx-auto mb-6">
            Try adjusting your search terms, sound level preference, or select &quot;All Categories&quot; to see our complete in-stock assortment.
          </p>
          <button
            onClick={() => {
              setSelectedCategory('all');
              setSelectedSound('all');
              setSearchQuery('');
              setGreenCrackerOnly(false);
            }}
            className="px-5 py-2.5 rounded-xl bg-amber-500 text-slate-950 font-bold text-xs cursor-pointer"
          >
            Show All Products
          </button>
        </div>
      )}
    </section>
  );
}

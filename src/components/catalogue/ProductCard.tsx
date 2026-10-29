'use client';

import React from 'react';
import Image from 'next/image';
import { ShieldCheck, Volume2, Clock, Sparkles, AlertCircle, Eye, ShoppingCart, Zap, Calendar } from 'lucide-react';
import { Product } from '@/types';
import { useCart } from '@/components/cart/CartContext';
import { useRouter } from 'next/navigation';

interface ProductCardProps {
  product: Product;
  onSelect: (product: Product) => void;
  onInquire: (product: Product) => void;
}

export function ProductCard({ product, onSelect, onInquire }: ProductCardProps) {
  const { addItem } = useCart();
  const router = useRouter();
  const isOutOfStock = product.stockQuantity <= 0;
  const isLowStock = product.stockQuantity > 0 && product.stockQuantity <= 15;

  return (
    <div className="group rounded-2xl bg-slate-900/80 border border-slate-800 hover:border-amber-500/40 transition-all duration-300 flex flex-col overflow-hidden hover:shadow-xl hover:shadow-amber-500/10">
      {/* Product Image & Badges */}
      <div className="relative h-48 sm:h-52 w-full overflow-hidden bg-slate-950">
        {(() => {
          const isExternal = product.imageUrl && product.imageUrl.startsWith('http');
          const isAbsoluteLocal = product.imageUrl && product.imageUrl.startsWith('/');
          const src = isExternal || isAbsoluteLocal ? product.imageUrl : product.imageUrl ? `/images/${product.imageUrl}` : '';
          return src ? (
            <Image
              src={src}
              alt={product.name}
              fill
              sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
              className="object-cover group-hover:scale-105 transition-transform duration-500 opacity-90 group-hover:opacity-100"
            />
          ) : (
            <div className="flex items-center justify-center h-full bg-slate-900 text-slate-500 text-xs">
              Seasonal Firework Image
            </div>
          );
        })()}
        <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-950/20 to-transparent" />

        {/* Top Badges */}
        <div className="absolute top-2.5 left-2.5 right-2.5 flex flex-wrap gap-1.5 z-10">
          {product.isGreenCracker && (
            <span className="inline-flex items-center gap-1 bg-emerald-950/90 border border-emerald-500/40 text-emerald-300 text-[10px] sm:text-xs px-2 sm:px-2.5 py-0.5 sm:py-1 rounded-full font-semibold backdrop-blur-md">
              <ShieldCheck className="w-3 h-3 text-emerald-400" />
              <span>Green Cracker</span>
            </span>
          )}
          {product.featured && (
            <span className="inline-flex items-center gap-1 bg-amber-950/90 border border-amber-500/40 text-amber-300 text-[10px] sm:text-xs px-2 sm:px-2.5 py-0.5 sm:py-1 rounded-full font-semibold backdrop-blur-md">
              <Sparkles className="w-3 h-3 text-amber-400" />
              <span>Festive Top Pick</span>
            </span>
          )}
        </div>

        {/* Stock Badge */}
        <div className="absolute bottom-2.5 right-2.5 z-10">
          {isOutOfStock ? (
            <span className="bg-rose-950/90 border border-rose-500/40 text-rose-300 text-[10px] sm:text-xs px-2 py-0.5 rounded-full font-semibold">
              Sold Out
            </span>
          ) : isLowStock ? (
            <span className="bg-amber-950/90 border border-amber-500/40 text-amber-300 text-[10px] sm:text-xs px-2 py-0.5 rounded-full font-semibold flex items-center gap-1">
              <AlertCircle className="w-3 h-3 text-amber-400" />
              <span>{product.stockQuantity} Left</span>
            </span>
          ) : (
            <span className="bg-slate-900/90 border border-emerald-500/30 text-emerald-300 text-[10px] sm:text-xs px-2 py-0.5 rounded-md font-medium">
              In Stock
            </span>
          )}
        </div>
      </div>

      {/* Card Body */}
      <div className="p-4 sm:p-5 flex-1 flex flex-col justify-between space-y-4">
        <div>
          {/* Category */}
          <span className="text-[11px] font-semibold uppercase tracking-wider text-amber-400/90 block mb-1">
            {product.categoryName}
          </span>

          {/* Product Title */}
          <h3 className="text-base sm:text-lg font-bold text-white group-hover:text-amber-300 transition-colors line-clamp-1 mb-1.5">
            {product.name}
          </h3>

          {/* Description snippet */}
          <p className="text-xs text-slate-400 line-clamp-2 leading-relaxed mb-3">
            {product.description}
          </p>

          {/* Spec Tags */}
          <div className="flex flex-wrap items-center gap-1.5 text-[11px] text-slate-300">
            <span className="inline-flex items-center gap-1 bg-slate-800/80 px-2 py-0.5 rounded-md border border-slate-700/60">
              <Volume2 className="w-3 h-3 text-amber-400 shrink-0" />
              <span className="truncate max-w-[130px]">{product.soundLevel}</span>
            </span>

            {product.durationSeconds ? (
              <span className="inline-flex items-center gap-1 bg-slate-800/80 px-2 py-0.5 rounded-md border border-slate-700/60">
                <Clock className="w-3 h-3 text-sky-400 shrink-0" />
                <span>~{product.durationSeconds}s</span>
              </span>
            ) : null}

            <span className="bg-slate-800/80 px-2 py-0.5 rounded-md border border-slate-700/60">
              {product.piecesPerPack} {product.piecesPerPack === 1 ? 'Piece' : 'Pcs'}
            </span>
          </div>
        </div>

        {/* Pricing & Responsive Action Controls */}
        <div className="pt-3 border-t border-slate-800/80 space-y-3">
          {/* Price & Inspect row */}
          <div className="flex items-center justify-between">
            <div>
              <span className="text-[10px] text-slate-400 block uppercase tracking-wider font-semibold">
                Retail Counter Rate
              </span>
              <span className="text-xl sm:text-2xl font-extrabold text-amber-400 leading-none">
                ₹{product.retailPrice.toLocaleString('en-IN')}
              </span>
            </div>

            <button
              onClick={() => onSelect(product)}
              className="inline-flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white border border-slate-700 text-xs transition-colors cursor-pointer"
              title="Inspect Details & Safety Specs"
            >
              <Eye className="w-3.5 h-3.5" />
              <span className="text-[11px] font-medium hidden xs:inline">Details</span>
            </button>
          </div>

          {/* Action Buttons Grid */}
          <div className="grid grid-cols-2 gap-2">
            {/* Add to Cart */}
            <button
              onClick={() => addItem(product, 1)}
              disabled={isOutOfStock}
              className={`py-2 px-2.5 rounded-xl border text-xs font-semibold flex items-center justify-center gap-1.5 transition-all cursor-pointer ${
                isOutOfStock
                  ? 'bg-rose-950/20 border-rose-800/40 text-rose-500 cursor-not-allowed'
                  : 'bg-slate-800/90 hover:bg-slate-700 border-slate-700 text-slate-200 hover:text-white'
              }`}
            >
              <ShoppingCart className="w-3.5 h-3.5 text-amber-400 shrink-0" />
              <span className="truncate">{isOutOfStock ? 'Sold Out' : 'Add to Cart'}</span>
            </button>

            {/* Buy Now */}
            <button
              onClick={() => {
                if (!isOutOfStock) {
                  addItem(product, 1);
                  router.push('/checkout');
                }
              }}
              disabled={isOutOfStock}
              className={`py-2 px-2.5 rounded-xl border text-xs font-bold flex items-center justify-center gap-1.5 transition-all cursor-pointer ${
                isOutOfStock
                  ? 'bg-rose-950/20 border-rose-800/40 text-rose-500 cursor-not-allowed'
                  : 'bg-emerald-600 hover:bg-emerald-500 text-white border-emerald-500/50 shadow-sm'
              }`}
            >
              <Zap className="w-3.5 h-3.5 text-amber-300 shrink-0" />
              <span className="truncate">Buy Now</span>
            </button>
          </div>

          {/* Pre-book / Quote Button (Full Width) */}
          <button
            onClick={() => onInquire(product)}
            className="w-full py-2 px-3 rounded-xl bg-amber-500/10 hover:bg-amber-500 text-amber-300 hover:text-slate-950 border border-amber-500/30 text-xs font-bold transition-all flex items-center justify-center gap-1.5 cursor-pointer"
          >
            <Calendar className="w-3.5 h-3.5 shrink-0" />
            <span>Festive Quote & Pre-Book</span>
          </button>
        </div>
      </div>
    </div>
  );
}

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
    <div className="group rounded-2xl bg-white border border-slate-200 hover:border-blue-400 transition-all duration-300 flex flex-col overflow-hidden shadow-xs hover:shadow-xl hover:shadow-blue-500/10">
      {/* Product Image & Badges */}
      <div className="relative h-48 sm:h-52 w-full overflow-hidden bg-slate-100">
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
              className="object-cover group-hover:scale-105 transition-transform duration-500"
            />
          ) : (
            <div className="flex items-center justify-center h-full bg-slate-100 text-slate-400 text-xs">
              Seasonal Firework Image
            </div>
          );
        })()}
        <div className="absolute inset-0 bg-gradient-to-t from-slate-900/40 via-transparent to-transparent" />

        {/* Top Badges */}
        <div className="absolute top-2.5 left-2.5 right-2.5 flex flex-wrap gap-1.5 z-10">
          {product.isGreenCracker && (
            <span className="inline-flex items-center gap-1 bg-white/95 border border-emerald-200 text-emerald-700 text-[10px] sm:text-xs px-2.5 py-0.5 rounded-full font-bold shadow-xs">
              <ShieldCheck className="w-3 h-3 text-emerald-600" />
              <span>Green Cracker</span>
            </span>
          )}
          {product.featured && (
            <span className="inline-flex items-center gap-1 bg-blue-600 text-white text-[10px] sm:text-xs px-2.5 py-0.5 rounded-full font-bold shadow-xs">
              <Sparkles className="w-3 h-3 text-white" />
              <span>Top Pick</span>
            </span>
          )}
        </div>

        {/* Stock Badge */}
        <div className="absolute bottom-2.5 right-2.5 z-10">
          {isOutOfStock ? (
            <span className="bg-rose-600 text-white text-[10px] sm:text-xs px-2 py-0.5 rounded-full font-bold shadow-xs">
              Sold Out
            </span>
          ) : isLowStock ? (
            <span className="bg-amber-500 text-slate-950 text-[10px] sm:text-xs px-2 py-0.5 rounded-full font-bold shadow-xs flex items-center gap-1">
              <AlertCircle className="w-3 h-3 text-slate-950" />
              <span>{product.stockQuantity} Left</span>
            </span>
          ) : (
            <span className="bg-emerald-600 text-white text-[10px] sm:text-xs px-2 py-0.5 rounded-md font-bold shadow-xs">
              In Stock
            </span>
          )}
        </div>
      </div>

      {/* Card Body */}
      <div className="p-4 sm:p-5 flex-1 flex flex-col justify-between space-y-4">
        <div>
          {/* Category */}
          <span className="text-[11px] font-bold uppercase tracking-wider text-blue-600 block mb-1">
            {product.categoryName}
          </span>

          {/* Product Title */}
          <h3 className="text-base sm:text-lg font-bold text-slate-900 group-hover:text-blue-600 transition-colors line-clamp-1 mb-1.5">
            {product.name}
          </h3>

          {/* Description snippet */}
          <p className="text-xs text-slate-500 line-clamp-2 leading-relaxed mb-3">
            {product.description}
          </p>

          {/* Spec Tags */}
          <div className="flex flex-wrap items-center gap-1.5 text-[11px] text-slate-600">
            <span className="inline-flex items-center gap-1 bg-slate-100 px-2 py-0.5 rounded-md border border-slate-200">
              <Volume2 className="w-3 h-3 text-blue-600 shrink-0" />
              <span className="truncate max-w-[130px]">{product.soundLevel}</span>
            </span>

            {product.durationSeconds ? (
              <span className="inline-flex items-center gap-1 bg-slate-100 px-2 py-0.5 rounded-md border border-slate-200">
                <Clock className="w-3 h-3 text-sky-600 shrink-0" />
                <span>~{product.durationSeconds}s</span>
              </span>
            ) : null}

            <span className="bg-slate-100 px-2 py-0.5 rounded-md border border-slate-200 font-medium">
              {product.piecesPerPack} {product.piecesPerPack === 1 ? 'Piece' : 'Pcs'}
            </span>
          </div>
        </div>

        {/* Pricing & Responsive Action Controls */}
        <div className="pt-3 border-t border-slate-100 space-y-3">
          {/* Price & Inspect row */}
          <div className="flex items-center justify-between">
            <div>
              <span className="text-[10px] text-slate-400 block uppercase tracking-wider font-bold">
                Retail Counter Rate
              </span>
              <span className="text-xl sm:text-2xl font-black text-blue-600 leading-none">
                ₹{product.retailPrice.toLocaleString('en-IN')}
              </span>
            </div>

            <button
              onClick={() => onSelect(product)}
              className="inline-flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg bg-slate-100 hover:bg-blue-50 text-slate-700 hover:text-blue-700 border border-slate-200 text-xs transition-colors cursor-pointer"
              title="Inspect Details & Safety Specs"
            >
              <Eye className="w-3.5 h-3.5" />
              <span className="text-[11px] font-semibold hidden xs:inline">Details</span>
            </button>
          </div>

          {/* Action Buttons Grid */}
          <div className="grid grid-cols-2 gap-2">
            {/* Add to Cart */}
            <button
              onClick={() => addItem(product, 1)}
              disabled={isOutOfStock}
              className={`py-2 px-2.5 rounded-xl border text-xs font-bold flex items-center justify-center gap-1.5 transition-all cursor-pointer ${
                isOutOfStock
                  ? 'bg-slate-100 border-slate-200 text-slate-400 cursor-not-allowed'
                  : 'bg-blue-50 hover:bg-blue-100 border-blue-200 text-blue-700'
              }`}
            >
              <ShoppingCart className="w-3.5 h-3.5 text-blue-600 shrink-0" />
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
              className={`py-2 px-2.5 rounded-xl text-xs font-bold flex items-center justify-center gap-1.5 transition-all cursor-pointer ${
                isOutOfStock
                  ? 'bg-slate-100 text-slate-400 cursor-not-allowed'
                  : 'bg-blue-600 hover:bg-blue-700 text-white shadow-xs'
              }`}
            >
              <Zap className="w-3.5 h-3.5 text-amber-300 shrink-0" />
              <span className="truncate">Buy Now</span>
            </button>
          </div>

          {/* Pre-book / Quote Button (Full Width) */}
          <button
            onClick={() => onInquire(product)}
            className="w-full py-2 px-3 rounded-xl bg-slate-50 hover:bg-blue-600 text-blue-700 hover:text-white border border-blue-200 hover:border-blue-600 text-xs font-bold transition-all flex items-center justify-center gap-1.5 cursor-pointer"
          >
            <Calendar className="w-3.5 h-3.5 shrink-0" />
            <span>Festive Quote & Pre-Book</span>
          </button>
        </div>
      </div>
    </div>
  );
}

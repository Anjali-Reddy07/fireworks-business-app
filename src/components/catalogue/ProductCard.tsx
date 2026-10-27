import React from 'react';
import Image from 'next/image';
import { ShieldCheck, Volume2, Clock, Sparkles, AlertCircle, Eye } from 'lucide-react';
import { Product } from '@/types';

interface ProductCardProps {
  product: Product;
  onSelect: (product: Product) => void;
  onInquire: (product: Product) => void;
}

export function ProductCard({ product, onSelect, onInquire }: ProductCardProps) {
  const isOutOfStock = product.stockQuantity <= 0;
  const isLowStock = product.stockQuantity > 0 && product.stockQuantity <= 15;

  return (
    <div className="group rounded-2xl bg-slate-900/80 border border-slate-800 hover:border-amber-500/40 transition-all duration-300 flex flex-col overflow-hidden hover:shadow-xl hover:shadow-amber-500/10">
      {/* Product Image & Badges */}
      <div className="relative h-52 w-full overflow-hidden bg-slate-950">
        <Image
          src={product.imageUrl}
          alt={product.name}
          fill
          sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
          className="object-cover group-hover:scale-105 transition-transform duration-500 opacity-90 group-hover:opacity-100"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-950/20 to-transparent" />

        {/* Top Badges */}
        <div className="absolute top-3 left-3 flex flex-wrap gap-1.5 z-10">
          {product.isGreenCracker && (
            <span className="inline-flex items-center gap-1 bg-emerald-950/90 border border-emerald-500/40 text-emerald-300 text-xs px-2.5 py-1 rounded-full font-semibold backdrop-blur-md">
              <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" />
              <span>Green Cracker</span>
            </span>
          )}
          {product.featured && (
            <span className="inline-flex items-center gap-1 bg-amber-950/90 border border-amber-500/40 text-amber-300 text-xs px-2.5 py-1 rounded-full font-semibold backdrop-blur-md">
              <Sparkles className="w-3.5 h-3.5 text-amber-400" />
              <span>Festive Top Pick</span>
            </span>
          )}
        </div>

        {/* Stock Badge */}
        <div className="absolute bottom-3 right-3 z-10">
          {isOutOfStock ? (
            <span className="bg-rose-950/90 border border-rose-500/40 text-rose-300 text-xs px-2.5 py-1 rounded-full font-semibold">
              Sold Out for Season
            </span>
          ) : isLowStock ? (
            <span className="bg-amber-950/90 border border-amber-500/40 text-amber-300 text-xs px-2.5 py-1 rounded-full font-semibold flex items-center gap-1">
              <AlertCircle className="w-3 h-3 text-amber-400" />
              <span>Few Boxes Left</span>
            </span>
          ) : (
            <span className="bg-slate-900/90 border border-emerald-500/30 text-emerald-300 text-xs px-2 py-0.5 rounded-md font-medium">
              In Stock at Store
            </span>
          )}
        </div>
      </div>

      {/* Card Body */}
      <div className="p-5 flex-1 flex flex-col justify-between">
        <div>
          {/* Category */}
          <span className="text-xs font-semibold uppercase tracking-wider text-amber-400/90 block mb-1.5">
            {product.categoryName}
          </span>

          {/* Product Title */}
          <h3 className="text-lg font-bold text-white group-hover:text-amber-300 transition-colors line-clamp-1 mb-2">
            {product.name}
          </h3>

          {/* Description snippet */}
          <p className="text-xs text-slate-400 line-clamp-2 leading-relaxed mb-4">
            {product.description}
          </p>

          {/* Spec Tags */}
          <div className="flex flex-wrap items-center gap-2 mb-4 text-xs text-slate-300">
            <span className="inline-flex items-center gap-1 bg-slate-800/80 px-2 py-1 rounded-md border border-slate-700/60">
              <Volume2 className="w-3.5 h-3.5 text-amber-400" />
              <span>{product.soundLevel}</span>
            </span>

            {product.durationSeconds ? (
              <span className="inline-flex items-center gap-1 bg-slate-800/80 px-2 py-1 rounded-md border border-slate-700/60">
                <Clock className="w-3.5 h-3.5 text-sky-400" />
                <span>~{product.durationSeconds}s duration</span>
              </span>
            ) : null}

            <span className="bg-slate-800/80 px-2 py-1 rounded-md border border-slate-700/60">
              {product.piecesPerPack} {product.piecesPerPack === 1 ? 'Piece' : 'Pcs / Box'}
            </span>
          </div>
        </div>

        {/* Price & Action */}
        <div className="pt-4 border-t border-slate-800 flex items-center justify-between gap-3">
          <div>
            <span className="text-xs text-slate-400 block">Retail Counter Rate</span>
            <span className="text-xl font-extrabold text-amber-400">
              ₹{product.retailPrice.toLocaleString('en-IN')}
            </span>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={() => onSelect(product)}
              className="p-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 hover:text-white border border-slate-700 transition-colors cursor-pointer"
              title="Inspect Details & Safety"
            >
              <Eye className="w-4 h-4" />
            </button>

            <button
              onClick={() => onInquire(product)}
              className="px-3.5 py-2 rounded-xl bg-amber-500/20 hover:bg-amber-500 text-amber-300 hover:text-slate-950 border border-amber-500/40 text-xs font-bold transition-all cursor-pointer"
            >
              Inquire
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

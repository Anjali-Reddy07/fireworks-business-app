'use client';

import React from 'react';
import Image from 'next/image';
import { X, ShieldCheck, AlertTriangle, Volume2, Clock, Check, Sparkles, MapPin } from 'lucide-react';
import { Product } from '@/types';

interface ProductDetailModalProps {
  product: Product | null;
  onClose: () => void;
  onInquire: (product: Product) => void;
}

export function ProductDetailModal({ product, onClose, onInquire }: ProductDetailModalProps) {
  if (!product) return null;

  return (
    <div 
      className="fixed inset-0 z-50 flex items-center justify-center p-2 sm:p-4 bg-slate-950/85 backdrop-blur-sm animate-in fade-in duration-200"
      onClick={onClose}
    >
      <div 
        className="relative w-full max-w-2xl bg-slate-900 border border-slate-800 rounded-2xl sm:rounded-3xl overflow-hidden shadow-2xl max-h-[92vh] sm:max-h-[90vh] flex flex-col"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header with Close */}
        <div className="flex items-center justify-between p-3.5 sm:p-4 border-b border-slate-800 bg-slate-950/80">
          <div className="flex items-center gap-2 flex-wrap">
            <span className="text-xs uppercase tracking-wider text-amber-400 font-semibold">
              {product.categoryName}
            </span>
            {product.isGreenCracker && (
              <span className="inline-flex items-center gap-1 text-[10px] sm:text-[11px] bg-emerald-950 text-emerald-400 border border-emerald-500/30 px-2 py-0.5 rounded-full">
                <ShieldCheck className="w-3 h-3" />
                <span>CSIR-NEERI Green Cracker</span>
              </span>
            )}
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-full text-slate-400 hover:text-white hover:bg-slate-800 transition-colors cursor-pointer shrink-0"
            aria-label="Close modal"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Scrollable Content */}
        <div className="overflow-y-auto p-4 sm:p-6 space-y-4 sm:space-y-6">
          {/* Image & Price Header */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-6 items-center">
            <div className="relative h-48 sm:h-56 rounded-2xl overflow-hidden bg-slate-950 border border-slate-800">
              {(() => {
                const isExternal = product.imageUrl && product.imageUrl.startsWith('http');
                const isAbsoluteLocal = product.imageUrl && product.imageUrl.startsWith('/');
                const src = isExternal || isAbsoluteLocal ? product.imageUrl : product.imageUrl ? `/images/${product.imageUrl}` : '';
                return src ? (
                  <Image
                    src={src}
                    alt={product.name}
                    fill
                    className="object-cover"
                  />
                ) : (
                  <div className="w-full h-full flex items-center justify-center text-slate-600 text-xs">
                    Festive Firework Preview
                  </div>
                );
              })()}
            </div>

            <div>
              <h2 className="text-xl sm:text-2xl font-bold text-white mb-2">{product.name}</h2>
              <div className="mb-4">
                <span className="text-xs text-slate-400 block">Retail Counter Price</span>
                <span className="text-2xl sm:text-3xl font-extrabold text-amber-400">
                  ₹{product.retailPrice.toLocaleString('en-IN')}
                </span>
                <span className="text-[11px] text-slate-400 block mt-0.5">
                  Includes all statutory taxes | Seasonal festive rates
                </span>
              </div>

              {/* Quick specs */}
              <div className="grid grid-cols-2 gap-2 text-xs">
                <div className="p-2 sm:p-2.5 rounded-lg bg-slate-800/80 border border-slate-700/60">
                  <span className="text-slate-400 block text-[11px]">Pack Size:</span>
                  <span className="font-semibold text-white">{product.piecesPerPack} Pieces</span>
                </div>
                <div className="p-2 sm:p-2.5 rounded-lg bg-slate-800/80 border border-slate-700/60">
                  <span className="text-slate-400 block text-[11px]">Sound Rating:</span>
                  <span className="font-semibold text-white truncate block">{product.soundLevel}</span>
                </div>
                {product.durationSeconds ? (
                  <div className="p-2 sm:p-2.5 rounded-lg bg-slate-800/80 border border-slate-700/60">
                    <span className="text-slate-400 block text-[11px]">Duration:</span>
                    <span className="font-semibold text-white">~{product.durationSeconds} Seconds</span>
                  </div>
                ) : null}
                <div className="p-2 sm:p-2.5 rounded-lg bg-slate-800/80 border border-slate-700/60">
                  <span className="text-slate-400 block text-[11px]">Current Stock:</span>
                  <span className="font-semibold text-emerald-400">
                    {product.stockQuantity > 0 ? `${product.stockQuantity} Boxes` : 'Out of Stock'}
                  </span>
                </div>
              </div>
            </div>
          </div>

          {/* Detailed Description */}
          <div>
            <h4 className="text-xs sm:text-sm font-bold text-slate-200 uppercase tracking-wider mb-1.5">
              Product Overview & Visual Effects
            </h4>
            <p className="text-xs sm:text-sm text-slate-300 leading-relaxed bg-slate-950/60 p-3 sm:p-4 rounded-xl border border-slate-800">
              {product.description}
            </p>
          </div>

          {/* Safety & Compliance Box */}
          <div className="p-3.5 sm:p-4 rounded-xl bg-amber-950/20 border border-amber-500/30 text-amber-200/90 space-y-2">
            <div className="flex items-center gap-2 font-bold text-amber-300 text-xs sm:text-sm">
              <AlertTriangle className="w-4 h-4 text-amber-400 shrink-0" />
              <span>Mandatory Safety Guidelines & Lighting Precautions</span>
            </div>
            <ul className="text-xs space-y-1.5 list-disc list-inside text-slate-300">
              <li>
                Maintain a minimum safe distance of <strong>{product.safetyDistanceMeters} meters</strong> after lighting the fuse.
              </li>
              <li>Always light outdoors in a wide open area away from flammable materials or overhead cables.</li>
              <li>Keep a bucket of clean water and sand readily accessible before igniting.</li>
              <li>Adult supervision is strictly mandatory for children under 16 years of age.</li>
              {product.greenCrackerCode && (
                <li className="text-emerald-300 font-semibold break-all">
                  CSIR-NEERI Green Cracker Tracking Code: <code>{product.greenCrackerCode}</code>
                </li>
              )}
            </ul>
          </div>
        </div>

        {/* Footer Actions */}
        <div className="p-3.5 sm:p-4 border-t border-slate-800 bg-slate-950/80 flex flex-col-reverse sm:flex-row items-stretch sm:items-center justify-between gap-3">
          <div className="flex items-center justify-center sm:justify-start gap-1.5 text-xs text-slate-400">
            <MapPin className="w-3.5 h-3.5 text-amber-400 shrink-0" />
            <span>Seasonal Festive Licensed Counter</span>
          </div>

          <div className="flex items-center gap-2 sm:gap-3 w-full sm:w-auto">
            <button
              onClick={onClose}
              className="flex-1 sm:flex-none px-4 py-2.5 rounded-xl border border-slate-800 text-xs sm:text-sm text-slate-400 hover:text-white hover:bg-slate-800 transition-colors cursor-pointer"
            >
              Close
            </button>
            <button
              onClick={() => {
                onClose();
                onInquire(product);
              }}
              className="flex-1 sm:flex-none px-5 py-2.5 rounded-xl bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-400 hover:to-amber-500 text-slate-950 font-bold text-xs sm:text-sm shadow-md shadow-amber-500/20 cursor-pointer text-center"
            >
              Request Festive Quote & Pre-Book
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

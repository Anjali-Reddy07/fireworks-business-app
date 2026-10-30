'use client';

import React from 'react';
import Image from 'next/image';
import { X, ShieldCheck, AlertTriangle, MapPin } from 'lucide-react';
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
      className="fixed inset-0 z-50 flex items-center justify-center p-2 sm:p-4 bg-slate-900/60 backdrop-blur-sm animate-in fade-in duration-200"
      onClick={onClose}
    >
      <div 
        className="relative w-full max-w-2xl bg-white border border-slate-200 rounded-2xl sm:rounded-3xl overflow-hidden shadow-2xl max-h-[92vh] sm:max-h-[90vh] flex flex-col"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header with Close */}
        <div className="flex items-center justify-between p-3.5 sm:p-4 border-b border-slate-100 bg-slate-50">
          <div className="flex items-center gap-2 flex-wrap">
            <span className="text-xs uppercase tracking-wider text-blue-600 font-bold">
              {product.categoryName}
            </span>
            {product.isGreenCracker && (
              <span className="inline-flex items-center gap-1 text-[10px] sm:text-[11px] bg-emerald-50 text-emerald-700 border border-emerald-200 px-2 py-0.5 rounded-full font-semibold">
                <ShieldCheck className="w-3 h-3 text-emerald-600" />
                <span>CSIR-NEERI Green Cracker</span>
              </span>
            )}
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-full text-slate-400 hover:text-slate-700 hover:bg-slate-200/60 transition-colors cursor-pointer shrink-0"
            aria-label="Close modal"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Scrollable Content */}
        <div className="overflow-y-auto p-4 sm:p-6 space-y-4 sm:space-y-6">
          {/* Image & Price Header */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-6 items-center">
            <div className="relative h-48 sm:h-56 rounded-2xl overflow-hidden bg-slate-50 border border-slate-200">
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
                  <div className="w-full h-full flex items-center justify-center text-slate-400 text-xs">
                    Festive Firework Preview
                  </div>
                );
              })()}
            </div>

            <div>
              <h2 className="text-xl sm:text-2xl font-bold text-slate-900 mb-2">{product.name}</h2>
              <div className="mb-4">
                <span className="text-xs text-slate-500 block">Retail Counter Price</span>
                <span className="text-2xl sm:text-3xl font-extrabold text-blue-600">
                  ₹{product.retailPrice.toLocaleString('en-IN')}
                </span>
                <span className="text-[11px] text-slate-500 block mt-0.5">
                  Includes all statutory taxes | Seasonal festive rates
                </span>
              </div>

              {/* Quick specs */}
              <div className="grid grid-cols-2 gap-2 text-xs">
                <div className="p-2 sm:p-2.5 rounded-xl bg-slate-50 border border-slate-200">
                  <span className="text-slate-500 block text-[11px]">Pack Size:</span>
                  <span className="font-semibold text-slate-900">{product.piecesPerPack} Pieces</span>
                </div>
                <div className="p-2 sm:p-2.5 rounded-xl bg-slate-50 border border-slate-200">
                  <span className="text-slate-500 block text-[11px]">Sound Rating:</span>
                  <span className="font-semibold text-slate-900 truncate block">{product.soundLevel}</span>
                </div>
                {product.durationSeconds ? (
                  <div className="p-2 sm:p-2.5 rounded-xl bg-slate-50 border border-slate-200">
                    <span className="text-slate-500 block text-[11px]">Duration:</span>
                    <span className="font-semibold text-slate-900">~{product.durationSeconds} Seconds</span>
                  </div>
                ) : null}
                <div className="p-2 sm:p-2.5 rounded-xl bg-slate-50 border border-slate-200">
                  <span className="text-slate-500 block text-[11px]">Current Stock:</span>
                  <span className="font-semibold text-emerald-600">
                    {product.stockQuantity > 0 ? `${product.stockQuantity} Boxes` : 'Out of Stock'}
                  </span>
                </div>
              </div>
            </div>
          </div>

          {/* Detailed Description */}
          <div>
            <h4 className="text-xs sm:text-sm font-bold text-slate-800 uppercase tracking-wider mb-1.5">
              Product Overview & Visual Effects
            </h4>
            <p className="text-xs sm:text-sm text-slate-600 leading-relaxed bg-slate-50 p-3 sm:p-4 rounded-xl border border-slate-200">
              {product.description}
            </p>
          </div>

          {/* Safety & Compliance Box */}
          <div className="p-3.5 sm:p-4 rounded-xl bg-amber-50 border border-amber-200 text-amber-900 space-y-2">
            <div className="flex items-center gap-2 font-bold text-amber-800 text-xs sm:text-sm">
              <AlertTriangle className="w-4 h-4 text-amber-600 shrink-0" />
              <span>Mandatory Safety Guidelines & Lighting Precautions</span>
            </div>
            <ul className="text-xs space-y-1.5 list-disc list-inside text-slate-700">
              <li>
                Maintain a minimum safe distance of <strong>{product.safetyDistanceMeters} meters</strong> after lighting the fuse.
              </li>
              <li>Always light outdoors in a wide open area away from flammable materials or overhead cables.</li>
              <li>Keep a bucket of clean water and sand readily accessible before igniting.</li>
              <li>Adult supervision is strictly mandatory for children under 16 years of age.</li>
              {product.greenCrackerCode && (
                <li className="text-emerald-700 font-semibold break-all">
                  CSIR-NEERI Green Cracker Tracking Code: <code className="bg-emerald-100 px-1 py-0.5 rounded text-emerald-800">{product.greenCrackerCode}</code>
                </li>
              )}
            </ul>
          </div>
        </div>

        {/* Footer Actions */}
        <div className="p-3.5 sm:p-4 border-t border-slate-100 bg-slate-50 flex flex-col-reverse sm:flex-row items-stretch sm:items-center justify-between gap-3">
          <div className="flex items-center justify-center sm:justify-start gap-1.5 text-xs text-slate-600 font-medium">
            <MapPin className="w-3.5 h-3.5 text-blue-600 shrink-0" />
            <span>Seasonal Festive Licensed Counter</span>
          </div>

          <div className="flex items-center gap-2 sm:gap-3 w-full sm:w-auto">
            <button
              onClick={onClose}
              className="flex-1 sm:flex-none px-4 py-2.5 rounded-xl border border-slate-200 text-xs sm:text-sm text-slate-700 hover:text-slate-900 hover:bg-slate-100 transition-colors cursor-pointer font-medium"
            >
              Close
            </button>
            <button
              onClick={() => {
                onClose();
                onInquire(product);
              }}
              className="flex-1 sm:flex-none px-5 py-2.5 rounded-xl bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white font-bold text-xs sm:text-sm shadow-md shadow-blue-600/25 cursor-pointer text-center"
            >
              Request Festive Quote & Pre-Book
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

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
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-sm animate-in fade-in duration-200">
      <div 
        className="relative w-full max-w-2xl bg-slate-900 border border-slate-800 rounded-3xl overflow-hidden shadow-2xl max-h-[90vh] flex flex-col"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header with Close */}
        <div className="flex items-center justify-between p-4 border-b border-slate-800">
          <div className="flex items-center gap-2">
            <span className="text-xs uppercase tracking-wider text-amber-400 font-semibold">
              {product.categoryName}
            </span>
            {product.isGreenCracker && (
              <span className="inline-flex items-center gap-1 text-[11px] bg-emerald-950 text-emerald-400 border border-emerald-500/30 px-2 py-0.5 rounded-full">
                <ShieldCheck className="w-3 h-3" />
                <span>CSIR-NEERI Green Cracker</span>
              </span>
            )}
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-full text-slate-400 hover:text-white hover:bg-slate-800 transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Scrollable Content */}
        <div className="overflow-y-auto p-6 space-y-6">
          {/* Image & Price Header */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 items-center">
            <div className="relative h-56 rounded-2xl overflow-hidden bg-slate-950 border border-slate-800">
              <Image
                src={product.imageUrl}
                alt={product.name}
                fill
                className="object-cover"
              />
            </div>

            <div>
              <h2 className="text-2xl font-bold text-white mb-2">{product.name}</h2>
              <div className="mb-4">
                <span className="text-xs text-slate-400 block">Retail Counter Price</span>
                <span className="text-3xl font-extrabold text-amber-400">
                  ₹{product.retailPrice.toLocaleString('en-IN')}
                </span>
                <span className="text-xs text-slate-400 block mt-1">
                  Includes all statutory taxes | Sold exclusively in-store
                </span>
              </div>

              {/* Quick specs */}
              <div className="grid grid-cols-2 gap-2 text-xs">
                <div className="p-2.5 rounded-lg bg-slate-800/80 border border-slate-700/60">
                  <span className="text-slate-400 block">Pack Size:</span>
                  <span className="font-semibold text-white">{product.piecesPerPack} Pieces</span>
                </div>
                <div className="p-2.5 rounded-lg bg-slate-800/80 border border-slate-700/60">
                  <span className="text-slate-400 block">Sound Rating:</span>
                  <span className="font-semibold text-white">{product.soundLevel}</span>
                </div>
                {product.durationSeconds ? (
                  <div className="p-2.5 rounded-lg bg-slate-800/80 border border-slate-700/60">
                    <span className="text-slate-400 block">Duration:</span>
                    <span className="font-semibold text-white">~{product.durationSeconds} Seconds</span>
                  </div>
                ) : null}
                <div className="p-2.5 rounded-lg bg-slate-800/80 border border-slate-700/60">
                  <span className="text-slate-400 block">Current Stock:</span>
                  <span className="font-semibold text-emerald-400">
                    {product.stockQuantity > 0 ? `${product.stockQuantity} Boxes Available` : 'Out of Stock'}
                  </span>
                </div>
              </div>
            </div>
          </div>

          {/* Detailed Description */}
          <div>
            <h4 className="text-sm font-bold text-slate-200 uppercase tracking-wider mb-2">
              Product Overview & Visual Effects
            </h4>
            <p className="text-sm text-slate-300 leading-relaxed bg-slate-950/60 p-4 rounded-xl border border-slate-800">
              {product.description}
            </p>
          </div>

          {/* Safety & Compliance Box */}
          <div className="p-4 rounded-xl bg-amber-950/20 border border-amber-500/30 text-amber-200/90 space-y-2">
            <div className="flex items-center gap-2 font-bold text-amber-300 text-sm">
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
                <li className="text-emerald-300 font-semibold">
                  CSIR-NEERI Green Cracker Tracking Code: <code>{product.greenCrackerCode}</code>
                </li>
              )}
            </ul>
          </div>
        </div>

        {/* Footer Actions */}
        <div className="p-4 border-t border-slate-800 bg-slate-950/80 flex items-center justify-between gap-4">
          <div className="flex items-center gap-2 text-xs text-slate-400">
            <MapPin className="w-4 h-4 text-amber-400 shrink-0" />
            <span>Handover available at retail store</span>
          </div>

          <div className="flex items-center gap-3">
            <button
              onClick={onClose}
              className="px-4 py-2 text-sm text-slate-400 hover:text-white transition-colors cursor-pointer"
            >
              Close
            </button>
            <button
              onClick={() => {
                onClose();
                onInquire(product);
              }}
              className="px-5 py-2.5 rounded-xl bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-400 hover:to-amber-500 text-slate-950 font-bold text-sm shadow-md shadow-amber-500/20 cursor-pointer"
            >
              Inquire Availability / Reserve
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

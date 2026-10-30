'use client';

import React, { useState, useEffect } from 'react';
import { Navbar } from '@/components/layout/Navbar';
import { Footer } from '@/components/layout/Footer';
import { Hero } from '@/components/home/Hero';
import { SafetyGuide } from '@/components/home/SafetyGuide';
import { StoreLocator } from '@/components/home/StoreLocator';
import { ProductGrid } from '@/components/catalogue/ProductGrid';
import { ProductDetailModal } from '@/components/catalogue/ProductDetailModal';
import { InquiryModal } from '@/components/inquiry/InquiryModal';
import { INITIAL_CATEGORIES, INITIAL_PRODUCTS } from '@/lib/data/sample-products';
import { Product } from '@/types';
import { collection, getDocs } from 'firebase/firestore';
import { db } from '@/lib/firebase';

export default function HomePage() {
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
  const [inquiryProduct, setInquiryProduct] = useState<Product | null>(null);
  const [isInquiryOpen, setIsInquiryOpen] = useState(false);
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Fetch products from Firestore with fallback to sample products
  useEffect(() => {
    const fetchProducts = async () => {
      try {
        let fetched: Product[] = [];
        const snapshot1 = await getDocs(collection(db, 'fireworks'));
        if (!snapshot1.empty) {
          fetched = snapshot1.docs.map(doc => ({ id: doc.id, ...doc.data() } as Product));
        }

        const snapshot2 = await getDocs(collection(db, 'products'));
        if (!snapshot2.empty) {
          const extra = snapshot2.docs.map(doc => ({ id: doc.id, ...doc.data() } as Product));
          const seen = new Set(fetched.map(p => p.id));
          for (const p of extra) {
            if (!seen.has(p.id)) fetched.push(p);
          }
        }

        setProducts(fetched.length > 0 ? fetched : INITIAL_PRODUCTS);
        setLoading(false);
      } catch (err) {
        console.error('Error fetching products from Firestore:', err);
        setError('Notice: Loaded offline catalogue.');
        setProducts(INITIAL_PRODUCTS);
        setLoading(false);
      }
    };
    fetchProducts();
  }, []);

  const handleOpenGeneralInquiry = () => {
    setInquiryProduct(null);
    setIsInquiryOpen(true);
  };

  const handleOpenProductInquiry = (product: Product) => {
    setInquiryProduct(product);
    setIsInquiryOpen(true);
  };

  return (
    <div className="flex-1 flex flex-col">
      {/* Navigation */}
      <Navbar onOpenInquiry={handleOpenGeneralInquiry} />

      <main className="flex-1">
        {/* Hero Section */}
        <Hero onOpenInquiry={handleOpenGeneralInquiry} />

        {/* Product Catalogue Grid */}
        {loading ? (
            <div className="text-center py-8 text-slate-400">Loading products...</div>
          ) : error ? (
            <div className="text-center py-8 text-rose-500">{error}</div>
          ) : (
            <ProductGrid
              products={products}
              categories={INITIAL_CATEGORIES}
              onSelectProduct={(p) => setSelectedProduct(p)}
              onInquireProduct={handleOpenProductInquiry}
            />
          )}

        {/* Green Crackers & Safety Guide */}
        <SafetyGuide />

        {/* Seasonal Festive Outlet & Direct Contact */}
        <StoreLocator />
      </main>

      {/* Footer */}
      <Footer />

      {/* Product Detail Modal */}
      <ProductDetailModal
        product={selectedProduct}
        onClose={() => setSelectedProduct(null)}
        onInquire={handleOpenProductInquiry}
      />

      {/* Festive Pre-Booking & Quotation Modal */}
      <InquiryModal
        isOpen={isInquiryOpen}
        onClose={() => setIsInquiryOpen(false)}
        preselectedProduct={inquiryProduct}
      />
    </div>
  );
}

'use client';

import React, { useState } from 'react';
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

export default function HomePage() {
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
  const [inquiryProduct, setInquiryProduct] = useState<Product | null>(null);
  const [isInquiryOpen, setIsInquiryOpen] = useState(false);

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
        <ProductGrid
          products={INITIAL_PRODUCTS}
          categories={INITIAL_CATEGORIES}
          onSelectProduct={(p) => setSelectedProduct(p)}
          onInquireProduct={handleOpenProductInquiry}
        />

        {/* Green Crackers & Safety Guide */}
        <SafetyGuide />

        {/* Physical Store Locator & Operating Timings */}
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

      {/* Store Visit & Stock Inquiry Booking Modal */}
      <InquiryModal
        isOpen={isInquiryOpen}
        onClose={() => setIsInquiryOpen(false)}
        preselectedProduct={inquiryProduct}
      />
    </div>
  );
}

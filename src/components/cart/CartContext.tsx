"use client";
import React, { createContext, useContext, useState, ReactNode } from 'react';
import { Product } from '@/types';

export interface CartItem {
  product: Product;
  quantity: number;
}

interface CartContextProps {
  items: CartItem[];
  addItem: (product: Product, quantity?: number) => void;
  removeItem: (productId: string) => void;
  updateQuantity: (productId: string, quantity: number) => void;
  clearCart: () => void;
  total: number;
}

const CartContext = createContext<CartContextProps | undefined>(undefined);

export function CartProvider({ children }: { children: ReactNode }) {
  const [items, setItems] = useState<CartItem[]>([]);

  const addItem = (product: Product, quantity: number = 1) => {
    setItems(prev => {
      const existing = prev.find(it => it.product.id === product.id);
      if (existing) {
        return prev.map(it =>
          it.product.id === product.id ? { ...it, quantity: it.quantity + quantity } : it
        );
      }
      return [...prev, { product, quantity }];
    });
  };

  const removeItem = (productId: string) => {
    setItems(prev => prev.filter(it => it.product.id !== productId));
  };

  const updateQuantity = (productId: string, quantity: number) => {
    if (quantity <= 0) {
      removeItem(productId);
      return;
    }
    setItems(prev =>
      prev.map(it => (it.product.id === productId ? { ...it, quantity } : it))
    );
  };

  const clearCart = () => setItems([]);

  const total = items.reduce((sum, it) => sum + it.product.retailPrice * it.quantity, 0);

  return (
    <CartContext.Provider value={{ items, addItem, removeItem, updateQuantity, clearCart, total }}>
      {children}
    </CartContext.Provider>
  );
}

export function useCart() {
  const ctx = useContext(CartContext);
  if (!ctx) {
    throw new Error('useCart must be used within a CartProvider');
  }
  return ctx;
}

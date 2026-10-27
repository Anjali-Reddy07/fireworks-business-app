import React from 'react';
import { Metadata } from 'next';
import { AdminLayoutClient } from './AdminLayoutClient';
import { BUSINESS_CONFIG } from '@/lib/data/sample-products';

export const metadata: Metadata = {
  title: `Admin Dashboard | ${BUSINESS_CONFIG.name}`,
  robots: {
    index: false,
    follow: false,
  },
};

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  return <AdminLayoutClient>{children}</AdminLayoutClient>;
}

import type { Metadata, Viewport } from 'next';
import './globals.css';
import { BUSINESS_CONFIG } from '@/lib/data/sample-products';
import { CartProvider } from '@/components/cart/CartContext';

export const viewport: Viewport = {
  width: 'device-width',
  initialScale: 1,
  maximumScale: 5,
  themeColor: '#08090d',
};

export const metadata: Metadata = {
  title: `${BUSINESS_CONFIG.name} | Authorized Seasonal Green Fireworks & Festive Assortments`,
  description: `Official digital catalogue and price guide for ${BUSINESS_CONFIG.name}. Browse CSIR-NEERI certified green crackers, sparklers, flower pots, and multi-shot aerials with transparent pricing and safety instructions. Seasonal festive pre-booking and inquiries.`,
  keywords: [
    'Sparklers & Smiles',
    'Seasonal fireworks',
    'Diwali crackers 2026',
    'Green crackers Sivakasi',
    'Festive fireworks gift box',
    'Sparklers and Anar price list',
  ],
  authors: [{ name: BUSINESS_CONFIG.name }],
  robots: {
    index: true,
    follow: true,
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className="dark scroll-smooth">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link
          href="https://fonts.googleapis.com/css2?family=Outfit:wght@300;400;500;600;700;800;900&family=Inter:wght@400;500;600;700&display=swap"
          rel="stylesheet"
        />
      </head>
      <body className="min-h-screen bg-slate-950 text-slate-100 flex flex-col antialiased selection:bg-amber-500 selection:text-slate-950">
        <CartProvider>{children}</CartProvider>
      </body>
    </html>
  );
}

import type { Metadata } from 'next';
import './globals.css';
import { BUSINESS_CONFIG } from '@/lib/data/sample-products';

export const metadata: Metadata = {
  title: `${BUSINESS_CONFIG.name} | Authorized PESO Licensed Green Fireworks Showcase`,
  description: `Official digital catalogue and price guide for ${BUSINESS_CONFIG.name}, Sivakasi. Browse CSIR-NEERI certified green crackers, sparklers, flower pots, and multi-shot aerials with transparent pricing and safety instructions. In-store retail purchases only.`,
  keywords: [
    'Sivakasi fireworks',
    'Green crackers',
    'CSIR NEERI fireworks',
    'Diwali crackers 2026',
    'PESO licensed fireworks shop',
    'Sparklers and Anar price list',
    'Sri Vijaya Fireworks',
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
      <body className="min-h-screen bg-slate-950 text-slate-100 flex flex-col antialiased selection:bg-amber-500 selection:text-slate-950">
        {children}
      </body>
    </html>
  );
}

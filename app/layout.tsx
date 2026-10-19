import type { Metadata, Viewport } from 'next';
import { Instrument_Serif, Inter_Tight } from 'next/font/google';
import { brand } from '@/lib/content';
import './globals.css';

// Instrument Serif: a narrow, high-contrast display face with a good italic, for headlines and prices.
// Inter Tight: a compact sans for everything you read or press.
const display = Instrument_Serif({ subsets: ['latin'], weight: '400', style: ['normal', 'italic'], variable: '--font-display', display: 'swap' });
const sans = Inter_Tight({ subsets: ['latin'], variable: '--font-sans', display: 'swap' });

export const metadata: Metadata = {
  title: `${brand.name}: ${brand.line.toLowerCase()} from ${brand.city}`,
  description: `${brand.name} makes twelve pieces a season in wool, cotton and linen. Free shipping over $${brand.freeShipping} and free returns. A fictional fashion store design concept.`,
};

export const viewport: Viewport = { themeColor: '#F3F0E9', width: 'device-width', initialScale: 1 };

// Runs before paint so elements that animate in never flash in their final position first.
const motionFlag = `try{if(matchMedia('(prefers-reduced-motion: no-preference)').matches)document.documentElement.classList.add('motion')}catch(e){}`;

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    // suppressHydrationWarning: the inline script adds `motion` to <html> before hydration.
    <html lang="en" suppressHydrationWarning className={`${display.variable} ${sans.variable}`}>
      <head>
        <script dangerouslySetInnerHTML={{ __html: motionFlag }} />
      </head>
      <body>{children}</body>
    </html>
  );
}

import type { Metadata } from 'next';
import { Noto_Serif_JP, Montserrat } from 'next/font/google';
import './globals.css';
import Navigation from '@/components/Navigation';
import StickyBar from '@/components/StickyBar';

const notoSerifJP = Noto_Serif_JP({
  subsets: ['latin'],
  weight: ['300', '400', '600', '700', '900'],
  variable: '--font-noto-serif',
});

const montserrat = Montserrat({
  subsets: ['latin'],
  weight: ['300', '400', '600', '700'],
  variable: '--font-montserrat',
});

export const metadata: Metadata = {
  title: '京都焼肉なおき｜名古屋・栄の焼肉屋',
  description: '名古屋市中区栄の焼肉屋「京都焼肉なおき」。18:00〜翌4:00営業。京都二十年の技、秘伝のタレで紡ぐ至高の一皿。一人焼肉・デート・宴会に。',
  openGraph: {
    title: '京都焼肉なおき',
    description: '京都二十年の技。秘伝のタレで紡ぐ、至高の一皿。',
    images: ['/kv_i1.jpg'],
  },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="ja">
      <body
        className={`${notoSerifJP.variable} ${montserrat.variable} bg-[#0a0805] text-white pb-[calc(3.5rem+1.75rem)] overflow-x-hidden`}
        style={{ fontFamily: 'var(--font-noto-serif)' }}
      >
        <Navigation />
        <main className="pt-14">{children}</main>
        <StickyBar />
      </body>
    </html>
  );
}

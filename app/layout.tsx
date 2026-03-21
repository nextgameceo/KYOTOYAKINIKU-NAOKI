import type { Metadata } from 'next';
import { Noto_Serif_JP, Montserrat } from 'next/font/google';
import './globals.css';
import Navigation from '@/components/Navigation';
import StickyBar from '@/components/StickyBar';

const notoSerifJP = Noto_Serif_JP({
  subsets: ['latin'],
  weight: ['300', '400', '600', '700'],
  variable: '--font-noto-serif',
});

const montserrat = Montserrat({
  subsets: ['latin'],
  weight: ['300', '400', '600', '700'],
  variable: '--font-montserrat',
});

export const metadata: Metadata = {
  title: '京都焼肉なおき｜東新町・新栄の焼肉屋',
  description: '名古屋市中区東新町・新栄の焼肉屋「京都焼肉なおき」。18:00〜4:00営業。一人焼肉・ディナーデート・女子会・宴会におすすめ。',
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="ja">
      <body className={`${notoSerifJP.variable} ${montserrat.variable} bg-[#0a0a0a] text-white font-[var(--font-noto-serif)] pb-14`}>
        <Navigation />
        <main className="pt-14">{children}</main>
        <StickyBar />
      </body>
    </html>
  );
}

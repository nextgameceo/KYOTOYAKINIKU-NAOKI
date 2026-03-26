import type { Metadata } from 'next';
import { Noto_Serif_JP, Montserrat } from 'next/font/google';
import './globals.css';
import Navigation from '@/components/Navigation';
import StickyBar from '@/components/StickyBar';

const notoSerifJP = Noto_Serif_JP({
  subsets: ['latin'],
  weight: ['300', '400', '600', '700'],
  variable: '--font-noto-serif',
  // display: 'swap' を追加してフォント読み込み中のレイアウトシフトを軽減
  display: 'swap',
});

const montserrat = Montserrat({
  subsets: ['latin'],
  weight: ['300', '400', '600', '700'],
  variable: '--font-montserrat',
  display: 'swap',
});

export const metadata: Metadata = {
  title: {
    default: '京都焼肉なおき｜名古屋・栄の焼肉屋',
    template: '%s | 京都焼肉なおき',
  },
  description:
    '名古屋市中区栄の焼肉屋「京都焼肉なおき」。京都二十年の技と二つの秘伝タレが生む至高の一皿。18:00〜翌4:00営業。一人焼肉・ディナーデート・女子会・宴会におすすめ。',
  keywords: ['京都焼肉なおき', '名古屋', '栄', '焼肉', '一人焼肉', '深夜営業', 'みそダレ', '洗いダレ'],
  openGraph: {
    type: 'website',
    locale: 'ja_JP',
    url: 'https://kyotoyakiniku-naoki.vercel.app',
    siteName: '京都焼肉なおき',
    title: '京都焼肉なおき｜名古屋・栄の焼肉屋',
    description:
      '名古屋市中区栄の焼肉屋「京都焼肉なおき」。京都二十年の技と二つの秘伝タレが生む至高の一皿。',
    images: [
      {
        url: '/ogp.jpg',
        width: 1200,
        height: 630,
        alt: '京都焼肉なおき',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: '京都焼肉なおき｜名古屋・栄の焼肉屋',
    description: '名古屋市中区栄の焼肉屋「京都焼肉なおき」。京都二十年の技と二つの秘伝タレ。',
  },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="ja">
      <body
        className={`${notoSerifJP.variable} ${montserrat.variable} bg-[#0a0a0a] text-white font-[var(--font-noto-serif)] pb-14`}
      >
        <Navigation />
        {/* pt-14 はナビゲーションバーの高さ分のオフセット */}
        <main className="pt-14">{children}</main>
        <StickyBar />
      </body>
    </html>
  );
}

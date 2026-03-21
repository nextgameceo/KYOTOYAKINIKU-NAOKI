import React from 'react';
import Image from 'next/image';

/**
 * 京都焼肉なおき - 公式サイト トップページ
 * デザイン方針：和モダン、高級感、情報の集約（1ページ完結型）
 */
export default function HomePage() {
  return (
    <div className="bg-[#0a0a0a] text-[#e0d8c3] min-h-screen font-serif selection:bg-[#d4af37] selection:text-black">
      
      {/* --- 1. ヘッダー & 縦長ロゴ --- */}
      <header className="flex flex-col items-center py-12 bg-gradient-to-b from-black to-transparent border-b border-[#333]">
        <div className="mb-6 group">
          {/* ロゴ画像：縦長を想定。public/logo.png がある場合は Image タグに差し替えてください */}
          <div className="w-24 h-56 border-2 border-[#d4af37] flex flex-col items-center justify-center p-4 transition-all duration-500 hover:bg-[#d4af37]/10">
            <span className="text-sm tracking-[0.5em] text-[#d4af37] mb-2 font-sans">京都焼肉</span>
            <div className="flex flex-col gap-2 text-2xl font-bold tracking-[0.2em] text-white">
              <span>な</span><span>お</span><span>き</span>
            </div>
            {/* 実際のロゴ画像を使う場合はここを <Image src="/logo.png" ... /> に差し替え */}
          </div>
        </div>
        <nav className="flex gap-10 text-[10px] md:text-xs tracking-[0.3em] font-sans text-gray-400">
          <a href="#menu" className="hover:text-[#d4af37] transition-colors">お品書き</a>
          <a href="#concept" className="hover:text-[#d4af37] transition-colors">想い</a>
          <a href="#review" className="hover:text-[#d4af37] transition-colors">お客様の声</a>
          <a href="#access" className="hover:text-[#d4af37] transition-colors">アクセス</a>
        </nav>
      </header>

      {/* --- 2. メインビジュアル --- */}
      <section className="relative h-[80vh] flex items-center justify-center overflow-hidden">
        <div className="text-center z-10 px-6">
          <h1 className="text-3xl md:text-5xl tracking-[0.25em] mb-6 leading-relaxed">
            五感で愉しむ、<br className="md:hidden" />京の宵。
          </h1>
          <p className="text-sm md:text-lg tracking-[0.4em] text-[#d4af37] uppercase">Premium Yakiniku Naoki</p>
        </div>
        {/* 背景画像：暗めの和牛や店舗内装の写真を想定 */}
        <div className="absolute inset-0 bg-[url('https://images.unsplash.com/photo-1544025162-d76694265947?q=80&w=2069&auto=format&fit=crop')] bg-cover bg-center opacity-40 grayscale-[0.3]"></div>
        <div className="absolute inset-0 bg-gradient-to-t from-[#0a0a0a] via-transparent to-transparent"></div>
      </section>

      {/* --- 3. お品書き（Menu）セクション：トップに直接反映 --- */}
      <section id="menu" className="py-24 px-6 max-w-5xl mx-auto">
        <div className="text-center mb-16">
          <h2 className="text-xs tracking-[1em] text-[#d4af37] mb-2">MENU</h2>
          <p className="text-2xl tracking-[0.3em]">御品書</p>
        </div>
        
        <div className="grid md:grid-cols-2 gap-x-16 gap-y-12 border-t border-b border-[#333] py-16">
          <div className="space-y-4">
            <div className="flex justify-between items-baseline border-b border-dotted border-gray-600 pb-2">
              <h3 className="text-lg">特選黒毛和牛コース</h3>
              <span className="text-[#d4af37]">¥12,000〜</span>
            </div>
            <p className="text-xs text-gray-400 leading-relaxed">その日仕入れた最高級の和牛を、前菜から〆まで心ゆくまで堪能できる贅沢なコースです。</p>
          </div>
          
          <div className="space-y-4">
            <div className="flex justify-between items-baseline border-b border-dotted border-gray-600 pb-2">
              <h3 className="text-lg">和牛極上赤身</h3>
              <span className="text-[#d4af37]">¥3,200</span>
            </div>
            <p className="text-xs text-gray-400 leading-relaxed">肉本来の旨味が凝縮された部位を厳選。脂っこさが苦手な方にもお薦めの一品。</p>
          </div>

          <div className="space-y-4">
            <div className="flex justify-between items-baseline border-b border-dotted border-gray-600 pb-2">
              <h3 className="text-lg">プレミアムタン塩</h3>
              <span className="text-[#d4af37]">¥2,800</span>
            </div>
            <p className="text-xs text-gray-400 leading-relaxed">一頭からわずかしか取れない希少なタン。厚切りならではの食感とジューシーさ。</p>
          </div>

          <div className="space-y-4">
            <div className="flex justify-between items-baseline border-b border-dotted border-gray-600 pb-2">
              <h3 className="text-lg">日替わり京野菜焼き</h3>
              <span className="text-[#d4af37]">¥1,200</span>
            </div>
            <p className="text-xs text-gray-400 leading-relaxed">京都の地物野菜を直火で。お肉との相性も抜群の鮮やかな彩り。</p>
          </div>
        </div>
      </section>

      {/* --- 4. コンセプト & Googleレビュー反映 --- */}
      <section id="concept" className="py-24 bg-[#111]">
        <div className="max-w-6xl mx-auto grid md:grid-cols-2 gap-20 px-6 items-center">
          {/* 店主紹介 */}
          <div className="relative">
            <h2 className="text-[#d4af37] mb-8 text-xs tracking-[0.5em]">CONCEPT</h2>
            <p className="text-xl md:text-2xl leading-[2.5] mb-8 tracking-[0.1em]">
              「肉へのこだわりはもちろん、<br />
              一期一会の笑顔を大切に。」
            </p>
            <p className="text-sm text-gray-400 leading-loose max-w-md">
              京都の静かな路地に佇む「なおき」。厳選した和牛と、落ち着いた空間で、皆様の大切なひとときを彩ります。
            </p>
            <div className="mt-8 flex items-center gap-4">
              <div className="w-12 h-[1px] bg-[#d4af37]"></div>
              <p className="text-sm tracking-widest text-[#d4af37]">店主 内山 浩輝</p>
            </div>
          </div>
          
          {/* Googleレビューセクション */}
          <div id="review" className="bg-[#0a0a0a] p-10 border border-[#333] shadow-2xl">
            <div className="flex flex-col items-center mb-10">
              <div className="flex items-center gap-4 mb-2">
                <span className="text-4xl font-bold text-white">5.0</span>
                <div className="flex text-[#fbbc05] text-xl">★★★★★</div>
              </div>
              <p className="text-[10px] tracking-widest text-gray-500 uppercase font-sans">Google Reviews</p>
            </div>
            
            <div className="space-y-8">
              <div className="relative pl-6 border-l border-[#d4af37]/50">
                <p className="text-xs text-gray-300 leading-loose">
                  「お肉の質が非常に高く、接客も丁寧。京都で焼肉ならここ以外考えられません。特別な日にまた来ます。」
                </p>
                <p className="text-[10px] mt-2 text-[#d4af37]">— 1週間前</p>
              </div>
              <div className="relative pl-6 border-l border-[#d4af37]/50">
                <p className="text-xs text-gray-300 leading-loose">
                  「落ち着いた内装でゆっくり食事ができました。サイドメニューもこだわりが感じられ、非常に満足です。」
                </p>
                <p className="text-[10px] mt-2 text-[#d4af37]">— 3日前</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* --- 5. フッター：予約 & 採用導線 --- */}
      <footer className="py-24 text-center border-t border-[#333] bg-black">
        <div className="flex flex-col md:flex-row justify-center items-center gap-8 mb-12 px-6">
          <a href="/reserve" className="w-full md:w-64 py-4 border border-[#d4af37] text-[#d4af37] tracking-[0.5em] text-xs hover:bg-[#d4af37] hover:text-black transition duration-500">
            WEB予約
          </a>
          <a href="/recruit" className="w-full md:w-64 py-4 bg-[#d4af37] text-black tracking-[0.5em] text-xs hover:bg-white transition duration-500 font-bold">
            採用情報
          </a>
        </div>
        <p className="text-[10px] text-gray-600 tracking-widest">© 2026 KYOTO YAKINIKU NAOKI. All Rights Reserved.</p>
      </footer>
    </div>
  );
}

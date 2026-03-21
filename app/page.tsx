import React from 'react';
import Image from 'next/image';

// microCMSデータ取得（最新を常に反映）
async function getCMS(endpoint: string) {
  const res = await fetch(`https://${process.env.MICROCMS_SERVICE_DOMAIN}.microcms.io/api/v1/${endpoint}`, {
    headers: { 'X-MICROCMS-API-KEY': process.env.MICROCMS_API_KEY || '' },
    cache: 'no-store'
  });
  if (!res.ok) return null;
  return res.json();
}

export default async function HomePage() {
  // 内山様から頂いたエンドポイントIDで取得
  const shopData = await getCMS('shop-info');
  const recruitData = await getCMS('recruit');
  const newsData = await getCMS('news');
  const menuData = await getCMS('menu');

  // 店舗情報の1件目
  const shop = shopData?.contents?.[0] || {};
  // 求人情報の1件目（賄い情報など）
  const recruit = recruitData?.contents?.[0] || {};

  return (
    <div className="bg-[#0a0a0a] text-[#e0d8c3] min-h-screen font-serif selection:bg-[#d4af37] selection:text-black">
      
      {/* 1. ヘッダー：縦長ロゴ (public/logo.png) */}
      <header className="sticky top-0 z-50 flex flex-col items-center py-8 bg-black/95 border-b border-[#222]">
        <div className="relative w-28 h-56 mb-6">
          <Image src="/logo.png" alt="京都焼肉なおき" fill className="object-contain" priority />
        </div>
        <nav className="flex gap-8 text-[10px] tracking-[0.3em] uppercase text-gray-500">
          <a href="#news" className="hover:text-[#d4af37]">News</a>
          <a href="#menu" className="hover:text-[#d4af37]">Menu</a>
          <a href="#recruit" className="hover:text-[#d4af37]">Recruit</a>
          <a href="#access" className="hover:text-[#d4af37]">Access</a>
        </nav>
      </header>

      {/* 2. お知らせ (news) */}
      <section id="news" className="py-16 bg-[#111] px-6">
        <div className="max-w-4xl mx-auto">
          <h2 className="text-[#d4af37] text-xs tracking-widest mb-8 text-center uppercase">Latest News</h2>
          <ul className="space-y-4 text-xs">
            {newsData?.contents?.map((item: any) => (
              <li key={item.id} className="flex gap-6 border-b border-[#222] pb-3 items-center">
                <span className="text-gray-500 font-sans">{item.publishedAt?.split('T')[0]}</span>
                <span className="text-white hover:text-[#d4af37] cursor-pointer">{item.title}</span>
              </li>
            ))}
          </ul>
        </div>
      </section>

      {/* 3. お品書き (menu) ：写真・価格反映 */}
      <section id="menu" className="py-24 px-6 max-w-6xl mx-auto">
        <h2 className="text-2xl text-center mb-16 tracking-[0.4em]">御品書</h2>
        <div className="grid md:grid-cols-2 gap-x-16 gap-y-12">
          {menuData?.contents?.map((item: any) => (
            <div key={item.id} className="flex gap-6 border-b border-[#1a1a1a] pb-8 items-start group">
              {item.image?.url && (
                <div className="relative w-24 h-24 flex-shrink-0 border border-[#333] overflow-hidden">
                  <Image src={item.image.url} alt={item.name} fill className="object-cover group-hover:scale-110 transition-transform duration-500" />
                </div>
              )}
              <div className="flex-1">
                <div className="flex justify-between items-baseline mb-2">
                  <h3 className="text-lg">{item.name}</h3>
                  <span className="text-[#d4af37] font-sans text-sm tracking-tighter">¥{item.price?.toLocaleString()}</span>
                </div>
                <p className="text-[10px] text-gray-500 leading-relaxed">{item.description}</p>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* 4. 壺の説明 (静的配置) */}
      <section id="tsubo" className="py-28 bg-[#0d0d0d] text-center px-6 border-y border-[#222]">
        <h2 className="text-[#d4af37] text-[10px] tracking-[0.8em] mb-10 uppercase">The Art of Tsubo</h2>
        <p className="max-w-3xl mx-auto text-sm md:text-lg leading-[2.5] italic text-gray-400 font-light">
          なおき自慢の「壺漬け」は、厳選された肉を秘伝のタレに潜らせ、<br />
          静謐な刻の中で旨味を極限まで引き出します。<br />
          蓋を開けた瞬間の、芳醇な香りをご堪能ください。
        </p>
      </section>

      {/* 5. Googleレビュー (共有URL連携) */}
      <section id="review" className="py-24 text-center px-6">
        <div className="max-w-2xl mx-auto p-12 border border-[#d4af37]/20 bg-[#111] shadow-2xl">
          <div className="text-[#fbbc05] text-4xl mb-6 font-sans">★★★★★ 5.0</div>
          <p className="text-sm mb-10 text-gray-300 leading-loose italic">「京都で一番の焼肉。特に壺漬けの肉は一度食べたら忘れられません。」</p>
          <a href="https://share.google/LwTHNCdi0StJUF6AX" target="_blank" className="inline-block px-10 py-3 bg-[#d4af37] text-black text-[10px] font-bold tracking-widest hover:bg-white transition-all">
            Google口コミを全て見る
          </a>
        </div>
      </section>

      {/* 6. 求人情報 (recruit & wage) */}
      <section id="recruit" className="py-24 bg-[#0d0d0d] px-6">
        <div className="max-w-3xl mx-auto border border-[#222] p-10 bg-black">
          <h2 className="text-xl tracking-widest mb-8 text-center">RECRUIT / 採用情報</h2>
          <div className="space-y-6 text-sm">
            <div className="flex border-b border-[#222] pb-4">
              <span className="w-24 text-[#d4af37] text-xs">募集職種</span>
              <p className="flex-1">{recruit.title || "ホール・キッチンスタッフ"}</p>
            </div>
            <div className="flex border-b border-[#222] pb-4">
              <span className="w-24 text-[#d4af37] text-xs">給与/賄い</span>
              <p className="flex-1">{recruit.wage || "賄いあり"}</p>
            </div>
            <div className="flex border-b border-[#222] pb-4">
              <span className="w-24 text-[#d4af37] text-xs">仕事内容</span>
              <p className="flex-1 whitespace-pre-wrap">{recruit.content}</p>
            </div>
          </div>
          <div className="mt-10 text-center">
             <button className="px-12 py-4 bg-[#d4af37] text-black font-bold text-xs tracking-widest hover:bg-white transition">応募フォームへ進む</button>
          </div>
        </div>
      </section>

      {/* 7. アクセス & Googleマップ (shop-info) */}
      <section id="access" className="py-28 px-6 max-w-6xl mx-auto">
        <div className="grid md:grid-cols-2 gap-16 items-center">
          <div className="space-y-8">
            <h2 className="text-3xl tracking-widest">ACCESS</h2>
            <div className="space-y-4 text-sm">
              <p className="text-lg">〒{shop.zipcode} {shop.address}</p>
              <p className="text-2xl text-[#d4af37] font-sans">{shop.tel}</p>
              <p className="text-gray-500">営業時間: {shop.business_hours}</p>
            </div>
          </div>
          <div className="h-96 border border-[#222] grayscale invert opacity-50">
            <iframe
              width="100%" height="100%"
              src={`https://maps.google.com/maps?q=${encodeURIComponent(shop.address || '京都市')}&output=embed`}
              loading="lazy"
            ></iframe>
          </div>
        </div>
      </section>

      <footer className="py-12 text-center text-[10px] text-gray-700 tracking-[0.3em] border-t border-[#1a1a1a]">
        © 2026 KYOTO YAKINIKU NAOKI.
      </footer>
    </div>
  );
}

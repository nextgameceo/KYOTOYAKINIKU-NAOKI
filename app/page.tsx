import React from 'react';
import Image from 'next/image';

// microCMSデータ取得（キャッシュさせない設定）
async function getCMS(endpoint: string) {
  const res = await fetch(`https://${process.env.MICROCMS_SERVICE_DOMAIN}.microcms.io/api/v1/${endpoint}`, {
    headers: { 'X-MICROCMS-API-KEY': process.env.MICROCMS_API_KEY || '' },
    cache: 'no-store'
  });
  if (!res.ok) return null;
  return res.json();
}

export default async function HomePage() {
  // microCMSデータの取得
  const shopData = await getCMS('shop-info');
  const recruitData = await getCMS('recruit');
  const newsData = await getCMS('news');
  const menuData = await getCMS('menu');

  // 店舗情報の1件目
  const shop = shopData?.contents?.[0] || {
    zipcode: "604-8024",
    address: "京都府京都市中京区...",
    tel: "075-XXX-XXXX",
    business_hours: "17:00 - 23:00"
  };
  
  // 求人情報の1件目
  const recruit = recruitData?.contents?.[0] || {};

  return (
    <div className="bg-[#0a0a0a] text-[#e0d8c3] min-h-screen font-serif selection:bg-[#d4af37] selection:text-black">
      
      {/* 1. ヘッダー：格式高い縦長ロゴとナビゲーション */}
      <header className="sticky top-0 z-50 flex flex-col items-center py-10 bg-black/95 border-b border-[#333]">
        <div className="mb-6 relative transition-transform hover:scale-105 duration-500">
          {/* 提供されたロゴ画像 image_6.png を配置 */}
          {/* 金色の光彩（シャドウ）を付けて黒い背景から浮かび上がらせる */}
          <div className="w-24 h-64 relative shadow-[0_0_15px_rgba(212,175,55,0.2)]">
            <Image 
              src="/logo.png" /* ※public/logo.png に image_6.png を保存してください */
              alt="京都焼肉なおき 墨文字ロゴ" 
              fill 
              className="object-contain" 
              priority 
            />
          </div>
        </div>
        <nav className="flex gap-10 text-[10px] tracking-[0.4em] uppercase text-gray-500 font-sans">
          <a href="#news" className="hover:text-[#d4af37] transition-colors">News</a>
          <a href="#menu" className="hover:text-[#d4af37] transition-colors">Menu</a>
          <a href="#recruit" className="hover:text-[#d4af37] transition-colors">Recruit</a>
          <a href="#access" className="hover:text-[#d4af37] transition-colors">Access</a>
        </nav>
      </header>

      {/* 2. お知らせ (news) */}
      <section id="news" className="py-16 bg-[#111] px-6">
        <div className="max-w-4xl mx-auto">
          <h2 className="text-[#d4af37] text-xs tracking-widest mb-8 text-center uppercase">Latest News</h2>
          <ul className="space-y-4 text-xs font-sans">
            {newsData?.contents?.map((item: any) => (
              <li key={item.id} className="flex gap-6 border-b border-[#222] pb-3 items-center">
                <span className="text-gray-500 font-sans text-xs">{item.publishedAt?.split('T')[0]}</span>
                <span className="text-white hover:text-[#d4af37] cursor-pointer text-sm leading-relaxed">{item.title}</span>
              </li>
            ))}
          </ul>
        </div>
      </section>

      {/* 3. お品書き (menu) ：和モダンな配置 */}
      <section id="menu" className="py-24 px-6 max-w-6xl mx-auto">
        <h2 className="text-2xl text-center mb-16 tracking-[0.4em] border-b border-[#1a1a1a] pb-6 inline-block">御品書</h2>
        <div className="grid md:grid-cols-2 gap-x-16 gap-y-12">
          {menuData?.contents?.map((item: any) => (
            <div key={item.id} className="flex gap-6 border-b border-[#1a1a1a] pb-8 items-start group">
              {item.image?.url && (
                <div className="relative w-28 h-28 flex-shrink-0 border border-[#333] overflow-hidden bg-[#111]">
                  <Image src={item.image.url} alt={item.name} fill className="object-cover group-hover:scale-110 transition-transform duration-500" />
                </div>
              )}
              <div className="flex-1">
                <div className="flex justify-between items-baseline mb-3">
                  <h3 className="text-xl tracking-tight">{item.name}</h3>
                  <span className="text-[#d4af37] font-sans text-sm tracking-tighter">¥{item.price?.toLocaleString()}</span>
                </div>
                <p className="text-[10px] text-gray-500 leading-relaxed italic">{item.description}</p>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* 4. Googleレビュー (共有URL連携) */}
      <section id="review" className="py-24 text-center px-6">
        <div className="max-w-2xl mx-auto p-12 border border-[#d4af37]/20 bg-[#111] shadow-[0_0_30px_rgba(0,0,0,0.5)]">
          <div className="text-[#fbbc05] text-4xl mb-6 font-sans tracking-tight">★★★★★ 5.0</div>
          <p className="text-sm mb-10 text-gray-300 leading-loose italic">「墨文字のロゴが示す通り、格式高い空間。特に壺漬けの肉は一度食べたら忘れられません。」</p>
          <a href="https://share.google/LwTHNCdi0StJUF6AX" target="_blank" rel="noopener noreferrer" className="inline-block px-12 py-4 bg-[#d4af37] text-black text-[10px] font-bold tracking-[0.3em] hover:bg-white transition-all uppercase">
            全てのレビューを見る ↗
          </a>
        </div>
      </section>

      {/* 5. 求人情報 (recruit) */}
      <section id="recruit" className="py-28 bg-[#0d0d0d] px-6">
        <div className="max-w-3xl mx-auto border border-[#333] p-10 bg-black shadow-2xl">
          <h2 className="text-xl tracking-[0.4em] mb-10 text-center uppercase">RECRUIT / 採用</h2>
          <div className="space-y-6 text-sm font-light">
            <div className="flex border-b border-[#1a1a1a] pb-5">
              <span className="w-28 text-[#d4af37] text-xs uppercase tracking-widest">職種</span>
              <p className="flex-1">{recruit.title || "ホール・キッチンスタッフ"}</p>
            </div>
            <div className="flex border-b border-[#1a1a1a] pb-5">
              <span className="w-28 text-[#d4af37] text-xs uppercase tracking-widest">賄い</span>
              <p className="flex-1 text-[#d4af37] font-bold">{recruit.wage || "秘伝の賄いあり"}</p>
            </div>
            <div className="flex border-b border-[#1a1a1a] pb-5">
              <span className="w-28 text-[#d4af37] text-xs uppercase tracking-widest">仕事内容</span>
              <p className="flex-1 whitespace-pre-wrap leading-loose">{recruit.content}</p>
            </div>
          </div>
          <div className="mt-12 text-center">
             <button className="px-12 py-4 border-2 border-[#d4af37] text-[#d4af37] font-bold text-xs tracking-[0.3em] hover:bg-[#d4af37] hover:text-black transition uppercase">採用応募フォーム</button>
          </div>
        </div>
      </section>

      {/* 6. アクセス & Googleマップ (shop-info) */}
      <section id="access" className="py-28 px-6 max-w-6xl mx-auto">
        <div className="grid md:grid-cols-2 gap-16 items-center">
          <div className="space-y-8">
            <h2 className="text-3xl tracking-widest">ACCESS</h2>
            <div className="space-y-4 text-sm font-light">
              <p className="text-lg">〒{shop.zipcode} {shop.address}</p>
              <p className="text-2xl text-[#d4af37] font-sans tracking-tight">{shop.tel}</p>
              <p className="text-gray-500">営業時間: {shop.business_hours}</p>
            </div>
          </div>
          <div className="h-96 border border-[#222] grayscale invert contrast-125 opacity-60 shadow-inner">
            <iframe
              width="100%" height="100%"
              src={`https://www.google.com/maps?q=${encodeURIComponent(shop.address || '京都市')}&output=embed`}
              loading="lazy"
              className="border-none"
            ></iframe>
          </div>
        </div>
      </section>

      <footer className="py-12 text-center text-[10px] text-gray-700 tracking-[0.4em] border-t border-[#1a1a1a]">
        © 2026 KYOTO YAKINIKU NAOKI.
      </footer>
    </div>
  );
}

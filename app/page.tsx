import React from 'react';
import Image from 'next/image';

// 1. microCMSからデータを取得する関数
async function getMicroCMSData(endpoint: string) {
  const res = await fetch(
    `https://${process.env.MICROCMS_SERVICE_DOMAIN}.microcms.io/api/v1/${endpoint}`,
    {
      headers: {
        'X-MICROCMS-API-KEY': process.env.MICROCMS_API_KEY || '',
      },
      next: { revalidate: 60 }, // 1分ごとに更新を確認
    }
  );
  if (!res.ok) return null;
  return res.json();
}

export default async function HomePage() {
  // microCMSの各エンドポイントからデータを取得
  // ※エンドポイント名はmicroCMSの設定に合わせて適宜変更してください
  const newsData = await getMicroCMSData('news'); // ブログ・ニュース用
  const menuData = await getMicroCMSData('menu'); // メニュー用
  const storeData = await getMicroCMSData('store-info'); // 住所・電話番号用

  // 店舗情報のパース（1件目を想定）
  const info = storeData?.contents?.[0] || {
    address: "京都府京都市...",
    tel: "075-XXX-XXXX",
    business_hours: "17:00 - 23:00",
    tsubo_concept: "なおきの肉を語る上で欠かせないのが『壺』です..."
  };

  return (
    <div className="bg-[#0a0a0a] text-[#e0d8c3] min-h-screen font-serif">
      
      {/* --- ヘッダー（縦長ロゴ） --- */}
      <header className="sticky top-0 z-50 flex flex-col items-center py-6 bg-black/90 border-b border-[#333]">
        <div className="mb-4">
          <div className="w-20 h-40 border-2 border-[#d4af37] flex flex-col items-center justify-center p-2">
            <span className="text-[8px] tracking-[0.4em] text-[#d4af37]">京都焼肉</span>
            <div className="flex flex-col text-xl font-bold tracking-[0.2em] text-white">
              <span>な</span><span>お</span><span>き</span>
            </div>
          </div>
        </div>
        <nav className="flex gap-6 text-[10px] tracking-[0.2em] uppercase font-sans text-gray-400">
          <a href="#news" className="hover:text-[#d4af37]">News</a>
          <a href="#menu" className="hover:text-[#d4af37]">Menu</a>
          <a href="#tsubo" className="hover:text-[#d4af37]">壺の秘話</a>
          <a href="#review" className="hover:text-[#d4af37]">Reviews</a>
          <a href="#recruit" className="hover:text-[#d4af37]">Recruit</a>
          <a href="#access" className="hover:text-[#d4af37]">Access</a>
        </nav>
      </header>

      {/* --- News & Blog (microCMS連動) --- */}
      <section id="news" className="py-12 bg-[#111] px-6">
        <div className="max-w-4xl mx-auto">
          <h2 className="text-[#d4af37] text-xs tracking-widest mb-6">LATEST NEWS</h2>
          <ul className="space-y-4 text-xs">
            {newsData?.contents?.map((post: any) => (
              <li key={post.id} className="flex gap-4 border-b border-[#222] pb-2">
                <span className="text-gray-400">{post.publishedAt?.split('T')[0]}</span>
                <span className="text-white hover:text-[#d4af37] cursor-pointer">{post.title}</span>
              </li>
            ))}
          </ul>
        </div>
      </section>

      {/* --- Menu (microCMS連動) --- */}
      <section id="menu" className="py-20 px-6 max-w-5xl mx-auto">
        <h2 className="text-2xl text-center mb-12 tracking-[0.3em]">御品書</h2>
        <div className="grid md:grid-cols-2 gap-8 border-t border-[#333] pt-12">
          {menuData?.contents?.map((item: any) => (
            <div key={item.id} className="flex justify-between items-center border-b border-[#222] pb-4">
              <div>
                <p className="text-lg">{item.name}</p>
                <p className="text-[10px] text-gray-500">{item.description}</p>
              </div>
              <p className="text-[#d4af37]">¥{item.price?.toLocaleString()}</p>
            </div>
          ))}
        </div>
      </section>

      {/* --- 壺のストーリー (microCMS連動) --- */}
      <section id="tsubo" className="py-24 bg-gradient-to-b from-[#111] to-black px-6 text-center">
        <h2 className="text-[#d4af37] text-xs tracking-[0.5em] mb-8">TSUBO STORY</h2>
        <h3 className="text-2xl mb-8">「壺」が肉に魔法をかける。</h3>
        <p className="text-sm leading-loose text-gray-400 max-w-2xl mx-auto italic">
          {info.tsubo_concept}
        </p>
      </section>

      {/* --- Google Reviews --- */}
      <section id="review" className="py-20 bg-[#0a0a0a] px-6 text-center border-y border-[#222]">
        <h2 className="text-[#d4af37] text-xs mb-6">REVIEWS</h2>
        <div className="inline-block p-8 border border-[#d4af37]/30 bg-[#111]">
          <div className="flex justify-center text-[#fbbc05] text-2xl mb-2">★★★★★ 5.0</div>
          <p className="text-sm mb-6">「京都で一番の焼肉体験でした。壺漬けの肉が絶品。」</p>
          <a href="https://www.google.com/maps" target="_blank" className="text-[10px] text-blue-400 underline">
            全てのレビューを見る ↗
          </a>
        </div>
      </section>

      {/* --- Recruit (採用フォーム統合) --- */}
      <section id="recruit" className="py-24 px-6 bg-[#111]">
        <div className="max-w-xl mx-auto">
          <h2 className="text-2xl text-center mb-12">採用応募</h2>
          <div className="space-y-4">
            <input type="text" placeholder="名前" className="w-full bg-black border border-[#333] p-3 text-sm focus:border-[#d4af37] outline-none" />
            <input type="tel" placeholder="電話" className="w-full bg-black border border-[#333] p-3 text-sm focus:border-[#d4af37] outline-none" />
            <button className="w-full bg-[#d4af37] text-black font-bold py-4 hover:bg-white transition">応募する</button>
          </div>
        </div>
      </section>

      {/* --- Access & Google Map (microCMS連動) --- */}
      <section id="access" className="py-24 px-6">
        <div className="max-w-4xl mx-auto grid md:grid-cols-2 gap-10">
          <div className="text-sm space-y-4">
            <h2 className="text-xl">アクセス</h2>
            <p className="text-gray-400">〒{info.address}</p>
            <p className="text-[#d4af37]">TEL: {info.tel}</p>
            <p className="text-gray-500">営業時間: {info.business_hours}</p>
          </div>
          <iframe
            width="100%" height="300"
            src={`https://maps.google.com/maps?q=${encodeURIComponent(info.address)}&output=embed`}
            className="border border-[#333] grayscale"
          ></iframe>
        </div>
      </section>

      <footer className="py-10 text-center text-[10px] text-gray-600 border-t border-[#222]">
        © 2026 KYOTO YAKINIKU NAOKI
      </footer>
    </div>
  );
}

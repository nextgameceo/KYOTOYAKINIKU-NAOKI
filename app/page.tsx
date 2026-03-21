import React from 'react';
import Image from 'next/image';

async function getCMS(endpoint: string) {
  const res = await fetch(`https://${process.env.MICROCMS_SERVICE_DOMAIN}.microcms.io/api/v1/${endpoint}`, {
    headers: { 'X-MICROCMS-API-KEY': process.env.MICROCMS_API_KEY || '' },
    next: { revalidate: 0 }
  });
  if (!res.ok) return null;
  return res.json();
}

export default async function HomePage() {
  const menu = await getCMS('menu');
  const store = await getCMS('store-info');
  const info = store?.contents?.[0] || {};

  return (
    <div className="bg-[#0a0a0a] text-[#e0d8c3] min-h-screen font-serif selection:bg-[#d4af37] selection:text-black">
      
      {/* 1. ヘッダー：public/logo.png を反映 */}
      <header className="sticky top-0 z-50 flex flex-col items-center py-6 bg-black/95 border-b border-[#222]">
        <div className="relative w-24 h-48 mb-4">
          <Image 
            src="/logo.png" 
            alt="京都焼肉なおき ロゴ" 
            fill 
            className="object-contain"
            priority
          />
        </div>
        <nav className="flex gap-8 text-[10px] tracking-[0.2em] uppercase text-gray-400">
          <a href="#menu" className="hover:text-[#d4af37]">Menu</a>
          <a href="#tsubo" className="hover:text-[#d4af37]">壺の秘話</a>
          <a href="#review" className="hover:text-[#d4af37]">Reviews</a>
          <a href="#access" className="hover:text-[#d4af37]">Access</a>
        </nav>
      </header>

      {/* 2. メニュー：写真と価格を反映 */}
      <section id="menu" className="py-24 px-6 max-w-5xl mx-auto">
        <h2 className="text-2xl text-center mb-16 tracking-[0.5em]">御品書</h2>
        <div className="grid md:grid-cols-2 gap-12">
          {menu?.contents?.map((item: any) => (
            <div key={item.id} className="flex gap-6 border-b border-[#222] pb-8 items-start">
              {item.image && (
                <div className="relative w-28 h-28 flex-shrink-0 border border-[#333]">
                  <Image src={item.image.url} alt={item.name} fill className="object-cover" />
                </div>
              )}
              <div className="flex-1">
                <div className="flex justify-between items-baseline mb-3">
                  <h3 className="text-xl">{item.name}</h3>
                  <span className="text-[#d4af37] font-sans">¥{item.price?.toLocaleString()}</span>
                </div>
                <p className="text-xs text-gray-500 leading-relaxed">{item.description}</p>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* 3. 壺の説明：コードに直接組み込み */}
      <section id="tsubo" className="py-28 bg-[#111] border-y border-[#222] px-6 text-center">
        <h2 className="text-[#d4af37] text-xs tracking-[0.6em] mb-10">THE ART OF "TSUBO"</h2>
        <h3 className="text-3xl mb-10 tracking-[0.2em]">「壺」が、肉を研ぎ澄ます。</h3>
        <p className="max-w-2xl mx-auto text-sm leading-[2.5] italic text-gray-400">
          なおきが最も大切にしているのが、この「壺」での熟成です。
          厳選した和牛を秘伝のタレに潜らせ、静謐な時間の中で寝かせる。
          壺の中で肉の繊維が解け、旨味が中心まで浸透したその瞬間、
          最高の一皿が完成します。蓋を開けた瞬間の香りをご堪能ください。
        </p>
      </section>

      {/* 4. Googleレビュー：共有URLを連携 */}
      <section id="review" className="py-24 px-6 text-center">
        <h2 className="text-[#d4af37] text-xs mb-8 tracking-widest">CUSTOMER REVIEWS</h2>
        <div className="inline-block p-12 bg-[#111] border border-[#d4af37]/20 shadow-2xl">
          <div className="flex justify-center text-[#fbbc05] text-3xl mb-4">★★★★★ 5.0</div>
          <p className="text-sm mb-8 leading-loose italic text-gray-300">「これぞ京都の焼肉。壺漬けの深い味わいに感動しました。」</p>
          <a 
            href="https://share.google/LwTHNCdi0StJUF6AX" 
            target="_blank" 
            rel="noopener noreferrer"
            className="inline-block px-8 py-3 border border-[#d4af37] text-[#d4af37] text-[10px] hover:bg-[#d4af37] hover:text-black transition-all"
          >
            Googleマップで全てのレビューを見る ↗
          </a>
        </div>
      </section>

      {/* 5. アクセス & マップ：CMSの住所から自動生成 */}
      <section id="access" className="py-28 bg-black px-6">
        <div className="max-w-5xl mx-auto grid md:grid-cols-2 gap-16 items-center">
          <div className="space-y-6">
            <h2 className="text-2xl tracking-widest mb-8">ACCESS</h2>
            <div className="text-sm space-y-2">
              <p className="text-gray-500 text-xs">住所</p>
              <p className="text-lg">〒{info.zip} {info.address}</p>
            </div>
            <div className="text-sm space-y-2">
              <p className="text-gray-500 text-xs">電話番号</p>
              <p className="text-xl text-[#d4af37]">{info.tel}</p>
            </div>
            <div className="text-sm space-y-2">
              <p className="text-gray-500 text-xs">営業時間</p>
              <p className="text-gray-300">{info.hours}</p>
            </div>
          </div>
          <div className="h-96 border border-[#333] grayscale invert contrast-125 opacity-70">
            <iframe
              width="100%" height="100%"
              src={`https://www.google.com/maps?q=${encodeURIComponent(info.address || '京都市')}&output=embed`}
              loading="lazy"
            ></iframe>
          </div>
        </div>
      </section>

      <footer className="py-12 text-center text-[10px] text-gray-700 tracking-[0.3em] bg-[#0a0a0a]">
        © 2026 KYOTO YAKINIKU NAOKI.
      </footer>
    </div>
  );
}

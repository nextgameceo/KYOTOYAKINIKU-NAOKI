import { createClient } from 'microcms-js-sdk';
import Image from 'next/image';
import Link from 'next/link';

// 1. microCMSクライアント初期化 (ここが抜けていたためエラーが出ていました)
const client = createClient({
  serviceDomain: process.env.MICROCMS_SERVICE_DOMAIN || '', 
  apiKey: process.env.MICROCMS_API_KEY || '',
});

// 2. Google Maps API設定
const GOOGLE_MAPS_API_KEY = process.env.GOOGLE_MAPS_API_KEY;
const PLACE_ID = "ChIJN8vF6KOfA2ARu7jK7NqjQ0M"; // 京都焼肉なをきのID

export default async function Home() {
  // --- お知らせ取得 (microCMS) ---
  let news = [];
  try {
    const res = await client.get({
      endpoint: 'news',
      queries: { limit: 3 },
      customRequestInit: { cache: 'no-store' },
    });
    news = res.contents;
  } catch (e) { 
    console.error("News fetch error"); 
  }

  // --- Googleレビュー取得 (NEXTGAME Engine) ---
  let reviews = [];
  try {
    const googleRes = await fetch(
      `https://maps.googleapis.com/maps/api/place/details/json?place_id=${PLACE_ID}&fields=reviews,rating&key=${GOOGLE_MAPS_API_KEY}&language=ja`,
      { next: { revalidate: 86400 } } // 1日1回自動更新してキャッシュ
    );
    const googleData = await googleRes.json();
    reviews = googleData.result?.reviews || [];
  } catch (e) { 
    console.error("Google fetch error"); 
  }

  return (
    <main className="min-h-screen bg-black text-white font-serif selection:bg-[#d4af37] selection:text-black">
      
      {/* 1. HERO (既存) */}
      <section className="relative h-screen flex flex-col items-center justify-center bg-zinc-50 px-4 text-black border-b border-zinc-200">
        <div className="mb-12 relative w-64 h-32 md:w-80 md:h-48">
          <Image src="/logo.png" alt="京都焼肉なおき" fill priority className="object-contain" />
        </div>
        <div className="text-center">
          <h1 className="text-xl md:text-3xl tracking-[0.3em] leading-loose font-medium">
            京都二十年の技。<br />
            二つのタレで紡ぐ、至高の一皿。
          </h1>
        </div>
        <div className="absolute bottom-12 left-1/2 -translate-x-1/2 flex flex-col items-center gap-3">
          <span className="text-black/30 text-[9px] tracking-[0.6em] uppercase font-sans font-bold">Scroll</span>
          <div className="w-px h-16 bg-gradient-to-b from-black/20 to-transparent animate-pulse" />
        </div>
      </section>

      {/* 2. NEWS (既存) */}
      <section id="news" className="py-24 bg-[#080808] px-6 border-b border-white/5">
        <div className="max-w-4xl mx-auto">
          <div className="text-center mb-16">
            <span className="text-[#d4af37] text-[10px] tracking-[0.5em] uppercase font-sans font-bold">News</span>
            <h2 className="text-2xl md:text-3xl tracking-[0.3em] mt-3 font-medium text-white">最新情報</h2>
          </div>
          <div className="divide-y divide-white/10">
            {news.length > 0 ? (
              news.map((post: any) => (
                <Link key={post.id} href={`/news/${post.id}`} className="group flex flex-col md:flex-row md:items-center gap-4 md:gap-12 py-8 hover:px-4 transition-all duration-500">
                  <span className="text-[10px] tracking-[0.3em] font-sans font-bold text-zinc-600 group-hover:text-[#d4af37]">
                    {new Date(post.publishedAt).toLocaleDateString('ja-JP').replace(/\//g, ' . ')}
                  </span>
                  <h3 className="text-lg md:text-xl tracking-widest text-zinc-300 group-hover:text-white flex-1 line-clamp-1">
                    {post.title}
                  </h3>
                  <span className="text-[#d4af37] opacity-0 group-hover:opacity-100 transition-all translate-x-4 group-hover:translate-x-0 hidden md:block">→</span>
                </Link>
              ))
            ) : (
              <p className="text-center text-zinc-600 text-sm tracking-widest py-10 italic">現在、新しいお知らせはございません。</p>
            )}
          </div>
        </div>
      </section>

      {/* 3. REVIEWS (自動取得) */}
      <section className="py-24 bg-[#050505] border-b border-white/5">
        <div className="max-w-5xl mx-auto px-6">
          <div className="text-center mb-16">
            <span className="text-[#d4af37] text-[10px] tracking-[0.6em] uppercase font-sans font-bold">Reviews</span>
            <h2 className="text-2xl md:text-3xl tracking-[0.3em] mt-3 font-medium text-white">お客様の声</h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {reviews.length > 0 ? (
              reviews.slice(0, 3).map((r: any, i: number) => (
                <div key={i} className="bg-white/5 p-8 border border-white/10 flex flex-col justify-between group hover:border-[#d4af37]/30 transition-all duration-500">
                  <div>
                    <div className="text-[#d4af37] mb-4 text-xs tracking-widest">
                      {"★".repeat(r.rating)}{"☆".repeat(5 - r.rating)}
                    </div>
                    <p className="text-sm text-zinc-400 leading-loose italic line-clamp-6">
                      "{r.text}"
                    </p>
                  </div>
                  <div className="mt-8 pt-6 border-t border-white/5 flex items-center justify-between">
                    <span className="text-[10px] text-zinc-600 tracking-widest uppercase">— {r.author_name}</span>
                    <Image src="/logo.png" alt="" width={15} height={15} className="opacity-10 grayscale invert" />
                  </div>
                </div>
              ))
            ) : (
              <p className="col-span-full text-center text-zinc-600 text-sm italic py-10">レビューを読み込み中です...</p>
            )}
          </div>

          <div className="mt-16 text-center">
            <a 
              href={`https://search.google.com/local/writereview?placeid=${PLACE_ID}`}
              target="_blank"
              className="inline-block border border-zinc-800 px-10 py-3 text-[10px] tracking-[0.4em] text-zinc-500 hover:text-[#d4af37] hover:border-[#d4af37] transition-all uppercase font-sans"
            >
              Write a Google Review
            </a>
          </div>
        </div>
      </section>

      {/* --- 以降、CONCEPT / SPACE / MENU 等の既存セクションを続けてください --- */}
      
    </main>
  );
}

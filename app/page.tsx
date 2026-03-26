import { createClient } from 'microcms-js-sdk';
import Image from 'next/image';
import Link from 'next/link';

// 1. microCMSクライアント初期化
const client = createClient({
  serviceDomain: process.env.MICROCMS_SERVICE_DOMAIN || '', 
  apiKey: process.env.MICROCMS_API_KEY || '',
});

// 2. Google Maps API設定
const GOOGLE_MAPS_API_KEY = process.env.GOOGLE_MAPS_API_KEY;
const PLACE_ID = "ChIJN8vF6KOfA2ARu7jK7NqjQ0M"; 

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
  } catch (e) { console.error("News fetch error"); }

  // --- Googleレビュー取得 (NEXTGAME Engine) ---
  let reviews = [];
  try {
    const googleRes = await fetch(
      `https://maps.googleapis.com/maps/api/place/details/json?place_id=${PLACE_ID}&fields=reviews,rating&key=${GOOGLE_MAPS_API_KEY}&language=ja`,
      { next: { revalidate: 86400 } } 
    );
    const googleData = await googleRes.json();
    reviews = googleData.result?.reviews || [];
  } catch (e) { console.error("Google fetch error"); }

  return (
    <main className="min-h-screen bg-black text-white font-serif selection:bg-[#d4af37] selection:text-black">
      
      {/* 1. HERO */}
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

      {/* 2. NEWS */}
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

      {/* 3. REVIEWS (Google自動取得) */}
      <section className="py-24 bg-[#050505] border-b border-white/5">
        <div className="max-w-5xl mx-auto px-6">
          <div className="text-center mb-16">
            <span className="text-[#d4af37] text-[10px] tracking-[0.6em] uppercase font-sans font-bold">Reviews</span>
            <h2 className="text-2xl md:text-3xl tracking-[0.3em] mt-3 font-medium text-white">お客様の声</h2>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {reviews.length > 0 ? (
              reviews.slice(0, 3).map((r: any, i: number) => (
                <div key={i} className="bg-white/5 p-8 border border-white/10 flex flex-col justify-between group hover:border-[#d4af37]/30 transition-all duration-500">
                  <div>
                    <div className="text-[#d4af37] mb-4 text-xs">{"★".repeat(r.rating)}{"☆".repeat(5 - r.rating)}</div>
                    <p className="text-sm text-zinc-400 leading-loose italic line-clamp-6">"{r.text}"</p>
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
        </div>
      </section>

      {/* 4. CONCEPT / SAUCE */}
      <section className="relative py-32 bg-black px-6 overflow-hidden border-b border-white/5">
        <div className="absolute inset-0 opacity-10">
          <Image src="/sec2_bgi2.jpg" alt="" fill className="object-cover" />
        </div>
        <div className="relative z-10 max-w-5xl mx-auto">
          <div className="text-center mb-24">
            <span className="inline-block bg-[#b01020] text-white text-[9px] tracking-[0.4em] px-5 py-2 mb-6 font-bold uppercase font-sans">The Dual Sauces</span>
            <h2 className="text-3xl md:text-5xl tracking-[0.3em] mb-6 font-medium text-white">二つのタレ、一つの至福</h2>
            <div className="w-16 h-0.5 bg-[#d4af37] mx-auto" />
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-16 md:gap-24">
            <div className="space-y-8">
              <h3 className="text-xl md:text-2xl text-[#d4af37] tracking-[0.2em] border-l-2 border-[#d4af37] pl-4 font-medium">秘伝 みそダレ</h3>
              <div className="space-y-6 text-zinc-300 leading-loose">
                <p>京都の名店「大韶園」直伝、二十年変わらぬ命の味。</p>
                <div className="space-y-6 bg-white/5 p-8 border border-white/10">
                  <p className="text-sm leading-relaxed"><strong className="text-white block mb-2 tracking-widest">自家製 ヤンニンジャン</strong>熟成された深いコクと旨味が、みそダレに圧倒的な奥行きを与えます。</p>
                  <p className="text-sm leading-relaxed border-t border-white/5 pt-4"><strong className="text-white block mb-2 tracking-widest">鮮烈 プッコチ</strong>突き抜けるような辛みが、濃厚な脂の中に爽快感をもたらします。</p>
                </div>
              </div>
            </div>
            <div className="space-y-8">
              <h3 className="text-xl md:text-2xl text-[#d4af37] tracking-[0.2em] border-l-2 border-[#d4af37] pl-4 font-medium">黄金 洗いダレ</h3>
              <div className="space-y-6 text-zinc-300 leading-loose">
                <p>京都焼肉の伝統が生んだ、琥珀色に輝く出汁の芸術。</p>
                <div className="relative h-64 w-full border border-white/10 grayscale opacity-40 overflow-hidden shadow-2xl">
                   <Image src="/sec2_bgi3.jpg" alt="洗いダレ" fill className="object-cover" />
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 5. SPACE */}
      <section className="py-32 bg-[#050505] px-6 border-b border-white/5 overflow-hidden">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-28">
            <span className="text-[#d4af37] text-[10px] tracking-[0.6em] uppercase font-sans font-bold">The Refuge</span>
            <h2 className="text-3xl md:text-4xl tracking-[0.3em] text-white font-medium">栄の隠れ家</h2>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-10">
            {/* カウンター */}
            <div className="flex flex-col items-center text-center group">
              <div className="relative w-full aspect-[3/4] overflow-hidden border border-white/5 mb-10 grayscale group-hover:grayscale-0 transition-all duration-1000">
                <Image src="/interior.jpg.jpg" alt="カウンター席" fill className="object-cover" />
              </div>
              <h3 className="text-xl text-white mb-4">カウンター席</h3>
              <p className="text-sm text-zinc-400 font-sans tracking-widest px-4">店主の手捌きを目の前で愉しめる特等席。</p>
            </div>
            {/* テーブル */}
            <div className="flex flex-col items-center text-center group">
              <div className="relative w-full aspect-[3/4] overflow-hidden border border-white/5 mb-10 grayscale group-hover:grayscale-0 transition-all duration-1000">
                <Image src="/interior2.jpg.jpg" alt="テーブル席" fill className="object-cover" />
              </div>
              <h3 className="text-xl text-white mb-4">テーブル席</h3>
              <p className="text-sm text-zinc-400 font-sans tracking-widest px-4">落ち着いた照明が演出する、心解ける時間。</p>
            </div>
            {/* 団体 */}
            <div className="flex flex-col items-center text-center group">
              <div className="relative w-full aspect-[3/4] overflow-hidden border border-white/5 mb-10 grayscale group-hover:grayscale-0 transition-all duration-1000">
                <Image src="/interior3.jpg.jpg" alt="団体席" fill className="object-cover" />
              </div>
              <h3 className="text-xl text-white mb-4">ご宴会・団体席</h3>
              <p className="text-sm text-zinc-400 font-sans tracking-widest px-4">大人数でのご宴会や貸切のご相談も。</p>
            </div>
          </div>
        </div>
      </section>

      {/* 6. THE MASTER */}
      <section className="py-32 bg-black px-6 border-b border-white/5">
        <div className="max-w-6xl mx-auto grid grid-cols-1 md:grid-cols-12 gap-16 items-center">
          <div className="md:col-span-5 relative aspect-[3/4] overflow-hidden border border-white/10 grayscale shadow-2xl">
            <Image src="/tencho.jpg" alt="店主 山本直樹" fill className="object-cover" />
          </div>
          <div className="md:col-span-7 space-y-8">
            <span className="text-[#d4af37] text-[10px] tracking-[0.5em] font-bold uppercase">The Master</span>
            <h2 className="text-4xl md:text-5xl tracking-[0.3em] text-white">店主、<br /><span className="text-[#d4af37]">山本 直樹。</span></h2>
            <p className="text-zinc-400 leading-[2.2] tracking-widest font-sans font-light">
              京都の名店で二十年余。ひたすらに肉と向き合い、研鑽を積み続けてきた職人。<br />
              肉の一片、タレの一滴に妥協を許さないその姿勢には、二十年の矜持が宿ります。
            </p>
          </div>
        </div>
      </section>

      {/* 7. FOOTER */}
      <footer className="py-24 bg-[#050505] text-center px-6">
        <div className="relative w-24 h-24 mx-auto mb-12 opacity-30 grayscale invert">
          <Image src="/logo.png" alt="なおき ロゴ" fill className="object-contain" />
        </div>
        <p className="text-[#d4af37] text-3xl font-black tracking-[0.5em] mb-4">京都焼肉なおき</p>
        <p className="text-zinc-500 text-sm tracking-widest">愛知県名古屋市中区栄4-6-18 パールプラザビル2F</p>
        <p className="text-2xl text-white mt-8 font-bold"><a href="tel:0529906329">052-990-6329</a></p>
        <p className="text-[9px] text-zinc-800 tracking-[0.4em] uppercase mt-16">© 2026 KYOTO YAKINIKU NAOKI.</p>
      </footer>

    </main>
  );
}

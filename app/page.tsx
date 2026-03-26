import { client } from '@/lib/microcms';
import type { News } from '@/lib/microcms';
import Image from 'next/image';
import Link from 'next/link';

// Google Places API の設定
const GOOGLE_MAPS_API_KEY = process.env.GOOGLE_MAPS_API_KEY;
const PLACE_ID = 'ChIJN8vF6KOfA2ARu7jK7NqjQ0M';

// Google レビューの型定義
type GoogleReview = {
  author_name: string;
  rating: number;
  text: string;
  time: number;
};

export default async function Home() {
  // ─── お知らせ取得 (microCMS) ───────────────────────────
  let news: News[] = [];
  try {
    const res = await client.get({
      endpoint: 'news',
      queries: { limit: 3, orders: '-publishedAt' },
      customRequestInit: { cache: 'no-store' },
    });
    news = res.contents ?? [];
  } catch (e) {
    console.error('News fetch error:', e);
  }

  // ─── Google レビュー取得 ───────────────────────────────
  let reviews: GoogleReview[] = [];
  try {
    if (GOOGLE_MAPS_API_KEY) {
      const googleRes = await fetch(
        `https://maps.googleapis.com/maps/api/place/details/json?place_id=${PLACE_ID}&fields=reviews,rating&key=${GOOGLE_MAPS_API_KEY}&language=ja`,
        { next: { revalidate: 3600 } } // 1時間ごとに再検証（ISR）
      );
      if (googleRes.ok) {
        const googleData = await googleRes.json();
        if (googleData.result?.reviews) {
          reviews = googleData.result.reviews;
        } else {
          console.error('Google API Response Error:', googleData.status);
        }
      }
    }
  } catch (e) {
    console.error('Google fetch error:', e);
  }

  return (
    <main className="min-h-screen bg-black text-white font-serif selection:bg-[#d4af37] selection:text-black">

      {/* ─── 1. HERO ─────────────────────────────────────── */}
      <section className="relative h-screen flex flex-col items-center justify-center bg-zinc-50 px-4 text-black border-b border-zinc-200">
        <div className="mb-12 relative w-64 h-32 md:w-80 md:h-48">
          <Image
            src="/logo.png"
            alt="京都焼肉なおき ロゴ"
            fill
            priority
            className="object-contain"
          />
        </div>
        <div className="text-center">
          <h1 className="text-xl md:text-3xl tracking-[0.3em] leading-loose font-medium">
            京都二十年の技。<br />
            二つのタレで紡ぐ、至高の一皿。
          </h1>
        </div>
        <div className="absolute bottom-12 left-1/2 -translate-x-1/2 flex flex-col items-center gap-3">
          <span className="text-black/30 text-[9px] tracking-[0.6em] uppercase font-sans font-bold">
            Scroll
          </span>
          <div className="w-px h-16 bg-gradient-to-b from-black/20 to-transparent animate-pulse" />
        </div>
      </section>

      {/* ─── 2. NEWS ─────────────────────────────────────── */}
      <section id="news" className="py-24 bg-[#080808] px-6 border-b border-white/5">
        <div className="max-w-4xl mx-auto">
          <div className="text-center mb-16">
            <span className="text-[#d4af37] text-[10px] tracking-[0.5em] uppercase font-sans font-bold">
              News
            </span>
            <h2 className="text-2xl md:text-3xl tracking-[0.3em] mt-3 font-medium text-white">
              最新情報
            </h2>
          </div>
          <div className="divide-y divide-white/10">
            {news.length > 0 ? (
              news.map((post) => (
                <Link
                  key={post.id}
                  href={`/news/${post.id}`}
                  className="group flex flex-col md:flex-row md:items-center gap-4 md:gap-12 py-8 hover:px-4 transition-all duration-500"
                >
                  <span className="text-[10px] tracking-[0.3em] font-sans font-bold text-zinc-600 group-hover:text-[#d4af37] shrink-0">
                    {new Date(post.publishedAt).toLocaleDateString('ja-JP').replace(/\//g, ' . ')}
                  </span>
                  <h3 className="text-lg md:text-xl tracking-widest text-zinc-300 group-hover:text-white flex-1 line-clamp-1">
                    {post.title}
                  </h3>
                  <span className="text-[#d4af37] opacity-0 group-hover:opacity-100 transition-all translate-x-4 group-hover:translate-x-0 hidden md:block">
                    →
                  </span>
                </Link>
              ))
            ) : (
              <p className="text-center text-zinc-600 text-sm tracking-widest py-10 italic">
                現在、新しいお知らせはございません。
              </p>
            )}
          </div>
          {news.length > 0 && (
            <div className="text-center mt-12">
              <Link
                href="/news"
                className="text-[10px] tracking-[0.5em] text-zinc-600 hover:text-[#d4af37] transition-colors uppercase font-sans font-bold"
              >
                すべてのお知らせを見る →
              </Link>
            </div>
          )}
        </div>
      </section>

      {/* ─── 3. REVIEWS (Google 自動取得) ────────────────── */}
      <section className="py-24 bg-[#050505] border-b border-white/5">
        <div className="max-w-5xl mx-auto px-6">
          <div className="text-center mb-16">
            <span className="text-[#d4af37] text-[10px] tracking-[0.6em] uppercase font-sans font-bold">
              Reviews
            </span>
            <h2 className="text-2xl md:text-3xl tracking-[0.3em] mt-3 font-medium text-white">
              お客様の声
            </h2>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {reviews.length > 0 ? (
              reviews.slice(0, 3).map((r, i) => (
                <div
                  key={i}
                  className="bg-white/5 p-8 border border-white/10 flex flex-col justify-between group hover:border-[#d4af37]/30 transition-all duration-500"
                >
                  <div>
                    <div className="text-[#d4af37] mb-4 text-xs" aria-label={`評価：${r.rating}点`}>
                      {'★'.repeat(r.rating)}{'☆'.repeat(5 - r.rating)}
                    </div>
                    <p className="text-sm text-zinc-400 leading-loose italic line-clamp-6">
                      &ldquo;{r.text}&rdquo;
                    </p>
                  </div>
                  <div className="mt-8 pt-6 border-t border-white/5 flex items-center justify-between">
                    <span className="text-[10px] text-zinc-600 tracking-widest uppercase">
                      — {r.author_name}
                    </span>
                    <Image
                      src="/logo.png"
                      alt=""
                      width={15}
                      height={15}
                      className="opacity-10 grayscale invert"
                    />
                  </div>
                </div>
              ))
            ) : (
              <p className="col-span-full text-center text-zinc-600 text-sm italic py-10">
                Googleレビューを読み込み中です...
              </p>
            )}
          </div>
        </div>
      </section>

      {/* ─── 4. CONCEPT / SAUCE ──────────────────────────── */}
      <section
        id="concept"
        className="relative py-32 bg-black px-6 overflow-hidden border-b border-white/5"
      >
        <div className="absolute inset-0 opacity-10">
          <Image src="/sec2_bgi2.jpg" alt="" fill className="object-cover" />
        </div>
        <div className="relative z-10 max-w-5xl mx-auto">
          <div className="text-center mb-24">
            <span className="inline-block bg-[#b01020] text-white text-[9px] tracking-[0.4em] px-5 py-2 mb-6 font-bold uppercase font-sans">
              The Dual Sauces
            </span>
            <h2 className="text-3xl md:text-5xl tracking-[0.3em] mb-6 font-medium text-white">
              二つのタレ、一つの至福
            </h2>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-16">
            <div className="space-y-8">
              <h3 className="text-xl md:text-2xl text-[#d4af37] border-l-2 border-[#d4af37] pl-4 font-medium">
                秘伝 みそダレ
              </h3>
              <p className="text-zinc-300 leading-loose">
                京都の名店「大韶園」直伝、二十年変わらぬ命の味。
              </p>
            </div>
            <div className="space-y-8">
              <h3 className="text-xl md:text-2xl text-[#d4af37] border-l-2 border-[#d4af37] pl-4 font-medium">
                黄金 洗いダレ
              </h3>
              <p className="text-zinc-300 leading-loose">
                京都焼肉の伝統が生んだ、琥珀色に輝く出汁の芸術。
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* ─── 5. ACCESS（簡易） ───────────────────────────── */}
      <section id="access" className="py-24 bg-[#080808] px-6 border-b border-white/5">
        <div className="max-w-4xl mx-auto text-center">
          <span className="text-[#d4af37] text-[10px] tracking-[0.5em] uppercase font-sans font-bold">
            Access
          </span>
          <h2 className="text-2xl md:text-3xl tracking-[0.3em] mt-3 font-medium text-white mb-12">
            交通案内
          </h2>
          <p className="text-zinc-400 text-sm leading-loose mb-2">
            愛知県名古屋市中区栄4-6-18 パールプラザビル2F
          </p>
          <p className="text-zinc-500 text-xs tracking-widest mb-8">
            地下鉄東山線・名城線「栄駅」12番出口より徒歩8分
          </p>
          <Link
            href="/access"
            className="inline-block text-[10px] tracking-[0.5em] border border-[#d4af37]/40 text-[#d4af37] px-8 py-3 hover:bg-[#d4af37] hover:text-black transition-all uppercase font-sans font-bold"
          >
            詳しいアクセスを見る →
          </Link>
        </div>
      </section>

      {/* ─── 6. FOOTER ───────────────────────────────────── */}
      <footer className="py-24 bg-[#050505] text-center px-6">
        <div className="relative w-24 h-24 mx-auto mb-12 opacity-30 grayscale invert">
          <Image src="/logo.png" alt="なおき ロゴ" fill className="object-contain" />
        </div>
        <p className="text-[#d4af37] text-3xl font-black tracking-[0.5em] mb-4">京都焼肉なおき</p>
        <p className="text-zinc-500 text-sm tracking-widest">
          愛知県名古屋市中区栄4-6-18 パールプラザビル2F
        </p>
        <p className="text-zinc-600 text-xs tracking-widest mt-2">
          営業時間：18:00〜翌4:00　定休日：水曜日
        </p>
        <p className="text-2xl text-white mt-8 font-bold">
          <a href="tel:0529906329" aria-label="電話番号：052-990-6329">
            052-990-6329
          </a>
        </p>
        <nav className="flex justify-center gap-6 mt-10 text-[10px] text-zinc-700 tracking-widest uppercase font-sans">
          <Link href="/menu" className="hover:text-white transition-colors">Menu</Link>
          <Link href="/reserve" className="hover:text-white transition-colors">Reserve</Link>
          <Link href="/access" className="hover:text-white transition-colors">Access</Link>
          <Link href="/news" className="hover:text-white transition-colors">News</Link>
          <Link href="/wage" className="hover:text-white transition-colors">Recruit</Link>
        </nav>
        <p className="text-[9px] text-zinc-800 tracking-[0.4em] uppercase mt-16">
          © 2026 KYOTO YAKINIKU NAOKI.
        </p>
      </footer>

    </main>
  );
}

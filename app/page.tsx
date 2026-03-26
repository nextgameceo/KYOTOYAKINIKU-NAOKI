// page.tsx の上部に以下を追加（既存のimportの下）
const GOOGLE_MAPS_API_KEY = process.env.GOOGLE_MAPS_API_KEY;
const PLACE_ID = "ChIJN8vF6KOfA2ARu7jK7NqjQ0M"; // 京都焼肉なをきのID

export default async function Home() {
  // --- お知らせ取得 (既存) ---
  let news = [];
  try {
    const res = await client.get({
      endpoint: 'news',
      queries: { limit: 3 },
      customRequestInit: { cache: 'no-store' },
    });
    news = res.contents;
  } catch (e) { console.error("News fetch error"); }

  // --- ★ Googleレビュー取得 (自動) ---
  let reviews = [];
  try {
    const googleRes = await fetch(
      `https://maps.googleapis.com/maps/api/place/details/json?place_id=${PLACE_ID}&fields=reviews,rating&key=${GOOGLE_MAPS_API_KEY}&language=ja`,
      { next: { revalidate: 86400 } } // 1日1回自動更新
    );
    const googleData = await googleRes.json();
    reviews = googleData.result?.reviews || [];
  } catch (e) { console.error("Google fetch error"); }

  return (
    <main className="min-h-screen bg-black text-white font-serif">
      {/* --- HERO / NEWS セクション (既存) --- */}

      {/* --- ★ 新規：自動レビューセクション (NEXTGAME Engine) --- */}
      <section className="py-24 bg-[#050505] border-y border-white/5">
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
                    <Image src="/logo.png" alt="" width={15} height={15} className="opacity-20 grayscale invert" />
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

      {/* --- 以降のセクション (既存) --- */}
    </main>
  );
}

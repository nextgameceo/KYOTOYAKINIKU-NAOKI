// ... (上部のimport部分は同じ) ...

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

  // --- ★ Googleレビュー取得（デバッグ強化版） ---
  let reviews = [];
  try {
    // APIキーが正しく読み込めているかチェック
    const apiKey = process.env.GOOGLE_MAPS_API_KEY;
    
    if (!apiKey) {
      console.error("Critical: GOOGLE_MAPS_API_KEY is missing!");
    }

    const googleRes = await fetch(
      `https://maps.googleapis.com/maps/api/place/details/json?place_id=${PLACE_ID}&fields=reviews,rating&key=${apiKey}&language=ja`,
      { 
        cache: 'no-store', // キャッシュを無視して最新を取りに行く
        next: { revalidate: 0 } 
      }
    );
    const googleData = await googleRes.json();
    
    // Googleからエラーが返ってきている場合はログに出す
    if (googleData.status !== "OK") {
      console.error("Google API Status Error:", googleData.status, googleData.error_message);
    }

    reviews = googleData.result?.reviews || [];
  } catch (e) { 
    console.error("Google fetch error:", e); 
  }

  return (
    <main className="min-h-screen bg-black text-white font-serif selection:bg-[#d4af37] selection:text-black">
      {/* ... (HERO と NEWS セクションはそのまま) ... */}

      {/* 3. REVIEWS (表示ロジックを少し変更) */}
      <section className="py-24 bg-[#050505] border-b border-white/5">
        <div className="max-w-5xl mx-auto px-6">
          <div className="text-center mb-16">
            <span className="text-[#d4af37] text-[10px] tracking-[0.6em] uppercase font-sans font-bold">Reviews</span>
            <h2 className="text-2xl md:text-3xl tracking-[0.3em] mt-3 font-medium text-white">お客様の声</h2>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {reviews && reviews.length > 0 ? (
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
              // データが空の場合、Vercelの環境変数名が間違っている可能性が高いことを表示
              <div className="col-span-full text-center py-10">
                <p className="text-zinc-600 text-sm italic mb-4">現在、レビューを取得できません。API設定を確認してください。</p>
              </div>
            )}
          </div>
        </div>
      </section>

      {/* ... (以降の CONCEPT 等はそのまま) ... */}
    </main>
  );
}

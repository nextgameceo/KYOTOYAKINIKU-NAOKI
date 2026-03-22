import { createClient } from 'microcms-js-sdk';
import Link from 'next/link';

const client = createClient({
  serviceDomain: process.env.MICROCMS_SERVICE_DOMAIN || '', 
  apiKey: process.env.MICROCMS_API_KEY || '',
});

export default async function MenuPage() {
  try {
    // 取得開始
    const data = await client.get({ 
      endpoint: 'menu', 
      queries: { limit: 100 }
    });

    // データが空、または contents が存在しない場合のガード
    if (!data || !data.contents || data.contents.length === 0) {
      return (
        <div className="min-h-screen bg-black text-white flex items-center justify-center font-serif">
          <p className="tracking-widest opacity-40">御品書の準備中です</p>
        </div>
      );
    }

    return (
      <main className="min-h-screen bg-black text-white font-serif py-24 px-6">
        <div className="max-w-3xl mx-auto">
          <div className="text-center mb-24">
            <h1 className="text-4xl md:text-5xl tracking-[0.4em] mb-8">御品書</h1>
            <div className="w-12 h-px bg-yellow-600/30 mx-auto" />
          </div>

          <div className="space-y-16">
            {data.contents.map((item: any) => (
              <div key={item.id} className="group border-b border-white/10 pb-6 transition-colors hover:border-yellow-600/50">
                <div className="flex justify-between items-baseline mb-3">
                  {/* フィールドIDは 'title' であることを確認済み */}
                  <h2 className="text-xl md:text-2xl tracking-[0.2em]">{item.title}</h2>
                  <span className="text-lg font-sans text-zinc-400">
                    ¥{item.price ? Number(item.price).toLocaleString() : '0'}
                  </span>
                </div>
                {item.description && (
                  <p className="text-zinc-500 text-sm leading-relaxed tracking-widest font-light">
                    {item.description}
                  </p>
                )}
              </div>
            ))}
          </div>

          <div className="mt-32 text-center">
            <Link href="/" className="text-[10px] tracking-[0.5em] text-zinc-600 hover:text-white transition-colors uppercase">
              ← Back to Top
            </Link>
          </div>
        </div>
      </main>
    );
  } catch (error) {
    console.error("Fetch error:", error);
    return (
      <div className="min-h-screen bg-black text-white flex items-center justify-center font-serif">
        <p className="tracking-widest opacity-40">情報の取得に失敗しました。環境変数を確認してください。</p>
      </div>
    );
  }
}

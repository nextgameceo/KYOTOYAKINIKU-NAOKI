import { createClient } from 'microcms-js-sdk';
import Link from 'next/link';

// クライアント初期化
const client = createClient({
  serviceDomain: process.env.MICROCMS_SERVICE_DOMAIN || '', 
  apiKey: process.env.MICROCMS_API_KEY || '',
});

export default async function MenuPage() {
  try {
    // キャッシュを無効化して常に最新データを取得する設定
    const data = await client.get({ 
      endpoint: 'menu', 
      queries: { limit: 100 },
      customRequestInit: {
        cache: 'no-store', 
      },
    });

    if (!data || !data.contents || data.contents.length === 0) {
      return (
        <div className="min-h-screen bg-black text-white flex flex-col items-center justify-center font-serif">
          <p className="tracking-widest opacity-40 mb-8">ー 御品書の準備中です ー</p>
          <Link href="/" className="text-xs text-yellow-600 underline">TOPへ戻る</Link>
        </div>
      );
    }

    return (
      <main className="min-h-screen bg-black text-white font-serif py-24 px-6">
        <div className="max-w-3xl mx-auto">
          <div className="text-center mb-24">
            <h1 className="text-4xl md:text-5xl tracking-[0.4em] mb-4">御品書</h1>
            <p className="text-yellow-600 text-[10px] tracking-[0.5em] uppercase font-sans font-bold">Menu</p>
            <div className="w-12 h-px bg-yellow-600/30 mx-auto mt-8" />
          </div>

          <div className="space-y-16">
            {data.contents.map((item: any) => (
              <div key={item.id} className="group border-b border-white/5 pb-8 hover:border-yellow-600/30 transition-colors">
                <div className="flex justify-between items-baseline mb-4">
                  <h2 className="text-xl md:text-2xl tracking-[0.2em] font-medium">{item.title}</h2>
                  <span className="text-lg font-sans text-zinc-400 group-hover:text-yellow-600 transition-colors">
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
    // エラーが出た場合、原因を画面に表示（本番反映後は消してOK）
    return (
      <div className="min-h-screen bg-black text-white flex flex-col items-center justify-center p-10 text-center">
        <p className="text-red-500 mb-4">データ取得エラーが発生しました</p>
        <code className="text-[10px] bg-zinc-900 p-4 rounded text-zinc-400">
          DOMAIN: {process.env.MICROCMS_SERVICE_DOMAIN ? 'OK' : 'MISSING'}<br/>
          API_KEY: {process.env.MICROCMS_API_KEY ? 'OK' : 'MISSING'}
        </code>
      </div>
    );
  }
}

import { createClient } from 'microcms-js-sdk';
import Image from 'next/image'; // Next.jsの画像最適化
import Link from 'next/link';

// クライアント初期化
const client = createClient({
  serviceDomain: process.env.MICROCMS_SERVICE_DOMAIN || '', 
  apiKey: process.env.MICROCMS_API_KEY || '',
});

export default async function MenuPage() {
  try {
    const data = await client.get({ 
      endpoint: 'menu', 
      queries: { limit: 100 },
      customRequestInit: {
        cache: 'no-store', // 常に最新データを取得
      },
    });

    if (!data || !data.contents || data.contents.length === 0) {
      return (
        <div className="min-h-screen bg-black text-white flex items-center justify-center font-serif">
          <p className="tracking-widest opacity-40 italic">ー 御品書の準備中です ー</p>
        </div>
      );
    }

    return (
      <main className="min-h-screen bg-black text-[#e0d8c3] font-serif py-24 px-6 selection:bg-[#d4af37] selection:text-black">
        <div className="max-w-6xl mx-auto">
          
          {/* ヘッダー */}
          <div className="text-center mb-24 relative">
             {/* 共有ロゴ（絶対パス） */}
            <div className="mb-6 h-40 w-20 relative mx-auto opacity-30">
               <Image src="/logo.png" alt="" fill className="object-contain grayscale invert" />
            </div>
            <h1 className="text-4xl md:text-5xl tracking-[0.4em] mb-4 text-white">御品書</h1>
            <p className="text-[#d4af37] text-[10px] tracking-[0.5em] uppercase font-sans font-bold">Menu</p>
          </div>

          {/* メニューリスト：2列グリッドで画像を引き立てる */}
          <div className="grid md:grid-cols-2 gap-x-16 gap-y-20">
            {data.contents.map((item: any) => (
              <div key={item.id} className="group flex flex-col gap-6 border-b border-white/5 pb-10">
                
                {/* 料理写真：microCMSの画像URLがある場合のみ表示 */}
                {item.image && item.image.url && (
                  <div className="relative w-full aspect-[16/10] overflow-hidden bg-zinc-900 border border-white/5 hover:border-[#d4af37]/30 transition-colors">
                    <Image 
                      src={item.image.url} // 画像URLを取得
                      alt={item.title} 
                      fill 
                      className="object-cover transition-transform duration-700 group-hover:scale-110"
                      sizes="(max-w-768px) 100vw, 50vw" // 画像サイズ最適化
                    />
                  </div>
                )}

                {/* テキスト情報 */}
                <div className="space-y-4">
                  <div className="flex justify-between items-baseline gap-4">
                    <h2 className="text-xl md:text-2xl tracking-[0.2em] font-medium text-white">{item.title}</h2>
                    <span className="text-lg font-sans text-zinc-400 font-medium group-hover:text-[#d4af37] transition-colors">
                      ¥{item.price ? Number(item.price).toLocaleString() : '0'}
                    </span>
                  </div>
                  
                  {item.description && (
                    <p className="text-zinc-500 text-sm leading-relaxed tracking-widest font-light font-sans">
                      {item.description}
                    </p>
                  )}
                </div>
              </div>
            ))}
          </div>

          {/* 戻るボタン */}
          <div className="mt-32 text-center">
            <Link href="/" className="text-[10px] tracking-[0.5em] text-zinc-600 hover:text-white transition-colors uppercase font-sans font-bold">
              ← Back to Top
            </Link>
          </div>
        </div>
      </main>
    );
  } catch (error) {
    return (
      <div className="min-h-screen bg-black text-white flex items-center justify-center font-serif text-center p-10">
        <p className="tracking-widest opacity-40">情報の取得に失敗しました。microCMSの連携設定を確認してください。</p>
      </div>
    );
  }
}

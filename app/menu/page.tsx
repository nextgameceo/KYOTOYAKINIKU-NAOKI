import type { Metadata } from 'next';
import { client } from '@/lib/microcms';
import type { MenuItem } from '@/lib/microcms';
import Image from 'next/image';
import Link from 'next/link';

export const metadata: Metadata = {
  title: '御品書',
  description: '京都焼肉なおきのメニュー一覧。秘伝みそダレ・黄金洗いダレで味わう京都焼肉の数々。',
};

export default async function MenuPage() {
  let items: MenuItem[] = [];

  try {
    const data = await client.getList<MenuItem>({
      endpoint: 'menu',
      queries: { limit: 100 },
      customRequestInit: { cache: 'no-store' },
    });
    items = data.contents ?? [];
  } catch (error) {
    console.error('Menu fetch error:', error);
  }

  if (items.length === 0) {
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
        <div className="text-center mb-24 relative border-b border-white/5 pb-12">
          <div className="mb-6 h-32 w-16 relative mx-auto opacity-30 grayscale invert">
            <Image src="/logo.png" alt="" fill className="object-contain" />
          </div>
          <h1 className="text-4xl md:text-5xl tracking-[0.4em] mb-4 text-white">御品書</h1>
          <p className="text-[#d4af37] text-[10px] tracking-[0.5em] uppercase font-sans font-bold">
            Menu
          </p>
        </div>

        {/* メニューリスト */}
        <div className="grid md:grid-cols-2 gap-x-16 gap-y-24">
          {items.map((item) => (
            <div key={item.id} className="group flex flex-col gap-6">

              {/* 料理写真：和風フレーム */}
              {item.image?.url && (
                <div className="relative p-2 bg-[#111] border border-[#d4af37]/30 shadow-2xl">
                  {/* 四隅の飾り（L字） */}
                  <div className="absolute top-0 left-0 w-4 h-4 border-t-2 border-l-2 border-[#d4af37] -translate-x-1 -translate-y-1 pointer-events-none" />
                  <div className="absolute top-0 right-0 w-4 h-4 border-t-2 border-r-2 border-[#d4af37] translate-x-1 -translate-y-1 pointer-events-none" />
                  {/* 修正：左下は -translate-x-1 translate-y-1 が正しい（translate-x-1 の重複を除去） */}
                  <div className="absolute bottom-0 left-0 w-4 h-4 border-b-2 border-l-2 border-[#d4af37] -translate-x-1 translate-y-1 pointer-events-none" />
                  <div className="absolute bottom-0 right-0 w-4 h-4 border-b-2 border-r-2 border-[#d4af37] translate-x-1 translate-y-1 pointer-events-none" />

                  <div className="relative w-full aspect-[16/10] overflow-hidden">
                    <Image
                      src={item.image.url}
                      alt={item.title}
                      fill
                      className="object-cover transition-transform duration-1000 group-hover:scale-110"
                      sizes="(max-width: 768px) 100vw, 50vw"
                    />
                  </div>
                </div>
              )}

              {/* テキスト情報 */}
              <div className="space-y-4 px-2">
                <div className="flex justify-between items-baseline gap-4">
                  <h2 className="text-xl md:text-2xl tracking-[0.2em] font-medium text-white">
                    {item.title}
                  </h2>
                  <span className="text-lg font-sans text-zinc-400 group-hover:text-[#d4af37] transition-colors shrink-0">
                    {item.price != null
                      ? `¥${Number(item.price).toLocaleString()}`
                      : '時価'}
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
          <Link
            href="/"
            className="text-[10px] tracking-[0.5em] text-zinc-600 hover:text-white transition-colors uppercase font-sans font-bold"
          >
            ← Back to Top
          </Link>
        </div>
      </div>
    </main>
  );
}

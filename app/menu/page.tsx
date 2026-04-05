import type { Metadata } from 'next';
import { client } from '@/lib/microcms';
import type { MenuItem } from '@/lib/microcms';
import Image from 'next/image';
import Link from 'next/link';
import MenuTabs from './MenuTabs';

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

  // カテゴリ別にグループ化
  const groupedByCategory = items.reduce(
    (acc, item) => {
      const category = item.category || 'その他';
      if (!acc[category]) {
        acc[category] = [];
      }
      acc[category].push(item);
      return acc;
    },
    {} as Record<string, MenuItem[]>
  );

  const categories = Object.keys(groupedByCategory);

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

        {/* カテゴリタブ */}
        {categories.length > 1 && (
          <div className="mb-16 flex flex-wrap justify-center gap-4">
            {categories.map((category) => (
              <a
                key={category}
                href={`#${category}`}
                className="px-6 py-2 text-sm tracking-[0.2em] border border-[#d4af37]/40 text-[#d4af37] hover:bg-[#d4af37] hover:text-black transition-all duration-300 uppercase font-sans font-bold"
              >
                {category}
              </a>
            ))}
          </div>
        )}

        {/* メニューリスト（カテゴリ別） */}
        <div className="space-y-24">
          {categories.map((category) => (
            <section key={category} id={category}>
              {categories.length > 1 && (
                <h2 className="text-2xl md:text-3xl tracking-[0.3em] mb-12 text-[#d4af37] border-b border-[#d4af37]/30 pb-4">
                  {category}
                </h2>
              )}
              <div className="grid md:grid-cols-2 gap-x-16 gap-y-24">
                {groupedByCategory[category].map((item) => (
                  <div key={item.id} className="group flex flex-col gap-6">

                    {/* 料理写真：和風フレーム */}
                    {item.image?.url ? (
                      <div className="relative p-2 bg-[#111] border border-[#d4af37]/30 shadow-2xl">
                        {/* 四隅の飾り（L字） */}
                        <div className="absolute top-0 left-0 w-4 h-4 border-t-2 border-l-2 border-[#d4af37] -translate-x-1 -translate-y-1 pointer-events-none" />
                        <div className="absolute top-0 right-0 w-4 h-4 border-t-2 border-r-2 border-[#d4af37] translate-x-1 -translate-y-1 pointer-events-none" />
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
                    ) : (
                      /* プレースホルダー */
                      <div className="relative p-2 bg-[#111] border border-[#d4af37]/30 shadow-2xl">
                        <div className="absolute top-0 left-0 w-4 h-4 border-t-2 border-l-2 border-[#d4af37] -translate-x-1 -translate-y-1 pointer-events-none" />
                        <div className="absolute top-0 right-0 w-4 h-4 border-t-2 border-r-2 border-[#d4af37] translate-x-1 -translate-y-1 pointer-events-none" />
                        <div className="absolute bottom-0 left-0 w-4 h-4 border-b-2 border-l-2 border-[#d4af37] -translate-x-1 translate-y-1 pointer-events-none" />
                        <div className="absolute bottom-0 right-0 w-4 h-4 border-b-2 border-r-2 border-[#d4af37] translate-x-1 translate-y-1 pointer-events-none" />

                        <div className="relative w-full aspect-[16/10] overflow-hidden bg-gradient-to-br from-[#0a0805] to-[#1a1410] flex items-center justify-center">
                          <div className="text-center">
                            <div className="text-[#d4af37] text-4xl mb-2">🍖</div>
                            <p className="text-[#d4af37]/60 text-xs tracking-widest">画像準備中</p>
                          </div>
                        </div>
                      </div>
                    )}

                    {/* テキスト情報 */}
                    <div className="space-y-4 px-2">
                      <div className="flex justify-between items-baseline gap-4">
                        <h3 className="text-xl md:text-2xl tracking-[0.2em] font-medium text-white">
                          {item.title}
                        </h3>
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
            </section>
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

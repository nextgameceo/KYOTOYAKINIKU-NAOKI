import type { Metadata } from 'next';
import Image from 'next/image';
import Link from 'next/link';

export const revalidate = 60;

export const metadata: Metadata = {
  title: '御品書',
  description: '京都焼肉なおきのメニュー一覧。秘伝みそダレ・黄金洗いダレで味わう京都焼肉の数々。',
};

type MenuItem = {
  id: string;
  title: string;
  price: number;
  description?: string;
  category?: string;
  image?: { url: string };
};

async function getMenu(): Promise<MenuItem[]> {
  try {
    const res = await fetch(
      `https://${process.env.MICROCMS_SERVICE_DOMAIN}.microcms.io/api/v1/menu?limit=100`,
      {
        headers: { 'X-MICROCMS-API-KEY': process.env.MICROCMS_API_KEY || '' },
        next: { revalidate: 60 },
      }
    );
    if (!res.ok) return [];
    const data = await res.json();
    return data.contents ?? [];
  } catch (error) {
    console.error('Menu fetch error:', error);
    return [];
  }
}

export default async function MenuPage() {
  const items = await getMenu();

  if (items.length === 0) {
    return (
      <div className="min-h-screen bg-[#0a0805] text-white flex items-center justify-center">
        <p className="tracking-widest text-white/40 italic text-sm">ー 御品書の準備中です ー</p>
      </div>
    );
  }

  // カテゴリ別グループ化
  const groupedByCategory = items.reduce(
    (acc, item) => {
      const category = item.category || 'その他';
      if (!acc[category]) acc[category] = [];
      acc[category].push(item);
      return acc;
    },
    {} as Record<string, MenuItem[]>
  );

  const categories = Object.keys(groupedByCategory);

  return (
    <main className="min-h-screen bg-[#0a0805] text-white py-24 px-6">
      <div className="max-w-4xl mx-auto">

        {/* ヘッダー */}
        <div className="text-center mb-16 pb-12 border-b border-white/8">
          <div className="flex items-center gap-4 justify-center mb-6">
            <div className="w-10 h-px bg-[#c8a84a]/40" />
            <span className="text-[#c8a84a] text-[10px] tracking-[0.5em] font-[var(--font-montserrat)]">MENU</span>
            <div className="w-10 h-px bg-[#c8a84a]/40" />
          </div>
          <h1
            className="text-4xl md:text-5xl tracking-[0.4em] mb-3 text-white font-black"
            style={{ fontFamily: 'var(--font-noto-serif)' }}
          >
            御品書
          </h1>
          <p className="text-[#c8a84a] text-[10px] tracking-[0.5em] font-[var(--font-montserrat)]">
            KYOTO YAKINIKU NAOKI
          </p>
        </div>

        {/* カテゴリタブ */}
        {categories.length > 1 && (
          <div className="mb-14 flex flex-wrap justify-center gap-3">
            {categories.map((category) => (
              <a
                key={category}
                href={`#${category}`}
                className="px-5 py-2 text-xs tracking-[0.2em] border border-[#c8a84a]/40 text-[#c8a84a] hover:bg-[#c8a84a] hover:text-[#0a0805] transition-all duration-300"
                style={{ fontFamily: 'var(--font-noto-serif)' }}
              >
                {category}
              </a>
            ))}
          </div>
        )}

        {/* メニューリスト */}
        <div className="space-y-20">
          {categories.map((category) => (
            <section key={category} id={category}>
              {categories.length > 1 && (
                <div className="flex items-center gap-4 mb-10">
                  <div className="w-6 h-px bg-[#c8a84a]/50" />
                  <h2
                    className="text-xl tracking-[0.3em] text-[#c8a84a] font-bold"
                    style={{ fontFamily: 'var(--font-noto-serif)' }}
                  >
                    {category}
                  </h2>
                  <div className="flex-1 h-px bg-[#c8a84a]/20" />
                </div>
              )}

              <div className="flex flex-col gap-0 divide-y divide-white/8">
                {groupedByCategory[category].map((item) => (
                  <div key={item.id} className="flex gap-4 py-5 items-center group">
                    {/* 画像 */}
                    {item.image?.url ? (
                      <div className="relative w-20 h-20 flex-shrink-0 overflow-hidden border border-[#c8a84a]/20">
                        <Image
                          src={item.image.url}
                          alt={item.title}
                          fill
                          className="object-cover group-hover:scale-105 transition-transform duration-500"
                          sizes="80px"
                        />
                      </div>
                    ) : (
                      <div className="w-20 h-20 flex-shrink-0 border border-white/10 bg-[#140f08] flex items-center justify-center">
                        <span className="text-white/20 text-xs tracking-widest">—</span>
                      </div>
                    )}

                    {/* テキスト */}
                    <div className="flex-1 min-w-0">
                      <div className="flex justify-between items-baseline gap-3">
                        <h3
                          className="text-base font-bold tracking-wide truncate"
                          style={{ fontFamily: 'var(--font-noto-serif)', color: '#ffffff' }}
                        >
                          {item.title}
                        </h3>
                        <span className="text-[#c8a84a] font-bold tracking-widest shrink-0 text-sm">
                          {item.price != null ? `¥${Number(item.price).toLocaleString()}` : '時価'}
                        </span>
                      </div>
                      {item.category && categories.length === 1 && (
                        <span className="inline-block text-[9px] tracking-widest text-[#b01020] border border-[#b01020]/30 px-2 py-0.5 mt-1">
                          {item.category}
                        </span>
                      )}
                      {item.description && (
                        <p className="text-xs text-white/45 mt-1 leading-relaxed line-clamp-2">
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
        <div className="mt-20 text-center">
          <Link
            href="/"
            className="text-[11px] tracking-[0.4em] text-white/30 hover:text-[#c8a84a] transition-colors"
            style={{ fontFamily: 'var(--font-noto-serif)' }}
          >
            ← トップへ戻る
          </Link>
        </div>
      </div>
    </main>
  );
}

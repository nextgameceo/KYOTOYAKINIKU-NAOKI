import Image from 'next/image';
import { client } from '@/lib/microcms';

export const revalidate = 60;

type MenuItem = {
  id: string;
  name: string;
  price: number;
  description: string;
  category: string;
  image?: { url: string };
};

async function getMenuList() {
  const res = await client.getList<MenuItem>({
    endpoint: 'menu',
    queries: { limit: 100, orders: 'category' },
  });
  return res.contents;
}

export default async function MenuPage() {
  const menuList = await getMenuList();

  // カテゴリ一覧を抽出（順序保持）
  const categories = Array.from(new Set(menuList.map(i => i.category)));

  return (
    <div className="min-h-screen bg-[#0a0a0a] text-white">

      {/* Hero */}
      <section className="py-24 text-center bg-[#080604] border-b border-white/5">
        <span className="inline-block bg-[#b01020] text-white text-xs tracking-widest px-3 py-1 mb-6">
          Food Menu
        </span>
        <h1
          className="text-4xl md:text-6xl font-black tracking-widest mb-4"
          style={{ fontFamily: 'var(--font-noto-serif)' }}
        >
          お品書き
        </h1>
        <p className="text-white/40 text-xs tracking-widest">
          ※価格は全て税込みです。仕入れ状況によりメニュー・価格が変更となる場合がございます。
        </p>
      </section>

      {/* Menu Body */}
      {menuList.length === 0 ? (
        <div className="text-center py-32 text-white/30 text-sm tracking-widest">
          メニューを準備中です
        </div>
      ) : (
        <MenuTabs categories={categories} menuList={menuList} />
      )}
    </div>
  );
}

// ── Client Component（タブ切替） ──────────────────────────
'use client';
import { useState } from 'react';

function MenuTabs({
  categories,
  menuList,
}: {
  categories: string[];
  menuList: MenuItem[];
}) {
  const [active, setActive] = useState(categories[0] ?? '');
  const filtered = menuList.filter(i => i.category === active);

  return (
    <div className="max-w-5xl mx-auto px-4 py-16">

      {/* Category tabs */}
      <div className="flex flex-wrap gap-2 mb-12 border-b border-white/10 pb-4">
        {categories.map(cat => (
          <button
            key={cat}
            onClick={() => setActive(cat)}
            className={`px-5 py-2 text-xs tracking-widest border transition-all ${
              active === cat
                ? 'bg-[#b01020] border-[#b01020] text-white'
                : 'border-white/20 text-white/50 hover:border-white/50 hover:text-white'
            }`}
          >
            {cat}
          </button>
        ))}
      </div>

      {/* Items grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {filtered.map(item => (
          <div
            key={item.id}
            className="group border border-white/8 bg-white/2 hover:border-white/20 transition-all"
          >
            {/* Image */}
            {item.image ? (
              <div className="relative aspect-[4/3] overflow-hidden">
                <Image
                  src={item.image.url}
                  alt={item.name}
                  fill
                  className="object-cover group-hover:scale-105 transition-transform duration-500"
                />
              </div>
            ) : (
              <div className="aspect-[4/3] bg-white/5 flex items-center justify-center">
                <span className="text-white/20 text-xs tracking-widest">No Image</span>
              </div>
            )}

            {/* Info */}
            <div className="p-5">
              <h3
                className="text-base font-semibold tracking-wide mb-2 leading-snug"
                style={{ fontFamily: 'var(--font-noto-serif)' }}
              >
                {item.name}
              </h3>
              {item.description && (
                <p className="text-xs font-light leading-relaxed text-white/55 mb-4">
                  {item.description}
                </p>
              )}
              <p className="text-[#c8a84a] font-bold tracking-widest text-lg">
                ¥{item.price.toLocaleString()}
              </p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

import { client } from '@/lib/microcms';
import MenuTabs from './MenuTabs';

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

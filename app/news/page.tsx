import type { Metadata } from 'next';
import { client } from '@/lib/microcms';
import type { News } from '@/lib/microcms';
import Image from 'next/image';
import Link from 'next/link';

export const metadata: Metadata = {
  title: '最新情報',
  description: '京都焼肉なおきの最新情報・お知らせ一覧。',
};

export default async function NewsListPage() {
  let posts: News[] = [];

  try {
    const data = await client.getList<News>({
      endpoint: 'news',
      queries: { limit: 100, orders: '-publishedAt' },
      customRequestInit: { cache: 'no-store' },
    });
    // 取得成功時のみ代入（data.contentsが空配列の場合も正常処理）
    posts = data.contents ?? [];
  } catch (error) {
    console.error('News list fetch error:', error);
    // エラー時は空配列のまま表示（フォールバック表示）
  }

  return (
    <main className="min-h-screen bg-black text-[#e0d8c3] font-serif py-24 px-6">
      <div className="max-w-4xl mx-auto">
        <div className="text-center mb-24 border-b border-white/5 pb-12">
          <div className="mb-6 h-32 w-16 relative mx-auto opacity-30 grayscale invert">
            <Image src="/logo.png" alt="" fill className="object-contain" />
          </div>
          <h1 className="text-4xl md:text-5xl tracking-[0.4em] mb-4 text-white uppercase">
            最新情報
          </h1>
          <p className="text-[#d4af37] text-[10px] tracking-[0.5em] uppercase font-sans font-bold">
            News &amp; Topics
          </p>
        </div>

        {posts.length > 0 ? (
          <div className="space-y-2">
            {posts.map((post) => (
              <Link
                key={post.id}
                href={`/news/${post.id}`}
                className="group flex flex-col md:flex-row md:items-center justify-between py-10 border-b border-white/5 hover:bg-white/[0.02] transition-all px-4"
              >
                <div className="flex flex-col md:flex-row md:items-center gap-6 md:gap-12">
                  <span className="text-[10px] tracking-[0.3em] font-sans font-bold text-zinc-600 group-hover:text-[#d4af37] transition-colors shrink-0">
                    {new Date(post.publishedAt).toLocaleDateString('ja-JP').replace(/\//g, ' . ')}
                  </span>
                  <h2 className="text-xl md:text-2xl tracking-widest text-zinc-300 group-hover:text-white transition-colors">
                    {post.title}
                  </h2>
                </div>
                <span className="text-[#d4af37] opacity-0 group-hover:opacity-100 transition-all translate-x-4 group-hover:translate-x-0 hidden md:block shrink-0">
                  →
                </span>
              </Link>
            ))}
          </div>
        ) : (
          <p className="text-center text-zinc-600 text-sm italic py-20 tracking-widest">
            ー 現在、お知らせはございません ー
          </p>
        )}

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

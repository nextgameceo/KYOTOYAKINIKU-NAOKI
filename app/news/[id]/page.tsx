import { createClient } from 'microcms-js-sdk';
import Image from 'next/image';
import Link from 'next/link';

const client = createClient({
  serviceDomain: process.env.MICROCMS_SERVICE_DOMAIN || '', 
  apiKey: process.env.MICROCMS_API_KEY || '',
});

export default async function NewsDetailPage({ params }: { params: { id: string } }) {
  try {
    const post = await client.get({ 
      endpoint: 'news', 
      contentId: params.id,
      customRequestInit: { cache: 'no-store' },
    });

    return (
      <main className="min-h-screen bg-black text-[#e0d8c3] font-serif py-24 px-6 selection:bg-[#d4af37] selection:text-black">
        <article className="max-w-3xl mx-auto">
          
          {/* 記事ヘッダー */}
          <header className="mb-16 space-y-6">
            <div className="flex items-center gap-4 text-[10px] tracking-[0.4em] font-sans font-bold text-[#d4af37]">
              <Link href="/news" className="hover:text-white transition-colors uppercase">News</Link>
              <span>/</span>
              <span className="text-zinc-600">
                {new Date(post.publishedAt).toLocaleDateString('ja-JP').replace(/\//g, ' . ')}
              </span>
            </div>
            <h1 className="text-3xl md:text-4xl tracking-widest text-white leading-tight">
              {post.title}
            </h1>
          </header>

          {/* アイキャッチ画像（ある場合） */}
          {post.image && post.image.url && (
            <div className="relative w-full aspect-video mb-16 border border-white/5 grayscale hover:grayscale-0 transition-all duration-1000">
              <Image src={post.image.url} alt="" fill className="object-cover" />
            </div>
          )}

          {/* 本文：リッチエディタのHTMLをそのまま流し込む */}
          <div 
            className="prose prose-invert prose-yellow max-w-none 
                       tracking-widest leading-[2.2] text-zinc-300 font-sans font-light
                       [&>p]:mb-10 [&>h2]:text-[#d4af37] [&>h2]:text-2xl [&>h2]:mt-16 [&>h2]:mb-8 [&>h2]:tracking-[0.2em]"
            dangerouslySetInnerHTML={{ __html: post.content }} 
          />

          {/* フッター（戻るボタン） */}
          <footer className="mt-32 pt-12 border-t border-white/5 text-center">
            <Link href="/news" className="text-[10px] tracking-[0.5em] text-zinc-600 hover:text-[#d4af37] transition-colors uppercase font-sans font-bold">
              一覧へ戻る
            </Link>
          </footer>
        </article>
      </main>
    );
  } catch (error) {
    return (
      <div className="min-h-screen bg-black text-white flex items-center justify-center">
        <p className="tracking-widest opacity-40">記事が見つかりません</p>
      </div>
    );
  }
}

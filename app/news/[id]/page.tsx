import type { Metadata } from 'next';
import { getNewsDetail, getNewsList } from '@/lib/microcms';
import Image from 'next/image';
import Link from 'next/link';
import { notFound } from 'next/navigation';

// ─── 静的パスの事前生成（ISR / SSG） ─────────────────────
export async function generateStaticParams() {
  try {
    const data = await getNewsList(50);
    return (data.contents ?? []).map((post) => ({ id: post.id }));
  } catch {
    return [];
  }
}

// ─── 動的メタデータ ────────────────────────────────────────
export async function generateMetadata({
  params,
}: {
  params: Promise<{ id: string }>;
}): Promise<Metadata> {
  const { id } = await params;
  try {
    const post = await getNewsDetail(id);
    return {
      title: post.title,
      description: post.content
        // HTMLタグを除去してプレーンテキストに変換
        .replace(/<[^>]*>/g, '')
        .slice(0, 120),
      openGraph: {
        title: post.title,
        images: post.image ? [{ url: post.image.url }] : [],
      },
    };
  } catch {
    return { title: '記事が見つかりません' };
  }
}

// ─── ページコンポーネント ──────────────────────────────────
export default async function NewsDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;

  let post;
  try {
    post = await getNewsDetail(id);
  } catch {
    // microCMSが404を返した場合は Next.js の notFound() に委譲
    notFound();
  }

  // ─── XSS 対策：dangerouslySetInnerHTML の前に簡易サニタイズ ───
  // 本番環境では DOMPurify や sanitize-html ライブラリの使用を推奨
  // ここでは script タグと on* イベントハンドラを除去する最低限の処理を実施
  const sanitizedContent = post.content
    .replace(/<script\b[^<]*(?:(?!<\/script>)<[^<]*)*<\/script>/gi, '')
    .replace(/\s*on\w+="[^"]*"/gi, '')
    .replace(/\s*on\w+='[^']*'/gi, '');

  return (
    <main className="min-h-screen bg-black text-[#e0d8c3] font-serif py-24 px-6 selection:bg-[#d4af37] selection:text-black">
      <article className="max-w-3xl mx-auto">

        {/* パンくずリスト + 日付 */}
        <header className="mb-16 space-y-6">
          <nav aria-label="パンくずリスト">
            <ol className="flex items-center gap-4 text-[10px] tracking-[0.4em] font-sans font-bold text-[#d4af37]">
              <li>
                <Link href="/news" className="hover:text-white transition-colors uppercase">
                  News
                </Link>
              </li>
              <li aria-hidden="true">/</li>
              <li>
                <time
                  dateTime={post.publishedAt}
                  className="text-zinc-600"
                >
                  {new Date(post.publishedAt).toLocaleDateString('ja-JP').replace(/\//g, ' . ')}
                </time>
              </li>
            </ol>
          </nav>
          <h1 className="text-3xl md:text-4xl tracking-widest text-white leading-tight">
            {post.title}
          </h1>
        </header>

        {/* アイキャッチ画像 */}
        {post.image?.url && (
          <div className="relative w-full aspect-video mb-16 border border-white/5 overflow-hidden grayscale hover:grayscale-0 transition-all duration-1000">
            <Image
              src={post.image.url}
              alt={post.title}
              fill
              className="object-cover"
              sizes="(max-width: 768px) 100vw, 768px"
              priority
            />
          </div>
        )}

        {/* 本文（サニタイズ済みHTML） */}
        <div
          className="
            prose prose-invert prose-yellow max-w-none
            tracking-widest leading-[2.2] text-zinc-300 font-sans font-light
            [&>p]:mb-10
            [&>h2]:text-[#d4af37] [&>h2]:text-2xl [&>h2]:mt-16 [&>h2]:mb-8 [&>h2]:tracking-[0.2em]
            [&>h3]:text-white [&>h3]:text-xl [&>h3]:mt-12 [&>h3]:mb-6
            [&>ul]:list-disc [&>ul]:pl-6 [&>ul]:mb-10
            [&>ol]:list-decimal [&>ol]:pl-6 [&>ol]:mb-10
            [&>blockquote]:border-l-4 [&>blockquote]:border-[#d4af37] [&>blockquote]:pl-6 [&>blockquote]:text-zinc-400
            [&>img]:w-full [&>img]:my-12
          "
          dangerouslySetInnerHTML={{ __html: sanitizedContent }}
        />

        {/* 更新日 */}
        {post.updatedAt && post.updatedAt !== post.publishedAt && (
          <p className="mt-12 text-[10px] text-zinc-700 tracking-widest font-sans">
            最終更新：
            <time dateTime={post.updatedAt}>
              {new Date(post.updatedAt).toLocaleDateString('ja-JP')}
            </time>
          </p>
        )}

        {/* 一覧へ戻るリンク */}
        <footer className="mt-32 pt-12 border-t border-white/5 text-center">
          <Link
            href="/news"
            className="text-[10px] tracking-[0.5em] text-zinc-600 hover:text-[#d4af37] transition-colors uppercase font-sans font-bold"
          >
            一覧へ戻る
          </Link>
        </footer>
      </article>
    </main>
  );
}

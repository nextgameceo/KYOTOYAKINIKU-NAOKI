import { createClient } from 'microcms-js-sdk';
import Image from 'next/image';
import Link from 'next/link';

// microCMSクライアント初期化
const client = createClient({
  serviceDomain: process.env.MICROCMS_SERVICE_DOMAIN || '', 
  apiKey: process.env.MICROCMS_API_KEY || '',
});

export default async function Home() {
  // 最新のお知らせを取得
  let news = [];
  try {
    const res = await client.get({
      endpoint: 'news',
      queries: { limit: 3 },
      customRequestInit: { cache: 'no-store' },
    });
    news = res.contents;
  } catch (e) {
    console.error("News fetch error");
  }

  return (
    <main className="min-h-screen bg-black text-white font-serif selection:bg-[#d4af37] selection:text-black">
      
      {/* 1. HERO */}
      <section className="relative h-screen flex flex-col items-center justify-center bg-zinc-50 px-4 text-black border-b border-zinc-200">
        <div className="mb-12 relative w-64 h-32 md:w-80 md:h-48">
          <Image src="/logo.png" alt="京都焼肉なおき" fill priority className="object-contain" />
        </div>
        <div className="text-center">
          <h1 className="text-xl md:text-3xl tracking-[0.3em] leading-loose font-medium">
            京都二十年の技。<br />
            二つのタレで紡ぐ、至高の一皿。
          </h1>
        </div>
        <div className="absolute bottom-12 left-1/2 -translate-x-1/2 flex flex-col items-center gap-3">
          <span className="text-black/30 text-[9px] tracking-[0.6em] uppercase font-sans font-bold">Scroll</span>
          <div className="w-px h-16 bg-gradient-to-b from-black/20 to-transparent animate-pulse" />
        </div>
      </section>

      {/* 2. NEWS */}
      <section id="news" className="py-24 bg-[#080808] px-6 border-b border-white/5">
        <div className="max-w-4xl mx-auto">
          <div className="text-center mb-16">
            <span className="text-[#d4af37] text-[10px] tracking-[0.5em] uppercase font-sans font-bold">News</span>
            <h2 className="text-2xl md:text-3xl tracking-[0.3em] mt-3 font-medium">最新情報</h2>
          </div>
          <div className="divide-y divide-white/10">
            {news.length > 0 ? (
              news.map((post: any) => (
                <Link key={post.id} href={`/news/${post.id}`} className="group flex flex-col md:flex-row md:items-center gap-4 md:gap-12 py-8 hover:px-4 transition-all duration-500">
                  <span className="text-[10px] tracking-[0.3em] font-sans font-bold text-zinc-600 group-hover:text-[#d4af37]">
                    {new Date(post.publishedAt).toLocaleDateString('ja-JP').replace(/\//g, ' . ')}
                  </span>
                  <h3 className="text-lg md:text-xl tracking-widest text-zinc-300 group-hover:text-white flex-1 line-clamp-1">
                    {post.title}
                  </h3>
                  <span className="text-[#d4af37] opacity-0 group-hover:opacity-100 transition-all translate-x-4 group-hover:translate-x-0 hidden md:block">→</span>
                </Link>
              ))
            ) : (
              <p className="text-center text-zinc-600 text-sm tracking-widest py-10 italic">現在、新しいお知らせはございません。</p>
            )}
          </div>
          <div className="mt-16 text-center">
            <Link href="/news" className="inline-block border border-white/20 px-12 py-4 text-[10px] tracking-[0.4em] text-zinc-400 hover:text-[#d4af37] hover:border-[#d4af37] transition-all uppercase font-sans">
              View All News
            </Link>
          </div>
        </div>
      </section>

      {/* 3. CONCEPT / SAUCE */}
      <section className="relative py-32 bg-black px-6 overflow-hidden border-b border-white/5">
        <div className="absolute inset-0 opacity-10">
          <Image src="/sec2_bgi2.jpg" alt="" fill className="object-cover" />
        </div>
        <div className="relative z-10 max-w-5xl mx-auto">
          <div className="text-center mb-24">
            <span className="inline-block bg-[#b01020] text-white text-[9px] tracking-[0.4em] px-5 py-2 mb-6 font-bold uppercase font-sans">The Dual Sauces</span>
            <h2 className="text-3xl md:text-5xl tracking-[0.3em] mb-6 font-medium">二つのタレ、一つの至福</h2>
            <div className="w-16 h-0.5 bg-[#d4af37] mx-auto" />
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-16 md:gap-24">
            <div className="space-y-8">
              <h3 className="text-xl md:text-2xl text-[#d4af37] tracking-[0.2em] border-l-2 border-[#d4af37] pl-4 font-medium">秘伝 みそダレ</h3>
              <div className="space-y-6 text-zinc-300 leading-loose">
                <p>京都の名店「大韶園」直伝、二十年変わらぬ命の味。</p>
                <div className="space-y-6 bg-white/5 p-8 border border-white/10">
                  <p className="text-sm leading-relaxed">
                    <strong className="text-white block mb-2 tracking-widest">自家製 ヤンニンジャン（薬念醤）</strong>
                    熟成された深いコクと旨味が、みそダレに圧倒的な奥行きを与えます。
                  </p>
                  <p className="text-sm leading-relaxed border-t border-white/5 pt-4">
                    <strong className="text-white block mb-2 tracking-widest">鮮烈 プッコチ（青唐辛子）</strong>
                    突き抜けるような辛みと、鮮烈な香りが、濃厚な脂の中に爽快感をもたらします。
                  </p>
                </div>
              </div>
            </div>
            <div className="space-y-8">
              <h3 className="text-xl md:text-2xl text-[#d4af37] tracking-[0.2em] border-l-2 border-[#d4af37] pl-4 font-medium">黄金 洗いダレ</h3>
              <div className="space-y-6 text-zinc-300 leading-loose">
                <p>京都焼肉の伝統が生んだ、琥珀色に輝く出汁の芸術。</p>
                <div className="relative h-64 w-full border border-white/10 grayscale opacity-40 overflow-hidden shadow-2xl">
                   <Image src="/sec2_bgi3.jpg" alt="洗いダレ" fill className="object-cover" />
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 4. THE MASTER (山本直樹様 プロフィール) */}
      <section className="py-32 bg-[#050505] px-6 border-b border-white/5 overflow-hidden">
        <div className="max-w-6xl mx-auto">
          <div className="grid grid-cols-1 md:grid-cols-12 gap-16 items-center">
            <div className="md:col-span-5 relative group">
              <div className="relative aspect-[3/4] overflow-hidden border border-white/10 grayscale group-hover:grayscale-0 transition-all duration-1000 shadow-2xl">
                <Image src="/tencho.jpg" alt="京都焼肉なおき 店主 山本直樹" fill className="object-cover scale-105 group-hover:scale-100 transition-transform duration-[2000ms]" />
                <div className="absolute inset-4 border border-white/10 pointer-events-none" />
                <div className="absolute top-0 left-0 w-6 h-6 border-t border-l border-[#d4af37]/50" />
                <div className="absolute bottom-0 right-0 w-6 h-6 border-b border-r border-[#d4af37]/50" />
              </div>
              <div className="absolute -bottom-8 -left-8 bg-[#b01020] px-6 py-10 hidden lg:block shadow-2xl">
                <p className="text-white text-[10px] tracking-[0.6em] font-bold uppercase font-serif [writing-mode:vertical-rl] leading-tight">Master Yamamoto Naoki</p>
              </div>
            </div>

            <div className="md:col-span-7 space-y-10 md:pl-16">
              <div className="space-y-3">
                <span className="text-[#d4af37] text-[10px] tracking-[0.5em] uppercase font-sans font-bold">The Master</span>
                <h2 className="text-4xl md:text-5xl tracking-[0.3em] text-white leading-tight font-medium">
                  店主、<br className="md:hidden" /><span className="text-[#d4af37]">山本 直樹。</span>
                </h2>
              </div>
              
              <div className="space-y-8 text-zinc-400 leading-[2.2] tracking-widest text-base md:text-lg font-sans font-light">
                <p>
                  京都の名店で肉の切り出しからタレの調合まで、<br />
                  二十年余。ひたすらに肉と向き合い、研鑽を積み続けてきた職人。
                </p>
                <p>
                  「山本さん」「大将」と親しみを持って呼んでいただくことも多いですが、<br />
                  肉の一片、タレの一滴に妥協を許さないその姿勢には、二十年の矜持が宿ります。
                </p>
                <p className="text-zinc-200 border-l-2 border-[#b01020] pl-6 py-4 bg-white/5">
                  栄の喧騒を離れたこの場所だからこそ、<br />
                  一期一会の肉と秘伝のタレを、最高の状態でお愉しみいただきたい。<br />
                  扉を開けた先で、山本直樹が至高の一皿をご用意してお待ちしております。
                </p>
              </div>

              <div className="pt-6">
                <p className="text-[#d4af37] font-serif tracking-[0.2em] italic text-xl border-t border-white/5 pt-6 inline-block">「二つのタレが、肉の物語を完結させる。」</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 5. NAVIGATION */}
      <section className="bg-black divide-y divide-white/5 border-b border-white/5">
        {[
          { href: '/menu', label: '御品書', sub: 'MENU', img: '/sec3_i1.jpg' },
          { href: '/news', label: '最新情報', sub: 'NEWS', img: '/sec2_bgi2.jpg' },
          { href: '/access', label: '交通案内', sub: 'ACCESS', img: '/sec2_bgi3.jpg' },
          { href: '/wage', label: '採用情報', sub: 'RECRUIT', img: '/sec6_i1.jpg' },
        ].map((link) => (
          <Link key={link.href} href={link.href} className="relative group block overflow-hidden py-24 px-6">
            <div className="absolute inset-0 opacity-0 group-hover:opacity-40 transition-opacity duration-1000">
              <Image src={link.img} alt="" fill className="object-cover scale-110 group-hover:scale-100 transition-transform duration-1000" />
            </div>
            <div className="relative z-10 max-w-5xl mx-auto flex justify-between items-center">
              <div>
                <h3 className="text-2xl md:text-5xl tracking-[0.3em] font-medium mb-3 group-hover:text-white transition-colors">{link.label}</h3>
                <p className="text-[#d4af37] text-[10px] md:text-xs tracking-[0.6em] font-sans font-bold">{link.sub}</p>
              </div>
              <span className="text-white/10 text-4xl md:text-6xl group-hover:text-[#d4af37] transition-all group-hover:translate-x-6">→</span>
            </div>
          </Link>
        ))}
      </section>

      {/* 6. FOOTER */}
      <footer className="py-24 bg-[#050505]">
        <div className="max-w-4xl mx-auto text-center px-6 space-y-16">
          <div className="relative w-24 h-24 mx-auto opacity-30 grayscale invert">
            <Image src="/logo.png" alt="なおき ロゴ" fill className="object-contain" />
          </div>
          <div className="space-y-4">
            <p className="text-[#d4af37] text-3xl font-black tracking-[0.5em] mb-2 font-serif uppercase">京都焼肉なおき</p>
            <p className="text-zinc-700 text-[10px] tracking-[0.3em] uppercase font-sans font-bold">Nagoya Sakae / Pearl Plaza 2F</p>
          </div>
          <div className="space-y-10 text-sm font-light text-zinc-400 max-w-md mx-auto leading-relaxed font-sans">
            <p className="tracking-widest italic text-zinc-500">
              — 二つのタレが織りなす、至極の京都焼肉 —
            </p>
            <p className="tracking-widest">愛知県名古屋市中区栄4-6-18<br />パールプラザビル2F</p>
            <div className="space-y-3">
              <p className="text-[10px] text-zinc-600 uppercase tracking-[0.4em] font-bold">Contact</p>
              <p className="text-3xl md:text-4xl font-bold tracking-tight text-white hover:text-[#d4af37] transition-colors">
                <a href="tel:0529906329">052-990-6329</a>
              </p>
            </div>
            <p className="text-xs pt-4 opacity-80">
              栄駅 12番出口 徒歩8分<br />
              18:00 〜 翌4:00（金曜 〜24:00 / 水曜定休）
            </p>
          </div>
          <div className="text-[9px] text-zinc-800 tracking-[0.4em] uppercase pt-16 font-sans">
            © 2026 KYOTO YAKINIKU NAOKI.
          </div>
        </div>
      </footer>
    </main>
  );
}

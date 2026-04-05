import Image from 'next/image';
import Link from 'next/link';

export const revalidate = 60;

async function getCMS(endpoint: string) {
  try {
    const res = await fetch(
      `https://${process.env.MICROCMS_SERVICE_DOMAIN}.microcms.io/api/v1/${endpoint}`,
      {
        headers: { 'X-MICROCMS-API-KEY': process.env.MICROCMS_API_KEY || '' },
        next: { revalidate: 60 },
      }
    );
    if (!res.ok) return null;
    return res.json();
  } catch {
    return null;
  }
}

export default async function HomePage() {
  const [shopData, newsData, menuData] = await Promise.all([
    getCMS('shop-info'),
    getCMS('news'),
    getCMS('menu'),
  ]);

  const shop = shopData?.contents?.[0] || null;
  const newsList = newsData?.contents || [];
  const menuList = menuData?.contents || [];

  return (
    <div className="bg-[#0a0805] text-white overflow-x-hidden">

      {/* HERO */}
      <section className="relative min-h-screen flex flex-col overflow-hidden">
        <div className="absolute inset-0">
          <div className="absolute inset-0 bg-gradient-to-b from-[#0a0805] via-[#140f08] to-[#0a0805]" />
        </div>
        <div className="relative z-10 flex flex-col items-center justify-center min-h-[80vh] px-6 pt-8">

          {/* ロゴ：logo_white.png に変更（白文字で暗い背景でも見える） */}
          <div className="relative w-36 h-48 md:w-52 md:h-64 mb-8">
            <div className="absolute inset-0 bg-white/12 rounded-sm" />
            <Image
              src="/logo_white.png"
              alt="京都焼肉なおき"
              fill
              className="object-contain relative z-10"
              priority
            />
          </div>

          <div className="flex items-center gap-4 mb-5">
            <div className="w-10 h-px bg-[#c8a84a]/40" />
            <span className="text-white text-[10px] tracking-[0.6em] font-[var(--font-montserrat)]">
              KYOTO YAKINIKU NAOKI
            </span>
            <div className="w-10 h-px bg-[#c8a84a]/40" />
          </div>

          <h1
            className="text-3xl md:text-5xl font-black leading-tight tracking-wide mb-3 text-center"
            style={{ fontFamily: 'var(--font-noto-serif)', textShadow: '0 2px 30px rgba(0,0,0,0.8)' }}
          >
            京都二十年の技。<br />
            <span className="text-[#c8a84a]">二つのタレ</span>で紡ぐ、<br />
            至高の一皿。
          </h1>
          <p className="text-white/50 text-xs tracking-widest mb-10">
            名古屋・栄　深夜4時まで営業
          </p>
          <div className="flex gap-3 w-full max-w-xs">
            <Link
              href="/reserve"
              className="flex-1 flex items-center justify-center py-4 bg-[#b01020] hover:bg-[#d01828] text-white text-sm font-bold tracking-widest transition-colors active:scale-95"
              style={{ fontFamily: 'var(--font-noto-serif)' }}
            >
              WEB予約
            </Link>
            <Link
              href="/menu"
              className="flex-1 flex items-center justify-center py-4 border border-[#c8a84a]/50 hover:border-[#c8a84a] text-[#c8a84a] text-sm tracking-widest transition-colors active:scale-95"
              style={{ fontFamily: 'var(--font-noto-serif)' }}
            >
              お品書き
            </Link>
          </div>
        </div>

        {/* 横スクロール */}
        <div className="relative z-10 flex gap-1 px-6 pb-8 overflow-x-auto">
          {[
            { src: '/kv_i1.jpg', label: '鮮度抜群' },
            { src: '/kv_i2.jpg', label: 'お一人様歓迎' },
            { src: '/kv_i3.jpg', label: '宴会OK' },
            { src: '/kv_i4.jpg', label: '隠れ家' },
            { src: '/kv_i5.jpg', label: '深夜4時まで' },
          ].map((slide, i) => (
            <div key={i} className="relative flex-shrink-0 w-28 h-36 overflow-hidden rounded-sm">
              <Image src={slide.src} alt={slide.label} fill className="object-cover" />
              <div className="absolute inset-0 bg-gradient-to-t from-black/70 to-transparent" />
              <span className="absolute bottom-2 left-0 right-0 text-center text-[9px] text-white/80 tracking-wide">
                {slide.label}
              </span>
            </div>
          ))}
        </div>
      </section>

      {/* NEWS TICKER */}
      {newsList.length > 0 && (
        <section className="bg-[#c8a84a]/10 border-y border-[#c8a84a]/20 py-3 px-4">
          <div className="flex items-center gap-4 max-w-3xl mx-auto">
            <span className="text-[#c8a84a] text-[10px] tracking-widest shrink-0 border border-[#c8a84a]/40 px-2 py-0.5">
              NEWS
            </span>
            <Link href="/news" className="text-xs text-white/70 tracking-wide truncate hover:text-white transition-colors">
              {newsList[0]?.title}
            </Link>
            <Link href="/news" className="text-[#c8a84a] text-xs tracking-widest shrink-0">→</Link>
          </div>
        </section>
      )}

      {/* OWNER */}
      <section className="py-20 bg-[#140f08]">
        <div className="max-w-4xl mx-auto px-6">
          <div className="flex items-center gap-4 mb-12">
            <div className="w-6 h-px bg-[#c8a84a]/50" />
            <span className="text-[#c8a84a] text-[10px] tracking-[0.4em] font-[var(--font-montserrat)]">OWNER</span>
          </div>
          <div className="grid md:grid-cols-2 gap-10 items-center">
            <div className="relative aspect-[3/4] overflow-hidden">
              <Image src="/tencho.jpg" alt="オーナー 山本直樹" fill className="object-cover object-top" />
              <div className="absolute inset-0 bg-gradient-to-t from-[#140f08]/80 to-transparent" />
              <div className="absolute bottom-4 left-4">
                <p className="text-[10px] tracking-[0.3em] text-[#c8a84a]/70 mb-1">オーナー</p>
                <p className="text-xl font-black tracking-widest text-white" style={{ fontFamily: 'var(--font-noto-serif)' }}>
                  山本 直樹
                </p>
              </div>
            </div>
            <div>
              <p className="text-sm leading-loose text-white/80 mb-6">
                京都で二十年修行を積んだ焼肉職人。
                <br />
                大韶園直伝の秘伝みそダレと、京都焼肉の伝統が生んだ黄金洗いダレ。
                <br />
                この二つのタレで、素材の旨味を最大限に引き出す。
              </p>
              <p className="text-xs text-white/60 tracking-wide">
                「焼肉は、タレではなく、火加減と素材。
                <br />
                そしてお客様との時間。」
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* MENU PREVIEW */}
      {menuList.length > 0 && (
        <section className="py-20 bg-[#0a0805] border-t border-[#c8a84a]/20">
          <div className="max-w-4xl mx-auto px-6">
            <div className="flex items-center gap-4 mb-12">
              <div className="w-6 h-px bg-[#c8a84a]/50" />
              <span className="text-[#c8a84a] text-[10px] tracking-[0.4em] font-[var(--font-montserrat)]">MENU</span>
            </div>
            <div className="grid md:grid-cols-2 gap-8 mb-8">
              {menuList.slice(0, 4).map((item: any) => (
                <div key={item.id} className="border-l border-[#c8a84a]/30 pl-4">
                  <h3 className="text-lg font-bold text-white mb-1">{item.title}</h3>
                  <p className="text-[#c8a84a] text-sm mb-2">
                    {item.price ? `¥${Number(item.price).toLocaleString()}` : '時価'}
                  </p>
                  {item.description && (
                    <p className="text-xs text-white/60">{item.description}</p>
                  )}
                </div>
              ))}
            </div>
            <div className="text-center">
              <Link
                href="/menu"
                className="inline-block px-8 py-3 border border-[#c8a84a]/50 text-[#c8a84a] text-sm tracking-widest hover:bg-[#c8a84a] hover:text-black transition-colors"
              >
                全メニューを見る →
              </Link>
            </div>
          </div>
        </section>
      )}

      {/* FOOTER */}
      <footer className="bg-[#140f08] border-t border-[#c8a84a]/20 py-12 px-6">
        <div className="max-w-4xl mx-auto">
          <div className="grid md:grid-cols-3 gap-8 mb-8">
            <div>
              <p className="text-[#c8a84a] text-[10px] tracking-[0.4em] font-bold mb-4">SHOP INFO</p>
              <p className="text-sm text-white/70 leading-loose">
                {shop?.address || '愛知県名古屋市中区栄4-6-18 パールプラザビル2F'}
              </p>
              <p className="text-sm text-white/70 mt-2">
                {shop?.tel || '052-990-6329'}
              </p>
            </div>
            <div>
              <p className="text-[#c8a84a] text-[10px] tracking-[0.4em] font-bold mb-4">HOURS</p>
              <p className="text-sm text-white/70">
                {shop?.hours || '18:00 - 翌4:00'}
              </p>
              <p className="text-sm text-white/70 mt-2">
                定休日: {shop?.holiday || '水曜日'}
              </p>
            </div>
            <div>
              <p className="text-[#c8a84a] text-[10px] tracking-[0.4em] font-bold mb-4">LINKS</p>
              <div className="space-y-2 text-sm">
                <Link href="/menu" className="text-white/70 hover:text-[#c8a84a] transition-colors">Menu</Link>
                <br />
                <Link href="/reserve" className="text-white/70 hover:text-[#c8a84a] transition-colors">Reserve</Link>
                <br />
                <Link href="/access" className="text-white/70 hover:text-[#c8a84a] transition-colors">Access</Link>
                <br />
                <Link href="/news" className="text-white/70 hover:text-[#c8a84a] transition-colors">News</Link>
              </div>
            </div>
          </div>
          <div className="border-t border-[#c8a84a]/20 pt-8 text-center">
            <p className="text-[10px] text-white/40 tracking-widest">
              © 2026 KYOTO YAKINIKU NAOKI. All rights reserved.
            </p>
          </div>
        </div>
      </footer>

    </div>
  );
}

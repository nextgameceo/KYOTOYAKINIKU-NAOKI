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
    <div className="bg-[#0a0805] text-white overflow-x-hidden washi-texture">

      {/* HERO */}
      <section className="relative min-h-screen flex flex-col overflow-hidden">
        {/* 背景 */}
        <div className="absolute inset-0">
          <div className="absolute inset-0 bg-gradient-to-b from-[#0a0805] via-[#140f08] to-[#0a0805]" />
          <div className="absolute inset-0 opacity-30 washi-texture" />
        </div>

        {/* ロゴ中央配置 */}
        <div className="relative z-10 flex flex-col items-center justify-center min-h-[80vh] px-6 pt-8">
          <div className="relative w-36 h-48 md:w-52 md:h-64 mb-8">
            <Image
              src="/logo.png"
              alt="京都焼肉なおき"
              fill
              className="object-contain drop-shadow-[0_0_40px_rgba(200,168,74,0.25)]"
              priority
            />
          </div>
          <div className="flex items-center gap-4 mb-5">
            <div className="w-10 h-px bg-[#c8a84a]/40" />
            <span className="text-[#c8a84a] text-[10px] tracking-[0.6em] font-[var(--font-montserrat)]">
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

        {/* 横スクロール写真パネル */}
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
              <div className="text-[#c8a84a]/20 text-8xl font-black leading-none mb-2 select-none" style={{ fontFamily: 'var(--font-noto-serif)' }}>
                。
              </div>
              <h2 className="text-2xl md:text-3xl font-black leading-snug mb-6 tracking-wide" style={{ fontFamily: 'var(--font-noto-serif)' }}>
                肉と向き合い続けた<br />
                <span className="text-[#c8a84a]">二十年</span>の積み重ね
              </h2>
              <div className="w-8 h-px bg-[#b01020] mb-6" />
              <p className="text-sm font-light leading-[2.4] text-white/65 mb-6">
                京都の焼肉店で二十年間、肉のカットからタレの配合まで
                徹底的に学んできました。<br /><br />
                なおきでは、そのすべてを名古屋のお客様に届けたい
                という想いで、毎日包丁を握っています。<br /><br />
                一枚の肉に全力を注ぐ。それが私のこだわりです。
              </p>
              <div className="flex items-center gap-4">
                <div className="w-8 h-px bg-[#c8a84a]/40" />
                <p className="text-sm text-white/40 tracking-widest" style={{ fontFamily: 'var(--font-noto-serif)' }}>
                  京都焼肉なおき　オーナー　山本 直樹
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* CONCEPT */}
      <section id="concept" className="py-20 md:py-32">
        <div className="max-w-4xl mx-auto px-6">
          <div className="flex items-center gap-4 mb-12">
            <div className="w-6 h-px bg-[#c8a84a]/50" />
            <span className="text-[#c8a84a] text-[10px] tracking-[0.4em] font-[var(--font-montserrat)]">CONCEPT</span>
          </div>
          <div className="grid md:grid-cols-2 gap-10 items-center">
            <div>
              <h2 className="text-3xl md:text-4xl font-black leading-snug mb-6" style={{ fontFamily: 'var(--font-noto-serif)' }}>
                東新町の長い夜を、<br />
                <span className="text-[#c8a84a]">贅沢</span>に締めくくる
              </h2>
              <div className="w-8 h-px bg-[#b01020] mb-6" />
              <p className="text-sm font-light leading-[2.2] text-white/65 mb-8">
                名古屋市中区、東新町・女子大エリア。栄・新栄町駅から徒歩圏内の
                京都焼肉なおきは、京都二十年の技と秘伝のタレで、
                上質な肉をリーズナブルにご提供しています。<br /><br />
                朝4時まで営業。一人焼肉・デート・宴会・女子会、
                今日の締めくくりにもぜひ。
              </p>
              <div className="bg-[#140f08] border border-[#c8a84a]/20 inline-block px-6 py-4">
                <p className="text-[10px] tracking-widest text-white/40 mb-1">営業時間</p>
                <p className="text-xl font-bold tracking-widest text-[#c8a84a]" style={{ fontFamily: 'var(--font-noto-serif)' }}>
                  18:00 〜 翌4:00
                </p>
                <p className="text-[10px] tracking-widest text-white/30 mt-1">水曜定休</p>
              </div>
            </div>
            <div className="relative aspect-[3/4] overflow-hidden">
              <Image src="/sec2_bgi1.jpg" alt="こだわり" fill className="object-cover" />
              <div className="absolute inset-0 bg-gradient-to-t from-[#0a0805]/60 to-transparent" />
              <div
                className="absolute right-4 top-1/2 -translate-y-1/2 text-white/90 font-black text-xl tracking-widest"
                style={{ writingMode: 'vertical-rl', fontFamily: 'var(--font-noto-serif)', textShadow: '0 2px 15px rgba(0,0,0,0.9)' }}
              >
                一口でわかる、肉の違い。
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* KODAWARI */}
      <section className="py-20 bg-[#140f08]">
        <div className="max-w-4xl mx-auto px-6">
          <div className="flex items-center gap-4 mb-12">
            <div className="w-6 h-px bg-[#c8a84a]/50" />
            <span className="text-[#c8a84a] text-[10px] tracking-[0.4em] font-[var(--font-montserrat)]">KODAWARI</span>
          </div>
          <h2 className="text-3xl md:text-5xl font-black leading-none tracking-tight mb-12" style={{ fontFamily: 'var(--font-noto-serif)' }}>
            語られない<br /><span className="text-[#c8a84a]">ひと手間</span>
          </h2>
          <div className="grid md:grid-cols-3 gap-0 divide-y md:divide-y-0 md:divide-x divide-white/8">
            {[
              { num: '一', label: 'カット', title: '手切りへの徹底', body: '肉は一枚一枚すべて手切り。部位によって切り方を変え、余分な脂は丁寧に取り除きます。' },
              { num: '二', label: '品質', title: '鮮度を守る管理', body: '必要な分だけを解凍して使用。仕入れ直後に丁寧に処理し、鮮やかな色合いの赤身をお出しします。' },
              { num: '三', label: '想い', title: '心を尽くす', body: 'それがなおきの美味しさの基準。素材の力を信じ、丁寧なひと手間を積み重ねます。' },
            ].map(item => (
              <div key={item.num} className="py-8 md:py-0 md:px-8 first:md:pl-0 last:md:pr-0">
                <div className="flex items-center gap-3 mb-4">
                  <span className="text-[#c8a84a] text-2xl font-black" style={{ fontFamily: 'var(--font-noto-serif)' }}>{item.num}</span>
                  <span className="text-[10px] tracking-widest text-white/40 border border-white/15 px-2 py-0.5">{item.label}</span>
                </div>
                <h3 className="text-base font-bold tracking-wide mb-3" style={{ fontFamily: 'var(--font-noto-serif)' }}>{item.title}</h3>
                <p className="text-sm font-light leading-relaxed text-white/55">{item.body}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* MENU */}
      <section id="menu" className="py-20">
        <div className="max-w-4xl mx-auto px-6">
          <div className="flex items-center justify-between mb-12">
            <div className="flex items-center gap-4">
              <div className="w-6 h-px bg-[#c8a84a]/50" />
              <span className="text-[#c8a84a] text-[10px] tracking-[0.4em] font-[var(--font-montserrat)]">MENU</span>
            </div>
            <Link href="/menu" className="text-[11px] text-white/40 tracking-widest hover:text-[#c8a84a] transition-colors">
              お品書きを全て見る →
            </Link>
          </div>
          <h2 className="text-4xl md:text-6xl font-black tracking-widest mb-12 text-center" style={{ fontFamily: 'var(--font-noto-serif)' }}>
            必食<span className="text-[#b01020]">3</span>選
          </h2>
          <div className="flex flex-col gap-0">
            {[
              { img: '/sec3_i1.jpg', name: 'ネギタン塩', price: '1,080', desc: '舌先は薄めに、やわらかい部分は厚めに。手切りならではの一皿。' },
              { img: '/sec3_i2.jpg', name: '赤身3種盛り（塩）', price: '2,420', desc: 'その日仕入れた和牛のみ。贅沢に厚切りで3種類。' },
              { img: '/sec3_i3.jpg', name: 'ミノ湯引き', price: '980', desc: 'てっさをイメージした薄切り。ネギをたっぷり巻いてどうぞ。' },
            ].map((item, i) => (
              <div key={i} className={`flex gap-4 py-6 border-b border-white/8 items-center ${i === 0 ? 'border-t border-white/8' : ''}`}>
                <div className="relative w-20 h-20 md:w-28 md:h-28 flex-shrink-0 overflow-hidden">
                  <Image src={item.img} alt={item.name} fill className="object-cover" />
                </div>
                <div className="flex-1 min-w-0">
                  <h3 className="text-base md:text-xl font-bold tracking-wide mb-1" style={{ fontFamily: 'var(--font-noto-serif)' }}>{item.name}</h3>
                  <p className="text-xs text-white/50 leading-relaxed mb-2">{item.desc}</p>
                  <p className="text-[#c8a84a] font-bold tracking-widest">¥{item.price}</p>
                </div>
              </div>
            ))}
          </div>

          {/* 御品書（microCMS） */}
          {menuList.length > 0 && (
            <div className="mt-16">
              <div className="flex items-center gap-4 mb-8">
                <div className="w-6 h-px bg-[#c8a84a]/50" />
                <h3 className="text-xl font-bold tracking-widest text-[#c8a84a]" style={{ fontFamily: 'var(--font-noto-serif)' }}>
                  御品書
                </h3>
                <div className="flex-1 h-px bg-[#c8a84a]/20" />
              </div>
              <div className="flex flex-col gap-0 divide-y divide-white/8">
                {menuList.slice(0, 6).map((item: { id: string; name: string; price: number; description: string; image?: { url: string } }) => (
                  <div key={item.id} className="flex gap-4 py-5 items-center">
                    {item.image?.url && (
                      <div className="relative w-16 h-16 flex-shrink-0 overflow-hidden">
                        <Image src={item.image.url} alt={item.name} fill className="object-cover" />
                      </div>
                    )}
                    <div className="flex-1 min-w-0">
                      <div className="flex justify-between items-baseline gap-2">
                        <h4 className="text-sm font-semibold tracking-wide truncate" style={{ fontFamily: 'var(--font-noto-serif)' }}>{item.name}</h4>
                        <span className="text-[#c8a84a] text-sm tracking-widest shrink-0">¥{item.price?.toLocaleString()}</span>
                      </div>
                      {item.description && (
                        <p className="text-xs text-white/45 mt-1 leading-relaxed line-clamp-1">{item.description}</p>
                      )}
                    </div>
                  </div>
                ))}
              </div>
              {menuList.length > 6 && (
                <div className="text-center mt-6">
                  <Link href="/menu" className="inline-flex items-center gap-2 border border-[#c8a84a]/30 hover:border-[#c8a84a] text-[#c8a84a] text-xs tracking-widest px-8 py-3 transition-colors">
                    全てのお品書きを見る →
                  </Link>
                </div>
              )}
            </div>
          )}

          <div className="text-center mt-10">
            <Link href="/menu" className="inline-flex items-center gap-3 border border-white/20 hover:border-[#c8a84a] text-white hover:text-[#c8a84a] text-sm tracking-widest px-10 py-4 transition-all group" style={{ fontFamily: 'var(--font-noto-serif)' }}>
              フルメニューを見る<span className="group-hover:translate-x-1 transition-transform">→</span>
            </Link>
          </div>
        </div>
      </section>

      {/* TARE — How to Enjoy */}
      <section className="py-20 bg-[#0a0805]">
        <div className="max-w-4xl mx-auto px-6">
          <div className="flex items-center gap-4 mb-4">
            <div className="w-6 h-px bg-[#c8a84a]/50" />
            <span className="text-[#c8a84a] text-[10px] tracking-[0.4em] font-[var(--font-montserrat)]">HOW TO ENJOY</span>
          </div>
          <h2 className="text-3xl font-black tracking-widest mb-2" style={{ fontFamily: 'var(--font-noto-serif)' }}>
            こだわりのタレ
          </h2>
          <p className="text-sm text-white/45 font-light leading-relaxed mb-12">
            Selected meats, enjoy them with your favorite sauce
          </p>

          <div className="flex flex-col gap-0 divide-y divide-white/8">
            {/* Yakiniku Sauce */}
            <div className="grid grid-cols-[100px_1fr] md:grid-cols-[140px_1fr] gap-6 py-8 items-center">
              <div className="relative aspect-square overflow-hidden rounded-full border border-[#c8a84a]/20">
                <Image src="/yannninnjyann.jpg" alt="Yakiniku Sauce" fill className="object-cover" />
              </div>
              <div>
                <p className="text-[10px] tracking-widest text-[#b01020] mb-1 font-[var(--font-montserrat)]">01</p>
                <h3 className="text-xl font-black tracking-wide mb-2" style={{ fontFamily: 'var(--font-noto-serif)' }}>
                  Yakiniku Sauce
                </h3>
                <p className="text-xs text-[#c8a84a] tracking-widest mb-2">秘伝みそダレ</p>
                <p className="text-sm font-light leading-relaxed text-white/60">
                  Secret miso sauce. These meats are already seasoned.<br />
                  Add more sauce from the pot if you like.
                </p>
              </div>
            </div>

            {/* Dipping Sauce */}
            <div className="grid grid-cols-[100px_1fr] md:grid-cols-[140px_1fr] gap-6 py-8 items-center">
              <div className="relative aspect-square overflow-hidden rounded-full border border-[#c8a84a]/20">
                <Image src="/sec3-popup_i2.jpg" alt="Dipping Sauce" fill className="object-cover" />
              </div>
              <div>
                <p className="text-[10px] tracking-widest text-[#b01020] mb-1 font-[var(--font-montserrat)]">02</p>
                <h3 className="text-xl font-black tracking-wide mb-2" style={{ fontFamily: 'var(--font-noto-serif)' }}>
                  Dipping Sauce
                </h3>
                <p className="text-xs text-[#c8a84a] tracking-widest mb-2">自家製洗いダレ</p>
                <p className="text-sm font-light leading-relaxed text-white/60">
                  For a lighter change of flavor, rinse off the excess fat<br />
                  and enjoy with grated daikon radish.
                </p>
              </div>
            </div>

            {/* Black Tare */}
            <div className="grid grid-cols-[100px_1fr] md:grid-cols-[140px_1fr] gap-6 py-8 items-center">
              <div className="relative aspect-square overflow-hidden rounded-full border border-[#c8a84a]/20">
                <Image src="/sec3-popup_i3.jpg" alt="Black Tare" fill className="object-cover" />
              </div>
              <div>
                <p className="text-[10px] tracking-widest text-[#b01020] mb-1 font-[var(--font-montserrat)]">03</p>
                <h3 className="text-xl font-black tracking-wide mb-2" style={{ fontFamily: 'var(--font-noto-serif)' }}>
                  Black Tare
                </h3>
                <p className="text-xs text-[#c8a84a] tracking-widest mb-2">ヤンニンジャン</p>
                <p className="text-sm font-light leading-relaxed text-white/60">
                  Spicy Umami Sauce (Yanninnjan)<br />
                  Perfect with miso sauce.
                </p>
              </div>
            </div>

            {/* Red Tare */}
            <div className="grid grid-cols-[100px_1fr] md:grid-cols-[140px_1fr] gap-6 py-8 items-center">
              <div className="relative aspect-square overflow-hidden rounded-full border border-[#c8a84a]/20">
                <Image src="/sec3-popup_i5.jpg" alt="Red Tare" fill className="object-cover" />
              </div>
              <div>
                <p className="text-[10px] tracking-widest text-[#b01020] mb-1 font-[var(--font-montserrat)]">04</p>
                <h3 className="text-xl font-black tracking-wide mb-2" style={{ fontFamily: 'var(--font-noto-serif)' }}>
                  Red Tare
                </h3>
                <p className="text-xs text-[#c8a84a] tracking-widest mb-2">プッコチ醤油ダレ</p>
                <p className="text-sm font-light leading-relaxed text-white/60">
                  Ppukkochi Sauce (Korean green chili pepper soy sauce)<br />
                  A spicy kick you will get addicted to.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* COURSE */}
      <section className="py-20 bg-[#140f08]">
        <div className="max-w-4xl mx-auto px-6">
          <div className="flex items-center gap-4 mb-12">
            <div className="w-6 h-px bg-[#c8a84a]/50" />
            <span className="text-[#c8a84a] text-[10px] tracking-[0.4em] font-[var(--font-montserrat)]">COURSE</span>
          </div>
          <h2 className="text-2xl font-black tracking-widest mb-2" style={{ fontFamily: 'var(--font-noto-serif)' }}>
            コース・セットメニュー
          </h2>
          <p className="text-sm text-white/45 font-light mb-10">貸切対応可（要相談）　2名様〜</p>

          <div className="flex flex-col gap-4">
            {/* おひとり様セット */}
            <div className="border border-white/10 overflow-hidden hover:border-[#c8a84a]/30 transition-colors group">
              <div className="relative aspect-video overflow-hidden">
                <Image src="/sec4_i2.jpg" alt="おひとり様セット" fill sizes="100vw" className="object-cover group-hover:scale-105 transition-transform duration-500" />
                <div className="absolute inset-0 bg-gradient-to-t from-black/70 to-transparent" />
                <div className="absolute bottom-3 left-4">
                  <span className="bg-[#b01020] text-white text-[9px] tracking-widest px-2 py-0.5">お一人様</span>
                </div>
              </div>
              <div className="p-5">
                <div className="flex justify-between items-start mb-2">
                  <h3 className="text-base font-bold tracking-wide" style={{ fontFamily: 'var(--font-noto-serif)' }}>
                    おひとり様セット
                  </h3>
                  <span className="text-[#c8a84a] text-sm tracking-widest shrink-0 ml-4">各 2,000円</span>
                </div>
                <p className="text-xs text-white/50 leading-relaxed mb-4">
                  塩・タレ・おまかせの3種類からお選びいただけます。初めての方にもおすすめ。
                </p>
                <div className="grid grid-cols-3 gap-2">
                  {[['A', '塩焼き'], ['B', '赤身タレ'], ['C', 'おまかせ']].map(([id, label]) => (
                    <div key={id} className="text-center border border-white/10 py-2 px-1">
                      <p className="text-[9px] text-white/30 tracking-wider mb-0.5">SET {id}</p>
                      <p className="text-xs text-white/70 tracking-wide">{label}</p>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* 宴会コース */}
            <div className="border border-white/10 overflow-hidden hover:border-[#c8a84a]/30 transition-colors group">
              <div className="relative aspect-video overflow-hidden">
                <Image src="/sec6_i1.jpg" alt="宴会コース" fill sizes="100vw" className="object-cover group-hover:scale-105 transition-transform duration-500" />
                <div className="absolute inset-0 bg-gradient-to-t from-black/70 to-transparent" />
                <div className="absolute bottom-3 left-4">
                  <span className="bg-[#b01020] text-white text-[9px] tracking-widest px-2 py-0.5">宴会・貸切</span>
                </div>
              </div>
              <div className="p-5">
                <div className="flex justify-between items-start mb-2">
                  <h3 className="text-base font-bold tracking-wide" style={{ fontFamily: 'var(--font-noto-serif)' }}>
                    宴会コース（飲み放題付き）
                  </h3>
                  <span className="text-[#c8a84a] text-sm tracking-widest shrink-0 ml-4">4,000円〜</span>
                </div>
                <p className="text-xs text-white/50 leading-relaxed mb-4">
                  2名様から貸切OK。飲み放題付きのコースで宴会・女子会・歓送迎会などに。<br />
                  詳細はお電話またはWEB予約にてご相談ください。
                </p>
                <div className="grid grid-cols-2 gap-2">
                  {[['スタンダード', '4,000円/人'], ['プレミアム', '5,500円/人']].map(([label, price]) => (
                    <div key={label} className="text-center border border-white/10 py-3 px-2">
                      <p className="text-[9px] text-white/30 tracking-wider mb-1">{label}</p>
                      <p className="text-sm font-bold text-[#c8a84a]">{price}</p>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>

          <p className="text-[10px] text-white/30 tracking-widest text-center mt-6">
            ※価格は全て税込みです。詳細はお電話にてご確認ください。
          </p>
        </div>
      </section>

      {/* KUUKAN */}
      <section className="py-20">
        <div className="max-w-4xl mx-auto px-6">
          <div className="flex items-center gap-4 mb-12">
            <div className="w-6 h-px bg-[#c8a84a]/50" />
            <span className="text-[#c8a84a] text-[10px] tracking-[0.4em] font-[var(--font-montserrat)]">SPACE</span>
          </div>
          <div className="relative aspect-[16/9] overflow-hidden mb-8">
            <Image src="/sec6_para.jpg" alt="店内" fill sizes="100vw" className="object-cover opacity-70" />
            <div className="absolute inset-0 bg-gradient-to-t from-[#0a0805]/80 to-transparent" />
            <div
              className="absolute right-6 top-1/2 -translate-y-1/2 text-white font-black text-2xl md:text-4xl tracking-widest"
              style={{ writingMode: 'vertical-rl', fontFamily: 'var(--font-noto-serif)', textShadow: '0 2px 20px rgba(0,0,0,0.9)' }}
            >
              店内のご案内
            </div>
          </div>
          <div className="grid grid-cols-2 gap-4">
            {[
              { img: '/sec6_i2.jpg', tag: 'グループに', name: 'テーブル席', desc: '4名様・7名様卓あり' },
              { img: '/sec6_i3.jpg', tag: '一人焼肉に', name: 'カウンター', desc: '目の前で焼く特等席3席' },
            ].map(item => (
              <div key={item.name} className="group">
                <div className="relative aspect-[4/3] overflow-hidden mb-3">
                  <Image src={item.img} alt={item.name} fill sizes="50vw" className="object-cover group-hover:scale-105 transition-transform duration-500" />
                  <div className="absolute top-2 left-2">
                    <span className="bg-[#b01020] text-white text-[9px] tracking-widest px-2 py-0.5">{item.tag}</span>
                  </div>
                </div>
                <h3 className="text-sm font-bold tracking-wide mb-0.5" style={{ fontFamily: 'var(--font-noto-serif)' }}>{item.name}</h3>
                <p className="text-xs text-white/45">{item.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* NEWS */}
      <section id="news" className="py-20 bg-[#140f08]">
        <div className="max-w-4xl mx-auto px-6">
          <div className="flex items-center justify-between mb-10">
            <div className="flex items-center gap-4">
              <div className="w-6 h-px bg-[#c8a84a]/50" />
              <span className="text-[#c8a84a] text-[10px] tracking-[0.4em] font-[var(--font-montserrat)]">NEWS</span>
            </div>
            <Link href="/news" className="text-[11px] text-white/40 tracking-widest hover:text-[#c8a84a] transition-colors">
              すべて見る →
            </Link>
          </div>
          <div className="divide-y divide-white/8">
            {newsList.length > 0 ? newsList.slice(0, 4).map((item: { id: string; title: string; publishedAt: string; category: string }) => (
              <Link key={item.id} href={`/news/${item.id}`} className="flex gap-4 items-baseline py-5 hover:opacity-70 transition-opacity">
                <span className="text-[10px] text-white/30 tracking-widest whitespace-nowrap font-[var(--font-montserrat)]">
                  {new Date(item.publishedAt).toLocaleDateString('ja-JP', { year: 'numeric', month: '2-digit', day: '2-digit' }).replaceAll('/', '.')}
                </span>
                <span className={`text-[9px] tracking-widest px-2 py-0.5 whitespace-nowrap shrink-0 ${item.category === 'blog' ? 'bg-[#c8a84a]/70 text-[#0a0805]' : 'bg-[#b01020] text-white'}`}>
                  {item.category === 'blog' ? 'ブログ' : 'お知らせ'}
                </span>
                <span className="text-sm font-light tracking-wide leading-relaxed text-white/80">{item.title}</span>
              </Link>
            )) : (
              <p className="py-8 text-center text-white/30 text-sm tracking-widest">お知らせはありません</p>
            )}
          </div>
        </div>
      </section>

      {/* REVIEW */}
      <section className="py-20">
        <div className="max-w-4xl mx-auto px-6">
          <div className="border border-[#c8a84a]/20 bg-[#140f08] p-8 md:p-12 text-center">
            <div className="text-[#c8a84a] text-3xl mb-4 tracking-widest">★★★★★</div>
            <p className="text-sm text-white/55 leading-[2] italic mb-8 max-w-md mx-auto">
              迫力のある見た目と鮮度の高さ、秘伝のタレが忘れられません。深夜まで営業しているので仕事帰りにも重宝しています。
            </p>
            <a
              href="https://maps.google.com/?cid=16336924147757665245"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 border border-[#c8a84a]/40 hover:border-[#c8a84a] text-[#c8a84a] text-xs tracking-[0.3em] px-8 py-3 transition-colors"
            >
              Googleレビューを見る →
            </a>
          </div>
        </div>
      </section>

      {/* ACCESS */}
      <section id="access" className="py-20 bg-[#f0ebe0] text-[#1a1208]">
        <div className="max-w-4xl mx-auto px-6">
          <div className="flex items-center gap-4 mb-12">
            <div className="w-6 h-px bg-[#b01020]/50" />
            <span className="text-[#b01020] text-[10px] tracking-[0.4em] font-[var(--font-montserrat)]">ACCESS</span>
          </div>
          <h2 className="text-3xl font-black tracking-widest mb-10" style={{ fontFamily: 'var(--font-noto-serif)' }}>
            アクセス
          </h2>
          <div className="grid md:grid-cols-2 gap-8">
            <div>
              <table className="w-full text-sm">
                <tbody className="divide-y divide-black/10">
                  {[
                    ['店名', shop?.name ?? '京都焼肉なおき'],
                    ['住所', shop?.address ?? '愛知県名古屋市中区栄4-6-18 パールプラザビル2F'],
                    ['アクセス', shop?.access ?? '地下鉄栄駅より徒歩8分'],
                    ['電話', shop?.tel ?? '052-990-6329'],
                    ['営業時間', shop?.hours ?? '18:00〜翌4:00'],
                    ['定休日', shop?.holiday ?? '水曜日'],
                  ].map(([label, value]) => (
                    <tr key={label}>
                      <td className="py-3 pr-4 font-semibold text-[#b01020] tracking-widest whitespace-nowrap w-1/4 align-top text-xs">{label}</td>
                      <td className="py-3 font-light leading-relaxed text-[#3a2e22] text-sm">{value}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
              <a
                href="tel:052-990-6329"
                className="mt-6 flex items-center justify-center gap-2 bg-[#b01020] text-white py-4 text-sm font-bold tracking-widest hover:bg-[#d01828] transition-colors"
                style={{ fontFamily: 'var(--font-noto-serif)' }}
              >
                052-990-6329
              </a>
            </div>
            <div className="aspect-square overflow-hidden border border-black/10">
              <iframe
                src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d812.9!2d136.91404!3d35.16868!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x60037a0fee0c8b8b%3A0xe2b8e9f4a59dcbdd!2z5Lqs6YO96Zmc56iy44Gq44GK44GN!5e0!3m2!1sja!2sjp!4v1742000000000"
                width="100%"
                height="100%"
                loading="lazy"
                className="border-0 w-full h-full"
              />
            </div>
          </div>
        </div>
      </section>

      {/* FOOTER */}
      <footer className="bg-[#0a0805] border-t border-[#c8a84a]/15 py-10">
        <div className="max-w-4xl mx-auto px-6">
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6 mb-6">
            <div>
              <div className="text-[#c8a84a] text-xl font-black tracking-widest mb-1" style={{ fontFamily: 'var(--font-noto-serif)' }}>
                京都焼肉なおき
              </div>
              <p className="text-[10px] text-white/25 tracking-widest">愛知県名古屋市中区栄4-6-18 パールプラザビル2F</p>
            </div>
            <div className="flex flex-col gap-2">
              {[
                { href: 'https://www.instagram.com/yakinikunaoki?igsh=MW85ejY1NGpjMmV4Yg==', label: 'Instagram' },
                { href: 'https://retty.me/area/PRE23/ARE63/SUB6304/100001788734/', label: 'Retty' },
                { href: 'https://maps.google.com/?cid=16336924147757665245', label: 'Googleマップ' },
              ].map(link => (
                <a key={link.href} href={link.href} target="_blank" rel="noopener noreferrer" className="text-xs text-white/35 hover:text-[#c8a84a] tracking-widest transition-colors">
                  {link.label} →
                </a>
              ))}
            </div>
          </div>
          <div className="border-t border-white/8 pt-6">
            <p className="text-[10px] text-white/20 tracking-widest text-center">
              2025 京都焼肉なおき All Rights Reserved.
            </p>
          </div>
        </div>
      </footer>

    </div>
  );
}

import Image from 'next/image';
import Link from 'next/link';
import { getNewsList, getMenuList, getShopInfo } from '@/lib/microcms';

export const revalidate = 60;

export default async function HomePage() {
  const [newsRes, menuRes, shopInfo] = await Promise.all([
    getNewsList(5),
    getMenuList(),
    getShopInfo(),
  ]);
  const newsList = newsRes.contents;
  const menuList = menuRes.contents;

  return (
    <div className="bg-[#0a0a0a] text-white">

      {/* ── HERO ── */}
      <section className="relative h-screen flex overflow-hidden">
        {/* 5-panel slide */}
        {['kv_i1.jpg','kv_i2.jpg','kv_i3.jpg','kv_i4.jpg','kv_i5.jpg'].map((img, i) => (
          <div
            key={i}
            className="relative flex-1 overflow-hidden group transition-all duration-700 ease-in-out hover:flex-[2]"
          >
            <Image
              src={`/${img}`}
              alt="なおき"
              fill
              className="object-cover group-hover:scale-105 transition-transform duration-700"
              priority={i === 0}
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/10 to-transparent" />
          </div>
        ))}
        {/* Center text overlay */}
        <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none">
          <p className="text-[#c8a84a] text-xs tracking-[0.5em] mb-4 font-[var(--font-montserrat)]">
            Kyoto Yakiniku Naoki
          </p>
          <h1
            className="text-6xl md:text-8xl font-black tracking-widest"
            style={{ fontFamily: 'var(--font-noto-serif)' }}
          >
            なおき
          </h1>
          <p className="text-white/60 text-xs tracking-[0.4em] mt-4">SAKAE · NAGOYA</p>
          <div className="w-10 h-[1px] bg-[#c8a84a] my-6" />
          <p className="text-white/70 text-sm tracking-widest">
            京都二十年の技　秘伝のタレで紡ぐ、夜の一皿
          </p>
        </div>
      </section>

      {/* ── CONCEPT ── */}
      <section id="concept" className="grid md:grid-cols-2 min-h-screen">
        <div className="relative overflow-hidden min-h-[50vh]">
          <Image src="/sec2_bgi1.jpg" alt="こだわり" fill className="object-cover opacity-80" />
          <div className="absolute inset-0 bg-gradient-to-r from-black/20 to-black/60" />
          <div className="absolute right-8 top-1/2 -translate-y-1/2 writing-mode-vertical text-white text-3xl md:text-5xl font-black tracking-widest"
            style={{ writingMode: 'vertical-rl', fontFamily: 'var(--font-noto-serif)' }}>
            一口でわかる、肉の違い。
          </div>
        </div>
        <div className="flex flex-col justify-center px-8 md:px-16 py-20 bg-[#f0ebe0] text-[#1a1208]">
          <span className="inline-block bg-[#b01020] text-white text-xs tracking-widest px-3 py-1 mb-4">
            About
          </span>
          <h2 className="text-3xl md:text-5xl font-black leading-tight mb-6" style={{ fontFamily: 'var(--font-noto-serif)' }}>
            東新町の長い夜を、<br />
            <span className="text-[#b01020]">贅沢</span>に締めくくる
          </h2>
          <div className="w-10 h-0.5 bg-[#b01020] mb-6" />
          <p className="text-sm font-light leading-relaxed text-[#3a2e22] mb-8">
            名古屋市中区、東新町・女子大エリア。「栄」「新栄町駅」から徒歩圏内の「京都焼肉なおき」は、アラカルトやコースで上質な肉をリーズナブルにご提供している焼肉屋です。<br /><br />
            朝4時まで営業していますので、一人焼肉やデート、ご宴会、女子会などの他、"今日の〆は焼肉"といった贅沢な一日の締めくくりにもぜひ。
          </p>
          <div className="bg-[#1a1208] text-white inline-block px-6 py-4">
            <p className="text-xs tracking-widest text-white/50 mb-1">営業時間</p>
            <p className="text-2xl font-bold tracking-widest" style={{ fontFamily: 'var(--font-noto-serif)' }}>
              18:00 〜 翌4:00
            </p>
          </div>
        </div>
      </section>

      {/* ── MENU HIGHLIGHTS ── */}
      <section id="menu" className="py-24 bg-[#0d0a05]">
        <div className="max-w-6xl mx-auto px-6">
          <div className="text-center mb-16">
            <span className="inline-block bg-[#b01020] text-white text-xs tracking-widest px-3 py-1 mb-4">
              Our Menu
            </span>
            <h2 className="text-4xl md:text-6xl font-black tracking-widest" style={{ fontFamily: 'var(--font-noto-serif)' }}>
              必食<span className="text-[#b01020]">3</span>選
            </h2>
            <p className="text-white/40 text-xs tracking-widest mt-3">※価格は全て税込みです。</p>
          </div>
          {/* Hisshoku items */}
          {[
            { name: 'ネギタン塩', price: '1,080円', img: '/sec3_i1.jpg', desc: 'スタッフおすすめの、不動の人気メニューです。食感が硬めの舌先は薄めに、お尻のやわらかい部分は厚めにカット。' },
            { name: '赤身3種盛り（塩）', price: '2,420円', img: '/sec3_i2.jpg', desc: 'その日の仕入れによって部位は変わりますが、肉質のやわらかい和牛のみの盛り合わせです。' },
            { name: 'ミノ湯引き', price: '980円', img: '/sec3_i3.jpg', desc: 'てっさをイメージした薄切りのミノは、肉とは思えない食感に驚いていただけること間違いなし。' },
          ].map((item, i) => (
            <div key={i} className={`grid md:grid-cols-2 min-h-[60vh] ${i % 2 !== 0 ? 'md:flex-row-reverse' : ''}`}>
              <div className={`relative overflow-hidden ${i % 2 !== 0 ? 'md:order-2' : ''}`}>
                <Image src={item.img} alt={item.name} fill className="object-cover" />
              </div>
              <div className={`flex flex-col justify-center px-8 md:px-16 py-16 bg-[#0d0a05] ${i % 2 !== 0 ? 'md:order-1' : ''}`}>
                <h3 className="text-3xl md:text-4xl font-bold tracking-widest mb-2" style={{ fontFamily: 'var(--font-noto-serif)' }}>
                  {item.name}
                </h3>
                <p className="text-xl text-white/70 tracking-widest mb-6">{item.price}</p>
                <p className="text-sm font-light leading-relaxed text-white/65">{item.desc}</p>
              </div>
            </div>
          ))}

          {/* microCMS menu items */}
          {menuList.length > 0 && (
            <div className="mt-16">
              <h3 className="text-center text-2xl font-bold tracking-widest mb-8 text-[#c8a84a]" style={{ fontFamily: 'var(--font-noto-serif)' }}>
                フードメニュー
              </h3>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-px bg-white/5">
                {menuList.map(item => (
                  <div key={item.id} className="bg-[#0a0a0a] p-6">
                    {item.image && (
                      <div className="relative aspect-square mb-4 overflow-hidden">
                        <Image src={item.image.url} alt={item.name} fill className="object-cover" />
                      </div>
                    )}
                    <p className="text-sm font-semibold tracking-wide mb-1">{item.name}</p>
                    <p className="text-xs text-white/50">{item.description}</p>
                    <p className="text-[#c8a84a] font-bold mt-2 tracking-widest">¥{item.price.toLocaleString()}</p>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </section>

      {/* ── NEWS ── */}
      <section className="py-20 bg-[#080604]">
        <div className="max-w-3xl mx-auto px-6">
          <div className="flex justify-between items-end mb-10">
            <div>
              <p className="text-xs tracking-[0.3em] text-white/40 mb-1">NEWS</p>
              <h2 className="text-3xl font-bold tracking-widest" style={{ fontFamily: 'var(--font-noto-serif)' }}>
                お知らせ
              </h2>
            </div>
            <Link href="/#news" className="text-xs text-[#c8a84a] tracking-widest border-b border-[#c8a84a]/30 hover:border-[#c8a84a] transition-colors">
              すべて見る →
            </Link>
          </div>
          <div className="divide-y divide-white/8">
            {newsList.length > 0 ? newsList.map(item => (
              <div key={item.id} className="flex gap-6 items-baseline py-4 hover:opacity-70 transition-opacity cursor-pointer">
                <span className="text-xs text-white/40 tracking-widest whitespace-nowrap font-[var(--font-montserrat)]">
                  {new Date(item.publishedAt).toLocaleDateString('ja-JP')}
                </span>
                <span className={`text-[10px] tracking-widest px-2 py-0.5 whitespace-nowrap ${item.category === 'blog' ? 'bg-[#c8a84a]/80 text-[#0a0a0a]' : 'bg-[#b01020] text-white'}`}>
                  {item.category === 'blog' ? 'ブログ' : 'お知らせ'}
                </span>
                <span className="text-sm font-light tracking-wide">{item.title}</span>
              </div>
            )) : (
              <p className="text-white/30 text-sm py-8 text-center tracking-widest">お知らせはありません</p>
            )}
          </div>
        </div>
      </section>

      {/* ── ACCESS ── */}
      <section id="access" className="py-20 bg-[#f0ebe0] text-[#1a1208]">
        <div className="max-w-5xl mx-auto px-6">
          <div className="mb-12">
            <span className="inline-block bg-[#b01020] text-white text-xs tracking-widest px-3 py-1 mb-4">
              Access & Map
            </span>
            <h2 className="text-4xl font-black tracking-widest" style={{ fontFamily: 'var(--font-noto-serif)' }}>
              アクセス
            </h2>
          </div>
          <div className="grid md:grid-cols-2 gap-12">
            <table className="w-full text-sm">
              <tbody className="divide-y divide-black/10">
                {[
                  ['店名', shopInfo?.name ?? '京都焼肉なおき'],
                  ['住所', shopInfo?.address ?? '愛知県名古屋市中区栄4-6-18 パールプラザビル2F'],
                  ['アクセス', shopInfo?.access ?? '地下鉄栄駅より徒歩8分・新栄町駅徒歩圏内'],
                  ['電話', shopInfo?.tel ?? '052-990-6329'],
                  ['営業時間', shopInfo?.hours ?? '月火木〜日：18:00〜翌4:00 / 金：18:00〜24:00'],
                  ['定休日', shopInfo?.holiday ?? '水曜日'],
                ].map(([label, value]) => (
                  <tr key={label}>
                    <td className="py-3 pr-4 font-semibold text-[#b01020] tracking-widest whitespace-nowrap w-1/3">{label}</td>
                    <td className="py-3 font-light leading-relaxed text-[#3a2e22]">{value}</td>
                  </tr>
                ))}
              </tbody>
            </table>
            <div className="aspect-square overflow-hidden border border-black/10">
              <iframe
                src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d812.9!2d136.91404!3d35.16868!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x60037a0fee0c8b8b%3A0xe2b8e9f4a59dcbdd!2z5Lqs6YO96Zmc56iy44Gq44GK44GN!5e0!3m2!1sja!2sjp!4v1742000000000"
                width="100%" height="100%" loading="lazy" className="border-0"
              />
            </div>
          </div>
        </div>
      </section>

    </div>
  );
}

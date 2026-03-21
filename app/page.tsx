import React from 'react';
import Image from 'next/image';
import Link from 'next/link';

export const revalidate = 60;

// microCMSデータ取得関数
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
  // 並列データ取得（shop-info, news, menu）
  const [shopData, newsData, menuData] = await Promise.all([
    getCMS('shop-info'),
    getCMS('news'),
    getCMS('menu'),
  ]);

  const shop = shopData?.contents?.[0] || null;
  const newsList = newsData?.contents || [];
  const menuList = menuData?.contents || [];

  return (
    <div className="bg-[#0a0a0a] text-white overflow-x-hidden selection:bg-[#c8a84a] selection:text-black">

      {/* --- HERO SECTION: HOVER ACCORDION --- */}
      <section className="relative h-screen flex overflow-hidden border-b border-white/5">
        {[
          { src: '/kv_i1.jpg', label: '迫力満点！', sub: '鮮度抜群！' },
          { src: '/kv_i2.jpg', label: 'お一人様', sub: '大歓迎' },
          { src: '/kv_i3.jpg', label: '宴会にも', sub: 'ぴったり' },
          { src: '/kv_i4.jpg', label: '2階にある', sub: '隠れ家焼肉' },
          { src: '/kv_i5.jpg', label: 'ここでしか', sub: '食べられない逸品' },
        ].map((slide, i) => (
          <div key={i} className="relative flex-1 overflow-hidden group transition-[flex] duration-700 ease-in-out hover:flex-[2.5] cursor-pointer border-r border-white/5">
            <Image src={slide.src} alt={slide.label} fill sizes="20vw" className="object-cover group-hover:scale-110 transition-transform duration-1000" priority={i === 0} />
            <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/20 to-transparent" />
            <div className="absolute bottom-12 left-0 right-0 px-3 text-center">
              <p className="text-white font-black leading-tight text-sm tracking-[0.2em] drop-shadow-2xl" style={{ writingMode: 'vertical-rl', margin: '0 auto' }}>
                <span className="text-[#c8a84a] mb-2">{slide.label}</span><br />{slide.sub}
              </p>
            </div>
          </div>
        ))}

        {/* CENTER LOGO OVERLAY */}
        <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none">
          <div className="bg-black/60 backdrop-blur-md px-10 py-8 text-center border border-white/10 shadow-2xl">
            <p className="text-[#c8a84a] text-[10px] tracking-[0.8em] mb-4 uppercase">Kyoto Yakiniku</p>
            <div className="relative w-20 h-24 mx-auto mb-4">
              <Image src="/logo.png" alt="なおき" fill className="object-contain" />
            </div>
            <p className="text-white/70 text-[10px] tracking-[0.5em] mb-6">SAKAE · NAGOYA</p>
            <div className="w-10 h-px bg-[#c8a84a] mx-auto mb-6" />
            <p className="text-white/80 text-xs tracking-[0.3em] leading-relaxed hidden md:block font-serif">
              京都二十年の技<br />秘伝のタレで紡ぐ、夜の一皿
            </p>
          </div>
        </div>

        {/* SCROLL INDICATOR */}
        <div className="absolute bottom-10 left-1/2 -translate-x-1/2 flex flex-col items-center gap-4 pointer-events-none">
          <span className="text-white/30 text-[9px] tracking-[0.6em] uppercase">Scroll</span>
          <div className="w-px h-16 bg-gradient-to-b from-[#c8a84a] to-transparent animate-bounce" />
        </div>
      </section>

      {/* --- CONCEPT SECTION --- */}
      <section id="concept" className="grid md:grid-cols-2 min-h-screen">
        <div className="relative min-h-[60vh] md:min-h-screen overflow-hidden">
          <Image src="/sec2_bgi1.jpg" alt="こだわり" fill sizes="50vw" className="object-cover" />
          <div className="absolute inset-0 bg-gradient-to-r from-transparent to-black/60" />
          <div className="absolute right-10 top-1/2 -translate-y-1/2 text-white font-black text-3xl md:text-5xl leading-tight tracking-[0.3em]" style={{ writingMode: 'vertical-rl' }}>
            一口でわかる、肉の違い。
          </div>
          <div className="absolute left-8 bottom-10 text-white/50 text-[10px] tracking-[0.4em] uppercase">Est. 2025 in Nagoya</div>
        </div>
        <div className="flex flex-col justify-center px-10 md:px-20 py-24 bg-[#f4f1ea] text-[#1a1208]">
          <span className="inline-block bg-[#b01020] text-white text-[9px] tracking-[0.3em] px-4 py-1.5 mb-8 w-fit uppercase font-bold">About Naoki</span>
          <h2 className="text-4xl md:text-5xl font-black leading-[1.4] mb-8 font-serif">
            東新町の長い夜を、<br /><span className="text-[#b01020]">贅沢</span>に締めくくる
          </h2>
          <div className="w-12 h-1 bg-[#b01020] mb-10" />
          <p className="text-sm md:text-base font-medium leading-[2.4] text-[#3a2e22] mb-12 max-w-lg">
            名古屋市中区、東新町・女子大エリア。栄・新栄町駅から徒歩圏内の京都焼肉なおきは、アラカルトやコースで上質な肉をリーズナブルにご提供している焼肉屋です。朝4時まで営業していますので、一人焼肉やデート、ご宴会、女子会などの他、今日の締めくくりにもぜひ。
          </p>
          <div className="bg-[#1a1208] text-white p-8 w-full md:w-fit shadow-xl border-l-4 border-[#b01020]">
            <p className="text-[10px] tracking-[0.3em] text-white/40 mb-2 uppercase">Business Hours</p>
            <p className="text-3xl font-bold tracking-widest font-serif">18:00 〜 翌4:00</p>
          </div>
        </div>
      </section>

      {/* --- KODAWARI SECTION --- */}
      <section id="kodawari" className="grid md:grid-cols-2 min-h-screen bg-[#0a0a0a]">
        <div className="flex flex-col justify-center px-10 md:px-20 py-24 order-2 md:order-1">
          <div className="mb-12">
            <span className="inline-block border border-[#b01020] text-[#b01020] text-[10px] tracking-[0.3em] px-4 py-1.5 mb-6 font-bold uppercase">Our Philosophy</span>
            <h2 className="text-5xl md:text-7xl font-black leading-tight tracking-tighter font-serif">
              語られない<br /><span className="text-[#c8a84a]">ひと手間</span>
            </h2>
          </div>
          <div className="divide-y divide-white/10 max-w-xl">
            {[
              { label: 'カット', title: '手切りへの徹底', body: '肉は一枚一枚すべて手切りしており、部位によって切り方を変えています。余分な脂は丁寧に取り除き、やわらかい部位は厚めにカット。' },
              { label: '品質', title: '鮮度を守る品質管理', body: '肉の管理・保存を徹底しています。必要な分だけを解凍して使用し、仕入れ直後に丁寧に処理することで、鮮やかな色合いの赤身をお出しします。' },
              { label: '想い', title: '心を尽くす', body: 'それがなおきの美味しさの基準です。素材の力を信じ、丁寧なひと手間を積み重ねることで、一口食べた瞬間に違いがわかる一皿をお届けします。' },
            ].map(item => (
              <div key={item.label} className="grid grid-cols-[auto_1fr] gap-8 py-8 group hover:bg-white/5 transition-colors duration-300 px-4 -mx-4">
                <span className="text-[#b01020] text-[10px] font-black tracking-widest pt-2" style={{ writingMode: 'vertical-rl' }}>{item.label}</span>
                <div>
                  <h3 className="text-xl font-bold tracking-wide mb-4 text-white group-hover:text-[#c8a84a] transition-colors font-serif">{item.title}</h3>
                  <p className="text-sm font-light leading-relaxed text-white/50">{item.body}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
        <div className="relative min-h-[60vh] md:min-h-screen overflow-hidden order-1 md:order-2">
          <Image src="/sec2_bgi3.jpg" alt="こだわり" fill sizes="50vw" className="object-cover opacity-80" />
          <div className="absolute inset-0 bg-gradient-to-t from-black via-black/20 to-transparent" />
          <div className="absolute bottom-16 left-12 right-12">
            <p className="text-5xl md:text-7xl font-black text-white leading-tight tracking-wide font-serif mb-4" style={{ textShadow: '0 4px 30px rgba(0,0,0,0.8)' }}>心を尽くす</p>
            <p className="text-[#c8a84a] text-sm tracking-[0.4em] font-bold">それがなおきの美味しさの基準です。</p>
          </div>
        </div>
      </section>

      {/* --- SPECIAL SAUCE SECTION --- */}
      <section className="py-32 bg-[#080604]">
        <div className="max-w-7xl mx-auto px-6">
          <div className="text-center mb-20">
            <span className="inline-block bg-[#b01020] text-white text-[9px] tracking-[0.4em] px-5 py-2 mb-6 font-bold uppercase">Special Sauce</span>
            <h2 className="text-4xl md:text-6xl font-black tracking-[0.3em] mb-6 font-serif uppercase">こだわりのタレ</h2>
            <div className="w-16 h-0.5 bg-[#c8a84a] mx-auto mb-8" />
            <p className="text-white/50 text-sm md:text-base font-light leading-relaxed max-w-2xl mx-auto italic">
              タレは、店主の修業元である京都・大韶園と同じものを使用。<br className="hidden md:block" />肉の旨みを最大限に引き出す、なおき秘伝の味わいです。
            </p>
          </div>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            {[
              { img: '/yannninnjyann.jpg', name: '秘伝みそダレ', desc: '京都仕込みの白みそベース。カルビやロースとの相性が抜群。' },
              { img: '/sec3-popup_i2.jpg', name: '自家製洗いダレ', desc: 'さっぱり醤油ベース。タンや赤身の旨みを引き立てる。' },
              { img: '/sec3-popup_i3.jpg', name: 'ヤンニンジャン', desc: '京都大韶園と同じ秘伝。ニラの香りと食感がアクセント。' },
              { img: '/sec3-popup_i5.jpg', name: 'プッコチ醤油ダレ', desc: '青唐辛子の爽やかな辛みが特徴のなおき名物。' },
            ].map(tare => (
              <div key={tare.name} className="group">
                <div className="relative aspect-[4/5] overflow-hidden mb-6 bg-[#1a0e06] border border-white/5">
                  <Image src={tare.img} alt={tare.name} fill sizes="25vw" className="object-cover group-hover:scale-110 transition-transform duration-700 opacity-80" />
                  <div className="absolute inset-0 bg-black/20 group-hover:bg-transparent transition-colors" />
                </div>
                <h3 className="text-lg font-bold tracking-widest text-[#c8a84a] mb-3 font-serif">{tare.name}</h3>
                <p className="text-[11px] font-light leading-relaxed text-white/40 group-hover:text-white/70 transition-colors">{tare.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* --- MAIN MENU HIGHLIGHTS (必食3選) --- */}
      <section id="special-menu" className="bg-[#0a0a0a]">
        <div className="py-24 text-center border-y border-white/5">
          <span className="inline-block text-[#b01020] text-[10px] tracking-[0.5em] mb-6 font-bold uppercase">The Essentials</span>
          <h2 className="text-6xl md:text-9xl font-black tracking-[0.2em] font-serif uppercase">
            必食<span className="text-[#b01020] font-sans">3</span>選
          </h2>
          <p className="text-white/30 text-[10px] tracking-[0.4em] mt-8 uppercase">Prices include tax</p>
        </div>
        {[
          { img: '/sec3_i1.jpg', name: 'ネギタン塩', price: '1,080', desc: 'スタッフおすすめの不動の人気メニューです。舌先は薄めに、やわらかい部分は厚めにカット。一皿の中で異なる食感が楽しめるのも手切りならでは。', note: 'ネギは別添えでお出しします。', reverse: false, bg: 'bg-[#0d0a05]' },
          { img: '/sec3_i2.jpg', name: '赤身3種盛り（塩）', price: '2,420', desc: 'その日の仕入れによって部位は変わりますが、肉質のやわらかい和牛のみの盛り合わせです。贅沢に厚切りで3種類をお出しします。', note: '写真は左から、和牛カイノミ、和牛ハラミ、和牛フランクです。', reverse: true, bg: 'bg-[#080604]' },
          { img: '/sec3_i3.jpg', name: 'ミノ湯引き', price: '980', desc: 'てっさをイメージした薄切りのミノは、肉とは思えない食感に驚いていただけること間違いなし。どっさりと乗せたネギをたっぷり巻いてお召し上がりください。', note: '', reverse: false, bg: 'bg-[#0d0a05]' },
        ].map((item, i) => (
          <div key={i} className={`grid md:grid-cols-2 min-h-[80vh] items-stretch ${item.bg}`}>
            <div className={`relative overflow-hidden min-h-[50vh] md:min-h-full ${item.reverse ? 'md:order-2' : ''}`}>
              <Image src={item.img} alt={item.name} fill sizes="50vw" className="object-cover group-hover:scale-105 transition-transform duration-1000" />
            </div>
            <div className={`flex flex-col justify-center px-10 md:px-24 py-20 ${item.reverse ? 'md:order-1' : ''}`}>
              <h3 className="text-4xl md:text-5xl font-bold tracking-widest mb-4 font-serif">{item.name}</h3>
              <p className="text-2xl text-[#c8a84a] tracking-[0.2em] mb-8 font-sans">¥{item.price}</p>
              <div className="w-12 h-1 bg-[#b01020] mb-8" />
              <p className="text-sm md:text-base font-light leading-[2.2] text-white/70 mb-6 max-w-md">{item.desc}</p>
              {item.note && <p className="text-[10px] text-white/30 tracking-[0.2em] italic">※{item.note}</p>}
            </div>
          </div>
        ))}

        {/* --- FULL MENU GRID (FROM microCMS) --- */}
        {menuList.length > 0 && (
          <div id="menu" className="py-32 bg-[#0a0a0a] border-t border-white/5">
            <div className="max-w-6xl mx-auto px-6">
              <div className="text-center mb-20">
                <h2 className="text-3xl md:text-5xl font-black tracking-[0.5em] text-[#c8a84a] font-serif uppercase">御品書</h2>
                <div className="w-12 h-px bg-white/20 mx-auto mt-6" />
              </div>
              <div className="grid md:grid-cols-2 gap-x-20 gap-y-12">
                {menuList.map((item: any) => (
                  <div key={item.id} className="flex gap-8 border-b border-white/5 pb-10 items-start group">
                    {item.image?.url && (
                      <div className="relative w-28 h-28 flex-shrink-0 overflow-hidden bg-[#111] border border-white/5 shadow-2xl">
                        <Image src={item.image.url} alt={item.name} fill className="object-cover group-hover:scale-110 transition-transform duration-700" />
                      </div>
                    )}
                    <div className="flex-1">
                      <div className="flex justify-between items-baseline mb-4">
                        <h3 className="text-xl tracking-wide font-bold font-serif group-hover:text-[#c8a84a] transition-colors">{item.name}</h3>
                        <span className="text-[#c8a84a] font-sans font-bold ml-4">¥{item.price?.toLocaleString()}</span>
                      </div>
                      <p className="text-[11px] text-white/40 leading-relaxed font-light">{item.description}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}
      </section>

      {/* --- NEWS SECTION --- */}
      <section id="news" className="py-32 bg-[#0a0a0a] border-t border-white/5 px-6">
        <div className="max-w-4xl mx-auto">
          <div className="flex flex-col md:flex-row md:items-end justify-between mb-16 gap-6">
            <div>
              <p className="text-[10px] tracking-[0.6em] text-[#b01020] mb-4 font-black uppercase">Latest News</p>
              <h2 className="text-4xl font-bold tracking-[0.2em] font-serif">お知らせ</h2>
            </div>
            <Link href="/news" className="text-[10px] tracking-[0.3em] text-white/30 hover:text-[#c8a84a] uppercase transition-colors">View all news →</Link>
          </div>
          <div className="divide-y divide-white/10">
            {newsList.length > 0 ? newsList.map((item: any) => (
              <div key={item.id} className="flex flex-col md:flex-row gap-4 md:gap-10 items-baseline py-8 hover:bg-white/5 transition-all cursor-pointer group px-4 -mx-4">
                <span className="text-[11px] text-white/30 tracking-[0.2em] font-sans">
                  {new Date(item.publishedAt).toLocaleDateString('ja-JP', { year: 'numeric', month: '2-digit', day: '2-digit' }).replaceAll('/', '.')}
                </span>
                <span className="text-[9px] tracking-[0.3em] px-3 py-1 bg-[#b01020] text-white font-bold uppercase">
                  {item.category?.[0] || 'Notice'}
                </span>
                <span className="text-base font-medium tracking-wide leading-relaxed group-hover:translate-x-2 transition-transform duration-300">{item.title}</span>
              </div>
            )) : (
              <p className="text-white/30 text-center py-10">現在、新しいお知らせはありません。</p>
            )}
          </div>
        </div>
      </section>

      {/* --- ACCESS & SHOP INFO --- */}
      <section id="access" className="py-32 bg-[#f4f1ea] text-[#1a1208]">
        <div className="max-w-7xl mx-auto px-6">
          <div className="mb-20">
            <span className="inline-block bg-[#b01020] text-white text-[10px] tracking-[0.4em] px-5 py-2 mb-6 font-bold uppercase">Access</span>
            <h2 className="text-5xl md:text-6xl font-black tracking-widest font-serif">アクセス</h2>
          </div>
          <div className="grid md:grid-cols-2 gap-16 items-start">
            <div>
              <div className="relative aspect-video overflow-hidden mb-12 shadow-2xl border-l-8 border-[#b01020]">
                <Image src="/sec7_i.jpg" alt="店舗外観" fill sizes="50vw" className="object-cover" />
              </div>
              <table className="w-full text-sm border-t border-black/10">
                <tbody className="divide-y divide-black/10">
                  {[
                    ['店名', shop?.name ?? '京都焼肉なおき'],
                    ['住所', shop?.address ?? '愛知県名古屋市中区栄4-6-18 パールプラザビル2F'],
                    ['アクセス', shop?.access ?? '地下鉄栄駅より徒歩8分・新栄町駅徒歩圏内'],
                    ['電話', shop?.tel ?? '052-990-6329'],
                    ['営業時間', shop?.business_hours ?? '18:00〜翌4:00'],
                    ['定休日', shop?.holiday ?? '水曜日'],
                  ].map(([label, value]) => (
                    <tr key={label}>
                      <td className="py-6 pr-6 font-black text-[#b01020] tracking-[0.3em] whitespace-nowrap w-1/4 align-top text-[10px] uppercase">{label}</td>
                      <td className="py-6 font-medium leading-relaxed text-[#3a2e22] text-sm md:text-base">{value}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
              <div className="mt-12">
                <a href="https://retty.me/area/PRE23/ARE63/SUB6304/100001788734/" target="_blank" className="inline-block px-12 py-5 bg-[#1a1208] text-[#f4f1ea] text-[10px] font-black tracking-[0.5em] hover:bg-[#b01020] transition-all uppercase shadow-xl">
                  ご予約・お問い合せはこちら
                </a>
              </div>
            </div>
            <div className="aspect-square md:h-[700px] shadow-2xl border border-black/5 grayscale hover:grayscale-0 transition-all duration-1000">
              <iframe
                src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3261.426543781057!2d136.91456577626122!3d35.17088915848773!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x60037130e43d1a67%3A0xc3f9b2d973719463!2zS1lPVE8gWUFESU5JS1UgTkFPS0kgKO京都焼肉なおき）!5e0!3m2!1sja!2sjp!4v1700000000000!5m2!1sja!2sjp"
                width="100%" height="100%" loading="lazy" className="border-0"
              />
            </div>
          </div>
        </div>
      </section>

      {/* --- FOOTER --- */}
      <footer className="bg-[#080604] border-t border-white/5 py-20 px-6">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row justify-between items-center gap-12 text-center md:text-left">
          <div>
            <div className="relative w-16 h-20 mb-6 mx-auto md:mx-0 opacity-50">
              <Image src="/logo.png" alt="なおき" fill className="object-contain grayscale" />
            </div>
            <p className="text-[#c8a84a] text-2xl font-black tracking-[0.4em] font-serif mb-2">京都焼肉なおき</p>
            <p className="text-white/20 text-[9px] tracking-[0.2em] uppercase">Kyoto Style Yakiniku in Nagoya</p>
          </div>
          <div className="flex flex-wrap justify-center gap-10">
            {[
              { href: 'https://www.instagram.com/yakinikunaoki', label: 'Instagram' },
              { href: 'https://retty.me/area/PRE23/ARE63/SUB6304/100001788734/', label: 'Retty' },
              { href: '#', label: 'Google Maps' },
            ].map(link => (
              <a key={link.label} href={link.href} target="_blank" rel="noopener noreferrer" className="text-[10px] text-white/30 hover:text-[#c8a84a] font-bold tracking-[0.3em] uppercase transition-colors">
                {link.label}
              </a>
            ))}
          </div>
          <p className="text-[9px] text-white/10 tracking-[0.3em] uppercase">
            &copy; 2026 KYOTO YAKINIKU NAOKI. All Rights Reserved.
          </p>
        </div>
      </footer>

    </div>
  );
}

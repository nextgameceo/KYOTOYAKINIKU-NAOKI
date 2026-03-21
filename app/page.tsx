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
    <div className="bg-[#0a0a0a] text-white overflow-x-hidden">

      <section className="relative h-screen flex overflow-hidden">
        {[
          { src: '/kv_i1.jpg', label: '迫力満点！', sub: '鮮度抜群！' },
          { src: '/kv_i2.jpg', label: 'お一人様', sub: '大歓迎' },
          { src: '/kv_i3.jpg', label: '宴会にも', sub: 'ぴったり' },
          { src: '/kv_i4.jpg', label: '2階にある', sub: '隠れ家焼肉' },
          { src: '/kv_i5.jpg', label: 'ここでしか', sub: '食べられない逸品' },
        ].map((slide, i) => (
          <div key={i} className="relative flex-1 overflow-hidden group transition-[flex] duration-700 ease-in-out hover:flex-[2.5] cursor-pointer">
            <Image src={slide.src} alt={slide.label} fill sizes="20vw" className="object-cover group-hover:scale-105 transition-transform duration-700" priority={i === 0} />
            <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent" />
            <div className="absolute bottom-6 left-0 right-0 px-3 text-center">
              <p className="text-white font-black leading-tight text-sm drop-shadow-lg" style={{ fontFamily: 'var(--font-noto-serif)', writingMode: 'vertical-rl', margin: '0 auto', textShadow: '0 2px 8px rgba(0,0,0,0.9)' }}>
                <span className="text-[#c8a84a]">{slide.label}</span><br />{slide.sub}
              </p>
            </div>
          </div>
        ))}
        <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none">
          <div className="bg-black/50 backdrop-blur-sm px-8 py-6 text-center border border-white/10">
            <p className="text-[#c8a84a] text-[10px] tracking-[0.6em] mb-3 uppercase">Kyoto Yakiniku</p>
            <div className="relative w-16 h-20 mx-auto mb-3">
              <Image src="/logo.png" alt="なおき" fill className="object-contain" />
            </div>
            <p className="text-white/50 text-[10px] tracking-[0.5em]">SAKAE · NAGOYA</p>
            <div className="w-8 h-px bg-[#c8a84a] mx-auto my-4" />
            <p className="text-white/60 text-xs tracking-widest hidden md:block">京都二十年の技　秘伝のタレで紡ぐ、夜の一皿</p>
          </div>
        </div>
        <div className="absolute bottom-6 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2 pointer-events-none">
          <span className="text-white/30 text-[9px] tracking-[0.4em]">SCROLL</span>
          <div className="w-px h-10 bg-gradient-to-b from-[#c8a84a] to-transparent animate-pulse" />
        </div>
      </section>

      <section id="concept" className="grid md:grid-cols-2 min-h-screen">
        <div className="relative min-h-[50vh] md:min-h-screen overflow-hidden">
          <Image src="/sec2_bgi1.jpg" alt="こだわり" fill sizes="50vw" className="object-cover" />
          <div className="absolute inset-0 bg-gradient-to-r from-transparent to-black/50" />
          <div className="absolute right-6 top-1/2 -translate-y-1/2 text-white font-black text-2xl md:text-4xl leading-tight tracking-widest" style={{ writingMode: 'vertical-rl', fontFamily: 'var(--font-noto-serif)', textShadow: '0 2px 20px rgba(0,0,0,0.9)' }}>
            一口でわかる、肉の違い。
          </div>
          <div className="absolute left-6 bottom-8 text-white/70 text-xs tracking-widest">18:00〜翌4:00営業</div>
        </div>
        <div className="flex flex-col justify-center px-8 md:px-16 py-20 bg-[#f0ebe0] text-[#1a1208]">
          <span className="inline-block bg-[#b01020] text-white text-[10px] tracking-widest px-3 py-1 mb-5 w-fit">About</span>
          <h2 className="text-3xl md:text-4xl font-black leading-snug mb-5" style={{ fontFamily: 'var(--font-noto-serif)' }}>
            東新町の長い夜を、<br /><span className="text-[#b01020]">贅沢</span>に締めくくる
          </h2>
          <div className="w-10 h-0.5 bg-[#b01020] mb-6" />
          <p className="text-sm font-light leading-[2.2] text-[#3a2e22] mb-8">
            名古屋市中区、東新町・女子大エリア。「栄」「新栄町駅」から徒歩圏内の「京都焼肉なおき」は、アラカルトやコースで上質な肉をリーズナブルにご提供している焼肉屋です。<br /><br />
            朝4時まで営業していますので、一人焼肉やデート、ご宴会、女子会などの他、今日の〆は焼肉といった贅沢な一日の締めくくりにもぜひ。
          </p>
          <div className="bg-[#1a1208] text-white inline-block px-6 py-4 w-fit">
            <p className="text-[10px] tracking-widest text-white/50 mb-1">営業時間</p>
            <p className="text-2xl font-bold tracking-widest" style={{ fontFamily: 'var(--font-noto-serif)' }}>18:00 〜 翌4:00</p>
          </div>
        </div>
      </section>

      <section id="kodawari" className="grid md:grid-cols-2 min-h-screen bg-[#0a0a0a]">
        <div className="flex flex-col justify-center px-8 md:px-16 py-20 order-2 md:order-1">
          <div className="mb-8">
            <span className="inline-block bg-[#b01020] text-white text-[10px] tracking-widest px-3 py-1 mb-4">違いを生むのは</span>
            <h2 className="text-4xl md:text-6xl font-black leading-none tracking-tight" style={{ fontFamily: 'var(--font-noto-serif)' }}>
              語られない<br />ひと手間
            </h2>
          </div>
          <div className="divide-y divide-white/8">
            {[
              { label: 'カット', title: '手切りへの徹底', body: '肉は一枚一枚すべて手切りしており、もちろん部位によって切り方を変えています。余分な脂は丁寧に取り除き、やわらかい部位は満足感を感じていただけるよう厚めにカット。' },
              { label: '品質', title: '鮮度を守る品質管理', body: 'どのお客様にも鮮度がいいと言っていただけるように、肉の管理・保存を徹底しています。必要な分だけを解凍して使用し、仕入れ直後に丁寧に処理することで、鮮やかな色合いの赤身をお出しします。' },
              { label: '想い', title: '心を尽くす', body: 'それがなおきの美味しさの基準です。素材の力を信じ、丁寧なひと手間を積み重ねることで、一口食べた瞬間に違いがわかる一皿をお届けします。' },
            ].map(item => (
              <div key={item.label} className="grid grid-cols-[auto_1fr] gap-5 py-6">
                <span className="text-[#b01020] text-[10px] tracking-widest pt-1" style={{ writingMode: 'vertical-rl' }}>{item.label}</span>
                <div>
                  <h3 className="text-base font-bold tracking-wide mb-2" style={{ fontFamily: 'var(--font-noto-serif)' }}>{item.title}</h3>
                  <p className="text-sm font-light leading-relaxed text-white/60">{item.body}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
        <div className="relative min-h-[50vh] md:min-h-screen overflow-hidden order-1 md:order-2">
          <Image src="/sec2_bgi3.jpg" alt="こだわり" fill sizes="50vw" className="object-cover opacity-75" />
          <div className="absolute inset-0 bg-gradient-to-t from-black/80 to-transparent" />
          <div className="absolute bottom-0 left-0 right-0 p-8 md:p-12">
            <p className="text-3xl md:text-5xl font-black text-white leading-snug tracking-wide" style={{ fontFamily: 'var(--font-noto-serif)', textShadow: '0 2px 20px rgba(0,0,0,0.8)' }}>心を尽くす</p>
            <p className="text-white/60 text-xs tracking-widest mt-2">それがなおきの美味しさの基準です。</p>
          </div>
        </div>
      </section>

      <section className="py-24 bg-[#080604]">
        <div className="max-w-6xl mx-auto px-6">
          <div className="text-center mb-16">
            <span className="inline-block bg-[#b01020] text-white text-[10px] tracking-widest px-3 py-1 mb-5">Special Sauce</span>
            <h2 className="text-3xl md:text-5xl font-black tracking-widest mb-4" style={{ fontFamily: 'var(--font-noto-serif)' }}>こだわりのタレ</h2>
            <div className="w-8 h-px bg-[#c8a84a] mx-auto mb-5" />
            <p className="text-white/50 text-sm font-light leading-relaxed max-w-md mx-auto">
              タレは、店主の修業元である京都・大韶園と同じものを使用。肉の旨みを最大限に引き出す、なおき秘伝の味わいです。
            </p>
          </div>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-6">
            {[
              { img: '/yannninnjyann.jpg', name: '秘伝みそダレ', desc: '京都仕込みの白みそベース。カルビやロースとの相性が抜群。' },
              { img: '/sec3-popup_i2.jpg', name: '自家製洗いダレ', desc: 'さっぱり醤油ベース。タンや赤身の旨みを引き立てる。' },
              { img: '/sec3-popup_i3.jpg', name: 'ヤンニンジャン', desc: '京都大韶園と同じ秘伝。ニラの香りと食感がアクセント。' },
              { img: '/sec3-popup_i5.jpg', name: 'プッコチ醤油ダレ', desc: '青唐辛子の爽やかな辛みが特徴のなおき名物。' },
            ].map(tare => (
              <div key={tare.name} className="group border-t-2 border-[#b01020] pt-5">
                <div className="relative aspect-square overflow-hidden mb-4 bg-[#1a0e06]">
                  <Image src={tare.img} alt={tare.name} fill sizes="25vw" className="object-cover group-hover:scale-105 transition-transform duration-500 opacity-90" />
                </div>
                <h3 className="text-sm font-bold tracking-wide text-[#c8a84a] mb-2" style={{ fontFamily: 'var(--font-noto-serif)' }}>{tare.name}</h3>
                <p className="text-xs font-light leading-relaxed text-white/55">{tare.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section id="menu" className="bg-[#0a0a0a]">
        <div className="py-20 text-center border-b border-white/5">
          <span className="inline-block bg-[#b01020] text-white text-[10px] tracking-widest px-3 py-1 mb-5">まずはコレ</span>
          <h2 className="text-5xl md:text-8xl font-black tracking-widest" style={{ fontFamily: 'var(--font-noto-serif)' }}>
            必食<span className="text-[#b01020]">3</span>選
          </h2>
          <p className="text-white/30 text-xs tracking-widest mt-4">※価格は全て税込みです。</p>
        </div>
        {[
          { img: '/sec3_i1.jpg', name: 'ネギタン塩', price: '1,080', desc: 'スタッフおすすめの、不動の人気メニューです。食感が硬めの舌先は薄めに、お尻のやわらかい部分は厚めにカット。一皿の中で厚みが異なる肉が楽しめるのも、手切りならでは。', note: '※ネギは別添えでお出しします。', reverse: false, bg: 'bg-[#0d0a05]' },
          { img: '/sec3_i2.jpg', name: '赤身3種盛り（塩）', price: '2,420', desc: 'その日の仕入れによって部位は変わりますが、肉質のやわらかい和牛のみの盛り合わせです。贅沢に厚切りで3種類をお出しします。', note: '※写真は左から、和牛カイノミ、和牛ハラミ、和牛フランクです。', reverse: true, bg: 'bg-[#080604]' },
          { img: '/sec3_i3.jpg', name: 'ミノ湯引き', price: '980', desc: 'てっさをイメージした薄切りのミノは、肉とは思えない食感に驚いていただけること間違いなし。どっさりと乗せたネギをたっぷり巻いてお召し上がりください。', note: '', reverse: false, bg: 'bg-[#0d0a05]' },
        ].map((item, i) => (
          <div key={i} className={`grid md:grid-cols-2 min-h-[70vh] ${item.bg}`}>
            <div className={`relative overflow-hidden min-h-[45vw] md:min-h-full ${item.reverse ? 'md:order-2' : ''}`}>
              <Image src={item.img} alt={item.name} fill sizes="50vw" className="object-cover" />
            </div>
            <div className={`flex flex-col justify-center px-8 md:px-16 py-16 ${item.reverse ? 'md:order-1' : ''}`}>
              <h3 className="text-3xl md:text-4xl font-bold tracking-widest mb-3" style={{ fontFamily: 'var(--font-noto-serif)' }}>{item.name}</h3>
              <p className="text-2xl text-white/70 tracking-widest mb-6">¥{item.price}</p>
              <div className="w-8 h-px bg-[#b01020] mb-6" />
              <p className="text-sm font-light leading-[2.2] text-white/65 mb-3">{item.desc}</p>
              {item.note && <p className="text-xs text-white/35 tracking-wide">{item.note}</p>}
            </div>
          </div>
        ))}
        <div className="py-16 text-center bg-[#080604] border-t border-white/5">
          <p className="text-white/40 text-xs tracking-widest mb-4">他にも多彩なメニューをご用意しています</p>
          <Link href="/menu" className="inline-flex items-center gap-3 border border-white/20 hover:border-[#c8a84a] text-white hover:text-[#c8a84a] text-sm tracking-widest px-10 py-4 transition-all group">
            フルメニューを見る<span className="group-hover:translate-x-1 transition-transform">→</span>
          </Link>
        </div>
        {menuList.length > 0 && (
          <div className="py-20 bg-[#0a0a0a] border-t border-white/5">
            <div className="max-w-6xl mx-auto px-6">
              <h2 className="text-2xl font-black tracking-widest text-center mb-12 text-[#c8a84a]" style={{ fontFamily: 'var(--font-noto-serif)' }}>御品書</h2>
              <div className="grid md:grid-cols-2 gap-x-16 gap-y-8">
                {menuList.map((item: { id: string; name: string; price: number; description: string; image?: { url: string } }) => (
                  <div key={item.id} className="flex gap-6 border-b border-white/8 pb-8 items-start group">
                    {item.image?.url && (
                      <div className="relative w-24 h-24 flex-shrink-0 overflow-hidden bg-[#111]">
                        <Image src={item.image.url} alt={item.name} fill className="object-cover group-hover:scale-110 transition-transform duration-500" />
                      </div>
                    )}
                    <div className="flex-1">
                      <div className="flex justify-between items-baseline mb-2">
                        <h3 className="text-lg tracking-wide" style={{ fontFamily: 'var(--font-noto-serif)' }}>{item.name}</h3>
                        <span className="text-[#c8a84a] text-sm tracking-widest">¥{item.price?.toLocaleString()}</span>
                      </div>
                      <p className="text-xs text-white/50 leading-relaxed">{item.description}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}
      </section>

      <section className="bg-[#f0ebe0] text-[#1a1208]">
        <div className="py-16 text-center border-b border-black/10">
          <span className="inline-block bg-[#b01020] text-white text-[10px] tracking-widest px-3 py-1 mb-4">常連さんに愛される</span>
          <h2 className="text-3xl md:text-5xl font-black tracking-widest" style={{ fontFamily: 'var(--font-noto-serif)' }}>なおき自慢の一皿</h2>
        </div>
        {[
          { img: '/sec4_i1.jpg', tag: 'ワイワイ楽しむなら', name: '生センマイ', price: '750', desc: '迫力のある見た目と、新鮮でしっかりした歯ごたえが楽しめます。水気を十分に切ることが美味しさの秘訣です。', reverse: false },
          { img: '/sec5_i1.jpg', tag: '〆の定番', name: 'チゲスープ', price: '900', desc: '辛いものが苦手な方でも召し上がっていただけます。辛さを足したい場合は、卓上のプッコチダレで調整してください。そうめん入りで食べ応えも抜群です。', reverse: true },
          { img: '/sec5_i2.jpg', tag: '絶品ホルモン', name: 'レバー山椒焼き', price: '680', desc: '焼肉のタレにヤンニンジャンとごま油を加えたもみダレで味付け。仕上げに山椒を振って独特の風味をほどよく和らげ、食べやすくしています。', reverse: false },
        ].map((item, i) => (
          <div key={i} className={`grid md:grid-cols-2 min-h-[60vh] ${i % 2 !== 0 ? 'bg-[#e8e0d0]' : 'bg-[#f0ebe0]'}`}>
            <div className={`relative overflow-hidden min-h-[50vw] md:min-h-full ${item.reverse ? 'md:order-2' : ''}`}>
              <Image src={item.img} alt={item.name} fill sizes="50vw" className="object-cover" />
              <div className="absolute top-4 left-4">
                <span className="bg-[#b01020] text-white text-[10px] tracking-widest px-3 py-1">{item.tag}</span>
              </div>
            </div>
            <div className={`flex flex-col justify-center px-8 md:px-16 py-16 relative ${item.reverse ? 'md:order-1' : ''}`}>
              <div className="absolute right-4 top-1/2 -translate-y-1/2 text-5xl font-black tracking-widest text-black/5 pointer-events-none select-none" style={{ writingMode: 'vertical-rl', fontFamily: 'var(--font-noto-serif)' }}>なおき自慢</div>
              <span className="inline-block bg-[#b01020] text-white text-[10px] tracking-widest px-3 py-1 mb-5 w-fit">常連さんに愛される</span>
              <h3 className="text-2xl md:text-3xl font-bold tracking-widest mb-2" style={{ fontFamily: 'var(--font-noto-serif)' }}>{item.name}</h3>
              <p className="text-lg font-semibold tracking-widest text-[#1a1208] mb-6">¥{item.price}</p>
              <div className="w-8 h-px bg-[#b01020] mb-5" />
              <p className="text-sm font-light leading-[2.2] text-[#3a2e22]">{item.desc}</p>
            </div>
          </div>
        ))}
      </section>

      <section id="course" className="py-24 bg-[#0a0a0a]">
        <div className="max-w-4xl mx-auto px-6">
          <div className="text-center mb-16">
            <span className="inline-block bg-[#b01020] text-white text-[10px] tracking-widest px-3 py-1 mb-5">Course & Set Menu</span>
            <h2 className="text-3xl md:text-5xl font-black tracking-widest" style={{ fontFamily: 'var(--font-noto-serif)' }}>
              コース・<span className="text-[#b01020]">セットメニュー</span>
            </h2>
          </div>
          <div className="grid md:grid-cols-2 gap-6">
            <div className="border border-white/10 overflow-hidden group hover:border-white/25 transition-colors">
              <div className="relative aspect-video overflow-hidden">
                <Image src="/sec4_i2.jpg" alt="おひとり様セット" fill sizes="50vw" className="object-cover group-hover:scale-105 transition-transform duration-500" />
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
                <div className="absolute bottom-4 left-5">
                  <span className="bg-[#b01020] text-white text-[10px] tracking-widest px-2 py-1">お一人でも</span>
                </div>
              </div>
              <div className="p-6 bg-white/3">
                <h3 className="text-xl font-bold tracking-wide mb-2" style={{ fontFamily: 'var(--font-noto-serif)' }}>おひとり様セット</h3>
                <p className="text-xs text-white/50 tracking-widest mb-4">※3種類ご用意しています</p>
                <p className="text-sm font-light leading-relaxed text-white/65 mb-5">塩・タレ・おまかせの他、各種盛り合わせもご用意。お一人で召し上がるのにちょうど良いボリューム感です。</p>
                <div className="grid grid-cols-3 gap-2">
                  {[['A. 塩焼き', '2,000円'], ['B. 赤身タレ', '2,000円'], ['C. おまかせ', '2,000円']].map(([l, v]) => (
                    <div key={l} className="text-center border border-white/10 p-2">
                      <p className="text-[9px] text-white/40 tracking-wider mb-1">{l}</p>
                      <p className="text-sm font-bold text-[#c8a84a]">{v}</p>
                    </div>
                  ))}
                </div>
              </div>
            </div>
            <div className="border border-white/10 overflow-hidden group hover:border-white/25 transition-colors">
              <div className="relative aspect-video overflow-hidden">
                <Image src="/sec6_i1.jpg" alt="宴会コース" fill sizes="50vw" className="object-cover group-hover:scale-105 transition-transform duration-500" />
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
                <div className="absolute bottom-4 left-5">
                  <span className="bg-[#b01020] text-white text-[10px] tracking-widest px-2 py-1">大人数でも</span>
                </div>
              </div>
              <div className="p-6 bg-white/3">
                <h3 className="text-xl font-bold tracking-wide mb-2" style={{ fontFamily: 'var(--font-noto-serif)' }}>宴会コース（飲み放題付き）</h3>
                <p className="text-xs text-white/50 tracking-widest mb-4">お一人様 4,000円〜</p>
                <p className="text-sm font-light leading-relaxed text-white/65 mb-5">2名様から貸切OK。飲み放題付きコースで宴会・女子会・各種ご宴席に。詳細はお電話またはWEB予約にてお問い合わせください。</p>
                <div className="grid grid-cols-2 gap-2">
                  {[['スタンダード', '4,000円'], ['プレミアム', '5,500円']].map(([l, v]) => (
                    <div key={l} className="text-center border border-white/10 p-3">
                      <p className="text-[10px] text-white/40 tracking-wider mb-1">{l}</p>
                      <p className="text-base font-bold text-[#c8a84a]">{v}</p>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section id="kuukan" className="bg-[#080604]">
        <div className="relative h-[40vh] md:h-[50vh] overflow-hidden">
          <Image src="/sec6_para.jpg" alt="店内" fill sizes="100vw" className="object-cover opacity-60" />
          <div className="absolute inset-0 bg-gradient-to-t from-[#080604] to-transparent" />
          <div className="absolute right-8 top-1/2 -translate-y-1/2 text-white font-black text-3xl md:text-5xl tracking-widest" style={{ writingMode: 'vertical-rl', fontFamily: 'var(--font-noto-serif)', textShadow: '0 2px 20px rgba(0,0,0,0.9)' }}>
            店内のご案内
          </div>
        </div>
        <div className="max-w-5xl mx-auto px-6 pb-24">
          <div className="grid md:grid-cols-3 gap-6 -mt-8 relative z-10">
            <div className="bg-[#0a0a0a] border border-white/10 p-6 flex flex-col">
              <p className="text-[10px] tracking-widest text-white/40 mb-4">店内見取り図</p>
              <div className="flex-1 bg-[#111] border border-white/5 p-4">
                <p className="text-[9px] text-white/30 text-center mb-3 tracking-widest">キッチン</p>
                <div className="grid grid-cols-3 gap-1 mb-3">
                  {Array.from({ length: 6 }).map((_, i) => (
                    <div key={i} className={`h-6 flex items-center justify-center ${i === 4 ? 'bg-[#b01020]/40' : 'bg-white/6'}`}>
                      {i === 4 && <span className="text-[8px] text-white/60">C</span>}
                    </div>
                  ))}
                </div>
                <p className="text-[9px] text-white/20 text-center tracking-widest">W.C.</p>
                <p className="text-[9px] text-white/20 text-center tracking-widest mt-3">▼ 入口</p>
              </div>
            </div>
            <div className="border border-white/10 overflow-hidden">
              <div className="relative aspect-[4/3]">
                <Image src="/sec6_i2.jpg" alt="テーブル席" fill sizes="33vw" className="object-cover" />
                <div className="absolute top-3 left-3">
                  <span className="bg-[#b01020] text-white text-[9px] tracking-widest px-2 py-1">ワイワイ楽しむなら</span>
                </div>
              </div>
              <div className="p-5 bg-white/3">
                <h3 className="font-bold tracking-wide mb-2" style={{ fontFamily: 'var(--font-noto-serif)' }}>テーブル席</h3>
                <p className="text-xs font-light leading-relaxed text-white/55">4名様向けのテーブル席は2卓あり、仕切りもある適度な間を感じずお食事を楽しめます。7名様までのテーブル席も1卓ご用意しています。</p>
              </div>
            </div>
            <div className="border border-white/10 overflow-hidden">
              <div className="relative aspect-[4/3]">
                <Image src="/sec6_i3.jpg" alt="カウンター" fill sizes="33vw" className="object-cover" />
                <div className="absolute top-3 left-3">
                  <span className="bg-[#b01020] text-white text-[9px] tracking-widest px-2 py-1">焼肉愛好者の特等席</span>
                </div>
              </div>
              <div className="p-5 bg-white/3">
                <h3 className="font-bold tracking-wide mb-2" style={{ fontFamily: 'var(--font-noto-serif)' }}>カウンター</h3>
                <p className="text-xs font-light leading-relaxed text-white/55">肉を焼く様子を目の前でご覧になれるカウンター席は3席。気になることがあれば遠慮なくお声がけください。</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section id="news" className="py-20 bg-[#0a0a0a] border-t border-white/5">
        <div className="max-w-3xl mx-auto px-6">
          <div className="mb-10">
            <p className="text-[10px] tracking-[0.4em] text-white/30 mb-2">NEWS</p>
            <h2 className="text-3xl font-bold tracking-widest" style={{ fontFamily: 'var(--font-noto-serif)' }}>お知らせ</h2>
          </div>
          <div className="divide-y divide-white/8">
            {newsList.length > 0 ? newsList.map((item: { id: string; title: string; publishedAt: string; category: string }) => (
              <div key={item.id} className="flex gap-4 md:gap-6 items-baseline py-4 hover:opacity-70 transition-opacity cursor-pointer">
                <span className="text-[10px] text-white/35 tracking-widest whitespace-nowrap">
                  {new Date(item.publishedAt).toLocaleDateString('ja-JP', { year: 'numeric', month: '2-digit', day: '2-digit' }).replaceAll('/', '.')}
                </span>
                <span className={`text-[9px] tracking-widest px-2 py-0.5 whitespace-nowrap shrink-0 ${item.category === 'blog' ? 'bg-[#c8a84a]/80 text-[#0a0a0a]' : 'bg-[#b01020] text-white'}`}>
                  {item.category === 'blog' ? 'ブログ' : 'お知らせ'}
                </span>
                <span className="text-sm font-light tracking-wide leading-relaxed">{item.title}</span>
              </div>
            )) : [
              { date: '2025.06.20', cat: 'お知らせ', title: '6月のおすすめ希少部位のご案内', blog: false },
              { date: '2025.06.15', cat: 'ブログ', title: 'タレへのこだわり プッコチ醤油ダレが生まれた理由', blog: true },
              { date: '2025.06.01', cat: 'お知らせ', title: '京都焼肉なおき、栄にグランドオープンしました', blog: false },
            ].map((item, i) => (
              <div key={i} className="flex gap-4 md:gap-6 items-baseline py-4">
                <span className="text-[10px] text-white/35 tracking-widest whitespace-nowrap">{item.date}</span>
                <span className={`text-[9px] tracking-widest px-2 py-0.5 whitespace-nowrap shrink-0 ${item.blog ? 'bg-[#c8a84a]/80 text-[#0a0a0a]' : 'bg-[#b01020] text-white'}`}>{item.cat}</span>
                <span className="text-sm font-light tracking-wide">{item.title}</span>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="py-24 bg-[#080604] text-center px-6">
        <div className="max-w-2xl mx-auto p-12 border border-[#c8a84a]/20 bg-[#0a0a0a]">
          <div className="text-[#c8a84a] text-4xl mb-6 tracking-tight">★★★★★ 5.0</div>
          <p className="text-sm mb-10 text-white/60 leading-loose italic">
            迫力のある見た目と鮮度の高さ、秘伝のタレが忘れられません。深夜まで営業しているので仕事帰りにも重宝しています。
          </p>
          
            href="https://maps.google.com/?cid=16336924147757665245"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-block px-12 py-4 bg-[#c8a84a] text-black text-[10px] font-bold tracking-[0.3em] hover:bg-white transition-all uppercase"
          >
            全てのレビューを見る
          </a>
        </div>
      </section>

      <section id="access" className="py-20 bg-[#f0ebe0] text-[#1a1208]">
        <div className="max-w-5xl mx-auto px-6">
          <div className="mb-12">
            <span className="inline-block bg-[#b01020] text-white text-[10px] tracking-widest px-3 py-1 mb-4">Access & Map</span>
            <h2 className="text-3xl md:text-5xl font-black tracking-widest" style={{ fontFamily: 'var(--font-noto-serif)' }}>アクセス</h2>
          </div>
          <div className="grid md:grid-cols-2 gap-10">
            <div>
              <div className="relative aspect-[4/3] overflow-hidden mb-6 border border-black/10">
                <Image src="/sec7_i.jpg" alt="店舗外観" fill sizes="50vw" className="object-cover" />
              </div>
              <table className="w-full text-sm">
                <tbody className="divide-y divide-black/10">
                  {[
                    ['店名', shop?.name ?? '京都焼肉なおき'],
                    ['住所', shop?.address ?? '愛知県名古屋市中区栄4-6-18 パールプラザビル2F'],
                    ['アクセス', shop?.access ?? '地下鉄栄駅より徒歩8分・新栄町駅徒歩圏内'],
                    ['電話', shop?.tel ?? '052-990-6329'],
                    ['営業時間', shop?.hours ?? '月火木〜日：18:00〜翌4:00 / 金：18:00〜24:00'],
                    ['定休日', shop?.holiday ?? '水曜日'],
                  ].map(([label, value]) => (
                    <tr key={label}>
                      <td className="py-3 pr-4 font-semibold text-[#b01020] tracking-widest whitespace-nowrap w-1/4 align-top text-xs">{label}</td>
                      <td className="py-3 font-light leading-relaxed text-[#3a2e22] text-sm">{value}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            <div className="aspect-square md:aspect-auto md:h-full min-h-[300px] overflow-hidden border border-black/10">
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

      <footer className="bg-[#080604] border-t border-white/6 py-10">
        <div className="max-w-5xl mx-auto px-6 flex flex-col md:flex-row justify-between items-center gap-6">
          <div className="text-[#c8a84a] text-xl font-black tracking-widest" style={{ fontFamily: 'var(--font-noto-serif)' }}>
            京都焼肉なおき
          </div>
          <div className="flex gap-6">
            {[
              { href: 'https://www.instagram.com/yakinikunaoki?igsh=MW85ejY1NGpjMmV4Yg==', label: 'Instagram' },
              { href: 'https://retty.me/area/PRE23/ARE63/SUB6304/100001788734/', label: 'Retty' },
              { href: 'https://maps.google.com/?cid=16336924147757665245', label: 'Googleマップ' },
            ].map(link => (
              <a key={link.href} href={link.href} target="_blank" rel="noopener noreferrer" className="text-xs text-white/40 hover:text-white/70 tracking-widest transition-colors">
                {link.label}
              </a>
            ))}
          </div>
          <p className="text-[10px] text-white/20 tracking-widest">2025 京都焼肉なおき All Rights Reserved.</p>
        </div>
      </footer>

    </div>
  );
}

import Image from 'next/image';
import Link from 'next/link';

export default function Home() {
  return (
    <main className="min-h-screen bg-black text-white font-serif selection:bg-yellow-700 selection:text-white">
      
      {/* HERO: ロゴを主役に、赤と黒が映える薄グレー背景 */}
      <section className="relative h-screen flex flex-col items-center justify-center bg-zinc-50 px-4 text-black border-b border-zinc-200">
        <div className="mb-12 relative w-64 h-32 md:w-80 md:h-48">
          <Image 
            src="/logo.png" 
            alt="京都焼肉なおき" 
            fill
            priority
            className="object-contain"
          />
        </div>
        <div className="text-center">
          <h1 className="text-xl md:text-3xl tracking-[0.3em] leading-loose font-medium">
            京都二十年の技。<br />
            二つのタレで紡ぐ、至高の一皿。
          </h1>
        </div>
        
        {/* Scroll Indicator */}
        <div className="absolute bottom-12 left-1/2 -translate-x-1/2 flex flex-col items-center gap-3">
          <span className="text-black/30 text-[9px] tracking-[0.6em] uppercase font-sans font-bold">Scroll</span>
          <div className="w-px h-16 bg-gradient-to-b from-black/20 to-transparent animate-pulse" />
        </div>
      </section>

      {/* CONCEPT / SAUCE: 二つのタレとこだわりの薬味 */}
      <section className="relative py-32 bg-[#0a0a0a] px-6 overflow-hidden border-b border-white/5">
        <div className="absolute inset-0 opacity-10">
          <Image src="/sec2_bgi2.jpg" alt="" fill className="object-cover" />
        </div>
        
        <div className="relative z-10 max-w-5xl mx-auto">
          <div className="text-center mb-24">
            <span className="inline-block bg-[#b01020] text-white text-[9px] tracking-[0.4em] px-5 py-2 mb-6 font-bold uppercase font-sans">The Dual Sauces</span>
            <h2 className="text-3xl md:text-5xl tracking-[0.3em] mb-6">二つのタレ、一つの至福</h2>
            <div className="w-16 h-0.5 bg-yellow-600 mx-auto" />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-16 md:gap-24">
            {/* 左：秘伝のみそダレ */}
            <div className="space-y-8">
              <h3 className="text-xl md:text-2xl text-yellow-600 tracking-[0.2em] border-l-2 border-yellow-600 pl-4">秘伝 みそダレ</h3>
              <div className="space-y-6 text-zinc-300 leading-loose">
                <p>京都の名店「大韶園」から唯一分け与えられた、二十年変わらぬ命の味。</p>
                <div className="space-y-4 bg-white/5 p-6 border border-white/10">
                  <p className="text-sm">
                    <strong className="text-white block mb-1">【ヤンニンジャン（薬念醤）】</strong>
                    数種類の唐辛子と薬味を練り上げ、じっくりと寝かせた自家製調味料。ただ辛いだけでなく、熟成された深いコクがみそダレに圧倒的な奥行きを与えます。
                  </p>
                  <p className="text-sm">
                    <strong className="text-white block mb-1">【プッコチ（青唐辛子）】</strong>
                    鮮烈な香りと突き抜ける辛みが特徴。濃厚なタレの中にハッとする爽快感をもたらし、次の一口を誘う重要なアクセントとなります。
                  </p>
                </div>
              </div>
            </div>

            {/* 右：黄金の洗いダレ */}
            <div className="space-y-8">
              <h3 className="text-xl md:text-2xl text-yellow-600 tracking-[0.2em] border-l-2 border-yellow-600 pl-4">黄金 洗いダレ</h3>
              <div className="space-y-6 text-zinc-300 leading-loose">
                <p>京都焼肉の伝統が生んだ、琥珀色に輝く出汁の芸術。</p>
                <p className="text-sm text-zinc-500 leading-relaxed">
                  焼きたての肉をさっとくぐらせることで、余分な脂を「洗い」、出汁の旨味を纏わせる。最後の一口まで飽きさせない、端正で奥深い味わいです。
                </p>
                <div className="relative h-48 w-full border border-white/10 grayscale opacity-50">
                   <Image src="/sec2_bgi3.jpg" alt="洗いダレ" fill className="object-cover" />
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* NAVIGATION: 画像とテキストの融合 */}
      <section className="bg-black divide-y divide-white/5">
        {[
          { href: '/menu', label: '御品書', sub: 'MENU', img: '/sec3_i1.jpg' },
          { href: '/reserve', label: 'ご予約', sub: 'RESERVATION', img: '/sec7_i.jpg' },
          { href: '/wage', label: '採用情報', sub: 'RECRUIT', img: '/sec6_i1.jpg' },
        ].map((link) => (
          <Link key={link.href} href={link.href} className="relative group block overflow-hidden py-24 px-6">
            <div className="absolute inset-0 opacity-0 group-hover:opacity-40 transition-opacity duration-1000">
              <Image src={link.img} alt="" fill className="object-cover scale-110 group-hover:scale-100 transition-transform duration-1000" />
            </div>
            <div className="relative z-10 max-w-5xl mx-auto flex justify-between items-center">
              <div>
                <h3 className="text-2xl md:text-5xl tracking-[0.3em] font-medium mb-3 transition-colors group-hover:text-white">{link.label}</h3>
                <p className="text-yellow-600 text-[10px] md:text-xs tracking-[0.6em] font-sans font-bold">{link.sub}</p>
              </div>
              <span className="text-white/10 text-4xl md:text-6xl group-hover:text-yellow-600 transition-all group-hover:translate-x-6 duration-700">→</span>
            </div>
          </Link>
        ))}
      </section>

      {/* FOOTER: 名古屋・栄 店舗情報 */}
      <footer className="py-24 bg-[#050505] border-t border-white/5">
        <div className="max-w-4xl mx-auto text-center px-6 space-y-16">
          <div className="relative w-24 h-24 mx-auto opacity-30 grayscale invert">
            <Image src="/logo.png" alt="なおき ロゴ" fill className="object-contain" />
          </div>
          
          <div className="space-y-4 text-center">
            <p className="text-yellow-600 text-3xl font-black tracking-[0.5em] mb-2 font-serif">京都焼肉なおき</p>
            <p className="text-zinc-700 text-[10px] tracking-[0.3em] uppercase font-sans font-bold">Nagoya Sakae / Pearl Plaza 2F</p>
          </div>

          <div className="space-y-10 text-sm font-light text-zinc-400 leading-relaxed max-w-md mx-auto">
            <p className="tracking-widest">
              愛知県名古屋市中区栄4-6-18<br />
              パールプラザビル2F
            </p>
            
            <div className="space-y-3">
              <p className="text-[10px] text-zinc-600 uppercase tracking-[0.4em] font-sans font-bold">Contact</p>
              <p className="text-3xl md:text-4xl font-bold font-sans tracking-tight text-white hover:text-yellow-600 transition-colors">
                <a href="tel:0529906329">052-990-6329</a>
              </p>
            </div>

            <p className="text-xs pt-4 opacity-80">
              地下鉄栄駅 12番出口より徒歩8分<br />
              営業時間：18:00 〜 翌4:00<br />
              <span className="opacity-50">（金曜のみ 〜24:00 / 水曜定休）</span>
            </p>
          </div>

          <div className="text-[9px] text-zinc-800 tracking-[0.4em] uppercase pt-16 font-sans">
            © 2026 KYOTO YAKINIKU NAOKI. All Rights Reserved.
          </div>
        </div>
      </footer>
    </main>
  );
}

import Image from 'next/image';
import Link from 'next/link';

export default function Home() {
  return (
    <main className="min-h-screen bg-black text-white font-serif selection:bg-yellow-700 selection:text-white">
      
      {/* HERO: 背景をロゴに合わせた薄いグレーに。ロゴとコピーのみ */}
      <section className="relative h-screen flex flex-col items-center justify-center bg-zinc-50 px-4 text-black border-b border-zinc-200">
        <div className="mb-12">
          {/* public/logo.png を表示 */}
          <Image 
            src="/logo.png" 
            alt="京都焼肉なおき" 
            width={240} 
            height={120} 
            priority
            className="object-contain"
          />
        </div>
        <div className="text-center">
          <h1 className="text-xl md:text-3xl tracking-[0.3em] leading-loose font-medium">
            京都二十年の技。<br />
            秘伝のタレで紡ぐ、夜の一皿。
          </h1>
        </div>
        
        {/* 装飾: スクロールを促すライン */}
        <div className="absolute bottom-12 left-1/2 -translate-x-1/2 flex flex-col items-center gap-3">
          <span className="text-black/30 text-[9px] tracking-[0.6em] uppercase font-sans">Scroll</span>
          <div className="w-px h-16 bg-gradient-to-b from-black/20 to-transparent" />
        </div>
      </section>

      {/* SAUCE SECTION: 画像なし、文章のみで「タレ」を表現 */}
      <section className="py-28 bg-[#0a0a0a] px-6">
        <div className="max-w-4xl mx-auto text-center">
          <div className="mb-12">
            <span className="inline-block bg-[#b01020] text-white text-[9px] tracking-[0.4em] px-5 py-2 mb-6 font-bold uppercase font-sans">The Tradition</span>
            <h2 className="text-3xl md:text-4xl tracking-[0.3em] mb-6">こだわりのタレ</h2>
            <div className="w-12 h-0.5 bg-yellow-600 mx-auto mb-8" />
          </div>
          <div className="space-y-10 text-base md:text-lg leading-[2.5] text-zinc-400 max-w-2xl mx-auto">
            <p>
              「京都焼肉なおき」の命とも言えるのは、<br />
              京都・大韶園から受け継いだ秘伝の「みそダレ」です。
            </p>
            <p>
              厳選された素材をじっくりと煮込み、<br />
              一晩寝かせることで生まれる深いコクと芳醇な香り。<br />
              肉本来の旨味を最大限に引き出す、熟成された味わいをご堪能ください。
            </p>
          </div>
        </div>
      </section>

      {/* NAVIGATION: 文字のみの洗練されたリスト形式 */}
      <section className="py-12 bg-black px-6 border-y border-white/5">
        <div className="max-w-xl mx-auto divide-y divide-white/10">
          {[
            { href: '/menu', label: '御品書', sub: 'MENU' },
            { href: '/reserve', label: 'ご予約', sub: 'RESERVATION' },
            { href: '/wage', label: '採用情報', sub: 'RECRUIT' },
          ].map(link => (
            <Link key={link.href} href={link.href} className="flex justify-between items-center py-10 group transition-colors hover:bg-white/5 px-4 -mx-4">
              <h3 className="text-xl md:text-2xl tracking-[0.3em] font-medium transition-colors group-hover:text-white">{link.label}</h3>
              <p className="text-yellow-600 text-xs md:text-sm tracking-[0.4em] group-hover:translate-x-2 transition-transform">{link.sub} →</p>
            </Link>
          ))}
        </div>
      </section>

      {/* FOOTER: 名古屋・栄の店舗情報 */}
      <footer className="py-20 bg-[#0a0a0a]">
        <div className="max-w-4xl mx-auto text-center px-6 space-y-10">
          <div className="relative w-20 h-24 mx-auto opacity-30 grayscale invert">
            <Image src="/logo.png" alt="なおき ロゴ" fill className="object-contain" />
          </div>
          
          <div className="space-y-4">
            <p className="text-yellow-600 text-2xl font-black tracking-[0.4em] mb-2">京都焼肉なおき</p>
            <p className="text-zinc-600 text-[9px] tracking-[0.2em] uppercase font-sans">Kyoto Style Yakiniku in Nagoya</p>
          </div>

          <div className="space-y-8 text-sm font-light text-zinc-400 leading-relaxed max-w-md mx-auto">
            <p className="tracking-widest">
              〒460-0008<br />
              愛知県名古屋市中区栄4-6-18<br />
              パールプラザビル2F
            </p>
            
            <div className="space-y-2">
              <p className="text-xs text-zinc-600 uppercase tracking-widest font-sans">Contact</p>
              <p className="text-3xl font-bold font-sans tracking-tight text-white">052-990-6329</p>
            </div>

            <p className="text-xs pt-4">
              アクセス：地下鉄栄駅より徒歩8分<br />
              営業時間：18:00 〜 翌4:00<br />
              <span className="opacity-60">（金曜のみ 〜24:00 / 水曜定休）</span>
            </p>
          </div>

          <div className="text-[9px] text-zinc-800 tracking-[0.3em] uppercase pt-12 font-sans">
            © 2026 KYOTO YAKINIKU NAOKI.
          </div>
        </div>
      </footer>
    </main>
  );
}

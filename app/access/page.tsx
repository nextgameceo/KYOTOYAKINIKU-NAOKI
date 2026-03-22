import Image from 'next/image';
import Link from 'next/link';

export default function AccessPage() {
  // Googleマップの埋め込みURL（栄パールプラザビル）
  const mapUrl = "https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3261.6429944733365!2d136.9126284762886!3d35.165545358487974!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x600370d057778997%3A0x67396a84758d6978!2z44OR44O844Or44OX44Op44K244OT44Or!5e0!3m2!1sja!2sjp!4v1711070000000!5m2!1sja!2sjp";

  return (
    <main className="min-h-screen bg-black text-[#e0d8c3] font-serif py-24 px-6 selection:bg-[#d4af37] selection:text-black">
      <div className="max-w-5xl mx-auto">
        
        {/* ヘッダー */}
        <div className="text-center mb-24 relative">
          <div className="mb-6 h-32 w-16 relative mx-auto opacity-30 grayscale invert">
             <Image src="/logo.png" alt="" fill className="object-contain" />
          </div>
          <h1 className="text-4xl md:text-5xl tracking-[0.4em] mb-4 text-white">交通案内</h1>
          <p className="text-[#d4af37] text-[10px] tracking-[0.5em] uppercase font-sans font-bold">Access</p>
        </div>

        <div className="grid lg:grid-cols-2 gap-16 items-start">
          
          {/* 左側：店舗情報と道案内 */}
          <div className="space-y-12 order-2 lg:order-1">
            <section className="space-y-6">
              <div className="flex items-center gap-4 border-b border-[#d4af37]/30 pb-4">
                <div className="w-1.5 h-6 bg-[#b01020]" />
                <h2 className="text-2xl tracking-widest text-white">京都焼肉なおき</h2>
              </div>
              
              <div className="space-y-8 text-sm md:text-base font-sans font-light leading-loose">
                <div>
                  <p className="text-[#d4af37] text-xs tracking-[0.3em] font-bold mb-2 uppercase font-serif">Address</p>
                  <p className="text-zinc-300">
                    愛知県名古屋市中区栄4-6-18<br />
                    パールプラザビル 2F
                  </p>
                </div>

                <div>
                  <p className="text-[#d4af37] text-xs tracking-[0.3em] font-bold mb-2 uppercase font-serif">Station</p>
                  <p className="text-zinc-300">
                    地下鉄東山線・名城線「栄駅」12番出口より徒歩8分<br />
                    「栄四丁目」交差点よりすぐ
                  </p>
                </div>

                <div>
                  <p className="text-[#d4af37] text-xs tracking-[0.3em] font-bold mb-2 uppercase font-serif">Hours</p>
                  <p className="text-zinc-300">
                    18:00 〜 翌4:00<br />
                    <span className="text-zinc-500 text-xs">※金曜日：18:00 〜 24:00</span><br />
                    <span className="text-zinc-500 text-xs">※定休日：水曜日</span>
                  </p>
                </div>
              </div>

              <div className="pt-8">
                <a 
                  href="tel:0529906329" 
                  className="inline-block px-12 py-5 border border-[#d4af37] text-[#d4af37] hover:bg-[#d4af37] hover:text-black transition-all tracking-[0.3em] font-bold font-serif"
                >
                  052-990-6329
                </a>
              </div>
            </section>
          </div>

          {/* 右側：Googleマップ（和風フレーム付き） */}
          <div className="order-1 lg:order-2">
            <div className="relative p-2.5 bg-[#111] border border-[#d4af37]/30 shadow-2xl">
              {/* 四隅の飾り */}
              <div className="absolute top-0 left-0 w-6 h-6 border-t-2 border-l-2 border-[#d4af37] -translate-x-1 -translate-y-1" />
              <div className="absolute top-0 right-0 w-6 h-6 border-t-2 border-r-2 border-[#d4af37] translate-x-1 -translate-y-1" />
              <div className="absolute bottom-0 left-0 w-6 h-6 border-b-2 border-l-2 border-[#d4af37] -translate-x-1 translate-y-1" />
              <div className="absolute bottom-0 right-0 w-6 h-6 border-b-2 border-r-2 border-[#d4af37] translate-x-1 translate-y-1" />

              <div className="relative w-full aspect-square md:aspect-video lg:aspect-square overflow-hidden bg-zinc-900 grayscale-[0.8] hover:grayscale-0 transition-all duration-1000">
                <iframe
                  src={mapUrl}
                  width="100%"
                  height="100%"
                  style={{ border: 0 }}
                  allowFullScreen={true}
                  loading="lazy"
                  referrerPolicy="no-referrer-when-downgrade"
                  title="京都焼肉なおき 地図"
                />
              </div>
            </div>
            <p className="text-[10px] text-center text-zinc-600 mt-6 tracking-[0.4em] font-sans">
              ※ビル2F、突き当たりが当店でございます。
            </p>
          </div>

        </div>

        {/* 戻るボタン */}
        <div className="mt-32 text-center">
          <Link href="/" className="text-[10px] tracking-[0.5em] text-zinc-600 hover:text-white transition-colors uppercase font-sans font-bold">
            ← Back to Top
          </Link>
        </div>
      </div>
    </main>
  );
}

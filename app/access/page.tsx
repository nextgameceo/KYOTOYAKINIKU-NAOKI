import type { Metadata } from 'next';
import Image from 'next/image';
import Link from 'next/link';

export const metadata: Metadata = {
  title: '交通案内',
  description:
    '京都焼肉なおきへのアクセス。愛知県名古屋市中区栄4-6-18 パールプラザビル2F。地下鉄栄駅12番出口より徒歩8分。',
};

export default function AccessPage() {
  return (
    <main className="min-h-screen bg-black text-[#e0d8c3] font-serif py-24 px-6 selection:bg-[#d4af37] selection:text-black">
      <div className="max-w-5xl mx-auto">

        {/* ヘッダー */}
        <div className="text-center mb-24 relative border-b border-white/5 pb-12">
          <div className="mb-6 h-32 w-16 relative mx-auto opacity-30 grayscale invert" aria-hidden="true">
            <Image src="/logo.png" alt="" fill className="object-contain" priority />
          </div>
          <h1 className="text-4xl md:text-5xl tracking-[0.4em] mb-4 text-white uppercase">
            交通案内
          </h1>
          <p className="text-[#d4af37] text-[10px] tracking-[0.5em] uppercase font-sans font-bold">
            Access
          </p>
        </div>

        <div className="grid lg:grid-cols-2 gap-16 items-start">

          {/* 左側：店舗情報 */}
          <div className="space-y-12 order-2 lg:order-1">
            <section
              className="space-y-6 bg-white/5 p-10 border border-white/10 shadow-2xl"
              aria-labelledby="shop-info-heading"
            >
              <div className="flex items-center gap-4 mb-8">
                <div className="w-1.5 h-6 bg-[#b01020]" aria-hidden="true" />
                <h2 id="shop-info-heading" className="text-2xl tracking-widest text-white">
                  京都焼肉なおき
                </h2>
              </div>

              <dl className="space-y-8 text-sm md:text-base font-sans font-light leading-loose">
                <div>
                  <dt className="text-[#d4af37] text-xs tracking-[0.3em] font-bold mb-3 uppercase font-serif">
                    Address
                  </dt>
                  <dd className="text-zinc-300">
                    愛知県名古屋市中区栄4-6-18<br />
                    パールプラザビル 2F
                  </dd>
                </div>

                <div>
                  <dt className="text-[#d4af37] text-xs tracking-[0.3em] font-bold mb-3 uppercase font-serif">
                    Station
                  </dt>
                  <dd className="text-zinc-300">
                    地下鉄東山線・名城線「栄駅」12番出口より徒歩8分<br />
                    「栄四丁目」交差点よりすぐ
                  </dd>
                </div>

                <div>
                  <dt className="text-[#d4af37] text-xs tracking-[0.3em] font-bold mb-3 uppercase font-serif">
                    Hours
                  </dt>
                  <dd className="text-zinc-300">
                    18:00 〜 翌4:00<br />
                    <span className="text-zinc-500 text-xs block mt-1">
                      ※日曜日：18:00 〜 翌5:00
                    </span>
                    <span className="text-zinc-500 text-xs block">
                      ※定休日：水曜日
                    </span>
                  </dd>
                </div>
              </dl>

              <div className="pt-10 text-center lg:text-left">
                <a
                  href="tel:0529906329"
                  className="inline-block px-12 py-5 border-2 border-[#d4af37] text-[#d4af37] hover:bg-[#d4af37] hover:text-black transition-all tracking-[0.4em] font-bold font-serif text-2xl shadow-xl"
                  aria-label="電話で予約：052-990-6329"
                >
                  052-990-6329
                </a>
              </div>
            </section>
          </div>

          {/* 右側：Googleマップ */}
          <div className="order-1 lg:order-2 group">
            <div className="relative p-2.5 bg-[#111] border-2 border-[#d4af37]/30 shadow-2xl transition-all group-hover:border-[#d4af37]/60">
              {/* 四隅の飾り */}
              <div className="absolute top-0 left-0 w-6 h-6 border-t-2 border-l-2 border-[#d4af37] -translate-x-1 -translate-y-1 pointer-events-none" aria-hidden="true" />
              <div className="absolute top-0 right-0 w-6 h-6 border-t-2 border-r-2 border-[#d4af37] translate-x-1 -translate-y-1 pointer-events-none" aria-hidden="true" />
              <div className="absolute bottom-0 left-0 w-6 h-6 border-b-2 border-l-2 border-[#d4af37] -translate-x-1 translate-y-1 pointer-events-none" aria-hidden="true" />
              <div className="absolute bottom-0 right-0 w-6 h-6 border-b-2 border-r-2 border-[#d4af37] translate-x-1 translate-y-1 pointer-events-none" aria-hidden="true" />

              {/* マップ本体 */}
              <div className="relative w-full aspect-square md:aspect-video lg:aspect-square overflow-hidden bg-zinc-900 grayscale hover:grayscale-0 transition-all duration-1000 shadow-inner">
                <iframe
                  src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3261.5162929804014!2d136.91166137643071!3d35.16868235795843!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x6003710feec50c8b%3A0xe2b869f4a598cbdd!2z5Lqs6YO954S86IKJ44Gq44GK44GN!5e0!3m2!1sja!2sjp!4v1774143282171!5m2!1sja!2sjp"
                  width="100%"
                  height="100%"
                  style={{ border: 0 }}
                  allowFullScreen={true}
                  loading="lazy"
                  referrerPolicy="no-referrer-when-downgrade"
                  title="京都焼肉なおきの地図"
                />
              </div>
            </div>

            {/* Google マップで開くリンク */}
            <div className="mt-4 text-right">
              <a
                href="https://maps.google.com/?q=愛知県名古屋市中区栄4-6-18+パールプラザビル2F"
                target="_blank"
                rel="noopener noreferrer"
                className="text-[10px] text-zinc-600 hover:text-[#d4af37] transition-colors tracking-widest font-sans"
              >
                Google マップで開く →
              </a>
            </div>
          </div>

        </div>

        {/* 戻るボタン */}
        <div className="mt-32 text-center">
          <Link
            href="/"
            className="text-[10px] tracking-[0.5em] text-zinc-600 hover:text-white transition-colors uppercase font-sans font-bold"
          >
            ← Back to Top
          </Link>
        </div>
      </div>
    </main>
  );
}

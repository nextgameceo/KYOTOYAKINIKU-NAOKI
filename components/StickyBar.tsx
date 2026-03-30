'use client';
import Link from 'next/link';

export default function StickyBar() {
  return (
    <div className="fixed bottom-0 left-0 right-0 z-50">
      {/* 営業時間バー */}
      <div className="bg-[#0a0805]/90 backdrop-blur-sm border-t border-[#c8a84a]/15 px-4 py-1.5 flex items-center justify-center gap-4">
        <p className="text-[10px] text-white/35 tracking-widest">
          営業 <span className="text-white/60">18:00〜翌4:00</span>
          <span className="mx-2 text-white/20">|</span>
          定休 <span className="text-white/60">水曜日</span>
        </p>
      </div>
      {/* CTAボタン */}
      <div className="grid grid-cols-2 h-14">
        <a
          href="tel:052-990-6329"
          className="flex items-center justify-center gap-2 bg-[#1a1208] hover:bg-[#2a1e10] text-white border-t border-r border-[#c8a84a]/20 transition-colors active:bg-[#2a1e10]"
        >
          <span className="text-[#c8a84a] text-base">☎</span>
          <div className="flex flex-col items-start">
            <span className="text-[9px] text-white/40 tracking-widest leading-none mb-0.5">お電話で</span>
            <span className="text-sm font-semibold tracking-wide leading-none" style={{ fontFamily: 'var(--font-noto-serif)' }}>
              電話予約
            </span>
          </div>
        </a>
        <Link
          href="/reserve"
          className="flex items-center justify-center gap-2 bg-[#b01020] hover:bg-[#d01828] text-white border-t border-[#c8a84a]/20 transition-colors active:bg-[#d01828]"
        >
          <span className="text-base">🗓</span>
          <div className="flex flex-col items-start">
            <span className="text-[9px] text-white/70 tracking-widest leading-none mb-0.5">かんたん</span>
            <span className="text-sm font-semibold tracking-wide leading-none" style={{ fontFamily: 'var(--font-noto-serif)' }}>
              WEB予約
            </span>
          </div>
        </Link>
      </div>
    </div>
  );
}

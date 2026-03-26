'use client';
import Link from 'next/link';

interface StickyBarProps {
  tel?: string;
}

export default function StickyBar({ tel = '052-990-6329' }: StickyBarProps) {
  return (
    <div
      className="fixed bottom-0 left-0 right-0 z-50 flex h-14 shadow-[0_-4px_20px_rgba(0,0,0,0.6)]"
      role="complementary"
      aria-label="予約・電話バー"
    >
      {/* 店舗情報エリア */}
      <div className="flex flex-1 items-center justify-between bg-[#0a0a0a]/95 backdrop-blur-sm border-t border-white/10 px-4">
        <span className="text-[#c8a84a] font-semibold text-xs tracking-widest hidden sm:block">
          京都焼肉なおき
        </span>
        <div className="hidden sm:flex items-center gap-2 text-xs text-white/50 tracking-wider">
          <span>
            営業時間
            <span className="text-white/80 ml-1">18:00〜翌4:00</span>
          </span>
          <span className="mx-2">|</span>
          <span>
            定休日
            <span className="text-white/80 ml-1">水曜</span>
          </span>
        </div>
      </div>

      {/* 電話予約ボタン */}
      <a
        href={`tel:${tel.replace(/-/g, '')}`}
        className="flex items-center justify-center gap-2 bg-white/10 hover:bg-white/20 text-white text-sm tracking-widest px-6 border-l border-white/10 transition-colors min-w-[120px]"
        aria-label={`電話で予約：${tel}`}
      >
        <span aria-hidden="true">📞</span>
        <span className="hidden sm:inline">お電話で予約</span>
        <span className="sm:hidden">電話</span>
      </a>

      {/* WEB予約ボタン */}
      <Link
        href="/reserve"
        className="flex items-center justify-center bg-[#b01020] hover:bg-[#d01828] text-white text-sm tracking-widest px-6 transition-colors min-w-[120px]"
      >
        <span className="hidden sm:inline" aria-hidden="true">🗓 </span>
        WEB予約
      </Link>
    </div>
  );
}

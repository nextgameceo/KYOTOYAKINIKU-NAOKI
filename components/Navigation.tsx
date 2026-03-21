'use client';
import { useState } from 'react';
import Link from 'next/link';

const links = [
  { href: '/', label: 'トップ' },
  { href: '/#concept', label: 'こだわり' },
  { href: '/menu', label: 'メニュー' },
  { href: '/reserve', label: 'WEB予約' },
  { href: '/#access', label: 'アクセス' },
  { href: '/wage', label: '採用情報' },
];

export default function Navigation() {
  const [open, setOpen] = useState(false);

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 flex items-stretch h-14 bg-[#0a0a0a]/95 backdrop-blur-sm border-b border-white/10">
      <div className="flex items-center flex-1 px-4 gap-6">
        <Link
          href="/"
          className="font-['Zen_Old_Mincho',serif] text-[#c8a84a] text-lg font-black tracking-widest shrink-0"
        >
          なおき
        </Link>
        <ul className="hidden md:flex gap-1 h-full">
          {links.map(l => (
            <li key={l.href} className="h-full">
              <Link
                href={l.href}
                className="flex items-center h-full px-4 text-xs tracking-widest text-white/70 hover:text-white border-b-2 border-transparent hover:border-[#b01020] transition-all whitespace-nowrap"
              >
                {l.label}
              </Link>
            </li>
          ))}
        </ul>
      </div>

      <div className="flex items-stretch">
        {/* デスクトップ用電話リンク：<a を補完 */}
        <a 
          href="tel:052-990-6329"
          className="hidden md:flex flex-col justify-center px-4 text-white bg-white/5 border-l border-white/10"
        >
          <span className="text-[10px] text-white/40 tracking-widest">ご予約・お問い合わせ</span>
          <span className="text-sm font-semibold tracking-wide">052-990-6329</span>
        </a>
        
        <Link
          href="/reserve"
          className="flex items-center justify-center bg-[#b01020] hover:bg-[#d01828] text-white text-xs tracking-widest px-5 transition-colors whitespace-nowrap"
        >
          WEB予約
        </Link>
        
        <button
          className="md:hidden flex items-center justify-center w-14 text-white border-l border-white/10"
          onClick={() => setOpen(!open)}
        >
          {open ? '✕' : '☰'}
        </button>
      </div>

      {/* Mobile menu */}
      {open && (
        <div className="absolute top-14 left-0 right-0 bg-[#0a0a0a] border-b border-white/10 md:hidden z-50">
          {links.map(l => (
            <Link
              key={l.href}
              href={l.href}
              onClick={() => setOpen(false)}
              className="block px-6 py-4 text-sm text-white/70 hover:text-white border-b border-white/5 tracking-widest"
            >
              {l.label}
            </Link>
          ))}
          
          {/* モバイル用電話リンク：<a を補完 */}
          <a
            href="tel:052-990-6329"
            onClick={() => setOpen(false)}
            className="block px-6 py-4 text-sm text-[#c8a84a] border-b border-white/5 tracking-widest"
          >
            📞 052-990-6329
          </a>
        </div>
      )}
    </nav>
  );
}

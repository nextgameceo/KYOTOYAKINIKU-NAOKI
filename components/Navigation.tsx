'use client';
import { useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';

const links = [
  { href: '/', label: 'トップ' },
  { href: '/#concept', label: 'こだわり' },
  { href: '/menu', label: 'お品書き' },
  { href: '/reserve', label: 'WEB予約' },
  { href: '/#access', label: 'アクセス' },
  { href: '/wage', label: '採用情報' },
];

export default function Navigation() {
  const [open, setOpen] = useState(false);

  return (
    <>
      <nav className="fixed top-0 left-0 right-0 z-50 h-14 flex items-center justify-between px-4 bg-[#2a2a2a]/95 backdrop-blur-md border-b border-white/10">
        <Link href="/" className="flex items-center gap-2">
          <div className="relative w-7 h-9">
            <Image src="/logo.png" alt="なおき" fill className="object-contain" />
          </div>
          <span
            className="text-[#c8a84a] text-sm font-black tracking-[0.3em]"
            style={{ fontFamily: 'var(--font-noto-serif)' }}
          >
            なおき
          </span>
        </Link>

        <ul className="hidden md:flex items-center gap-6 h-full">
          {links.map(l => (
            <li key={l.href}>
              <Link
                href={l.href}
                className="text-[11px] tracking-[0.25em] text-white/60 hover:text-[#c8a84a] transition-colors"
                style={{ fontFamily: 'var(--font-noto-serif)' }}
              >
                {l.label}
              </Link>
            </li>
          ))}
        </ul>

        <div className="flex items-center gap-2">
          <a
            href="tel:052-990-6329"
            className="hidden md:flex items-center gap-1 text-[11px] text-white/50 hover:text-white tracking-widest transition-colors"
          >
            ☎ 052-990-6329
          </a>
          <Link
            href="/reserve"
            className="hidden md:flex items-center justify-center bg-[#b01020] hover:bg-[#d01828] text-white text-[11px] tracking-widest px-4 py-2 transition-colors"
            style={{ fontFamily: 'var(--font-noto-serif)' }}
          >
            WEB予約
          </Link>
          <button
            className="md:hidden flex flex-col justify-center items-center w-10 h-10 gap-1.5"
            onClick={() => setOpen(!open)}
            aria-label="メニュー"
          >
            <span className={`block w-6 h-px bg-white/70 transition-all ${open ? 'rotate-45 translate-y-1.5' : ''}`} />
            <span className={`block w-6 h-px bg-white/70 transition-all ${open ? 'opacity-0' : ''}`} />
            <span className={`block w-6 h-px bg-white/70 transition-all ${open ? '-rotate-45 -translate-y-1.5' : ''}`} />
          </button>
        </div>
      </nav>

      {open && (
        <div
          className="fixed inset-0 z-40 bg-[#2a2a2a]/98 backdrop-blur-md flex flex-col pt-20 px-8"
          onClick={() => setOpen(false)}
        >
          <div className="w-12 h-px bg-[#c8a84a]/50 mb-8" />
          <nav className="flex flex-col gap-0 divide-y divide-white/8">
            {links.map(l => (
              <Link
                key={l.href}
                href={l.href}
                onClick={() => setOpen(false)}
                className="flex items-center justify-between py-5 text-lg text-white/80 hover:text-[#c8a84a] tracking-[0.2em] transition-colors"
                style={{ fontFamily: 'var(--font-noto-serif)' }}
              >
                <span>{l.label}</span>
                <span className="text-[#c8a84a]/50 text-xs">›</span>
              </Link>
            ))}
          </nav>
          <div className="mt-10 pt-8 border-t border-white/8">
            <a
              href="tel:052-990-6329"
              className="flex items-center gap-3 text-white/50 text-sm tracking-widest"
            >
              <span className="text-[#c8a84a]">☎</span> 052-990-6329
            </a>
          </div>
          <div
            className="absolute right-8 top-24 text-white/5 text-6xl font-black pointer-events-none"
            style={{ writingMode: 'vertical-rl', fontFamily: 'var(--font-noto-serif)' }}
          >
            京都焼肉なおき
          </div>
        </div>
      )}
    </>
  );
}

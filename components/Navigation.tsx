'use client';
import { useState, useEffect } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';

const links = [
  { href: '/', label: 'トップ' },
  { href: '/#concept', label: 'こだわり' },
  { href: '/menu', label: 'メニュー' },
  { href: '/news', label: 'お知らせ' }, // ← 追加（ニュース一覧ページへのリンク）
  { href: '/reserve', label: 'WEB予約' },
  { href: '/#access', label: 'アクセス' },
  { href: '/wage', label: '採用情報' },
];

export default function Navigation() {
  const [open, setOpen] = useState(false);
  // スクロール量に応じてナビの背景を変化させる
  const [scrolled, setScrolled] = useState(false);
  const pathname = usePathname();

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // モバイルメニューが開いているときはスクロールを無効化
  useEffect(() => {
    document.body.style.overflow = open ? 'hidden' : '';
    return () => { document.body.style.overflow = ''; };
  }, [open]);

  return (
    <nav
      className={`fixed top-0 left-0 right-0 z-50 flex items-stretch h-14 border-b border-white/10 transition-all duration-300 ${
        scrolled ? 'bg-[#0a0a0a]/98 backdrop-blur-md shadow-lg' : 'bg-[#0a0a0a]/95 backdrop-blur-sm'
      }`}
      aria-label="メインナビゲーション"
    >
      <div className="flex items-center flex-1 px-4 gap-6">
        <Link
          href="/"
          className="font-['Zen_Old_Mincho',serif] text-[#c8a84a] text-lg font-black tracking-widest shrink-0"
          aria-label="京都焼肉なおき トップページ"
        >
          なおき
        </Link>
        <ul className="hidden md:flex gap-1 h-full" role="menubar">
          {links.map((l) => {
            // 現在のページのリンクをアクティブ表示
            const isActive =
              l.href === '/'
                ? pathname === '/'
                : pathname.startsWith(l.href.replace('/#', '/'));
            return (
              <li key={l.href} className="h-full" role="none">
                <Link
                  href={l.href}
                  role="menuitem"
                  className={`flex items-center h-full px-4 text-xs tracking-widest border-b-2 transition-all whitespace-nowrap ${
                    isActive
                      ? 'text-white border-[#b01020]'
                      : 'text-white/70 hover:text-white border-transparent hover:border-[#b01020]'
                  }`}
                >
                  {l.label}
                </Link>
              </li>
            );
          })}
        </ul>
      </div>

      <div className="flex items-stretch">
        {/* デスクトップ用電話リンク */}
        <a
          href="tel:052-990-6329"
          className="hidden md:flex flex-col justify-center px-4 text-white bg-white/5 border-l border-white/10 hover:bg-white/10 transition-colors"
          aria-label="電話予約：052-990-6329"
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

        {/* ハンバーガーメニューボタン（モバイル） */}
        <button
          className="md:hidden flex items-center justify-center w-14 text-white border-l border-white/10"
          onClick={() => setOpen(!open)}
          aria-expanded={open}
          aria-controls="mobile-menu"
          aria-label={open ? 'メニューを閉じる' : 'メニューを開く'}
        >
          {open ? '✕' : '☰'}
        </button>
      </div>

      {/* モバイルメニュー */}
      {open && (
        <div
          id="mobile-menu"
          className="absolute top-14 left-0 right-0 bg-[#0a0a0a] border-b border-white/10 md:hidden z-50"
          role="menu"
        >
          {links.map((l) => (
            <Link
              key={l.href}
              href={l.href}
              role="menuitem"
              onClick={() => setOpen(false)}
              className="block px-6 py-4 text-sm text-white/70 hover:text-white border-b border-white/5 tracking-widest"
            >
              {l.label}
            </Link>
          ))}
          {/* モバイル用電話リンク */}
          <a
            href="tel:052-990-6329"
            onClick={() => setOpen(false)}
            role="menuitem"
            className="block px-6 py-4 text-sm text-[#c8a84a] border-b border-white/5 tracking-widest"
            aria-label="電話予約：052-990-6329"
          >
            📞 052-990-6329
          </a>
        </div>
      )}
    </nav>
  );
}

'use client';
import { useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';

export default function WagePage() {
  const [form, setForm] = useState({ name: '', tel: '', age: '' });
  const [status, setStatus] = useState<'idle' | 'loading' | 'done' | 'error'>('idle');

  const handleSubmit = async () => {
    if (!form.name || !form.tel || !form.age) return;
    setStatus('loading');
    try {
      const res = await fetch('/api/send-recruit', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(form),
      });
      if (!res.ok) throw new Error();
      setStatus('done');
    } catch {
      setStatus('error');
    }
  };

  return (
    <main className="min-h-screen bg-[#0a0805] text-white">

      {/* HERO */}
      <section className="relative h-[60vh] flex items-end overflow-hidden">
        <Image
          src="/sec6_i1.jpg"
          alt="採用"
          fill
          className="object-cover opacity-50"
          priority
        />
        <div className="absolute inset-0 bg-gradient-to-t from-[#0a0805] via-[#0a0805]/40 to-transparent" />
        <div className="relative z-10 px-6 pb-12 max-w-4xl mx-auto w-full">
          <div className="flex items-center gap-4 mb-4">
            <div className="w-8 h-px bg-[#c8a84a]/60" />
            <span className="text-[#c8a84a] text-[10px] tracking-[0.5em] font-[var(--font-montserrat)]">
              STAFF WANTED
            </span>
          </div>
          <h1
            className="text-4xl md:text-6xl font-black leading-tight tracking-wide"
            style={{ fontFamily: 'var(--font-noto-serif)' }}
          >
            京都二十年の技を、<br />
            <span className="text-[#c8a84a]">名古屋・栄</span>で繋ぐ。
          </h1>
        </div>
      </section>

      {/* INTRO */}
      <section className="py-16 px-6 max-w-4xl mx-auto">
        <p className="text-sm font-light leading-[2.4] text-white/65 max-w-xl">
          深夜の栄で、本物の京都焼肉を。<br />
          「なおき」の味と空間を共に創り上げる、<br />
          新しい仲間を募集します。<span className="text-[#c8a84a]">未経験、大歓迎。</span>
        </p>
      </section>

      {/* 募集要項 */}
      <section className="py-12 bg-[#140f08]">
        <div className="max-w-4xl mx-auto px-6">
          <div className="flex items-center gap-4 mb-10">
            <div className="w-6 h-px bg-[#c8a84a]/50" />
            <h2
              className="text-xl font-bold tracking-widest text-[#c8a84a]"
              style={{ fontFamily: 'var(--font-noto-serif)' }}
            >
              募集要項
            </h2>
            <div className="flex-1 h-px bg-[#c8a84a]/20" />
          </div>

          <div className="flex flex-col gap-0 divide-y divide-white/8">
            {[
              { label: '募集職種', value: 'ホールスタッフ（アルバイト）' },
              { label: '給与', value: '時給 1,100円〜（経験により優遇）\n深夜割増あり（22時以降 +25%）' },
              { label: '勤務時間', value: '18:00〜翌4:00（シフト制）\n週2日〜・1日3時間〜 相談可' },
              { label: '待遇', value: '絶品まかない有り・交通費支給・制服貸与' },
              { label: '応募資格', value: '未経験歓迎・学生可・Wワーク可\n18歳以上（高校生不可）' },
              { label: '勤務地', value: '名古屋市中区栄4-6-18 パールプラザビル2F' },
              { label: '応募方法', value: '下記フォームまたはお電話：052-990-6329' },
            ].map(item => (
              <div key={item.label} className="grid grid-cols-[100px_1fr] gap-4 py-5 items-start">
                <span
                  className="text-xs text-[#c8a84a] tracking-widest font-bold pt-0.5"
                  style={{ fontFamily: 'var(--font-noto-serif)' }}
                >
                  {item.label}
                </span>
                <span className="text-sm font-light text-white/80 leading-relaxed whitespace-pre-line">
                  {item.value}
                </span>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* まかない */}
      <section className="py-16 px-6 max-w-4xl mx-auto">
        <div className="flex items-center gap-4 mb-10">
          <div className="w-6 h-px bg-[#c8a84a]/50" />
          <h2
            className="text-xl font-bold tracking-widest text-[#c8a84a]"
            style={{ fontFamily: 'var(--font-noto-serif)' }}
          >
            スタッフまかない
          </h2>
          <div className="flex-1 h-px bg-[#c8a84a]/20" />
        </div>

        <div className="grid grid-cols-2 md:grid-cols-3 gap-3 mb-8">
          {[
            { src: '/sec3_i1.jpg', label: 'ネギタン塩' },
            { src: '/sec3_i2.jpg', label: '赤身3種盛り' },
            { src: '/sec3_i3.jpg', label: 'ミノ湯引き' },
          ].map(item => (
            <div key={item.label} className="relative aspect-square overflow-hidden group">
              <Image
                src={item.src}
                alt={item.label}
                fill
                className="object-cover group-hover:scale-105 transition-transform duration-500"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/70 to-transparent" />
              <span
                className="absolute bottom-3 left-3 text-xs font-bold text-white tracking-wide"
                style={{ fontFamily: 'var(--font-noto-serif)' }}
              >
                {item.label}
              </span>
            </div>
          ))}
        </div>

        <div className="bg-[#140f08] border border-[#c8a84a]/20 p-6">
          <p className="text-sm font-light leading-[2.2] text-white/65">
            シフト後は、なおき自慢のお肉をまかないとして提供。<br />
            京都仕込みの秘伝タレで味わう一皿は、<br />
            働くモチベーションになること間違いなし。
          </p>
        </div>
      </section>

      {/* 応募フォーム */}
      <section className="py-16 bg-[#140f08]">
        <div className="max-w-lg mx-auto px-6">
          <div className="flex items-center gap-4 mb-10">
            <div className="w-6 h-px bg-[#c8a84a]/50" />
            <h2
              className="text-xl font-bold tracking-widest text-[#c8a84a]"
              style={{ fontFamily: 'var(--font-noto-serif)' }}
            >
              応募フォーム
            </h2>
            <div className="flex-1 h-px bg-[#c8a84a]/20" />
          </div>

          {status === 'done' ? (
            <div className="text-center py-12">
              <div className="text-4xl mb-4">✅</div>
              <h3
                className="text-xl font-bold tracking-widest mb-3"
                style={{ fontFamily: 'var(--font-noto-serif)' }}
              >
                応募を受け付けました
              </h3>
              <p className="text-sm text-white/50 tracking-wide mb-8">
                担当よりご連絡いたします。しばらくお待ちください。
              </p>
              <Link
                href="/"
                className="text-[11px] tracking-[0.4em] text-white/30 hover:text-[#c8a84a] transition-colors"
              >
                ← トップへ戻る
              </Link>
            </div>
          ) : (
            <div className="flex flex-col gap-4">
              {[
                { key: 'name', label: 'お名前', placeholder: '山田 太郎', type: 'text' },
                { key: 'tel', label: '電話番号', placeholder: '090-0000-0000', type: 'tel' },
                { key: 'age', label: '年齢', placeholder: '25', type: 'number' },
              ].map(field => (
                <div key={field.key}>
                  <label className="block text-xs tracking-widest text-white/50 mb-2">
                    {field.label} *
                  </label>
                  <input
                    type={field.type}
                    value={form[field.key as keyof typeof form]}
                    onChange={e => setForm(f => ({ ...f, [field.key]: e.target.value }))}
                    placeholder={field.placeholder}
                    className="w-full bg-white/5 border border-white/15 text-white px-4 py-4 text-base focus:outline-none focus:border-[#c8a84a] tracking-wider placeholder:text-white/20 transition-colors"
                  />
                </div>
              ))}

              {status === 'error' && (
                <p className="text-[#b01020] text-sm tracking-wide">
                  送信に失敗しました。お電話でご連絡ください。
                </p>
              )}

              <button
                onClick={handleSubmit}
                disabled={status === 'loading' || !form.name || !form.tel || !form.age}
                className="w-full mt-4 bg-[#b01020] hover:bg-[#d01828] disabled:bg-white/10 disabled:text-white/30 text-white py-5 text-sm font-bold tracking-widest transition-colors active:scale-[0.98]"
                style={{ fontFamily: 'var(--font-noto-serif)' }}
              >
                {status === 'loading' ? '送信中...' : '応募する →'}
              </button>

              <p className="text-[10px] text-white/25 tracking-widest text-center">
                ※入力情報は採用選考のみに使用いたします
              </p>
            </div>
          )}
        </div>
      </section>

      {/* お電話でも */}
      <section className="py-12 px-6 text-center">
        <p className="text-xs text-white/40 tracking-widest mb-4">お電話でのご応募も受け付けています</p>
        <a
          href="tel:052-990-6329"
          className="inline-flex items-center gap-3 border border-white/20 hover:border-[#c8a84a] text-white hover:text-[#c8a84a] text-sm tracking-widest px-10 py-4 transition-all"
          style={{ fontFamily: 'var(--font-noto-serif)' }}
        >
          ☎ 052-990-6329
        </a>
        <div className="mt-10">
          <Link
            href="/"
            className="text-[11px] tracking-[0.4em] text-white/25 hover:text-[#c8a84a] transition-colors"
          >
            ← トップへ戻る
          </Link>
        </div>
      </section>

    </main>
  );
}

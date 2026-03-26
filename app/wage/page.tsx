'use client';
import { useEffect, useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';

// ─── 型定義（lib/microcms.ts の Wage 型と統一） ──────────
type Wage = {
  id: string;
  title: string;
  image: { url: string; width?: number; height?: number };
  description?: string;
  publishedAt: string;
};

type FormState = {
  name: string;
  tel: string;
  age: string;
};

// ─── バリデーション ────────────────────────────────────────
function validateForm(form: FormState): string | null {
  if (!form.name.trim()) return 'お名前を入力してください。';
  if (!form.tel.trim()) return '電話番号を入力してください。';
  if (!/^[0-9\-+\s()]{7,15}$/.test(form.tel.trim()))
    return '正しい電話番号を入力してください（例：09012345678）。';
  const ageNum = Number(form.age);
  if (!form.age || isNaN(ageNum) || ageNum < 18 || ageNum > 80)
    return '年齢を正しく入力してください（18〜80歳）。';
  return null;
}

export default function WagePage() {
  const [wages, setWages] = useState<Wage[]>([]);
  const [form, setForm] = useState<FormState>({ name: '', tel: '', age: '' });
  const [loading, setLoading] = useState(false);
  const [sent, setSent] = useState(false);
  const [error, setError] = useState('');

  // microCMSから賄いデータを取得（APIルート経由）
  useEffect(() => {
    fetch('/api/wage')
      .then((r) => r.json())
      .then((d) => setWages(d.contents ?? []))
      .catch((err) => console.error('Fetch error:', err));
  }, []);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setForm((f) => ({ ...f, [e.target.name]: e.target.value }));
    if (error) setError('');
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    const validationError = validateForm(form);
    if (validationError) {
      setError(validationError);
      return;
    }

    setLoading(true);
    try {
      const res = await fetch('/api/send-recruit', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(form),
      });
      if (!res.ok) {
        const body = await res.json().catch(() => ({}));
        throw new Error(body?.error ?? 'サーバーエラー');
      }
      setSent(true);
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : '不明なエラー';
      setError(`送信に失敗しました（${msg}）。お手数ですが、お電話（052-990-6329）でご連絡ください。`);
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="min-h-screen bg-black text-[#e0d8c3] font-serif selection:bg-[#d4af37] selection:text-black">

      {/* 1. HEROセクション */}
      <section className="relative py-28 text-center bg-[#050505] border-b border-white/5 px-6 overflow-hidden">
        <div className="absolute inset-0 opacity-10 grayscale invert" aria-hidden="true">
          <Image src="/sec6_i1.jpg" alt="" fill className="object-cover" />
        </div>
        <div className="relative z-10 max-w-4xl mx-auto space-y-8">
          <div className="mb-6 h-32 w-16 relative mx-auto opacity-30 grayscale invert" aria-hidden="true">
            <Image src="/logo.png" alt="" fill className="object-contain" priority />
          </div>
          <span className="inline-block bg-[#b01020] text-white text-[10px] tracking-[0.5em] px-5 py-2 mb-4 font-sans font-bold uppercase border border-[#b01020]">
            Staff Wanted
          </span>
          <h1 className="text-4xl md:text-5xl font-medium tracking-[0.3em] text-white leading-tight">
            京都二十年の技を、<br />名古屋・栄で繋ぐ。
          </h1>
          <div className="w-12 h-px bg-[#d4af37]/50 mx-auto" aria-hidden="true" />
          <p className="text-zinc-400 text-sm md:text-base tracking-[0.2em] max-w-xl mx-auto leading-loose font-sans font-light">
            深夜の栄で、本物の京都焼肉を。<br />
            「なおき」の味と空間を共に創り上げる、<br />
            新しい仲間を募集します。未経験、大歓迎。
          </p>
        </div>
      </section>

      {/* 2. WAGE GALLERY：賄い画像 */}
      {wages.length > 0 && (
        <section className="py-24 bg-[#080808] border-b border-white/5 px-6" aria-labelledby="wage-heading">
          <div className="max-w-6xl mx-auto">
            <div className="text-center mb-16">
              <span className="text-[#d4af37] text-[10px] tracking-[0.5em] uppercase font-sans font-bold">
                Today&apos;s Benefit
              </span>
              <h2 id="wage-heading" className="text-3xl md:text-4xl tracking-[0.3em] mt-3 text-white">
                本日の賄い
              </h2>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-10">
              {wages.map((w) => (
                <div key={w.id} className="group flex flex-col gap-6">
                  <div className="relative p-2.5 bg-[#111] border border-[#d4af37]/30 shadow-2xl overflow-visible">
                    {/* 四隅の飾り */}
                    <div className="absolute top-0 left-0 w-5 h-5 border-t-2 border-l-2 border-[#d4af37] -translate-x-1 -translate-y-1 pointer-events-none" aria-hidden="true" />
                    <div className="absolute top-0 right-0 w-5 h-5 border-t-2 border-r-2 border-[#d4af37] translate-x-1 -translate-y-1 pointer-events-none" aria-hidden="true" />
                    <div className="absolute bottom-0 left-0 w-5 h-5 border-b-2 border-l-2 border-[#d4af37] -translate-x-1 translate-y-1 pointer-events-none" aria-hidden="true" />
                    <div className="absolute bottom-0 right-0 w-5 h-5 border-b-2 border-r-2 border-[#d4af37] translate-x-1 translate-y-1 pointer-events-none" aria-hidden="true" />
                    <div className="relative w-full aspect-square overflow-hidden bg-zinc-900">
                      <Image
                        src={w.image.url}
                        alt={w.title}
                        fill
                        className="object-cover transition-transform duration-1000 group-hover:scale-110"
                        sizes="(max-width: 640px) 100vw, (max-width: 768px) 50vw, 33vw"
                      />
                    </div>
                  </div>
                  <div className="p-2 space-y-2 text-center">
                    <p className="text-lg tracking-widest text-white font-medium group-hover:text-[#d4af37] transition-colors">
                      {w.title}
                    </p>
                    {w.description && (
                      <p className="text-sm text-zinc-500 leading-relaxed font-sans font-light max-w-xs mx-auto">
                        {w.description}
                      </p>
                    )}
                    <p className="text-[10px] text-zinc-700 mt-3 tracking-[0.3em] font-sans font-bold uppercase border-t border-white/5 pt-3">
                      {new Date(w.publishedAt).toLocaleDateString('ja-JP').replace(/\//g, ' . ')}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* 3. CONDITIONS：募集要項 */}
      <section className="py-24 bg-black border-b border-white/5 px-6" aria-labelledby="conditions-heading">
        <div className="max-w-3xl mx-auto">
          <div className="flex items-center gap-4 mb-12 border-b border-[#d4af37]/30 pb-6">
            <div className="w-1.5 h-6 bg-[#b01020]" aria-hidden="true" />
            <h2 id="conditions-heading" className="text-3xl tracking-[0.3em] text-white">
              募集要項
            </h2>
          </div>
          <table className="w-full text-sm md:text-base font-sans">
            <tbody className="divide-y divide-white/5">
              {[
                ['募集職種', 'ホールスタッフ（アルバイト）'],
                ['給与', '時給 1,100円〜（経験により優遇）　深夜割増あり（22時以降 +25%）'],
                ['勤務時間', '18:00〜翌4:00（シフト制）　週2日〜・1日3時間〜 相談可'],
                ['待遇', '絶品まかない有り・交通費支給・制服貸与'],
                ['応募資格', '未経験歓迎・学生可・Wワーク可・18歳以上（高校生不可）'],
                ['勤務地', '名古屋市中区栄4-6-18 パールプラザビル2F'],
                ['応募方法', '以下のフォーム、またはお電話：052-990-6329'],
              ].map(([label, value]) => (
                <tr key={label} className="group">
                  <td className="py-6 pr-8 font-bold text-[#d4af37] tracking-widest whitespace-nowrap w-1/4 align-top group-hover:text-white transition-colors">
                    {label}
                  </td>
                  <td className="py-6 font-light leading-loose text-zinc-300 group-hover:text-white transition-colors">
                    {value}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>

      {/* 4. RECRUIT FORM：応募フォーム */}
      <section id="apply" className="py-28 bg-[#050505] px-6" aria-labelledby="apply-heading">
        <div className="max-w-xl mx-auto border border-white/5 p-10 md:p-12 shadow-2xl bg-black/50">
          <div className="text-center mb-16">
            <span className="text-[#d4af37] text-[10px] tracking-[0.5em] uppercase font-sans font-bold">
              Apply
            </span>
            <h2 id="apply-heading" className="text-3xl tracking-[0.3em] mt-3 text-white">
              応募フォーム
            </h2>
            <div className="w-12 h-px bg-yellow-600/30 mx-auto mt-8" aria-hidden="true" />
          </div>

          {sent ? (
            <div className="text-center py-20 border border-[#d4af37]/30 bg-white/5 space-y-6" role="status">
              <div className="text-6xl text-[#d4af37]" aria-hidden="true">✓</div>
              <h3 className="text-xl font-bold tracking-[0.2em] text-white">応募を受け付けました</h3>
              <p className="text-zinc-500 text-sm tracking-widest font-sans max-w-xs mx-auto leading-loose">
                ご入力ありがとうございます。担当より折り返し、お電話にてご連絡いたします。
              </p>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-8 font-sans" noValidate>
              {/* エラーメッセージ */}
              {error && (
                <div role="alert" className="bg-red-900/40 border border-red-500/40 text-red-300 text-sm px-5 py-4 tracking-wide">
                  {error}
                </div>
              )}

              {[
                { label: 'お名前', name: 'name', type: 'text', placeholder: '山田 太郎', autoComplete: 'name' },
                { label: '電話番号', name: 'tel', type: 'tel', placeholder: '09000000000', autoComplete: 'tel' },
                { label: '年齢', name: 'age', type: 'number', placeholder: '22', autoComplete: 'off' },
              ].map(({ label, name, type, placeholder, autoComplete }) => (
                <div key={name}>
                  <label
                    htmlFor={`recruit-${name}`}
                    className="block text-xs tracking-[0.3em] text-zinc-600 mb-3 uppercase font-bold"
                  >
                    {label} <span className="text-[#b01020]" aria-label="必須">*</span>
                  </label>
                  <input
                    id={`recruit-${name}`}
                    type={type}
                    name={name}
                    value={form[name as keyof FormState]}
                    onChange={handleChange}
                    placeholder={placeholder}
                    autoComplete={autoComplete}
                    required
                    min={name === 'age' ? 18 : undefined}
                    max={name === 'age' ? 80 : undefined}
                    inputMode={type === 'tel' ? 'tel' : type === 'number' ? 'numeric' : undefined}
                    className="w-full bg-[#111] border border-white/10 text-white px-5 py-5 text-base focus:outline-none focus:border-[#d4af37] focus:ring-1 focus:ring-[#d4af37]/30 tracking-wider placeholder:text-zinc-800 transition-all"
                  />
                </div>
              ))}

              <button
                type="submit"
                disabled={loading}
                className="w-full bg-[#b01020] hover:bg-[#d01828] disabled:bg-zinc-800 disabled:cursor-not-allowed text-white py-6 text-base font-bold tracking-[0.4em] transition-all active:scale-[0.98] font-serif uppercase group"
              >
                {loading ? (
                  <span className="animate-pulse">送信中 . . .</span>
                ) : (
                  <>
                    応募する
                    <span className="group-hover:translate-x-2 transition-transform inline-block ml-2" aria-hidden="true">
                      →
                    </span>
                  </>
                )}
              </button>
              <p className="text-center text-[10px] text-zinc-700 tracking-widest mt-6">
                ※入力情報は採用選考のみに使用いたします。
              </p>
            </form>
          )}
        </div>
      </section>

      {/* フッター */}
      <footer className="py-16 text-center border-t border-white/5 bg-black">
        <Link
          href="/"
          className="text-zinc-700 hover:text-white transition-colors text-xs tracking-[0.5em] font-sans font-bold uppercase"
        >
          ← Back to Top
        </Link>
      </footer>
    </main>
  );
}

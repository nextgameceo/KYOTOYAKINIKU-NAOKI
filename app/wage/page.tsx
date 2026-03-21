'use client';
import { useEffect, useState } from 'react';
import Image from 'next/image';

type Wage = { id: string; title: string; image: { url: string }; description?: string; publishedAt: string };

export default function WagePage() {
  const [wages, setWages] = useState<Wage[]>([]);
  const [form, setForm] = useState({ name: '', tel: '', age: '' });
  const [loading, setLoading] = useState(false);
  const [sent, setSent] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    fetch('/api/wage')
      .then(r => r.json())
      .then(d => setWages(d.contents ?? []))
      .catch(() => {});
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.name || !form.tel || !form.age) { setError('全項目を入力してください'); return; }
    setLoading(true); setError('');
    try {
      const res = await fetch('/api/send-recruit', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(form),
      });
      if (!res.ok) throw new Error();
      setSent(true);
    } catch {
      setError('送信に失敗しました。お電話でご連絡ください。');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#0a0a0a]">

      {/* Hero */}
      <section className="py-24 text-center bg-[#080604]">
        <span className="inline-block bg-[#b01020] text-white text-xs tracking-widest px-3 py-1 mb-6">Staff Wanted</span>
        <h1 className="text-4xl md:text-6xl font-black tracking-widest mb-4" style={{ fontFamily: 'var(--font-noto-serif)' }}>
          一緒に働きませんか
        </h1>
        <p className="text-white/50 text-sm tracking-widest max-w-md mx-auto leading-relaxed px-6">
          深夜の栄で、本物の焼肉を。<br />未経験・学生・Wワーク、大歓迎です。
        </p>
      </section>

      {/* Wage Gallery */}
      {wages.length > 0 && (
        <section className="py-16 bg-[#0d0a05]">
          <div className="max-w-5xl mx-auto px-6">
            <div className="text-center mb-10">
              <span className="inline-block bg-[#b01020] text-white text-xs tracking-widest px-3 py-1 mb-4">Today's Meal</span>
              <h2 className="text-3xl font-bold tracking-widest" style={{ fontFamily: 'var(--font-noto-serif)' }}>
                本日の賄い
              </h2>
            </div>
            <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
              {wages.map(w => (
                <div key={w.id} className="group overflow-hidden border border-white/10">
                  <div className="relative aspect-square overflow-hidden">
                    <Image
                      src={w.image.url}
                      alt={w.title}
                      fill
                      className="object-cover group-hover:scale-105 transition-transform duration-500"
                    />
                  </div>
                  <div className="p-4 bg-white/3">
                    <p className="text-sm font-semibold tracking-wide mb-1">{w.title}</p>
                    {w.description && <p className="text-xs text-white/50 leading-relaxed">{w.description}</p>}
                    <p className="text-[10px] text-white/30 mt-2 tracking-widest font-[var(--font-montserrat)]">
                      {new Date(w.publishedAt).toLocaleDateString('ja-JP')}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* Conditions */}
      <section className="py-16 bg-[#0a0a0a]">
        <div className="max-w-3xl mx-auto px-6">
          <h2 className="text-2xl font-bold tracking-widest mb-8 text-[#c8a84a]" style={{ fontFamily: 'var(--font-noto-serif)' }}>
            募集要項
          </h2>
          <table className="w-full text-sm">
            <tbody className="divide-y divide-white/8">
              {[
                ['募集職種', 'ホールスタッフ（アルバイト）'],
                ['給与', '時給 1,100円〜　深夜割増あり（22時以降 +25%）'],
                ['勤務時間', '18:00〜翌4:00（シフト制）週2日〜・1日3時間〜 相談可'],
                ['待遇', 'まかない有り・交通費支給・昇給あり'],
                ['応募資格', '未経験歓迎・学生可・Wワーク可・18歳以上（高校生不可）'],
                ['応募方法', 'フォームから応募 または お電話：052-990-6329'],
              ].map(([label, value]) => (
                <tr key={label}>
                  <td className="py-4 pr-6 font-semibold text-[#b01020] tracking-widest whitespace-nowrap w-1/3 align-top">{label}</td>
                  <td className="py-4 font-light leading-relaxed text-white/75">{value}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>

      {/* Recruit Form */}
      <section className="py-16 bg-[#080604]">
        <div className="max-w-lg mx-auto px-6">
          <div className="text-center mb-10">
            <span className="inline-block bg-[#b01020] text-white text-xs tracking-widest px-3 py-1 mb-4">Apply</span>
            <h2 className="text-3xl font-bold tracking-widest" style={{ fontFamily: 'var(--font-noto-serif)' }}>
              応募フォーム
            </h2>
          </div>

          {sent ? (
            <div className="text-center py-12 border border-white/10">
              <div className="text-4xl mb-4">✅</div>
              <h3 className="text-lg font-bold tracking-widest mb-2">応募を受け付けました</h3>
              <p className="text-white/50 text-sm tracking-widest">担当より折り返しご連絡いたします。</p>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-5">
              {[
                { label: 'お名前', key: 'name', type: 'text', placeholder: '山田 太郎' },
                { label: '電話番号', key: 'tel', type: 'tel', placeholder: '090-0000-0000' },
                { label: '年齢', key: 'age', type: 'number', placeholder: '22' },
              ].map(({ label, key, type, placeholder }) => (
                <div key={key}>
                  <label className="block text-xs tracking-widest text-white/50 mb-2">{label} *</label>
                  <input
                    type={type}
                    value={form[key as keyof typeof form]}
                    onChange={e => setForm(f => ({ ...f, [key]: e.target.value }))}
                    placeholder={placeholder}
                    className="w-full bg-white/5 border border-white/15 text-white px-4 py-4 text-base focus:outline-none focus:border-[#b01020] tracking-wider placeholder:text-white/20"
                  />
                </div>
              ))}
              {error && <p className="text-[#b01020] text-sm">{error}</p>}
              <button
                type="submit"
                disabled={loading}
                className="w-full bg-[#b01020] hover:bg-[#d01828] disabled:bg-white/10 text-white py-5 text-base font-bold tracking-widest transition-colors active:scale-[0.98]"
              >
                {loading ? '送信中...' : '応募する'}
              </button>
            </form>
          )}
        </div>
      </section>
    </div>
  );
}

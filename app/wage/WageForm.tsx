'use client';
import { useState } from 'react';
import Link from 'next/link';

export default function WageForm() {
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

  if (status === 'done') {
    return (
      <div className="text-center py-12">
        <div className="text-4xl mb-4">✅</div>
        <h3
          className="text-xl font-bold tracking-widest mb-3 text-white"
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
    );
  }

  return (
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
  );
}

'use client';

import { useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';

type FormData = {
  date: string;
  time: string;
  party: string;
  name: string;
  tel: string;
  course: string;
  message: string;
};

export default function ReservePage() {
  const [formData, setFormData] = useState<FormData>({
    date: '',
    time: '18:00',
    party: '2',
    name: '',
    tel: '',
    course: '席のみ予約',
    message: '',
  });

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isDone, setIsDone] = useState(false);
  // alert() の代わりにインライン表示するエラーメッセージ
  const [errorMsg, setErrorMsg] = useState('');

  // ─── バリデーション ────────────────────────────────────
  const validate = (): string | null => {
    if (!formData.date) return 'ご来店日を選択してください。';
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    if (new Date(formData.date) < today) return '過去の日付は選択できません。';
    if (!formData.name.trim()) return 'お名前を入力してください。';
    if (!/^[0-9\-+\s()]{7,15}$/.test(formData.tel))
      return '正しい電話番号を入力してください（例：09012345678）。';
    return null;
  };

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>
  ) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
    if (errorMsg) setErrorMsg('');
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg('');

    const validationError = validate();
    if (validationError) {
      setErrorMsg(validationError);
      return;
    }

    setIsSubmitting(true);

    try {
      const res = await fetch('/api/reserve', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      });

      if (res.ok) {
        setIsDone(true);
        window.scrollTo({ top: 0, behavior: 'smooth' });
      } else {
        const body = await res.json().catch(() => ({}));
        setErrorMsg(
          body?.message ?? '予約処理に失敗しました。お電話にてお問い合わせください。'
        );
      }
    } catch {
      setErrorMsg('通信エラーが発生しました。しばらく経ってから再度お試しください。');
    } finally {
      setIsSubmitting(false);
    }
  };

  // ─── 送信完了画面 ──────────────────────────────────────
  if (isDone) {
    return (
      <main className="min-h-screen bg-black text-white flex flex-col items-center justify-center px-6 font-serif">
        <div className="text-[#d4af37] text-5xl mb-8" aria-hidden="true">✓</div>
        <h2 className="text-3xl tracking-[0.3em] mb-8">予約を承りました</h2>
        <p className="text-zinc-400 text-center leading-loose mb-12 max-w-sm">
          店主・山本直樹が最高の状態でお迎えいたします。<br />
          ご入力いただいたLINEおよびカレンダーに通知を送信しました。
        </p>
        <Link
          href="/"
          className="border border-[#d4af37] text-[#d4af37] px-12 py-4 tracking-[0.4em] hover:bg-[#d4af37] hover:text-black transition-all text-xs"
        >
          TOPへ戻る
        </Link>
      </main>
    );
  }

  // ─── 予約フォーム ──────────────────────────────────────
  return (
    <main className="min-h-screen bg-black text-white font-serif">
      {/* 背景装飾（拡張子の二重指定を修正：interior.jpg.jpg → interior.jpg） */}
      <div className="fixed inset-0 opacity-20 pointer-events-none" aria-hidden="true">
        <Image src="/interior.jpg" alt="" fill className="object-cover grayscale" />
      </div>

      <div className="relative z-10 max-w-3xl mx-auto py-24 px-6">
        <div className="text-center mb-20">
          <span className="text-[#d4af37] text-[10px] tracking-[0.5em] uppercase font-sans font-bold">
            Reservation
          </span>
          <h1 className="text-4xl tracking-[0.3em] mt-4 font-medium">ご予約</h1>
          <div className="w-12 h-px bg-[#d4af37] mx-auto mt-8" aria-hidden="true" />
        </div>

        <form
          onSubmit={handleSubmit}
          className="space-y-12 bg-black/60 backdrop-blur-md p-8 md:p-12 border border-white/10"
          noValidate
        >
          {/* ─── エラーメッセージ（alert()の代わりにインライン表示） ─── */}
          {errorMsg && (
            <div
              role="alert"
              className="bg-red-900/50 border border-red-500/50 text-red-300 text-sm px-6 py-4 tracking-wide"
            >
              {errorMsg}
            </div>
          )}

          {/* 日時・人数 */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="space-y-3">
              <label htmlFor="date" className="text-[10px] text-zinc-500 tracking-widest block">
                ご来店日 <span className="text-red-400">*</span>
              </label>
              <input
                id="date"
                name="date"
                type="date"
                required
                min={new Date().toISOString().split('T')[0]}
                className="w-full bg-transparent border-b border-white/20 py-2 focus:border-[#d4af37] outline-none transition-colors"
                onChange={handleChange}
              />
            </div>
            <div className="space-y-3">
              <label htmlFor="time" className="text-[10px] text-zinc-500 tracking-widest block">
                時間
              </label>
              <select
                id="time"
                name="time"
                defaultValue="18:00"
                className="w-full bg-black border-b border-white/20 py-2 focus:border-[#d4af37] outline-none"
                onChange={handleChange}
              >
                {['18:00', '19:00', '20:00', '21:00', '22:00', '23:00', '00:00', '01:00', '02:00'].map(
                  (t) => (
                    <option key={t} value={t}>
                      {t}
                    </option>
                  )
                )}
              </select>
            </div>
            <div className="space-y-3">
              <label htmlFor="party" className="text-[10px] text-zinc-500 tracking-widest block">
                人数 <span className="text-red-400">*</span>
              </label>
              <input
                id="party"
                name="party"
                type="number"
                min="1"
                max="20"
                required
                defaultValue={2}
                className="w-full bg-transparent border-b border-white/20 py-2 focus:border-[#d4af37] outline-none"
                onChange={handleChange}
              />
            </div>
          </div>

          {/* コース選択 */}
          <div className="space-y-3">
            <label htmlFor="course" className="text-[10px] text-zinc-500 tracking-widest block">
              お品書き
            </label>
            <select
              id="course"
              name="course"
              defaultValue="席のみ予約"
              className="w-full bg-black border-b border-white/20 py-2 focus:border-[#d4af37] outline-none"
              onChange={handleChange}
            >
              <option>席のみ予約</option>
              <option>セット A（¥5,800）</option>
              <option>セット B（¥7,800）</option>
              <option>セット C（¥9,800）</option>
              <option>コース 梅（¥8,500）</option>
              <option>コース 竹（¥11,000）</option>
              <option>コース 松（¥15,000）</option>
            </select>
          </div>

          {/* お客様情報 */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div className="space-y-3">
              <label htmlFor="name" className="text-[10px] text-zinc-500 tracking-widest block">
                お名前 <span className="text-red-400">*</span>
              </label>
              <input
                id="name"
                name="name"
                type="text"
                required
                placeholder="例：内山 宏紀"
                autoComplete="name"
                className="w-full bg-transparent border-b border-white/20 py-2 focus:border-[#d4af37] outline-none placeholder:text-zinc-700"
                onChange={handleChange}
              />
            </div>
            <div className="space-y-3">
              <label htmlFor="tel" className="text-[10px] text-zinc-500 tracking-widest block">
                電話番号 <span className="text-red-400">*</span>
              </label>
              <input
                id="tel"
                name="tel"
                type="tel"
                required
                placeholder="例：09012345678"
                autoComplete="tel"
                inputMode="tel"
                className="w-full bg-transparent border-b border-white/20 py-2 focus:border-[#d4af37] outline-none placeholder:text-zinc-700"
                onChange={handleChange}
              />
            </div>
          </div>

          {/* 備考欄 */}
          <div className="space-y-3">
            <label htmlFor="message" className="text-[10px] text-zinc-500 tracking-widest block">
              備考（アレルギーや記念日など）
            </label>
            <textarea
              id="message"
              name="message"
              rows={4}
              placeholder="店長へのリクエストがございましたらご記入ください。"
              className="w-full bg-transparent border border-white/10 p-4 focus:border-[#d4af37] outline-none text-sm placeholder:text-zinc-700 resize-none"
              onChange={handleChange}
            />
          </div>

          <div className="pt-12 text-center">
            <button
              type="submit"
              disabled={isSubmitting}
              className="w-full md:w-auto bg-[#b01020] text-white px-20 py-5 tracking-[0.5em] text-[10px] font-bold uppercase hover:bg-white hover:text-black transition-all disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isSubmitting ? '処理中...' : 'この内容で予約する'}
            </button>
            <p className="mt-6 text-[9px] text-zinc-600 tracking-widest uppercase">
              ※送信後、店主よりご確認の連絡を差し上げる場合がございます。
            </p>
          </div>
        </form>
      </div>
    </main>
  );
}

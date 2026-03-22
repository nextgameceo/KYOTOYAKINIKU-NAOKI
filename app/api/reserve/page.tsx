'use client';

import { useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';

export default function ReservePage() {
  const [formData, setFormData] = useState({
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

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      const res = await fetch('/api/reserve', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      });

      if (res.ok) {
        setIsDone(true);
        window.scrollTo(0, 0);
      } else {
        alert('予約処理に失敗しました。お電話にてお問い合わせください。');
      }
    } catch (err) {
      console.error(err);
      alert('通信エラーが発生しました。');
    } finally {
      setIsSubmitting(false);
    }
  };

  if (isDone) {
    return (
      <main className="min-h-screen bg-black text-white flex flex-col items-center justify-center px-6 font-serif">
        <h2 className="text-3xl tracking-[0.3em] mb-8">予約を承りました</h2>
        <p className="text-zinc-400 text-center leading-loose mb-12">
          店主・山本直樹が最高の状態でお迎えいたします。<br />
          ご入力いただいたLINEおよびカレンダーに通知を送信しました。
        </p>
        <Link href="/" className="border border-[#d4af37] text-[#d4af37] px-12 py-4 tracking-[0.4em] hover:bg-[#d4af37] hover:text-black transition-all text-xs">
          TOPへ戻る
        </Link>
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-black text-white font-serif">
      {/* 背景装飾 */}
      <div className="fixed inset-0 opacity-20 pointer-events-none">
        <Image src="/interior.jpg.jpg" alt="" fill className="object-cover grayscale" />
      </div>

      <div className="relative z-10 max-w-3xl mx-auto py-24 px-6">
        <div className="text-center mb-20">
          <span className="text-[#d4af37] text-[10px] tracking-[0.5em] uppercase font-sans font-bold">Reservation</span>
          <h1 className="text-4xl tracking-[0.3em] mt-4 font-medium">ご予約</h1>
          <div className="w-12 h-px bg-[#d4af37] mx-auto mt-8" />
        </div>

        <form onSubmit={handleSubmit} className="space-y-12 bg-black/60 backdrop-blur-md p-8 md:p-12 border border-white/10">
          
          {/* 日時・人数 */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="space-y-3">
              <label className="text-[10px] text-zinc-500 tracking-widest">ご来店日</label>
              <input 
                type="date" required 
                className="w-full bg-transparent border-b border-white/20 py-2 focus:border-[#d4af37] outline-none transition-colors"
                onChange={(e) => setFormData({...formData, date: e.target.value})}
              />
            </div>
            <div className="space-y-3">
              <label className="text-[10px] text-zinc-500 tracking-widest">時間</label>
              <select 
                className="w-full bg-black border-b border-white/20 py-2 focus:border-[#d4af37] outline-none"
                onChange={(e) => setFormData({...formData, time: e.target.value})}
              >
                {['18:00', '19:00', '20:00', '21:00', '22:00', '23:00', '00:00', '01:00', '02:00'].map(t => (
                  <option key={t} value={t}>{t}</option>
                ))}
              </select>
            </div>
            <div className="space-y-3">
              <label className="text-[10px] text-zinc-500 tracking-widest">人数</label>
              <input 
                type="number" min="1" max="20" required
                value={formData.party}
                className="w-full bg-transparent border-b border-white/20 py-2 focus:border-[#d4af37] outline-none"
                onChange={(e) => setFormData({...formData, party: e.target.value})}
              />
            </div>
          </div>

          {/* コース選択 */}
          <div className="space-y-3">
            <label className="text-[10px] text-zinc-500 tracking-widest">お品書き</label>
            <select 
              className="w-full bg-black border-b border-white/20 py-2 focus:border-[#d4af37] outline-none"
              onChange={(e) => setFormData({...formData, course: e.target.value})}
            >
              <option>席のみ予約</option>
              <option>セット A (¥5,800)</option>
              <option>セット B (¥7,800)</option>
              <option>セット C (¥9,800)</option>
              <option>コース 梅 (¥8,500)</option>
              <option>コース 竹 (¥11,000)</option>
              <option>コース 松 (¥15,000)</option>
            </select>
          </div>

          {/* お客様情報 */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div className="space-y-3">
              <label className="text-[10px] text-zinc-500 tracking-widest">お名前</label>
              <input 
                type="text" required placeholder="例：内山 宏紀"
                className="w-full bg-transparent border-b border-white/20 py-2 focus:border-[#d4af37] outline-none placeholder:text-zinc-700"
                onChange={(e) => setFormData({...formData, name: e.target.value})}
              />
            </div>
            <div className="space-y-3">
              <label className="text-[10px] text-zinc-500 tracking-widest">電話番号</label>
              <input 
                type="tel" required placeholder="例：09012345678"
                className="w-full bg-transparent border-b border-white/20 py-2 focus:border-[#d4af37] outline-none placeholder:text-zinc-700"
                onChange={(e) => setFormData({...formData, tel: e.target.value})}
              />
            </div>
          </div>

          {/* 備考欄（ここが追加分です！） */}
          <div className="space-y-3">
            <label className="text-[10px] text-zinc-500 tracking-widest">備考（アレルギーや記念日など）</label>
            <textarea 
              rows={4}
              placeholder="店長へのリクエストがございましたらご記入ください。"
              className="w-full bg-transparent border border-white/10 p-4 focus:border-[#d4af37] outline-none text-sm placeholder:text-zinc-700"
              onChange={(e) => setFormData({...formData, message: e.target.value})}
            />
          </div>

          <div className="pt-12 text-center">
            <button 
              type="submit"
              disabled={isSubmitting}
              className="w-full md:w-auto bg-[#b01020] text-white px-20 py-5 tracking-[0.5em] text-[10px] font-bold uppercase hover:bg-white hover:text-black transition-all disabled:opacity-50"
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

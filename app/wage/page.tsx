'use client';
import { useEffect, useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';

// microCMSから取得するデータの型定義
type Wage = { 
  id: string; 
  title: string; 
  image: { url: string }; 
  description?: string; 
  publishedAt: string 
};

export default function WagePage() {
  // 状態管理
  const [wages, setWages] = useState<Wage[]>([]);
  const [form, setForm] = useState({ name: '', tel: '', age: '' });
  const [loading, setLoading] = useState(false);
  const [sent, setSent] = useState(false);
  const [error, setError] = useState('');

  // microCMSから賄いデータを取得 (APIルート経由)
  useEffect(() => {
    fetch('/api/wage') // 予め /app/api/wage/route.ts を作成しておく必要があります
      .then(r => r.json())
      .then(d => setWages(d.contents ?? []))
      .catch((err) => console.error("Fetch error:", err));
  }, []);

  // フォーム送信処理
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    // バリデーション
    if (!form.name || !form.tel || !form.age) { 
      setError('全項目を入力してください'); 
      return; 
    }
    setLoading(true); 
    setError('');
    
    try {
      // メール送信APIへPOST
      const res = await fetch('/api/send-recruit', { // 予め /app/api/send-recruit/route.ts を作成
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(form),
      });
      if (!res.ok) throw new Error();
      setSent(true); // 送信成功
    } catch {
      setError('送信に失敗しました。お手数ですが、お電話（052-990-6329）でご連絡ください。');
    } finally {
      setLoading(false);
    }
  };

  return (
    // 全体のフォントを Serif（明朝）に統一
    <main className="min-h-screen bg-black text-[#e0d8c3] font-serif selection:bg-[#d4af37] selection:text-black">

      {/* 1. HEROセクション：ロゴと導入 */}
      <section className="relative py-28 text-center bg-[#050505] border-b border-white/5 px-6 overflow-hidden">
        {/* 背景テクスチャ（オプション） */}
        <div className="absolute inset-0 opacity-10 grayscale invert">
          <Image src="/sec6_i1.jpg" alt="" fill className="object-cover" />
        </div>
        
        <div className="relative z-10 max-w-4xl mx-auto space-y-8">
          <div className="mb-6 h-32 w-16 relative mx-auto opacity-30 grayscale invert">
             <Image src="/logo.png" alt="" fill className="object-contain" priority />
          </div>
          <span className="inline-block bg-[#b01020] text-white text-[10px] tracking-[0.5em] px-5 py-2 mb-4 font-sans font-bold uppercase border border-[#b01020]">
            Staff Wanted
          </span>
          <h1 className="text-4xl md:text-5xl font-medium tracking-[0.3em] text-white leading-tight">
            京都二十年の技を、<br/>名古屋・栄で繋ぐ。
          </h1>
          <div className="w-12 h-px bg-[#d4af37]/50 mx-auto" />
          <p className="text-zinc-400 text-sm md:text-base tracking-[0.2em] max-w-xl mx-auto leading-loose font-sans font-light">
            深夜の栄で、本物の京都焼肉を。<br />
            「なおき」の味と空間を共に創り上げる、<br/>新しい仲間を募集します。未経験、大歓迎。
          </p>
        </div>
      </section>

      {/* 2. WAGE GALLERY：microCMSから取得した賄い画像（和風フレーム実装） */}
      {wages.length > 0 && (
        <section className="py-24 bg-[#080808] border-b border-white/5 px-6">
          <div className="max-w-6xl mx-auto">
            <div className="text-center mb-16">
              <span className="text-[#d4af37] text-[10px] tracking-[0.5em] uppercase font-sans font-bold">Today's Benefit</span>
              <h2 className="text-3xl md:text-4xl tracking-[0.3em] mt-3 text-white">本日の賄い</h2>
              <p className="text-xs text-zinc-600 mt-4 tracking-widest font-sans"></p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-10">
              {wages.map(w => (
                <div key={w.id} className="group flex flex-col gap-6">
                  
                  {/* 和風フレーム実装部分 */}
                  <div className="relative p-2.5 bg-[#111] border border-[#d4af37]/30 shadow-2xl overflow-visible">
                    {/* 四隅の飾りL字（CSS） */}
                    <div className="absolute top-0 left-0 w-5 h-5 border-t-2 border-l-2 border-[#d4af37] -translate-x-1 -translate-y-1" />
                    <div className="absolute top-0 right-0 w-5 h-5 border-t-2 border-r-2 border-[#d4af37] translate-x-1 -translate-y-1" />
                    <div className="absolute bottom-0 left-0 w-5 h-5 border-b-2 border-l-2 border-[#d4af37] -translate-x-1 translate-y-1" />
                    <div className="absolute bottom-0 right-0 w-5 h-5 border-b-2 border-r-2 border-[#d4af37] translate-x-1 translate-y-1" />

                    {/* 画像本体（アスペクト比 1:1） */}
                    <div className="relative w-full aspect-square overflow-hidden bg-zinc-900">
                      <Image
                        src={w.image.url}
                        alt={w.title}
                        fill
                        className="object-cover transition-transform duration-1000 group-hover:scale-110"
                        sizes="(max-w-768px) 100vw, 33vw"
                      />
                    </div>
                  </div>

                  {/* テキスト情報 */}
                  <div className="p-2 space-y-2 text-center">
                    <p className="text-lg tracking-widest text-white font-medium group-hover:text-[#d4af37] transition-colors">{w.title}</p>
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

      {/* 3. CONDITIONS：募集要項（テーブル） */}
      <section className="py-24 bg-black border-b border-white/5 px-6">
        <div className="max-w-3xl mx-auto">
          <div className="flex items-center gap-4 mb-12 border-b border-[#d4af37]/30 pb-6">
            <div className="w-1.5 h-6 bg-[#b01020]" />
            <h2 className="text-3xl tracking-[0.3em] text-white">募集要項</h2>
          </div>
          
          <table className="w-full text-sm md:text-base font-sans">
            <tbody className="divide-y divide-white/5">
              {[
                ['募集職種', 'ホールスタッフ（アルバイト）'],
                ['給与', '時給 1,100円〜（経験により優遇） 深夜割増あり（22時以降 +25%）'],
                ['勤務時間', '18:00〜翌4:00（シフト制） 週2日〜・1日3時間〜 相談可'],
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
      <section id="apply" className="py-28 bg-[#050505] px-6">
        <div className="max-w-xl mx-auto border border-white/5 p-10 md:p-12 shadow-2xl bg-black/50">
          <div className="text-center mb-16">
            <span className="text-[#d4af37] text-[10px] tracking-[0.5em] uppercase font-sans font-bold">Apply</span>
            <h2 className="text-3xl tracking-[0.3em] mt-3 text-white">応募フォーム</h2>
            <div className="w-12 h-px bg-yellow-600/30 mx-auto mt-8" />
          </div>

          {sent ? (
            // 送信完了画面
            <div className="text-center py-20 border border-[#d4af37]/30 bg-white/5 space-y-6">
              <div className="text-6xl text-[#d4af37]">✓</div>
              <h3 className="text-xl font-bold tracking-[0.2em] text-white">応募を受け付けました</h3>
              <p className="text-zinc-500 text-sm tracking-widest font-sans max-w-xs mx-auto leading-loose">
                ご入力ありがとうございます。担当より折り返し、お電話にてご連絡いたします。
              </p>
            </div>
          ) : (
            // フォーム本体
            <form onSubmit={handleSubmit} className="space-y-8 font-sans">
              {[
                { label: 'お名前', key: 'name', type: 'text', placeholder: '山田 太郎' },
                { label: '電話番号', key: 'tel', type: 'tel', placeholder: '09000000000（ハイフンなし）' },
                { label: '年齢', key: 'age', type: 'number', placeholder: '22' },
              ].map(({ label, key, type, placeholder }) => (
                <div key={key}>
                  <label className="block text-xs tracking-[0.3em] text-zinc-600 mb-3 uppercase font-bold">
                    {label} <span className="text-[#b01020]">*</span>
                  </label>
                  <input
                    type={type}
                    value={form[key as keyof typeof form]}
                    onChange={e => setForm(f => ({ ...f, [key]: e.target.value }))}
                    placeholder={placeholder}
                    required
                    className="w-full bg-[#111] border border-white/10 text-white px-5 py-5 text-base focus:outline-none focus:border-[#d4af37] focus:ring-1 focus:ring-[#d4af37]/30 tracking-wider placeholder:text-zinc-800 transition-all rounded-none"
                  />
                </div>
              ))}
              
              {/* エラーメッセージ */}
              {error && (
                <p className="text-[#b01020] text-sm text-center font-bold tracking-wider pt-2 border-t border-[#b01020]/30">
                  {error}
                </p>
              )}
              
              {/* 送信ボタン */}
              <button
                type="submit"
                disabled={loading}
                className="w-full bg-[#b01020] hover:bg-[#d01828] disabled:bg-zinc-800 text-white py-6 text-base font-bold tracking-[0.4em] transition-all active:scale-[0.98] font-serif uppercase group"
              >
                {loading ? (
                  <span className="animate-pulse">送信中 . . .</span>
                ) : (
                  <>応募する <span className="group-hover:translate-x-2 transition-transform inline-block ml-2">→</span></>
                )}
              </button>
              <p className="text-center text-[10px] text-zinc-700 tracking-widest mt-6">
                ※入力情報は採用選考のみに使用いたします。
              </p>
            </form>
          )}
        </div>
      </section>

      {/* FOOTERへの導線（オプション） */}
      <footer className="py-16 text-center border-t border-white/5 bg-black">
        <Link href="/" className="text-zinc-700 hover:text-white transition-colors text-xs tracking-[0.5em] font-sans font-bold uppercase">
          ← Back to Top
        </Link>
      </footer>
    </main>
  );
}

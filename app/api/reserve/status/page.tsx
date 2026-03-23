'use client';
import { useState, useEffect } from 'react';

// ... (省略：TIMESなどの定義)

export default function ReservePage() {
  const [isClosed, setIsClosed] = useState(false);
  const [loading, setLoading] = useState(true);

  // ページ読み込み時にRedisから状態を取得
  useEffect(() => {
    async function checkStatus() {
      try {
        const res = await fetch('/api/reserve/status');
        const data = await res.json();
        if (data.status === 'CLOSED') setIsClosed(true);
      } catch (e) {
        console.error("Status check failed");
      } finally {
        setLoading(false);
      }
    }
    checkStatus();
  }, []);

  if (loading) return <div className="min-h-screen bg-[#0a0a0a] flex items-center justify-center text-white/20">Loading...</div>;

  // ★満席時の表示 (内山様が作った高級感のあるイメージに合わせました)
  if (isClosed) {
    return (
      <div className="min-h-screen bg-[#0a0a0a] flex items-center justify-center px-6 text-center font-serif">
        <div className="max-w-md w-full border border-[#c8a84a]/30 p-12 bg-white/5 backdrop-blur-sm">
          <h2 className="text-2xl font-bold text-[#c8a84a] mb-6 tracking-widest">【 本日の受付終了 】</h2>
          <p className="text-white/80 text-sm mb-10 leading-relaxed">
            誠に恐れ入りますが、ただいま満席のため<br />
            本日のWEB予約受付を停止しております。
          </p>
          <div className="border-t border-white/10 pt-8">
            <p className="text-white/40 text-xs mb-4">お急ぎの方、空席確認はお電話にて</p>
            <a href="tel:075-123-4567" className="text-xl font-bold text-white tracking-tighter">
              TEL 075-123-4567
            </a>
          </div>
        </div>
      </div>
    );
  }

  // ... (これ以降は、今動いている正常なフォームの return 部分)
}

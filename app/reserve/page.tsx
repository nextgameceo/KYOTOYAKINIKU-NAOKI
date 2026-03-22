'use client';
import { useState } from 'react';

const TIMES = [
  '18:00','18:30','19:00','19:30','20:00','20:30',
  '21:00','21:30','22:00','22:30','23:00','23:30',
  '24:00','24:30','25:00','25:30','26:00','26:30',
  '27:00','27:30','28:00','28:30','29:00'
];

const PARTIES = [1,2,3,4,5,6,7,8];

const COURSES = [
  { id: 'none', label: 'コースなし（アラカルト）', price: '' },
  { id: 'hitori_shio', label: 'おひとり様セット A（塩焼き）', price: '2,000円' },
  { id: 'hitori_tare', label: 'おひとり様セット B（赤身タレ）', price: '2,000円' },
  { id: 'hitori_omakase', label: 'おひとり様セット C（おまかせ）', price: '2,000円' },
  { id: 'enkai_standard', label: '宴会コース スタンダード', price: '4,000円/人' },
  { id: 'enkai_premium', label: '宴会コース プレミアム', price: '5,500円/人' },
];

function getDaysInMonth(year: number, month: number) {
  return new Date(year, month + 1, 0).getDate();
}
function getFirstDayOfWeek(year: number, month: number) {
  return new Date(year, month, 1).getDay();
}

type Step = 'date' | 'party' | 'time' | 'course' | 'form' | 'done';

export default function ReservePage() {
  const today = new Date();
  const [year, setYear] = useState(today.getFullYear());
  const [month, setMonth] = useState(today.getMonth());
  const [selectedDate, setSelectedDate] = useState<number | null>(null);
  const [party, setParty] = useState<number | null>(null);
  const [time, setTime] = useState<string | null>(null);
  const [course, setCourse] = useState<string>('none');
  const [step, setStep] = useState<Step>('date');
  const [form, setForm] = useState({ name: '', tel: '', note: '' });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const days = getDaysInMonth(year, month);
  const firstDay = getFirstDayOfWeek(year, month);
  const WEEKDAYS = ['日','月','火','水','木','金','土'];

  const prevMonth = () => {
    if (month === 0) { setYear(y => y - 1); setMonth(11); }
    else setMonth(m => m - 1);
    setSelectedDate(null);
  };
  const nextMonth = () => {
    if (month === 11) { setYear(y => y + 1); setMonth(0); }
    else setMonth(m => m + 1);
    setSelectedDate(null);
  };

  const isWednesday = (day: number) => new Date(year, month, day).getDay() === 3;
  const isPast = (day: number) => new Date(year, month, day) < new Date(today.getFullYear(), today.getMonth(), today.getDate());

  const selectedCourse = COURSES.find(c => c.id === course);
  const dateStr = selectedDate
    ? `${year}/${String(month + 1).padStart(2,'0')}/${String(selectedDate).padStart(2,'0')}`
    : '';

  const handleSubmit = async () => {
    if (!form.name || !form.tel) { setError('名前と電話番号を入力してください'); return; }
    setLoading(true);
    setError('');
    try {
      const res = await fetch('/api/reserve', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          date: dateStr,
          party,
          time,
          course: selectedCourse?.label ?? 'なし',
          name: form.name,
          tel: form.tel,
          message: form.note, // ★重要：API側の変数名に合わせて note を message として送る
        }),
      });
      if (!res.ok) throw new Error();
      setStep('done');
    } catch {
      setError('送信に失敗しました。お電話でご予約ください。');
    } finally {
      setLoading(false);
    }
  };

  if (step === 'done') {
    return (
      <div className="min-h-screen bg-[#0a0a0a] flex items-center justify-center px-6">
        <div className="text-center max-w-md w-full">
          <div className="text-5xl mb-6">✅</div>
          <h2 className="text-2xl font-bold tracking-widest mb-4" style={{ fontFamily: 'var(--font-noto-serif)' }}>
            予約を受け付けました
          </h2>
          <p className="text-white/60 text-sm leading-relaxed mb-8">
            ご予約内容をお送りしました。確認後、担当よりご連絡する場合がございます。
          </p>
          <div className="bg-white/5 border border-white/10 p-6 text-left mb-8 text-sm space-y-2">
            <p><span className="text-[#c8a84a]">日時：</span>{dateStr} {time}</p>
            <p><span className="text-[#c8a84a]">人数：</span>{party}名</p>
            <p><span className="text-[#c8a84a]">コース：</span>{selectedCourse?.label}</p>
            <p><span className="text-[#c8a84a]">お名前：</span>{form.name}</p>
            <p><span className="text-[#c8a84a]">電話：</span>{form.tel}</p>
            {form.note && <p><span className="text-[#c8a84a]">備考：</span>{form.note}</p>}
          </div>
          <a href="/" className="inline-block bg-[#b01020] text-white text-sm tracking-widest px-8 py-3 hover:bg-[#d01828] transition-colors">
            トップへ戻る
          </a>
        </div>
      </div>
    );
  }

  // --- 描画部分は変更なし（省略可能ですが一応含めています） ---
  return (
    <div className="min-h-screen bg-[#0a0a0a] px-4 py-12">
      <div className="max-w-2xl mx-auto">
        <div className="text-center mb-10">
          <span className="inline-block bg-[#b01020] text-white text-xs tracking-widest px-3 py-1 mb-4">Reservation</span>
          <h1 className="text-3xl font-black tracking-widest">WEB予約</h1>
          <p className="text-white/40 text-xs tracking-widest mt-2">定休日：水曜日　営業：18:00〜翌4:00（28:00）</p>
        </div>

        <div className="flex items-center justify-center gap-1 mb-3">
          {(['date','party','time','course','form'] as Step[]).map((s, i) => (
            <div key={s} className="flex items-center gap-1">
              <div className={`w-7 h-7 rounded-full flex items-center justify-center text-xs font-bold transition-colors ${
                step === s ? 'bg-[#b01020] text-white' :
                ['date','party','time','course','form','done'].indexOf(step) > i ? 'bg-[#c8a84a] text-[#0a0a0a]' :
                'bg-white/10 text-white/30'
              }`}>{i + 1}</div>
              {i < 4 && <div className="w-5 h-px bg-white/10" />}
            </div>
          ))}
        </div>

        <div className="bg-white/3 border border-white/10 p-6">
          {step === 'date' && (
            <div>
              <div className="flex items-center justify-between mb-6">
                <button onClick={prevMonth} className="w-10 h-10 border border-white/10">‹</button>
                <h3 className="text-lg font-semibold">{year}年 {month + 1}月</h3>
                <button onClick={nextMonth} className="w-10 h-10 border border-white/10">›</button>
              </div>
              <div className="grid grid-cols-7 gap-1">
                {WEEKDAYS.map((w, i) => <div key={w} className="text-center text-xs py-2 text-white/40">{w}</div>)}
                {Array.from({ length: firstDay }).map((_, i) => <div key={`e${i}`} />)}
                {Array.from({ length: days }, (_, i) => i + 1).map(day => {
                  const closed = isWednesday(day);
                  const past = isPast(day);
                  return (
                    <button
                      key={day}
                      disabled={closed || past}
                      onClick={() => { setSelectedDate(day); setStep('party'); }}
                      className={`aspect-square flex flex-col items-center justify-center text-sm rounded ${
                        selectedDate === day ? 'bg-[#b01020] text-white' : closed || past ? 'text-white/15' : 'hover:bg-white/10 text-white'
                      }`}
                    >
                      {day}
                    </button>
                  );
                })}
              </div>
            </div>
          )}

          {step === 'party' && (
            <div>
              <h3 className="text-center text-lg font-semibold mb-8">人数を選択</h3>
              <div className="grid grid-cols-4 gap-3">
                {PARTIES.map(n => (
                  <button key={n} onClick={() => { setParty(n); setStep('time'); }} className={`py-5 border ${party === n ? 'bg-[#b01020] border-[#b01020]' : 'border-white/15'}`}>{n}名</button>
                ))}
              </div>
            </div>
          )}

          {step === 'time' && (
            <div>
              <h3 className="text-center text-lg font-semibold mb-8">時間を選択</h3>
              <div className="grid grid-cols-3 gap-3">
                {TIMES.map(t => (
                  <button key={t} onClick={() => { setTime(t); setStep('course'); }} className={`py-4 border ${time === t ? 'bg-[#b01020] border-[#b01020]' : 'border-white/15'}`}>{t}</button>
                ))}
              </div>
            </div>
          )}

          {step === 'course' && (
            <div>
              <h3 className="text-center text-lg font-semibold mb-8">コースを選択</h3>
              <div className="flex flex-col gap-3">
                {COURSES.map(c => (
                  <button key={c.id} onClick={() => setCourse(c.id)} className={`flex justify-between px-5 py-4 border ${course === c.id ? 'bg-[#b01020] border-[#b01020]' : 'border-white/15'}`}>
                    <span>{c.label}</span><span>{c.price}</span>
                  </button>
                ))}
              </div>
              <button onClick={() => setStep('form')} className="w-full mt-6 bg-[#b01020] py-4 font-bold">次へ進む →</button>
            </div>
          )}

          {step === 'form' && (
            <div>
              <h3 className="text-center text-lg font-semibold mb-8">お客様情報</h3>
              <div className="space-y-4">
                <input type="text" value={form.name} onChange={e => setForm(f => ({ ...f, name: e.target.value }))} placeholder="お名前 *" className="w-full bg-white/5 border border-white/15 px-4 py-4" />
                <input type="tel" value={form.tel} onChange={e => setForm(f => ({ ...f, tel: e.target.value }))} placeholder="電話番号 *" className="w-full bg-white/5 border border-white/15 px-4 py-4" />
                <textarea value={form.note} onChange={e => setForm(f => ({ ...f, note: e.target.value }))} placeholder="備考（アレルギーなど）" rows={3} className="w-full bg-white/5 border border-white/15 px-4 py-3" />
                <button onClick={handleSubmit} disabled={loading} className="w-full bg-[#b01020] py-5 font-bold">{loading ? '送信中...' : '予約を確定する'}</button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

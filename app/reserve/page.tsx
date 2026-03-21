'use client';
import { useState } from 'react';

const TIMES = ['18:00','18:30','19:00','19:30','20:00','20:30','21:00','21:30','22:00','22:30','23:00','23:30'];
const PARTIES = [1,2,3,4,5,6,7,8];

function getDaysInMonth(year: number, month: number) {
  return new Date(year, month + 1, 0).getDate();
}

function getFirstDayOfWeek(year: number, month: number) {
  return new Date(year, month, 1).getDay();
}

type Step = 'date' | 'party' | 'time' | 'form' | 'done';

export default function ReservePage() {
  const today = new Date();
  const [year, setYear] = useState(today.getFullYear());
  const [month, setMonth] = useState(today.getMonth());
  const [selectedDate, setSelectedDate] = useState<number | null>(null);
  const [party, setParty] = useState<number | null>(null);
  const [time, setTime] = useState<string | null>(null);
  const [step, setStep] = useState<Step>('date');
  const [form, setForm] = useState({ name: '', tel: '' });
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

  const handleSubmit = async () => {
    if (!form.name || !form.tel) { setError('名前と電話番号を入力してください'); return; }
    setLoading(true);
    setError('');
    try {
      const res = await fetch('/api/reserve', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          date: `${year}/${String(month + 1).padStart(2,'0')}/${String(selectedDate).padStart(2,'0')}`,
          party,
          time,
          name: form.name,
          tel: form.tel,
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
        <div className="text-center max-w-md">
          <div className="text-5xl mb-6">✅</div>
          <h2 className="text-2xl font-bold tracking-widest mb-4" style={{ fontFamily: 'var(--font-noto-serif)' }}>
            予約を受け付けました
          </h2>
          <p className="text-white/60 text-sm leading-relaxed mb-8">
            ご予約内容をLINEにてお知らせしました。<br />
            確認後、担当よりご連絡する場合がございます。
          </p>
          <div className="bg-white/5 border border-white/10 p-6 text-left mb-8 text-sm space-y-2">
            <p><span className="text-[#c8a84a]">日時：</span>{year}/{String(month+1).padStart(2,'0')}/{String(selectedDate).padStart(2,'0')} {time}</p>
            <p><span className="text-[#c8a84a]">人数：</span>{party}名</p>
            <p><span className="text-[#c8a84a]">お名前：</span>{form.name}</p>
            <p><span className="text-[#c8a84a]">電話：</span>{form.tel}</p>
          </div>
          <a href="/" className="inline-block bg-[#b01020] text-white text-sm tracking-widest px-8 py-3 hover:bg-[#d01828] transition-colors">
            トップへ戻る
          </a>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#0a0a0a] px-4 py-12">
      <div className="max-w-2xl mx-auto">
        <div className="text-center mb-10">
          <span className="inline-block bg-[#b01020] text-white text-xs tracking-widest px-3 py-1 mb-4">Reservation</span>
          <h1 className="text-3xl font-black tracking-widest" style={{ fontFamily: 'var(--font-noto-serif)' }}>
            WEB予約
          </h1>
          <p className="text-white/40 text-xs tracking-widest mt-2">定休日：水曜日　営業：18:00〜翌4:00</p>
        </div>

        {/* Step indicator */}
        <div className="flex items-center justify-center gap-2 mb-10 text-xs tracking-widest">
          {(['date','party','time','form'] as Step[]).map((s, i) => (
            <div key={s} className="flex items-center gap-2">
              <div className={`w-7 h-7 rounded-full flex items-center justify-center text-xs font-bold transition-colors ${
                step === s ? 'bg-[#b01020] text-white' :
                ['date','party','time','form','done'].indexOf(step) > i ? 'bg-[#c8a84a] text-[#0a0a0a]' :
                'bg-white/10 text-white/30'
              }`}>{i + 1}</div>
              {i < 3 && <div className="w-8 h-px bg-white/10" />}
            </div>
          ))}
        </div>
        <div className="flex justify-center gap-8 mb-10 text-[10px] tracking-widest text-white/40">
          <span className={step === 'date' ? 'text-white' : ''}>日付</span>
          <span className={step === 'party' ? 'text-white' : ''}>人数</span>
          <span className={step === 'time' ? 'text-white' : ''}>時間</span>
          <span className={step === 'form' ? 'text-white' : ''}>お客様情報</span>
        </div>

        {/* Selected summary */}
        {(selectedDate || party || time) && (
          <div className="flex gap-4 justify-center mb-8 text-xs tracking-widest">
            {selectedDate && <span className="bg-white/5 border border-white/10 px-3 py-1 text-[#c8a84a]">{month+1}/{selectedDate}</span>}
            {party && <span className="bg-white/5 border border-white/10 px-3 py-1 text-[#c8a84a]">{party}名</span>}
            {time && <span className="bg-white/5 border border-white/10 px-3 py-1 text-[#c8a84a]">{time}</span>}
          </div>
        )}

        <div className="bg-white/3 border border-white/10 p-6">

          {/* STEP 1: Date */}
          {step === 'date' && (
            <div>
              <div className="flex items-center justify-between mb-6">
                <button onClick={prevMonth} className="w-10 h-10 flex items-center justify-center text-white/60 hover:text-white border border-white/10 hover:border-white/30 transition-colors">‹</button>
                <h3 className="text-lg font-semibold tracking-widest">{year}年 {month + 1}月</h3>
                <button onClick={nextMonth} className="w-10 h-10 flex items-center justify-center text-white/60 hover:text-white border border-white/10 hover:border-white/30 transition-colors">›</button>
              </div>
              <div className="grid grid-cols-7 gap-1 mb-2">
                {WEEKDAYS.map((w, i) => (
                  <div key={w} className={`text-center text-xs py-2 tracking-widest ${i === 0 ? 'text-red-400' : i === 6 ? 'text-blue-400' : 'text-white/40'}`}>{w}</div>
                ))}
              </div>
              <div className="grid grid-cols-7 gap-1">
                {Array.from({ length: firstDay }).map((_, i) => <div key={`e${i}`} />)}
                {Array.from({ length: days }, (_, i) => i + 1).map(day => {
                  const closed = isWednesday(day);
                  const past = isPast(day);
                  const selected = selectedDate === day;
                  const dow = new Date(year, month, day).getDay();
                  return (
                    <button
                      key={day}
                      disabled={closed || past}
                      onClick={() => { setSelectedDate(day); setStep('party'); }}
                      className={`aspect-square flex flex-col items-center justify-center text-sm rounded transition-all ${
                        selected ? 'bg-[#b01020] text-white' :
                        closed || past ? 'text-white/15 cursor-not-allowed' :
                        'hover:bg-white/10 text-white' + (dow === 0 ? ' text-red-300' : dow === 6 ? ' text-blue-300' : '')
                      }`}
                    >
                      <span>{day}</span>
                      {closed && <span className="text-[8px] text-white/30">定休</span>}
                    </button>
                  );
                })}
              </div>
            </div>
          )}

          {/* STEP 2: Party */}
          {step === 'party' && (
            <div>
              <h3 className="text-center text-lg font-semibold tracking-widest mb-8">人数を選択</h3>
              <div className="grid grid-cols-4 gap-3">
                {PARTIES.map(n => (
                  <button
                    key={n}
                    onClick={() => { setParty(n); setStep('time'); }}
                    className={`py-5 text-xl font-bold tracking-widest border transition-all active:scale-95 ${
                      party === n ? 'bg-[#b01020] border-[#b01020] text-white' : 'border-white/15 text-white hover:border-[#b01020] hover:text-[#b01020]'
                    }`}
                  >
                    {n}<span className="text-xs ml-1">名</span>
                  </button>
                ))}
              </div>
              <button onClick={() => setStep('date')} className="mt-6 text-xs text-white/40 hover:text-white/60 tracking-widest transition-colors w-full text-center">
                ← 日付を変更
              </button>
            </div>
          )}

          {/* STEP 3: Time */}
          {step === 'time' && (
            <div>
              <h3 className="text-center text-lg font-semibold tracking-widest mb-8">時間を選択</h3>
              <div className="grid grid-cols-3 gap-3">
                {TIMES.map(t => (
                  <button
                    key={t}
                    onClick={() => { setTime(t); setStep('form'); }}
                    className={`py-4 text-lg font-semibold tracking-widest border transition-all active:scale-95 ${
                      time === t ? 'bg-[#b01020] border-[#b01020] text-white' : 'border-white/15 text-white hover:border-[#b01020] hover:text-[#b01020]'
                    }`}
                  >
                    {t}
                  </button>
                ))}
              </div>
              <button onClick={() => setStep('party')} className="mt-6 text-xs text-white/40 hover:text-white/60 tracking-widest transition-colors w-full text-center">
                ← 人数を変更
              </button>
            </div>
          )}

          {/* STEP 4: Form */}
          {step === 'form' && (
            <div>
              <h3 className="text-center text-lg font-semibold tracking-widest mb-8">お客様情報</h3>
              <div className="space-y-4">
                <div>
                  <label className="block text-xs tracking-widest text-white/50 mb-2">お名前 *</label>
                  <input
                    type="text"
                    value={form.name}
                    onChange={e => setForm(f => ({ ...f, name: e.target.value }))}
                    placeholder="山田 太郎"
                    className="w-full bg-white/5 border border-white/15 text-white px-4 py-4 text-base focus:outline-none focus:border-[#b01020] tracking-wider placeholder:text-white/20"
                  />
                </div>
                <div>
                  <label className="block text-xs tracking-widest text-white/50 mb-2">電話番号 *</label>
                  <input
                    type="tel"
                    value={form.tel}
                    onChange={e => setForm(f => ({ ...f, tel: e.target.value }))}
                    placeholder="090-0000-0000"
                    className="w-full bg-white/5 border border-white/15 text-white px-4 py-4 text-base focus:outline-none focus:border-[#b01020] tracking-wider placeholder:text-white/20"
                  />
                </div>
                {error && <p className="text-[#b01020] text-sm tracking-wide">{error}</p>}
                <button
                  onClick={handleSubmit}
                  disabled={loading}
                  className="w-full bg-[#b01020] hover:bg-[#d01828] disabled:bg-white/10 text-white py-5 text-base font-bold tracking-widest transition-colors active:scale-[0.98] mt-4"
                >
                  {loading ? '送信中...' : '予約を確定する'}
                </button>
                <button onClick={() => setStep('time')} className="w-full text-xs text-white/40 hover:text-white/60 tracking-widest transition-colors py-2">
                  ← 時間を変更
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

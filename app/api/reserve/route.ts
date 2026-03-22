import { google } from 'googleapis';
import { NextRequest, NextResponse } from 'next/server';

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    
    // 画面からの入力を取得
    const { date, party, time, name, tel, course } = body;
    // 備考欄(message/note)を確実に取得
    const memo = body.message || body.note || "なし";

    const calendarId = "2fe0af61ebe1e42cb0fbc5761f7fd2c9dca60d8286f0a6b7a2705a0197561ca5@group.calendar.google.com";
    const clientEmail = process.env.GOOGLE_SERVICE_ACCOUNT_EMAIL;
    const privateKey = process.env.GOOGLE_PRIVATE_KEY;
    const lineToken = process.env.LINE_CHANNEL_ACCESS_TOKEN || process.env.LINE_TOKEN;

    if (!clientEmail || !privateKey) throw new Error("環境変数が不足しています。");

    // --- 【重要】カレンダー用の日付・時刻計算 ---
    const stayMinutes = 30; // 滞在30分
    const [hoursStr, minutesStr] = time.split(':');
    let hours = parseInt(hoursStr, 10);
    const minutes = parseInt(minutesStr, 10);
    
    // 1. まずは「予約された日付」の00:00(日本時間)を作成
    const calDate = new Date(`${date.replace(/\//g, '-')}T00:00:00+09:00`);
    
    // 2. 24時以降（24:00〜29:00）の場合、カレンダーの日付を「翌日」に繰り越す
    if (hours >= 24) {
      calDate.setDate(calDate.getDate() + 1);
      hours = hours - 24; // 例：27時 → 3時 に変換
    }

    // 3. 調整した日付に時間をセット
    calDate.setHours(hours);
    calDate.setMinutes(minutes);

    // 終了時間をセット（30分後）
    const endDate = new Date(calDate.getTime() + stayMinutes * 60 * 1000);

    // 日本時間ISO形式の文字列を作成（Googleカレンダー用）
    const toJstIso = (d: Date) => {
      const pad = (n: number) => String(n).padStart(2, '0');
      return `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())}T${pad(d.getHours())}:${pad(d.getMinutes())}:00+09:00`;
    };

    // --- Google API 実行 ---
    const auth = new google.auth.JWT(
      clientEmail,
      undefined,
      privateKey.replace(/\\n/g, '\n'),
      ['https://www.googleapis.com/auth/calendar']
    );

    const calendar = google.calendar({ version: 'v3', auth });

    await calendar.events.insert({
      calendarId: calendarId,
      requestBody: {
        summary: `【予約】${name}様 (${party}名)`,
        description: [
          `【お名前】: ${name}様`,
          `【人数】: ${party}名`,
          `【時間】: ${time}（システム表記）`,
          `【コース】: ${course || '未選択'}`,
          `【電話】: ${tel}`,
          `【備考】: ${memo}`
        ].join('\n'),
        start: { dateTime: toJstIso(calDate), timeZone: 'Asia/Tokyo' },
        end: { dateTime: toJstIso(endDate), timeZone: 'Asia/Tokyo' },
      },
    });

    // --- LINE通知（ここは現場が混乱しないよう「27:30」などの表記を維持） ---
    if (lineToken) {
      await fetch('https://api.line.me/v2/bot/message/broadcast', {
        method: 'POST',
        headers: { Authorization: `Bearer ${lineToken}`, 'Content-Type': 'application/json' },
        body: JSON.stringify({
          messages: [{ 
            type: 'text', 
            text: `【新規予約】\nお名前：${name}様\n日時：${date} ${time}~\n人数：${party}名\n備考：${memo}\n\nカレンダー（翌朝枠）に登録しました。` 
          }]
        }),
      });
    }

    return NextResponse.json({ ok: true });

  } catch (err: any) {
    console.error('予約処理エラー:', err.message);
    return NextResponse.json({ error: '失敗', detail: err.message }, { status: 500 });
  }
}

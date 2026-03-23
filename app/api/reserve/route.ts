import { google } from 'googleapis';
import { NextRequest, NextResponse } from 'next/server';

export async function POST(req: NextRequest) {
  console.log("--- 予約処理開始 ---");
  try {
    const body = await req.json();
    const { date, party, time, name, tel, course } = body;
    const memo = body.message || body.note || "なし";

    const lineToken = process.env.LINE_CHANNEL_ACCESS_TOKEN;
    const lineUserId = process.env.LINE_USER_ID;
    const calendarId = "2fe0af61ebe1e42cb0fbc5761f7fd2c9dca60d8286f0a6b7a2705a0197561ca5@group.calendar.google.com";

    // --- 日付・時刻計算 (深夜枠対応) ---
    const [y, m, d] = date.split('/').map(Number);
    const [hStr, minStr] = time.split(':');
    let hours = parseInt(hStr, 10);
    const minutes = parseInt(minStr, 10);

    let targetDate = new Date(y, m - 1, d, 0, 0, 0);
    targetDate.setHours(hours);
    targetDate.setMinutes(minutes);
    const endDate = new Date(targetDate.getTime() + 30 * 60 * 1000);

    // Googleカレンダー用のISOフォーマット関数
    const toIsoString = (dt: Date) => {
      const pad = (n: number) => String(n).padStart(2, '0');
      const year = dt.getFullYear();
      const month = pad(dt.getMonth() + 1);
      const day = pad(dt.getDate());
      const hour = pad(dt.getHours());
      const min = pad(dt.getMinutes());
      return `${year}-${month}-${day}T${hour}:${min}:00+09:00`;
    };

    const startStr = toIsoString(targetDate);
    const endStr = toIsoString(endDate);

    // --- 1. LINE通知 (成功実績ありのコード) ---
    if (lineToken && lineUserId) {
      await fetch('https://api.line.me/v2/bot/message/push', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${lineToken.trim()}`,
        },
        body: JSON.stringify({
          to: lineUserId.trim(),
          messages: [{
            type: 'text',
            text: `【新規予約通知】\nお名前：${name}様\n日時：${date} ${time}~\n人数：${party}名\nコース：${course}\n備考：${memo}`
          }]
        }),
      });
      console.log("LINE送信完了");
    }

    // --- 2. Googleカレンダー登録 ---
    console.log("カレンダー登録準備: " + startStr);
    const auth = new google.auth.JWT(
      process.env.GOOGLE_SERVICE_ACCOUNT_EMAIL,
      undefined,
      process.env.GOOGLE_PRIVATE_KEY?.replace(/\\n/g, '\n'),
      ['https://www.googleapis.com/auth/calendar']
    );
    
    const calendar = google.calendar({ version: 'v3', auth });
    await calendar.events.insert({
      calendarId,
      requestBody: {
        summary: `【予約】${name}様 (${party}名)`,
        description: `【時間】: ${time}\n【電話】: ${tel}\n【備考】: ${memo}`,
        start: { dateTime: startStr, timeZone: 'Asia/Tokyo' },
        end: { dateTime: endStr, timeZone: 'Asia/Tokyo' },
      },
    });
    console.log("カレンダー登録成功");

    return NextResponse.json({ ok: true });

  } catch (err: any) {
    console.error("エラー詳細:", err.message);
    return NextResponse.json({ error: '失敗', detail: err.message }, { status: 500 });
  }
}

// app/api/reserve/route.ts (完成版)
import { google } from 'googleapis';
import { NextRequest, NextResponse } from 'next/server';

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { date, party, time, name, tel, course } = body;
    const memo = body.message || body.note || "なし";

    // 環境変数の取得
    const calendarId = "2fe0af61ebe1e42cb0fbc5761f7fd2c9dca60d8286f0a6b7a2705a0197561ca5@group.calendar.google.com";
    const clientEmail = process.env.GOOGLE_SERVICE_ACCOUNT_EMAIL;
    const privateKey = process.env.GOOGLE_PRIVATE_KEY;
    const lineToken = process.env.LINE_CHANNEL_ACCESS_TOKEN;
    const lineUserId = process.env.LINE_USER_ID;

    // --- 日付と時刻の計算 ---
    const [y, m, d] = date.split('/').map(Number);
    const [hStr, minStr] = time.split(':');
    let h = parseInt(hStr, 10);
    const min = parseInt(minStr, 10);

    // 一旦、予約された日付の「深夜0時」のDateオブジェクトを作成
    let targetDate = new Date(y, m - 1, d, 0, 0, 0);

    // 24時間以上（深夜25時など）の場合は、その分を時間に加算
    // 例：28:30なら、0時 + 28時間30分 = 翌日4:30
    targetDate.setHours(h);
    targetDate.setMinutes(min);

    const endDate = new Date(targetDate.getTime() + 30 * 60 * 1000); // 30分枠

    // Googleカレンダー用のISOフォーマット
    const toJstIso = (dt: Date) => {
      const pad = (n: number) => String(n).padStart(2, '0');
      return `${dt.getFullYear()}-${pad(dt.getMonth() + 1)}-${pad(dt.getDate())}T${pad(dt.getHours())}:${pad(dt.getMinutes())}:00+09:00`;
    };

    // 1. Googleカレンダーへの登録
    const auth = new google.auth.JWT(
      clientEmail,
      undefined,
      privateKey?.replace(/\\n/g, '\n'),
      ['https://www.googleapis.com/auth/calendar']
    );
    const calendar = google.calendar({ version: 'v3', auth });
    await calendar.events.insert({
      calendarId,
      requestBody: {
        summary: `【予約】${name}様 (${party}名)`,
        description: `【時間】: ${time} (システム表記)\n【コース】: ${course}\n【電話】: ${tel}\n【備考】: ${memo}`,
        start: { dateTime: toJstIso(targetDate), timeZone: 'Asia/Tokyo' },
        end: { dateTime: toJstIso(endDate), timeZone: 'Asia/Tokyo' },
      },
    });

    // 2. LINE通知の実行
    if (lineToken && lineUserId) {
      const res = await fetch('https://api.line.me/v2/bot/message/push', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${lineToken}`,
        },
        body: JSON.stringify({
          to: lineUserId,
          messages: [{
            type: 'text',
            text: `【新規予約通知】\nお名前：${name}様\n日時：${date} ${time}~\n人数：${party}名\nコース：${course}\n備考：${memo}`
          }]
        }),
      });
      if (!res.ok) console.error("LINE通知に失敗しました");
    }

    return NextResponse.json({ ok: true });
  } catch (err: any) {
    console.error("予約処理エラー:", err);
    return NextResponse.json({ error: 'エラーが発生しました', detail: err.message }, { status: 500 });
  }
}

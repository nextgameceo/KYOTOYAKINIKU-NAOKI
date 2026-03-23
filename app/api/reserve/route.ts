// app/api/reserve/route.ts

import { google } from 'googleapis';
import { NextRequest, NextResponse } from 'next/server';

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { date, party, time, name, tel, course } = body;
    const memo = body.message || body.note || "なし";

    const calendarId = "2fe0af61ebe1e42cb0fbc5761f7fd2c9dca60d8286f0a6b7a2705a0197561ca5@group.calendar.google.com";
    const clientEmail = process.env.GOOGLE_SERVICE_ACCOUNT_EMAIL;
    const privateKey = process.env.GOOGLE_PRIVATE_KEY;
    const lineToken = process.env.LINE_CHANNEL_ACCESS_TOKEN;
    const lineUserId = process.env.LINE_USER_ID;

    // --- 日付・時刻計算 (カレンダー成功済み) ---
    const [y, m, d] = date.split('/').map(Number);
    const [hStr, minStr] = time.split(':');
    let h = parseInt(hStr, 10);
    const min = parseInt(minStr, 10);
    let targetDate = new Date(y, m - 1, d, 0, 0, 0);
    targetDate.setHours(h);
    targetDate.setMinutes(min);
    const endDate = new Date(targetDate.getTime() + 30 * 60 * 1000);

    const toJstIso = (dt: Date) => {
      const pad = (n: number) => String(n).padStart(2, '0');
      return `${dt.getFullYear()}-${pad(dt.getMonth() + 1)}-${pad(dt.getDate())}T${pad(dt.getHours())}:${pad(dt.getMinutes())}:00+09:00`;
    };

    // 1. Googleカレンダー登録
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

    // 2. LINE通知 (送信ロジックをより堅牢に修正)
    if (lineToken && lineUserId) {
      const lineRes = await fetch('https://api.line.me/v2/bot/message/push', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${lineToken.trim()}`, // 空白除去を追加
        },
        body: JSON.stringify({
          to: lineUserId.trim(), // 空白除去を追加
          messages: [{
            type: 'text',
            text: `【新規予約通知】\nお名前：${name}様\n日時：${date} ${time}~\n人数：${party}名\nコース：${course}\n備考：${memo}`
          }]
        }),
      });

      if (!lineRes.ok) {
        const errorData = await lineRes.json();
        console.error("LINE送信失敗詳細:", errorData);
      }
    }

    return NextResponse.json({ ok: true });
  } catch (err: any) {
    console.error("エラー:", err);
    return NextResponse.json({ error: '失敗', detail: err.message }, { status: 500 });
  }
}

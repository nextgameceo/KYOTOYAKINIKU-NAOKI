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

    // 1. 基本となる日付を作成 (YYYY-MM-DD形式に整える)
    const formattedDate = date.replace(/\//g, '-');
    let targetDate = new Date(`${formattedDate}T00:00:00+09:00`);

    // 2. 時間を時と分に分ける
    const [hoursStr, minutesStr] = time.split(':');
    let hours = parseInt(hoursStr, 10);
    const minutes = parseInt(minutesStr, 10);

    // --- 【修正ポイント】24時以上の場合は翌日の暦にする ---
    if (hours >= 24) {
      targetDate.setDate(targetDate.getDate() + 1); // 日付を1日進める
      hours = hours - 24; // 例: 28時 -> 4時
    }
    
    // 3. 調整した日付に時間をセット
    targetDate.setHours(hours);
    targetDate.setMinutes(minutes);

    const endDate = new Date(targetDate.getTime() + 30 * 60 * 1000); // 30分枠

    // ISOフォーマット作成関数
    const toJstIso = (d: Date) => {
      const pad = (n: number) => String(n).padStart(2, '0');
      return `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())}T${pad(d.getHours())}:${pad(d.getMinutes())}:00+09:00`;
    };

    // Google認証・登録処理
    const auth = new google.auth.JWT(
      clientEmail,
      undefined,
      privateKey?.replace(/\\n/g, '\n'),
      ['https://www.googleapis.com/auth/calendar']
    );
    const calendar = google.calendar({ version: 'v3', auth });

    await calendar.events.insert({
      calendarId: calendarId,
      requestBody: {
        summary: `【予約】${name}様 (${party}名)`,
        description: `【時間】: ${time} (システム表記)\n【コース】: ${course}\n【電話】: ${tel}\n【備考】: ${memo}`,
        start: { dateTime: toJstIso(targetDate), timeZone: 'Asia/Tokyo' },
        end: { dateTime: toJstIso(endDate), timeZone: 'Asia/Tokyo' },
      },
    });

    return NextResponse.json({ ok: true });
  } catch (err: any) {
    return NextResponse.json({ error: '失敗', detail: err.message }, { status: 500 });
  }
}

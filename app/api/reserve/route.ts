import { google } from 'googleapis';
import { NextRequest, NextResponse } from 'next/server';

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { date, party, time, name, tel, course } = body;
    const memo = body.message || body.note || "なし";

    // 環境変数
    const calendarId = "2fe0af61ebe1e42cb0fbc5761f7fd2c9dca60d8286f0a6b7a2705a0197561ca5@group.calendar.google.com";
    const clientEmail = process.env.GOOGLE_SERVICE_ACCOUNT_EMAIL;
    const privateKey = process.env.GOOGLE_PRIVATE_KEY;
    const lineToken = process.env.LINE_CHANNEL_ACCESS_TOKEN;
    const lineUserId = process.env.LINE_USER_ID;

    // --- 【超重要】日付・時刻の正規化ロジック ---
    const [year, month, day] = date.split('/').map(Number);
    const [hoursStr, minutesStr] = time.split(':');
    let hours = parseInt(hoursStr, 10);
    const minutes = parseInt(minutesStr, 10);

    // 一旦、予約された日付でDateオブジェクトを作成（JST）
    let targetDate = new Date(year, month - 1, day, hours, minutes);

    // 24時以降の場合、Dateオブジェクトが自動で翌日に繰り越されないケースがあるため強制加算
    if (hours >= 24) {
      // 例: 23日の28時なら、一旦「23日の0時」にしてから、28時間分を加算する
      targetDate = new Date(year, month - 1, day, 0, 0);
      targetDate.setHours(hours);
      targetDate.setMinutes(minutes);
    }

    const endDate = new Date(targetDate.getTime() + 30 * 60 * 1000);

    // ISOフォーマット (JST固定)
    const toJstIso = (d: Date) => {
      const offset = 9 * 60; // JSTは+9時間
      const jstDate = new Date(d.getTime() + (d.getTimezoneOffset() + offset) * 60000);
      const pad = (n: number) => String(n).padStart(2, '0');
      return `${jstDate.getFullYear()}-${pad(jstDate.getMonth() + 1)}-${pad(jstDate.getDate())}T${pad(jstDate.getHours())}:${pad(jstDate.getMinutes())}:00+09:00`;
    };

    const startIso = toJstIso(targetDate);
    const endIso = toJstIso(endDate);

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
        start: { dateTime: startIso, timeZone: 'Asia/Tokyo' },
        end: { dateTime: endIso, timeZone: 'Asia/Tokyo' },
      },
    });

    // 2. LINE通知 (これが消えていた可能性が高いです)
    if (lineToken && lineUserId) {
      const isOvernight = hours >= 24 ? "（翌朝枠）" : "";
      await fetch('https://api.line.me/v2/bot/message/push', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${lineToken}`,
        },
        body: JSON.stringify({
          to: lineUserId,
          messages: [{
            type: 'text',
            text: `【新規予約】\nお名前：${name}様\n日時：${date} ${time}~\n人数：${party}名\nコース：${course}\n備考：${memo}\n\nカレンダー${isOvernight}に登録しました。`
          }]
        }),
      });
    }

    return NextResponse.json({ ok: true });
  } catch (err: any) {
    console.error(err);
    return NextResponse.json({ error: '失敗', detail: err.message }, { status: 500 });
  }
}

import { google } from 'googleapis';
import { NextRequest, NextResponse } from 'next/server';

export async function POST(req: NextRequest) {
  try {
    const { date, party, time, name, tel, course, message } = await req.json();

    // ★ テスト用：カレンダーIDをメインアドレスに直接指定
    const calendarId = "nextgamecoo@gmail.com";
    
    const clientEmail = process.env.GOOGLE_SERVICE_ACCOUNT_EMAIL || process.env.SERVICE_ACCOUNT_EMAIL;
    const privateKey = process.env.GOOGLE_PRIVATE_KEY || process.env.PRIVATE_KEY;
    const lineToken = process.env.LINE_CHANNEL_ACCESS_TOKEN || process.env.LINE_TOKEN;

    console.log("--- 最終診断テスト実行 ---");
    console.log("Target Calendar:", calendarId);
    console.log("Auth Email:", clientEmail ? "OK" : "MISSING");

    if (!clientEmail || !privateKey) {
      throw new Error("環境変数が不足しています");
    }

    const formattedDate = date.replace(/\//g, '-');
    const startDateTime = new Date(`${formattedDate}T${time}:00`);
    const endDateTime = new Date(startDateTime.getTime() + 2 * 60 * 60 * 1000);

    const auth = new google.auth.JWT(
      clientEmail,
      undefined,
      privateKey.replace(/\\n/g, '\n'),
      ['https://www.googleapis.com/auth/calendar']
    );

    const calendar = google.calendar({ version: 'v3', auth });

    // 予約を挿入
    await calendar.events.insert({
      calendarId: calendarId,
      requestBody: {
        summary: `【テスト予約】${name}様 (${party}名)`,
        description: `コース: ${course || '未定'}\n電話: ${tel}\n備考: ${message || 'なし'}`,
        start: { dateTime: startDateTime.toISOString(), timeZone: 'Asia/Tokyo' },
        end: { dateTime: endDateTime.toISOString(), timeZone: 'Asia/Tokyo' },
      },
    });

    // LINE通知（オプション）
    if (lineToken) {
      try {
        await fetch('https://api.line.me/v2/bot/message/broadcast', {
          method: 'POST',
          headers: {
            Authorization: `Bearer ${lineToken}`,
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            messages: [{ type: 'text', text: `【テスト成功】\n日時：${formattedDate} ${time}\nカレンダーへの書き込みに成功しました！` }]
          }),
        });
      } catch (e) {
        console.error("LINE通知失敗:", e);
      }
    }

    return NextResponse.json({ ok: true });

  } catch (err: any) {
    console.error('Final Error Log:', err.message);
    return NextResponse.json(
      { error: '予約処理に失敗しました', detail: err.message },
      { status: 500 }
    );
  }
}

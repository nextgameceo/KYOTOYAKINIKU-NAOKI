import { google } from 'googleapis';
import { NextRequest, NextResponse } from 'next/server';

export async function POST(req: NextRequest) {
  try {
    const { date, party, time, name, tel, course, message } = await req.json();

    // 環境変数の取得（名前の揺れをカバー）
    const calendarId = process.env.GOOGLE_CALENDAR_ID || process.env.CALENDAR_ID;
    const clientEmail = process.env.GOOGLE_SERVICE_ACCOUNT_EMAIL || process.env.SERVICE_ACCOUNT_EMAIL;
    const privateKey = process.env.GOOGLE_PRIVATE_KEY || process.env.PRIVATE_KEY;
    const lineToken = process.env.LINE_CHANNEL_ACCESS_TOKEN || process.env.LINE_TOKEN;

    // 診断ログ：Vercelのログ画面で「何が足りないか」一目でわかるようにします
    console.log("--- 接続診断 ---");
    console.log("Calendar ID:", calendarId ? "OK" : "未設定(MISSING)");
    console.log("Client Email:", clientEmail ? "OK" : "未設定(MISSING)");
    console.log("Private Key:", privateKey ? "OK" : "未設定(MISSING)");

    if (!calendarId || !clientEmail || !privateKey) {
      throw new Error("Vercelの環境変数が正しく設定されていません。Settingsを確認してください。");
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

    await calendar.events.insert({
      calendarId: calendarId.trim(), // 前後の余計な空白を強制削除
      requestBody: {
        summary: `【予約】${name}様 (${party}名)`,
        description: `コース: ${course || '未定'}\n電話: ${tel}\n備考: ${message || 'なし'}`,
        start: { dateTime: startDateTime.toISOString(), timeZone: 'Asia/Tokyo' },
        end: { dateTime: endDateTime.toISOString(), timeZone: 'Asia/Tokyo' },
      },
    });

    if (lineToken) {
      await fetch('https://api.line.me/v2/bot/message/broadcast', {
        method: 'POST',
        headers: { Authorization: `Bearer ${lineToken}`, 'Content-Type': 'application/json' },
        body: JSON.stringify({
          messages: [{ type: 'text', text: `【新規予約】\n日時：${formattedDate} ${time}\n名前：${name}様\n人数：${party}名\n備考：${message || 'なし'}` }],
        }),
      });
    }

    return NextResponse.json({ ok: true });
  } catch (err: any) {
    console.error('Reserve Error:', err.message);
    return NextResponse.json({ error: '予約失敗', detail: err.message }, { status: 500 });
  }
}

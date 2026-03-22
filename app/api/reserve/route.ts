import { google } from 'googleapis';
import { NextRequest, NextResponse } from 'next/server';

export async function POST(req: NextRequest) {
  try {
    const { date, party, time, name, tel, course, message } = await req.json();

    // 1. 店舗用カレンダーID（固定）
    const calendarId = "2fe0af61ebe1e42cb0fbc5761f7fd2c9dca60d8286f0a6b7a2705a0197561ca5@group.calendar.google.com";
    
    // 2. 新しい認証情報（Vercelの環境変数から取得）
    const clientEmail = process.env.GOOGLE_SERVICE_ACCOUNT_EMAIL;
    const privateKey = process.env.GOOGLE_PRIVATE_KEY;
    const lineToken = process.env.LINE_CHANNEL_ACCESS_TOKEN || process.env.LINE_TOKEN;

    console.log("--- 予約システム実行 (New Key v2) ---");
    console.log("Target Calendar:", calendarId);

    if (!clientEmail || !privateKey) {
      throw new Error("環境変数が不足しています。Vercelの設定を確認してください。");
    }

    // 日時フォーマットの調整
    const formattedDate = date.replace(/\//g, '-');
    const startDateTime = new Date(`${formattedDate}T${time}:00`);
    const endDateTime = new Date(startDateTime.getTime() + 2 * 60 * 60 * 1000); // 2時間枠

    // 3. Google Calendar API 認証
    const auth = new google.auth.JWT(
      clientEmail,
      undefined,
      privateKey.replace(/\\n/g, '\n'),
      ['https://www.googleapis.com/auth/calendar']
    );

    const calendar = google.calendar({ version: 'v3', auth });

    // 4. カレンダーへイベント挿入
    await calendar.events.insert({
      calendarId: calendarId,
      requestBody: {
        summary: `【予約】${name}様 (${party}名)`,
        description: `コース: ${course || '未定'}\n電話: ${tel}\n備考: ${message || 'なし'}\n(システム経由予約)`,
        start: { 
          dateTime: startDateTime.toISOString(), 
          timeZone: 'Asia/Tokyo' 
        },
        end: { 
          dateTime: endDateTime.toISOString(), 
          timeZone: 'Asia/Tokyo' 
        },
      },
    });

    // 5. LINE通知（設定されている場合のみ）
    if (lineToken) {
      try {
        await fetch('https://api.line.me/v2/bot/message/broadcast', {
          method: 'POST',
          headers: {
            Authorization: `Bearer ${lineToken}`,
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            messages: [{ 
              type: 'text', 
              text: `【新規予約】\nお名前：${name}様\n日時：${formattedDate} ${time}~\n人数：${party}名\nコース：${course}\n\nカレンダーに登録しました。` 
            }]
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

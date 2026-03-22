import { google } from 'googleapis';
import { NextRequest, NextResponse } from 'next/server';

export async function POST(req: NextRequest) {
  try {
    const { date, party, time, name, tel, course, message } = await req.json();

    // 1. 店舗用カレンダーID
    const calendarId = "2fe0af61ebe1e42cb0fbc5761f7fd2c9dca60d8286f0a6b7a2705a0197561ca5@group.calendar.google.com";
    
    // 2. Vercelの環境変数から新しい認証情報を取得
    const clientEmail = process.env.GOOGLE_SERVICE_ACCOUNT_EMAIL;
    const privateKey = process.env.GOOGLE_PRIVATE_KEY;
    const lineToken = process.env.LINE_CHANNEL_ACCESS_TOKEN || process.env.LINE_TOKEN;

    if (!clientEmail || !privateKey) {
      throw new Error("環境変数が不足しています。VercelのEnvironment Variablesを確認してください。");
    }

    // 日時フォーマットの調整 (YYYY/MM/DD -> YYYY-MM-DD)
    const formattedDate = date.replace(/\//g, '-');
    const startDateTime = new Date(`${formattedDate}T${time}:00`);
    const endDateTime = new Date(startDateTime.getTime() + 2 * 60 * 60 * 1000); // 標準2時間枠

    // 3. Google Calendar API 認証設定
    const auth = new google.auth.JWT(
      clientEmail,
      undefined,
      privateKey.replace(/\\n/g, '\n'),
      ['https://www.googleapis.com/auth/calendar']
    );

    const calendar = google.calendar({ version: 'v3', auth });

    // 4. カレンダーへイベントを書き込み
    await calendar.events.insert({
      calendarId: calendarId,
      requestBody: {
        summary: `【予約】${name}様 (${party}名)`,
        description: `コース: ${course || '未定'}\n電話: ${tel}\n備考: ${message || 'なし'}\n(システム自動登録)`,
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

    // 5. LINE通知（設定されている場合のみ実行）
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
              text: `【新規予約】\nお名前：${name}様\n日時：${formattedDate} ${time}~\n人数：${party}名\nコース：${course}\n\nカレンダー登録が完了しました。` 
            }]
          }),
        });
      } catch (e) {
        console.error("LINE通知送信エラー:", e);
      }
    }

    return NextResponse.json({ ok: true });

  } catch (err: any) {
    console.error('予約処理エラーログ:', err.message);
    return NextResponse.json(
      { error: '予約処理に失敗しました', detail: err.message },
      { status: 500 }
    );
  }
}

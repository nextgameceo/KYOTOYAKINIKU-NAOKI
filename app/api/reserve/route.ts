import { google } from 'googleapis';
import { NextRequest, NextResponse } from 'next/server';

export async function POST(req: NextRequest) {
  try {
    const { date, party, time, name, tel, course, message } = await req.json();

    const calendarId = "2fe0af61ebe1e42cb0fbc5761f7fd2c9dca60d8286f0a6b7a2705a0197561ca5@group.calendar.google.com";
    const clientEmail = process.env.GOOGLE_SERVICE_ACCOUNT_EMAIL;
    const privateKey = process.env.GOOGLE_PRIVATE_KEY;
    const lineToken = process.env.LINE_CHANNEL_ACCESS_TOKEN || process.env.LINE_TOKEN;

    if (!clientEmail || !privateKey) {
      throw new Error("環境変数が不足しています。");
    }

    // --- 深夜時間・タイムゾーンの厳格な処理 ---
    const [hoursStr, minutesStr] = time.split(':');
    let hours = parseInt(hoursStr, 10);
    const minutes = parseInt(minutesStr, 10);
    
    // 日付をハイフン形式に統一
    const datePart = date.replace(/\//g, '-'); 
    
    // 基準となる日時のオブジェクトを作成
    const startDate = new Date(`${datePart}T00:00:00+09:00`);
    
    // 時間と分をセット（24時以降なら自動で翌日に繰り上がります）
    startDate.setHours(hours);
    startDate.setMinutes(minutes);

    // 終了時間を「開始の120分後」に設定
    const endDate = new Date(startDate.getTime() + 120 * 60 * 1000);

    // ISO文字列に変換（Google APIが確実に解釈できる形式）
    const startIso = startDate.toISOString();
    const endIso = endDate.toISOString();

    // --- Google Calendar API 認証 ---
    const auth = new google.auth.JWT(
      clientEmail,
      undefined,
      privateKey.replace(/\\n/g, '\n'),
      ['https://www.googleapis.com/auth/calendar']
    );

    const calendar = google.calendar({ version: 'v3', auth });

    // --- カレンダーへ挿入 ---
    await calendar.events.insert({
      calendarId: calendarId,
      requestBody: {
        summary: `【予約】${name}様 (${party}名)`,
        description: `コース: ${course || '未定'}\n電話: ${tel}\n備考: ${message || 'なし'}`,
        start: { dateTime: startIso, timeZone: 'Asia/Tokyo' },
        end: { dateTime: endIso, timeZone: 'Asia/Tokyo' },
      },
    });

    // --- LINE通知 ---
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
              text: `【新規予約】\nお名前：${name}様\n日時：${date} ${time}~\n人数：${party}名\nコース：${course}\n\nカレンダー登録が完了しました。` 
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

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

    // --- 深夜時間（24時以降）の補正処理 ---
    const [hoursStr, minutesStr] = time.split(':');
    let hours = parseInt(hoursStr, 10);
    const minutes = parseInt(minutesStr, 10);
    
    // 日付を Date オブジェクトに変換
    const targetDate = new Date(date.replace(/\//g, '-'));
    
    // 24時以上の数値（25時, 27時など）が来た場合、翌日の時間として計算
    if (hours >= 24) {
      targetDate.setDate(targetDate.getDate() + 1); // 日付を1日進める
      hours = hours - 24; // 時間を 0-23 の範囲に戻す
    }

    // ISO形式の時刻文字列を作成 (日本時間 +09:00 固定)
    const formattedHours = String(hours).padStart(2, '0');
    const formattedMinutes = String(minutes).padStart(2, '0');
    const cleanDateStr = targetDate.toISOString().split('T')[0];
    
    const startIsoString = `${cleanDateStr}T${formattedHours}:${formattedMinutes}:00+09:00`;
    const startDateObj = new Date(startIsoString);
    const endDateObj = new Date(startDateObj.getTime() + 2 * 60 * 60 * 1000);
    const endIsoString = endDateObj.toISOString().replace(/\.\d+Z$/, '+09:00');

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
        start: { dateTime: startIsoString, timeZone: 'Asia/Tokyo' },
        end: { dateTime: endIsoString, timeZone: 'Asia/Tokyo' },
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

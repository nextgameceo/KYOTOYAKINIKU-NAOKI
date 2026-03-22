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

    // --- 日付のクリーニングと日時文字列の作成 ---
    // スラッシュをハイフンに変換し、確実に YYYY-MM-DD 形式にします
    const cleanDate = date.replace(/\//g, '-'); 
    
    // 日本時間 (+09:00) を明示した文字列を直接作成
    // 例: "2026-03-24T18:00:00+09:00"
    const startIsoString = `${cleanDate}T${time}:00+09:00`;
    
    // 終了時刻（2時間後）の計算
    const startDateObj = new Date(startIsoString);
    if (isNaN(startDateObj.getTime())) {
      throw new Error(`日付の形式が正しくありません: ${startIsoString}`);
    }
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
        start: { 
          dateTime: startIsoString, // 作成した日本時間の文字列を直接送る
          timeZone: 'Asia/Tokyo' 
        },
        end: { 
          dateTime: endIsoString, 
          timeZone: 'Asia/Tokyo' 
        },
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
              text: `【新規予約】\nお名前：${name}様\n日時：${cleanDate} ${time}~\n人数：${party}名\nコース：${course}\n\nカレンダー登録が完了しました。` 
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

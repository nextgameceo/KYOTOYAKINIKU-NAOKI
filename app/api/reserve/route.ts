import { google } from 'googleapis';
import { NextRequest, NextResponse } from 'next/server';

export async function POST(req: NextRequest) {
  try {
    const { date, party, time, name, tel, course, message } = await req.json();

    // 1. カレンダーIDを直接指定（Vercelの設定ミスを100%回避）
    const calendarId = "2fe0af61ebe1e42cb0fbc5761f7fd2c9dca60d8286f0a6b7a2705a0197561ca5@group.calendar.google.com";
    
    // 2. その他の環境変数を取得
    const clientEmail = process.env.GOOGLE_SERVICE_ACCOUNT_EMAIL || process.env.SERVICE_ACCOUNT_EMAIL;
    const privateKey = process.env.GOOGLE_PRIVATE_KEY || process.env.PRIVATE_KEY;
    const lineToken = process.env.LINE_CHANNEL_ACCESS_TOKEN || process.env.LINE_TOKEN;

    // 接続状況のデバッグ表示（VercelのLogsに出ます）
    console.log("--- System Check ---");
    console.log("Calendar ID (Direct):", calendarId);
    console.log("Auth Email:", clientEmail ? "OK" : "MISSING");
    console.log("Auth Key:", privateKey ? "OK" : "MISSING");

    if (!clientEmail || !privateKey) {
      throw new Error("環境変数が不足しています（EMAIL または KEY）");
    }

    // 3. 日付と時間を正しくフォーマット（スラッシュをハイフンに変換）
    const formattedDate = date.replace(/\//g, '-');
    const startDateTime = new Date(`${formattedDate}T${time}:00`);
    
    if (isNaN(startDateTime.getTime())) {
       throw new Error(`日時の形式が不正です: ${formattedDate}T${time}:00`);
    }
    const endDateTime = new Date(startDateTime.getTime() + 2 * 60 * 60 * 1000); // 2時間制

    // 4. Google認証
    const auth = new google.auth.JWT(
      clientEmail,
      undefined,
      privateKey.replace(/\\n/g, '\n'),
      ['https://www.googleapis.com/auth/calendar']
    );

    const calendar = google.calendar({ version: 'v3', auth });

    // 5. カレンダーへ挿入
    await calendar.events.insert({
      calendarId: calendarId,
      requestBody: {
        summary: `【予約】${name}様 (${party}名)`,
        description: [
          `コース: ${course || '未定'}`,
          `電話番号: ${tel}`,
          `人数: ${party}名`,
          `--------------------`,
          `■ メッセージ（備考）：`,
          `${message || 'なし'}`,
        ].join('\n'),
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

    // 6. LINEへの通知（カレンダー成功後のみ実行）
    if (lineToken) {
      try {
        const lineMessage = [
          '【🔥 京都焼肉なおき 新規予約】',
          `■ 日時：${formattedDate} ${time}〜`,
          `■ 人数：${party}名`,
          `■ 名前：${name} 様`,
          `■ 電話：${tel}`,
          `■ 備考：${course || '未定'}`,
          '------------------',
          `■ メッセージ：`,
          `${message || 'なし'}`,
          '------------------',
          '※Googleカレンダーに自動登録しました。'
        ].join('\n');

        await fetch('https://api.line.me/v2/bot/message/broadcast', {
          method: 'POST',
          headers: {
            Authorization: `Bearer ${lineToken}`,
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            messages: [{ type: 'text', text: lineMessage }]
          }),
        });
      } catch (lineErr) {
        console.error("LINE通知のみ失敗（カレンダーは成功）:", lineErr);
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

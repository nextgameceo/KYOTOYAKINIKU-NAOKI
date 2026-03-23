import { google } from 'googleapis';
import { NextRequest, NextResponse } from 'next/server';

export async function POST(req: NextRequest) {
  console.log("--- 予約処理開始 ---");
  try {
    const body = await req.json();
    const { date, party, time, name, tel, course } = body;
    const memo = body.message || body.note || "なし";

    const calendarId = "2fe0af61ebe1e42cb0fbc5761f7fd2c9dca60d8286f0a6b7a2705a0197561ca5@group.calendar.google.com";
    const clientEmail = process.env.GOOGLE_SERVICE_ACCOUNT_EMAIL;
    const privateKey = process.env.GOOGLE_PRIVATE_KEY;
    const lineToken = process.env.LINE_CHANNEL_ACCESS_TOKEN;
    const lineUserId = process.env.LINE_USER_ID;

    // --- 日付・時刻計算 ---
    const [y, m, d] = date.split('/').map(Number);
    const [hStr, minStr] = time.split(':');
    let h = parseInt(hStr, 10);
    const min = parseInt(minStr, 10);
    let targetDate = new Date(y, m - 1, d, 0, 0, 0);
    targetDate.setHours(h);
    targetDate.setMinutes(min);
    const endDate = new Date(targetDate.getTime() + 30 * 60 * 1000);

    const toJstIso = (dt: Date) => {
      const pad = (n: number) => String(n).padStart(2, '0');
      return `${dt.getFullYear()}-${pad(dt.getMonth() + 1)}-${pad(dt.getDate())}T${pad(hStr)}:${pad(minStr)}:00+09:00`;
    };

    // --- 1. LINE通知 (詳細ログ付き) ---
    if (lineToken && lineUserId) {
      console.log("LINE送信準備: ID=" + lineUserId.substring(0, 5) + "...");
      const linePayload = {
        to: lineUserId.trim(),
        messages: [{
          type: 'text',
          text: `【新規予約通知】\nお名前：${name}様\n日時：${date} ${time}~\n人数：${party}名\nコース：${course}\n備考：${memo}`
        }]
      };

      const lineResponse = await fetch('https://api.line.me/v2/bot/message/push', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${lineToken.trim()}`,
        },
        body: JSON.stringify(linePayload),
      });

      console.log("LINE応答ステータス:", lineResponse.status);
      if (!lineResponse.ok) {
        const errorDetail = await lineResponse.text();
        console.error("LINE送信失敗の具体的理由:", errorDetail);
      } else {
        console.log("LINE送信成功！");
      }
    } else {
      console.warn("LINE環境変数が不足しています。Token or UserID is empty.");
    }

    // --- 2. Googleカレンダー登録 ---
    console.log("Googleカレンダー登録開始...");
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
        description: `【時間】: ${time}\n【電話】: ${tel}\n【備考】: ${memo}`,
        start: { dateTime: toJstIso(targetDate), timeZone: 'Asia/Tokyo' },
        end: { dateTime: toJstIso(endDate), timeZone: 'Asia/Tokyo' },
      },
    });
    console.log("カレンダー登録完了");

    return NextResponse.json({ ok: true });

  } catch (err: any) {
    console.error("致命的エラー:", err.stack);
    return NextResponse.json({ error: '処理失敗', detail: err.message }, { status: 500 });
  }
}

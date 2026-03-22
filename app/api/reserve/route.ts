import { google } from 'googleapis';
import { NextRequest, NextResponse } from 'next/server';

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    // どんな変数名（message, notes, remarks）で来ても中身を拾えるようにします
    const { date, party, time, name, tel, course } = body;
    const memo = body.message || body.notes || body.remarks || "なし"; 

    const calendarId = "2fe0af61ebe1e42cb0fbc5761f7fd2c9dca60d8286f0a6b7a2705a0197561ca5@group.calendar.google.com";
    const clientEmail = process.env.GOOGLE_SERVICE_ACCOUNT_EMAIL;
    const privateKey = process.env.GOOGLE_PRIVATE_KEY;
    const lineToken = process.env.LINE_CHANNEL_ACCESS_TOKEN || process.env.LINE_TOKEN;

    if (!clientEmail || !privateKey) throw new Error("環境変数が不足しています。");

    // --- 【1】深夜時間と日付の計算（翌日繰り越し対応） ---
    const stayMinutes = 30; 
    const [hoursStr, minutesStr] = time.split(':');
    let hours = parseInt(hoursStr, 10);
    const minutes = parseInt(minutesStr, 10);
    
    const startDate = new Date(`${date.replace(/\//g, '-')}T00:00:00+09:00`);
    startDate.setHours(hours);
    startDate.setMinutes(minutes);

    const endDate = new Date(startDate.getTime() + stayMinutes * 60 * 1000);

    const toJstIso = (d: Date) => {
      const pad = (n: number) => String(n).padStart(2, '0');
      return `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())}T${pad(d.getHours())}:${pad(d.getMinutes())}:00+09:00`;
    };

    // --- 【2】Google API 実行 ---
    const auth = new google.auth.JWT(
      clientEmail,
      undefined,
      privateKey.replace(/\\n/g, '\n'),
      ['https://www.googleapis.com/auth/calendar']
    );

    const calendar = google.calendar({ version: 'v3', auth });

    // 備考欄を確実に反映させるための組み立て
    const eventDescription = [
      `【お名前】: ${name}様`,
      `【人数】: ${party}名`,
      `【コース】: ${course || '未選択'}`,
      `【電話番号】: ${tel}`,
      `【備考】: ${memo}`, // ★ここで確実に反映させます
      `---`,
      `システム経由の自動予約（滞在${stayMinutes}分）`
    ].join('\n');

    await calendar.events.insert({
      calendarId: calendarId,
      requestBody: {
        summary: `【予約】${name}様 (${party}名)`,
        description: eventDescription,
        start: { dateTime: toJstIso(startDate), timeZone: 'Asia/Tokyo' },
        end: { dateTime: toJstIso(endDate), timeZone: 'Asia/Tokyo' },
      },
    });

    // --- 【3】LINE通知 ---
    if (lineToken) {
      await fetch('https://api.line.me/v2/bot/message/broadcast', {
        method: 'POST',
        headers: { Authorization: `Bearer ${lineToken}`, 'Content-Type': 'application/json' },
        body: JSON.stringify({
          messages: [{ 
            type: 'text', 
            text: `【新規予約】\nお名前：${name}様\n日時：${date} ${time}~\n人数：${party}名\n備考：${memo}\n\nカレンダーに登録しました。` 
          }]
        }),
      });
    }

    return NextResponse.json({ ok: true });

  } catch (err: any) {
    console.error('予約処理エラーログ:', err.message);
    return NextResponse.json({ error: 'エラー', detail: err.message }, { status: 500 });
  }
}

import { google } from 'googleapis';
import { NextRequest, NextResponse } from 'next/server';

export async function POST(req: NextRequest) {
  try {
    const { date, party, time, name, tel, course, message } = await req.json();

    const calendarId = "2fe0af61ebe1e42cb0fbc5761f7fd2c9dca60d8286f0a6b7a2705a0197561ca5@group.calendar.google.com";
    const clientEmail = process.env.GOOGLE_SERVICE_ACCOUNT_EMAIL;
    const privateKey = process.env.GOOGLE_PRIVATE_KEY;
    const lineToken = process.env.LINE_CHANNEL_ACCESS_TOKEN || process.env.LINE_TOKEN;

    if (!clientEmail || !privateKey) throw new Error("環境変数が不足しています。");

    // --- 【1】滞在時間と深夜時間の計算 ---
    const stayMinutes = 30; // ★滞在時間を30分に設定
    const [hoursStr, minutesStr] = time.split(':');
    let hours = parseInt(hoursStr, 10);
    const minutes = parseInt(minutesStr, 10);
    
    // 基準日の 00:00 JST を作成
    const startDate = new Date(`${date.replace(/\//g, '-')}T00:00:00+09:00`);
    
    // setHours は 24以上の数値（27時など）も自動で翌日に繰り越します
    startDate.setHours(hours);
    startDate.setMinutes(minutes);

    // 終了時間を「開始の30分後」に設定
    const endDate = new Date(startDate.getTime() + stayMinutes * 60 * 1000);

    // 日本時間形式の文字列を作成（時差ボケ防止）
    const toJstIso = (d: Date) => {
      const pad = (n: number) => String(n).padStart(2, '0');
      return `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())}T${pad(d.getHours())}:${pad(d.getMinutes())}:00+09:00`;
    };

    const startIso = toJstIso(startDate);
    const endIso = toJstIso(endDate);

    // --- 【2】Google API 実行 ---
    const auth = new google.auth.JWT(
      clientEmail,
      undefined,
      privateKey.replace(/\\n/g, '\n'),
      ['https://www.googleapis.com/auth/calendar']
    );

    const calendar = google.calendar({ version: 'v3', auth });

    // 備考欄に全ての情報を集約
    const eventDescription = [
      `【お名前】: ${name}様`,
      `【人数】: ${party}名`,
      `【コース】: ${course || '未選択'}`,
      `【電話番号】: ${tel}`,
      `【備考】: ${message || 'なし'}`,
      `---`,
      `システム経由の自動予約（滞在${stayMinutes}分）`
    ].join('\n');

    await calendar.events.insert({
      calendarId: calendarId,
      requestBody: {
        summary: `【予約】${name}様 (${party}名)`,
        description: eventDescription,
        start: { dateTime: startIso, timeZone: 'Asia/Tokyo' },
        end: { dateTime: endIso, timeZone: 'Asia/Tokyo' },
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
            text: `【新規予約】\nお名前：${name}様\n日時：${date} ${time}~\n人数：${party}名\nコース：${course}\n備考：${message || 'なし'}\n\nカレンダーに登録しました。` 
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

import { google } from 'googleapis';
import { NextRequest, NextResponse } from 'next/server';

export async function POST(req: NextRequest) {
  try {
    // フォームから送られてくるデータを取得
    const { date, party, time, name, tel, course, message } = await req.json();

    const calendarId = "2fe0af61ebe1e42cb0fbc5761f7fd2c9dca60d8286f0a6b7a2705a0197561ca5@group.calendar.google.com";
    const clientEmail = process.env.GOOGLE_SERVICE_ACCOUNT_EMAIL;
    const privateKey = process.env.GOOGLE_PRIVATE_KEY;
    const lineToken = process.env.LINE_CHANNEL_ACCESS_TOKEN || process.env.LINE_TOKEN;

    if (!clientEmail || !privateKey) throw new Error("環境変数が不足しています。");

    // --- 【1】深夜時間と日付の計算 ---
    const [hoursStr, minutesStr] = time.split(':');
    let hours = parseInt(hoursStr, 10);
    const minutes = parseInt(minutesStr, 10);
    
    // 基準日を作成（スラッシュをハイフンに変換）
    const startDate = new Date(date.replace(/\//g, '-'));
    
    // 24時以降（27時など）なら日付を翌日に進めて、時間を 0-23 の範囲に調整
    if (hours >= 24) {
      startDate.setDate(startDate.getDate() + 1);
      hours -= 24;
    }

    // --- 【2】日本時間を明示した文字列を直接作成 (時差解消の肝) ---
    const YYYY = startDate.getFullYear();
    const MM = String(startDate.getMonth() + 1).padStart(2, '0');
    const DD = String(startDate.getDate()).padStart(2, '0');
    const HH = String(hours).padStart(2, '0');
    const mm = String(minutes).padStart(2, '0');
    
    // 開始時間（日本時間 +09:00 を明記）
    const startIso = `${YYYY}-${MM}-${DD}T${HH}:${mm}:00+09:00`;

    // 終了時間を「2時間後」として計算
    const endEff = new Date(`${YYYY}-${MM}-${DD}T${HH}:${mm}:00+09:00`);
    endEff.setHours(endEff.getHours() + 2);
    
    const endYYYY = endEff.getFullYear();
    const endMM = String(endEff.getMonth() + 1).padStart(2, '0');
    const endDD = String(endEff.getDate()).padStart(2, '0');
    const endHH = String(endEff.getHours()).padStart(2, '0');
    const endmm = String(endEff.getMinutes()).padStart(2, '0');
    
    const endIso = `${endYYYY}-${endMM}-${endDD}T${endHH}:${endmm}:00+09:00`;

    // --- 【3】Google API 実行 ---
    const auth = new google.auth.JWT(
      clientEmail,
      undefined,
      privateKey.replace(/\\n/g, '\n'),
      ['https://www.googleapis.com/auth/calendar']
    );

    const calendar = google.calendar({ version: 'v3', auth });

    // 備考欄を確実に反映させるための文字列作成
    const eventDescription = [
      `コース: ${course || '未選択'}`,
      `電話番号: ${tel}`,
      `備考: ${message || 'なし'}`, // ここで message を確実に代入
      `---`,
      `システム経由予約`
    ].join('\n');

    await calendar.events.insert({
      calendarId: calendarId,
      requestBody: {
        summary: `【予約】${name}様 (${party}名)`,
        description: eventDescription, // ここに備考を含めた説明を設定
        start: { dateTime: startIso, timeZone: 'Asia/Tokyo' },
        end: { dateTime: endIso, timeZone: 'Asia/Tokyo' },
      },
    });

    // --- 【4】LINE通知（変更なし） ---
    if (lineToken) {
      try {
        await fetch('https://api.line.me/v2/bot/message/broadcast', {
          method: 'POST',
          headers: { Authorization: `Bearer ${lineToken}`, 'Content-Type': 'application/json' },
          body: JSON.stringify({
            messages: [{ 
              type: 'text', 
              text: `【新規予約】\nお名前：${name}様\n日時：${date} ${time}~\n人数：${party}名\nコース：${course}\n備考：${message || 'なし'}\n\nカレンダー登録が完了しました。` 
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
    return NextResponse.json({ error: '予約処理に失敗しました', detail: err.message }, { status: 500 });
  }
}

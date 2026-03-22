import { google } from 'googleapis';
import { NextRequest, NextResponse } from 'next/server';

export async function POST(req: NextRequest) {
  try {
    const { date, party, time, name, tel, course, message } = await req.json();

    // 日時を正しく組み合わせる（Invalid time 対策）
    const dateTimeStr = `${date}T${time}:00`;
    const startDateTime = new Date(dateTimeStr);
    
    // 万が一変換に失敗した場合のチェック
    if (isNaN(startDateTime.getTime())) {
       throw new Error(`日時の形式が正しくありません: ${dateTimeStr}`);
    }

    const endDateTime = new Date(startDateTime.getTime() + 2 * 60 * 60 * 1000); // 2時間後

    // 認証設定
    const auth = new google.auth.JWT(
      process.env.GOOGLE_SERVICE_ACCOUNT_EMAIL,
      undefined,
      process.env.GOOGLE_PRIVATE_KEY?.replace(/\\n/g, '\n'),
      ['https://www.googleapis.com/auth/calendar']
    );

    const calendar = google.calendar({ version: 'v3', auth });

    await calendar.events.insert({
      calendarId: process.env.GOOGLE_CALENDAR_ID,
      requestBody: {
        summary: `【予約】${name}様 (${party}名)`,
        description: [
          `コース: ${course || '未定'}`,
          `電話番号: ${tel}`,
          `人数: ${party}名`,
          `--- 備考 ---`,
          `${message || 'なし'}`
        ].join('\n'),
        start: { dateTime: startDateTime.toISOString(), timeZone: 'Asia/Tokyo' },
        end: { dateTime: endDateTime.toISOString(), timeZone: 'Asia/Tokyo' },
      },
    });

    // LINE通知（エラーが起きてもカレンダー登録が優先されるよう、最後に配置）
    const lineToken = process.env.LINE_CHANNEL_ACCESS_TOKEN;
    if (lineToken) {
      const lineMessage = [
        '【🔥 新規予約が入りました】',
        `■ 日時：${date} ${time}〜`,
        `■ 人数：${party}名`,
        `■ 名前：${name} 様`,
        `■ 電話：${tel}`,
        `■ 備考：${course || 'コース未定'}`,
        '------------------',
        `■ メッセージ：`,
        `${message || 'なし'}`,
        '------------------',
        '',
        '※カレンダーに登録済みです。'
      ].join('\n');

      await fetch('https://api.line.me/v2/bot/message/broadcast', {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${lineToken}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ messages: [{ type: 'text', text: lineMessage }] }),
      });
    }

    return NextResponse.json({ ok: true });

  } catch (err: any) {
    console.error('Reserve Error:', err);
    return NextResponse.json({ error: '予約処理に失敗しました', detail: err.message }, { status: 500 });
  }
}

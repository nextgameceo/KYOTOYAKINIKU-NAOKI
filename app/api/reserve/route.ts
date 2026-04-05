import { google } from 'googleapis';
import { NextRequest, NextResponse } from 'next/server';
import { Redis } from '@upstash/redis';

const redis = Redis.fromEnv();

type ReserveBody = {
  date: string;
  time: string;
  party: string;
  name: string;
  tel: string;
  course: string;
  message?: string;
};

function validateBody(body: Partial<ReserveBody>): string | null {
  if (!body.date) return 'ご来店日が未入力です。';
  if (!body.time) return '時間が未入力です。';
  if (!body.name?.trim()) return 'お名前が未入力です。';
  if (!body.tel?.trim()) return '電話番号が未入力です。';
  if (!body.party) return '人数が未入力です。';
  const partyNum = Number(body.party);
  if (isNaN(partyNum) || partyNum < 1 || partyNum > 20)
    return '人数は1〜20名の範囲で入力してください。';
  return null;
}

function buildDateTime(date: string, time: string): { start: Date; end: Date } {
  const normalized = date.replace(/\//g, '-');
  const [y, m, d] = normalized.split('-').map(Number);
  const [hStr, minStr] = time.split(':');
  const hours = parseInt(hStr, 10);
  const minutes = parseInt(minStr, 10);

  const start = new Date(y, m - 1, d, hours, minutes, 0);
  if (hours < 5) {
    start.setDate(start.getDate() + 1);
  }
  const end = new Date(start.getTime() + 2 * 60 * 60 * 1000);
  return { start, end };
}

function toJSTIsoString(dt: Date): string {
  const pad = (n: number) => String(n).padStart(2, '0');
  return (
    `${dt.getFullYear()}-${pad(dt.getMonth() + 1)}-${pad(dt.getDate())}` +
    `T${pad(dt.getHours())}:${pad(dt.getMinutes())}:00+09:00`
  );
}

// カレンダーIDを直接指定
const CALENDAR_ID = '2fe0af61ebe1e42cb0fbc5761f7fd2c9dca60d8286f0a6b7a2705a0197561ca5@group.calendar.google.com';

export async function POST(req: NextRequest) {

  // 1. 満席確認
  try {
    const status = await redis.get('RESERVE_STATUS');
    if (status === 'CLOSED') {
      return NextResponse.json(
        { error: 'ただいま満席のため予約を停止しております' },
        { status: 403 }
      );
    }
  } catch (redisErr) {
    console.error('Redis確認エラー:', redisErr);
  }

  // 2. バリデーション
  let body: Partial<ReserveBody>;
  try {
    body = await req.json();
  } catch {
    return NextResponse.json(
      { error: 'リクエストの形式が正しくありません。' },
      { status: 400 }
    );
  }

  const validationError = validateBody(body);
  if (validationError) {
    return NextResponse.json({ error: validationError }, { status: 400 });
  }

  const { date, time, party, name, tel, course } = body as ReserveBody;
  const memo = body.message?.trim() || 'なし';

  // 3. 日付計算
  const { start, end } = buildDateTime(date, time);
  const startStr = toJSTIsoString(start);
  const endStr = toJSTIsoString(end);

  // 4. LINE通知（失敗しても続行）
  const lineToken = process.env.LINE_CHANNEL_ACCESS_TOKEN;
  if (lineToken) {
    try {
      const lineRes = await fetch('https://api.line.me/v2/bot/message/broadcast', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${lineToken.trim()}`,
        },
        body: JSON.stringify({
          messages: [
            {
              type: 'text',
              text: [
                '【新規予約通知】',
                `お名前：${name}様`,
                `日時：${date} ${time}〜`,
                `人数：${party}名`,
                `コース：${course}`,
                `備考：${memo}`,
                `電話：${tel}`,
              ].join('\n'),
            },
          ],
        }),
      });
      if (!lineRes.ok) {
        const errText = await lineRes.text();
        console.error('LINE通知失敗:', lineRes.status, errText);
      } else {
        console.log('LINE通知成功');
      }
    } catch (lineErr) {
      console.error('LINE通知例外:', lineErr);
    }
  } else {
    console.warn('LINE_CHANNEL_ACCESS_TOKEN が未設定');
  }

  // 5. Googleカレンダー登録（失敗しても続行）
  const clientEmail = process.env.GOOGLE_CLIENT_EMAIL;
  const rawKey = process.env.GOOGLE_PRIVATE_KEY ?? '';
  const privateKey = rawKey.includes('\\n')
    ? rawKey.replace(/\\n/g, '\n')
    : rawKey;

  if (!clientEmail || !privateKey) {
    console.warn('Google認証情報未設定 - カレンダー登録スキップ');
  } else {
    try {
      const auth = new google.auth.JWT(
        clientEmail,
        undefined,
        privateKey,
        ['https://www.googleapis.com/auth/calendar']
      );
      const calendar = google.calendar({ version: 'v3', auth });
      await calendar.events.insert({
        calendarId: CALENDAR_ID,
        requestBody: {
          summary: `【予約】${name}様（${party}名）`,
          description: [
            `コース：${course}`,
            `電話：${tel}`,
            `備考：${memo}`,
          ].join('\n'),
          start: { dateTime: startStr, timeZone: 'Asia/Tokyo' },
          end: { dateTime: endStr, timeZone: 'Asia/Tokyo' },
          colorId: course.includes('松') ? '11' : course.includes('竹') ? '5' : '1',
        },
      });
      console.log('カレンダー登録成功');
    } catch (calErr) {
      console.error('カレンダー登録エラー:', calErr);
    }
  }

  // 6. 成功レスポンス
  return NextResponse.json({ ok: true });
}

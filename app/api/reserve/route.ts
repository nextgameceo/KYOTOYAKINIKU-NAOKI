import { google } from 'googleapis';
import { NextRequest, NextResponse } from 'next/server';
import { Redis } from '@upstash/redis';

// Redisの初期化（満席チェック用）
const redis = Redis.fromEnv();

// ─── 型定義 ───────────────────────────────────────────────
type ReserveBody = {
  date: string;   // "YYYY/MM/DD" または "YYYY-MM-DD"
  time: string;   // "HH:MM"
  party: string;
  name: string;
  tel: string;
  course: string;
  message?: string;
};

// ─── バリデーション ────────────────────────────────────────
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

// ─── 日付文字列をDateオブジェクトに変換（深夜枠対応） ────
function buildDateTime(date: string, time: string): { start: Date; end: Date } {
  // "YYYY/MM/DD" と "YYYY-MM-DD" の両形式に対応
  const normalized = date.replace(/\//g, '-');
  const [y, m, d] = normalized.split('-').map(Number);
  const [hStr, minStr] = time.split(':');
  const hours = parseInt(hStr, 10);
  const minutes = parseInt(minStr, 10);

  const start = new Date(y, m - 1, d, hours, minutes, 0);

  // 深夜枠（0:00〜4:00）は翌日扱いにする
  if (hours < 5) {
    start.setDate(start.getDate() + 1);
  }

  // 滞在時間を2時間と想定（元のコードは30分固定だったため修正）
  const end = new Date(start.getTime() + 2 * 60 * 60 * 1000);

  return { start, end };
}

// ─── ISO文字列変換（JST固定） ─────────────────────────────
function toJSTIsoString(dt: Date): string {
  const pad = (n: number) => String(n).padStart(2, '0');
  return (
    `${dt.getFullYear()}-${pad(dt.getMonth() + 1)}-${pad(dt.getDate())}` +
    `T${pad(dt.getHours())}:${pad(dt.getMinutes())}:00+09:00`
  );
}

// ─── Google カレンダーID ──────────────────────────────────
const CALENDAR_ID =
  '2fe0af61ebe1e42cb0fbc5761f7fd2c9dca60d8286f0a6b7a2705a0197561ca5@group.calendar.google.com';

// ─── POST ハンドラ ─────────────────────────────────────────
export async function POST(req: NextRequest) {
  try {
    // 1. 満席状態の確認
    const status = await redis.get('RESERVE_STATUS');
    if (status === 'CLOSED') {
      return NextResponse.json(
        { error: 'ただいま満席のため予約を停止しております' },
        { status: 403 }
      );
    }

    // 2. リクエストボディの取得とバリデーション
    const body: Partial<ReserveBody> = await req.json();
    const validationError = validateBody(body);
    if (validationError) {
      return NextResponse.json({ error: validationError, message: validationError }, { status: 400 });
    }

    const { date, time, party, name, tel, course } = body as ReserveBody;
    const memo = body.message?.trim() || 'なし';

    // 3. 日付・時刻計算
    const { start, end } = buildDateTime(date, time);
    const startStr = toJSTIsoString(start);
    const endStr = toJSTIsoString(end);

    // 4. LINE通知
    const lineToken = process.env.LINE_CHANNEL_ACCESS_TOKEN;
    const lineUserId = process.env.LINE_USER_ID;
    if (lineToken && lineUserId) {
      try {
        const lineRes = await fetch('https://api.line.me/v2/bot/message/push', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${lineToken.trim()}`,
          },
          body: JSON.stringify({
            to: lineUserId.trim(),
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
          console.error('LINE通知エラー:', errText);
        }
      } catch (lineErr) {
        // LINE通知の失敗は予約処理全体を止めない
        console.error('LINE通知例外:', lineErr);
      }
    }

    // 5. Googleカレンダー登録
    const privateKey = process.env.GOOGLE_PRIVATE_KEY?.replace(/\\n/g, '\n');
    if (!process.env.GOOGLE_SERVICE_ACCOUNT_EMAIL || !privateKey) {
      console.warn('Google認証情報が未設定のためカレンダー登録をスキップします。');
    } else {
      const auth = new google.auth.JWT(
        process.env.GOOGLE_SERVICE_ACCOUNT_EMAIL,
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
          // 色分け：コースによってカレンダーの色を変える（任意）
          colorId: course.includes('松') ? '11' : course.includes('竹') ? '5' : '1',
        },
      });
    }

    return NextResponse.json({ ok: true });
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : '不明なエラー';
    console.error('予約処理エラー:', message);
    return NextResponse.json(
      { error: '予約処理に失敗しました。', detail: message },
      { status: 500 }
    );
  }
}

import { Redis } from '@upstash/redis';
import { NextRequest, NextResponse } from 'next/server';

const redis = Redis.fromEnv();

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const event = body.events[0];

    // メッセージイベント以外は無視
    if (!event || event.type !== 'message' || event.message.type !== 'text') {
      return NextResponse.json({ ok: true });
    }

    const userMessage = event.message.text;
    const replyToken = event.replyToken;
    let responseText = "";

    // --- 満席スイッチの判定 ---
    if (userMessage === "満席") {
      await redis.set('RESERVE_STATUS', 'CLOSED');
      responseText = "【システム通知】\n本日を「満席」に設定しました。HPからの予約を停止します。";
    } else if (userMessage === "再開") {
      await redis.set('RESERVE_STATUS', 'OPEN');
      responseText = "【システム通知】\n「予約受付」を再開しました。HPから予約が可能になります。";
    }

    // LINEに結果を返信する
    if (responseText) {
      await fetch('https://api.line.me/v2/bot/message/reply', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${process.env.LINE_CHANNEL_ACCESS_TOKEN?.trim()}`,
        },
        body: JSON.stringify({
          replyToken: replyToken,
          messages: [{ type: 'text', text: responseText }]
        }),
      });
    }

    return NextResponse.json({ ok: true });
  } catch (err) {
    console.error("Webhook Error:", err);
    return NextResponse.json({ ok: true }); // LINE側には200を返しておく
  }
}

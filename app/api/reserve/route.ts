import { NextRequest, NextResponse } from 'next/server';

export async function POST(req: NextRequest) {
  const { date, party, time, name, tel } = await req.json();

  const message = [
    '【新規予約通知】',
    `日時：${date} ${time}`,
    `人数：${party}名`,
    `名前：${name}`,
    `電話：${tel}`,
  ].join('\n');

  const token = process.env.LINE_CHANNEL_ACCESS_TOKEN;

  if (!token) {
    console.error('LINE_CHANNEL_ACCESS_TOKEN が設定されていません');
    return NextResponse.json({ error: 'LINE not configured' }, { status: 500 });
  }

  try {
    const res = await fetch('https://api.line.me/v2/bot/message/broadcast', {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${token}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        messages: [{ type: 'text', text: message }],
      }),
    });

    if (!res.ok) {
      const body = await res.text();
      console.error('LINE broadcast error:', body);
      return NextResponse.json({ error: 'LINE broadcast failed' }, { status: 500 });
    }

    return NextResponse.json({ ok: true });
  } catch (err) {
    console.error(err);
    return NextResponse.json({ error: 'Internal error' }, { status: 500 });
  }
}

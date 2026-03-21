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

  // LINE Notify
  const lineToken = process.env.LINE_NOTIFY_TOKEN;
  if (!lineToken) {
    console.error('LINE_NOTIFY_TOKEN is not set');
    return NextResponse.json({ error: 'LINE token not configured' }, { status: 500 });
  }

  try {
    const res = await fetch('https://notify-api.line.me/api/notify', {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${lineToken}`,
        'Content-Type': 'application/x-www-form-urlencoded',
      },
      body: new URLSearchParams({ message }),
    });

    if (!res.ok) {
      const body = await res.text();
      console.error('LINE Notify error:', body);
      return NextResponse.json({ error: 'LINE Notify failed' }, { status: 500 });
    }

    return NextResponse.json({ ok: true });
  } catch (err) {
    console.error(err);
    return NextResponse.json({ error: 'Internal error' }, { status: 500 });
  }
}

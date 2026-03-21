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
  // 複数人のuserIdをカンマ区切りで環境変数に設定
  const userIds = (process.env.LINE_USER_IDS || '').split(',').filter(Boolean);

  if (!token || userIds.length === 0) {
    console.error('LINE設定が不足しています');
    return NextResponse.json({ error: 'LINE not configured' }, { status: 500 });
  }

  try {
    // 全員に個別送信
    await Promise.all(
      userIds.map((userId) =>
        fetch('https://api.line.me/v2/bot/message/push', {
          method: 'POST',
          headers: {
            Authorization: `Bearer ${token}`,
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            to: userId.trim(),
            messages: [{ type: 'text', text: message }],
          }),
        })
      )
    );

    return NextResponse.json({ ok: true });
  } catch (err) {
    console.error(err);
    return NextResponse.json({ error: 'Internal error' }, { status: 500 });
  }
}

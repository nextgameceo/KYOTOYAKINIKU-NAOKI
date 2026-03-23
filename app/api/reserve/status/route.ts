import { Redis } from '@upstash/redis';
import { NextResponse } from 'next/server';

const redis = Redis.fromEnv();

// 今の状態を取得する (HPが使用)
export async function GET() {
  try {
    const status = await redis.get('RESERVE_STATUS') || 'OPEN';
    return NextResponse.json({ status });
  } catch (err) {
    return NextResponse.json({ status: 'OPEN' });
  }
}

// 状態を書き換える (LINE通知等のシステムが使用)
export async function POST(req: Request) {
  try {
    const { status } = await req.json(); // "OPEN" か "CLOSED"
    await redis.set('RESERVE_STATUS', status);
    return NextResponse.json({ ok: true, current: status });
  } catch (err) {
    return NextResponse.json({ ok: false }, { status: 500 });
  }
}

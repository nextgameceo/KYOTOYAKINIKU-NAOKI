import { NextResponse } from 'next/server';
import { getWageList } from '@/lib/microcms';

export async function GET() {
  try {
    const data = await getWageList(6);
    return NextResponse.json(data);
  } catch (err) {
    console.error('Wage API error:', err);
    return NextResponse.json({ contents: [], totalCount: 0 }, { status: 500 });
  }
}

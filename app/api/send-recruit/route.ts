import { NextRequest, NextResponse } from 'next/server';
import nodemailer from 'nodemailer';

export async function POST(req: NextRequest) {
  const { name, tel, age } = await req.json();

  const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
      user: process.env.GMAIL_USER,
      pass: process.env.GMAIL_APP_PASSWORD, 
    },
  });

  // 複数人送信のための処理：カンマ区切りを分解して配列にする
  const toAddresses = (process.env.GMAIL_TO || process.env.GMAIL_USER || '').split(',').map(s => s.trim());

  try {
    // 全員に一斉送信
    await transporter.sendMail({
      from: process.env.GMAIL_USER,
      to: toAddresses, // 配列を渡すと全員に届きます
      subject: '【採用応募】京都焼肉なおき',
      text: [
        '【採用応募通知】',
        `名前：${name}`,
        `電話：${tel}`,
        `年齢：${age}歳`,
        '',
        '折り返しご連絡ください。',
      ].join('\n'),
    });
    return NextResponse.json({ ok: true });
  } catch (err) {
    console.error(err);
    return NextResponse.json({ error: 'Mail failed' }, { status: 500 });
  }
}

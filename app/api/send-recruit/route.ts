import { NextRequest, NextResponse } from 'next/server';
import nodemailer from 'nodemailer';

export async function POST(req: NextRequest) {
  const { name, tel, age } = await req.json();

  const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
      user: process.env.GMAIL_USER,
      pass: process.env.GMAIL_APP_PASSWORD, // Googleアプリパスワード
    },
  });

  try {
    await transporter.sendMail({
      from: process.env.GMAIL_USER,
      to: process.env.GMAIL_TO ?? process.env.GMAIL_USER,
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

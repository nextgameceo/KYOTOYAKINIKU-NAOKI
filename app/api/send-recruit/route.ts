import { NextRequest, NextResponse } from 'next/server';
import nodemailer from 'nodemailer';

// ─── 型定義 ───────────────────────────────────────────────
type RecruitBody = {
  name: string;
  tel: string;
  age: string | number;
};

// ─── バリデーション ────────────────────────────────────────
function validateBody(body: Partial<RecruitBody>): string | null {
  if (!body.name?.trim()) return 'お名前が未入力です。';
  if (!body.tel?.trim()) return '電話番号が未入力です。';
  if (!/^[0-9\-+\s()]{7,15}$/.test(String(body.tel).trim()))
    return '正しい電話番号を入力してください。';
  const ageNum = Number(body.age);
  if (!body.age || isNaN(ageNum) || ageNum < 15 || ageNum > 80)
    return '年齢を正しく入力してください（15〜80歳）。';
  return null;
}

export async function POST(req: NextRequest) {
  let body: Partial<RecruitBody>;
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ error: 'リクエスト形式が不正です。' }, { status: 400 });
  }

  // バリデーション
  const validationError = validateBody(body);
  if (validationError) {
    return NextResponse.json({ error: validationError }, { status: 400 });
  }

  const { name, tel, age } = body as RecruitBody;

  // GMAIL_USER が未設定の場合は早期リターン
  if (!process.env.GMAIL_USER || !process.env.GMAIL_APP_PASSWORD) {
    console.error('Gmail認証情報が未設定です。');
    return NextResponse.json({ error: 'メール設定が未完了です。' }, { status: 500 });
  }

  const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
      user: process.env.GMAIL_USER,
      pass: process.env.GMAIL_APP_PASSWORD,
    },
  });

  // 複数人送信：カンマ区切りを分解して配列に変換
  const toAddresses = (process.env.GMAIL_TO || process.env.GMAIL_USER)
    .split(',')
    .map((s) => s.trim())
    .filter(Boolean);

  try {
    await transporter.sendMail({
      from: `"京都焼肉なおき 採用フォーム" <${process.env.GMAIL_USER}>`,
      to: toAddresses,
      subject: '【採用応募】京都焼肉なおき',
      text: [
        '【採用応募通知】',
        '',
        `名前　：${name}`,
        `電話　：${tel}`,
        `年齢　：${age}歳`,
        '',
        '折り返しご連絡ください。',
        '',
        '─────────────────────',
        '京都焼肉なおき 採用フォーム',
      ].join('\n'),
    });
    return NextResponse.json({ ok: true });
  } catch (err) {
    console.error('メール送信エラー:', err);
    return NextResponse.json({ error: 'メール送信に失敗しました。' }, { status: 500 });
  }
}

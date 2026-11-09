/**
 * POST /api/contact — Contact と Lesson のフォームの内容をメールで届けます（Vercel Function）
 *
 * Resend（https://resend.com）の API で送ります。パッケージは使いません。
 * Vercel のプロジェクト設定 → Environment Variables に次を登録してください:
 *   RESEND_API_KEY  必須。Resend で発行した API Key（re_ で始まる）
 *   CONTACT_TO      省略可。届け先（省略すると syiaviolin@gmail.com）
 *   CONTACT_FROM    省略可。差出人（省略すると Resend の試用アドレス onboarding@resend.dev。
 *                   このアドレスからは Resend に登録したメールアドレスにしか送れません。
 *                   Resend で syiaviolin.com を認証したら "SYIA Website <contact@syiaviolin.com>" などにできます）
 *
 * 受け取るもの（JSON）: name, email, subject（Contact のみ）, message, form（フォームの種類）, website（ボット除けの見えない欄）
 * 返すもの: { ok: true } または { ok: false, error: '...' }
 */

const DEFAULT_TO = 'syiaviolin@gmail.com';
const DEFAULT_FROM = 'SYIA Website <onboarding@resend.dev>';
const EMAIL = /^[^\s@<>()",;:]+@[^\s@<>()",;:]+\.[^\s@<>()",;:]+$/;

const oneLine = (v, max) => String(v == null ? '' : v).replace(/[\r\n\t]+/g, ' ').trim().slice(0, max);
const text = (v, max) => String(v == null ? '' : v).replace(/\r\n?/g, '\n').trim().slice(0, max);

function send(res, status, body) {
  res.statusCode = status;
  res.setHeader('Content-Type', 'application/json; charset=utf-8');
  res.setHeader('Cache-Control', 'no-store');
  res.end(JSON.stringify(body));
}

async function readBody(req) {
  if (req.body && typeof req.body === 'object') return req.body;
  if (typeof req.body === 'string') return JSON.parse(req.body || '{}');
  let raw = '';
  for await (const chunk of req) {
    raw += chunk;
    if (raw.length > 100000) throw new Error('too large');
  }
  return JSON.parse(raw || '{}');
}

module.exports = async function handler(req, res) {
  if (req.method !== 'POST') {
    res.setHeader('Allow', 'POST');
    return send(res, 405, { ok: false, error: 'method_not_allowed' });
  }

  // Only this site's own pages may post here
  const origin = req.headers.origin;
  if (origin) {
    let originHost = '';
    try { originHost = new URL(origin).host; } catch (e) { /* not a URL */ }
    if (originHost !== req.headers.host) return send(res, 403, { ok: false, error: 'forbidden' });
  }

  let data;
  try {
    data = await readBody(req);
  } catch (e) {
    return send(res, 400, { ok: false, error: 'bad_request' });
  }
  if (!data || typeof data !== 'object') return send(res, 400, { ok: false, error: 'bad_request' });

  // A person never fills the hidden "website" field; answer as if sent so bots do not retry
  if (oneLine(data.website, 200)) return send(res, 200, { ok: true });

  const name = oneLine(data.name, 100);
  const email = oneLine(data.email, 254);
  const subject = oneLine(data.subject, 200);
  const message = text(data.message, 10000);
  const form = oneLine(data.form, 100) || 'お問い合わせ';
  if (!name || !message || !EMAIL.test(email)) return send(res, 400, { ok: false, error: 'invalid' });

  const apiKey = process.env.RESEND_API_KEY;
  if (!apiKey) {
    console.error('contact: RESEND_API_KEY is not set');
    return send(res, 500, { ok: false, error: 'not_configured' });
  }

  const sentAt = new Date().toLocaleString('ja-JP', { timeZone: 'Asia/Tokyo' });
  const lines = [
    'syiaviolin.com のフォームからメッセージが届きました。',
    'このメールに返信すると、送り主（' + email + '）に届きます。',
    '',
    'フォーム：' + form,
    'お名前：' + name,
    'メール：' + email
  ];
  if (subject) lines.push('件名：' + subject);
  lines.push('受信日時：' + sentAt, '', '―――――――――――――――', '', message, '');

  let result;
  try {
    result = await fetch('https://api.resend.com/emails', {
      method: 'POST',
      headers: { Authorization: 'Bearer ' + apiKey, 'Content-Type': 'application/json' },
      body: JSON.stringify({
        from: process.env.CONTACT_FROM || DEFAULT_FROM,
        to: [process.env.CONTACT_TO || DEFAULT_TO],
        reply_to: email,
        subject: '【SYIA HP】' + form + (subject ? '：' + subject : '') + '（' + name + ' 様）',
        text: lines.join('\n')
      }),
      signal: AbortSignal.timeout(10000)
    });
  } catch (e) {
    console.error('contact: could not reach Resend', e);
    return send(res, 502, { ok: false, error: 'send_failed' });
  }
  if (!result.ok) {
    console.error('contact: Resend answered', result.status, await result.text().catch(() => ''));
    return send(res, 502, { ok: false, error: 'send_failed' });
  }
  return send(res, 200, { ok: true });
};

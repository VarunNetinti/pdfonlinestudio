import { NextRequest, NextResponse } from 'next/server';

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

/**
 * Contact form email handler.
 *
 * Uses Nodemailer with Gmail SMTP.
 *
 * SETUP REQUIRED — set these environment variables before deploying:
 *   GMAIL_USER     = theory.civil@gmail.com
 *   GMAIL_APP_PASS = your-16-char-app-password  (NOT your regular Gmail password)
 *
 * How to get a Gmail App Password:
 *   1. Go to myaccount.google.com → Security
 *   2. Enable 2-Step Verification (required)
 *   3. Go to Security → App Passwords
 *   4. Create a new app password → select "Mail" and "Other (Custom name)"
 *   5. Copy the 16-character password shown — paste it as GMAIL_APP_PASS
 *
 * In development, create a .env.local file:
 *   GMAIL_USER=theory.civil@gmail.com
 *   GMAIL_APP_PASS=xxxx xxxx xxxx xxxx
 *
 * On Vercel / production: add these in your deployment environment variables.
 */

interface ContactBody {
  name:    string;
  email:   string;
  topic:   string;
  message: string;
}

export async function POST(request: NextRequest) {
  try {
    const body: ContactBody = await request.json();
    const { name, email, topic, message } = body;

    // Basic validation
    if (!name?.trim() || !email?.trim() || !message?.trim()) {
      return NextResponse.json({ error: 'Name, email, and message are required.' }, { status: 400 });
    }
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      return NextResponse.json({ error: 'Invalid email address.' }, { status: 400 });
    }
    if (message.trim().length < 10) {
      return NextResponse.json({ error: 'Message is too short.' }, { status: 400 });
    }

    const gmailUser    = process.env.GMAIL_USER;
    const gmailAppPass = process.env.GMAIL_APP_PASS;

    // If env vars not set, log and return success in dev (avoid breaking the form)
    if (!gmailUser || !gmailAppPass) {
      console.warn('[contact] GMAIL_USER or GMAIL_APP_PASS not set — email not sent in this environment.');
      console.info('[contact] Would have sent:', { name, email, topic, message });
      return NextResponse.json({ ok: true, dev: true });
    }

    const nodemailer = await import('nodemailer');

    const transporter = nodemailer.createTransport({
      service: 'gmail',
      auth: {
        user: gmailUser,
        pass: gmailAppPass,
      },
    });

    const now = new Date().toLocaleString('en-IN', { timeZone: 'Asia/Kolkata' });

    // Email to site owner (you)
    await transporter.sendMail({
      from:    `"PdfOnlineStudio Contact" <${gmailUser}>`,
      to:      gmailUser,           // theory.civil@gmail.com
      replyTo: email,               // reply goes directly to the user
      subject: `[PdfOnlineStudio] ${topic || 'New message'} from ${name}`,
      html: `
<!DOCTYPE html>
<html>
<head><meta charset="utf-8"><style>
  body { font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif; color: #1c1a18; margin: 0; padding: 0; background: #f7f5f0; }
  .card { background: #fff; border-radius: 16px; padding: 32px; max-width: 600px; margin: 24px auto; border: 1px solid #e8e4df; }
  .header { background: #1c1a18; border-radius: 12px 12px 0 0; padding: 24px 32px; margin: -32px -32px 28px; }
  .header h1 { color: #fff; margin: 0; font-size: 20px; font-weight: 600; }
  .header p { color: #9ca3af; margin: 4px 0 0; font-size: 13px; }
  .field { margin-bottom: 20px; }
  .label { font-size: 11px; font-weight: 700; text-transform: uppercase; letter-spacing: 0.08em; color: #7d6f5e; margin-bottom: 6px; }
  .value { font-size: 15px; color: #1c1a18; line-height: 1.6; background: #f7f5f0; border-radius: 8px; padding: 12px 14px; }
  .message { white-space: pre-wrap; }
  .footer { margin-top: 28px; padding-top: 20px; border-top: 1px solid #e8e4df; font-size: 12px; color: #9ca3af; text-align: center; }
  .badge { display: inline-block; background: #fef3c7; color: #92400e; border-radius: 20px; padding: 3px 10px; font-size: 11px; font-weight: 600; margin-left: 8px; }
</style></head>
<body>
<div class="card">
  <div class="header">
    <h1>📬 New Contact Message <span class="badge">${topic || 'General'}</span></h1>
    <p>Received ${now} IST · PdfOnlineStudio</p>
  </div>

  <div class="field">
    <div class="label">Name</div>
    <div class="value">${name}</div>
  </div>

  <div class="field">
    <div class="label">Email</div>
    <div class="value"><a href="mailto:${email}" style="color:#d97706;text-decoration:none;">${email}</a></div>
  </div>

  <div class="field">
    <div class="label">Topic</div>
    <div class="value">${topic || '—'}</div>
  </div>

  <div class="field">
    <div class="label">Message</div>
    <div class="value message">${message.replace(/</g,'&lt;').replace(/>/g,'&gt;')}</div>
  </div>

  <div class="footer">
    Hit Reply to respond directly to ${name} · PdfOnlineStudio Contact Form
  </div>
</div>
</body>
</html>`,
      text: `New contact message\n\nName: ${name}\nEmail: ${email}\nTopic: ${topic}\nReceived: ${now} IST\n\nMessage:\n${message}`,
    });

    // Auto-reply to the sender
    await transporter.sendMail({
      from:    `"PdfOnlineStudio" <${gmailUser}>`,
      to:      email,
      subject: `We received your message — PdfOnlineStudio`,
      html: `
<!DOCTYPE html>
<html>
<head><meta charset="utf-8"><style>
  body { font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif; color: #1c1a18; margin: 0; padding: 0; background: #f7f5f0; }
  .card { background: #fff; border-radius: 16px; padding: 32px; max-width: 560px; margin: 24px auto; border: 1px solid #e8e4df; }
  .logo { display: flex; align-items: center; gap: 10px; margin-bottom: 28px; }
  .logo-icon { width: 36px; height: 36px; background: #f59e0b; border-radius: 10px; display: flex; align-items: center; justify-content: center; font-weight: 700; color: #1c1a18; font-size: 16px; }
  .logo-name { font-weight: 700; font-size: 16px; }
  h2 { font-size: 22px; margin: 0 0 12px; }
  p { line-height: 1.7; color: #44403c; margin: 0 0 16px; }
  .snippet { background: #f7f5f0; border-left: 3px solid #f59e0b; padding: 12px 16px; border-radius: 0 8px 8px 0; font-size: 14px; color: #57534e; margin: 20px 0; font-style: italic; }
  .footer { margin-top: 28px; padding-top: 20px; border-top: 1px solid #e8e4df; font-size: 12px; color: #9ca3af; text-align: center; }
</style></head>
<body>
<div class="card">
  <div class="logo">
    <div class="logo-icon">P</div>
    <div class="logo-name">PdfOnlineStudio</div>
  </div>

  <h2>Thanks, ${name}! 👋</h2>
  <p>We've received your message and will get back to you at <strong>${email}</strong> within 24–48 hours.</p>

  <div class="snippet">${message.slice(0, 200).replace(/</g,'&lt;').replace(/>/g,'&gt;')}${message.length > 200 ? '…' : ''}</div>

  <p>While you wait, feel free to explore our <a href="https://pdfonlinestudio.com/tools" style="color:#d97706;">27 free PDF tools</a>.</p>

  <div class="footer">
    PdfOnlineStudio · <a href="https://pdfonlinestudio.com" style="color:#d97706;">pdfonlinestudio.com</a><br>
    Please do not reply to this email — it is automated. We'll reply from our mailbox directly.
  </div>
</div>
</body>
</html>`,
      text: `Hi ${name},\n\nThanks for reaching out! We've received your message and will respond within 24–48 hours.\n\nYour message:\n${message}\n\n— PdfOnlineStudio Team\nhttps://pdfonlinestudio.com`,
    });

    return NextResponse.json({ ok: true });
  } catch (err) {
    console.error('[contact/api]', err);
    return NextResponse.json(
      { error: 'Failed to send message. Please try again or email us directly.' },
      { status: 500 }
    );
  }
}

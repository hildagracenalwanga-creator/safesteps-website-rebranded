const nodemailer = require('nodemailer');

const { SMTP_HOST, SMTP_PORT, SMTP_SECURE, SMTP_USER, SMTP_PASS, NOTIFY_EMAIL } = process.env;

const isConfigured = Boolean(SMTP_HOST && SMTP_USER && SMTP_PASS);

let transporter = null;
if (isConfigured) {
  transporter = nodemailer.createTransport({
    host: SMTP_HOST,
    port: Number(SMTP_PORT) || 587,
    secure: SMTP_SECURE === 'true',
    auth: { user: SMTP_USER, pass: SMTP_PASS },
  });
}

/**
 * Sends a notification email when SMTP is configured. If it isn't
 * configured yet (no .env set up), this quietly does nothing and lets
 * the caller carry on — submissions are still safely saved to /data
 * by utils/store.js, so nothing is ever lost while email is pending
 * setup.
 */
async function sendNotification({ subject, text, html, replyTo }) {
  if (!isConfigured || !transporter) {
    console.log(`[mailer] SMTP not configured yet — skipped email: "${subject}"`);
    return { sent: false, reason: 'smtp-not-configured' };
  }

  const to = NOTIFY_EMAIL || SMTP_USER;

  try {
    await transporter.sendMail({
      from: `"Safe Steps Website" <${SMTP_USER}>`,
      to,
      replyTo,
      subject,
      text,
      html,
    });
    return { sent: true };
  } catch (err) {
    console.error('[mailer] Failed to send notification:', err.message);
    return { sent: false, reason: err.message };
  }
}

module.exports = { sendNotification, isConfigured };

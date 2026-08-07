const express = require('express');
const router = express.Router();
const { appendEntry } = require('../utils/store');
const { sendNotification } = require('../utils/mailer');

/**
 * POST /api/contact
 * Handles the main Contact form AND every "Register Interest" /
 * "Inquire Now" mini-form across the site (Child Safeguarding,
 * Parent Coaching, Nurture Orbit, etc.) — they all send the same
 * shape of data, with an optional "topic" field identifying which
 * page/programme the message came from.
 */
router.post('/', async (req, res) => {
  const { name, email, phone, organization, message, topic } = req.body || {};

  if (!name || !email || !message) {
    return res.status(400).json({
      success: false,
      message: 'Please fill in your name, email, and message before sending.',
    });
  }

  const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!emailPattern.test(email)) {
    return res.status(400).json({
      success: false,
      message: 'That email address doesn\'t look right — please double-check it.',
    });
  }

  const record = appendEntry('contact-submissions', {
    name,
    email,
    phone: phone || '',
    organization: organization || '',
    topic: topic || 'General Inquiry',
    message,
  });

  const emailResult = await sendNotification({
    subject: `New website inquiry: ${record.topic} — ${name}`,
    replyTo: email,
    text: [
      `Topic: ${record.topic}`,
      `Name: ${name}`,
      `Email: ${email}`,
      `Phone: ${phone || 'Not provided'}`,
      `Organization: ${organization || 'Not provided'}`,
      '',
      'Message:',
      message,
    ].join('\n'),
    html: `
      <h2>New website inquiry — ${record.topic}</h2>
      <p><strong>Name:</strong> ${name}</p>
      <p><strong>Email:</strong> ${email}</p>
      <p><strong>Phone:</strong> ${phone || 'Not provided'}</p>
      <p><strong>Organization:</strong> ${organization || 'Not provided'}</p>
      <p><strong>Message:</strong></p>
      <p>${String(message).replace(/\n/g, '<br>')}</p>
    `,
  });

  res.json({
    success: true,
    message: 'Thank you for reaching out! We have received your message and will get back to you shortly.',
    emailed: emailResult.sent,
  });
});

/** GET /api/contact — lists saved submissions (simple admin/debug view). */
router.get('/', (req, res) => {
  const { readAll } = require('../utils/store');
  res.json({ success: true, submissions: readAll('contact-submissions') });
});

module.exports = router;

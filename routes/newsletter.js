const express = require('express');
const router = express.Router();
const { readAll, appendEntry } = require('../utils/store');
const { sendNotification } = require('../utils/mailer');

/** POST /api/newsletter — subscribe an email address. */
router.post('/', async (req, res) => {
  const { email } = req.body || {};
  const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

  if (!email || !emailPattern.test(email)) {
    return res.status(400).json({
      success: false,
      message: 'Please enter a valid email address.',
    });
  }

  const existing = readAll('newsletter-subscribers');
  const alreadySubscribed = existing.some(
    (sub) => sub.email.toLowerCase() === email.toLowerCase()
  );

  if (alreadySubscribed) {
    return res.json({
      success: true,
      message: 'You are already on our newsletter list — thank you for staying connected!',
    });
  }

  appendEntry('newsletter-subscribers', { email });

  await sendNotification({
    subject: 'New newsletter subscriber',
    text: `New subscriber: ${email}`,
    html: `<p>New newsletter subscriber: <strong>${email}</strong></p>`,
  });

  res.json({
    success: true,
    message: 'Thank you for subscribing! You will start receiving our updates soon.',
  });
});

/** GET /api/newsletter — lists subscribers (simple admin/debug view). */
router.get('/', (req, res) => {
  res.json({ success: true, subscribers: readAll('newsletter-subscribers') });
});

module.exports = router;

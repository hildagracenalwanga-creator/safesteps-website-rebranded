/**
 * SAFE STEPS TRAINING SERVICES — backend foundation.
 *
 * What this does right now:
 *   - Serves the website itself (so forms can call relative /api/...
 *     URLs both locally and once deployed — no separate hosting needed).
 *   - Receives the Contact form, every "Register Interest" mini-form,
 *     and the Newsletter form, and safely saves each submission to
 *     /data/*.json so nothing is ever lost.
 *   - Emails you a notification for each submission IF you've filled in
 *     the SMTP settings in .env (copy .env.example to .env to set this
 *     up). Until then, submissions are still saved — you just won't get
 *     an email yet.
 *
 * To run locally:
 *   1. npm install
 *   2. cp .env.example .env      (then fill in real values later)
 *   3. npm start
 *   4. Visit http://localhost:5000
 *
 * Where this is headed next (not built yet, left as clear next steps):
 *   - /api/auth        member portal login/registration
 *   - /api/orders       shop checkout + order tracking
 *   - /api/resources    gated downloads from the Resource Hub
 */
const path = require('path');
const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;
const ALLOWED_ORIGINS = process.env.ALLOWED_ORIGINS || '*';

app.use(
  cors({
    origin: ALLOWED_ORIGINS === '*' ? true : ALLOWED_ORIGINS.split(',').map((o) => o.trim()),
  })
);
app.use(express.json());

// Serve the website itself from this same server, so the frontend's
// fetch('/api/...') calls work out of the box once deployed.
app.use(express.static(__dirname));

// --- API routes ------------------------------------------------------
app.use('/api/contact', require('./routes/contact'));
app.use('/api/newsletter', require('./routes/newsletter'));

app.get('/api/health', (req, res) => {
  res.json({ status: 'ok', message: 'Safe Steps API is running' });
});

// Friendly 404 for any other /api path (keeps the door open for
// /api/auth, /api/orders, /api/resources as they're built later).
app.use('/api', (req, res) => {
  res.status(404).json({ success: false, message: 'Not implemented yet.' });
});

app.listen(PORT, () => {
  console.log(`Safe Steps server running on port ${PORT}`);
  console.log(`  Website:  http://localhost:${PORT}`);
  console.log(`  Health:   http://localhost:${PORT}/api/health`);
});

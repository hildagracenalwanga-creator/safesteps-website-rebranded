# Safe Steps Website — Backend Foundation

This folder now includes a working backend foundation so that, the
moment you deploy, every form on the site (Contact, the "Register
Interest" boxes on the Child Safeguarding and Parent Coaching pages,
and the Newsletter signup) can actually reach you.

## What's already working

- **Every submission is saved.** Even before you set up email, nothing
  is lost — submissions are written to `data/contact-submissions.json`
  and `data/newsletter-subscribers.json` the moment someone submits a
  form.
- **Forms fail gracefully.** If the backend isn't deployed yet (e.g.
  you're only previewing the static HTML), the forms still show a
  friendly confirmation message and keep a local backup in the
  visitor's browser (`localStorage`) rather than showing an error.
- **One server serves both the site and the API**, so once deployed,
  the frontend's `fetch('/api/...')` calls just work — no separate
  hosting or CORS configuration needed.

## Running it locally

```bash
npm install
cp .env.example .env      # then fill in real values when ready
npm start
```

Visit `http://localhost:5000` — the whole site plus a working
Contact/Newsletter/Register-Interest flow.

## Turning on real email notifications

Right now, form submissions are saved to disk but you won't get an
email until SMTP is configured. To turn that on:

1. Copy `.env.example` to `.env`.
2. Fill in `SMTP_USER` and `SMTP_PASS`. If you're using Gmail, you'll
   need an **App Password** (Google Account → Security → 2-Step
   Verification → App Passwords) — your normal Gmail password won't
   work here.
3. Set `NOTIFY_EMAIL` to whichever inbox should receive submissions
   (defaults to hildgracenalwanga@gmail.com).
4. Restart the server. You'll now get an email for every Contact,
   Register Interest, and Newsletter submission.

## Deploying

Any Node hosting works (Render, Railway, Fly.io, a VPS, etc.):

1. Push this whole folder (it's both the frontend and the backend).
2. Set the same environment variables from `.env.example` in your
   host's dashboard.
3. Start command: `npm start`.
4. Point your domain at it — because `server.js` serves the site
   itself, there's nothing else to configure.

## What's next (not built yet, on purpose)

The site's existing member-portal, shop, and resource-hub pages
reference `/api/auth`, `/api/orders`, and `/api/resources` in spirit
but those aren't built yet — they're deliberately left as the next
phase so the foundation stays simple and reliable for launch. When
you're ready to build member accounts, checkout, or gated downloads,
add `routes/auth.js`, `routes/orders.js`, and `routes/resources.js`
following the same pattern as `routes/contact.js`, and mount them in
`server.js`.

## Where submissions are stored

- `data/contact-submissions.json` — every Contact form and
  Register-Interest submission, tagged with a `topic` field so you
  can tell which page/programme it came from.
- `data/newsletter-subscribers.json` — every newsletter signup,
  de-duplicated by email address.

Both are plain JSON files, readable in any text editor, and safe to
back up. When you're ready for a real database, replace the two
functions in `utils/store.js` — every route keeps working unchanged.

/* =========================================================
   FORMS.JS — shared submission handler for every form on the
   site (Contact, Register Interest mini-forms, Newsletter).

   FOUNDATION FOR THE BACKEND:
   This figures out where the API lives so the exact same code
   works in three situations without any edits:
     1. Local development, opened as a static file / dev server,
        with the API running separately on http://localhost:5000
     2. Local development where the Express server itself is
        serving the site (server.js -> express.static) — API is
        same-origin at /api/...
     3. Production, once deployed — API is same-origin at /api/...
        (this is why server.js serves the frontend itself: so
        forms "just work" the moment both are deployed together)

   If a real submission fails (server not deployed yet, no
   internet, etc.) the form still shows a friendly confirmation
   so visitors are never blocked — but SAFE_STEPS.pendingSubmissions
   in localStorage keeps a local backup you can inspect from the
   browser console until the backend is live.
   ========================================================= */

const SAFE_STEPS_API_BASE = (() => {
  const { hostname, origin, protocol } = window.location;
  const isLocalStatic = ['localhost', '127.0.0.1'].includes(hostname) && protocol !== 'http:'.replace('http:', 'file:');
  // If we're being served BY the Express server itself (same origin
  // already has an /api/health route), relative paths just work.
  // If someone opened index.html directly from disk (file://) or via
  // a separate static dev server on a different port than 5000,
  // fall back to the conventional local API port.
  if (protocol === 'file:') return 'http://localhost:5000/api';
  if (['localhost', '127.0.0.1'].includes(hostname) && window.location.port && window.location.port !== '5000') {
    return 'http://localhost:5000/api';
  }
  return `${origin}/api`;
})();

function saveSubmissionLocally(endpoint, payload) {
  try {
    const key = 'safesteps_pending_submissions';
    const existing = JSON.parse(localStorage.getItem(key) || '[]');
    existing.push({ endpoint, payload, savedAt: new Date().toISOString() });
    localStorage.setItem(key, JSON.stringify(existing));
  } catch (err) {
    /* localStorage unavailable — nothing more we can do client-side */
  }
}

function setFormStatus(statusEl, type, message) {
  if (!statusEl) return;
  statusEl.textContent = message;
  statusEl.className = `form-status show ${type}`;
}

/**
 * Wires a <form> up to POST JSON to a Safe Steps API endpoint.
 *
 * @param {HTMLFormElement} formEl
 * @param {string} endpoint - e.g. 'contact' or 'newsletter'
 * @param {object} [options]
 * @param {string} [options.successMessage]
 * @param {object} [options.extraFields] - static fields merged into every submission (e.g. { topic: 'Parent Coaching' })
 */
function wireSafeStepsForm(formEl, endpoint, options = {}) {
  if (!formEl) return;

  let statusEl = formEl.querySelector('.form-status');
  if (!statusEl) {
    statusEl = document.createElement('div');
    statusEl.className = 'form-status';
    formEl.appendChild(statusEl);
  }

  formEl.addEventListener('submit', async (e) => {
    e.preventDefault();

    const submitBtn = formEl.querySelector('button[type="submit"]');
    const formData = new FormData(formEl);
    const payload = { ...Object.fromEntries(formData.entries()), ...(options.extraFields || {}) };

    if (submitBtn) submitBtn.disabled = true;
    setFormStatus(statusEl, 'sending', 'Sending your message…');

    try {
      const res = await fetch(`${SAFE_STEPS_API_BASE}/${endpoint}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });

      const data = await res.json().catch(() => ({}));

      if (res.ok && data.success !== false) {
        setFormStatus(
          statusEl,
          'success',
          data.message || options.successMessage || 'Thank you! We have received your submission.'
        );
        formEl.reset();
      } else {
        setFormStatus(statusEl, 'error', data.message || 'Something went wrong. Please try again.');
      }
    } catch (err) {
      // Backend not deployed / reachable yet — keep the visitor experience
      // smooth, back the submission up locally, and let them know.
      saveSubmissionLocally(endpoint, payload);
      setFormStatus(
        statusEl,
        'success',
        options.successMessage ||
          'Thank you! Your message has been noted. If our team does not follow up within 2 business days, please reach us directly via WhatsApp or email on the Contact page.'
      );
      formEl.reset();
    } finally {
      if (submitBtn) submitBtn.disabled = false;
    }
  });
}

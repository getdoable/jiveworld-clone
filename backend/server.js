/*
 * Jiveworld clone — Express backend
 * --------------------------------
 * Provides:
 *   POST /api/login        validates hardcoded credentials, returns a fake JWT
 *   GET  /api/me           returns the fake user when a valid token is supplied
 *   GET  /media/*.mp3      returns a 200 with Content-Type: audio/mpeg (placeholder audio)
 *
 * Everything is hardcoded and deterministic — no randomness — so the response
 * surface is stable for crawler regression testing.
 */

const express = require('express');
const cors = require('cors');

const app = express();
const PORT = process.env.PORT || 3001;

app.use(cors());
app.use(express.json());

// --- In-memory account state ----------------------------------------------
// Mutable, resets to these defaults on every server restart. Keeping it in
// memory (not on disk) means a fresh boot is always deterministic for the
// crawler baseline, while edits are fully functional within a running session.

// Formats a Date as "Mon DD, YYYY" (e.g. "Sep 20, 2026").
function formatDate(d) {
  const months = [
    'Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun',
    'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec',
  ];
  return `${months[d.getMonth()]} ${d.getDate()}, ${d.getFullYear()}`;
}

// Default renewal date: 30 days out from server start.
function defaultRenews() {
  const d = new Date();
  d.setHours(0, 0, 0, 0);
  d.setDate(d.getDate() + 30);
  return formatDate(d);
}

function defaultAccount() {
  return {
    name: 'Test User',
    email: 'testuser@jiveworld.com',
    password: 'password123',
    membership: {
      plan: 'Jiveworld Español',
      type: 'Monthly subscription',
      amount: 'US$12.76',
      renews: defaultRenews(),
      status: 'active', // 'active' | 'canceled'
      endsOn: null, // set to the renewal date when canceled
      payment: { brand: 'Visa', last4: '4242', exp: '08/27' },
    },
  };
}

let account = defaultAccount();

// Strips secrets before sending the account to the client.
function publicAccount() {
  return {
    name: account.name,
    email: account.email,
    membership: account.membership,
  };
}

/*
 * Builds a deterministic, fake JWT (header.payload.signature).
 * This is NOT a real signed token — it only needs to look like a JWT and be
 * stable across runs for the crawler. The payload is base64url-encoded JSON.
 */
function makeFakeJwt(user) {
  const header = { alg: 'HS256', typ: 'JWT' };
  // Fixed iat so the token is deterministic run-to-run.
  const payload = { sub: user.email, name: user.name, iat: 1700000000 };
  const b64 = (obj) =>
    Buffer.from(JSON.stringify(obj))
      .toString('base64')
      .replace(/\+/g, '-')
      .replace(/\//g, '_')
      .replace(/=+$/, '');
  const signature = 'jiveworld-fake-signature';
  return `${b64(header)}.${b64(payload)}.${signature}`;
}

// The currently-valid token. Reissued on each successful login; edits to
// name/email do not invalidate an existing session.
let currentToken = makeFakeJwt(account);

// True when the request carries the active session token.
function isAuthed(req) {
  const auth = req.headers.authorization || '';
  const token = auth.startsWith('Bearer ') ? auth.slice(7) : '';
  return Boolean(token) && token === currentToken;
}

// Express middleware guarding the account endpoints.
function requireAuth(req, res, next) {
  if (!isAuthed(req)) return res.status(401).json({ error: 'Unauthorized' });
  return next();
}

// --- Auth ------------------------------------------------------------------
app.post('/api/login', (req, res) => {
  const { username, password } = req.body || {};
  if (username === account.email && password === account.password) {
    currentToken = makeFakeJwt(account);
    return res.status(200).json({
      token: currentToken,
      user: { name: account.name, email: account.email },
    });
  }
  return res.status(401).json({ error: 'Invalid credentials' });
});

app.get('/api/me', (req, res) => {
  if (!isAuthed(req)) return res.status(401).json({ error: 'Unauthorized' });
  return res.status(200).json({ user: { name: account.name, email: account.email } });
});

// --- Account ---------------------------------------------------------------
app.get('/api/account', requireAuth, (req, res) => {
  return res.status(200).json(publicAccount());
});

// Update display name and/or email.
app.patch('/api/account', requireAuth, (req, res) => {
  const { name, email } = req.body || {};

  if (name !== undefined) {
    if (typeof name !== 'string' || name.trim() === '') {
      return res.status(400).json({ error: 'Name cannot be empty.' });
    }
    account.name = name.trim();
  }

  if (email !== undefined) {
    if (typeof email !== 'string' || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.trim())) {
      return res.status(400).json({ error: 'Enter a valid email address.' });
    }
    account.email = email.trim();
  }

  return res.status(200).json(publicAccount());
});

// Change password (verifies the current one).
app.post('/api/account/password', requireAuth, (req, res) => {
  const { currentPassword, newPassword } = req.body || {};
  if (currentPassword !== account.password) {
    return res.status(400).json({ error: 'Current password is incorrect.' });
  }
  if (typeof newPassword !== 'string' || newPassword.length < 6) {
    return res.status(400).json({ error: 'New password must be at least 6 characters.' });
  }
  account.password = newPassword;
  return res.status(200).json({ ok: true });
});

// Update the (fake) payment method.
app.put('/api/account/payment', requireAuth, (req, res) => {
  const { brand, last4, exp } = req.body || {};
  if (typeof last4 !== 'string' || !/^\d{4}$/.test(last4)) {
    return res.status(400).json({ error: 'Card number must end in 4 digits.' });
  }
  if (typeof exp !== 'string' || !/^\d{2}\/\d{2}$/.test(exp)) {
    return res.status(400).json({ error: 'Expiry must be in MM/YY format.' });
  }
  account.membership.payment = {
    brand: typeof brand === 'string' && brand.trim() ? brand.trim() : 'Card',
    last4,
    exp,
  };
  return res.status(200).json(account.membership);
});

// Cancel the subscription — keeps access until the renewal date.
app.post('/api/account/cancel', requireAuth, (req, res) => {
  account.membership.status = 'canceled';
  account.membership.endsOn = account.membership.renews;
  account.membership.renews = null;
  return res.status(200).json(account.membership);
});

// Reactivate a canceled subscription.
app.post('/api/account/resubscribe', requireAuth, (req, res) => {
  account.membership.status = 'active';
  account.membership.renews = account.membership.endsOn || defaultRenews();
  account.membership.endsOn = null;
  return res.status(200).json(account.membership);
});

// --- Study activity --------------------------------------------------------
// Returns the dates the user studied (local YYYY-MM-DD) plus the current
// streak. Dates are stored as day-offsets from "today" so the calendar stays
// live as the days roll over. Offset 0 = today.
const ACTIVITY_OFFSETS = [0, 2, 3, 9, 13, 40, 41, 70];

function dayKey(d) {
  return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(
    d.getDate()
  ).padStart(2, '0')}`;
}

app.get('/api/activity', requireAuth, (req, res) => {
  const today = new Date();
  today.setHours(0, 0, 0, 0);

  const activeDays = ACTIVITY_OFFSETS.map((off) => {
    const d = new Date(today);
    d.setDate(d.getDate() - off);
    return dayKey(d);
  });

  // Current streak: consecutive active days ending today.
  const set = new Set(activeDays);
  let streak = 0;
  const cursor = new Date(today);
  while (set.has(dayKey(cursor))) {
    streak += 1;
    cursor.setDate(cursor.getDate() - 1);
  }

  return res.status(200).json({ streak, activeDays });
});

// --- Placeholder audio -----------------------------------------------------
// Any /media/<slug>.mp3 request returns a tiny valid-ish MP3 payload with the
// correct content type. The crawler only cares about a 200 + audio/mpeg.
app.get(/^\/media\/.*\.mp3$/, (req, res) => {
  // A minimal silent MP3 frame header so the bytes are non-empty and plausible.
  const silentMp3 = Buffer.from([0xff, 0xfb, 0x90, 0x64, 0x00, 0x00, 0x00, 0x00]);
  res.set('Content-Type', 'audio/mpeg');
  res.set('Content-Length', String(silentMp3.length));
  res.set('Accept-Ranges', 'bytes');
  res.status(200).send(silentMp3);
});

app.get('/api/health', (_req, res) => res.status(200).json({ ok: true }));

app.listen(PORT, () => {
  // eslint-disable-next-line no-console
  console.log(`Jiveworld clone backend listening on http://localhost:${PORT}`);
});

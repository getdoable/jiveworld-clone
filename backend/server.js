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

// --- Hardcoded credentials -------------------------------------------------
const VALID_USERNAME = 'testuser@jiveworld.com';
const VALID_PASSWORD = 'password123';

const FAKE_USER = {
  name: 'Test User',
  email: VALID_USERNAME,
};

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

const FAKE_JWT = makeFakeJwt(FAKE_USER);

// --- Auth ------------------------------------------------------------------
app.post('/api/login', (req, res) => {
  const { username, password } = req.body || {};
  if (username === VALID_USERNAME && password === VALID_PASSWORD) {
    return res.status(200).json({ token: FAKE_JWT, user: FAKE_USER });
  }
  return res.status(401).json({ error: 'Invalid credentials' });
});

app.get('/api/me', (req, res) => {
  const auth = req.headers.authorization || '';
  const token = auth.startsWith('Bearer ') ? auth.slice(7) : '';
  if (token === FAKE_JWT) {
    return res.status(200).json({ user: FAKE_USER });
  }
  return res.status(401).json({ error: 'Unauthorized' });
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

app.get('/api/activity', (req, res) => {
  const auth = req.headers.authorization || '';
  const token = auth.startsWith('Bearer ') ? auth.slice(7) : '';
  if (token !== FAKE_JWT) {
    return res.status(401).json({ error: 'Unauthorized' });
  }

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

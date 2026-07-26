// Self-contained authentication store.
// Tokens are signed JWTs (HMAC-SHA256) so they work across cold starts.

import crypto from 'node:crypto';

const TOKEN_SECRET = process.env.LAMIX_AUTH_SECRET || 'lamix-skin-staff-secret-2025-do-not-share';

const STAFF_ACCOUNTS = [
  {
    email: 'admin@lamixskin.com',
    password: 'lamix2025',
    name: 'Lamix Admin',
  },
  {
    email: 'staff@lamixskin.com',
    password: 'lamix2025',
    name: 'Lamix Staff',
  },
];

function base64url(input) {
  return Buffer.from(input).toString('base64')
    .replace(/\+/g, '-').replace(/\//g, '_').replace(/=+$/, '');
}

function base64urlDecode(input) {
  const pad = input.length % 4 === 0 ? '' : '='.repeat(4 - (input.length % 4));
  return Buffer.from(input.replace(/-/g, '+').replace(/_/g, '/') + pad, 'base64').toString();
}

function hmac(data) {
  return base64url(crypto.createHmac('sha256', TOKEN_SECRET).update(data).digest());
}

function sign(payload) {
  const body = base64url(JSON.stringify(payload));
  const sig = hmac(body);
  return `${body}.${sig}`;
}

function verify(token) {
  if (!token || typeof token !== 'string') return null;
  const parts = token.split('.');
  if (parts.length !== 2) return null;
  const [body, sig] = parts;
  const expected = hmac(body);
  if (sig.length !== expected.length) return null;
  if (!crypto.timingSafeEqual(Buffer.from(sig), Buffer.from(expected))) return null;
  try {
    const payload = JSON.parse(base64urlDecode(body));
    if (!payload || !payload.exp || payload.exp < Date.now()) return null;
    return payload;
  } catch {
    return null;
  }
}

export function signIn(email, password) {
  const lowerEmail = (email || '').toLowerCase().trim();
  const account = STAFF_ACCOUNTS.find((a) => a.email === lowerEmail);
  if (!account) return { error: 'No account found with that email.' };
  if (account.password !== password) {
    return { error: 'Invalid password. Please try again.' };
  }
  const exp = Date.now() + 30 * 24 * 60 * 60 * 1000; // 30 days
  const token = sign({ email: account.email, name: account.name, exp });
  return {
    user: { id: account.email, email: account.email, user_metadata: { name: account.name } },
    session: { access_token: token, refresh_token: token, expires_in: 30 * 24 * 60 * 60 },
  };
}

export function verifyToken(token) {
  const payload = verify(token);
  if (!payload) return null;
  return { email: payload.email, name: payload.name, createdAt: payload.iat || Date.now() };
}

export function isStaffEmail(email) {
  return STAFF_ACCOUNTS.some((a) => a.email === (email || '').toLowerCase().trim());
}

export function getSession(token) {
  return verifyToken(token);
}

export function endSession(_token) {
  // Stateless - nothing to invalidate server-side.
}

export const STAFF_EMAILS = STAFF_ACCOUNTS.map((a) => a.email);
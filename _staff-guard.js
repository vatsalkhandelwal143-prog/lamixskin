import { verifyToken } from './_auth-store.js';

export function requireStaff(req, res) {
  const auth = req.headers.authorization || '';
  const token = auth.replace('Bearer ', '').trim();
  if (!token) {
    res.status(401).json({ error: 'Please sign in as staff to perform this action.' });
    return null;
  }
  const session = verifyToken(token);
  if (!session) {
    res.status(401).json({ error: 'Your session has expired. Please sign in again.' });
    return null;
  }
  return session;
}
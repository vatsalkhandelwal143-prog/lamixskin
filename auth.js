import { signIn, endSession } from './_auth-store.js';

export default async function handler(req, res) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, DELETE, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');
  if (req.method === 'OPTIONS') return res.status(204).end();

  try {
    if (req.method === 'POST') {
      const body = req.body || {};
      const action = body.action || 'signIn';

      if (action === 'signOut') {
        const token = body.token || (req.headers.authorization || '').replace('Bearer ', '').trim();
        endSession(token);
        return res.status(200).json({ ok: true });
      }

      const email = body.email;
      const password = body.password;
      if (!email || !password) {
        return res.status(400).json({ error: 'Email and password required' });
      }
      const result = signIn(email, password);
      if (result.error) return res.status(401).json({ error: result.error });
      return res.status(200).json(result);
    }

    if (req.method === 'DELETE') {
      const auth = req.headers.authorization || '';
      const token = auth.replace('Bearer ', '').trim();
      endSession(token);
      return res.status(200).json({ ok: true });
    }

    return res.status(405).json({ error: 'Method not allowed' });
  } catch (err) {
    console.error('auth error:', err);
    res.status(500).json({ error: err.message });
  }
}
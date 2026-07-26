import { verifyToken, isStaffEmail } from './_auth-store.js';

export default async function handler(req, res) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');
  if (req.method === 'OPTIONS') return res.status(204).end();

  try {
    const auth = req.headers.authorization || '';
    const token = auth.replace('Bearer ', '').trim();
    if (!token) return res.status(200).json({ staff: false });

    const session = verifyToken(token);
    if (!session) return res.status(200).json({ staff: false });

    return res.status(200).json({ staff: true, email: session.email, name: session.name });
  } catch (err) {
    return res.status(200).json({ staff: false });
  }
}
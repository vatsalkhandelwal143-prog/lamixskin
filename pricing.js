import { cors, getStore, updateStoreItem } from './_data-store.js';
import { requireStaff } from './_staff-guard.js';

export default async function handler(req, res) {
  cors(res);
  if (req.method === 'OPTIONS') return res.status(204).end();

  try {
    if (req.method === 'GET') {
      return res.status(200).json(getStore('pricing'));
    }

    if (req.method === 'PUT') {
      if (!requireStaff(req, res)) return;
      const row = req.body || {};
      if (!row.id) return res.status(400).json({ error: 'id required' });
      const updated = updateStoreItem('pricing', row.id, row);
      if (!updated) return res.status(404).json({ error: 'Not found' });
      return res.status(200).json(updated);
    }

    return res.status(405).json({ error: 'Method not allowed' });
  } catch (err) {
    console.error('pricing error:', err);
    res.status(500).json({ error: err.message });
  }
}
import { cors, getStore, setStore, updateStoreItem } from './_data-store.js';

const DEFAULTS = [
  { id: 1, size: '14.6', glossy_price: 300, matte_price: 400 },
  { id: 2, size: '15.6', glossy_price: 300, matte_price: 400 },
  { id: 3, size: '17.6', glossy_price: 650, matte_price: 650 },
  { id: 4, size: '14', glossy_price: 500, matte_price: 700 },
  { id: 5, size: '16', glossy_price: 500, matte_price: 700 },
  { id: 6, size: '16', glossy_price: 500, matte_price: 700 },
  { id: 7, size: '16', glossy_price: 500, matte_price: 700 },
];

export default async function handler(req, res) {
  cors(res);
  if (req.method === 'OPTIONS') return res.status(204).end();

  try {
    if (req.method === 'GET') {
      let data = getStore('screen_guard_sizes');
      if (!data || !data.length) {
        data = DEFAULTS;
        setStore('screen_guard_sizes', data);
      }
      return res.status(200).json(data);
    }

    if (req.method === 'PUT') {
      const row = req.body || {};
      if (!row.id) return res.status(400).json({ error: 'id required' });
      const updated = updateStoreItem('screen_guard_sizes', row.id, row);
      if (!updated) return res.status(404).json({ error: 'Not found' });
      return res.status(200).json(updated);
    }

    return res.status(405).json({ error: 'Method not allowed' });
  } catch (err) {
    console.error('screen-guard-sizes error:', err);
    res.status(500).json({ error: err.message });
  }
}
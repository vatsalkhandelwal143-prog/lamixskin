import { cors, getStore, setStore } from './_data-store.js';

const DEFAULTS = {
  id: 'main',
  macbook_price: 650,
  updated_at: new Date().toISOString(),
};

export default async function handler(req, res) {
  cors(res);
  if (req.method === 'OPTIONS') return res.status(204).end();

  try {
    if (req.method === 'GET') {
      let data = getStore('screen_guard_meta');
      if (!data) {
        data = DEFAULTS;
        setStore('screen_guard_meta', data);
      }
      return res.status(200).json(data);
    }

    if (req.method === 'PUT') {
      const body = req.body || {};
      const current = getStore('screen_guard_meta') || DEFAULTS;
      const updated = {
        ...current,
        ...body,
        id: 'main',
        updated_at: new Date().toISOString(),
      };
      setStore('screen_guard_meta', updated);
      return res.status(200).json(updated);
    }

    return res.status(405).json({ error: 'Method not allowed' });
  } catch (err) {
    console.error('screen-guard-meta error:', err);
    res.status(500).json({ error: err.message });
  }
}
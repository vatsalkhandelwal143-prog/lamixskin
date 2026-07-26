import { cors, getStore, setStore } from './_data-store.js';

export default async function handler(req, res) {
  cors(res);
  if (req.method === 'OPTIONS') return res.status(204).end();

  try {
    if (req.method === 'GET') {
      const data = getStore('reviews');
      try {
        const mod = await import('./db-client.js');
        const supabase = mod.default || mod;
        supabase.from('reviews').select('*').order('id', { ascending: true })
          .then(({ data: remote, error }) => {
            if (!error && Array.isArray(remote) && remote.length) setStore('reviews', remote);
          }).catch(() => {});
      } catch (_) { /* keep local */ }
      return res.status(200).json(data);
    }
    return res.status(405).json({ error: 'Method not allowed' });
  } catch (err) {
    console.error('reviews error:', err);
    res.status(500).json({ error: err.message });
  }
}
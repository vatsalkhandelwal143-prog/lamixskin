import { cors, handleOptions, getStore, setStore } from './_data-store.js';

export default async function handler(req, res) {
  cors(res);
  if (req.method === 'OPTIONS') return res.status(204).end();

  try {
    if (req.method === 'GET') {
      // Always return in-memory data first — instant response, never blocks.
      const data = getStore('categories');
      // Best-effort sync from Supabase in the background (no await)
      try {
        const mod = await import('./db-client.js');
        const supabase = mod.default || mod;
        supabase.from('categories').select('*').order('sort_order', { ascending: true })
          .then(({ data: remote, error }) => {
            if (!error && Array.isArray(remote) && remote.length) setStore('categories', remote);
          }).catch(() => {});
      } catch (_) { /* keep local */ }
      return res.status(200).json(data);
    }
    return res.status(405).json({ error: 'Method not allowed' });
  } catch (err) {
    console.error('categories error:', err);
    return res.status(500).json({ error: err.message });
  }
}
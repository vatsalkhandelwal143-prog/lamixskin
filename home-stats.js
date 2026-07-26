import { cors, getStore, setStore } from './_data-store.js';

export default async function handler(req, res) {
  cors(res);
  if (req.method === 'OPTIONS') return res.status(204).end();

  try {
    if (req.method === 'GET') {
      const data = getStore('home_stats');
      try {
        const mod = await import('./db-client.js');
        const supabase = mod.default || mod;
        supabase.from('home_stats').select('*').order('id', { ascending: true })
          .then(({ data: remote, error }) => {
            if (!error && Array.isArray(remote) && remote.length) setStore('home_stats', remote);
          }).catch(() => {});
      } catch (_) { /* keep local */ }
      return res.status(200).json(data);
    }

    if (req.method === 'PUT') {
      const { stats } = req.body || {};
      if (!Array.isArray(stats)) return res.status(400).json({ error: 'stats must be array' });
      const sanitized = stats.map((s, i) => ({
        id: Number(s.id) || i + 1,
        value: String(s.value || ''),
        label: String(s.label || ''),
        icon: String(s.icon || 'sparkles'),
      }));
      setStore('home_stats', sanitized);
      try {
        const mod = await import('./db-client.js');
        const supabase = mod.default || mod;
        supabase.from('home_stats').delete().neq('id', 0).then(() => {
          return supabase.from('home_stats').insert(sanitized);
        }).then(() => {}).catch(() => {});
      } catch (_) { /* keep local */ }
      return res.status(200).json(sanitized);
    }

    return res.status(405).json({ error: 'Method not allowed' });
  } catch (err) {
    console.error('home-stats error:', err);
    res.status(500).json({ error: err.message });
  }
}
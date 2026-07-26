import { cors, getStore, setStore, updateStoreItem } from './_data-store.js';

export default async function handler(req, res) {
  cors(res);
  if (req.method === 'OPTIONS') return res.status(204).end();

  try {
    if (req.method === 'GET') {
      const data = getStore('screen_guard_pricing');
      return res.status(200).json(data);
    }

    if (req.method === 'PUT') {
      const row = req.body || {};
      if (!row.id) return res.status(400).json({ error: 'id required' });
      const updated = updateStoreItem('screen_guard_pricing', row.id, row);
      if (!updated) return res.status(404).json({ error: 'Not found' });
      try {
        const mod = await import('./db-client.js');
        const supabase = mod.default || mod;
        // Best-effort write to dedicated table
        supabase.from('screen_guard_pricing').upsert(updated).then(() => {}).catch(() => {});
        // Also sync to the shared pricing table for the legacy /pricing page
        const pricingRow = {
          id: 1000 + Number(row.id),
          section: 'screen_guard',
          item_name: 'Screen Guard',
          size: row.size,
          device_label: row.device_label,
          glossy_price: row.glossy_price,
          matte_price: row.matte_price,
        };
        updateStoreItem('pricing', pricingRow.id, pricingRow);
        supabase.from('pricing').upsert(pricingRow).then(() => {}).catch(() => {});
      } catch (_) { /* keep local */ }
      return res.status(200).json(updated);
    }

    return res.status(405).json({ error: 'Method not allowed' });
  } catch (err) {
    console.error('screen-guard-pricing error:', err);
    res.status(500).json({ error: err.message });
  }
}
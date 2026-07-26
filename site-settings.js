import { cors, getStore, setStore } from './_data-store.js';
import { requireStaff } from './_staff-guard.js';

export default async function handler(req, res) {
  cors(res);
  if (req.method === 'OPTIONS') return res.status(204).end();

  try {
    if (req.method === 'GET') {
      const record = getStore('site_settings');
      const settings = record?.settings || {};
      return res.status(200).json(settings);
    }

    if (req.method === 'PUT') {
      if (!requireStaff(req, res)) return;
      const { settings } = req.body || {};
      if (!settings || typeof settings !== 'object') {
        return res.status(400).json({ error: 'Invalid settings' });
      }
      const current = getStore('site_settings');
      const updated = {
        ...current,
        settings: { ...(current.settings || {}), ...settings },
        updated_at: new Date().toISOString(),
      };
      setStore('site_settings', updated);
      return res.status(200).json(updated.settings);
    }

    return res.status(405).json({ error: 'Method not allowed' });
  } catch (err) {
    console.error('site-settings error:', err);
    res.status(500).json({ error: err.message });
  }
}
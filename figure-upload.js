import { cors, addStoreItem } from './_data-store.js';
import { requireStaff } from './_staff-guard.js';

export default async function handler(req, res) {
  cors(res);
  if (req.method === 'OPTIONS') return res.status(204).end();

  try {
    if (req.method !== 'POST') {
      return res.status(405).json({ error: 'Method not allowed' });
    }
    if (!requireStaff(req, res)) return;

    const { name, character, anime, price, height, available, fileBase64, contentType } = req.body || {};
    if (!name) return res.status(400).json({ error: 'name required' });
    const id = 'f' + Date.now();
    const image = fileBase64 ? `data:${contentType || 'image/jpeg'};base64,${fileBase64}` : '';
    const record = {
      id, name, character: character || '', anime: anime || 'Other',
      price: price || 0, height: height || '', available: available !== false, image,
    };
    addStoreItem('figures', record);
    return res.status(201).json(record);
  } catch (err) {
    console.error('figure-upload error:', err);
    res.status(500).json({ error: err.message });
  }
}
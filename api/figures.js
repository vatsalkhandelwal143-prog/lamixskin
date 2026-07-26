import { cors, getStore, addStoreItem, updateStoreItem, deleteStoreItem } from './_data-store.js';
import { requireStaff } from './_staff-guard.js';

export default async function handler(req, res) {
  cors(res);
  if (req.method === 'OPTIONS') return res.status(204).end();

  try {
    if (req.method === 'GET') {
      return res.status(200).json(getStore('figures'));
    }

    if (req.method === 'POST') {
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
    }

    if (req.method === 'PUT') {
      if (!requireStaff(req, res)) return;
      const { id, name, character, anime, price, height, available, fileBase64, contentType } = req.body || {};
      if (!id) return res.status(400).json({ error: 'id required' });
      const updates = {};
      if (name !== undefined) updates.name = name;
      if (character !== undefined) updates.character = character;
      if (anime !== undefined) updates.anime = anime;
      if (price !== undefined) updates.price = price;
      if (height !== undefined) updates.height = height;
      if (available !== undefined) updates.available = available;
      if (fileBase64) updates.image = `data:${contentType || 'image/jpeg'};base64,${fileBase64}`;
      const updated = updateStoreItem('figures', id, updates);
      if (!updated) return res.status(404).json({ error: 'Not found' });
      return res.status(200).json(updated);
    }

    if (req.method === 'DELETE') {
      if (!requireStaff(req, res)) return;
      const { id } = req.body || {};
      if (!id) return res.status(400).json({ error: 'id required' });
      const ok = deleteStoreItem('figures', id);
      if (!ok) return res.status(404).json({ error: 'Not found' });
      return res.status(200).json({ ok: true });
    }

    return res.status(405).json({ error: 'Method not allowed' });
  } catch (err) {
    console.error('figures error:', err);
    res.status(500).json({ error: err.message });
  }
}
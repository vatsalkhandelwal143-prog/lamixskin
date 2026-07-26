import { cors, updateStoreItem } from './_data-store.js';
import { requireStaff } from './_staff-guard.js';

export default async function handler(req, res) {
  cors(res);
  if (req.method === 'OPTIONS') return res.status(204).end();

  try {
    if (req.method !== 'PUT') {
      return res.status(405).json({ error: 'Method not allowed' });
    }
    if (!requireStaff(req, res)) return;
    const { id, source, caption, fileBase64, contentType } = req.body || {};
    if (!id) return res.status(400).json({ error: 'id required' });
    if (source === 'legacy') {
      return res.status(200).json({ id, source, caption });
    }
    const updates = {};
    if (caption !== undefined) updates.caption = caption;
    if (fileBase64) updates.image = `data:${contentType || 'image/jpeg'};base64,${fileBase64}`;
    const updated = updateStoreItem('gallery_photos', id, updates);
    if (!updated) return res.status(404).json({ error: 'Not found' });
    return res.status(200).json(updated);
  } catch (err) {
    console.error('home-gallery-manage error:', err);
    res.status(500).json({ error: err.message });
  }
}
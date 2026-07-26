import { cors, updateStoreItem, deleteStoreItem } from './_data-store.js';
import { requireStaff } from './_staff-guard.js';

export default async function handler(req, res) {
  cors(res);
  if (req.method === 'OPTIONS') return res.status(204).end();

  try {
    if (!requireStaff(req, res)) return;
    const { id, deviceType, finishType, placement, caption, fileBase64, contentType } = req.body || {};
    if (!id) return res.status(400).json({ error: 'id required' });

    if (req.method === 'PUT') {
      const updates = {};
      if (deviceType) updates.device_type = deviceType;
      if (finishType) updates.finish_type = finishType;
      if (placement) updates.placement = placement;
      if (caption !== undefined) updates.caption = caption;
      if (fileBase64) updates.image = `data:${contentType || 'image/jpeg'};base64,${fileBase64}`;
      const updated = updateStoreItem('gallery_photos', id, updates);
      if (!updated) return res.status(404).json({ error: 'Not found' });
      return res.status(200).json(updated);
    }

    if (req.method === 'DELETE') {
      const ok = deleteStoreItem('gallery_photos', id);
      if (!ok) return res.status(404).json({ error: 'Not found' });
      return res.status(200).json({ ok: true });
    }

    return res.status(405).json({ error: 'Method not allowed' });
  } catch (err) {
    console.error('gallery-manage error:', err);
    res.status(500).json({ error: err.message });
  }
}
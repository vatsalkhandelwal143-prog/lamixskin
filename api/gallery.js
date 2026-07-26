import { cors, getStore, addStoreItem, updateStoreItem, deleteStoreItem } from './_data-store.js';
import { requireStaff } from './_staff-guard.js';

export default async function handler(req, res) {
  cors(res);
  if (req.method === 'OPTIONS') return res.status(204).end();

  try {
    if (req.method === 'GET') {
      const limit = parseInt(req.query?.limit || '0', 10);
      const all = getStore('gallery_photos');
      const data = limit > 0 ? all.slice(0, limit) : all;
      return res.status(200).json(data);
    }

    if (req.method === 'POST') {
      if (!requireStaff(req, res)) return;
      const { deviceType, finishType, placement, caption, photos } = req.body || {};
      const id = 'u' + Date.now();
      const firstPhoto = Array.isArray(photos) && photos[0];
      const image = firstPhoto?.base64
        ? `data:${firstPhoto.contentType || 'image/jpeg'};base64,${firstPhoto.base64}`
        : '';
      const record = {
        id,
        image,
        caption: caption || '',
        device_type: deviceType || 'Laptop',
        finish_type: finishType || 'Normal',
        placement: placement || 'Top',
        source: 'upload',
        uploaded_at: new Date().toISOString(),
      };
      addStoreItem('gallery_photos', record);
      return res.status(201).json(record);
    }

    if (req.method === 'PUT') {
      if (!requireStaff(req, res)) return;
      const { id } = req.body || {};
      if (!id) return res.status(400).json({ error: 'id required' });
      const updates = {};
      const body = req.body || {};
      if (body.deviceType) updates.device_type = body.deviceType;
      if (body.finishType) updates.finish_type = body.finishType;
      if (body.placement) updates.placement = body.placement;
      if (body.caption !== undefined) updates.caption = body.caption;
      if (body.fileBase64) {
        updates.image = `data:${body.contentType || 'image/jpeg'};base64,${body.fileBase64}`;
      }
      const updated = updateStoreItem('gallery_photos', id, updates);
      if (!updated) return res.status(404).json({ error: 'Not found' });
      return res.status(200).json(updated);
    }

    if (req.method === 'DELETE') {
      if (!requireStaff(req, res)) return;
      const { id } = req.body || {};
      if (!id) return res.status(400).json({ error: 'id required' });
      const ok = deleteStoreItem('gallery_photos', id);
      if (!ok) return res.status(404).json({ error: 'Not found' });
      return res.status(200).json({ ok: true });
    }

    return res.status(405).json({ error: 'Method not allowed' });
  } catch (err) {
    console.error('gallery error:', err);
    res.status(500).json({ error: err.message });
  }
}
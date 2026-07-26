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

    const { deviceType, finishType, placement, caption, photos } = req.body || {};
    if (!photos || !Array.isArray(photos) || photos.length === 0) {
      return res.status(400).json({ error: 'photos required' });
    }

    const id = 'u' + Date.now();
    const first = photos[0];
    const image = first?.base64
      ? `data:${first.contentType || 'image/jpeg'};base64,${first.base64}`
      : '';
    const record = {
      id,
      caption: caption || '',
      device_type: deviceType || 'Laptop',
      finish_type: finishType || 'Normal',
      placement: placement || 'Top',
      image,
      uploaded_at: new Date().toISOString(),
    };
    addStoreItem('gallery_photos', record);
    return res.status(201).json(record);
  } catch (err) {
    console.error('gallery-upload error:', err);
    res.status(500).json({ error: err.message });
  }
}
import { cors } from './_data-store.js';

export default async function handler(req, res) {
  cors(res);
  if (req.method === 'OPTIONS') return res.status(204).end();

  try {
    if (req.method !== 'POST') {
      return res.status(405).json({ error: 'Method not allowed' });
    }
    const { fileName, fileBase64, contentType } = req.body || {};
    if (!fileBase64) return res.status(400).json({ error: 'fileBase64 required' });
    // Always return as data URL — instant, no storage dependency.
    const dataUrl = `data:${contentType || 'image/jpeg'};base64,${fileBase64}`;
    return res.status(200).json({ url: dataUrl, path: fileName || 'upload' });
  } catch (err) {
    console.error('upload error:', err);
    res.status(500).json({ error: err.message });
  }
}
import { cors } from './_data-store.js';

const DEFAULT_ROWS = [
  { id: 'sg1', size: '14.6', glossy_price: 300, matte_price: 400, sort_order: 1 },
  { id: 'sg2', size: '15.6', glossy_price: 300, matte_price: 400, sort_order: 2 },
  { id: 'sg3', size: '17.6', glossy_price: 650, matte_price: 650, sort_order: 3 },
  { id: 'sg4', size: '14', glossy_price: 500, matte_price: 700, sort_order: 4 },
  { id: 'sg5', size: '16', glossy_price: 500, matte_price: 700, sort_order: 5 },
];

const DEFAULT_MACBOOK = { id: 'mb1', label: 'Macbook Air, Neo and Pro', glossy_price: 650, matte_price: 650 };

// In-memory store keyed by screen_guard_rows
const memory = {
  screen_guard_rows: [...DEFAULT_ROWS],
  screen_guard_macbook: { ...DEFAULT_MACBOOK },
};

function getRows() { return memory.screen_guard_rows; }
function getMacbook() { return memory.screen_guard_macbook; }
function setRows(rows) { memory.screen_guard_rows = rows; }
function setMacbook(mb) { memory.screen_guard_macbook = mb; }
function updateRow(id, updates) {
  const idx = memory.screen_guard_rows.findIndex((r) => r.id === id);
  if (idx === -1) return null;
  memory.screen_guard_rows[idx] = { ...memory.screen_guard_rows[idx], ...updates };
  return memory.screen_guard_rows[idx];
}
function addRow(record) {
  memory.screen_guard_rows.unshift(record);
  return record;
}
function deleteRow(id) {
  const idx = memory.screen_guard_rows.findIndex((r) => r.id === id);
  if (idx === -1) return false;
  memory.screen_guard_rows.splice(idx, 1);
  return true;
}

export default async function handler(req, res) {
  cors(res);
  if (req.method === 'OPTIONS') return res.status(204).end();

  try {
    if (req.method === 'GET') {
      return res.status(200).json({ rows: getRows(), macbook: getMacbook() });
    }

    if (req.method === 'POST') {
      const row = req.body || {};
      const id = 'sg' + Date.now();
      const record = {
        id,
        size: row.size || '',
        glossy_price: Number(row.glossy_price) || 0,
        matte_price: Number(row.matte_price) || 0,
        sort_order: Date.now(),
      };
      addRow(record);
      return res.status(201).json(record);
    }

    if (req.method === 'PUT') {
      const { id, ...rest } = req.body || {};
      if (!id) return res.status(400).json({ error: 'id required' });
      if (id === 'mb1' || id === 'macbook') {
        const updated = { ...getMacbook(), ...rest };
        setMacbook(updated);
        return res.status(200).json(updated);
      }
      const updated = updateRow(id, rest);
      if (!updated) return res.status(404).json({ error: 'Not found' });
      return res.status(200).json(updated);
    }

    if (req.method === 'DELETE') {
      const { id } = req.body || {};
      if (!id) return res.status(400).json({ error: 'id required' });
      const ok = deleteRow(id);
      if (!ok) return res.status(404).json({ error: 'Not found' });
      return res.status(200).json({ ok: true });
    }

    return res.status(405).json({ error: 'Method not allowed' });
  } catch (err) {
    console.error('screen-guard error:', err);
    res.status(500).json({ error: err.message });
  }
}
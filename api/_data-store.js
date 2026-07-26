// Static fallback data baked into the build — always available
// even if Supabase is paused, slow, or unreachable.

export const DEFAULT_DATA = {
  site_settings: {
    id: 'main',
    settings: {
      google_reviews_url: 'https://maps.google.com/?q=Lamix+Skin+Jagat+Farm+Greater+Noida',
      google_maps_url: 'https://maps.google.com/?q=Jagat+Farm+Greater+Noida',
      whatsapp_number: '919999999999',
      instagram_url: 'https://instagram.com',
      facebook_url: 'https://facebook.com',
      youtube_url: 'https://youtube.com',
      twitter_url: 'https://x.com',
      phone_number: '+91 99999 99999',
      email_address: 'hello@lamixskin.com',
    },
    updated_at: new Date().toISOString(),
  },
  categories: [
    { id: 1, name: 'Phone', slug: 'phone', icon: '📱', color: 'from-pink-500 to-rose-500', sort_order: 1 },
    { id: 2, name: 'Laptop', slug: 'laptop', icon: '💻', color: 'from-cyan-500 to-blue-500', sort_order: 2 },
    { id: 3, name: 'AirPods', slug: 'airpods', icon: '🎧', color: 'from-purple-500 to-violet-500', sort_order: 3 },
    { id: 4, name: 'Camera', slug: 'camera', icon: '📷', color: 'from-yellow-500 to-orange-500', sort_order: 4 },
    { id: 5, name: 'AC', slug: 'ac', icon: '❄️', color: 'from-teal-400 to-cyan-400', sort_order: 5 },
    { id: 6, name: 'Guitar', slug: 'guitar', icon: '🎸', color: 'from-emerald-500 to-teal-500', sort_order: 6 },
    { id: 7, name: 'Charger', slug: 'charger', icon: '🔌', color: 'from-orange-500 to-red-500', sort_order: 7 },
    { id: 8, name: 'Car Keys', slug: 'car-keys', icon: '🔑', color: 'from-amber-500 to-yellow-500', sort_order: 8 },
    { id: 9, name: 'Consoles', slug: 'consoles', icon: '🎮', color: 'from-indigo-500 to-blue-600', sort_order: 9 },
  ],
  screen_guard_pricing: [
    { id: 1, size: '11.6"', device_label: 'Compact Laptop / Chromebook', glossy_price: 299, matte_price: 349 },
    { id: 2, size: '12.5"', device_label: 'Compact Laptop', glossy_price: 349, matte_price: 399 },
    { id: 3, size: '13.3"', device_label: 'Standard Laptop / MacBook Air', glossy_price: 399, matte_price: 449 },
    { id: 4, size: '13.3"', device_label: 'MacBook Pro 13', glossy_price: 449, matte_price: 499 },
    { id: 5, size: '14"', device_label: 'Standard Laptop', glossy_price: 449, matte_price: 499 },
    { id: 6, size: '14"', device_label: 'MacBook Pro 14', glossy_price: 499, matte_price: 549 },
    { id: 7, size: '15"', device_label: 'Standard Laptop', glossy_price: 479, matte_price: 529 },
    { id: 8, size: '15.6"', device_label: 'Standard Laptop', glossy_price: 499, matte_price: 549 },
    { id: 9, size: '16"', device_label: 'Standard Laptop', glossy_price: 549, matte_price: 599 },
    { id: 10, size: '16"', device_label: 'MacBook Pro 16', glossy_price: 599, matte_price: 649 },
    { id: 11, size: '17.3"', device_label: 'Gaming Laptop', glossy_price: 649, matte_price: 699 },
    { id: 12, size: '18"', device_label: 'Large Gaming Laptop', glossy_price: 749, matte_price: 799 },
    { id: 13, size: 'iPad 10.2"', device_label: 'iPad / Tablet', glossy_price: 249, matte_price: 299 },
    { id: 14, size: 'iPad 11"', device_label: 'iPad Air / Pro', glossy_price: 299, matte_price: 349 },
    { id: 15, size: 'iPad 12.9"', device_label: 'iPad Pro 12.9', glossy_price: 399, matte_price: 449 },
    { id: 16, size: 'Switch 7"', device_label: 'Nintendo Switch Lite', glossy_price: 199, matte_price: 249 },
    { id: 17, size: 'Switch 6.2"', device_label: 'Nintendo Switch', glossy_price: 199, matte_price: 249 },
  ],
  reviews: [
    { id: 1, name: 'Aman Verma', rating: 5, comment: 'Got my MacBook wrapped with a custom anime design. Absolutely loved the finish and feel. Lamix Skin is the real deal!', product: 'MacBook Wrap' },
    { id: 2, name: 'Priya Sharma', rating: 5, comment: 'Best wrap studio in Noida. Got 2 phones done — both look stunning. Quality vinyl and clean installation. Highly recommended!', product: 'iPhone Skins' },
    { id: 3, name: 'Rohit Khanna', rating: 5, comment: 'Walked in for a screen guard and ended up doing the full PS5 wrap. The 3D finish is unreal. Will definitely come back.', product: 'PS5 Wrap' },
    { id: 4, name: 'Sneha Roy', rating: 5, comment: 'My AirPods case looks brand new! Loved the matte finish. Friendly staff, super fast service. Worth every rupee.', product: 'AirPods Wrap' },
  ],
  home_stats: [
    { id: 1, value: '5000+', label: 'Happy Clients', icon: 'users' },
    { id: 2, value: '100+', label: 'Designs', icon: 'sparkles' },
    { id: 3, value: '5★', label: 'Rated', icon: 'award' },
    { id: 4, value: '3 Yrs', label: 'In Business', icon: 'trending' },
  ],
  pricing: [
    { id: 1, section: 'laptop_wrap', item_name: '3-D Premium', top_price: 599, inside_price: 499, combo_discount: 150 },
    { id: 2, section: 'laptop_wrap', item_name: '3-D Standard', top_price: 449, inside_price: 399, combo_discount: 100 },
    { id: 3, section: 'laptop_wrap', item_name: 'Matte', top_price: 349, inside_price: 299, combo_discount: 80 },
    { id: 4, section: 'laptop_wrap', item_name: 'Glossy', top_price: 299, inside_price: 249, combo_discount: 60 },
    { id: 5, section: 'screen_guard', item_name: 'Screen Guard', size: '11.6"', device_label: 'Compact Laptop', glossy_price: 299, matte_price: 349 },
    { id: 6, section: 'screen_guard', item_name: 'Screen Guard', size: '12.5"', device_label: 'Compact Laptop', glossy_price: 349, matte_price: 399 },
    { id: 7, section: 'screen_guard', item_name: 'Screen Guard', size: '13.3"', device_label: 'Standard Laptop', glossy_price: 399, matte_price: 449 },
    { id: 8, section: 'screen_guard', item_name: 'Screen Guard', size: '14"', device_label: 'Standard Laptop', glossy_price: 449, matte_price: 499 },
    { id: 9, section: 'screen_guard', item_name: 'Screen Guard', size: '15"', device_label: 'Standard Laptop', glossy_price: 479, matte_price: 529 },
    { id: 10, section: 'screen_guard', item_name: 'Screen Guard', size: '15.6"', device_label: 'Standard Laptop', glossy_price: 499, matte_price: 549 },
    { id: 11, section: 'screen_guard', item_name: 'Screen Guard', size: '16"', device_label: 'Standard Laptop', glossy_price: 549, matte_price: 599 },
    { id: 12, section: 'screen_guard', item_name: 'Screen Guard', size: '17.3"', device_label: 'Gaming Laptop', glossy_price: 649, matte_price: 699 },
    { id: 13, section: 'screen_guard', item_name: 'Screen Guard', size: '18"', device_label: 'Large Gaming Laptop', glossy_price: 749, matte_price: 799 },
    { id: 14, section: 'macbook', item_name: 'MacBook Combo Offer', glossy_price: 699, matte_price: 799 },
  ],
  work_pricing: [
    { id: 1, device_type: 'Phone', finish_type: '3-D', display_type: 'placement', top_price: 'Rs 399', inside_price: 'Rs 349', title: '3-D Premium', offer_text: 'Combo Offer - 100 Rs Off' },
    { id: 2, device_type: 'Phone', finish_type: 'P.Matt', display_type: 'fixed', fixed_price: 299, title: 'Premium Matte', offer_text: '' },
    { id: 3, device_type: 'Phone', finish_type: 'Custom', display_type: 'placement', top_price: 'Rs 499', inside_price: 'Rs 449', title: 'Custom Design', offer_text: 'Limited time offer' },
    { id: 4, device_type: 'Laptop', finish_type: '3-D', display_type: 'placement', top_price: 'Rs 599', inside_price: 'Rs 499', title: '3-D Premium', offer_text: 'Combo Offer - 150 Rs Off' },
    { id: 5, device_type: 'Laptop', finish_type: 'P.Matt', display_type: 'fixed', fixed_price: 449, title: 'Matte Finish', offer_text: '' },
  ],
  visit_details: {
    id: 'main',
    features: [
      { id: 1, title: '100+ Premium designs in-store' },
      { id: 2, title: 'Custom wraps on demand' },
      { id: 3, title: 'Walk-ins welcome, 30-min install' },
      { id: 4, title: 'Cash, UPI & cards accepted' },
      { id: 5, title: 'Free consultation & samples' },
    ],
    materials: [
      { id: 1, icon: '🎨', title: '3M Premium Vinyl', description: 'Industry-leading vinyl for lasting wraps' },
      { id: 2, icon: '✨', title: '3-D Carbon', description: 'Realistic textured carbon fiber look' },
      { id: 3, icon: '🌫️', title: 'Premium Matte', description: 'Soft-touch anti-fingerprint finish' },
      { id: 4, icon: '💎', title: 'Crystal Glossy', description: 'Mirror-shine glossy clear finish' },
      { id: 5, icon: '🛡️', title: 'Screen Guards', description: 'Tempered glass & matte protectors' },
      { id: 6, icon: '🎯', title: 'Custom Prints', description: 'Bring your own design — we print it' },
    ],
  },
  gallery_photos: [
    { id: 'g1', image: 'https://images.unsplash.com/photo-1517694712202-14dd9538aa97?w=800&q=80', caption: 'Cyberpunk laptop wrap', device_type: 'Laptop', finish_type: '3-D', placement: 'Top', source: 'legacy', uploaded_at: '2025-01-01T00:00:00Z' },
    { id: 'g2', image: 'https://images.unsplash.com/photo-1603302576837-375b5c6ff16c?w=600&q=80', caption: 'Galaxy matte skin', device_type: 'Phone', finish_type: 'P.Matt', placement: 'Top', source: 'legacy', uploaded_at: '2025-01-01T00:00:00Z' },
    { id: 'g3', image: 'https://images.unsplash.com/photo-1586810787741-0022be8bc65e?w=600&q=80', caption: 'PS5 carbon wrap', device_type: 'Consoles', finish_type: 'Normal', placement: 'Top', source: 'legacy', uploaded_at: '2025-01-01T00:00:00Z' },
    { id: 'g4', image: 'https://images.unsplash.com/photo-1593305841991-05c297ba4575?w=600&q=80', caption: 'AirPods signature wrap', device_type: 'AirPods', finish_type: 'Custom', placement: 'Top', source: 'legacy', uploaded_at: '2025-01-01T00:00:00Z' },
    { id: 'g5', image: 'https://images.unsplash.com/photo-1525547719571-a2d4ac8945e2?w=600&q=80', caption: 'Camera body skin', device_type: 'Camera', finish_type: 'Normal', placement: 'Top', source: 'legacy', uploaded_at: '2025-01-01T00:00:00Z' },
    { id: 'g6', image: 'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=600&q=80', caption: 'Headphones wrap', device_type: 'AirPods', finish_type: 'Custom', placement: 'Top', source: 'legacy', uploaded_at: '2025-01-01T00:00:00Z' },
    { id: 'g7', image: 'https://images.unsplash.com/photo-1541807084-5c52b6b3adef?w=600&q=80', caption: 'Laptop gradient wrap', device_type: 'Laptop', finish_type: '3-D', placement: 'Top', source: 'legacy', uploaded_at: '2025-01-01T00:00:00Z' },
    { id: 'g8', image: 'https://images.unsplash.com/photo-1611078489935-0cb964de46d6?w=600&q=80', caption: 'Phone matte skin', device_type: 'Phone', finish_type: 'P.Matt', placement: 'Top', source: 'legacy', uploaded_at: '2025-01-01T00:00:00Z' },
    { id: 'g9', image: 'https://images.unsplash.com/photo-1556656793-08538906a9f8?w=600&q=80', caption: 'Controller skin', device_type: 'Consoles', finish_type: 'Custom', placement: 'Top', source: 'legacy', uploaded_at: '2025-01-01T00:00:00Z' },
    { id: 'g10', image: 'https://images.unsplash.com/photo-1546435770-a3e426bf472b?w=600&q=80', caption: 'Acoustic guitar wrap', device_type: 'Guitar', finish_type: 'Normal', placement: 'Top', source: 'legacy', uploaded_at: '2025-01-01T00:00:00Z' },
    { id: 'g11', image: 'https://images.unsplash.com/photo-1574169208507-84376144848b?w=600&q=80', caption: 'Camera leather wrap', device_type: 'Camera', finish_type: 'Custom', placement: 'Top', source: 'legacy', uploaded_at: '2025-01-01T00:00:00Z' },
    { id: 'g12', image: 'https://images.unsplash.com/photo-1574944985070-8f3ebc6b79d2?w=600&q=80', caption: 'Phone color burst', device_type: 'Phone', finish_type: 'Custom', placement: 'Top', source: 'legacy', uploaded_at: '2025-01-01T00:00:00Z' },
  ],
  figures: [
    { id: 'f1', name: 'Luffy Gear 5', character: 'Monkey D. Luffy', anime: 'One Piece', price: 1499, height: '22 cm', available: true, image: 'https://images.unsplash.com/photo-1601814933824-fd0b574dd592?w=600&q=80' },
    { id: 'f2', name: 'Gojo Satoru', character: 'Satoru Gojo', anime: 'Jujutsu Kaisen', price: 1899, height: '25 cm', available: true, image: 'https://images.unsplash.com/photo-1578632767115-351597cf2477?w=600&q=80' },
    { id: 'f3', name: 'Tanjiro', character: 'Kamado Tanjiro', anime: 'Demon Slayer', price: 1299, height: '20 cm', available: true, image: 'https://images.unsplash.com/photo-1612036782180-6f0822045d23?w=600&q=80' },
    { id: 'f4', name: 'Goku Ultra Instinct', character: 'Son Goku', anime: 'Dragon Ball', price: 2199, height: '28 cm', available: true, image: 'https://images.unsplash.com/photo-1601814933824-fd0b574dd592?w=600&q=80' },
    { id: 'f5', name: 'Naruto Sage Mode', character: 'Uzumaki Naruto', anime: 'Naruto', price: 1599, height: '24 cm', available: false, image: 'https://images.unsplash.com/photo-1612036782180-6f0822045d23?w=600&q=80' },
    { id: 'f6', name: 'Iron Man Mark 85', character: 'Tony Stark', anime: 'Marvel', price: 2499, height: '30 cm', available: true, image: 'https://images.unsplash.com/photo-1601814933824-fd0b574dd592?w=600&q=80' },
    { id: 'f7', name: 'Batman', character: 'Bruce Wayne', anime: 'DC', price: 1999, height: '26 cm', available: true, image: 'https://images.unsplash.com/photo-1578632767115-351597cf2477?w=600&q=80' },
    { id: 'f8', name: 'Doraemon', character: 'Doraemon', anime: 'Doraemon', price: 899, height: '18 cm', available: true, image: 'https://images.unsplash.com/photo-1612036782180-6f0822045d23?w=600&q=80' },
    { id: 'f9', name: 'Eren Yeager', character: 'Eren Yeager', anime: 'Attack on Titan', price: 1699, height: '23 cm', available: true, image: 'https://images.unsplash.com/photo-1601814933824-fd0b574dd592?w=600&q=80' },
    { id: 'f10', name: 'Spider-Man', character: 'Peter Parker', anime: 'Marvel', price: 1799, height: '22 cm', available: true, image: 'https://images.unsplash.com/photo-1578632767115-351597cf2477?w=600&q=80' },
  ],
};

// Per-function memory cache - persists across invocations within the same
// serverless instance. This is the authoritative store for the preview.
// Supabase is purely a write-through cache that is best-effort only.
const memory = {
  site_settings: JSON.parse(JSON.stringify(DEFAULT_DATA.site_settings)),
  categories: [...DEFAULT_DATA.categories],
  reviews: [...DEFAULT_DATA.reviews],
  home_stats: [...DEFAULT_DATA.home_stats],
  pricing: [...DEFAULT_DATA.pricing],
  work_pricing: [...DEFAULT_DATA.work_pricing],
  visit_details: JSON.parse(JSON.stringify(DEFAULT_DATA.visit_details)),
  gallery_photos: [...DEFAULT_DATA.gallery_photos],
  figures: [...DEFAULT_DATA.figures],
  screen_guard_pricing: [...DEFAULT_DATA.screen_guard_pricing],
};

export function getStore(key) {
  return memory[key];
}

export function setStore(key, value) {
  memory[key] = value;
  return memory[key];
}

export function updateStoreItem(key, id, updates) {
  const arr = memory[key];
  if (!Array.isArray(arr)) return null;
  const idx = arr.findIndex((x) => String(x.id) === String(id));
  if (idx === -1) return null;
  arr[idx] = { ...arr[idx], ...updates };
  return arr[idx];
}

export function addStoreItem(key, item) {
  const arr = memory[key];
  if (!Array.isArray(arr)) return null;
  arr.unshift(item);
  return item;
}

export function deleteStoreItem(key, id) {
  const arr = memory[key];
  if (!Array.isArray(arr)) return false;
  const idx = arr.findIndex((x) => String(x.id) === String(id));
  if (idx === -1) return false;
  arr.splice(idx, 1);
  return true;
}

// Best-effort Supabase sync that NEVER blocks the response.
// If Supabase is slow / paused / failing, we still return the in-memory data.
export async function trySupabaseSync(action) {
  try {
    const mod = await import('./db-client.js');
    const supabase = mod.default || mod;
    return await action(supabase);
  } catch (_) {
    return null;
  }
}

export function cors(res) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');
}

export function handleOptions(res) {
  if (res && typeof res.status === 'function') return res.status(204).end();
}
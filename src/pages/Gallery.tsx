import { useEffect, useMemo, useState, useRef, useCallback } from 'react';
import { useSearchParams } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Smartphone, Laptop, Plug, Headphones, Camera as CameraIcon, Snowflake, Palette, KeyRound,
  Gamepad2, Edit3, Save, Check, Loader2, Camera, Upload, Plus,
  X, Trash2, IndianRupee, Percent, ImagePlus,
} from 'lucide-react';
import MobileAppHeader from '../components/MobileAppHeader';
import { checkStaff as checkStaffStatus, getAuthHeader, signIn as authSignIn } from '../lib/auth';

const DEVICES = [
  { name: 'Phone', icon: Smartphone },
  { name: 'Laptop', icon: Laptop },
  { name: 'Charger', icon: Plug },
  { name: 'AirPods', icon: Headphones },
  { name: 'Camera', icon: CameraIcon },
  { name: 'AC', icon: Snowflake },
  { name: 'Guitar', icon: Palette },
  { name: 'Car Keys', icon: KeyRound },
  { name: 'Consoles', icon: Gamepad2 },
  { name: 'Controller', icon: Gamepad2 },
];

const DEVICE_SLUGS: Record<string, string> = {
  'Phone': 'phone', 'Laptop': 'laptop', 'Charger': 'charger', 'AirPods': 'airpods',
  'Camera': 'camera', 'AC': 'ac', 'Guitar': 'guitar', 'Car Keys': 'car-keys',
  'Consoles': 'consoles', 'Controller': 'controller',
};

const FINISHES = (device: string): string[] => {
  if (device === 'Laptop') return ['All', '3-D', 'P.Matt', 'Normal', 'Customize', 'Other'];
  if (device === 'Phone') return ['All', '3-D', 'P.Matt', 'Custom', '3-M', 'Other'];
  return ['All', 'Normal', 'Custom', 'Other'];
};

const SAMPLE = [
  { id: 'g1', image: 'https://images.unsplash.com/photo-1517694712202-14dd9538aa97?w=800&q=80', caption: 'Cyberpunk laptop wrap', device_type: 'Laptop', finish_type: '3-D', placement: 'Top', source: 'legacy', uploaded_at: new Date().toISOString() },
  { id: 'g2', image: 'https://images.unsplash.com/photo-1603302576837-375b5c6ff16c?w=600&q=80', caption: 'Galaxy matte skin', device_type: 'Phone', finish_type: 'P.Matt', placement: 'Top', source: 'legacy', uploaded_at: new Date().toISOString() },
  { id: 'g3', image: 'https://images.unsplash.com/photo-1586810787741-0022be8bc65e?w=600&q=80', caption: 'PS5 carbon wrap', device_type: 'Consoles', finish_type: 'Normal', placement: 'Top', source: 'legacy', uploaded_at: new Date().toISOString() },
  { id: 'g4', image: 'https://images.unsplash.com/photo-1593305841991-05c297ba4575?w=600&q=80', caption: 'AirPods signature wrap', device_type: 'AirPods', finish_type: 'Custom', placement: 'Top', source: 'legacy', uploaded_at: new Date().toISOString() },
  { id: 'g5', image: 'https://images.unsplash.com/photo-1525547719571-a2d4ac8945e2?w=600&q=80', caption: 'Camera body skin', device_type: 'Camera', finish_type: 'Normal', placement: 'Top', source: 'legacy', uploaded_at: new Date().toISOString() },
  { id: 'g6', image: 'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=600&q=80', caption: 'Headphones wrap', device_type: 'AirPods', finish_type: 'Custom', placement: 'Top', source: 'legacy', uploaded_at: new Date().toISOString() },
];

async function processImage(file: File): Promise<{ base64: string; contentType: string; preview: string }> {
  const bitmap = await createImageBitmap(file);
  const scale = Math.min(1, 1600 / Math.max(bitmap.width, bitmap.height));
  const canvas = document.createElement('canvas');
  canvas.width = Math.round(bitmap.width * scale);
  canvas.height = Math.round(bitmap.height * scale);
  const ctx = canvas.getContext('2d');
  if (!ctx) throw new Error('Could not process image');
  ctx.drawImage(bitmap, 0, 0, canvas.width, canvas.height);
  bitmap.close();
  const blob = await new Promise<Blob | null>((res) => canvas.toBlob(res, 'image/jpeg', 0.82));
  if (!blob) throw new Error('Could not compress image');
  const dataUrl = await new Promise<string>((res, rej) => {
    const reader = new FileReader();
    reader.onload = () => res(String(reader.result));
    reader.onerror = () => rej(new Error('Could not read image'));
    reader.readAsDataURL(blob);
  });
  return { base64: dataUrl.split(',')[1], contentType: 'image/jpeg', preview: dataUrl };
}

const DEVICE_ALIASES: Record<string, string> = {
  'phone': 'Phone', 'laptop': 'Laptop', 'charger': 'Charger', 'airpods': 'AirPods',
  'camera': 'Camera', 'ac': 'AC', 'guitar': 'Guitar', 'car-keys': 'Car Keys',
  'consoles': 'Consoles', 'controller': 'Controller',
  // Legacy / unknown slugs → fall through to Laptop
  'macbook': 'Laptop',
};

function getInitialDeviceFromURL(): string {
  if (typeof window === 'undefined') return 'Laptop';
  const raw = new URLSearchParams(window.location.search).get('device') || '';
  const slug = raw.toLowerCase();
  return DEVICE_ALIASES[slug] || 'Laptop';
}

export default function Gallery() {
  const [gallery, setGallery] = useState<any[]>(SAMPLE);
  const [pricing, setPricing] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [info, setInfo] = useState('');
  const initialDevice = getInitialDeviceFromURL();
  const [device, setDevice] = useState<string>(initialDevice);
  const [finish, setFinish] = useState<string>(FINISHES(initialDevice)[1]);
  const [placement, setPlacement] = useState<string>(['Laptop', 'Phone'].includes(initialDevice) ? 'Top' : '');
  const [staff, setStaff] = useState(false);
  const [searchParams] = useSearchParams();

  // Sync device state with URL ?device=... param on navigation
  useEffect(() => {
    const raw = (searchParams.get('device') || '').toLowerCase();
    const next = DEVICE_ALIASES[raw] || 'Laptop';
    setDevice(next);
    setFinish(FINISHES(next)[1]);
    setPlacement(['Laptop', 'Phone'].includes(next) ? 'Top' : '');
  }, [searchParams]);
  const [showSignIn, setShowSignIn] = useState(false);
  const [showAdd, setShowAdd] = useState(false);
  const [showCamera, setShowCamera] = useState(false);
  const [showTagPublish, setShowTagPublish] = useState(false);
  const [showEdit, setShowEdit] = useState(false);
  const [showDelete, setShowDelete] = useState(false);
  const [showPriceEdit, setShowPriceEdit] = useState(false);
  const [openFigure, setOpenFigure] = useState<any | null>(null);
  const [pendingImages, setPendingImages] = useState<{ base64: string; contentType: string; preview: string }[]>([]);
  const [editingPhoto, setEditingPhoto] = useState<any | null>(null);
  const [replaceImage, setReplaceImage] = useState<{ base64: string; contentType: string; preview: string } | null>(null);
  const [tagForm, setTagForm] = useState({ deviceType: 'Laptop', finishType: 'Normal', placement: 'Top', caption: '' });
  const [editingRow, setEditingRow] = useState<any | null>(null);
  const [processingImg, setProcessingImg] = useState(false);
  const [saving, setSaving] = useState(false);
  const fileRef = useRef<HTMLInputElement>(null);
  const replaceRef = useRef<HTMLInputElement>(null);

  const load = useCallback(async () => {
    try {
      const [g, p] = await Promise.all([
        fetch('/api/gallery').then(r => r.json()),
        fetch('/api/work-pricing').then(r => r.json()),
      ]);
      if (Array.isArray(g) && g.length) setGallery(g);
      if (Array.isArray(p)) setPricing(p);
    } catch (e: any) {
      setError(e.message || 'Unable to load work');
    } finally {
      setLoading(false);
    }
  }, []);

  const checkStaff = useCallback(async () => {
    const data = await checkStaffStatus();
    setStaff(!!data.staff);
  }, []);

  useEffect(() => { load(); checkStaff(); }, [load, checkStaff]);

  const filtered = useMemo(() =>
    gallery.filter((g) => g.device_type.toLowerCase() === device.toLowerCase() &&
      (finish === 'All' || g.finish_type === finish) &&
      (!['Laptop', 'Phone'].includes(device) || g.placement === placement || g.source === 'legacy'))
      .sort((a, b) => +new Date(b.uploaded_at) - +new Date(a.uploaded_at)),
    [gallery, device, finish, placement]);

  const activePricing = useMemo(() => pricing.find((p) => p.device_type === device && p.finish_type === finish) || null, [pricing, device, finish]);

  const switchDevice = (d: string) => {
    setDevice(d);
    setFinish(FINISHES(d)[1]);
    setPlacement(['Laptop', 'Phone'].includes(d) ? 'Top' : '');
  };

  const capture = async (file: File | undefined) => {
    if (!file) return;
    try {
      setProcessingImg(true); setError('');
      const result = await processImage(file);
      setPendingImages((p) => [...p, result].slice(0, 12));
      setShowAdd(false); setShowTagPublish(true);
      setTagForm({ deviceType: device, finishType: FINISHES(device)[1], placement: ['Laptop', 'Phone'].includes(device) ? placement || 'Top' : '', caption: '' });
    } catch (e: any) {
      setError(e.message || 'Could not use image');
    } finally {
      setProcessingImg(false);
    }
  };

  const pickFiles = async (files: FileList | null) => {
    if (!files?.length) return;
    try {
      setProcessingImg(true); setError('');
      const results: any[] = [];
      for (const f of Array.from(files).slice(0, 12 - pendingImages.length)) {
        results.push(await processImage(f));
      }
      setPendingImages((p) => [...p, ...results].slice(0, 12));
      setShowAdd(false); setShowTagPublish(true);
      setTagForm({ deviceType: device, finishType: FINISHES(device)[1], placement: ['Laptop', 'Phone'].includes(device) ? placement || 'Top' : '', caption: '' });
    } catch (e: any) {
      setError(e.message || 'Could not process photos');
    } finally {
      setProcessingImg(false);
    }
  };

  const publish = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!pendingImages.length) { setError('Choose at least one image'); return; }
    setSaving(true); setError('');
    try {
      const auth = await getAuthHeader();
      if (!auth.Authorization) throw new Error('Staff session expired');
      const res = await fetch('/api/gallery-upload', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', ...auth },
        body: JSON.stringify({ ...tagForm, photos: pendingImages.map(({ base64, contentType }) => ({ base64, contentType })) }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || 'Upload failed');
      setGallery((g) => [data, ...g]);
      setDevice(tagForm.deviceType); setFinish(tagForm.finishType); setPlacement(tagForm.placement || '');
      setPendingImages([]); setShowTagPublish(false);
      setInfo('Photos published successfully');
      window.setTimeout(() => setInfo(''), 4000);
    } catch (e: any) {
      setError(e.message || 'Upload failed');
    } finally { setSaving(false); }
  };

  const startEditPhoto = (fig: any) => {
    sessionStorage.setItem('lamix-edit-id', String(fig.id));
    setEditingPhoto(fig);
    setTagForm({ deviceType: fig.device_type, finishType: fig.finish_type, placement: fig.placement || '', caption: fig.caption || '' });
    setReplaceImage(null);
    setOpenFigure(null);
    setShowEdit(true);
  };

  const loadReplace = async (file: File | undefined) => {
    if (!file) return;
    try {
      setProcessingImg(true);
      setReplaceImage(await processImage(file));
    } catch (e: any) { setError(e.message || 'Could not use image'); }
    finally { setProcessingImg(false); }
  };

  const updatePhoto = async (e: React.FormEvent) => {
    e.preventDefault();
    const id = Number(sessionStorage.getItem('lamix-edit-id'));
    if (!id) return;
    setSaving(true); setError('');
    try {
      const auth = await getAuthHeader();
      if (!auth.Authorization) throw new Error('Staff session expired');
      const res = await fetch('/api/gallery-manage', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json', ...auth },
        body: JSON.stringify({ id, ...tagForm, fileBase64: replaceImage?.base64, contentType: replaceImage?.contentType }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || 'Update failed');
      setGallery((g) => g.map((it) => (it.source === 'upload' && it.id === id ? data : it)));
      setShowEdit(false); setEditingPhoto(null);
      sessionStorage.removeItem('lamix-edit-id');
      setInfo('Photo updated successfully');
      window.setTimeout(() => setInfo(''), 4000);
    } catch (e: any) { setError(e.message || 'Update failed'); }
    finally { setSaving(false); }
  };

  const deletePhoto = async () => {
    const id = Number(sessionStorage.getItem('lamix-delete-id'));
    if (!id) return;
    setSaving(true); setError('');
    try {
      const auth = await getAuthHeader();
      if (!auth.Authorization) throw new Error('Staff session expired');
      const res = await fetch('/api/gallery-manage', {
        method: 'DELETE',
        headers: { 'Content-Type': 'application/json', ...auth },
        body: JSON.stringify({ id }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || 'Delete failed');
      setGallery((g) => g.filter((it) => !(it.source === 'upload' && it.id === id)));
      setShowDelete(false);
      sessionStorage.removeItem('lamix-delete-id');
      setInfo('Photo deleted');
      window.setTimeout(() => setInfo(''), 4000);
    } catch (e: any) { setError(e.message || 'Delete failed'); }
    finally { setSaving(false); }
  };

  const updatePrice = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingRow) return;
    setSaving(true); setError('');
    try {
      const auth = await getAuthHeader();
      if (!auth.Authorization) throw new Error('Staff session expired');
      const res = await fetch('/api/work-pricing', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json', ...auth },
        body: JSON.stringify(editingRow),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || 'Could not save price');
      setPricing((p) => p.map((it) => it.id === data.id ? data : it));
      setShowPriceEdit(false); setEditingRow(null);
      setInfo('Price and offer updated');
      window.setTimeout(() => setInfo(''), 4000);
    } catch (e: any) { setError(e.message || 'Could not save price'); }
    finally { setSaving(false); }
  };

  return (
    <div className="min-h-screen bg-white pb-28 text-[#171717]">
      <input ref={fileRef} hidden multiple type="file" accept="image/*" onChange={(e) => { pickFiles(e.target.files); e.currentTarget.value = ''; }} />
      <input ref={replaceRef} hidden type="file" accept="image/*" onChange={(e) => { loadReplace(e.target.files?.[0]); e.currentTarget.value = ''; }} />

      <MobileAppHeader />

      <main className="mx-auto max-w-7xl">
        <div className="no-scrollbar flex gap-4 overflow-x-auto px-6 py-4 md:justify-center">
          {DEVICES.map(({ name, icon: Icon }) => (
            <button key={name} onClick={() => switchDevice(name)} className="w-[70px] shrink-0 text-center">
              <span className={`mx-auto flex h-[70px] w-[70px] items-center justify-center rounded-full border transition ${device === name ? 'border-[#13879c] bg-[#13879c] text-white' : 'border-[#13879c] bg-white text-[#13879c]'}`}>
                <Icon className="h-8 w-8" strokeWidth={2.5} />
              </span>
              <span className={`mt-2 block text-sm ${device === name ? 'text-[#087a91]' : 'text-[#7eb7c3]'}`}>{name}</span>
            </button>
          ))}
        </div>

        <div className="px-6">
          {['Laptop', 'Phone'].includes(device) && (
            <div className="mb-3 flex rounded-2xl border border-gray-400 bg-white p-1 shadow-inner">
              <button onClick={() => setPlacement('Top')} className={`h-10 flex-1 rounded-xl text-base font-medium ${placement === 'Top' ? 'bg-gradient-to-r from-[#012f36] to-[#16849a] text-white' : 'text-gray-700'}`}>Top</button>
              <button onClick={() => setPlacement('Inside')} className={`h-10 flex-1 rounded-xl text-base font-medium ${placement === 'Inside' ? 'bg-gradient-to-r from-[#012f36] to-[#16849a] text-white' : 'text-gray-700'}`}>Inside</button>
            </div>
          )}

          <div className="no-scrollbar mb-5 flex gap-2 overflow-x-auto py-1">
            {FINISHES(device).map((f) => (
              <button key={f} onClick={() => setFinish(f)} className={`shrink-0 rounded-full border px-4 py-2 text-xs font-semibold ${finish === f ? 'border-[#16879b] bg-[#16879b] text-white' : 'border-gray-200 bg-white text-gray-600'}`}>{f}</button>
            ))}
          </div>

          {activePricing && (
            <section className="relative mb-6 overflow-hidden rounded-2xl border border-gray-200 bg-white shadow-sm">
              {staff && <button onClick={() => { setEditingRow({ ...activePricing }); setShowPriceEdit(true); }} className="absolute right-3 top-3 z-10 flex items-center gap-1 rounded-full bg-cyan-50 px-3 py-2 text-xs font-bold text-[#13879c]"><Edit3 className="h-3.5 w-3.5" /> Edit price</button>}
              <div className="px-5 pb-4 pt-5 pr-28">
                <p className="text-[11px] font-bold uppercase tracking-[.16em] text-[#13879c]">{device} · {finish}</p>
                <h2 className="mt-1 text-2xl font-black">{activePricing.title}{activePricing.display_type === 'fixed' && <span> - Rs {activePricing.fixed_price}</span>}</h2>
              </div>
              {activePricing.display_type === 'placement' && (
                <div className="grid grid-cols-2 gap-4 px-5 pb-4">
                  <button onClick={() => setPlacement('Top')} className={`rounded-xl border py-3 text-base font-bold ${placement === 'Top' ? 'border-[#13879c] bg-cyan-50 text-[#08778a]' : 'border-gray-300'}`}>Top - {activePricing.top_price}</button>
                  <button onClick={() => setPlacement('Inside')} className={`rounded-xl border py-3 text-base font-bold ${placement === 'Inside' ? 'border-[#13879c] bg-cyan-50 text-[#08778a]' : 'border-gray-300'}`}>Inside - {activePricing.inside_price}</button>
                </div>
              )}
              {activePricing.offer_text && (
                <div className="flex items-center justify-center gap-2 bg-gradient-to-r from-orange-500 to-[#16879b] px-4 py-3 text-center text-sm font-semibold text-white">
                  <Percent className="h-4 w-4" />{activePricing.offer_text}
                </div>
              )}
            </section>
          )}

          <AnimatePresence>
            {(error || info) && (
              <motion.div initial={{ opacity: 0, y: -8 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }} className={`mb-4 flex items-center gap-2 rounded-xl p-3 text-sm ${error ? 'bg-red-50 text-red-700' : 'bg-emerald-50 text-emerald-700'}`}>
                {info ? <Check className="h-4 w-4" /> : <X className="h-4 w-4" />}
                {info || error}
              </motion.div>
            )}
          </AnimatePresence>

          {processingImg && (
            <div className="mb-4 flex items-center gap-2 text-sm text-[#13879c]">
              <Loader2 className="h-4 w-4 animate-spin" /> Optimizing photo…
            </div>
          )}

          {loading ? (
            <div className="grid grid-cols-2 gap-3">
              {Array.from({ length: 8 }).map((_, i) => <div key={i} className="aspect-[.68] animate-pulse rounded-2xl bg-gray-100" />)}
            </div>
          ) : filtered.length ? (
            <motion.div layout className="grid grid-cols-2 gap-3 md:grid-cols-3 lg:grid-cols-4">
              {filtered.map((g, idx) => <GalleryItem key={`${g.source}-${g.id}`} item={g} eager={idx < 4} onOpen={() => setOpenFigure(g)} />)}
            </motion.div>
          ) : (
            <div className="rounded-2xl border border-dashed border-gray-300 py-20 text-center">
              <ImagePlus className="mx-auto h-9 w-9 text-gray-300" />
              <p className="mt-3 font-semibold">No work added here yet</p>
            </div>
          )}
        </div>
      </main>

      {staff && (
        <button onClick={() => setShowAdd(true)} className="fixed bottom-24 right-5 z-40 flex items-center gap-2 rounded-full bg-gradient-to-r from-orange-500 to-[#13879c] px-5 py-3 font-bold text-white shadow-xl">
          <Plus className="h-5 w-5" /> Add photo
        </button>
      )}

      <AnimatePresence>
        {showAdd && (
          <Modal title="Add photo" close={() => setShowAdd(false)}>
            <p className="mb-4 text-sm text-gray-500">Take a live photo at the shop counter or choose one saved on your phone.</p>
            <div className="grid grid-cols-2 gap-3">
              <TileButton icon={Camera} title="Open live camera" onClick={() => { setShowAdd(false); setShowCamera(true); }} />
              <TileButton icon={Upload} title="Upload from phone" onClick={() => fileRef.current?.click()} />
            </div>
          </Modal>
        )}
        {showCamera && <CameraCapture onClose={() => setShowCamera(false)} onCapture={(f) => { setShowCamera(false); capture(f); }} />}

        {showTagPublish && pendingImages.length > 0 && (
          <Modal title="Tag & publish" close={() => !saving && setShowTagPublish(false)}>
            <form onSubmit={publish}>
              <div className="mb-3 grid grid-cols-3 gap-2">
                {pendingImages.map((img, idx) => (
                  <div key={idx} className="relative aspect-square overflow-hidden rounded-xl bg-gray-100">
                    <img src={img.preview} className="h-full w-full object-cover" />
                    <button type="button" onClick={() => setPendingImages((p) => p.filter((_, i) => i !== idx))} className="absolute right-1 top-1 rounded-full bg-black/70 p-1 text-white"><X className="h-3 w-3" /></button>
                  </div>
                ))}
              </div>
              <button type="button" onClick={() => fileRef.current?.click()} className="mb-5 flex w-full items-center justify-center gap-2 rounded-xl border border-dashed border-[#13879c] py-3 text-sm font-bold text-[#13879c]">
                <Plus className="h-4 w-4" /> Add more images ({pendingImages.length}/12)
              </button>
              <div className="space-y-4">
                <SelectField label="Device type" value={tagForm.deviceType} options={DEVICES.map((d) => d.name)} change={(v) => setTagForm({ ...tagForm, deviceType: v })} />
                <SelectField label="Finish / quality" value={tagForm.finishType} options={FINISHES(tagForm.deviceType).slice(1)} change={(v) => setTagForm({ ...tagForm, finishType: v })} />
                {['Laptop', 'Phone'].includes(tagForm.deviceType) && (
                  <SelectField label="Placement" value={tagForm.placement} options={['Top', 'Inside']} change={(v) => setTagForm({ ...tagForm, placement: v })} />
                )}
                <label className="block">
                  <span className="mb-2 block text-sm font-semibold">Caption <i className="font-normal text-gray-400">optional</i></span>
                  <input maxLength={140} value={tagForm.caption} onChange={(e) => setTagForm({ ...tagForm, caption: e.target.value })} placeholder="One Piece themed wrap" className="w-full rounded-xl border border-gray-300 px-4 py-3 outline-none focus:border-[#13879c]" />
                </label>
              </div>
              <button disabled={saving} className="mt-6 flex w-full items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-orange-500 to-[#13879c] py-3.5 font-bold text-white">
                {saving ? <><Loader2 className="h-5 w-5 animate-spin" />Publishing…</> : <><Save className="h-5 w-5" />Publish {pendingImages.length} photo{pendingImages.length > 1 ? 's' : ''}</>}
              </button>
            </form>
          </Modal>
        )}

        {showEdit && editingPhoto && (
          <Modal title="Edit photo" close={() => !saving && (setShowEdit(false), setEditingPhoto(null))}>
            <form onSubmit={updatePhoto}>
              {replaceImage ? (
                <img src={replaceImage.preview} className="mb-3 h-52 w-full rounded-2xl bg-gray-50 object-contain" />
              ) : (
                <div className="mb-3 flex h-32 items-center justify-center rounded-2xl bg-gray-50 text-gray-400">
                  <ImagePlus className="h-8 w-8" />
                </div>
              )}
              <button type="button" onClick={() => replaceRef.current?.click()} className="mb-5 w-full rounded-xl border border-[#13879c] py-3 text-sm font-bold text-[#13879c]">
                {replaceImage ? 'Choose a different replacement' : 'Replace image (optional)'}
              </button>
              <div className="space-y-4">
                <SelectField label="Device type" value={tagForm.deviceType} options={DEVICES.map((d) => d.name)} change={(v) => setTagForm({ ...tagForm, deviceType: v })} />
                <SelectField label="Finish / quality" value={tagForm.finishType} options={FINISHES(tagForm.deviceType).slice(1)} change={(v) => setTagForm({ ...tagForm, finishType: v })} />
                {['Laptop', 'Phone'].includes(tagForm.deviceType) && (
                  <SelectField label="Placement" value={tagForm.placement} options={['Top', 'Inside']} change={(v) => setTagForm({ ...tagForm, placement: v })} />
                )}
                <label className="block">
                  <span className="mb-2 block text-sm font-semibold">Caption</span>
                  <input maxLength={140} value={tagForm.caption} onChange={(e) => setTagForm({ ...tagForm, caption: e.target.value })} className="w-full rounded-xl border border-gray-300 px-4 py-3 outline-none focus:border-[#13879c]" />
                </label>
              </div>
              <button disabled={saving} className="mt-6 flex w-full items-center justify-center gap-2 rounded-xl bg-[#13879c] py-3.5 font-bold text-white">
                {saving ? <Loader2 className="animate-spin" /> : <Check />} Save changes
              </button>
            </form>
          </Modal>
        )}

        {showDelete && (
          <Modal title="Delete photo?" close={() => !saving && setShowDelete(false)}>
            <div className="text-center">
              <span className="mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-full bg-red-50 text-red-600"><Trash2 /></span>
              <p className="text-sm text-gray-600">This permanently removes the image from the Work gallery and storage. This action cannot be undone.</p>
              <div className="mt-6 grid grid-cols-2 gap-3">
                <button onClick={() => setShowDelete(false)} className="rounded-xl border py-3 font-bold">Cancel</button>
                <button disabled={saving} onClick={deletePhoto} className="flex items-center justify-center gap-2 rounded-xl bg-red-600 py-3 font-bold text-white">
                  {saving ? <Loader2 className="animate-spin" /> : <Trash2 className="h-5 w-5" />} Delete
                </button>
              </div>
            </div>
          </Modal>
        )}

        {showPriceEdit && editingRow && (
          <Modal title="Edit price & offer" close={() => !saving && (setShowPriceEdit(false), setEditingRow(null))}>
            <form onSubmit={updatePrice} className="space-y-4">
              <label className="block">
                <span className="mb-2 block text-sm font-bold">Display heading</span>
                <input required value={editingRow.title} onChange={(e) => setEditingRow({ ...editingRow, title: e.target.value })} className="w-full rounded-xl border border-gray-300 px-4 py-3 outline-none focus:border-[#13879c]" placeholder="3-D Premium" />
              </label>
              <label className="block">
                <span className="mb-2 block text-sm font-bold">Price layout</span>
                <select value={editingRow.display_type} onChange={(e) => setEditingRow({ ...editingRow, display_type: e.target.value })} className="w-full rounded-xl border border-gray-300 bg-white px-4 py-3">
                  <option value="placement">Top and Inside prices</option>
                  <option value="fixed">One fixed price</option>
                </select>
              </label>
              {editingRow.display_type === 'placement' ? (
                <div className="grid grid-cols-2 gap-3">
                  <RupeeField label="Top price" value={editingRow.top_price} change={(v) => setEditingRow({ ...editingRow, top_price: v })} />
                  <RupeeField label="Inside price" value={editingRow.inside_price} change={(v) => setEditingRow({ ...editingRow, inside_price: v })} />
                </div>
              ) : (
                <RupeeField label="Fixed price" value={editingRow.fixed_price} change={(v) => setEditingRow({ ...editingRow, fixed_price: v })} />
              )}
              <label className="block">
                <span className="mb-2 block text-sm font-bold">Offer text <i className="font-normal text-gray-400">optional</i></span>
                <input value={editingRow.offer_text || ''} onChange={(e) => setEditingRow({ ...editingRow, offer_text: e.target.value })} className="w-full rounded-xl border border-gray-300 px-4 py-3 outline-none focus:border-[#13879c]" placeholder="Combo Offer - 150 Rs Off" />
                <span className="mt-1 block text-xs text-gray-400">Leave empty to hide the offer bar.</span>
              </label>
              <button disabled={saving} className="flex w-full items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-orange-500 to-[#13879c] py-3.5 font-bold text-white">
                {saving ? <><Loader2 className="h-5 w-5 animate-spin" />Saving…</> : <><Check className="h-5 w-5" />Save price & offer</>}
              </button>
            </form>
          </Modal>
        )}

        {showSignIn && <StaffSignInModal close={() => setShowSignIn(false)} done={() => { setShowSignIn(false); checkStaff(); }} />}

        {openFigure && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} onClick={() => setOpenFigure(null)} className="fixed inset-0 z-[80] flex items-center justify-center bg-black/95 p-4">
            <button className="absolute right-5 top-5 text-white"><X className="h-7 w-7" /></button>
            <img onClick={(e) => e.stopPropagation()} src={openFigure.image} className="max-h-[78vh] max-w-full rounded-2xl object-contain" />
            {staff && openFigure.source === 'upload' && (
              <div onClick={(e) => e.stopPropagation()} className="absolute bottom-6 flex gap-3">
                <button onClick={() => startEditPhoto(openFigure)} className="flex items-center gap-2 rounded-full bg-white px-5 py-3 font-bold text-gray-900"><Edit3 className="h-4 w-4" /> Edit</button>
                <button onClick={() => { sessionStorage.setItem('lamix-delete-id', String(openFigure.id)); setOpenFigure(null); setShowDelete(true); }} className="flex items-center gap-2 rounded-full bg-red-600 px-5 py-3 font-bold text-white"><Trash2 className="h-4 w-4" /> Delete</button>
              </div>
            )}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

function GalleryItem({ item, eager, onOpen }: { item: any; eager: boolean; onOpen: () => void }) {
  const images = item.images?.length ? item.images : [{ id: `cover-${item.id}`, image: item.image, sort_order: 0 }];
  const [idx, setIdx] = useState(0);
  useEffect(() => {
    if (images.length < 2) return;
    const t = window.setInterval(() => setIdx((p) => (p + 1) % images.length), 3500);
    return () => window.clearInterval(t);
  }, [images.length]);

  return (
    <motion.article layout initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="relative aspect-[.68] overflow-hidden rounded-2xl bg-gray-100">
      <div
        className="flex h-full snap-x snap-mandatory overflow-x-auto scroll-smooth [scrollbar-width:none]"
        onScroll={(e) => {
          const target = e.currentTarget;
          setIdx(Math.round(target.scrollLeft / target.clientWidth));
        }}
      >
        {images.map((img: any, i: number) => (
          <button key={img.id} onClick={onOpen} className="h-full w-full shrink-0 snap-center">
            <img src={img.image} alt={item.caption || item.title || 'Lamix work'} className="h-full w-full object-cover" loading={eager && i === 0 ? 'eager' : 'lazy'} />
          </button>
        ))}
      </div>
      {images.length > 1 && (
        <>
          <span className="absolute right-2 top-2 rounded-full bg-black/60 px-2 py-1 text-[9px] font-bold text-white">{idx + 1}/{images.length}</span>
          <div className="absolute bottom-2 left-1/2 flex -translate-x-1/2 gap-1">
            {images.map((_: any, i: number) => (
              <span key={i} className={`h-1.5 rounded-full ${i === idx ? 'w-4 bg-white' : 'w-1.5 bg-white/50'}`} />
            ))}
          </div>
        </>
      )}
      <span className="pointer-events-none absolute inset-x-0 bottom-0 bg-gradient-to-t from-black/60 to-transparent px-3 pb-6 pt-10 text-xs font-medium text-white">{item.caption || item.title}</span>
    </motion.article>
  );
}

function CameraCapture({ onClose, onCapture }: { onClose: () => void; onCapture: (f: File) => void }) {
  const videoRef = useRef<HTMLVideoElement>(null);
  const streamRef = useRef<MediaStream | null>(null);
  const [facing, setFacing] = useState('environment');
  const [ready, setReady] = useState(true);
  const [err, setErr] = useState('');

  useEffect(() => {
    let active = true;
    (async () => {
      setReady(true); setErr('');
      streamRef.current?.getTracks().forEach((t) => t.stop());
      try {
        if (!navigator.mediaDevices?.getUserMedia) throw new Error('Live camera not supported.');
        const stream = await navigator.mediaDevices.getUserMedia({
          video: { facingMode: { ideal: facing }, width: { ideal: 1920 }, height: { ideal: 1080 } }, audio: false,
        });
        if (!active) { stream.getTracks().forEach((t) => t.stop()); return; }
        streamRef.current = stream;
        if (videoRef.current) { videoRef.current.srcObject = stream; await videoRef.current.play(); }
      } catch (e: any) { setErr(e.message || 'Camera unavailable'); }
      finally { active && setReady(false); }
    })();
    return () => {
      active = false;
      streamRef.current?.getTracks().forEach((t) => t.stop());
    };
  }, [facing]);

  const snap = () => {
    const v = videoRef.current;
    if (!v || !v.videoWidth) return;
    const c = document.createElement('canvas');
    c.width = v.videoWidth; c.height = v.videoHeight;
    c.getContext('2d')?.drawImage(v, 0, 0);
    c.toBlob((blob) => {
      if (!blob) return;
      streamRef.current?.getTracks().forEach((t) => t.stop());
      onCapture(new File([blob], `lamix-${Date.now()}.jpg`, { type: 'image/jpeg' }));
    }, 'image/jpeg', 0.9);
  };

  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="fixed inset-0 z-[120] flex flex-col bg-black text-white">
      <div className="flex items-center justify-between px-4 pb-3 pt-[max(1rem,env(safe-area-inset-top))]">
        <div>
          <p className="font-black">Take a photo</p>
          <p className="text-xs text-white/55">Position the finished job inside the frame</p>
        </div>
        <button onClick={onClose} className="rounded-full bg-white/15 p-2.5"><X className="h-5 w-5" /></button>
      </div>
      <div className="relative flex-1 overflow-hidden bg-neutral-950">
        <video ref={videoRef} playsInline muted className="h-full w-full object-cover" />
        <div className="pointer-events-none absolute inset-5 rounded-[28px] border border-white/35" />
        {ready && <div className="absolute inset-0 flex items-center justify-center bg-black/70"><Loader2 className="h-8 w-8 animate-spin" /></div>}
        {err && <div className="absolute inset-0 flex flex-col items-center justify-center px-8 text-center"><Camera className="mb-4 h-12 w-12 text-red-400" /><p className="font-bold">Camera unavailable</p><p className="mt-2 text-sm text-white/65">{err}</p></div>}
      </div>
      <div className="flex items-center justify-center gap-12 px-6 pb-[max(1.5rem,env(safe-area-inset-bottom))] pt-5">
        <button disabled={!!err} onClick={() => setFacing((f) => f === 'environment' ? 'user' : 'environment')} className="rounded-full bg-white/15 p-4 disabled:opacity-30"><Camera className="h-5 w-5" /></button>
        <button disabled={ready || !!err} onClick={snap} className="flex h-20 w-20 items-center justify-center rounded-full border-[5px] border-white bg-white/25 disabled:opacity-30"><Camera className="h-8 w-8" /></button>
        <span className="h-[52px] w-[52px]" />
      </div>
    </motion.div>
  );
}

function TileButton({ icon: Icon, title, onClick }: any) {
  return (
    <button onClick={onClick} className="flex min-h-36 flex-col items-center justify-center rounded-2xl border border-gray-200 p-4 text-center hover:border-[#13879c] hover:bg-cyan-50">
      <Icon className="mb-3 h-8 w-8 text-[#13879c]" /><b className="text-sm">{title}</b>
    </button>
  );
}

function SelectField({ label, value, options, change }: { label: string; value: string; options: string[]; change: (v: string) => void }) {
  return (
    <label className="block">
      <span className="mb-2 block text-sm font-semibold">{label}</span>
      <select value={value} onChange={(e) => change(e.target.value)} className="w-full rounded-xl border border-gray-300 bg-white px-4 py-3 outline-none focus:border-[#13879c]">
        {options.map((o) => <option key={o}>{o}</option>)}
      </select>
    </label>
  );
}

function RupeeField({ label, value, change }: { label: string; value: any; change: (v: any) => void }) {
  return (
    <label className="block">
      <span className="mb-2 block text-sm font-bold">{label}</span>
      <div className="relative">
        <IndianRupee className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400" />
        <input required type="number" min="0" value={value ?? ''} onChange={(e) => change(e.target.value === '' ? null : Number(e.target.value))} className="w-full rounded-xl border border-gray-300 py-3 pl-9 pr-3 outline-none focus:border-[#13879c]" />
      </div>
    </label>
  );
}

function Modal({ title, close, children }: any) {
  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} onClick={close} className="fixed inset-0 z-[70] flex items-end justify-center bg-black/60 sm:items-center sm:p-4">
      <motion.div initial={{ y: 30 }} animate={{ y: 0 }} onClick={(e) => e.stopPropagation()} className="max-h-[92vh] w-full max-w-lg overflow-auto rounded-t-3xl bg-white p-6 sm:rounded-3xl">
        <div className="mb-5 flex items-center justify-between">
          <h2 className="text-xl font-black">{title}</h2>
          <button onClick={close} className="rounded-full bg-gray-100 p-2"><X className="h-5 w-5" /></button>
        </div>
        {children}
      </motion.div>
    </motion.div>
  );
}

function StaffSignInModal({ close, done }: any) {
  const [email, setEmail] = useState('');
  const [pw, setPw] = useState('');
  const [err, setErr] = useState('');
  const [busy, setBusy] = useState(false);
  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    setBusy(true); setErr('');
    try {
      await authSignIn(email, pw);
      done();
    } catch (e: any) { setErr(e.message); }
    finally { setBusy(false); }
  };
  return (
    <Modal title="Staff sign in" close={close}>
      <form onSubmit={submit} className="space-y-4">
        {err && <p className="rounded-xl bg-red-50 p-3 text-sm text-red-700">{err}</p>}
        <input required type="email" value={email} onChange={(e) => setEmail(e.target.value)} className="w-full rounded-xl border p-3" placeholder="Email" />
        <input required minLength={6} type="password" value={pw} onChange={(e) => setPw(e.target.value)} className="w-full rounded-xl border p-3" placeholder="Password" />
        <button disabled={busy} className="flex w-full justify-center rounded-xl bg-[#13879c] py-3 font-bold text-white">{busy ? <Loader2 className="animate-spin" /> : 'Sign in'}</button>
      </form>
    </Modal>
  );
}
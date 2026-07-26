import { useEffect, useMemo, useState, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Search, ChevronDown, Plus, X, Trash2, Edit3, Save, Check,
  IndianRupee, Ruler, Loader2, Camera, Upload, Percent,
} from 'lucide-react';
import MobileAppHeader from '../components/MobileAppHeader';
import { checkStaff as checkStaffStatus, getAuthHeader, signIn as authSignIn } from '../lib/auth';

const ANIMES = ['All', 'Marvel', 'One Piece', 'Naruto', 'Dragon Ball', 'Demon Slayer', 'Jujutsu Kaisen', 'Attack on Titan', 'Doraemon', 'DC', 'Other'];

const BLANK = { name: '', character: '', anime: 'One Piece', price: '', height: '', available: true };

const SAMPLES = [
  { id: 'f1', name: 'Luffy Gear 5', character: 'Monkey D. Luffy', anime: 'One Piece', price: 1499, height: '22 cm', available: true, image: 'https://images.unsplash.com/photo-1601814933824-fd0b574dd592?w=600&q=80' },
  { id: 'f2', name: 'Gojo Satoru', character: 'Satoru Gojo', anime: 'Jujutsu Kaisen', price: 1899, height: '25 cm', available: true, image: 'https://images.unsplash.com/photo-1578632767115-351597cf2477?w=600&q=80' },
  { id: 'f3', name: 'Tanjiro', character: 'Kamado Tanjiro', anime: 'Demon Slayer', price: 1299, height: '20 cm', available: true, image: 'https://images.unsplash.com/photo-1612036782180-6f0822045d23?w=600&q=80' },
  { id: 'f4', name: 'Goku Ultra Instinct', character: 'Son Goku', anime: 'Dragon Ball', price: 2199, height: '28 cm', available: true, image: 'https://images.unsplash.com/photo-1601814933824-fd0b574dd592?w=600&q=80' },
  { id: 'f5', name: 'Naruto Sage Mode', character: 'Uzumaki Naruto', anime: 'Naruto', price: 1599, height: '24 cm', available: false, image: 'https://images.unsplash.com/photo-1612036782180-6f0822045d23?w=600&q=80' },
  { id: 'f6', name: 'Iron Man Mark 85', character: 'Tony Stark', anime: 'Marvel', price: 2499, height: '30 cm', available: true, image: 'https://images.unsplash.com/photo-1601814933824-fd0b574dd592?w=600&q=80' },
  { id: 'f7', name: 'Batman', character: 'Bruce Wayne', anime: 'DC', price: 1999, height: '26 cm', available: true, image: 'https://images.unsplash.com/photo-1578632767115-351597cf2477?w=600&q=80' },
  { id: 'f8', name: 'Doraemon', character: 'Doraemon', anime: 'Doraemon', price: 899, height: '18 cm', available: true, image: 'https://images.unsplash.com/photo-1612036782180-6f0822045d23?w=600&q=80' },
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
  const blob = await new Promise<Blob | null>((res) => canvas.toBlob(res, 'image/jpeg', 0.84));
  if (!blob) throw new Error('Could not compress image');
  const dataUrl = await new Promise<string>((res, rej) => {
    const reader = new FileReader();
    reader.onload = () => res(String(reader.result));
    reader.onerror = () => rej(new Error('Could not read image'));
    reader.readAsDataURL(blob);
  });
  return { base64: dataUrl.split(',')[1], contentType: 'image/jpeg', preview: dataUrl };
}

export default function Products() {
  const [figures, setFigures] = useState<any[]>(SAMPLES);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [info, setInfo] = useState('');
  const [staff, setStaff] = useState(false);
  const [filter, setFilter] = useState('All');
  const [query, setQuery] = useState('');
  const [showAdd, setShowAdd] = useState(false);
  const [showSignIn, setShowSignIn] = useState(false);
  const [openFigure, setOpenFigure] = useState<any | null>(null);
  const [editingFigure, setEditingFigure] = useState<any | null>(null);
  const [pendingImage, setPendingImage] = useState<{ base64: string; contentType: string; preview: string } | null>(null);
  const [form, setForm] = useState<any>(BLANK);
  const [saving, setSaving] = useState(false);
  const fileRef = useRef<HTMLInputElement>(null);
  const replaceRef = useRef<HTMLInputElement>(null);
  const [confirmDelete, setConfirmDelete] = useState<any | null>(null);
  const [processingImg, setProcessingImg] = useState(false);

  const loadFigures = async () => {
    try {
      const res = await fetch('/api/figures');
      const data = await res.json();
      if (res.ok && Array.isArray(data) && data.length) setFigures(data);
    } catch (e: any) {
      setError(e.message || 'Could not load figures');
    } finally {
      setLoading(false);
    }
  };

  const checkStaff = async () => {
    const data = await checkStaffStatus();
    setStaff(!!data.staff);
  };

  useEffect(() => {
    loadFigures();
    checkStaff();
    const handler = () => checkStaff();
    window.addEventListener('lamix-auth-change', handler);
    return () => window.removeEventListener('lamix-auth-change', handler);
  }, []);

  const animeOptions = useMemo(() => {
    const set = new Set([...ANIMES, ...figures.map((f) => f.anime)]);
    return Array.from(set);
  }, [figures]);

  const filtered = useMemo(() =>
    figures.filter((f) => (filter === 'All' || f.anime === filter) && `${f.name} ${f.character} ${f.anime}`.toLowerCase().includes(query.toLowerCase())),
    [figures, filter, query]);

  const handleCapture = async (file: File | undefined, isReplace = false) => {
    if (!file) return;
    try {
      setProcessingImg(true);
      setError('');
      const result = await processImage(file);
      setPendingImage(result);
      setShowAdd(false);
      setEditingFigure({}); // open form
      if (!isReplace) setForm({ ...BLANK, anime: filter === 'All' ? 'One Piece' : filter });
    } catch (e: any) {
      setError(e.message || 'Could not use image');
    } finally {
      setProcessingImg(false);
    }
  };

  const startEdit = (fig: any) => {
    setEditingFigure(fig);
    setForm({ name: fig.name, character: fig.character, anime: fig.anime, price: String(fig.price), height: fig.height, available: fig.available });
    setPendingImage(null);
    setOpenFigure(null);
  };

  const saveFigure = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingFigure && !pendingImage) { setError('Choose a figure photo'); return; }
    setSaving(true); setError('');
    try {
      const auth = await getAuthHeader();
      if (!auth.Authorization) throw new Error('Staff session expired');
      const url = editingFigure?.id ? '/api/figure-manage' : '/api/figure-upload';
      const method = editingFigure?.id ? 'PUT' : 'POST';
      const body: any = { ...form, price: Number(form.price), fileBase64: pendingImage?.base64, contentType: pendingImage?.contentType };
      if (editingFigure?.id) body.id = editingFigure.id;
      const res = await fetch(url, { method, headers: { 'Content-Type': 'application/json', ...auth }, body: JSON.stringify(body) });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || 'Could not save figure');
      setFigures((f) => editingFigure?.id ? f.map((it) => (it.id === data.id ? data : it)) : [data, ...f]);
      setEditingFigure(null);
      setPendingImage(null);
      setForm(BLANK);
      setInfo(editingFigure?.id ? 'Figure updated' : 'Figure published');
      window.setTimeout(() => setInfo(''), 4000);
    } catch (e: any) {
      setError(e.message || 'Could not save figure');
    } finally {
      setSaving(false);
    }
  };

  const deleteFigure = async () => {
    if (!confirmDelete) return;
    setSaving(true);
    try {
      const auth = await getAuthHeader();
      if (!auth.Authorization) throw new Error('Staff session expired');
      const res = await fetch('/api/figure-manage', { method: 'DELETE', headers: { 'Content-Type': 'application/json', ...auth }, body: JSON.stringify({ id: confirmDelete.id }) });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || 'Could not delete figure');
      setFigures((f) => f.filter((it) => it.id !== confirmDelete.id));
      setConfirmDelete(null);
      setInfo('Figure deleted');
      window.setTimeout(() => setInfo(''), 4000);
    } catch (e: any) {
      setError(e.message || 'Could not delete figure');
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#080808] pb-28 text-white">
      <input ref={fileRef} hidden type="file" accept="image/*" onChange={(e) => { handleCapture(e.target.files?.[0]); e.currentTarget.value = ''; }} />
      <input ref={replaceRef} hidden type="file" accept="image/*" onChange={(e) => { handleCapture(e.target.files?.[0], true); e.currentTarget.value = ''; }} />

      <MobileAppHeader dark />

      <main className="mx-auto max-w-6xl">
        <div className="px-5 py-5">
          <div className="flex gap-3">
                <label className="relative flex-1">
                  <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-500" />
                  <input value={query} onChange={(e) => setQuery(e.target.value)} placeholder="Search figures" className="w-full rounded-xl border border-white/15 bg-white/10 py-3 pl-10 pr-3 text-sm outline-none focus:border-red-500" />
                </label>
                <label className="relative">
                  <select value={filter} onChange={(e) => setFilter(e.target.value)} className="h-full appearance-none rounded-xl border border-white/15 bg-[#181818] pl-4 pr-9 text-sm outline-none">
                    {animeOptions.map((a) => <option key={a}>{a}</option>)}
                  </select>
                  <ChevronDown className="pointer-events-none absolute right-3 top-1/2 h-4 w-4 -translate-y-1/2" />
                </label>
              </div>

              <AnimatePresence>
                {(error || info) && (
                  <motion.div initial={{ opacity: 0, y: -8 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }} className={`mt-4 flex items-center gap-2 rounded-xl p-3 text-sm ${error ? 'bg-red-950 text-red-200' : 'bg-emerald-950 text-emerald-200'}`}>
                    {info ? <Check className="h-4 w-4" /> : <X className="h-4 w-4" />}
                    {error || info}
                  </motion.div>
                )}
              </AnimatePresence>

              {processingImg && (
                <p className="mt-4 flex items-center gap-2 text-sm text-cyan-300">
                  <Loader2 className="h-4 w-4 animate-spin" /> Optimizing image…
                </p>
              )}

              {loading ? (
                <div className="mt-5 grid grid-cols-2 gap-4 md:grid-cols-3 lg:grid-cols-4">
                  {Array.from({ length: 8 }).map((_, i) => <div key={i} className="aspect-[.72] animate-pulse rounded-xl bg-white/10" />)}
                </div>
              ) : filtered.length ? (
                <div className="mt-5 grid grid-cols-2 gap-4 md:grid-cols-3 lg:grid-cols-4">
                  {filtered.map((f, idx) => (
                    <motion.article key={f.id} initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: idx * 0.03 }} className="overflow-hidden rounded-xl border-2 border-red-600 bg-[#111] p-1 shadow-[0_0_16px_rgba(220,38,38,.12)]">
                      <button onClick={() => setOpenFigure(f)} className="relative block aspect-square w-full overflow-hidden rounded-lg bg-white">
                        <img src={f.image} alt={f.name} className="h-full w-full object-contain" loading={idx < 4 ? 'eager' : 'lazy'} />
                        {!f.available && <span className="absolute inset-x-0 bottom-0 bg-black/75 py-2 text-center text-xs font-black uppercase">Sold out</span>}
                      </button>
                      <div className="p-2">
                        <p className="truncate text-[11px] font-bold uppercase tracking-wide text-red-400">{f.anime}</p>
                        <h2 className="mt-1 line-clamp-1 text-sm font-bold">{f.name}</h2>
                        <div className="mt-2 flex items-center justify-between gap-2">
                          <span className="flex items-center text-base font-black">
                            <IndianRupee className="h-4 w-4" />{f.price}
                          </span>
                          <span className="flex items-center gap-1 rounded-full bg-white/10 px-2 py-1 text-[10px] text-gray-300">
                            <Ruler className="h-3 w-3" />{f.height}
                          </span>
                        </div>
                      </div>
                    </motion.article>
                  ))}
                </div>
              ) : (
                <div className="py-24 text-center text-gray-500">
                  <Percent className="mx-auto h-10 w-10" />
                  <p className="mt-3 font-semibold">No figures found</p>
                </div>
              )}
        </div>
      </main>

      {staff && (
        <button onClick={() => setShowAdd(true)} className="fixed bottom-24 right-5 z-40 flex items-center gap-2 rounded-full bg-gradient-to-r from-red-600 to-orange-500 px-5 py-3 font-bold shadow-xl">
          <Plus className="h-5 w-5" /> Add figure
        </button>
      )}

      <AnimatePresence>
        {showAdd && (
          <Modal title="Add anime figure" close={() => setShowAdd(false)}>
            <p className="mb-4 text-sm text-gray-500">Take a live product photo or choose one saved on your phone.</p>
            <div className="grid grid-cols-2 gap-3">
              <TileButton icon={Camera} title="Open live camera" onClick={() => fileRef.current?.click()} />
              <TileButton icon={Upload} title="Upload from phone" onClick={() => fileRef.current?.click()} />
            </div>
          </Modal>
        )}

        {editingFigure && (
          <Modal title={editingFigure.id ? 'Edit figure' : 'Publish figure'} close={() => !saving && (setEditingFigure(null), setPendingImage(null))}>
            <form onSubmit={saveFigure}>
              {pendingImage ? (
                <img src={pendingImage.preview} className="mb-3 h-52 w-full rounded-xl bg-gray-100 object-contain" />
              ) : editingFigure.id ? (
                <img src={editingFigure.image} className="mb-3 h-52 w-full rounded-xl bg-gray-100 object-contain" />
              ) : null}
              {editingFigure.id && (
                <button type="button" onClick={() => replaceRef.current?.click()} className="mb-4 w-full rounded-xl border border-[#13879c] py-2.5 text-sm font-bold text-[#13879c]">Replace image (optional)</button>
              )}
              <FigureFormFields form={form} set={setForm} />
              <button disabled={saving} className="mt-5 flex w-full items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-red-600 to-orange-500 py-3.5 font-bold text-white disabled:opacity-60">
                {saving ? <Loader2 className="animate-spin" /> : <Save className="h-5 w-5" />}
                {editingFigure.id ? 'Save changes' : 'Publish figure'}
              </button>
            </form>
          </Modal>
        )}

        {showSignIn && <StaffSignInModal close={() => setShowSignIn(false)} done={() => { setShowSignIn(false); checkStaff(); }} />}

        {confirmDelete && (
          <Modal title="Delete figure?" close={() => !saving && setConfirmDelete(null)}>
            <div className="text-center text-black">
              <Trash2 className="mx-auto h-10 w-10 text-red-600" />
              <p className="mt-4 text-sm text-gray-600">This permanently removes the figure and its image.</p>
              <div className="mt-6 grid grid-cols-2 gap-3">
                <button onClick={() => setConfirmDelete(null)} className="rounded-xl border py-3 font-bold">Cancel</button>
                <button onClick={deleteFigure} className="rounded-xl bg-red-600 py-3 font-bold text-white">{saving ? 'Deleting…' : 'Delete'}</button>
              </div>
            </div>
          </Modal>
        )}

        {openFigure && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} onClick={() => setOpenFigure(null)} className="fixed inset-0 z-[80] flex items-center justify-center bg-black/95 p-5">
            <button className="absolute right-5 top-5"><X className="h-7 w-7 text-white" /></button>
            <div onClick={(e) => e.stopPropagation()} className="w-full max-w-lg">
              <img src={openFigure.image} className="max-h-[62vh] w-full rounded-2xl bg-white object-contain" />
              <div className="mt-4">
                <p className="text-sm font-bold uppercase text-red-400">{openFigure.anime} · {openFigure.character}</p>
                <h2 className="text-2xl font-black">{openFigure.name}</h2>
                <div className="mt-2 flex gap-4">
                  <b>₹{openFigure.price}</b>
                  <span className="flex items-center gap-1 text-gray-400"><Ruler className="h-4 w-4" />{openFigure.height}</span>
                </div>
                <p className="mt-4 rounded-xl border border-white/15 bg-white/5 p-3 text-center text-sm text-gray-300">Available for purchase at our Jagat Farm store.</p>
                {staff && (
                  <div className="mt-3 grid grid-cols-2 gap-3">
                    <button onClick={() => startEdit(openFigure)} className="flex items-center justify-center gap-2 rounded-xl bg-white py-3 font-bold text-black"><Edit3 className="h-4 w-4" /> Edit</button>
                    <button onClick={() => { setConfirmDelete(openFigure); setOpenFigure(null); }} className="flex items-center justify-center gap-2 rounded-xl bg-red-600 py-3 font-bold"><Trash2 className="h-4 w-4" /> Delete</button>
                  </div>
                )}
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

function FigureFormFields({ form, set }: { form: any; set: (f: any) => void }) {
  return (
    <div className="space-y-3 text-black">
      <Field label="Listing name" value={form.name} change={(v: string) => set({ ...form, name: v })} placeholder="Luffy Gear 5 Figure" />
      <Field label="Character" value={form.character} change={(v: string) => set({ ...form, character: v })} placeholder="Monkey D. Luffy" />
      <Field label="Anime / series" value={form.anime} change={(v: string) => set({ ...form, anime: v })} placeholder="One Piece" />
      <div className="grid grid-cols-2 gap-3">
        <Field label="Price" value={form.price} change={(v: string) => set({ ...form, price: v })} placeholder="999" type="number" />
        <Field label="Height" value={form.height} change={(v: string) => set({ ...form, height: v })} placeholder="18 cm" />
      </div>
      <label className="flex items-center justify-between rounded-xl bg-gray-50 p-3 text-sm font-bold">
        Available for sale
        <input type="checkbox" checked={form.available} onChange={(e) => set({ ...form, available: e.target.checked })} className="h-5 w-5 accent-[#13879c]" />
      </label>
    </div>
  );
}

function Field({ label, value, change, placeholder, type = 'text' }: { label: string; value: string; change: (v: string) => void; placeholder?: string; type?: string }) {
  return (
    <label className="block">
      <span className="mb-1.5 block text-xs font-bold">{label}</span>
      <input required type={type} min={type === 'number' ? '0' : undefined} value={value} onChange={(e) => change(e.target.value)} placeholder={placeholder} className="w-full rounded-xl border border-gray-300 px-4 py-3 outline-none focus:border-[#13879c]" />
    </label>
  );
}

function TileButton({ icon: Icon, title, onClick }: any) {
  return (
    <button onClick={onClick} className="flex min-h-36 flex-col items-center justify-center rounded-2xl border border-gray-200 text-black hover:border-red-500">
      <Icon className="mb-3 h-8 w-8 text-red-600" />
      <b>{title}</b>
    </button>
  );
}

function Modal({ title, close, children }: any) {
  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} onClick={close} className="fixed inset-0 z-[90] flex items-end justify-center bg-black/70 sm:items-center sm:p-4">
      <motion.div initial={{ y: 30 }} animate={{ y: 0 }} onClick={(e: any) => e.stopPropagation()} className="max-h-[92vh] w-full max-w-lg overflow-auto rounded-t-3xl bg-white p-6 text-black sm:rounded-3xl">
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
      <form onSubmit={submit} className="space-y-3">
        {err && <p className="rounded-xl bg-red-50 p-3 text-sm text-red-700">{err}</p>}
        <Field label="Email" value={email} change={setEmail} placeholder="Email" type="email" />
        <label className="block">
          <span className="mb-1.5 block text-xs font-bold">Password</span>
          <input required type="password" value={pw} onChange={(e) => setPw(e.target.value)} className="w-full rounded-xl border p-3" />
        </label>
        <button className="w-full rounded-xl bg-[#13879c] py-3 font-bold text-white">{busy ? 'Signing in…' : 'Sign in'}</button>
      </form>
    </Modal>
  );
}

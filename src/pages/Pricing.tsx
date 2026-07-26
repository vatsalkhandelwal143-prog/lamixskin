import { useEffect, useState, useCallback } from 'react';
import { Link } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import {
  ArrowLeft, Sparkles, IndianRupee, Edit3, Save, Check, Loader2,
  Laptop, MessageCircle, X, ShieldCheck,
} from 'lucide-react';
import { checkStaff as checkStaffStatus, getAuthHeader, signIn as authSignIn } from '../lib/auth';
import { useSiteSettings } from '../hooks/useSiteSettings';

interface WrapRow {
  id: number;
  item_name: string;
  top_price: number;
  inside_price: number;
  combo_discount: number;
}

const LAPTOP_WRAPS = [
  { id: 1, item_name: '3-D Premium', top_price: 599, inside_price: 499, combo_discount: 150 },
  { id: 2, item_name: '3-D Standard', top_price: 449, inside_price: 399, combo_discount: 100 },
  { id: 3, item_name: 'Matte', top_price: 349, inside_price: 299, combo_discount: 80 },
  { id: 4, item_name: 'Glossy', top_price: 299, inside_price: 249, combo_discount: 60 },
];

export default function Pricing() {
  const { settings } = useSiteSettings();
  const [wraps, setWraps] = useState<WrapRow[]>(LAPTOP_WRAPS);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [info, setInfo] = useState('');
  const [staff, setStaff] = useState(false);
  const [showSignIn, setShowSignIn] = useState(false);
  const [editing, setEditing] = useState<WrapRow | null>(null);
  const [saving, setSaving] = useState(false);

  const load = useCallback(async () => {
    try {
      setError('');
      const res = await fetch('/api/pricing');
      const data = await res.json();
      if (Array.isArray(data)) {
        const laptop = data.filter((p: any) => p.section === 'laptop_wrap');
        if (laptop.length) setWraps(laptop);
      }
    } catch (e: any) {
      setError(e.message || 'Could not load pricing');
    } finally {
      setLoading(false);
    }
  }, []);

  const checkStaff = useCallback(async () => {
    const data = await checkStaffStatus();
    setStaff(!!data.staff);
  }, []);

  useEffect(() => { load(); checkStaff(); }, [load, checkStaff]);

  const startEdit = (row: WrapRow) => setEditing({ ...row });

  const save = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editing) return;
    setSaving(true); setError('');
    try {
      const auth = await getAuthHeader();
      if (!auth.Authorization) throw new Error('Staff session expired');
      const payload = { ...editing, section: 'laptop_wrap' };
      const res = await fetch('/api/pricing', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json', ...auth },
        body: JSON.stringify(payload),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || 'Could not save');
      setWraps((w) => w.map((it) => it.id === data.id ? data : it));
      setEditing(null);
      setInfo('Pricing updated');
      window.setTimeout(() => setInfo(''), 3500);
    } catch (e: any) {
      setError(e.message || 'Could not save');
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#f7f8f7] pt-20 md:pt-24">
      {/* HERO */}
      <section className="relative overflow-hidden bg-gradient-to-br from-[#062e35] via-[#0e6673] to-[#16879b] px-5 py-16 text-white">
        <div className="absolute -right-20 -top-20 h-64 w-64 rounded-full bg-orange-400/20 blur-3xl" />
        <div className="relative mx-auto max-w-6xl">
          <div className="mb-8">
            <Link to="/" className="inline-flex items-center gap-2 text-sm text-white/80 hover:text-white">
              <ArrowLeft className="h-4 w-4" /> Back home
            </Link>
          </div>
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="max-w-3xl">
            <span className="mb-4 inline-flex items-center gap-2 rounded-full bg-white/10 px-4 py-2 text-sm">
              <Sparkles className="h-4 w-4 text-orange-300" /> Clear, honest pricing
            </span>
            <h1 className="text-4xl font-black tracking-tight sm:text-6xl">
              Laptop wrap<br />
              <span className="text-orange-300">finishes</span>
            </h1>
            <p className="mt-5 max-w-2xl text-lg text-cyan-50/80">
              Choose your finish and coverage. Professional installation is included.
            </p>
          </motion.div>
        </div>
      </section>

      <main className="mx-auto max-w-6xl px-4 py-12 sm:px-6">
        <AnimatePresence>
          {(error || info) && (
            <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }} className={`mb-6 flex items-center justify-between rounded-2xl p-4 text-sm font-semibold ${error ? 'border border-red-200 bg-red-50 text-red-700' : 'border border-emerald-200 bg-emerald-50 text-emerald-700'}`}>
              <span className="flex items-center gap-2">
                {info ? <Check className="h-5 w-5" /> : <X className="h-5 w-5" />}
                {info || error}
              </span>
              <button onClick={() => { setError(''); setInfo(''); }}><X className="h-4 w-4" /></button>
            </motion.div>
          )}
        </AnimatePresence>

        {staff && (
          <div className="mb-8 flex items-center gap-3 rounded-2xl border border-cyan-200 bg-cyan-50 p-4 text-sm text-cyan-900">
            <Edit3 className="h-5 w-5" />
            <span><b>Staff editing is enabled.</b> Use the Edit buttons to change wrap prices and offers.</span>
          </div>
        )}

        {loading ? (
          <div className="flex min-h-72 items-center justify-center gap-3 text-[#13879c]">
            <Loader2 className="h-6 w-6 animate-spin" /> Loading prices…
          </div>
        ) : (
          <>
            {/* LAPTOP WRAPS */}
            <section>
              <div className="mb-7 flex items-center gap-3">
                <span className="flex h-11 w-11 items-center justify-center rounded-2xl bg-cyan-100 text-[#13879c]">
                  <Laptop className="h-6 w-6" />
                </span>
                <div>
                  <p className="text-sm font-bold uppercase tracking-wider text-[#13879c]">Laptop</p>
                  <h2 className="text-3xl font-black">Wrap pricing</h2>
                </div>
              </div>
              <div className="grid gap-5 md:grid-cols-2">
                {wraps.map((p, idx) => (
                  <motion.article key={p.id} initial={{ opacity: 0, y: 16 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: idx * 0.06 }} className="relative overflow-hidden rounded-3xl border border-gray-200 bg-white shadow-sm">
                    {staff && (
                      <button onClick={() => startEdit(p)} className="absolute right-4 top-4 z-10 inline-flex items-center gap-1 rounded-full bg-cyan-50 px-3 py-2 text-xs font-bold text-[#13879c] hover:bg-cyan-100">
                        <Edit3 className="h-3.5 w-3.5" /> Edit
                      </button>
                    )}
                    <div className="flex items-center justify-between p-6 pr-20">
                      <div>
                        <p className="text-xs font-bold uppercase tracking-[.18em] text-gray-400">Finish</p>
                        <h3 className="mt-1 text-2xl font-black">{p.item_name}</h3>
                      </div>
                      {idx === 2 && <span className="rounded-full bg-orange-100 px-3 py-1 text-xs font-bold text-orange-700">POPULAR</span>}
                    </div>
                    <div className="grid grid-cols-2 gap-3 px-6 pb-5">
                      <PriceCell label="Top" amount={p.top_price} />
                      <PriceCell label="Inside" amount={p.inside_price} />
                    </div>
                    <div className="bg-gradient-to-r from-orange-500 to-[#16879b] px-5 py-3 text-center text-sm font-semibold text-white">
                      Combo offer — ₹{p.combo_discount} off
                    </div>
                  </motion.article>
                ))}
              </div>
            </section>

            {/* SCREEN GUARD CTA */}
            <section className="mt-16">
              <div className="overflow-hidden rounded-3xl border border-gray-200 bg-white p-7 shadow-sm">
                <div className="flex flex-col items-start gap-5 sm:flex-row sm:items-center">
                  <span className="flex h-14 w-14 items-center justify-center rounded-2xl bg-orange-100 text-orange-600">
                    <ShieldCheck className="h-7 w-7" />
                  </span>
                  <div className="flex-1">
                    <p className="text-sm font-bold uppercase tracking-wider text-orange-600">Protection</p>
                    <h2 className="mt-1 text-2xl font-black">Screen guard pricing</h2>
                    <p className="mt-1 text-sm text-gray-500">Premium screen guards with multiple finishes & sizes.</p>
                  </div>
                  <Link to="/screen-guard" className="inline-flex items-center justify-center gap-2 rounded-full bg-gradient-to-r from-orange-500 to-[#16879b] px-6 py-3 text-sm font-bold text-white shadow-md transition hover:shadow-lg">
                    View screen guards →
                  </Link>
                </div>
              </div>
            </section>

            <section className="mt-10 rounded-[32px] bg-[#102f34] p-7 text-white sm:p-10">
              <div className="grid items-center gap-7 md:grid-cols-[1fr_auto]">
                <div>
                  <h2 className="text-2xl font-black sm:text-3xl">Not sure which finish to choose?</h2>
                  <p className="mt-2 text-white/65">Send us your laptop model. Our team will recommend the right material and confirm the final price.</p>
                </div>
                <a
                  href={`https://wa.me/${settings.whatsapp_number.replace(/\D/g, '')}?text=Hi%20Lamix%20Skin!%20I%20need%20a%20price%20for%20my%20laptop.`}
                  target="_blank" rel="noopener noreferrer"
                  className="inline-flex items-center justify-center gap-2 rounded-full bg-white px-6 py-4 font-bold text-[#102f34]"
                >
                  <MessageCircle className="h-5 w-5" /> Ask on WhatsApp
                </a>
              </div>
            </section>
          </>
        )}
      </main>

      <AnimatePresence>
        {showSignIn && <StaffSignInModal close={() => setShowSignIn(false)} done={() => { setShowSignIn(false); checkStaff(); }} />}
        {editing && (
          <EditModal row={editing} setRow={setEditing} close={() => !saving && setEditing(null)} save={save} saving={saving} />
        )}
      </AnimatePresence>
    </div>
  );
}

function PriceCell({ label, amount }: { label: string; amount: number }) {
  return (
    <div className="rounded-2xl border border-gray-200 bg-gray-50 p-4">
      <p className="text-xs font-semibold uppercase tracking-wide text-gray-400">{label}</p>
      <p className="mt-1 flex items-center text-2xl font-black">
        <IndianRupee className="h-5 w-5" />{amount}
      </p>
    </div>
  );
}

function EditModal({ row, setRow, close, save, saving }: any) {
  const numField = (key: string) => (v: string) => setRow({ ...row, [key]: v === '' ? 0 : Number(v) });
  return (
    <Modal title={`Edit ${row.item_name}`} close={close}>
      <form onSubmit={save} className="space-y-4">
        <label className="block">
          <span className="mb-2 block text-sm font-bold">Finish name</span>
          <input required value={row.item_name} onChange={(e) => setRow({ ...row, item_name: e.target.value })} className="w-full rounded-xl border border-gray-300 px-4 py-3 outline-none focus:border-[#13879c]" />
        </label>
        <div className="grid grid-cols-2 gap-3">
          <label className="block">
            <span className="mb-2 block text-sm font-bold">Top price</span>
            <div className="relative">
              <IndianRupee className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400" />
              <input required min="0" type="number" value={row.top_price} onChange={(e) => numField('top_price')(e.target.value)} className="w-full rounded-xl border border-gray-300 py-3 pl-9 pr-3 outline-none focus:border-[#13879c]" />
            </div>
          </label>
          <label className="block">
            <span className="mb-2 block text-sm font-bold">Inside price</span>
            <div className="relative">
              <IndianRupee className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400" />
              <input required min="0" type="number" value={row.inside_price} onChange={(e) => numField('inside_price')(e.target.value)} className="w-full rounded-xl border border-gray-300 py-3 pl-9 pr-3 outline-none focus:border-[#13879c]" />
            </div>
          </label>
          <label className="col-span-2 block">
            <span className="mb-2 block text-sm font-bold">Combo discount (₹)</span>
            <div className="relative">
              <IndianRupee className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400" />
              <input required min="0" type="number" value={row.combo_discount} onChange={(e) => numField('combo_discount')(e.target.value)} className="w-full rounded-xl border border-gray-300 py-3 pl-9 pr-3 outline-none focus:border-[#13879c]" />
            </div>
          </label>
        </div>
        <button disabled={saving} className="flex w-full items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-orange-500 to-[#13879c] py-3.5 font-bold text-white disabled:opacity-60">
          {saving ? <><Loader2 className="h-5 w-5 animate-spin" />Saving…</> : <><Check className="h-5 w-5" />Save changes</>}
        </button>
      </form>
    </Modal>
  );
}

function Modal({ title, close, children }: any) {
  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} onClick={close} className="fixed inset-0 z-[80] flex items-end justify-center bg-black/60 sm:items-center sm:p-4">
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
      <div className="mb-5 rounded-2xl bg-cyan-50 p-4 text-sm text-cyan-900">Only authorized staff can edit prices and offers.</div>
      <form onSubmit={submit} className="space-y-4">
        {err && <p className="rounded-xl bg-red-50 p-3 text-sm text-red-700">{err}</p>}
        <label className="block">
          <span className="mb-2 block text-sm font-bold">Email</span>
          <input required type="email" value={email} onChange={(e) => setEmail(e.target.value)} className="w-full rounded-xl border border-gray-300 px-4 py-3" />
        </label>
        <label className="block">
          <span className="mb-2 block text-sm font-bold">Password</span>
          <input required minLength={6} type="password" value={pw} onChange={(e) => setPw(e.target.value)} className="w-full rounded-xl border border-gray-300 px-4 py-3" />
        </label>
        <button disabled={busy} className="flex w-full justify-center rounded-xl bg-[#13879c] py-3.5 font-bold text-white">
          {busy ? <Loader2 className="animate-spin" /> : 'Sign in'}
        </button>
      </form>
    </Modal>
  );
}
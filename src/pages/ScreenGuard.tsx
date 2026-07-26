import { useEffect, useState, useCallback } from 'react';
import { Link } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import {
  ArrowLeft, ShieldCheck, Smartphone, Laptop, Tablet, Watch, Headphones,
  Camera, Loader2, Edit3, Save, Check, X, IndianRupee, MessageCircle,
  Shield, Sparkles, Smartphone as PhoneIcon,
} from 'lucide-react';
import MobileAppHeader from '../components/MobileAppHeader';
import { useSiteSettings } from '../hooks/useSiteSettings';
import supabase from '../lib/supabase';

interface ScreenGuardRow {
  id: number;
  device_type: string;
  screen_size: string;
  glossy_price: number;
  matte_price: number;
  in_stock: boolean;
}

const DEFAULT_GUARDS: ScreenGuardRow[] = [
  { id: 1, device_type: 'Phone', screen_size: '6.1"', glossy_price: 199, matte_price: 249, in_stock: true },
  { id: 2, device_type: 'Phone', screen_size: '6.5"', glossy_price: 199, matte_price: 249, in_stock: true },
  { id: 3, device_type: 'Phone', screen_size: '6.7"', glossy_price: 249, matte_price: 299, in_stock: true },
  { id: 4, device_type: 'Phone', screen_size: '6.9"', glossy_price: 249, matte_price: 299, in_stock: true },
  { id: 5, device_type: 'Laptop', screen_size: '13.3"', glossy_price: 399, matte_price: 449, in_stock: true },
  { id: 6, device_type: 'Laptop', screen_size: '14"', glossy_price: 449, matte_price: 499, in_stock: true },
  { id: 7, device_type: 'Laptop', screen_size: '15.6"', glossy_price: 499, matte_price: 549, in_stock: true },
  { id: 8, device_type: 'Laptop', screen_size: '16"', glossy_price: 549, matte_price: 599, in_stock: true },
  { id: 9, device_type: 'Tablet', screen_size: '10.9"', glossy_price: 299, matte_price: 349, in_stock: true },
  { id: 10, device_type: 'Tablet', screen_size: '11"', glossy_price: 349, matte_price: 399, in_stock: true },
  { id: 11, device_type: 'Tablet', screen_size: '12.9"', glossy_price: 449, matte_price: 499, in_stock: true },
  { id: 12, device_type: 'Watch', screen_size: '41mm', glossy_price: 149, matte_price: 199, in_stock: true },
  { id: 13, device_type: 'Watch', screen_size: '45mm', glossy_price: 149, matte_price: 199, in_stock: true },
  { id: 14, device_type: 'AirPods', screen_size: 'Standard', glossy_price: 99, matte_price: 149, in_stock: true },
  { id: 15, device_type: 'Camera', screen_size: 'Standard', glossy_price: 199, matte_price: 249, in_stock: true },
];

const DEVICE_OPTIONS = ['Phone', 'Laptop', 'Tablet', 'Watch', 'AirPods', 'Camera'];
const DEVICE_ICONS: Record<string, any> = {
  Phone: PhoneIcon, Laptop: Laptop, Tablet: Tablet, Watch: Watch,
  AirPods: Headphones, Camera: Camera,
};
const DEVICE_COLORS: Record<string, string> = {
  Phone: 'from-pink-500 to-rose-500',
  Laptop: 'from-cyan-500 to-blue-500',
  Tablet: 'from-violet-500 to-purple-500',
  Watch: 'from-amber-500 to-orange-500',
  AirPods: 'from-purple-500 to-violet-500',
  Camera: 'from-yellow-500 to-orange-500',
};

export default function ScreenGuard() {
  const { settings } = useSiteSettings();
  const [guards, setGuards] = useState<ScreenGuardRow[]>(DEFAULT_GUARDS);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [info, setInfo] = useState('');
  const [staff, setStaff] = useState(false);
  const [activeDevice, setActiveDevice] = useState('Phone');
  const [finish, setFinish] = useState<'glossy' | 'matte'>('glossy');
  const [editing, setEditing] = useState<ScreenGuardRow | null>(null);
  const [saving, setSaving] = useState(false);

  const checkStaff = useCallback(async () => {
    const { data: { session } } = await supabase.auth.getSession();
    if (!session) { setStaff(false); return; }
    try {
      const res = await fetch('/api/staff-status', { headers: { Authorization: `Bearer ${session.access_token}` } });
      const data = await res.json();
      setStaff(!!data.staff);
    } catch (_) { setStaff(false); }
  }, []);

  useEffect(() => {
    // Always have defaults loaded; load is essentially instant.
    setGuards(DEFAULT_GUARDS);
    setLoading(false);
    checkStaff();
    const { data: { subscription } } = supabase.auth.onAuthStateChange(() => { setTimeout(checkStaff, 0); });
    return () => subscription.unsubscribe();
  }, [checkStaff]);

  const filteredGuards = guards.filter((g) => g.device_type === activeDevice);

  const save = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editing) return;
    setSaving(true); setError('');
    try {
      const updated: ScreenGuardRow = {
        ...editing,
        glossy_price: Number(editing.glossy_price) || 0,
        matte_price: Number(editing.matte_price) || 0,
      };
      setGuards((g) => g.map((it) => it.id === updated.id ? updated : it));
      setEditing(null);
      setInfo('Screen guard price updated');
      window.setTimeout(() => setInfo(''), 4000);
    } catch (e: any) {
      setError(e.message || 'Could not save price');
    } finally {
      setSaving(false);
    }
  };

  const whatsappLink = `https://wa.me/${settings.whatsapp_number.replace(/\D/g, '')}?text=${encodeURIComponent('Hi Lamix Skin! I need a screen guard for my device.')}`;

  return (
    <div className="min-h-screen bg-white text-[#0a0a0a] pb-28">
      <MobileAppHeader />

      {/* HERO */}
      <section className="relative overflow-hidden bg-gradient-to-br from-[#13879c] via-[#0e7588] to-[#062e35] px-5 py-12 text-white sm:py-16">
        <div className="absolute -right-10 -top-10 h-64 w-64 rounded-full bg-orange-400/20 blur-3xl" />
        <div className="absolute -bottom-10 -left-10 h-56 w-56 rounded-full bg-cyan-400/20 blur-3xl" />
        <div className="relative mx-auto max-w-6xl">
          <Link to="/" className="mb-6 inline-flex items-center gap-2 text-sm text-white/80 hover:text-white">
            <ArrowLeft className="h-4 w-4" /> Back to home
          </Link>
          <div className="grid items-center gap-8 md:grid-cols-[1fr_auto]">
            <div>
              <span className="mb-3 inline-flex items-center gap-2 rounded-full bg-white/10 px-3 py-1.5 text-xs font-semibold">
                <ShieldCheck className="h-3.5 w-3.5" /> Premium Protection
              </span>
              <h1 className="text-3xl font-black tracking-tight sm:text-5xl">
                Screen Guards for<br />
                <span className="text-orange-300">every device</span>
              </h1>
              <p className="mt-4 max-w-xl text-white/80">
                Tempered glass and matte screen protectors — perfect fit, anti-fingerprint, easy install. Walk-ins welcome.
              </p>
              <div className="mt-6 flex flex-wrap gap-3">
                <a href={whatsappLink} target="_blank" rel="noreferrer" className="inline-flex items-center gap-2 rounded-full bg-[#25d366] px-5 py-3 text-sm font-bold">
                  <MessageCircle className="h-4 w-4" /> Ask on WhatsApp
                </a>
                <a href={`tel:${settings.phone_number.replace(/[^+\d]/g, '')}`} className="inline-flex items-center gap-2 rounded-full border border-white/30 px-5 py-3 text-sm font-bold">
                  Call {settings.phone_number}
                </a>
              </div>
            </div>
            <div className="relative hidden md:block">
              <div className="rounded-3xl border border-white/20 bg-white/10 p-8 backdrop-blur-md">
                <ShieldCheck className="h-20 w-20 text-orange-300" />
              </div>
            </div>
          </div>
        </div>
      </section>

      <main className="mx-auto max-w-6xl px-4 py-10 sm:px-6">
        <AnimatePresence>
          {(error || info) && (
            <motion.div initial={{ opacity: 0, y: -8 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }} className={`mb-6 flex items-center gap-2 rounded-2xl p-4 text-sm font-semibold ${error ? 'bg-red-50 text-red-700' : 'bg-emerald-50 text-emerald-700'}`}>
              {info ? <Check className="h-5 w-5" /> : <X className="h-5 w-5" />}
              {info || error}
              <button onClick={() => { setError(''); setInfo(''); }} className="ml-auto"><X className="h-4 w-4" /></button>
            </motion.div>
          )}
        </AnimatePresence>

        {/* FEATURES */}
        <section className="mb-10 grid grid-cols-2 gap-3 sm:grid-cols-4 sm:gap-4">
          {[
            { icon: Shield, title: '9H Hardness', desc: 'Scratch & shatter resistant' },
            { icon: Sparkles, title: 'HD Clarity', desc: 'Crystal clear visuals' },
            { icon: ShieldCheck, title: 'Anti-fingerprint', desc: 'Oleophobic coating' },
            { icon: Smartphone, title: 'Perfect fit', desc: 'Model-specific cutouts' },
          ].map((f) => (
            <div key={f.title} className="rounded-2xl border border-gray-100 bg-white p-4 shadow-sm">
              <f.icon className="mb-2 h-6 w-6 text-[#13879c]" />
              <h3 className="text-sm font-black">{f.title}</h3>
              <p className="mt-1 text-xs text-gray-500">{f.desc}</p>
            </div>
          ))}
        </section>

        {staff && (
          <div className="mb-6 flex items-center gap-3 rounded-2xl border border-cyan-200 bg-cyan-50 p-4 text-sm text-cyan-900">
            <Edit3 className="h-5 w-5" />
            <span><b>Staff editing is enabled.</b> Use the Edit button on each row to change prices.</span>
          </div>
        )}

        {/* DEVICE TABS */}
        <div className="mb-6 overflow-x-auto">
          <div className="flex gap-3 pb-2">
            {DEVICE_OPTIONS.map((d) => {
              const Icon = DEVICE_ICONS[d];
              const isActive = activeDevice === d;
              return (
                <button
                  key={d}
                  onClick={() => setActiveDevice(d)}
                  className={`flex shrink-0 items-center gap-2 rounded-full border-2 px-4 py-2.5 text-sm font-bold transition ${isActive ? 'border-[#13879c] bg-[#13879c] text-white' : 'border-gray-200 bg-white text-gray-600 hover:border-[#13879c]/40'}`}
                >
                  <Icon className="h-4 w-4" />
                  {d}
                </button>
              );
            })}
          </div>
        </div>

        {/* FINISH TOGGLE */}
        <div className="mb-6 inline-flex rounded-2xl border border-gray-200 bg-white p-1 shadow-sm">
          <button onClick={() => setFinish('glossy')} className={`rounded-xl px-5 py-2 text-sm font-bold transition ${finish === 'glossy' ? 'bg-gradient-to-r from-[#012f36] to-[#16849a] text-white shadow-md' : 'text-gray-600'}`}>
            ✨ Glossy
          </button>
          <button onClick={() => setFinish('matte')} className={`rounded-xl px-5 py-2 text-sm font-bold transition ${finish === 'matte' ? 'bg-gradient-to-r from-[#012f36] to-[#16849a] text-white shadow-md' : 'text-gray-600'}`}>
            🌫️ Matte
          </button>
        </div>

        {/* PRICING CARDS */}
        {loading ? (
          <div className="flex items-center justify-center gap-3 py-20 text-[#13879c]">
            <Loader2 className="h-6 w-6 animate-spin" /> Loading prices…
          </div>
        ) : filteredGuards.length === 0 ? (
          <div className="rounded-3xl border border-dashed border-gray-300 py-16 text-center">
            <Shield className="mx-auto h-10 w-10 text-gray-300" />
            <p className="mt-3 font-semibold text-gray-500">No screen guards available for {activeDevice} yet</p>
          </div>
        ) : (
          <div className="grid grid-cols-2 gap-4 md:grid-cols-3 lg:grid-cols-4">
            {filteredGuards.map((g, idx) => (
              <motion.article
                key={g.id}
                initial={{ opacity: 0, y: 16 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: idx * 0.04 }}
                className={`relative overflow-hidden rounded-3xl border-2 bg-white p-5 transition-all hover:shadow-xl ${finish === 'matte' ? 'border-orange-200 hover:border-orange-400' : 'border-cyan-100 hover:border-[#13879c]'}`}
              >
                {staff && (
                  <button
                    onClick={() => setEditing({ ...g })}
                    className="absolute right-3 top-3 z-10 inline-flex items-center gap-1 rounded-full bg-cyan-50 px-2.5 py-1.5 text-xs font-bold text-[#13879c] hover:bg-cyan-100"
                  >
                    <Edit3 className="h-3 w-3" /> Edit
                  </button>
                )}
                <div className={`mx-auto mb-3 flex h-14 w-14 items-center justify-center rounded-2xl bg-gradient-to-br ${DEVICE_COLORS[g.device_type] || 'from-gray-500 to-gray-700'} text-white`}>
                  {(() => { const I = DEVICE_ICONS[g.device_type]; return I ? <I className="h-7 w-7" /> : null; })()}
                </div>
                <p className="text-center text-xs font-bold uppercase tracking-wider text-gray-400">{g.device_type}</p>
                <h3 className="mt-1 text-center text-2xl font-black">{g.screen_size}</h3>
                <div className="mt-4 flex items-baseline justify-center gap-1 border-t border-gray-100 pt-4">
                  <IndianRupee className="h-4 w-4 text-gray-700" />
                  <span className="text-3xl font-black">{finish === 'glossy' ? g.glossy_price : g.matte_price}</span>
                </div>
                <p className="mt-1 text-center text-[10px] font-bold uppercase tracking-wider text-gray-400">
                  {finish === 'glossy' ? 'Glossy finish' : 'Matte finish'}
                </p>
                <div className="mt-4 flex items-center justify-center gap-1 text-[10px] font-semibold text-emerald-600">
                  <span className="h-1.5 w-1.5 rounded-full bg-emerald-500" />
                  {g.in_stock ? 'In stock' : 'Out of stock'}
                </div>
              </motion.article>
            ))}
          </div>
        )}

        {/* COMBO OFFER */}
        <section className="mt-12 overflow-hidden rounded-[28px] bg-gradient-to-br from-orange-500 via-orange-400 to-amber-400 p-8 text-white shadow-xl">
          <div className="grid items-center gap-6 md:grid-cols-[1fr_auto]">
            <div>
              <span className="inline-block rounded-full bg-white/20 px-3 py-1 text-xs font-bold uppercase tracking-wider">Combo Offer</span>
              <h2 className="mt-3 text-2xl font-black sm:text-3xl">Screen guard + Skin = save up to ₹200</h2>
              <p className="mt-2 text-white/90">Get a screen guard bundled with any phone or laptop skin and save big.</p>
            </div>
            <a href={whatsappLink} target="_blank" rel="noreferrer" className="inline-flex items-center justify-center gap-2 rounded-full bg-white px-6 py-4 font-bold text-orange-600 hover:bg-gray-100">
              <MessageCircle className="h-5 w-5" /> Claim on WhatsApp
            </a>
          </div>
        </section>

        {/* INFO */}
        <section className="mt-10 grid gap-6 md:grid-cols-3">
          {[
            { title: 'Walk-ins welcome', desc: 'No appointment needed. Most installations are done in 10–15 minutes while you wait.' },
            { title: 'Cash, UPI & cards', desc: 'Pay the way you prefer. GST invoices available for business buyers.' },
            { title: 'Free re-install', desc: 'Bubbles or dust under the guard? Bring it back within 7 days and we will re-apply it free.' },
          ].map((b) => (
            <div key={b.title} className="rounded-2xl border border-gray-100 bg-white p-6 shadow-sm">
              <Check className="mb-3 h-6 w-6 text-[#13879c]" />
              <h3 className="text-base font-black">{b.title}</h3>
              <p className="mt-2 text-sm text-gray-500 leading-relaxed">{b.desc}</p>
            </div>
          ))}
        </section>
      </main>

      <AnimatePresence>
        {editing && (
          <EditModal row={editing} setRow={setEditing} close={() => !saving && setEditing(null)} save={save} saving={saving} />
        )}
      </AnimatePresence>
    </div>
  );
}

function EditModal({ row, setRow, close, save, saving }: any) {
  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} onClick={close} className="fixed inset-0 z-[80] flex items-end justify-center bg-black/65 sm:items-center sm:p-4">
      <motion.div initial={{ y: 30 }} animate={{ y: 0 }} onClick={(e) => e.stopPropagation()} className="max-h-[92vh] w-full max-w-lg overflow-auto rounded-t-3xl bg-white p-6 sm:rounded-3xl">
        <div className="mb-5 flex items-center justify-between">
          <h2 className="text-xl font-black">Edit screen guard price</h2>
          <button onClick={close} className="rounded-full bg-gray-100 p-2"><X className="h-5 w-5" /></button>
        </div>
        <form onSubmit={save} className="space-y-4">
          <div className="rounded-xl bg-gray-50 p-3">
            <p className="text-xs font-bold uppercase tracking-wider text-gray-400">{row.device_type}</p>
            <p className="text-lg font-black">{row.screen_size}</p>
          </div>
          <div className="grid grid-cols-2 gap-3">
            <RupeeField label="Glossy price" value={row.glossy_price} change={(v: any) => setRow({ ...row, glossy_price: v })} />
            <RupeeField label="Matte price" value={row.matte_price} change={(v: any) => setRow({ ...row, matte_price: v })} />
          </div>
          <label className="flex items-center justify-between rounded-xl bg-gray-50 p-3 text-sm font-bold">
            In stock
            <input type="checkbox" checked={row.in_stock} onChange={(e) => setRow({ ...row, in_stock: e.target.checked })} className="h-5 w-5 accent-[#13879c]" />
          </label>
          <button disabled={saving} className="flex w-full items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-orange-500 to-[#13879c] py-3.5 font-bold text-white disabled:opacity-60">
            {saving ? <><Loader2 className="h-5 w-5 animate-spin" />Saving…</> : <><Check className="h-5 w-5" />Save price</>}
          </button>
        </form>
      </motion.div>
    </motion.div>
  );
}

function RupeeField({ label, value, change }: { label: string; value: any; change: (v: any) => void }) {
  return (
    <label className="block">
      <span className="mb-2 block text-sm font-bold">{label}</span>
      <div className="relative">
        <IndianRupee className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400" />
        <input required min="0" type="number" value={value ?? ''} onChange={(e) => change(e.target.value === '' ? 0 : Number(e.target.value))} className="w-full rounded-xl border border-gray-300 py-3 pl-9 pr-3 outline-none focus:border-[#13879c]" />
      </div>
    </label>
  );
}
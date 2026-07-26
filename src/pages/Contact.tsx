import { useEffect, useState, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  MessageCircle, Instagram, Phone as PhoneIcon, X, Loader2, Star, MapPin,
} from 'lucide-react';
import MobileAppHeader from '../components/MobileAppHeader';
import { useSiteSettings } from '../hooks/useSiteSettings';
import { checkStaff as checkStaffStatus, getAuthHeader, signIn as authSignIn } from '../lib/auth';

const SAMPLE_FEATURES = [
  { id: 1, title: '100+ Premium designs in-store' },
  { id: 2, title: 'Custom wraps on demand' },
  { id: 3, title: 'Walk-ins welcome, 30-min install' },
  { id: 4, title: 'Cash, UPI & cards accepted' },
  { id: 5, title: 'Free consultation & samples' },
];

const SAMPLE_MATERIALS = [
  { id: 1, icon: '🎨', title: '3M Premium Vinyl', description: 'Industry-leading vinyl for lasting wraps' },
  { id: 2, icon: '✨', title: '3-D Carbon', description: 'Realistic textured carbon fiber look' },
  { id: 3, icon: '🌫️', title: 'Premium Matte', description: 'Soft-touch anti-fingerprint finish' },
  { id: 4, icon: '💎', title: 'Crystal Glossy', description: 'Mirror-shine glossy clear finish' },
  { id: 5, icon: '🛡️', title: 'Screen Guards', description: 'Tempered glass & matte protectors' },
  { id: 6, icon: '🎯', title: 'Custom Prints', description: 'Bring your own design — we print it' },
];

export default function Contact() {
  const { settings } = useSiteSettings();
  const [features, setFeatures] = useState<any[]>(SAMPLE_FEATURES);
  const [materials, setMaterials] = useState<any[]>(SAMPLE_MATERIALS);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [info, setInfo] = useState('');
  const [staff, setStaff] = useState(false);

  useEffect(() => {
    (async () => {
      try {
        const res = await fetch('/api/visit');
        const data = await res.json();
        if (res.ok) {
          if (data.features?.length) setFeatures(data.features);
          if (data.materials?.length) setMaterials(data.materials);
        }
      } catch (e: any) { setError(e.message || 'Unable to load visit details'); }
      finally { setLoading(false); }
    })();
  }, []);

  const checkStaff = useCallback(async () => {
    const data = await checkStaffStatus();
    setStaff(!!data.staff);
  }, []);

  useEffect(() => { checkStaff(); }, [checkStaff]);

  const whatsappLink = `https://wa.me/${settings.whatsapp_number.replace(/\D/g, '')}?text=${encodeURIComponent('Hi Lamix Skin! I want to book a custom wrap.')}`;

  return (
    <div className="min-h-screen bg-white pb-28 text-[#0a0a0a]">
      <MobileAppHeader />
      <main className="mx-auto max-w-lg px-6 py-6">
        <div className="flex items-center justify-between">
          <h1 className="text-[24px] font-black tracking-[-1px]">Visit & Contact</h1>
        </div>
        <div className="mt-2 h-[5px] w-full rounded-full bg-gradient-to-r from-[#13879c] to-orange-500" />

        <AnimatePresence>
          {(error || info) && (
            <motion.div initial={{ opacity: 0, y: -8 }} animate={{ opacity: 1, y: 0 }} className={`mt-4 flex items-center gap-2 rounded-xl p-3 text-sm ${error ? 'bg-red-50 text-red-700' : 'bg-emerald-50 text-emerald-700'}`}>
              {info ? <Star className="h-4 w-4" /> : <X className="h-4 w-4" />}
              {info || error}
            </motion.div>
          )}
        </AnimatePresence>

        <section className="mt-3 rounded-[26px] border border-gray-400 px-4 py-6 sm:px-5">
          <div className="text-center">
            <span className="text-[48px]">🔥</span>
            <h2 className="mt-3 text-[19px] font-semibold">Transform Your Device Today</h2>
            <p className="mx-auto mt-2 max-w-sm text-left text-[13px] leading-[1.2] sm:text-center">
              Visit our store or book your custom wrap. Walk-ins are always welcome — we get it done fast.
            </p>
          </div>

          <div className="mt-6 space-y-3">
            <a href={whatsappLink} target="_blank" rel="noreferrer" className="flex h-12 items-center justify-center gap-3 rounded-xl bg-[#25d366] text-[17px] font-semibold text-white">
              <MessageCircle className="h-5 w-5" /> Chat On Whatsapp
            </a>
            <a href={settings.instagram_url} target="_blank" rel="noreferrer" className="flex h-12 items-center justify-center gap-3 rounded-xl bg-gradient-to-r from-orange-500 via-pink-600 to-fuchsia-800 text-[17px] font-semibold text-white">
              <Instagram className="h-5 w-5" /> Follow on Instagram
            </a>
            <a href={`tel:${settings.phone_number.replace(/[^+\d]/g, '')}`} className="flex h-12 items-center justify-center gap-3 rounded-xl border border-[#13879c] text-[16px] font-semibold text-[#13879c]">
              <PhoneIcon className="h-5 w-5" /> Call {settings.phone_number}
            </a>
          </div>

          <div className="mt-4 rounded-[18px] border border-gray-400 px-6 py-4">
            {loading
              ? Array.from({ length: 5 }).map((_, i) => <div key={i} className="my-2 h-4 animate-pulse rounded bg-gray-100" />)
              : features.map((f, idx) => (
                <div key={f.id ?? idx} className={`flex gap-2 py-[7px] text-[13px] leading-none ${idx < features.length - 1 ? 'border-b border-gray-400' : ''}`}>
                  <span>•</span><span>{f.title}</span>
                </div>
              ))}
          </div>
        </section>

        <div className="mb-6 mt-6 flex items-center gap-4">
          <h2 className="shrink-0 text-[18px] font-semibold">Our Materials</h2>
          <span className="h-[2px] flex-1 bg-gradient-to-r from-orange-500 to-red-500" />
        </div>

        {loading ? (
          <div className="grid grid-cols-2 gap-4">
            {Array.from({ length: 6 }).map((_, i) => <div key={i} className="h-[108px] animate-pulse rounded-2xl bg-gray-100" />)}
          </div>
        ) : (
          <div className="grid grid-cols-2 gap-4">
            {materials.map((m) => (
              <article key={m.id} className="flex min-h-[108px] flex-col justify-center rounded-2xl border border-gray-200 px-3 py-3 shadow-sm">
                <span className="mb-2 text-center text-[29px] leading-none">{m.icon}</span>
                <h3 className="text-[13px] font-black uppercase leading-none">{m.title}</h3>
                <p className="mt-1 text-[8px] font-semibold uppercase leading-[1.25]">{m.description}</p>
              </article>
            ))}
          </div>
        )}

        <div className="mt-6 grid grid-cols-2 gap-3">
          <a href={settings.google_maps_url} target="_blank" rel="noreferrer" className="flex items-center justify-center gap-2 rounded-2xl border border-[#13879c] py-3 text-xs font-bold text-[#13879c]">
            <MapPin className="h-4 w-4" /> Directions
          </a>
          <a href={settings.google_reviews_url} target="_blank" rel="noreferrer" className="flex items-center justify-center gap-2 rounded-2xl bg-[#13879c] py-3 text-xs font-bold text-white">
            <Star className="h-4 w-4" /> View all reviews
          </a>
        </div>
      </main>
    </div>
  );
}
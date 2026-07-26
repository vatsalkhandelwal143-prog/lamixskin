import { useEffect, useState, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  ShieldCheck, Lock, Loader2, Check, LogIn, LogOut, CircleCheck, X,
  Mail, Phone, MessageCircle, Instagram, Facebook, Twitter, Youtube,
  MapPin, Star, Save, ExternalLink, Edit3, Link2,
} from 'lucide-react';
import MobileAppHeader from '../components/MobileAppHeader';
import { checkStaff, signIn, signOut, getToken } from '../lib/auth';

interface LinkItem {
  key: string;
  label: string;
  icon: any;
  helper?: string;
  defaultValue: string;
}

const LINK_ITEMS: LinkItem[] = [
  { key: 'whatsapp_number', label: 'WhatsApp number', icon: MessageCircle, helper: 'Country code + number, digits only (used by wa.me link)', defaultValue: '919999999999' },
  { key: 'instagram_url', label: 'Instagram profile', icon: Instagram, defaultValue: 'https://instagram.com' },
  { key: 'facebook_url', label: 'Facebook page', icon: Facebook, defaultValue: 'https://facebook.com' },
  { key: 'twitter_url', label: 'Twitter / X profile', icon: Twitter, defaultValue: 'https://x.com' },
  { key: 'youtube_url', label: 'YouTube channel', icon: Youtube, defaultValue: 'https://youtube.com' },
  { key: 'phone_number', label: 'Phone number (display)', icon: Phone, defaultValue: '+91 99999 99999' },
  { key: 'email_address', label: 'Email address', icon: Mail, defaultValue: 'hello@lamixskin.com' },
  { key: 'google_maps_url', label: 'Google Maps link', icon: MapPin, helper: 'Opens when visitors tap "Directions"', defaultValue: 'https://maps.google.com/?q=Jagat+Farm+Greater+Noida' },
  { key: 'google_reviews_url', label: 'Google Reviews link', icon: Star, helper: 'Opens when visitors tap "View all reviews"', defaultValue: 'https://maps.google.com/?q=Lamix+Skin+Jagat+Farm+Greater+Noida' },
];

export default function Staff() {
  const [email, setEmail] = useState('');
  const [pw, setPw] = useState('');
  const [staff, setStaff] = useState(false);
  const [user, setUser] = useState<{ email: string; name?: string } | null>(null);
  const [loading, setLoading] = useState(true);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState('');
  const [info, setInfo] = useState('');

  const [settings, setSettings] = useState<Record<string, string>>(() =>
    Object.fromEntries(LINK_ITEMS.map((l) => [l.key, l.defaultValue]))
  );
  const [editingKey, setEditingKey] = useState<string | null>(null);
  const [editValue, setEditValue] = useState('');
  const [savingKey, setSavingKey] = useState<string | null>(null);

  const refresh = useCallback(async () => {
    setLoading(true);
    const { staff: isStaff, email: uEmail, name } = await checkStaff();
    setStaff(!!isStaff);
    setUser(isStaff ? { email: uEmail || '', name: name || '' } : null);
    setLoading(false);
  }, []);

  useEffect(() => {
    refresh();
    const onFocus = () => refresh();
    window.addEventListener('focus', onFocus);
    const onAuthChange = () => refresh();
    window.addEventListener('lamix-auth-change', onAuthChange);
    return () => {
      window.removeEventListener('focus', onFocus);
      window.removeEventListener('lamix-auth-change', onAuthChange);
    };
  }, [refresh]);

  // Fetch current settings when staff is active
  useEffect(() => {
    if (!staff) return;
    (async () => {
      try {
        const res = await fetch('/api/site-settings');
        const data = await res.json();
        if (res.ok && data) {
          const merged: Record<string, string> = {};
          LINK_ITEMS.forEach((l) => {
            merged[l.key] = (data && data[l.key]) || l.defaultValue;
          });
          setSettings(merged);
        }
      } catch { /* ignore */ }
    })();
  }, [staff]);

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    setBusy(true); setError('');
    try {
      await signIn(email.trim(), pw);
      setPw('');
      setInfo('Signed in. You can now edit every link from this page.');
      await refresh();
    } catch (e: any) {
      setError(e.message);
    } finally {
      setBusy(false);
    }
  };

  const logout = async () => {
    setBusy(true);
    try {
      await signOut();
    } finally {
      setBusy(false);
      setStaff(false);
      setUser(null);
    }
  };

  const startEdit = (item: LinkItem) => {
    setEditingKey(item.key);
    setEditValue(settings[item.key] || item.defaultValue);
  };

  const cancelEdit = () => {
    setEditingKey(null);
    setEditValue('');
  };

  const saveLink = async (item: LinkItem) => {
    setSavingKey(item.key);
    try {
      const token = getToken();
      const res = await fetch('/api/site-settings', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` },
        body: JSON.stringify({ settings: { [item.key]: editValue } }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || 'Could not save');
      setSettings((s) => ({ ...s, [item.key]: editValue }));
      setEditingKey(null);
      setInfo(`Updated ${item.label}.`);
      window.setTimeout(() => setInfo(''), 3500);
    } catch (e: any) {
      setError(e.message || 'Could not save');
    } finally {
      setSavingKey(null);
    }
  };

  return (
    <div className="min-h-screen bg-[#f6f8f8] pb-28">
      <MobileAppHeader />
      <main className="mx-auto max-w-lg px-5 py-10">
        <div className="mb-8 text-center">
          <span className="mx-auto flex h-16 w-16 items-center justify-center rounded-3xl bg-cyan-100 text-[#13879c]">
            <ShieldCheck className="h-8 w-8" />
          </span>
          <h1 className="mt-4 text-3xl font-black">Staff Profile</h1>
          <p className="mt-2 text-sm text-gray-500">
            One login unlocks every staff feature across Lamix — including editing all the links below.
          </p>
        </div>

        <AnimatePresence>
          {error && (
            <motion.p initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="mb-4 flex items-center justify-between rounded-xl bg-red-50 p-3 text-sm text-red-700">
              <span>{error}</span>
              <button onClick={() => setError('')}><X className="h-4 w-4" /></button>
            </motion.p>
          )}
          {info && (
            <motion.p initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="mb-4 flex items-center gap-2 rounded-xl bg-emerald-50 p-3 text-sm text-emerald-700">
              <Check className="h-4 w-4" />{info}
            </motion.p>
          )}
        </AnimatePresence>

        {loading ? (
          <div className="flex justify-center py-16">
            <Loader2 className="h-7 w-7 animate-spin text-[#13879c]" />
          </div>
        ) : !staff ? (
          <form onSubmit={submit} className="space-y-4 rounded-3xl bg-white p-7 shadow-sm">
            <div>
              <h2 className="text-xl font-black">Staff login</h2>
              <p className="mt-1 text-sm text-gray-500">Enter your authorized staff email and password.</p>
            </div>
            <label className="block">
              <span className="mb-2 block text-sm font-bold">Staff email</span>
              <div className="relative">
                <Mail className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400" />
                <input required type="email" value={email} onChange={(e) => setEmail(e.target.value)} placeholder="staff@yourdomain.com" autoComplete="username" className="w-full rounded-xl border border-gray-300 py-3 pl-10 pr-4 outline-none focus:border-[#13879c] focus:ring-2 focus:ring-cyan-100" />
              </div>
            </label>
            <label className="block">
              <span className="mb-2 block text-sm font-bold">Password</span>
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400" />
                <input required minLength={6} type="password" value={pw} onChange={(e) => setPw(e.target.value)} placeholder="Enter password" autoComplete="current-password" className="w-full rounded-xl border border-gray-300 py-3 pl-10 pr-4 outline-none focus:border-[#13879c] focus:ring-2 focus:ring-cyan-100" />
              </div>
            </label>
            <button className="flex w-full items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-orange-500 to-[#13879c] py-3.5 font-bold text-white">
              <LogIn className="h-5 w-5" /> Sign in
            </button>
          </form>
        ) : (
          <div className="space-y-5">
            {/* Logged-in badge */}
            <section className="rounded-3xl border border-emerald-200 bg-white p-6 shadow-sm">
              <div className="flex items-center gap-3">
                <span className="flex h-12 w-12 items-center justify-center rounded-full bg-emerald-500 text-white">
                  <CircleCheck className="h-6 w-6" />
                </span>
                <div className="flex-1">
                  <h2 className="text-base font-black text-emerald-950">Staff mode active</h2>
                  {user?.name && <p className="text-sm font-medium text-gray-700">{user.name}</p>}
                  <p className="text-xs text-gray-500">{user?.email}</p>
                </div>
                <button onClick={logout} disabled={busy} className="rounded-full border border-red-200 p-2 text-red-600 hover:bg-red-50" aria-label="Sign out">
                  <LogOut className="h-4 w-4" />
                </button>
              </div>
              <p className="mt-4 rounded-xl bg-cyan-50 p-3 text-xs text-cyan-900">
                Edit any link below — they instantly update everywhere on the site (Home, Contact, Pricing, Gallery).
              </p>
            </section>

            {/* Editable Links */}
            <section className="rounded-3xl border border-gray-200 bg-white p-5 shadow-sm">
              <div className="mb-4 flex items-center justify-between">
                <h3 className="flex items-center gap-2 text-base font-black">
                  <Link2 className="h-5 w-5 text-[#13879c]" /> All Links
                </h3>
                <span className="text-xs font-semibold text-gray-400">{LINK_ITEMS.length} editable</span>
              </div>
              <div className="space-y-3">
                {LINK_ITEMS.map((item) => {
                  const Icon = item.icon;
                  const isEditing = editingKey === item.key;
                  const isSaving = savingKey === item.key;
                  return (
                    <div key={item.key} className="rounded-2xl border border-gray-200 bg-white p-4">
                      <div className="flex items-start gap-3">
                        <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-cyan-50 text-[#13879c]">
                          <Icon className="h-5 w-5" />
                        </span>
                        <div className="min-w-0 flex-1">
                          <p className="text-sm font-bold">{item.label}</p>
                          {item.helper && <p className="mt-0.5 text-[11px] text-gray-500">{item.helper}</p>}
                          {isEditing ? (
                            <input
                              autoFocus
                              type="text"
                              value={editValue}
                              onChange={(e) => setEditValue(e.target.value)}
                              className="mt-2 w-full rounded-xl border border-[#13879c] px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-cyan-100"
                            />
                          ) : (
                            <p className="mt-1 truncate rounded-lg bg-gray-50 px-3 py-2 font-mono text-xs text-gray-700">{settings[item.key]}</p>
                          )}
                        </div>
                      </div>
                      <div className="mt-3 flex justify-end gap-2">
                        {isEditing ? (
                          <>
                            <button onClick={cancelEdit} disabled={isSaving} className="rounded-lg px-3 py-2 text-xs font-bold text-gray-600 hover:bg-gray-100">Cancel</button>
                            <button onClick={() => saveLink(item)} disabled={isSaving} className="flex items-center gap-1 rounded-lg bg-[#13879c] px-3 py-2 text-xs font-bold text-white disabled:opacity-60">
                              {isSaving ? <Loader2 className="h-3.5 w-3.5 animate-spin" /> : <Save className="h-3.5 w-3.5" />}
                              Save
                            </button>
                          </>
                        ) : (
                          <button onClick={() => startEdit(item)} className="flex items-center gap-1 rounded-lg border border-[#13879c] px-3 py-2 text-xs font-bold text-[#13879c] hover:bg-cyan-50">
                            <Edit3 className="h-3.5 w-3.5" /> Edit
                          </button>
                        )}
                      </div>
                    </div>
                  );
                })}
              </div>
            </section>

            <section className="rounded-3xl border border-gray-200 bg-white p-5 shadow-sm">
              <h3 className="mb-3 flex items-center gap-2 text-base font-black">
                <ShieldCheck className="h-5 w-5 text-emerald-500" /> What you can edit while signed in
              </h3>
              <ul className="space-y-2 text-sm text-gray-700">
                <li className="flex items-start gap-2"><Check className="mt-0.5 h-4 w-4 shrink-0 text-emerald-500" /> <span><b>Home:</b> edit stats, replace recent wrap images, edit captions.</span></li>
                <li className="flex items-start gap-2"><Check className="mt-0.5 h-4 w-4 shrink-0 text-emerald-500" /> <span><b>Products:</b> add, edit, delete anime action figures and their photos.</span></li>
                <li className="flex items-start gap-2"><Check className="mt-0.5 h-4 w-4 shrink-0 text-emerald-500" /> <span><b>Gallery:</b> upload, edit and delete wrap photos per device/finish.</span></li>
                <li className="flex items-start gap-2"><Check className="mt-0.5 h-4 w-4 shrink-0 text-emerald-500" /> <span><b>Pricing:</b> update laptop wrap &amp; screen guard prices, edit MacBook combo.</span></li>
                <li className="flex items-start gap-2"><Check className="mt-0.5 h-4 w-4 shrink-0 text-emerald-500" /> <span><b>Contact:</b> all the WhatsApp / Instagram / Maps links on this page.</span></li>
              </ul>
              <button onClick={logout} disabled={busy} className="mt-5 flex w-full items-center justify-center gap-2 rounded-xl border border-red-200 py-3 font-bold text-red-600 hover:bg-red-50 disabled:opacity-60">
                <LogOut className="h-5 w-5" /> Sign out
              </button>
            </section>
          </div>
        )}
      </main>
    </div>
  );
}
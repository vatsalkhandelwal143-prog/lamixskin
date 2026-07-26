import { useEffect, useState } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import {
  Lock, ShieldCheck, Eye, EyeOff, LogOut, X, Loader2, Check, LogIn, KeyRound,
} from 'lucide-react';
import { checkStaff, signIn, signOut } from '../lib/auth';

export default function StaffProfile({ dark = false, compact = false }: { dark?: boolean; compact?: boolean }) {
  const [open, setOpen] = useState(false);
  const [staff, setStaff] = useState(false);
  const [user, setUser] = useState<{ email: string; name?: string } | null>(null);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPw, setShowPw] = useState(false);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState('');
  const [info, setInfo] = useState('');

  const refresh = async () => {
    const { staff: isStaff, email: uEmail } = await checkStaff();
    setStaff(!!isStaff);
    setUser(isStaff ? { email: uEmail || '' } : null);
  };

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
  }, []);

  const submitSignIn = async (e: React.FormEvent) => {
    e.preventDefault();
    setBusy(true);
    setError('');
    setInfo('');
    try {
      await signIn(email.trim(), password);
      setPassword('');
      setInfo('Signed in. Staff tools are now unlocked across the website.');
      await refresh();
    } catch (err: any) {
      setError(err.message || 'Could not sign in');
    } finally {
      setBusy(false);
    }
  };

  const submitSignOut = async () => {
    setBusy(true);
    try {
      await signOut();
    } finally {
      setBusy(false);
      setStaff(false);
      setUser(null);
      setOpen(false);
    }
  };

  return (
    <>
      <button
        onClick={() => { setOpen(true); setError(''); setInfo(''); }}
        aria-label="Staff profile"
        className={`relative flex ${compact ? 'h-9 w-9' : 'h-10 w-10'} items-center justify-center rounded-full border transition ${
          dark
            ? 'border-white/20 bg-white/10 text-white hover:bg-white/20'
            : 'border-gray-200 bg-white text-gray-700 hover:border-teal-300 hover:text-teal-700'
        }`}
      >
        {staff ? <ShieldCheck className="h-5 w-5 text-emerald-500" /> : <KeyRound className="h-5 w-5" />}
        {staff && (
          <span className="absolute -right-0.5 -top-0.5 h-2.5 w-2.5 rounded-full border-2 border-white bg-emerald-500" />
        )}
      </button>

      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setOpen(false)}
            className="fixed inset-0 z-[100] flex items-end justify-center bg-black/65 p-0 backdrop-blur-sm sm:items-center sm:p-4"
          >
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: 20 }}
              onClick={(e) => e.stopPropagation()}
              className="max-h-[94vh] w-full max-w-md overflow-y-auto rounded-t-3xl bg-white p-6 text-gray-900 shadow-2xl sm:rounded-3xl"
            >
              <div className="mb-6 flex items-center justify-between">
                <div>
                  <p className="text-xs font-bold uppercase tracking-[.16em] text-[#13879c]">Lamix secure access</p>
                  <h2 className="mt-1 text-2xl font-black">{staff ? 'Staff profile' : 'Staff sign in'}</h2>
                </div>
                <button onClick={() => setOpen(false)} className="rounded-full bg-gray-100 p-2">
                  <X className="h-5 w-5" />
                </button>
              </div>

              {error && (
                <div className="mb-4 rounded-xl bg-red-50 p-3 text-sm text-red-700">{error}</div>
              )}
              {info && (
                <div className="mb-4 flex gap-2 rounded-xl bg-emerald-50 p-3 text-sm text-emerald-700">
                  <Check className="h-5 w-5 shrink-0" />
                  {info}
                </div>
              )}

              {staff ? (
                <>
                  <div className="mb-5 rounded-2xl border border-emerald-200 bg-emerald-50 p-4">
                    <div className="flex items-center gap-3">
                      <span className="flex h-11 w-11 items-center justify-center rounded-full bg-emerald-500 text-white">
                        <ShieldCheck className="h-6 w-6" />
                      </span>
                      <div>
                        <p className="font-black text-emerald-950">Staff access active</p>
                        <p className="text-sm text-emerald-700">{user?.email}</p>
                      </div>
                    </div>
                  </div>

                  <button onClick={submitSignOut} disabled={busy} className="flex w-full items-center justify-center gap-2 rounded-xl border border-red-200 py-3 font-bold text-red-600 hover:bg-red-50">
                    <LogOut className="h-5 w-5" /> Sign out
                  </button>
                </>
              ) : (
                <>
                  <div className="mb-5 flex items-start gap-3 rounded-2xl bg-cyan-50 p-4">
                    <Lock className="mt-0.5 h-5 w-5 shrink-0 text-[#13879c]" />
                    <p className="text-sm text-cyan-950">
                      Sign in once to access photo uploads, edits, deletes, pricing, figures and link settings across all staff-enabled pages.
                    </p>
                  </div>
                  <form onSubmit={submitSignIn} className="space-y-4">
                    <EmailField label="Staff email / ID" value={email} change={setEmail} />
                    <PasswordField label="Password" value={password} change={setPassword} show={showPw} toggle={() => setShowPw(!showPw)} />
                    <button disabled={busy} className="flex w-full items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-orange-500 to-[#13879c] py-3.5 font-bold text-white disabled:opacity-60">
                      {busy ? <Loader2 className="h-5 w-5 animate-spin" /> : <LogIn className="h-5 w-5" />}
                      {busy ? 'Signing in…' : 'Sign in to staff account'}
                    </button>
                  </form>
                </>
              )}
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}

function EmailField({ label, value, change }: { label: string; value: string; change: (v: string) => void }) {
  return (
    <label className="block">
      <span className="mb-1.5 block text-sm font-bold">{label}</span>
      <input
        required type="email" value={value} onChange={(e) => change(e.target.value)}
        className="w-full rounded-xl border border-gray-300 px-4 py-3 outline-none focus:border-[#13879c] focus:ring-2 focus:ring-cyan-100"
      />
    </label>
  );
}

function PasswordField({
  label, value, change, show, toggle,
}: { label: string; value: string; change: (v: string) => void; show: boolean; toggle: () => void }) {
  return (
    <label className="block">
      <span className="mb-1.5 block text-sm font-bold">{label}</span>
      <div className="relative">
        <input
          required minLength={6} type={show ? 'text' : 'password'}
          value={value} onChange={(e) => change(e.target.value)}
          className="w-full rounded-xl border border-gray-300 px-4 py-3 pr-11 outline-none focus:border-[#13879c] focus:ring-2 focus:ring-cyan-100"
        />
        <button type="button" onClick={toggle} className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400">
          {show ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
        </button>
      </div>
    </label>
  );
}
import { useEffect, useRef, useState } from 'react';
import { Link } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Sparkles, ArrowRight, MessageCircle, MapPin, Phone, Clock,
  Shield, Star, Ruler, IndianRupee, Palette, Award, Users,
  TrendingUp, ShieldCheck, ChevronRight, Pencil, Save, X,
  Upload, ImagePlus, Check, Loader2, Users as UsersIcon,
} from 'lucide-react';
import { useSiteSettings } from '../hooks/useSiteSettings';
import { checkStaff as checkStaffStatus, getAuthHeader } from '../lib/auth';

const ICON_MAP: Record<string, any> = {
  users: Users, sparkles: Sparkles, award: Award, trending: TrendingUp,
};
const ICON_OPTIONS = [
  { key: 'users', label: 'Users', icon: Users },
  { key: 'sparkles', label: 'Sparkles', icon: Sparkles },
  { key: 'award', label: 'Award', icon: Award },
  { key: 'trending', label: 'Trending', icon: TrendingUp },
];

const FEATURES = [
  { icon: Shield, title: 'Premium Vinyl', desc: '3M quality vinyl material for lasting protection', color: 'from-orange-500 to-red-500' },
  { icon: Star, title: 'Scratch Protection', desc: 'Shields your device from daily wear & tear', color: 'from-blue-500 to-cyan-500' },
  { icon: Clock, title: 'Quick Installation', desc: 'Professional fitting in under 30 minutes', color: 'from-green-500 to-emerald-500' },
  { icon: Ruler, title: 'Perfect Fit', desc: 'Precision-cut for every device model', color: 'from-purple-500 to-pink-500' },
  { icon: IndianRupee, title: 'Affordable Pricing', desc: 'Premium quality at pocket-friendly prices', color: 'from-yellow-500 to-orange-500' },
  { icon: Palette, title: 'Vibrant Designs', desc: '100+ unique patterns & custom designs', color: 'from-teal-500 to-green-500' },
];

const cardVariants = {
  hidden: { opacity: 0, y: 30 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.6 } },
};
const containerVariants = { visible: { transition: { staggerChildren: 0.1 } } };

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

export default function Home() {
  const { settings } = useSiteSettings();
  const [categories, setCategories] = useState<any[]>([]);
  const [reviews, setReviews] = useState<any[]>([]);
  const [gallery, setGallery] = useState<any[]>([]);
  const [stats, setStats] = useState<any[]>([]);
  const [galleryLoading, setGalleryLoading] = useState(true);
  const [staff, setStaff] = useState(false);

  // Stats editing
  const [showStatsModal, setShowStatsModal] = useState(false);
  const [statsDraft, setStatsDraft] = useState<any[]>([]);
  const [savingStats, setSavingStats] = useState(false);

  // Gallery item editing
  const [editItem, setEditItem] = useState<any | null>(null);
  const [editCaption, setEditCaption] = useState('');
  const [editImage, setEditImage] = useState<{ base64: string; contentType: string; preview: string } | null>(null);
  const [editProcessing, setEditProcessing] = useState(false);
  const [editSaving, setEditSaving] = useState(false);

  // Toast
  const [toast, setToast] = useState<{ kind: 'info' | 'error'; msg: string } | null>(null);
  const editFileRef = useRef<HTMLInputElement>(null);

  const flashToast = (kind: 'info' | 'error', msg: string) => {
    setToast({ kind, msg });
    window.setTimeout(() => setToast(null), 3500);
  };

  const checkStaff = async () => {
    const data = await checkStaffStatus();
    setStaff(!!data.staff);
  };

  useEffect(() => {
    (async () => {
      try {
        const [cat, rev, gal, hs] = await Promise.all([
          fetch('/api/categories').then(r => r.json()),
          fetch('/api/reviews').then(r => r.json()),
          fetch('/api/gallery?limit=6').then(r => r.json()),
          fetch('/api/home-stats').then(r => r.json()),
        ]);
        setCategories(Array.isArray(cat) ? cat : []);
        setReviews(Array.isArray(rev) ? rev : []);
        setGallery(Array.isArray(gal) ? gal : []);
        setStats(Array.isArray(hs) ? hs : []);
      } catch (e) { console.error(e); }
      finally { setGalleryLoading(false); }
    })();
  }, []);

  useEffect(() => {
    checkStaff();
    const handler = () => checkStaff();
    window.addEventListener('lamix-auth-change', handler);
    return () => window.removeEventListener('lamix-auth-change', handler);
  }, []);

  const openStatsEdit = () => {
    setStatsDraft(stats.map((s) => ({ ...s })));
    setShowStatsModal(true);
  };

  const saveStats = async (e: React.FormEvent) => {
    e.preventDefault();
    setSavingStats(true);
    try {
      const res = await fetch('/api/home-stats', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ stats: statsDraft }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || 'Could not save');
      setStats(data);
      setShowStatsModal(false);
      flashToast('info', 'Stats updated');
    } catch (e: any) {
      flashToast('error', e.message || 'Could not save stats');
    } finally {
      setSavingStats(false);
    }
  };

  const openEditItem = (g: any) => {
    setEditItem(g);
    setEditCaption(g.caption || g.title || '');
    setEditImage(null);
  };

  const handleEditImageFile = async (file: File | undefined) => {
    if (!file) return;
    try {
      setEditProcessing(true);
      setEditImage(await processImage(file));
    } catch (e: any) {
      flashToast('error', e.message || 'Could not process image');
    } finally {
      setEditProcessing(false);
    }
  };

  const saveItemEdit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editItem) return;
    if (!editImage) { flashToast('error', 'Choose a replacement image first'); return; }
    setEditSaving(true);
    try {
      const auth = await getAuthHeader();
      if (!auth.Authorization) throw new Error('Staff session expired');
      const res = await fetch('/api/home-gallery-manage', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json', ...auth },
        body: JSON.stringify({
          id: editItem.id,
          source: editItem.source || 'legacy',
          caption: editCaption,
          fileBase64: editImage.base64,
          contentType: editImage.contentType,
        }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || 'Could not update image');
      setGallery((g) => g.map((it) => (String(it.id) === String(editItem.id) && it.source === editItem.source ? { ...it, ...data } : it)));
      setEditItem(null);
      setEditImage(null);
      flashToast('info', 'Recent work image updated');
    } catch (e: any) {
      flashToast('error', e.message || 'Could not update image');
    } finally {
      setEditSaving(false);
    }
  };

  return (
    <div className="overflow-hidden">
      {/* HERO */}
      <section className="relative min-h-screen flex items-center bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 overflow-hidden">
        <div className="absolute inset-0">
          <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-teal-500/20 rounded-full blur-3xl animate-pulse" />
          <div className="absolute bottom-1/4 right-1/4 w-80 h-80 bg-orange-500/15 rounded-full blur-3xl animate-pulse delay-1000" />
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-gradient-to-r from-teal-500/10 to-emerald-500/10 rounded-full blur-3xl" />
        </div>
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-24 pb-16 lg:pt-32 lg:pb-24">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <motion.div initial={{ opacity: 0, x: -50 }} animate={{ opacity: 1, x: 0 }} transition={{ duration: 0.8 }}>
              <motion.div initial={{ opacity: 0, scale: 0.8 }} animate={{ opacity: 1, scale: 1 }} transition={{ delay: 0.2 }} className="inline-flex items-center gap-2 px-4 py-2 bg-teal-500/10 border border-teal-500/20 rounded-full mb-6">
                <Sparkles className="w-4 h-4 text-teal-400" />
                <span className="text-sm font-medium text-teal-300">Greater Noida's #1 Wrap Studio</span>
              </motion.div>

              <h1 className="text-4xl sm:text-5xl lg:text-6xl xl:text-7xl font-bold text-white leading-tight mb-6">
                Premium{' '}
                <span className="bg-gradient-to-r from-teal-400 via-emerald-400 to-teal-400 bg-clip-text text-transparent">
                  Laptop & Phone
                </span>{' '}
                Skins
              </h1>
              <p className="text-lg text-gray-400 max-w-lg mb-8 leading-relaxed">
                Transform your devices with premium quality wraps & skins. Protect your gadgets in style with our precision-cut vinyl designs.
              </p>

              <div className="flex flex-wrap gap-4 mb-12">
                <Link to="/products" className="group relative inline-flex items-center gap-2 px-8 py-4 bg-gradient-to-r from-teal-500 to-emerald-500 text-white font-semibold rounded-full overflow-hidden transition-all duration-300 hover:shadow-2xl hover:shadow-teal-500/30 hover:-translate-y-1">
                  <span className="relative z-10">Explore Products</span>
                  <ArrowRight className="w-5 h-5 relative z-10 group-hover:translate-x-1 transition-transform" />
                  <div className="absolute inset-0 bg-gradient-to-r from-emerald-500 to-teal-500 opacity-0 group-hover:opacity-100 transition-opacity" />
                </Link>
                <a
                  href={`https://wa.me/${settings.whatsapp_number.replace(/\D/g, '')}`}
                  target="_blank" rel="noopener noreferrer"
                  className="inline-flex items-center gap-2 px-8 py-4 border-2 border-white/20 text-white font-semibold rounded-full hover:bg-white/10 hover:border-white/40 transition-all duration-300"
                >
                  <MessageCircle className="w-5 h-5" /> WhatsApp Us
                </a>
              </div>

              <div className="relative">
                <div className="relative grid grid-cols-2 sm:grid-cols-4 gap-4">
                  {stats.map((s, idx) => {
                    const Icon = ICON_MAP[s.icon] || Sparkles;
                    return (
                      <motion.div key={s.id ?? idx} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.6 + idx * 0.1 }} className="text-center p-3 bg-white/5 backdrop-blur-sm rounded-2xl border border-white/10">
                        <Icon className="w-5 h-5 text-teal-400 mx-auto mb-1" />
                        <div className="text-lg font-bold text-white">{s.value}</div>
                        <div className="text-xs text-gray-400">{s.label}</div>
                      </motion.div>
                    );
                  })}
                </div>
                {staff && (
                  <button
                    onClick={openStatsEdit}
                    className="absolute -top-3 -right-2 z-10 flex items-center gap-1.5 rounded-full bg-white px-3 py-1.5 text-xs font-bold text-gray-900 shadow-lg hover:bg-gray-100"
                    aria-label="Edit stats"
                  >
                    <Pencil className="w-3.5 h-3.5" /> Edit stats
                  </button>
                )}
              </div>
            </motion.div>

            <motion.div initial={{ opacity: 0, x: 50 }} animate={{ opacity: 1, x: 0 }} transition={{ duration: 0.8, delay: 0.3 }} className="relative hidden lg:block">
              <div className="relative z-10">
                <div className="absolute -inset-4 bg-gradient-to-r from-teal-500 to-emerald-500 rounded-3xl blur-2xl opacity-30 animate-pulse" />
                <img src="https://images.unsplash.com/photo-1517694712202-14dd9538aa97?w=800&q=80" alt="Premium Laptop Skin" className="relative rounded-3xl shadow-2xl w-full object-cover aspect-[4/3]" />
                <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 1 }} className="absolute -bottom-6 -left-6 bg-white rounded-2xl p-4 shadow-xl">
                  <div className="flex items-center gap-3">
                    <div className="w-12 h-12 bg-gradient-to-br from-orange-500 to-red-500 rounded-xl flex items-center justify-center">
                      <Star className="w-6 h-6 text-white" fill="white" />
                    </div>
                    <div>
                      <div className="font-bold text-gray-900">5.0 Rating</div>
                      <div className="text-sm text-gray-500">100+ Reviews</div>
                    </div>
                  </div>
                </motion.div>
              </div>
            </motion.div>
          </div>
        </div>
        <div className="absolute bottom-0 left-0 right-0">
          <svg viewBox="0 0 1440 120" fill="none" xmlns="http://www.w3.org/2000/svg" className="w-full">
            <path d="M0 120L60 105C120 90 240 60 360 45C480 30 600 30 720 37.5C840 45 960 60 1080 67.5C1200 75 1320 75 1380 75L1440 75V120H1380C1320 120 1200 120 1080 120C960 120 840 120 720 120C600 120 480 120 360 120C240 120 120 120 60 120H0Z" fill="white" />
          </svg>
        </div>
      </section>

      {/* CATEGORIES */}
      <section className="py-20 lg:py-28 bg-white relative">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div initial="hidden" whileInView="visible" viewport={{ once: true }} variants={containerVariants} className="text-center mb-16">
            <motion.span variants={cardVariants} className="inline-block px-4 py-1.5 bg-teal-50 text-teal-600 text-sm font-semibold rounded-full mb-4">Our Ecosystem</motion.span>
            <motion.h2 variants={cardVariants} className="text-3xl sm:text-4xl lg:text-5xl font-bold text-gray-900 mb-4">What We Wrap</motion.h2>
            <motion.p variants={cardVariants} className="text-lg text-gray-500 max-w-2xl mx-auto">From laptops to guitars — we wrap it all with premium quality vinyl</motion.p>
          </motion.div>

          <motion.div initial="hidden" whileInView="visible" viewport={{ once: true }} variants={containerVariants} className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-4 lg:gap-6">
            {categories.map((c) => (
              <motion.div key={c.id} variants={cardVariants} whileHover={{ y: -8, scale: 1.02 }} transition={{ type: 'spring', stiffness: 300 }}>
                <Link to={`/gallery?device=${encodeURIComponent(c.slug)}`} className="group block p-6 bg-white rounded-2xl border-2 border-gray-100 hover:border-teal-200 hover:shadow-xl hover:shadow-teal-500/10 transition-all duration-300 text-center">
                  <div className={`w-14 h-14 mx-auto mb-4 rounded-2xl bg-gradient-to-br ${c.color} flex items-center justify-center text-2xl group-hover:scale-110 transition-transform duration-300`}>
                    {c.icon}
                  </div>
                  <h3 className="font-semibold text-gray-900 group-hover:text-teal-600 transition-colors">{c.name}</h3>
                </Link>
              </motion.div>
            ))}
            <motion.div variants={cardVariants} whileHover={{ y: -8 }} transition={{ type: 'spring', stiffness: 300 }}>
              <Link to="/screen-guard" className="group block p-6 bg-gradient-to-br from-gray-900 to-gray-800 rounded-2xl text-center hover:shadow-xl transition-all duration-300">
                <div className="w-14 h-14 mx-auto mb-4 rounded-2xl bg-white/10 flex items-center justify-center group-hover:scale-110 transition-transform">
                  <Shield className="w-7 h-7 text-white" />
                </div>
                <h3 className="font-semibold text-white">Screen Guard</h3>
                <p className="text-sm text-gray-400 mt-1">Protection</p>
              </Link>
            </motion.div>
          </motion.div>
        </div>
      </section>

      {/* RECENT WRAPS */}
      <section className="py-20 lg:py-28 bg-gray-50 relative overflow-hidden">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div initial="hidden" whileInView="visible" viewport={{ once: true }} variants={containerVariants} className="text-center mb-16 relative">
            <motion.span variants={cardVariants} className="inline-block px-4 py-1.5 bg-orange-50 text-orange-600 text-sm font-semibold rounded-full mb-4">Our Work</motion.span>
            <motion.h2 variants={cardVariants} className="text-3xl sm:text-4xl lg:text-5xl font-bold text-gray-900 mb-4">Recent Wraps</motion.h2>
            <motion.p variants={cardVariants} className="text-lg text-gray-500 max-w-2xl mx-auto">See what our customers are rocking</motion.p>
          </motion.div>

          <div className="relative">
            <motion.div initial="hidden" whileInView="visible" viewport={{ once: true }} variants={containerVariants} className="grid grid-cols-2 md:grid-cols-3 gap-4 lg:gap-6">
              {galleryLoading
                ? Array(6).fill(0).map((_, i) => <div key={i} className="aspect-square bg-gray-200 rounded-2xl animate-pulse" />)
                : gallery.slice(0, 6).map((g, idx) => (
                  <motion.div key={`${g.source || 'legacy'}-${g.id ?? idx}`} variants={cardVariants} whileHover={{ y: -5 }} className={`group relative rounded-2xl overflow-hidden cursor-pointer ${idx === 0 ? 'md:col-span-2 md:row-span-2' : ''}`}>
                    <img src={g.image} alt={g.caption || g.title} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500" style={{ aspectRatio: idx === 0 ? undefined : '1/1', minHeight: idx === 0 ? '100%' : 'auto' }} />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-end p-4">
                      <div className="text-white">
                        <p className="font-semibold">{g.caption || g.title}</p>
                        <p className="text-sm text-gray-300">{g.device_type}</p>
                      </div>
                    </div>
                    {staff && (
                      <button
                        onClick={(e) => { e.stopPropagation(); openEditItem(g); }}
                        aria-label={`Replace ${g.caption || 'image'}`}
                        className="absolute top-2 right-2 z-10 flex items-center gap-1.5 rounded-full bg-white/95 px-3 py-1.5 text-xs font-bold text-gray-900 shadow-lg opacity-0 group-hover:opacity-100 transition-opacity hover:bg-white"
                      >
                        <Pencil className="w-3.5 h-3.5" /> Replace
                      </button>
                    )}
                  </motion.div>
                ))}
            </motion.div>
            {staff && (
              <button
                onClick={openStatsEdit}
                className="absolute -top-3 right-2 z-10 hidden md:flex items-center gap-1.5 rounded-full bg-gray-900 px-3 py-1.5 text-xs font-bold text-white shadow-lg hover:bg-gray-800"
              >
                <Pencil className="w-3.5 h-3.5" /> Edit stats
              </button>
            )}
          </div>

          <motion.div initial={{ opacity: 0 }} whileInView={{ opacity: 1 }} viewport={{ once: true }} className="text-center mt-12">
            <Link to="/gallery" className="inline-flex items-center gap-2 px-8 py-4 bg-gray-900 text-white font-semibold rounded-full hover:bg-gray-800 transition-all duration-300 group">
              Explore More Work
              <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
            </Link>
          </motion.div>
        </div>
      </section>

      {/* WHY US */}
      <section className="py-20 lg:py-28 bg-white relative">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div initial="hidden" whileInView="visible" viewport={{ once: true }} variants={containerVariants} className="text-center mb-16">
            <motion.span variants={cardVariants} className="inline-block px-4 py-1.5 bg-teal-50 text-teal-600 text-sm font-semibold rounded-full mb-4">Why Choose Us</motion.span>
            <motion.h2 variants={cardVariants} className="text-3xl sm:text-4xl lg:text-5xl font-bold text-gray-900 mb-4">Why Customers Love Us</motion.h2>
            <motion.p variants={cardVariants} className="text-lg text-gray-500 max-w-2xl mx-auto">We don't just wrap devices — we craft experiences</motion.p>
          </motion.div>
          <motion.div initial="hidden" whileInView="visible" viewport={{ once: true }} variants={containerVariants} className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 lg:gap-8">
            {FEATURES.map((f) => (
              <motion.div key={f.title} variants={cardVariants} whileHover={{ y: -8 }} className="group relative p-8 bg-white rounded-3xl border border-gray-100 hover:border-transparent hover:shadow-2xl transition-all duration-300 overflow-hidden">
                <div className={`absolute top-0 right-0 w-32 h-32 bg-gradient-to-br ${f.color} opacity-5 rounded-full -translate-y-1/2 translate-x-1/2 group-hover:opacity-10 transition-opacity`} />
                <div className={`w-14 h-14 rounded-2xl bg-gradient-to-br ${f.color} flex items-center justify-center mb-6 group-hover:scale-110 transition-transform duration-300 shadow-lg`}>
                  <f.icon className="w-7 h-7 text-white" />
                </div>
                <h3 className="text-xl font-bold text-gray-900 mb-3">{f.title}</h3>
                <p className="text-gray-500 leading-relaxed">{f.desc}</p>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* TESTIMONIALS */}
      <section className="py-20 lg:py-28 bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 relative overflow-hidden">
        <div className="absolute inset-0">
          <div className="absolute top-0 left-1/4 w-72 h-72 bg-teal-500/10 rounded-full blur-3xl" />
          <div className="absolute bottom-0 right-1/4 w-72 h-72 bg-orange-500/10 rounded-full blur-3xl" />
        </div>
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div initial="hidden" whileInView="visible" viewport={{ once: true }} variants={containerVariants} className="text-center mb-16">
            <motion.span variants={cardVariants} className="inline-block px-4 py-1.5 bg-teal-500/10 text-teal-400 text-sm font-semibold rounded-full mb-4 border border-teal-500/20">Testimonials</motion.span>
            <motion.h2 variants={cardVariants} className="text-3xl sm:text-4xl lg:text-5xl font-bold text-white mb-4">What Our Customers Say</motion.h2>
            <motion.p variants={cardVariants} className="text-lg text-gray-400 max-w-2xl mx-auto">Real reviews from real customers</motion.p>
          </motion.div>
          <motion.div initial="hidden" whileInView="visible" viewport={{ once: true }} variants={containerVariants} className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {reviews.map((r) => (
              <motion.div key={r.id} variants={cardVariants} className="group p-6 bg-white/5 backdrop-blur-sm rounded-2xl border border-white/10 hover:border-teal-500/30 hover:bg-white/10 transition-all duration-300">
                <div className="flex items-center gap-3 mb-4">
                  <div className="w-12 h-12 rounded-full bg-gradient-to-br from-teal-400 to-emerald-400 flex items-center justify-center text-white font-bold text-lg">
                    {r.name.charAt(0)}
                  </div>
                  <div>
                    <h4 className="font-semibold text-white">{r.name}</h4>
                    <div className="flex gap-0.5">
                      {Array(r.rating).fill(0).map((_, i) => <Star key={i} className="w-4 h-4 text-yellow-400" fill="#facc15" />)}
                    </div>
                  </div>
                </div>
                <p className="text-gray-300 text-sm leading-relaxed italic">"{r.comment}"</p>
                {r.product && <p className="mt-3 text-xs text-teal-400">— {r.product}</p>}
              </motion.div>
            ))}
          </motion.div>
          <div className="mt-10 text-center">
            <a href={settings.google_reviews_url} target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-2 rounded-full border border-teal-400/30 bg-white/10 px-7 py-3.5 font-semibold text-white transition hover:bg-white hover:text-gray-900">
              View all Google reviews <ArrowRight className="h-4 w-4" />
            </a>
          </div>
        </div>
      </section>

      {/* ABOUT */}
      <section className="py-20 lg:py-28 bg-gradient-to-br from-teal-600 to-emerald-600 relative overflow-hidden">
        <div className="absolute inset-0">
          <svg className="absolute top-0 left-0 w-full h-full opacity-10" xmlns="http://www.w3.org/2000/svg">
            <defs>
              <pattern id="grid" width="40" height="40" patternUnits="userSpaceOnUse">
                <circle cx="2" cy="2" r="1" fill="white" />
              </pattern>
            </defs>
            <rect width="100%" height="100%" fill="url(#grid)" />
          </svg>
        </div>
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <motion.div initial={{ opacity: 0, x: -40 }} whileInView={{ opacity: 1, x: 0 }} viewport={{ once: true }} transition={{ duration: 0.8 }}>
              <span className="inline-block px-4 py-1.5 bg-white/10 text-white text-sm font-semibold rounded-full mb-6">About Lamix Skin</span>
              <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-white mb-6 leading-tight">
                Crafted With Passion at Jagat Farm
              </h2>
              <p className="text-lg text-teal-100 leading-relaxed mb-6">
                At Lamix Skin, we believe every device tells a story. Based in the heart of Jagat Farm, Greater Noida, we've been transforming ordinary devices into extraordinary pieces of art since day one.
              </p>
              <p className="text-teal-200/80 leading-relaxed mb-8">
                Our team of skilled craftsmen combines premium 3M vinyl materials with precision cutting technology to deliver wraps that not only protect your devices but also reflect your unique personality.
              </p>
              <Link to="/about" className="inline-flex items-center gap-2 px-8 py-4 bg-white text-teal-600 font-semibold rounded-full hover:bg-gray-100 transition-all duration-300 group">
                Learn More About Us
                <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
              </Link>
            </motion.div>
            <motion.div initial={{ opacity: 0, x: 40 }} whileInView={{ opacity: 1, x: 0 }} viewport={{ once: true }} transition={{ duration: 0.8, delay: 0.2 }} className="relative hidden lg:block">
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-4">
                  <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-6">
                    <Award className="w-8 h-8 text-white mb-3" />
                    <h4 className="text-2xl font-bold text-white">5000+</h4>
                    <p className="text-teal-200 text-sm">Happy Customers</p>
                  </div>
                  <img src="https://images.unsplash.com/photo-1603302576837-375b5c6ff16c?w=400&q=80" alt="Skin application" className="rounded-2xl w-full aspect-square object-cover" />
                </div>
                <div className="space-y-4 pt-8">
                  <img src="https://images.unsplash.com/photo-1586810787741-0022be8bc65e?w=400&q=80" alt="Device skin" className="rounded-2xl w-full aspect-square object-cover" />
                  <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-6">
                    <ShieldCheck className="w-8 h-8 text-white mb-3" />
                    <h4 className="text-2xl font-bold text-white">3 Years</h4>
                    <p className="text-teal-200 text-sm">Of Excellence</p>
                  </div>
                </div>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* VISIT */}
      <section className="py-20 lg:py-28 bg-white" id="visit">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div initial="hidden" whileInView="visible" viewport={{ once: true }} variants={containerVariants} className="text-center mb-16">
            <motion.span variants={cardVariants} className="inline-block px-4 py-1.5 bg-teal-50 text-teal-600 text-sm font-semibold rounded-full mb-4">Find Us</motion.span>
            <motion.h2 variants={cardVariants} className="text-3xl sm:text-4xl lg:text-5xl font-bold text-gray-900 mb-4">Visit Our Store</motion.h2>
            <motion.p variants={cardVariants} className="text-lg text-gray-500 max-w-2xl mx-auto">Come experience quality firsthand at Jagat Farm</motion.p>
          </motion.div>
          <div className="grid lg:grid-cols-2 gap-12 items-start">
            <motion.div initial={{ opacity: 0, x: -30 }} whileInView={{ opacity: 1, x: 0 }} viewport={{ once: true }} transition={{ duration: 0.6 }} className="space-y-6">
              <div className="flex items-start gap-4 p-6 bg-gray-50 rounded-2xl">
                <div className="w-12 h-12 bg-teal-100 rounded-xl flex items-center justify-center shrink-0">
                  <MapPin className="w-6 h-6 text-teal-600" />
                </div>
                <div>
                  <h3 className="font-semibold text-gray-900 mb-1">Address</h3>
                  <p className="text-gray-600">Jagat Farm Market, Near Metro Station,<br />Greater Noida, Uttar Pradesh - 201310</p>
                </div>
              </div>
              <div className="flex items-start gap-4 p-6 bg-gray-50 rounded-2xl">
                <div className="w-12 h-12 bg-teal-100 rounded-xl flex items-center justify-center shrink-0">
                  <Phone className="w-6 h-6 text-teal-600" />
                </div>
                <div>
                  <h3 className="font-semibold text-gray-900 mb-1">Phone / WhatsApp</h3>
                  <a href={`tel:${settings.phone_number.replace(/[^+\d]/g, '')}`} className="text-teal-600 font-medium hover:underline">{settings.phone_number}</a>
                </div>
              </div>
              <div className="flex items-start gap-4 p-6 bg-gray-50 rounded-2xl">
                <div className="w-12 h-12 bg-teal-100 rounded-xl flex items-center justify-center shrink-0">
                  <Clock className="w-6 h-6 text-teal-600" />
                </div>
                <div>
                  <h3 className="font-semibold text-gray-900 mb-1">Working Hours</h3>
                  <p className="text-gray-600">Mon – Sat: 10:00 AM – 9:00 PM<br />Sunday: 11:00 AM – 6:00 PM</p>
                </div>
              </div>
              <a href={settings.google_maps_url} target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-2 px-8 py-4 bg-teal-600 text-white font-semibold rounded-full hover:bg-teal-700 transition-all duration-300 group">
                Get Directions
                <ChevronRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
              </a>
            </motion.div>
            <motion.div initial={{ opacity: 0, x: 30 }} whileInView={{ opacity: 1, x: 0 }} viewport={{ once: true }} transition={{ duration: 0.6, delay: 0.2 }} className="rounded-2xl overflow-hidden shadow-xl border border-gray-200 h-[400px]">
              <iframe
                src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3502.0!2d77.5!3d28.47!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x0%3A0x0!2zMjjCsDI4JzEyLjAiTiA3N8KwMzAnMDAuMCJF!5e0!3m2!1sen!2sin!4v1234567890"
                width="100%" height="100%" style={{ border: 0 }} allowFullScreen loading="lazy" referrerPolicy="no-referrer-when-downgrade"
                title="Lamix Skin Location" className="grayscale hover:grayscale-0 transition-all duration-500"
              />
            </motion.div>
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-20 lg:py-28 bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 relative overflow-hidden">
        <div className="absolute inset-0">
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] bg-gradient-to-r from-teal-500/20 to-emerald-500/20 rounded-full blur-3xl" />
        </div>
        <motion.div initial={{ opacity: 0, y: 30 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ duration: 0.8 }} className="relative max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-white mb-6">Transform Your Device Today</h2>
          <p className="text-lg text-gray-400 mb-10 max-w-2xl mx-auto">Get premium quality skins and wraps for your devices. Visit our store to explore materials and designs.</p>
          <div className="flex flex-col sm:flex-row justify-center gap-4">
            <Link to="/pricing" className="inline-flex items-center justify-center gap-2 px-8 py-4 bg-gradient-to-r from-teal-500 to-emerald-500 text-white font-semibold rounded-full hover:shadow-2xl hover:shadow-teal-500/30 transition-all duration-300 group">
              View Pricing <ChevronRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
            </Link>
            <Link to="/contact" className="inline-flex items-center justify-center gap-2 px-8 py-4 border border-white/20 text-white font-semibold rounded-full hover:bg-white/10 transition-all duration-300">
              <MapPin className="w-5 h-5" /> Visit Our Store
            </Link>
          </div>
        </motion.div>
      </section>

      {/* Floating staff banner */}
      {staff && (
        <div className="fixed bottom-24 right-5 z-40 flex items-center gap-2 rounded-full bg-gray-900 px-4 py-2 text-xs font-bold text-white shadow-xl">
          <ShieldCheck className="h-4 w-4 text-emerald-400" /> Staff mode active
        </div>
      )}

      {/* Toast */}
      <AnimatePresence>
        {toast && (
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className={`fixed top-24 left-1/2 z-[120] -translate-x-1/2 rounded-full px-5 py-2.5 text-sm font-semibold shadow-2xl ${toast.kind === 'error' ? 'bg-red-600 text-white' : 'bg-emerald-500 text-white'}`}
          >
            {toast.kind === 'info' && <Check className="mr-2 inline h-4 w-4" />}
            {toast.msg}
          </motion.div>
        )}
      </AnimatePresence>

      {/* Stats edit modal */}
      <AnimatePresence>
        {showStatsModal && (
          <Modal title="Edit home stats" close={() => !savingStats && setShowStatsModal(false)}>
            <form onSubmit={saveStats} className="space-y-4">
              <p className="text-sm text-gray-500">Update the 4 hero numbers and labels shown above the fold.</p>
              {statsDraft.map((s, idx) => (
                <div key={s.id ?? idx} className="rounded-2xl border border-gray-200 p-4">
                  <div className="mb-2 flex items-center justify-between">
                    <span className="text-xs font-bold uppercase tracking-wider text-[#13879c]">Stat #{idx + 1}</span>
                    <select value={s.icon} onChange={(e) => updateStatDraft(idx, { icon: e.target.value })} className="rounded-lg border border-gray-200 bg-white px-2 py-1 text-xs">
                      {ICON_OPTIONS.map((o) => <option key={o.key} value={o.key}>{o.label}</option>)}
                    </select>
                  </div>
                  <div className="grid grid-cols-2 gap-3">
                    <label className="block">
                      <span className="mb-1.5 block text-xs font-bold">Value</span>
                      <input required value={s.value} onChange={(e) => updateStatDraft(idx, { value: e.target.value })} className="w-full rounded-xl border border-gray-300 px-3 py-2.5 outline-none focus:border-[#13879c]" placeholder="5000+" />
                    </label>
                    <label className="block">
                      <span className="mb-1.5 block text-xs font-bold">Label</span>
                      <input required value={s.label} onChange={(e) => updateStatDraft(idx, { label: e.target.value })} className="w-full rounded-xl border border-gray-300 px-3 py-2.5 outline-none focus:border-[#13879c]" placeholder="Happy Clients" />
                    </label>
                  </div>
                </div>
              ))}
              <button disabled={savingStats} className="flex w-full items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-orange-500 to-[#13879c] py-3.5 font-bold text-white disabled:opacity-60">
                {savingStats ? <Loader2 className="h-5 w-5 animate-spin" /> : <Save className="h-5 w-5" />}
                {savingStats ? 'Saving…' : 'Save all stats'}
              </button>
            </form>
          </Modal>
        )}

        {/* Image edit modal */}
        {editItem && (
          <Modal title="Replace image" close={() => !editSaving && (setEditItem(null), setEditImage(null))}>
            <form onSubmit={saveItemEdit}>
              <input ref={editFileRef} hidden type="file" accept="image/*" onChange={(e) => { handleEditImageFile(e.target.files?.[0]); e.currentTarget.value = ''; }} />
              {editImage ? (
                <img src={editImage.preview} className="mb-3 h-56 w-full rounded-2xl bg-gray-50 object-contain" />
              ) : (
                <div className="mb-3 flex h-56 items-center justify-center rounded-2xl bg-gray-50 text-gray-400">
                  <img src={editItem.image} className="h-full w-full rounded-2xl object-cover opacity-90" alt="" />
                </div>
              )}
              <button type="button" onClick={() => editFileRef.current?.click()} disabled={editProcessing} className="mb-5 flex w-full items-center justify-center gap-2 rounded-xl border-2 border-dashed border-[#13879c] py-3 text-sm font-bold text-[#13879c] disabled:opacity-60">
                {editProcessing ? <Loader2 className="h-4 w-4 animate-spin" /> : <Upload className="h-4 w-4" />}
                {editProcessing ? 'Optimizing…' : editImage ? 'Choose a different image' : 'Choose replacement image'}
              </button>
              <label className="block">
                <span className="mb-1.5 block text-sm font-bold">Caption</span>
                <input maxLength={140} value={editCaption} onChange={(e) => setEditCaption(e.target.value)} className="w-full rounded-xl border border-gray-300 px-3 py-2.5 outline-none focus:border-[#13879c]" placeholder="MacBook matte wrap" />
              </label>
              <button disabled={editSaving} className="mt-6 flex w-full items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-orange-500 to-[#13879c] py-3.5 font-bold text-white disabled:opacity-60">
                {editSaving ? <Loader2 className="h-5 w-5 animate-spin" /> : <Save className="h-5 w-5" />}
                {editSaving ? 'Saving…' : 'Save image'}
              </button>
            </form>
          </Modal>
        )}
      </AnimatePresence>
    </div>
  );

  function updateStatDraft(idx: number, patch: any) {
    setStatsDraft((arr) => arr.map((s, i) => i === idx ? { ...s, ...patch } : s));
  }
}

function Modal({ title, close, children }: any) {
  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} onClick={close} className="fixed inset-0 z-[100] flex items-end justify-center bg-black/65 p-0 backdrop-blur-sm sm:items-center sm:p-4">
      <motion.div initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: 20 }} onClick={(e) => e.stopPropagation()} className="max-h-[94vh] w-full max-w-lg overflow-y-auto rounded-t-3xl bg-white p-6 text-gray-900 shadow-2xl sm:rounded-3xl">
        <div className="mb-5 flex items-center justify-between">
          <h2 className="text-xl font-black">{title}</h2>
          <button onClick={close} className="rounded-full bg-gray-100 p-2"><X className="h-5 w-5" /></button>
        </div>
        {children}
      </motion.div>
    </motion.div>
  );
}
import { motion } from 'framer-motion';
import { Heart, Eye, Lightbulb, Award, Rocket, Quote, Sparkles } from 'lucide-react';
import { useSiteSettings } from '../hooks/useSiteSettings';

const VALUES = [
  { icon: Award, title: 'Precision', desc: 'Every cut is precise, every fit is perfect. We measure twice, apply once.' },
  { icon: Eye, title: 'Quality First', desc: 'We only use premium 3M vinyl materials that last years, not months.' },
  { icon: Lightbulb, title: 'Creativity', desc: 'From minimal to bold, we bring your vision to life with custom designs.' },
  { icon: Heart, title: 'Passion', desc: 'We treat every device like our own, with care and attention to detail.' },
];

const MILESTONES = [
  { year: '2022', title: 'The Beginning', desc: 'Started as a small stall at Jagat Farm market with a dream to revolutionize device protection.' },
  { year: '2023', title: 'Growing Fast', desc: 'Expanded to 100+ design options and served over 2000 happy customers across NCR.' },
  { year: '2024', title: 'Going Digital', desc: 'Launched online presence and started offering custom design services.' },
  { year: '2025', title: 'Today', desc: "Greater Noida's #1 Wrap Studio with 5000+ customers and counting!" },
];

const cardVariants = {
  hidden: { opacity: 0, y: 30 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.6 } },
};
const containerVariants = { visible: { transition: { staggerChildren: 0.1 } } };

export default function About() {
  const { settings } = useSiteSettings();
  return (
    <div className="min-h-screen bg-white">
      {/* HERO */}
      <section className="relative min-h-[70vh] flex items-center bg-gradient-to-br from-teal-600 via-teal-700 to-emerald-700 overflow-hidden">
        <div className="absolute inset-0">
          <div className="absolute top-1/4 right-1/4 w-96 h-96 bg-white/5 rounded-full blur-3xl" />
          <div className="absolute bottom-1/4 left-1/4 w-64 h-64 bg-emerald-500/10 rounded-full blur-3xl" />
          <svg className="absolute top-0 left-0 w-full h-full opacity-5" xmlns="http://www.w3.org/2000/svg">
            <defs>
              <pattern id="dots" width="30" height="30" patternUnits="userSpaceOnUse">
                <circle cx="2" cy="2" r="1" fill="white" />
              </pattern>
            </defs>
            <rect width="100%" height="100%" fill="url(#dots)" />
          </svg>
        </div>
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-24 pb-16 text-center">
          <motion.div initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.8 }}>
            <span className="inline-flex items-center gap-2 px-4 py-2 bg-white/10 border border-white/20 rounded-full text-sm text-teal-100 mb-6">
              <Heart className="w-4 h-4" /> Our Story
            </span>
            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold text-white mb-6 leading-tight">
              About <span className="text-teal-200">Lamix Skin</span>
            </h1>
            <p className="text-xl text-teal-100 max-w-3xl mx-auto leading-relaxed">
              We're not just a wrap studio — we're artists who turn everyday devices into masterpieces.
            </p>
          </motion.div>
        </div>
      </section>

      {/* STORY */}
      <section className="py-20 lg:py-28 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid lg:grid-cols-2 gap-16 items-center">
            <motion.div initial={{ opacity: 0, x: -40 }} whileInView={{ opacity: 1, x: 0 }} viewport={{ once: true }} transition={{ duration: 0.8 }}>
              <span className="inline-block px-4 py-1.5 bg-teal-50 text-teal-600 text-sm font-semibold rounded-full mb-6">Who We Are</span>
              <h2 className="text-3xl sm:text-4xl font-bold text-gray-900 mb-6 leading-snug">
                Crafted With Passion<br />at Jagat Farm
              </h2>
              <div className="space-y-4 text-gray-600 leading-relaxed">
                <p>
                  At <strong className="text-gray-900">Lamix Skin</strong>, we believe every device tells a story. Nestled in the bustling heart of <strong>Jagat Farm, Greater Noida</strong>, we've built something special — a place where technology meets artistry.
                </p>
                <p>
                  What started as a passion project has grown into Greater Noida's most trusted wrap studio. Every day, we help people express themselves through their devices — whether it's a sleek matte black MacBook wrap, a vibrant anime iPhone skin, or a custom-designed PS5 cover.
                </p>
                <p>
                  Our secret? We combine <strong className="text-teal-600">premium 3M vinyl materials</strong>, <strong className="text-teal-600">precision-cutting technology</strong>, and <strong className="text-teal-600">genuine craftsmanship</strong> to deliver results that exceed expectations.
                </p>
              </div>
            </motion.div>
            <motion.div initial={{ opacity: 0, x: 40 }} whileInView={{ opacity: 1, x: 0 }} viewport={{ once: true }} transition={{ duration: 0.8, delay: 0.2 }} className="relative">
              <div className="relative">
                <div className="absolute -inset-4 bg-gradient-to-br from-teal-500 to-emerald-500 rounded-3xl blur-2xl opacity-20" />
                <img src="https://images.unsplash.com/photo-1603302576837-375b5c6ff16c?w=600&q=80" alt="Our workshop" className="relative rounded-3xl shadow-2xl w-full object-cover aspect-[4/5]" />
                <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: 0.5 }} className="absolute -bottom-6 -right-6 bg-white rounded-2xl p-6 shadow-xl">
                  <div className="flex items-center gap-4">
                    <div className="w-14 h-14 bg-gradient-to-br from-teal-500 to-emerald-500 rounded-xl flex items-center justify-center">
                      <Award className="w-7 h-7 text-white" />
                    </div>
                    <div>
                      <div className="text-2xl font-bold text-gray-900">3+ Years</div>
                      <div className="text-sm text-gray-500">Of Excellence</div>
                    </div>
                  </div>
                </motion.div>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* VALUES */}
      <section className="py-20 lg:py-28 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div initial="hidden" whileInView="visible" viewport={{ once: true }} variants={containerVariants} className="text-center mb-16">
            <motion.span variants={cardVariants} className="inline-block px-4 py-1.5 bg-teal-50 text-teal-600 text-sm font-semibold rounded-full mb-4">Our Values</motion.span>
            <motion.h2 variants={cardVariants} className="text-3xl sm:text-4xl lg:text-5xl font-bold text-gray-900 mb-4">What Drives Us</motion.h2>
            <motion.p variants={cardVariants} className="text-lg text-gray-500 max-w-2xl mx-auto">The principles that guide everything we do</motion.p>
          </motion.div>
          <motion.div initial="hidden" whileInView="visible" viewport={{ once: true }} variants={containerVariants} className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {VALUES.map((v) => (
              <motion.div key={v.title} variants={cardVariants} whileHover={{ y: -8 }} className="group p-8 bg-white rounded-2xl border border-gray-100 hover:border-teal-200 hover:shadow-xl transition-all duration-300 text-center">
                <div className="w-16 h-16 mx-auto mb-6 bg-gradient-to-br from-teal-500 to-emerald-500 rounded-2xl flex items-center justify-center group-hover:scale-110 group-hover:rotate-3 transition-all duration-300">
                  <v.icon className="w-8 h-8 text-white" />
                </div>
                <h3 className="text-xl font-bold text-gray-900 mb-3">{v.title}</h3>
                <p className="text-gray-500 text-sm leading-relaxed">{v.desc}</p>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* TIMELINE */}
      <section className="py-20 lg:py-28 bg-white">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div initial="hidden" whileInView="visible" viewport={{ once: true }} variants={containerVariants} className="text-center mb-16">
            <motion.span variants={cardVariants} className="inline-block px-4 py-1.5 bg-orange-50 text-orange-600 text-sm font-semibold rounded-full mb-4">Our Journey</motion.span>
            <motion.h2 variants={cardVariants} className="text-3xl sm:text-4xl lg:text-5xl font-bold text-gray-900 mb-4">Milestones</motion.h2>
          </motion.div>
          <div className="relative">
            <div className="absolute left-8 md:left-1/2 top-0 bottom-0 w-0.5 bg-gradient-to-b from-teal-500 via-emerald-500 to-teal-500" />
            {MILESTONES.map((m, idx) => (
              <motion.div key={m.year} initial={{ opacity: 0, x: idx % 2 === 0 ? -30 : 30 }} whileInView={{ opacity: 1, x: 0 }} viewport={{ once: true }} transition={{ duration: 0.6, delay: idx * 0.15 }} className={`relative flex items-center mb-12 ${idx % 2 === 0 ? 'md:flex-row' : 'md:flex-row-reverse'}`}>
                <div className={`flex-1 ${idx % 2 === 0 ? 'md:text-right md:pr-12' : 'md:pl-12'}`}>
                  <div className="bg-white p-6 rounded-2xl border border-gray-100 hover:border-teal-200 hover:shadow-lg transition-all duration-300 ml-16 md:ml-0">
                    <span className="inline-block px-3 py-1 bg-teal-100 text-teal-700 text-sm font-bold rounded-full mb-2">{m.year}</span>
                    <h3 className="text-lg font-bold text-gray-900 mb-2">{m.title}</h3>
                    <p className="text-gray-500 text-sm leading-relaxed">{m.desc}</p>
                  </div>
                </div>
                <div className="absolute left-8 md:left-1/2 w-4 h-4 bg-teal-500 rounded-full border-4 border-white shadow-md -translate-x-1/2" />
                <div className="hidden md:block flex-1" />
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-20 lg:py-28 bg-gradient-to-br from-teal-600 to-emerald-600 relative overflow-hidden">
        <div className="absolute inset-0">
          <svg className="absolute top-0 left-0 w-full h-full opacity-10" xmlns="http://www.w3.org/2000/svg">
            <defs>
              <pattern id="grid2" width="40" height="40" patternUnits="userSpaceOnUse">
                <circle cx="2" cy="2" r="1" fill="white" />
              </pattern>
            </defs>
            <rect width="100%" height="100%" fill="url(#grid2)" />
          </svg>
        </div>
        <motion.div initial={{ opacity: 0, y: 30 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} className="relative max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <Quote className="w-12 h-12 text-white/30 mx-auto mb-6" />
          <blockquote className="text-2xl sm:text-3xl lg:text-4xl font-bold text-white mb-6 leading-relaxed">
            "We don't just wrap devices.<br />We wrap them with love."
          </blockquote>
          <p className="text-lg text-teal-100">— The Lamix Skin Team</p>
          <a
            href={`https://wa.me/${settings.whatsapp_number.replace(/\D/g, '')}`}
            target="_blank" rel="noopener noreferrer"
            className="inline-flex items-center gap-2 mt-10 px-8 py-4 bg-white text-teal-600 font-semibold rounded-full hover:bg-gray-100 transition-all duration-300 group"
          >
            <Rocket className="w-5 h-5" /> Start Your Project <span className="group-hover:translate-x-1 transition-transform">→</span>
          </a>
        </motion.div>
      </section>
    </div>
  );
}
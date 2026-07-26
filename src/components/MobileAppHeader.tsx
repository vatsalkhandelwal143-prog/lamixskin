import { useState } from 'react';
import { Link, NavLink, useLocation } from 'react-router-dom';
import { AnimatePresence, motion } from 'framer-motion';
import { Menu, X } from 'lucide-react';
import LamixLogo from './LamixLogo';

const LINKS = [
  { label: 'HOME', to: '/' },
  { label: 'ACTION FIGURE', to: '/products' },
  { label: 'WORK GALLERY', to: '/gallery' },
  { label: 'PRICING', to: '/pricing' },
  { label: 'SCREEN GUARD', to: '/screen-guard' },
  { label: 'ABOUT', to: '/about' },
  { label: 'VISIT & CONTACT', to: '/contact' },
];

export default function MobileAppHeader({ dark = false }: { dark?: boolean }) {
  const [open, setOpen] = useState(false);
  const { pathname } = useLocation();

  return (
    <>
      <header
        className={`sticky top-0 z-50 border-b ${
          dark ? 'border-white/10 bg-[#080808]' : 'border-gray-200 bg-white/95 backdrop-blur'
        }`}
      >
        <div className="mx-auto flex h-[82px] max-w-7xl items-end justify-between px-5 pb-4">
          <div>
            <LamixLogo size="sm" />
          </div>
          <div className="flex items-center gap-1">
            <button
              onClick={() => setOpen(true)}
              aria-label="Open menu"
              className={`rounded-xl p-2 ${dark ? 'text-white' : 'text-gray-800'}`}
            >
              <Menu className="h-6 w-6" />
            </button>
          </div>
        </div>
      </header>

      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[100] bg-black/55"
            onClick={() => setOpen(false)}
          >
            <motion.aside
              initial={{ x: '100%' }}
              animate={{ x: 0 }}
              exit={{ x: '100%' }}
              transition={{ type: 'spring', damping: 28, stiffness: 300 }}
              onClick={(e) => e.stopPropagation()}
              className="absolute right-0 top-0 h-full w-[82%] max-w-sm bg-white p-6 text-gray-900 shadow-2xl"
            >
              <div className="flex items-center justify-between">
                <LamixLogo size="sm" />
                <button onClick={() => setOpen(false)} className="rounded-full bg-gray-100 p-2">
                  <X className="h-5 w-5" />
                </button>
              </div>
              <nav className="mt-10 space-y-2">
                {LINKS.map((l) => (
                  <Link
                    key={l.to}
                    to={l.to}
                    onClick={() => setOpen(false)}
                    className={`block rounded-2xl px-5 py-4 font-bold ${
                      pathname === l.to ? 'bg-[#13879c] text-white' : 'hover:bg-gray-100'
                    }`}
                  >
                    {l.label}
                  </Link>
                ))}
              </nav>
            </motion.aside>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
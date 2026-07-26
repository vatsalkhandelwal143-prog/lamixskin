import { useEffect, useState } from 'react';
import { Link, NavLink, useLocation } from 'react-router-dom';
import { AnimatePresence, motion } from 'framer-motion';
import { Menu, X } from 'lucide-react';
import LamixLogo from './LamixLogo';

const LINKS = [
  { name: 'Home', path: '/' },
  { name: 'Action Figures', path: '/products' },
  { name: 'Screen Guard', path: '/screen-guard' },
  { name: 'Pricing', path: '/pricing' },
  { name: 'Gallery', path: '/gallery' },
  { name: 'About', path: '/about' },
  { name: 'Contact', path: '/contact' },
];

export default function Navbar() {
  const [open, setOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const location = useLocation();

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener('scroll', onScroll);
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  useEffect(() => {
    setOpen(false);
  }, [location]);

  return (
    <nav
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        scrolled ? 'bg-white/95 backdrop-blur-md shadow-lg' : 'bg-transparent'
      }`}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-20 md:h-24">
          <div className="flex items-center gap-3">
            <LamixLogo size="sm" />
          </div>
          <div className="hidden md:flex items-center gap-1">
            {LINKS.map((l) => (
              <NavLink
                key={l.path}
                to={l.path}
                className={`px-4 py-2 rounded-full text-sm font-medium transition-all duration-200 hover:bg-teal-50 ${
                  location.pathname === l.path
                    ? 'bg-teal-600 text-white shadow-md shadow-teal-600/30'
                    : scrolled || location.pathname !== '/'
                    ? 'text-gray-700 hover:text-teal-600'
                    : 'text-white/90 hover:text-white hover:bg-white/10'
                }`}
              >
                {l.name}
              </NavLink>
            ))}
          </div>
          <div className="flex items-center gap-1 md:hidden">
            <button
              onClick={() => setOpen(!open)}
              className={`p-2 rounded-lg ${scrolled || location.pathname !== '/' ? 'text-gray-700' : 'text-white'}`}
            >
              {open ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>
      </div>

      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            className="md:hidden bg-white border-t shadow-xl overflow-hidden"
          >
            <div className="p-4 space-y-1">
              {LINKS.map((l) => (
                <NavLink
                  key={l.path}
                  to={l.path}
                  className={`block px-4 py-3 rounded-xl text-base font-medium transition-all ${
                    location.pathname === l.path
                      ? 'bg-teal-50 text-teal-600 border-l-4 border-teal-600'
                      : 'text-gray-700 hover:bg-gray-50'
                  }`}
                >
                  {l.name}
                </NavLink>
              ))}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </nav>
  );
}
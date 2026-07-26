import { Link } from 'react-router-dom';
import { Instagram, Facebook, Twitter, Youtube, MapPin, Phone, Mail, ArrowUpRight } from 'lucide-react';
import LamixLogo from './LamixLogo';
import { useSiteSettings } from '../hooks/useSiteSettings';

const QUICK_LINKS = [
  { name: 'Home', path: '/' },
  { name: 'Action Figures', path: '/products' },
  { name: 'Pricing', path: '/pricing' },
  { name: 'Gallery', path: '/gallery' },
  { name: 'About Us', path: '/about' },
  { name: 'Contact', path: '/contact' },
];

const SERVICES = [
  'Laptop Skins', 'Phone Skins', 'AirPods Wraps', 'Camera Skins',
  'AC Panel Wraps', 'Guitar Skins', 'Console Skins', 'Screen Guards',
];

export default function Footer() {
  const { settings } = useSiteSettings();
  const scrollTop = () => window.scrollTo({ top: 0, behavior: 'smooth' });

  return (
    <footer className="bg-gray-950 text-gray-300">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12">
          <div>
            <div className="mb-4 inline-flex">
              <LamixLogo size="md" />
            </div>
            <p className="text-sm leading-relaxed mb-6 text-gray-400">
              Greater Noida's #1 Wrap Studio. Premium quality device skins & wraps that protect your devices in style.
            </p>
            <div className="flex gap-3">
              <a href={settings.instagram_url} target="_blank" rel="noreferrer" className="w-10 h-10 flex items-center justify-center rounded-full bg-gray-800 hover:bg-teal-600 text-gray-400 hover:text-white transition-all duration-300 hover:-translate-y-1">
                <Instagram className="w-4 h-4" />
              </a>
              <a href={settings.facebook_url} target="_blank" rel="noreferrer" className="w-10 h-10 flex items-center justify-center rounded-full bg-gray-800 hover:bg-teal-600 text-gray-400 hover:text-white transition-all duration-300 hover:-translate-y-1">
                <Facebook className="w-4 h-4" />
              </a>
              <a href={settings.twitter_url} target="_blank" rel="noreferrer" className="w-10 h-10 flex items-center justify-center rounded-full bg-gray-800 hover:bg-teal-600 text-gray-400 hover:text-white transition-all duration-300 hover:-translate-y-1">
                <Twitter className="w-4 h-4" />
              </a>
              <a href={settings.youtube_url} target="_blank" rel="noreferrer" className="w-10 h-10 flex items-center justify-center rounded-full bg-gray-800 hover:bg-teal-600 text-gray-400 hover:text-white transition-all duration-300 hover:-translate-y-1">
                <Youtube className="w-4 h-4" />
              </a>
            </div>
          </div>

          <div>
            <h3 className="text-white font-semibold mb-4">Quick Links</h3>
            <ul className="space-y-3">
              {QUICK_LINKS.map((l) => (
                <li key={l.path}>
                  <Link to={l.path} onClick={scrollTop} className="text-sm hover:text-teal-400 transition-colors flex items-center gap-1 group">
                    <ArrowUpRight className="w-3 h-3 opacity-0 group-hover:opacity-100 transition-opacity" />
                    {l.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h3 className="text-white font-semibold mb-4">Our Services</h3>
            <ul className="space-y-3 text-sm text-gray-400">
              {SERVICES.map((s) => (
                <li key={s} className="hover:text-teal-400 transition-colors cursor-pointer">{s}</li>
              ))}
            </ul>
          </div>

          <div>
            <h3 className="text-white font-semibold mb-4">Visit Our Store</h3>
            <ul className="space-y-4">
              <li className="flex items-start gap-3">
                <MapPin className="w-5 h-5 text-teal-400 mt-0.5 shrink-0" />
                <span className="text-sm">Jagat Farm Market, Greater Noida, Uttar Pradesh</span>
              </li>
              <li className="flex items-center gap-3">
                <Phone className="w-5 h-5 text-teal-400 shrink-0" />
                <a href={`tel:${settings.phone_number.replace(/[^+\d]/g, '')}`} className="text-sm hover:text-teal-400 transition-colors">
                  {settings.phone_number}
                </a>
              </li>
              <li className="flex items-center gap-3">
                <Mail className="w-5 h-5 text-teal-400 shrink-0" />
                <a href={`mailto:${settings.email_address}`} className="text-sm hover:text-teal-400 transition-colors">
                  {settings.email_address}
                </a>
              </li>
            </ul>
          </div>
        </div>
      </div>

      <div className="border-t border-gray-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 flex flex-col sm:flex-row justify-between items-center gap-4">
          <p className="text-xs text-gray-500">© 2025 Lamix Skin. All rights reserved.</p>
          <div className="flex gap-6 text-xs text-gray-500">
            <a href="#" className="hover:text-teal-400 transition-colors">Privacy Policy</a>
            <a href="#" className="hover:text-teal-400 transition-colors">Terms of Service</a>
          </div>
        </div>
      </div>
    </footer>
  );
}
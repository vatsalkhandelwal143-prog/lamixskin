import { Link, useLocation } from 'react-router-dom';
import { Home, ShoppingBag, Image, MapPin, User } from 'lucide-react';

const ITEMS = [
  { to: '/', label: 'HOME', icon: Home },
  { to: '/products', label: 'FIGURE', icon: ShoppingBag },
  { to: '/gallery', label: 'WORK', icon: Image },
  { to: '/contact', label: 'VISIT', icon: MapPin },
  { to: '/staff', label: 'PROFILE', icon: User },
];

export default function MobileBottomNav() {
  const { pathname } = useLocation();

  return (
    <nav
      aria-label="Primary bottom navigation"
      className="fixed inset-x-0 bottom-0 z-[60] mx-auto flex h-[76px] max-w-[560px] items-center justify-around rounded-t-[24px] border border-b-0 border-gray-100 bg-white/95 px-2 text-gray-600 shadow-[0_-8px_30px_rgba(0,0,0,.12)] backdrop-blur-xl"
    >
      {ITEMS.map(({ to, label, icon: Icon }) => {
        const active = to === '/' ? pathname === to : pathname.startsWith(to);
        return (
          <Link
            key={to}
            to={to}
            className={`flex min-h-[56px] min-w-14 flex-col items-center justify-center gap-1 rounded-2xl px-2 text-center text-[8px] font-bold transition ${
              active ? 'bg-cyan-50 text-[#13879c]' : 'text-gray-500 hover:bg-gray-50 hover:text-[#13879c]'
            }`}
          >
            <Icon className="h-5 w-5" fill={active ? 'currentColor' : 'none'} />
            {label}
          </Link>
        );
      })}
    </nav>
  );
}
import { Link } from 'react-router-dom';

export default function LamixLogo({ className = '', size = 'sm' }: { className?: string; size?: 'xs' | 'sm' | 'md' }) {
  const sizes = {
    xs: 'h-5',
    sm: 'h-6',
    md: 'h-8',
  };
  return (
    <Link to="/" className={`inline-flex items-center ${className}`} aria-label="Lamix Skin home">
      <img
        src="/images/lamix-logo.png"
        alt="Lamix Skin"
        className={`${sizes[size]} w-auto object-contain`}
      />
    </Link>
  );
}
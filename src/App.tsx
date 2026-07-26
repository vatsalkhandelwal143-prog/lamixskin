import { useEffect } from 'react';
import { BrowserRouter, Routes, Route, useLocation } from 'react-router-dom';
import Navbar from './components/Navbar';
import Footer from './components/Footer';
import MobileBottomNav from './components/MobileBottomNav';
import Home from './pages/Home';
import Products from './pages/Products';
import Pricing from './pages/Pricing';
import ScreenGuard from './pages/ScreenGuard';
import Gallery from './pages/Gallery';
import About from './pages/About';
import Contact from './pages/Contact';
import Staff from './pages/Staff';

function ScrollToTop() {
  const { pathname } = useLocation();
  useEffect(() => {
    window.scrollTo(0, 0);
  }, [pathname]);
  return null;
}

function App() {
  const { pathname } = useLocation();
  const isAppStyle = pathname === '/gallery' || pathname === '/contact' || pathname === '/staff' || pathname === '/screen-guard' || pathname.startsWith('/products');

  return (
    <div className="min-h-screen bg-white font-sans antialiased pb-24">
      {!isAppStyle && <Navbar />}
      <main>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/products" element={<Products />} />
          <Route path="/products/:category" element={<Products />} />
          <Route path="/screen-guard" element={<ScreenGuard />} />
          <Route path="/pricing" element={<Pricing />} />
          <Route path="/gallery" element={<Gallery />} />
          <Route path="/about" element={<About />} />
          <Route path="/contact" element={<Contact />} />
          <Route path="/staff" element={<Staff />} />
        </Routes>
      </main>
      {!isAppStyle && <Footer />}
      <MobileBottomNav />
    </div>
  );
}

export default function AppRoot() {
  return (
    <BrowserRouter>
      <ScrollToTop />
      <App />
    </BrowserRouter>
  );
}
'use client';

import { useState, useEffect } from 'react';
import { Sun, Moon, Menu, X, Leaf } from 'lucide-react';
import Link from 'next/link';
const navLinks = [
  { label: 'Find Events', href: '/events' },
  { label: 'About', href: '/about/mission' },
  { label: 'Dashboard', href: '/dashboard' },
  { label: 'Organize', href: '/organize' },
  { label: 'Contact', href: '/contact' },
  { label: 'Volunteer', href: '/volunteer' },
  { label: 'Community', href: '/community' },
  { label: 'Get Involved', href: '/get-involved' },
  { label: 'FAQs', href: '/faqs' },
];

const Header = () => {
  const [isScrolled, setIsScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => setIsScrolled(window.scrollY > 10);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <header
      className={`sticky top-0 z-50 bg-white border-b border-gray-200 transition-all ${isScrolled ? 'shadow-sm backdrop-blur' : ''}`}
    >
      <div className="container mx-auto px-4 py-2 flex items-center justify-between">
        <Link href="/" className="flex items-center font-bold text-xl gap-2">
          <Leaf size={28} color="#22c55e" />
          <span>Bloom Refresh</span>
        </Link>
        {/* Desktop Nav */}
        <nav className="hidden md:flex items-center gap-4">
          {navLinks.map((link) => (
            <Link href={link.href} key={link.href} className="px-3 py-2 rounded hover:bg-gray-100 text-sm font-medium transition-colors">
              {link.label}
            </Link>
          ))}
          <Link href="/signup" className="ml-2">
            <button className="bg-green-500 text-white px-4 py-2 rounded text-sm font-semibold hover:bg-green-600 transition-colors">Sign Up</button>
          </Link>
          <Link href="/login" className="ml-2">
            <button className="border border-gray-300 px-4 py-2 rounded text-sm font-semibold hover:bg-gray-100 transition-colors">Log In</button>
          </Link>
        </nav>
        {/* Mobile Nav */}
        <button
          aria-label="Open menu"
          className="flex md:hidden p-2 rounded hover:bg-gray-100 transition-colors"
          onClick={() => setMobileMenuOpen(true)}
        >
          <Menu size={24} />
        </button>
      </div>
      {/* Mobile Drawer */}
      {mobileMenuOpen && (
        <div className="fixed inset-0 z-[1000] bg-white flex flex-col p-4 shadow-lg animate-in fade-in">
          <div className="flex justify-end">
            <button aria-label="Close menu" className="p-2 rounded hover:bg-gray-100" onClick={() => setMobileMenuOpen(false)}>
              <X size={24} />
            </button>
          </div>
          <nav className="flex flex-col gap-2 mt-4">
            {navLinks.map((link) => (
              <Link href={link.href} key={link.href} onClick={() => setMobileMenuOpen(false)} className="px-3 py-2 rounded hover:bg-gray-100 text-base font-medium transition-colors">
                {link.label}
              </Link>
            ))}
             <Link href="/signup" onClick={() => setMobileMenuOpen(false)} className="mt-2">
              <button className="bg-green-500 text-white w-full px-4 py-2 rounded text-base font-semibold hover:bg-green-600 transition-colors">Sign Up</button>
            </Link>
            <Link href="/login" onClick={() => setMobileMenuOpen(false)} className="mt-2">
              <button className="border border-gray-300 w-full px-4 py-2 rounded text-base font-semibold hover:bg-gray-100 transition-colors">Log In</button>
            </Link>
          </nav>
        </div>
      )}
    </header>
  );
};

export default Header;
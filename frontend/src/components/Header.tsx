'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';

export const Header = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 50);
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const navLinks = [
    { label: 'Accueil', href: '/' },
    { label: 'À propos', href: '/about' },
    { label: 'Programmes', href: '/programs' },
    { label: 'Activités', href: '/activities' },
    { label: 'Admissions', href: '/admissions' },
    { label: 'Contact', href: '/contact' }
  ];

  return (
    <header className={`fixed w-full top-0 z-50 transition-all duration-500 ${
      scrolled 
        ? 'bg-white/95 backdrop-blur-xl border-b border-slate-200 shadow-sm py-3' 
        : 'bg-transparent py-5'
    }`}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center">
          {/* Logo */}
          <Link href="/" className="flex items-center gap-3 group hover:opacity-80 transition">
            <div className={`relative w-12 h-12 flex items-center justify-center overflow-hidden rounded-xl transition-all ${
              scrolled ? 'bg-white shadow-md' : 'bg-white/10 backdrop-blur-md border border-white/20'
            }`}>
              <img src="/logo.PNG" alt="CLF" className="w-full h-full object-contain p-1" />
            </div>
            <div className="hidden md:block">
              <h1 className="text-lg font-bold text-slate-900">Collège Le Flambeau</h1>
              <p className="text-xs font-semibold tracking-wide text-[#D32D3F]">Une École, Une Vision</p>
            </div>
          </Link>

          {/* Desktop Navigation */}
          <nav className={`hidden lg:flex items-center gap-8 px-8 py-3 rounded-full border transition-all duration-500 ${
            scrolled 
              ? 'bg-white/80 backdrop-blur-md border-slate-100 shadow-sm' 
              : 'bg-white/5 backdrop-blur-sm border-white/10'
          }`}>
            {navLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className={`font-semibold transition relative text-sm group ${
                  scrolled ? 'text-slate-600 hover:text-[#D32D3F]' : 'text-slate-700 hover:text-[#D32D3F]'
                }`}
              >
                {link.label}
                <span className="absolute -bottom-1 left-1/2 -translate-x-1/2 w-1 h-1 bg-[#D32D3F] rounded-full opacity-0 group-hover:opacity-100 transition-all duration-300 transform group-hover:scale-150"></span>
              </Link>
            ))}
          </nav>

          {/* CTA Button & Mobile Menu */}
          <div className="flex items-center gap-4">
            <Link 
              href="/login" 
              className={`hidden md:inline-flex items-center gap-2 px-6 py-2.5 font-bold rounded-full transition-all duration-300 transform hover:scale-105 text-sm shadow-md ${
                scrolled 
                  ? 'bg-[#D32D3F] text-white hover:bg-[#8B1A26] hover:shadow-[#D32D3F]/30' 
                  : 'bg-white/10 backdrop-blur-md text-[#D32D3F] border border-white/20 hover:bg-white/20'
              }`}
            >
              Accès Portail
            </Link>

            {/* Mobile Menu Button */}
            <button 
              onClick={() => setIsOpen(!isOpen)}
              className={`lg:hidden p-2 rounded-lg transition duration-300 ${
                scrolled ? 'text-slate-800 hover:bg-slate-100' : 'text-slate-800 bg-white/80 hover:bg-white'
              }`}
            >
              <svg 
                className={`w-6 h-6 transition-transform duration-300 ${isOpen ? 'rotate-90' : ''}`}
                fill="none" 
                stroke="currentColor" 
                viewBox="0 0 24 24"
              >
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d={isOpen ? "M6 18L18 6M6 6l12 12" : "M4 6h16M4 12h16M4 18h16"} />
              </svg>
            </button>
          </div>
        </div>

        {/* Mobile Navigation */}
        <div className={`lg:hidden overflow-hidden transition-all duration-300 ${
          isOpen ? 'max-h-96 opacity-100 mt-4' : 'max-h-0 opacity-0'
        }`}>
          <nav className="bg-white rounded-2xl shadow-xl border border-slate-100 p-4 flex flex-col gap-2">
            {navLinks.map((link) => (
              <Link 
                key={link.href}
                href={link.href}
                className="px-4 py-3 text-slate-700 hover:bg-[#FFF8E7] hover:text-[#D32D3F] rounded-xl transition duration-300 font-semibold text-sm"
                onClick={() => setIsOpen(false)}
              >
                {link.label}
              </Link>
            ))}
            <Link 
              href="/login" 
              className="mt-2 text-center px-4 py-3 bg-[#D32D3F] text-white rounded-xl font-bold hover:bg-[#8B1A26] transition duration-300 text-sm shadow-md"
              onClick={() => setIsOpen(false)}
            >
              Accès Portail
            </Link>
          </nav>
        </div>
      </div>
    </header>
  );
};

export default Header;

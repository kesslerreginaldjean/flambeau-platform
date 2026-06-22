'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';

export const Header = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 8);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const navLinks = [
    { label: 'Accueil', href: '/' },
    { label: 'À propos', href: '/about' },
    { label: 'Programmes', href: '/programs' },
    { label: 'Activités', href: '/activities' },
    { label: 'Admissions', href: '/admissions' },
    { label: 'Contact', href: '/contact' },
  ];

  return (
    <header
      className={`fixed w-full top-0 z-50 bg-paper transition-[border-color] duration-300 ${
        scrolled ? 'border-b border-line' : 'border-b border-transparent'
      }`}
    >
      <div className="container">
        <div className="flex items-center justify-between" style={{ height: 'calc(var(--lh) * 3.5)' }}>
          {/* Logo */}
          <Link href="/" className="flex items-center gap-3 hover:opacity-70 transition-opacity">
            <div className="w-10 h-10 flex items-center justify-center border border-line bg-paper">
              <img src="/logo.PNG" alt="CLF" className="w-full h-full object-contain p-1" />
            </div>
            <div className="hidden md:block leading-none">
              <h1 className="text-base font-semibold tracking-tight text-ink">Collège Le Flambeau</h1>
              <p className="kicker mt-1">Une École · Une Vision</p>
            </div>
          </Link>

          {/* Desktop Navigation */}
          <nav className="hidden lg:flex items-center gap-8">
            {navLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className="mono text-xs uppercase tracking-widest text-soft hover:text-ink transition-colors"
              >
                {link.label}
              </Link>
            ))}
          </nav>

          {/* CTA + Mobile toggle */}
          <div className="flex items-center gap-4">
            <Link href="/login" className="hidden md:inline-flex btn-accent">
              Accès Portail
            </Link>

            <button
              onClick={() => setIsOpen(!isOpen)}
              aria-label="Menu"
              className="lg:hidden w-10 h-10 flex items-center justify-center border border-line text-ink hover:bg-ink hover:text-paper transition-colors"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d={isOpen ? 'M6 18L18 6M6 6l12 12' : 'M4 6h16M4 12h16M4 18h16'}
                />
              </svg>
            </button>
          </div>
        </div>

        {/* Mobile Navigation */}
        {isOpen && (
          <nav className="lg:hidden border-t border-line py-4 flex flex-col">
            {navLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className="mono text-xs uppercase tracking-widest text-soft hover:text-ink py-3 border-b border-line"
                onClick={() => setIsOpen(false)}
              >
                {link.label}
              </Link>
            ))}
            <Link href="/login" className="btn-accent mt-4" onClick={() => setIsOpen(false)}>
              Accès Portail
            </Link>
          </nav>
        )}
      </div>
    </header>
  );
};

export default Header;

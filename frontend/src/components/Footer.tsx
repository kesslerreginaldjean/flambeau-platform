'use client';

import Link from 'next/link';

export const Footer = () => {
  const cols = [
    {
      head: 'Navigation',
      links: [
        { label: 'Accueil', href: '/' },
        { label: 'À propos', href: '/about' },
        { label: 'Programmes', href: '/programs' },
        { label: 'Admissions', href: '/admissions' },
      ],
    },
    {
      head: 'Vie scolaire',
      links: [
        { label: 'Activités & clubs', href: '/activities' },
        { label: 'Contact', href: '/contact' },
        { label: 'Accès portail', href: '/login' },
      ],
    },
    {
      head: 'Réseaux sociaux',
      links: [
        { label: 'Facebook', href: 'https://www.facebook.com/profile.php?id=61581483637615', external: true },
        { label: 'Instagram', href: 'https://www.instagram.com/college_le_flambeau/', external: true },
        { label: 'TikTok', href: 'https://www.tiktok.com/@college_le_flambeau', external: true },
      ],
    },
  ];

  return (
    <footer>
      <div className="container" style={{ paddingTop: 'calc(var(--lh) * 3)', paddingBottom: 'calc(var(--lh) * 2)' }}>
        <div className="swiss-grid">
          {/* Institution */}
          <div className="col-span-12 md:col-span-6">
            <div className="flex items-center gap-3 mb-6">
              <div className="w-10 h-10 bg-paper flex items-center justify-center p-1">
                <img src="/logo.PNG" alt="CLF" className="w-full h-full object-contain" />
              </div>
              <span className="text-lg font-semibold tracking-tight">Collège Le Flambeau</span>
            </div>
            <p className="text-sm text-white/60 max-w-sm leading-relaxed">
              « Mieux choisir pour réussir ». Une institution d’excellence dédiée à la
              formation intégrale de la jeunesse haïtienne.
            </p>
          </div>

          {cols.map((c) => (
            <nav key={c.head} className="col-span-6 md:col-span-2">
              <p className="kicker mb-5" style={{ color: 'rgba(255,255,255,.5)' }}>{c.head}</p>
              <ul className="space-y-3">
                {c.links.map((l) => (
                  <li key={l.href}>
                    {l.external ? (
                      <a href={l.href} target="_blank" rel="noopener noreferrer" className="text-sm text-white/60 hover:text-paper transition-colors">
                        {l.label}
                      </a>
                    ) : (
                      <Link href={l.href} className="text-sm text-white/60 hover:text-paper transition-colors">
                        {l.label}
                      </Link>
                    )}
                  </li>
                ))}
              </ul>
            </nav>
          ))}
        </div>

        {/* Contact line */}
        <div className="swiss-grid mt-12 pt-8" style={{ borderTop: '1px solid rgba(255,255,255,.12)' }}>
          <p className="col-span-12 md:col-span-6 mono text-xs text-white/50">
            #11, Delmas 31, Rue Alexandre Dumas — Port-au-Prince
          </p>
          <p className="col-span-6 md:col-span-3 mono text-xs text-white/50">+509 37347021</p>
          <p className="col-span-6 md:col-span-3 mono text-xs text-white/50">collegeleflambeaumedia@gmail.com</p>
        </div>

        {/* Bottom rule */}
        <div className="mt-12 pt-6 flex flex-col md:flex-row justify-between gap-3" style={{ borderTop: '1px solid rgba(255,255,255,.12)' }}>
          <p className="mono text-xs uppercase tracking-widest text-white/40">
            © 2026 Collège Le Flambeau
          </p>
          <div className="flex gap-8">
            <a href="#" className="mono text-xs uppercase tracking-widest text-white/40 hover:text-paper transition-colors">Mentions légales</a>
            <a href="#" className="mono text-xs uppercase tracking-widest text-white/40 hover:text-paper transition-colors">Confidentialité</a>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;

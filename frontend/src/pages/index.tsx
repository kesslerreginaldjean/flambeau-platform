'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { motion } from 'framer-motion';
import HeroSection from '@/components/HeroSection';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import SEO from '@/components/SEO';
import Counter from '@/components/Counter';
import FadeIn from '@/components/FadeIn';
import { AnnouncementModal } from '@/components/AnnouncementModal';
import { ArrowRight, Quote, GraduationCap, Sparkles } from 'lucide-react';

export default function Home() {
  const [isAnnouncementOpen, setIsAnnouncementOpen] = useState(false);

  useEffect(() => {
    // Initial popup
    const initialTimer = setTimeout(() => {
      setIsAnnouncementOpen(true);
    }, 2000);

    // Repeated popup every 2 minutes (120000 ms)
    const intervalTimer = setInterval(() => {
      setIsAnnouncementOpen(true);
    }, 120000);

    return () => {
      clearTimeout(initialTimer);
      clearInterval(intervalTimer);
    };
  }, []);

  const values = [
    { n: '01', title: 'Discipline', desc: 'Un cadre rigoureux pour forger le caractère.', img: '/images/gallery/img_6022_2.jpg' },
    { n: '02', title: 'Excellence', desc: 'La quête perpétuelle du meilleur de soi-même.', img: '/images/gallery/img_5905_2.jpg' },
    { n: '03', title: 'Intégrité', desc: 'L’honnêteté au cœur de chaque action.', img: '/images/gallery/img_5920_2.jpg' },
    { n: '04', title: 'Innovation', desc: 'S’adapter aux défis du monde moderne.', img: '/images/gallery/img_5413.jpg' },
  ];

  const cycles = [
    {
      n: '01',
      title: 'Le Jardin Vert de Cassandre',
      description:
        'Trois années d’éveil ludique et éducatif pour les tout-petits : initiation au dessin, à la lecture et à la créativité.',
      details: ['3 années d’éveil', 'Apprentissage de la lecture', 'Ateliers de dessin'],
      img: '/images/activity_workshop.jpg',
    },
    {
      n: '02',
      title: 'Cycle Fondamental',
      description:
        'Une base solide de la 1ʳᵉ à la 9ᵉ année fondamentale, axée sur la maîtrise des connaissances de base.',
      details: ['De la 1ʳᵉ à la 6ᵉ AF', 'De la 7ᵉ à la 9ᵉ AF', 'Suivi pédagogique rigoureux'],
      img: '/images/gallery/img_5911_2.jpg',
    },
    {
      n: '03',
      title: 'Nouveau Secondaire',
      description:
        'Préparation intensive du NS1 au NS4 (Terminale) pour la réussite au Baccalauréat Unique.',
      details: ['De NS1 à NS3', 'NS4, classe de Terminale', 'Spécialisations académiques'],
      img: '/images/gallery/img_5883_2.jpg',
    },
  ];

  const stats = [
    { number: 250, suffix: '+', label: 'Étudiants' },
    { number: 40, suffix: '+', label: 'Personnel' },
    { number: 25, suffix: '+', label: 'Professeurs' },
    { number: 95, suffix: '%', label: 'Réussite' },
  ];

  const gallery = [
    { src: '/images/gallery/img_5817.jpg', label: 'Gala annuel' },
    { src: '/images/gallery/img_8324.jpg', label: 'Cérémonies' },
    { src: '/images/gallery/img_5911_2.jpg', label: 'Vie étudiante' },
    { src: '/images/gallery/img_5437.jpg', label: 'Jardin Vert' },
  ];

  return (
    <div className="min-h-screen flex flex-col bg-paper">
      <SEO
        title="Accueil"
        description="Bienvenue au Collège Le Flambeau, une institution d'excellence dédiée à la formation des citoyens de demain en Haïti."
      />
      <Header />
      <AnnouncementModal isOpen={isAnnouncementOpen} onClose={() => setIsAnnouncementOpen(false)} />

      <main className="flex-1">
        <HeroSection />

        {/* Presentation — asymmetric, image-led */}
        <section className="border-b border-line" style={{ paddingBlock: 'calc(var(--lh) * 4)' }}>
          <div className="container">
            <div className="swiss-grid items-center">
              <FadeIn direction="right" className="col-span-12 lg:col-span-6">
                <p className="kicker mb-4">Bienvenue au Flambeau</p>
                <h2 className="text-ink mb-6">Former les citoyens de demain.</h2>
                <p className="text-soft text-lg max-w-lg">
                  Le Collège Le Flambeau offre un cadre d’apprentissage d’exception où l’excellence
                  académique rencontre la rigueur morale, une institution dédiée au succès de chaque enfant.
                </p>
                <Link
                  href="/about"
                  className="inline-flex items-center gap-2 mono text-sm uppercase tracking-widest text-accent border-b border-accent pb-1 mt-8 hover:gap-3 transition-all"
                >
                  En savoir plus sur notre mission <ArrowRight className="w-4 h-4" />
                </Link>
              </FadeIn>

              <FadeIn direction="left" className="col-span-12 lg:col-span-6">
                <div className="relative overflow-hidden rounded-lg border border-line group">
                  <motion.img
                    src="/images/gallery/img_6013_2.jpg"
                    alt="Collège Le Flambeau"
                    className="w-full object-cover"
                    style={{ height: 'calc(var(--lh) * 17)' }}
                    initial={{ scale: 1.08 }}
                    whileInView={{ scale: 1 }}
                    viewport={{ once: true }}
                    transition={{ duration: 1.1, ease: [0.21, 0.47, 0.32, 0.98] }}
                  />
                  <div className="absolute bottom-4 left-4 px-4 py-2 rounded-lg border border-line" style={{ background: 'rgba(255,255,255,.95)', backdropFilter: 'blur(4px)' }}>
                    <p className="mono text-xs uppercase tracking-widest text-ink">Campus · Port-au-Prince</p>
                  </div>
                </div>
              </FadeIn>
            </div>
          </div>
        </section>

        {/* Values — image cards with hover lift */}
        <section className="border-b border-line bg-panel" style={{ paddingBlock: 'calc(var(--lh) * 4)' }}>
          <div className="container">
            <FadeIn>
              <p className="kicker mb-4">Nos valeurs</p>
              <h2 className="text-ink mb-12 max-w-2xl">Les piliers de notre éducation</h2>
            </FadeIn>

            <div className="swiss-grid">
              {values.map((v, i) => (
                <FadeIn key={v.n} delay={i * 0.08} className="col-span-12 sm:col-span-6 lg:col-span-3">
                  <motion.div
                    whileHover={{ y: -6 }}
                    transition={{ type: 'spring', stiffness: 300, damping: 22 }}
                    className="bg-paper border border-line rounded-lg overflow-hidden h-full group"
                  >
                    <div className="relative overflow-hidden" style={{ height: 'calc(var(--lh) * 7)' }}>
                      <img
                        src={v.img}
                        alt={v.title}
                        className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                      />
                      <span className="numeral text-paper absolute top-3 left-3 text-2xl drop-shadow">{v.n}</span>
                    </div>
                    <div className="p-5">
                      <h3 className="text-ink mb-2 text-xl group-hover:text-accent transition-colors">{v.title}</h3>
                      <p className="text-soft text-sm">{v.desc}</p>
                    </div>
                  </motion.div>
                </FadeIn>
              ))}
            </div>
          </div>
        </section>

        {/* Cycles — image header + hover */}
        <section className="border-b border-line" style={{ paddingBlock: 'calc(var(--lh) * 4)' }}>
          <div className="container">
            <FadeIn>
              <p className="kicker mb-4">Nos niveaux d’études</p>
              <h2 className="text-ink mb-12 max-w-3xl">
                Un parcours complet, de la maternelle au baccalauréat
              </h2>
            </FadeIn>

            <div className="swiss-grid">
              {cycles.map((c, i) => (
                <FadeIn key={c.n} delay={i * 0.1} className="col-span-12 md:col-span-4">
                  <motion.div
                    whileHover={{ y: -6 }}
                    transition={{ type: 'spring', stiffness: 300, damping: 22 }}
                    className="bg-paper border border-line rounded-lg overflow-hidden h-full flex flex-col group"
                  >
                    <div className="relative overflow-hidden" style={{ height: 'calc(var(--lh) * 9)' }}>
                      <img src={c.img} alt={c.title} className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105" />
                      <div className="absolute inset-0" style={{ background: 'linear-gradient(to top, rgba(17,19,21,.78), rgba(17,19,21,0))' }} />
                      <span className="numeral text-paper absolute bottom-3 left-4 text-3xl">{c.n}</span>
                    </div>
                    <div className="p-6 flex flex-col flex-1">
                      <h3 className="text-ink mb-3">{c.title}</h3>
                      <p className="text-soft text-sm mb-6">{c.description}</p>
                      <ul className="space-y-2 mb-6 flex-1">
                        {c.details.map((d) => (
                          <li key={d} className="mono text-xs uppercase tracking-wider text-soft flex gap-2">
                            <span className="text-accent">—</span>
                            {d}
                          </li>
                        ))}
                      </ul>
                      <Link
                        href="/programs"
                        className="inline-flex items-center gap-2 mono text-xs uppercase tracking-widest text-accent hover:gap-3 transition-all"
                      >
                        Découvrir le programme <ArrowRight className="w-3 h-3" />
                      </Link>
                    </div>
                  </motion.div>
                </FadeIn>
              ))}
            </div>
          </div>
        </section>

        {/* Vie scolaire — gallery strip with hover zoom */}
        <section className="border-b border-line" style={{ paddingBlock: 'calc(var(--lh) * 4)' }}>
          <div className="container">
            <FadeIn className="flex items-end justify-between mb-12 gap-6">
              <div>
                <p className="kicker mb-4 flex items-center gap-2"><Sparkles className="w-4 h-4" /> Vie scolaire</p>
                <h2 className="text-ink max-w-xl">Une communauté vivante et engagée</h2>
              </div>
              <Link href="/activities" className="hidden md:inline-flex btn-secondary">Toutes les activités</Link>
            </FadeIn>

            <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
              {gallery.map((g, i) => (
                <FadeIn key={g.src} delay={i * 0.08}>
                  <div className="relative overflow-hidden rounded-lg border border-line group" style={{ height: 'calc(var(--lh) * 14)' }}>
                    <img src={g.src} alt={g.label} className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110" />
                    <div className="absolute inset-0" style={{ background: 'linear-gradient(to top, rgba(17,19,21,.85), rgba(17,19,21,.1) 55%, rgba(17,19,21,0))' }} />
                    <p className="absolute bottom-4 left-4 right-4 text-paper font-semibold text-lg leading-tight">{g.label}</p>
                  </div>
                </FadeIn>
              ))}
            </div>
          </div>
        </section>

        {/* Statistics — large numerals on ink */}
        <section style={{ background: 'var(--ink)', paddingBlock: 'calc(var(--lh) * 4)' }}>
          <div className="container">
            <FadeIn><p className="kicker mb-12" style={{ color: 'var(--accent)' }}>En chiffres</p></FadeIn>
            <div className="swiss-grid">
              {stats.map((s, i) => (
                <FadeIn key={s.label} delay={i * 0.1} className="col-span-6 lg:col-span-3">
                  <div style={{ borderTop: '1px solid rgba(255,255,255,.2)', paddingTop: 'var(--bl)' }}>
                    <p className="numeral text-paper" style={{ fontSize: 'clamp(3rem, 6vw, 5rem)' }}>
                      <Counter to={s.number} suffix={s.suffix} />
                    </p>
                    <p className="mono text-xs uppercase tracking-widest text-white/50 mt-3">{s.label}</p>
                  </div>
                </FadeIn>
              ))}
            </div>
          </div>
        </section>

        {/* Mot du fondateur — portrait + citation */}
        <section className="border-b border-line bg-panel" style={{ paddingBlock: 'calc(var(--lh) * 4)' }}>
          <div className="container">
            <div className="swiss-grid items-center">
              <FadeIn direction="right" className="col-span-12 md:col-span-5 lg:col-span-4">
                <div className="relative overflow-hidden rounded-lg border border-line">
                  <img src="/images/directeur_fondateur.jpg" alt="Directeur fondateur" className="w-full object-cover" style={{ height: 'calc(var(--lh) * 20)' }} />
                </div>
              </FadeIn>
              <FadeIn direction="left" className="col-span-12 md:col-span-7 lg:col-span-8">
                <Quote className="w-12 h-12 text-accent mb-6" />
                <p className="text-ink text-2xl md:text-3xl font-semibold leading-snug max-w-2xl">
                  « Notre mission est de former des femmes et des hommes de caractère, prêts à éclairer
                  leur communauté par le savoir et l’intégrité. »
                </p>
                <div className="mt-8 flex items-center gap-3">
                  <GraduationCap className="w-5 h-5 text-accent" />
                  <div>
                    <p className="font-semibold text-ink">Le Directeur Fondateur</p>
                    <p className="mono text-xs uppercase tracking-widest text-soft mt-1">Collège Le Flambeau</p>
                  </div>
                </div>
              </FadeIn>
            </div>
          </div>
        </section>

        {/* CTA — image background */}
        <section className="relative overflow-hidden" style={{ paddingBlock: 'calc(var(--lh) * 6)' }}>
          <img src="/images/school_facade_close.jpg" alt="" className="absolute inset-0 w-full h-full object-cover" />
          <div className="absolute inset-0" style={{ background: 'rgba(17,19,21,.85)' }} />
          <div className="container relative">
            <FadeIn className="max-w-2xl">
              <p className="kicker mb-4" style={{ color: 'var(--accent)' }}>Admissions 2026–2027</p>
              <h2 className="text-paper">Prêt à rejoindre l’excellence ?</h2>
              <p className="text-white/70 text-lg max-w-xl mt-6">
                Offrez à votre enfant une éducation d’exception dans un cadre sécurisé et stimulant.
                Les admissions sont ouvertes.
              </p>
              <div className="flex flex-col sm:flex-row gap-3 mt-10">
                <Link href="/admissions" className="btn-accent">Demander une admission</Link>
                <Link href="/suivi" className="btn-secondary" style={{ color: 'var(--paper)', borderColor: 'var(--paper)' }}>Suivre mon dossier</Link>
              </div>
            </FadeIn>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
}

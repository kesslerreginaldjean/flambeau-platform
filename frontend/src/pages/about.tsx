'use client';

import { motion } from 'framer-motion';
import Link from 'next/link';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import SEO from '@/components/SEO';
import FadeIn from '@/components/FadeIn';
import { ArrowRight, Quote, GraduationCap, Sparkles } from 'lucide-react';

export default function About() {
  const values = [
    { n: '01', title: 'Excellence', text: 'La recherche permanente de la qualité dans tout ce que nous entreprenons.', img: '/images/school_vision.jpg' },
    { n: '02', title: 'Discipline', text: 'Le respect des règles et de soi-même comme moteur de progrès constant.', img: '/images/school_values.jpg' },
    { n: '03', title: 'Intégrité', text: 'L\'honnêteté et la transparence au cœur de notre communauté scolaire.', img: '/images/activity_students.jpg' },
  ];

  const pillars = [
    { src: '/images/activity_conference.jpg', label: 'Vie académique' },
    { src: '/images/activity_workshop.jpg', label: 'Ateliers' },
    { src: '/images/activity_gala.jpg', label: 'Célébrations' },
    { src: '/images/school_facade_close.jpg', label: 'Notre campus' },
  ];

  return (
    <div className="min-h-screen flex flex-col bg-paper">
      <SEO
        title="À propos"
        description="Découvrez l'histoire, la vision et les valeurs du Collège Le Flambeau. Une institution d'excellence dédiée à la formation de l'élite de demain."
      />
      <Header />

      <main className="flex-1">
        {/* Hero — masthead over image */}
        <section className="relative overflow-hidden border-b border-line">
          <img
            src="/images/school_facade_wide.jpg"
            alt="Collège Le Flambeau"
            className="absolute inset-0 w-full h-full object-cover"
          />
          <div
            className="absolute inset-0"
            style={{ background: 'linear-gradient(to top, rgba(17,19,21,.9), rgba(17,19,21,.6))' }}
          />
          <div className="container relative" style={{ paddingBlock: 'calc(var(--lh) * 5)' }}>
            <FadeIn>
              <p className="kicker mb-6" style={{ color: 'var(--accent)' }}>Notre Institution</p>
              <h1 className="text-paper max-w-4xl">
                Porter haut le flambeau
                <br />
                <span className="text-accent">de la connaissance.</span>
              </h1>
              <hr
                className="rule mt-8"
                style={{ maxWidth: '96px', borderTopWidth: '3px', borderTopColor: 'var(--accent)' }}
              />
            </FadeIn>
          </div>
        </section>

        {/* Story — asymmetric, image-led */}
        <section className="border-b border-line" style={{ paddingBlock: 'calc(var(--lh) * 4)' }}>
          <div className="container">
            <div className="swiss-grid items-center">
              <FadeIn direction="right" className="col-span-12 lg:col-span-6">
                <p className="kicker mb-4">Notre histoire</p>
                <h2 className="text-ink mb-6">
                  Une tradition de discipline et d’excellence
                </h2>
                <p className="text-soft text-lg max-w-lg">
                  Fondé avec la vision de transformer l’éducation en Haïti, le Collège Le Flambeau s’est
                  imposé comme une institution de référence. Nous croyons que la réussite académique est
                  indissociable d’une discipline de fer et de valeurs morales solides.
                </p>
                <div className="swiss-grid mt-10">
                  <div className="col-span-6 border-t border-ink pt-4">
                    <span className="numeral text-accent text-4xl">1998</span>
                    <p className="mono text-xs uppercase tracking-widest text-soft mt-3">Fondation</p>
                  </div>
                  <div className="col-span-6 border-t border-ink pt-4">
                    <span className="numeral text-accent text-4xl">10k+</span>
                    <p className="mono text-xs uppercase tracking-widest text-soft mt-3">Diplômés</p>
                  </div>
                </div>
                <Link
                  href="/admissions"
                  className="inline-flex items-center gap-2 mono text-sm uppercase tracking-widest text-accent border-b border-accent pb-1 mt-10 hover:gap-3 transition-all"
                >
                  Rejoindre notre histoire <ArrowRight className="w-4 h-4" />
                </Link>
              </FadeIn>

              <FadeIn direction="left" className="col-span-12 lg:col-span-6">
                <figure>
                  <div className="relative overflow-hidden rounded-lg border border-line group">
                    <motion.img
                      src="/images/school_facade_wide.jpg"
                      alt="Collège Le Flambeau"
                      className="w-full object-cover"
                      style={{ height: 'calc(var(--lh) * 16)' }}
                      initial={{ scale: 1.08 }}
                      whileInView={{ scale: 1 }}
                      viewport={{ once: true }}
                      transition={{ duration: 1.1, ease: [0.21, 0.47, 0.32, 0.98] }}
                    />
                    <div
                      className="absolute bottom-4 left-4 px-4 py-2 rounded-lg border border-line"
                      style={{ background: 'rgba(255,255,255,.95)', backdropFilter: 'blur(4px)' }}
                    >
                      <p className="mono text-xs uppercase tracking-widest text-ink">Campus · Port-au-Prince</p>
                    </div>
                  </div>
                  <figcaption className="mono text-xs text-soft mt-2 flex justify-between">
                    <span>Fig. 01 — Façade</span>
                    <span>Port-au-Prince</span>
                  </figcaption>
                </figure>
              </FadeIn>
            </div>
          </div>
        </section>

        {/* Vision & Mission — image-paired columns */}
        <section className="border-b border-line bg-panel" style={{ paddingBlock: 'calc(var(--lh) * 4)' }}>
          <div className="container">
            <FadeIn>
              <p className="kicker mb-12">Vision &amp; Mission</p>
            </FadeIn>
            <div className="swiss-grid">
              <FadeIn direction="up" delay={0.1} className="col-span-12 md:col-span-6">
                <motion.div
                  whileHover={{ y: -6 }}
                  transition={{ type: 'spring', stiffness: 300, damping: 22 }}
                  className="bg-paper border border-line rounded-lg overflow-hidden h-full group"
                >
                  <div className="relative overflow-hidden" style={{ height: 'calc(var(--lh) * 9)' }}>
                    <img
                      src="/images/school_vision.jpg"
                      alt="Notre Vision"
                      className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                    />
                    <div className="absolute inset-0" style={{ background: 'linear-gradient(to top, rgba(17,19,21,.78), rgba(17,19,21,0))' }} />
                    <span className="numeral text-paper absolute bottom-3 left-4 text-3xl">01</span>
                  </div>
                  <div className="p-6">
                    <h3 className="text-ink mb-4 group-hover:text-accent transition-colors">Notre Vision</h3>
                    <p className="text-soft text-lg max-w-md">
                      Être le leader de l’éducation moderne en Haïti, en intégrant les technologies de pointe
                      tout en préservant les fondements d’une éducation classique et rigoureuse.
                    </p>
                  </div>
                </motion.div>
              </FadeIn>

              <FadeIn direction="up" delay={0.2} className="col-span-12 md:col-span-6">
                <motion.div
                  whileHover={{ y: -6 }}
                  transition={{ type: 'spring', stiffness: 300, damping: 22 }}
                  className="bg-paper border border-line rounded-lg overflow-hidden h-full group"
                >
                  <div className="relative overflow-hidden" style={{ height: 'calc(var(--lh) * 9)' }}>
                    <img
                      src="/images/school_values.jpg"
                      alt="Notre Mission"
                      className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                    />
                    <div className="absolute inset-0" style={{ background: 'linear-gradient(to top, rgba(17,19,21,.78), rgba(17,19,21,0))' }} />
                    <span className="numeral text-paper absolute bottom-3 left-4 text-3xl">02</span>
                  </div>
                  <div className="p-6">
                    <h3 className="text-ink mb-4 group-hover:text-accent transition-colors">Notre Mission</h3>
                    <p className="text-soft text-lg max-w-md">
                      Offrir à chaque apprenant les outils nécessaires pour son plein épanouissement
                      intellectuel, physique et moral dans un environnement d’apprentissage d’excellence.
                    </p>
                  </div>
                </motion.div>
              </FadeIn>
            </div>
          </div>
        </section>

        {/* Values — image cards with hover lift */}
        <section className="border-b border-line" style={{ paddingBlock: 'calc(var(--lh) * 4)' }}>
          <div className="container">
            <FadeIn>
              <p className="kicker mb-4">Nos valeurs</p>
              <h2 className="text-ink mb-12 max-w-2xl">Le socle de notre réussite</h2>
            </FadeIn>

            <div className="swiss-grid">
              {values.map((v, i) => (
                <FadeIn key={v.n} delay={i * 0.08} className="col-span-12 md:col-span-4">
                  <motion.div
                    whileHover={{ y: -6 }}
                    transition={{ type: 'spring', stiffness: 300, damping: 22 }}
                    className="bg-paper border border-line rounded-lg overflow-hidden h-full group"
                  >
                    <div className="relative overflow-hidden" style={{ height: 'calc(var(--lh) * 8)' }}>
                      <img
                        src={v.img}
                        alt={v.title}
                        className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                      />
                      <span className="numeral text-paper absolute top-3 left-3 text-2xl drop-shadow">{v.n}</span>
                    </div>
                    <div className="p-6">
                      <h3 className="text-ink mb-2 group-hover:text-accent transition-colors">{v.title}</h3>
                      <p className="text-soft text-sm max-w-xs">{v.text}</p>
                    </div>
                  </motion.div>
                </FadeIn>
              ))}
            </div>
          </div>
        </section>

        {/* Pillars — gallery strip with hover zoom */}
        <section className="border-b border-line" style={{ paddingBlock: 'calc(var(--lh) * 4)' }}>
          <div className="container">
            <FadeIn className="flex items-end justify-between mb-12 gap-6">
              <div>
                <p className="kicker mb-4 flex items-center gap-2"><Sparkles className="w-4 h-4" /> Notre quotidien</p>
                <h2 className="text-ink max-w-xl">L’institution en images</h2>
              </div>
              <Link href="/activities" className="hidden md:inline-flex btn-secondary">Toutes les activités</Link>
            </FadeIn>

            <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
              {pillars.map((p, i) => (
                <FadeIn key={p.src} delay={i * 0.08}>
                  <div className="relative overflow-hidden rounded-lg border border-line group" style={{ height: 'calc(var(--lh) * 14)' }}>
                    <img src={p.src} alt={p.label} className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110" />
                    <div className="absolute inset-0" style={{ background: 'linear-gradient(to top, rgba(17,19,21,.85), rgba(17,19,21,.1) 55%, rgba(17,19,21,0))' }} />
                    <p className="absolute bottom-4 left-4 right-4 text-paper font-semibold text-lg leading-tight">{p.label}</p>
                  </div>
                </FadeIn>
              ))}
            </div>
          </div>
        </section>

        {/* Founder — dark section, portrait + citation */}
        <section style={{ background: 'var(--ink)', paddingBlock: 'calc(var(--lh) * 4)' }}>
          <div className="container">
            <div className="swiss-grid items-center">
              <FadeIn direction="right" className="col-span-12 lg:col-span-5 order-2 lg:order-1">
                <figure>
                  <div className="relative overflow-hidden rounded-lg group" style={{ border: '1px solid rgba(255,255,255,.2)' }}>
                    <img
                      src="/images/directeur_fondateur.jpg"
                      alt="M. René Jean"
                      className="w-full object-cover transition-transform duration-700 group-hover:scale-105"
                      style={{ height: 'calc(var(--lh) * 20)' }}
                    />
                  </div>
                  <figcaption className="mono text-xs mt-2 flex justify-between text-white/50">
                    <span>Fig. 02 — Directeur Fondateur</span>
                    <span>1998</span>
                  </figcaption>
                </figure>
              </FadeIn>

              <FadeIn direction="left" className="col-span-12 lg:col-span-7 order-1 lg:order-2">
                <Quote className="w-12 h-12 text-accent mb-6" />
                <p className="kicker mb-6" style={{ color: 'var(--accent)' }}>Le mot du directeur</p>
                <h2 className="text-paper mb-8">Le Mot du Directeur Fondateur</h2>

                <p className="text-white/70 text-2xl leading-relaxed max-w-2xl">
                  « L’éducation est le flambeau qui éclaire le chemin de l’avenir. Notre mission au collège
                  est de porter ce flambeau avec dignité, discipline et une quête incessante de l’excellence
                  académique. »
                </p>

                <div className="mt-10 pt-6 flex items-center gap-3" style={{ borderTop: '1px solid rgba(255,255,255,.2)' }}>
                  <GraduationCap className="w-5 h-5 text-accent" />
                  <div>
                    <h3 className="text-paper mb-1">M. René Jean</h3>
                    <p className="mono text-xs uppercase tracking-widest" style={{ color: 'var(--accent)' }}>
                      Directeur Fondateur &amp; Visionnaire
                    </p>
                  </div>
                </div>

                <p className="text-white/50 text-lg leading-relaxed max-w-2xl mt-8">
                  Sous sa direction, le Collège Le Flambeau est devenu un pilier de la communauté éducative,
                  mettant l’accent sur le développement intégral de chaque enfant. Son dévouement total à la
                  cause de l’éducation inspire chaque jour nos élèves et notre personnel.
                </p>
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
              <p className="kicker mb-4" style={{ color: 'var(--accent)' }}>Rejoignez-nous</p>
              <h2 className="text-paper">Faites partie de notre histoire.</h2>
              <p className="text-white/70 text-lg max-w-xl mt-6">
                Offrez à votre enfant une éducation d’exception, portée par la discipline, l’intégrité et
                la quête de l’excellence. Les admissions sont ouvertes.
              </p>
              <div className="flex flex-col sm:flex-row gap-3 mt-10">
                <Link href="/admissions" className="btn-accent">Demander une admission</Link>
                <Link href="/contact" className="btn-secondary" style={{ color: 'var(--paper)', borderColor: 'var(--paper)' }}>Nous contacter</Link>
              </div>
            </FadeIn>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
}

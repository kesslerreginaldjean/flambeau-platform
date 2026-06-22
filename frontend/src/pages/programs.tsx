'use client';

import Link from 'next/link';
import { motion } from 'framer-motion';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import SEO from '@/components/SEO';
import FadeIn from '@/components/FadeIn';
import { ArrowRight, GraduationCap, BookOpen, Compass } from 'lucide-react';

export default function Programs() {
  const maternelle = [
    { title: 'Expression Artistique', text: 'Peinture & dessin' },
    { title: 'Pré-Lecture', text: 'Contes & Alphabet' },
    { title: 'Psychomotricité', text: 'Développement physique' },
    { title: 'Langage oral', text: 'Expression & Vocabulaire' },
  ];

  const fondamentalSubjects = [
    'Français & Créole (Maîtrise linguistique)',
    'Mathématiques (Raisonnement logique)',
    'Sciences Sociales & Citoyenneté',
    'Sciences Expérimentales',
    'Anglais & Espagnol (Initiation)',
  ];

  const fondamentalObjectives = [
    {
      title: 'Excellence Académique',
      text: 'Préparation intensive aux examens officiels avec un suivi personnalisé pour chaque élève.',
    },
    {
      title: 'Discipline Personnelle',
      text: 'Cultiver l’autonomie, le respect des règles et le sens des responsabilités dès le plus jeune âge.',
    },
    {
      title: 'Culture Générale',
      text: 'Encourager la lecture et la curiosité intellectuelle à travers des projets pédagogiques variés.',
    },
  ];

  const filieres = [
    { code: 'SVT', title: 'Sciences de la Vie et de la Terre' },
    { code: 'SMP', title: 'Sciences Mathématiques et Physiques' },
    { code: 'SES', title: 'Sciences Économiques et Sociales' },
  ];

  const cyclesOverview = [
    {
      n: '01',
      icon: BookOpen,
      label: 'Maternelle',
      title: 'Le Jardin Vert de Cassandre',
      desc: 'Trois années d’éveil ludique et structuré, premiers pas vers la lecture.',
      img: '/images/activity_students.jpg',
    },
    {
      n: '02',
      icon: Compass,
      label: 'Fondamental',
      title: 'De la 1ʳᵉ à la 9ᵉ AF',
      desc: 'Des fondations solides en langues, sciences et culture générale.',
      img: '/images/activity_workshop.jpg',
    },
    {
      n: '03',
      icon: GraduationCap,
      label: 'Nouveau Secondaire',
      title: 'De NS1 à NS4 (Terminale)',
      desc: 'Préparation intensive au Baccalauréat Unique et à l’université.',
      img: '/images/activity_conference.jpg',
    },
  ];

  return (
    <div className="min-h-screen flex flex-col bg-paper">
      <SEO
        title="Nos Programmes"
        description="De la maternelle au nouveau secondaire, découvrez notre offre académique complète axée sur l'excellence, la discipline et la réussite."
      />
      <Header />

      <main className="flex-1">
        {/* Page header — image-led masthead */}
        <section className="relative overflow-hidden border-b border-line">
          <img
            src="/images/school_facade_wide.jpg"
            alt=""
            className="absolute inset-0 w-full h-full object-cover"
          />
          <div
            className="absolute inset-0"
            style={{ background: 'linear-gradient(to right, rgba(17,19,21,.92), rgba(17,19,21,.62))' }}
          />
          <div className="container relative" style={{ paddingTop: 'calc(var(--lh) * 6)', paddingBottom: 'calc(var(--lh) * 5)' }}>
            <FadeIn>
              <div className="swiss-grid items-end">
                <div className="col-span-12 lg:col-span-9">
                  <p className="kicker mb-6" style={{ color: 'var(--accent)' }}>Parcours Académique</p>
                  <h1 className="text-paper">
                    L’excellence à chaque
                    <br />
                    <span className="text-accent">étape du savoir.</span>
                  </h1>
                  <p className="text-white/70 text-lg max-w-xl mt-8">
                    De l’éveil de la maternelle au Baccalauréat Unique, un parcours complet pensé
                    pour la rigueur, la curiosité et la réussite de chaque élève.
                  </p>
                  <hr className="rule mt-8" style={{ maxWidth: '88px', borderTopWidth: '3px', borderTopColor: 'var(--accent)' }} />
                </div>
              </div>
            </FadeIn>
          </div>
        </section>

        {/* Cycles overview — image cards with hover lift */}
        <section className="border-b border-line bg-panel" style={{ paddingBlock: 'calc(var(--lh) * 4)' }}>
          <div className="container">
            <FadeIn>
              <p className="kicker mb-4">Nos niveaux d’études</p>
              <h2 className="text-ink mb-12 max-w-2xl">Un parcours complet, de la maternelle au baccalauréat</h2>
            </FadeIn>

            <div className="swiss-grid">
              {cyclesOverview.map((c, i) => {
                const Icon = c.icon;
                return (
                  <FadeIn key={c.n} delay={i * 0.1} className="col-span-12 md:col-span-4">
                    <motion.div
                      whileHover={{ y: -6 }}
                      transition={{ type: 'spring', stiffness: 300, damping: 22 }}
                      className="bg-paper border border-line rounded-lg overflow-hidden h-full flex flex-col group"
                    >
                      <div className="relative overflow-hidden" style={{ height: 'calc(var(--lh) * 9)' }}>
                        <img
                          src={c.img}
                          alt={c.title}
                          className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                        />
                        <div className="absolute inset-0" style={{ background: 'linear-gradient(to top, rgba(17,19,21,.78), rgba(17,19,21,0))' }} />
                        <span className="numeral text-paper absolute bottom-3 left-4 text-3xl">{c.n}</span>
                        <span className="mono text-xs uppercase tracking-widest text-paper absolute bottom-4 right-4">{c.label}</span>
                      </div>
                      <div className="p-6 flex flex-col flex-1">
                        <Icon className="w-6 h-6 text-accent mb-4" />
                        <h3 className="text-ink mb-3 group-hover:text-accent transition-colors">{c.title}</h3>
                        <p className="text-soft text-sm">{c.desc}</p>
                      </div>
                    </motion.div>
                  </FadeIn>
                );
              })}
            </div>
          </div>
        </section>

        {/* Kindergarten Section */}
        <section className="border-b border-line" style={{ paddingBlock: 'calc(var(--lh) * 4)' }}>
          <div className="container">
            <div className="swiss-grid items-center">
              <FadeIn direction="right" className="col-span-12 lg:col-span-5 order-2 lg:order-1">
                <figure>
                  <div className="relative overflow-hidden rounded-lg border border-line group">
                    <img
                      src="/images/activity_students.jpg"
                      alt="Jardin Vert de Cassandre"
                      className="w-full object-cover transition-transform duration-700 group-hover:scale-105"
                      style={{ height: 'calc(var(--lh) * 16)' }}
                    />
                    <div className="absolute inset-0" style={{ background: 'linear-gradient(to top, rgba(17,19,21,.55), rgba(17,19,21,0) 55%)' }} />
                    <span className="numeral text-paper absolute bottom-3 left-4 text-4xl">01</span>
                  </div>
                  <figcaption className="mono text-xs text-soft mt-2 flex justify-between">
                    <span>Fig. 01 — Maternelle</span>
                    <span>Jardin Vert de Cassandre</span>
                  </figcaption>
                </figure>
              </FadeIn>

              <FadeIn direction="left" className="col-span-12 lg:col-span-7 order-1 lg:order-2">
                <p className="kicker mb-4">Le Jardin Vert de Cassandre</p>
                <h2 className="text-ink mb-6">Maternelle : l’éveil des talents.</h2>
                <p className="text-soft text-lg max-w-xl">
                  Un cycle de trois années d’initiation douce et structurée. Notre approche favorise
                  l’éveil des sens, la curiosité et les premiers pas vers la lecture et l’écriture dans
                  un cadre sécurisant.
                </p>

                <div className="swiss-grid" style={{ marginTop: 'calc(var(--lh) * 2)' }}>
                  {maternelle.map((item, i) => (
                    <FadeIn key={item.title} delay={i * 0.08} className="col-span-12 sm:col-span-6">
                      <div className="border-t border-ink pt-4">
                        <span className="numeral text-accent text-3xl">{String(i + 1).padStart(2, '0')}</span>
                        <h3 className="text-ink text-xl mt-3 mb-1">{item.title}</h3>
                        <p className="mono text-xs uppercase tracking-widest text-soft">{item.text}</p>
                      </div>
                    </FadeIn>
                  ))}
                </div>
              </FadeIn>
            </div>
          </div>
        </section>

        {/* Fondamental Section */}
        <section className="bg-panel border-b border-line" style={{ paddingBlock: 'calc(var(--lh) * 4)' }}>
          <div className="container">
            <div className="swiss-grid items-start">
              <FadeIn direction="right" className="col-span-12 lg:col-span-6">
                <p className="kicker mb-4">Cycle Fondamental</p>
                <h2 className="text-ink mb-6">Bâtir des fondations indestructibles.</h2>
                <p className="text-soft text-lg max-w-xl mb-10">
                  De la 1ère à la 9ème année fondamentale, nous mettons l’accent sur la maîtrise
                  parfaite des disciplines de base tout en ouvrant l’esprit des élèves aux sciences et
                  à la culture générale.
                </p>
                <div className="relative overflow-hidden rounded-lg border border-line group mb-10">
                  <img
                    src="/images/activity_workshop.jpg"
                    alt="Cycle fondamental"
                    className="w-full object-cover transition-transform duration-700 group-hover:scale-105"
                    style={{ height: 'calc(var(--lh) * 12)' }}
                  />
                  <div className="absolute inset-0" style={{ background: 'linear-gradient(to top, rgba(17,19,21,.6), rgba(17,19,21,0) 60%)' }} />
                  <span className="mono text-xs uppercase tracking-widest text-paper absolute bottom-4 left-4">Fig. 02 — Ateliers pédagogiques</span>
                </div>
                <ul className="border-t border-line">
                  {fondamentalSubjects.map((sub, i) => (
                    <FadeIn key={sub} delay={i * 0.06}>
                      <li
                        className="flex items-center gap-4 border-b border-line text-ink text-sm font-medium"
                        style={{ paddingBlock: 'var(--bl)' }}
                      >
                        <span className="mono text-accent">—</span>
                        {sub}
                      </li>
                    </FadeIn>
                  ))}
                </ul>
              </FadeIn>

              <FadeIn direction="left" className="col-span-12 lg:col-span-6">
                <div className="bg-paper border border-line rounded-lg" style={{ padding: 'calc(var(--lh) * 1.5)' }}>
                  <p className="mono text-xs uppercase tracking-widest text-soft mb-10">Nos Objectifs Clés</p>
                  <div className="space-y-10">
                    {fondamentalObjectives.map((obj, i) => (
                      <FadeIn key={obj.title} delay={i * 0.1}>
                        <motion.div
                          whileHover={{ y: -6 }}
                          transition={{ type: 'spring', stiffness: 300, damping: 22 }}
                          className="border-t border-ink pt-4"
                        >
                          <span className="numeral text-accent text-3xl">{String(i + 1).padStart(2, '0')}</span>
                          <h3 className="text-ink mt-3 mb-2">{obj.title}</h3>
                          <p className="text-soft text-sm max-w-md">{obj.text}</p>
                        </motion.div>
                      </FadeIn>
                    ))}
                  </div>
                </div>
              </FadeIn>
            </div>
          </div>
        </section>

        {/* Secondary Section */}
        <section className="border-b border-line" style={{ paddingBlock: 'calc(var(--lh) * 4)' }}>
          <div className="container">
            <div className="swiss-grid items-center">
              <FadeIn direction="right" className="col-span-12 lg:col-span-6 order-2 lg:order-1">
                <div className="relative overflow-hidden rounded-lg border border-line bg-ink text-paper">
                  <img
                    src="/images/activity_conference.jpg"
                    alt=""
                    className="absolute inset-0 w-full h-full object-cover"
                  />
                  <div className="absolute inset-0" style={{ background: 'rgba(17,19,21,.85)' }} />
                  <div className="relative" style={{ padding: 'calc(var(--lh) * 1.5)' }}>
                    <p className="mono text-xs uppercase tracking-widest mb-10" style={{ color: 'var(--accent)' }}>
                      Filières Nouveau Secondaire
                    </p>
                    <div>
                      {filieres.map((filiere, i) => (
                        <FadeIn key={filiere.code} delay={i * 0.08}>
                          <div
                            className="flex items-center justify-between"
                            style={{ borderTop: '1px solid rgba(255,255,255,.2)', paddingBlock: 'var(--bl)' }}
                          >
                            <div className="flex items-baseline gap-4">
                              <span className="numeral text-accent text-2xl">{filiere.code}</span>
                              <p className="mono text-xs uppercase tracking-widest text-white/50">{filiere.title}</p>
                            </div>
                          </div>
                        </FadeIn>
                      ))}
                    </div>
                    <div className="mt-10 pt-6" style={{ borderTop: '1px solid rgba(255,255,255,.2)' }}>
                      <p className="mono text-sm text-white/50 leading-relaxed">
                        « Un accompagnement sur mesure pour réussir son entrée à l’université. »
                      </p>
                    </div>
                  </div>
                </div>
              </FadeIn>

              <FadeIn direction="left" className="col-span-12 lg:col-span-6 order-1 lg:order-2">
                <p className="kicker mb-4">Nouveau Secondaire</p>
                <h2 className="text-ink mb-6">L’élite se prépare ici (NS1 à NS4).</h2>
                <p className="text-soft text-lg max-w-xl mb-10">
                  Le cycle secondaire est l’étape cruciale vers l’enseignement supérieur. Nous préparons
                  nos élèves au Baccalauréat Unique avec une exigence académique de haut niveau, tout en
                  les aidant à définir leur projet d’avenir.
                </p>
                <div className="swiss-grid">
                  <FadeIn delay={0.08} className="col-span-6">
                    <div className="border-t border-ink pt-4">
                      <p className="numeral text-accent" style={{ fontSize: 'clamp(2.5rem, 5vw, 4rem)' }}>100%</p>
                      <p className="mono text-xs uppercase tracking-widest text-soft mt-3">Taux d’accès Bac</p>
                    </div>
                  </FadeIn>
                  <FadeIn delay={0.16} className="col-span-6">
                    <div className="border-t border-ink pt-4">
                      <p className="numeral text-ink" style={{ fontSize: 'clamp(2.5rem, 5vw, 4rem)' }}>95%</p>
                      <p className="mono text-xs uppercase tracking-widest text-soft mt-3">Moyenne de Réussite</p>
                    </div>
                  </FadeIn>
                </div>
              </FadeIn>
            </div>
          </div>
        </section>

        {/* CTA — image background */}
        <section className="relative overflow-hidden" style={{ paddingBlock: 'calc(var(--lh) * 6)' }}>
          <img src="/images/school_vision.jpg" alt="" className="absolute inset-0 w-full h-full object-cover" />
          <div className="absolute inset-0" style={{ background: 'rgba(17,19,21,.85)' }} />
          <div className="container relative">
            <FadeIn className="max-w-2xl">
              <p className="kicker mb-4" style={{ color: 'var(--accent)' }}>Admissions 2026–2027</p>
              <h2 className="text-paper">Donnez à votre enfant le meilleur départ.</h2>
              <p className="text-white/70 text-lg max-w-xl mt-6">
                Quel que soit son niveau, notre parcours académique accompagne chaque élève vers
                l’excellence. Les admissions sont ouvertes.
              </p>
              <div className="flex flex-col sm:flex-row gap-3 mt-10">
                <Link href="/admissions" className="btn-accent inline-flex items-center gap-2">
                  Demander une admission <ArrowRight className="w-4 h-4" />
                </Link>
                <Link href="/contact" className="btn-secondary" style={{ color: 'var(--paper)', borderColor: 'var(--paper)' }}>
                  Nous contacter
                </Link>
              </div>
            </FadeIn>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
}

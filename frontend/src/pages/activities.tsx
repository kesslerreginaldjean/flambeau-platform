'use client';

import Link from 'next/link';
import { motion } from 'framer-motion';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import SEO from '@/components/SEO';
import FadeIn from '@/components/FadeIn';
import { Palette, Trophy, Globe, Heart, Zap, Music, ArrowRight, Sparkles } from 'lucide-react';

export default function Activities() {
  const activities = [
    {
      n: '01',
      icon: Trophy,
      title: 'Excellence Sportive',
      desc: 'Football, Basketball et Athlétisme pour cultiver l’esprit d’équipe, la santé et la persévérance.',
      img: '/images/gallery/img_8329.jpg',
    },
    {
      n: '02',
      icon: Palette,
      title: 'Arts & Créativité',
      desc: 'Théâtre, dessin et arts plastiques pour stimuler l’expression de soi et l’imagination.',
      img: '/images/gallery/img_5428.jpg',
    },
    {
      n: '03',
      icon: Zap,
      title: 'Science & Innovation',
      desc: 'Clubs de robotique et ateliers technologiques pour préparer les innovateurs de demain.',
      img: '/images/gallery/img_5977.jpg',
    },
    {
      n: '04',
      icon: Globe,
      title: 'Citoyenneté',
      desc: 'Débats, projets écologiques et sorties éducatives pour comprendre et agir sur le monde.',
      img: '/images/gallery/img_5896_2.jpg',
    },
    {
      n: '05',
      icon: Music,
      title: 'Musique & Rythme',
      desc: 'Chant chorale et initiation musicale pour développer l’oreille et la sensibilité artistique.',
      img: '/images/gallery/img_5800.jpg',
    },
    {
      n: '06',
      icon: Heart,
      title: 'Engagement Social',
      desc: 'Projets d’entraide et bénévolat pour cultiver l’empathie et la responsabilité citoyenne.',
      img: '/images/gallery/img_8269.jpg',
    },
  ];

  const gallery = [
    { src: '/images/gallery/img_5796.jpg', alt: 'Cérémonie', label: 'Cérémonies' },
    { src: '/images/gallery/img_5435.jpg', alt: 'Jardin Vert', label: 'Jardin Vert' },
    { src: '/images/gallery/img_5924.jpg', label: 'Vie étudiante', alt: 'Élèves' },
    { src: '/images/gallery/img_8328.jpg', alt: 'Gala', label: 'Gala annuel' },
  ];

  return (
    <div className="min-h-screen flex flex-col bg-paper">
      <SEO
        title="Vie Scolaire & Activités"
        description="Découvrez l'épanouissement de nos élèves à travers le sport, les arts, la science et l'engagement citoyen au Collège Le Flambeau."
      />
      <Header />

      <main className="flex-1">
        {/* Hero — image background, flush-left */}
        <section className="relative overflow-hidden" style={{ paddingBlock: 'calc(var(--lh) * 6)' }}>
          <img
            src="/images/gallery/img_5817.jpg"
            alt=""
            className="absolute inset-0 w-full h-full object-cover"
          />
          <div className="absolute inset-0" style={{ background: 'linear-gradient(to right, rgba(17,19,21,.92), rgba(17,19,21,.7) 60%, rgba(17,19,21,.45))' }} />
          <div className="container relative">
            <FadeIn>
              <p className="kicker mb-6 flex items-center gap-2" style={{ color: 'var(--accent)' }}>
                <Sparkles className="w-4 h-4" /> Épanouissement
              </p>
              <h1 className="text-paper max-w-4xl">
                Bien plus qu’une école, un milieu de vie.
              </h1>
              <p className="text-white/70 text-lg max-w-xl mt-6">
                Le sport, les arts, la science et l’engagement citoyen façonnent ici des élèves
                équilibrés, curieux et prêts à éclairer leur communauté.
              </p>
            </FadeIn>
          </div>
        </section>

        {/* Feature — large image + intro, asymmetric */}
        <section className="border-b border-line" style={{ paddingBlock: 'calc(var(--lh) * 4)' }}>
          <div className="container">
            <div className="swiss-grid items-center">
              <FadeIn direction="right" className="col-span-12 lg:col-span-5">
                <p className="kicker mb-4">Au cœur de la vie scolaire</p>
                <h2 className="text-ink mb-6">Chaque talent trouve sa scène.</h2>
                <p className="text-soft text-lg max-w-lg">
                  De la salle de classe au terrain, des ateliers aux grandes célébrations, la vie au
                  Collège Le Flambeau se vit pleinement. Nos élèves explorent, créent et grandissent
                  dans un environnement stimulant et bienveillant.
                </p>
                <Link
                  href="/gallery"
                  className="inline-flex items-center gap-2 mono text-sm uppercase tracking-widest text-accent border-b border-accent pb-1 mt-8 hover:gap-3 transition-all"
                >
                  Découvrir la galerie <ArrowRight className="w-4 h-4" />
                </Link>
              </FadeIn>

              <FadeIn direction="left" className="col-span-12 lg:col-span-7">
                <div className="relative overflow-hidden rounded-lg border border-line group">
                  <motion.img
                    src="/images/gallery/img_5991_2.jpg"
                    alt="Atelier au Collège Le Flambeau"
                    className="w-full object-cover"
                    style={{ height: 'calc(var(--lh) * 18)' }}
                    initial={{ scale: 1.08 }}
                    whileInView={{ scale: 1 }}
                    viewport={{ once: true }}
                    transition={{ duration: 1.1, ease: [0.21, 0.47, 0.32, 0.98] }}
                  />
                  <div className="absolute inset-0" style={{ background: 'linear-gradient(to top, rgba(17,19,21,.7), rgba(17,19,21,.05) 50%, rgba(17,19,21,0))' }} />
                  <div className="absolute bottom-4 left-4 px-4 py-2 rounded-lg border border-line" style={{ background: 'rgba(255,255,255,.95)', backdropFilter: 'blur(4px)' }}>
                    <p className="mono text-xs uppercase tracking-widest text-ink">Ateliers · Création & découverte</p>
                  </div>
                </div>
              </FadeIn>
            </div>
          </div>
        </section>

        {/* Categories — image cards with hover lift + zoom + label overlay */}
        <section className="border-b border-line bg-panel" style={{ paddingBlock: 'calc(var(--lh) * 4)' }}>
          <div className="container">
            <FadeIn>
              <p className="kicker mb-4">Nos activités</p>
              <h2 className="text-ink mb-3 max-w-3xl">Explorez nos activités</h2>
              <p className="text-soft text-lg max-w-xl mb-12">
                Le développement intégral de l’élève au cœur de nos priorités.
              </p>
            </FadeIn>

            <div className="swiss-grid">
              {activities.map((activity, i) => (
                <FadeIn
                  key={activity.n}
                  delay={i * 0.08}
                  className="col-span-12 sm:col-span-6 lg:col-span-4"
                >
                  <motion.div
                    whileHover={{ y: -6 }}
                    transition={{ type: 'spring', stiffness: 300, damping: 22 }}
                    className="bg-paper border border-line rounded-lg overflow-hidden h-full flex flex-col group"
                  >
                    <div className="relative overflow-hidden" style={{ height: 'calc(var(--lh) * 9)' }}>
                      <img
                        src={activity.img}
                        alt={activity.title}
                        className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                      />
                      <div className="absolute inset-0" style={{ background: 'linear-gradient(to top, rgba(17,19,21,.85), rgba(17,19,21,.1) 55%, rgba(17,19,21,0))' }} />
                      <span className="numeral text-paper absolute top-3 left-3 text-2xl drop-shadow">{activity.n}</span>
                      <activity.icon className="w-6 h-6 text-paper absolute top-4 right-4 drop-shadow" />
                      <p className="absolute bottom-3 left-4 right-4 text-paper font-semibold text-lg leading-tight">{activity.title}</p>
                    </div>
                    <div className="p-6 flex flex-col flex-1">
                      <p className="text-soft text-sm">{activity.desc}</p>
                    </div>
                  </motion.div>
                </FadeIn>
              ))}
            </div>
          </div>
        </section>

        {/* Gallery teaser — asymmetric, hover zoom strip with label overlays */}
        <section className="border-b border-line" style={{ paddingBlock: 'calc(var(--lh) * 4)' }}>
          <div className="container">
            <div className="swiss-grid items-center">
              <FadeIn direction="right" className="col-span-12 lg:col-span-5">
                <p className="kicker mb-4 flex items-center gap-2">
                  <Sparkles className="w-4 h-4" /> Capturer l’instant
                </p>
                <h2 className="text-ink mb-6">Vivez les moments forts de l’année.</h2>
                <p className="text-soft text-lg max-w-lg">
                  Notre galerie photo témoigne de la vitalité de notre établissement. Des compétitions
                  sportives aux spectacles de fin d’année, chaque moment est une célébration de la vie et
                  du talent.
                </p>
                <Link
                  href="/gallery"
                  className="inline-flex items-center gap-2 mono text-sm uppercase tracking-widest text-accent border-b border-accent pb-1 mt-8 hover:gap-3 transition-all"
                >
                  Consulter la galerie complète <ArrowRight className="w-4 h-4" />
                </Link>
              </FadeIn>

              <FadeIn direction="left" className="col-span-12 lg:col-span-7">
                <div className="grid grid-cols-2 gap-4">
                  {gallery.map((img) => (
                    <motion.div
                      key={img.src}
                      whileHover={{ y: -6 }}
                      transition={{ type: 'spring', stiffness: 300, damping: 22 }}
                      className="relative overflow-hidden rounded-lg border border-line group"
                      style={{ height: 'calc(var(--lh) * 12)' }}
                    >
                      <img
                        src={img.src}
                        alt={img.alt}
                        className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                      />
                      <div className="absolute inset-0" style={{ background: 'linear-gradient(to top, rgba(17,19,21,.85), rgba(17,19,21,.1) 55%, rgba(17,19,21,0))' }} />
                      <p className="absolute bottom-4 left-4 right-4 text-paper font-semibold text-lg leading-tight">{img.label}</p>
                    </motion.div>
                  ))}
                </div>
              </FadeIn>
            </div>
          </div>
        </section>

        {/* CTA — image background */}
        <section className="relative overflow-hidden" style={{ paddingBlock: 'calc(var(--lh) * 6)' }}>
          <img src="/images/school_facade_wide.jpg" alt="" className="absolute inset-0 w-full h-full object-cover" />
          <div className="absolute inset-0" style={{ background: 'rgba(17,19,21,.85)' }} />
          <div className="container relative">
            <FadeIn className="max-w-2xl">
              <p className="kicker mb-4" style={{ color: 'var(--accent)' }}>Rejoignez-nous</p>
              <h2 className="text-paper">Offrez à votre enfant un milieu de vie inspirant.</h2>
              <p className="text-white/70 text-lg max-w-xl mt-6">
                Au Collège Le Flambeau, chaque élève découvre ses talents et s’épanouit au sein
                d’une communauté engagée. Les admissions sont ouvertes.
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

import { useState } from 'react';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import SEO from '@/components/SEO';
import FadeIn from '@/components/FadeIn';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Camera, ArrowUpRight } from 'lucide-react';

const galleryImages = [
  { id: 1, src: '/images/school_facade_wide.jpg', title: 'Notre Établissement', category: 'Campus', span: 'lg:col-span-8' },
  { id: 2, src: '/images/activity_conference.jpg', title: 'Conférence Pédagogique', category: 'Évènements', span: 'lg:col-span-4' },
  { id: 3, src: '/images/activity_students.jpg', title: 'Concentration en classe', category: 'Vie Scolaire', span: 'lg:col-span-4' },
  { id: 4, src: '/images/activity_gala.jpg', title: 'Soirée de Gala', category: 'Évènements', span: 'lg:col-span-4' },
  { id: 5, src: '/images/school_facade_close.jpg', title: 'Entrée Principale', category: 'Campus', span: 'lg:col-span-4' },
  { id: 6, src: '/images/activity_workshop.jpg', title: 'Atelier Manuel', category: 'Jardin Vert', span: 'lg:col-span-8' },
  { id: 7, src: '/images/school_values.jpg', title: 'Nos Valeurs', category: 'Vie Scolaire', span: 'lg:col-span-4' },
  { id: 8, src: '/images/school_vision.jpg', title: 'Notre Slogan', category: 'Vie Scolaire', span: 'lg:col-span-4' },
  { id: 9, src: '/images/directeur_fondateur.jpg', title: 'Mot du Fondateur', category: 'Évènements', span: 'lg:col-span-4' },
];

const categories = ['Tous', 'Vie Scolaire', 'Évènements', 'Jardin Vert', 'Campus'];

export default function Gallery() {
  const [activeFilter, setActiveFilter] = useState('Tous');
  const [selectedImage, setSelectedImage] = useState<any>(null);

  const filteredImages = activeFilter === 'Tous'
    ? galleryImages
    : galleryImages.filter(img => img.category === activeFilter);

  return (
    <div className="min-h-screen flex flex-col bg-paper">
      <SEO
        title="Galerie Photo"
        description="Immersion visuelle au Collège Le Flambeau. Découvrez nos infrastructures, nos évènements et le quotidien de nos élèves en images."
      />
      <Header />

      <main className="flex-1">
        {/* Masthead — kicker + title + image accent */}
        <section className="border-b border-line" style={{ paddingBlock: 'calc(var(--lh) * 4)' }}>
          <div className="container">
            <div className="swiss-grid items-end">
              <FadeIn direction="right" className="col-span-12 lg:col-span-7">
                <p className="kicker mb-4 flex items-center gap-2">
                  <Camera className="w-4 h-4" /> Galerie officielle
                </p>
                <h1 className="text-ink mb-6">Nos moments mémorables.</h1>
                <p className="text-soft text-lg max-w-xl">
                  Retrouvez en images la vie vibrante de notre institution, des salles de classe
                  aux célébrations annuelles.
                </p>
                <p className="mono text-xs text-soft border-t border-ink pt-4 mt-8 inline-block">
                  {filteredImages.length.toString().padStart(2, '0')} clichés — {activeFilter}
                </p>
              </FadeIn>

              <FadeIn direction="left" className="col-span-12 lg:col-span-5">
                <div className="relative overflow-hidden rounded-lg border border-line group">
                  <motion.img
                    src="/images/activity_gala.jpg"
                    alt="Collège Le Flambeau en images"
                    className="w-full object-cover"
                    style={{ height: 'calc(var(--lh) * 13)' }}
                    initial={{ scale: 1.08 }}
                    whileInView={{ scale: 1 }}
                    viewport={{ once: true }}
                    transition={{ duration: 1.1, ease: [0.21, 0.47, 0.32, 0.98] }}
                  />
                  <div className="absolute inset-0" style={{ background: 'linear-gradient(to top, rgba(17,19,21,.55), rgba(17,19,21,0) 60%)' }} />
                  <div className="absolute bottom-4 left-4 px-4 py-2 rounded-lg border border-line" style={{ background: 'rgba(255,255,255,.95)', backdropFilter: 'blur(4px)' }}>
                    <p className="mono text-xs uppercase tracking-widest text-ink">Vie scolaire · 2026</p>
                  </div>
                </div>
              </FadeIn>
            </div>
          </div>
        </section>

        {/* Filters & Mosaic Grid */}
        <section className="border-b border-line" style={{ paddingBlock: 'calc(var(--lh) * 4)' }}>
          <div className="container">
            {/* Filter Buttons */}
            <FadeIn className="flex flex-wrap gap-px mb-12">
              {categories.map((cat) => (
                <button
                  key={cat}
                  onClick={() => setActiveFilter(cat)}
                  className={`px-5 mono text-xs uppercase tracking-widest border border-line transition-colors ${
                    activeFilter === cat
                      ? 'bg-ink text-paper border-ink'
                      : 'bg-paper text-soft hover:text-ink'
                  }`}
                  style={{ height: 'calc(var(--lh) * 2)' }}
                >
                  {cat}
                </button>
              ))}
            </FadeIn>

            {/* Mosaic — varied tiles with hover zoom + label overlay */}
            <motion.div layout className="swiss-grid">
              <AnimatePresence mode="popLayout">
                {filteredImages.map((image, i) => (
                  <motion.div
                    layout
                    initial={{ opacity: 0, y: 24 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0 }}
                    transition={{ duration: 0.45, delay: (i % 3) * 0.08, ease: [0.21, 0.47, 0.32, 0.98] }}
                    key={image.id}
                    className={`col-span-12 sm:col-span-6 ${image.span} group cursor-pointer`}
                    onClick={() => setSelectedImage(image)}
                  >
                    <div className="relative overflow-hidden rounded-lg border border-line">
                      <img
                        src={image.src}
                        alt={image.title}
                        className="w-full object-cover transition-transform duration-700 group-hover:scale-110"
                        style={{ height: 'calc(var(--lh) * 12)' }}
                      />
                      {/* Bottom gradient overlay — appears on hover */}
                      <div
                        className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500"
                        style={{ background: 'linear-gradient(to top, rgba(17,19,21,.85), rgba(17,19,21,0))' }}
                      />
                      {/* Fig. tag — always visible, top */}
                      <span className="numeral text-paper absolute top-3 left-4 text-2xl drop-shadow opacity-90">
                        {(i + 1).toString().padStart(2, '0')}
                      </span>
                      {/* Zoom hint */}
                      <span className="absolute top-4 right-4 w-9 h-9 flex items-center justify-center rounded-lg border border-white/30 text-paper opacity-0 group-hover:opacity-100 transition-opacity duration-500" style={{ background: 'rgba(17,19,21,.4)' }}>
                        <ArrowUpRight className="w-4 h-4" />
                      </span>
                      {/* Label — slides up on hover */}
                      <div className="absolute bottom-0 left-0 right-0 p-4 translate-y-2 opacity-0 group-hover:translate-y-0 group-hover:opacity-100 transition-all duration-500">
                        <div className="flex items-baseline justify-between gap-4">
                          <h3 className="text-paper text-lg font-semibold leading-tight">{image.title}</h3>
                          <p className="mono text-xs uppercase tracking-widest whitespace-nowrap" style={{ color: 'var(--accent)' }}>
                            {image.category}
                          </p>
                        </div>
                      </div>
                    </div>
                  </motion.div>
                ))}
              </AnimatePresence>
            </motion.div>
          </div>
        </section>

        {/* CTA Section */}
        <section style={{ paddingBlock: 'calc(var(--lh) * 4)' }}>
          <div className="container">
            <FadeIn>
              <div className="swiss-grid items-end">
                <div className="col-span-12 lg:col-span-8">
                  <p className="kicker mb-4">Restez connectés</p>
                  <h2 className="text-ink max-w-xl">Plus de photos ?</h2>
                  <p className="text-soft text-lg max-w-xl mt-6">
                    Rejoignez-nous sur nos réseaux sociaux pour suivre le quotidien de nos élèves en direct.
                  </p>
                </div>
                <div className="col-span-12 lg:col-span-4 flex gap-px">
                  <a href="#" className="btn-secondary flex-1">Facebook</a>
                  <a href="#" className="btn-secondary flex-1">Instagram</a>
                </div>
              </div>
            </FadeIn>
          </div>
        </section>
      </main>

      {/* Lightbox Modal */}
      <AnimatePresence>
        {selectedImage && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[100] flex items-center justify-center p-6 md:p-16"
            style={{ background: 'rgba(17,19,21,.85)' }}
            onClick={() => setSelectedImage(null)}
          >
            <button
              className="absolute top-8 right-8 w-12 h-12 flex items-center justify-center text-paper/60 hover:text-paper border border-white/20 hover:border-white/40 transition-colors"
              onClick={() => setSelectedImage(null)}
              aria-label="Fermer"
            >
              <X className="w-6 h-6" />
            </button>

            <motion.div
              initial={{ opacity: 0, scale: 0.97 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.97 }}
              transition={{ duration: 0.3, ease: [0.21, 0.47, 0.32, 0.98] }}
              className="max-w-5xl w-full flex flex-col items-center gap-6"
              onClick={(e) => e.stopPropagation()}
            >
              <img
                src={selectedImage.src}
                alt={selectedImage.title}
                className="max-w-full max-h-[78vh] object-contain border border-white/20 rounded-lg"
              />
              <div className="w-full flex items-baseline justify-between gap-4 border-t border-white/20 pt-4">
                <h3 className="text-paper text-xl">{selectedImage.title}</h3>
                <p className="mono text-xs uppercase tracking-widest" style={{ color: 'var(--accent)' }}>
                  {selectedImage.category}
                </p>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      <Footer />
    </div>
  );
}

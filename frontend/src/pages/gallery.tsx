import { useState } from 'react';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import SEO from '@/components/SEO';
import FadeIn from '@/components/FadeIn';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Camera, ArrowUpRight } from 'lucide-react';

const galleryImages = [
  // ── Évènements ─────────────────────────────────────────────────────────────
  { id: 1,  src: '/images/gallery/img_5791.jpg',   title: 'Cérémonie officielle',       category: 'Évènements', span: 'lg:col-span-8' },
  { id: 2,  src: '/images/gallery/img_5796.jpg',   title: 'Remise de diplômes',         category: 'Évènements', span: 'lg:col-span-4' },
  { id: 3,  src: '/images/gallery/img_5800.jpg',   title: 'Discours de la direction',   category: 'Évènements', span: 'lg:col-span-4' },
  { id: 4,  src: '/images/gallery/img_5810.jpg',   title: 'Célébration annuelle',       category: 'Évènements', span: 'lg:col-span-4' },
  { id: 5,  src: '/images/gallery/img_5817.jpg',   title: 'Gala de fin d\'année',        category: 'Évènements', span: 'lg:col-span-4' },
  { id: 6,  src: '/images/gallery/img_5822.jpg',   title: 'Soirée des lauréats',        category: 'Évènements', span: 'lg:col-span-8' },
  { id: 7,  src: '/images/gallery/img_8269.jpg',   title: 'Moments de partage',         category: 'Évènements', span: 'lg:col-span-4' },
  { id: 8,  src: '/images/gallery/img_8324.jpg',   title: 'Cérémonie des prix',         category: 'Évènements', span: 'lg:col-span-4' },
  { id: 9,  src: '/images/gallery/img_8328.jpg',   title: 'Remise de trophées',         category: 'Évènements', span: 'lg:col-span-4' },
  { id: 10, src: '/images/gallery/img_8329.jpg',   title: 'Tableau d\'honneur',         category: 'Évènements', span: 'lg:col-span-8' },
  { id: 11, src: '/images/gallery/img_8346.jpg',   title: 'Grande célébration',         category: 'Évènements', span: 'lg:col-span-4' },

  // ── Vie Scolaire ───────────────────────────────────────────────────────────
  { id: 12, src: '/images/gallery/img_5883_2.jpg', title: 'Élèves en classe',           category: 'Vie Scolaire', span: 'lg:col-span-8' },
  { id: 13, src: '/images/gallery/img_5889_2.jpg', title: 'Concentration & travail',    category: 'Vie Scolaire', span: 'lg:col-span-4' },
  { id: 14, src: '/images/gallery/img_5896_2.jpg', title: 'Apprentissage actif',        category: 'Vie Scolaire', span: 'lg:col-span-4' },
  { id: 15, src: '/images/gallery/img_5898_2.jpg', title: 'Moment de lecture',          category: 'Vie Scolaire', span: 'lg:col-span-4' },
  { id: 16, src: '/images/gallery/img_5905_2.jpg', title: 'Groupe d\'étude',            category: 'Vie Scolaire', span: 'lg:col-span-8' },
  { id: 17, src: '/images/gallery/img_5909_2.jpg', title: 'Séance de cours',            category: 'Vie Scolaire', span: 'lg:col-span-4' },
  { id: 18, src: '/images/gallery/img_5911_2.jpg', title: 'Vie en communauté',          category: 'Vie Scolaire', span: 'lg:col-span-4' },
  { id: 19, src: '/images/gallery/img_5917_2.jpg', title: 'Pause studieuse',            category: 'Vie Scolaire', span: 'lg:col-span-4' },
  { id: 20, src: '/images/gallery/img_5918_2.jpg', title: 'Échanges entre élèves',      category: 'Vie Scolaire', span: 'lg:col-span-8' },
  { id: 21, src: '/images/gallery/img_5920_2.jpg', title: 'Participation en classe',    category: 'Vie Scolaire', span: 'lg:col-span-4' },
  { id: 22, src: '/images/gallery/img_5922_2.jpg', title: 'Dynamique de groupe',        category: 'Vie Scolaire', span: 'lg:col-span-4' },
  { id: 23, src: '/images/gallery/img_5924.jpg',   title: 'Esprit d\'équipe',           category: 'Vie Scolaire', span: 'lg:col-span-4' },
  { id: 24, src: '/images/gallery/img_5977.jpg',   title: 'Couloirs du savoir',         category: 'Vie Scolaire', span: 'lg:col-span-8' },
  { id: 25, src: '/images/gallery/img_5991_2.jpg', title: 'Travail collaboratif',       category: 'Vie Scolaire', span: 'lg:col-span-4' },
  { id: 26, src: '/images/gallery/img_5998_2.jpg', title: 'Engagement scolaire',        category: 'Vie Scolaire', span: 'lg:col-span-4' },
  { id: 27, src: '/images/gallery/img_6007_2.jpg', title: 'Jeunesse studieuse',         category: 'Vie Scolaire', span: 'lg:col-span-4' },
  { id: 28, src: '/images/gallery/img_6013_2.jpg', title: 'Encadrement personnalisé',   category: 'Vie Scolaire', span: 'lg:col-span-8' },
  { id: 29, src: '/images/gallery/img_6018_2.jpg', title: 'Dialogue enseignant-élève',  category: 'Vie Scolaire', span: 'lg:col-span-4' },
  { id: 30, src: '/images/gallery/img_6022_2.jpg', title: 'Rigueur académique',         category: 'Vie Scolaire', span: 'lg:col-span-4' },
  { id: 31, src: '/images/gallery/img_6025_2.jpg', title: 'La classe en action',        category: 'Vie Scolaire', span: 'lg:col-span-8' },
  { id: 32, src: '/images/gallery/img_6033_2.jpg', title: 'Réussite collective',        category: 'Vie Scolaire', span: 'lg:col-span-4' },

  // ── Jardin Vert (Maternelle) ────────────────────────────────────────────────
  { id: 33, src: '/images/gallery/img_5385.jpg',   title: 'Jardin Vert, éveil',        category: 'Jardin Vert', span: 'lg:col-span-8' },
  { id: 34, src: '/images/gallery/img_5387.jpg',   title: 'Activité manuelle',          category: 'Jardin Vert', span: 'lg:col-span-4' },
  { id: 35, src: '/images/gallery/img_5391.jpg',   title: 'Jeux éducatifs',             category: 'Jardin Vert', span: 'lg:col-span-4' },
  { id: 36, src: '/images/gallery/img_5394.jpg',   title: 'Créativité & expression',    category: 'Jardin Vert', span: 'lg:col-span-4' },
  { id: 37, src: '/images/gallery/img_5398.jpg',   title: 'Apprentissage par le jeu',   category: 'Jardin Vert', span: 'lg:col-span-8' },
  { id: 38, src: '/images/gallery/img_5399.jpg',   title: 'Les tout-petits au travail', category: 'Jardin Vert', span: 'lg:col-span-4' },
  { id: 39, src: '/images/gallery/img_5412.jpg',   title: 'Éveil artistique',           category: 'Jardin Vert', span: 'lg:col-span-4' },
  { id: 40, src: '/images/gallery/img_5413.jpg',   title: 'Joie de découvrir',          category: 'Jardin Vert', span: 'lg:col-span-4' },
  { id: 41, src: '/images/gallery/img_5428.jpg',   title: 'Curiosité naturelle',        category: 'Jardin Vert', span: 'lg:col-span-8' },
  { id: 42, src: '/images/gallery/img_5435.jpg',   title: 'Monde de l\'enfance',        category: 'Jardin Vert', span: 'lg:col-span-4' },
  { id: 43, src: '/images/gallery/img_5437.jpg',   title: 'Plaisir d\'apprendre',       category: 'Jardin Vert', span: 'lg:col-span-4' },
  { id: 44, src: '/images/gallery/img_5447.jpg',   title: 'Atelier créatif',            category: 'Jardin Vert', span: 'lg:col-span-8' },
  { id: 45, src: '/images/gallery/img_5450.jpg',   title: 'Éducation ludique',          category: 'Jardin Vert', span: 'lg:col-span-4' },
  { id: 46, src: '/images/gallery/img_5465.jpg',   title: 'Les premières lettres',      category: 'Jardin Vert', span: 'lg:col-span-4' },
  { id: 47, src: '/images/gallery/img_5468.jpg',   title: 'Épanouissement dès le début',category: 'Jardin Vert', span: 'lg:col-span-4' },
  { id: 48, src: '/images/gallery/img_5479.jpg',   title: 'Maternelle en fête',         category: 'Jardin Vert', span: 'lg:col-span-8' },
];

const categories = ['Tous', 'Vie Scolaire', 'Évènements', 'Jardin Vert'];

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
                  {filteredImages.length.toString().padStart(2, '0')} clichés, {activeFilter}
                </p>
              </FadeIn>

              <FadeIn direction="left" className="col-span-12 lg:col-span-5">
                <div className="relative overflow-hidden rounded-lg border border-line group">
                  <motion.img
                    src="/images/gallery/img_5822.jpg"
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
                  <a href="https://www.facebook.com/profile.php?id=61581483637615" target="_blank" rel="noopener noreferrer" className="btn-secondary flex-1 text-center">Facebook</a>
                  <a href="https://www.instagram.com/college_le_flambeau/" target="_blank" rel="noopener noreferrer" className="btn-secondary flex-1 text-center">Instagram</a>
                  <a href="https://www.tiktok.com/@college_le_flambeau" target="_blank" rel="noopener noreferrer" className="btn-secondary flex-1 text-center">TikTok</a>
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

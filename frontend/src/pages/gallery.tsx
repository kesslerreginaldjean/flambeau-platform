import { useState } from 'react';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import SEO from '@/components/SEO';
import FadeIn from '@/components/FadeIn';
import { motion, AnimatePresence } from 'framer-motion';
import { Camera, X, Maximize2, ImageIcon } from 'lucide-react';

const galleryImages = [
  { id: 1, src: '/images/activity_conference.jpg', title: 'Conférence Pédagogique', category: 'Évènements' },
  { id: 2, src: '/images/activity_students.jpg', title: 'Concentration en classe', category: 'Vie Scolaire' },
  { id: 3, src: '/images/activity_workshop.jpg', title: 'Atelier Manuel', category: 'Jardin Vert' },
  { id: 4, src: '/images/activity_gala.jpg', title: 'Soirée de Gala', category: 'Évènements' },
  { id: 5, src: '/images/school_facade_wide.jpg', title: 'Notre Établissement', category: 'Campus' },
  { id: 6, src: '/images/school_facade_close.jpg', title: 'Entrée Principale', category: 'Campus' },
  { id: 7, src: '/images/school_vision.jpg', title: 'Notre Slogan', category: 'Vie Scolaire' },
  { id: 8, src: '/images/directeur_fondateur.jpg', title: 'Mot du Fondateur', category: 'Évènements' },
];

const categories = ['Tous', 'Vie Scolaire', 'Évènements', 'Jardin Vert', 'Campus'];

export default function Gallery() {
  const [activeFilter, setActiveFilter] = useState('Tous');
  const [selectedImage, setSelectedImage] = useState<any>(null);

  const filteredImages = activeFilter === 'Tous' 
    ? galleryImages 
    : galleryImages.filter(img => img.category === activeFilter);

  return (
    <div className="min-h-screen bg-white">
      <SEO 
        title="Galerie Photo" 
        description="Immersion visuelle au Collège Le Flambeau. Découvrez nos infrastructures, nos évènements et le quotidien de nos élèves en images."
      />
      <Header />

      <main className="pt-20 overflow-hidden">
        {/* Header Section */}
        <section className="py-32 bg-slate-50 relative overflow-hidden">
          <div className="absolute top-0 right-0 w-1/3 h-full bg-[#D32D3F]/5 skew-x-[-15deg] translate-x-20"></div>
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center relative z-10">
            <FadeIn>
              <div className="inline-flex items-center gap-2 px-4 py-2 bg-white rounded-full text-[#D32D3F] shadow-sm text-xs font-bold uppercase tracking-widest mb-6 border border-slate-100">
                <Camera className="w-4 h-4" /> Galerie Officielle
              </div>
              <h1 className="text-5xl md:text-7xl font-extrabold text-slate-900 leading-tight mb-8">
                Nos moments <br /> <span className="text-[#D32D3F]">mémorables.</span>
              </h1>
              <p className="text-xl text-slate-500 max-w-2xl mx-auto font-medium">
                Retrouvez en images la vie vibrante de notre institution, des salles de classe aux célébrations annuelles.
              </p>
            </FadeIn>
          </div>
        </section>

        {/* Filters & Grid Container */}
        <section className="py-24 bg-white">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            {/* Filter Buttons */}
            <FadeIn className="flex flex-wrap justify-center gap-4 mb-20">
              {categories.map((cat) => (
                <button
                  key={cat}
                  onClick={() => setActiveFilter(cat)}
                  className={`px-8 py-3.5 rounded-2xl font-bold text-sm transition-all duration-300 transform active:scale-95 ${
                    activeFilter === cat 
                      ? 'bg-[#D32D3F] text-white shadow-2xl shadow-[#D32D3F]/40 scale-105' 
                      : 'bg-slate-50 text-slate-500 hover:bg-slate-100 border border-slate-100'
                  }`}
                >
                  {cat}
                </button>
              ))}
            </FadeIn>

            {/* Gallery Grid with Framer Motion */}
            <motion.div 
              layout
              className="columns-1 sm:columns-2 lg:columns-3 gap-8 space-y-8"
            >
              <AnimatePresence mode="popLayout">
                {filteredImages.map((image) => (
                  <motion.div 
                    layout
                    initial={{ opacity: 0, scale: 0.8 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0, scale: 0.8 }}
                    transition={{ duration: 0.4 }}
                    key={image.id}
                    className="relative group cursor-pointer break-inside-avoid rounded-[2.5rem] overflow-hidden bg-white shadow-lg hover:shadow-[0_40px_80px_-20px_rgba(0,0,0,0.15)] transition-all duration-500"
                    onClick={() => setSelectedImage(image)}
                  >
                    <img 
                      src={image.src} 
                      alt={image.title}
                      className="w-full h-auto object-cover transition-transform duration-700 group-hover:scale-110"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-slate-900/90 via-slate-900/20 to-transparent opacity-0 group-hover:opacity-100 transition-all duration-500 flex flex-col justify-end p-10">
                      <p className="text-white font-bold text-2xl mb-2 translate-y-4 group-hover:translate-y-0 transition-transform duration-500">{image.title}</p>
                      <div className="flex items-center gap-2 text-[#FDE68A] text-xs font-bold uppercase tracking-widest translate-y-4 group-hover:translate-y-0 transition-transform duration-500 delay-75">
                         <ImageIcon className="w-3 h-3" />
                         {image.category}
                      </div>
                    </div>
                    <div className="absolute top-6 right-6 w-12 h-12 bg-white/20 backdrop-blur-md rounded-2xl flex items-center justify-center text-white opacity-0 group-hover:opacity-100 transition-all duration-500 transform scale-50 group-hover:rotate-12 group-hover:scale-100 border border-white/20">
                      <Maximize2 className="w-6 h-6" />
                    </div>
                  </motion.div>
                ))}
              </AnimatePresence>
            </motion.div>
          </div>
        </section>

        {/* CTA Section */}
        <section className="py-32 bg-slate-50">
           <div className="max-w-4xl mx-auto px-4 text-center">
              <FadeIn>
                <h2 className="text-4xl font-extrabold text-slate-900 mb-8">Plus de photos ?</h2>
                <p className="text-xl text-slate-500 mb-10 font-medium">Rejoignez-nous sur nos réseaux sociaux pour suivre le quotidien de nos élèves en direct.</p>
                <div className="flex justify-center gap-6">
                   <a href="#" className="w-16 h-16 bg-white rounded-2xl shadow-sm border border-slate-100 flex items-center justify-center text-[#D32D3F] hover:bg-[#D32D3F] hover:text-white transition-all transform hover:-translate-y-2">
                     <span className="font-bold">FB</span>
                   </a>
                   <a href="#" className="w-16 h-16 bg-white rounded-2xl shadow-sm border border-slate-100 flex items-center justify-center text-[#D32D3F] hover:bg-[#D32D3F] hover:text-white transition-all transform hover:-translate-y-2">
                     <span className="font-bold">IG</span>
                   </a>
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
            className="fixed inset-0 bg-slate-950/98 z-[100] flex items-center justify-center p-6 md:p-20"
          >
            <button 
              className="absolute top-10 right-10 w-14 h-14 bg-white/5 hover:bg-white/10 rounded-full flex items-center justify-center text-white/50 hover:text-white transition-all"
              onClick={() => setSelectedImage(null)}
            >
              <X className="w-8 h-8" />
            </button>
            
            <motion.div 
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              className="max-w-6xl w-full h-full flex flex-col items-center justify-center gap-8"
            >
              <img 
                src={selectedImage.src} 
                alt={selectedImage.title}
                className="max-w-full max-h-[80vh] object-contain rounded-3xl shadow-[0_0_100px_rgba(211,45,63,0.2)]"
              />
              <div className="text-center">
                <h3 className="text-3xl font-bold text-white mb-3">{selectedImage.title}</h3>
                <div className="inline-flex items-center gap-2 text-[#D32D3F] font-extrabold uppercase tracking-[0.3em] text-sm">
                   <div className="w-2 h-2 rounded-full bg-[#D32D3F]"></div>
                   {selectedImage.category}
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      <Footer />
    </div>
  );
}

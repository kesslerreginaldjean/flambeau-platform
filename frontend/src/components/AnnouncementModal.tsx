import { motion, AnimatePresence } from 'framer-motion';
import { X, Sparkles, Star, ArrowRight } from 'lucide-react';
import Link from 'next/link';

interface AnnouncementModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const AnnouncementModal = ({ isOpen, onClose }: AnnouncementModalProps) => {
  const handleClose = () => {
    onClose();
    // Save to session storage to not show again in this session
    sessionStorage.setItem('hasSeenAnnouncement', 'true');
  };

  if (!isOpen) return null;

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-[120] flex items-center justify-center p-4 md:p-6 bg-slate-950/80 backdrop-blur-md">
        <motion.div
          initial={{ opacity: 0, scale: 0.9, y: 20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.9, y: 20 }}
          className="bg-white w-full max-w-lg rounded-[2.5rem] shadow-[0_50px_100px_-20px_rgba(0,0,0,0.4)] overflow-hidden relative flex flex-col"
          style={{ maxHeight: '90vh' }}
        >
          {/* Header/Banner - Deep Prestige */}
          <div className="h-56 bg-[#D32D3F] relative overflow-hidden flex-shrink-0">
            <div className="absolute inset-0 bg-gradient-to-br from-[#D32D3F] via-[#B22234] to-[#8B1A26]"></div>
            
            {/* Animated decorative circles */}
            <div className="absolute -top-20 -right-20 w-64 h-64 bg-white/5 rounded-full blur-3xl"></div>
            <div className="absolute -bottom-20 -left-20 w-64 h-64 bg-black/10 rounded-full blur-3xl"></div>
            
            <div className="absolute inset-0 flex flex-col items-center justify-center text-white p-8">
              <motion.div
                initial={{ y: -20, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ delay: 0.2 }}
                className="text-[10px] font-black uppercase tracking-[0.5em] mb-4 text-[#FDE68A]"
              >
                Campagne Officielle
              </motion.div>
              <h2 className="text-4xl md:text-5xl font-black text-center leading-none tracking-tighter">
                RENTRÉE <br /> 2026-2027
              </h2>
            </div>

            {/* Close Button */}
            <button 
              onClick={handleClose}
              className="absolute top-6 right-6 p-2 bg-black/10 hover:bg-black/20 text-white rounded-full transition-all group"
            >
              <X className="w-6 h-6 group-hover:rotate-90 transition-transform" />
            </button>
          </div>

          {/* Content Section - High Impact Copy */}
          <div className="p-8 md:p-10 text-center overflow-y-auto">
            <div className="inline-flex items-center gap-3 px-5 py-2 bg-[#FFF8E7] text-[#D32D3F] rounded-full text-xs font-extrabold mb-6 border border-[#FDE68A] shadow-sm">
              <Sparkles className="w-4 h-4" />
              <span className="uppercase tracking-widest">Inscriptions Ouvertes</span>
            </div>

            <h3 className="text-3xl font-black text-slate-900 mb-4 tracking-tight leading-tight">
              Tracez le chemin <br /> du succès.
            </h3>
            
            <p className="text-slate-500 font-medium leading-relaxed mb-8">
              Offrez à votre enfant un environnement d'exception où l'excellence académique rencontre les valeurs morales. Rejoignez l'élite du Collège Le Flambeau pour l'année <span className="text-[#D32D3F] font-bold">2026-2027</span>.
            </p>

            <div className="space-y-4">
              <Link 
                href="/admissions" 
                onClick={handleClose}
                className="flex items-center justify-center gap-3 w-full py-5 bg-[#D32D3F] text-white rounded-2xl font-black uppercase tracking-widest text-xs hover:bg-[#8B1A26] transition-all shadow-xl shadow-[#D32D3F]/25 group"
              >
                Rejoindre l'Excellence
                <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
              </Link>
              
              <button 
                onClick={handleClose}
                className="text-slate-400 hover:text-slate-600 text-[10px] font-bold uppercase tracking-widest transition-colors"
              >
                Peut-être plus tard
              </button>
            </div>
          </div>

          {/* Footer - Slogan */}
          <div className="bg-slate-50 p-6 border-t border-slate-100 flex items-center justify-center gap-2 flex-shrink-0">
            <Star className="w-4 h-4 text-[#FDE68A] fill-[#FDE68A]" />
            <p className="text-[10px] font-bold text-slate-400 uppercase tracking-[0.3em] text-center">
              Une École • Une Vision
            </p>
            <Star className="w-4 h-4 text-[#FDE68A] fill-[#FDE68A]" />
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
};

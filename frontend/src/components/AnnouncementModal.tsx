import { motion, AnimatePresence } from 'framer-motion';
import { X, ArrowRight } from 'lucide-react';
import Link from 'next/link';

interface AnnouncementModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const AnnouncementModal = ({ isOpen, onClose }: AnnouncementModalProps) => {
  const handleClose = () => {
    onClose();
    sessionStorage.setItem('hasSeenAnnouncement', 'true');
  };

  if (!isOpen) return null;

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-[120] flex items-center justify-center p-4 md:p-6" style={{ background: 'rgba(17,19,21,.7)' }}>
        <motion.div
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: 12 }}
          transition={{ duration: 0.2 }}
          className="bg-paper w-full max-w-lg border border-line relative flex flex-col"
          style={{ maxHeight: '90vh' }}
        >
          {/* Banner — flat ink panel, large numeral year */}
          <div className="relative flex-shrink-0 px-8" style={{ background: 'var(--ink)', paddingBlock: 'calc(var(--lh) * 2)' }}>
            <p className="kicker mb-3" style={{ color: 'var(--accent)' }}>Campagne officielle</p>
            <p className="numeral text-paper" style={{ fontSize: 'clamp(2.5rem, 8vw, 4rem)' }}>
              Rentrée<br />2026–2027
            </p>
            <button
              onClick={handleClose}
              aria-label="Fermer"
              className="absolute top-5 right-5 w-9 h-9 flex items-center justify-center text-paper hover:bg-white/10 transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Content */}
          <div className="p-8 overflow-y-auto">
            <p className="kicker mb-4">Inscriptions ouvertes</p>
            <h3 className="text-ink mb-4">Tracez le chemin du succès.</h3>
            <p className="text-soft mb-8">
              Offrez à votre enfant un environnement d’exception où l’excellence académique
              rencontre les valeurs morales. Rejoignez le Collège Le Flambeau pour l’année
              <span className="text-ink"> 2026–2027</span>.
            </p>

            <div className="flex flex-col gap-px">
              <Link href="/admissions" onClick={handleClose} className="btn-accent group">
                Rejoindre l’excellence
                <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
              </Link>
              <button
                onClick={handleClose}
                className="mono text-xs uppercase tracking-widest text-soft hover:text-ink py-3 transition-colors"
              >
                Peut-être plus tard
              </button>
            </div>
          </div>

          {/* Footer slogan */}
          <div className="px-8 py-4 border-t border-line flex-shrink-0">
            <p className="mono text-xs uppercase tracking-widest text-soft text-center">
              Une École · Une Vision
            </p>
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
};

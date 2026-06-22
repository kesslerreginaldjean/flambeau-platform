import type { AppProps } from 'next/app';
import { motion, AnimatePresence, useScroll, useSpring } from 'framer-motion';
import { Montserrat, IBM_Plex_Mono } from 'next/font/google';
import FloatingCTA from '@/components/FloatingCTA';
import './globals.css';

// Typographie alignée sur le site de référence ESIH : Montserrat (sans
// géométrique, chaleureuse et institutionnelle) en titres + corps de texte,
// associée à IBM Plex Mono pour les libellés numériques.
const montserrat = Montserrat({
  subsets: ['latin'],
  weight: ['400', '500', '600', '700', '800'],
  variable: '--font-sans',
  display: 'swap',
});

const plexMono = IBM_Plex_Mono({
  subsets: ['latin'],
  weight: ['400', '500', '600'],
  variable: '--font-mono',
  display: 'swap',
});

export default function App({ Component, pageProps, router }: AppProps) {
  const { scrollYProgress } = useScroll();
  const scaleX = useSpring(scrollYProgress, {
    stiffness: 100,
    damping: 30,
    restDelta: 0.001
  });

  return (
    <div className={`${montserrat.variable} ${plexMono.variable} font-sans`}>
      <motion.div
        className="fixed top-0 left-0 right-0 h-1 bg-accent z-[9999] origin-left"
        style={{ scaleX }}
      />
      
      <AnimatePresence mode="wait">
        <motion.div
          key={router.route}
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -15 }}
          transition={{ 
            duration: 0.6, 
            ease: [0.21, 0.47, 0.32, 0.98] 
          }}
        >
          <Component {...pageProps} />
        </motion.div>
      </AnimatePresence>
      <FloatingCTA />
    </div>
  );
}

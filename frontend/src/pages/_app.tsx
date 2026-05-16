import type { AppProps } from 'next/app';
import { motion, AnimatePresence, useScroll, useSpring } from 'framer-motion';
import FloatingCTA from '@/components/FloatingCTA';
import './globals.css';

export default function App({ Component, pageProps, router }: AppProps) {
  const { scrollYProgress } = useScroll();
  const scaleX = useSpring(scrollYProgress, {
    stiffness: 100,
    damping: 30,
    restDelta: 0.001
  });

  return (
    <>
      <motion.div
        className="fixed top-0 left-0 right-0 h-1 bg-[#D32D3F] z-[9999] origin-left"
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
    </>
  );
}

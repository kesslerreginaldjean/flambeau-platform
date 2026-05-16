import { motion } from 'framer-motion';
import Link from 'next/link';
import { ArrowRight, GraduationCap, Award, BookOpen } from 'lucide-react';

export const HeroSection = () => {
  return (
    <section className="relative min-h-[90vh] flex items-center justify-center overflow-hidden bg-white pt-20">
      {/* Subtle Background Decoration */}
      <motion.div 
        initial={{ opacity: 0, x: 100 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ duration: 1.5, ease: "easeOut" }}
        className="absolute top-0 right-0 w-1/3 h-full bg-[#FFF8E7]/30 -z-0 hidden lg:block skew-x-[-10deg] translate-x-20"
      ></motion.div>
      
      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 md:py-20">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 lg:gap-24 items-center">
          
          {/* Left Content - Academic Focus */}
          <div className="text-left space-y-10 order-2 lg:order-1">
            <div className="space-y-4">
              <motion.div 
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2 }}
                className="inline-flex items-center gap-3 px-4 py-2 bg-white rounded-xl border border-slate-100 shadow-sm text-[#D32D3F] text-xs font-bold uppercase tracking-[0.2em]"
              >
                <GraduationCap className="w-4 h-4" />
                <span>Institution d'Excellence Académique</span>
              </motion.div>

              <motion.h1 
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8, delay: 0.3 }}
                className="text-5xl md:text-7xl font-extrabold text-slate-900 leading-[1.1] tracking-tight"
              >
                Une École, <br />
                <span className="text-[#D32D3F]">Une Vision.</span>
              </motion.h1>
              
              <motion.div 
                initial={{ width: 0 }}
                animate={{ width: 96 }}
                transition={{ duration: 1, delay: 0.8 }}
                className="h-2 bg-[#D32D3F] rounded-full"
              ></motion.div>
            </div>

            <motion.p 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 1 }}
              className="text-xl md:text-2xl text-slate-600 max-w-xl leading-relaxed font-medium italic"
            >
              "Mieux Choisir Pour Réussir"
            </motion.p>

            <motion.p 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 1.2 }}
              className="text-lg text-slate-500 max-w-lg leading-relaxed"
            >
              Depuis sa fondation, le Collège Le Flambeau se consacre à la formation intégrale de la jeunesse haïtienne, alliant discipline, savoir et innovation.
            </motion.p>

            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 1.4 }}
              className="flex flex-col sm:flex-row gap-5 pt-4"
            >
              <Link 
                href="/admissions"
                className="group flex items-center justify-center gap-3 px-10 py-5 bg-[#D32D3F] text-white font-bold rounded-2xl hover:bg-[#8B1A26] shadow-2xl shadow-[#D32D3F]/30 transition-all duration-300 transform hover:scale-105 active:scale-95"
              >
                Inscriptions Ouvertes
                <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
              </Link>
              <Link 
                href="/about"
                className="flex items-center justify-center px-10 py-5 bg-white text-slate-800 font-bold rounded-2xl border-2 border-slate-100 hover:bg-slate-50 transition-all duration-300 transform hover:scale-105 shadow-sm active:scale-95"
              >
                Notre Histoire
              </Link>
            </motion.div>

            {/* Academic Badges */}
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 0.6 }}
              transition={{ delay: 1.8 }}
              className="flex flex-wrap items-center gap-8 pt-10"
            >
               <div className="flex items-center gap-2">
                  <Award className="w-5 h-5 text-slate-400" />
                  <span className="text-xs font-bold text-slate-500 uppercase tracking-widest">Accrédité par le MENFP</span>
               </div>
               <div className="flex items-center gap-2">
                  <BookOpen className="w-5 h-5 text-slate-400" />
                  <span className="text-xs font-bold text-slate-500 uppercase tracking-widest">Cycles Complet</span>
               </div>
            </motion.div>
          </div>

          {/* Right Visual - 4:3 Aspect Ratio Image (Horizontal) */}
          <motion.div 
            initial={{ opacity: 0, scale: 0.8, rotate: -2 }}
            animate={{ opacity: 1, scale: 1, rotate: 0 }}
            transition={{ duration: 1, delay: 0.5, ease: "easeOut" }}
            className="order-1 lg:order-2 relative"
          >
             <div className="relative z-10 aspect-[4/3] rounded-[3.5rem] overflow-hidden shadow-[0_50px_100px_-20px_rgba(0,0,0,0.25)] border-[12px] border-white bg-slate-100">
                <motion.img 
                  whileHover={{ scale: 1.05 }}
                  transition={{ duration: 0.6 }}
                  src="/images/school_facade_close.jpg" 
                  alt="Collège Le Flambeau" 
                  className="w-full h-full object-cover object-center"
                />
             </div>
             {/* Decorative elements */}
             <div className="absolute -top-6 -right-6 w-32 h-32 bg-[#FDE68A] rounded-3xl -z-0 opacity-50 blur-2xl animate-pulse"></div>
             <div className="absolute -bottom-10 -left-10 w-48 h-48 bg-[#D32D3F]/10 rounded-full -z-0 blur-3xl"></div>
          </motion.div>

        </div>
      </div>
    </section>
  );
};
export default HeroSection;

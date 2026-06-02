'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import HeroSection from '@/components/HeroSection';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import SEO from '@/components/SEO';
import FadeIn from '@/components/FadeIn';
import Counter from '@/components/Counter';
import { AnnouncementModal } from '@/components/AnnouncementModal';
import { 
  ShieldCheck, Target, CheckCircle2, ArrowRight, Zap, Heart
} from 'lucide-react';

export default function Home() {
  const [isAnnouncementOpen, setIsAnnouncementOpen] = useState(false);

  useEffect(() => {
    // Show announcement after 2 seconds delay if not seen in this session
    const timer = setTimeout(() => {
      const hasSeen = sessionStorage.getItem('hasSeenAnnouncement');
      if (!hasSeen) {
        setIsAnnouncementOpen(true);
      }
    }, 2000);

    return () => clearTimeout(timer);
  }, []);

  return (
    <div className="min-h-screen flex flex-col bg-white">
      <SEO 
        title="Accueil" 
        description="Bienvenue au Collège Le Flambeau, une institution d'excellence dédiée à la formation des citoyens de demain en Haïti."
      />
      <Header />
      <AnnouncementModal 
        isOpen={isAnnouncementOpen} 
        onClose={() => setIsAnnouncementOpen(false)} 
      />
      
      <main className="flex-1 overflow-hidden">
        <HeroSection />

        {/* Presentation Section - TEASER ONLY */}
        <section className="py-24 bg-white relative overflow-hidden">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-20 items-center">
              <FadeIn direction="right" className="space-y-8 text-center lg:text-left">
                <div>
                  <h2 className="text-sm font-bold text-[#D32D3F] uppercase tracking-[0.3em] mb-4">Bienvenue au Flambeau</h2>
                  <h3 className="text-4xl md:text-5xl font-extrabold text-slate-900 leading-tight">
                    Former les citoyens <br /> de demain.
                  </h3>
                </div>
                
                <p className="text-lg text-slate-600 leading-relaxed font-medium">
                  Le Collège Le Flambeau offre un cadre d'apprentissage d'exception où l'excellence académique rencontre la rigueur morale. Découvrez une institution dédiée au succès de chaque enfant.
                </p>

                <div className="pt-4">
                  <Link href="/about" className="inline-flex items-center gap-2 text-[#D32D3F] font-bold border-b-2 border-[#D32D3F] pb-1 hover:gap-4 transition-all group">
                    En savoir plus sur notre mission <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                  </Link>
                </div>
              </FadeIn>

              <FadeIn direction="left" className="relative">
                <div className="aspect-video rounded-[3rem] overflow-hidden shadow-[0_40px_80px_-15px_rgba(0,0,0,0.15)] border-[8px] border-white relative z-10">
                   <img 
                    src="/images/school_facade_wide.jpg" 
                    alt="Collège Le Flambeau" 
                    className="w-full h-full object-cover"
                  />
                </div>
                <div className="absolute -bottom-6 -right-6 w-32 h-32 bg-[#D32D3F] rounded-3xl -z-0 animate-pulse opacity-20 blur-xl"></div>
              </FadeIn>
            </div>
          </div>
        </section>

        {/* Core Values Section - NEW ADDITION */}
        <section className="py-24 bg-slate-50">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <FadeIn className="text-center mb-20">
              <h2 className="text-sm font-bold text-[#D32D3F] uppercase tracking-[0.3em] mb-4">Nos Valeurs</h2>
              <p className="text-4xl font-extrabold text-slate-900">Les piliers de notre éducation</p>
            </FadeIn>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
              {[
                { icon: ShieldCheck, title: 'Discipline', desc: 'Un cadre rigoureux pour forger le caractère.' },
                { icon: Target, title: 'Excellence', desc: 'La quête perpétuelle du meilleur de soi-même.' },
                { icon: Heart, title: 'Intégrité', desc: 'L\'honnêteté au cœur de chaque action.' },
                { icon: Zap, title: 'Innovation', desc: 'S\'adapter aux défis du monde moderne.' }
              ].map((value, i) => (
                <FadeIn key={i} delay={i * 0.1} className="bg-white p-8 rounded-[2rem] shadow-sm border border-slate-100 hover:shadow-xl hover:-translate-y-2 transition-all duration-300">
                  <div className="w-14 h-14 bg-[#FFF8E7] rounded-2xl flex items-center justify-center mb-6 text-[#D32D3F]">
                    <value.icon className="w-7 h-7" />
                  </div>
                  <h4 className="text-xl font-bold text-slate-900 mb-3">{value.title}</h4>
                  <p className="text-slate-500 font-medium text-sm leading-relaxed">{value.desc}</p>
                </FadeIn>
              ))}
            </div>
          </div>
        </section>

        {/* Cycles Section */}
        <section className="py-24 bg-white">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <FadeIn className="text-center mb-20">
              <h2 className="text-sm font-bold text-[#D32D3F] uppercase tracking-[0.3em] mb-4">Nos Niveaux d'Études</h2>
              <p className="text-4xl font-extrabold text-slate-900">Un parcours complet de la maternelle au baccalauréat</p>
            </FadeIn>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              {[
                { 
                  title: 'Le Jardin Vert de Cassandre', 
                  description: 'Un cycle de 3 années d\'éveil ludique et éducatif pour les tout-petits. Initiation au dessin, à la lecture et à la créativité.',
                  details: ['3 Années d\'Éveil', 'Apprentissage de la lecture', 'Ateliers de dessin', 'Épanouissement sensoriel']
                },
                { 
                  title: 'Cycle Fondamental', 
                  description: 'Une base solide de la 1ère à la 9ème année fondamentale, mettant l\'accent sur la maîtrise des connaissances de base.',
                  details: ['De la 1ère à la 6ème AF', 'De la 7ème à la 9ème AF', 'Suivi pédagogique rigoureux']
                },
                { 
                  title: 'Nouveau Secondaire', 
                  description: 'Un cycle de préparation intensive du NS1 au NS4 (Terminale) pour la réussite au Baccalauréat Unique.',
                  details: ['De NS1 à NS3', 'NS4 (Classe de Terminale)', 'Spécialisations académiques']
                },
              ].map((cycle, i) => (
                <FadeIn key={i} delay={i * 0.15} className="bg-white p-10 rounded-[2.5rem] shadow-lg border border-slate-100 hover:shadow-2xl transition-all duration-500 flex flex-col h-full group">
                  <div className="mb-6">
                    <h3 className="text-2xl font-extrabold text-slate-900 mb-4 group-hover:text-[#D32D3F] transition-colors">{cycle.title}</h3>
                    <p className="text-slate-600 font-medium leading-relaxed text-sm mb-6">{cycle.description}</p>
                  </div>
                  <ul className="space-y-3 mb-8 flex-1">
                    {cycle.details.map((detail, j) => (
                      <li key={j} className="flex items-center gap-3 text-slate-500 font-bold text-[10px] uppercase tracking-widest">
                        <CheckCircle2 className="w-3 h-3 text-[#D32D3F]" />
                        {detail}
                      </li>
                    ))}
                  </ul>
                  <Link href="/programs" className="inline-flex items-center gap-2 text-xs font-bold text-[#D32D3F] hover:gap-3 transition-all">
                    Découvrir le programme <ArrowRight className="w-3 h-3" />
                  </Link>
                </FadeIn>
              ))}
            </div>
          </div>
        </section>

        {/* Statistics Section - ANIMATED COUNTERS */}
        <section className="py-24 bg-slate-900 text-white relative overflow-hidden">
          <div className="absolute top-0 left-0 w-full h-full overflow-hidden opacity-10 pointer-events-none">
            <div className="absolute -top-24 -left-24 w-96 h-96 bg-[#FDE68A] rounded-full blur-3xl"></div>
            <div className="absolute -bottom-24 -right-24 w-96 h-96 bg-[#D32D3F] rounded-full blur-3xl"></div>
          </div>
          
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
            <div className="grid grid-cols-2 md:grid-cols-4 gap-12 text-center">
              {[
                { number: 250, suffix: '+', label: 'Étudiants' },
                { number: 40, suffix: '+', label: 'Personnel' },
                { number: 25, suffix: '+', label: 'Professeurs' },
                { number: 95, suffix: '%', label: 'Réussite' }
              ].map((stat, i) => (
                <FadeIn key={i} delay={i * 0.1}>
                  <p className="text-6xl font-extrabold mb-3 text-[#FDE68A]">
                    <Counter to={stat.number} suffix={stat.suffix} />
                  </p>
                  <p className="text-slate-400 font-bold uppercase tracking-[0.3em] text-[10px]">{stat.label}</p>
                </FadeIn>
              ))}
            </div>
          </div>
        </section>

        {/* CTA Section */}
        <section className="py-32 bg-white relative">
          <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
            <FadeIn>
              <h2 className="text-4xl md:text-5xl font-extrabold text-slate-900 mb-8 leading-tight">
                Prêt à rejoindre <br /> l'excellence ?
              </h2>
              <p className="text-xl text-slate-600 mb-12 max-w-2xl mx-auto font-medium">
                Offrez à votre enfant une éducation d'exception dans un cadre sécurisé et stimulant. Les admissions pour l'année académique 2026-2027 sont ouvertes.
              </p>
              <div className="flex flex-col sm:flex-row gap-6 justify-center">
                <Link 
                  href="/admissions"
                  className="px-10 py-5 bg-[#D32D3F] text-white font-extrabold rounded-2xl hover:bg-[#8B1A26] transition-all shadow-2xl shadow-[#D32D3F]/30 transform hover:scale-105 active:scale-95"
                >
                  📝 Demander une admission
                </Link>
                <Link
                  href="/contact"
                  className="px-10 py-5 bg-white text-slate-900 font-extrabold rounded-2xl hover:bg-slate-50 transition-all border-2 border-slate-100 shadow-sm transform hover:scale-105 active:scale-95"
                >
                  📞 Nous Contacter
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

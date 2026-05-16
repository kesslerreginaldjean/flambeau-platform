import React from 'react';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import SEO from '@/components/SEO';
import FadeIn from '@/components/FadeIn';
import { ShieldCheck, Target, GraduationCap, Heart, Zap } from 'lucide-react';

export default function About() {
  return (
    <div className="min-h-screen bg-white">
      <SEO 
        title="À propos" 
        description="Découvrez l'histoire, la vision et les valeurs du Collège Le Flambeau. Une institution d'excellence dédiée à la formation de l'élite de demain."
      />
      <Header />

      <main className="pt-20 overflow-hidden">
        {/* Hero Section - Prestigieux */}
        <section className="relative py-32 bg-slate-900 text-white overflow-hidden">
          <div className="absolute top-0 right-0 w-1/2 h-full bg-[#D32D3F]/5 skew-x-[-20deg] translate-x-24"></div>
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
            <FadeIn>
              <h1 className="text-sm font-bold text-[#FDE68A] uppercase tracking-[0.4em] mb-6">Notre Institution</h1>
              <h2 className="text-5xl md:text-7xl font-extrabold leading-[1.1] mb-8">
                Porter haut le flambeau <br /> de la connaissance.
              </h2>
              <div className="w-24 h-2 bg-[#D32D3F] rounded-full"></div>
            </FadeIn>
          </div>
        </section>

        {/* Story Section */}
        <section className="py-32 bg-white">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-24 items-center">
              <FadeIn direction="right" className="space-y-8">
                <h3 className="text-4xl font-bold text-slate-900 leading-tight">Une Tradition de Discipline <br /> et d'Excellence</h3>
                <p className="text-xl text-slate-600 leading-relaxed font-medium">
                  Fondé avec la vision de transformer l'éducation en Haïti, le Collège Le Flambeau s'est imposé comme une institution de référence. Nous croyons que la réussite académique est indissociable d'une discipline de fer et de valeurs morales solides.
                </p>
                <div className="flex gap-10 pt-4">
                  <div className="text-center">
                    <p className="text-4xl font-extrabold text-[#D32D3F]">1998</p>
                    <p className="text-xs font-bold text-slate-400 uppercase tracking-widest mt-1">Fondation</p>
                  </div>
                  <div className="text-center">
                    <p className="text-4xl font-extrabold text-[#D32D3F]">10k+</p>
                    <p className="text-xs font-bold text-slate-400 uppercase tracking-widest mt-1">Diplômés</p>
                  </div>
                </div>
              </FadeIn>
              
              <FadeIn direction="left" className="relative">
                <div className="aspect-[4/3] rounded-[3.5rem] overflow-hidden shadow-[0_50px_100px_-20px_rgba(0,0,0,0.2)] border-[12px] border-white relative z-10">
                   <img 
                    src="/images/school_facade_wide.jpg" 
                    alt="Collège Le Flambeau" 
                    className="w-full h-full object-cover"
                  />
                </div>
                <div className="absolute -top-10 -left-10 w-64 h-64 bg-[#FFF8E7] rounded-full blur-3xl -z-0"></div>
              </FadeIn>
            </div>
          </div>
        </section>

        {/* Vision & Mission - Cards Style */}
        <section className="py-32 bg-slate-50">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
              <FadeIn direction="up" delay={0.1} className="p-12 bg-white rounded-[3rem] shadow-sm border border-slate-100 hover:shadow-2xl hover:-translate-y-2 transition-all duration-500">
                <div className="w-16 h-16 bg-[#FFF8E7] rounded-2xl flex items-center justify-center mb-10 text-[#D32D3F]">
                  <Target className="w-8 h-8" />
                </div>
                <h4 className="text-3xl font-bold text-slate-900 mb-6">Notre Vision</h4>
                <p className="text-slate-600 text-lg leading-relaxed font-medium">
                  Être le leader de l'éducation moderne en Haïti, en intégrant les technologies de pointe tout en préservant les fondements d'une éducation classique et rigoureuse.
                </p>
              </FadeIn>
              
              <FadeIn direction="up" delay={0.2} className="p-12 bg-white rounded-[3rem] shadow-sm border border-slate-100 hover:shadow-2xl hover:-translate-y-2 transition-all duration-500">
                <div className="w-16 h-16 bg-[#FFF8E7] rounded-2xl flex items-center justify-center mb-10 text-[#D32D3F]">
                  <ShieldCheck className="w-8 h-8" />
                </div>
                <h4 className="text-3xl font-bold text-slate-900 mb-6">Notre Mission</h4>
                <p className="text-slate-600 text-lg leading-relaxed font-medium">
                  Offrir à chaque apprenant les outils nécessaires pour son plein épanouissement intellectuel, physique et moral dans un environnement d'apprentissage d'excellence.
                </p>
              </FadeIn>
            </div>
          </div>
        </section>

        {/* Values - High End Layout */}
        <section className="py-32 bg-white">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <FadeIn className="text-center mb-24">
               <h3 className="text-sm font-bold text-[#D32D3F] uppercase tracking-[0.4em] mb-4">Nos Valeurs</h3>
               <p className="text-5xl font-extrabold text-slate-900">Le socle de notre réussite</p>
            </FadeIn>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-16">
              {[
                { icon: GraduationCap, title: 'Excellence', text: 'La recherche permanente de la qualité dans tout ce que nous entreprenons.' },
                { icon: Zap, title: 'Discipline', text: 'Le respect des règles et de soi-même comme moteur de progrès constant.' },
                { icon: Heart, title: 'Intégrité', text: 'L\'honnêteté et la transparence au cœur de notre communauté scolaire.' }
              ].map((value, i) => (
                <FadeIn key={i} delay={i * 0.15} className="group text-center space-y-8">
                  <div className="w-24 h-24 bg-white rounded-[2.5rem] flex items-center justify-center mx-auto text-[#D32D3F] shadow-lg group-hover:bg-[#D32D3F] group-hover:text-white transition-all duration-500 transform group-hover:rotate-12 border border-slate-100">
                    <value.icon className="w-10 h-10" />
                  </div>
                  <div>
                    <h5 className="text-2xl font-bold text-slate-900 mb-4">{value.title}</h5>
                    <p className="text-slate-500 font-medium leading-relaxed max-w-xs mx-auto">{value.text}</p>
                  </div>
                </FadeIn>
              ))}
            </div>
          </div>
        </section>

        {/* Founder Section */}
        <section className="py-32 bg-slate-900 text-white relative overflow-hidden">
           <div className="absolute top-0 left-0 w-full h-full bg-[#D32D3F]/5 opacity-50"></div>
           <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-24 items-center">
                 <FadeIn direction="right" className="relative order-2 lg:order-1">
                    <div className="aspect-[4/5] rounded-[4rem] overflow-hidden shadow-2xl relative z-10 border-[12px] border-white/10">
                       <img src="/images/directeur_fondateur.jpg" alt="M. René Jean" className="w-full h-full object-cover" />
                    </div>
                    <div className="absolute -bottom-10 -right-10 w-64 h-64 bg-[#D32D3F] rounded-full blur-[120px] opacity-20 -z-0"></div>
                 </FadeIn>
                 
                 <FadeIn direction="left" className="space-y-10 order-1 lg:order-2">
                    <div className="w-20 h-2 bg-[#D32D3F] rounded-full mb-10"></div>
                    <h3 className="text-4xl md:text-5xl font-bold leading-tight">Le Mot du Directeur Fondateur</h3>
                    <div className="space-y-6 text-2xl text-slate-300 font-medium leading-relaxed italic">
                       <p className="relative">
                         <span className="absolute -top-10 -left-10 text-8xl text-white/10 font-serif">"</span>
                          L'éducation est le flambeau qui éclaire le chemin de l'avenir. Notre mission au collège est de porter ce flambeau avec dignité, discipline et une quête incessante de l'excellence académique.
                         <span className="absolute -bottom-10 right-0 text-8xl text-white/10 font-serif">"</span>
                       </p>
                    </div>
                    <div className="pt-8 border-t border-white/10">
                       <h3 className="text-3xl font-bold text-white mb-2">M. René Jean</h3>
                       <p className="text-[#D32D3F] font-bold uppercase tracking-widest text-sm">Directeur Fondateur & Visionnaire</p>
                    </div>
                    <p className="text-slate-400 text-lg leading-relaxed pt-4 font-medium">
                       Sous sa direction, le Collège Le Flambeau est devenu un pilier de la communauté éducative, mettant l'accent sur le développement intégral de chaque enfant. Son dévouement total à la cause de l'éducation inspire chaque jour nos élèves et notre personnel.
                    </p>
                 </FadeIn>
              </div>
           </div>
        </section>
      </main>

      <Footer />
    </div>
  );
}

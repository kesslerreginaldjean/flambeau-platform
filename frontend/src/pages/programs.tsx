import React from 'react';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import SEO from '@/components/SEO';
import FadeIn from '@/components/FadeIn';
import { BookOpen, CheckCircle2, Palette, Brain, Languages, Globe, Rocket, Microscope, Calculator } from 'lucide-react';

export default function Programs() {
  return (
    <div className="min-h-screen bg-white">
      <SEO 
        title="Nos Programmes" 
        description="De la maternelle au nouveau secondaire, découvrez notre offre académique complète axée sur l'excellence, la discipline et la réussite."
      />
      <Header />

      <main className="pt-20 overflow-hidden">
        {/* Header - Serious & Impactful */}
        <section className="py-32 bg-[#D32D3F] text-white relative overflow-hidden">
          <div className="absolute top-0 right-0 w-1/3 h-full bg-white/5 skew-x-[-15deg] translate-x-20"></div>
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center relative z-10">
            <FadeIn>
              <h1 className="text-sm font-bold uppercase tracking-[0.4em] mb-6 opacity-80">Parcours Académique</h1>
              <h2 className="text-5xl md:text-7xl font-extrabold leading-tight mb-8">
                L'excellence à chaque <br /> étape du savoir.
              </h2>
              <div className="w-24 h-2 bg-white/30 mx-auto rounded-full"></div>
            </FadeIn>
          </div>
        </section>

        {/* Kindergarten Section - Ludic & Elegant */}
        <section className="py-32 bg-white">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-24 items-center">
              <FadeIn direction="right" className="order-2 lg:order-1">
                 <div className="relative">
                    <div className="aspect-[4/3] rounded-[3.5rem] overflow-hidden shadow-2xl border-[12px] border-white relative z-10 bg-slate-100">
                      <img 
                        src="https://images.unsplash.com/photo-1503676260728-1c00da094a0b?q=80&w=1000&auto=format&fit=crop" 
                        alt="Jardin Vert de Cassandre" 
                        className="w-full h-full object-cover"
                      />
                    </div>
                    <div className="absolute -bottom-10 -right-10 w-64 h-64 bg-[#FFF8E7] rounded-full blur-3xl -z-0"></div>
                 </div>
              </FadeIn>
              
              <FadeIn direction="left" className="order-1 lg:order-2 space-y-8">
                <div>
                  <h3 className="text-[#D32D3F] font-extrabold uppercase tracking-widest text-xs mb-4">Le Jardin Vert de Cassandre</h3>
                  <h4 className="text-4xl md:text-5xl font-bold text-slate-900 leading-tight">Maternelle : <br />L'éveil des talents.</h4>
                </div>
                <p className="text-xl text-slate-600 font-medium leading-relaxed">
                  Un cycle de trois années d'initiation douce et structurée. Notre approche favorise l'éveil des sens, la curiosité et les premiers pas vers la lecture et l'écriture dans un cadre sécurisant.
                </p>
                <div className="grid grid-cols-2 gap-8 pt-6">
                   {[
                     { icon: Palette, title: 'Expression Artistique', text: 'Peinture & dessin' },
                     { icon: BookOpen, title: 'Pré-Lecture', text: 'Contes & Alphabet' },
                     { icon: Brain, title: 'Psychomotricité', text: 'Développement physique' },
                     { icon: Languages, title: 'Langage oral', text: 'Expression & Vocabulaire' }
                   ].map((item, i) => (
                     <div key={i} className="flex gap-4 group">
                       <div className="w-10 h-10 bg-[#FFF8E7] rounded-xl flex items-center justify-center text-[#D32D3F] group-hover:bg-[#D32D3F] group-hover:text-white transition-all">
                         <item.icon className="w-5 h-5" />
                       </div>
                       <div>
                         <p className="font-bold text-slate-900 text-sm">{item.title}</p>
                         <p className="text-xs text-slate-500 font-medium">{item.text}</p>
                       </div>
                     </div>
                   ))}
                </div>
              </FadeIn>
            </div>
          </div>
        </section>

        {/* Fondamental Section - Academic Rigor */}
        <section className="py-32 bg-slate-50 relative overflow-hidden">
          <div className="absolute top-0 left-0 w-full h-full bg-[#D32D3F]/5 skew-y-6 translate-y-32"></div>
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-24 items-start">
              <FadeIn direction="right" className="space-y-10">
                <div>
                  <h3 className="text-[#D32D3F] font-extrabold uppercase tracking-widest text-xs mb-4">Cycle Fondamental</h3>
                  <h4 className="text-4xl md:text-5xl font-bold text-slate-900 leading-tight">Bâtir des fondations <br /> indestructibles.</h4>
                </div>
                <p className="text-xl text-slate-600 font-medium leading-relaxed">
                  De la 1ère à la 9ème année fondamentale, nous mettons l'accent sur la maîtrise parfaite des disciplines de base tout en ouvrant l'esprit des élèves aux sciences et à la culture générale.
                </p>
                <div className="space-y-4 pt-4">
                  {['Français & Créole (Maîtrise linguistique)', 'Mathématiques (Raisonnement logique)', 'Sciences Sociales & Citoyenneté', 'Sciences Expérimentales', 'Anglais & Espagnol (Initiation)'].map((sub, i) => (
                    <div key={i} className="flex items-center gap-4 text-slate-700 font-bold text-sm bg-white p-4 rounded-2xl shadow-sm border border-slate-100">
                      <CheckCircle2 className="w-5 h-5 text-green-500" />
                      {sub}
                    </div>
                  ))}
                </div>
              </FadeIn>

              <FadeIn direction="left" className="bg-white p-12 rounded-[3.5rem] shadow-2xl border border-slate-100 relative">
                <div className="absolute -top-6 -right-6 w-24 h-24 bg-[#D32D3F] rounded-3xl flex items-center justify-center text-white shadow-xl">
                  <Rocket className="w-10 h-10" />
                </div>
                <h5 className="font-bold text-slate-400 uppercase tracking-widest text-xs mb-10">Nos Objectifs Clés</h5>
                <div className="space-y-12">
                  <div className="group">
                    <p className="text-2xl font-bold text-slate-900 mb-4 group-hover:text-[#D32D3F] transition-colors">Excellence Académique</p>
                    <p className="text-slate-500 font-medium leading-relaxed">Préparation intensive aux examens officiels avec un suivi personnalisé pour chaque élève.</p>
                  </div>
                  <div className="group">
                    <p className="text-2xl font-bold text-slate-900 mb-4 group-hover:text-[#D32D3F] transition-colors">Discipline Personnelle</p>
                    <p className="text-slate-500 font-medium leading-relaxed">Cultiver l'autonomie, le respect des règles et le sens des responsabilités dès le plus jeune âge.</p>
                  </div>
                  <div className="group">
                    <p className="text-2xl font-bold text-slate-900 mb-4 group-hover:text-[#D32D3F] transition-colors">Culture Générale</p>
                    <p className="text-slate-500 font-medium leading-relaxed">Encourager la lecture et la curiosité intellectuelle à travers des projets pédagogiques variés.</p>
                  </div>
                </div>
              </FadeIn>
            </div>
          </div>
        </section>

        {/* Secondary Section - Specializations */}
        <section className="py-32 bg-white">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-24 items-center">
              <FadeIn direction="right" className="order-2 lg:order-1">
                <div className="bg-slate-900 rounded-[3.5rem] p-12 text-white shadow-2xl relative overflow-hidden">
                   <div className="absolute top-0 right-0 w-32 h-32 bg-[#D32D3F]/20 blur-3xl"></div>
                   <h5 className="font-bold text-[#FDE68A] uppercase tracking-widest text-xs mb-10">Filières Nouveau Secondaire</h5>
                   <div className="space-y-6">
                     {[
                       { code: 'SVT', title: 'Sciences de la Vie et de la Terre', icon: Microscope },
                       { code: 'SMP', title: 'Sciences Mathématiques et Physiques', icon: Calculator },
                       { code: 'SES', title: 'Sciences Économiques et Sociales', icon: Globe }
                     ].map((filiere, i) => (
                       <div key={i} className="flex items-center justify-between p-6 rounded-2xl bg-white/5 border border-white/10 hover:bg-white/10 transition-all group">
                         <div className="flex items-center gap-4">
                           <div className="w-10 h-10 rounded-xl bg-[#D32D3F]/20 flex items-center justify-center text-[#D32D3F]">
                             <filiere.icon className="w-5 h-5" />
                           </div>
                           <div>
                             <p className="font-bold text-lg">{filiere.code}</p>
                             <p className="text-xs text-slate-400 font-medium">{filiere.title}</p>
                           </div>
                         </div>
                         <div className="w-2 h-2 rounded-full bg-[#D32D3F] opacity-0 group-hover:opacity-100 transition-opacity"></div>
                       </div>
                     ))}
                   </div>
                   <div className="mt-12 pt-8 border-t border-white/10">
                      <p className="text-sm text-slate-400 font-medium leading-relaxed italic text-center">
                        "Un accompagnement sur mesure pour réussir son entrée à l'université."
                      </p>
                   </div>
                </div>
              </FadeIn>

              <FadeIn direction="left" className="order-1 lg:order-2 space-y-10">
                <div>
                  <h3 className="text-[#D32D3F] font-extrabold uppercase tracking-widest text-xs mb-4">Nouveau Secondaire</h3>
                  <h4 className="text-4xl md:text-5xl font-bold text-slate-900 leading-tight">L'élite se prépare ici <br />(NS1 à NS4).</h4>
                </div>
                <p className="text-xl text-slate-600 font-medium leading-relaxed">
                  Le cycle secondaire est l'étape cruciale vers l'enseignement supérieur. Nous préparons nos élèves au Baccalauréat Unique avec une exigence académique de haut niveau, tout en les aidant à définir leur projet d'avenir.
                </p>
                <div className="flex gap-16 pt-4">
                  <div className="space-y-2">
                    <p className="text-5xl font-extrabold text-[#D32D3F]">100%</p>
                    <p className="text-xs font-bold text-slate-400 uppercase tracking-widest">Taux d'accès Bac</p>
                  </div>
                  <div className="space-y-2">
                    <p className="text-5xl font-extrabold text-slate-900">95%</p>
                    <p className="text-xs font-bold text-slate-400 uppercase tracking-widest">Moyenne de Réussite</p>
                  </div>
                </div>
              </FadeIn>
            </div>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
}

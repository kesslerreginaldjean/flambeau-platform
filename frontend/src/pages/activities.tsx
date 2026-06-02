import Link from 'next/link';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import SEO from '@/components/SEO';
import FadeIn from '@/components/FadeIn';
import { Palette, Trophy, Globe, Heart, Zap, Music, ArrowRight } from 'lucide-react';

export default function Activities() {
  return (
    <div className="min-h-screen bg-white">
      <SEO 
        title="Vie Scolaire & Activités" 
        description="Découvrez l'épanouissement de nos élèves à travers le sport, les arts, la science et l'engagement citoyen au Collège Le Flambeau."
      />
      <Header />

      <main className="pt-20 overflow-hidden">
        {/* Hero Section - Joyful & Dynamic */}
        <section className="py-32 bg-slate-900 text-white relative overflow-hidden">
          <div className="absolute top-0 left-0 w-full h-full opacity-10 pointer-events-none">
            <div className="absolute top-10 left-10 w-64 h-64 bg-[#FDE68A] rounded-full blur-[100px]"></div>
            <div className="absolute bottom-10 right-10 w-96 h-96 bg-[#D32D3F] rounded-full blur-[120px]"></div>
          </div>
          
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center relative z-10">
            <FadeIn>
              <h1 className="text-sm font-bold text-[#FDE68A] uppercase tracking-[0.4em] mb-6">Épanouissement</h1>
              <h2 className="text-5xl md:text-7xl font-extrabold leading-tight mb-8">
                Bien plus qu'une école, <br /> un milieu de vie.
              </h2>
              <div className="w-24 h-2 bg-[#D32D3F] mx-auto rounded-full"></div>
            </FadeIn>
          </div>
        </section>

        {/* Categories Section - Animated Cards */}
        <section className="py-32 bg-white">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <FadeIn className="text-center mb-20">
               <h3 className="text-4xl font-extrabold text-slate-900">Explorez nos activités</h3>
               <p className="text-xl text-slate-500 mt-4 font-medium">Le développement intégral de l'élève au cœur de nos priorités.</p>
            </FadeIn>
            
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-10">
              {[
                { 
                  icon: Trophy, 
                  title: 'Excellence Sportive', 
                  desc: 'Football, Basketball et Athlétisme pour cultiver l\'esprit d\'équipe, la santé et la persévérance.' 
                },
                { 
                  icon: Palette, 
                  title: 'Arts & Créativité', 
                  desc: 'Théâtre, dessin et arts plastiques pour stimuler l\'expression de soi et l\'imagination.' 
                },
                { 
                  icon: Zap, 
                  title: 'Science & Innovation', 
                  desc: 'Clubs de robotique et ateliers technologiques pour préparer les innovateurs de demain.' 
                },
                { 
                  icon: Globe, 
                  title: 'Citoyenneté', 
                  desc: 'Débats, projets écologiques et sorties éducatives pour comprendre et agir sur le monde.' 
                },
                { 
                  icon: Music, 
                  title: 'Musique & Rythme', 
                  desc: 'Chant chorale et initiation musicale pour développer l\'oreille et la sensibilité artistique.' 
                },
                { 
                  icon: Heart, 
                  title: 'Engagement Social', 
                  desc: 'Projets d\'entraide et bénévolat pour cultiver l\'empathie et la responsabilité citoyenne.' 
                }
              ].map((activity, i) => (
                <FadeIn key={i} delay={i * 0.1} className="group p-12 bg-slate-50 rounded-[3rem] border border-transparent hover:bg-white hover:border-slate-100 hover:shadow-2xl transition-all duration-500">
                  <div className="w-16 h-16 bg-white rounded-2xl flex items-center justify-center mb-10 shadow-sm group-hover:bg-[#D32D3F] group-hover:text-white transition-all duration-300 transform group-hover:scale-110">
                    <activity.icon className="w-8 h-8" />
                  </div>
                  <h3 className="text-2xl font-bold text-slate-900 mb-4 group-hover:text-[#D32D3F] transition-colors">{activity.title}</h3>
                  <p className="text-slate-600 font-medium leading-relaxed">
                    {activity.desc}
                  </p>
                </FadeIn>
              ))}
            </div>
          </div>
        </section>

        {/* Gallery Teaser - Professional & Artistic Layout */}
        <section className="py-32 bg-slate-50 relative">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-24 items-center">
              <FadeIn direction="right" className="space-y-10">
                <div>
                  <h3 className="text-sm font-bold text-[#D32D3F] uppercase tracking-[0.4em] mb-4">Capturer l'instant</h3>
                  <h4 className="text-4xl md:text-5xl font-extrabold text-slate-900 leading-tight">Vivez les moments forts de l'année.</h4>
                </div>
                <p className="text-xl text-slate-600 font-medium leading-relaxed">
                  Notre galerie photo témoigne de la vitalité de notre établissement. Des compétitions sportives aux spectacles de fin d'année, chaque moment est une célébration de la vie et du talent.
                </p>
                <div className="pt-4">
                  <Link href="/gallery" className="group inline-flex items-center gap-4 px-10 py-5 bg-[#D32D3F] text-white font-extrabold rounded-2xl hover:bg-[#8B1A26] transition-all shadow-2xl shadow-[#D32D3F]/30 transform hover:scale-105 active:scale-95">
                    Consulter la Galerie Complète <ArrowRight className="w-5 h-5 group-hover:translate-x-2 transition-transform" />
                  </Link>
                </div>
              </FadeIn>

              <FadeIn direction="left" className="grid grid-cols-2 gap-6 relative">
                 <div className="space-y-6">
                    <div className="aspect-square rounded-[2.5rem] overflow-hidden shadow-xl border-8 border-white group">
                      <img src="/images/activity_conference.jpg" alt="Conférence" className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700" />
                    </div>
                    <div className="aspect-square rounded-[2.5rem] overflow-hidden shadow-xl border-8 border-white group">
                      <img src="/images/activity_workshop.jpg" alt="Atelier" className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700" />
                    </div>
                 </div>
                 <div className="space-y-6 pt-12">
                    <div className="aspect-square rounded-[2.5rem] overflow-hidden shadow-xl border-8 border-white group">
                      <img src="/images/activity_students.jpg" alt="Élèves" className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700" />
                    </div>
                    <div className="aspect-square rounded-[2.5rem] overflow-hidden shadow-xl border-8 border-white group">
                      <img src="/images/activity_gala.jpg" alt="Gala" className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700" />
                    </div>
                 </div>
                 {/* Decorative Circle */}
                 <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-32 h-32 bg-[#FDE68A] rounded-full -z-10 blur-3xl opacity-50"></div>
              </FadeIn>
            </div>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
}

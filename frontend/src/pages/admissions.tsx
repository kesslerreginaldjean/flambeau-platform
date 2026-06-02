import { useState } from 'react';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import SEO from '@/components/SEO';
import FadeIn from '@/components/FadeIn';
import { FileText, Users, Search, CheckCircle2, Info, Upload, ArrowRight, ShieldCheck } from 'lucide-react';

import { authFetch } from "@/lib/authFetch";
export default function Admissions() {
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    phone: '',
    level: '',
    message: '',
    birthCertificate: null,
    reportCard: null,
    identityPhotos: null,
    medicalCertificate: null
  });

  const [loading, setLoading] = useState(false);

  const handleChange = (e: any) => {
    const { name, value, files } = e.target;
    setFormData({
      ...formData,
      [name]: files ? files[0] : value
    });
  };

  const handleSubmit = async (e: any) => {
    e.preventDefault();
    setLoading(true);
    
    try {
      const apiUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000';
      const data = new FormData();
      Object.entries(formData).forEach(([key, value]) => {
        if (value) data.append(key, value);
      });

      const response = await authFetch(`${apiUrl}/api/admissions`, {
        method: 'POST',
        body: data,
      });

      if (!response.ok) throw new Error('Erreur lors de l\'envoi');

      alert('Votre dossier a été soumis avec succès ! Nous allons l\'étudier avec attention et nous vous contacterons pour organiser un entretien avec le secrétariat.');
      setFormData({
        firstName: '', lastName: '', email: '', phone: '', level: '', message: '',
        birthCertificate: null, reportCard: null, identityPhotos: null, medicalCertificate: null
      });
    } catch (error) {
      alert('Une erreur est survenue. Veuillez réessayer ou contacter le secrétariat.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-white">
      <SEO 
        title="Admission en ligne" 
        description="Simplifiez l'avenir de votre enfant. Soumettez votre demande d'admission au Collège Le Flambeau directement en ligne en quelques minutes."
      />
      <Header />

      <main className="pt-20 overflow-hidden">
        {/* Header - Serious & Reassuring */}
        <section className="py-32 bg-slate-900 text-white relative overflow-hidden">
          <div className="absolute top-0 right-0 w-1/2 h-full bg-[#D32D3F]/5 skew-x-[-20deg] translate-x-20"></div>
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center relative z-10">
            <FadeIn>
              <h1 className="text-sm font-bold uppercase tracking-[0.4em] mb-6 text-[#FDE68A]">Inscriptions 2026-2027</h1>
              <h2 className="text-5xl md:text-7xl font-extrabold leading-tight mb-8">
                Préparez le futur <br /> dès aujourd'hui.
              </h2>
              <p className="text-xl text-slate-400 max-w-2xl mx-auto font-medium">
                Un processus d'admission simple, transparent et entièrement numérisé pour votre confort.
              </p>
            </FadeIn>
          </div>
        </section>

        <section className="py-32 bg-white">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-24">
              
              {/* Process Steps */}
              <div className="space-y-16">
                <FadeIn direction="right">
                  <h3 className="text-4xl font-bold text-slate-900 mb-12">Le parcours d'admission</h3>
                  <div className="space-y-12">
                    {[
                      { icon: FileText, title: 'Candidature en ligne', text: 'Remplissez le formulaire et téléchargez les pièces requises en toute sécurité.' },
                      { icon: Search, title: 'Étude du dossier', text: 'Notre direction examine attentivement le parcours et les besoins de l\'enfant.' },
                      { icon: Users, title: 'Entretien de motivation', text: 'Une rencontre pour échanger sur notre vision et les objectifs de l\'élève.' },
                      { icon: CheckCircle2, title: 'Confirmation finale', text: 'Une fois admis, vous recevez vos accès au portail et l\'uniforme de l\'école.' }
                    ].map((step, i) => (
                      <div key={i} className="flex gap-8 group">
                        <div className="w-16 h-16 bg-slate-50 rounded-[1.5rem] flex items-center justify-center flex-shrink-0 text-[#D32D3F] group-hover:bg-[#D32D3F] group-hover:text-white transition-all duration-300 shadow-sm">
                          <step.icon className="w-7 h-7" />
                        </div>
                        <div>
                          <h4 className="text-2xl font-bold text-slate-900 mb-2">{step.title}</h4>
                          <p className="text-slate-600 font-medium leading-relaxed">{step.text}</p>
                        </div>
                      </div>
                    ))}
                  </div>
                </FadeIn>

                <FadeIn direction="up" delay={0.4} className="p-10 bg-[#FFF8E7]/50 rounded-[3rem] border border-[#FDE68A]/30 relative overflow-hidden">
                  <div className="absolute top-0 right-0 w-32 h-32 bg-[#FDE68A]/20 blur-3xl rounded-full"></div>
                  <div className="flex gap-4 items-start mb-8 relative z-10">
                     <div className="w-10 h-10 bg-white rounded-xl flex items-center justify-center shadow-sm">
                        <Info className="w-5 h-5 text-[#D32D3F]" />
                     </div>
                     <p className="font-bold text-slate-900 uppercase tracking-widest text-xs mt-2">Dossier de candidature</p>
                  </div>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 relative z-10">
                    {['Acte de naissance', 'Dernier bulletin scolaire', '2 photos d\'identité', 'Certificat médical'].map((p, i) => (
                      <div key={i} className="flex items-center gap-3 text-slate-700 font-bold text-xs uppercase tracking-wide">
                        <CheckCircle2 className="w-4 h-4 text-green-500" />
                        {p}
                      </div>
                    ))}
                  </div>
                  <div className="mt-10 pt-6 border-t border-[#FDE68A]/50 flex items-center gap-3 text-slate-500">
                    <ShieldCheck className="w-5 h-5 text-[#D32D3F]" />
                    <p className="text-xs font-bold italic">Vos données sont protégées et traitées avec confidentialité.</p>
                  </div>
                </FadeIn>
              </div>

              {/* Admission Form */}
              <FadeIn direction="left" className="relative">
                <div className="bg-white p-10 md:p-14 rounded-[4rem] shadow-[0_50px_100px_-20px_rgba(0,0,0,0.1)] border border-slate-100 relative z-10">
                   <h3 className="text-3xl font-extrabold text-slate-900 mb-10 flex items-center gap-3">
                     Formulaire Admission
                     <span className="w-2 h-2 rounded-full bg-[#D32D3F] animate-ping"></span>
                   </h3>
                   <form onSubmit={handleSubmit} className="space-y-8">
                     <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                       <div className="space-y-3">
                         <label className="text-xs font-bold text-slate-400 uppercase tracking-widest ml-1">Prénom de l'élève</label>
                         <input 
                           type="text" name="firstName" value={formData.firstName} onChange={handleChange} required
                           placeholder="Ex: Jean"
                           className="w-full bg-slate-50 border-2 border-transparent rounded-[1.5rem] px-8 py-5 focus:border-[#D32D3F] focus:bg-white outline-none transition-all font-bold text-slate-900" 
                         />
                       </div>
                       <div className="space-y-3">
                         <label className="text-xs font-bold text-slate-400 uppercase tracking-widest ml-1">Nom de l'élève</label>
                         <input 
                           type="text" name="lastName" value={formData.lastName} onChange={handleChange} required
                           placeholder="Ex: Durand"
                           className="w-full bg-slate-50 border-2 border-transparent rounded-[1.5rem] px-8 py-5 focus:border-[#D32D3F] focus:bg-white outline-none transition-all font-bold text-slate-900" 
                         />
                       </div>
                     </div>

                     <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                       <div className="space-y-3">
                         <label className="text-xs font-bold text-slate-400 uppercase tracking-widest ml-1">Email du tuteur</label>
                         <input 
                           type="email" name="email" value={formData.email} onChange={handleChange} required
                           placeholder="email@exemple.com"
                           className="w-full bg-slate-50 border-2 border-transparent rounded-[1.5rem] px-8 py-5 focus:border-[#D32D3F] focus:bg-white outline-none transition-all font-bold text-slate-900" 
                         />
                       </div>
                       <div className="space-y-3">
                         <label className="text-xs font-bold text-slate-400 uppercase tracking-widest ml-1">Téléphone</label>
                         <input 
                           type="tel" name="phone" value={formData.phone} onChange={handleChange} required
                           placeholder="+509 0000-0000"
                           className="w-full bg-slate-50 border-2 border-transparent rounded-[1.5rem] px-8 py-5 focus:border-[#D32D3F] focus:bg-white outline-none transition-all font-bold text-slate-900" 
                         />
                       </div>
                     </div>

                     <div className="space-y-3">
                       <label className="text-xs font-bold text-slate-400 uppercase tracking-widest ml-1">Niveau Souhaité</label>
                       <div className="relative">
                         <select 
                           name="level" value={formData.level} onChange={handleChange} required
                           className="w-full bg-slate-50 border-2 border-transparent rounded-[1.5rem] px-8 py-5 focus:border-[#D32D3F] focus:bg-white outline-none transition-all font-bold text-slate-900 appearance-none cursor-pointer"
                         >
                           <option value="">Choisissez un niveau</option>
                           <optgroup label="Le Jardin Vert de Cassandre">
                             <option value="1ère Maternelle">1ère Année Maternelle</option>
                             <option value="2ème Maternelle">2ème Année Maternelle</option>
                             <option value="3ème Maternelle">3ème Année Maternelle</option>
                           </optgroup>
                           <optgroup label="Cycle Fondamental">
                             <option value="1ère AF">1ère AF</option>
                             <option value="2ème AF">2ème AF</option>
                             <option value="3ème AF">3ème AF</option>
                             <option value="4ème AF">4ème AF</option>
                             <option value="5ème AF">5ème AF</option>
                             <option value="6ème AF">6ème AF</option>
                             <option value="7ème AF">7ème AF</option>
                             <option value="8ème AF">8ème AF</option>
                             <option value="9ème AF">9ème AF</option>
                           </optgroup>
                           <optgroup label="Nouveau Secondaire">
                             <option value="NS1">NS1</option>
                             <option value="NS2">NS2</option>
                             <option value="NS3">NS3</option>
                             <option value="NS4 (Terminale)">NS4 (Terminale)</option>
                           </optgroup>
                         </select>
                         <div className="absolute right-6 top-1/2 -translate-y-1/2 pointer-events-none text-slate-400">
                           <ArrowRight className="w-5 h-5 rotate-90" />
                         </div>
                       </div>
                     </div>

                     {/* Custom Document Upload UI */}
                     <div className="space-y-6 pt-6 border-t border-slate-100">
                        <div className="flex justify-between items-end mb-2">
                           <p className="text-xs font-extrabold text-[#D32D3F] uppercase tracking-widest">Pièces jointes obligatoires</p>
                           <p className="text-[10px] font-bold text-slate-400 italic">Formats : JPG, PNG, PDF (max 5MB)</p>
                        </div>
                        
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                           {[
                             { name: 'birthCertificate', label: 'Acte Naissance', required: true },
                             { name: 'reportCard', label: 'Dernier Bulletin', required: true },
                             { name: 'identityPhotos', label: 'Photos Identité', required: true },
                             { name: 'medicalCertificate', label: 'Certificat Médical', required: false }
                           ].map((doc) => {
                             const file = (formData as any)[doc.name];
                             return (
                               <div key={doc.name} className="relative">
                                 <label className={`flex flex-col items-center justify-center w-full h-32 border-2 border-dashed rounded-[2rem] cursor-pointer transition-all group ${file ? 'bg-green-50 border-green-200 shadow-inner' : 'bg-slate-50 border-slate-200 hover:bg-[#FFF8E7] hover:border-[#D32D3F]/50'}`}>
                                   <div className="flex flex-col items-center justify-center p-4 text-center">
                                     {file ? (
                                       <CheckCircle2 className="w-6 h-6 text-green-500 mb-2" />
                                     ) : (
                                       <Upload className="w-5 h-5 text-slate-400 group-hover:text-[#D32D3F] mb-2 transition-colors" />
                                     )}
                                     <p className={`text-[10px] font-extrabold uppercase tracking-tight leading-tight ${file ? 'text-green-700' : 'text-slate-500 group-hover:text-slate-900'}`}>
                                       {file ? file.name : `${doc.label} ${doc.required ? '*' : ''}`}
                                     </p>
                                     {file && <p className="text-[8px] font-bold text-green-600/60 mt-1">Prêt à l'envoi</p>}
                                   </div>
                                   <input 
                                     type="file" 
                                     name={doc.name} 
                                     className="hidden" 
                                     accept=".pdf,.jpg,.jpeg,.png"
                                     onChange={handleChange} 
                                     required={doc.required} 
                                   />
                                 </label>
                               </div>
                             );
                           })}
                        </div>
                     </div>

                     <button 
                       type="submit"
                       disabled={loading}
                       className="group w-full py-6 bg-[#D32D3F] text-white font-extrabold rounded-[2rem] hover:bg-[#8B1A26] transition-all shadow-2xl shadow-[#D32D3F]/40 mt-8 flex items-center justify-center gap-3 transform hover:scale-[1.02] active:scale-95 disabled:opacity-50 disabled:cursor-not-allowed"
                     >
                       {loading ? 'Soumission en cours...' : 'Envoyer mon dossier'}
                       {!loading && <ArrowRight className="w-6 h-6 group-hover:translate-x-2 transition-transform" />}
                     </button>
                   </form>
                </div>
                {/* Decoration */}
                <div className="absolute -bottom-10 -left-10 w-48 h-48 bg-[#FDE68A]/30 rounded-full blur-3xl -z-0"></div>
              </FadeIn>

            </div>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
}

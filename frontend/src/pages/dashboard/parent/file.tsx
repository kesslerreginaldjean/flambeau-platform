import { useState, useEffect } from 'react';
import Head from 'next/head';
import { useRouter } from 'next/router';
import AppLayout from '@/components/layout/AppLayout';
import { PARENT_NAV_ITEMS } from '@/constants/navigation';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { 
  GraduationCap, ShieldAlert, BadgeDollarSign, 
  ArrowLeft, Download, Mail, History
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

import { authFetch } from "@/lib/authFetch";
export default function ParentChildFile() {
  const router = useRouter();
  const { childId } = router.query;
  const [student, setStudent] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('academic');

  useEffect(() => {
    if (!childId) return;

    const fetchChildFile = async () => {
      try {
        const response = await authFetch(`/api/parents/children/${childId}`);
        const data = await response.json();
        setStudent(data);
      } catch (error) {
        console.error('Error fetching child file:', error);
      } finally {
        setLoading(false);
      }
    };
    fetchChildFile();
  }, [childId]);

  if (loading) return <div className="p-20 text-center font-bold text-slate-400 animate-pulse text-xl uppercase tracking-widest">Récupération du dossier scolaire...</div>;
  if (!student) return <div className="p-20 text-center text-red-500 font-bold">Erreur : Dossier de l'enfant introuvable.</div>;

  return (
    <AppLayout navItems={PARENT_NAV_ITEMS} userName="Parent" userRoleLabel="Suivi Enfant">
      <Head><title>Dossier de {student.user.firstName} | Le Flambeau</title></Head>
      
      <div className="p-6 max-w-7xl mx-auto">
        <button 
          onClick={() => router.push('/dashboard/parent')}
          className="flex items-center gap-2 text-slate-500 hover:text-[#D32D3F] transition-colors font-bold mb-8 group uppercase text-xs tracking-widest"
        >
          <ArrowLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform" />
          Retour au Dashboard
        </button>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Sidebar Profil de l'enfant */}
          <div className="space-y-6">
            <Card className="overflow-hidden border-none shadow-2xl rounded-[2.5rem] bg-white">
              <div className="h-32 bg-gradient-to-r from-[#D32D3F] to-[#8B1A26]"></div>
              <CardContent className="relative pt-0 pb-10 px-8 text-center">
                <div className="flex justify-center">
                  <div className="w-32 h-32 rounded-[2rem] bg-white p-2 shadow-2xl -mt-16">
                    <div className="w-full h-full rounded-[1.5rem] bg-slate-100 flex items-center justify-center text-[#D32D3F] font-black text-4xl">
                      {student.user.firstName[0]}
                    </div>
                  </div>
                </div>
                
                <h2 className="text-3xl font-black text-slate-900 mt-6 tracking-tight">{student.user.firstName} {student.user.lastName}</h2>
                <Badge className="mt-2 bg-indigo-50 text-indigo-700 border-none font-black px-6 py-2 rounded-full uppercase tracking-tighter text-xs">
                  {student.enrollments?.[0]?.class?.level} {student.enrollments?.[0]?.class?.name}
                </Badge>
                <p className="text-slate-400 font-bold uppercase tracking-widest text-[10px] mt-4">Matricule {student.studentNumber}</p>
              </CardContent>
            </Card>

            <Card className="border-none shadow-xl rounded-[2.5rem] bg-slate-900 text-white p-8">
              <h4 className="font-black text-xs uppercase tracking-widest mb-6 opacity-50">Actions de Suivi</h4>
              <div className="space-y-4">
                <button className="w-full py-4 bg-white/10 hover:bg-[#D32D3F] transition-colors rounded-2xl font-black text-xs uppercase tracking-widest flex items-center justify-center gap-3">
                  <Download className="w-4 h-4" /> Bulletin PDF
                </button>
                <button className="w-full py-4 bg-white/10 hover:bg-white hover:text-slate-900 transition-colors rounded-2xl font-black text-xs uppercase tracking-widest flex items-center justify-center gap-3">
                  <Mail className="w-4 h-4" /> Contacter l'école
                </button>
              </div>
            </Card>
          </div>

          {/* Onglets et Contenu */}
          <div className="lg:col-span-2 space-y-6">
            <div className="flex p-2 bg-slate-100 rounded-[2.5rem] gap-2">
              {[
                { id: 'academic', label: 'Notes', icon: GraduationCap },
                { id: 'discipline', label: 'Conduite', icon: ShieldAlert },
                { id: 'payments', label: 'Scolarité', icon: BadgeDollarSign },
              ].map((tab) => (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`flex-1 flex items-center justify-center gap-2 py-4 rounded-[1.8rem] font-black text-xs uppercase tracking-widest transition-all ${
                    activeTab === tab.id 
                      ? 'bg-white text-[#D32D3F] shadow-xl scale-[1.02]' 
                      : 'text-slate-400 hover:text-slate-600'
                  }`}
                >
                  <tab.icon className="w-4 h-4" />
                  {tab.label}
                </button>
              ))}
            </div>

            <AnimatePresence mode="wait">
              <motion.div
                key={activeTab}
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.95 }}
                transition={{ duration: 0.2 }}
              >
                {activeTab === 'academic' && (
                  <Card className="border-none shadow-2xl rounded-[3rem] bg-white overflow-hidden">
                    <CardHeader className="p-10 pb-0">
                      <CardTitle className="text-2xl font-black text-slate-900 tracking-tight flex items-center gap-3">
                        <History className="w-7 h-7 text-[#D32D3F]" />
                        Performance Académique
                      </CardTitle>
                    </CardHeader>
                    <CardContent className="p-10">
                      {student.grades?.length > 0 ? (
                        <div className="space-y-4">
                          {student.grades.map((grade: any) => (
                            <div key={grade.id} className="flex items-center justify-between p-6 bg-slate-50 rounded-[2rem] hover:bg-slate-100 transition-all group">
                              <div className="flex items-center gap-6">
                                <div className="w-14 h-14 rounded-2xl bg-white shadow-sm flex items-center justify-center text-xl font-black text-[#D32D3F] group-hover:scale-110 transition-transform">
                                  {grade.score}
                                </div>
                                <div>
                                  <p className="font-black text-slate-900 text-lg">{grade.subject}</p>
                                  <p className="text-[10px] text-slate-400 font-bold uppercase tracking-widest mt-1">
                                    Trimestre {grade.term} • {grade.academicYear?.name}
                                  </p>
                                </div>
                              </div>
                              <Badge className="bg-white border-slate-100 text-slate-400 font-bold">{grade.teacherName}</Badge>
                            </div>
                          ))}
                        </div>
                      ) : (
                        <div className="text-center py-20 bg-slate-50 rounded-[2.5rem] border-2 border-dashed border-slate-200">
                          <p className="text-slate-400 font-black italic">Aucune note n'a encore été saisie pour ce trimestre.</p>
                        </div>
                      )}
                    </CardContent>
                  </Card>
                )}

                {activeTab === 'discipline' && (
                  <Card className="border-none shadow-2xl rounded-[3rem] bg-white p-10 text-center">
                    <div className="w-20 h-20 bg-green-50 rounded-full flex items-center justify-center mx-auto mb-6">
                      <ShieldAlert className="w-10 h-10 text-green-500" />
                    </div>
                    <h3 className="text-2xl font-black text-slate-900 mb-2 tracking-tight">Comportement Exemplaire</h3>
                    <p className="text-slate-400 font-medium max-w-sm mx-auto">Votre enfant n'a reçu aucune sanction ou remarque disciplinaire. Félicitations !</p>
                  </Card>
                )}

                {activeTab === 'payments' && (
                  <Card className="border-none shadow-2xl rounded-[3rem] bg-white p-10">
                    <h3 className="text-2xl font-black text-slate-900 mb-8 tracking-tight">État de la Scolarité</h3>
                    <div className="p-8 bg-green-50 rounded-[2.5rem] border border-green-100 flex items-center justify-between">
                      <div>
                        <p className="text-xs font-black text-green-600 uppercase tracking-widest mb-1">Statut Financier</p>
                        <p className="text-2xl font-black text-green-800 tracking-tight">Compte à jour ✅</p>
                      </div>
                      <BadgeDollarSign className="w-12 h-12 text-green-200" />
                    </div>
                  </Card>
                )}
              </motion.div>
            </AnimatePresence>
          </div>
        </div>
      </div>
    </AppLayout>
  );
}

import React, { useState, useEffect } from 'react';
import Head from 'next/head';
import { useRouter } from 'next/router';
import AppLayout from '@/components/layout/AppLayout';
import { STUDENT_NAV_ITEMS } from '@/constants/navigation';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { 
  User, Calendar, FileText, ShieldAlert, BadgeDollarSign, 
  History, GraduationCap, Download, Mail, Phone, MapPin
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

export default function StudentFile() {
  const router = useRouter();
  const [student, setStudent] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('academic');

  useEffect(() => {
    const fetchFile = async () => {
      try {
        const studentId = localStorage.getItem('user_id');
        if (studentId) {
          const response = await fetch(`http://localhost:5000/api/admin/students/${studentId}`); // Reusing admin detail route for now as it returns everything
          const data = await response.json();
          setStudent(data);
        } else {
          router.push('/login');
        }
      } catch (error) {
        console.error('Error fetching student file:', error);
      } finally {
        setLoading(false);
      }
    };
    fetchFile();
  }, [router]);

  if (loading) return <div className="p-20 text-center font-bold text-slate-400 animate-pulse">Chargement de ton dossier numérique...</div>;
  if (!student) return <div className="p-20 text-center text-red-500 font-bold">Erreur : Dossier introuvable.</div>;

  return (
    <AppLayout navItems={STUDENT_NAV_ITEMS} userName={`${student.firstName} ${student.lastName}`} userRoleLabel="Mon Dossier">
      <Head><title>Mon Dossier | Le Flambeau</title></Head>
      
      <div className="p-6 max-w-7xl mx-auto">
        <div className="mb-8">
          <h1 className="text-3xl font-black text-slate-900 tracking-tight flex items-center gap-3">
            <User className="w-8 h-8 text-[#D32D3F]" />
            Mon Dossier Numérique
          </h1>
          <p className="text-slate-500 font-medium italic">"Excellence, Discipline, Vision"</p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Sidebar Profil */}
          <div className="space-y-6">
            <Card className="overflow-hidden border-none shadow-2xl rounded-[2.5rem] bg-white">
              <div className="h-32 bg-gradient-to-r from-[#D32D3F] to-[#8B1A26]"></div>
              <CardContent className="relative pt-0 pb-8 px-8">
                <div className="flex justify-center">
                  <div className="relative -mt-16">
                    <div className="w-32 h-32 rounded-[2.5rem] bg-white p-2 shadow-xl">
                      <div className="w-full h-full rounded-[2rem] bg-slate-100 flex items-center justify-center text-slate-400">
                        <User className="w-12 h-12" />
                      </div>
                    </div>
                  </div>
                </div>
                
                <div className="text-center mt-6">
                  <h2 className="text-2xl font-black text-slate-900">{student.firstName} {student.lastName}</h2>
                  <p className="text-slate-400 font-bold uppercase tracking-widest text-[10px] mt-1">Matricule {student.student?.studentNumber}</p>
                </div>

                <div className="mt-8 space-y-4 pt-8 border-t border-slate-50">
                  <div className="flex items-center gap-4">
                    <div className="w-10 h-10 rounded-2xl bg-slate-50 flex items-center justify-center text-[#D32D3F]">
                      <Mail className="w-5 h-5" />
                    </div>
                    <div>
                      <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Email</p>
                      <p className="font-bold text-sm truncate">{student.email}</p>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Onglets et Contenu */}
          <div className="lg:col-span-2 space-y-6">
            <div className="flex p-1.5 bg-slate-100 rounded-[2rem] gap-1">
              {[
                { id: 'academic', label: 'Parcours', icon: GraduationCap },
                { id: 'discipline', label: 'Discipline', icon: ShieldAlert },
                { id: 'payments', label: 'Finances', icon: BadgeDollarSign },
                { id: 'documents', label: 'Documents', icon: FileText },
              ].map((tab) => (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`flex-1 flex items-center justify-center gap-2 py-3 rounded-[1.5rem] font-black text-xs uppercase tracking-widest transition-all ${
                    activeTab === tab.id 
                      ? 'bg-white text-[#D32D3F] shadow-lg scale-[1.02]' 
                      : 'text-slate-400 hover:text-slate-600'
                  }`}
                >
                  <tab.icon className="w-4 h-4" />
                  <span className="hidden md:inline">{tab.label}</span>
                </button>
              ))}
            </div>

            <AnimatePresence mode="wait">
              <motion.div
                key={activeTab}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
              >
                {activeTab === 'academic' && (
                  <Card className="border-none shadow-xl rounded-[2.5rem]">
                    <CardHeader className="p-8 pb-0">
                      <CardTitle className="text-xl font-black text-slate-900">Historique Académique</CardTitle>
                    </CardHeader>
                    <CardContent className="p-8">
                      {student.student?.grades?.length > 0 ? (
                        <div className="space-y-4">
                          {student.student.grades.map((grade: any) => (
                            <div key={grade.id} className="flex items-center justify-between p-4 bg-slate-50 rounded-2xl">
                              <div className="flex items-center gap-4">
                                <div className="w-12 h-12 rounded-xl bg-white flex items-center justify-center text-lg font-black text-[#D32D3F] shadow-sm">
                                  {grade.score}
                                </div>
                                <div>
                                  <p className="font-bold text-slate-900">{grade.subject}</p>
                                  <p className="text-[10px] text-slate-400 font-bold uppercase tracking-widest">
                                    Trimestre {grade.term} • {grade.academicYear?.name}
                                  </p>
                                </div>
                              </div>
                            </div>
                          ))}
                        </div>
                      ) : (
                        <div className="text-center py-12 text-slate-400 bg-slate-50 rounded-3xl border-2 border-dashed border-slate-200 font-bold">
                          Aucun résultat enregistré.
                        </div>
                      )}
                    </CardContent>
                  </Card>
                )}

                {activeTab === 'discipline' && (
                  <Card className="border-none shadow-xl rounded-[2.5rem]">
                    <CardHeader className="p-8 pb-0">
                      <CardTitle className="text-xl font-black text-slate-900">Suivi Comportemental</CardTitle>
                    </CardHeader>
                    <CardContent className="p-8">
                      <div className="text-center py-12 text-slate-400 bg-slate-50 rounded-3xl border-2 border-dashed border-slate-200 font-bold">
                        Excellent comportement. Aucun avertissement.
                      </div>
                    </CardContent>
                  </Card>
                )}

                {activeTab === 'payments' && (
                  <Card className="border-none shadow-xl rounded-[2.5rem]">
                    <CardHeader className="p-8 pb-0">
                      <CardTitle className="text-xl font-black text-slate-900">État des Versements</CardTitle>
                    </CardHeader>
                    <CardContent className="p-8">
                      <div className="text-center py-12 text-slate-400 bg-slate-50 rounded-3xl border-2 border-dashed border-slate-200 font-bold">
                        Ton compte est à jour pour le trimestre actuel. ✅
                      </div>
                    </CardContent>
                  </Card>
                )}

                {activeTab === 'documents' && (
                  <Card className="border-none shadow-xl rounded-[2.5rem]">
                    <CardHeader className="p-8 pb-0">
                      <CardTitle className="text-xl font-black text-slate-900">Mes Documents Officiels</CardTitle>
                    </CardHeader>
                    <CardContent className="p-8">
                      <div className="text-center py-12 text-slate-400 bg-slate-50 rounded-3xl border-2 border-dashed border-slate-200 font-bold italic">
                        Documents administratifs en cours de validation.
                      </div>
                    </CardContent>
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

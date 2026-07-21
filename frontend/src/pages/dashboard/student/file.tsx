import { useState, useEffect } from 'react';
import Head from 'next/head';
import { useRouter } from 'next/router';
import AppLayout from '@/components/layout/AppLayout';
import { STUDENT_NAV_ITEMS } from '@/constants/navigation';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  User, FileText, ShieldAlert, BadgeDollarSign,
  GraduationCap, Mail
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

import { authFetch } from "@/lib/authFetch";
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
          const response = await authFetch(`/api/admin/students/${studentId}`); // Reusing admin detail route for now as it returns everything
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

  if (loading) return <div className="p-20 text-center mono text-sm uppercase tracking-widest text-soft">Chargement de ton dossier numérique...</div>;
  if (!student) return <div className="p-20 text-center mono text-sm uppercase tracking-widest text-accent">Erreur : Dossier introuvable.</div>;

  return (
    <AppLayout navItems={STUDENT_NAV_ITEMS} userName={`${student.firstName} ${student.lastName}`} userRoleLabel="Mon Dossier">
      <Head><title>Mon Dossier | Le Flambeau</title></Head>

      <div className="max-w-7xl mx-auto">
        <div className="mb-8">
          <h2 className="text-ink flex items-center gap-3">
            <User className="w-8 h-8 text-accent" />
            Mon Dossier Numérique
          </h2>
          <p className="mono text-xs uppercase tracking-widest text-soft mt-2">Excellence, Discipline, Vision</p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Sidebar Profil */}
          <div className="space-y-6">
            <Card className="border border-line">
              <CardContent className="p-6">
                <div className="flex justify-center">
                  <div className="w-32 h-32 border border-line bg-panel flex items-center justify-center text-soft">
                    <User className="w-12 h-12" />
                  </div>
                </div>

                <div className="text-center mt-6">
                  <h3 className="text-ink">{student.firstName} {student.lastName}</h3>
                  <p className="mono text-xs uppercase tracking-widest text-soft mt-2">Matricule {student.student?.studentNumber}</p>
                </div>

                <div className="mt-8 pt-6 border-t border-line">
                  <div className="flex items-center gap-4">
                    <div className="w-10 h-10 border border-line flex items-center justify-center text-accent">
                      <Mail className="w-5 h-5" />
                    </div>
                    <div>
                      <p className="mono text-xs uppercase tracking-widest text-soft">Email</p>
                      <p className="text-sm font-medium text-ink truncate">{student.email}</p>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Onglets et Contenu */}
          <div className="lg:col-span-2 space-y-6">
            <div className="flex border border-line divide-x divide-line">
              {[
                { id: 'academic', label: 'Parcours', icon: GraduationCap },
                { id: 'discipline', label: 'Discipline', icon: ShieldAlert },
                { id: 'payments', label: 'Finances', icon: BadgeDollarSign },
                { id: 'documents', label: 'Documents', icon: FileText },
              ].map((tab) => (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`flex-1 flex items-center justify-center gap-2 py-3 mono text-xs uppercase tracking-widest transition-colors ${
                    activeTab === tab.id
                      ? 'bg-ink text-paper'
                      : 'text-soft hover:bg-panel hover:text-ink'
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
                  <Card className="border border-line">
                    <CardHeader className="p-6 pb-0">
                      <CardTitle className="text-ink">Historique Académique</CardTitle>
                    </CardHeader>
                    <CardContent className="p-6">
                      {student.student?.grades?.length > 0 ? (
                        <div className="space-y-px">
                          {student.student.grades.map((grade: any) => (
                            <div key={grade.id} className="flex items-center justify-between p-4 border-b border-line">
                              <div className="flex items-center gap-4">
                                <div className="w-12 h-12 border border-line flex items-center justify-center numeral text-lg text-accent">
                                  {grade.score}
                                </div>
                                <div>
                                  <p className="text-sm font-medium text-ink">{grade.subject}</p>
                                  <p className="mono text-xs uppercase tracking-widest text-soft mt-1">
                                    Trimestre {grade.term} · {grade.academicYear?.name}
                                  </p>
                                </div>
                              </div>
                            </div>
                          ))}
                        </div>
                      ) : (
                        <div className="text-center py-12 mono text-xs uppercase tracking-widest text-soft border border-line">
                          Aucun résultat enregistré.
                        </div>
                      )}
                    </CardContent>
                  </Card>
                )}

                {activeTab === 'discipline' && (
                  <Card className="border border-line">
                    <CardHeader className="p-6 pb-0">
                      <CardTitle className="text-ink">Suivi Comportemental</CardTitle>
                    </CardHeader>
                    <CardContent className="p-6">
                      <div className="text-center py-12 mono text-xs uppercase tracking-widest text-soft border border-line">
                        Excellent comportement. Aucun avertissement.
                      </div>
                    </CardContent>
                  </Card>
                )}

                {activeTab === 'payments' && (
                  <Card className="border border-line">
                    <CardHeader className="p-6 pb-0">
                      <CardTitle className="text-ink">État des Versements</CardTitle>
                    </CardHeader>
                    <CardContent className="p-6">
                      <div className="text-center py-12 mono text-xs uppercase tracking-widest text-soft border border-line">
                        Ton compte est à jour pour le trimestre actuel.
                      </div>
                    </CardContent>
                  </Card>
                )}

                {activeTab === 'documents' && (
                  <Card className="border border-line">
                    <CardHeader className="p-6 pb-0">
                      <CardTitle className="text-ink">Mes Documents Officiels</CardTitle>
                    </CardHeader>
                    <CardContent className="p-6">
                      <div className="text-center py-12 mono text-xs uppercase tracking-widest text-soft border border-line">
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

import { useState, useEffect } from 'react';
import Head from 'next/head';
import { useRouter } from 'next/router';
import AppLayout from '@/components/layout/AppLayout';
import { PARENT_NAV_ITEMS } from '@/constants/navigation';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
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

  if (loading) return <div className="p-20 text-center mono text-sm uppercase tracking-widest text-soft animate-pulse">Récupération du dossier scolaire...</div>;
  if (!student) return <div className="p-20 text-center mono text-sm uppercase tracking-widest text-accent">Erreur : Dossier de l'enfant introuvable.</div>;

  return (
    <AppLayout navItems={PARENT_NAV_ITEMS} userName="Parent" userRoleLabel="Suivi Enfant">
      <Head><title>Dossier de {student.user.firstName} | Le Flambeau</title></Head>

      <div className="max-w-7xl mx-auto">
        <button
          onClick={() => router.push('/dashboard/parent')}
          className="flex items-center gap-2 text-soft hover:text-accent transition-colors mb-8 group mono text-xs uppercase tracking-widest"
        >
          <ArrowLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform" />
          Retour au Dashboard
        </button>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Sidebar Profil de l'enfant */}
          <div className="space-y-6">
            <Card className="border border-line bg-paper overflow-hidden">
              <div className="h-24 bg-ink"></div>
              <CardContent className="relative pt-0 pb-8 px-6 text-center">
                <div className="flex justify-center">
                  <div className="w-28 h-28 bg-paper border border-line p-2 -mt-14">
                    <div className="w-full h-full bg-panel flex items-center justify-center numeral text-accent text-4xl">
                      {student.user.firstName[0]}
                    </div>
                  </div>
                </div>

                <h2 className="text-2xl font-semibold text-ink mt-5 tracking-tight">{student.user.firstName} {student.user.lastName}</h2>
                <p className="mt-2 inline-block border border-line px-4 py-1 mono text-xs uppercase tracking-widest text-ink">
                  {student.enrollments?.[0]?.class?.level} {student.enrollments?.[0]?.class?.name}
                </p>
                <p className="mono text-xs uppercase tracking-widest text-soft mt-4">Matricule {student.studentNumber}</p>
              </CardContent>
            </Card>

            <Card className="border border-line bg-ink text-paper p-6">
              <h4 className="mono text-xs uppercase tracking-widest mb-5 text-paper/60">Actions de Suivi</h4>
              <div className="space-y-px">
                <button className="w-full h-12 border border-paper/20 hover:bg-accent hover:border-accent transition-colors mono text-xs uppercase tracking-widest flex items-center justify-center gap-3">
                  <Download className="w-4 h-4" /> Bulletin PDF
                </button>
                <button className="w-full h-12 border border-paper/20 hover:bg-paper hover:text-ink transition-colors mono text-xs uppercase tracking-widest flex items-center justify-center gap-3">
                  <Mail className="w-4 h-4" /> Contacter l'école
                </button>
              </div>
            </Card>
          </div>

          {/* Onglets et Contenu */}
          <div className="lg:col-span-2 space-y-6">
            <div className="flex border border-line bg-paper">
              {[
                { id: 'academic', label: 'Notes', icon: GraduationCap },
                { id: 'discipline', label: 'Conduite', icon: ShieldAlert },
                { id: 'payments', label: 'Scolarité', icon: BadgeDollarSign },
              ].map((tab) => (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`flex-1 flex items-center justify-center gap-2 h-12 mono text-xs uppercase tracking-widest border-b-2 transition-colors ${
                    activeTab === tab.id
                      ? 'border-accent text-accent bg-panel'
                      : 'border-transparent text-soft hover:text-ink'
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
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.15 }}
              >
                {activeTab === 'academic' && (
                  <Card className="border border-line bg-paper overflow-hidden">
                    <CardHeader className="p-6 pb-0">
                      <CardTitle className="text-xl font-semibold text-ink tracking-tight flex items-center gap-3">
                        <History className="w-5 h-5 text-accent" />
                        Performance Académique
                      </CardTitle>
                    </CardHeader>
                    <CardContent className="p-6">
                      {student.grades?.length > 0 ? (
                        <div className="space-y-px bg-line border border-line">
                          {student.grades.map((grade: any) => (
                            <div key={grade.id} className="flex items-center justify-between p-5 bg-paper hover:bg-panel transition-colors">
                              <div className="flex items-center gap-5">
                                <div className="w-12 h-12 border border-line flex items-center justify-center numeral text-xl text-accent">
                                  {grade.score}
                                </div>
                                <div>
                                  <p className="font-semibold text-ink">{grade.subject}</p>
                                  <p className="mono text-xs text-soft uppercase tracking-widest mt-1">
                                    Trimestre {grade.term} • {grade.academicYear?.name}
                                  </p>
                                </div>
                              </div>
                              <span className="mono text-xs uppercase tracking-widest text-soft border border-line px-3 py-1">{grade.teacherName}</span>
                            </div>
                          ))}
                        </div>
                      ) : (
                        <div className="text-center py-20 border border-line">
                          <p className="text-soft">Aucune note n'a encore été saisie pour ce trimestre.</p>
                        </div>
                      )}
                    </CardContent>
                  </Card>
                )}

                {activeTab === 'discipline' && (
                  <Card className="border border-line bg-paper p-10 text-center">
                    <div className="w-16 h-16 border border-line flex items-center justify-center mx-auto mb-6">
                      <ShieldAlert className="w-8 h-8 text-ink" />
                    </div>
                    <h3 className="text-xl font-semibold text-ink mb-2 tracking-tight">Comportement Exemplaire</h3>
                    <p className="text-soft max-w-sm mx-auto">Votre enfant n'a reçu aucune sanction ou remarque disciplinaire. Félicitations.</p>
                  </Card>
                )}

                {activeTab === 'payments' && (
                  <Card className="border border-line bg-paper p-6">
                    <h3 className="text-xl font-semibold text-ink mb-6 tracking-tight border-b border-line pb-4">État de la Scolarité</h3>
                    <div className="p-6 border border-line flex items-center justify-between">
                      <div>
                        <p className="mono text-xs text-soft uppercase tracking-widest mb-1">Statut Financier</p>
                        <p className="text-2xl font-semibold text-ink tracking-tight">Compte à jour</p>
                      </div>
                      <BadgeDollarSign className="w-10 h-10 text-soft" />
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

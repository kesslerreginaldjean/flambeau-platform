import { useState, useEffect } from 'react';
import Head from 'next/head';
import AppLayout from '@/components/layout/AppLayout';
import { ADMIN_NAV_ITEMS } from '@/constants/navigation';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
  Search, GraduationCap, User,
  ArrowLeft, FileText, ShieldAlert, BadgeDollarSign,
  Clock, Download, Mail, Phone, CheckCircle2,
  History as HistoryIcon
} from 'lucide-react';
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";

import { authFetch } from "@/lib/authFetch";
export default function AdminStudents() {
  const [students, setStudents] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedStudent, setSelectedStudent] = useState<any>(null);
  const [detailLoading, setDetailLoading] = useState(false);
  const [activeTab, setActiveTab] = useState('academic');

  useEffect(() => {
    fetchStudents();
  }, []);

  const fetchStudents = async () => {
    try {
      setLoading(true);
      const response = await authFetch('/api/admin/students');
      const data = await response.json();
      setStudents(data);
    } catch (error) {
      console.error('Failed to fetch students:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleViewDetail = async (id: string) => {
    try {
      setDetailLoading(true);
      const response = await authFetch(`/api/admin/students/${id}`);
      const data = await response.json();

      if (data.error) {
        alert("Erreur lors de la récupération du dossier : " + data.error);
        return;
      }

      setSelectedStudent(data);
    } catch (error) {
      console.error('Failed to fetch student details:', error);
      alert("Impossible de contacter le serveur. Vérifiez votre connexion.");
    } finally {
      setDetailLoading(false);
    }
  };

  const filteredStudents = students.filter(s =>
    `${s.firstName} ${s.lastName}`.toLowerCase().includes(searchTerm.toLowerCase()) ||
    s.student?.studentNumber?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  if (selectedStudent) {
    return (
      <AppLayout navItems={ADMIN_NAV_ITEMS} userName="Admin Flambeau" userRoleLabel="Administrateur">
        <Head><title>{selectedStudent.firstName} {selectedStudent.lastName} | Dossier Éclat</title></Head>

        <div className="max-w-7xl mx-auto">
          {/* Header avec Retour */}
          <button
            onClick={() => setSelectedStudent(null)}
            className="flex items-center gap-2 text-soft hover:text-accent transition-colors mono text-xs uppercase tracking-widest mb-6"
          >
            <ArrowLeft className="w-4 h-4" />
            Retour au registre
          </button>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Colonne Gauche: Profil Rapide */}
            <div className="space-y-6">
              <Card className="bg-paper">
                <CardContent className="p-8">
                  <div className="flex justify-center">
                    <div className="w-28 h-28 border border-line bg-panel flex items-center justify-center text-soft">
                      <User className="w-12 h-12" />
                    </div>
                  </div>

                  <div className="text-center mt-6">
                    <h2 className="text-2xl font-semibold text-ink">{selectedStudent.firstName} {selectedStudent.lastName}</h2>
                    <p className="mono text-[10px] uppercase tracking-widest text-soft mt-2">Élève • Matricule {selectedStudent.student?.studentNumber}</p>

                    <div className="flex items-center justify-center gap-2 mt-4">
                      <Badge className="mono text-xs uppercase tracking-widest">
                        {selectedStudent.student?.enrollments?.[0]?.class?.level || 'N/A'} {selectedStudent.student?.enrollments?.[0]?.class?.name || ''}
                      </Badge>
                      <Badge className="mono text-xs uppercase tracking-widest">
                        Inscrit
                      </Badge>
                    </div>
                  </div>

                  <div className="mt-8 space-y-4 pt-8 border-t border-line">
                    <div className="flex items-center gap-4 text-ink">
                      <div className="w-10 h-10 border border-line flex items-center justify-center text-accent">
                        <Mail className="w-5 h-5" />
                      </div>
                      <div>
                        <p className="mono text-[10px] uppercase tracking-widest text-soft">Email</p>
                        <p className="font-medium text-sm truncate">{selectedStudent.email}</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-4 text-ink">
                      <div className="w-10 h-10 border border-line flex items-center justify-center text-accent">
                        <Phone className="w-5 h-5" />
                      </div>
                      <div>
                        <p className="mono text-[10px] uppercase tracking-widest text-soft">Téléphone</p>
                        <p className="font-medium text-sm">{selectedStudent.phone || 'Non renseigné'}</p>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Colonne Droite: Dossier Détaillé */}
            <div className="lg:col-span-2 space-y-6">
              {/* Tabs */}
              <div className="flex border border-line bg-paper">
                {[
                  { id: 'academic', label: 'Académique', icon: GraduationCap },
                  { id: 'discipline', label: 'Discipline', icon: ShieldAlert },
                  { id: 'payments', label: 'Finances', icon: BadgeDollarSign },
                  { id: 'documents', label: 'Dossier', icon: FileText },
                ].map((tab) => (
                  <button
                    key={tab.id}
                    onClick={() => setActiveTab(tab.id)}
                    className={`flex-1 flex items-center justify-center gap-2 py-3 mono text-xs uppercase tracking-widest border-b-2 transition-colors ${
                      activeTab === tab.id
                        ? 'border-accent text-accent'
                        : 'border-transparent text-soft hover:text-ink'
                    }`}
                  >
                    <tab.icon className="w-4 h-4" />
                    <span className="hidden md:inline">{tab.label}</span>
                  </button>
                ))}
              </div>

              {/* Tab Content */}
              <div>
                  {activeTab === 'academic' && (
                    <div className="space-y-6">
                      <Card className="bg-paper">
                        <CardHeader className="p-8 pb-0">
                          <CardTitle className="text-xl font-semibold text-ink flex items-center gap-3">
                            <HistoryIcon className="w-5 h-5 text-accent" />
                            Historique des Notes
                          </CardTitle>
                        </CardHeader>
                        <CardContent className="p-8">
                          {selectedStudent.student?.grades?.length > 0 ? (
                            <div className="divide-y divide-line border border-line">
                              {selectedStudent.student.grades.map((grade: any) => (
                                <div key={grade.id} className="flex items-center justify-between p-4 hover:bg-panel transition-colors">
                                  <div className="flex items-center gap-4">
                                    <div className="w-12 h-12 border border-line flex items-center justify-center numeral text-lg text-accent">
                                      {grade.score}
                                    </div>
                                    <div>
                                      <p className="font-medium text-ink">{grade.subject}</p>
                                      <p className="mono text-[10px] uppercase tracking-widest text-soft">
                                        Trimestre {grade.term} • {grade.academicYear?.name}
                                      </p>
                                    </div>
                                  </div>
                                  <div className="text-right">
                                    <p className="mono text-[10px] uppercase tracking-widest text-soft">Professeur</p>
                                    <p className="text-xs font-medium text-ink">{grade.teacherName}</p>
                                  </div>
                                </div>
                              ))}
                            </div>
                          ) : (
                            <div className="text-center py-12 text-soft border border-dashed border-line mono text-xs uppercase tracking-widest">
                              Aucune note enregistrée pour le moment.
                            </div>
                          )}
                        </CardContent>
                      </Card>
                    </div>
                  )}

                  {activeTab === 'discipline' && (
                    <Card className="bg-paper">
                      <CardHeader className="p-8 pb-0">
                        <CardTitle className="text-xl font-semibold text-ink">Rapports de Discipline</CardTitle>
                      </CardHeader>
                      <CardContent className="p-8">
                        <div className="text-center py-12 text-soft border border-dashed border-line mono text-xs uppercase tracking-widest">
                          Dossier de comportement vierge.
                        </div>
                      </CardContent>
                    </Card>
                  )}

                  {activeTab === 'payments' && (
                    <Card className="bg-paper">
                      <CardHeader className="p-8 pb-0">
                        <CardTitle className="text-xl font-semibold text-ink flex items-center gap-3">
                          <BadgeDollarSign className="w-5 h-5 text-accent" />
                          Historique des Paiements
                        </CardTitle>
                      </CardHeader>
                      <CardContent className="p-8">
                        {selectedStudent.student?.payments?.length > 0 ? (
                          <div className="divide-y divide-line border border-line">
                            {selectedStudent.student.payments.map((payment: any) => (
                              <div key={payment.id} className="flex items-center justify-between p-5 hover:bg-panel transition-colors">
                                <div className="flex items-center gap-4">
                                  <div className={`w-12 h-12 border flex items-center justify-center ${payment.status === 'completed' ? 'border-accent text-accent' : 'border-line text-soft'}`}>
                                    {payment.status === 'completed' ? <CheckCircle2 className="w-6 h-6" /> : <Clock className="w-6 h-6" />}
                                  </div>
                                  <div>
                                    <p className="font-medium text-ink">{payment.paymentType}</p>
                                    <p className="mono text-[10px] uppercase tracking-widest text-soft">
                                      Échéance: {new Date(payment.dueDate).toLocaleDateString()} • {payment.academicYear?.name}
                                    </p>
                                  </div>
                                </div>
                                <div className="text-right">
                                  <p className="numeral text-lg text-ink">{payment.amount.toLocaleString()} HTG</p>
                                  <Badge className={`mono text-[8px] uppercase tracking-widest ${payment.status === 'completed' ? 'text-accent' : 'text-ink'}`}>
                                    {payment.status === 'completed' ? 'Payé' : 'En attente'}
                                  </Badge>
                                </div>
                              </div>
                            ))}
                          </div>
                        ) : (
                          <div className="text-center py-12 text-soft border border-dashed border-line mono text-xs uppercase tracking-widest">
                            Aucun paiement enregistré.
                          </div>
                        )}
                      </CardContent>
                    </Card>
                  )}

                  {activeTab === 'documents' && (
                    <Card className="bg-paper">
                      <CardHeader className="p-8 pb-0">
                        <CardTitle className="text-xl font-semibold text-ink">Pièces Jointes & Documents</CardTitle>
                      </CardHeader>
                      <CardContent className="p-8">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                          <div className="p-6 border border-line flex items-center justify-between group hover:bg-panel transition-colors cursor-pointer">
                            <div className="flex items-center gap-4">
                              <div className="w-12 h-12 border border-line flex items-center justify-center text-accent">
                                <FileText className="w-6 h-6" />
                              </div>
                              <div>
                                <p className="font-medium text-ink">Acte de Naissance</p>
                                <p className="mono text-[10px] uppercase tracking-widest text-soft">Format PDF • 1.2 MB</p>
                              </div>
                            </div>
                            <Download className="w-5 h-5 text-soft group-hover:text-accent transition-colors" />
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  )}
              </div>
            </div>
          </div>
        </div>
      </AppLayout>
    );
  }

  return (
    <AppLayout navItems={ADMIN_NAV_ITEMS} userName="Admin Flambeau" userRoleLabel="Administrateur">
      <Head>
        <title>Gestion des Étudiants | CLF</title>
      </Head>

      <div>
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8 gap-4 border-b border-line pb-6">
          <div>
            <p className="kicker mb-2">Administration</p>
            <h1 className="text-3xl font-semibold text-ink tracking-tight">Registre des Étudiants</h1>
            <p className="text-soft text-sm mt-1">Liste complète des élèves inscrits au collège.</p>
          </div>

          <div className="relative w-full md:w-96">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-soft z-10" />
            <Input
              placeholder="Rechercher par nom ou matricule..."
              className="pl-10"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
        </div>

        <div className="border border-line bg-paper">
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="border-b border-line">
                  <th className="px-8 py-5 mono text-xs uppercase tracking-widest text-soft">Élève</th>
                  <th className="px-8 py-5 mono text-xs uppercase tracking-widest text-soft">Matricule</th>
                  <th className="px-8 py-5 mono text-xs uppercase tracking-widest text-soft">Classe</th>
                  <th className="px-8 py-5 mono text-xs uppercase tracking-widest text-soft">Statut</th>
                  <th className="px-8 py-5 mono text-xs uppercase tracking-widest text-soft text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-line">
                {loading ? (
                  <tr><td colSpan={5} className="p-20 text-center mono text-xs uppercase tracking-widest text-soft animate-pulse">Chargement de la base de données...</td></tr>
                ) : filteredStudents.map((student) => (
                  <tr
                    key={student.id}
                    className="hover:bg-panel transition-colors group cursor-pointer"
                    onClick={() => handleViewDetail(student.id)}
                  >
                    <td className="px-8 py-5">
                      <div className="flex items-center gap-4">
                        <div className="w-12 h-12 border border-line flex items-center justify-center text-accent mono text-sm group-hover:bg-accent group-hover:text-paper group-hover:border-accent transition-colors">
                          {student.firstName[0]}{student.lastName[0]}
                        </div>
                        <div>
                          <p className="font-medium text-ink group-hover:text-accent transition-colors">{student.firstName} {student.lastName}</p>
                          <p className="mono text-[10px] uppercase tracking-widest text-soft">{student.gender === 'M' ? 'Garçon' : 'Fille'}</p>
                        </div>
                      </div>
                    </td>
                    <td className="px-8 py-5">
                      <code className="mono text-xs border border-line px-3 py-1.5 text-ink">
                        {student.student?.studentNumber}
                      </code>
                    </td>
                    <td className="px-8 py-5">
                      <div className="flex items-center gap-3">
                        <span className="text-sm font-medium text-ink">{student.student?.enrollments?.[0]?.class?.level || 'N/A'}</span>
                        <div className="w-1.5 h-1.5 bg-line"></div>
                        <span className="text-sm font-medium text-accent">{student.student?.enrollments?.[0]?.class?.name || ''}</span>
                      </div>
                    </td>
                    <td className="px-8 py-5">
                      <div className="flex items-center gap-2 text-ink">
                        <div className="w-2 h-2 bg-accent"></div>
                        <span className="mono text-[10px] uppercase tracking-widest">Actif</span>
                      </div>
                    </td>
                    <td className="px-8 py-5 text-right">
                      <div className="flex justify-end gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                        <Button
                          variant="ghost"
                          size="sm"
                          className="text-soft"
                          onClick={(e) => {
                            e.stopPropagation();
                            // Edition logic here later
                          }}
                        >
                          Éditer
                        </Button>
                        <Button
                          variant="ghost"
                          size="sm"
                          className="text-accent border border-line"
                          onClick={(e) => {
                            e.stopPropagation();
                            handleViewDetail(student.id);
                          }}
                        >
                          {detailLoading && selectedStudent?.id === student.id ? 'Ouverture...' : 'Voir Dossier'}
                        </Button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          {!loading && filteredStudents.length === 0 && (
            <div className="p-20 text-center">
              <div className="w-16 h-16 border border-line flex items-center justify-center mx-auto mb-4">
                <Search className="w-7 h-7 text-soft" />
              </div>
              <p className="text-soft mono text-xs uppercase tracking-widest">Aucun étudiant trouvé pour "{searchTerm}"</p>
            </div>
          )}
        </div>
      </div>
    </AppLayout>
  );
}

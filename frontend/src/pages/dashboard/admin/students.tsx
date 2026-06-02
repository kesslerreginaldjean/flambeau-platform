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
import { motion, AnimatePresence } from 'framer-motion';

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
        
        <div className="p-6 max-w-7xl mx-auto">
          {/* Header avec Retour */}
          <button 
            onClick={() => setSelectedStudent(null)}
            className="flex items-center gap-2 text-slate-500 hover:text-[#D32D3F] transition-colors font-bold mb-6 group"
          >
            <ArrowLeft className="w-5 h-5 group-hover:-translate-x-1 transition-transform" />
            Retour au registre
          </button>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Colonne Gauche: Profil Rapide */}
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
                      <div className="absolute bottom-2 right-2 w-8 h-8 bg-green-500 border-4 border-white rounded-full"></div>
                    </div>
                  </div>
                  
                  <div className="text-center mt-6">
                    <h2 className="text-2xl font-black text-slate-900">{selectedStudent.firstName} {selectedStudent.lastName}</h2>
                    <p className="text-slate-400 font-bold uppercase tracking-widest text-[10px] mt-1">Élève • Matricule {selectedStudent.student?.studentNumber}</p>
                    
                    <div className="flex items-center justify-center gap-2 mt-4">
                      <Badge className="bg-amber-100 text-amber-700 hover:bg-amber-100 border-none font-black px-4 py-1.5 rounded-full uppercase tracking-tighter">
                        {selectedStudent.student?.enrollments?.[0]?.class?.level || 'N/A'} {selectedStudent.student?.enrollments?.[0]?.class?.name || ''}
                      </Badge>
                      <Badge className="bg-green-100 text-green-700 hover:bg-green-100 border-none font-black px-4 py-1.5 rounded-full uppercase tracking-tighter">
                        Inscrit
                      </Badge>
                    </div>
                  </div>

                  <div className="mt-8 space-y-4 pt-8 border-t border-slate-50">
                    <div className="flex items-center gap-4 text-slate-600">
                      <div className="w-10 h-10 rounded-2xl bg-slate-50 flex items-center justify-center text-[#D32D3F]">
                        <Mail className="w-5 h-5" />
                      </div>
                      <div>
                        <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Email</p>
                        <p className="font-bold text-sm truncate">{selectedStudent.email}</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-4 text-slate-600">
                      <div className="w-10 h-10 rounded-2xl bg-slate-50 flex items-center justify-center text-[#D32D3F]">
                        <Phone className="w-5 h-5" />
                      </div>
                      <div>
                        <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Téléphone</p>
                        <p className="font-bold text-sm">{selectedStudent.phone || 'Non renseigné'}</p>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Colonne Droite: Dossier Détaillé */}
            <div className="lg:col-span-2 space-y-6">
              {/* Tabs */}
              <div className="flex p-1.5 bg-slate-100 rounded-[2rem] gap-1">
                {[
                  { id: 'academic', label: 'Académique', icon: GraduationCap },
                  { id: 'discipline', label: 'Discipline', icon: ShieldAlert },
                  { id: 'payments', label: 'Finances', icon: BadgeDollarSign },
                  { id: 'documents', label: 'Dossier', icon: FileText },
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

              {/* Tab Content */}
              <AnimatePresence mode="wait">
                <motion.div
                  key={activeTab}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                >
                  {activeTab === 'academic' && (
                    <div className="space-y-6">
                      <Card className="border-none shadow-xl rounded-[2.5rem]">
                        <CardHeader className="p-8 pb-0">
                          <CardTitle className="text-xl font-black text-slate-900 flex items-center gap-3">
                            <HistoryIcon className="w-6 h-6 text-[#D32D3F]" />
                            Historique des Notes
                          </CardTitle>
                        </CardHeader>
                        <CardContent className="p-8">
                          {selectedStudent.student?.grades?.length > 0 ? (
                            <div className="space-y-4">
                              {selectedStudent.student.grades.map((grade: any) => (
                                <div key={grade.id} className="flex items-center justify-between p-4 bg-slate-50 rounded-2xl hover:bg-slate-100 transition-colors">
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
                                  <div className="text-right">
                                    <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Professeur</p>
                                    <p className="text-xs font-bold text-slate-700">{grade.teacherName}</p>
                                  </div>
                                </div>
                              ))}
                            </div>
                          ) : (
                            <div className="text-center py-12 text-slate-400 bg-slate-50 rounded-3xl border-2 border-dashed border-slate-200 font-bold">
                              Aucune note enregistrée pour le moment.
                            </div>
                          )}
                        </CardContent>
                      </Card>
                    </div>
                  )}

                  {activeTab === 'discipline' && (
                    <Card className="border-none shadow-xl rounded-[2.5rem]">
                      <CardHeader className="p-8 pb-0">
                        <CardTitle className="text-xl font-black text-slate-900">Rapports de Discipline</CardTitle>
                      </CardHeader>
                      <CardContent className="p-8">
                        <div className="text-center py-12 text-slate-400 bg-slate-50 rounded-3xl border-2 border-dashed border-slate-200 font-bold">
                          Dossier de comportement vierge. 
                        </div>
                      </CardContent>
                    </Card>
                  )}

                  {activeTab === 'payments' && (
                    <Card className="border-none shadow-xl rounded-[2.5rem]">
                      <CardHeader className="p-8 pb-0">
                        <CardTitle className="text-xl font-black text-slate-900 flex items-center gap-3">
                          <BadgeDollarSign className="w-6 h-6 text-[#D32D3F]" />
                          Historique des Paiements
                        </CardTitle>
                      </CardHeader>
                      <CardContent className="p-8">
                        {selectedStudent.student?.payments?.length > 0 ? (
                          <div className="space-y-4">
                            {selectedStudent.student.payments.map((payment: any) => (
                              <div key={payment.id} className="flex items-center justify-between p-5 bg-slate-50 rounded-[1.5rem] hover:bg-slate-100 transition-all border border-transparent hover:border-slate-200">
                                <div className="flex items-center gap-4">
                                  <div className={`w-12 h-12 rounded-xl flex items-center justify-center font-black ${payment.status === 'completed' ? 'bg-green-100 text-green-600' : 'bg-amber-100 text-amber-600'}`}>
                                    {payment.status === 'completed' ? <CheckCircle2 className="w-6 h-6" /> : <Clock className="w-6 h-6" />}
                                  </div>
                                  <div>
                                    <p className="font-bold text-slate-900">{payment.paymentType}</p>
                                    <p className="text-[10px] text-slate-400 font-bold uppercase tracking-widest">
                                      Échéance: {new Date(payment.dueDate).toLocaleDateString()} • {payment.academicYear?.name}
                                    </p>
                                  </div>
                                </div>
                                <div className="text-right">
                                  <p className="text-lg font-black text-slate-900">{payment.amount.toLocaleString()} HTG</p>
                                  <Badge className={`${payment.status === 'completed' ? 'bg-green-500' : 'bg-amber-500'} text-white border-none text-[8px] font-black uppercase px-2 py-0.5`}>
                                    {payment.status === 'completed' ? 'Payé' : 'En attente'}
                                  </Badge>
                                </div>
                              </div>
                            ))}
                          </div>
                        ) : (
                          <div className="text-center py-12 text-slate-400 bg-slate-50 rounded-3xl border-2 border-dashed border-slate-200 font-bold">
                            Aucun paiement enregistré.
                          </div>
                        )}
                      </CardContent>
                    </Card>
                  )}

                  {activeTab === 'documents' && (
                    <Card className="border-none shadow-xl rounded-[2.5rem]">
                      <CardHeader className="p-8 pb-0">
                        <CardTitle className="text-xl font-black text-slate-900">Pièces Jointes & Documents</CardTitle>
                      </CardHeader>
                      <CardContent className="p-8">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                          <div className="p-6 bg-slate-50 rounded-3xl flex items-center justify-between group hover:bg-[#D32D3F]/5 transition-colors cursor-pointer border border-transparent hover:border-[#D32D3F]/20">
                            <div className="flex items-center gap-4">
                              <div className="w-12 h-12 bg-white rounded-2xl flex items-center justify-center text-[#D32D3F] shadow-sm">
                                <FileText className="w-6 h-6" />
                              </div>
                              <div>
                                <p className="font-bold text-slate-900">Acte de Naissance</p>
                                <p className="text-[10px] text-slate-400 font-bold uppercase tracking-widest">Format PDF • 1.2 MB</p>
                              </div>
                            </div>
                            <Download className="w-5 h-5 text-slate-300 group-hover:text-[#D32D3F] transition-colors" />
                          </div>
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

  return (
    <AppLayout navItems={ADMIN_NAV_ITEMS} userName="Admin Flambeau" userRoleLabel="Administrateur">
      <Head>
        <title>Gestion des Étudiants | CLF</title>
      </Head>

      <div className="p-6">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8 gap-4">
          <div>
            <h1 className="text-3xl font-extrabold text-slate-900 tracking-tight">Registre des Étudiants</h1>
            <p className="text-slate-500 font-medium text-sm">Liste complète des élèves inscrits au collège.</p>
          </div>
          
          <div className="relative w-full md:w-96">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
            <Input 
              placeholder="Rechercher par nom ou matricule..." 
              className="pl-10 h-12 rounded-2xl border-slate-200 focus:ring-2 focus:ring-[#D32D3F]/20 focus:border-[#D32D3F] transition-all"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
        </div>

        <div className="bg-white rounded-[2.5rem] shadow-2xl overflow-hidden border border-slate-50">
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-slate-50/50 border-b border-slate-100">
                  <th className="px-8 py-6 text-[10px] font-black text-slate-400 uppercase tracking-[0.2em]">Élève</th>
                  <th className="px-8 py-6 text-[10px] font-black text-slate-400 uppercase tracking-[0.2em]">Matricule</th>
                  <th className="px-8 py-6 text-[10px] font-black text-slate-400 uppercase tracking-[0.2em]">Classe</th>
                  <th className="px-8 py-6 text-[10px] font-black text-slate-400 uppercase tracking-[0.2em]">Statut</th>
                  <th className="px-8 py-6 text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-50">
                {loading ? (
                  <tr><td colSpan={5} className="p-20 text-center font-bold text-slate-400 animate-pulse">Chargement de la base de données...</td></tr>
                ) : filteredStudents.map((student) => (
                  <tr 
                    key={student.id} 
                    className="hover:bg-slate-50/80 transition-all group cursor-pointer"
                    onClick={() => handleViewDetail(student.id)}
                  >
                    <td className="px-8 py-5">
                      <div className="flex items-center gap-4">
                        <div className="w-12 h-12 rounded-[1.25rem] bg-slate-100 flex items-center justify-center text-[#D32D3F] font-black text-sm shadow-inner group-hover:bg-[#D32D3F] group-hover:text-white transition-all duration-300">
                          {student.firstName[0]}{student.lastName[0]}
                        </div>
                        <div>
                          <p className="font-black text-slate-900 group-hover:text-[#D32D3F] transition-colors">{student.firstName} {student.lastName}</p>
                          <p className="text-[10px] text-slate-400 font-bold uppercase tracking-widest">{student.gender === 'M' ? 'Garçon' : 'Fille'}</p>
                        </div>
                      </div>
                    </td>
                    <td className="px-8 py-5">
                      <code className="text-xs font-black bg-slate-100 px-3 py-1.5 rounded-full text-slate-600 group-hover:bg-slate-200 transition-colors">
                        {student.student?.studentNumber}
                      </code>
                    </td>
                    <td className="px-8 py-5">
                      <div className="flex items-center gap-3">
                        <span className="text-sm font-black text-slate-700">{student.student?.enrollments?.[0]?.class?.level || 'N/A'}</span>
                        <div className="w-1.5 h-1.5 rounded-full bg-slate-200"></div>
                        <span className="text-sm font-black text-[#D32D3F]">{student.student?.enrollments?.[0]?.class?.name || ''}</span>
                      </div>
                    </td>
                    <td className="px-8 py-5">
                      <div className="flex items-center gap-2 text-green-600">
                        <div className="w-2 h-2 rounded-full bg-green-500 animate-pulse"></div>
                        <span className="text-[10px] font-black uppercase tracking-widest">Actif</span>
                      </div>
                    </td>
                    <td className="px-8 py-5 text-right">
                      <div className="flex justify-end gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                        <Button 
                          variant="ghost" 
                          size="sm" 
                          className="rounded-xl font-bold text-slate-500"
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
                          className="rounded-xl font-bold text-[#D32D3F] hover:bg-[#D32D3F]/10 shadow-sm border border-[#D32D3F]/20"
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
              <div className="w-20 h-20 bg-slate-50 rounded-[2.5rem] flex items-center justify-center mx-auto mb-4">
                <Search className="w-8 h-8 text-slate-200" />
              </div>
              <p className="text-slate-400 font-bold">Aucun étudiant trouvé pour "{searchTerm}"</p>
            </div>
          )}
        </div>
      </div>
    </AppLayout>
  );
}

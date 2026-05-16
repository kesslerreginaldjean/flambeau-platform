import React, { useState, useEffect } from 'react';
import Head from 'next/head';
import AppLayout from '@/components/layout/AppLayout';
import { ADMIN_NAV_ITEMS } from '@/constants/navigation';
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { 
  FileText, Check, X, User, 
  Phone, Calendar, Eye, Loader2,
  Search, LayoutGrid, List as ListIcon
} from 'lucide-react';
import FadeIn from '@/components/FadeIn';
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";

export default function AdminAdmissions() {
  const [requests, setRequests] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [viewMode, setViewMode] = useState<'grid' | 'table'>('grid');
  const [activeTab, setActiveTab] = useState('NEW');
  const [classes, setClasses] = useState<any[]>([]);
  const [selectedRequest, setSelectedRequest] = useState<any>(null);
  const [isValidateModalOpen, setIsValidateModalOpen] = useState(false);
  const [selectedClassId, setSelectedClassId] = useState('');
  const [isViewModalOpen, setIsViewModalOpen] = useState(false);
  const [isScheduleModalOpen, setIsScheduleModalOpen] = useState(false);
  const [testDate, setTestDate] = useState('');
  const apiUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000';

  useEffect(() => {
    fetchAdmissions();
    fetchClasses();
  }, []);

  const fetchClasses = async () => {
    try {
      const response = await fetch(`${apiUrl}/api/admin/academic`);
      const data = await response.json();
      setClasses(data.classes || []);
    } catch (err) {
      console.error('Erreur chargement classes:', err);
    }
  };

  const fetchAdmissions = async () => {
    try {
      setLoading(true);
      const response = await fetch(`${apiUrl}/api/admin/admissions`);
      if (!response.ok) throw new Error('Impossible de charger les dossiers');
      const data = await response.json();
      setRequests(data);
    } catch (err) {
      setError('Erreur lors du chargement des admissions.');
    } finally {
      setLoading(false);
    }
  };

  const updateStatus = async (id: string, status: string, classId?: string) => {
    try {
      const response = await fetch(`${apiUrl}/api/admin/admissions/${id}/status`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status, classId })
      });
      if (response.ok) {
        alert(status === 'VALIDATED' ? 'Élève admis et compte créé ! ✅' : 'Dossier archivé. ❌');
        setIsValidateModalOpen(false);
        setSelectedRequest(null);
        setSelectedClassId('');
        fetchAdmissions();
      }
    } catch (err) {
      alert('Erreur lors de la mise à jour');
    }
  };
  const scheduleInterview = async (id: string, date: string) => {
    try {
      const response = await fetch(`${apiUrl}/api/admin/admissions/${id}/schedule`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ testDate: date })
      });
      if (response.ok) {
        alert('Entretien / Examen planifié avec succès ! 📅');
        setIsScheduleModalOpen(false);
        setTestDate('');
        fetchAdmissions();
      }
    } catch (err) {
      alert('Erreur lors de la planification');
    }
  };


  const filteredRequests = requests.filter(r => {
    if (activeTab === 'NEW') return r.status === 'NEW' || r.status === 'TEST_SCHEDULED';
    return r.status === activeTab;
  });

  return (
    <AppLayout navItems={ADMIN_NAV_ITEMS} userName="Admin Flambeau" userRoleLabel="Administrateur">
      <Head>
        <title>Gestion des Admissions | Le Flambeau</title>
      </Head>

      <div className="p-6 md:p-10 max-w-7xl mx-auto">
        <FadeIn className="flex flex-col md:flex-row justify-between items-end gap-6 mb-10">
          <div>
            <h1 className="text-5xl font-black text-slate-900 tracking-tight mb-3">Admissions</h1>
            <p className="text-slate-500 font-medium italic text-lg">"Pilotez le flux des nouveaux talents."</p>
          </div>
          
          <div className="flex items-center gap-3 bg-white p-2 rounded-2xl shadow-xl border border-slate-100">
             <Button 
               variant={viewMode === 'grid' ? 'default' : 'ghost'} 
               size="icon" 
               onClick={() => setViewMode('grid')}
               className={`rounded-xl ${viewMode === 'grid' ? 'bg-[#D32D3F]' : 'text-slate-400'}`}
             >
               <LayoutGrid className="w-5 h-5" />
             </Button>
             <Button 
               variant={viewMode === 'table' ? 'default' : 'ghost'} 
               size="icon" 
               onClick={() => setViewMode('table')}
               className={`rounded-xl ${viewMode === 'table' ? 'bg-[#D32D3F]' : 'text-slate-400'}`}
             >
               <ListIcon className="w-5 h-5" />
             </Button>
          </div>
        </FadeIn>

        <Tabs defaultValue="NEW" className="w-full space-y-8" onValueChange={setActiveTab}>
          <div className="flex flex-col md:flex-row justify-between items-center gap-6">
            <TabsList className="bg-slate-100 p-1.5 rounded-[2rem] h-auto border-none w-full md:w-fit shadow-inner">
              <TabsTrigger value="NEW" className="rounded-[1.5rem] px-8 py-3 font-black uppercase text-[10px] tracking-widest data-[state=active]:bg-white data-[state=active]:text-[#D32D3F] data-[state=active]:shadow-lg transition-all">
                À Traiter ({requests.filter(r => r.status === 'NEW' || r.status === 'TEST_SCHEDULED').length})
              </TabsTrigger>
              <TabsTrigger value="VALIDATED" className="rounded-[1.5rem] px-8 py-3 font-black uppercase text-[10px] tracking-widest data-[state=active]:bg-white data-[state=active]:text-green-600 data-[state=active]:shadow-lg transition-all">
                Admis ({requests.filter(r => r.status === 'VALIDATED').length})
              </TabsTrigger>
              <TabsTrigger value="REJECTED" className="rounded-[1.5rem] px-8 py-3 font-black uppercase text-[10px] tracking-widest data-[state=active]:bg-white data-[state=active]:text-red-500 data-[state=active]:shadow-lg transition-all">
                Refusés ({requests.filter(r => r.status === 'REJECTED').length})
              </TabsTrigger>
            </TabsList>

            <div className="relative w-full md:w-80 group">
              <Search className="absolute left-5 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-300 group-focus-within:text-[#D32D3F] transition-colors" />
              <input 
                type="text" 
                placeholder="Rechercher un dossier..." 
                className="w-full h-14 pl-14 pr-6 rounded-2xl border-none bg-white shadow-xl font-bold text-sm focus:ring-2 focus:ring-[#D32D3F]/20 transition-all outline-none"
              />
            </div>
          </div>

          <TabsContent value={activeTab} className="mt-0">
            {loading ? (
              <div className="flex flex-col items-center justify-center py-32 gap-6 text-slate-300">
                <Loader2 className="w-16 h-16 animate-spin text-[#D32D3F]" />
                <p className="font-black uppercase tracking-widest text-[10px]">Chargement sécurisé...</p>
              </div>
            ) : filteredRequests.length === 0 ? (
              <div className="text-center py-32 bg-white rounded-[4rem] border-4 border-dashed border-slate-50">
                <FileText className="w-24 h-24 text-slate-100 mx-auto mb-6" />
                <p className="text-slate-400 font-black uppercase tracking-[0.3em] text-xs">Aucun dossier dans cette catégorie</p>
              </div>
            ) : viewMode === 'grid' ? (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                {filteredRequests.map((request) => (
                  <FadeIn key={request.id}>
                    <Card className="border-none shadow-[0_30px_60px_-15px_rgba(0,0,0,0.08)] rounded-[3rem] overflow-hidden bg-white hover:shadow-[0_40px_80px_-20px_rgba(0,0,0,0.12)] transition-all duration-500 group border-b-8 border-transparent hover:border-[#D32D3F]">
                      <CardContent className="p-8 space-y-6">
                        <div className="flex justify-between items-start gap-4">
                           <div className="flex items-center gap-5">
                              <div className="w-16 h-16 rounded-2xl bg-slate-50 flex items-center justify-center text-slate-400 shadow-inner group-hover:bg-[#D32D3F]/5 group-hover:text-[#D32D3F] transition-colors">
                                 <User className="w-8 h-8" />
                              </div>
                              <div>
                                 <h3 className="text-xl font-black text-slate-900 truncate max-w-[150px]">
                                    {request.studentFirstName} <span className="text-[#D32D3F] uppercase">{request.studentLastName}</span>
                                 </h3>
                                 <Badge className="bg-slate-100 text-slate-500 border-none font-black text-[9px] px-3 py-1 rounded-full uppercase mt-1 tracking-widest">
                                    {request.level}
                                 </Badge>
                              </div>
                           </div>
                           <Badge className={`${
                             request.status === 'NEW' ? 'bg-amber-50 text-amber-600' : 
                             request.status === 'TEST_SCHEDULED' ? 'bg-purple-50 text-purple-600' : 
                             request.status === 'VALIDATED' ? 'bg-green-50 text-green-600' : 'bg-red-50 text-red-500'
                           } border-none font-black text-[8px] uppercase tracking-widest px-3 py-1 rounded-lg`}>
                             {request.status === 'NEW' ? 'Nouveau' : 
                              request.status === 'TEST_SCHEDULED' ? 'Examen' : 
                              request.status === 'VALIDATED' ? 'Admis' : 'Refusé'}
                           </Badge>
                        </div>

                        <div className="grid grid-cols-2 gap-4 pt-4 border-t border-slate-50">
                           <div className="space-y-1">
                              <p className="text-[9px] font-black text-slate-300 uppercase tracking-widest">Téléphone</p>
                              <p className="text-xs font-bold text-slate-600 flex items-center gap-2"><Phone className="w-3 h-3 text-[#D32D3F]" /> {request.parentPhone}</p>
                           </div>
                           <div className="space-y-1">
                              <p className="text-[9px] font-black text-slate-300 uppercase tracking-widest">Date Dépôt</p>
                              <p className="text-xs font-bold text-slate-600 flex items-center gap-2"><Calendar className="w-3 h-3 text-[#D32D3F]" /> {new Date(request.createdAt).toLocaleDateString()}</p>
                           </div>
                        </div>

                         <div className="flex flex-col gap-3 pt-4">
                           {activeTab === 'NEW' && (
                             <div className="flex gap-2">
                               <Button 
                                 onClick={() => {
                                   setSelectedRequest(request);
                                   setIsScheduleModalOpen(true);
                                 }} 
                                 className="flex-1 bg-purple-500 hover:bg-purple-600 text-white rounded-xl h-12 font-black uppercase text-[9px] tracking-widest shadow-lg shadow-purple-500/20"
                               >
                                 Planifier Entretien
                               </Button>
                               <Button 
                                 onClick={() => {
                                   setSelectedRequest(request);
                                   setIsValidateModalOpen(true);
                                 }} 
                                 className="flex-1 bg-green-500 hover:bg-green-600 text-white rounded-xl h-12 font-black uppercase text-[9px] tracking-widest shadow-lg shadow-green-500/20"
                               >
                                 Admettre Directement
                               </Button>
                             </div>
                           )}
                           
                           <div className="flex gap-2">
                             <Button 
                               onClick={() => {
                                 setSelectedRequest(request);
                                 setIsViewModalOpen(true);
                               }}
                               variant="outline" 
                               className="flex-1 rounded-xl h-12 border-slate-100 text-slate-500 font-black text-[9px] uppercase tracking-widest flex items-center justify-center gap-2"
                             >
                                <Eye className="w-4 h-4" /> Voir Dossier & Pièces
                             </Button>
                             {activeTab === 'NEW' && (
                               <Button onClick={() => updateStatus(request.id, 'REJECTED')} variant="outline" className="w-12 h-12 rounded-xl border-slate-100 text-red-400 hover:bg-red-50 hover:text-red-600 transition-all"><X className="w-5 h-5" /></Button>
                             )}
                           </div>
                         </div>
                      </CardContent>
                    </Card>
                  </FadeIn>
                ))}
              </div>
            ) : (
              <Card className="border-none shadow-2xl rounded-[3rem] bg-white overflow-hidden">
                <div className="overflow-x-auto">
                   <table className="w-full text-left border-collapse">
                      <thead>
                        <tr className="bg-slate-50/50">
                          <th className="px-10 py-6 text-[10px] font-black text-slate-400 uppercase tracking-widest">Candidat</th>
                          <th className="px-10 py-6 text-[10px] font-black text-slate-400 uppercase tracking-widest text-center">Niveau</th>
                          <th className="px-10 py-6 text-[10px] font-black text-slate-400 uppercase tracking-widest">Parent</th>
                          <th className="px-10 py-6 text-[10px] font-black text-slate-400 uppercase tracking-widest">Statut</th>
                          <th className="px-10 py-6 text-[10px] font-black text-slate-400 uppercase tracking-widest text-right">Actions</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-slate-50">
                        {filteredRequests.map((request) => (
                          <tr key={request.id} className="group hover:bg-slate-50/30 transition-colors">
                            <td className="px-10 py-6">
                              <div className="flex items-center gap-4">
                                <div className="w-10 h-10 rounded-xl bg-[#D32D3F]/5 flex items-center justify-center text-[#D32D3F] font-black text-sm">
                                  {request.studentFirstName[0]}{request.studentLastName[0]}
                                </div>
                                <div>
                                  <p className="font-black text-slate-900">{request.studentFirstName} {request.studentLastName}</p>
                                  <p className="text-[10px] font-bold text-slate-400 uppercase">{new Date(request.createdAt).toLocaleDateString()}</p>
                                </div>
                              </div>
                            </td>
                            <td className="px-10 py-6 text-center">
                              <Badge variant="outline" className="border-slate-200 text-slate-500 font-bold px-3 py-1 rounded-lg">{request.level}</Badge>
                            </td>
                            <td className="px-10 py-6">
                               <p className="text-xs font-bold text-slate-600 truncate max-w-[150px]">{request.parentEmail}</p>
                            </td>
                            <td className="px-10 py-6">
                              <Badge className={`${
                                request.status === 'NEW' ? 'bg-amber-100 text-amber-700' : 
                                request.status === 'TEST_SCHEDULED' ? 'bg-purple-100 text-purple-700' : 
                                request.status === 'VALIDATED' ? 'bg-green-100 text-green-700' : 'bg-red-50 text-red-500'
                              } border-none font-black text-[8px] uppercase px-3 py-1.5`}>
                                {request.status}
                              </Badge>
                            </td>
                            <td className="px-10 py-6 text-right">
                               <div className="flex justify-end gap-2">
                                  <Button 
                                    onClick={() => alert(`Visualisation du dossier de ${request.studentFirstName} ${request.studentLastName}. Documents disponibles en téléchargement.`)}
                                    size="icon" 
                                    variant="ghost" 
                                    className="rounded-xl text-slate-400 hover:text-[#D32D3F] hover:bg-[#D32D3F]/5 transition-all"
                                  >
                                     <Eye className="w-5 h-5" />
                                  </Button>
                                   {activeTab === 'NEW' && (
                                     <>
                                       <Button 
                                         onClick={() => {
                                           setSelectedRequest(request);
                                           setIsValidateModalOpen(true);
                                         }} 
                                         size="icon" variant="ghost" className="rounded-xl text-green-500 hover:bg-green-50 transition-all"
                                       >
                                          <Check className="w-5 h-5" />
                                       </Button>
                                       <Button onClick={() => updateStatus(request.id, 'REJECTED')} size="icon" variant="ghost" className="rounded-xl text-red-500 hover:bg-red-50 transition-all">
                                          <X className="w-5 h-5" />
                                       </Button>
                                     </>
                                   )}
                               </div>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                   </table>
                </div>
              </Card>
            )}
          </TabsContent>
        </Tabs>
      </div>

      {/* MODALE DE VALIDATION */}
      {isValidateModalOpen && (
        <div className="fixed inset-0 z-[200] flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm animate-in fade-in duration-300">
          <div className="bg-white rounded-[3rem] shadow-2xl w-full max-w-md overflow-hidden animate-in zoom-in-95 duration-300">
            <div className="p-8 border-b border-slate-50 bg-slate-50/50 flex justify-between items-center">
               <div>
                  <h2 className="text-2xl font-black text-slate-900">Admettre l'élève</h2>
                  <p className="text-xs font-bold text-slate-400 uppercase tracking-widest mt-1">Étape finale de validation</p>
               </div>
               <button onClick={() => setIsValidateModalOpen(false)} className="p-2 hover:bg-white rounded-xl transition-colors">
                  <X className="w-6 h-6 text-slate-300" />
               </button>
            </div>
            
            <div className="p-8 space-y-6">
               <div className="p-4 rounded-2xl bg-[#FFF8E7] border border-[#FDE68A] flex items-center gap-4">
                  <div className="w-12 h-12 rounded-xl bg-white flex items-center justify-center text-[#D32D3F] font-black text-lg">
                    {selectedRequest?.studentFirstName[0]}{selectedRequest?.studentLastName[0]}
                  </div>
                  <div>
                    <p className="font-black text-slate-900">{selectedRequest?.studentFirstName} {selectedRequest?.studentLastName}</p>
                    <p className="text-[10px] font-bold text-amber-700 uppercase tracking-widest">{selectedRequest?.level}</p>
                  </div>
               </div>

               <div className="space-y-2">
                  <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest pl-1">Assigner une Classe</label>
                  <select 
                    className="w-full h-14 px-5 rounded-2xl bg-slate-50 border-none font-bold text-slate-900 outline-none focus:ring-2 focus:ring-[#D32D3F]/10 transition-all appearance-none cursor-pointer"
                    value={selectedClassId}
                    onChange={(e) => setSelectedClassId(e.target.value)}
                  >
                    <option value="">Sélectionner une classe...</option>
                    {classes.map(c => (
                      <option key={c.id} value={c.id}>{c.level} - Section {c.name} ({c.studentsCount} élèves)</option>
                    ))}
                  </select>
               </div>

               <div className="flex gap-4 pt-2">
                  <Button 
                    onClick={() => setIsValidateModalOpen(false)}
                    variant="ghost" 
                    className="flex-1 h-14 rounded-2xl font-black uppercase text-[10px] tracking-widest text-slate-400"
                  >
                    Annuler
                  </Button>
                  <Button 
                    onClick={() => updateStatus(selectedRequest.id, 'VALIDATED', selectedClassId)}
                    disabled={!selectedClassId}
                    className="flex-2 bg-green-500 hover:bg-green-600 text-white rounded-2xl h-14 px-8 font-black uppercase text-[10px] tracking-widest shadow-xl shadow-green-500/20 disabled:opacity-50"
                  >
                    Confirmer & Admettre
                  </Button>
               </div>
            </div>
          </div>
        </div>
      )}
      {/* MODALE DE VISUALISATION DOSSIER */}
      {isViewModalOpen && selectedRequest && (
        <div className="fixed inset-0 z-[200] flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm animate-in fade-in duration-300">
          <div className="bg-white rounded-[3rem] shadow-2xl w-full max-w-2xl overflow-hidden animate-in zoom-in-95 duration-300 max-h-[90vh] flex flex-col">
            <div className="p-8 border-b border-slate-50 bg-slate-50/50 flex justify-between items-center shrink-0">
               <div>
                  <h2 className="text-2xl font-black text-slate-900">Dossier Candidat</h2>
                  <p className="text-xs font-bold text-[#D32D3F] uppercase tracking-widest mt-1 italic">{selectedRequest.studentFirstName} {selectedRequest.studentLastName}</p>
               </div>
               <button onClick={() => setIsViewModalOpen(false)} className="p-2 hover:bg-white rounded-xl transition-colors">
                  <X className="w-6 h-6 text-slate-300" />
               </button>
            </div>
            
            <div className="p-8 space-y-8 overflow-y-auto">
               <div className="grid grid-cols-2 gap-8">
                  <div className="space-y-1">
                     <p className="text-[10px] font-black text-slate-300 uppercase tracking-widest">Email Parent</p>
                     <p className="font-bold text-slate-700">{selectedRequest.parentEmail}</p>
                  </div>
                  <div className="space-y-1">
                     <p className="text-[10px] font-black text-slate-300 uppercase tracking-widest">Niveau Souhaité</p>
                     <p className="font-bold text-slate-900">{selectedRequest.level}</p>
                  </div>
               </div>

               <div className="space-y-4">
                  <p className="text-[10px] font-black text-slate-300 uppercase tracking-widest">Pièces Jointes</p>
                  <div className="grid grid-cols-2 gap-4">
                     {[
                       { label: 'Acte de Naissance', url: selectedRequest.birthCertificateUrl },
                       { label: 'Bulletin Scolaire', url: selectedRequest.reportCardUrl },
                       { label: 'Photos Identité', url: selectedRequest.identityPhotosUrl },
                       { label: 'Certificat Médical', url: selectedRequest.medicalCertificateUrl },
                     ].map((doc, i) => (
                       <div key={i} className="p-4 bg-slate-50 rounded-2xl border border-slate-100 flex items-center justify-between group">
                          <span className="text-xs font-bold text-slate-600">{doc.label}</span>
                          {doc.url ? (
                            <a 
                              href={`${apiUrl}${doc.url}`} 
                              target="_blank" 
                              rel="noopener noreferrer"
                              className="w-10 h-10 rounded-xl bg-white flex items-center justify-center text-[#D32D3F] shadow-sm hover:bg-[#D32D3F] hover:text-white transition-all"
                            >
                               <Eye className="w-4 h-4" />
                            </a>
                          ) : (
                            <span className="text-[10px] font-black text-slate-300 uppercase tracking-tighter">Absent</span>
                          )}
                       </div>
                     ))}
                  </div>
               </div>

               {selectedRequest.notes && (
                 <div className="space-y-2">
                    <p className="text-[10px] font-black text-slate-300 uppercase tracking-widest">Message / Notes</p>
                    <div className="p-5 bg-slate-50 rounded-2xl italic text-slate-600 text-sm leading-relaxed border border-slate-100">
                       "{selectedRequest.notes}"
                    </div>
                 </div>
               )}
            </div>

            <div className="p-8 border-t border-slate-50 bg-slate-50/50 flex justify-end shrink-0">
               <Button onClick={() => setIsViewModalOpen(false)} className="bg-slate-900 text-white rounded-2xl h-12 px-10 font-black uppercase text-[10px] tracking-widest">
                  Fermer
               </Button>
            </div>
          </div>
        </div>
      )}

      {/* MODALE DE PLANIFICATION */}
      {isScheduleModalOpen && selectedRequest && (
        <div className="fixed inset-0 z-[200] flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm animate-in fade-in duration-300">
          <div className="bg-white rounded-[3rem] shadow-2xl w-full max-w-md overflow-hidden animate-in zoom-in-95 duration-300">
            <div className="p-8 border-b border-slate-50 bg-slate-50/50 flex justify-between items-center">
               <div>
                  <h2 className="text-2xl font-black text-slate-900">Planifier RDV</h2>
                  <p className="text-xs font-bold text-slate-400 uppercase tracking-widest mt-1">Entretien & Examen</p>
               </div>
               <button onClick={() => setIsScheduleModalOpen(false)} className="p-2 hover:bg-white rounded-xl transition-colors">
                  <X className="w-6 h-6 text-slate-300" />
               </button>
            </div>
            
            <div className="p-8 space-y-6">
               <div className="space-y-3">
                  <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest pl-1">Date et Heure du rendez-vous</label>
                  <input 
                    type="datetime-local" 
                    value={testDate}
                    onChange={(e) => setTestDate(e.target.value)}
                    className="w-full h-14 px-6 rounded-2xl bg-slate-50 border-none font-bold text-slate-900 outline-none focus:ring-2 focus:ring-purple-500/20 transition-all"
                  />
               </div>

               <div className="p-4 bg-purple-50 rounded-2xl border border-purple-100">
                  <p className="text-[10px] text-purple-700 font-bold leading-relaxed">
                    Un email automatique sera envoyé au parent ({selectedRequest.parentEmail}) pour confirmer le rendez-vous au secrétariat du Collège Le Flambeau.
                  </p>
               </div>

               <div className="flex gap-4 pt-2">
                  <Button 
                    onClick={() => setIsScheduleModalOpen(false)}
                    variant="ghost" 
                    className="flex-1 h-14 rounded-2xl font-black uppercase text-[10px] tracking-widest text-slate-400"
                  >
                    Annuler
                  </Button>
                  <Button 
                    onClick={() => scheduleInterview(selectedRequest.id, testDate)}
                    disabled={!testDate}
                    className="flex-2 bg-purple-600 hover:bg-purple-700 text-white rounded-2xl h-14 px-8 font-black uppercase text-[10px] tracking-widest shadow-xl shadow-purple-600/20 disabled:opacity-50"
                  >
                    Confirmer RDV
                  </Button>
               </div>
            </div>
          </div>
        </div>
      )}
    </AppLayout>
  );
}

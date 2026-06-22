import { useState, useEffect } from 'react';
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

import { authFetch } from "@/lib/authFetch";
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
  const [examScore, setExamScore] = useState('');
  const [credentials, setCredentials] = useState<any>(null);
  const apiUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000';

  useEffect(() => {
    fetchAdmissions();
    fetchClasses();
  }, []);

  const fetchClasses = async () => {
    try {
      const response = await authFetch(`${apiUrl}/api/admin/academic`);
      const data = await response.json();
      setClasses(data.classes || []);
    } catch (err) {
      console.error('Erreur chargement classes:', err);
    }
  };

  const fetchAdmissions = async () => {
    try {
      setLoading(true);
      const response = await authFetch(`${apiUrl}/api/admin/admissions`);
      if (!response.ok) throw new Error('Impossible de charger les dossiers');
      const data = await response.json();
      setRequests(data);
    } catch (err) {
      console.error('Erreur lors du chargement des admissions:', err);
    } finally {
      setLoading(false);
    }
  };

  const updateStatus = async (id: string, status: string, classId?: string, testScore?: string) => {
    try {
      const response = await authFetch(`${apiUrl}/api/admin/admissions/${id}/status`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status, classId, testScore })
      });
      const data = await response.json().catch(() => ({}));
      if (response.ok) {
        if (status === 'VALIDATED' && data.credentials) {
          // Surface the generated ID + temp password to the admin (shown once).
          setCredentials(data.credentials);
        } else if (status === 'REJECTED') {
          alert('Dossier archivé.');
        }
        setIsValidateModalOpen(false);
        setSelectedRequest(null);
        setSelectedClassId('');
        setExamScore('');
        fetchAdmissions();
      } else {
        alert(data.error || 'Erreur lors de la mise à jour');
      }
    } catch (err) {
      alert('Erreur lors de la mise à jour');
    }
  };
  const scheduleInterview = async (id: string, date: string) => {
    try {
      const response = await authFetch(`${apiUrl}/api/admin/admissions/${id}/schedule`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ testDate: date })
      });
      if (response.ok) {
        alert('Entretien / Examen planifié avec succès !');
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

      <div className="max-w-7xl mx-auto">
        <FadeIn className="flex flex-col md:flex-row justify-between items-end gap-6 mb-10 pb-6 border-b border-line">
          <div>
            <p className="kicker mb-2">Dossiers · Le Flambeau</p>
            <h1 className="text-4xl md:text-5xl font-semibold text-ink tracking-tight mb-2">Admissions</h1>
            <p className="text-soft">Pilotez le flux des nouveaux talents.</p>
          </div>

          <div className="flex items-center border border-line bg-paper">
             <Button
               variant={viewMode === 'grid' ? 'default' : 'ghost'}
               size="icon"
               onClick={() => setViewMode('grid')}
               className={viewMode === 'grid' ? 'bg-accent text-paper hover:bg-accent-ink' : 'text-soft'}
             >
               <LayoutGrid className="w-5 h-5" />
             </Button>
             <Button
               variant={viewMode === 'table' ? 'default' : 'ghost'}
               size="icon"
               onClick={() => setViewMode('table')}
               className={viewMode === 'table' ? 'bg-accent text-paper hover:bg-accent-ink' : 'text-soft'}
             >
               <ListIcon className="w-5 h-5" />
             </Button>
          </div>
        </FadeIn>

        <Tabs defaultValue="NEW" className="w-full space-y-8" onValueChange={setActiveTab}>
          <div className="flex flex-col md:flex-row justify-between items-stretch md:items-center gap-6">
            <TabsList className="bg-panel p-0 h-auto border border-line w-full md:w-fit rounded-none">
              <TabsTrigger value="NEW" className="rounded-none px-6 py-3 mono uppercase text-xs tracking-widest data-[state=active]:bg-paper data-[state=active]:text-accent">
                À Traiter ({requests.filter(r => r.status === 'NEW' || r.status === 'TEST_SCHEDULED').length})
              </TabsTrigger>
              <TabsTrigger value="VALIDATED" className="rounded-none px-6 py-3 mono uppercase text-xs tracking-widest data-[state=active]:bg-paper data-[state=active]:text-ink">
                Admis ({requests.filter(r => r.status === 'VALIDATED').length})
              </TabsTrigger>
              <TabsTrigger value="REJECTED" className="rounded-none px-6 py-3 mono uppercase text-xs tracking-widest data-[state=active]:bg-paper data-[state=active]:text-accent">
                Refusés ({requests.filter(r => r.status === 'REJECTED').length})
              </TabsTrigger>
            </TabsList>

            <div className="relative w-full md:w-80">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-soft" />
              <input
                type="text"
                placeholder="Rechercher un dossier..."
                className="pl-11 border border-line bg-paper text-sm"
              />
            </div>
          </div>

          <TabsContent value={activeTab} className="mt-0">
            {loading ? (
              <div className="flex flex-col items-center justify-center py-32 gap-6 text-soft">
                <Loader2 className="w-12 h-12 animate-spin text-accent" />
                <p className="mono uppercase tracking-widest text-xs">Chargement sécurisé...</p>
              </div>
            ) : filteredRequests.length === 0 ? (
              <div className="text-center py-32 border border-line bg-paper">
                <FileText className="w-16 h-16 text-line mx-auto mb-6" />
                <p className="mono uppercase tracking-widest text-xs text-soft">Aucun dossier dans cette catégorie</p>
              </div>
            ) : viewMode === 'grid' ? (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-px bg-line border border-line">
                {filteredRequests.map((request) => (
                  <FadeIn key={request.id}>
                    <Card className="border-0 bg-paper h-full">
                      <CardContent className="p-6 space-y-6">
                        <div className="flex justify-between items-start gap-4">
                           <div className="flex items-center gap-4">
                              <div className="w-12 h-12 border border-line flex items-center justify-center text-soft bg-panel">
                                 <User className="w-6 h-6" />
                              </div>
                              <div>
                                 <h3 className="text-lg font-semibold text-ink truncate max-w-[150px]">
                                    {request.studentFirstName} <span className="text-accent uppercase">{request.studentLastName}</span>
                                 </h3>
                                 <p className="mono text-xs uppercase tracking-widest text-soft mt-1">
                                    {request.level}
                                 </p>
                              </div>
                           </div>
                           <Badge className={`${
                             request.status === 'VALIDATED' ? 'bg-ink text-paper' : 'bg-panel text-ink'
                           } border border-line rounded-none mono text-xs uppercase tracking-widest px-2 py-1`}>
                             {request.status === 'NEW' ? 'Nouveau' :
                              request.status === 'TEST_SCHEDULED' ? 'Examen' :
                              request.status === 'VALIDATED' ? 'Admis' : 'Refusé'}
                           </Badge>
                        </div>

                        <div className="grid grid-cols-2 gap-4 pt-4 border-t border-line">
                           <div className="space-y-1">
                              <p className="mono text-xs uppercase tracking-widest text-soft">Téléphone</p>
                              <p className="text-sm text-ink flex items-center gap-2"><Phone className="w-3 h-3 text-accent" /> {request.parentPhone}</p>
                           </div>
                           <div className="space-y-1">
                              <p className="mono text-xs uppercase tracking-widest text-soft">Date Dépôt</p>
                              <p className="text-sm text-ink flex items-center gap-2"><Calendar className="w-3 h-3 text-accent" /> {new Date(request.createdAt).toLocaleDateString()}</p>
                           </div>
                        </div>

                        {request.studentNumber && (
                          <div className="grid grid-cols-2 gap-4 pt-4 border-t border-line">
                             <div className="space-y-1">
                                <p className="mono text-xs uppercase tracking-widest text-soft">ID Élève</p>
                                <p className="numeral text-ink text-sm">{request.studentNumber}</p>
                             </div>
                             {request.testScore != null && (
                               <div className="space-y-1">
                                  <p className="mono text-xs uppercase tracking-widest text-soft">Note examen</p>
                                  <p className="numeral text-ink text-sm">{request.testScore}/100</p>
                               </div>
                             )}
                          </div>
                        )}

                         <div className="flex flex-col gap-3 pt-4">
                           {activeTab === 'NEW' && (
                             <div className="flex gap-2">
                               <Button
                                 onClick={() => {
                                   setSelectedRequest(request);
                                   setIsScheduleModalOpen(true);
                                 }}
                                 variant="outline"
                                 className="flex-1 rounded-none h-11 border-line text-ink hover:bg-ink hover:text-paper mono uppercase text-xs tracking-widest"
                               >
                                 Planifier Entretien
                               </Button>
                               <Button
                                 onClick={() => {
                                   setSelectedRequest(request);
                                   setIsValidateModalOpen(true);
                                 }}
                                 className="flex-1 bg-accent hover:bg-accent-ink text-paper rounded-none h-11 mono uppercase text-xs tracking-widest"
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
                               className="flex-1 rounded-none h-11 border-line text-soft hover:text-ink mono uppercase text-xs tracking-widest flex items-center justify-center gap-2"
                             >
                                <Eye className="w-4 h-4" /> Voir Dossier & Pièces
                             </Button>
                             {activeTab === 'NEW' && (
                               <Button onClick={() => updateStatus(request.id, 'REJECTED')} variant="outline" className="w-11 h-11 rounded-none border-line text-accent hover:bg-accent hover:text-paper transition-colors"><X className="w-5 h-5" /></Button>
                             )}
                           </div>
                         </div>
                      </CardContent>
                    </Card>
                  </FadeIn>
                ))}
              </div>
            ) : (
              <Card className="border border-line rounded-none bg-paper overflow-hidden">
                <div className="overflow-x-auto">
                   <table className="w-full text-left border-collapse">
                      <thead>
                        <tr className="border-b border-line">
                          <th className="px-6 py-4 mono text-xs font-medium text-soft uppercase tracking-widest">Candidat</th>
                          <th className="px-6 py-4 mono text-xs font-medium text-soft uppercase tracking-widest text-center">Niveau</th>
                          <th className="px-6 py-4 mono text-xs font-medium text-soft uppercase tracking-widest">Parent</th>
                          <th className="px-6 py-4 mono text-xs font-medium text-soft uppercase tracking-widest">Statut</th>
                          <th className="px-6 py-4 mono text-xs font-medium text-soft uppercase tracking-widest text-right">Actions</th>
                        </tr>
                      </thead>
                      <tbody>
                        {filteredRequests.map((request) => (
                          <tr key={request.id} className="border-b border-line hover:bg-panel transition-colors">
                            <td className="px-6 py-4">
                              <div className="flex items-center gap-4">
                                <div className="w-10 h-10 border border-line bg-panel flex items-center justify-center text-accent mono text-sm">
                                  {request.studentFirstName[0]}{request.studentLastName[0]}
                                </div>
                                <div>
                                  <p className="font-semibold text-ink">{request.studentFirstName} {request.studentLastName}</p>
                                  <p className="mono text-xs text-soft uppercase">{new Date(request.createdAt).toLocaleDateString()}</p>
                                </div>
                              </div>
                            </td>
                            <td className="px-6 py-4 text-center">
                              <Badge variant="outline" className="border border-line rounded-none text-soft mono px-2 py-1">{request.level}</Badge>
                            </td>
                            <td className="px-6 py-4">
                               <p className="text-sm text-ink truncate max-w-[150px]">{request.parentEmail}</p>
                            </td>
                            <td className="px-6 py-4">
                              <Badge className={`${
                                request.status === 'VALIDATED' ? 'bg-ink text-paper' : 'bg-panel text-ink'
                              } border border-line rounded-none mono text-xs uppercase px-2 py-1`}>
                                {request.status}
                              </Badge>
                            </td>
                            <td className="px-6 py-4 text-right">
                               <div className="flex justify-end gap-2">
                                  <Button
                                    onClick={() => alert(`Visualisation du dossier de ${request.studentFirstName} ${request.studentLastName}. Documents disponibles en téléchargement.`)}
                                    size="icon"
                                    variant="ghost"
                                    className="rounded-none text-soft hover:text-accent transition-colors"
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
                                         size="icon" variant="ghost" className="rounded-none text-ink hover:text-accent transition-colors"
                                       >
                                          <Check className="w-5 h-5" />
                                       </Button>
                                       <Button onClick={() => updateStatus(request.id, 'REJECTED')} size="icon" variant="ghost" className="rounded-none text-accent hover:text-accent-ink transition-colors">
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
        <div className="fixed inset-0 z-[200] flex items-center justify-center p-4" style={{ background: 'rgba(17,19,21,.6)' }}>
          <div className="bg-paper border border-line w-full max-w-md overflow-hidden">
            <div className="p-6 border-b border-line flex justify-between items-center">
               <div>
                  <h2 className="text-xl font-semibold text-ink">Admettre l'élève</h2>
                  <p className="mono text-xs text-soft uppercase tracking-widest mt-1">Étape finale de validation</p>
               </div>
               <button onClick={() => setIsValidateModalOpen(false)} className="w-9 h-9 flex items-center justify-center border border-line text-ink hover:bg-ink hover:text-paper transition-colors">
                  <X className="w-5 h-5" />
               </button>
            </div>

            <div className="p-6 space-y-6">
               <div className="p-4 border border-line bg-panel flex items-center gap-4">
                  <div className="w-12 h-12 border border-line bg-paper flex items-center justify-center text-accent mono text-lg">
                    {selectedRequest?.studentFirstName[0]}{selectedRequest?.studentLastName[0]}
                  </div>
                  <div>
                    <p className="font-semibold text-ink">{selectedRequest?.studentFirstName} {selectedRequest?.studentLastName}</p>
                    <p className="mono text-xs text-soft uppercase tracking-widest">{selectedRequest?.level}</p>
                  </div>
               </div>

               <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                     <label className="mono text-xs text-soft uppercase tracking-widest">Note d'examen /100</label>
                     <input
                       type="number"
                       min={0}
                       max={100}
                       step="0.5"
                       placeholder="ex. 78"
                       value={examScore}
                       onChange={(e) => setExamScore(e.target.value)}
                       className="w-full border border-line bg-paper text-ink"
                     />
                  </div>
                  <div className="space-y-2">
                     <label className="mono text-xs text-soft uppercase tracking-widest">Statut</label>
                     <div className="h-full flex items-center px-4 border border-line bg-panel mono text-xs uppercase tracking-widest text-ink">
                        {selectedRequest?.testScore != null ? `Noté · ${selectedRequest.testScore}/100` : 'Admission directe'}
                     </div>
                  </div>
               </div>

               <div className="space-y-2">
                  <label className="mono text-xs text-soft uppercase tracking-widest">Assigner une Classe</label>
                  <select
                    className="w-full border border-line bg-paper text-ink"
                    value={selectedClassId}
                    onChange={(e) => setSelectedClassId(e.target.value)}
                  >
                    <option value="">Sélectionner une classe...</option>
                    {classes.map(c => (
                      <option key={c.id} value={c.id}>{c.level} - Section {c.name} ({c.studentsCount} élèves)</option>
                    ))}
                  </select>
               </div>

               <div className="p-4 bg-panel border border-line">
                  <p className="text-sm text-soft leading-relaxed">
                    À la confirmation, un <span className="text-ink font-medium">identifiant unique STU-{new Date().getFullYear()}-XXXX</span> sera généré
                    et le compte élève créé avec un mot de passe temporaire à usage unique.
                  </p>
               </div>

               <div className="flex gap-4 pt-2">
                  <Button
                    onClick={() => setIsValidateModalOpen(false)}
                    variant="ghost"
                    className="flex-1 h-12 rounded-none mono uppercase text-xs tracking-widest text-soft"
                  >
                    Annuler
                  </Button>
                  <Button
                    onClick={() => updateStatus(selectedRequest.id, 'VALIDATED', selectedClassId, examScore)}
                    disabled={!selectedClassId}
                    className="flex-1 bg-accent hover:bg-accent-ink text-paper rounded-none h-12 px-8 mono uppercase text-xs tracking-widest disabled:opacity-50"
                  >
                    Valider & créer l'élève
                  </Button>
               </div>
            </div>
          </div>
        </div>
      )}
      {/* MODALE DE VISUALISATION DOSSIER */}
      {isViewModalOpen && selectedRequest && (
        <div className="fixed inset-0 z-[200] flex items-center justify-center p-4" style={{ background: 'rgba(17,19,21,.6)' }}>
          <div className="bg-paper border border-line w-full max-w-2xl overflow-hidden max-h-[90vh] flex flex-col">
            <div className="p-6 border-b border-line flex justify-between items-center shrink-0">
               <div>
                  <h2 className="text-xl font-semibold text-ink">Dossier Candidat</h2>
                  <p className="mono text-xs text-accent uppercase tracking-widest mt-1">{selectedRequest.studentFirstName} {selectedRequest.studentLastName}</p>
               </div>
               <button onClick={() => setIsViewModalOpen(false)} className="w-9 h-9 flex items-center justify-center border border-line text-ink hover:bg-ink hover:text-paper transition-colors">
                  <X className="w-5 h-5" />
               </button>
            </div>

            <div className="p-6 space-y-8 overflow-y-auto">
               <div className="grid grid-cols-2 gap-8">
                  <div className="space-y-1">
                     <p className="mono text-xs text-soft uppercase tracking-widest">Email Parent</p>
                     <p className="text-ink">{selectedRequest.parentEmail}</p>
                  </div>
                  <div className="space-y-1">
                     <p className="mono text-xs text-soft uppercase tracking-widest">Niveau Souhaité</p>
                     <p className="text-ink">{selectedRequest.level}</p>
                  </div>
               </div>

               <div className="space-y-4">
                  <p className="mono text-xs text-soft uppercase tracking-widest">Pièces Jointes</p>
                  <div className="grid grid-cols-2 gap-px bg-line border border-line">
                     {[
                       { label: 'Acte de Naissance', url: selectedRequest.birthCertificateUrl },
                       { label: 'Bulletin Scolaire', url: selectedRequest.reportCardUrl },
                       { label: 'Photos Identité', url: selectedRequest.identityPhotosUrl },
                       { label: 'Certificat Médical', url: selectedRequest.medicalCertificateUrl },
                     ].map((doc, i) => (
                       <div key={i} className="p-4 bg-paper flex items-center justify-between">
                          <span className="text-sm text-ink">{doc.label}</span>
                          {doc.url ? (
                            <a
                              href={`${apiUrl}${doc.url}`}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="w-10 h-10 border border-line bg-paper flex items-center justify-center text-accent hover:bg-accent hover:text-paper transition-colors"
                            >
                               <Eye className="w-4 h-4" />
                            </a>
                          ) : (
                            <span className="mono text-xs text-soft uppercase">Absent</span>
                          )}
                       </div>
                     ))}
                  </div>
               </div>

               {selectedRequest.notes && (
                 <div className="space-y-2">
                    <p className="mono text-xs text-soft uppercase tracking-widest">Message / Notes</p>
                    <div className="p-4 bg-panel border border-line text-ink text-sm leading-relaxed">
                       {selectedRequest.notes}
                    </div>
                 </div>
               )}
            </div>

            <div className="p-6 border-t border-line flex justify-end shrink-0">
               <Button onClick={() => setIsViewModalOpen(false)} className="bg-ink text-paper hover:bg-accent rounded-none h-12 px-10 mono uppercase text-xs tracking-widest">
                  Fermer
               </Button>
            </div>
          </div>
        </div>
      )}

      {/* MODALE DE PLANIFICATION */}
      {isScheduleModalOpen && selectedRequest && (
        <div className="fixed inset-0 z-[200] flex items-center justify-center p-4" style={{ background: 'rgba(17,19,21,.6)' }}>
          <div className="bg-paper border border-line w-full max-w-md overflow-hidden">
            <div className="p-6 border-b border-line flex justify-between items-center">
               <div>
                  <h2 className="text-xl font-semibold text-ink">Planifier RDV</h2>
                  <p className="mono text-xs text-soft uppercase tracking-widest mt-1">Entretien & Examen</p>
               </div>
               <button onClick={() => setIsScheduleModalOpen(false)} className="w-9 h-9 flex items-center justify-center border border-line text-ink hover:bg-ink hover:text-paper transition-colors">
                  <X className="w-5 h-5" />
               </button>
            </div>

            <div className="p-6 space-y-6">
               <div className="space-y-3">
                  <label className="mono text-xs text-soft uppercase tracking-widest">Date et Heure du rendez-vous</label>
                  <input
                    type="datetime-local"
                    value={testDate}
                    onChange={(e) => setTestDate(e.target.value)}
                    className="border border-line bg-paper text-ink"
                  />
               </div>

               <div className="p-4 bg-panel border border-line">
                  <p className="text-sm text-soft leading-relaxed">
                    Un email automatique sera envoyé au parent ({selectedRequest.parentEmail}) pour confirmer le rendez-vous au secrétariat du Collège Le Flambeau.
                  </p>
               </div>

               <div className="flex gap-4 pt-2">
                  <Button
                    onClick={() => setIsScheduleModalOpen(false)}
                    variant="ghost"
                    className="flex-1 h-12 rounded-none mono uppercase text-xs tracking-widest text-soft"
                  >
                    Annuler
                  </Button>
                  <Button
                    onClick={() => scheduleInterview(selectedRequest.id, testDate)}
                    disabled={!testDate}
                    className="flex-1 bg-accent hover:bg-accent-ink text-paper rounded-none h-12 px-8 mono uppercase text-xs tracking-widest disabled:opacity-50"
                  >
                    Confirmer RDV
                  </Button>
               </div>
            </div>
          </div>
        </div>
      )}

      {/* MODALE IDENTIFIANTS GÉNÉRÉS (affichés une seule fois) */}
      {credentials && (
        <div className="fixed inset-0 z-[210] flex items-center justify-center p-4" style={{ background: 'rgba(17,19,21,.7)' }}>
          <div className="bg-paper border border-line w-full max-w-md overflow-hidden">
            <div className="px-6 border-b border-line" style={{ background: 'var(--ink)', paddingBlock: 'calc(var(--lh) * 1.5)' }}>
               <p className="kicker mb-2" style={{ color: 'var(--accent)' }}>Élève créé</p>
               <p className="numeral text-paper" style={{ fontSize: '2rem' }}>{credentials.studentNumber}</p>
               <p className="mono text-xs uppercase tracking-widest text-white/50 mt-2">Identifiant unique permanent</p>
            </div>

            <div className="p-6 space-y-5">
               <div className="space-y-1">
                  <p className="mono text-xs text-soft uppercase tracking-widest">Email de connexion</p>
                  <p className="text-ink">{credentials.email}</p>
               </div>
               <div className="space-y-1">
                  <p className="mono text-xs text-soft uppercase tracking-widest">Mot de passe temporaire</p>
                  <p className="numeral text-ink text-xl select-all" style={{ letterSpacing: 0 }}>{credentials.temporaryPassword}</p>
               </div>
               <div className="p-4 bg-panel border-l-2 border-accent">
                  <p className="text-sm text-soft leading-relaxed">
                    Notez ou transmettez ces accès <span className="text-ink font-medium">maintenant</span> :
                    le mot de passe ne sera plus affiché. L'élève devra le renouveler à la première connexion.
                  </p>
               </div>

               <Button
                 onClick={() => setCredentials(null)}
                 className="w-full bg-accent hover:bg-accent-ink text-paper rounded-none h-12 mono uppercase text-xs tracking-widest"
               >
                  J'ai noté les accès — Fermer
               </Button>
            </div>
          </div>
        </div>
      )}
    </AppLayout>
  );
}

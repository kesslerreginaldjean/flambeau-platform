import { useState, useEffect } from 'react';
import Head from 'next/head';
import AppLayout from '@/components/layout/AppLayout';
import { TEACHER_NAV_ITEMS } from '@/constants/navigation';
import { Card, CardContent } from "@/components/ui/card";
import { 
  PenTool, Save, ChevronRight, 
  AlertCircle, BookOpen
} from 'lucide-react';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

import { authFetch } from "@/lib/authFetch";
export default function TeacherGrades() {
  const [classes, setClasses] = useState<any[]>([]);
  const [selectedClass, setSelectedClass] = useState<any>(null);
  const [term, setTerm] = useState('1');
  const [students, setStudents] = useState<any[]>([]);
  const [grades, setGrades] = useState<Record<string, {score: string, notes: string}>>({});
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    fetchClasses();
  }, []);

  const fetchClasses = async () => {
    try {
      const teacherId = localStorage.getItem('user_id');
      if (teacherId) {
        const response = await authFetch(`/api/teachers/${teacherId}/classes`);
        const data = await response.json();
        setClasses(data.assignedSubjects || []);
      }
    } catch (error) {
      console.error('Error fetching classes:', error);
    } finally {
      setLoading(false);
    }
  };

  const fetchStudents = async (classId: string) => {
    try {
      setLoading(true);
      const response = await authFetch(`/api/teachers/classes/${classId}/students`);
      const data = await response.json();
      setStudents(data);
      
      const initial: Record<string, {score: string, notes: string}> = {};
      data.forEach((s: any) => initial[s.studentId] = {score: '', notes: ''});
      setGrades(initial);
    } catch (error) {
      console.error('Error fetching students:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async () => {
    try {
      setSubmitting(true);
      const teacherName = localStorage.getItem('user_name') || 'Professeur';
      
      const payload = {
        subject: selectedClass.subject,
        term: parseInt(term),
        teacherName,
        grades: Object.entries(grades).map(([studentId, data]) => ({
          studentId,
          score: data.score || "0",
          notes: data.notes
        }))
      };

      const response = await authFetch('/api/teachers/grades', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
      });

      if (response.ok) {
        alert('Notes enregistrées avec succès ! 🎓✅');
        setSelectedClass(null);
      }
    } catch (error) {
      console.error('Error submitting grades:', error);
      alert('Erreur lors de l enregistrement.');
    } finally {
      setSubmitting(false);
    }
  };

  if (loading && classes.length === 0) return <div className="p-20 text-center font-bold text-slate-400 animate-pulse text-xl">Accès aux dossiers académiques...</div>;

  return (
    <AppLayout navItems={TEACHER_NAV_ITEMS} userName="Professeur" userRoleLabel="Évaluation">
      <Head><title>Saisie des Notes | Le Flambeau</title></Head>

      <div className="p-6 max-w-7xl mx-auto">
        <div className="mb-10 flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
          <div>
            <h1 className="text-4xl font-black text-slate-900 tracking-tight flex items-center gap-3">
              <PenTool className="w-10 h-10 text-[#D32D3F]" />
              Saisie des Notes
            </h1>
            <p className="text-slate-500 font-medium text-lg mt-1 italic">"Évaluer pour mieux orienter."</p>
          </div>

          <div className="flex bg-slate-100 p-2 rounded-2xl gap-2">
            {['1', '2', '3'].map((t) => (
              <button
                key={t}
                onClick={() => setTerm(t)}
                className={`px-6 py-2 rounded-xl font-black text-xs uppercase tracking-widest transition-all ${term === t ? 'bg-white text-[#D32D3F] shadow-sm' : 'text-slate-400'}`}
              >
                Trimestre {t}
              </button>
            ))}
          </div>
        </div>

        {!selectedClass ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {classes.map((cls: any) => (
              <Card 
                key={cls.id} 
                className="border-none shadow-xl rounded-[2.5rem] bg-white group cursor-pointer hover:shadow-2xl hover:-translate-y-2 transition-all duration-500 overflow-hidden"
                onClick={() => {
                  setSelectedClass(cls);
                  fetchStudents(cls.classId);
                }}
              >
                <div className="h-3 bg-[#D32D3F] opacity-20"></div>
                <CardContent className="p-10">
                  <div className="w-16 h-16 bg-slate-50 rounded-2xl flex items-center justify-center text-[#D32D3F] mb-8 group-hover:bg-[#D32D3F] group-hover:text-white transition-all duration-500 shadow-inner">
                    <BookOpen className="w-8 h-8" />
                  </div>
                  <h3 className="text-3xl font-black text-slate-900 tracking-tight">{cls.class?.level} {cls.class?.name}</h3>
                  <p className="text-xs font-black text-slate-400 uppercase tracking-[0.2em] mt-2 italic">{cls.subject}</p>
                  
                  <div className="mt-10 flex items-center justify-between">
                    <span className="text-[10px] font-black text-slate-300 uppercase tracking-widest">Saisir les notes</span>
                    <div className="w-10 h-10 rounded-full bg-slate-50 flex items-center justify-center group-hover:bg-[#D32D3F] group-hover:text-white transition-all">
                      <ChevronRight className="w-5 h-5" />
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        ) : (
          <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
            <div className="flex flex-col md:flex-row justify-between items-center bg-white p-8 rounded-[2.5rem] shadow-xl border border-slate-100 gap-6">
               <div className="flex items-center gap-6">
                 <div className="w-20 h-20 rounded-[1.5rem] bg-[#FFF8E7] flex items-center justify-center font-black text-[#D32D3F] text-3xl shadow-inner">
                    {selectedClass.class?.level[0]}
                 </div>
                 <div>
                   <h2 className="text-2xl font-black text-slate-900 tracking-tight">{selectedClass.class?.level} {selectedClass.class?.name}</h2>
                   <p className="text-xs font-black text-[#D32D3F] uppercase tracking-[0.2em]">{selectedClass.subject} • Trimestre {term}</p>
                 </div>
               </div>
               <div className="flex gap-4">
                 <Button 
                  variant="outline" 
                  onClick={() => setSelectedClass(null)}
                  className="rounded-[1.2rem] border-slate-200 font-black text-[10px] uppercase tracking-widest h-14 px-8"
                 >
                   Changer de classe
                 </Button>
                 <Button 
                  onClick={handleSubmit}
                  disabled={submitting}
                  className="bg-slate-900 hover:bg-[#D32D3F] text-white rounded-[1.2rem] font-black text-[10px] uppercase tracking-widest h-14 px-8 shadow-2xl transition-all"
                 >
                   <Save className="w-4 h-4 mr-2" />
                   {submitting ? 'Enregistrement...' : 'Enregistrer tout'}
                 </Button>
               </div>
            </div>

            <Card className="border-none shadow-2xl rounded-[3rem] overflow-hidden bg-white">
              <div className="overflow-x-auto">
                <table className="w-full text-left border-collapse">
                  <thead>
                    <tr className="bg-slate-50/50 border-b border-slate-100">
                      <th className="px-10 py-8 text-[10px] font-black text-slate-400 uppercase tracking-[0.2em]">Élève</th>
                      <th className="px-10 py-8 text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] text-center w-40">Note / 100</th>
                      <th className="px-10 py-8 text-[10px] font-black text-slate-400 uppercase tracking-[0.2em]">Observations / Remarques</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-50">
                    {students.map((enroll: any) => (
                      <tr key={enroll.studentId} className="group hover:bg-slate-50/50 transition-colors">
                        <td className="px-10 py-6">
                          <div className="flex items-center gap-5">
                            <div className="w-12 h-12 rounded-[1rem] bg-white shadow-sm flex items-center justify-center font-black text-[#D32D3F] text-sm group-hover:scale-110 transition-transform">
                              {enroll.student.user.firstName[0]}{enroll.student.user.lastName[0]}
                            </div>
                            <div>
                              <p className="font-black text-slate-900">{enroll.student.user.firstName} {enroll.student.user.lastName}</p>
                              <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Matricule {enroll.student.studentNumber}</p>
                            </div>
                          </div>
                        </td>
                        <td className="px-10 py-6">
                          <Input 
                            type="number"
                            min="0"
                            max="100"
                            placeholder="0"
                            value={grades[enroll.studentId]?.score || ''}
                            onChange={(e) => setGrades({
                              ...grades, 
                              [enroll.studentId]: { ...grades[enroll.studentId], score: e.target.value }
                            })}
                            className="text-center font-black text-xl h-14 rounded-2xl border-slate-100 bg-slate-50 focus:ring-[#D32D3F] focus:bg-white transition-all"
                          />
                        </td>
                        <td className="px-10 py-6">
                          <Input 
                            placeholder="Ex: Excellent travail, persévérez."
                            value={grades[enroll.studentId]?.notes || ''}
                            onChange={(e) => setGrades({
                              ...grades, 
                              [enroll.studentId]: { ...grades[enroll.studentId], notes: e.target.value }
                            })}
                            className="h-14 rounded-2xl border-slate-100 bg-slate-50 font-medium placeholder:italic placeholder:font-normal"
                          />
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
              
              <div className="p-10 bg-slate-50 border-t border-slate-100 flex items-center justify-between">
                <div className="flex items-center gap-3 text-slate-400 italic text-sm">
                  <AlertCircle className="w-5 h-5" />
                  Les notes saisies seront immédiatement visibles par les parents et élèves.
                </div>
                <Button 
                  onClick={handleSubmit}
                  disabled={submitting}
                  className="bg-[#D32D3F] hover:bg-[#8B1A26] text-white px-12 py-8 rounded-[1.5rem] font-black text-xs uppercase tracking-widest shadow-2xl transition-all active:scale-95"
                >
                  <Save className="w-6 h-6 mr-3" />
                  {submitting ? 'Envoi...' : 'Valider le Bulletin'}
                </Button>
              </div>
            </Card>
          </div>
        )}
      </div>
    </AppLayout>
  );
}

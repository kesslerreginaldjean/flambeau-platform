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
        alert('Notes enregistrées avec succès !');
        setSelectedClass(null);
      }
    } catch (error) {
      console.error('Error submitting grades:', error);
      alert('Erreur lors de l enregistrement.');
    } finally {
      setSubmitting(false);
    }
  };

  if (loading && classes.length === 0) return <div className="p-20 text-center mono text-sm uppercase tracking-widest text-soft animate-pulse">Accès aux dossiers académiques...</div>;

  return (
    <AppLayout navItems={TEACHER_NAV_ITEMS} userName="Professeur" userRoleLabel="Évaluation">
      <Head><title>Saisie des Notes | Le Flambeau</title></Head>

      <div className="max-w-7xl mx-auto">
        <div className="mb-8 flex flex-col md:flex-row justify-between items-start md:items-center gap-6 border-b border-line pb-6">
          <div>
            <p className="kicker mb-2">Évaluation</p>
            <h1 className="text-3xl md:text-4xl font-semibold text-ink tracking-tight flex items-center gap-3">
              <PenTool className="w-8 h-8 text-accent" />
              Saisie des Notes
            </h1>
            <p className="text-soft mt-2">Évaluer pour mieux orienter.</p>
          </div>

          <div className="flex border border-line bg-paper">
            {['1', '2', '3'].map((t) => (
              <button
                key={t}
                onClick={() => setTerm(t)}
                className={`px-5 h-10 mono text-xs uppercase tracking-widest border-b-2 transition-colors ${term === t ? 'border-accent text-accent bg-panel' : 'border-transparent text-soft hover:text-ink'}`}
              >
                Trimestre {t}
              </button>
            ))}
          </div>
        </div>

        {!selectedClass ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-px bg-line border border-line">
            {classes.map((cls: any) => (
              <Card
                key={cls.id}
                className="border-0 bg-paper group cursor-pointer hover:bg-panel transition-colors"
                onClick={() => {
                  setSelectedClass(cls);
                  fetchStudents(cls.classId);
                }}
              >
                <CardContent className="p-8">
                  <div className="w-14 h-14 border border-line flex items-center justify-center text-accent mb-8">
                    <BookOpen className="w-7 h-7" />
                  </div>
                  <h3 className="text-2xl font-semibold text-ink tracking-tight">{cls.class?.level} {cls.class?.name}</h3>
                  <p className="mono text-xs text-soft uppercase tracking-widest mt-2">{cls.subject}</p>

                  <div className="mt-10 flex items-center justify-between border-t border-line pt-4">
                    <span className="mono text-xs text-soft uppercase tracking-widest">Saisir les notes</span>
                    <div className="w-9 h-9 border border-line flex items-center justify-center text-ink group-hover:bg-accent group-hover:text-paper group-hover:border-accent transition-colors">
                      <ChevronRight className="w-5 h-5" />
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        ) : (
          <div className="space-y-6">
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center bg-paper p-6 border border-line gap-4">
               <div className="flex items-center gap-5">
                 <div className="w-16 h-16 border border-line flex items-center justify-center numeral text-accent text-3xl">
                    {selectedClass.class?.level[0]}
                 </div>
                 <div>
                   <h2 className="text-xl font-semibold text-ink tracking-tight">{selectedClass.class?.level} {selectedClass.class?.name}</h2>
                   <p className="mono text-xs text-accent uppercase tracking-widest">{selectedClass.subject} • Trimestre {term}</p>
                 </div>
               </div>
               <div className="flex gap-3">
                 <Button
                  variant="outline"
                  onClick={() => setSelectedClass(null)}
                  className="mono text-xs uppercase tracking-widest h-12 px-6"
                 >
                   Changer de classe
                 </Button>
                 <Button
                  onClick={handleSubmit}
                  disabled={submitting}
                  className="bg-ink hover:bg-accent text-paper rounded-none mono text-xs uppercase tracking-widest h-12 px-6"
                 >
                   <Save className="w-4 h-4 mr-2" />
                   {submitting ? 'Enregistrement...' : 'Enregistrer tout'}
                 </Button>
               </div>
            </div>

            <Card className="border border-line overflow-hidden bg-paper">
              <div className="overflow-x-auto">
                <table className="w-full text-left border-collapse">
                  <thead>
                    <tr className="border-b border-line">
                      <th className="px-6 py-4 mono text-xs text-soft uppercase tracking-widest">Élève</th>
                      <th className="px-6 py-4 mono text-xs text-soft uppercase tracking-widest text-center w-40">Note / 100</th>
                      <th className="px-6 py-4 mono text-xs text-soft uppercase tracking-widest">Observations / Remarques</th>
                    </tr>
                  </thead>
                  <tbody>
                    {students.map((enroll: any) => (
                      <tr key={enroll.studentId} className="border-b border-line hover:bg-panel transition-colors">
                        <td className="px-6 py-4">
                          <div className="flex items-center gap-4">
                            <div className="w-12 h-12 border border-line flex items-center justify-center numeral text-accent text-sm">
                              {enroll.student.user.firstName[0]}{enroll.student.user.lastName[0]}
                            </div>
                            <div>
                              <p className="font-semibold text-ink">{enroll.student.user.firstName} {enroll.student.user.lastName}</p>
                              <p className="mono text-xs text-soft uppercase tracking-widest">Matricule {enroll.student.studentNumber}</p>
                            </div>
                          </div>
                        </td>
                        <td className="px-6 py-4">
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
                            className="text-center numeral text-xl h-12 rounded-none border-line bg-paper"
                          />
                        </td>
                        <td className="px-6 py-4">
                          <Input
                            placeholder="Ex: Excellent travail, persévérez."
                            value={grades[enroll.studentId]?.notes || ''}
                            onChange={(e) => setGrades({
                              ...grades,
                              [enroll.studentId]: { ...grades[enroll.studentId], notes: e.target.value }
                            })}
                            className="h-12 rounded-none border-line bg-paper"
                          />
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>

              <div className="p-6 border-t border-line flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
                <div className="flex items-center gap-3 text-soft text-sm">
                  <AlertCircle className="w-5 h-5" />
                  Les notes saisies seront immédiatement visibles par les parents et élèves.
                </div>
                <Button
                  onClick={handleSubmit}
                  disabled={submitting}
                  className="btn-accent rounded-none"
                >
                  <Save className="w-5 h-5 mr-3" />
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

import { useState, useEffect } from 'react';
import Head from 'next/head';
import AppLayout from '@/components/layout/AppLayout';
import { TEACHER_NAV_ITEMS } from '@/constants/navigation';
import { Card, CardContent } from "@/components/ui/card";
import {
  Fingerprint, CheckCircle, XCircle, Clock,
  ArrowRight, Save, Calendar
} from 'lucide-react';
import { Button } from "@/components/ui/button";

import { authFetch } from "@/lib/authFetch";
export default function TeacherAttendance() {
  const [classes, setClasses] = useState<any[]>([]);
  const [selectedClass, setSelectedClass] = useState<any>(null);
  const [students, setStudents] = useState<any[]>([]);
  const [attendance, setAttendance] = useState<Record<string, string>>({}); // studentId -> status
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
      // Default all to Present
      const initial: Record<string, string> = {};
      data.forEach((s: any) => initial[s.studentId] = 'present');
      setAttendance(initial);
    } catch (error) {
      console.error('Error fetching students:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async () => {
    try {
      setSubmitting(true);
      const records = Object.entries(attendance).map(([studentId, status]) => ({
        studentId,
        status,
        note: ''
      }));

      const response = await authFetch('/api/teachers/attendance', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          classId: selectedClass.classId,
          date: new Date().toISOString(),
          records
        })
      });

      if (response.ok) {
        alert('Appel enregistré avec succès !');
        setSelectedClass(null);
      }
    } catch (error) {
      console.error('Error submitting attendance:', error);
      alert('Erreur lors de l enregistrement.');
    } finally {
      setSubmitting(false);
    }
  };

  if (loading && classes.length === 0) return <div className="p-20 text-center mono text-sm uppercase tracking-widest text-soft animate-pulse">Accès à tes classes...</div>;

  return (
    <AppLayout navItems={TEACHER_NAV_ITEMS} userName="Professeur" userRoleLabel="Enseignant">
      <Head><title>Faire l'Appel | Le Flambeau</title></Head>

      <div className="max-w-6xl mx-auto">
        <div className="mb-8 border-b border-line pb-6">
          <p className="kicker mb-2">Feuille de Présence</p>
          <h1 className="text-3xl font-semibold text-ink tracking-tight flex items-center gap-3">
            <Fingerprint className="w-7 h-7 text-accent" />
            Feuille de Présence
          </h1>
          <p className="text-soft mt-2">Sélectionne une classe pour faire l'appel du jour.</p>
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
                <CardContent className="p-6">
                  <div className="w-12 h-12 border border-line flex items-center justify-center text-accent mb-6">
                    <Calendar className="w-6 h-6" />
                  </div>
                  <h3 className="text-xl font-semibold text-ink tracking-tight">{cls.class?.level} {cls.class?.name}</h3>
                  <p className="mono text-xs text-soft uppercase tracking-widest mt-1">{cls.subject}</p>
                  <div className="mt-8 flex items-center justify-between border-t border-line pt-4">
                    <span className="mono text-xs text-soft uppercase tracking-widest">Voir la liste</span>
                    <ArrowRight className="w-5 h-5 text-soft group-hover:text-accent transition-colors" />
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        ) : (
          <div className="space-y-6">
            <div className="flex justify-between items-center bg-paper p-6 border border-line">
               <div>
                 <h2 className="text-xl font-semibold text-ink">{selectedClass.class?.level} {selectedClass.class?.name}</h2>
                 <p className="mono text-xs text-accent uppercase tracking-widest">{selectedClass.subject}</p>
               </div>
               <Button
                variant="outline"
                onClick={() => setSelectedClass(null)}
                className="mono text-xs uppercase tracking-widest"
               >
                 Changer de classe
               </Button>
            </div>

            <Card className="border border-line overflow-hidden bg-paper">
              <div className="overflow-x-auto">
                <table className="w-full text-left border-collapse">
                  <thead>
                    <tr className="border-b border-line">
                      <th className="px-6 py-4 mono text-xs text-soft uppercase tracking-widest">Élève</th>
                      <th className="px-6 py-4 mono text-xs text-soft uppercase tracking-widest text-center">Présent</th>
                      <th className="px-6 py-4 mono text-xs text-soft uppercase tracking-widest text-center">Absent</th>
                      <th className="px-6 py-4 mono text-xs text-soft uppercase tracking-widest text-center">Retard</th>
                    </tr>
                  </thead>
                  <tbody>
                    {students.map((enroll: any) => (
                      <tr key={enroll.studentId} className="border-b border-line hover:bg-panel transition-colors">
                        <td className="px-6 py-4">
                          <div className="flex items-center gap-4">
                            <div className="w-10 h-10 border border-line flex items-center justify-center numeral text-accent text-xs">
                              {enroll.student.user.firstName[0]}{enroll.student.user.lastName[0]}
                            </div>
                            <span className="font-semibold text-ink">{enroll.student.user.firstName} {enroll.student.user.lastName}</span>
                          </div>
                        </td>
                        <td className="px-6 py-4 text-center">
                          <button
                            onClick={() => setAttendance({...attendance, [enroll.studentId]: 'present'})}
                            className={`w-10 h-10 inline-flex items-center justify-center border transition-colors ${attendance[enroll.studentId] === 'present' ? 'bg-ink text-paper border-ink' : 'border-line text-soft hover:border-ink'}`}
                          >
                            <CheckCircle className="w-5 h-5" />
                          </button>
                        </td>
                        <td className="px-6 py-4 text-center">
                          <button
                            onClick={() => setAttendance({...attendance, [enroll.studentId]: 'absent'})}
                            className={`w-10 h-10 inline-flex items-center justify-center border transition-colors ${attendance[enroll.studentId] === 'absent' ? 'bg-accent text-paper border-accent' : 'border-line text-soft hover:border-accent'}`}
                          >
                            <XCircle className="w-5 h-5" />
                          </button>
                        </td>
                        <td className="px-6 py-4 text-center">
                          <button
                            onClick={() => setAttendance({...attendance, [enroll.studentId]: 'late'})}
                            className={`w-10 h-10 inline-flex items-center justify-center border transition-colors ${attendance[enroll.studentId] === 'late' ? 'bg-panel text-ink border-ink' : 'border-line text-soft hover:border-ink'}`}
                          >
                            <Clock className="w-5 h-5" />
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
              <div className="p-6 border-t border-line flex justify-end">
                <Button
                  onClick={handleSubmit}
                  disabled={submitting}
                  className="btn-accent rounded-none"
                >
                  <Save className="w-5 h-5 mr-3" />
                  {submitting ? 'Enregistrement...' : 'Valider l Appel'}
                </Button>
              </div>
            </Card>
          </div>
        )}
      </div>
    </AppLayout>
  );
}

import React, { useState, useEffect } from 'react';
import Head from 'next/head';
import AppLayout from '@/components/layout/AppLayout';
import { TEACHER_NAV_ITEMS } from '@/constants/navigation';
import { Card, CardContent } from "@/components/ui/card";
import { 
  Fingerprint, CheckCircle, XCircle, Clock, 
  ArrowRight, Save, Calendar
} from 'lucide-react';
import { Button } from "@/components/ui/button";

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
        const response = await fetch(`http://localhost:5000/api/teachers/${teacherId}/classes`);
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
      const response = await fetch(`http://localhost:5000/api/teachers/classes/${classId}/students`);
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
      
      const response = await fetch('http://localhost:5000/api/teachers/attendance', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          classId: selectedClass.classId,
          date: new Date().toISOString(),
          records
        })
      });

      if (response.ok) {
        alert('Appel enregistré avec succès ! ✅');
        setSelectedClass(null);
      }
    } catch (error) {
      console.error('Error submitting attendance:', error);
      alert('Erreur lors de l enregistrement.');
    } finally {
      setSubmitting(false);
    }
  };

  if (loading && classes.length === 0) return <div className="p-20 text-center font-bold text-slate-400 animate-pulse text-xl">Accès à tes classes...</div>;

  return (
    <AppLayout navItems={TEACHER_NAV_ITEMS} userName="Professeur" userRoleLabel="Enseignant">
      <Head><title>Faire l'Appel | Le Flambeau</title></Head>

      <div className="p-6 max-w-6xl mx-auto">
        <div className="mb-10">
          <h1 className="text-3xl font-black text-slate-900 tracking-tight flex items-center gap-3">
            <Fingerprint className="w-8 h-8 text-[#D32D3F]" />
            Feuille de Présence
          </h1>
          <p className="text-slate-500 font-medium">Sélectionne une classe pour faire l'appel du jour.</p>
        </div>

        {!selectedClass ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {classes.map((cls: any) => (
              <Card 
                key={cls.id} 
                className="border-none shadow-xl rounded-[2.5rem] bg-white group cursor-pointer hover:scale-[1.03] transition-all duration-300"
                onClick={() => {
                  setSelectedClass(cls);
                  fetchStudents(cls.classId);
                }}
              >
                <CardContent className="p-8">
                  <div className="w-14 h-14 bg-slate-50 rounded-2xl flex items-center justify-center text-[#D32D3F] mb-6 group-hover:bg-[#D32D3F] group-hover:text-white transition-colors">
                    <Calendar className="w-7 h-7" />
                  </div>
                  <h3 className="text-2xl font-black text-slate-900 tracking-tight">{cls.class?.level} {cls.class?.name}</h3>
                  <p className="text-xs font-bold text-slate-400 uppercase tracking-[0.2em] mt-1">{cls.subject}</p>
                  <div className="mt-8 flex items-center justify-between">
                    <span className="text-[10px] font-black text-slate-300 uppercase tracking-widest">Voir la liste</span>
                    <ArrowRight className="w-5 h-5 text-slate-200 group-hover:text-[#D32D3F] transition-colors" />
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        ) : (
          <div className="space-y-6">
            <div className="flex justify-between items-center bg-white p-6 rounded-[2rem] shadow-xl border border-slate-100">
               <div>
                 <h2 className="text-xl font-black text-slate-900">{selectedClass.class?.level} {selectedClass.class?.name}</h2>
                 <p className="text-xs font-bold text-[#D32D3F] uppercase tracking-widest">{selectedClass.subject}</p>
               </div>
               <Button 
                variant="outline" 
                onClick={() => setSelectedClass(null)}
                className="rounded-xl border-slate-200 font-bold text-slate-500"
               >
                 Changer de classe
               </Button>
            </div>

            <Card className="border-none shadow-2xl rounded-[3rem] overflow-hidden bg-white">
              <div className="overflow-x-auto">
                <table className="w-full text-left border-collapse">
                  <thead>
                    <tr className="bg-slate-50/50 border-b border-slate-100">
                      <th className="px-8 py-6 text-[10px] font-black text-slate-400 uppercase tracking-[0.2em]">Élève</th>
                      <th className="px-8 py-6 text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] text-center">Présent</th>
                      <th className="px-8 py-6 text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] text-center">Absent</th>
                      <th className="px-8 py-6 text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] text-center">Retard</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-50">
                    {students.map((enroll: any) => (
                      <tr key={enroll.studentId} className="hover:bg-slate-50/50 transition-colors">
                        <td className="px-8 py-5">
                          <div className="flex items-center gap-4">
                            <div className="w-10 h-10 rounded-xl bg-slate-100 flex items-center justify-center font-black text-[#D32D3F] text-xs">
                              {enroll.student.user.firstName[0]}{enroll.student.user.lastName[0]}
                            </div>
                            <span className="font-bold text-slate-900">{enroll.student.user.firstName} {enroll.student.user.lastName}</span>
                          </div>
                        </td>
                        <td className="px-8 py-5 text-center">
                          <button 
                            onClick={() => setAttendance({...attendance, [enroll.studentId]: 'present'})}
                            className={`w-10 h-10 rounded-full flex items-center justify-center transition-all ${attendance[enroll.studentId] === 'present' ? 'bg-green-500 text-white shadow-lg scale-110' : 'bg-slate-100 text-slate-300'}`}
                          >
                            <CheckCircle className="w-6 h-6" />
                          </button>
                        </td>
                        <td className="px-8 py-5 text-center">
                          <button 
                            onClick={() => setAttendance({...attendance, [enroll.studentId]: 'absent'})}
                            className={`w-10 h-10 rounded-full flex items-center justify-center transition-all ${attendance[enroll.studentId] === 'absent' ? 'bg-red-500 text-white shadow-lg scale-110' : 'bg-slate-100 text-slate-300'}`}
                          >
                            <XCircle className="w-6 h-6" />
                          </button>
                        </td>
                        <td className="px-8 py-5 text-center">
                          <button 
                            onClick={() => setAttendance({...attendance, [enroll.studentId]: 'late'})}
                            className={`w-10 h-10 rounded-full flex items-center justify-center transition-all ${attendance[enroll.studentId] === 'late' ? 'bg-amber-500 text-white shadow-lg scale-110' : 'bg-slate-100 text-slate-300'}`}
                          >
                            <Clock className="w-6 h-6" />
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
              <div className="p-8 bg-slate-50 border-t border-slate-100 flex justify-end">
                <Button 
                  onClick={handleSubmit}
                  disabled={submitting}
                  className="bg-[#D32D3F] hover:bg-[#8B1A26] text-white px-10 py-6 rounded-2xl font-black text-xs uppercase tracking-widest shadow-2xl transition-all"
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

import { useEffect, useState } from 'react';
import Head from 'next/head';
import { useRouter } from 'next/router';
import AppLayout from '@/components/layout/AppLayout';
import { STUDENT_NAV_ITEMS } from '@/constants/navigation';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { History, GraduationCap, Download } from 'lucide-react';

import { authFetch } from "@/lib/authFetch";
export default function StudentGrades() {
  const router = useRouter();
  const [grades, setGrades] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [userName, setUserName] = useState('');

  useEffect(() => {
    const fetchGrades = async () => {
      try {
        const studentId = localStorage.getItem('user_id');
        const name = localStorage.getItem('user_name') || 'Élève';
        setUserName(name);

        if (studentId) {
          const response = await authFetch(`/api/students/${studentId}/grades`);
          const data = await response.json();
          setGrades(data);
        } else {
          router.push('/login');
        }
      } catch (error) {
        console.error('Error fetching grades:', error);
      } finally {
        setLoading(false);
      }
    };
    fetchGrades();
  }, [router]);

  // Group grades by academic year and term
  const groupedGrades = grades.reduce((acc: any, grade: any) => {
    const year = grade.academicYear.name;
    const term = `Trimestre ${grade.term}`;
    if (!acc[year]) acc[year] = {};
    if (!acc[year][term]) acc[year][term] = [];
    acc[year][term].push(grade);
    return acc;
  }, {});

  return (
    <AppLayout navItems={STUDENT_NAV_ITEMS} userName={userName} userRoleLabel="Étudiant">
      <Head>
        <title>Mes Notes Historiques | Le Flambeau</title>
      </Head>

      <div className="p-6 max-w-5xl mx-auto">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8 gap-4">
          <div>
            <h1 className="text-3xl font-black text-slate-900 tracking-tight flex items-center gap-3">
              <GraduationCap className="w-8 h-8 text-[#D32D3F]" />
              Mon Relevé de Notes
            </h1>
            <p className="text-slate-500 font-medium">Historique complet de tes performances académiques au Flambeau.</p>
          </div>
          <button className="flex items-center gap-2 bg-slate-900 text-white px-6 py-3 rounded-2xl font-black text-xs uppercase tracking-widest hover:bg-[#D32D3F] transition-all shadow-xl">
            <Download className="w-4 h-4" />
            Télécharger Bulletin (PDF)
          </button>
        </div>

        {loading ? (
          <div className="p-20 text-center font-bold text-slate-400 animate-pulse">Récupération de ton dossier académique...</div>
        ) : Object.keys(groupedGrades).length > 0 ? (
          <div className="space-y-12">
            {Object.entries(groupedGrades).map(([year, terms]: [string, any]) => (
              <div key={year} className="space-y-6">
                <div className="flex items-center gap-4">
                  <div className="h-px flex-1 bg-slate-200"></div>
                  <Badge className="bg-slate-900 text-white px-6 py-2 rounded-full font-black text-sm tracking-tighter">
                    Année Scolaire {year}
                  </Badge>
                  <div className="h-px flex-1 bg-slate-200"></div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {Object.entries(terms).map(([term, termGrades]: [string, any]) => (
                    <Card key={term} className="border-none shadow-xl rounded-[2.5rem] bg-white overflow-hidden">
                      <CardHeader className="p-8 pb-0 flex flex-row items-center justify-between">
                        <CardTitle className="text-lg font-black text-slate-900">{term}</CardTitle>
                        <Badge className="bg-[#D32D3F]/10 text-[#D32D3F] border-none font-bold">
                          Moy: {(termGrades.reduce((acc: number, g: any) => acc + g.score, 0) / termGrades.length).toFixed(1)}
                        </Badge>
                      </CardHeader>
                      <CardContent className="p-8">
                        <div className="space-y-3">
                          {termGrades.map((grade: any) => (
                            <div key={grade.id} className="flex items-center justify-between p-4 bg-slate-50 rounded-2xl group hover:bg-slate-100 transition-colors">
                              <div className="flex items-center gap-4">
                                <div className="w-10 h-10 rounded-xl bg-white flex items-center justify-center text-sm font-black text-[#D32D3F] shadow-sm">
                                  {grade.score}
                                </div>
                                <span className="font-bold text-slate-700">{grade.subject}</span>
                              </div>
                              <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">{grade.teacherName}</span>
                            </div>
                          ))}
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="p-20 text-center bg-white rounded-[3rem] border-2 border-dashed border-slate-200">
            <History className="w-16 h-16 text-slate-200 mx-auto mb-4" />
            <p className="text-slate-400 font-bold">Aucun relevé de notes disponible pour le moment.</p>
          </div>
        )}
      </div>
    </AppLayout>
  );
}

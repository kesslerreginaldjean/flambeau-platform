import { useEffect, useState } from 'react';
import Head from 'next/head';
import { useRouter } from 'next/router';
import AppLayout from '@/components/layout/AppLayout';
import { STUDENT_NAV_ITEMS } from '@/constants/navigation';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
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

      <div className="max-w-5xl mx-auto">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8 gap-4">
          <div>
            <h2 className="text-ink flex items-center gap-3">
              <GraduationCap className="w-8 h-8 text-accent" />
              Mon Relevé de Notes
            </h2>
            <p className="mono text-xs uppercase tracking-widest text-soft mt-2">Historique complet de tes performances académiques au Flambeau.</p>
          </div>
          <button className="btn-accent gap-2">
            <Download className="w-4 h-4" />
            Télécharger Bulletin (PDF)
          </button>
        </div>

        {loading ? (
          <div className="p-20 text-center mono text-sm uppercase tracking-widest text-soft">Récupération de ton dossier académique...</div>
        ) : Object.keys(groupedGrades).length > 0 ? (
          <div className="space-y-12">
            {Object.entries(groupedGrades).map(([year, terms]: [string, any]) => (
              <div key={year} className="space-y-6">
                <div className="flex items-center gap-4">
                  <div className="h-px flex-1 bg-line"></div>
                  <span className="mono text-xs uppercase tracking-widest text-ink bg-ink text-paper px-4 py-2">
                    Année Scolaire {year}
                  </span>
                  <div className="h-px flex-1 bg-line"></div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {Object.entries(terms).map(([term, termGrades]: [string, any]) => (
                    <Card key={term} className="border border-line">
                      <CardHeader className="p-6 pb-0 flex flex-row items-center justify-between">
                        <CardTitle className="text-ink mono text-sm uppercase tracking-widest">{term}</CardTitle>
                        <span className="mono text-xs uppercase tracking-widest text-accent">
                          Moy: {(termGrades.reduce((acc: number, g: any) => acc + g.score, 0) / termGrades.length).toFixed(1)}
                        </span>
                      </CardHeader>
                      <CardContent className="p-6">
                        <div className="space-y-px">
                          {termGrades.map((grade: any) => (
                            <div key={grade.id} className="flex items-center justify-between py-3 border-b border-line">
                              <div className="flex items-center gap-4">
                                <span className="numeral text-lg text-accent w-10">{grade.score}</span>
                                <span className="text-sm font-medium text-ink">{grade.subject}</span>
                              </div>
                              <span className="mono text-xs uppercase tracking-widest text-soft">{grade.teacherName}</span>
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
          <div className="p-20 text-center border border-line">
            <History className="w-16 h-16 text-line mx-auto mb-4" />
            <p className="mono text-xs uppercase tracking-widest text-soft">Aucun relevé de notes disponible pour le moment.</p>
          </div>
        )}
      </div>
    </AppLayout>
  );
}

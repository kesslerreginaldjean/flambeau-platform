import { useEffect, useState } from 'react';
import Head from 'next/head';
import { useRouter } from 'next/router';
import AppLayout from '@/components/layout/AppLayout';
import { TEACHER_NAV_ITEMS } from '@/constants/navigation';
import { Card } from "@/components/ui/card";
import {
  Users, BookOpen, CheckSquare, Clock
} from 'lucide-react';


import { authFetch } from "@/lib/authFetch";
export default function TeacherDashboard() {
  const router = useRouter();
  const [data, setData] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchDashboard = async () => {
      try {
        const teacherId = localStorage.getItem('user_id');
        if (teacherId) {
          const response = await authFetch(`/api/teachers/${teacherId}/dashboard`);
          const dashboardData = await response.json();
          setData(dashboardData);
        } else {
          router.push('/login');
        }
      } catch (error) {
        console.error('Error fetching dashboard:', error);
      } finally {
        setLoading(false);
      }
    };
    fetchDashboard();
  }, [router]);

  if (loading) return <div className="p-20 text-center mono text-sm uppercase tracking-widest text-soft animate-pulse">Initialisation de votre espace enseignant...</div>;
  if (!data) return <div className="p-20 text-center mono text-sm uppercase tracking-widest text-accent">Erreur : Profil enseignant introuvable.</div>;

  return (
    <AppLayout navItems={TEACHER_NAV_ITEMS} userName={`${data.profile.firstName} ${data.profile.lastName}`} userRoleLabel={`Professeur - ${data.profile.teacher?.subject || 'Matière'}`}>
      <Head>
        <title>Dashboard Enseignant | Le Flambeau</title>
      </Head>

      <div className="mb-8 border-b border-line pb-6">
        <p className="kicker mb-2">Espace Enseignant</p>
        <h1 className="text-3xl md:text-4xl font-semibold text-ink tracking-tight">Bonjour, {data.profile.firstName}</h1>
        <p className="text-soft mt-2">Transmettre le savoir, éclairer l'avenir.</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-px bg-line border border-line mb-8">
        <div className="bg-paper p-6">
          <div className="flex justify-between items-start mb-6">
            <div className="w-10 h-10 border border-line flex items-center justify-center text-ink">
              <Users className="w-5 h-5" />
            </div>
            <span className="mono text-xs uppercase tracking-widest text-soft">Classes</span>
          </div>
          <p className="numeral text-4xl text-ink mb-1">{data.stats.totalStudents}</p>
          <p className="mono text-xs uppercase tracking-widest text-soft">Élèves Totaux</p>
        </div>

        <div className="bg-paper p-6">
          <div className="flex justify-between items-start mb-6">
            <div className="w-10 h-10 border border-line flex items-center justify-center text-ink">
              <Clock className="w-5 h-5" />
            </div>
            <span className="mono text-xs uppercase tracking-widest text-soft">Charge</span>
          </div>
          <p className="numeral text-4xl text-ink mb-1">{data.stats.teachingHours}h</p>
          <p className="mono text-xs uppercase tracking-widest text-soft">Cours / Semaine</p>
        </div>

        <div className="bg-paper p-6">
          <div className="flex justify-between items-start mb-6">
            <div className="w-10 h-10 border border-line flex items-center justify-center text-accent">
              <CheckSquare className="w-5 h-5" />
            </div>
            <span className="mono text-xs uppercase tracking-widest text-soft">Ponctualité</span>
          </div>
          <p className="numeral text-4xl text-ink mb-1">{data.stats.attendanceRate}%</p>
          <p className="mono text-xs uppercase tracking-widest text-soft">Taux de présence</p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
         <Card className="border border-line bg-paper p-6 lg:col-span-2">
            <h2 className="font-semibold text-ink text-xl tracking-tight mb-6 flex items-center gap-3 border-b border-line pb-4">
              <BookOpen className="w-5 h-5 text-accent" />
              Mes Classes & Matières
            </h2>
            <div className="space-y-px bg-line border border-line">
                {data.assignedClasses.length > 0 ? data.assignedClasses.map((cls: any, idx: number) => (
                  <div key={idx} className="flex flex-col md:flex-row items-start md:items-center justify-between p-5 bg-paper gap-4">
                    <div className="flex items-center gap-5">
                      <div className="w-14 h-14 border border-line flex items-center justify-center numeral text-accent text-2xl">
                        {cls.class?.level[0]}
                      </div>
                      <div>
                        <p className="font-semibold text-lg text-ink">{cls.class?.level} {cls.class?.name}</p>
                        <p className="mono text-xs text-soft uppercase tracking-widest mt-1">{cls.subject} • {cls.periods}h / sem</p>
                      </div>
                    </div>
                    <div className="flex gap-2">
                       <button
                        onClick={() => router.push('/dashboard/teacher/attendance')}
                        className="px-5 h-10 border border-line text-ink mono text-xs uppercase tracking-widest hover:bg-panel transition-colors"
                       >
                         Appel
                       </button>
                       <button className="px-5 h-10 bg-ink text-paper mono text-xs uppercase tracking-widest hover:bg-accent transition-colors">
                         Notes
                       </button>
                    </div>
                  </div>
                )) : (
                  <div className="py-20 text-center text-soft bg-paper">
                    Aucune classe assignée pour le moment.
                  </div>
                )}
            </div>
         </Card>

         <Card className="border border-line bg-paper p-6">
            <h2 className="font-semibold text-ink text-xl tracking-tight mb-6 border-b border-line pb-4">Dernières Annonces</h2>
            <div className="space-y-px bg-line border border-line">
                {data.announcements.length > 0 ? data.announcements.slice(0, 3).map((ann: any, i: number) => (
                   <div key={i} className="p-5 bg-paper border-l-2 border-accent hover:bg-panel transition-colors cursor-pointer">
                      <p className="mono text-xs text-accent uppercase tracking-widest mb-2">{ann.type || 'Information'}</p>
                      <p className="text-sm font-semibold text-ink mb-1">{ann.title}</p>
                      <p className="text-xs text-soft line-clamp-3 leading-relaxed">{ann.content}</p>
                   </div>
                )) : (
                  <div className="py-20 text-center text-soft bg-paper">
                    Aucune nouvelle annonce.
                  </div>
                )}
            </div>
         </Card>
      </div>
    </AppLayout>
  );
}

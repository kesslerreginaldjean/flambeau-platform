import { useEffect, useState } from 'react';
import Head from 'next/head';
import { useRouter } from 'next/router';
import Link from 'next/link';
import AppLayout from '@/components/layout/AppLayout';
import { STUDENT_NAV_ITEMS } from '@/constants/navigation';
import {
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer
} from 'recharts';

import { authFetch } from "@/lib/authFetch";
export default function StudentDashboard() {
  const router = useRouter();
  const [data, setData] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchDashboard = async () => {
      try {
        const studentId = localStorage.getItem('user_id');
        if (studentId) {
          const response = await authFetch(`/api/students/${studentId}/dashboard`);
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

  if (loading) return <div className="p-20 text-center mono text-sm uppercase tracking-widest text-soft">Accès à ton espace élève...</div>;
  if (!data) return <div className="p-20 text-center mono text-sm uppercase tracking-widest text-accent">Erreur : Profil introuvable.</div>;

  const currentClass = data.enrollment?.class;
  const averageGrade = data.recentGrades.length > 0
    ? (data.recentGrades.reduce((acc: number, g: any) => acc + g.score, 0) / data.recentGrades.length).toFixed(1)
    : '0';

  return (
    <AppLayout navItems={STUDENT_NAV_ITEMS} userName={`${data.profile.firstName} ${data.profile.lastName}`} userRoleLabel={`Étudiant - ${currentClass?.level || 'N/A'}`}>
      <Head>
        <title>Mon Dashboard | Le Flambeau</title>
      </Head>

      <div className="mb-8">
        <h2 className="text-ink">Bonjour, {data.profile.firstName}</h2>
        <p className="mono text-xs uppercase tracking-widest text-soft mt-2">
          Classe : <span className="text-accent">{currentClass?.level} {currentClass?.name}</span> · Année {data.enrollment?.academicYear?.name}
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-px bg-line border border-line mb-8">
        <div className="bg-ink text-paper p-6">
          <div className="flex justify-between items-start mb-6">
            <p className="mono text-xs uppercase tracking-widest text-paper/60">Excellence</p>
          </div>
          <p className="numeral text-5xl">{averageGrade}<span className="text-2xl text-paper/50">/100</span></p>
          <p className="mono text-xs uppercase tracking-widest text-paper/60 mt-3">Moyenne Récente</p>
        </div>

        <div className="bg-paper p-6">
          <div className="flex justify-between items-start mb-6">
            <p className="mono text-xs uppercase tracking-widest text-soft">Position</p>
          </div>
          <p className="numeral text-5xl text-ink">--</p>
          <p className="mono text-xs uppercase tracking-widest text-soft mt-3">Rang Provisoire</p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-px bg-line border border-line">
        <div className="lg:col-span-2 bg-paper p-6 h-[400px]">
          <div className="flex justify-between items-center mb-8">
            <h3 className="text-ink">Courbe de Performance</h3>
            <Link href="/dashboard/student/grades" className="mono text-xs uppercase tracking-widest text-accent hover:text-accent-ink">Voir tout le relevé</Link>
          </div>
          <ResponsiveContainer width="100%" height="80%">
            <BarChart data={data.recentGrades.slice(0, 5)} barSize={50}>
              <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#e6e7e9" />
              <XAxis dataKey="subject" axisLine={false} tickLine={false} tick={{ fill: '#5b6066', fontSize: 10 }} />
              <YAxis axisLine={false} tickLine={false} tick={{ fill: '#5b6066', fontSize: 10 }} domain={[0, 100]} />
              <Tooltip
                cursor={{ fill: '#f4f5f6' }}
                contentStyle={{ borderRadius: '0', border: '1px solid #e6e7e9', boxShadow: 'none', padding: '12px' }}
              />
              <Bar dataKey="score" fill="#C8102E" />
            </BarChart>
          </ResponsiveContainer>
        </div>

        <div className="bg-paper p-6">
          <h3 className="text-ink mb-8">Dernières Alertes</h3>
          <div className="space-y-px">
            {data.announcements.length > 0 ? data.announcements.slice(0, 3).map((ann: any, i: number) => (
              <div key={i} className="p-4 border-l-2 border-accent bg-panel">
                <p className="mono text-xs uppercase tracking-widest text-accent mb-1">{ann.type || 'Annonce'}</p>
                <p className="text-sm font-medium text-ink mb-1">{ann.title}</p>
                <p className="text-xs text-soft line-clamp-2">{ann.content}</p>
              </div>
            )) : (
              <div className="py-10 text-center mono text-xs uppercase tracking-widest text-soft">
                Aucune nouvelle annonce.
              </div>
            )}
          </div>
        </div>
      </div>
    </AppLayout>
  );
}

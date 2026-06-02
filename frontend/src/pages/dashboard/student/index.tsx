import { useEffect, useState } from 'react';
import Head from 'next/head';
import { useRouter } from 'next/router';
import Link from 'next/link';
import AppLayout from '@/components/layout/AppLayout';
import { STUDENT_NAV_ITEMS } from '@/constants/navigation';
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { 
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer 
} from 'recharts';
import { 
  ArrowUpRight, MoreHorizontal
} from 'lucide-react';

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

  if (loading) return <div className="p-20 text-center font-bold text-slate-400">Accès à ton espace élève...</div>;
  if (!data) return <div className="p-20 text-center text-red-500 font-bold">Erreur : Profil introuvable.</div>;

  const currentClass = data.enrollment?.class;
  const averageGrade = data.recentGrades.length > 0 
    ? (data.recentGrades.reduce((acc: number, g: any) => acc + g.score, 0) / data.recentGrades.length).toFixed(1)
    : '0';

  return (
    <AppLayout navItems={STUDENT_NAV_ITEMS} userName={`${data.profile.firstName} ${data.profile.lastName}`} userRoleLabel={`Étudiant - ${currentClass?.level || 'N/A'}`}>
      <Head>
        <title>Mon Dashboard | Le Flambeau</title>
      </Head>

      <div className="mb-6 mt-4">
        <h1 className="text-2xl font-black text-slate-900 tracking-tight">Bonjour, {data.profile.firstName} 👋</h1>
        <p className="text-slate-500 text-sm font-medium">Classe : <span className="text-[#D32D3F] font-bold">{currentClass?.level} {currentClass?.name}</span> • Année {data.enrollment?.academicYear?.name}</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-6">
        <Card className="border-none shadow-sm bg-gradient-to-br from-[#4F46E5] to-[#3730A3] text-white rounded-[2rem] overflow-hidden">
          <CardContent className="p-6">
            <div className="flex justify-between items-start mb-4">
              <Badge className="bg-white/20 text-white border-none font-bold uppercase tracking-widest text-[10px]">Excellence</Badge>
              <ArrowUpRight className="text-white/50 w-5 h-5" />
            </div>
            <h3 className="text-4xl font-black mb-1 tracking-tighter">{averageGrade}/100</h3>
            <p className="text-xs text-white/70 font-bold uppercase tracking-widest">Moyenne Récente</p>
          </CardContent>
        </Card>

        <Card className="border-none shadow-sm bg-white rounded-[2rem] overflow-hidden border border-slate-100">
          <CardContent className="p-6">
             <div className="flex justify-between items-start mb-4">
              <Badge className="bg-amber-100 text-amber-700 border-none font-bold uppercase tracking-widest text-[10px]">Position</Badge>
              <MoreHorizontal className="text-slate-300 w-5 h-5" />
            </div>
            <h3 className="text-4xl font-black text-slate-900 mb-1 tracking-tighter">--</h3>
            <p className="text-xs text-slate-400 font-bold uppercase tracking-widest">Rang Provisoire</p>
          </CardContent>
        </Card>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <Card className="border-none shadow-xl rounded-[2.5rem] lg:col-span-2 bg-white">
          <CardContent className="p-8 h-[400px]">
             <div className="flex justify-between items-center mb-8">
               <h3 className="font-black text-slate-900 text-xl tracking-tight">Courbe de Performance</h3>
               <Link href="/dashboard/student/grades" className="text-[10px] font-black uppercase tracking-widest text-[#D32D3F] hover:underline">Voir tout le relevé</Link>
             </div>
             <ResponsiveContainer width="100%" height="80%">
                <BarChart data={data.recentGrades.slice(0, 5)} barSize={50}>
                  <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#F1F5F9" />
                  <XAxis dataKey="subject" axisLine={false} tickLine={false} tick={{ fill: '#94A3B8', fontSize: 10, fontWeight: 700 }} />
                  <YAxis axisLine={false} tickLine={false} tick={{ fill: '#94A3B8', fontSize: 10, fontWeight: 700 }} domain={[0, 100]} />
                  <Tooltip 
                    cursor={{fill: '#F8FAFC'}} 
                    contentStyle={{ borderRadius: '20px', border: 'none', boxShadow: '0 20px 25px -5px rgb(0 0 0 / 0.1)', padding: '15px' }} 
                  />
                  <Bar dataKey="score" fill="#D32D3F" radius={[12, 12, 12, 12]} />
                </BarChart>
             </ResponsiveContainer>
          </CardContent>
        </Card>

        <Card className="border-none shadow-xl rounded-[2.5rem] bg-white">
          <CardContent className="p-8">
             <h3 className="font-black text-slate-900 text-xl tracking-tight mb-8">Dernières Alertes</h3>
             <div className="space-y-4">
                {data.announcements.length > 0 ? data.announcements.slice(0, 3).map((ann: any, i: number) => (
                  <div key={i} className="p-5 bg-slate-50 rounded-3xl border-l-4 border-[#D32D3F] hover:bg-slate-100 transition-colors">
                     <p className="text-xs font-black text-[#D32D3F] uppercase tracking-widest mb-1">{ann.type || 'Annonce'}</p>
                     <p className="text-sm font-black text-slate-900 mb-1">{ann.title}</p>
                     <p className="text-xs text-slate-500 line-clamp-2 font-medium">{ann.content}</p>
                  </div>
                )) : (
                  <div className="py-10 text-center text-slate-400 font-bold italic">
                    Aucune nouvelle annonce.
                  </div>
                )}
             </div>
          </CardContent>
        </Card>
      </div>
    </AppLayout>
  );
}

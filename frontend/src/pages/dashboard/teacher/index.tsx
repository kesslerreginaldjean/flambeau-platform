import React, { useEffect, useState } from 'react';
import Head from 'next/head';
import { useRouter } from 'next/router';
import AppLayout from '@/components/layout/AppLayout';
import { TEACHER_NAV_ITEMS } from '@/constants/navigation';
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { 
  Users, BookOpen, CheckSquare, Clock
} from 'lucide-react';


export default function TeacherDashboard() {
  const router = useRouter();
  const [data, setData] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchDashboard = async () => {
      try {
        const teacherId = localStorage.getItem('user_id');
        if (teacherId) {
          const response = await fetch(`http://localhost:5000/api/teachers/${teacherId}/dashboard`);
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

  if (loading) return <div className="p-20 text-center font-bold text-slate-400 animate-pulse text-xl uppercase tracking-widest">Initialisation de votre espace enseignant...</div>;
  if (!data) return <div className="p-20 text-center text-red-500 font-bold">Erreur : Profil enseignant introuvable.</div>;

  return (
    <AppLayout navItems={TEACHER_NAV_ITEMS} userName={`${data.profile.firstName} ${data.profile.lastName}`} userRoleLabel={`Professeur - ${data.profile.teacher?.subject || 'Matière'}`}>
      <Head>
        <title>Dashboard Enseignant | Le Flambeau</title>
      </Head>

      <div className="mb-8 mt-4">
        <h1 className="text-4xl font-black text-slate-900 tracking-tight">Bonjour, {data.profile.firstName} 👋</h1>
        <p className="text-slate-500 font-medium text-lg mt-2 italic">"Transmettre le savoir, éclairer l'avenir."</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <Card className="border-none shadow-xl bg-white rounded-[2.5rem] overflow-hidden group hover:scale-[1.02] transition-transform duration-300">
          <CardContent className="p-8">
            <div className="flex justify-between items-start mb-6">
              <div className="w-14 h-14 rounded-2xl bg-indigo-50 flex items-center justify-center text-indigo-600 shadow-inner">
                <Users className="w-7 h-7" />
              </div>
              <Badge className="bg-indigo-100 text-indigo-700 border-none font-black text-[10px] uppercase tracking-widest px-3 py-1">Classes</Badge>
            </div>
            <h3 className="text-4xl font-black text-slate-900 mb-1 tracking-tighter">{data.stats.totalStudents}</h3>
            <p className="text-xs text-slate-400 font-bold uppercase tracking-widest">Élèves Totaux</p>
          </CardContent>
        </Card>

        <Card className="border-none shadow-xl bg-white rounded-[2.5rem] overflow-hidden group hover:scale-[1.02] transition-transform duration-300">
          <CardContent className="p-8">
            <div className="flex justify-between items-start mb-6">
              <div className="w-14 h-14 rounded-2xl bg-[#FEF3C7] flex items-center justify-center text-amber-600 shadow-inner">
                <Clock className="w-7 h-7" />
              </div>
              <Badge className="bg-amber-100 text-amber-700 border-none font-black text-[10px] uppercase tracking-widest px-3 py-1">Charge</Badge>
            </div>
            <h3 className="text-4xl font-black text-slate-900 mb-1 tracking-tighter">{data.stats.teachingHours}h</h3>
            <p className="text-xs text-slate-400 font-bold uppercase tracking-widest">Cours / Semaine</p>
          </CardContent>
        </Card>

        <Card className="border-none shadow-xl bg-white rounded-[2.5rem] overflow-hidden group hover:scale-[1.02] transition-transform duration-300">
          <CardContent className="p-8">
            <div className="flex justify-between items-start mb-6">
              <div className="w-14 h-14 rounded-2xl bg-red-50 flex items-center justify-center text-[#D32D3F] shadow-inner">
                <CheckSquare className="w-7 h-7" />
              </div>
              <Badge className="bg-red-100 text-[#D32D3F] border-none font-black text-[10px] uppercase tracking-widest px-3 py-1">Ponctualité</Badge>
            </div>
            <h3 className="text-4xl font-black text-slate-900 mb-1 tracking-tighter">{data.stats.attendanceRate}%</h3>
            <p className="text-xs text-slate-400 font-bold uppercase tracking-widest">Taux de présence</p>
          </CardContent>
        </Card>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
         <Card className="border-none shadow-2xl rounded-[3rem] p-10 lg:col-span-2 bg-white">
            <h3 className="font-black text-slate-900 text-2xl tracking-tight mb-8 flex items-center gap-3">
              <BookOpen className="w-7 h-7 text-[#D32D3F]" />
              Mes Classes & Matières
            </h3>
            <div className="space-y-4">
                {data.assignedClasses.length > 0 ? data.assignedClasses.map((cls: any, idx: number) => (
                  <div key={idx} className="flex items-center justify-between p-6 bg-slate-50 rounded-[2rem] border border-slate-100 group hover:bg-white hover:shadow-xl transition-all duration-300">
                    <div className="flex items-center gap-6">
                      <div className="w-16 h-16 rounded-[1.5rem] bg-white shadow-inner flex items-center justify-center font-black text-[#D32D3F] text-2xl group-hover:bg-[#D32D3F] group-hover:text-white transition-all">
                        {cls.class?.level[0]}
                      </div>
                      <div>
                        <p className="font-black text-xl text-slate-900">{cls.class?.level} {cls.class?.name}</p>
                        <p className="text-xs font-bold text-slate-400 uppercase tracking-widest">{cls.subject} • {cls.periods}h / sem</p>
                      </div>
                    </div>
                    <div className="flex gap-2">
                       <button 
                        onClick={() => router.push('/dashboard/teacher/attendance')}
                        className="px-6 py-3 bg-white text-slate-900 rounded-xl font-black text-[10px] uppercase tracking-widest shadow-sm hover:shadow-md transition-all border border-slate-100"
                       >
                         Appel
                       </button>
                       <button className="px-6 py-3 bg-slate-900 text-white rounded-xl font-black text-[10px] uppercase tracking-widest shadow-xl hover:bg-[#D32D3F] transition-all">
                         Notes
                       </button>
                    </div>
                  </div>
                )) : (
                  <div className="py-20 text-center text-slate-300 font-bold italic bg-slate-50 rounded-[2rem]">
                    Aucune classe assignée pour le moment.
                  </div>
                )}
            </div>
         </Card>

         <Card className="border-none shadow-2xl rounded-[3rem] p-10 bg-white">
            <h3 className="font-black text-slate-900 text-2xl tracking-tight mb-8">Dernières Annonces</h3>
            <div className="space-y-6">
                {data.announcements.length > 0 ? data.announcements.slice(0, 3).map((ann: any, i: number) => (
                   <div key={i} className="p-6 bg-slate-50 rounded-[2rem] border-l-4 border-[#D32D3F] hover:bg-slate-100 transition-all cursor-pointer">
                      <p className="text-[10px] font-black text-[#D32D3F] uppercase tracking-widest mb-2">{ann.type || 'Information'}</p>
                      <p className="text-sm font-black text-slate-900 mb-1">{ann.title}</p>
                      <p className="text-xs text-slate-500 line-clamp-3 font-medium leading-relaxed">{ann.content}</p>
                   </div>
                )) : (
                  <div className="py-20 text-center text-slate-300 font-bold italic">
                    Aucune nouvelle annonce.
                  </div>
                )}
            </div>
         </Card>
      </div>
    </AppLayout>
  );
}

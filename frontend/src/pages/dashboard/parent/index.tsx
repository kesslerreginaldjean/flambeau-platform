import { useEffect, useState } from 'react';
import Head from 'next/head';
import { useRouter } from 'next/router';
import AppLayout from '@/components/layout/AppLayout';
import { PARENT_NAV_ITEMS } from '@/constants/navigation';
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { 
  Users, BadgeDollarSign, Bell, ArrowUpRight
} from 'lucide-react';

import { authFetch } from "@/lib/authFetch";
export default function ParentDashboard() {
  const router = useRouter();
  const [data, setData] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchDashboard = async () => {
      try {
        const parentId = localStorage.getItem('user_id');
        if (parentId) {
          const response = await authFetch(`/api/parents/${parentId}/dashboard`);
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

  if (loading) return <div className="p-20 text-center font-bold text-slate-400 animate-pulse text-xl uppercase tracking-widest">Initialisation de votre espace parent...</div>;
  if (!data) return <div className="p-20 text-center text-red-500 font-bold">Erreur : Impossible de charger votre profil parent.</div>;

  return (
    <AppLayout navItems={PARENT_NAV_ITEMS} userName={`${data.profile.firstName} ${data.profile.lastName}`} userRoleLabel="Parent d'élève">
      <Head>
        <title>Espace Parent | Le Flambeau</title>
      </Head>

      <div className="mb-8 mt-4">
        <h1 className="text-4xl font-black text-slate-900 tracking-tight">Bonjour, M. {data.profile.lastName} 👋</h1>
        <p className="text-slate-500 font-medium text-lg mt-2 italic">"La réussite de vos enfants commence ici."</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <Card className="border-none shadow-xl bg-white rounded-[2.5rem] overflow-hidden group hover:scale-[1.02] transition-transform duration-300">
          <CardContent className="p-8">
            <div className="flex justify-between items-start mb-6">
              <div className="w-14 h-14 rounded-2xl bg-indigo-50 flex items-center justify-center text-indigo-600 shadow-inner">
                <Users className="w-7 h-7" />
              </div>
              <Badge className="bg-indigo-100 text-indigo-700 border-none font-black text-[10px] uppercase tracking-widest px-3 py-1">Famille</Badge>
            </div>
            <h3 className="text-4xl font-black text-slate-900 mb-1 tracking-tighter">{data.children.length}</h3>
            <p className="text-xs text-slate-400 font-bold uppercase tracking-widest">Enfants Inscrits</p>
          </CardContent>
        </Card>

        <Card className="border-none shadow-xl bg-white rounded-[2.5rem] overflow-hidden group hover:scale-[1.02] transition-transform duration-300">
          <CardContent className="p-8">
            <div className="flex justify-between items-start mb-6">
              <div className="w-14 h-14 rounded-2xl bg-[#FFF8E7] flex items-center justify-center text-[#D32D3F] shadow-inner">
                <BadgeDollarSign className="w-7 h-7" />
              </div>
              <Badge className="bg-red-50 text-[#D32D3F] border-none font-black text-[10px] uppercase tracking-widest px-3 py-1">Finance</Badge>
            </div>
            <h3 className="text-4xl font-black text-slate-900 mb-1 tracking-tighter">0<span className="text-sm ml-1 text-slate-400">HTG</span></h3>
            <p className="text-xs text-slate-400 font-bold uppercase tracking-widest">Solde Scolarité</p>
          </CardContent>
        </Card>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
         <Card className="border-none shadow-2xl rounded-[3rem] p-10 lg:col-span-2 bg-white">
            <div className="flex justify-between items-center mb-10">
              <h3 className="font-black text-slate-900 text-2xl tracking-tight">Suivi Scolaire</h3>
              <div className="flex gap-2">
                <div className="w-3 h-3 rounded-full bg-green-500 animate-pulse"></div>
                <span className="text-[10px] font-black uppercase tracking-widest text-slate-400">Temps Réel</span>
              </div>
            </div>
            <div className="space-y-6">
                {data.children.length > 0 ? data.children.map((child: any, idx: number) => {
                  const currentClass = child.enrollments?.[0]?.class;
                  return (
                    <div key={idx} className="flex flex-col md:flex-row items-center justify-between p-6 bg-slate-50 rounded-[2.5rem] border border-slate-100 gap-6 group hover:bg-white hover:shadow-2xl transition-all duration-500">
                      <div className="flex items-center gap-6">
                        <div className="w-20 h-20 rounded-[2rem] bg-white shadow-xl flex items-center justify-center font-black text-[#D32D3F] text-3xl group-hover:bg-[#D32D3F] group-hover:text-white transition-all duration-300">
                          {child.user.firstName[0]}
                        </div>
                        <div>
                          <p className="font-black text-2xl text-slate-900 tracking-tight">{child.user.firstName} {child.user.lastName}</p>
                          <p className="text-xs font-bold text-slate-400 uppercase tracking-widest mt-1">
                            Classe : <span className="text-slate-900">{currentClass?.level} {currentClass?.name}</span> • Matricule {child.studentNumber}
                          </p>
                        </div>
                      </div>
                      <div className="flex gap-3 w-full md:w-auto">
                        <button className="flex-1 md:flex-none px-6 py-4 bg-white text-slate-900 rounded-[1.5rem] font-black text-[10px] uppercase tracking-widest shadow-sm hover:shadow-xl transition-all border border-slate-100 active:scale-95">
                          Bulletin
                        </button>
                        <button 
                          onClick={() => router.push(`/dashboard/parent/file?childId=${child.id}`)}
                          className="flex-1 md:flex-none px-8 py-4 bg-slate-900 text-white rounded-[1.5rem] font-black text-[10px] uppercase tracking-widest shadow-2xl hover:bg-[#D32D3F] transition-all active:scale-95"
                        >
                          Dossier Complet
                        </button>
                      </div>
                    </div>
                  );
                }) : (
                  <div className="py-20 text-center text-slate-400 font-bold italic bg-slate-50 rounded-[2.5rem]">
                    Aucun enfant lié à ce compte. 
                  </div>
                )}
            </div>
         </Card>

         <Card className="border-none shadow-2xl rounded-[3rem] p-10 bg-white">
            <h3 className="font-black text-slate-900 text-2xl tracking-tight mb-8 flex items-center gap-3">
              <Bell className="w-6 h-6 text-[#D32D3F]" />
              Notifications
            </h3>
            <div className="space-y-6">
                {data.announcements.length > 0 ? data.announcements.slice(0, 3).map((ann: any, i: number) => (
                   <div key={i} className="p-6 bg-slate-50 rounded-[2rem] border-l-4 border-[#D32D3F] hover:bg-slate-100 transition-all cursor-pointer group">
                      <p className="text-[10px] font-black text-[#D32D3F] uppercase tracking-widest mb-2 flex justify-between">
                        {ann.type || 'Scolarité'}
                        <ArrowUpRight className="w-3 h-3 opacity-0 group-hover:opacity-100 transition-opacity" />
                      </p>
                      <p className="text-sm font-black text-slate-900 mb-1">{ann.title}</p>
                      <p className="text-xs text-slate-500 line-clamp-3 font-medium leading-relaxed">{ann.content}</p>
                   </div>
                )) : (
                  <div className="py-20 text-center text-slate-300 font-bold italic">
                    Aucune nouvelle notification.
                  </div>
                )}
            </div>
         </Card>
      </div>
    </AppLayout>
  );
}

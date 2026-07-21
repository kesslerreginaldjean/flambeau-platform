import { useEffect, useState } from 'react';
import Head from 'next/head';
import { useRouter } from 'next/router';
import AppLayout from '@/components/layout/AppLayout';
import { PARENT_NAV_ITEMS } from '@/constants/navigation';
import { Card } from "@/components/ui/card";
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

  if (loading) return <div className="p-20 text-center mono text-sm uppercase tracking-widest text-soft animate-pulse">Initialisation de votre espace parent...</div>;
  if (!data) return <div className="p-20 text-center mono text-sm uppercase tracking-widest text-accent">Erreur : Impossible de charger votre profil parent.</div>;

  return (
    <AppLayout navItems={PARENT_NAV_ITEMS} userName={`${data.profile.firstName} ${data.profile.lastName}`} userRoleLabel="Parent d'élève">
      <Head>
        <title>Espace Parent | Le Flambeau</title>
      </Head>

      <div className="mb-8 border-b border-line pb-6">
        <p className="kicker mb-2">Espace Parent</p>
        <h1 className="text-3xl md:text-4xl font-semibold text-ink tracking-tight">Bonjour, M. {data.profile.lastName}</h1>
        <p className="text-soft mt-2">La réussite de vos enfants commence ici.</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-px bg-line border border-line mb-8">
        <div className="bg-paper p-6">
          <div className="flex justify-between items-start mb-6">
            <div className="w-10 h-10 border border-line flex items-center justify-center text-ink">
              <Users className="w-5 h-5" />
            </div>
            <span className="mono text-xs uppercase tracking-widest text-soft">Famille</span>
          </div>
          <p className="numeral text-4xl text-ink mb-1">{data.children.length}</p>
          <p className="mono text-xs uppercase tracking-widest text-soft">Enfants Inscrits</p>
        </div>

        <div className="bg-paper p-6">
          <div className="flex justify-between items-start mb-6">
            <div className="w-10 h-10 border border-line flex items-center justify-center text-accent">
              <BadgeDollarSign className="w-5 h-5" />
            </div>
            <span className="mono text-xs uppercase tracking-widest text-soft">Finance</span>
          </div>
          <p className="numeral text-4xl text-ink mb-1">0<span className="text-sm ml-1 text-soft">HTG</span></p>
          <p className="mono text-xs uppercase tracking-widest text-soft">Solde Scolarité</p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
         <Card className="border border-line bg-paper p-6 lg:col-span-2">
            <div className="flex justify-between items-center mb-8 border-b border-line pb-4">
              <h2 className="font-semibold text-ink text-xl tracking-tight">Suivi Scolaire</h2>
              <span className="mono text-xs uppercase tracking-widest text-soft">Temps Réel</span>
            </div>
            <div className="space-y-px bg-line border border-line">
                {data.children.length > 0 ? data.children.map((child: any, idx: number) => {
                  const currentClass = child.enrollments?.[0]?.class;
                  return (
                    <div key={idx} className="flex flex-col md:flex-row items-start md:items-center justify-between p-5 bg-paper gap-4">
                      <div className="flex items-center gap-5">
                        <div className="w-14 h-14 border border-line flex items-center justify-center numeral text-accent text-2xl">
                          {child.user.firstName[0]}
                        </div>
                        <div>
                          <p className="font-semibold text-lg text-ink tracking-tight">{child.user.firstName} {child.user.lastName}</p>
                          <p className="mono text-xs uppercase tracking-widest text-soft mt-1">
                            Classe : <span className="text-ink">{currentClass?.level} {currentClass?.name}</span> • Matricule {child.studentNumber}
                          </p>
                        </div>
                      </div>
                      <div className="flex gap-2 w-full md:w-auto">
                        <button className="flex-1 md:flex-none px-5 h-10 border border-line text-ink mono text-xs uppercase tracking-widest hover:bg-panel transition-colors">
                          Bulletin
                        </button>
                        <button
                          onClick={() => router.push(`/dashboard/parent/file?childId=${child.id}`)}
                          className="flex-1 md:flex-none px-6 h-10 bg-ink text-paper mono text-xs uppercase tracking-widest hover:bg-accent transition-colors"
                        >
                          Dossier Complet
                        </button>
                      </div>
                    </div>
                  );
                }) : (
                  <div className="py-20 text-center text-soft bg-paper">
                    Aucun enfant lié à ce compte.
                  </div>
                )}
            </div>
         </Card>

         <Card className="border border-line bg-paper p-6">
            <h2 className="font-semibold text-ink text-xl tracking-tight mb-6 flex items-center gap-3 border-b border-line pb-4">
              <Bell className="w-5 h-5 text-accent" />
              Notifications
            </h2>
            <div className="space-y-px bg-line border border-line">
                {data.announcements.length > 0 ? data.announcements.slice(0, 3).map((ann: any, i: number) => (
                   <div key={i} className="p-5 bg-paper border-l-2 border-accent hover:bg-panel transition-colors cursor-pointer group">
                      <p className="mono text-xs text-accent uppercase tracking-widest mb-2 flex justify-between">
                        {ann.type || 'Scolarité'}
                        <ArrowUpRight className="w-3 h-3 opacity-0 group-hover:opacity-100 transition-opacity" />
                      </p>
                      <p className="text-sm font-semibold text-ink mb-1">{ann.title}</p>
                      <p className="text-xs text-soft line-clamp-3 leading-relaxed">{ann.content}</p>
                   </div>
                )) : (
                   <div className="py-20 text-center text-soft bg-paper">
                    Aucune nouvelle notification.
                  </div>
                )}
            </div>
         </Card>
      </div>
    </AppLayout>
  );
}

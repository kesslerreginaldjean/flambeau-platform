import { useState, useEffect } from 'react';
import Head from 'next/head';
import AppLayout from '@/components/layout/AppLayout';
import { ADMIN_NAV_ITEMS, STUDENT_NAV_ITEMS, TEACHER_NAV_ITEMS, PARENT_NAV_ITEMS } from '@/constants/navigation';
import { Badge } from "@/components/ui/badge";
import { Calendar as CalendarIcon, Info, AlertTriangle, Megaphone } from 'lucide-react';

import { authFetch } from "@/lib/authFetch";
export default function SharedAnnouncements() {
  const [announcements, setAnnouncements] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  const [userRole, setUserRole] = useState<string>('student');

  useEffect(() => {
    const role = localStorage.getItem('user_role') || 'student';
    setUserRole(role);
    
    const fetchAnnouncements = async () => {
      try {
        const response = await authFetch('/api/admin/announcements');
        const data = await response.json();
        // Optionnel: filtrer par cible selon le rôle de l'utilisateur
        setAnnouncements(data);
      } catch (error) {
        console.error('Failed to fetch announcements');
      } finally {
        setLoading(false);
      }
    };
    fetchAnnouncements();
  }, []);

  const navItems = userRole === 'admin' ? ADMIN_NAV_ITEMS : 
                   userRole === 'teacher' ? TEACHER_NAV_ITEMS : 
                   userRole === 'parent' ? PARENT_NAV_ITEMS : STUDENT_NAV_ITEMS;

  return (
    <AppLayout navItems={navItems} userName="Utilisateur Flambeau" userRoleLabel={userRole}>
      <Head>
        <title>Annonces & Communications | CLF</title>
      </Head>

      <div className="max-w-5xl mx-auto">
        <div className="mb-10">
          <p className="kicker mb-2">Communications</p>
          <h1 className="text-4xl font-semibold text-ink tracking-tight">Centre de Communication</h1>
          <p className="text-soft mt-2">Retrouvez toutes les annonces officielles du Collège Le Flambeau.</p>
        </div>

        <div className="border-t border-line">
           {loading ? (
             <div className="divide-y divide-line">
                {[1, 2, 3].map(i => <div key={i} className="h-32 bg-panel animate-pulse"></div>)}
             </div>
           ) : announcements.length === 0 ? (
             <div className="p-20 text-center border-b border-line bg-paper">
                <Megaphone className="w-12 h-12 text-line mx-auto mb-4" />
                <p className="mono text-xs text-soft uppercase tracking-widest">Aucune annonce pour le moment</p>
             </div>
           ) : announcements.map((ann) => (
             <article key={ann.id} className="border-b border-line bg-paper py-8 flex flex-col md:flex-row gap-6 items-start">
                <div className={`w-12 h-12 border flex items-center justify-center flex-shrink-0 ${
                   ann.type === 'warning' ? 'border-accent text-accent' : 'border-line text-soft'
                }`}>
                   {ann.type === 'warning' ? <AlertTriangle className="w-6 h-6" /> :
                    ann.type === 'event' ? <CalendarIcon className="w-6 h-6" /> :
                    <Info className="w-6 h-6" />}
                </div>

                <div className="flex-1">
                   <div className="flex flex-wrap items-center gap-3 mb-3">
                      <Badge className="bg-paper border border-line text-soft mono uppercase tracking-widest text-[10px] px-3 py-1">
                         {ann.type}
                      </Badge>
                      <span className="mono text-xs text-soft">Publié le {new Date(ann.createdAt).toLocaleDateString('fr-FR', { day: 'numeric', month: 'long', year: 'numeric' })}</span>
                   </div>

                   <h2 className="text-2xl font-semibold text-ink mb-3 tracking-tight leading-tight">{ann.title}</h2>
                   <p className="text-soft leading-relaxed whitespace-pre-wrap">{ann.content}</p>
                </div>
             </article>
           ))}
        </div>
      </div>
    </AppLayout>
  );
}

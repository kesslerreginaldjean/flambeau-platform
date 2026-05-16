import React, { useState, useEffect } from 'react';
import Head from 'next/head';
import AppLayout from '@/components/layout/AppLayout';
import { ADMIN_NAV_ITEMS, STUDENT_NAV_ITEMS, TEACHER_NAV_ITEMS, PARENT_NAV_ITEMS } from '@/constants/navigation';
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Bell, Calendar as CalendarIcon, Info, AlertTriangle, Megaphone } from 'lucide-react';

export default function SharedAnnouncements() {
  const [announcements, setAnnouncements] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  const [userRole, setUserRole] = useState<string>('student');

  useEffect(() => {
    const role = localStorage.getItem('user_role') || 'student';
    setUserRole(role);
    
    const fetchAnnouncements = async () => {
      try {
        const response = await fetch('http://localhost:5000/api/admin/announcements');
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

      <div className="p-6 max-w-5xl mx-auto">
        <div className="mb-10 text-center">
          <div className="w-20 h-20 bg-[#FFF8E7] rounded-3xl flex items-center justify-center text-[#D32D3F] mx-auto mb-6 shadow-sm border border-[#FDE68A]">
            <Bell className="w-10 h-10" />
          </div>
          <h1 className="text-4xl font-black text-slate-900 tracking-tight mb-2">Centre de Communication</h1>
          <p className="text-slate-500 font-medium">Retrouvez toutes les annonces officielles du Collège Le Flambeau.</p>
        </div>

        <div className="space-y-8">
           {loading ? (
             <div className="space-y-6">
                {[1, 2, 3].map(i => <div key={i} className="h-40 bg-slate-50 animate-pulse rounded-[3rem]"></div>)}
             </div>
           ) : announcements.length === 0 ? (
             <div className="p-20 text-center bg-white rounded-[3rem] shadow-xl border border-slate-100">
                <Megaphone className="w-16 h-16 text-slate-200 mx-auto mb-4" />
                <p className="text-slate-400 font-bold uppercase tracking-widest">Aucune annonce pour le moment</p>
             </div>
           ) : announcements.map((ann, i) => (
             <Card key={ann.id} className="border-none shadow-2xl rounded-[3rem] bg-white overflow-hidden transition-all hover:scale-[1.01]">
                <div className="p-10 flex flex-col md:flex-row gap-8 items-start">
                   <div className={`w-16 h-16 rounded-[1.5rem] flex items-center justify-center flex-shrink-0 ${
                      ann.type === 'warning' ? 'bg-red-100 text-red-600' :
                      ann.type === 'event' ? 'bg-purple-100 text-purple-600' :
                      'bg-blue-100 text-blue-600'
                   }`}>
                      {ann.type === 'warning' ? <AlertTriangle className="w-8 h-8" /> : 
                       ann.type === 'event' ? <CalendarIcon className="w-8 h-8" /> : 
                       <Info className="w-8 h-8" />}
                   </div>
                   
                   <div className="flex-1">
                      <div className="flex flex-wrap items-center gap-3 mb-4">
                         <Badge className={`${
                            ann.type === 'warning' ? 'bg-red-50 text-red-600' :
                            ann.type === 'event' ? 'bg-purple-50 text-purple-600' :
                            'bg-blue-50 text-blue-600'
                         } border-none font-black uppercase tracking-widest text-[10px] px-4 py-1.5 rounded-full`}>
                            {ann.type}
                         </Badge>
                         <span className="text-xs font-bold text-slate-400 italic">Publié le {new Date(ann.createdAt).toLocaleDateString('fr-FR', { day: 'numeric', month: 'long', year: 'numeric' })}</span>
                      </div>
                      
                      <h2 className="text-2xl font-black text-slate-900 mb-4 tracking-tight leading-tight">{ann.title}</h2>
                      <p className="text-slate-600 font-medium leading-relaxed whitespace-pre-wrap">{ann.content}</p>
                   </div>
                </div>
                <div className="h-2 bg-[#D32D3F]/5"></div>
             </Card>
           ))}
        </div>
      </div>
    </AppLayout>
  );
}

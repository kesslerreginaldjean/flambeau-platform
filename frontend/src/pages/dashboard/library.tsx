import React, { useState, useEffect } from 'react';
import Head from 'next/head';
import AppLayout from '@/components/layout/AppLayout';
import { ADMIN_NAV_ITEMS, STUDENT_NAV_ITEMS, TEACHER_NAV_ITEMS, PARENT_NAV_ITEMS } from '@/constants/navigation';
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Search, Book, Download } from 'lucide-react';

export default function SharedLibrary() {
  const [userRole, setUserRole] = useState<string>('student');

  useEffect(() => {
    const role = localStorage.getItem('user_role') || 'student';
    setUserRole(role);
  }, []);
  
  const navItems = userRole === 'admin' ? ADMIN_NAV_ITEMS : 
                   userRole === 'teacher' ? TEACHER_NAV_ITEMS : 
                   userRole === 'parent' ? PARENT_NAV_ITEMS : STUDENT_NAV_ITEMS;

  const resources = [
    { id: '1', title: 'Manuel de Mathématiques NS4', type: 'PDF', size: '12 MB', category: 'Académique' },
    { id: '2', title: 'Histoire d\'Haïti - Tome 1', type: 'E-Book', size: '8 MB', category: 'Culture' },
    { id: '3', title: 'Guide de Laboratoire Physique', type: 'PDF', size: '5 MB', category: 'Sciences' },
  ];

  return (
    <AppLayout navItems={navItems} userName="Utilisateur Flambeau" userRoleLabel={userRole}>
      <Head>
        <title>Bibliothèque Numérique | CLF</title>
      </Head>

      <div className="p-6">
        <div className="mb-8">
          <h1 className="text-3xl font-extrabold text-slate-900 tracking-tight">Bibliothèque Numérique</h1>
          <p className="text-slate-500 font-medium">Accédez à vos manuels, ressources et lectures recommandées.</p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
          <div className="space-y-4">
             <Card className="border-none shadow-xl rounded-[2.5rem] bg-white p-6">
                <h3 className="text-xs font-black text-slate-400 uppercase tracking-widest mb-4">Mes Filtres</h3>
                {['Toutes les ressources', 'Mes Manuels', 'Documents de classe', 'Littérature'].map((cat, i) => (
                  <button key={i} className={`w-full text-left px-4 py-3 rounded-xl text-sm font-bold transition-colors ${i === 0 ? 'bg-[#FFF8E7] text-[#D32D3F]' : 'text-slate-500 hover:bg-slate-50'}`}>
                     {cat}
                  </button>
                ))}
             </Card>
          </div>

          <div className="lg:col-span-3 space-y-6">
            <div className="relative">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
              <Input 
                placeholder="Rechercher une ressource..." 
                className="pl-12 py-7 rounded-[2rem] border-none shadow-xl bg-white text-lg"
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
              {resources.map((res) => (
                <Card key={res.id} className="border-none shadow-md rounded-[2.5rem] bg-white hover:shadow-2xl transition-all group overflow-hidden border-2 border-transparent hover:border-[#D32D3F]/10">
                   <CardContent className="p-8">
                      <div className="flex justify-between items-start mb-6">
                         <div className="w-14 h-14 bg-slate-50 rounded-2xl flex items-center justify-center text-[#D32D3F]">
                            <Book className="w-7 h-7" />
                         </div>
                         <span className="text-[10px] font-black bg-slate-100 px-3 py-1 rounded-full text-slate-500">{res.type}</span>
                      </div>
                      <h4 className="text-lg font-black text-slate-900 mb-2 leading-tight">{res.title}</h4>
                      <p className="text-xs text-slate-400 font-bold uppercase tracking-widest mb-6">{res.category}</p>
                      
                      <div className="flex items-center justify-between pt-6 border-t border-slate-50">
                         <span className="text-xs font-bold text-slate-400">{res.size}</span>
                         <button className="flex items-center gap-2 px-4 py-2 bg-[#D32D3F] rounded-xl text-white font-bold text-xs shadow-lg shadow-[#D32D3F]/20 hover:scale-105 transition-transform">
                            <Download className="w-4 h-4" /> Lire
                         </button>
                      </div>
                   </CardContent>
                </Card>
              ))}
            </div>
          </div>
        </div>
      </div>
    </AppLayout>
  );
}

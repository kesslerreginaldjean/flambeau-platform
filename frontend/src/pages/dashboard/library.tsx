import { useState, useEffect } from 'react';
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

      <div>
        <div className="mb-8">
          <p className="kicker mb-2">Ressources</p>
          <h1 className="text-3xl font-semibold text-ink tracking-tight">Bibliothèque Numérique</h1>
          <p className="text-soft mt-2">Accédez à vos manuels, ressources et lectures recommandées.</p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
          <div>
             <Card className="border border-line bg-paper p-6">
                <h3 className="mono text-xs text-soft uppercase tracking-widest mb-4">Mes Filtres</h3>
                <div className="border-t border-line">
                  {['Toutes les ressources', 'Mes Manuels', 'Documents de classe', 'Littérature'].map((cat, i) => (
                    <button key={i} className={`w-full text-left px-3 py-2.5 border-b border-line text-sm transition-colors ${i === 0 ? 'border-l-2 border-l-accent text-accent font-medium' : 'text-soft hover:bg-panel hover:text-ink'}`}>
                       {cat}
                    </button>
                  ))}
                </div>
             </Card>
          </div>

          <div className="lg:col-span-3 space-y-6">
            <div className="relative">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-soft z-10" />
              <Input
                placeholder="Rechercher une ressource..."
                className="pl-12"
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
              {resources.map((res) => (
                <Card key={res.id} className="border border-line bg-paper p-0 hover:border-accent transition-colors">
                   <CardContent className="p-6">
                      <div className="flex justify-between items-start mb-6">
                         <div className="w-12 h-12 border border-line flex items-center justify-center text-accent">
                            <Book className="w-6 h-6" />
                         </div>
                         <span className="mono text-[10px] border border-line px-2 py-1 text-soft uppercase tracking-widest">{res.type}</span>
                      </div>
                      <h4 className="text-lg font-semibold text-ink mb-2 leading-tight">{res.title}</h4>
                      <p className="mono text-[10px] text-soft uppercase tracking-widest mb-6">{res.category}</p>

                      <div className="flex items-center justify-between pt-4 border-t border-line">
                         <span className="mono text-xs text-soft">{res.size}</span>
                         <button className="flex items-center gap-2 px-4 py-2 bg-accent text-paper mono text-[10px] uppercase tracking-widest hover:bg-accent-ink transition-colors">
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

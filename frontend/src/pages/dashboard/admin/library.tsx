import React, { useState } from 'react';
import Head from 'next/head';
import AppLayout from '@/components/layout/AppLayout';
import { ADMIN_NAV_ITEMS } from '@/constants/navigation';
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Search, Book, Plus, Download, Trash2, FileText, Globe, BookOpen } from 'lucide-react';

export default function AdminLibrary() {
  const [searchTerm, setSearchTerm] = useState('');

  // Simulation de ressources (À connecter à une API plus tard)
  const resources = [
    { id: '1', title: 'Manuel de Mathématiques NS4', type: 'PDF', size: '12 MB', category: 'Académique' },
    { id: '2', title: 'Histoire d\'Haïti - Tome 1', type: 'E-Book', size: '8 MB', category: 'Culture' },
    { id: '3', title: 'Guide de Laboratoire Physique', type: 'PDF', size: '5 MB', category: 'Sciences' },
  ];

  return (
    <AppLayout navItems={ADMIN_NAV_ITEMS} userName="Admin Flambeau" userRoleLabel="Administrateur">
      <Head>
        <title>Bibliothèque Numérique | CLF</title>
      </Head>

      <div className="p-6">
        <div className="flex justify-between items-end mb-8">
          <div>
            <h1 className="text-3xl font-extrabold text-slate-900 tracking-tight">Bibliothèque Numérique</h1>
            <p className="text-slate-500 font-medium">Gérez les ressources éducatives et les livres du collège.</p>
          </div>
          <Button className="bg-[#D32D3F] hover:bg-[#8B1A26] text-white rounded-2xl px-6 py-6 shadow-lg shadow-[#D32D3F]/20 flex gap-2 font-bold">
            <Plus className="w-5 h-5" /> Ajouter un document
          </Button>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
          {/* Categories Sidebar */}
          <div className="space-y-4">
             <Card className="border-none shadow-xl rounded-[2.5rem] bg-white overflow-hidden">
                <div className="p-6 space-y-2">
                   <h3 className="text-xs font-black text-slate-400 uppercase tracking-widest mb-4">Catégories</h3>
                   {['Tous les livres', 'Manuels Scolaires', 'Littérature', 'Sciences', 'Histoire', 'Ressources Profs'].map((cat, i) => (
                     <button key={i} className={`w-full text-left px-4 py-3 rounded-xl text-sm font-bold transition-colors ${i === 0 ? 'bg-[#FFF8E7] text-[#D32D3F]' : 'text-slate-500 hover:bg-slate-50'}`}>
                        {cat}
                     </button>
                   ))}
                </div>
             </Card>

             <Card className="border-none shadow-lg rounded-[2rem] bg-gradient-to-br from-slate-900 to-slate-800 p-6 text-white">
                <Globe className="w-8 h-8 mb-4 text-[#FDE68A]" />
                <h4 className="font-bold mb-2">Ressources en ligne</h4>
                <p className="text-xs text-slate-400 leading-relaxed mb-4">Accédez à des milliers de bibliothèques partenaires dans le monde.</p>
                <Button variant="outline" className="w-full border-white/20 hover:bg-white/10 text-white text-xs rounded-xl">Explorer</Button>
             </Card>
          </div>

          {/* Main Library Area */}
          <div className="lg:col-span-3 space-y-6">
            <div className="relative">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
              <Input 
                placeholder="Rechercher un titre, un auteur, un sujet..." 
                className="pl-12 py-7 rounded-[2rem] border-none shadow-xl bg-white text-lg font-medium"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
              {resources.map((res) => (
                <Card key={res.id} className="border-none shadow-md rounded-[2.5rem] bg-white hover:shadow-2xl transition-all group overflow-hidden border-2 border-transparent hover:border-[#D32D3F]/10">
                   <CardContent className="p-8">
                      <div className="flex justify-between items-start mb-6">
                         <div className="w-14 h-14 bg-slate-50 rounded-2xl flex items-center justify-center text-[#D32D3F] group-hover:scale-110 transition-transform">
                            <Book className="w-7 h-7" />
                         </div>
                         <span className="text-[10px] font-black bg-slate-100 px-3 py-1 rounded-full text-slate-500 uppercase">{res.type}</span>
                      </div>
                      <h4 className="text-lg font-black text-slate-900 mb-2 leading-tight">{res.title}</h4>
                      <p className="text-xs text-slate-400 font-bold uppercase tracking-widest mb-6">{res.category}</p>
                      
                      <div className="flex items-center justify-between pt-6 border-t border-slate-50">
                         <span className="text-xs font-bold text-slate-400">{res.size}</span>
                         <div className="flex gap-2">
                            <button className="p-2 bg-slate-50 rounded-xl text-slate-400 hover:text-red-500 transition-colors">
                               <Trash2 className="w-4 h-4" />
                            </button>
                            <button className="p-2 bg-[#D32D3F] rounded-xl text-white shadow-lg shadow-[#D32D3F]/20 hover:scale-110 transition-transform">
                               <Download className="w-4 h-4" />
                            </button>
                         </div>
                      </div>
                   </CardContent>
                </Card>
              ))}

              {/* Add New Resource Card (Visual Placeholder) */}
              <button className="border-4 border-dashed border-slate-100 rounded-[2.5rem] p-8 flex flex-col items-center justify-center text-slate-300 hover:border-[#D32D3F]/20 hover:text-[#D32D3F]/30 transition-all gap-4 bg-slate-50/50">
                 <div className="w-16 h-16 rounded-full border-4 border-current flex items-center justify-center">
                    <Plus className="w-8 h-8" />
                 </div>
                 <span className="text-sm font-black uppercase tracking-[0.2em]">Ajouter</span>
              </button>
            </div>
          </div>
        </div>
      </div>
    </AppLayout>
  );
}

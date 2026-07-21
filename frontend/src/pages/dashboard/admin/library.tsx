import { useState } from 'react';
import Head from 'next/head';
import AppLayout from '@/components/layout/AppLayout';
import { ADMIN_NAV_ITEMS } from '@/constants/navigation';
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Search, Book, Plus, Download, Trash2, Globe } from 'lucide-react';

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

      <div>
        <div className="flex flex-col sm:flex-row sm:justify-between sm:items-end gap-4 mb-8 pb-6 border-b border-line">
          <div>
            <p className="kicker mb-2">Ressources</p>
            <h1 className="text-3xl font-semibold text-ink tracking-tight">Bibliothèque Numérique</h1>
            <p className="text-soft mt-1">Gérez les ressources éducatives et les livres du collège.</p>
          </div>
          <Button className="btn-accent shrink-0">
            <Plus className="w-4 h-4" /> Ajouter un document
          </Button>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
          {/* Categories Sidebar */}
          <div className="space-y-6">
             <Card className="border border-line bg-paper overflow-hidden">
                <div className="p-6 space-y-px">
                   <h3 className="mono text-xs text-soft uppercase tracking-widest mb-4">Catégories</h3>
                   {['Tous les livres', 'Manuels Scolaires', 'Littérature', 'Sciences', 'Histoire', 'Ressources Profs'].map((cat, i) => (
                     <button key={i} className={`w-full text-left px-4 py-3 text-sm font-medium border-l-2 transition-colors ${i === 0 ? 'border-accent bg-panel text-accent' : 'border-transparent text-soft hover:bg-panel hover:text-ink'}`}>
                        {cat}
                     </button>
                   ))}
                </div>
             </Card>

             <Card className="border border-line bg-ink p-6 text-paper">
                <Globe className="w-8 h-8 mb-4 text-accent" />
                <h4 className="font-semibold mb-2">Ressources en ligne</h4>
                <p className="text-xs text-paper/60 leading-relaxed mb-4">Accédez à des milliers de bibliothèques partenaires dans le monde.</p>
                <Button variant="outline" className="w-full border border-paper/30 hover:bg-paper hover:text-ink text-paper text-xs">Explorer</Button>
             </Card>
          </div>

          {/* Main Library Area */}
          <div className="lg:col-span-3 space-y-6">
            <div className="relative">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-soft z-10" />
              <Input
                placeholder="Rechercher un titre, un auteur, un sujet..."
                className="pl-12 text-lg"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
              {resources.map((res) => (
                <Card key={res.id} className="border border-line bg-paper hover:border-accent transition-colors group overflow-hidden">
                   <CardContent className="p-8">
                      <div className="flex justify-between items-start mb-6">
                         <div className="w-14 h-14 bg-panel border border-line flex items-center justify-center text-accent">
                            <Book className="w-7 h-7" />
                         </div>
                         <span className="mono text-[10px] bg-panel border border-line px-3 py-1 text-soft uppercase tracking-wider">{res.type}</span>
                      </div>
                      <h4 className="text-lg font-semibold text-ink mb-2 leading-tight">{res.title}</h4>
                      <p className="mono text-xs text-soft uppercase tracking-widest mb-6">{res.category}</p>

                      <div className="flex items-center justify-between pt-6 border-t border-line">
                         <span className="mono text-xs text-soft">{res.size}</span>
                         <div className="flex gap-2">
                            <button className="p-2 border border-line text-soft hover:text-accent hover:border-accent transition-colors">
                               <Trash2 className="w-4 h-4" />
                            </button>
                            <button className="p-2 bg-accent text-paper hover:bg-accent-ink transition-colors">
                               <Download className="w-4 h-4" />
                            </button>
                         </div>
                      </div>
                   </CardContent>
                </Card>
              ))}

              {/* Add New Resource Card (Visual Placeholder) */}
              <button className="border border-dashed border-line p-8 flex flex-col items-center justify-center text-soft hover:border-accent hover:text-accent transition-colors gap-4 bg-panel">
                 <div className="w-16 h-16 border border-current flex items-center justify-center">
                    <Plus className="w-8 h-8" />
                 </div>
                 <span className="mono text-sm uppercase tracking-[0.2em]">Ajouter</span>
              </button>
            </div>
          </div>
        </div>
      </div>
    </AppLayout>
  );
}

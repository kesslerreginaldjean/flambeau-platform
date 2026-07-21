import { useState, useEffect } from 'react';
import Head from 'next/head';
import AppLayout from '@/components/layout/AppLayout';
import { ADMIN_NAV_ITEMS } from '@/constants/navigation';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  History as HistoryIcon, Plus, School, Calendar,
  Users, ChevronRight, Layers
} from 'lucide-react';
import { authFetch } from "@/lib/authFetch";
export default function AdminAcademic() {
  const [classes, setClasses] = useState<any[]>([]);
  const [, setAcademicData] = useState<any>(null);
  const [, setLoading] = useState(true);

  useEffect(() => {
    fetchAcademicData();
  }, []);

  const fetchAcademicData = async () => {
    try {
      const response = await authFetch('/api/admin/academic');
      const data = await response.json();
      setAcademicData(data);
      setClasses(data.classes || []);
    } catch (error) {
      console.error('Error fetching academic data:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <AppLayout navItems={ADMIN_NAV_ITEMS} userName="Administrateur" userRoleLabel="Gestion Académique">
      <Head><title>Gestion Académique | Le Flambeau</title></Head>

      <div className="max-w-7xl mx-auto">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-6 mb-10 pb-6 border-b border-line">
          <div>
            <p className="kicker mb-2 flex items-center gap-2"><HistoryIcon className="w-4 h-4" /> Structure</p>
            <h1 className="text-4xl md:text-5xl font-semibold text-ink tracking-tight mb-2">Structure Académique</h1>
            <p className="text-soft">Configurez les piliers de votre institution.</p>
          </div>
          <div className="flex flex-wrap gap-3">
             <Button className="bg-ink hover:bg-accent text-paper rounded-none h-12 px-6 mono text-xs uppercase tracking-widest">
               <Calendar className="w-4 h-4 mr-2" /> Nouvelle Année
             </Button>
             <Button className="bg-accent hover:bg-accent-ink text-paper rounded-none h-12 px-6 mono text-xs uppercase tracking-widest">
               <Plus className="w-4 h-4 mr-2" /> Créer une Classe
             </Button>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2 space-y-8">
            <Card className="border border-line rounded-none bg-paper overflow-hidden">
              <CardHeader className="p-6 border-b border-line flex flex-row items-center justify-between">
                <CardTitle className="text-lg font-semibold text-ink flex items-center gap-3">
                  <School className="w-5 h-5 text-accent" />
                  Classes de l'Établissement
                </CardTitle>
                <Badge className="bg-panel text-accent border border-line rounded-none mono px-3 py-1 uppercase text-xs tracking-widest">
                  {classes.length} Classes Actives
                </Badge>
              </CardHeader>
              <CardContent className="p-0">
                <div className="overflow-x-auto">
                   <table className="w-full text-left border-collapse">
                      <thead>
                        <tr className="border-b border-line">
                          <th className="px-6 py-4 mono text-xs font-medium text-soft uppercase tracking-widest">Niveau & Nom</th>
                          <th className="px-6 py-4 mono text-xs font-medium text-soft uppercase tracking-widest text-center">Élèves</th>
                          <th className="px-6 py-4 mono text-xs font-medium text-soft uppercase tracking-widest">Titulaire</th>
                          <th className="px-6 py-4 mono text-xs font-medium text-soft uppercase tracking-widest text-right">Actions</th>
                        </tr>
                      </thead>
                      <tbody>
                        {classes.map((cls) => (
                          <tr key={cls.id} className="border-b border-line hover:bg-panel transition-colors">
                            <td className="px-6 py-4">
                              <div className="flex items-center gap-4">
                                <div className="w-12 h-12 border border-line bg-panel flex items-center justify-center text-accent mono">
                                  {cls.level[0]}
                                </div>
                                <div>
                                  <p className="font-semibold text-ink">{cls.level}</p>
                                  <p className="mono text-xs text-soft uppercase tracking-widest">Section {cls.name}</p>
                                </div>
                              </div>
                            </td>
                            <td className="px-6 py-4 text-center">
                              <span className="inline-flex items-center gap-2 px-3 py-1 border border-line bg-panel mono text-xs text-ink">
                                <Users className="w-3 h-3" /> {cls.studentsCount}
                              </span>
                            </td>
                            <td className="px-6 py-4 text-soft">
                               {cls.teacher}
                            </td>
                            <td className="px-6 py-4 text-right">
                              <Button variant="ghost" size="icon" className="rounded-none text-soft hover:text-accent transition-colors">
                                <ChevronRight className="w-5 h-5" />
                              </Button>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                   </table>
                </div>
              </CardContent>
            </Card>
          </div>

          <div className="space-y-8">
             <Card className="border border-line rounded-none bg-ink text-paper p-6 overflow-hidden">
                <div>
                   <p className="mono text-xs uppercase tracking-widest text-accent mb-3">En Cours</p>
                   <p className="numeral text-4xl tracking-tight mb-2">2023 - 2024</p>
                   <p className="text-soft mb-8">Année Académique Active</p>

                   <div className="space-y-px">
                      <div className="flex justify-between items-center p-4 border border-line border-opacity-20" style={{ borderColor: 'rgba(255,255,255,.15)' }}>
                         <span className="mono text-xs uppercase tracking-widest text-soft">Trimestre</span>
                         <span className="font-medium">2ème Trimestre</span>
                      </div>
                      <div className="flex justify-between items-center p-4 border" style={{ borderColor: 'rgba(255,255,255,.15)' }}>
                         <span className="mono text-xs uppercase tracking-widest text-soft">Progrès</span>
                         <span className="numeral text-lg">65%</span>
                      </div>
                   </div>
                </div>
             </Card>

             <Card className="border border-line rounded-none bg-paper p-6 space-y-6">
                <h4 className="text-lg font-semibold text-ink flex items-center gap-3">
                  <Layers className="w-5 h-5 text-accent" />
                  Répartition des Niveaux
                </h4>
                <div className="space-y-4">
                   {['Préscolaire', 'Fondamental 1', 'Fondamental 2', 'Secondaire'].map((level) => (
                     <div key={level} className="flex items-center justify-between group cursor-pointer">
                        <span className="text-sm text-soft group-hover:text-accent transition-colors">{level}</span>
                        <div className="h-1 flex-1 mx-4 bg-panel overflow-hidden">
                           <div className="h-full bg-line group-hover:bg-accent transition-colors w-1/2"></div>
                        </div>
                        <span className="mono text-xs text-soft">12 Cl.</span>
                     </div>
                   ))}
                </div>
             </Card>
          </div>
        </div>
      </div>
    </AppLayout>
  );
}

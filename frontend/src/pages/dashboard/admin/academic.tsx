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

      <div className="p-6 max-w-7xl mx-auto">
        <div className="flex justify-between items-center mb-10">
          <div>
            <h1 className="text-4xl font-black text-slate-900 tracking-tight flex items-center gap-3">
              <HistoryIcon className="w-10 h-10 text-[#D32D3F]" />
              Structure Académique
            </h1>
            <p className="text-slate-500 font-medium text-lg mt-1 italic">"Configurez les piliers de votre institution."</p>
          </div>
          <div className="flex gap-4">
             <Button className="bg-slate-900 hover:bg-slate-800 text-white rounded-2xl h-14 px-8 font-black text-xs uppercase tracking-widest shadow-xl">
               <Calendar className="w-5 h-5 mr-3" /> Nouvelle Année
             </Button>
             <Button className="bg-[#D32D3F] hover:bg-[#8B1A26] text-white rounded-2xl h-14 px-8 font-black text-xs uppercase tracking-widest shadow-xl">
               <Plus className="w-5 h-5 mr-3" /> Créer une Classe
             </Button>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2 space-y-8">
            <Card className="border-none shadow-2xl rounded-[3rem] bg-white overflow-hidden">
              <CardHeader className="p-10 border-b border-slate-50 flex flex-row items-center justify-between">
                <CardTitle className="text-2xl font-black text-slate-900 flex items-center gap-3">
                  <School className="w-7 h-7 text-[#D32D3F]" />
                  Classes de l'Établissement
                </CardTitle>
                <Badge className="bg-[#FFF8E7] text-[#D32D3F] border-none font-black px-4 py-1 uppercase text-[10px] tracking-widest">
                  {classes.length} Classes Actives
                </Badge>
              </CardHeader>
              <CardContent className="p-0">
                <div className="overflow-x-auto">
                   <table className="w-full text-left border-collapse">
                      <thead>
                        <tr className="bg-slate-50/50">
                          <th className="px-10 py-6 text-[10px] font-black text-slate-400 uppercase tracking-widest">Niveau & Nom</th>
                          <th className="px-10 py-6 text-[10px] font-black text-slate-400 uppercase tracking-widest text-center">Élèves</th>
                          <th className="px-10 py-6 text-[10px] font-black text-slate-400 uppercase tracking-widest">Titulaire</th>
                          <th className="px-10 py-6 text-[10px] font-black text-slate-400 uppercase tracking-widest text-right">Actions</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-slate-50">
                        {classes.map((cls) => (
                          <tr key={cls.id} className="group hover:bg-slate-50/30 transition-colors">
                            <td className="px-10 py-6">
                              <div className="flex items-center gap-4">
                                <div className="w-12 h-12 rounded-2xl bg-[#FFF8E7] flex items-center justify-center text-[#D32D3F] font-black shadow-inner">
                                  {cls.level[0]}
                                </div>
                                <div>
                                  <p className="font-black text-slate-900">{cls.level}</p>
                                  <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Section {cls.name}</p>
                                </div>
                              </div>
                            </td>
                            <td className="px-10 py-6 text-center">
                              <span className="inline-flex items-center gap-2 px-3 py-1 bg-slate-100 rounded-full font-black text-xs text-slate-600">
                                <Users className="w-3 h-3" /> {cls.studentsCount}
                              </span>
                            </td>
                            <td className="px-10 py-6 font-bold text-slate-500">
                               {cls.teacher}
                            </td>
                            <td className="px-10 py-6 text-right">
                              <Button variant="ghost" size="icon" className="rounded-xl group-hover:bg-[#D32D3F] group-hover:text-white transition-all">
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
             <Card className="border-none shadow-2xl rounded-[3rem] bg-slate-900 text-white p-10 overflow-hidden relative">
                <div className="relative z-10">
                   <Badge className="bg-green-500/20 text-green-400 border-none mb-4 font-black px-3 py-1">En Cours</Badge>
                   <h3 className="text-3xl font-black tracking-tight mb-2">2023 - 2024</h3>
                   <p className="text-slate-400 font-medium mb-8">Année Académique Active</p>
                   
                   <div className="space-y-4">
                      <div className="flex justify-between items-center p-4 bg-white/5 rounded-2xl">
                         <span className="text-xs font-bold uppercase tracking-widest text-slate-400">Trimestre</span>
                         <span className="font-black">2ème Trimestre</span>
                      </div>
                      <div className="flex justify-between items-center p-4 bg-white/5 rounded-2xl">
                         <span className="text-xs font-bold uppercase tracking-widest text-slate-400">Progrès</span>
                         <span className="font-black">65%</span>
                      </div>
                   </div>
                </div>
                <div className="absolute -right-10 -bottom-10 w-40 h-40 bg-white/5 rounded-full blur-3xl"></div>
             </Card>

             <Card className="border-none shadow-2xl rounded-[3rem] bg-white p-10 space-y-6">
                <h4 className="text-xl font-black text-slate-900 flex items-center gap-3">
                  <Layers className="w-6 h-6 text-[#D32D3F]" />
                  Répartition des Niveaux
                </h4>
                <div className="space-y-4">
                   {['Préscolaire', 'Fondamental 1', 'Fondamental 2', 'Secondaire'].map((level) => (
                     <div key={level} className="flex items-center justify-between group cursor-pointer">
                        <span className="text-sm font-bold text-slate-500 group-hover:text-[#D32D3F] transition-colors">{level}</span>
                        <div className="h-1 flex-1 mx-4 bg-slate-100 rounded-full overflow-hidden">
                           <div className="h-full bg-slate-200 group-hover:bg-[#D32D3F] transition-all w-1/2"></div>
                        </div>
                        <span className="text-xs font-black text-slate-400">12 Cl.</span>
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

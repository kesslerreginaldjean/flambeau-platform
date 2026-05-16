import React, { useState, useEffect } from 'react';
import Head from 'next/head';
import { useRouter } from 'next/router';
import AppLayout from '@/components/layout/AppLayout';
import { PARENT_NAV_ITEMS } from '@/constants/navigation';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { 
  BadgeDollarSign, History, Info, CheckCircle2, Clock, 
  AlertTriangle, Users, ChevronRight, Download
} from 'lucide-react';
import { Button } from "@/components/ui/button";

export default function ParentPayments() {
  const router = useRouter();
  const [children, setChildren] = useState<any[]>([]);
  const [selectedChild, setSelectedChild] = useState<any>(null);
  const [payments, setPayments] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchFamilyData();
  }, []);

  const fetchFamilyData = async () => {
    try {
      const parentId = localStorage.getItem('user_id');
      if (parentId) {
        const response = await fetch(`http://localhost:5000/api/parents/${parentId}/dashboard`);
        const data = await response.json();
        setChildren(data.children || []);
      }
    } catch (error) {
      console.error('Error fetching family data:', error);
    } finally {
      setLoading(false);
    }
  };

  const fetchChildPayments = async (childId: string) => {
    try {
      setLoading(true);
      const response = await fetch(`http://localhost:5000/api/students/${childId}/payments`);
      const data = await response.json();
      setPayments(data);
    } catch (error) {
      console.error('Error fetching child payments:', error);
    } finally {
      setLoading(false);
    }
  };

  const totalPaid = payments.filter(p => p.status === 'completed').reduce((acc, p) => acc + p.amount, 0);
  const totalDue = payments.filter(p => p.status === 'pending' || p.status === 'partial').reduce((acc, p) => acc + p.amount, 0);

  if (loading && children.length === 0) return <div className="p-20 text-center font-bold text-slate-400 animate-pulse text-xl uppercase tracking-widest">Initialisation de vos services financiers...</div>;

  return (
    <AppLayout navItems={PARENT_NAV_ITEMS} userName="Parent" userRoleLabel="Espace Finance">
      <Head><title>Scolarité des Enfants | Le Flambeau</title></Head>

      <div className="p-6 max-w-7xl mx-auto">
        <div className="mb-10">
          <h1 className="text-4xl font-black text-slate-900 tracking-tight flex items-center gap-3">
            <BadgeDollarSign className="w-10 h-10 text-[#D32D3F]" />
            Suivi Financier Familial
          </h1>
          <p className="text-slate-500 font-medium text-lg mt-1 italic">"Consultez et gérez les frais de scolarité de vos enfants."</p>
        </div>

        {!selectedChild ? (
           <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {children.map((child: any) => (
                <Card 
                  key={child.id} 
                  className="border-none shadow-xl rounded-[2.5rem] bg-white group cursor-pointer hover:shadow-2xl transition-all duration-500 overflow-hidden"
                  onClick={() => {
                    setSelectedChild(child);
                    fetchChildPayments(child.userId);
                  }}
                >
                  <div className="h-3 bg-[#D32D3F] opacity-20"></div>
                  <CardContent className="p-10 flex flex-col items-center text-center">
                    <div className="w-24 h-24 rounded-[2rem] bg-slate-50 flex items-center justify-center text-[#D32D3F] mb-6 group-hover:bg-[#D32D3F] group-hover:text-white transition-all duration-500 shadow-inner text-3xl font-black">
                      {child.user.firstName[0]}
                    </div>
                    <h3 className="text-2xl font-black text-slate-900 tracking-tight">{child.user.firstName} {child.user.lastName}</h3>
                    <p className="text-xs font-bold text-slate-400 uppercase tracking-widest mt-2">Cliquez pour voir les paiements</p>
                    <div className="mt-8 w-full py-4 bg-slate-50 rounded-2xl flex items-center justify-center gap-2 group-hover:bg-slate-900 group-hover:text-white transition-all">
                       <span className="text-[10px] font-black uppercase tracking-widest">Gérer la finance</span>
                       <ChevronRight className="w-4 h-4" />
                    </div>
                  </CardContent>
                </Card>
              ))}
           </div>
        ) : (
          <div className="space-y-8">
            <div className="flex flex-col md:flex-row justify-between items-center bg-white p-8 rounded-[2.5rem] shadow-xl border border-slate-100 gap-6">
               <div className="flex items-center gap-6">
                 <div className="w-20 h-20 rounded-[1.5rem] bg-[#FFF8E7] flex items-center justify-center font-black text-[#D32D3F] text-3xl shadow-inner">
                    {selectedChild.user.firstName[0]}
                 </div>
                 <div>
                   <h2 className="text-2xl font-black text-slate-900 tracking-tight">{selectedChild.user.firstName} {selectedChild.user.lastName}</h2>
                   <p className="text-xs font-black text-[#D32D3F] uppercase tracking-[0.2em]">Scolarité • {selectedChild.studentNumber}</p>
                 </div>
               </div>
               <Button 
                variant="outline" 
                onClick={() => setSelectedChild(null)}
                className="rounded-2xl border-slate-200 font-black text-[10px] uppercase tracking-widest h-14 px-8"
               >
                 Changer d'enfant
               </Button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
               <Card className="border-none shadow-xl bg-white rounded-[2.5rem] p-8">
                  <p className="text-xs font-black text-slate-400 uppercase tracking-widest">Total Acquitté</p>
                  <h3 className="text-4xl font-black text-green-600 mt-2">{totalPaid.toLocaleString()} <span className="text-sm">HTG</span></h3>
               </Card>
               <Card className="border-none shadow-xl bg-slate-900 text-white rounded-[2.5rem] p-8">
                  <p className="text-xs font-black text-slate-400 uppercase tracking-widest">Reste à payer</p>
                  <h3 className="text-4xl font-black text-[#D32D3F] mt-2">{totalDue.toLocaleString()} <span className="text-sm">HTG</span></h3>
               </Card>
            </div>

            <Card className="border-none shadow-2xl rounded-[3rem] bg-white overflow-hidden">
               <CardHeader className="p-10 flex justify-between items-center border-b border-slate-50">
                  <CardTitle className="text-2xl font-black text-slate-900 flex items-center gap-3">
                    <History className="w-7 h-7 text-[#D32D3F]" />
                    Détail des Transactions
                  </CardTitle>
               </CardHeader>
               <CardContent className="p-0">
                  <table className="w-full text-left border-collapse">
                    <thead>
                      <tr className="bg-slate-50/50">
                        <th className="px-10 py-6 text-[10px] font-black text-slate-400 uppercase tracking-widest">Type</th>
                        <th className="px-10 py-6 text-[10px] font-black text-slate-400 uppercase tracking-widest">Année</th>
                        <th className="px-10 py-6 text-[10px] font-black text-slate-400 uppercase tracking-widest">Montant</th>
                        <th className="px-10 py-6 text-[10px] font-black text-slate-400 uppercase tracking-widest">Statut</th>
                        <th className="px-10 py-6 text-[10px] font-black text-slate-400 uppercase tracking-widest text-right">Action</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-50">
                      {payments.map((p: any) => (
                        <tr key={p.id} className="hover:bg-slate-50/30 transition-colors group">
                          <td className="px-10 py-6 font-black text-slate-900">{p.paymentType}</td>
                          <td className="px-10 py-6 font-bold text-slate-400">{p.academicYear?.name}</td>
                          <td className="px-10 py-6 font-black text-slate-900">{p.amount.toLocaleString()} HTG</td>
                          <td className="px-10 py-6">
                            {p.status === 'completed' ? (
                              <Badge className="bg-green-100 text-green-700 border-none font-bold text-[9px] uppercase tracking-widest px-3 py-1">Réglé</Badge>
                            ) : (
                              <Badge className="bg-red-50 text-[#D32D3F] border-none font-bold text-[9px] uppercase tracking-widest px-3 py-1">En attente</Badge>
                            )}
                          </td>
                          <td className="px-10 py-6 text-right">
                             <Button variant="ghost" size="sm" className="rounded-xl text-[#D32D3F] font-black text-[10px] uppercase tracking-widest">
                               <Download className="w-4 h-4 mr-2" /> Reçu
                             </Button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
               </CardContent>
            </Card>
          </div>
        )}
      </div>
    </AppLayout>
  );
}

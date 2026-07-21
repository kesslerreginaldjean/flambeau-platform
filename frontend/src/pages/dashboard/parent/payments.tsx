import { useState, useEffect } from 'react';
import Head from 'next/head';
import AppLayout from '@/components/layout/AppLayout';
import { PARENT_NAV_ITEMS } from '@/constants/navigation';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
  BadgeDollarSign, History,
  ChevronRight, Download
} from 'lucide-react';
import { Button } from "@/components/ui/button";

import { authFetch } from "@/lib/authFetch";
export default function ParentPayments() {
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
        const response = await authFetch(`/api/parents/${parentId}/dashboard`);
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
      const response = await authFetch(`/api/students/${childId}/payments`);
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

  if (loading && children.length === 0) return <div className="p-20 text-center mono text-sm uppercase tracking-widest text-soft animate-pulse">Initialisation de vos services financiers...</div>;

  return (
    <AppLayout navItems={PARENT_NAV_ITEMS} userName="Parent" userRoleLabel="Espace Finance">
      <Head><title>Scolarité des Enfants | Le Flambeau</title></Head>

      <div className="max-w-7xl mx-auto">
        <div className="mb-8 border-b border-line pb-6">
          <p className="kicker mb-2">Espace Finance</p>
          <h1 className="text-3xl md:text-4xl font-semibold text-ink tracking-tight flex items-center gap-3">
            <BadgeDollarSign className="w-8 h-8 text-accent" />
            Suivi Financier Familial
          </h1>
          <p className="text-soft mt-2">Consultez et gérez les frais de scolarité de vos enfants.</p>
        </div>

        {!selectedChild ? (
           <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-px bg-line border border-line">
              {children.map((child: any) => (
                <Card
                  key={child.id}
                  className="border-0 bg-paper group cursor-pointer hover:bg-panel transition-colors"
                  onClick={() => {
                    setSelectedChild(child);
                    fetchChildPayments(child.userId);
                  }}
                >
                  <CardContent className="p-8 flex flex-col items-center text-center">
                    <div className="w-20 h-20 border border-line flex items-center justify-center numeral text-accent text-3xl mb-6">
                      {child.user.firstName[0]}
                    </div>
                    <h3 className="text-xl font-semibold text-ink tracking-tight">{child.user.firstName} {child.user.lastName}</h3>
                    <p className="mono text-xs text-soft uppercase tracking-widest mt-2">Cliquez pour voir les paiements</p>
                    <div className="mt-8 w-full h-12 border border-line flex items-center justify-center gap-2 group-hover:bg-ink group-hover:text-paper transition-colors">
                       <span className="mono text-xs uppercase tracking-widest">Gérer la finance</span>
                       <ChevronRight className="w-4 h-4" />
                    </div>
                  </CardContent>
                </Card>
              ))}
           </div>
        ) : (
          <div className="space-y-8">
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center bg-paper p-6 border border-line gap-4">
               <div className="flex items-center gap-5">
                 <div className="w-16 h-16 border border-line flex items-center justify-center numeral text-accent text-3xl">
                    {selectedChild.user.firstName[0]}
                 </div>
                 <div>
                   <h2 className="text-xl font-semibold text-ink tracking-tight">{selectedChild.user.firstName} {selectedChild.user.lastName}</h2>
                   <p className="mono text-xs text-accent uppercase tracking-widest">Scolarité • {selectedChild.studentNumber}</p>
                 </div>
               </div>
               <Button
                variant="outline"
                onClick={() => setSelectedChild(null)}
                className="mono text-xs uppercase tracking-widest h-12 px-6"
               >
                 Changer d'enfant
               </Button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-px bg-line border border-line">
               <Card className="border-0 bg-paper p-6">
                  <p className="mono text-xs text-soft uppercase tracking-widest">Total Acquitté</p>
                  <p className="numeral text-4xl text-ink mt-2">{totalPaid.toLocaleString()} <span className="text-sm">HTG</span></p>
               </Card>
               <Card className="border-0 bg-ink text-paper p-6">
                  <p className="mono text-xs text-paper/60 uppercase tracking-widest">Reste à payer</p>
                  <p className="numeral text-4xl text-accent mt-2">{totalDue.toLocaleString()} <span className="text-sm">HTG</span></p>
               </Card>
            </div>

            <Card className="border border-line bg-paper overflow-hidden">
               <CardHeader className="p-6 flex justify-between items-center border-b border-line">
                  <CardTitle className="text-xl font-semibold text-ink flex items-center gap-3">
                    <History className="w-5 h-5 text-accent" />
                    Détail des Transactions
                  </CardTitle>
               </CardHeader>
               <CardContent className="p-0">
                  <table className="w-full text-left border-collapse">
                    <thead>
                      <tr className="border-b border-line">
                        <th className="px-6 py-4 mono text-xs text-soft uppercase tracking-widest">Type</th>
                        <th className="px-6 py-4 mono text-xs text-soft uppercase tracking-widest">Année</th>
                        <th className="px-6 py-4 mono text-xs text-soft uppercase tracking-widest">Montant</th>
                        <th className="px-6 py-4 mono text-xs text-soft uppercase tracking-widest">Statut</th>
                        <th className="px-6 py-4 mono text-xs text-soft uppercase tracking-widest text-right">Action</th>
                      </tr>
                    </thead>
                    <tbody>
                      {payments.map((p: any) => (
                        <tr key={p.id} className="border-b border-line hover:bg-panel transition-colors">
                          <td className="px-6 py-4 font-semibold text-ink">{p.paymentType}</td>
                          <td className="px-6 py-4 text-soft">{p.academicYear?.name}</td>
                          <td className="px-6 py-4 numeral text-ink">{p.amount.toLocaleString()} HTG</td>
                          <td className="px-6 py-4">
                            {p.status === 'completed' ? (
                              <Badge className="border border-line bg-paper text-ink mono text-xs uppercase tracking-widest px-3 py-1 rounded-none">Réglé</Badge>
                            ) : (
                              <Badge className="border border-accent bg-paper text-accent mono text-xs uppercase tracking-widest px-3 py-1 rounded-none">En attente</Badge>
                            )}
                          </td>
                          <td className="px-6 py-4 text-right">
                             <Button variant="ghost" size="sm" className="text-accent mono text-xs uppercase tracking-widest rounded-none">
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

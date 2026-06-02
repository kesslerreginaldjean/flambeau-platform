import { useState, useEffect } from 'react';
import Head from 'next/head';
import AppLayout from '@/components/layout/AppLayout';
import { STUDENT_NAV_ITEMS } from '@/constants/navigation';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
  BadgeDollarSign, CreditCard, Download,
  History, Info, CheckCircle2, Clock, AlertTriangle
} from 'lucide-react';
import { Button } from "@/components/ui/button";
import { authFetch } from "@/lib/authFetch";

export default function StudentPayments() {
  const [payments, setPayments] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchPayments = async () => {
      try {
        const userId = localStorage.getItem('user_id');
        if (userId) {
          const response = await authFetch(`/api/students/${userId}/payments`);
          const data = await response.json();
          setPayments(data);
        }
      } catch (error) {
        console.error('Error fetching payments:', error);
      } finally {
        setLoading(false);
      }
    };
    fetchPayments();
  }, []);

  const totalPaid = payments.filter(p => p.status === 'completed').reduce((acc, p) => acc + p.amount, 0);
  const totalPending = payments.filter(p => p.status === 'pending' || p.status === 'partial').reduce((acc, p) => acc + p.amount, 0);

  if (loading) return <div className="p-20 text-center font-bold text-slate-400 animate-pulse text-xl">Accès à vos services financiers...</div>;

  return (
    <AppLayout navItems={STUDENT_NAV_ITEMS} userName="Étudiant" userRoleLabel="Services Financiers">
      <Head><title>Paiements & Scolarité | Le Flambeau</title></Head>

      <div className="p-6 max-w-6xl mx-auto">
        <div className="mb-10">
          <h1 className="text-4xl font-black text-slate-900 tracking-tight flex items-center gap-3">
            <BadgeDollarSign className="w-10 h-10 text-[#D32D3F]" />
            Suivi de Scolarité
          </h1>
          <p className="text-slate-500 font-medium text-lg mt-1 italic">"Gérez vos frais académiques en toute transparence."</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-10">
          <Card className="border-none shadow-xl bg-white rounded-[2.5rem] p-8 group hover:scale-[1.02] transition-transform">
            <div className="w-12 h-12 bg-green-50 rounded-2xl flex items-center justify-center text-green-600 mb-4">
              <CheckCircle2 className="w-6 h-6" />
            </div>
            <p className="text-xs font-black text-slate-400 uppercase tracking-widest">Total Payé</p>
            <h3 className="text-3xl font-black text-slate-900 mt-1">{totalPaid.toLocaleString()} <span className="text-sm text-slate-400 font-bold">HTG</span></h3>
          </Card>

          <Card className="border-none shadow-xl bg-white rounded-[2.5rem] p-8 group hover:scale-[1.02] transition-transform">
            <div className="w-12 h-12 bg-amber-50 rounded-2xl flex items-center justify-center text-amber-600 mb-4">
              <Clock className="w-6 h-6" />
            </div>
            <p className="text-xs font-black text-slate-400 uppercase tracking-widest">En attente</p>
            <h3 className="text-3xl font-black text-slate-900 mt-1">{totalPending.toLocaleString()} <span className="text-sm text-slate-400 font-bold">HTG</span></h3>
          </Card>

          <Card className="border-none shadow-xl bg-slate-900 text-white rounded-[2.5rem] p-8 relative overflow-hidden">
             <div className="relative z-10">
                <CreditCard className="w-10 h-10 text-[#D32D3F] mb-4" />
                <p className="text-xs font-black text-slate-400 uppercase tracking-widest">Prochaine Échéance</p>
                <h3 className="text-2xl font-black mt-1">15 Juin 2026</h3>
             </div>
             <div className="absolute -right-4 -bottom-4 w-24 h-24 bg-white/5 rounded-full"></div>
          </Card>
        </div>

        <Card className="border-none shadow-2xl rounded-[3rem] bg-white overflow-hidden">
          <CardHeader className="p-10 border-b border-slate-50">
            <div className="flex justify-between items-center">
              <CardTitle className="text-2xl font-black text-slate-900 tracking-tight flex items-center gap-3">
                <History className="w-7 h-7 text-[#D32D3F]" />
                Historique des Transactions
              </CardTitle>
              <Button variant="outline" className="rounded-xl font-bold gap-2">
                <Download className="w-4 h-4" /> Exporter relevé
              </Button>
            </div>
          </CardHeader>
          <CardContent className="p-0">
            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="bg-slate-50/50">
                    <th className="px-10 py-6 text-[10px] font-black text-slate-400 uppercase tracking-[0.2em]">Désignation</th>
                    <th className="px-10 py-6 text-[10px] font-black text-slate-400 uppercase tracking-[0.2em]">Date</th>
                    <th className="px-10 py-6 text-[10px] font-black text-slate-400 uppercase tracking-[0.2em]">Montant</th>
                    <th className="px-10 py-6 text-[10px] font-black text-slate-400 uppercase tracking-[0.2em]">Statut</th>
                    <th className="px-10 py-6 text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-50">
                  {payments.length > 0 ? payments.map((p: any) => (
                    <tr key={p.id} className="hover:bg-slate-50/30 transition-colors group">
                      <td className="px-10 py-6">
                        <div className="flex items-center gap-4">
                          <div className="w-10 h-10 rounded-xl bg-slate-50 flex items-center justify-center text-slate-400 group-hover:bg-[#D32D3F] group-hover:text-white transition-all">
                            <Info className="w-5 h-5" />
                          </div>
                          <div>
                            <p className="font-black text-slate-900">{p.paymentType}</p>
                            <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">{p.academicYear?.name}</p>
                          </div>
                        </div>
                      </td>
                      <td className="px-10 py-6 font-medium text-slate-500">
                        {new Date(p.createdAt).toLocaleDateString('fr-FR', { day: 'numeric', month: 'long', year: 'numeric' })}
                      </td>
                      <td className="px-10 py-6 font-black text-slate-900">
                        {p.amount.toLocaleString()} HTG
                      </td>
                      <td className="px-10 py-6">
                        {p.status === 'completed' ? (
                          <Badge className="bg-green-100 text-green-700 border-none font-black text-[9px] uppercase tracking-widest px-3 py-1">Payé</Badge>
                        ) : p.status === 'partial' ? (
                          <Badge className="bg-amber-100 text-amber-700 border-none font-black text-[9px] uppercase tracking-widest px-3 py-1">Partiel</Badge>
                        ) : (
                          <Badge className="bg-red-100 text-[#D32D3F] border-none font-black text-[9px] uppercase tracking-widest px-3 py-1 text-center">En attente</Badge>
                        )}
                      </td>
                      <td className="px-10 py-6 text-right">
                        <Button variant="ghost" size="sm" className="rounded-xl hover:bg-slate-100 text-[#D32D3F] font-bold">
                          Reçu PDF
                        </Button>
                      </td>
                    </tr>
                  )) : (
                    <tr>
                      <td colSpan={5} className="py-20 text-center text-slate-300 font-bold italic">
                        Aucune transaction enregistrée.
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </CardContent>
        </Card>

        <div className="mt-8 p-8 bg-[#FFF8E7] rounded-[2.5rem] border border-[#FDE68A] flex items-start gap-6">
          <div className="w-12 h-12 bg-white rounded-2xl flex items-center justify-center text-[#D32D3F] shadow-sm shrink-0">
             <AlertTriangle className="w-6 h-6" />
          </div>
          <div>
            <h4 className="font-black text-slate-900 mb-1">Information importante</h4>
            <p className="text-sm text-slate-600 leading-relaxed font-medium">
              Les paiements par virement bancaire peuvent prendre jusqu'à 48h avant d'apparaître sur votre portail. 
              Pour toute réclamation, veuillez contacter le service comptabilité muni de votre preuve de paiement.
            </p>
          </div>
        </div>
      </div>
    </AppLayout>
  );
}

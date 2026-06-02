import { useState, useEffect } from 'react';
import Head from 'next/head';
import AppLayout from '@/components/layout/AppLayout';
import { ADMIN_NAV_ITEMS } from '@/constants/navigation';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { 
  TrendingUp, AlertCircle, CheckCircle2, 
  Search, Plus, Download, MoreHorizontal
} from 'lucide-react';
import PaymentModal from '@/components/PaymentModal';

import { authFetch } from "@/lib/authFetch";
export default function AdminFinance() {
  const [payments, setPayments] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState({ totalRevenue: 0, pendingAmount: 0 });
  const [isModalOpen, setIsModalOpen] = useState(false);

  const fetchFinanceData = async () => {
    try {
      const [paymentsRes, statsRes] = await Promise.all([
        authFetch('/api/admin/payments'),
        authFetch('/api/admin/stats')
      ]);
      const paymentsData = await paymentsRes.json();
      const statsData = await statsRes.json();
      
      setPayments(paymentsData);
      setStats({
        totalRevenue: statsData.revenue || 0,
        pendingAmount: statsData.pending || 0
      });
    } catch (error) {
      console.error('Failed to fetch finance data:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchFinanceData();
  }, []);

  return (
    <AppLayout navItems={ADMIN_NAV_ITEMS} userName="Admin Flambeau" userRoleLabel="Administrateur">
      <Head>
        <title>Gestion Financière | CLF</title>
      </Head>

      <div className="p-6">
        <div className="flex justify-between items-center mb-8">
          <div>
            <h1 className="text-3xl font-extrabold text-slate-900 tracking-tight">Finance & Comptabilité</h1>
            <p className="text-slate-500 font-medium">Suivez les revenus et gérez les paiements des élèves.</p>
          </div>
          <div className="flex gap-3">
             <Button variant="outline" className="rounded-xl flex gap-2">
                <Download className="w-4 h-4" /> Rapport PDF
             </Button>
             <Button 
               onClick={() => setIsModalOpen(true)}
               className="bg-[#D32D3F] hover:bg-[#8B1A26] text-white rounded-xl flex gap-2"
             >
                <Plus className="w-4 h-4" /> Enregistrer un Paiement
             </Button>
          </div>
        </div>

        {/* Financial Overview Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
           <Card className="border-none shadow-lg rounded-[2rem] bg-gradient-to-br from-[#1E293B] to-[#0F172A] text-white overflow-hidden relative">
              <CardContent className="p-8">
                 <div className="flex justify-between items-start mb-6">
                    <div className="p-3 bg-white/10 rounded-2xl">
                       <TrendingUp className="w-6 h-6 text-[#FDE68A]" />
                    </div>
                    <Badge className="bg-green-500/20 text-green-400 border-none">+12.5%</Badge>
                 </div>
                 <h3 className="text-4xl font-bold mb-1">{stats.totalRevenue.toLocaleString()}<span className="text-lg font-normal opacity-60 ml-2">HTG</span></h3>
                 <p className="text-slate-400 font-medium">Revenus Totaux Collectés</p>
              </CardContent>
           </Card>

           <Card className="border-none shadow-lg rounded-[2rem] bg-white overflow-hidden">
              <CardContent className="p-8">
                 <div className="flex justify-between items-start mb-6">
                    <div className="p-3 bg-amber-50 rounded-2xl text-amber-600">
                       <AlertCircle className="w-6 h-6" />
                    </div>
                 </div>
                 <h3 className="text-4xl font-bold text-slate-900 mb-1">{stats.pendingAmount.toLocaleString()}<span className="text-lg font-normal text-slate-400 ml-2">HTG</span></h3>
                 <p className="text-slate-500 font-medium">Paiements en Attente</p>
              </CardContent>
           </Card>

           <Card className="border-none shadow-lg rounded-[2rem] bg-white overflow-hidden">
              <CardContent className="p-8">
                 <div className="flex justify-between items-start mb-6">
                    <div className="p-3 bg-green-50 rounded-2xl text-green-600">
                       <CheckCircle2 className="w-6 h-6" />
                    </div>
                 </div>
                 <h3 className="text-4xl font-bold text-slate-900 mb-1">98%</h3>
                 <p className="text-slate-500 font-medium">Taux de Recouvrement</p>
              </CardContent>
           </Card>
        </div>

        {/* Transactions Table */}
        <Card className="border-none shadow-xl rounded-[2rem] bg-white overflow-hidden">
           <CardHeader className="p-8 border-b border-slate-100 flex flex-row justify-between items-center">
              <CardTitle className="text-xl font-bold text-slate-800">Dernières Transactions</CardTitle>
              <div className="relative w-64">
                 <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                 <Input placeholder="Rechercher un élève..." className="pl-10 rounded-xl border-slate-100" />
              </div>
           </CardHeader>
           <CardContent className="p-0">
              <div className="overflow-x-auto">
                 <table className="w-full text-left">
                    <thead>
                       <tr className="bg-slate-50/50">
                          <th className="px-8 py-4 text-xs font-bold text-slate-400 uppercase tracking-widest">Élève</th>
                          <th className="px-8 py-4 text-xs font-bold text-slate-400 uppercase tracking-widest">Type de Frais</th>
                          <th className="px-8 py-4 text-xs font-bold text-slate-400 uppercase tracking-widest">Montant</th>
                          <th className="px-8 py-4 text-xs font-bold text-slate-400 uppercase tracking-widest">Date</th>
                          <th className="px-8 py-4 text-xs font-bold text-slate-400 uppercase tracking-widest">Statut</th>
                          <th className="px-8 py-4 text-xs font-bold text-slate-400 uppercase tracking-widest">Action</th>
                       </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100">
                       {loading ? (
                          <tr><td colSpan={6} className="p-10 text-center text-slate-400">Chargement...</td></tr>
                       ) : payments.map((payment) => (
                          <tr key={payment.id} className="hover:bg-slate-50/50 transition-colors group">
                             <td className="px-8 py-5">
                                <p className="font-bold text-slate-900">{payment.student?.user?.firstName} {payment.student?.user?.lastName}</p>
                                <p className="text-xs text-slate-400">{payment.student?.studentNumber}</p>
                             </td>
                             <td className="px-8 py-5 text-sm text-slate-600 font-medium">
                                {payment.paymentType}
                             </td>
                             <td className="px-8 py-5 font-bold text-slate-900">
                                {payment.amount.toLocaleString()} HTG
                             </td>
                             <td className="px-8 py-5 text-sm text-slate-500">
                                {new Date(payment.createdAt).toLocaleDateString()}
                             </td>
                             <td className="px-8 py-5">
                                <Badge className={`${
                                   payment.status === 'completed' ? 'bg-green-100 text-green-700' : 'bg-amber-100 text-amber-700'
                                } border-none font-bold`}>
                                   {payment.status === 'completed' ? 'Payé' : 'En attente'}
                                </Badge>
                             </td>
                             <td className="px-8 py-5">
                                <Button variant="ghost" size="icon" className="text-slate-300 hover:text-slate-600">
                                   <MoreHorizontal className="w-5 h-5" />
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
      <PaymentModal 
        isOpen={isModalOpen} 
        onClose={() => setIsModalOpen(false)} 
        onSuccess={fetchFinanceData} 
      />
    </AppLayout>
  );
}

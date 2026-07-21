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

      <div className="max-w-7xl mx-auto">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-6 mb-8 pb-6 border-b border-line">
          <div>
            <p className="kicker mb-2">Comptabilité</p>
            <h1 className="text-4xl md:text-5xl font-semibold text-ink tracking-tight mb-2">Finance & Comptabilité</h1>
            <p className="text-soft">Suivez les revenus et gérez les paiements des élèves.</p>
          </div>
          <div className="flex flex-wrap gap-3">
             <Button variant="outline" className="rounded-none h-12 px-6 border-line text-ink hover:bg-ink hover:text-paper mono text-xs uppercase tracking-widest flex gap-2">
                <Download className="w-4 h-4" /> Rapport PDF
             </Button>
             <Button
               onClick={() => setIsModalOpen(true)}
               className="bg-accent hover:bg-accent-ink text-paper rounded-none h-12 px-6 mono text-xs uppercase tracking-widest flex gap-2"
             >
                <Plus className="w-4 h-4" /> Enregistrer un Paiement
             </Button>
          </div>
        </div>

        {/* Financial Overview Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-px bg-line border border-line mb-8">
           <Card className="border-0 rounded-none bg-ink text-paper overflow-hidden">
              <CardContent className="p-6">
                 <div className="flex justify-between items-start mb-6">
                    <div className="p-3 border" style={{ borderColor: 'rgba(255,255,255,.15)' }}>
                       <TrendingUp className="w-6 h-6 text-accent" />
                    </div>
                    <Badge className="bg-transparent text-accent border border-line rounded-none mono text-xs px-2 py-1" style={{ borderColor: 'rgba(255,255,255,.15)' }}>+12.5%</Badge>
                 </div>
                 <h3 className="numeral text-4xl mb-1">{stats.totalRevenue.toLocaleString()}<span className="text-lg mono ml-2 text-soft">HTG</span></h3>
                 <p className="mono text-xs uppercase tracking-widest text-soft mt-2">Revenus Totaux Collectés</p>
              </CardContent>
           </Card>

           <Card className="border-0 rounded-none bg-paper overflow-hidden">
              <CardContent className="p-6">
                 <div className="flex justify-between items-start mb-6">
                    <div className="p-3 border border-line text-accent">
                       <AlertCircle className="w-6 h-6" />
                    </div>
                 </div>
                 <h3 className="numeral text-4xl text-ink mb-1">{stats.pendingAmount.toLocaleString()}<span className="text-lg mono text-soft ml-2">HTG</span></h3>
                 <p className="mono text-xs uppercase tracking-widest text-soft mt-2">Paiements en Attente</p>
              </CardContent>
           </Card>

           <Card className="border-0 rounded-none bg-paper overflow-hidden">
              <CardContent className="p-6">
                 <div className="flex justify-between items-start mb-6">
                    <div className="p-3 border border-line text-ink">
                       <CheckCircle2 className="w-6 h-6" />
                    </div>
                 </div>
                 <h3 className="numeral text-4xl text-ink mb-1">98%</h3>
                 <p className="mono text-xs uppercase tracking-widest text-soft mt-2">Taux de Recouvrement</p>
              </CardContent>
           </Card>
        </div>

        {/* Transactions Table */}
        <Card className="border border-line rounded-none bg-paper overflow-hidden">
           <CardHeader className="p-6 border-b border-line flex flex-col md:flex-row gap-4 justify-between items-start md:items-center">
              <CardTitle className="text-lg font-semibold text-ink">Dernières Transactions</CardTitle>
              <div className="relative w-full md:w-64">
                 <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-soft z-10" />
                 <Input placeholder="Rechercher un élève..." className="pl-10 rounded-none border-line" />
              </div>
           </CardHeader>
           <CardContent className="p-0">
              <div className="overflow-x-auto">
                 <table className="w-full text-left">
                    <thead>
                       <tr className="border-b border-line">
                          <th className="px-6 py-4 mono text-xs font-medium text-soft uppercase tracking-widest">Élève</th>
                          <th className="px-6 py-4 mono text-xs font-medium text-soft uppercase tracking-widest">Type de Frais</th>
                          <th className="px-6 py-4 mono text-xs font-medium text-soft uppercase tracking-widest">Montant</th>
                          <th className="px-6 py-4 mono text-xs font-medium text-soft uppercase tracking-widest">Date</th>
                          <th className="px-6 py-4 mono text-xs font-medium text-soft uppercase tracking-widest">Statut</th>
                          <th className="px-6 py-4 mono text-xs font-medium text-soft uppercase tracking-widest">Action</th>
                       </tr>
                    </thead>
                    <tbody>
                       {loading ? (
                          <tr><td colSpan={6} className="p-10 text-center text-soft mono text-xs uppercase tracking-widest">Chargement...</td></tr>
                       ) : payments.map((payment) => (
                          <tr key={payment.id} className="border-b border-line hover:bg-panel transition-colors">
                             <td className="px-6 py-4">
                                <p className="font-semibold text-ink">{payment.student?.user?.firstName} {payment.student?.user?.lastName}</p>
                                <p className="mono text-xs text-soft">{payment.student?.studentNumber}</p>
                             </td>
                             <td className="px-6 py-4 text-sm text-ink">
                                {payment.paymentType}
                             </td>
                             <td className="px-6 py-4 numeral text-base text-ink">
                                {payment.amount.toLocaleString()} HTG
                             </td>
                             <td className="px-6 py-4 text-sm text-soft">
                                {new Date(payment.createdAt).toLocaleDateString()}
                             </td>
                             <td className="px-6 py-4">
                                <Badge className={`${
                                   payment.status === 'completed' ? 'bg-ink text-paper' : 'bg-panel text-ink'
                                } border border-line rounded-none mono text-xs uppercase`}>
                                   {payment.status === 'completed' ? 'Payé' : 'En attente'}
                                </Badge>
                             </td>
                             <td className="px-6 py-4">
                                <Button variant="ghost" size="icon" className="rounded-none text-soft hover:text-accent">
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

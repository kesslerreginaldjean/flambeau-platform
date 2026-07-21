import { useState, useEffect } from 'react';
import Head from 'next/head';
import AppLayout from '@/components/layout/AppLayout';
import { STUDENT_NAV_ITEMS } from '@/constants/navigation';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
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

  if (loading) return <div className="p-20 text-center mono text-sm uppercase tracking-widest text-soft">Accès à vos services financiers...</div>;

  return (
    <AppLayout navItems={STUDENT_NAV_ITEMS} userName="Étudiant" userRoleLabel="Services Financiers">
      <Head><title>Paiements & Scolarité | Le Flambeau</title></Head>

      <div className="max-w-6xl mx-auto">
        <div className="mb-8">
          <h2 className="text-ink flex items-center gap-3">
            <BadgeDollarSign className="w-9 h-9 text-accent" />
            Suivi de Scolarité
          </h2>
          <p className="mono text-xs uppercase tracking-widest text-soft mt-2">Gérez vos frais académiques en toute transparence.</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-px bg-line border border-line mb-8">
          <div className="bg-paper p-6">
            <div className="w-12 h-12 border border-line flex items-center justify-center text-ink mb-4">
              <CheckCircle2 className="w-6 h-6" />
            </div>
            <p className="mono text-xs uppercase tracking-widest text-soft">Total Payé</p>
            <p className="numeral text-3xl text-ink mt-2">{totalPaid.toLocaleString()} <span className="text-sm text-soft">HTG</span></p>
          </div>

          <div className="bg-paper p-6">
            <div className="w-12 h-12 border border-line flex items-center justify-center text-accent mb-4">
              <Clock className="w-6 h-6" />
            </div>
            <p className="mono text-xs uppercase tracking-widest text-soft">En attente</p>
            <p className="numeral text-3xl text-accent mt-2">{totalPending.toLocaleString()} <span className="text-sm text-soft">HTG</span></p>
          </div>

          <div className="bg-ink text-paper p-6">
            <CreditCard className="w-10 h-10 text-paper/70 mb-4" />
            <p className="mono text-xs uppercase tracking-widest text-paper/60">Prochaine Échéance</p>
            <p className="numeral text-2xl mt-2">15 Juin 2026</p>
          </div>
        </div>

        <Card className="border border-line">
          <CardHeader className="p-6 border-b border-line">
            <div className="flex justify-between items-center">
              <CardTitle className="text-ink flex items-center gap-3">
                <History className="w-6 h-6 text-accent" />
                Historique des Transactions
              </CardTitle>
              <Button variant="outline" className="gap-2">
                <Download className="w-4 h-4" /> Exporter relevé
              </Button>
            </div>
          </CardHeader>
          <CardContent className="p-0">
            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="border-b border-line">
                    <th className="px-6 py-4 mono text-xs uppercase tracking-widest text-soft">Désignation</th>
                    <th className="px-6 py-4 mono text-xs uppercase tracking-widest text-soft">Date</th>
                    <th className="px-6 py-4 mono text-xs uppercase tracking-widest text-soft">Montant</th>
                    <th className="px-6 py-4 mono text-xs uppercase tracking-widest text-soft">Statut</th>
                    <th className="px-6 py-4 mono text-xs uppercase tracking-widest text-soft text-right">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {payments.length > 0 ? payments.map((p: any) => (
                    <tr key={p.id} className="border-b border-line">
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-4">
                          <div className="w-10 h-10 border border-line flex items-center justify-center text-soft">
                            <Info className="w-5 h-5" />
                          </div>
                          <div>
                            <p className="text-sm font-medium text-ink">{p.paymentType}</p>
                            <p className="mono text-xs uppercase tracking-widest text-soft mt-1">{p.academicYear?.name}</p>
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4 mono text-sm text-soft">
                        {new Date(p.createdAt).toLocaleDateString('fr-FR', { day: 'numeric', month: 'long', year: 'numeric' })}
                      </td>
                      <td className="px-6 py-4 numeral text-base text-ink">
                        {p.amount.toLocaleString()} HTG
                      </td>
                      <td className="px-6 py-4">
                        {p.status === 'completed' ? (
                          <span className="mono text-xs uppercase tracking-widest text-ink border border-line px-3 py-1">Payé</span>
                        ) : p.status === 'partial' ? (
                          <span className="mono text-xs uppercase tracking-widest text-accent border border-line px-3 py-1">Partiel</span>
                        ) : (
                          <span className="mono text-xs uppercase tracking-widest text-accent border border-accent px-3 py-1">En attente</span>
                        )}
                      </td>
                      <td className="px-6 py-4 text-right">
                        <Button variant="ghost" size="sm" className="text-accent">
                          Reçu PDF
                        </Button>
                      </td>
                    </tr>
                  )) : (
                    <tr>
                      <td colSpan={5} className="py-20 text-center mono text-xs uppercase tracking-widest text-soft">
                        Aucune transaction enregistrée.
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </CardContent>
        </Card>

        <div className="mt-8 p-6 border border-line bg-panel flex items-start gap-6">
          <div className="w-12 h-12 border border-line bg-paper flex items-center justify-center text-accent shrink-0">
            <AlertTriangle className="w-6 h-6" />
          </div>
          <div>
            <h4 className="text-ink font-medium mb-1">Information importante</h4>
            <p className="text-sm text-soft leading-relaxed">
              Les paiements par virement bancaire peuvent prendre jusqu'à 48h avant d'apparaître sur votre portail.
              Pour toute réclamation, veuillez contacter le service comptabilité muni de votre preuve de paiement.
            </p>
          </div>
        </div>
      </div>
    </AppLayout>
  );
}

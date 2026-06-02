import React, { useState, useEffect } from 'react';
import { X, Search, Check, AlertCircle, CheckCircle2 } from 'lucide-react';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

import { authFetch } from "@/lib/authFetch";
interface PaymentModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: () => void;
}

export default function PaymentModal({ isOpen, onClose, onSuccess }: PaymentModalProps) {
  const [students, setStudents] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const [search, setSearch] = useState('');
  const [selectedStudent, setSelectedStudent] = useState<any>(null);
  
  const [formData, setFormData] = useState({
    amount: '',
    paymentType: 'Scolarité',
    status: 'completed',
    dueDate: new Date().toISOString().split('T')[0],
    notes: ''
  });

  useEffect(() => {
    if (isOpen) {
      fetchStudents();
    }
  }, [isOpen]);

  const fetchStudents = async () => {
    try {
      const res = await authFetch('/api/admin/users'); // This might need filtering by role
      const data = await res.json();
      setStudents(data.filter((u: any) => u.role === 'student'));
    } catch (err) {
      console.error(err);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedStudent) return alert("Veuillez sélectionner un élève");

    setLoading(true);
    try {
      const res = await authFetch('/api/admin/payments', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          studentId: selectedStudent.student?.id,
          ...formData,
          amount: parseFloat(formData.amount)
        })
      });

      if (res.ok) {
        onSuccess();
        onClose();
        setSelectedStudent(null);
        setFormData({
          amount: '',
          paymentType: 'Scolarité',
          status: 'completed',
          dueDate: new Date().toISOString().split('T')[0],
          notes: ''
        });
      }
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  if (!isOpen) return null;

  const filteredStudents = students.filter(s => 
    `${s.firstName} ${s.lastName}`.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="fixed inset-0 z-[150] flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm animate-in fade-in duration-300">
      <div className="bg-white rounded-[2.5rem] shadow-2xl w-full max-w-xl overflow-hidden animate-in zoom-in-95 duration-300">
        <div className="p-8 border-b border-slate-100 flex justify-between items-center bg-slate-50/50">
          <div>
            <h2 className="text-2xl font-black text-slate-900">Enregistrer un Paiement</h2>
            <p className="text-sm text-slate-500 font-medium">Saisissez les détails de la transaction.</p>
          </div>
          <button onClick={onClose} className="p-3 hover:bg-white rounded-2xl transition-colors shadow-sm text-slate-400 hover:text-slate-600">
            <X className="w-6 h-6" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-8 space-y-6">
          {/* Sélection de l'élève */}
          {!selectedStudent ? (
            <div className="space-y-3">
              <label className="text-xs font-black uppercase tracking-widest text-slate-400">Rechercher l'élève</label>
              <div className="relative">
                <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                <Input 
                  placeholder="Nom ou prénom..." 
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  className="pl-12 h-14 rounded-2xl bg-slate-50 border-none shadow-inner"
                />
              </div>
              <div className="max-h-40 overflow-y-auto space-y-2 pr-2">
                {filteredStudents.map(s => (
                  <button
                    key={s.id}
                    type="button"
                    onClick={() => setSelectedStudent(s)}
                    className="w-full p-4 rounded-2xl bg-slate-50 hover:bg-[#FFF8E7] text-left transition-all flex items-center justify-between group"
                  >
                    <div>
                      <p className="font-bold text-slate-900">{s.firstName} {s.lastName}</p>
                      <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">{s.student?.studentNumber}</p>
                    </div>
                    <Check className="w-5 h-5 text-[#D32D3F] opacity-0 group-hover:opacity-100 transition-opacity" />
                  </button>
                ))}
              </div>
            </div>
          ) : (
            <div className="p-4 rounded-2xl bg-[#FFF8E7] border border-[#FDE68A] flex items-center justify-between">
              <div className="flex items-center gap-4">
                <div className="w-10 h-10 rounded-xl bg-white flex items-center justify-center font-black text-[#D32D3F]">
                  {selectedStudent.firstName[0]}{selectedStudent.lastName[0]}
                </div>
                <div>
                  <p className="font-bold text-slate-900">{selectedStudent.firstName} {selectedStudent.lastName}</p>
                  <p className="text-[10px] font-black text-amber-700 uppercase tracking-widest">Élève Sélectionné</p>
                </div>
              </div>
              <button 
                type="button"
                onClick={() => setSelectedStudent(null)}
                className="text-xs font-black text-amber-700 underline"
              >
                Changer
              </button>
            </div>
          )}

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <label className="text-xs font-black uppercase tracking-widest text-slate-400 pl-1">Montant (HTG)</label>
              <Input 
                type="number" 
                required
                value={formData.amount}
                onChange={(e) => setFormData({...formData, amount: e.target.value})}
                placeholder="25000" 
                className="h-14 rounded-2xl bg-slate-50 border-none shadow-inner"
              />
            </div>
            <div className="space-y-2">
              <label className="text-xs font-black uppercase tracking-widest text-slate-400 pl-1">Type</label>
              <select 
                className="w-full h-14 rounded-2xl bg-slate-50 border-none shadow-inner px-4 font-bold text-slate-900 outline-none"
                value={formData.paymentType}
                onChange={(e) => setFormData({...formData, paymentType: e.target.value})}
              >
                <option>Scolarité</option>
                <option>Inscription</option>
                <option>Examen</option>
                <option>Cantine</option>
                <option>Transport</option>
                <option>Uniforme</option>
              </select>
            </div>
          </div>

          <div className="space-y-2">
            <label className="text-xs font-black uppercase tracking-widest text-slate-400 pl-1">Statut</label>
            <div className="flex gap-4">
              <button
                type="button"
                onClick={() => setFormData({...formData, status: 'completed'})}
                className={`flex-1 h-14 rounded-2xl flex items-center justify-center gap-2 font-bold transition-all ${
                  formData.status === 'completed' ? 'bg-green-500 text-white shadow-lg shadow-green-500/30' : 'bg-slate-50 text-slate-400'
                }`}
              >
                <CheckCircle2 className="w-5 h-5" /> Payé
              </button>
              <button
                type="button"
                onClick={() => setFormData({...formData, status: 'pending'})}
                className={`flex-1 h-14 rounded-2xl flex items-center justify-center gap-2 font-bold transition-all ${
                  formData.status === 'pending' ? 'bg-amber-500 text-white shadow-lg shadow-amber-500/30' : 'bg-slate-50 text-slate-400'
                }`}
              >
                <AlertCircle className="w-5 h-5" /> En attente
              </button>
            </div>
          </div>

          <div className="space-y-2">
            <label className="text-xs font-black uppercase tracking-widest text-slate-400 pl-1">Notes (Optionnel)</label>
            <Input 
              value={formData.notes}
              onChange={(e) => setFormData({...formData, notes: e.target.value})}
              placeholder="Ex: Paiement Janvier" 
              className="h-14 rounded-2xl bg-slate-50 border-none shadow-inner"
            />
          </div>

          <Button 
            disabled={loading}
            className="w-full h-16 bg-[#D32D3F] hover:bg-[#8B1A26] text-white rounded-2xl font-black uppercase tracking-widest shadow-xl shadow-[#D32D3F]/20"
          >
            {loading ? 'Enregistrement...' : 'Confirmer le Paiement'}
          </Button>
        </form>
      </div>
    </div>
  );
}

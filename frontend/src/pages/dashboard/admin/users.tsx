import React, { useState, useEffect } from 'react';
import Head from 'next/head';
import AppLayout from '@/components/layout/AppLayout';
import { 
  Plus, Trash2, User, Shield, GraduationCap as StudentIcon, FileText
} from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";

import { ADMIN_NAV_ITEMS } from '@/constants/navigation';


import { authFetch } from "@/lib/authFetch";
export default function UserManagement() {
  const [users, setUsers] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  
  // Form State
  const [formData, setFormData] = useState({
    email: '',
    password: '', // Audit fix: no default password — admin must set one explicitly (min 10 chars).
    firstName: '',
    lastName: '',
    role: 'student',
    phone: '',
    address: '',
    dateOfBirth: '',
    gender: 'M',
    studentData: {
      classLevel: 'NS4 (Terminale)',
      className: 'A'
    },
    teacherData: {
      subject: ''
    },
    parentData: {
      occupation: ''
    }
  });

  const fetchUsers = async () => {
    try {
      const response = await authFetch('/api/admin/users');
      const data = await response.json();
      if (Array.isArray(data)) {
        setUsers(data);
      } else {
        console.error('Expected array of users, got:', data);
        setUsers([]);
      }
    } catch (error) {
      console.error('Failed to fetch users:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  const handleCreateUser = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const response = await authFetch('/api/admin/users', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData)
      });
      if (response.ok) {
        setIsModalOpen(false);
        fetchUsers();
        alert('Utilisateur créé avec succès !');
      }
    } catch (error) {
      alert('Erreur lors de la création');
    }
  };

  const handleDeleteUser = async (id: string) => {
    if (!confirm('Supprimer cet utilisateur ?')) return;
    try {
      await authFetch(`/api/admin/users/${id}`, { method: 'DELETE' });
      fetchUsers();
    } catch (error) {
      alert('Erreur lors de la suppression');
    }
  };

  const handleImportCSV = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = async (event) => {
      const text = event.target?.result as string;
      const lines = text.split('\n');
      const headers = lines[0].split(',').map(h => h.trim());
      
      const parsedUsers = lines.slice(1).filter(l => l.trim() !== '').map(line => {
        const values = line.split(',').map(v => v.trim());
        const user: any = {};
        headers.forEach((header, index) => {
          // Map French headers to English keys
          const key = 
            header.toLowerCase() === 'prénom' ? 'firstName' :
            header.toLowerCase() === 'nom' ? 'lastName' :
            header.toLowerCase() === 'email' ? 'email' :
            header.toLowerCase() === 'rôle' ? 'role' :
            header.toLowerCase() === 'niveau' ? 'classLevel' :
            header.toLowerCase() === 'salle' ? 'className' :
            header.toLowerCase() === 'genre' ? 'gender' :
            header.toLowerCase() === 'téléphone' ? 'phone' : header;
          user[key] = values[index];
        });
        return user;
      });

      try {
        const response = await authFetch('/api/admin/users/import', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ users: parsedUsers })
        });
        if (response.ok) {
          alert('Importation réussie !');
          fetchUsers();
        }
      } catch (error) {
        alert('Erreur lors de l\'importation');
      }
    };
    reader.readAsText(file);
  };

  return (
    <AppLayout navItems={ADMIN_NAV_ITEMS} userName="Admin Flambeau" userRoleLabel="Administrateur">
      <Head>
        <title>Gestion des Comptes | CLF</title>
      </Head>

      <div className="p-6">
        <div className="flex justify-between items-center mb-8">
          <div>
            <h1 className="text-3xl font-extrabold text-slate-900 tracking-tight">Gestion des Comptes</h1>
            <p className="text-slate-500 font-medium">Créez et gérez les accès des étudiants, profs et parents.</p>
          </div>
          <div className="flex gap-3">
            <div className="relative">
              <input 
                type="file" 
                accept=".csv" 
                onChange={handleImportCSV} 
                className="absolute inset-0 opacity-0 cursor-pointer z-10" 
              />
              <Button 
                variant="outline"
                className="border-slate-200 text-slate-600 rounded-xl px-6 py-6 h-auto shadow-sm flex gap-2 font-bold"
              >
                <FileText className="w-5 h-5 text-slate-400" /> Importer CSV
              </Button>
            </div>
            <Button 
              onClick={() => setIsModalOpen(true)}
              className="bg-[#D32D3F] hover:bg-[#8B1A26] text-white rounded-xl px-6 py-6 h-auto shadow-lg shadow-[#D32D3F]/20 flex gap-2 font-bold"
            >
              <Plus className="w-5 h-5" /> Nouveau Compte
            </Button>
          </div>
        </div>

        {/* Users Table */}
        <Card className="border-none shadow-xl rounded-[2rem] overflow-hidden bg-white">
          <CardHeader className="bg-slate-50 border-b border-slate-100">
            <CardTitle className="text-lg font-bold text-slate-800">Liste des utilisateurs</CardTitle>
          </CardHeader>
          <CardContent className="p-0">
            <div className="overflow-x-auto">
              <table className="w-full text-left">
                <thead>
                  <tr className="border-b border-slate-100 bg-slate-50/50">
                    <th className="px-6 py-4 text-xs font-bold text-slate-400 uppercase tracking-widest">Utilisateur</th>
                    <th className="px-6 py-4 text-xs font-bold text-slate-400 uppercase tracking-widest">Rôle</th>
                    <th className="px-6 py-4 text-xs font-bold text-slate-400 uppercase tracking-widest">Détails</th>
                    <th className="px-6 py-4 text-xs font-bold text-slate-400 uppercase tracking-widest">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-50">
                  {loading ? (
                    <tr><td colSpan={4} className="p-10 text-center text-slate-400">Chargement...</td></tr>
                  ) : (Array.isArray(users) ? users : []).map((user) => (
                    <tr key={user.id} className="hover:bg-slate-50/50 transition-colors group">
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-3">
                          <div className="w-10 h-10 rounded-full bg-[#FFF8E7] flex items-center justify-center text-[#D32D3F] font-bold">
                            {user.firstName[0]}{user.lastName[0]}
                          </div>
                          <div>
                            <p className="font-bold text-slate-900">{user.firstName} {user.lastName}</p>
                            <p className="text-xs text-slate-500">{user.email}</p>
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <Badge className={`${
                          user.role === 'admin' ? 'bg-purple-100 text-purple-700' :
                          user.role === 'teacher' ? 'bg-blue-100 text-blue-700' :
                          user.role === 'student' ? 'bg-amber-100 text-amber-700' :
                          'bg-slate-100 text-slate-700'
                        } border-none font-bold capitalize`}>
                          {user.role}
                        </Badge>
                      </td>
                      <td className="px-6 py-4">
                        {user.student ? (
                          <div className="text-xs text-slate-500 font-medium">
                            <p>{user.student.classLevel} {user.student.className}</p>
                            <p className="text-[10px] opacity-60">ID: {user.student.studentNumber}</p>
                          </div>
                        ) : (
                          <span className="text-xs text-slate-400 italic">N/A</span>
                        )}
                      </td>
                      <td className="px-6 py-4">
                        <Button 
                          variant="ghost" 
                          size="icon" 
                          onClick={() => {
                            // Sécurité : Empêcher de supprimer l'admin actuellement connecté
                            const currentAdminId = localStorage.getItem('user_id');
                            if (user.id === currentAdminId) {
                               alert("Vous ne pouvez pas supprimer votre propre compte administrateur.");
                               return;
                            }
                            handleDeleteUser(user.id);
                          }}
                          className="text-slate-400 hover:text-white hover:bg-red-500 rounded-xl transition-all h-10 w-10 shadow-sm hover:shadow-red-200"
                          title="Supprimer l'utilisateur"
                        >
                          <Trash2 className="w-5 h-5" />
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

      {/* Create User Modal - Simple Simulation */}
      {isModalOpen && (
        <div className="fixed inset-0 bg-slate-900/50 backdrop-blur-sm z-[100] flex items-center justify-center p-4">
          <Card className="w-full max-w-lg border-none shadow-2xl rounded-[2.5rem] overflow-hidden flex flex-col max-h-[95vh]">
            <CardHeader className="bg-[#D32D3F] text-white p-6 flex-shrink-0">
              <CardTitle className="text-2xl font-bold">Créer un nouveau compte</CardTitle>
            </CardHeader>
            <CardContent className="p-8 space-y-6 bg-white overflow-y-auto custom-scrollbar">
              <form onSubmit={handleCreateUser} className="space-y-6">
                <div className="space-y-4">
                  <p className="text-xs font-extrabold text-slate-400 uppercase tracking-widest border-b pb-2">Informations Personnelles</p>
                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-1">
                      <label className="text-xs font-bold text-slate-500">Prénom</label>
                      <Input placeholder="Prénom" value={formData.firstName} onChange={e => setFormData({...formData, firstName: e.target.value})} required />
                    </div>
                    <div className="space-y-1">
                      <label className="text-xs font-bold text-slate-500">Nom</label>
                      <Input placeholder="Nom" value={formData.lastName} onChange={e => setFormData({...formData, lastName: e.target.value})} required />
                    </div>
                  </div>
                  
                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-1">
                      <label className="text-xs font-bold text-slate-500">Date de Naissance</label>
                      <Input type="date" value={formData.dateOfBirth} onChange={e => setFormData({...formData, dateOfBirth: e.target.value})} />
                    </div>
                    <div className="space-y-1">
                      <label className="text-xs font-bold text-slate-500">Genre</label>
                      <select className="w-full h-10 px-3 py-2 bg-white border border-slate-200 rounded-md text-sm" value={formData.gender} onChange={e => setFormData({...formData, gender: e.target.value})}>
                        <option value="M">Masculin</option>
                        <option value="F">Féminin</option>
                      </select>
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-1">
                      <label className="text-xs font-bold text-slate-500">Téléphone</label>
                      <Input placeholder="+509 ..." value={formData.phone} onChange={e => setFormData({...formData, phone: e.target.value})} />
                    </div>
                    <div className="space-y-1">
                      <label className="text-xs font-bold text-slate-500">Email</label>
                      <Input type="email" placeholder="email@collegeflambeau.edu" value={formData.email} onChange={e => setFormData({...formData, email: e.target.value})} required />
                    </div>
                  </div>

                  <div className="space-y-1">
                    <label className="text-xs font-bold text-slate-500">Adresse</label>
                    <Input placeholder="Adresse complète" value={formData.address} onChange={e => setFormData({...formData, address: e.target.value})} />
                  </div>
                </div>

                <div className="space-y-4">
                  <p className="text-xs font-extrabold text-slate-400 uppercase tracking-widest border-b pb-2">Rôle & Accès</p>
                  <div className="space-y-1">
                    <label className="text-xs font-bold text-slate-500">Rôle de l'utilisateur</label>
                    <select 
                      className="w-full h-10 px-3 py-2 bg-[#FDE68A]/20 border border-[#FDE68A] rounded-md text-sm font-bold text-slate-800"
                      value={formData.role}
                      onChange={e => setFormData({...formData, role: e.target.value})}
                    >
                      <option value="student">Étudiant</option>
                      <option value="teacher">Professeur</option>
                      <option value="parent">Parent</option>
                      <option value="admin">Administrateur</option>
                    </select>
                  </div>

                  {formData.role === 'student' && (
                    <div className="p-4 bg-amber-50 border border-amber-100 rounded-2xl space-y-3">
                        <p className="text-xs font-bold text-amber-700 uppercase tracking-widest flex items-center gap-2">
                          <StudentIcon className="w-4 h-4" /> Détails Scolaires
                        </p>
                        <div className="grid grid-cols-2 gap-3">
                          <div className="space-y-1">
                            <label className="text-[10px] font-bold text-amber-600 uppercase">Niveau Scolaire</label>
                            <select 
                              className="w-full h-10 px-3 py-2 bg-white border border-amber-200 rounded-md text-sm font-semibold"
                              value={formData.studentData.classLevel} 
                              onChange={e => setFormData({...formData, studentData: {...formData.studentData, classLevel: e.target.value}})}
                            >
                              <optgroup label="Le Jardin Vert de Cassandre">
                                <option value="1ère Année Maternelle">1ère Année Maternelle</option>
                                <option value="2ème Année Maternelle">2ème Année Maternelle</option>
                                <option value="3ème Année Maternelle">3ème Année Maternelle</option>
                              </optgroup>
                              <optgroup label="Cycle Fondamental">
                                <option value="1ère AF">1ère AF</option>
                                <option value="2ème AF">2ème AF</option>
                                <option value="3ème AF">3ème AF</option>
                                <option value="4ème AF">4ème AF</option>
                                <option value="5ème AF">5ème AF</option>
                                <option value="6ème AF">6ème AF</option>
                                <option value="7ème AF">7ème AF</option>
                                <option value="8ème AF">8ème AF</option>
                                <option value="9ème AF">9ème AF</option>
                              </optgroup>
                              <optgroup label="Nouveau Secondaire">
                                <option value="NS1">NS1</option>
                                <option value="NS2">NS2</option>
                                <option value="NS3">NS3</option>
                                <option value="NS4 (Terminale)">NS4 (Terminale)</option>
                              </optgroup>
                            </select>
                          </div>
                          <div className="space-y-1">
                            <label className="text-[10px] font-bold text-amber-600 uppercase">Section / Salle</label>
                            <Input placeholder="Classe (ex: A)" value={formData.studentData.className} onChange={e => setFormData({...formData, studentData: {...formData.studentData, className: e.target.value}})} />
                          </div>
                        </div>
                    </div>
                  )}

                  {formData.role === 'teacher' && (
                    <div className="p-4 bg-blue-50 border border-blue-100 rounded-2xl space-y-3">
                        <p className="text-xs font-bold text-blue-700 uppercase tracking-widest flex items-center gap-2">
                          <Shield className="w-4 h-4" /> Détails Professionnels
                        </p>
                        <Input placeholder="Matière enseignée (ex: Mathématiques)" value={formData.teacherData.subject} onChange={e => setFormData({...formData, teacherData: {subject: e.target.value}})} />
                    </div>
                  )}

                  {formData.role === 'parent' && (
                    <div className="p-4 bg-purple-50 border border-purple-100 rounded-2xl space-y-3">
                        <p className="text-xs font-bold text-purple-700 uppercase tracking-widest flex items-center gap-2">
                          <User className="w-4 h-4" /> Détails Parentaux
                        </p>
                        <Input placeholder="Occupation (ex: Commerçant)" value={formData.parentData.occupation} onChange={e => setFormData({...formData, parentData: {occupation: e.target.value}})} />
                    </div>
                  )}
                </div>

                <div className="flex gap-3 pt-6">
                  <Button type="button" variant="ghost" onClick={() => setIsModalOpen(false)} className="flex-1 rounded-xl font-bold h-12">Annuler</Button>
                  <Button type="submit" className="flex-1 bg-[#D32D3F] hover:bg-[#8B1A26] text-white rounded-xl font-bold h-12 shadow-lg shadow-[#D32D3F]/20">Créer le compte</Button>
                </div>
              </form>
            </CardContent>
          </Card>
        </div>
      )}
    </AppLayout>
  );
}

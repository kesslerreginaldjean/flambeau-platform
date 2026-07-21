import React, { useState, useEffect } from 'react';
import Head from 'next/head';
import AppLayout from '@/components/layout/AppLayout';
import {
  Plus, Trash2, User, Shield, GraduationCap as StudentIcon, FileText, X
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

      <div>
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8 gap-4 border-b border-line pb-6">
          <div>
            <p className="kicker mb-2">Administration</p>
            <h1 className="text-3xl font-semibold text-ink tracking-tight">Gestion des Comptes</h1>
            <p className="text-soft mt-1">Créez et gérez les accès des étudiants, profs et parents.</p>
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
                className="border border-line text-ink flex gap-2"
              >
                <FileText className="w-5 h-5 text-soft" /> Importer CSV
              </Button>
            </div>
            <Button
              onClick={() => setIsModalOpen(true)}
              className="bg-accent hover:bg-accent-ink text-paper flex gap-2"
            >
              <Plus className="w-5 h-5" /> Nouveau Compte
            </Button>
          </div>
        </div>

        {/* Users Table */}
        <Card className="bg-paper">
          <CardHeader className="border-b border-line">
            <CardTitle className="mono text-xs uppercase tracking-widest text-soft">Liste des utilisateurs</CardTitle>
          </CardHeader>
          <CardContent className="p-0">
            <div className="overflow-x-auto">
              <table className="w-full text-left">
                <thead>
                  <tr className="border-b border-line">
                    <th className="px-6 py-4 mono text-xs uppercase tracking-widest text-soft">Utilisateur</th>
                    <th className="px-6 py-4 mono text-xs uppercase tracking-widest text-soft">Rôle</th>
                    <th className="px-6 py-4 mono text-xs uppercase tracking-widest text-soft">Détails</th>
                    <th className="px-6 py-4 mono text-xs uppercase tracking-widest text-soft">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-line">
                  {loading ? (
                    <tr><td colSpan={4} className="p-10 text-center mono text-xs uppercase tracking-widest text-soft animate-pulse">Chargement...</td></tr>
                  ) : (Array.isArray(users) ? users : []).map((user) => (
                    <tr key={user.id} className="hover:bg-panel transition-colors group">
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-3">
                          <div className="w-10 h-10 border border-line bg-panel flex items-center justify-center text-accent mono text-sm">
                            {user.firstName[0]}{user.lastName[0]}
                          </div>
                          <div>
                            <p className="font-medium text-ink">{user.firstName} {user.lastName}</p>
                            <p className="text-xs text-soft">{user.email}</p>
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <Badge className="mono text-xs uppercase tracking-widest text-ink">
                          {user.role}
                        </Badge>
                      </td>
                      <td className="px-6 py-4">
                        {user.student ? (
                          <div className="text-xs text-soft">
                            <p>{user.student.classLevel} {user.student.className}</p>
                            <p className="mono text-[10px] opacity-60">ID: {user.student.studentNumber}</p>
                          </div>
                        ) : (
                          <span className="text-xs text-soft italic">N/A</span>
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
                          className="text-soft hover:text-paper hover:bg-accent transition-colors h-10 w-10"
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
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4" style={{ background: 'rgba(17,19,21,.6)' }}>
          <Card className="w-full max-w-lg bg-paper flex flex-col max-h-[95vh]">
            <CardHeader className="bg-ink text-paper p-6 flex-shrink-0 flex flex-row items-center justify-between">
              <CardTitle className="text-2xl font-semibold">Créer un nouveau compte</CardTitle>
              <button onClick={() => setIsModalOpen(false)} className="text-paper hover:text-accent transition-colors">
                <X className="w-5 h-5" />
              </button>
            </CardHeader>
            <CardContent className="p-8 space-y-6 bg-paper overflow-y-auto">
              <form onSubmit={handleCreateUser} className="space-y-6">
                <div className="space-y-4">
                  <p className="mono text-xs uppercase tracking-widest text-soft border-b border-line pb-2">Informations Personnelles</p>
                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-1">
                      <label className="mono text-xs uppercase tracking-widest text-soft">Prénom</label>
                      <Input placeholder="Prénom" value={formData.firstName} onChange={e => setFormData({...formData, firstName: e.target.value})} required />
                    </div>
                    <div className="space-y-1">
                      <label className="mono text-xs uppercase tracking-widest text-soft">Nom</label>
                      <Input placeholder="Nom" value={formData.lastName} onChange={e => setFormData({...formData, lastName: e.target.value})} required />
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-1">
                      <label className="mono text-xs uppercase tracking-widest text-soft">Date de Naissance</label>
                      <Input type="date" value={formData.dateOfBirth} onChange={e => setFormData({...formData, dateOfBirth: e.target.value})} />
                    </div>
                    <div className="space-y-1">
                      <label className="mono text-xs uppercase tracking-widest text-soft">Genre</label>
                      <select className="w-full border border-line bg-paper text-sm" value={formData.gender} onChange={e => setFormData({...formData, gender: e.target.value})}>
                        <option value="M">Masculin</option>
                        <option value="F">Féminin</option>
                      </select>
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-1">
                      <label className="mono text-xs uppercase tracking-widest text-soft">Téléphone</label>
                      <Input placeholder="+509 ..." value={formData.phone} onChange={e => setFormData({...formData, phone: e.target.value})} />
                    </div>
                    <div className="space-y-1">
                      <label className="mono text-xs uppercase tracking-widest text-soft">Email</label>
                      <Input type="email" placeholder="email@collegeflambeau.edu" value={formData.email} onChange={e => setFormData({...formData, email: e.target.value})} required />
                    </div>
                  </div>

                  <div className="space-y-1">
                    <label className="mono text-xs uppercase tracking-widest text-soft">Adresse</label>
                    <Input placeholder="Adresse complète" value={formData.address} onChange={e => setFormData({...formData, address: e.target.value})} />
                  </div>
                </div>

                <div className="space-y-4">
                  <p className="mono text-xs uppercase tracking-widest text-soft border-b border-line pb-2">Rôle & Accès</p>
                  <div className="space-y-1">
                    <label className="mono text-xs uppercase tracking-widest text-soft">Rôle de l'utilisateur</label>
                    <select
                      className="w-full border border-line bg-paper text-sm font-medium text-ink"
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
                    <div className="p-4 border border-line bg-panel space-y-3">
                        <p className="mono text-xs uppercase tracking-widest text-accent flex items-center gap-2">
                          <StudentIcon className="w-4 h-4" /> Détails Scolaires
                        </p>
                        <div className="grid grid-cols-2 gap-3">
                          <div className="space-y-1">
                            <label className="mono text-[10px] uppercase tracking-widest text-soft">Niveau Scolaire</label>
                            <select
                              className="w-full border border-line bg-paper text-sm font-medium"
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
                            <label className="mono text-[10px] uppercase tracking-widest text-soft">Section / Salle</label>
                            <Input placeholder="Classe (ex: A)" value={formData.studentData.className} onChange={e => setFormData({...formData, studentData: {...formData.studentData, className: e.target.value}})} />
                          </div>
                        </div>
                    </div>
                  )}

                  {formData.role === 'teacher' && (
                    <div className="p-4 border border-line bg-panel space-y-3">
                        <p className="mono text-xs uppercase tracking-widest text-accent flex items-center gap-2">
                          <Shield className="w-4 h-4" /> Détails Professionnels
                        </p>
                        <Input placeholder="Matière enseignée (ex: Mathématiques)" value={formData.teacherData.subject} onChange={e => setFormData({...formData, teacherData: {subject: e.target.value}})} />
                    </div>
                  )}

                  {formData.role === 'parent' && (
                    <div className="p-4 border border-line bg-panel space-y-3">
                        <p className="mono text-xs uppercase tracking-widest text-accent flex items-center gap-2">
                          <User className="w-4 h-4" /> Détails Parentaux
                        </p>
                        <Input placeholder="Occupation (ex: Commerçant)" value={formData.parentData.occupation} onChange={e => setFormData({...formData, parentData: {occupation: e.target.value}})} />
                    </div>
                  )}
                </div>

                <div className="flex gap-3 pt-6">
                  <Button type="button" variant="ghost" onClick={() => setIsModalOpen(false)} className="flex-1 border border-line">Annuler</Button>
                  <Button type="submit" className="flex-1 bg-accent hover:bg-accent-ink text-paper">Créer le compte</Button>
                </div>
              </form>
            </CardContent>
          </Card>
        </div>
      )}
    </AppLayout>
  );
}

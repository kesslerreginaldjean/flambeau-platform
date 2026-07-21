import React, { useEffect, useState } from 'react';
import Head from 'next/head';
import { useRouter } from 'next/router';
import AppLayout from '@/components/layout/AppLayout';
import { ADMIN_NAV_ITEMS, TEACHER_NAV_ITEMS, STUDENT_NAV_ITEMS, PARENT_NAV_ITEMS } from '@/constants/navigation';
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Mail, Phone, MapPin, Camera, Shield, Bell } from 'lucide-react';

import { authFetch } from "@/lib/authFetch";
export default function UserProfile() {
  const router = useRouter();
  const [user, setUser] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [updating, setUpdating] = useState(false);
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    phone: '',
    address: ''
  });

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const token = localStorage.getItem('auth_token');
        if (!token) {
          router.push('/login');
          return;
        }

        const response = await authFetch('/api/auth/me', {
          headers: { 'Authorization': `Bearer ${token}` }
        });

        if (response.ok) {
          const data = await response.json();
          setUser(data.user);
          setFormData({
            firstName: data.user.firstName,
            lastName: data.user.lastName,
            email: data.user.email,
            phone: data.user.phone || '',
            address: data.user.address || ''
          });
        } else {
          router.push('/login');
        }
      } catch (error) {
        console.error('Error fetching profile:', error);
      } finally {
        setLoading(false);
      }
    };
    fetchProfile();
  }, [router]);

  const handleUpdateProfile = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      setUpdating(true);
      const token = localStorage.getItem('auth_token');
      const response = await authFetch('/api/auth/profile', {
        method: 'PUT',
        headers: { 
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify(formData)
      });

      if (response.ok) {
        const data = await response.json();
        setUser(data.user);
        alert('Profil mis à jour !');
      }
    } catch (error) {
      console.error('Update error:', error);
    } finally {
      setUpdating(false);
    }
  };

  if (loading) return <div className="p-20 text-center mono text-xs uppercase tracking-widest text-soft">Accès à vos données personnelles…</div>;
  if (!user) return null;

  const navItemsMap: Record<string, any> = {
    admin: ADMIN_NAV_ITEMS,
    teacher: TEACHER_NAV_ITEMS,
    student: STUDENT_NAV_ITEMS,
    parent: PARENT_NAV_ITEMS
  };

  const roleLabels: Record<string, string> = {
    admin: 'Administrateur',
    teacher: 'Professeur',
    student: 'Étudiant',
    parent: 'Parent'
  };

  return (
    <AppLayout 
      navItems={navItemsMap[user.role] || []} 
      userName={`${user.firstName} ${user.lastName}`} 
      userRoleLabel={roleLabels[user.role]}
    >
      <Head>
        <title>Mon Profil | Le Flambeau</title>
      </Head>

      <div className="max-w-5xl mx-auto">
        <div className="mb-10">
          <p className="kicker mb-2">Mon compte</p>
          <h1 className="text-4xl font-semibold text-ink tracking-tight">Paramètres du Profil</h1>
          <p className="text-soft mt-2">Gérez votre identité numérique au sein de l'institution.</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
           {/* Profile Summary Card */}
           <Card className="md:col-span-1 border border-line bg-paper h-fit p-0">
              <div className="border-b border-line p-6 flex items-start justify-between">
                 <div className="w-20 h-20 border border-line bg-panel flex items-center justify-center">
                    <span className="numeral text-3xl text-accent">{user.firstName[0]}{user.lastName[0]}</span>
                 </div>
                 <button className="w-9 h-9 border border-line flex items-center justify-center text-soft hover:bg-ink hover:text-paper transition-colors">
                    <Camera className="w-4 h-4" />
                 </button>
              </div>
              <CardContent className="p-6">
                 <h2 className="text-xl font-semibold text-ink tracking-tight">{user.firstName} {user.lastName}</h2>
                 <Badge className="mt-3 bg-paper text-accent border border-accent font-medium px-3 py-1 mono uppercase tracking-widest text-[10px]">{roleLabels[user.role]}</Badge>

                 <div className="w-full mt-8 space-y-px border-t border-line">
                    <div className="flex items-center gap-4 text-sm text-soft py-3 border-b border-line">
                       <Mail className="w-4 h-4 text-soft shrink-0" />
                       <span className="truncate">{user.email}</span>
                    </div>
                    <div className="flex items-center gap-4 text-sm text-soft py-3 border-b border-line">
                       <Phone className="w-4 h-4 text-soft shrink-0" />
                       {user.phone || <span className="text-soft">Non renseigné</span>}
                    </div>
                    <div className="flex items-center gap-4 text-sm text-soft py-3 border-b border-line">
                       <MapPin className="w-4 h-4 text-soft shrink-0" />
                       <span className="line-clamp-1">{user.address || <span className="text-soft">Non renseignée</span>}</span>
                    </div>
                 </div>
              </CardContent>
           </Card>

           {/* Settings Tabs */}
           <div className="md:col-span-2 space-y-8">
              <Card className="border border-line bg-paper p-0">
                 <div className="flex border-b border-line">
                    {['Informations', 'Sécurité', 'Notifications'].map((tab, i) => (
                      <button key={i} className={`flex-1 py-3 mono text-[10px] uppercase tracking-widest border-b-2 -mb-px transition-colors ${i === 0 ? 'border-accent text-accent' : 'border-transparent text-soft hover:text-ink'}`}>
                         {tab}
                      </button>
                    ))}
                 </div>
                 <CardContent className="p-6">
                    <form onSubmit={handleUpdateProfile} className="space-y-6">
                       <div className="grid grid-cols-2 gap-6">
                          <div className="space-y-2">
                             <label className="mono text-[10px] text-soft uppercase tracking-widest">Prénom</label>
                             <Input
                                value={formData.firstName}
                                onChange={(e) => setFormData({...formData, firstName: e.target.value})}
                             />
                          </div>
                          <div className="space-y-2">
                             <label className="mono text-[10px] text-soft uppercase tracking-widest">Nom de famille</label>
                             <Input
                                value={formData.lastName}
                                onChange={(e) => setFormData({...formData, lastName: e.target.value})}
                             />
                          </div>
                       </div>
                       <div className="space-y-2">
                          <label className="mono text-[10px] text-soft uppercase tracking-widest">Adresse Email (Non modifiable)</label>
                          <Input
                             value={formData.email}
                             disabled
                             className="bg-panel opacity-60"
                          />
                       </div>
                       <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                          <div className="space-y-2">
                             <label className="mono text-[10px] text-soft uppercase tracking-widest">Téléphone</label>
                             <Input
                                value={formData.phone}
                                onChange={(e) => setFormData({...formData, phone: e.target.value})}
                                placeholder="+509..."
                             />
                          </div>
                          <div className="space-y-2">
                             <label className="mono text-[10px] text-soft uppercase tracking-widest">Adresse Physique</label>
                             <Input
                                value={formData.address}
                                onChange={(e) => setFormData({...formData, address: e.target.value})}
                                placeholder="Port-au-Prince, HT"
                             />
                          </div>
                       </div>
                       <div className="flex justify-end gap-3 pt-4 border-t border-line">
                          <Button
                            type="button"
                            variant="ghost"
                            className="mono text-[10px] uppercase tracking-widest"
                          >
                            Réinitialiser
                          </Button>
                          <Button
                            type="submit"
                            disabled={updating}
                            className="bg-accent hover:bg-accent-ink text-paper mono text-[10px] uppercase tracking-widest"
                          >
                            {updating ? 'Mise à jour...' : 'Sauvegarder les changements'}
                          </Button>
                       </div>
                    </form>
                 </CardContent>
              </Card>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                 <Card className="border border-line bg-paper p-6 hover:bg-panel transition-colors cursor-pointer">
                    <div className="flex gap-4">
                       <div className="w-10 h-10 border border-line flex items-center justify-center text-soft shrink-0">
                          <Shield className="w-5 h-5" />
                       </div>
                       <div>
                          <h4 className="font-semibold text-ink">Mot de passe</h4>
                          <p className="text-xs text-soft mt-1">Changer votre mot de passe pour plus de sécurité.</p>
                       </div>
                    </div>
                 </Card>
                 <Card className="border border-line bg-paper p-6 hover:bg-panel transition-colors cursor-pointer">
                    <div className="flex gap-4">
                       <div className="w-10 h-10 border border-line flex items-center justify-center text-soft shrink-0">
                          <Bell className="w-5 h-5" />
                       </div>
                       <div>
                          <h4 className="font-semibold text-ink">Alerte SMS</h4>
                          <p className="text-xs text-soft mt-1">Gérer vos préférences d'alertes par SMS.</p>
                       </div>
                    </div>
                 </Card>
              </div>
           </div>
        </div>
      </div>
    </AppLayout>
  );
}

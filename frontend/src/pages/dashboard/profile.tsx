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
        alert('Profil mis à jour ! ✅');
      }
    } catch (error) {
      console.error('Update error:', error);
    } finally {
      setUpdating(false);
    }
  };

  if (loading) return <div className="p-20 text-center font-bold text-slate-400 animate-pulse text-xl">Accès à vos données personnelles...</div>;
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

      <div className="p-6 max-w-5xl mx-auto">
        <div className="mb-10">
          <h1 className="text-4xl font-black text-slate-900 tracking-tight">Paramètres du Profil</h1>
          <p className="text-slate-500 font-medium text-lg mt-2 italic">"Gérez votre identité numérique au sein de l'institution."</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
           {/* Profile Summary Card */}
           <Card className="md:col-span-1 border-none shadow-2xl rounded-[3rem] bg-white overflow-hidden h-fit transition-all hover:shadow-3xl">
              <div className="h-32 bg-gradient-to-br from-[#D32D3F] to-[#8B1A26] relative">
                 <button className="absolute bottom-4 right-4 p-2 bg-white/20 hover:bg-white/30 text-white rounded-xl backdrop-blur-md transition-colors shadow-lg">
                    <Camera className="w-4 h-4" />
                 </button>
              </div>
              <CardContent className="pt-0 p-10 flex flex-col items-center">
                 <div className="w-28 h-28 rounded-[2.5rem] bg-white p-1 shadow-2xl -mt-14 relative overflow-hidden group border-4 border-white">
                    <div className="w-full h-full rounded-[2.2rem] bg-slate-100 flex items-center justify-center text-4xl font-black text-[#D32D3F]">
                       {user.firstName[0]}{user.lastName[0]}
                    </div>
                    <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center text-white cursor-pointer">
                       <Camera className="w-6 h-6" />
                    </div>
                 </div>
                 <h2 className="text-2xl font-black text-slate-900 mt-6 text-center tracking-tight">{user.firstName} {user.lastName}</h2>
                 <Badge className="mt-3 bg-[#FFF8E7] text-[#D32D3F] border-none font-black px-6 py-2 uppercase tracking-tighter text-[10px] shadow-sm">{roleLabels[user.role]}</Badge>
                 
                 <div className="w-full mt-10 space-y-5">
                    <div className="flex items-center gap-4 text-sm font-bold text-slate-500">
                       <div className="w-10 h-10 rounded-xl bg-slate-50 flex items-center justify-center text-slate-400 shadow-inner">
                          <Mail className="w-4 h-4" />
                       </div>
                       {user.email}
                    </div>
                    <div className="flex items-center gap-4 text-sm font-bold text-slate-500">
                       <div className="w-10 h-10 rounded-xl bg-slate-50 flex items-center justify-center text-slate-400 shadow-inner">
                          <Phone className="w-4 h-4" />
                       </div>
                       {user.phone || <span className="text-slate-300 italic font-normal">Non renseigné</span>}
                    </div>
                    <div className="flex items-center gap-4 text-sm font-bold text-slate-500">
                       <div className="w-10 h-10 rounded-xl bg-slate-50 flex items-center justify-center text-slate-400 shadow-inner">
                          <MapPin className="w-4 h-4" />
                       </div>
                       <span className="line-clamp-1">{user.address || <span className="text-slate-300 italic font-normal">Non renseignée</span>}</span>
                    </div>
                 </div>
              </CardContent>
           </Card>

           {/* Settings Tabs */}
           <div className="md:col-span-2 space-y-8">
              <Card className="border-none shadow-2xl rounded-[3rem] bg-white overflow-hidden">
                 <div className="flex bg-slate-50 p-2">
                    {['Informations', 'Sécurité', 'Notifications'].map((tab, i) => (
                      <button key={i} className={`flex-1 py-4 text-[10px] font-black uppercase tracking-[0.2em] transition-all rounded-[1.5rem] ${i === 0 ? 'bg-white text-[#D32D3F] shadow-sm' : 'text-slate-400 hover:text-slate-600'}`}>
                         {tab}
                      </button>
                    ))}
                 </div>
                 <CardContent className="p-10">
                    <form onSubmit={handleUpdateProfile} className="space-y-8">
                       <div className="grid grid-cols-2 gap-8">
                          <div className="space-y-3">
                             <label className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] ml-2">Prénom</label>
                             <Input 
                                value={formData.firstName} 
                                onChange={(e) => setFormData({...formData, firstName: e.target.value})}
                                className="rounded-2xl border-slate-100 bg-slate-50 h-14 font-black focus:ring-[#D32D3F] transition-all" 
                             />
                          </div>
                          <div className="space-y-3">
                             <label className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] ml-2">Nom de famille</label>
                             <Input 
                                value={formData.lastName} 
                                onChange={(e) => setFormData({...formData, lastName: e.target.value})}
                                className="rounded-2xl border-slate-100 bg-slate-50 h-14 font-black focus:ring-[#D32D3F] transition-all" 
                             />
                          </div>
                       </div>
                       <div className="space-y-3">
                          <label className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] ml-2">Adresse Email (Non modifiable)</label>
                          <Input 
                             value={formData.email} 
                             disabled
                             className="rounded-2xl border-slate-100 bg-slate-200 h-14 font-black opacity-60" 
                          />
                       </div>
                       <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                          <div className="space-y-3">
                             <label className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] ml-2">Téléphone</label>
                             <Input 
                                value={formData.phone} 
                                onChange={(e) => setFormData({...formData, phone: e.target.value})}
                                placeholder="+509..."
                                className="rounded-2xl border-slate-100 bg-slate-50 h-14 font-black" 
                             />
                          </div>
                          <div className="space-y-3">
                             <label className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] ml-2">Adresse Physique</label>
                             <Input 
                                value={formData.address} 
                                onChange={(e) => setFormData({...formData, address: e.target.value})}
                                placeholder="Port-au-Prince, HT"
                                className="rounded-2xl border-slate-100 bg-slate-50 h-14 font-black" 
                             />
                          </div>
                       </div>
                       <div className="flex justify-end gap-4 pt-6">
                          <Button 
                            type="button" 
                            variant="ghost" 
                            className="rounded-2xl font-black text-[10px] uppercase tracking-widest px-8"
                          >
                            Réinitialiser
                          </Button>
                          <Button 
                            type="submit"
                            disabled={updating}
                            className="bg-slate-900 hover:bg-[#D32D3F] text-white rounded-2xl px-12 h-14 font-black text-[10px] uppercase tracking-widest shadow-2xl transition-all"
                          >
                            {updating ? 'Mise à jour...' : 'Sauvegarder les changements'}
                          </Button>
                       </div>
                    </form>
                 </CardContent>
              </Card>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                 <Card className="border-none shadow-md rounded-[2rem] bg-white p-6 hover:bg-slate-50 transition-colors cursor-pointer">
                    <div className="flex gap-4">
                       <div className="w-12 h-12 rounded-xl bg-blue-50 flex items-center justify-center text-blue-600">
                          <Shield className="w-6 h-6" />
                       </div>
                       <div>
                          <h4 className="font-bold text-slate-900">Mot de passe</h4>
                          <p className="text-xs text-slate-400 mt-1">Changer votre mot de passe pour plus de sécurité.</p>
                       </div>
                    </div>
                 </Card>
                 <Card className="border-none shadow-md rounded-[2rem] bg-white p-6 hover:bg-slate-50 transition-colors cursor-pointer">
                    <div className="flex gap-4">
                       <div className="w-12 h-12 rounded-xl bg-purple-50 flex items-center justify-center text-purple-600">
                          <Bell className="w-6 h-6" />
                       </div>
                       <div>
                          <h4 className="font-bold text-slate-900">Alerte SMS</h4>
                          <p className="text-xs text-slate-400 mt-1">Gérer vos préférences d'alertes par SMS.</p>
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

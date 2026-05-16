import React, { useState, useEffect } from 'react';
import Head from 'next/head';
import { useRouter } from 'next/router';
import AppLayout from '@/components/layout/AppLayout';
import { ADMIN_NAV_ITEMS } from '@/constants/navigation';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { 
  Settings, Save, Image as ImageIcon, Palette, 
  School, Globe, ShieldCheck, Mail, Phone, MapPin
} from 'lucide-react';

export default function AdminSettings() {
  const router = useRouter();
  const [settings, setSettings] = useState<any>({
    name: 'Le Flambeau Digital',
    slogan: 'Une École • Une Vision',
    primaryColor: '#D32D3F',
    secondaryColor: '#8B1A26',
    address: '',
    phone: '',
    email: ''
  });
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    fetchSettings();
  }, []);

  const fetchSettings = async () => {
    try {
      const response = await fetch('http://localhost:5000/api/admin/settings'); // Need to create this route
      if (response.ok) {
        const data = await response.json();
        if (data) setSettings(data);
      }
    } catch (error) {
      console.error('Error fetching settings:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleSave = async () => {
    try {
      setSaving(true);
      const response = await fetch('http://localhost:5000/api/admin/settings', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(settings)
      });
      if (response.ok) {
        alert('Paramètres enregistrés ! ✅');
      }
    } catch (error) {
      console.error('Error saving settings:', error);
    } finally {
      setSaving(false);
    }
  };

  if (loading) return <div className="p-20 text-center font-bold text-slate-400 animate-pulse text-xl">Accès aux réglages système...</div>;

  return (
    <AppLayout navItems={ADMIN_NAV_ITEMS} userName="Administrateur" userRoleLabel="Paramètres Système">
      <Head><title>Paramètres École | Le Flambeau</title></Head>

      <div className="p-6 max-w-5xl mx-auto">
        <div className="flex justify-between items-center mb-10">
          <div>
            <h1 className="text-3xl font-black text-slate-900 tracking-tight flex items-center gap-3">
              <Settings className="w-8 h-8 text-[#D32D3F]" />
              Configuration de l'Établissement
            </h1>
            <p className="text-slate-500 font-medium">Personnalisez l'identité visuelle et les informations de votre école.</p>
          </div>
          <Button 
            onClick={handleSave} 
            disabled={saving}
            className="bg-[#D32D3F] hover:bg-[#8B1A26] text-white px-8 py-6 rounded-2xl font-black text-xs uppercase tracking-widest shadow-2xl transition-all"
          >
            <Save className="w-5 h-5 mr-3" />
            {saving ? 'Enregistrement...' : 'Enregistrer'}
          </Button>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2 space-y-8">
            <Card className="border-none shadow-2xl rounded-[3rem] bg-white overflow-hidden">
              <CardHeader className="p-10 pb-0">
                <CardTitle className="text-xl font-black text-slate-900 flex items-center gap-3">
                  <School className="w-6 h-6 text-[#D32D3F]" />
                  Informations Générales
                </CardTitle>
              </CardHeader>
              <CardContent className="p-10 space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <label className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-400 ml-2">Nom de l'École</label>
                    <Input 
                      value={settings.name} 
                      onChange={(e) => setSettings({...settings, name: e.target.value})}
                      className="rounded-2xl border-slate-100 bg-slate-50 h-14 font-bold focus:ring-[#D32D3F]" 
                    />
                  </div>
                  <div className="space-y-2">
                    <label className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-400 ml-2">Slogan</label>
                    <Input 
                      value={settings.slogan} 
                      onChange={(e) => setSettings({...settings, slogan: e.target.value})}
                      className="rounded-2xl border-slate-100 bg-slate-50 h-14 font-bold" 
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <label className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-400 ml-2">Adresse Physique</label>
                  <div className="relative">
                    <MapPin className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-300" />
                    <Input 
                      value={settings.address} 
                      onChange={(e) => setSettings({...settings, address: e.target.value})}
                      className="pl-12 rounded-2xl border-slate-100 bg-slate-50 h-14 font-bold" 
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <label className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-400 ml-2">Téléphone</label>
                    <div className="relative">
                      <Phone className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-300" />
                      <Input 
                        value={settings.phone} 
                        onChange={(e) => setSettings({...settings, phone: e.target.value})}
                        className="pl-12 rounded-2xl border-slate-100 bg-slate-50 h-14 font-bold" 
                      />
                    </div>
                  </div>
                  <div className="space-y-2">
                    <label className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-400 ml-2">Email de Contact</label>
                    <div className="relative">
                      <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-300" />
                      <Input 
                        value={settings.email} 
                        onChange={(e) => setSettings({...settings, email: e.target.value})}
                        className="pl-12 rounded-2xl border-slate-100 bg-slate-50 h-14 font-bold" 
                      />
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="border-none shadow-2xl rounded-[3rem] bg-white overflow-hidden">
              <CardHeader className="p-10 pb-0">
                <CardTitle className="text-xl font-black text-slate-900 flex items-center gap-3">
                  <Palette className="w-6 h-6 text-[#D32D3F]" />
                  Design & Couleurs
                </CardTitle>
              </CardHeader>
              <CardContent className="p-10 space-y-8">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                   <div className="flex items-center gap-6 p-6 bg-slate-50 rounded-3xl">
                      <input 
                        type="color" 
                        value={settings.primaryColor}
                        onChange={(e) => setSettings({...settings, primaryColor: e.target.value})}
                        className="w-16 h-16 rounded-2xl border-none cursor-pointer"
                      />
                      <div>
                        <p className="font-black text-slate-900">Couleur Primaire</p>
                        <p className="text-[10px] text-slate-400 font-bold uppercase tracking-widest">{settings.primaryColor}</p>
                      </div>
                   </div>
                   <div className="flex items-center gap-6 p-6 bg-slate-50 rounded-3xl">
                      <input 
                        type="color" 
                        value={settings.secondaryColor}
                        onChange={(e) => setSettings({...settings, secondaryColor: e.target.value})}
                        className="w-16 h-16 rounded-2xl border-none cursor-pointer"
                      />
                      <div>
                        <p className="font-black text-slate-900">Couleur Secondaire</p>
                        <p className="text-[10px] text-slate-400 font-bold uppercase tracking-widest">{settings.secondaryColor}</p>
                      </div>
                   </div>
                </div>

                <div className="p-10 bg-slate-50 rounded-[2.5rem] border-2 border-dashed border-slate-200 flex flex-col items-center justify-center gap-4 text-center">
                   <div className="w-20 h-20 bg-white rounded-3xl flex items-center justify-center text-slate-300 shadow-sm">
                      <ImageIcon className="w-10 h-10" />
                   </div>
                   <div>
                     <p className="font-black text-slate-900">Logo de l'école</p>
                     <p className="text-xs text-slate-400 font-medium max-w-[200px]">PNG ou SVG recommandé. Fond transparent.</p>
                   </div>
                   <Button variant="outline" className="rounded-xl border-slate-200 font-bold mt-2">Changer le logo</Button>
                </div>
              </CardContent>
            </Card>
          </div>

          <div className="space-y-6">
            <Card className="border-none shadow-2xl rounded-[3rem] bg-slate-900 text-white p-10">
               <ShieldCheck className="w-12 h-12 text-[#D32D3F] mb-6" />
               <h3 className="text-2xl font-black mb-2 tracking-tight">Zone de Sécurité</h3>
               <p className="text-slate-400 font-medium text-sm leading-relaxed mb-8">
                 Ces modifications affecteront l'interface de tous les utilisateurs (Admin, Profs, Parents, Élèves).
               </p>
               <div className="space-y-4">
                 <div className="flex items-center justify-between p-4 bg-white/10 rounded-2xl">
                    <span className="text-xs font-bold uppercase tracking-widest">Maintenance</span>
                    <Badge className="bg-red-500/20 text-red-400 border-none">OFF</Badge>
                 </div>
                 <div className="flex items-center justify-between p-4 bg-white/10 rounded-2xl">
                    <span className="text-xs font-bold uppercase tracking-widest">Inscriptions</span>
                    <Badge className="bg-green-500/20 text-green-400 border-none">ON</Badge>
                 </div>
               </div>
            </Card>
          </div>
        </div>
      </div>
    </AppLayout>
  );
}

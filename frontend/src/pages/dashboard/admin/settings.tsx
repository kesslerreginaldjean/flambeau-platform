import { useState, useEffect } from 'react';
import Head from 'next/head';
import AppLayout from '@/components/layout/AppLayout';
import { ADMIN_NAV_ITEMS } from '@/constants/navigation';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  Settings, Save, Image as ImageIcon, Palette,
  School, ShieldCheck, Mail, Phone, MapPin
} from 'lucide-react';

import { authFetch } from "@/lib/authFetch";
export default function AdminSettings() {
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
      const response = await authFetch('/api/admin/settings'); // Need to create this route
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
      const response = await authFetch('/api/admin/settings', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(settings)
      });
      if (response.ok) {
        alert('Paramètres enregistrés !');
      }
    } catch (error) {
      console.error('Error saving settings:', error);
    } finally {
      setSaving(false);
    }
  };

  if (loading) return <div className="p-20 text-center mono uppercase tracking-widest text-xs text-soft">Accès aux réglages système...</div>;

  return (
    <AppLayout navItems={ADMIN_NAV_ITEMS} userName="Administrateur" userRoleLabel="Paramètres Système">
      <Head><title>Paramètres École | Le Flambeau</title></Head>

      <div className="max-w-5xl mx-auto">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-6 mb-10 pb-6 border-b border-line">
          <div>
            <p className="kicker mb-2 flex items-center gap-2"><Settings className="w-4 h-4" /> Configuration</p>
            <h1 className="text-4xl md:text-5xl font-semibold text-ink tracking-tight mb-2">Configuration de l'Établissement</h1>
            <p className="text-soft">Personnalisez l'identité visuelle et les informations de votre école.</p>
          </div>
          <Button
            onClick={handleSave}
            disabled={saving}
            className="bg-accent hover:bg-accent-ink text-paper px-8 h-12 rounded-none mono text-xs uppercase tracking-widest disabled:opacity-50"
          >
            <Save className="w-4 h-4 mr-2" />
            {saving ? 'Enregistrement...' : 'Enregistrer'}
          </Button>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2 space-y-8">
            <Card className="border border-line rounded-none bg-paper overflow-hidden">
              <CardHeader className="p-6 pb-0">
                <CardTitle className="text-lg font-semibold text-ink flex items-center gap-3">
                  <School className="w-5 h-5 text-accent" />
                  Informations Générales
                </CardTitle>
              </CardHeader>
              <CardContent className="p-6 space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <label className="mono text-xs uppercase tracking-widest text-soft">Nom de l'École</label>
                    <Input
                      value={settings.name}
                      onChange={(e) => setSettings({...settings, name: e.target.value})}
                      className="rounded-none border-line"
                    />
                  </div>
                  <div className="space-y-2">
                    <label className="mono text-xs uppercase tracking-widest text-soft">Slogan</label>
                    <Input
                      value={settings.slogan}
                      onChange={(e) => setSettings({...settings, slogan: e.target.value})}
                      className="rounded-none border-line"
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <label className="mono text-xs uppercase tracking-widest text-soft">Adresse Physique</label>
                  <div className="relative">
                    <MapPin className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-soft z-10" />
                    <Input
                      value={settings.address}
                      onChange={(e) => setSettings({...settings, address: e.target.value})}
                      className="pl-12 rounded-none border-line"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <label className="mono text-xs uppercase tracking-widest text-soft">Téléphone</label>
                    <div className="relative">
                      <Phone className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-soft z-10" />
                      <Input
                        value={settings.phone}
                        onChange={(e) => setSettings({...settings, phone: e.target.value})}
                        className="pl-12 rounded-none border-line"
                      />
                    </div>
                  </div>
                  <div className="space-y-2">
                    <label className="mono text-xs uppercase tracking-widest text-soft">Email de Contact</label>
                    <div className="relative">
                      <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-soft z-10" />
                      <Input
                        value={settings.email}
                        onChange={(e) => setSettings({...settings, email: e.target.value})}
                        className="pl-12 rounded-none border-line"
                      />
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="border border-line rounded-none bg-paper overflow-hidden">
              <CardHeader className="p-6 pb-0">
                <CardTitle className="text-lg font-semibold text-ink flex items-center gap-3">
                  <Palette className="w-5 h-5 text-accent" />
                  Design & Couleurs
                </CardTitle>
              </CardHeader>
              <CardContent className="p-6 space-y-8">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-px bg-line border border-line">
                   <div className="flex items-center gap-6 p-6 bg-panel">
                      <input
                        type="color"
                        value={settings.primaryColor}
                        onChange={(e) => setSettings({...settings, primaryColor: e.target.value})}
                        className="w-16 h-16 border border-line cursor-pointer p-0"
                      />
                      <div>
                        <p className="font-semibold text-ink">Couleur Primaire</p>
                        <p className="mono text-xs text-soft uppercase tracking-widest">{settings.primaryColor}</p>
                      </div>
                   </div>
                   <div className="flex items-center gap-6 p-6 bg-panel">
                      <input
                        type="color"
                        value={settings.secondaryColor}
                        onChange={(e) => setSettings({...settings, secondaryColor: e.target.value})}
                        className="w-16 h-16 border border-line cursor-pointer p-0"
                      />
                      <div>
                        <p className="font-semibold text-ink">Couleur Secondaire</p>
                        <p className="mono text-xs text-soft uppercase tracking-widest">{settings.secondaryColor}</p>
                      </div>
                   </div>
                </div>

                <div className="p-10 bg-panel border border-line flex flex-col items-center justify-center gap-4 text-center">
                   <div className="w-20 h-20 bg-paper border border-line flex items-center justify-center text-soft">
                      <ImageIcon className="w-10 h-10" />
                   </div>
                   <div>
                     <p className="font-semibold text-ink">Logo de l'école</p>
                     <p className="text-sm text-soft max-w-[200px]">PNG ou SVG recommandé. Fond transparent.</p>
                   </div>
                   <Button variant="outline" className="rounded-none border-line text-ink hover:bg-ink hover:text-paper mono text-xs uppercase tracking-widest mt-2">Changer le logo</Button>
                </div>
              </CardContent>
            </Card>
          </div>

          <div className="space-y-6">
            <Card className="border border-line rounded-none bg-ink text-paper p-6">
               <ShieldCheck className="w-10 h-10 text-accent mb-6" />
               <h3 className="text-xl font-semibold mb-2 tracking-tight">Zone de Sécurité</h3>
               <p className="text-soft text-sm leading-relaxed mb-8">
                 Ces modifications affecteront l'interface de tous les utilisateurs (Admin, Profs, Parents, Élèves).
               </p>
               <div className="space-y-px">
                 <div className="flex items-center justify-between p-4 border" style={{ borderColor: 'rgba(255,255,255,.15)' }}>
                    <span className="mono text-xs uppercase tracking-widest">Maintenance</span>
                    <Badge className="bg-transparent text-soft border rounded-none mono text-xs" style={{ borderColor: 'rgba(255,255,255,.15)' }}>OFF</Badge>
                 </div>
                 <div className="flex items-center justify-between p-4 border" style={{ borderColor: 'rgba(255,255,255,.15)' }}>
                    <span className="mono text-xs uppercase tracking-widest">Inscriptions</span>
                    <Badge className="bg-transparent text-accent border rounded-none mono text-xs" style={{ borderColor: 'rgba(255,255,255,.15)' }}>ON</Badge>
                 </div>
               </div>
            </Card>
          </div>
        </div>
      </div>
    </AppLayout>
  );
}

import React, { useState, useEffect } from 'react';
import Head from 'next/head';
import AppLayout from '@/components/layout/AppLayout';
import { ADMIN_NAV_ITEMS } from '@/constants/navigation';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Bell, Send, Megaphone, Calendar as CalendarIcon, Clock, MapPin, Trash2 } from 'lucide-react';

import { authFetch } from "@/lib/authFetch";
export default function AdminAnnouncements() {
  const [announcements, setAnnouncements] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [formData, setFormData] = useState({
    title: '',
    content: '',
    target: 'all',
    type: 'info',
    startDate: '', // New: for calendar integration
    endDate: '',   // New: for calendar integration
    location: ''   // New: for calendar integration
  });

  const fetchAnnouncements = async () => {
    try {
      const response = await authFetch('/api/admin/announcements');
      const data = await response.json();
      setAnnouncements(data);
    } catch (error) {
      console.error('Failed to fetch announcements:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAnnouncements();
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      // 1. Create the Announcement
      const response = await authFetch('/api/admin/announcements', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
           title: formData.title,
           content: formData.content,
           target: formData.target,
           type: formData.type
        })
      });

      // 2. If it's an event and has a date, create a Calendar Event automatically
      if (formData.startDate) {
        await authFetch('/api/communication/events', {
           method: 'POST',
           headers: { 'Content-Type': 'application/json' },
           body: JSON.stringify({
              title: formData.title,
              description: formData.content,
              startDate: formData.startDate,
              endDate: formData.endDate || formData.startDate,
              location: formData.location,
              type: formData.type === 'info' ? 'event' : formData.type,
              target: formData.target
           })
        });
      }

      if (response.ok) {
        setFormData({ title: '', content: '', target: 'all', type: 'info', startDate: '', endDate: '', location: '' });
        fetchAnnouncements();
        alert('Annonce publiée et ajoutée au calendrier !');
      }
    } catch (error) {
      alert('Erreur lors de la publication');
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Voulez-vous vraiment supprimer cette annonce ?')) return;
    try {
      const response = await authFetch(`/api/admin/announcements/${id}`, {
        method: 'DELETE'
      });
      if (response.ok) {
        fetchAnnouncements();
      }
    } catch (error) {
      alert('Erreur lors de la suppression');
    }
  };

  return (
    <AppLayout navItems={ADMIN_NAV_ITEMS} userName="Admin Flambeau" userRoleLabel="Administrateur">
      <Head>
        <title>Annonces & Communication | CLF</title>
      </Head>

      <div>
        <div className="mb-8 pb-6 border-b border-line">
          <p className="kicker mb-2">Communication</p>
          <h1 className="text-3xl font-semibold text-ink tracking-tight">Annonces & Communication</h1>
          <p className="text-soft mt-1">Diffusez des informations importantes et planifiez-les sur l'agenda.</p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* New Announcement Form */}
          <Card className="lg:col-span-1 border border-line bg-paper h-fit">
            <CardHeader className="bg-ink text-paper p-6">
               <CardTitle className="text-xl font-semibold flex items-center gap-2">
                  <Megaphone className="w-5 h-5" /> Publier un message
               </CardTitle>
            </CardHeader>
            <CardContent className="p-6">
               <form onSubmit={handleSubmit} className="space-y-4">
                  <div className="space-y-1">
                     <label className="mono text-xs text-soft uppercase tracking-widest">Titre</label>
                     <Input
                        placeholder="Ex: Réunion de parents"
                        value={formData.title}
                        onChange={e => setFormData({...formData, title: e.target.value})}
                        required
                     />
                  </div>

                  <div className="grid grid-cols-2 gap-3">
                     <div className="space-y-1">
                        <label className="mono text-xs text-soft uppercase tracking-widest">Cible</label>
                        <select className="w-full text-sm" value={formData.target} onChange={e => setFormData({...formData, target: e.target.value})}>
                           <option value="all">Tous</option>
                           <option value="students">Élèves</option>
                           <option value="teachers">Profs</option>
                           <option value="parents">Parents</option>
                        </select>
                     </div>
                     <div className="space-y-1">
                        <label className="mono text-xs text-soft uppercase tracking-widest">Priorité</label>
                        <select className="w-full text-sm" value={formData.type} onChange={e => setFormData({...formData, type: e.target.value})}>
                           <option value="info">Information</option>
                           <option value="warning">Urgent</option>
                           <option value="event">Événement</option>
                        </select>
                     </div>
                  </div>

                  {/* Date/Time for Calendar Integration */}
                  <div className="p-4 bg-panel border border-line space-y-3">
                     <p className="mono text-[10px] text-soft uppercase tracking-[0.2em] flex items-center gap-2">
                        <CalendarIcon className="w-3 h-3" /> Planifier sur l'agenda ? (Optionnel)
                     </p>
                     <div className="space-y-2">
                        <div className="flex items-center gap-2">
                           <Clock className="w-4 h-4 text-soft" />
                           <Input type="datetime-local" value={formData.startDate} onChange={e => setFormData({...formData, startDate: e.target.value})} className="text-xs" />
                        </div>
                        <div className="flex items-center gap-2">
                           <MapPin className="w-4 h-4 text-soft" />
                           <Input placeholder="Lieu (Ex: Auditorium)" value={formData.location} onChange={e => setFormData({...formData, location: e.target.value})} className="text-xs" />
                        </div>
                     </div>
                  </div>

                  <div className="space-y-1">
                     <label className="mono text-xs text-soft uppercase tracking-widest">Message</label>
                     <textarea
                        className="w-full h-32 px-3 py-2 text-sm resize-none"
                        placeholder="Écrivez votre message ici..."
                        value={formData.content}
                        onChange={e => setFormData({...formData, content: e.target.value})}
                        required
                     />
                  </div>
                  <Button type="submit" className="btn-accent w-full">
                     <Send className="w-4 h-4" /> Publier & Planifier
                  </Button>
               </form>
            </CardContent>
          </Card>

          {/* Announcement List */}
          <div className="lg:col-span-2 space-y-6">
             <h3 className="text-xl font-semibold text-ink flex items-center gap-2">
                <Bell className="w-5 h-5 text-accent" /> Historique des messages
             </h3>

             {loading ? (
                <div className="space-y-px">
                   {[1, 2, 3].map(i => <div key={i} className="h-24 bg-panel animate-pulse border border-line"></div>)}
                </div>
             ) : announcements.length === 0 ? (
                <div className="p-12 bg-panel border border-line text-center">
                   <p className="text-soft">Aucune annonce publiée pour le moment.</p>
                </div>
             ) : announcements.map((ann) => (
                <Card key={ann.id} className="border border-line bg-paper border-l-4 border-l-accent group relative">
                   <CardContent className="p-8">
                      <div className="flex justify-between items-start mb-4">
                         <div className="flex items-center gap-3">
                            <Badge className={`border font-medium uppercase tracking-widest text-[10px] px-3 py-1 ${
                                ann.type === 'warning' ? 'bg-accent text-paper border-accent' :
                                'bg-paper text-ink border-line'
                            }`}>
                               {ann.type}
                            </Badge>
                            <span className="mono text-[10px] text-soft uppercase tracking-widest">
                               Destinataires: {ann.target === 'all' ? 'Tous' : ann.target}
                            </span>
                         </div>
                         <div className="flex items-center gap-3">
                            <span className="mono text-xs text-soft">{new Date(ann.createdAt).toLocaleDateString('fr-FR', { day: 'numeric', month: 'long' })}</span>
                            <button
                              onClick={() => handleDelete(ann.id)}
                              className="p-2 text-soft hover:text-accent transition-colors opacity-0 group-hover:opacity-100"
                            >
                               <Trash2 className="w-4 h-4" />
                            </button>
                         </div>
                      </div>
                      <h4 className="text-2xl font-semibold text-ink mb-3 tracking-tight">{ann.title}</h4>
                      <p className="text-soft leading-relaxed">{ann.content}</p>
                   </CardContent>
                </Card>
             ))}
          </div>
        </div>
      </div>
    </AppLayout>
  );
}

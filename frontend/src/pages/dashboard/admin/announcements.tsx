import React, { useState, useEffect } from 'react';
import Head from 'next/head';
import AppLayout from '@/components/layout/AppLayout';
import { ADMIN_NAV_ITEMS } from '@/constants/navigation';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Bell, Send, Megaphone, Calendar as CalendarIcon, Clock, MapPin, Trash2 } from 'lucide-react';

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
      const response = await fetch('http://localhost:5000/api/admin/announcements');
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
      const response = await fetch('http://localhost:5000/api/admin/announcements', {
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
        await fetch('http://localhost:5000/api/communication/events', {
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
      const response = await fetch(`http://localhost:5000/api/admin/announcements/${id}`, {
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

      <div className="p-6">
        <div className="mb-8">
          <h1 className="text-3xl font-extrabold text-slate-900 tracking-tight">Annonces & Communication</h1>
          <p className="text-slate-500 font-medium">Diffusez des informations importantes et planifiez-les sur l'agenda.</p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* New Announcement Form */}
          <Card className="lg:col-span-1 border-none shadow-xl rounded-[2.5rem] overflow-hidden bg-white h-fit">
            <CardHeader className="bg-[#D32D3F] text-white p-6">
               <CardTitle className="text-xl font-bold flex items-center gap-2">
                  <Megaphone className="w-5 h-5" /> Publier un message
               </CardTitle>
            </CardHeader>
            <CardContent className="p-6">
               <form onSubmit={handleSubmit} className="space-y-4">
                  <div className="space-y-1">
                     <label className="text-xs font-bold text-slate-500 uppercase tracking-widest">Titre</label>
                     <Input 
                        placeholder="Ex: Réunion de parents" 
                        value={formData.title}
                        onChange={e => setFormData({...formData, title: e.target.value})}
                        required
                        className="rounded-xl bg-slate-50 border-none h-11"
                     />
                  </div>
                  
                  <div className="grid grid-cols-2 gap-3">
                     <div className="space-y-1">
                        <label className="text-xs font-bold text-slate-500 uppercase tracking-widest">Cible</label>
                        <select className="w-full h-11 px-3 bg-slate-50 rounded-xl text-sm" value={formData.target} onChange={e => setFormData({...formData, target: e.target.value})}>
                           <option value="all">Tous</option>
                           <option value="students">Élèves</option>
                           <option value="teachers">Profs</option>
                           <option value="parents">Parents</option>
                        </select>
                     </div>
                     <div className="space-y-1">
                        <label className="text-xs font-bold text-slate-500 uppercase tracking-widest">Priorité</label>
                        <select className="w-full h-11 px-3 bg-slate-50 rounded-xl text-sm" value={formData.type} onChange={e => setFormData({...formData, type: e.target.value})}>
                           <option value="info">Information</option>
                           <option value="warning">Urgent</option>
                           <option value="event">Événement</option>
                        </select>
                     </div>
                  </div>

                  {/* Date/Time for Calendar Integration */}
                  <div className="p-4 bg-[#FFF8E7]/50 rounded-2xl border border-[#FDE68A]/30 space-y-3">
                     <p className="text-[10px] font-black text-amber-700 uppercase tracking-[0.2em] flex items-center gap-2">
                        <CalendarIcon className="w-3 h-3" /> Planifier sur l'agenda ? (Optionnel)
                     </p>
                     <div className="space-y-2">
                        <div className="flex items-center gap-2">
                           <Clock className="w-4 h-4 text-slate-400" />
                           <Input type="datetime-local" value={formData.startDate} onChange={e => setFormData({...formData, startDate: e.target.value})} className="rounded-lg bg-white border-none text-xs h-9" />
                        </div>
                        <div className="flex items-center gap-2">
                           <MapPin className="w-4 h-4 text-slate-400" />
                           <Input placeholder="Lieu (Ex: Auditorium)" value={formData.location} onChange={e => setFormData({...formData, location: e.target.value})} className="rounded-lg bg-white border-none text-xs h-9" />
                        </div>
                     </div>
                  </div>

                  <div className="space-y-1">
                     <label className="text-xs font-bold text-slate-500 uppercase tracking-widest">Message</label>
                     <textarea 
                        className="w-full h-32 px-3 py-2 bg-slate-50 border-none rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-[#D32D3F]"
                        placeholder="Écrivez votre message ici..."
                        value={formData.content}
                        onChange={e => setFormData({...formData, content: e.target.value})}
                        required
                     />
                  </div>
                  <Button type="submit" className="w-full bg-[#D32D3F] hover:bg-[#8B1A26] text-white rounded-xl py-6 font-bold shadow-lg shadow-[#D32D3F]/20 flex gap-2 transition-all active:scale-95">
                     <Send className="w-4 h-4" /> Publier & Planifier
                  </Button>
               </form>
            </CardContent>
          </Card>

          {/* Announcement List */}
          <div className="lg:col-span-2 space-y-6">
             <h3 className="text-xl font-bold text-slate-800 flex items-center gap-2">
                <Bell className="w-5 h-5 text-[#D32D3F]" /> Historique des messages
             </h3>
             
             {loading ? (
                <div className="space-y-4">
                   {[1, 2, 3].map(i => <div key={i} className="h-24 bg-slate-100 animate-pulse rounded-[2rem]"></div>)}
                </div>
             ) : announcements.length === 0 ? (
                <div className="p-12 bg-slate-50 rounded-[2rem] text-center border-2 border-dashed border-slate-200">
                   <p className="text-slate-400 font-medium">Aucune annonce publiée pour le moment.</p>
                </div>
             ) : announcements.map((ann) => (
                <Card key={ann.id} className="border-none shadow-md rounded-[2.5rem] bg-white overflow-hidden hover:shadow-xl transition-shadow border-l-8 border-l-[#D32D3F]/10 group relative">
                   <CardContent className="p-8">
                      <div className="flex justify-between items-start mb-4">
                         <div className="flex items-center gap-3">
                            <Badge className={`${
                                ann.type === 'warning' ? 'bg-red-100 text-red-700' :
                                ann.type === 'event' ? 'bg-purple-100 text-purple-700' :
                                'bg-blue-100 text-blue-700'
                            } border-none font-bold uppercase tracking-widest text-[10px] px-3 py-1 rounded-full`}>
                               {ann.type}
                            </Badge>
                            <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">
                               Destinataires: {ann.target === 'all' ? 'Tous' : ann.target}
                            </span>
                         </div>
                         <div className="flex items-center gap-3">
                            <span className="text-xs text-slate-400 font-bold">{new Date(ann.createdAt).toLocaleDateString('fr-FR', { day: 'numeric', month: 'long' })}</span>
                            <button 
                              onClick={() => handleDelete(ann.id)}
                              className="p-2 bg-slate-50 rounded-lg text-slate-300 hover:text-red-500 hover:bg-red-50 transition-all opacity-0 group-hover:opacity-100"
                            >
                               <Trash2 className="w-4 h-4" />
                            </button>
                         </div>
                      </div>
                      <h4 className="text-2xl font-black text-slate-900 mb-3 tracking-tight">{ann.title}</h4>
                      <p className="text-slate-600 leading-relaxed font-medium">{ann.content}</p>
                   </CardContent>
                </Card>
             ))}
          </div>
        </div>
      </div>
    </AppLayout>
  );
}


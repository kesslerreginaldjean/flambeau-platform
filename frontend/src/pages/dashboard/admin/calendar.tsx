import React, { useState, useEffect } from 'react';
import Head from 'next/head';
import AppLayout from '@/components/layout/AppLayout';
import { ADMIN_NAV_ITEMS } from '@/constants/navigation';
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  ChevronLeft,
  ChevronRight,
  Plus,
  Calendar as CalendarIcon,
  Clock,
  MapPin,
  Trash2,
  AlertCircle
} from 'lucide-react';

import { authFetch } from "@/lib/authFetch";
export default function AdminCalendar() {
  const [currentDate, setCurrentDate] = useState(new Date());
  const [events, setEvents] = useState<any[]>([]);
  const [showAddModal, setShowAddModal] = useState(false);
  const [loading, setLoading] = useState(true);

  const [formData, setFormData] = useState({
    title: '',
    description: '',
    startDate: '',
    endDate: '',
    location: '',
    type: 'class',
    target: 'all'
  });

  const fetchEvents = async () => {
    try {
      const response = await authFetch('/api/communication/events');
      const data = await response.json();
      setEvents(data);
    } catch (error) {
      console.error('Failed to fetch events');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchEvents();
  }, []);

  const handleAddEvent = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const response = await authFetch('/api/communication/events', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData)
      });
      if (response.ok) {
        setShowAddModal(false);
        setFormData({ title: '', description: '', startDate: '', endDate: '', location: '', type: 'class', target: 'all' });
        fetchEvents();
      }
    } catch (error) {
      alert('Erreur lors de la création');
    }
  };

  const handleDeleteEvent = async (id: string) => {
    if (!confirm('Supprimer cet événement ?')) return;
    try {
      await authFetch(`/api/communication/events/${id}`, { method: 'DELETE' });
      fetchEvents();
    } catch (error) {
      alert('Erreur lors de la suppression');
    }
  };

  // Logic for calendar grid
  const daysInMonth = new Date(currentDate.getFullYear(), currentDate.getMonth() + 1, 0).getDate();
  const firstDayOfMonth = new Date(currentDate.getFullYear(), currentDate.getMonth(), 1).getDay();
  const monthName = currentDate.toLocaleString('fr-FR', { month: 'long', year: 'numeric' });

  const prevMonth = () => setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() - 1, 1));
  const nextMonth = () => setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() + 1, 1));

  const days = [];
  // Empty spaces for previous month
  for (let i = 0; i < (firstDayOfMonth === 0 ? 6 : firstDayOfMonth - 1); i++) {
    days.push(<div key={`empty-${i}`} className="h-32 border-b border-r border-line bg-panel"></div>);
  }
  // Days of current month
  for (let d = 1; d <= daysInMonth; d++) {
    const isToday = d === new Date().getDate() && currentDate.getMonth() === new Date().getMonth() && currentDate.getFullYear() === new Date().getFullYear();
    const dayEvents = events.filter(e => {
        const eventDate = new Date(e.startDate);
        return eventDate.getDate() === d && eventDate.getMonth() === currentDate.getMonth() && eventDate.getFullYear() === currentDate.getFullYear();
    });

    days.push(
      <div key={d} className={`h-32 border-b border-r border-line p-2 relative transition-colors ${isToday ? 'border-accent bg-paper' : 'bg-paper hover:bg-panel'}`}>
        <span className={`numeral text-sm ${isToday ? 'w-7 h-7 bg-ink text-paper flex items-center justify-center' : 'text-soft'}`}>
          {d}
        </span>
        <div className="mt-1 space-y-1 overflow-y-auto max-h-[80px]">
          {dayEvents.map(event => (
            <div
              key={event.id}
              className={`mono text-[9px] uppercase tracking-wider px-2 py-1 truncate border-l-2 ${
                event.type === 'exam' ? 'border-accent text-accent bg-panel' :
                'border-line text-ink bg-panel'
              }`}
            >
              {event.title}
            </div>
          ))}
        </div>
      </div>
    );
  }

  return (
    <AppLayout navItems={ADMIN_NAV_ITEMS} userName="Admin Flambeau" userRoleLabel="Administrateur">
      <Head>
        <title>Agenda Académique | CLF</title>
      </Head>

      <div>
        <div className="flex flex-col sm:flex-row sm:justify-between sm:items-end gap-4 mb-8 pb-6 border-b border-line">
          <div>
            <p className="kicker mb-2">Communication</p>
            <h1 className="text-3xl font-semibold text-ink tracking-tight">Agenda Académique</h1>
            <p className="text-soft mt-1">Gérez le calendrier, les examens et les événements de l'école.</p>
          </div>
          <Button onClick={() => setShowAddModal(true)} className="btn-accent shrink-0">
            <Plus className="w-4 h-4" /> Ajouter un événement
          </Button>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
          {/* Calendar Grid */}
          <Card className="lg:col-span-3 border border-line bg-paper">
            <CardHeader className="bg-paper border-b border-line p-6 flex flex-row items-center justify-between">
              <h2 className="text-xl font-semibold text-ink capitalize">{monthName}</h2>
              <div className="flex gap-2">
                <Button variant="ghost" size="icon" onClick={prevMonth} className="border border-line hover:bg-ink hover:text-paper"><ChevronLeft className="w-5 h-5" /></Button>
                <Button variant="ghost" size="icon" onClick={nextMonth} className="border border-line hover:bg-ink hover:text-paper"><ChevronRight className="w-5 h-5" /></Button>
              </div>
            </CardHeader>
            <CardContent className="p-0">
              <div className="grid grid-cols-7 text-center border-b border-line bg-panel py-3">
                {['Lun', 'Mar', 'Mer', 'Jeu', 'Ven', 'Sam', 'Dim'].map(day => (
                  <span key={day} className="mono text-xs uppercase tracking-widest text-soft">{day}</span>
                ))}
              </div>
              <div className="grid grid-cols-7 border-l border-line">
                {days}
              </div>
            </CardContent>
          </Card>

          {/* Upcoming Events List */}
          <div className="space-y-6">
            <h3 className="text-xl font-semibold text-ink flex items-center gap-2">
              <CalendarIcon className="w-5 h-5 text-accent" /> Prochainement
            </h3>
            <div className="space-y-px h-[calc(100vh-280px)] overflow-y-auto pr-2 custom-scrollbar">
               {events.filter(e => new Date(e.startDate) >= new Date()).map((event) => (
                 <div
                   key={event.id}
                   className="bg-paper p-5 border border-line relative group"
                 >
                    <div className={`absolute top-0 left-0 w-1 h-full ${
                       event.type === 'exam' ? 'bg-accent' : 'bg-ink'
                    }`}></div>
                    <div className="flex justify-between items-start mb-2 pl-2">
                       <span className={`mono text-[10px] uppercase tracking-widest ${
                          event.type === 'exam' ? 'text-accent' : 'text-soft'
                       }`}>{event.type}</span>
                       <button onClick={() => handleDeleteEvent(event.id)} className="opacity-0 group-hover:opacity-100 transition-opacity text-soft hover:text-accent">
                          <Trash2 className="w-4 h-4" />
                       </button>
                    </div>
                    <h4 className="font-semibold text-ink mb-3 pl-2">{event.title}</h4>
                    <div className="space-y-2 pl-2">
                       <div className="flex items-center gap-2 text-soft mono text-[10px]">
                          <Clock className="w-3 h-3" />
                          {new Date(event.startDate).toLocaleDateString()} • {new Date(event.startDate).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                       </div>
                       {event.location && (
                         <div className="flex items-center gap-2 text-soft mono text-[10px]">
                            <MapPin className="w-3 h-3" />
                            {event.location}
                         </div>
                       )}
                    </div>
                 </div>
               ))}

               {events.length === 0 && !loading && (
                  <div className="text-center py-12 bg-panel border border-line">
                     <AlertCircle className="w-8 h-8 text-soft mx-auto mb-3" />
                     <p className="mono text-xs text-soft uppercase tracking-widest">Aucun événement</p>
                  </div>
               )}
            </div>
          </div>
        </div>
      </div>

      {/* Add Event Modal */}
      {showAddModal && (
        <div className="fixed inset-0 z-[150] flex items-center justify-center p-6">
          <div
            onClick={() => setShowAddModal(false)}
            className="absolute inset-0"
            style={{ background: 'rgba(17,19,21,.6)' }}
          ></div>
          <div className="relative w-full max-w-md bg-paper border border-line overflow-hidden">
            <div className="bg-ink p-8 text-paper">
               <p className="mono text-xs uppercase tracking-widest text-paper/60 mb-2">Calendrier</p>
               <h2 className="text-2xl font-semibold flex items-center gap-2">
                 <Plus className="w-6 h-6" /> Nouvel événement
               </h2>
               <p className="text-paper/70 text-sm mt-1">Planifiez une activité sur le calendrier.</p>
            </div>
            <form onSubmit={handleAddEvent} className="p-8 space-y-5">
              <div className="space-y-1">
                <label className="mono text-xs text-soft uppercase tracking-widest">Titre</label>
                <Input required value={formData.title} onChange={e => setFormData({...formData, title: e.target.value})} placeholder="Ex: Examen de Maths" />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-1">
                  <label className="mono text-xs text-soft uppercase tracking-widest">Début</label>
                  <Input required type="datetime-local" value={formData.startDate} onChange={e => setFormData({...formData, startDate: e.target.value})} className="text-xs" />
                </div>
                <div className="space-y-1">
                  <label className="mono text-xs text-soft uppercase tracking-widest">Fin</label>
                  <Input required type="datetime-local" value={formData.endDate} onChange={e => setFormData({...formData, endDate: e.target.value})} className="text-xs" />
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                 <div className="space-y-1">
                    <label className="mono text-xs text-soft uppercase tracking-widest">Type</label>
                    <select className="w-full text-sm" value={formData.type} onChange={e => setFormData({...formData, type: e.target.value})}>
                      <option value="class">Cours</option>
                      <option value="exam">Examen</option>
                      <option value="meeting">Réunion</option>
                      <option value="holiday">Congé</option>
                      <option value="event">Événement</option>
                    </select>
                 </div>
                 <div className="space-y-1">
                    <label className="mono text-xs text-soft uppercase tracking-widest">Lieu</label>
                    <Input value={formData.location} onChange={e => setFormData({...formData, location: e.target.value})} placeholder="Ex: Salle 12" />
                 </div>
              </div>
              <div className="space-y-1">
                <label className="mono text-xs text-soft uppercase tracking-widest">Description</label>
                <textarea value={formData.description} onChange={e => setFormData({...formData, description: e.target.value})} className="w-full h-24 p-3 text-sm resize-none" placeholder="Détails supplémentaires..." />
              </div>
              <div className="flex gap-4 pt-4">
                 <Button type="button" variant="ghost" onClick={() => setShowAddModal(false)} className="flex-1 border border-line hover:bg-ink hover:text-paper">Annuler</Button>
                 <Button type="submit" className="btn-accent flex-1">Créer</Button>
              </div>
            </form>
          </div>
        </div>
      )}
    </AppLayout>
  );
}

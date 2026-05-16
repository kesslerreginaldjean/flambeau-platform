import React, { useState, useEffect } from 'react';
import Head from 'next/head';
import AppLayout from '@/components/layout/AppLayout';
import { ADMIN_NAV_ITEMS } from '@/constants/navigation';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
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
import { motion, AnimatePresence } from 'framer-motion';

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
      const response = await fetch('http://localhost:5000/api/communication/events');
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
      const response = await fetch('http://localhost:5000/api/communication/events', {
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
      await fetch(`http://localhost:5000/api/communication/events/${id}`, { method: 'DELETE' });
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
    days.push(<div key={`empty-${i}`} className="h-32 border-b border-r border-slate-50 bg-slate-50/30"></div>);
  }
  // Days of current month
  for (let d = 1; d <= daysInMonth; d++) {
    const isToday = d === new Date().getDate() && currentDate.getMonth() === new Date().getMonth() && currentDate.getFullYear() === new Date().getFullYear();
    const dayEvents = events.filter(e => {
        const eventDate = new Date(e.startDate);
        return eventDate.getDate() === d && eventDate.getMonth() === currentDate.getMonth() && eventDate.getFullYear() === currentDate.getFullYear();
    });

    days.push(
      <div key={d} className={`h-32 border-b border-r border-slate-100 p-2 relative hover:bg-slate-50 transition-colors ${isToday ? 'bg-blue-50/30' : 'bg-white'}`}>
        <span className={`text-sm font-bold ${isToday ? 'w-7 h-7 bg-[#D32D3F] text-white rounded-full flex items-center justify-center' : 'text-slate-400'}`}>
          {d}
        </span>
        <div className="mt-1 space-y-1 overflow-y-auto max-h-[80px]">
          {dayEvents.map(event => (
            <div 
              key={event.id}
              className={`text-[9px] font-bold px-2 py-1 rounded-lg truncate ${
                event.type === 'exam' ? 'bg-red-100 text-red-700' :
                event.type === 'meeting' ? 'bg-purple-100 text-purple-700' :
                event.type === 'holiday' ? 'bg-amber-100 text-amber-700' :
                'bg-blue-100 text-blue-700'
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

      <div className="p-6">
        <div className="flex justify-between items-end mb-8">
          <div>
            <h1 className="text-3xl font-extrabold text-slate-900 tracking-tight">Agenda Académique</h1>
            <p className="text-slate-500 font-medium">Gérez le calendrier, les examens et les événements de l'école.</p>
          </div>
          <Button onClick={() => setShowAddModal(true)} className="bg-[#D32D3F] hover:bg-[#8B1A26] text-white rounded-2xl px-6 py-6 shadow-lg shadow-[#D32D3F]/20 flex gap-2 font-bold transform hover:scale-105 active:scale-95 transition-all">
            <Plus className="w-5 h-5" /> Ajouter un événement
          </Button>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
          {/* Calendar Grid */}
          <Card className="lg:col-span-3 border-none shadow-2xl rounded-[3rem] bg-white overflow-hidden">
            <CardHeader className="bg-white border-b border-slate-50 p-6 flex flex-row items-center justify-between">
              <h2 className="text-xl font-bold text-slate-900 capitalize">{monthName}</h2>
              <div className="flex gap-2">
                <Button variant="ghost" size="icon" onClick={prevMonth} className="rounded-xl border border-slate-100"><ChevronLeft className="w-5 h-5" /></Button>
                <Button variant="ghost" size="icon" onClick={nextMonth} className="rounded-xl border border-slate-100"><ChevronRight className="w-5 h-5" /></Button>
              </div>
            </CardHeader>
            <CardContent className="p-0">
              <div className="grid grid-cols-7 text-center border-b border-slate-100 bg-slate-50/50 py-3">
                {['Lun', 'Mar', 'Mer', 'Jeu', 'Ven', 'Sam', 'Dim'].map(day => (
                  <span key={day} className="text-xs font-black text-slate-400 uppercase tracking-widest">{day}</span>
                ))}
              </div>
              <div className="grid grid-cols-7 border-l border-slate-100">
                {days}
              </div>
            </CardContent>
          </Card>

          {/* Upcoming Events List */}
          <div className="space-y-6">
            <h3 className="text-xl font-bold text-slate-900 flex items-center gap-2">
              <CalendarIcon className="w-5 h-5 text-[#D32D3F]" /> Prochainement
            </h3>
            <div className="space-y-4 h-[calc(100vh-280px)] overflow-y-auto pr-2 custom-scrollbar">
               {events.filter(e => new Date(e.startDate) >= new Date()).map((event) => (
                 <motion.div 
                   key={event.id}
                   initial={{ opacity: 0, x: 20 }}
                   animate={{ opacity: 1, x: 0 }}
                   className="bg-white p-5 rounded-[2rem] shadow-md border border-slate-50 relative group overflow-hidden"
                 >
                    <div className={`absolute top-0 left-0 w-1.5 h-full ${
                       event.type === 'exam' ? 'bg-red-500' :
                       event.type === 'meeting' ? 'bg-purple-500' :
                       event.type === 'holiday' ? 'bg-amber-500' :
                       'bg-blue-500'
                    }`}></div>
                    <div className="flex justify-between items-start mb-2">
                       <span className={`text-[10px] font-black uppercase tracking-widest ${
                          event.type === 'exam' ? 'text-red-500' :
                          event.type === 'meeting' ? 'text-purple-500' :
                          'text-blue-500'
                       }`}>{event.type}</span>
                       <button onClick={() => handleDeleteEvent(event.id)} className="opacity-0 group-hover:opacity-100 transition-opacity text-slate-300 hover:text-red-500">
                          <Trash2 className="w-4 h-4" />
                       </button>
                    </div>
                    <h4 className="font-bold text-slate-900 mb-3">{event.title}</h4>
                    <div className="space-y-2">
                       <div className="flex items-center gap-2 text-slate-400 text-[10px] font-bold">
                          <Clock className="w-3 h-3" />
                          {new Date(event.startDate).toLocaleDateString()} • {new Date(event.startDate).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                       </div>
                       {event.location && (
                         <div className="flex items-center gap-2 text-slate-400 text-[10px] font-bold">
                            <MapPin className="w-3 h-3" />
                            {event.location}
                         </div>
                       )}
                    </div>
                 </motion.div>
               ))}
               
               {events.length === 0 && !loading && (
                  <div className="text-center py-12 bg-slate-50 rounded-[2.5rem] border-2 border-dashed border-slate-200">
                     <AlertCircle className="w-8 h-8 text-slate-300 mx-auto mb-3" />
                     <p className="text-xs font-bold text-slate-400 uppercase tracking-widest">Aucun événement</p>
                  </div>
               )}
            </div>
          </div>
        </div>
      </div>

      {/* Add Event Modal */}
      <AnimatePresence>
        {showAddModal && (
          <div className="fixed inset-0 z-[150] flex items-center justify-center p-6">
            <motion.div 
              initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
              onClick={() => setShowAddModal(false)}
              className="absolute inset-0 bg-slate-950/80 backdrop-blur-md"
            ></motion.div>
            <motion.div 
              initial={{ scale: 0.9, y: 20, opacity: 0 }} animate={{ scale: 1, y: 0, opacity: 1 }} exit={{ scale: 0.9, y: 20, opacity: 0 }}
              className="relative w-full max-w-md bg-white rounded-[3rem] shadow-2xl overflow-hidden"
            >
              <div className="bg-[#D32D3F] p-8 text-white">
                 <h2 className="text-2xl font-bold flex items-center gap-2">
                   <Plus className="w-6 h-6" /> Nouvel événement
                 </h2>
                 <p className="opacity-70 text-sm mt-1">Planifiez une activité sur le calendrier.</p>
              </div>
              <form onSubmit={handleAddEvent} className="p-8 space-y-5">
                <div className="space-y-1">
                  <label className="text-xs font-bold text-slate-500 uppercase tracking-widest">Titre</label>
                  <Input required value={formData.title} onChange={e => setFormData({...formData, title: e.target.value})} className="rounded-xl bg-slate-50 border-none h-12" placeholder="Ex: Examen de Maths" />
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-1">
                    <label className="text-xs font-bold text-slate-500 uppercase tracking-widest">Début</label>
                    <Input required type="datetime-local" value={formData.startDate} onChange={e => setFormData({...formData, startDate: e.target.value})} className="rounded-xl bg-slate-50 border-none h-12 text-xs" />
                  </div>
                  <div className="space-y-1">
                    <label className="text-xs font-bold text-slate-500 uppercase tracking-widest">Fin</label>
                    <Input required type="datetime-local" value={formData.endDate} onChange={e => setFormData({...formData, endDate: e.target.value})} className="rounded-xl bg-slate-50 border-none h-12 text-xs" />
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-4">
                   <div className="space-y-1">
                      <label className="text-xs font-bold text-slate-500 uppercase tracking-widest">Type</label>
                      <select className="w-full h-12 px-3 bg-slate-50 rounded-xl text-sm outline-none" value={formData.type} onChange={e => setFormData({...formData, type: e.target.value})}>
                        <option value="class">Cours</option>
                        <option value="exam">Examen</option>
                        <option value="meeting">Réunion</option>
                        <option value="holiday">Congé</option>
                        <option value="event">Événement</option>
                      </select>
                   </div>
                   <div className="space-y-1">
                      <label className="text-xs font-bold text-slate-500 uppercase tracking-widest">Lieu</label>
                      <Input value={formData.location} onChange={e => setFormData({...formData, location: e.target.value})} className="rounded-xl bg-slate-50 border-none h-12" placeholder="Ex: Salle 12" />
                   </div>
                </div>
                <div className="space-y-1">
                  <label className="text-xs font-bold text-slate-500 uppercase tracking-widest">Description</label>
                  <textarea value={formData.description} onChange={e => setFormData({...formData, description: e.target.value})} className="w-full h-24 p-3 bg-slate-50 rounded-xl text-sm outline-none resize-none" placeholder="Détails supplémentaires..." />
                </div>
                <div className="flex gap-4 pt-4">
                   <Button type="button" variant="ghost" onClick={() => setShowAddModal(false)} className="flex-1 rounded-2xl py-6 font-bold">Annuler</Button>
                   <Button type="submit" className="flex-1 bg-[#D32D3F] hover:bg-[#8B1A26] text-white rounded-2xl py-6 font-bold shadow-lg shadow-[#D32D3F]/20">Créer</Button>
                </div>
              </form>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </AppLayout>
  );
}

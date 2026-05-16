import React from 'react';
import Head from 'next/head';
import AppLayout from '@/components/layout/AppLayout';
import { ADMIN_NAV_ITEMS } from '@/constants/navigation';
import { Card, CardContent } from "@/components/ui/card";
import { ChevronLeft, ChevronRight, Plus, MapPin, Clock } from 'lucide-react';

export default function GlobalCalendar() {
  const days = ['Lun', 'Mar', 'Mer', 'Jeu', 'Ven', 'Sam', 'Dim'];
  const dates = Array.from({ length: 31 }, (_, i) => i + 1);

  const events = [
    { day: 15, title: 'Réunion Parents', type: 'Réunion', color: 'bg-blue-100 text-blue-700' },
    { day: 22, title: 'Examen Maths', type: 'Examen', color: 'bg-red-100 text-red-700' },
    { day: 28, title: 'Journée Sportive', type: 'Événement', color: 'bg-green-100 text-green-700' },
  ];

  return (
    <AppLayout navItems={ADMIN_NAV_ITEMS} userName="Admin Flambeau" userRoleLabel="Administrateur">
      <Head>
        <title>Calendrier Scolaire | CLF</title>
      </Head>

      <div className="p-6">
        <div className="flex justify-between items-center mb-8">
          <div>
            <h1 className="text-3xl font-extrabold text-slate-900 tracking-tight">Calendrier Scolaire</h1>
            <p className="text-slate-500 font-medium">Gérez les événements et l'emploi du temps de l'établissement.</p>
          </div>
          <button className="bg-[#D32D3F] hover:bg-[#8B1A26] text-white rounded-xl px-6 py-3 font-bold shadow-lg shadow-[#D32D3F]/20 flex items-center gap-2">
            <Plus className="w-5 h-5" /> Ajouter un événement
          </button>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
          {/* Calendar Main Grid */}
          <Card className="lg:col-span-3 border-none shadow-xl rounded-[2.5rem] bg-white overflow-hidden">
            <div className="p-8 border-b border-slate-100 flex justify-between items-center bg-slate-50/50">
               <h2 className="text-2xl font-bold text-slate-800">Avril 2026</h2>
               <div className="flex gap-2">
                  <button className="p-2 hover:bg-white rounded-xl shadow-sm border border-slate-100"><ChevronLeft className="w-5 h-5" /></button>
                  <button className="p-2 hover:bg-white rounded-xl shadow-sm border border-slate-100"><ChevronRight className="w-5 h-5" /></button>
               </div>
            </div>
            <CardContent className="p-0">
               <div className="grid grid-cols-7 border-b border-slate-100">
                  {days.map(day => (
                    <div key={day} className="py-4 text-center text-xs font-bold text-slate-400 uppercase tracking-widest">{day}</div>
                  ))}
               </div>
               <div className="grid grid-cols-7 h-[600px]">
                  {dates.map(date => {
                    const dayEvents = events.filter(e => e.day === date);
                    return (
                      <div key={date} className="border-r border-b border-slate-50 p-4 hover:bg-slate-50/50 transition-colors relative group">
                        <span className={`text-sm font-bold ${date === 26 ? 'bg-[#D32D3F] text-white w-7 h-7 flex items-center justify-center rounded-full shadow-lg shadow-[#D32D3F]/30' : 'text-slate-600'}`}>
                           {date}
                        </span>
                        <div className="mt-2 space-y-1">
                           {dayEvents.map((e, i) => (
                             <div key={i} className={`text-[10px] font-bold p-1 rounded-md truncate ${e.color}`}>
                                {e.title}
                             </div>
                           ))}
                        </div>
                      </div>
                    );
                  })}
               </div>
            </CardContent>
          </Card>

          {/* Upcoming Events Sidebar */}
          <div className="space-y-6">
             <h3 className="text-xl font-bold text-slate-800">À venir ce mois</h3>
             <div className="space-y-4">
                {events.map((e, i) => (
                  <Card key={i} className="border-none shadow-md rounded-2xl bg-white hover:translate-x-1 transition-transform cursor-pointer">
                     <CardContent className="p-4">
                        <div className="flex gap-4">
                           <div className="w-12 h-12 rounded-xl bg-slate-50 flex flex-col items-center justify-center text-[#D32D3F]">
                              <span className="text-[10px] font-bold uppercase">Avr</span>
                              <span className="text-lg font-bold leading-none">{e.day}</span>
                           </div>
                           <div>
                              <h4 className="font-bold text-slate-900 text-sm">{e.title}</h4>
                              <div className="flex items-center gap-2 text-[10px] text-slate-400 mt-1 font-medium">
                                 <Clock className="w-3 h-3" /> 09:00 AM
                                 <MapPin className="w-3 h-3" /> Salle {100 + i}
                              </div>
                           </div>
                        </div>
                     </CardContent>
                  </Card>
                ))}
             </div>

             <div className="p-6 bg-[#FFF8E7] rounded-[2rem] border border-[#FDE68A]">
                <h4 className="text-sm font-bold text-slate-800 mb-2">Note de l'administration</h4>
                <p className="text-xs text-slate-600 leading-relaxed">
                   Les dates d'examens de fin de trimestre sont fixées pour la dernière semaine du mois. Veuillez consulter les horaires détaillés dans la section Bibliothèque.
                </p>
             </div>
          </div>
        </div>
      </div>
    </AppLayout>
  );
}

import Head from 'next/head';
import AppLayout from '@/components/layout/AppLayout';
import { ADMIN_NAV_ITEMS } from '@/constants/navigation';
import { Card, CardContent } from "@/components/ui/card";
import { ChevronLeft, ChevronRight, Plus, MapPin, Clock } from 'lucide-react';

export default function GlobalCalendar() {
  const days = ['Lun', 'Mar', 'Mer', 'Jeu', 'Ven', 'Sam', 'Dim'];
  const dates = Array.from({ length: 31 }, (_, i) => i + 1);

  const events = [
    { day: 15, title: 'Réunion Parents', type: 'Réunion', color: 'bg-panel text-ink' },
    { day: 22, title: 'Examen Maths', type: 'Examen', color: 'bg-accent text-paper' },
    { day: 28, title: 'Journée Sportive', type: 'Événement', color: 'bg-ink text-paper' },
  ];

  return (
    <AppLayout navItems={ADMIN_NAV_ITEMS} userName="Admin Flambeau" userRoleLabel="Administrateur">
      <Head>
        <title>Calendrier Scolaire | CLF</title>
      </Head>

      <div>
        <div className="flex justify-between items-end mb-8 gap-4">
          <div>
            <p className="kicker mb-2">Planning</p>
            <h1 className="text-3xl font-semibold text-ink tracking-tight">Calendrier Scolaire</h1>
            <p className="text-soft mt-2">Gérez les événements et l'emploi du temps de l'établissement.</p>
          </div>
          <button className="btn-accent shrink-0">
            <Plus className="w-4 h-4" /> Ajouter un événement
          </button>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
          {/* Calendar Main Grid */}
          <Card className="lg:col-span-3 border border-line bg-paper p-0">
            <div className="p-6 border-b border-line flex justify-between items-center">
               <h2 className="text-xl font-semibold text-ink">Avril 2026</h2>
               <div className="flex">
                  <button className="w-9 h-9 flex items-center justify-center border border-line text-ink hover:bg-ink hover:text-paper transition-colors"><ChevronLeft className="w-5 h-5" /></button>
                  <button className="w-9 h-9 flex items-center justify-center border border-line border-l-0 text-ink hover:bg-ink hover:text-paper transition-colors"><ChevronRight className="w-5 h-5" /></button>
               </div>
            </div>
            <CardContent className="p-0">
               <div className="grid grid-cols-7 border-b border-line">
                  {days.map(day => (
                    <div key={day} className="py-3 text-center mono text-xs text-soft uppercase tracking-widest">{day}</div>
                  ))}
               </div>
               <div className="grid grid-cols-7 h-[600px]">
                  {dates.map(date => {
                    const dayEvents = events.filter(e => e.day === date);
                    const isToday = date === 26;
                    return (
                      <div key={date} className={`border-r border-b border-line p-3 hover:bg-panel transition-colors relative ${isToday ? 'border-2 border-accent' : ''}`}>
                        <span className={`numeral text-sm ${isToday ? 'text-accent' : 'text-ink'}`}>
                           {date}
                        </span>
                        <div className="mt-2 space-y-1">
                           {dayEvents.map((e, i) => (
                             <div key={i} className={`mono text-[10px] px-1 py-0.5 truncate ${e.color}`}>
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
             <h3 className="text-lg font-semibold text-ink">À venir ce mois</h3>
             <div className="border-t border-line">
                {events.map((e, i) => (
                  <div key={i} className="border-b border-line py-4 flex gap-4 hover:bg-panel transition-colors cursor-pointer">
                     <div className="w-12 h-12 border border-line flex flex-col items-center justify-center text-accent shrink-0">
                        <span className="mono text-[10px] uppercase">Avr</span>
                        <span className="numeral text-lg leading-none">{e.day}</span>
                     </div>
                     <div>
                        <h4 className="font-semibold text-ink text-sm">{e.title}</h4>
                        <div className="flex items-center gap-2 mono text-[10px] text-soft mt-1">
                           <Clock className="w-3 h-3" /> 09:00 AM
                           <MapPin className="w-3 h-3" /> Salle <span className="numeral">{100 + i}</span>
                        </div>
                     </div>
                  </div>
                ))}
             </div>

             <div className="p-6 border border-line bg-panel">
                <p className="kicker mb-2">Note de l'administration</p>
                <p className="text-xs text-soft leading-relaxed">
                   Les dates d'examens de fin de trimestre sont fixées pour la dernière semaine du mois. Veuillez consulter les horaires détaillés dans la section Bibliothèque.
                </p>
             </div>
          </div>
        </div>
      </div>
    </AppLayout>
  );
}

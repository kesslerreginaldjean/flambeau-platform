import { useState, useEffect } from 'react';
import Head from 'next/head';
import AppLayout from '@/components/layout/AppLayout';
import { ADMIN_NAV_ITEMS } from '@/constants/navigation';
import { Card } from "@/components/ui/card";
import {
  Users,
  GraduationCap,
  Briefcase,
  TrendingUp,
  ChevronRight,
  Clock,
  MessageSquare,
  Calendar as CalendarIcon
} from 'lucide-react';
import Link from 'next/link';

import { authFetch } from "@/lib/authFetch";
export default function AdminDashboard() {
  const [stats, setStats] = useState({ students: 0, teachers: 0, parents: 0, revenue: 0 });
  const [recentMessages, setRecentMessages] = useState<any[]>([]);
  const [upcomingEvents, setUpcomingEvents] = useState<any[]>([]);

  const fetchData = async () => {
    try {
      // Fetch stats (authFetch resolves the host from NEXT_PUBLIC_API_URL)
      const statsRes = await authFetch('/api/admin/stats');
      const statsData = await statsRes.json();
      setStats(statsData);

      // Fetch events
      const eventsRes = await authFetch('/api/communication/events');
      const eventsData = await eventsRes.json();
      setUpcomingEvents(Array.isArray(eventsData) ? eventsData.slice(0, 3) : []);

      // Fetch messages — userId comes from the JWT server-side, no query param needed.
      const messagesRes = await authFetch('/api/communication/messages');
      const messagesData = await messagesRes.json();
      setRecentMessages(Array.isArray(messagesData) ? messagesData.slice(0, 3) : []);

    } catch (error) {
      console.error('Failed to fetch dashboard data');
    } finally {
      // Data loaded
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const statCards = [
    { title: 'Étudiants Inscrits', value: stats.students, icon: GraduationCap, trend: '+15%' },
    { title: 'Professeurs', value: stats.teachers, icon: Briefcase, trend: '+3%' },
    { title: 'Staff Administratif', value: '1', icon: Users, trend: '0%' },
    { title: 'Revenus (Mois)', value: `${stats.revenue.toLocaleString()} HTG`, icon: TrendingUp, trend: '+5%' },
  ];

  return (
    <AppLayout navItems={ADMIN_NAV_ITEMS} userName="Admin Flambeau" userRoleLabel="Administrateur">
      <Head>
        <title>Tableau de Bord Administrateur | CLF</title>
      </Head>

      <div className="space-y-10">
        {/* Welcome Section */}
        <div className="flex justify-between items-end border-b border-line pb-6">
          <div>
            <p className="kicker mb-2">Tableau de bord</p>
            <h1 className="text-4xl font-semibold text-ink tracking-tight">Bienvenue, Admin</h1>
            <p className="text-soft mt-2">Voici le résumé des activités du collège aujourd'hui.</p>
          </div>
          <div className="text-right hidden md:block">
            <p className="mono text-xs uppercase tracking-widest text-soft">{new Date().toLocaleDateString('fr-FR', { weekday: 'long', day: 'numeric', month: 'long' })}</p>
          </div>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-px bg-line border border-line">
          {statCards.map((stat) => (
            <div key={stat.title} className="bg-paper p-6">
              <div className="flex justify-between items-start mb-6">
                <stat.icon className="w-5 h-5 text-accent" />
                <span className="mono text-xs uppercase tracking-widest text-soft">{stat.trend}</span>
              </div>
              <div>
                <p className="numeral text-4xl text-ink mb-2">{stat.value}</p>
                <p className="mono text-xs uppercase tracking-widest text-soft">{stat.title}</p>
              </div>
            </div>
          ))}
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main Agenda Section */}
          <Card className="lg:col-span-2 bg-paper">
            <div className="p-6 border-b border-line flex justify-between items-center">
              <h2 className="text-xl font-semibold text-ink flex items-center gap-3">
                <CalendarIcon className="w-5 h-5 text-accent" /> Agenda Académique
              </h2>
              <Link href="/dashboard/admin/calendar" className="mono text-xs uppercase tracking-widest text-accent hover:text-accent-ink transition-colors">Voir tout</Link>
            </div>
            <div className="divide-y divide-line">
              {upcomingEvents.length > 0 ? upcomingEvents.map((event) => (
                <div key={event.id} className="flex items-center gap-6 p-6 group hover:bg-panel transition-colors">
                  <div className={`w-16 h-16 border flex flex-col items-center justify-center ${
                     event.type === 'exam' ? 'border-accent text-accent' : 'border-line text-ink'
                  }`}>
                    <span className="mono text-[10px] uppercase">{new Date(event.startDate).toLocaleString('fr-FR', { month: 'short' })}</span>
                    <span className="numeral text-xl">{new Date(event.startDate).getDate()}</span>
                  </div>
                  <div className="flex-1">
                    <h4 className="font-semibold text-ink text-lg mb-1">{event.title}</h4>
                    <div className="flex items-center gap-4">
                      <span className="mono text-[10px] uppercase tracking-widest text-soft flex items-center gap-1">
                        <Clock className="w-3 h-3" /> {new Date(event.startDate).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                      </span>
                      <span className={`mono text-[10px] uppercase tracking-widest ${
                        event.type === 'exam' ? 'text-accent' : 'text-ink'
                      }`}>
                        {event.type}
                      </span>
                    </div>
                  </div>
                  <ChevronRight className="w-5 h-5 text-soft group-hover:text-accent transition-colors" />
                </div>
              )) : (
                <div className="text-center py-10">
                   <p className="mono text-xs uppercase tracking-widest text-soft">Aucun événement à venir</p>
                </div>
              )}
            </div>
          </Card>

          {/* Messages Section */}
          <Card className="bg-paper flex flex-col">
            <div className="p-6 border-b border-line flex justify-between items-center">
              <h2 className="text-xl font-semibold text-ink flex items-center gap-3">
                <MessageSquare className="w-5 h-5 text-accent" /> Messages
              </h2>
              <Link href="/dashboard/admin/messages" className="mono text-xs uppercase tracking-widest text-accent hover:text-accent-ink transition-colors">Voir tout</Link>
            </div>
            <div className="p-6 space-y-6 flex-1">
              {recentMessages.length > 0 ? recentMessages.map((msg) => (
                <div key={msg.id} className="flex gap-4 group cursor-pointer">
                  <div className="relative">
                    <img
                      src={`https://api.dicebear.com/7.x/notionists/svg?seed=${msg.sender?.lastName || 'user'}`}
                      className="w-12 h-12 border border-line bg-panel"
                      alt="avatar"
                    />
                    {!msg.isRead && <span className="absolute -top-1 -right-1 w-2.5 h-2.5 bg-accent border border-paper"></span>}
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex justify-between items-start mb-1">
                      <p className="font-semibold text-ink truncate">{msg.sender?.firstName} {msg.sender?.lastName}</p>
                      <span className="mono text-[10px] text-soft">{new Date(msg.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</span>
                    </div>
                    <p className="text-xs text-soft truncate group-hover:text-ink transition-colors">
                      {msg.content}
                    </p>
                  </div>
                </div>
              )) : (
                <div className="space-y-6">
                  {/* Static Placeholder if no real data yet */}
                  {[1, 2, 3].map(i => (
                    <div key={i} className="flex gap-4 opacity-50">
                      <div className="w-12 h-12 bg-panel animate-pulse"></div>
                      <div className="flex-1 space-y-2">
                        <div className="h-3 bg-panel w-1/2 animate-pulse"></div>
                        <div className="h-2 bg-panel w-full animate-pulse"></div>
                      </div>
                    </div>
                  ))}
                  <p className="text-center mono text-xs uppercase tracking-widest text-soft">En attente de messages...</p>
                </div>
              )}
            </div>
            <div className="p-6 border-t border-line">
               <Link
                 href="/dashboard/admin/messages"
                 className="w-full py-3 border border-line text-ink mono text-xs uppercase tracking-widest flex items-center justify-center gap-2 hover:bg-accent hover:text-paper hover:border-accent transition-colors"
               >
                 Ouvrir la messagerie <ChevronRight className="w-4 h-4" />
               </Link>
            </div>
          </Card>
        </div>
      </div>
    </AppLayout>
  );
}

import React, { useState, useEffect } from 'react';
import Head from 'next/head';
import AppLayout from '@/components/layout/AppLayout';
import { ADMIN_NAV_ITEMS } from '@/constants/navigation';
import { Card, CardContent } from "@/components/ui/card";
import { 
  Users, 
  GraduationCap, 
  Briefcase, 
  TrendingUp, 
  ChevronRight, 
  Clock, 
  MessageSquare,
  ArrowUpRight,
  Calendar as CalendarIcon
} from 'lucide-react';
import { motion } from 'framer-motion';
import Link from 'next/link';

export default function AdminDashboard() {
  const [stats, setStats] = useState({ students: 0, teachers: 0, parents: 0, revenue: 0 });
  const [recentMessages, setRecentMessages] = useState<any[]>([]);
  const [upcomingEvents, setUpcomingEvents] = useState<any[]>([]);

  const fetchData = async () => {
    try {
      const apiUrl = 'http://localhost:5000/api';
      
      // Fetch stats
      const statsRes = await fetch(`${apiUrl}/admin/stats`);
      const statsData = await statsRes.json();
      setStats(statsData);

      // Fetch events
      const eventsRes = await fetch(`${apiUrl}/communication/events`);
      const eventsData = await eventsRes.json();
      setUpcomingEvents(eventsData.slice(0, 3));

      // Fetch messages (simulated for now or real if data exists)
      const messagesRes = await fetch(`${apiUrl}/communication/messages?userId=admin-id`);
      const messagesData = await messagesRes.json();
      setRecentMessages(messagesData.slice(0, 3));

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
    { title: 'Étudiants Inscrits', value: stats.students, icon: GraduationCap, color: 'bg-blue-50 text-blue-600', trend: '+15%' },
    { title: 'Professeurs', value: stats.teachers, icon: Briefcase, color: 'bg-amber-50 text-amber-600', trend: '+3%' },
    { title: 'Staff Administratif', value: '1', icon: Users, color: 'bg-purple-50 text-purple-600', trend: '0%' },
    { title: 'Revenus (Mois)', value: `${stats.revenue.toLocaleString()} HTG`, icon: TrendingUp, color: 'bg-green-50 text-green-600', trend: '+5%' },
  ];

  return (
    <AppLayout navItems={ADMIN_NAV_ITEMS} userName="Admin Flambeau" userRoleLabel="Administrateur">
      <Head>
        <title>Tableau de Bord Administrateur | CLF</title>
      </Head>

      <div className="space-y-10 animate-in fade-in duration-700">
        {/* Welcome Section */}
        <div className="flex justify-between items-end">
          <div>
            <h1 className="text-4xl font-black text-slate-900 tracking-tight flex items-center gap-3">
              Bienvenue, Admin 👋
            </h1>
            <p className="text-slate-500 font-medium mt-2">Voici le résumé des activités du collège aujourd'hui.</p>
          </div>
          <div className="text-right hidden md:block">
            <p className="text-xs font-black text-slate-400 uppercase tracking-widest">{new Date().toLocaleDateString('fr-FR', { weekday: 'long', day: 'numeric', month: 'long' })}</p>
          </div>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {statCards.map((stat, i) => (
            <motion.div
              key={stat.title}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.1 }}
            >
              <Card className="border-none shadow-xl rounded-[2.5rem] bg-white hover:shadow-2xl transition-all group overflow-hidden relative">
                <CardContent className="p-8">
                  <div className="flex justify-between items-start mb-6">
                    <div className={`p-4 rounded-2xl ${stat.color} transition-transform group-hover:scale-110`}>
                      <stat.icon className="w-6 h-6" />
                    </div>
                    <span className="text-xs font-black text-green-500 flex items-center gap-1 bg-green-50 px-2 py-1 rounded-full">
                       {stat.trend} <ArrowUpRight className="w-3 h-3" />
                    </span>
                  </div>
                  <div>
                    <p className="text-4xl font-black text-slate-900 mb-1">{stat.value}</p>
                    <p className="text-xs font-bold text-slate-400 uppercase tracking-widest">{stat.title}</p>
                  </div>
                </CardContent>
                <div className="absolute -bottom-2 -right-2 w-16 h-16 bg-slate-50 rounded-full opacity-50 group-hover:scale-150 transition-transform"></div>
              </Card>
            </motion.div>
          ))}
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-10">
          {/* Main Agenda Section */}
          <Card className="lg:col-span-2 border-none shadow-2xl rounded-[3rem] bg-white overflow-hidden">
            <div className="p-8 border-b border-slate-50 flex justify-between items-center">
              <h2 className="text-2xl font-black text-slate-900 flex items-center gap-3">
                <CalendarIcon className="w-6 h-6 text-[#D32D3F]" /> Agenda Académique
              </h2>
              <Link href="/dashboard/admin/calendar" className="text-xs font-black text-[#D32D3F] uppercase tracking-widest hover:underline">Voir tout</Link>
            </div>
            <div className="p-8 space-y-6">
              {upcomingEvents.length > 0 ? upcomingEvents.map((event) => (
                <div key={event.id} className="flex items-center gap-6 p-6 bg-slate-50 rounded-[2.5rem] group hover:bg-[#FFF8E7] transition-colors">
                  <div className={`w-16 h-16 rounded-2xl flex flex-col items-center justify-center font-black transition-transform group-hover:scale-110 ${
                     event.type === 'exam' ? 'bg-red-100 text-red-600' : 'bg-white text-slate-900 shadow-sm'
                  }`}>
                    <span className="text-[10px] uppercase">{new Date(event.startDate).toLocaleString('fr-FR', { month: 'short' })}</span>
                    <span className="text-xl">{new Date(event.startDate).getDate()}</span>
                  </div>
                  <div className="flex-1">
                    <h4 className="font-extrabold text-slate-900 text-lg mb-1">{event.title}</h4>
                    <div className="flex items-center gap-4">
                      <span className="text-[10px] font-bold text-slate-400 flex items-center gap-1">
                        <Clock className="w-3 h-3" /> {new Date(event.startDate).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                      </span>
                      <span className={`text-[10px] font-black uppercase tracking-widest px-2 py-0.5 rounded-full ${
                        event.type === 'exam' ? 'bg-red-50 text-red-500' : 'bg-blue-50 text-blue-500'
                      }`}>
                        {event.type}
                      </span>
                    </div>
                  </div>
                  <ChevronRight className="w-5 h-5 text-slate-300 group-hover:text-[#D32D3F] transition-colors" />
                </div>
              )) : (
                <div className="text-center py-10">
                   <p className="text-slate-400 font-bold uppercase tracking-widest text-xs">Aucun événement à venir</p>
                </div>
              )}
            </div>
          </Card>

          {/* Messages Section */}
          <Card className="border-none shadow-2xl rounded-[3rem] bg-white overflow-hidden">
            <div className="p-8 border-b border-slate-50 flex justify-between items-center">
              <h2 className="text-2xl font-black text-slate-900 flex items-center gap-3">
                <MessageSquare className="w-6 h-6 text-[#D32D3F]" /> Messages
              </h2>
              <Link href="/dashboard/admin/messages" className="text-xs font-black text-[#D32D3F] uppercase tracking-widest hover:underline">Voir tout</Link>
            </div>
            <div className="p-8 space-y-6">
              {recentMessages.length > 0 ? recentMessages.map((msg) => (
                <div key={msg.id} className="flex gap-4 group cursor-pointer">
                  <div className="relative">
                    <img 
                      src={`https://api.dicebear.com/7.x/notionists/svg?seed=${msg.sender?.lastName || 'user'}`} 
                      className="w-12 h-12 rounded-2xl bg-slate-100 border-2 border-white shadow-sm" 
                      alt="avatar" 
                    />
                    {!msg.isRead && <span className="absolute -top-1 -right-1 w-3 h-3 bg-[#D32D3F] rounded-full border-2 border-white"></span>}
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex justify-between items-start mb-1">
                      <p className="font-bold text-slate-900 truncate">{msg.sender?.firstName} {msg.sender?.lastName}</p>
                      <span className="text-[10px] text-slate-400 font-bold">{new Date(msg.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</span>
                    </div>
                    <p className="text-xs text-slate-500 truncate font-medium group-hover:text-slate-900 transition-colors">
                      {msg.content}
                    </p>
                  </div>
                </div>
              )) : (
                <div className="space-y-6">
                  {/* Static Placeholder if no real data yet */}
                  {[1, 2, 3].map(i => (
                    <div key={i} className="flex gap-4 opacity-50 grayscale">
                      <div className="w-12 h-12 bg-slate-100 rounded-2xl animate-pulse"></div>
                      <div className="flex-1 space-y-2">
                        <div className="h-3 bg-slate-100 rounded w-1/2 animate-pulse"></div>
                        <div className="h-2 bg-slate-100 rounded w-full animate-pulse"></div>
                      </div>
                    </div>
                  ))}
                  <p className="text-center text-xs font-bold text-slate-300 uppercase tracking-widest">En attente de messages...</p>
                </div>
              )}
            </div>
            <div className="p-8 bg-slate-50/50 mt-auto">
               <Link 
                 href="/dashboard/admin/messages"
                 className="w-full py-4 bg-white border-2 border-slate-100 text-slate-900 font-black text-xs uppercase tracking-widest rounded-2xl flex items-center justify-center gap-2 hover:bg-[#D32D3F] hover:text-white hover:border-[#D32D3F] transition-all"
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

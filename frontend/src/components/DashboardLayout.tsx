'use client';

import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/router';
import { logout } from '@/lib/auth';

interface DashboardLayoutProps {
  children: React.ReactNode;
  userRole: string;
}

const navItems: Record<
  string,
  Array<{
    label: string;
    href: string;
    icon: string;
  }>
> = {
  admin: [
    { label: 'Tableau de bord', href: '/dashboard/admin', icon: '📊' },
    { label: 'Étudiants', href: '/dashboard/admin?tab=students', icon: '👥' },
    { label: 'Cours', href: '/dashboard/admin?tab=courses', icon: '📚' },
    { label: 'Notes', href: '/dashboard/admin?tab=grades', icon: '📝' },
    { label: 'Paiements', href: '/dashboard/admin?tab=payments', icon: '💰' },
    { label: 'Professeurs', href: '/dashboard/admin?tab=teachers', icon: '👨‍🏫' },
    { label: 'Comptabilité', href: '/dashboard/admin?tab=accounting', icon: '📈' },
  ],
  teacher: [
    { label: 'Tableau de bord', href: '/dashboard/teacher', icon: '📊' },
    { label: 'Classes', href: '/dashboard/teacher?tab=classes', icon: '👩‍🏫' },
    { label: 'Notes', href: '/dashboard/teacher?tab=grades', icon: '📝' },
    { label: 'Ressources', href: '/dashboard/teacher?tab=resources', icon: '📚' },
  ],
  parent: [
    { label: 'Tableau de bord', href: '/dashboard/parent', icon: '📊' },
    { label: 'Progression', href: '/dashboard/parent?tab=child', icon: '👧' },
    { label: 'Bulletins', href: '/dashboard/parent?tab=grades', icon: '📝' },
    { label: 'Paiements', href: '/dashboard/parent?tab=payments', icon: '💰' },
    { label: 'Messages', href: '/dashboard/parent?tab=messages', icon: '💬' },
  ],
  student: [
    { label: 'Tableau de bord', href: '/dashboard/student', icon: '📊' },
    { label: 'Mes notes', href: '/dashboard/student?tab=grades', icon: '📝' },
    { label: 'Emploi du temps', href: '/dashboard/student?tab=schedule', icon: '📅' },
    { label: 'Paiements', href: '/dashboard/student?tab=payments', icon: '💰' },
    { label: 'Ressources', href: '/dashboard/student?tab=resources', icon: '📚' },
  ],
};

const roleLabels: Record<string, string> = {
  admin: 'Administrateur',
  teacher: 'Enseignant',
  parent: 'Parent',
  student: 'Étudiant',
};

export default function DashboardLayout({ children, userRole }: DashboardLayoutProps) {
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [mounted, setMounted] = useState(false);
  const [userEmail, setUserEmail] = useState<string | null>(null);
  const router = useRouter();

  useEffect(() => {
    setMounted(true);
    if (typeof window !== 'undefined') {
      setUserEmail(localStorage.getItem('user_email'));
    }
  }, []);

  const menuItems = navItems[userRole] || [];
  const currentPath = router.pathname;
  const roleLabel = roleLabels[userRole] || 'Utilisateur';

  if (!mounted) {
    return null;
  }

  return (
    <div className="flex min-h-screen bg-slate-950 text-slate-100">
      <aside className={`${sidebarOpen ? 'w-72' : 'w-20'} fixed inset-y-0 left-0 z-40 flex flex-col bg-slate-900/95 border-r border-white/10 backdrop-blur-xl transition-all duration-300`}>
        <div className="px-5 py-5 border-b border-white/10">
          <div className="flex items-center gap-3">
            <img src="/logo.PNG" alt="Logo" className="h-12 w-12 rounded-3xl border border-white/10 object-cover" />
            {sidebarOpen && (
              <div>
                <p className="text-xs uppercase tracking-[0.26em] text-slate-400">Collège Le Flambeau</p>
                <h2 className="text-lg font-semibold text-white">Espace {roleLabel}</h2>
              </div>
            )}
          </div>
        </div>

        <div className="flex-1 overflow-y-auto px-3 py-4 space-y-2">
          {menuItems.map((item) => {
            const targetPath = item.href.split('?')[0];
            const isActive = router.asPath.startsWith(item.href) || currentPath === targetPath;
            return (
              <button
                key={item.href}
                onClick={() => router.push(item.href)}
                className={`group flex w-full items-center gap-3 rounded-3xl px-4 py-3 text-sm font-medium transition ${isActive ? 'bg-gradient-to-r from-red-600 to-red-500 text-white shadow-lg shadow-red-500/20' : 'text-slate-300 hover:bg-white/5 hover:text-white'}`}
              >
                <span className="text-lg">{item.icon}</span>
                {sidebarOpen && <span className="truncate">{item.label}</span>}
              </button>
            );
          })}
        </div>

        <div className="border-t border-white/10 p-4">
          <button
            onClick={() => setSidebarOpen(!sidebarOpen)}
            className="flex w-full items-center justify-center rounded-full border border-white/10 bg-white/5 px-4 py-3 text-sm text-slate-100 transition hover:bg-white/10"
          >
            {sidebarOpen ? 'Réduire le menu' : 'Ouvrir le menu'}
          </button>
        </div>
      </aside>

      <main className={`flex-1 min-h-screen ${sidebarOpen ? 'ml-72' : 'ml-20'} transition-all duration-300`}>
        <div className="sticky top-0 z-30 border-b border-white/10 bg-slate-950/95 px-8 py-5 backdrop-blur-xl shadow-black/10">
          <div className="flex flex-col gap-5 lg:flex-row lg:items-center lg:justify-between">
            <div>
              <p className="text-xs uppercase tracking-[0.35em] text-slate-500">Portail {roleLabel.toLowerCase()}</p>
              <h1 className="mt-2 text-3xl font-semibold text-white">Bienvenue dans le dashboard</h1>
            </div>
            <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
              <div className="flex min-w-[280px] items-center rounded-3xl border border-white/10 bg-slate-900/80 px-4 py-3 text-sm text-slate-200 shadow-sm shadow-black/10">
                <span className="mr-3 text-slate-400">🔎</span>
                <input
                  className="w-full bg-transparent outline-none placeholder:text-slate-500"
                  placeholder="Rechercher un élève, un cours ou un paiement"
                />
              </div>
              <div className="flex items-center gap-3">
                <div className="hidden rounded-3xl bg-white/5 px-4 py-3 text-slate-100 sm:block">🔔</div>
                <div className="rounded-3xl border border-white/10 bg-slate-900/80 px-4 py-3 text-sm text-slate-100">
                  <p className="text-slate-400">Connecté en tant que</p>
                  <p className="font-semibold text-white">{userEmail || roleLabel}</p>
                </div>
                <button
                  onClick={logout}
                  className="rounded-3xl bg-red-600 px-4 py-3 text-sm font-semibold text-white transition hover:bg-red-500"
                >
                  Déconnexion
                </button>
              </div>
            </div>
          </div>
        </div>

        <div className="px-8 py-8">{children}</div>
      </main>
    </div>
  );
}

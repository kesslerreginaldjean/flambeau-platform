import React from 'react';
import Link from 'next/link';
import { useRouter } from 'next/router';
import { MessageSquare, Bell, UserCircle, Search, LogOut, Bot, X } from 'lucide-react';
import { AIChatbot } from '@/components/AIChatbot';

export type NavItem = {
  name: string;
  icon: React.ElementType;
  href: string;
};

interface AppLayoutProps {
  children: React.ReactNode;
  navItems: NavItem[];
  userName: string;
  userRoleLabel: string;
}

export default function AppLayout({ children, navItems, userName, userRoleLabel }: AppLayoutProps) {
  const router = useRouter();
  const [isChatOpen, setIsChatOpen] = React.useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = React.useState(false);

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    router.push('/login');
  };

  const NavLink = ({ item, onClick }: { item: NavItem; onClick?: () => void }) => {
    const isActive = router.pathname === item.href;
    return (
      <Link
        href={item.href}
        onClick={onClick}
        className={`flex items-center gap-3 px-3 py-2.5 border-l-2 transition-colors ${
          isActive
            ? 'border-accent bg-panel text-ink font-medium'
            : 'border-transparent text-soft hover:bg-panel hover:text-ink'
        }`}
      >
        <item.icon className={`w-4 h-4 ${isActive ? 'text-accent' : ''}`} />
        <span className="text-sm">{item.name}</span>
      </Link>
    );
  };

  return (
    <div className="flex h-screen bg-paper overflow-hidden relative">
      {/* Mobile overlay */}
      {isMobileMenuOpen && (
        <div
          className="fixed inset-0 z-[150] md:hidden"
          style={{ background: 'rgba(17,19,21,.6)' }}
          onClick={() => setIsMobileMenuOpen(false)}
        />
      )}

      {/* Sidebar (desktop) */}
      <aside className="w-64 bg-paper border-r border-line flex-col hidden md:flex shrink-0">
        <div className="px-5 flex items-center gap-3 border-b border-line" style={{ height: 'calc(var(--lh) * 3.5)' }}>
          <div className="w-9 h-9 border border-line flex items-center justify-center p-1">
            <img src="/logo.PNG" alt="CLF" className="w-full h-full object-contain" />
          </div>
          <span className="font-semibold text-base text-ink tracking-tight">Le Flambeau</span>
        </div>

        <div className="flex-1 overflow-y-auto py-5">
          <p className="px-5 mb-3 mono text-xs uppercase tracking-widest text-soft">Menu principal</p>
          <nav className="space-y-px">
            {navItems.map((item) => (
              <NavLink key={item.name} item={item} />
            ))}
          </nav>

          <p className="px-5 mt-8 mb-3 mono text-xs uppercase tracking-widest text-soft">Compte</p>
          <nav className="space-y-px">
            <NavLink item={{ name: 'Mon profil', icon: UserCircle, href: '/dashboard/profile' }} />
            <button
              onClick={handleLogout}
              className="w-full flex items-center gap-3 px-3 py-2.5 border-l-2 border-transparent text-soft hover:bg-panel hover:text-accent transition-colors"
            >
              <LogOut className="w-4 h-4" />
              <span className="text-sm">Déconnexion</span>
            </button>
          </nav>
        </div>

        <div className="p-5 border-t border-line">
          <p className="mono text-xs uppercase tracking-widest text-soft">Une École · Une Vision</p>
        </div>
      </aside>

      {/* Mobile drawer */}
      <aside
        className={`fixed top-0 left-0 bottom-0 w-72 bg-paper z-[200] flex flex-col md:hidden border-r border-line transition-transform duration-300 ${
          isMobileMenuOpen ? 'translate-x-0' : '-translate-x-full'
        }`}
      >
        <div className="px-5 flex items-center justify-between border-b border-line" style={{ height: 'calc(var(--lh) * 3.5)' }}>
          <div className="flex items-center gap-3">
            <img src="/logo.PNG" alt="CLF" className="w-8 h-8 object-contain" />
            <span className="font-semibold text-base text-ink tracking-tight">Le Flambeau</span>
          </div>
          <button onClick={() => setIsMobileMenuOpen(false)} className="w-9 h-9 flex items-center justify-center border border-line text-ink hover:bg-ink hover:text-paper transition-colors">
            <X className="w-5 h-5" />
          </button>
        </div>
        <div className="flex-1 overflow-y-auto py-5">
          <nav className="space-y-px">
            {navItems.map((item) => (
              <NavLink key={item.name} item={item} onClick={() => setIsMobileMenuOpen(false)} />
            ))}
          </nav>
          <div className="mt-8 px-3">
            <button
              onClick={handleLogout}
              className="w-full flex items-center gap-3 px-3 py-2.5 border border-line text-accent hover:bg-accent hover:text-paper transition-colors text-sm font-medium"
            >
              <LogOut className="w-4 h-4" />
              Déconnexion
            </button>
          </div>
        </div>
      </aside>

      {/* Main */}
      <main className="flex-1 flex flex-col h-screen overflow-hidden relative">
        {/* Top bar */}
        <header className="px-4 md:px-8 flex items-center justify-between bg-paper border-b border-line shrink-0" style={{ height: 'calc(var(--lh) * 3.5)' }}>
          <div className="flex items-center gap-4">
            <button
              onClick={() => setIsMobileMenuOpen(true)}
              aria-label="Menu"
              className="w-9 h-9 flex items-center justify-center border border-line md:hidden text-ink hover:bg-ink hover:text-paper transition-colors"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
              </svg>
            </button>
            <div className="relative hidden lg:block w-80">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-soft" />
              <input
                type="text"
                placeholder="Rechercher…"
                className="pl-9 border border-line bg-paper text-sm"
                style={{ minHeight: 'calc(var(--lh) * 1.75)' }}
              />
            </div>
          </div>

          <div className="flex items-center gap-4 md:gap-6">
            <div className="flex items-center gap-1 text-soft pr-4 md:pr-6 border-r border-line">
              <Link href="/dashboard/messages" className="w-9 h-9 flex items-center justify-center hover:text-accent transition-colors relative">
                <MessageSquare className="w-5 h-5" />
                <span className="absolute top-2 right-2 w-1.5 h-1.5 bg-accent"></span>
              </Link>
              <Link href="/dashboard/announcements" className="hidden sm:flex w-9 h-9 items-center justify-center hover:text-accent transition-colors">
                <Bell className="w-5 h-5" />
              </Link>
            </div>

            <Link href="/dashboard/profile" className="flex items-center gap-3 hover:opacity-70 transition-opacity">
              <div className="text-right hidden sm:block leading-none">
                <p className="text-sm font-medium text-ink">{userName}</p>
                <p className="mono text-xs uppercase tracking-widest text-accent mt-1">{userRoleLabel}</p>
              </div>
              <div className="w-9 h-9 border border-line flex items-center justify-center bg-panel">
                <span className="mono text-xs text-ink">{userName.substring(0, 2).toUpperCase()}</span>
              </div>
            </Link>
          </div>
        </header>

        {/* Content */}
        <div className="flex-1 overflow-auto p-4 md:p-8 bg-paper">{children}</div>

        {/* Floating IA button */}
        <div className="fixed bottom-6 right-6 z-[100]">
          <button
            onClick={() => setIsChatOpen(!isChatOpen)}
            aria-label="Assistant IA"
            className={`w-14 h-14 flex items-center justify-center text-paper transition-colors ${
              isChatOpen ? 'bg-ink' : 'bg-accent hover:bg-accent-ink'
            }`}
          >
            {isChatOpen ? <X className="w-6 h-6" /> : <Bot className="w-6 h-6" />}
          </button>
        </div>

        <AIChatbot isOpen={isChatOpen} onClose={() => setIsChatOpen(false)} />
      </main>
    </div>
  );
}

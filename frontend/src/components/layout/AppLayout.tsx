import React from 'react';
import Link from 'next/link';
import { useRouter } from 'next/router';
import { 
  Bell, 
  MessageSquare, 
  UserCircle,
  Search,
  LogOut,
  Bot,
  X
} from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
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

  return (
    <div className="flex h-screen bg-[#F8F9FA] overflow-hidden relative">
      {/* Mobile Menu Overlay */}
      {isMobileMenuOpen && (
        <div 
          className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm z-[150] md:hidden animate-in fade-in duration-300"
          onClick={() => setIsMobileMenuOpen(false)}
        />
      )}

      {/* Sidebar (Desktop) */}
      <aside className="w-64 bg-white border-r border-slate-200 flex flex-col hidden md:flex shrink-0">
        <div className="p-6 flex items-center gap-3">
          <div className="w-10 h-10 bg-white border border-slate-100 rounded-lg flex items-center justify-center p-1.5 shadow-sm">
            <img src="/logo.PNG" alt="CLF" className="w-full h-full object-contain" />
          </div>
          <span className="font-bold text-xl text-slate-900 tracking-tight">Le Flambeau</span>
        </div>
        
        <div className="flex-1 overflow-y-auto py-4">
          <div className="px-4 mb-2 text-xs font-semibold text-slate-400 uppercase tracking-wider">
            Menu Principal
          </div>
          <nav className="space-y-1 px-3">
            {navItems.map((item) => {
              const isActive = router.pathname === item.href;
              return (
                <Link 
                  key={item.name} 
                  href={item.href}
                  className={`flex items-center gap-3 px-3 py-2.5 rounded-xl transition-colors ${
                    isActive 
                      ? 'bg-[#FFF8E7] text-[#D32D3F] font-bold shadow-sm' 
                      : 'text-slate-500 hover:bg-slate-50 hover:text-slate-900'
                  }`}
                >
                  <item.icon className={`w-5 h-5 ${isActive ? 'text-[#D32D3F]' : ''}`} />
                  <span className="text-sm">{item.name}</span>
                </Link>
              );
            })}
          </nav>

          <div className="px-4 mt-8 mb-2 text-xs font-semibold text-slate-400 uppercase tracking-wider">
            Gestion de Compte
          </div>
          <nav className="space-y-1 px-3">
            <Link 
              href="/dashboard/profile"
              className={`flex items-center gap-3 px-3 py-2.5 rounded-xl transition-colors ${
                router.pathname === '/dashboard/profile' 
                  ? 'bg-[#FFF8E7] text-[#D32D3F] font-bold shadow-sm' 
                  : 'text-slate-500 hover:bg-slate-50 hover:text-slate-900'
              }`}
            >
              <UserCircle className="w-5 h-5" />
              <span className="text-sm">Mon Profil</span>
            </Link>
            <button 
              onClick={handleLogout}
              className="w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-slate-500 hover:bg-red-50 hover:text-red-600 transition-colors"
            >
              <LogOut className="w-5 h-5" />
              <span className="text-sm">Déconnexion</span>
            </button>
          </nav>
        </div>
        
        <div className="p-4 border-t border-slate-100 bg-slate-50/50">
          <p className="text-[10px] text-center font-bold text-slate-400 uppercase tracking-widest">Une École • Une Vision</p>
        </div>
      </aside>

      {/* Mobile Drawer */}
      <aside className={`fixed top-0 left-0 bottom-0 w-72 bg-white z-[200] flex flex-col md:hidden transition-transform duration-500 ease-spring ${isMobileMenuOpen ? 'translate-x-0' : '-translate-x-full'}`}>
        <div className="p-6 flex items-center justify-between border-b border-slate-50">
          <div className="flex items-center gap-3">
            <img src="/logo.PNG" alt="CLF" className="w-8 h-8 object-contain" />
            <span className="font-bold text-lg text-slate-900 tracking-tight">Le Flambeau</span>
          </div>
          <button onClick={() => setIsMobileMenuOpen(false)} className="p-2 hover:bg-slate-50 rounded-xl">
            <X className="w-5 h-5 text-slate-400" />
          </button>
        </div>
        <div className="flex-1 overflow-y-auto py-6">
          <nav className="space-y-1 px-3">
            {navItems.map((item) => {
              const isActive = router.pathname === item.href;
              return (
                <Link 
                  key={item.name} 
                  href={item.href}
                  onClick={() => setIsMobileMenuOpen(false)}
                  className={`flex items-center gap-4 px-4 py-3.5 rounded-2xl transition-colors ${
                    isActive 
                      ? 'bg-[#D32D3F] text-white font-bold shadow-lg shadow-[#D32D3F]/20' 
                      : 'text-slate-500 hover:bg-slate-50'
                  }`}
                >
                  <item.icon className="w-5 h-5" />
                  <span className="text-sm">{item.name}</span>
                </Link>
              );
            })}
          </nav>
          <div className="mt-8 px-6">
             <button 
               onClick={handleLogout}
               className="w-full flex items-center gap-4 p-4 rounded-2xl bg-red-50 text-red-600 font-bold text-sm"
             >
               <LogOut className="w-5 h-5" />
               Déconnexion
             </button>
          </div>
        </div>
      </aside>
      
      {/* Main Content Area */}
      <main className="flex-1 flex flex-col h-screen overflow-hidden relative">
        {/* Top Navbar */}
        <header className="h-20 px-4 md:px-8 flex items-center justify-between bg-white/80 backdrop-blur-md border-b border-slate-100 z-10 shrink-0">
          <div className="flex items-center gap-4">
            <button 
              onClick={() => setIsMobileMenuOpen(true)}
              className="p-2.5 bg-slate-50 hover:bg-slate-100 rounded-xl md:hidden text-slate-600 transition-colors"
            >
              <div className="w-5 h-4 flex flex-col justify-between">
                <span className="w-full h-0.5 bg-current rounded-full"></span>
                <span className="w-3/4 h-0.5 bg-current rounded-full"></span>
                <span className="w-full h-0.5 bg-current rounded-full"></span>
              </div>
            </button>
            <div className="relative hidden lg:block w-96">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
              <Input 
                type="text" 
                placeholder="Rechercher..." 
                className="pl-10 bg-slate-50 border-none rounded-full h-11 shadow-inner focus-visible:ring-1 focus-visible:ring-[#D32D3F] text-sm"
              />
            </div>
          </div>

          <div className="flex items-center gap-3 md:gap-6">
            <div className="flex items-center gap-2 md:gap-4 text-slate-500 pr-3 md:pr-6 border-r border-slate-100">
              <Link href="/dashboard/admin/messages" className="w-10 h-10 rounded-full bg-slate-50 flex items-center justify-center hover:text-[#D32D3F] transition-colors relative">
                <MessageSquare className="w-5 h-5" />
                <span className="absolute top-2.5 right-2.5 w-2 h-2 bg-[#D32D3F] rounded-full border-2 border-white"></span>
              </Link>
              <Link href="/dashboard/admin/announcements" className="hidden sm:flex w-10 h-10 rounded-full bg-slate-50 items-center justify-center hover:text-[#D32D3F] transition-colors">
                <Bell className="w-5 h-5" />
              </Link>
            </div>
            
            <Link href="/dashboard/profile" className="flex items-center gap-3 hover:opacity-80 transition-opacity">
              <div className="text-right hidden sm:block">
                <p className="text-sm font-bold text-slate-900 leading-none">{userName}</p>
                <p className="text-[9px] font-bold text-[#D32D3F] uppercase tracking-widest mt-1">{userRoleLabel}</p>
              </div>
              <Avatar className="h-10 w-10 border-2 border-white shadow-md">
                <AvatarImage src={`https://api.dicebear.com/7.x/notionists/svg?seed=${userName}`} alt={userName} />
                <AvatarFallback>{userName.substring(0, 2).toUpperCase()}</AvatarFallback>
              </Avatar>
            </Link>
          </div>
        </header>

        {/* Scrollable Content Area */}
        <div className="flex-1 overflow-auto p-4 md:p-8 bg-[#F8F9FA]">
          {children}
        </div>

        {/* Floating IA Button */}
        <div className="fixed bottom-6 right-6 md:bottom-8 md:right-8 z-[100]">
           <button 
             onClick={() => setIsChatOpen(!isChatOpen)}
             className={`w-14 h-14 rounded-2xl shadow-2xl flex items-center justify-center text-white transition-all duration-500 transform hover:scale-110 active:scale-95 ${
               isChatOpen ? 'bg-slate-900 rotate-90' : 'bg-gradient-to-br from-[#D32D3F] to-[#8B1A26]'
             }`}
           >
             {isChatOpen ? <X className="w-6 h-6" /> : <Bot className="w-7 h-7" />}
             {!isChatOpen && (
                <span className="absolute -top-1 -right-1 w-3 h-3 bg-green-500 rounded-full border-2 border-white animate-pulse"></span>
             )}
           </button>
        </div>

        <AIChatbot isOpen={isChatOpen} onClose={() => setIsChatOpen(false)} />
      </main>
    </div>
  );
}

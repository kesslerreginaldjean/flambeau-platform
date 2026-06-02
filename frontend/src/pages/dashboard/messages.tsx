import Head from 'next/head';
import AppLayout from '@/components/layout/AppLayout';
import { ADMIN_NAV_ITEMS } from '@/constants/navigation';
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Search, Send, MoreVertical, Phone, Mail } from 'lucide-react';

export default function InternalMessages() {
  const contacts = [
    { name: 'Jean Dubois', role: 'Professeur', status: 'online', lastMsg: 'Les notes de Terminale A sont prêtes.' },
    { name: 'Marie Joseph', role: 'Secrétariat', status: 'offline', lastMsg: 'Réunion demain à 8h.' },
    { name: 'Paul Pierre', role: 'Parent (Sophie)', status: 'online', lastMsg: 'Merci pour le suivi.' },
  ];

  return (
    <AppLayout navItems={ADMIN_NAV_ITEMS} userName="Admin Flambeau" userRoleLabel="Administrateur">
      <Head>
        <title>Messages | CLF</title>
      </Head>

      <div className="p-6 h-[calc(100vh-120px)]">
        <div className="grid grid-cols-1 lg:grid-cols-3 h-full gap-8">
           {/* Sidebar Contacts */}
           <Card className="lg:col-span-1 border-none shadow-xl rounded-[2.5rem] bg-white overflow-hidden flex flex-col">
              <div className="p-6 border-b border-slate-100 bg-slate-50/50">
                 <h2 className="text-xl font-bold text-slate-800">Messages</h2>
                 <div className="relative mt-4">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                    <Input placeholder="Rechercher..." className="pl-10 rounded-xl border-slate-200" />
                 </div>
              </div>
              <div className="flex-1 overflow-y-auto">
                 {contacts.map((c, i) => (
                   <button key={i} className={`w-full p-4 flex items-center gap-4 hover:bg-slate-50 transition-colors border-b border-slate-50 ${i === 0 ? 'bg-amber-50 border-r-4 border-[#D32D3F]' : ''}`}>
                      <div className="relative">
                         <div className="w-12 h-12 rounded-full bg-slate-100 flex items-center justify-center font-bold text-[#D32D3F]">
                            {c.name[0]}
                         </div>
                         {c.status === 'online' && <span className="absolute bottom-0 right-0 w-3 h-3 bg-green-500 border-2 border-white rounded-full"></span>}
                      </div>
                      <div className="flex-1 text-left overflow-hidden">
                         <div className="flex justify-between">
                            <span className="font-bold text-slate-900">{c.name}</span>
                            <span className="text-[10px] text-slate-400">12:45</span>
                         </div>
                         <p className="text-xs text-slate-500 truncate">{c.lastMsg}</p>
                      </div>
                   </button>
                 ))}
              </div>
           </Card>

           {/* Chat Window */}
           <Card className="lg:col-span-2 border-none shadow-xl rounded-[2.5rem] bg-white overflow-hidden flex flex-col">
              <div className="p-6 border-b border-slate-100 flex justify-between items-center bg-[#FFF8E7]/30">
                 <div className="flex items-center gap-4">
                    <div className="w-12 h-12 rounded-full bg-white shadow-sm flex items-center justify-center font-bold text-[#D32D3F]">JD</div>
                    <div>
                       <h3 className="font-bold text-slate-900">Jean Dubois</h3>
                       <p className="text-xs text-green-600 font-bold flex items-center gap-1">
                          <span className="w-2 h-2 bg-green-500 rounded-full"></span> En ligne
                       </p>
                    </div>
                 </div>
                 <div className="flex gap-2">
                    <button className="p-2 hover:bg-white rounded-xl shadow-sm border border-slate-100 text-slate-400"><Phone className="w-4 h-4" /></button>
                    <button className="p-2 hover:bg-white rounded-xl shadow-sm border border-slate-100 text-slate-400"><Mail className="w-4 h-4" /></button>
                    <button className="p-2 hover:bg-white rounded-xl shadow-sm border border-slate-100 text-slate-400"><MoreVertical className="w-4 h-4" /></button>
                 </div>
              </div>

              <div className="flex-1 p-8 overflow-y-auto bg-slate-50/30 space-y-6">
                 <div className="flex justify-center">
                    <span className="text-[10px] font-bold text-slate-400 bg-white px-3 py-1 rounded-full shadow-sm">AUJOURD'HUI</span>
                 </div>
                 
                 <div className="flex gap-4 max-w-[80%]">
                    <div className="w-8 h-8 rounded-full bg-slate-100 flex-shrink-0 flex items-center justify-center text-[10px] font-bold">JD</div>
                    <div className="p-4 bg-white rounded-[1.5rem] rounded-tl-none shadow-sm text-sm text-slate-600 leading-relaxed">
                       Bonjour, j'ai fini de corriger les copies de la Terminale A. Je vais les saisir dans le système cet après-midi.
                    </div>
                 </div>

                 <div className="flex gap-4 max-w-[80%] ml-auto flex-row-reverse">
                    <div className="p-4 bg-[#D32D3F] text-white rounded-[1.5rem] rounded-tr-none shadow-md text-sm leading-relaxed font-medium">
                       Parfait Jean. Merci pour la réactivité. N'oubliez pas de générer le rapport PDF pour le conseil de classe.
                    </div>
                 </div>
              </div>

              <div className="p-6 bg-white border-t border-slate-100">
                 <div className="relative">
                    <Input placeholder="Écrivez votre message..." className="pr-12 py-7 rounded-[1.5rem] border-slate-100 shadow-sm" />
                    <button className="absolute right-2 top-1/2 -translate-y-1/2 w-10 h-10 bg-[#D32D3F] text-white rounded-full flex items-center justify-center hover:bg-[#8B1A26] transition-colors shadow-lg shadow-[#D32D3F]/20">
                       <Send className="w-4 h-4" />
                    </button>
                 </div>
              </div>
           </Card>
        </div>
      </div>
    </AppLayout>
  );
}

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

      <div className="h-[calc(100vh-120px)]">
        <div className="grid grid-cols-1 lg:grid-cols-3 h-full gap-8">
           {/* Sidebar Contacts */}
           <Card className="lg:col-span-1 border border-line bg-paper p-0 flex flex-col">
              <div className="p-4 border-b border-line">
                 <h2 className="text-lg font-semibold text-ink">Messages</h2>
                 <div className="relative mt-4">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-soft z-10" />
                    <Input placeholder="Rechercher..." className="pl-10" />
                 </div>
              </div>
              <div className="flex-1 overflow-y-auto">
                 {contacts.map((c, i) => (
                   <button key={i} className={`w-full p-4 flex items-center gap-4 hover:bg-panel transition-colors border-b border-line ${i === 0 ? 'bg-panel border-l-2 border-l-accent' : ''}`}>
                      <div className="relative">
                         <div className="w-10 h-10 border border-line bg-paper flex items-center justify-center mono text-xs text-ink">
                            {c.name[0]}
                         </div>
                         {c.status === 'online' && <span className="absolute -bottom-1 -right-1 w-2.5 h-2.5 bg-accent border border-paper"></span>}
                      </div>
                      <div className="flex-1 text-left overflow-hidden">
                         <div className="flex justify-between items-baseline">
                            <span className="font-semibold text-ink">{c.name}</span>
                            <span className="mono text-[10px] text-soft">12:45</span>
                         </div>
                         <p className="text-xs text-soft truncate">{c.lastMsg}</p>
                      </div>
                   </button>
                 ))}
              </div>
           </Card>

           {/* Chat Window */}
           <Card className="lg:col-span-2 border border-line bg-paper p-0 flex flex-col">
              <div className="p-4 border-b border-line flex justify-between items-center">
                 <div className="flex items-center gap-4">
                    <div className="w-10 h-10 border border-line bg-paper flex items-center justify-center mono text-xs text-ink">JD</div>
                    <div>
                       <h3 className="font-semibold text-ink">Jean Dubois</h3>
                       <p className="mono text-xs text-accent flex items-center gap-1.5">
                          <span className="w-1.5 h-1.5 bg-accent"></span> En ligne
                       </p>
                    </div>
                 </div>
                 <div className="flex">
                    <button className="w-9 h-9 flex items-center justify-center border border-line text-soft hover:bg-ink hover:text-paper transition-colors"><Phone className="w-4 h-4" /></button>
                    <button className="w-9 h-9 flex items-center justify-center border border-line border-l-0 text-soft hover:bg-ink hover:text-paper transition-colors"><Mail className="w-4 h-4" /></button>
                    <button className="w-9 h-9 flex items-center justify-center border border-line border-l-0 text-soft hover:bg-ink hover:text-paper transition-colors"><MoreVertical className="w-4 h-4" /></button>
                 </div>
              </div>

              <div className="flex-1 p-6 overflow-y-auto bg-panel space-y-6">
                 <div className="flex justify-center">
                    <span className="mono text-[10px] text-soft uppercase tracking-widest border border-line bg-paper px-3 py-1">AUJOURD'HUI</span>
                 </div>

                 <div className="flex gap-4 max-w-[80%]">
                    <div className="w-8 h-8 border border-line bg-paper flex-shrink-0 flex items-center justify-center mono text-[10px] text-ink">JD</div>
                    <div className="p-4 border border-line bg-paper text-sm text-soft leading-relaxed">
                       Bonjour, j'ai fini de corriger les copies de la Terminale A. Je vais les saisir dans le système cet après-midi.
                    </div>
                 </div>

                 <div className="flex gap-4 max-w-[80%] ml-auto flex-row-reverse">
                    <div className="p-4 bg-accent text-paper text-sm leading-relaxed">
                       Parfait Jean. Merci pour la réactivité. N'oubliez pas de générer le rapport PDF pour le conseil de classe.
                    </div>
                 </div>
              </div>

              <div className="p-4 bg-paper border-t border-line">
                 <div className="relative">
                    <Input placeholder="Écrivez votre message..." className="pr-12" />
                    <button className="absolute right-1 top-1/2 -translate-y-1/2 w-9 h-9 bg-accent text-paper flex items-center justify-center hover:bg-accent-ink transition-colors">
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

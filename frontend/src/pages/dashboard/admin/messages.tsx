import React, { useState, useEffect } from 'react';
import Head from 'next/head';
import Link from 'next/link';
import AppLayout from '@/components/layout/AppLayout';
import { ADMIN_NAV_ITEMS } from '@/constants/navigation';
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Search, Send, Phone, Video, MoreVertical, Paperclip, Smile, MessageSquare } from 'lucide-react';

import { authFetch } from "@/lib/authFetch";
export default function AdminMessages() {
  const [messages, setMessages] = useState<any[]>([]);
  const [input, setInput] = useState('');
  const [contacts, setContacts] = useState<any[]>([]);
  const [selectedUser, setSelectedUser] = useState<any>(null);
  const [, setLoading] = useState(true);

  // Fetch real users to use as contacts
  const fetchContacts = async () => {
    try {
      const response = await authFetch('/api/admin/users');
      const data = await response.json();
      // On filtre pour ne pas se voir soi-même (l'admin) dans la liste des contacts
      const filteredContacts = data.filter((u: any) => u.role !== 'admin');
      setContacts(filteredContacts);
    } catch (error) {
      console.error('Failed to fetch contacts');
    }
  };

  const fetchMessages = async () => {
    if (!selectedUser) return;
    try {
      const response = await authFetch(`/api/communication/messages?userId=${selectedUser.id}`);
      const data = await response.json();
      setMessages(data);
    } catch (error) {
      console.error('Failed to fetch messages');
    } finally {
      setLoading(false);
    }
  };


  useEffect(() => {
    if (!selectedUser) return;
    fetchMessages();
    // On peut mettre un intervalle pour rafraîchir les messages automatiquement
    const interval = setInterval(fetchMessages, 3000);
    return () => clearInterval(interval);
  }, [selectedUser]);

  const [currentUser, setCurrentUser] = useState<any>(null);

  useEffect(() => {
    const user = JSON.parse(localStorage.getItem('user') || '{}');
    setCurrentUser(user);
    fetchContacts();
  }, []);

  const handleSend = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!input.trim() || !selectedUser || !currentUser?.id) return;

    const newMessage = {
      senderId: currentUser.id,
      receiverId: selectedUser.id,
      content: input
    };

    try {
      const response = await authFetch('/api/communication/messages', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(newMessage)
      });
      if (response.ok) {
        setInput('');
        fetchMessages();
      }
    } catch (error) {
      alert('Erreur lors de l\'envoi');
    }
  };

  return (
    <AppLayout navItems={ADMIN_NAV_ITEMS} userName="Admin Flambeau" userRoleLabel="Administrateur">
      <Head>
        <title>Messagerie Interne | CLF</title>
      </Head>

      <div className="h-[calc(100vh-120px)] flex gap-6">
        {/* Contact List */}
        <div className="w-80 flex flex-col gap-6">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-soft z-10" />
            <Input placeholder="Rechercher un contact..." className="pl-10" />
          </div>

          <Card className="flex-1 border border-line bg-paper overflow-hidden flex flex-col">
            <div className="p-6 border-b border-line">
              <h2 className="text-xl font-semibold text-ink">Conversations</h2>
            </div>
            <div className="overflow-y-auto flex-1">
              {contacts.length === 0 ? (
                <div className="p-8 text-center text-soft text-sm">
                  Aucun utilisateur créé pour le moment.
                </div>
              ) : contacts.map((contact) => (
                <div
                  key={contact.id}
                  onClick={() => setSelectedUser(contact)}
                  className={`p-4 flex items-center gap-4 cursor-pointer transition-colors hover:bg-panel border-b border-line border-l-2 ${selectedUser?.id === contact.id ? 'border-l-accent bg-panel' : 'border-l-transparent'
                    }`}
                >
                  <div className="relative">
                    <Avatar className="h-12 w-12 border border-line">
                      <AvatarImage src={`https://api.dicebear.com/7.x/notionists/svg?seed=${contact.lastName}`} />
                      <AvatarFallback>{contact.firstName[0]}</AvatarFallback>
                    </Avatar>
                    <span className="absolute bottom-0 right-0 w-3 h-3 bg-soft border-2 border-paper"></span>
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="font-medium text-ink truncate">{contact.firstName} {contact.lastName}</p>
                    <p className="mono text-xs text-soft uppercase tracking-widest">{contact.role}</p>
                  </div>
                </div>
              ))}
            </div>
          </Card>
        </div>

        {/* Chat Area */}
        <Card className="flex-1 border border-line bg-paper overflow-hidden flex flex-col">
          {selectedUser ? (
            <>
              {/* Chat Header */}
              <div className="p-6 border-b border-line flex items-center justify-between bg-paper">
                <div className="flex items-center gap-4">
                  <Avatar className="h-12 w-12 border border-line">
                    <AvatarImage src={`https://api.dicebear.com/7.x/notionists/svg?seed=${selectedUser.lastName}`} />
                    <AvatarFallback>{selectedUser.firstName[0]}</AvatarFallback>
                  </Avatar>
                  <div>
                    <h3 className="font-semibold text-ink">{selectedUser.firstName} {selectedUser.lastName}</h3>
                    <p className="mono text-xs text-soft uppercase tracking-widest">{selectedUser.role}</p>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <Button variant="ghost" size="icon" className="hover:bg-panel text-soft"><Phone className="w-5 h-5" /></Button>
                  <Button variant="ghost" size="icon" className="hover:bg-panel text-soft"><Video className="w-5 h-5" /></Button>
                  <Button variant="ghost" size="icon" className="hover:bg-panel text-soft"><MoreVertical className="w-5 h-5" /></Button>
                </div>
              </div>

              {/* Messages Area */}
              <div className="flex-1 overflow-y-auto p-8 bg-panel space-y-6">
                 {messages.length === 0 ? (
                   <div className="h-full flex flex-col items-center justify-center text-soft space-y-2">
                     <MessageSquare className="w-12 h-12 opacity-30" />
                     <p className="mono text-sm uppercase tracking-widest">Aucun message</p>
                     <p className="mono text-[10px] text-soft">Envoyez le premier message à {selectedUser.firstName}.</p>
                   </div>
                 ) : [...messages].reverse().map((msg) => (
                   <div key={msg.id} className={`flex ${msg.senderId === currentUser?.id ? 'justify-end' : 'justify-start'}`}>
                     <div className={`max-w-[70%] p-5 border ${msg.senderId === currentUser?.id
                         ? 'bg-ink text-paper border-ink'
                         : 'bg-paper text-ink border-line'
                       }`}>
                       <p className="text-sm leading-relaxed">{msg.content}</p>
                       <span className={`mono text-[10px] mt-2 block ${msg.senderId === currentUser?.id ? 'text-right text-paper/60' : 'text-soft'}`}>
                         {new Date(msg.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                       </span>
                     </div>
                   </div>
                 ))}
              </div>

              {/* Input Area */}
              <div className="p-6 bg-paper border-t border-line">
                <form onSubmit={handleSend} className="flex items-center gap-2 bg-panel p-2 border border-line">
                  <Button type="button" variant="ghost" size="icon" className="text-soft"><Smile className="w-5 h-5" /></Button>
                  <Button type="button" variant="ghost" size="icon" className="text-soft"><Paperclip className="w-5 h-5" /></Button>
                  <Input
                    value={input}
                    onChange={e => setInput(e.target.value)}
                    placeholder={`Écrire à ${selectedUser.firstName}...`}
                    className="flex-1 bg-transparent border-none focus-visible:ring-0 text-ink"
                  />
                  <Button type="submit" className="btn-accent w-12 h-12 p-0 shrink-0">
                    <Send className="w-5 h-5" />
                  </Button>
                </form>
              </div>
            </>
          ) : (
            <div className="flex-1 flex flex-col items-center justify-center text-center p-12 space-y-4">
              <div className="w-24 h-24 bg-panel border border-line flex items-center justify-center text-soft">
                <MessageSquare className="w-12 h-12" />
              </div>
              <h3 className="text-2xl font-semibold text-ink">Messagerie Réelle CLF</h3>
              <p className="text-soft max-w-sm">Sélectionnez un utilisateur réel de votre base de données pour commencer à discuter.</p>
              <Link href="/dashboard/admin/users" className="text-accent mono text-xs uppercase tracking-widest border-b-2 border-accent pb-1 hover:text-accent-ink">
                Créer des utilisateurs
              </Link>
            </div>
          )}
        </Card>
      </div>
    </AppLayout>
  );
}

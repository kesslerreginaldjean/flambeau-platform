import React, { useState, useEffect } from 'react';
import Head from 'next/head';
import AppLayout from '@/components/layout/AppLayout';
import { ADMIN_NAV_ITEMS } from '@/constants/navigation';
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Search, Send, Phone, Video, MoreVertical, Paperclip, Smile, MessageSquare } from 'lucide-react';

export default function AdminMessages() {
  const [messages, setMessages] = useState<any[]>([]);
  const [input, setInput] = useState('');
  const [contacts, setContacts] = useState<any[]>([]);
  const [selectedUser, setSelectedUser] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  // Fetch real users to use as contacts
  const fetchContacts = async () => {
    try {
      const response = await fetch('http://localhost:5000/api/admin/users');
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
      const response = await fetch(`http://localhost:5000/api/communication/messages?userId=${selectedUser.id}`);
      const data = await response.json();
      setMessages(data);
    } catch (error) {
      console.error('Failed to fetch messages');
    } finally {
      setLoading(false);
    }
  };


  useEffect(() => {
    if (selectedUser) {
      fetchMessages();
      // On peut mettre un intervalle pour rafraîchir les messages automatiquement
      const interval = setInterval(fetchMessages, 3000);
      return () => clearInterval(interval);
    }
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
      const response = await fetch('http://localhost:5000/api/communication/messages', {
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

      <div className="h-[calc(100vh-120px)] flex gap-6 p-6">
        {/* Contact List */}
        <div className="w-80 flex flex-col gap-6">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
            <Input placeholder="Rechercher un contact..." className="pl-10 rounded-2xl bg-white border-none shadow-sm h-12" />
          </div>

          <Card className="flex-1 border-none shadow-xl rounded-[2.5rem] bg-white overflow-hidden flex flex-col">
            <div className="p-6 border-b border-slate-50">
              <h2 className="text-xl font-bold text-slate-900">Conversations</h2>
            </div>
            <div className="overflow-y-auto flex-1">
              {contacts.length === 0 ? (
                <div className="p-8 text-center text-slate-400 text-sm italic">
                  Aucun utilisateur créé pour le moment.
                </div>
              ) : contacts.map((contact) => (
                <div
                  key={contact.id}
                  onClick={() => setSelectedUser(contact)}
                  className={`p-4 flex items-center gap-4 cursor-pointer transition-colors hover:bg-slate-50 border-l-4 ${selectedUser?.id === contact.id ? 'border-[#D32D3F] bg-[#FFF8E7]/30' : 'border-transparent'
                    }`}
                >
                  <div className="relative">
                    <Avatar className="h-12 w-12 border-2 border-white shadow-sm">
                      <AvatarImage src={`https://api.dicebear.com/7.x/notionists/svg?seed=${contact.lastName}`} />
                      <AvatarFallback>{contact.firstName[0]}</AvatarFallback>
                    </Avatar>
                    <span className="absolute bottom-0 right-0 w-3 h-3 bg-slate-300 rounded-full border-2 border-white"></span>
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="font-bold text-slate-900 truncate">{contact.firstName} {contact.lastName}</p>
                    <p className="text-xs text-slate-400 font-medium uppercase tracking-widest">{contact.role}</p>
                  </div>
                </div>
              ))}
            </div>
          </Card>
        </div>

        {/* Chat Area */}
        <Card className="flex-1 border-none shadow-2xl rounded-[3rem] bg-white overflow-hidden flex flex-col">
          {selectedUser ? (
            <>
              {/* Chat Header */}
              <div className="p-6 border-b border-slate-100 flex items-center justify-between bg-white">
                <div className="flex items-center gap-4">
                  <Avatar className="h-12 w-12 border-2 border-[#D32D3F]/10">
                    <AvatarImage src={`https://api.dicebear.com/7.x/notionists/svg?seed=${selectedUser.lastName}`} />
                    <AvatarFallback>{selectedUser.firstName[0]}</AvatarFallback>
                  </Avatar>
                  <div>
                    <h3 className="font-bold text-slate-900">{selectedUser.firstName} {selectedUser.lastName}</h3>
                    <p className="text-xs text-slate-400 font-bold uppercase tracking-widest">{selectedUser.role}</p>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <Button variant="ghost" size="icon" className="rounded-xl hover:bg-slate-100 text-slate-400"><Phone className="w-5 h-5" /></Button>
                  <Button variant="ghost" size="icon" className="rounded-xl hover:bg-slate-100 text-slate-400"><Video className="w-5 h-5" /></Button>
                  <Button variant="ghost" size="icon" className="rounded-xl hover:bg-slate-100 text-slate-400"><MoreVertical className="w-5 h-5" /></Button>
                </div>
              </div>

              {/* Messages Area */}
              <div className="flex-1 overflow-y-auto p-8 bg-[#F8F9FA] space-y-6">
                 {messages.length === 0 ? (
                   <div className="h-full flex flex-col items-center justify-center text-slate-300 space-y-2">
                     <MessageSquare className="w-12 h-12 opacity-20" />
                     <p className="text-sm font-bold uppercase tracking-widest opacity-50">Aucun message</p>
                     <p className="text-[10px] text-slate-400">Envoyez le premier message à {selectedUser.firstName}.</p>
                   </div>
                 ) : [...messages].reverse().map((msg) => (
                   <div key={msg.id} className={`flex ${msg.senderId === currentUser?.id ? 'justify-end' : 'justify-start'}`}>
                     <div className={`max-w-[70%] p-5 rounded-[2rem] ${msg.senderId === currentUser?.id
                         ? 'bg-[#D32D3F] text-white rounded-tr-none shadow-xl shadow-[#D32D3F]/20 font-bold'
                         : 'bg-white text-slate-700 rounded-tl-none shadow-sm border border-slate-100 font-medium'
                       }`}>
                       <p className="text-sm leading-relaxed">{msg.content}</p>
                       <span className={`text-[10px] mt-2 block ${msg.senderId === currentUser?.id ? 'text-right opacity-70' : 'text-slate-400'}`}>
                         {new Date(msg.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                       </span>
                     </div>
                   </div>
                 ))}
              </div>

              {/* Input Area */}
              <div className="p-6 bg-white border-t border-slate-100">
                <form onSubmit={handleSend} className="flex items-center gap-4 bg-slate-50 p-2 rounded-[2rem] border border-slate-100">
                  <Button type="button" variant="ghost" size="icon" className="rounded-full text-slate-400"><Smile className="w-5 h-5" /></Button>
                  <Button type="button" variant="ghost" size="icon" className="rounded-full text-slate-400"><Paperclip className="w-5 h-5" /></Button>
                  <Input
                    value={input}
                    onChange={e => setInput(e.target.value)}
                    placeholder={`Écrire à ${selectedUser.firstName}...`}
                    className="flex-1 bg-transparent border-none focus-visible:ring-0 shadow-none font-bold text-slate-700"
                  />
                  <Button type="submit" className="bg-[#D32D3F] hover:bg-[#8B1A26] text-white w-12 h-12 rounded-full shadow-lg p-0 transition-transform hover:scale-110 active:scale-90">
                    <Send className="w-5 h-5" />
                  </Button>
                </form>
              </div>
            </>
          ) : (
            <div className="flex-1 flex flex-col items-center justify-center text-center p-12 space-y-4">
              <div className="w-24 h-24 bg-slate-50 rounded-full flex items-center justify-center text-slate-300">
                <MessageSquare className="w-12 h-12" />
              </div>
              <h3 className="text-2xl font-bold text-slate-900">Messagerie Réelle CLF</h3>
              <p className="text-slate-500 max-w-sm font-medium">Sélectionnez un utilisateur réel de votre base de données pour commencer à discuter.</p>
              <Link href="/dashboard/admin/users" className="text-[#D32D3F] text-xs font-black uppercase tracking-widest border-b-2 border-[#D32D3F] pb-1">
                Créer des utilisateurs
              </Link>
            </div>
          )}
        </Card>
      </div>
    </AppLayout>
  );
}

import Link from 'next/link';

import React, { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Send, X, Bot, Sparkles, MinusCircle } from 'lucide-react';

interface Message {
  id: number;
  text: string;
  sender: 'user' | 'clf';
  timestamp: Date;
}

export const AIChatbot = ({ isOpen, onClose }: { isOpen: boolean; onClose: () => void }) => {
  const [messages, setMessages] = useState<Message[]>([
    {
      id: 1,
      text: "Bonjour ! Je suis IA CLF, l'intelligence du Collège Le Flambeau. Comment puis-je vous accompagner aujourd'hui ?",
      sender: 'clf',
      timestamp: new Date()
    }
  ]);
  const [input, setInput] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages, isTyping]);

  const handleSend = async () => {
    if (!input.trim()) return;

    const userMsg: Message = {
      id: Date.now(),
      text: input,
      sender: 'user',
      timestamp: new Date()
    };

    setMessages(prev => [...prev, userMsg]);
    setInput('');
    setIsTyping(true);

    try {
      const userId = localStorage.getItem('user_id');
      const userRole = localStorage.getItem('user_type');
      const apiUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000';

      const response = await fetch(`${apiUrl}/api/ai/chat`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ 
          message: input,
          userId,
          userRole
        }),
      });

      if (!response.ok) throw new Error();
      const data = await response.json();

      const clfMsg: Message = {
        id: Date.now() + 1,
        text: data.reply,
        sender: 'clf',
        timestamp: new Date()
      };
      setMessages(prev => [...prev, clfMsg]);
    } catch (err) {
      const errMsg: Message = {
        id: Date.now() + 1,
        text: "Désolé, ma connexion avec le serveur central a été interrompue. Je reviens très vite !",
        sender: 'clf',
        timestamp: new Date()
      };
      setMessages(prev => [...prev, errMsg]);
    } finally {
      setIsTyping(false);
    }
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ opacity: 0, y: 100, scale: 0.8 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          exit={{ opacity: 0, y: 100, scale: 0.8 }}
          className="fixed bottom-28 right-4 md:right-8 z-[110] w-[92vw] md:w-[420px] bg-white rounded-[2rem] shadow-[0_30px_80px_-10px_rgba(0,0,0,0.25)] border border-slate-100 flex flex-col overflow-hidden"
          style={{ maxHeight: 'calc(100vh - 160px)', minHeight: '420px' }}
        >
          {/* Header */}
          <div className="p-6 bg-[#D32D3F] text-white flex items-center justify-between shadow-lg">
            <div className="flex items-center gap-4">
              <div className="relative">
                <div className="w-12 h-12 bg-white rounded-2xl flex items-center justify-center text-[#D32D3F] shadow-inner">
                  <Bot className="w-7 h-7" />
                </div>
                <div className="absolute -bottom-1 -right-1 w-4 h-4 bg-green-500 border-2 border-[#D32D3F] rounded-full animate-pulse"></div>
              </div>
              <div>
                <h3 className="font-black text-lg leading-none mb-1">IA CLF</h3>
                <p className="text-[10px] font-bold uppercase tracking-widest text-white/60">Système Intelligent Officiel</p>
              </div>
            </div>
            <button onClick={onClose} className="p-2 hover:bg-white/10 rounded-full transition-colors">
              <MinusCircle className="w-6 h-6" />
            </button>
          </div>

          {/* Messages Area */}
          <div 
            ref={scrollRef}
            className="flex-1 overflow-y-auto p-6 space-y-6 bg-gradient-to-b from-slate-50 to-white"
          >
            {messages.map((msg) => (
              <motion.div
                initial={{ opacity: 0, x: msg.sender === 'user' ? 20 : -20 }}
                animate={{ opacity: 1, x: 0 }}
                key={msg.id}
                className={`flex ${msg.sender === 'user' ? 'justify-end' : 'justify-start'}`}
              >
                <div className={`max-w-[80%] p-4 rounded-[1.5rem] text-sm font-medium shadow-sm ${
                  msg.sender === 'user' 
                    ? 'bg-[#D32D3F] text-white rounded-tr-none' 
                    : 'bg-white border border-slate-100 text-slate-700 rounded-tl-none'
                }`}>
                  {msg.text}
                  <p className={`text-[8px] mt-2 opacity-50 ${msg.sender === 'user' ? 'text-right' : 'text-left'}`}>
                    {msg.timestamp.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                  </p>
                </div>
              </motion.div>
            ))}
            {isTyping && (
              <div className="flex justify-start">
                <div className="bg-white border border-slate-100 p-4 rounded-[1.5rem] rounded-tl-none flex gap-1">
                  <span className="w-1.5 h-1.5 bg-slate-300 rounded-full animate-bounce"></span>
                  <span className="w-1.5 h-1.5 bg-slate-300 rounded-full animate-bounce [animation-delay:0.2s]"></span>
                  <span className="w-1.5 h-1.5 bg-slate-300 rounded-full animate-bounce [animation-delay:0.4s]"></span>
                </div>
              </div>
            )}
          </div>

          {/* Input Area */}
          <div className="p-6 bg-white border-t border-slate-100">
            <div className="relative flex items-center">
              <input
                type="text"
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyPress={(e) => e.key === 'Enter' && handleSend()}
                placeholder="Posez votre question à IA CLF..."
                className="w-full pl-6 pr-14 py-4 bg-slate-50 border-2 border-transparent rounded-[2rem] focus:bg-white focus:border-[#D32D3F] outline-none transition-all font-bold text-slate-900 placeholder-slate-400 text-sm shadow-inner"
              />
              <button 
                onClick={handleSend}
                className="absolute right-2 p-3 bg-[#D32D3F] text-white rounded-full hover:bg-[#8B1A26] transition-all transform active:scale-90"
              >
                <Send className="w-5 h-5" />
              </button>
            </div>
            <div className="mt-4 flex justify-center items-center gap-2 text-[#D32D3F]/40">
              <Sparkles className="w-3 h-3" />
              <p className="text-[9px] font-black uppercase tracking-widest">Une École • Une Vision</p>
            </div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

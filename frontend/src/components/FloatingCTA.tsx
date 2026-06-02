import Link from 'next/link';
import { motion } from 'framer-motion';
import { MessageCircle, FileText, X, Bot } from 'lucide-react';
import { useState } from 'react';
import { AIChatbot } from './AIChatbot';

const FloatingCTA = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [isChatOpen, setIsChatOpen] = useState(false);

  return (
    <>
      <div className="fixed bottom-8 right-8 z-[100] flex flex-col items-end gap-4">
        {/* Action Menu */}
        <motion.div 
          initial={{ opacity: 0, scale: 0, y: 20 }}
          animate={isOpen ? { opacity: 1, scale: 1, y: 0 } : { opacity: 0, scale: 0, y: 20 }}
          className="flex flex-col gap-3 items-end mb-2"
        >
          <button onClick={() => { setIsChatOpen(true); setIsOpen(false); }}>
            <div className="flex items-center gap-3 group">
              <span className="px-4 py-2 bg-white text-slate-900 shadow-xl rounded-xl text-xs font-extrabold uppercase tracking-widest opacity-0 group-hover:opacity-100 transition-opacity border border-slate-100">
                Parler à IA CLF
              </span>
              <div className="w-14 h-14 bg-gradient-to-br from-[#D32D3F] to-slate-900 text-white rounded-2xl shadow-2xl flex items-center justify-center border border-white/20 hover:scale-110 transition-all transform hover:rotate-12">
                <Bot className="w-6 h-6" />
              </div>
            </div>
          </button>

          <Link href="/admissions">
            <div className="flex items-center gap-3 group">
              <span className="px-4 py-2 bg-white text-slate-900 shadow-xl rounded-xl text-xs font-extrabold uppercase tracking-widest opacity-0 group-hover:opacity-100 transition-opacity border border-slate-100">
                Admission
              </span>
              <div className="w-14 h-14 bg-white text-[#D32D3F] rounded-2xl shadow-2xl flex items-center justify-center border border-slate-100 hover:bg-[#D32D3F] hover:text-white transition-all transform hover:-rotate-12">
                <FileText className="w-6 h-6" />
              </div>
            </div>
          </Link>
        </motion.div>

        {/* Main Toggle Button */}
        <motion.button
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.9 }}
          onClick={() => setIsOpen(!isOpen)}
          className={`w-16 h-16 rounded-[1.5rem] shadow-2xl flex items-center justify-center text-white transition-all duration-500 transform ${
            isOpen ? 'bg-slate-900 rotate-90' : 'bg-[#D32D3F] hover:bg-[#8B1A26] shadow-[#D32D3F]/40'
          }`}
        >
          {isOpen ? <X className="w-8 h-8" /> : <MessageCircle className="w-8 h-8" />}
          {!isOpen && (
             <span className="absolute -top-1 -right-1 w-4 h-4 bg-[#FDE68A] rounded-full animate-ping"></span>
          )}
        </motion.button>
      </div>

      <AIChatbot isOpen={isChatOpen} onClose={() => setIsChatOpen(false)} />
    </>
  );
};

export default FloatingCTA;

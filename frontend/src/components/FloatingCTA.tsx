import Link from 'next/link';
import { MessageCircle, FileText, X, Bot } from 'lucide-react';
import { useState } from 'react';
import { AIChatbot } from './AIChatbot';

const FloatingCTA = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [isChatOpen, setIsChatOpen] = useState(false);

  return (
    <>
      <div className="fixed bottom-6 right-6 z-[100] flex flex-col items-end gap-px">
        {/* Action menu */}
        {isOpen && (
          <div className="flex flex-col gap-px items-end mb-px">
            <button
              onClick={() => { setIsChatOpen(true); setIsOpen(false); }}
              className="flex items-center gap-3 group"
            >
              <span className="px-3 py-1 bg-ink text-paper mono text-xs uppercase tracking-widest opacity-0 group-hover:opacity-100 transition-opacity">
                Parler à l’IA CLF
              </span>
              <span className="w-12 h-12 bg-paper text-ink border border-line flex items-center justify-center hover:bg-ink hover:text-paper transition-colors">
                <Bot className="w-5 h-5" />
              </span>
            </button>

            <Link href="/admissions" className="flex items-center gap-3 group">
              <span className="px-3 py-1 bg-ink text-paper mono text-xs uppercase tracking-widest opacity-0 group-hover:opacity-100 transition-opacity">
                Admission
              </span>
              <span className="w-12 h-12 bg-paper text-ink border border-line flex items-center justify-center hover:bg-ink hover:text-paper transition-colors">
                <FileText className="w-5 h-5" />
              </span>
            </Link>
          </div>
        )}

        {/* Main toggle */}
        <button
          onClick={() => setIsOpen(!isOpen)}
          aria-label="Menu d’actions"
          className={`w-14 h-14 flex items-center justify-center text-paper transition-colors ${
            isOpen ? 'bg-ink' : 'bg-accent hover:bg-accent-ink'
          }`}
        >
          {isOpen ? <X className="w-6 h-6" /> : <MessageCircle className="w-6 h-6" />}
        </button>
      </div>

      <AIChatbot isOpen={isChatOpen} onClose={() => setIsChatOpen(false)} />
    </>
  );
};

export default FloatingCTA;

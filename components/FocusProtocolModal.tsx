import React from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Target, User } from 'lucide-react';

interface FocusProtocolModalProps {
  isOpen: boolean;
  peopleOptions: string[];
  onSelect: (person: string) => void;
  onAbort: () => void;
}

const FocusProtocolModal: React.FC<FocusProtocolModalProps> = ({ isOpen, peopleOptions, onSelect, onAbort }) => {
  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 md:p-12">
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onAbort}
            className="absolute inset-0 bg-black/80 backdrop-blur-md"
          />
          
          <motion.div 
            initial={{ opacity: 0, scale: 0.9, y: 20 }} 
            animate={{ opacity: 1, scale: 1, y: 0 }} 
            exit={{ opacity: 0, scale: 0.9, y: 20 }}
            className="relative w-full max-w-3xl max-h-[85vh] bg-white rounded-[2.5rem] shadow-[0_20px_60px_rgba(0,0,0,0.6)] border border-white/10 flex flex-col overflow-hidden"
          >
            <div className="p-8 text-center space-y-2 shrink-0 border-b border-black/5 bg-black/[0.01]">
              <div className="w-12 h-12 bg-primary/10 rounded-2xl flex items-center justify-center mx-auto mb-1">
                <Target className="w-6 h-6 text-primary" />
              </div>
              <h4 className="text-2xl font-headline font-black text-primary italic uppercase tracking-tight">Focus Protocol</h4>
              <p className="text-black/40 text-[9px] font-display font-bold uppercase tracking-[0.25em]">Select the athlete for precision biomechanical tracking</p>
            </div>
            
            <div className="flex-1 overflow-y-auto p-8 custom-scrollbar">
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                {peopleOptions.map((person, idx) => (
                  <button
                    key={idx}
                    onClick={() => onSelect(person)}
                    className="cursor-pointer glass-panel p-5 rounded-2xl border border-black/5 hover:border-primary/40 transition-all text-left flex items-start gap-4 group bg-white shadow-sm hover:shadow-lg hover:-translate-y-1"
                  >
                    <div className="w-10 h-10 rounded-xl bg-black/5 flex items-center justify-center group-hover:bg-primary/20 transition-colors shrink-0">
                      <User className="w-4 h-4 text-black/40 group-hover:text-primary" />
                    </div>
                    <div className="flex-1">
                      <span className="text-[8px] font-bold text-black/20 uppercase tracking-[0.2em] block mb-1">ID {idx + 1}</span>
                      <p className="text-sm font-headline font-bold text-black/80 group-hover:text-black transition-colors italic uppercase tracking-tight line-clamp-1">{person}</p>
                      <p className="text-[8px] text-black/40 mt-1 font-display uppercase tracking-widest">Active Movement</p>
                    </div>
                  </button>
                ))}
              </div>
            </div>

            <div className="p-6 border-t border-black/5 bg-black/[0.01] flex justify-center">
              <button 
                onClick={onAbort}
                className="text-black/30 text-[9px] font-bold uppercase tracking-[0.4em] hover:text-primary transition-colors py-2 cursor-pointer"
              >
                ← Abort Ingestion
              </button>
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
};

export default FocusProtocolModal;

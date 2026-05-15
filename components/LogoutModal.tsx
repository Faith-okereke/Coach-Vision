import React from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { LogOut } from 'lucide-react';

interface LogoutModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
}

const LogoutModal: React.FC<LogoutModalProps> = ({ isOpen, onClose, onConfirm }) => {
  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-[2000] flex items-center justify-center p-6 lg:p-12">
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="absolute inset-0 bg-black/60 backdrop-blur-sm"
          />
          
          <motion.div 
            initial={{ opacity: 0, scale: 0.9, y: 20 }} 
            animate={{ opacity: 1, scale: 1, y: 0 }} 
            exit={{ opacity: 0, scale: 0.9, y: 20 }}
            className="relative w-full max-w-sm bg-white border border-slate-200 rounded-[2.5rem] p-10 text-center shadow-[0_20px_50px_rgba(0,0,0,0.1)]"
          >
            <div className="w-20 h-20 bg-primary/10 rounded-3xl flex items-center justify-center mx-auto mb-8">
              <LogOut className="w-10 h-10 text-primary" />
            </div>
            
            <h4 className="text-2xl font-headline font-black text-slate-900 italic uppercase tracking-tight mb-4">Terminate Session?</h4>
            <p className="text-slate-500 text-sm font-display mb-10 leading-relaxed">
              Are you sure you want to log out of Coach Vision? Your active analysis stream will be preserved on this device.
            </p>
            
            <div className="flex flex-col gap-4">
              <button 
                onClick={onConfirm}
                className="w-full py-4 bg-primary text-white rounded-2xl font-display font-bold text-[10px] uppercase tracking-widest hover:scale-105 active:scale-95 transition-all shadow-xl shadow-primary/20 cursor-pointer"
              >
                CONFIRM LOGOUT
              </button>
              <button 
                onClick={onClose}
                className="w-full py-4 bg-slate-50 text-slate-400 border border-slate-200 rounded-2xl font-display font-bold text-[10px] uppercase tracking-widest hover:bg-slate-100 transition-all cursor-pointer"
              >
                CANCEL
              </button>
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
};

export default LogoutModal;

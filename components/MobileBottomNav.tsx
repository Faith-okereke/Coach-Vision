import React from 'react';
import { 
  LayoutDashboard, 
  Video, 
  Activity,
  ClipboardCheck,
  Zap
} from 'lucide-react';

interface MobileBottomNavProps {
  activeView: string;
  onViewChange: (view: string) => void;
}

export const MobileBottomNav: React.FC<MobileBottomNavProps> = ({ activeView, onViewChange }) => {
  const navItems = [
    { id: 'DASHBOARD', icon: LayoutDashboard, label: 'Dashboard' },
    { id: 'ANALYSIS', icon: Zap, label: 'Analysis' },
    { id: 'REPORTS', icon: ClipboardCheck, label: 'Reports' },
  ];

  return (
    <nav className="lg:hidden fixed bottom-0 w-full z-50 bg-background/60 backdrop-blur-xl border-t border-black/5 flex justify-around items-center h-20 pb-safe">
      {navItems.map((item) => (
        <button
          key={item.id}
          onClick={() => onViewChange(item.id)}
          className={`flex flex-col items-center justify-center gap-1 transition-all ${
            activeView === item.id ? 'text-primary scale-110' : 'text-on-surface-variant'
          }`}
        >
          <item.icon className="w-6 h-6" />
          <span className="text-[10px] font-display font-bold uppercase tracking-wider">{item.label}</span>
        </button>
      ))}
    </nav>
  );
};

import React from 'react';
import { 
  LayoutDashboard, 
  Video, 
  ClipboardCheck, 
  Users, 
  Settings, 
  PlusCircle, 
  HelpCircle, 
  LogOut,
  Volleyball
} from 'lucide-react';

interface SideNavBarProps {
  activeView: string;
  onViewChange: (view: string) => void;
}

export const SideNavBar: React.FC<SideNavBarProps> = ({ activeView, onViewChange }) => {
  const navItems = [
    { id: 'DASHBOARD', icon: LayoutDashboard, label: 'Dashboard' },
    { id: 'ANALYSIS', icon: Video, label: 'AI Capture' },
    { id: 'REPORTS', icon: ClipboardCheck, label: 'Performance Reports' },
  ];

  return (
    <aside className="h-screen w-64 flex-shrink-0 bg-background/60 backdrop-blur-xl border-r border-black/5 flex flex-col py-8 z-50">
      <div className="px-8 mb-12">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-primary flex items-center justify-center shadow-[0_0_20px_rgba(245,90,60,0.2)]">
            <Volleyball className="w-6 h-6 text-white" />
          </div>
          <div>
            <h1 className="font-headline text-lg font-bold text-primary tracking-tight leading-none uppercase">Coach Vision</h1>
            <p className="font-display text-[8px] text-tertiary uppercase tracking-[0.3em] mt-1 font-bold">GeminiSlingShot Engine</p>
          </div>
        </div>
      </div>

      <nav className="flex-1 px-4 space-y-2">
        {navItems.map((item) => (
          <button
            key={item.id}
            onClick={() => onViewChange(item.id)}
            className={`w-full flex items-center gap-4 px-5 py-3.5 rounded-xl transition-all duration-200 group ${
              activeView === item.id
                ? 'bg-primary text-white shadow-lg shadow-primary/20'
                : 'text-on-surface-variant hover:bg-black/5 hover:text-on-background'
            }`}
          >
            <item.icon className={`w-5 h-5 ${activeView === item.id ? 'text-white' : 'group-hover:text-primary transition-colors'}`} />
            <span className={`text-xs font-semibold ${activeView === item.id ? 'text-white' : ''}`}>
              {item.label}
            </span>
          </button>
        ))}
      </nav>

      <div className="px-6 mt-auto space-y-4">
        <button 
          onClick={() => onViewChange('CAPTURE')}
          className="w-full bg-primary text-white font-bold py-4 rounded-2xl mb-8 flex items-center justify-center gap-3 hover:scale-[1.02] active:scale-95 transition-all shadow-lg"
        >
          <PlusCircle className="w-5 h-5" />
          <span className="text-xs font-headline">New Analysis</span>
        </button>

        <div className="space-y-1">
          <button className="w-full flex items-center gap-4 px-5 py-2.5 rounded-lg text-on-surface-variant hover:text-on-background transition-colors group">
            <HelpCircle className="w-4 h-4 group-hover:text-primary" />
            <span className="text-xs font-medium">Help center</span>
          </button>
          <button className="w-full flex items-center gap-4 px-5 py-2.5 rounded-lg text-on-surface-variant hover:text-on-background transition-colors group">
            <LogOut className="w-4 h-4 group-hover:text-red-500" />
            <span className="text-xs font-medium">Logout</span>
          </button>
        </div>
      </div>
    </aside>
  );
};

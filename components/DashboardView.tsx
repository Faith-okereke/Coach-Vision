import React, { useState, useEffect } from 'react';
import { 
  TrendingUp, 
  Activity, 
  PlayCircle, 
  ChevronRight,
  Zap,
  Clock,
  Target,
  Trophy,
  History,
  Calendar
} from 'lucide-react';
import { motion } from 'motion/react';
import { supabaseService } from '../services/supabaseService';
import { supabase } from '../lib/supabase';

export const DashboardView: React.FC = () => {
  const [sessions, setSessions] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState({
    avgPower: 0,
    totalSessions: 0,
    bestJump: 0,
    improvement: 0
  });

  useEffect(() => {
    const fetchUserData = async () => {
      const { data: { user } } = await supabase.auth.getUser();
      if (user) {
        try {
          const data = await supabaseService.getUserAnalyses(user.id);
          setSessions(data || []);
          
          if (data && data.length > 0) {
            const avgPower = data.reduce((acc: number, s: any) => acc + (s.power_score || 0), 0) / data.length;
            const bestJump = Math.max(...data.map((s: any) => s.jump_height || 0));
            setStats({
              avgPower,
              totalSessions: data.length,
              bestJump,
              improvement: 5.4 // Mocked for UI
            });
          }
        } catch (err) {
          console.error(err);
        }
      }
      setLoading(false);
    };

    fetchUserData();
  }, []);

  return (
    <div className="w-full h-full overflow-y-auto p-6 md:p-12 lg:p-24 bg-background text-on-background custom-scrollbar">
      <div className="max-w-7xl mx-auto space-y-16">
        
        {/* Header Section */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 border-b border-black/5 pb-12">
          <div className="space-y-2">
            <h1 className="text-5xl lg:text-7xl font-headline font-black italic uppercase tracking-tighter text-on-background">
              PLAYER <span className="text-primary">CENTRAL</span>
            </h1>
            <p className="text-on-surface-variant text-sm font-display font-medium uppercase tracking-[0.4em]">Personal Performance Protocol • Active Session ID: #001</p>
          </div>
          <div className="flex gap-4">
             <div className="px-6 py-3 bg-slate-50 border border-slate-200 rounded-2xl flex items-center gap-3">
                <Clock className="w-4 h-4 text-primary" />
                <span className="text-[10px] font-bold uppercase tracking-widest text-on-surface-variant">Last Active: Today</span>
             </div>
          </div>
        </div>

        {/* Career Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
           <motion.div 
             initial={{ y: 20, opacity: 0 }}
             animate={{ y: 0, opacity: 1 }}
             className="glass-panel p-8 rounded-[2rem] border border-slate-200 bg-white shadow-sm space-y-6"
           >
              <div className="flex items-center gap-3 text-primary">
                 <Zap className="w-5 h-5" />
                 <span className="text-[10px] font-bold uppercase tracking-widest">Avg Power</span>
              </div>
              <div className="space-y-1">
                 <p className="text-5xl font-headline font-black italic tracking-tighter text-on-background">{stats.avgPower.toFixed(1)}%</p>
                 <div className="flex items-center gap-2 text-green-600 text-[10px] font-bold uppercase tracking-widest">
                    <TrendingUp className="w-3 h-3" />
                    <span>+{stats.improvement}% Weekly Improvement</span>
                 </div>
              </div>
           </motion.div>

           <motion.div 
             initial={{ y: 20, opacity: 0 }}
             animate={{ y: 0, opacity: 1 }}
             transition={{ delay: 0.1 }}
             className="glass-panel p-8 rounded-[2rem] border border-slate-200 bg-white shadow-sm space-y-6"
           >
              <div className="flex items-center gap-3 text-tertiary">
                 <Trophy className="w-5 h-5" />
                 <span className="text-[10px] font-bold uppercase tracking-widest">Best Vertical</span>
              </div>
              <div className="space-y-1">
                 <p className="text-5xl font-headline font-black italic tracking-tighter text-on-background">{stats.bestJump.toFixed(1)}"</p>
                 <p className="text-[10px] font-bold text-on-surface-variant uppercase tracking-widest">Elite Tier Placement</p>
              </div>
           </motion.div>

           <motion.div 
             initial={{ y: 20, opacity: 0 }}
             animate={{ y: 0, opacity: 1 }}
             transition={{ delay: 0.2 }}
             className="glass-panel p-8 rounded-[2rem] border border-slate-200 bg-white shadow-sm space-y-6"
           >
              <div className="flex items-center gap-3 text-cyan-600">
                 <History className="w-5 h-5" />
                 <span className="text-[10px] font-bold uppercase tracking-widest">Total Sessions</span>
              </div>
              <div className="space-y-1">
                 <p className="text-5xl font-headline font-black italic tracking-tighter text-on-background">{stats.totalSessions}</p>
                 <p className="text-[10px] font-bold text-on-surface-variant uppercase tracking-widest">Training Discipline Log</p>
              </div>
           </motion.div>

           <motion.div 
             initial={{ y: 20, opacity: 0 }}
             animate={{ y: 0, opacity: 1 }}
             transition={{ delay: 0.3 }}
             className="glass-panel p-8 rounded-[2rem] border border-slate-200 bg-slate-900 flex items-center justify-center group cursor-pointer hover:bg-primary transition-all duration-500 shadow-xl"
           >
              <div className="text-center space-y-4">
                 <div className="w-12 h-12 rounded-full border-2 border-white/20 flex items-center justify-center mx-auto group-hover:border-white transition-colors">
                    <PlayCircle className="w-6 h-6 text-white" />
                 </div>
                 <p className="text-[10px] font-bold uppercase tracking-[0.3em] text-white">Start New Drill</p>
              </div>
           </motion.div>
        </div>

        {/* Main Content Area */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
           {/* Session History */}
           <div className="lg:col-span-2 space-y-8">
              <div className="flex items-center justify-between">
                 <div className="flex items-center gap-3">
                    <Calendar className="w-6 h-6 text-primary" />
                    <h2 className="text-2xl font-headline font-black italic uppercase tracking-tight text-on-background">Recent Sessions</h2>
                 </div>
                 <button className="text-[10px] font-bold text-on-surface-variant uppercase tracking-widest hover:text-primary transition-colors flex items-center gap-2 cursor-pointer">
                    Open Archive <ChevronRight className="w-4 h-4" />
                 </button>
              </div>

              {loading ? (
                <div className="space-y-4">
                  {[1,2,3].map(i => (
                    <div key={i} className="h-32 w-full bg-slate-100 animate-pulse rounded-[2rem]" />
                  ))}
                </div>
              ) : sessions.length === 0 ? (
                <div className="p-16 rounded-[2rem] border border-dashed border-slate-300 text-center space-y-6">
                   <div className="w-20 h-20 bg-slate-50 rounded-full flex items-center justify-center mx-auto">
                      <Target className="w-10 h-10 text-slate-300" />
                   </div>
                   <div className="space-y-2">
                      <p className="text-xl font-headline font-bold uppercase italic tracking-tight text-on-background">No Training Logs Found</p>
                      <p className="text-xs text-on-surface-variant font-display">Completed sessions will appear here as biometric debriefs.</p>
                   </div>
                </div>
              ) : (
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                   {sessions.map((session, idx) => (
                      <motion.div 
                        initial={{ opacity: 0, scale: 0.95 }}
                        animate={{ opacity: 1, scale: 1 }}
                        transition={{ delay: idx * 0.1 }}
                        key={session.id}
                        className="glass-panel p-8 rounded-[2.5rem] border border-slate-100 bg-white hover:bg-slate-50 transition-all group cursor-pointer relative overflow-hidden shadow-sm hover:shadow-md"
                      >
                         <div className="absolute top-0 right-0 p-8 opacity-[0.05] pointer-events-none">
                            <Activity className="w-24 h-24 text-primary" />
                         </div>
                         
                         <div className="relative z-10 space-y-6">
                            <div className="flex justify-between items-start">
                               <div className="space-y-1">
                                  <p className="text-[8px] font-bold text-primary uppercase tracking-[0.3em]">{session.activity}</p>
                                  <p className="text-xs font-headline font-black italic tracking-wide text-slate-400">{new Date(session.created_at).toLocaleDateString()}</p>
                               </div>
                               <div className="px-3 py-1 bg-primary/10 border border-primary/20 rounded-lg">
                                  <p className="text-[10px] font-black text-primary italic">{session.power_score.toFixed(0)}%</p>
                               </div>
                            </div>

                            <p className="text-sm font-display font-medium text-slate-700 line-clamp-2 italic leading-relaxed">
                               "{session.feedback}"
                            </p>

                            <div className="flex items-center justify-between pt-4 border-t border-slate-100">
                               <div className="flex gap-4">
                                  <div className="flex flex-col">
                                     <span className="text-[8px] font-bold text-slate-400 uppercase">Jump</span>
                                     <span className="text-xs font-black text-on-background italic">{session.jump_height?.toFixed(1) || 0}"</span>
                                  </div>
                               </div>
                               <button className="w-8 h-8 rounded-full bg-slate-50 flex items-center justify-center group-hover:bg-primary transition-colors cursor-pointer">
                                  <ChevronRight className="w-4 h-4 text-slate-400 group-hover:text-white" />
                               </button>
                            </div>
                         </div>
                      </motion.div>
                   ))}
                </div>
              )}
           </div>

           {/* Personal Insights */}
           <div className="space-y-8">
              <h2 className="text-2xl font-headline font-black italic uppercase tracking-tight text-on-background">Technical Insights</h2>
              
              <div className="space-y-4">
                 {[
                   { title: 'Landing Stability', status: 'Optimal', score: 94, color: 'text-green-600' },
                   { title: 'Elbow Position', status: 'Needs Work', score: 62, color: 'text-primary' },
                   { title: 'Shoulder Unlock', status: 'Solid', score: 81, color: 'text-tertiary' }
                 ].map((insight, idx) => (
                   <div key={idx} className="glass-panel p-6 rounded-3xl border border-slate-100 bg-white shadow-sm space-y-4">
                      <div className="flex justify-between items-center">
                         <span className="text-[10px] font-bold uppercase tracking-widest text-on-surface-variant font-display">{insight.title}</span>
                         <span className={`text-[10px] font-black uppercase italic ${insight.color}`}>{insight.status}</span>
                      </div>
                      <div className="h-1.5 w-full bg-slate-100 rounded-full overflow-hidden">
                         <motion.div 
                           initial={{ width: 0 }}
                           animate={{ width: `${insight.score}%` }}
                           className={`h-full ${insight.color.replace('text-', 'bg-')}`}
                         />
                      </div>
                   </div>
                 ))}
              </div>

              <div className="p-8 rounded-[2rem] bg-gradient-to-br from-primary/10 to-transparent border border-primary/20 space-y-4">
                 <div className="w-10 h-10 bg-primary/10 rounded-xl flex items-center justify-center border border-primary/20">
                    <Zap className="w-5 h-5 text-primary" />
                 </div>
                 <div className="space-y-2">
                    <p className="text-[10px] font-bold text-primary uppercase tracking-[0.2em]">Next Objective</p>
                    <p className="text-lg font-headline font-black italic tracking-tight uppercase leading-tight text-on-background">Increase Vertical Reach by 2.5"</p>
                    <p className="text-xs text-on-surface-variant">Focus on core explosive lift-off during serve sequences.</p>
                 </div>
              </div>
           </div>
        </div>

      </div>
      <div className="max-w-7xl mx-auto pt-24 pb-12 text-center border-t border-black/5 mt-24 opacity-40">
        <p className="text-[8px] font-display font-bold text-on-surface-variant uppercase tracking-[0.5em]">PERSONAL TRAINING ENGINE POWERED BY GEMINISLINGSHOT v2.5.0</p>
      </div>
    </div>
  );
};

import React from 'react';
import { 
  TrendingUp, 
  Target, 
  Activity, 
  RotateCcw, 
  Play, 
  FastForward, 
  Rewind,
  BrainCircuit,
  AlertTriangle,
  Download,
  CheckCircle2,
  PlayCircle,
  Clock,
  Zap
} from 'lucide-react';
import { motion } from 'motion/react';

export const ReportsView: React.FC = () => {
  return (
    <div className="w-full h-full overflow-y-auto p-12 bg-transparent custom-scrollbar">
      <div className="max-w-7xl mx-auto space-y-12">
        
        {/* Header Section */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-end mb-8 gap-4 border-b border-black/5 pb-8 bg-background/40 backdrop-blur-md -mx-4 px-4 sticky top-0 z-30">
          <div>
            <span className="font-display text-[10px] font-bold text-tertiary uppercase tracking-[0.3em]">Session Summary</span>
            <h2 className="font-headline text-4xl font-bold text-on-background mt-1 italic tracking-tight">Elite Power Serve Alpha</h2>
            <p className="text-sm text-on-surface-variant mt-1">Recorded: Oct 24, 2023 • Pro Training Grounds</p>
          </div>
          <button className="bg-primary text-white px-8 py-3 rounded-2xl font-display font-bold text-[10px] tracking-widest flex items-center gap-2 hover:scale-105 transition-transform active:scale-95 shadow-lg shadow-primary/20">
            <Download className="w-4 h-4" />
            EXPORT FULL DATA
          </button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-12 gap-8">
          
          {/* Biomechanics Score (Circular) */}
          <div className="md:col-span-4 glass-panel rounded-3xl p-10 flex flex-col items-center justify-center relative overflow-hidden h-full min-h-[420px]">
            <div className="absolute top-6 left-6 font-display text-[9px] font-bold text-on-surface-variant uppercase tracking-widest">Biomechanics Score</div>
            
            <div className="relative w-56 h-56 rounded-full flex items-center justify-center circular-gauge shadow-[0_0_40px_rgba(195,244,0,0.2)]">
              <div className="w-44 h-44 inner-gauge rounded-full flex flex-col items-center justify-center">
                <span className="font-headline text-[56px] font-bold text-primary tracking-tighter leading-none">85</span>
                <span className="font-display text-[10px] font-bold text-on-surface-variant uppercase tracking-widest mt-2">Percentile</span>
              </div>
            </div>

            <div className="mt-8 grid grid-cols-2 gap-12 w-full max-w-[280px]">
              <div className="text-center">
                <div className="text-tertiary font-headline text-2xl font-bold italic">94%</div>
                <div className="font-display text-[9px] font-bold text-on-surface-variant uppercase tracking-widest mt-1">Accuracy</div>
              </div>
              <div className="text-center">
                <div className="text-primary font-headline text-2xl font-bold italic">72mph</div>
                <div className="font-display text-[9px] font-bold text-on-surface-variant uppercase tracking-widest mt-1">Max Velocity</div>
              </div>
            </div>
          </div>

          {/* Performance Metrics Column */}
          <div className="md:col-span-8 space-y-8">
            <div className="glass-panel rounded-3xl p-10">
              <h3 className="font-headline text-xl font-bold text-on-background mb-10 flex items-center gap-3 italic">
                <TrendingUp className="w-5 h-5 text-primary" />
                Performance Metrics
              </h3>
              <div className="h-48 flex items-end justify-between gap-6 px-4">
                {[
                  { label: 'STAB', val: 40 },
                  { label: 'POW', val: 85 },
                  { label: 'ROT', val: 60 },
                  { label: 'EXT', val: 95 },
                  { label: 'TIM', val: 50 },
                ].map((m) => (
                  <div key={m.label} className="w-full flex flex-col items-center gap-4 group">
                    <div className="w-full bg-black/5 rounded-t-xl relative overflow-hidden h-40">
                      <motion.div 
                        initial={{ height: 0 }}
                        animate={{ height: `${m.val}%` }}
                        className="absolute bottom-0 w-full bg-primary/40 group-hover:bg-primary transition-all rounded-t-xl shadow-[0_0_15px_rgba(245,90,60,0.2)]"
                      />
                    </div>
                    <span className="font-display text-[10px] font-bold text-on-surface-variant group-hover:text-on-background transition-colors">{m.label}</span>
                  </div>
                ))}
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              <div className="glass-panel rounded-3xl p-8 border border-black/5 bg-gradient-to-br from-black/5 to-transparent shadow-sm">
                <h4 className="font-display text-[10px] font-bold text-primary uppercase tracking-[0.2em] mb-6">Top Strengths</h4>
                <ul className="space-y-6">
                  <li className="flex items-start gap-4">
                    <div className="p-1 rounded-full bg-tertiary/10">
                      <CheckCircle2 className="w-5 h-5 text-tertiary" />
                    </div>
                    <div>
                      <p className="font-headline text-lg font-bold text-on-background italic tracking-tight">Great Jump</p>
                      <p className="text-sm text-on-surface-variant leading-snug font-medium">You are jumping much higher than you did last week!</p>
                    </div>
                  </li>
                  <li className="flex items-start gap-4">
                    <div className="p-1 rounded-full bg-tertiary/10">
                      <CheckCircle2 className="w-5 h-5 text-tertiary" />
                    </div>
                    <div>
                      <p className="font-headline text-lg font-bold text-on-background italic tracking-tight">Power Flow</p>
                      <p className="text-sm text-on-surface-variant leading-snug font-medium">You are smoothly moving power from your legs all the way to your hand.</p>
                    </div>
                  </li>
                </ul>
              </div>

              <div className="glass-panel rounded-3xl p-8 border border-black/5 bg-gradient-to-br from-black/5 to-transparent shadow-sm">
                <h4 className="font-display text-[10px] font-bold text-red-500 uppercase tracking-[0.2em] mb-6">Ways to improve</h4>
                <ul className="space-y-6">
                  <li className="flex items-start gap-4">
                    <div className="p-1 rounded-full bg-red-400/10">
                      <AlertTriangle className="w-5 h-5 text-red-500" />
                    </div>
                    <div>
                      <p className="font-headline text-lg font-bold text-on-background italic tracking-tight">Swing Speed</p>
                      <p className="text-sm text-on-surface-variant leading-snug font-medium">Try to swing even faster. Snap your elbow quickly at the top of your hit.</p>
                    </div>
                  </li>
                  <li className="flex items-start gap-4">
                    <div className="p-1 rounded-full bg-red-400/10">
                      <AlertTriangle className="w-5 h-5 text-red-500" />
                    </div>
                    <div>
                      <p className="font-headline text-lg font-bold text-on-background italic tracking-tight">Safe Landing</p>
                      <p className="text-sm text-on-surface-variant leading-snug font-medium">Your left ankle roll slightly when you land. Focus on landing flat on both feet.</p>
                    </div>
                  </li>
                </ul>
              </div>
            </div>
          </div>
        </div>

        {/* Keyframe Analysis Section (Bottom) */}
        <div className="glass-panel rounded-3xl p-10 relative overflow-hidden border border-black/10 group shadow-sm">
          <div className="flex justify-between items-center mb-8">
            <h3 className="font-headline text-2xl font-bold text-on-background italic tracking-tight">Keyframe Analysis</h3>
            <div className="flex gap-4">
              <span className="px-4 py-1.5 rounded-full bg-black/5 text-on-surface font-display text-[9px] font-bold uppercase tracking-widest">Peak Impact</span>
              <span className="px-4 py-1.5 rounded-full bg-primary/20 text-primary border border-primary/30 font-display text-[9px] font-bold uppercase tracking-widest">Ideal Model</span>
            </div>
          </div>
          
          <div className="relative aspect-video rounded-2xl overflow-hidden cursor-pointer border border-black/10 group shadow-lg">
            <img 
              className="w-full h-full object-cover opacity-60 transition-opacity duration-700 group-hover:opacity-100" 
              src="https://lh3.googleusercontent.com/aida-public/AB6AXuC3MuZmOtRdlFuvjV2BqW4bzUPOfDBzkysw82LQYEkG7ejbKhtOaWkoo8fXgihVEnmtGmJBWITr2XVx_pPcvAPjt4iO4hC7bBlZsQ20thC19Oymvh9HlX-4xE5JFHNLWXUFRBEBTE9SSJxGURF19N8Qb_6DewBhowELJx_wdG7xp-9_rwndedf7-2qdedO_xQ0beUbAkrBa4BF0ynZITSACzdFsNIsPmsbYSCj-CKeK5mF_Fzz_9vWoeQ_BbGRJKKNrM3ZJ1CVBOg"
              alt="Keyframe Analysis"
            />
            
            <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-all duration-300 scale-90 group-hover:scale-100">
              <div className="w-20 h-20 rounded-full bg-primary flex items-center justify-center shadow-[0_0_50px_rgba(245,90,60,0.5)] transition-transform hover:scale-110">
                <PlayCircle className="w-10 h-10 text-white fill-current" />
              </div>
            </div>

            {/* Seek Bar HUD Overlay */}
            <div className="absolute bottom-10 left-10 right-10 space-y-3">
              <div className="h-1.5 bg-black/10 rounded-full relative overflow-hidden">
                <div className="absolute h-full bg-primary w-[68%] shadow-[0_0_20px_#f55a3c]">
                   <div className="absolute right-0 top-1/2 -translate-y-1/2 w-4 h-4 bg-primary rounded-full shadow-[0_0_15px_#f55a3c]" />
                </div>
              </div>
              <div className="flex justify-between items-center px-1">
                 <span className="text-[10px] font-display font-bold text-on-background tabular-nums">0:12.45</span>
                 <span className="text-[10px] font-display font-bold text-on-background/40 tabular-nums">0:18.00</span>
              </div>
            </div>
          </div>
        </div>

      </div>
      <div className="max-w-7xl mx-auto pt-12 pb-6 text-center border-t border-black/5 mt-12">
        <p className="text-[8px] font-display font-bold text-on-surface-variant/20 uppercase tracking-[0.5em]">Powered by GeminiSlingShot Analytics Invariant</p>
      </div>
    </div>
  );
};

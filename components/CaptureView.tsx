import React from 'react';
import { 
  CloudUpload, 
  Settings2, 
  Users, 
  Layers, 
  Play, 
  RefreshCw, 
  X,
  FileVideo,
  CheckCircle2,
  Clock
} from 'lucide-react';
import { motion } from 'motion/react';

export const CaptureView: React.FC = () => {
  return (
    <div className="w-full h-full overflow-y-auto p-12 bg-transparent custom-scrollbar">
      <div className="max-w-7xl mx-auto space-y-10">
        
        {/* Dynamic Header */}
        <div className="flex justify-between items-center w-full pb-8 border-b border-black/5 bg-background/40 backdrop-blur-md -mx-4 px-4 sticky top-0 z-30">
          <div className="flex items-center gap-10">
            <h2 className="font-headline text-2xl font-bold text-on-background tracking-tight italic">Coach Vision</h2>
           
          </div>
          <div className="flex items-center gap-6">
             <div className="hidden md:flex items-center gap-4 border-r border-black/5 pr-6">
                <div className="flex flex-col items-end">
                   <span className="text-[10px] font-display font-bold text-primary uppercase tracking-widest">Target Node</span>
                   <span className="text-xs font-bold text-on-background uppercase italic">Active Capture SYS</span>
                </div>
             </div>
             <button className="px-8 py-2.5 bg-tertiary text-white font-display font-bold rounded-full hover:scale-95 transition-transform active:scale-100 text-[10px] uppercase tracking-widest shadow-lg">
                Upload Video
             </button>
          </div>
        </div>

        {/* Main Grid: Upload & Params */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-10">
          
          {/* Upload Zone */}
          <div className="lg:col-span-2 space-y-8">
            <div className="relative group overflow-hidden rounded-3xl border-2 border-dashed border-primary/20 bg-surface-container/30 hover:border-primary/60 transition-all cursor-pointer aspect-video flex flex-col items-center justify-center p-12 text-center">
              <div className="absolute inset-0 video-overlay-grid opacity-20 pointer-events-none" />
              
              <div className="relative z-10">
                <div className="w-24 h-24 rounded-full bg-primary/10 flex items-center justify-center mb-8 mx-auto group-hover:scale-110 transition-transform duration-500 shadow-[0_0_40px_rgba(245,90,60,0.1)]">
                  <CloudUpload className="w-10 h-10 text-primary" />
                </div>
                <h3 className="text-2xl font-headline font-bold text-on-background mb-4">Ingest Motion Sequence</h3>
                <p className="text-sm text-on-surface-variant max-w-md mx-auto leading-relaxed">
                  Provide high-speed MP4 or MOV data. Optimal precision at 120fps+ for biomechanical skeletal tracking mapping.
                </p>
                <button className="mt-10 px-10 py-3.5 border border-primary/30 text-primary rounded-full font-bold font-display uppercase tracking-[0.2em] text-[10px] hover:bg-primary hover:text-white transition-all shadow-lg group-hover:shadow-[0_0_30px_rgba(245,90,60,0.2)]">
                  Sync Local Files
                </button>
              </div>
            </div>

            {/* Active Task Ticker */}
            <div className="bg-surface-container rounded-3xl p-8 border border-black/5 shadow-2xl relative overflow-hidden">
               <div className="flex justify-between items-center mb-6">
                 <div className="flex items-center gap-4">
                    <div className="w-10 h-10 rounded-xl bg-primary/20 flex items-center justify-center">
                       <FileVideo className="w-5 h-5 text-primary" />
                    </div>
                    <div>
                       <h4 className="text-sm font-bold text-on-background uppercase tracking-tight">Syncing: Match Drill Final.mp4</h4>
                       <p className="text-[10px] text-on-surface-variant uppercase tracking-widest mt-1">42.8 MB / 120.0 MB • BUFFERING...</p>
                    </div>
                 </div>
                 <button className="text-[10px] font-bold text-red-500/60 uppercase tracking-widest hover:text-red-500 transition-colors">Abort</button>
               </div>
               
               <div className="w-full h-2 bg-black/5 rounded-full overflow-hidden">
                  <motion.div 
                    initial={{ width: 0 }} animate={{ width: '42%' }}
                    className="h-full bg-gradient-to-r from-primary/80 to-tertiary shadow-[0_0_15px_rgba(245,90,60,0.3)]"
                  />
               </div>
            </div>
          </div>

          {/* Session Parameters */}
          <div className="space-y-8">
            <div className="bg-surface rounded-3xl p-8 border border-black/5 shadow-2xl space-y-8">
               <div className="flex items-center gap-3">
                  <Settings2 className="w-5 h-5 text-primary" />
                  <h3 className="text-[10px] font-display font-bold text-on-background uppercase tracking-[0.3em]">Module Config</h3>
               </div>

               <div className="space-y-6">
                  <div className="space-y-3">
                     <label className="text-[9px] font-display font-bold text-on-surface-variant uppercase tracking-widest">ASSIGNED ATHLETE</label>
                     <select className="w-full bg-surface-dim border-none rounded-xl py-3 px-5 text-xs text-on-background focus:ring-1 focus:ring-primary shadow-inner">
                        <option>MARCUS CHEN (PRO)</option>
                        <option>SARA JENKINS (ELITE)</option>
                        <option>DEVON MILLER (CLUB)</option>
                     </select>
                  </div>

                  <div className="space-y-3">
                     <label className="text-[9px] font-display font-bold text-on-surface-variant uppercase tracking-widest">TRACKING PARADIGM</label>
                     <div className="grid grid-cols-2 gap-2 p-1.5 bg-surface-dim rounded-xl border border-black/5">
                        <button className="flex items-center justify-center gap-2 py-2.5 bg-primary text-white rounded-lg font-bold text-[10px] uppercase tracking-widest shadow-lg">
                           <Users className="w-3.5 h-3.5" />
                           SINGLE
                        </button>
                        <button className="flex items-center justify-center gap-2 py-2.5 text-on-surface-variant hover:text-on-background rounded-lg font-bold text-[10px] uppercase tracking-widest">
                           TEAM
                        </button>
                     </div>
                  </div>

                  <div className="space-y-4 pt-2">
                     <label className="text-[9px] font-display font-bold text-on-surface-variant uppercase tracking-widest">VISUAL LAYERS</label>
                     <div className="space-y-2">
                        {[
                          { label: 'Kinetic Skeletal', icon: Layers, active: true },
                          { label: 'Velocity Vectors', icon: RefreshCw, active: true },
                          { label: 'Spatial Heatmaps', icon: Clock, active: false }
                        ].map((item, i) => (
                          <div key={i} className="flex items-center justify-between p-3.5 bg-surface-dim rounded-xl border border-black/5 cursor-pointer hover:border-primary/30 transition-colors group">
                             <div className="flex items-center gap-3">
                                <item.icon className={`w-4 h-4 ${item.active ? 'text-primary' : 'text-on-surface-variant'}`} />
                                <span className="text-xs text-on-surface-variant group-hover:text-on-background font-medium">{item.label}</span>
                             </div>
                             <div className={`w-4 h-4 rounded border ${item.active ? 'bg-primary border-primary flex items-center justify-center' : 'border-black/20'}`}>
                                {item.active && <X className="w-3 h-3 text-white" />}
                             </div>
                          </div>
                        ))}
                     </div>
                  </div>
               </div>

               <button className="w-full h-16 bg-primary text-white rounded-2xl flex items-center justify-center gap-3 font-headline font-bold uppercase tracking-[0.2em] shadow-[0_0_30px_rgba(245,90,60,0.3)] hover:scale-[1.02] active:scale-95 transition-all">
                  <Play className="w-5 h-5 fill-current" />
                  INITIATE SYNC
               </button>
            </div>

            {/* Recent Items Stack */}
            <div className="space-y-4">
              {[
                { title: 'Server Test 04.mp4', status: 'PROCESSED', score: 94, time: '2h ago' },
                { title: 'Spike Drill B.mov', status: 'QUEUED', score: null, time: '4h ago' }
              ].map((item, i) => (
                <div key={i} className="bg-surface-container rounded-2xl p-4 border border-black/5 flex gap-4 hover:bg-surface-variant/10 transition-colors cursor-pointer">
                   <div className="w-16 h-16 rounded-xl bg-black border border-white/10 flex items-center justify-center group overflow-hidden relative">
                      <FileVideo className="w-6 h-6 text-primary/40 group-hover:scale-110 transition-transform" />
                      {item.score && (
                        <div className="absolute top-1 right-1 bg-primary text-white text-[7px] font-bold px-1 rounded-sm">{item.score}%</div>
                      )}
                   </div>
                   <div className="flex-1 min-w-0">
                      <div className="flex items-center justify-between mb-1">
                         <span className={`text-[8px] font-bold uppercase tracking-widest ${item.status === 'PROCESSED' ? 'text-primary' : 'text-on-surface-variant/60'}`}>{item.status}</span>
                         <span className="text-[8px] text-on-surface-variant/40">{item.time}</span>
                      </div>
                      <h5 className="text-xs font-bold text-on-background truncate">{item.title}</h5>
                      <p className="text-[10px] text-on-surface-variant/60 mt-1 uppercase">14 SKELETAL TAGS</p>
                   </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
      <div className="max-w-7xl mx-auto pt-10 pb-5 text-center border-t border-black/5">
        <p className="text-[8px] font-display font-bold text-on-surface-variant/20 uppercase tracking-[0.5em]">Powered by GeminiSlingShot Invariant Network</p>
      </div>
    </div>
  );
};

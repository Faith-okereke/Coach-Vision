import React, { useState } from 'react';
import { 
  ChevronLeft, 
  Target, 
  Zap, 
  Activity, 
  Trophy, 
  MessageSquare,
  Share2,
  Download,
  AlertCircle,
  Save,
  CheckCircle,
  Loader2
} from 'lucide-react';
import { motion } from 'motion/react';
import { supabaseService } from '../services/supabaseService';

interface FeedbackViewProps {
  analysis: any;
  onBack: () => void;
  userId?: string;
}

export const FeedbackView: React.FC<FeedbackViewProps> = ({ analysis, onBack, userId }) => {
  const [saving, setSaving] = useState(false);
  const [saveStatus, setSaveStatus] = useState<'IDLE' | 'SAVING' | 'SUCCESS' | 'ERROR'>('IDLE');

  const handleSave = async () => {
    if (!userId) {
      alert('You must be logged in to save your analysis results.');
      return;
    }

    setSaveStatus('SAVING');
    try {
      await supabaseService.saveAnalysis(userId, analysis);
      setSaveStatus('SUCCESS');
      setTimeout(() => setSaveStatus('IDLE'), 3000);
    } catch (err) {
      console.error(err);
      setSaveStatus('ERROR');
    }
  };
  if (!analysis) {
    return (
      <div className="w-full h-full flex flex-col items-center justify-center p-12 text-center space-y-6">
        <div className="w-20 h-20 bg-black/5 rounded-full flex items-center justify-center animate-pulse">
          <AlertCircle className="w-10 h-10 text-black/20" />
        </div>
        <div className="space-y-2">
          <h2 className="text-2xl font-headline font-black italic uppercase tracking-tight">No Analysis Found</h2>
          <p className="text-sm text-black/40 font-display">Please upload and analyze a video first to see coach feedback.</p>
        </div>
        <button 
          onClick={onBack}
          className="px-8 py-3 bg-primary text-white rounded-2xl font-display font-bold text-[10px] uppercase tracking-widest shadow-lg shadow-primary/20 hover:scale-105 transition-transform cursor-pointer"
        >
          Back to Analysis
        </button>
      </div>
    );
  }

  return (
    <div className="w-full h-full overflow-y-auto p-12 lg:p-24 bg-transparent custom-scrollbar">
      <div className="max-w-4xl mx-auto space-y-10">
        
        {/* Header Navigation */}
        <div className="flex justify-between items-center bg-white/40 backdrop-blur-md p-6 rounded-3xl border border-black/5 shadow-sm sticky top-0 z-50 -mx-6 lg:-mx-12">
          <button 
            onClick={onBack}
            className="flex items-center gap-3 text-black/40 hover:text-primary transition-colors group cursor-pointer"
          >
            <div className="w-10 h-10 rounded-xl bg-black/5 flex items-center justify-center group-hover:bg-primary/10 transition-colors">
              <ChevronLeft className="w-5 h-5" />
            </div>
            <span className="font-display font-bold text-[10px] uppercase tracking-widest">Back to Video</span>
          </button>
          
          <div className="flex items-center gap-4">
             <button 
               onClick={handleSave}
               disabled={saveStatus !== 'IDLE' || !userId}
               className={`flex items-center gap-2 px-6 py-2 rounded-full border transition-all cursor-pointer ${
                 saveStatus === 'SUCCESS' 
                   ? 'bg-green-500/10 border-green-500/20 text-green-500' 
                   : saveStatus === 'ERROR'
                   ? 'bg-red-500/10 border-red-500/20 text-red-500'
                   : 'bg-black/5 hover:bg-black/10 border-black/5 text-black/60 shadow-sm'
               } disabled:opacity-50`}
             >
                {saveStatus === 'SAVING' ? (
                  <Loader2 className="w-4 h-4 animate-spin" />
                ) : saveStatus === 'SUCCESS' ? (
                  <CheckCircle className="w-4 h-4" />
                ) : (
                  <Save className="w-4 h-4" />
                )}
                <span className="text-[10px] font-bold uppercase tracking-widest">
                  {saveStatus === 'SUCCESS' ? 'Saved' : saveStatus === 'SAVING' ? 'Saving...' : 'Save to Profile'}
                </span>
             </button>
             <button className="flex items-center gap-2 px-6 py-2 bg-black/5 hover:bg-black/10 rounded-full border border-black/5 transition-all cursor-pointer">
                <Share2 className="w-4 h-4 text-black/40" />
                <span className="text-[10px] font-bold uppercase tracking-widest text-black/60">Share</span>
             </button>
             <button className="hidden sm:flex items-center gap-2 px-6 py-2 bg-primary text-white rounded-full shadow-lg shadow-primary/20 hover:scale-105 transition-all cursor-pointer">
                <Download className="w-4 h-4" />
                <span className="text-[10px] font-bold uppercase tracking-widest">Export PDF</span>
             </button>
          </div>
        </div>

        {/* Hero Section */}
        <div className="text-center">
          <motion.div 
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            className="w-20 h-20 bg-primary/10 rounded-3xl flex items-center justify-center mx-auto shadow-2xl shadow-primary/10"
          >
            <Trophy className="w-10 h-10 text-primary" />
          </motion.div>
          <div className="space-y-2">
            <h1 className="text-6xl lg:text-7xl font-headline font-black italic uppercase tracking-tighter text-on-background">
              SESSION <span className="text-primary">DEBRIEF</span>
            </h1>
            <p className="text-black/40 text-sm font-display font-bold uppercase tracking-[0.5em]">Biomechanics • Form Optimization • Live Intelligence</p>
          </div>
        </div>

        {/* Performance Remark - Main Focus */}
        <motion.div 
          initial={{ y: 30, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.2 }}
          className="relative"
        >
          <div className="absolute -top-6 -left-6 w-20 h-20 bg-primary/10 rounded-full animate-pulse blur-3xl" />
          <div className="relative glass-panel rounded-[3rem] p-10 lg:p-16 border border-primary/20 bg-primary/5 shadow-2xl shadow-primary/5 overflow-hidden">
             <div className="absolute top-0 right-0 p-12 opacity-[0.03] pointer-events-none">
                <MessageSquare className="w-64 h-64 text-primary" />
             </div>
             
             <div className="flex flex-col space-y-10 relative z-10">
                <div className="flex items-center gap-4">
                   <div className="w-12 h-12 rounded-2xl bg-primary flex items-center justify-center shadow-lg shadow-primary/30">
                      <Zap className="w-6 h-6 text-white" />
                   </div>
                   <div>
                      <h3 className="font-headline text-2xl font-bold text-primary italic uppercase tracking-tight">Performance Insight</h3>
                      <p className="text-black/30 text-[10px] font-display font-bold uppercase tracking-widest">Deep Analysis Complete</p>
                   </div>
                </div>
                
                <p className="text-3xl lg:text-5xl text-black leading-tight lg:leading-[1.1] font-display font-black italic">
                  "{analysis.feedback}"
                </p>
                
                <div className="pt-10 border-t border-primary/10 flex flex-wrap gap-4">
                   <div className="px-6 py-2 bg-primary/10 text-primary rounded-xl text-[10px] font-bold uppercase tracking-widest border border-primary/10">
                      Primary Focus: {analysis.activity}
                   </div>
                   <div className="px-6 py-2 bg-black/5 text-black/40 rounded-xl text-[10px] font-bold uppercase tracking-widest border border-black/5">
                      Form Status: {analysis.formQuality}
                   </div>
                </div>
             </div>
          </div>
        </motion.div>

        {/* Stats Breakdown */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
           <div className="glass-panel p-10 rounded-[2.5rem] border border-black/5 space-y-10">
              <div className="flex items-center gap-4">
                 <div className="w-12 h-12 rounded-2xl bg-tertiary/10 flex items-center justify-center border border-tertiary/10">
                    <Activity className="w-6 h-6 text-tertiary" />
                 </div>
                 <h4 className="font-headline text-xl font-bold uppercase italic tracking-tight">Kinetic Data</h4>
              </div>
              
              <div className="grid grid-cols-1 gap-8">
                 <div className="space-y-3">
                    <div className="flex justify-between items-end">
                       <span className="text-[10px] font-bold text-black/40 uppercase tracking-widest">Power Score</span>
                       <span className="text-3xl font-headline font-black text-primary italic">{analysis.powerScore.toFixed(0)}%</span>
                    </div>
                    <div className="h-3 w-full bg-black/5 rounded-full overflow-hidden border border-black/5">
                       <motion.div 
                         initial={{ width: 0 }}
                         animate={{ width: `${analysis.powerScore}%` }}
                         className="h-full bg-primary"
                       />
                    </div>
                 </div>

                 <div className="grid grid-cols-2 gap-6">
                    <div className="p-6 bg-black/5 rounded-2xl border border-black/5">
                       <span className="text-[9px] font-bold text-black/30 uppercase tracking-widest block mb-1">Elbow Angle</span>
                       <p className="text-3xl font-headline font-black text-on-background italic">{analysis.jointAngles.elbow.toFixed(1)}°</p>
                    </div>
                    <div className="p-6 bg-black/5 rounded-2xl border border-black/5">
                       <span className="text-[9px] font-bold text-black/30 uppercase tracking-widest block mb-1">Shoulder Lock</span>
                       <p className="text-3xl font-headline font-black text-on-background italic">{analysis.jointAngles.shoulder.toFixed(1)}°</p>
                    </div>
                 </div>
              </div>
           </div>

           <div className="glass-panel p-10 rounded-[2.5rem] border border-black/5 space-y-10 flex flex-col justify-between">
              <div className="space-y-10">
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 rounded-2xl bg-cyan-500/10 flex items-center justify-center border border-cyan-500/10">
                      <Target className="w-6 h-6 text-cyan-600" />
                  </div>
                  <h4 className="font-headline text-xl font-bold uppercase italic tracking-tight">Movement ID</h4>
                </div>
                
                <div className="space-y-6">
                   <p className="text-sm text-black/60 leading-relaxed font-display font-medium">
                      Biomechanical tracking identified this sequence as <span className="text-black font-bold border-b-2 border-primary/30 uppercase italic">{analysis.activity}</span>.
                   </p>
                   {analysis.jumpHeight && analysis.jumpHeight > 0 && (
                      <div className="p-6 bg-cyan-600/5 rounded-2xl border border-cyan-600/10">
                         <span className="text-[9px] font-bold text-cyan-600 uppercase tracking-widest block mb-2">Vertical Displacement</span>
                         <div className="flex items-baseline gap-2">
                            <span className="text-4xl font-headline font-black text-on-background italic">{analysis.jumpHeight.toFixed(1)}</span>
                            <span className="text-sm font-bold text-black/40 uppercase">Inches</span>
                         </div>
                      </div>
                   )}
                </div>
              </div>

              <div className="bg-black text-white p-6 rounded-2xl flex items-center justify-between">
                 <div>
                    <span className="text-[8px] font-bold uppercase tracking-widest text-white/40 block">Elite Score</span>
                    <p className="text-lg font-headline font-black italic tracking-tight">TIER ACTIVE</p>
                 </div>
                 <div className="flex gap-1">
                    {[1,2,3,4,5].map(i => (
                      <div key={i} className={`w-3 h-3 rounded-full ${i <= 4 ? 'bg-primary' : 'bg-white/10'}`} />
                    ))}
                 </div>
              </div>
           </div>
        </div>

        {/* Footer Navigation */}
        <div className="pt-16 border-t border-black/5 flex flex-col md:flex-row items-center justify-between gap-8">
           <div className="text-center md:text-left">
              <p className="text-[10px] font-display font-bold text-black/40 uppercase tracking-widest mb-1">Session ID: #VF-{new Date().getTime().toString().slice(-6)}</p>
              <p className="text-[8px] font-display font-bold text-black/20 uppercase tracking-[0.4em]">GeminiSlingShot Technical Analysis Engine v2.5</p>
           </div>
           <button 
             onClick={onBack}
             className="px-12 py-5 bg-black text-white rounded-2xl font-display font-bold text-[11px] uppercase tracking-[0.3em] hover:scale-105 active:scale-95 transition-all shadow-xl cursor-pointer"
           >
             Retouch Analysis Workspace
           </button>
        </div>
      </div>
    </div>
  );
};

/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
*/

import React, { useState, useEffect } from 'react';
import { supabase } from './lib/supabase';
import { motion, AnimatePresence } from 'motion/react';
import ModeController from './components/ModeController';
import VolleyProCore from './components/VolleyProCore';
import LogoutModal from './components/LogoutModal';
import { DashboardView } from './components/DashboardView';
import { ReportsView } from './components/ReportsView';
import { CaptureView } from './components/CaptureView';
import { FeedbackView } from './components/FeedbackView';
import { Auth } from './components/Auth';
import { User, LogOut, LayoutDashboard, History, Settings, Target } from 'lucide-react';

const App: React.FC = () => {
  const [deviceConfig, setDeviceConfig] = useState<{ isMobile: boolean; allowedModes: ('LIVE' | 'UPLOAD')[] }>({
    isMobile: false,
    allowedModes: ['UPLOAD'],
  });
  
  const [activeView, setActiveView] = useState('ANALYSIS');
  const [analysisResults, setAnalysisResults] = useState<any>(null);
  const [persistedVideo, setPersistedVideo] = useState<{ url: string | null; base64: string | null }>({ url: null, base64: null });
  const [persistedWorkflow, setPersistedWorkflow] = useState<any>({ status: 'IDLE', selectedPerson: null, peopleOptions: [], allEvents: [] });
  
  const [session, setSession] = useState<any>(null);
  const [showLogoutModal, setShowLogoutModal] = useState(false);

  useEffect(() => {
    if (!supabase) return;

    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session);
    });

    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_event, session) => {
      setSession(session);
    });

    return () => subscription.unsubscribe();
  }, []);

  const handleLogout = async () => {
    if (!supabase) return;
    await supabase.auth.signOut();
    setShowLogoutModal(false);
  };

  const renderView = () => {
    switch (activeView) {
      case 'DASHBOARD':
        return <DashboardView />;
      case 'REPORTS':
        return <ReportsView />;
      case 'CAPTURE':
        return <CaptureView />;
      case 'FEEDBACK':
        return (
          <FeedbackView 
            analysis={analysisResults} 
            onBack={() => setActiveView('ANALYSIS')} 
            userId={session?.user?.id}
          />
        );
      case 'AUTH':
        return <Auth onSuccess={() => setActiveView('ANALYSIS')} />;
      case 'ANALYSIS':
      default:
        return (
          <VolleyProCore 
            isMobile={deviceConfig.isMobile} 
            allowedModes={deviceConfig.allowedModes} 
            user={session?.user}
            onAnalysisComplete={(data) => {
              setAnalysisResults(data);
              setActiveView('FEEDBACK');
            }}
            persistedAnalysis={analysisResults}
            onNavigateFeedback={() => setActiveView('FEEDBACK')}
            persistedVideo={persistedVideo}
            onVideoChange={setPersistedVideo}
            persistedWorkflow={persistedWorkflow}
            onWorkflowChange={setPersistedWorkflow}
          />
        );
    }
  };

  const isAuthView = activeView === 'AUTH';

  return (
    <div className="flex w-screen h-screen bg-background text-on-background overflow-hidden relative font-sans">
      {/* Global Creative Background Decorative Blobs */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none z-0">
        <div className="absolute -top-[5%] -right-[10%] w-[50%] h-[60%] bg-primary/8 blur-[140px] rounded-full animate-pulse" style={{ animationDuration: '6s' }} />
        <div className="absolute top-[30%] -left-[5%] w-[35%] h-[45%] bg-tertiary/6 blur-[120px] rounded-full animate-pulse" style={{ animationDuration: '9s' }} />
        <div className="absolute bottom-[5%] right-[10%] w-[45%] h-[55%] bg-primary/4 blur-[160px] rounded-full animate-pulse" style={{ animationDuration: '11s' }} />
      </div>

      <div className={`relative z-10 flex w-full h-full flex-col lg:flex-row ${isAuthView ? '' : 'pb-20 lg:pb-0'}`}>
        {!isAuthView && (
          <>
            {/* Desktop Sidebar */}
            <div className="hidden lg:flex w-24 bg-[#0f172a] border-r border-white/5 flex-col items-center py-10 justify-between shrink-0 shadow-2xl">
              <div className="space-y-10 flex flex-col items-center">
                <div className="w-12 h-12 bg-primary rounded-2xl flex items-center justify-center shadow-lg shadow-primary/30 mb-8">
                  <Target className="w-6 h-6 text-white" />
                </div>
                
                <nav className="flex flex-col gap-8">
                   <button 
                     onClick={() => setActiveView('DASHBOARD')}
                     className={`p-3 rounded-2xl transition-all cursor-pointer ${activeView === 'DASHBOARD' ? 'bg-primary text-white shadow-lg' : 'text-slate-400 hover:text-white hover:bg-white/5'}`}
                   >
                     <LayoutDashboard className="w-6 h-6" />
                   </button>
                   <button 
                     onClick={() => setActiveView('ANALYSIS')}
                     className={`p-3 rounded-2xl transition-all cursor-pointer ${activeView === 'ANALYSIS' ? 'bg-primary text-white shadow-lg' : 'text-slate-400 hover:text-white hover:bg-white/5'}`}
                   >
                     <Target className="w-6 h-6" />
                   </button>
                   <button 
                     onClick={() => setActiveView('REPORTS')}
                     className={`p-3 rounded-2xl transition-all cursor-pointer ${activeView === 'REPORTS' ? 'bg-primary text-white shadow-lg' : 'text-slate-400 hover:text-white hover:bg-white/5'}`}
                   >
                     <History className="w-6 h-6" />
                   </button>
                </nav>
              </div>

              <div className="flex flex-col gap-6">
                {session ? (
                  <button 
                    onClick={() => setShowLogoutModal(true)}
                    className="w-10 h-10 rounded-full border-2 border-primary/40 overflow-hidden bg-white/5 flex items-center justify-center hover:scale-110 transition-transform group cursor-pointer"
                    title={`Logout ${session.user.email}`}
                  >
                    {session.user.user_metadata?.avatar_url ? (
                      <img src={session.user.user_metadata.avatar_url} alt="Profile" className="w-full h-full object-cover" />
                    ) : (
                      <LogOut className="w-5 h-5 text-slate-400 group-hover:text-primary" />
                    )}
                  </button>
                ) : (
                  <button 
                    onClick={() => setActiveView('AUTH')}
                    className="w-10 h-10 rounded-full bg-white/5 border border-white/10 flex items-center justify-center text-slate-400 hover:text-primary hover:border-primary/40 transition-all cursor-pointer"
                  >
                    <User className="w-5 h-5" />
                  </button>
                )}
                <button className="p-3 text-slate-400 hover:text-primary transition-colors cursor-pointer">
                  <Settings className="w-6 h-6" />
                </button>
              </div>
            </div>

            {/* Mobile Bottom Navigation */}
            <div className="lg:hidden fixed bottom-0 left-0 right-0 h-22 bg-[#0f172a] border-t border-white/10 flex items-center justify-around px-6 z-[1001] shadow-[0_-10px_40px_rgba(0,0,0,0.4)] pb-2">
              <button 
                onClick={() => setActiveView('DASHBOARD')}
                className={`flex flex-col items-center gap-1.5 transition-all w-16 cursor-pointer ${activeView === 'DASHBOARD' ? 'text-primary' : 'text-slate-400'}`}
              >
                <div className={`p-2 rounded-xl transition-all ${activeView === 'DASHBOARD' ? 'bg-primary/10' : ''}`}>
                  <LayoutDashboard className="w-5 h-5" />
                </div>
                <span className="text-[9px] font-bold uppercase tracking-widest">Dash</span>
              </button>
              <button 
                onClick={() => setActiveView('ANALYSIS')}
                className={`flex flex-col items-center gap-1.5 transition-all w-16 cursor-pointer ${activeView === 'ANALYSIS' ? 'text-primary' : 'text-slate-400'}`}
              >
                <div className={`p-2 rounded-xl transition-all ${activeView === 'ANALYSIS' ? 'bg-primary/10' : ''}`}>
                  <Target className="w-5 h-5" />
                </div>
                <span className="text-[9px] font-bold uppercase tracking-widest">Pro</span>
              </button>
              <button 
                onClick={() => setActiveView('REPORTS')}
                className={`flex flex-col items-center gap-1.5 transition-all w-16 cursor-pointer ${activeView === 'REPORTS' ? 'text-primary' : 'text-slate-400'}`}
              >
                <div className={`p-2 rounded-xl transition-all ${activeView === 'REPORTS' ? 'bg-primary/10' : ''}`}>
                  <History className="w-5 h-5" />
                </div>
                <span className="text-[9px] font-bold uppercase tracking-widest">History</span>
              </button>
              <button 
                onClick={() => session ? setShowLogoutModal(true) : setActiveView('AUTH')}
                className={`flex flex-col items-center gap-1.5 transition-all w-16 cursor-pointer ${activeView === 'AUTH' ? 'text-primary' : 'text-slate-400'}`}
              >
                <div className={`p-2 rounded-xl transition-all ${activeView === 'AUTH' ? 'bg-primary/10' : ''}`}>
                  {session?.user?.user_metadata?.avatar_url ? (
                    <img src={session.user.user_metadata.avatar_url} alt="Profile" className="w-6 h-6 rounded-lg object-cover" />
                  ) : (
                    <User className="w-5 h-5" />
                  )}
                </div>
                <span className="text-[9px] font-bold uppercase tracking-widest">{session ? 'User' : 'Self'}</span>
              </button>
            </div>
          </>
        )}

        <main className="flex-1 flex flex-col relative min-h-0 overflow-hidden">
          <ModeController onModeChange={(isMobile, allowedModes) => setDeviceConfig({ isMobile, allowedModes })}>
            <div className="flex-1 overflow-hidden relative">
              {renderView()}
            </div>
          </ModeController>
        </main>
      </div>

      <LogoutModal 
        isOpen={showLogoutModal}
        onClose={() => setShowLogoutModal(false)}
        onConfirm={handleLogout}
      />
    </div>
  );
};

export default App;

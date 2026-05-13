/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
*/

import React, { useState } from 'react';
import ModeController from './components/ModeController';
import VolleyProCore from './components/VolleyProCore';
import { DashboardView } from './components/DashboardView';
import { ReportsView } from './components/ReportsView';
import { CaptureView } from './components/CaptureView';

const App: React.FC = () => {
  const [deviceConfig, setDeviceConfig] = useState<{ isMobile: boolean; allowedModes: ('LIVE' | 'UPLOAD')[] }>({
    isMobile: false,
    allowedModes: ['UPLOAD'],
  });
  
  const [activeView, setActiveView] = useState('ANALYSIS');

  const renderView = () => {
    switch (activeView) {
      case 'DASHBOARD':
        return <DashboardView />;
      case 'REPORTS':
        return <ReportsView />;
      case 'CAPTURE':
        return <CaptureView />;
      case 'ANALYSIS':
      default:
        return <VolleyProCore isMobile={deviceConfig.isMobile} allowedModes={deviceConfig.allowedModes} />;
    }
  };

  return (
    <div className="flex w-screen h-screen bg-background text-on-background overflow-hidden relative">
      {/* Global Creative Background Decorative Blobs */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none z-0">
        <div className="absolute -top-[5%] -right-[10%] w-[50%] h-[60%] bg-primary/8 blur-[140px] rounded-full animate-pulse" style={{ animationDuration: '6s' }} />
        <div className="absolute top-[30%] -left-[5%] w-[35%] h-[45%] bg-tertiary/6 blur-[120px] rounded-full animate-pulse" style={{ animationDuration: '9s' }} />
        <div className="absolute bottom-[5%] right-[10%] w-[45%] h-[55%] bg-primary/4 blur-[160px] rounded-full animate-pulse" style={{ animationDuration: '11s' }} />
      </div>

      <div className="relative z-10 flex w-full h-full">
        <main className="flex-1 flex flex-col relative min-h-0 overflow-hidden">
          <ModeController onModeChange={(isMobile, allowedModes) => setDeviceConfig({ isMobile, allowedModes })}>
            <div className="flex-1 overflow-hidden relative">
              {renderView()}
            </div>
          </ModeController>
        </main>
      </div>
    </div>
  );
};

export default App;

import React, { useEffect, useState } from 'react';
import { Smartphone, Monitor, ShieldCheck, Zap } from 'lucide-react';

interface ModeControllerProps {
  onModeChange: (isMobile: boolean, allowedModes: ('LIVE' | 'UPLOAD')[]) => void;
  children: React.ReactNode;
}

const ModeController: React.FC<ModeControllerProps> = ({ onModeChange, children }) => {
  const [isMobile, setIsMobile] = useState(false);
  const [detected, setDetected] = useState(false);

  useEffect(() => {
    const ua = navigator.userAgent;
    const mobileRegex = /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i;
    const mobile = mobileRegex.test(ua);

    setIsMobile(mobile);

    const allowed: ('LIVE' | 'UPLOAD')[] = mobile ? ['LIVE', 'UPLOAD'] : ['UPLOAD'];
    onModeChange(mobile, allowed);
    setDetected(true);
  }, []);

  if (!detected) return null;

  return (
    <>

      <div className="relative w-full flex-1 flex flex-col min-h-0">
        {/* Device Status Bar */}
        {isMobile &&
          <>
            <div className="absolute mt-5 top-20 left-8 z-50 flex items-center gap-3 bg-[#081425]/60 backdrop-blur-xl px-4 py-2 rounded-full border border-white/5 shadow-lg">

              <>
                <Smartphone className="w-3.5 h-3.5 text-[#00dbe9]" />
                <span className="text-[10px] font-display uppercase tracking-[0.2em] text-[#d8e3fb]/60 font-bold">Mobile device detected</span>
                <div className="flex gap-1.5 ml-2">
                  <Zap className="w-3 h-3 text-[#c3f400]" />
                  <ShieldCheck className="w-3 h-3 text-[#c3f400]/60" />
                </div>
              </>

            </div>
          </>
        }

        {children}
      </div>

    </>
  );
};

export default ModeController;

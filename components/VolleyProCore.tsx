import React, { useEffect, useRef, useState, useCallback } from 'react';
import { processVolleyFrame, identifyPeopleInVideo, analyzeFullVideo } from '../services/geminiSlingShotService';
import { PerformanceDeltaChart } from './PerformanceChart';
import { Pose, Results, POSE_CONNECTIONS } from '@mediapipe/pose';
import { drawConnectors, drawLandmarks } from '@mediapipe/drawing_utils';
import { 
  Camera, 
  Zap, 
  Activity, 
  Shield, 
  Upload, 
  Play, 
  CheckCircle2, 
  AlertCircle,
  ChevronLeft,
  ChevronRight,
  Video,
  Settings,
  Maximize,
  LayoutDashboard,
  ClipboardCheck,
  RefreshCw,
  Target,
  ChevronDown,
  User,
  Trash2
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';

interface VolleyAnalysis {
  activity: string;
  jointAngles: {
    shoulder: number;
    elbow: number;
    wrist: number;
    stance?: number;
  };
  ballData?: {
    x: number;
    y: number;
    speed?: string;
  };
  pointOfContact?: string;
  powerScore: number;
  formQuality: 'POOR' | 'FAIR' | 'GOOD' | 'EXCELLENT';
  feedback: string;
  platformStability?: number;
  jumpHeight?: number;
}

interface VolleyProCoreProps {
  isMobile: boolean;
  allowedModes: ('LIVE' | 'UPLOAD')[];
  onAnalysisComplete?: (results: VolleyAnalysis) => void;
  persistedAnalysis?: VolleyAnalysis | null;
  onNavigateFeedback?: () => void;
  persistedVideo?: { url: string | null; base64: string | null };
  onVideoChange?: (video: { url: string | null; base64: string | null }) => void;
  persistedWorkflow?: { 
    status: 'IDLE' | 'IDENTIFYING' | 'SELECTING' | 'ANALYZING' | 'COMPLETED'; 
    selectedPerson: string | null; 
    peopleOptions: string[]; 
    allEvents: VolleyAnalysis[];
  };
  onWorkflowChange?: (workflow: any) => void;
}

const VolleyProCore: React.FC<VolleyProCoreProps> = ({ 
  isMobile, 
  allowedModes, 
  onAnalysisComplete,
  persistedAnalysis,
  onNavigateFeedback,
  persistedVideo,
  onVideoChange,
  persistedWorkflow,
  onWorkflowChange
}) => {
  const videoRef = useRef<HTMLVideoElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  
  const [activeMode, setActiveMode] = useState<'LIVE' | 'UPLOAD'>(isMobile ? 'LIVE' : 'UPLOAD');
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [analysis, setAnalysis] = useState<VolleyAnalysis | null>(persistedAnalysis || null);
  const [cameraStatus, setCameraStatus] = useState<'IDLE' | 'PENDING' | 'READY' | 'ERROR'>('IDLE');
  const [tension, setTension] = useState(0); // Slingshot tension simulation
  
  // Real-time loop refs
  const lastCaptureTime = useRef<number>(0);
 
  const [uploadProgress, setUploadProgress] = useState(0);
  const [isUploading, setIsUploading] = useState(false);
  const [isUploaded, setIsUploaded] = useState(!!persistedVideo?.url);
  const [videoUrl, setVideoUrl] = useState<string | null>(persistedVideo?.url || null);
  const [videoBase64, setVideoBase64] = useState<string | null>(persistedVideo?.base64 || null);
 
  // New Workflow State
  const [workflowStatus, setWorkflowStatus] = useState<'IDLE' | 'IDENTIFYING' | 'SELECTING' | 'ANALYZING' | 'COMPLETED'>(persistedWorkflow?.status || 'IDLE');
  const [peopleOptions, setPeopleOptions] = useState<string[]>(persistedWorkflow?.peopleOptions || []);
  const [selectedPerson, setSelectedPerson] = useState<string | null>(persistedWorkflow?.selectedPerson || null);
  const [allEvents, setAllEvents] = useState<VolleyAnalysis[]>(persistedWorkflow?.allEvents || []);
  const [activeEventIndex, setActiveEventIndex] = useState(0);
 
  const [poseResults, setPoseResults] = useState<Results | null>(null);
  const [targetLocked, setTargetLocked] = useState(workflowStatus === 'COMPLETED');
  const targetLockedRef = useRef(false);
  const [isPaused, setIsPaused] = useState(true);
  const [showSkeletons, setShowSkeletons] = useState(true);

  // Sync back to App.tsx
  useEffect(() => {
    if (onVideoChange) {
      onVideoChange({ url: videoUrl, base64: videoBase64 });
    }
  }, [videoUrl, videoBase64, onVideoChange]);

  useEffect(() => {
    if (onWorkflowChange) {
      onWorkflowChange({
        status: workflowStatus,
        selectedPerson,
        peopleOptions,
        allEvents
      });
    }
  }, [workflowStatus, selectedPerson, peopleOptions, allEvents, onWorkflowChange]);

  // Synchronize ref with state for use in callbacks
  useEffect(() => {
    targetLockedRef.current = targetLocked;
  }, [targetLocked]);
  const poseRef = useRef<Pose | null>(null);
  const requestRef = useRef<number>(0);

  const processFrame = useCallback(async () => {
    if (videoRef.current && poseRef.current && !videoRef.current.paused && !videoRef.current.ended) {
      if (videoRef.current.readyState >= 2) {
        try {
          await poseRef.current.send({ image: videoRef.current });
        } catch (err) {
          console.warn("MediaPipe Pose send error:", err);
        }
      }
      requestRef.current = requestAnimationFrame(processFrame);
    }
  }, []);

  const togglePlayPause = useCallback(() => {
    if (!videoRef.current) return;
    if (videoRef.current.paused) {
      videoRef.current.play();
      setIsPaused(false);
      requestRef.current = requestAnimationFrame(processFrame);
    } else {
      videoRef.current.pause();
      setIsPaused(true);
      cancelAnimationFrame(requestRef.current);
    }
  }, [processFrame]);

  const handleVideoClick = useCallback((e: React.MouseEvent) => {
    if (!videoRef.current) return;
    // Basic target lock simulation
    setTargetLocked(true);
  }, []);

  // Initialize MediaPipe Pose
  useEffect(() => {
    const pose = new Pose({
      locateFile: (file) => {
        return `https://cdn.jsdelivr.net/npm/@mediapipe/pose/${file}`;
      }
    });

    pose.setOptions({
      modelComplexity: 1,
      smoothLandmarks: true,
      enableSegmentation: false,
      minDetectionConfidence: 0.5,
      minTrackingConfidence: 0.5
    });

    pose.onResults((results) => {
      setPoseResults(results);
      if (canvasRef.current) {
        const canvasCtx = canvasRef.current.getContext('2d');
        if (canvasCtx) {
          canvasCtx.clearRect(0, 0, canvasRef.current.width, canvasRef.current.height);
          
          if (results.poseLandmarks && targetLockedRef.current && showSkeletons) {
            // Draw the landmarks and connectors
            drawConnectors(canvasCtx, results.poseLandmarks, POSE_CONNECTIONS, {
              color: '#f55a3c',
              lineWidth: 4
            });
            drawLandmarks(canvasCtx, results.poseLandmarks, {
              color: '#4f46e5',
              lineWidth: 2,
              radius: 4
            });

            // Draw the ball if analysis found it
            if (analysis?.ballData) {
              const { x, y } = analysis.ballData;
              const drawX = x * canvasRef.current.width;
              const drawY = y * canvasRef.current.height;

              // Outer glow
              canvasCtx.beginPath();
              canvasCtx.arc(drawX, drawY, 20, 0, 2 * Math.PI);
              canvasCtx.fillStyle = 'rgba(245, 90, 60, 0.2)';
              canvasCtx.fill();

              // Ball circle
              canvasCtx.beginPath();
              canvasCtx.arc(drawX, drawY, 8, 0, 2 * Math.PI);
              canvasCtx.strokeStyle = '#f55a3c';
              canvasCtx.lineWidth = 3;
              canvasCtx.stroke();
              canvasCtx.fillStyle = 'white';
              canvasCtx.fill();

              // Connection line to ball (timing visual)
              const nose = results.poseLandmarks[0];
              if (nose) {
                canvasCtx.beginPath();
                canvasCtx.moveTo(nose.x * canvasRef.current.width, nose.y * canvasRef.current.height);
                canvasCtx.lineTo(drawX, drawY);
                canvasCtx.setLineDash([5, 5]);
                canvasCtx.strokeStyle = 'rgba(15, 23, 42, 0.3)';
                canvasCtx.stroke();
                canvasCtx.setLineDash([]);
              }
            }
          }
        }
      }
    });

    poseRef.current = pose;

    return () => {
      pose.close();
    };
  }, []);

  // Extract frames from video for Grok analysis
  const extractFrames = useCallback(async (videoUrl: string, count: number): Promise<string[]> => {
    return new Promise((resolve, reject) => {
      const video = document.createElement('video');
      video.src = videoUrl;
      video.crossOrigin = 'anonymous';
      video.load();

      video.onloadedmetadata = async () => {
        const frames: string[] = [];
        const canvas = document.createElement('canvas');
        canvas.width = video.videoWidth;
        canvas.height = video.videoHeight;
        const ctx = canvas.getContext('2d');
        if (!ctx) return reject('No context');

        const duration = video.duration;
        const interval = duration / (count + 1);

        for (let i = 1; i <= count; i++) {
          video.currentTime = i * interval;
          await new Promise(r => video.onseeked = r);
          ctx.drawImage(video, 0, 0);
          frames.push(canvas.toDataURL('image/jpeg', 0.7));
        }

        resolve(frames);
      };

      video.onerror = (e) => reject(e);
    });
  }, []);

  const handleReset = useCallback(() => {
    if (videoUrl) URL.revokeObjectURL(videoUrl);
    setVideoUrl(null);
    setVideoBase64(null);
    setIsUploaded(false);
    setIsUploading(false);
    setUploadProgress(0);
    setWorkflowStatus('IDLE');
    setPeopleOptions([]);
    setSelectedPerson(null);
    setAllEvents([]);
    setAnalysis(null);
    setActiveEventIndex(0);
    setIsAnalyzing(false);
    setTargetLocked(false);
    setPoseResults(null);
    setIsPaused(true);
    
    if (videoRef.current) {
      videoRef.current.pause();
      videoRef.current.src = "";
      videoRef.current.load();
    }
    
    if (canvasRef.current) {
      const ctx = canvasRef.current.getContext('2d');
      ctx?.clearRect(0, 0, canvasRef.current.width, canvasRef.current.height);
    }
  }, [videoUrl]);

  const handleFileUpload = useCallback(async (file: File) => {
    if (!file.type.startsWith('video/')) {
      alert("Invalid file format. Please upload a video file (MP4, MOV, WebM, etc.).");
      return;
    }
    setIsUploading(true);
    setUploadProgress(0);
    setIsUploaded(false);
    setWorkflowStatus('IDLE');
    setPeopleOptions([]);
    setSelectedPerson(null);
    setAllEvents([]);
    
    // Revoke old URL if exists
    if (videoUrl) URL.revokeObjectURL(videoUrl);
    const url = URL.createObjectURL(file);
    setVideoUrl(url);

    // Convert to base64 for state storage if needed (optional)
    const reader = new FileReader();
    reader.onload = async (e) => {
      const base64 = e.target?.result as string;
      setVideoBase64(base64);
      
      // Step 2: Identify people
      setWorkflowStatus('IDENTIFYING');
      try {
        // Extract 3 frames across the video for identification
        const idFrames = await extractFrames(url, 3);
        const people = await identifyPeopleInVideo(idFrames);
        setPeopleOptions(people);
        setWorkflowStatus('SELECTING');
      } catch (err) {
        console.error("Identification error:", err);
        setPeopleOptions(["Athlete 1 (Blue Jersey)", "Athlete 2 (White/Red)"]);
        setWorkflowStatus('SELECTING');
      }
    };
    reader.readAsDataURL(file);

    // Simulate chunked upload progress for UI feel
    const totalSteps = 100;
    for (let i = 0; i <= totalSteps; i++) {
      await new Promise(resolve => setTimeout(resolve, 10));
      setUploadProgress(i);
    }
    
    setIsUploading(false);
    setIsUploaded(true);
  }, [videoUrl, extractFrames]);

  const handlePersonSelect = async (person: string) => {
    setSelectedPerson(person);
    setWorkflowStatus('ANALYZING');
    setIsAnalyzing(true);
    
    if (!videoUrl) return;

    try {
      // Extract 8 frames across the video for deep analysis
      const analysisFrames = await extractFrames(videoUrl, 8);
      const events = await analyzeFullVideo(analysisFrames, person);
      setAllEvents(events);
      if (events.length > 0) {
        setAnalysis(events[0]);
        setActiveEventIndex(0);
        if (onAnalysisComplete) onAnalysisComplete(events[0]);
      }
      setWorkflowStatus('COMPLETED');
      setTargetLocked(true); // Visually "lock" the target now
    } catch (err) {
      console.error("Full analysis error:", err);
      alert("Deep analysis failed. Using fallback data.");
    } finally {
      setIsAnalyzing(false);
    }
  };

  const onDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    const file = e.dataTransfer.files[0];
    if (file) {
      if (file.type.startsWith('video/')) {
        handleFileUpload(file);
      } else {
        alert("Strict Security: Only video files are permitted for biomechanical analysis.");
      }
    }
  }, [handleFileUpload]);

  const startTracking = async () => {
    if (!videoRef.current) return;
    
    setIsAnalyzing(true);
    videoRef.current.currentTime = 0;
    try {
      await videoRef.current.play();
      setIsPaused(false);
      requestRef.current = requestAnimationFrame(processFrame);
    } catch (err) {
      console.error("Video play failed:", err);
      setIsAnalyzing(false);
      return;
    }

    videoRef.current.onended = () => {
      setIsAnalyzing(false);
      cancelAnimationFrame(requestRef.current);
    };
  };

  // Call Gemini for a precision biomechanical capture
  const captureImpactFrame = async () => {
    if (!videoRef.current) return;
    
    const video = videoRef.current;
    const wasPlaying = !video.paused;
    if (wasPlaying) video.pause();

    setIsAnalyzing(true);
    
    const tempCanvas = document.createElement('canvas');
    tempCanvas.width = video.videoWidth || 1280;
    tempCanvas.height = video.videoHeight || 720;
    const ctx = tempCanvas.getContext('2d');
    if (ctx) {
      ctx.drawImage(video, 0, 0);
      const frame = tempCanvas.toDataURL('image/jpeg', 0.8);
      try {
        const res = await processVolleyFrame(frame, 'UPLOAD');
        setAnalysis(res);
        if (onAnalysisComplete) onAnalysisComplete(res);
      } catch (e) {
        console.error("Impact analysis error:", e);
      } finally {
        setIsAnalyzing(false);
      }
    }
  };

  const captureScreenshot = useCallback(() => {
    if (!videoRef.current || !canvasRef.current) return;
    
    const video = videoRef.current;
    const canvas = canvasRef.current;
    
    // Create separate canvas for screenshot to combine video and overlay
    const screenshotCanvas = document.createElement('canvas');
    screenshotCanvas.width = video.videoWidth || 1280;
    screenshotCanvas.height = video.videoHeight || 720;
    const ctx = screenshotCanvas.getContext('2d');
    
    if (ctx) {
      // 1. Draw video frame
      ctx.drawImage(video, 0, 0, screenshotCanvas.width, screenshotCanvas.height);
      // 2. Draw our overlay landmarks/ball/etc
      ctx.drawImage(canvas, 0, 0, screenshotCanvas.width, screenshotCanvas.height);
      
      // 3. Trigger download
      const link = document.createElement('a');
      link.download = `VolleyVision_Capture_${new Date().getTime()}.jpg`;
      link.href = screenshotCanvas.toDataURL('image/jpeg', 0.9);
      link.click();
    }
  }, []);

  useEffect(() => {
    return () => {
      if (videoRef.current?.srcObject) {
        (videoRef.current.srcObject as MediaStream).getTracks().forEach(t => t.stop());
      }
    };
  }, []);

  const handleUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setIsAnalyzing(true);
    const reader = new FileReader();
    reader.onload = async (event) => {
      const img = new Image();
      img.onload = async () => {
        const tempCanvas = document.createElement('canvas');
        const targetWidth = 1280;
        const scale = targetWidth / img.width;
        tempCanvas.width = targetWidth;
        tempCanvas.height = img.height * scale;
        
        const tCtx = tempCanvas.getContext('2d');
        tCtx?.drawImage(img, 0, 0, tempCanvas.width, tempCanvas.height);
        
        const compressed = tempCanvas.toDataURL('image/jpeg', 0.7);
        try {
          const result = await processVolleyFrame(compressed, 'UPLOAD');
          setAnalysis(result);
        } catch (err) {
          alert("Deep analysis failed. Check file format.");
        } finally {
          setIsAnalyzing(false);
        }
      };
      img.src = event.target?.result as string;
    };
    reader.readAsDataURL(file);
  };

  return (
    <div className="w-full h-full flex flex-col bg-transparent text-on-background font-sans selection:bg-primary/30 min-h-screen overflow-hidden relative">
      <div className="relative z-10 flex-1 flex flex-col overflow-hidden">
        {/* Dynamic Header */}
        <header className="flex justify-between items-center w-full lg:px-12 px-6 h-20 bg-background/40 backdrop-blur-md border-b border-black/5 z-40">
        <div className="flex items-center gap-10">
          <div className="flex items-center gap-2 px-0 py-2">
            <Zap className="w-6 h-6 text-primary fill-current" />
            <h2 className="font-headline text-2xl font-bold text-on-background tracking-tight italic">Coach Vision</h2>
          </div>
        </div>
        <div className="flex items-center gap-6">
           <div className="hidden md:flex items-center gap-4 border-r border-black/5 pr-6">
              <div className="flex flex-col items-end">
                 <span className="text-[10px] font-display font-bold text-primary uppercase tracking-widest">Active Sequence</span>
                 <span className="text-xs font-bold text-on-background uppercase italic">Spike Drill B.mov</span>
              </div>
           </div>
           <div className="w-10 h-10 rounded-full overflow-hidden border-2 border-primary/30">
              <img 
                className="w-full h-full object-cover" 
                src="https://lh3.googleusercontent.com/aida-public/AB6AXuA2RmqDwBsJ4iVEMFvzL_AWVquBDrwi2vo0RWbpyIcRjMgxtgiMKx3LGjBaGvLEInfYcPKTJ87Qmq9wfmrgTs5V9JwgIkOh8whMWP5OJB4-OaUYPCXBzgJtKwD6YoD-ux5UQoL8t5z76JsSo97MNhb1LTm9FsT2h-Gi0HZIVhVdMvnaFplfu5kUAfNkB4Swndfly2JlS0yRRgPNCCW_5ffje6PGbf_zIs444epUXbWAxcyUHH83uZYC54CFsRtluhFjfEF8akyATg" 
                alt="Profile"
              />
           </div>
        </div>
      </header>

      {/* Navigation Tabs - Simplified Focus */}
      <div className="lg:px-12 px-6 py-4 flex gap-8 bg-transparent">
        <button className="text-primary font-display text-[10px] font-bold tracking-[0.2em] uppercase border-b-2 border-primary pb-2 cursor-pointer">
          Current Performance
        </button>
      </div>

      <main className="flex-1 overflow-y-auto lg:p-12 p-5 bg-transparent custom-scrollbar">
        <div className="lg:max-w-7xl max-w-full mx-auto space-y-12">
          
          <div className="grid grid-cols-1 md:grid-cols-12 gap-10">
            
            {/* Primary Analysis View */}
            <div className="md:col-span-8 space-y-8">
              <div 
                onDragOver={(e) => e.preventDefault()}
                onDrop={onDrop}
                className={`w-full min-h-[500px] lg:min-h-0 lg:aspect-video glass-panel rounded-3xl border-2 border-dashed border-primary/40 ${isUploaded ? 'border-primary/40' : 'border-black/10'} flex flex-col items-center justify-center relative group overflow-hidden transition-all`}
              >
                {isUploaded && videoUrl ? (
                  <div className="absolute inset-0 bg-black ">
                    {/* Identification Overlay */}
                    <AnimatePresence>
                      {workflowStatus === 'IDENTIFYING' && (
                        <motion.div 
                          initial={{ opacity: 0 }} 
                          animate={{ opacity: 1 }} 
                          exit={{ opacity: 0 }}
                          className="absolute inset-0 z-50 bg-black/60 backdrop-blur-md flex flex-col items-center justify-center space-y-6"
                        >
                          <RefreshCw className="w-12 h-12 text-primary animate-spin" />
                          <div className="text-center">
                            <span className="text-[10px] font-headline font-black text-primary uppercase tracking-[0.3em]">Finding Players</span>
                            <p className="text-white/40 text-[9px] font-display font-bold uppercase italic tracking-widest mt-2">Looking for athletes in the video...</p>
                          </div>
                        </motion.div>
                      )}

                      {workflowStatus === 'ANALYZING' && (
                        <motion.div 
                          initial={{ opacity: 0 }} 
                          animate={{ opacity: 1 }} 
                          className="absolute inset-0 z-50 bg-black/60 backdrop-blur-md flex flex-col items-center justify-center space-y-6"
                        >
                          <div className="relative">
                             <div className="w-24 h-24 border-t-4 border-primary rounded-full animate-spin shadow-[0_0_20px_#c3f400]" />
                             <Target className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-8 h-8 text-primary animate-pulse" />
                          </div>
                          <div className="text-center">
                            <span className="text-[10px] font-headline font-black text-primary uppercase tracking-[0.3em]">Smart Analysis</span>
                            <p className="text-white/40 text-[9px] font-display font-bold uppercase italic tracking-widest mt-2">Studying how {selectedPerson} moves...</p>
                          </div>
                        </motion.div>
                      )}
                    </AnimatePresence>

                    <video 
                      ref={videoRef}
                      key={videoUrl}
                      src={videoUrl}
                      className="w-full h-full object-contain relative z-0"
                      playsInline
                      muted
                      crossOrigin="anonymous"
                      onPlay={() => setIsPaused(false)}
                      onPause={() => setIsPaused(true)}
                      onLoadedMetadata={() => {
                        if (videoRef.current && canvasRef.current) {
                          canvasRef.current.width = videoRef.current.videoWidth || 1280;
                          canvasRef.current.height = videoRef.current.videoHeight || 720;
                        }
                      }}
                    />
                    <canvas 
                      ref={canvasRef}
                      width={1280} 
                      height={720}
                      className="absolute inset-0 w-full h-full pointer-events-none z-10" 
                    />
                    
                    {/* Removal & Capture Controls */}
                    <div className="absolute top-6 right-6 z-40 flex gap-3">
                      {workflowStatus === 'COMPLETED' && (
                        <button 
                          onClick={() => setShowSkeletons(!showSkeletons)}
                          className={`p-2.5 border rounded-xl backdrop-blur-md transition-all group/skel cursor-pointer ${showSkeletons ? 'bg-primary border-primary' : 'bg-black/40 border-white/10 hover:bg-white/10'}`}
                          title={showSkeletons ? "Hide AI Skeletons" : "Show AI Skeletons"}
                        >
                          <Shield className={`w-5 h-5 ${showSkeletons ? 'text-white' : 'text-white/60'}`} />
                        </button>
                      )}
                      <button 
                        onClick={(e) => { e.stopPropagation(); captureScreenshot(); }}
                        className="p-2.5 bg-black/40 hover:bg-primary border border-white/10 rounded-xl backdrop-blur-md transition-all group/cam cursor-pointer"
                        title="Capture Screenshot"
                      >
                        <Camera className="w-5 h-5 text-white/60 group-hover/cam:text-white transition-colors" />
                      </button>
                      <button 
                        onClick={(e) => { e.stopPropagation(); handleReset(); }}
                        className="p-2.5 bg-black/40 hover:bg-red-500 border border-white/10 rounded-xl backdrop-blur-md transition-all group/trash cursor-pointer"
                        title="Remove video"
                      >
                        <Trash2 className="w-5 h-5 text-white/60 group-hover/trash:text-white transition-colors" />
                      </button>
                    </div>
                    
                    {!isAnalyzing && (
                      <div className="absolute inset-0 bg-black/20 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none z-30">
                        <button 
                          onClick={(e) => { e.stopPropagation(); togglePlayPause(); }}
                          className="w-20 h-20 rounded-full bg-primary/20 border border-primary/40 flex items-center justify-center backdrop-blur-md hover:scale-110 shadow-2xl transition-transform pointer-events-auto cursor-pointer"
                        >
                          {isPaused ? (
                            <Play className="w-8 h-8 text-primary fill-current" />
                          ) : (
                            <div className="flex gap-1.5 p-1">
                              <div className="w-2 h-2 bg-primary rounded-full transition-all duration-300 group-hover:h-8" />
                              <div className="w-2 h-2 bg-primary rounded-full transition-all duration-300 group-hover:h-8" />
                            </div>
                          )}
                        </button>
                      </div>
                    )}

                    {targetLocked ? (
                      <div className="absolute top-6 left-6 z-20 flex items-center gap-3 bg-primary/90 text-white px-4 py-1.5 rounded-full font-display text-[9px] font-bold uppercase tracking-widest shadow-[0_0_20px_rgba(245,90,60,0.5)]">
                         <Target className="w-3.5 h-3.5" />
                         Target Locked
                      </div>
                    ) : (
                      <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
                         <div className="w-64 h-64 border-2 border-primary/20 rounded-full border-dashed animate-[spin_10s_linear_infinite]" />
                         <div className="absolute w-4 h-4 border-2 border-primary rounded-full" />
                         <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 text-[8px] font-display font-bold text-primary/40 uppercase tracking-[0.3em] mt-8">
                            Click to lock subject
                         </div>
                      </div>
                    )}

                    {/* Analysis Trigger - Only show when target is locked and paused - HIDE IN COMPLETED UNLESS MANUALLY REQUESTED */}
                    {targetLocked && isPaused && !isAnalyzing && workflowStatus !== 'COMPLETED' && (
                      <motion.button
                        initial={{ y: 20, opacity: 0 }}
                        animate={{ y: 0, opacity: 1 }}
                        onClick={(e) => { e.stopPropagation(); captureImpactFrame(); }}
                        className="absolute bottom-8 left-1/2 -translate-x-1/2 z-30 flex items-center gap-3 bg-primary text-white px-8 py-4 rounded-2xl font-headline font-black text-xs uppercase tracking-widest hover:scale-105 active:scale-95 transition-all shadow-2xl cursor-pointer"
                      >
                        <Target className="w-4 h-4" />
                        Analyze Impact Frame
                      </motion.button>
                    )}

                    {isAnalyzing && (
                      <div className="absolute inset-0 z-40 bg-black/60 backdrop-blur-lg flex flex-col items-center justify-center space-y-6">
                        <div className="w-16 h-16 border-t-4 border-primary rounded-full animate-spin shadow-[0_0_15px_rgba(245,90,60,0.5)]" />
                        <div className="space-y-1 text-center">
                          <span className="text-[10px] font-headline font-black text-primary uppercase tracking-[0.3em]">Analyzing Moves</span>
                          <p className="text-white/40 text-[9px] font-display font-bold uppercase italic tracking-widest">Learning from the coach's brain...</p>
                        </div>
                      </div>
                    )}
                  </div>
                ) : (
                  <div className="flex flex-col items-center justify-center text-center p-8 w-full">
                    <div className="w-20 h-20 bg-black/5 rounded-full flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
                      <Video className="w-8 h-8 text-on-surface-variant" />
                    </div>
                    <h2 className="text-on-background font-headline lg:text-3xl text-xl font-bold italic mb-2 tracking-tight">Upload your Video</h2>
                    <p className="text-on-surface-variant text-sm mb-10 font-medium">Drag and drop your practice video or click to upload</p>
                    
                    <input 
                      type="file" 
                      id="video-upload" 
                      className="hidden" 
                      accept="video/mp4,video/webm,video/ogg,video/quicktime,video/*" 
                      onChange={(e) => e.target.files?.[0] && handleFileUpload(e.target.files[0])} 
                    />
                    <label 
                      htmlFor="video-upload"
                      className="px-12 py-4 bg-black/5 border border-black/10 rounded-2xl font-display font-bold text-[10px] uppercase tracking-widest text-on-background hover:bg-black/10 transition-all cursor-pointer hover:border-black/20"
                    >
                      SELECT SOURCE FILE
                    </label>
                  </div>
                )}

                {/* Progress HUD Overlay */}
                <AnimatePresence>
                  {isUploading && (
                    <motion.div 
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      exit={{ opacity: 0 }}
                      className="absolute inset-0 bg-background/90 backdrop-blur-xl flex flex-col items-center justify-center p-12 z-50"
                    >
                      <div className="w-full max-w-md space-y-8">
                        <div className="flex justify-between items-end">
                          <div>
                            <span className="text-primary font-display text-[10px] font-bold uppercase tracking-[0.3em] block mb-2 animate-pulse">GeminiSlingShot Engine</span>
                            <h4 className="text-on-background font-headline text-2xl font-bold italic uppercase tracking-tight">Syncing Stream...</h4>
                          </div>
                          <span className="text-4xl font-headline text-primary font-bold tabular-nums">{uploadProgress}%</span>
                        </div>
                        <div className="h-2.5 w-full bg-black/5 rounded-full overflow-hidden border border-black/5">
                          <motion.div 
                            initial={{ width: 0 }}
                            animate={{ width: `${uploadProgress}%` }}
                            className="h-full bg-primary shadow-[0_0_25px_rgba(245,90,60,0.5)]"
                          />
                        </div>
                        <p className="text-[10px] text-on-surface-variant font-display font-bold text-center uppercase tracking-[0.5em] leading-relaxed">
                          Allocating Tensor Cubes • Partitioning Temporal Chunks • Neutralizing Frame Noise
                        </p>
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>

              {/* Target Configuration */}
              <div className="grid grid-cols-1 gap-6">
                <div className="glass-panel rounded-3xl p-6 border border-black/5 flex items-center justify-between">
                  <div className="flex items-center gap-4">
                    <div className={`w-12 h-12 rounded-2xl flex items-center justify-center transition-all ${selectedPerson ? 'bg-primary/20 border-primary/40' : 'bg-black/5 border-black/10'} border`}>
                      <User className={`w-6 h-6 ${selectedPerson ? 'text-primary' : 'text-on-surface-variant'}`} />
                    </div>
                    <div>
                      <span className="text-[9px] font-display font-bold text-black/40 uppercase tracking-widest block">SELECTED ATHLETE</span>
                      <p className="text-xs font-bold text-on-background italic">{selectedPerson || 'Awaiting Selection'}</p>
                    </div>
                  </div>
                  {selectedPerson && (
                    <button 
                      onClick={() => setWorkflowStatus('SELECTING')}
                      className="px-6 py-2 rounded-xl bg-black/5 text-black/40 border border-black/10 font-display font-bold text-[9px] uppercase tracking-widest hover:bg-black/10 transition-all cursor-pointer"
                    >
                      SWITCH TARGET
                    </button>
                  )}
                </div>
              </div>

              {/* Action Bar - Only show if not completed yet or show as a subtle "Re-analyze" if needed */}
              {workflowStatus !== 'COMPLETED' && (
                <div className="glass-panel rounded-3xl p-8 border border-black/5 flex flex-col md:flex-row items-center justify-between gap-8 shadow-2xl relative overflow-hidden group">
                  <div className="flex items-center gap-6">
                    <div className={`w-16 h-16 rounded-2xl flex items-center justify-center transition-all ${workflowStatus === 'COMPLETED' ? 'bg-primary/20 border-primary/40' : 'bg-black/5 border-black/10'} border`}>
                      <Zap className={`w-8 h-8 ${workflowStatus === 'COMPLETED' ? 'text-primary' : 'text-on-surface-variant'}`} />
                    </div>
                    <div>
                      <h4 className="text-on-background font-headline text-xl font-bold italic uppercase tracking-tight">AI Vision Pipeline</h4>
                      <p className="text-on-surface-variant text-[10px] font-display font-bold tracking-widest uppercase mt-1">
                        {isUploaded ? 'Target identified • Awaiting analysis' : 'Awaiting manual source ingestion'}
                      </p>
                    </div>
                  </div>

                  <button 
                    disabled={!selectedPerson || isAnalyzing}
                    onClick={() => handlePersonSelect(selectedPerson!)}
                    className={`lg:px-10 px-6  lg:py-5 py-3 rounded-2xl font-display font-bold text-[10px] uppercase tracking-[0.3em] transition-all shadow-xl cursor-pointer ${
                      selectedPerson && !isAnalyzing
                        ? 'bg-primary text-white hover:scale-105 shadow-[0_0_40px_rgba(245,90,60,0.4)] active:scale-95' 
                        : 'bg-black/5 text-black/20 cursor-not-allowed border border-black/5'
                    }`}
                  >
                    {isAnalyzing ? (
                      <div className="flex items-center gap-3">
                        <RefreshCw className="w-4 h-4 animate-spin" />
                        <span>Processing...</span>
                      </div>
                    ) : (
                      'Initialize Deep Analysis'
                    )}
                  </button>
                </div>
              )}
            </div>

            {/* Personal Stats Focus */}
            <div className="md:col-span-4 space-y-8">
               <div className="glass-panel rounded-3xl p-8 border border-black/5 h-full space-y-8">
                  <h3 className="font-display text-[10px] text-on-surface-variant uppercase tracking-[0.3em] font-bold border-b border-black/5 pb-4">Personal Analysis</h3>
                  
                  <div className="space-y-10">
                    {analysis ? (
                      <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="space-y-10">
                        {/* Multi-Activity Navigator */}
                        {allEvents.length > 1 && (
                          <div className="p-4 bg-black/5 rounded-2xl border border-black/5 space-y-3">
                             <div className="flex justify-between items-center">
                                <span className="text-[8px] font-bold text-black/40 uppercase tracking-widest">DETECTED ACTIVITIES ({allEvents.length})</span>
                                <div className="flex gap-1">
                                   <button 
                                     disabled={activeEventIndex === 0}
                                     onClick={() => {
                                       const next = activeEventIndex - 1;
                                       setActiveEventIndex(next);
                                       setAnalysis(allEvents[next]);
                                     }}
                                     className="p-1.5 bg-black/5 rounded-lg disabled:opacity-30 cursor-pointer"
                                   >
                                      <ChevronLeft className="w-3 h-3" />
                                   </button>
                                   <button 
                                     disabled={activeEventIndex === allEvents.length - 1}
                                     onClick={() => {
                                       const next = activeEventIndex + 1;
                                       setActiveEventIndex(next);
                                       setAnalysis(allEvents[next]);
                                     }}
                                     className="p-1.5 bg-black/5 rounded-lg disabled:opacity-30 cursor-pointer"
                                   >
                                      <ChevronRight className="w-3 h-3" />
                                   </button>
                                </div>
                             </div>
                             <div className="flex flex-wrap gap-2">
                                {allEvents.map((ev, i) => (
                                  <button
                                    key={i}
                                    onClick={() => {
                                      setActiveEventIndex(i);
                                      setAnalysis(ev);
                                    }}
                                    className={`px-3 py-1 rounded-md text-[8px] font-bold uppercase transition-all cursor-pointer ${
                                      activeEventIndex === i ? 'bg-primary text-white' : 'bg-black/5 text-black/40 hover:bg-black/10'
                                    }`}
                                  >
                                    {ev.activity}
                                  </button>
                                ))}
                             </div>
                          </div>
                        )}

                        {/* Summary Action Card */}
                        <div className="p-6 bg-black/5 rounded-3xl border border-black/5 relative overflow-hidden group">
                           <div className="absolute top-0 right-0 p-4 opacity-10">
                              <Zap className="w-12 h-12 text-primary" />
                           </div>
                           <span className="text-[9px] font-display font-bold text-black/40 uppercase tracking-widest block mb-1">Play Recap</span>
                           <h4 className="text-3xl font-headline font-black text-primary italic uppercase tracking-tighter">{analysis.activity}</h4>
                           <div className="mt-4 flex gap-2 flex-wrap">
                              <span className="px-2 py-0.5 bg-primary/20 text-primary rounded-md text-[8px] font-bold uppercase tracking-widest">Contact Verified</span>
                              <span className="px-2 py-0.5 bg-black/5 text-black/40 rounded-md text-[8px] font-bold uppercase tracking-widest">Form {analysis.formQuality}</span>
                              {analysis.jumpHeight && analysis.jumpHeight > 0 && (
                                <span className="px-2 py-0.5 bg-tertiary/20 text-tertiary rounded-md text-[8px] font-bold uppercase tracking-widest flex items-center gap-1">
                                  <Zap className="w-2 h-2 fill-current" />
                                  {analysis.jumpHeight.toFixed(1)}" JUMP
                                </span>
                              )}
                           </div>
                        </div>

                        {/* Stance Section - Image Inspired */}
                        {analysis.activity === 'PASS' && (
                           <div className="p-6 bg-cyan-500/5 rounded-3xl border border-cyan-500/20 space-y-6">
                              <div className="flex items-center gap-3">
                                 <div className="w-2 h-2 bg-cyan-600 rounded-full animate-pulse" />
                                 <span className="text-[10px] font-headline font-black text-cyan-600 uppercase tracking-widest">DEFENSIVE SETUP</span>
                              </div>
                              <div className="grid grid-cols-2 gap-8">
                                <div className="space-y-2">
                                   <span className="text-[10px] text-black/40 font-bold uppercase tracking-widest block">BODY POSITION</span>
                                   <p className="text-3xl font-headline font-black text-on-background italic">{analysis.jointAngles.stance?.toFixed(0)}°</p>
                                   <div className="h-1 bg-black/10 rounded-full overflow-hidden">
                                      <motion.div 
                                        className="h-full bg-cyan-600" 
                                        initial={{ width: 0 }}
                                        animate={{ width: `${Math.min((analysis.jointAngles.stance || 0) / 120 * 100, 100)}%` }}
                                      />
                                   </div>
                                </div>
                                <div className="space-y-2">
                                   <span className="text-[10px] text-black/40 font-bold uppercase tracking-widest block">PLATFORM LOCK</span>
                                   <p className="text-3xl font-headline font-black text-cyan-600 italic">{analysis.platformStability}%</p>
                                   <div className="h-1 bg-black/10 rounded-full overflow-hidden">
                                      <motion.div 
                                        className="h-full bg-cyan-600 shadow-[0_0_10px_rgba(8,145,178,0.4)]" 
                                        initial={{ width: 0 }}
                                        animate={{ width: `${analysis.platformStability}%` }}
                                      />
                                   </div>
                                </div>
                              </div>
                           </div>
                        )}

                        {/* Traditional Biometrics */}
                        <div className="space-y-8">
                          {analysis.jumpHeight && analysis.jumpHeight > 0 && (
                            <div className="p-6 bg-tertiary/5 rounded-3xl border border-tertiary/20 flex items-center justify-between">
                               <div className="flex items-center gap-4">
                                  <div className="w-12 h-12 rounded-2xl bg-tertiary/20 flex items-center justify-center">
                                     <Activity className="w-6 h-6 text-tertiary" />
                                  </div>
                                  <div>
                                     <span className="text-[9px] font-display font-bold text-black/40 uppercase tracking-widest block">JUMP HEIGHT</span>
                                     <p className="text-xl font-headline font-black text-on-background italic">{analysis.jumpHeight.toFixed(1)} INCHES</p>
                                  </div>
                               </div>
                               <div className="text-right">
                                  <span className="text-[8px] font-bold text-tertiary uppercase tracking-widest block mb-1">Elite Level</span>
                                  <div className="flex gap-1">
                                     {[1, 2, 3, 4, 5].map((s) => (
                                       <div 
                                         key={s} 
                                         className={`w-4 h-1 rounded-full ${s <= (analysis.jumpHeight! / 30 * 5) ? 'bg-tertiary' : 'bg-black/5'}`} 
                                       />
                                     ))}
                                  </div>
                               </div>
                            </div>
                          )}

                          <div className="grid grid-cols-2 gap-4">
                            <div className="p-4 bg-black/5 rounded-2xl border border-black/5">
                               <span className="text-[9px] text-black/40 font-bold uppercase tracking-widest block mb-1">ELBOW ANGLE</span>
                               <p className="text-xl font-headline font-bold text-on-background italic">{analysis.jointAngles.elbow.toFixed(1)}°</p>
                            </div>
                            <div className="p-4 bg-black/5 rounded-2xl border border-black/5">
                               <span className="text-[9px] text-black/40 font-bold uppercase tracking-widest block mb-1">POWER RATIO</span>
                               <p className="text-xl font-headline font-bold text-primary italic">{analysis.powerScore.toFixed(0)}%</p>
                            </div>
                          </div>

                          <div className="p-8 rounded-3xl bg-primary/5 border border-primary/20 relative group">
                            <div className="absolute -top-4 left-6 px-4 py-1 bg-primary text-white text-[8px] font-headline font-black uppercase tracking-widest rounded-lg">Performance Tip</div>
                            <p className="text-sm lg:text-lg text-on-background font-display font-bold italic leading-tight">
                               "{analysis.feedback}"
                            </p>
                          </div>

                          <button 
                            onClick={onNavigateFeedback}
                            className="w-full py-5 bg-black text-white rounded-2xl font-display font-bold text-[10px] uppercase tracking-[0.3em] hover:bg-primary transition-all shadow-xl shadow-black/10 flex items-center justify-center gap-3 group cursor-pointer"
                          >
                            <span>Open Full Analysis</span>
                            <ChevronRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                          </button>
                        </div>
                      </motion.div>
                    ) : (
                      <div className="space-y-10 py-12 flex flex-col items-center justify-center text-center opacity-30">
                        <div className="w-16 h-16 rounded-full border-2 border-dashed border-black/20 flex items-center justify-center animate-[spin_10s_linear_infinite]">
                           <Target className="w-6 h-6 text-black/40" />
                        </div>
                        <div className="space-y-2">
                           <p className="text-[10px] text-on-surface-variant font-display font-bold uppercase tracking-[0.2em] italic">Awaiting Impact Event</p>
                           <p className="text-[9px] text-black max-w-[200px]">Scrub video and click "Analyze Impact Frame" to generate biomechanics report.</p>
                        </div>
                      </div>
                    )}
                  </div>

               </div>
            </div>

          </div>
        </div>
      </main>

      {/* Persistence Controls HUD */}
      <div className="fixed bottom-0 left-0 right-0 h-2 bg-primary/10 backdrop-blur-3xl z-50">
         <motion.div 
            animate={{ x: ['-20%', '120%'] }} 
            transition={{ repeat: Infinity, duration: 4, ease: 'linear' }}
            className="h-full w-40 bg-gradient-to-r from-transparent via-primary to-transparent opacity-40 shadow-[0_0_20px_rgba(245,90,60,0.5)]"
         />
      </div>
      </div>
      {/* Global Selection Modal */}
      <AnimatePresence>
        {workflowStatus === 'SELECTING' && (
          <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 md:p-12">
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setIsUploaded(false)}
              className="absolute inset-0 bg-black/80 backdrop-blur-md"
            />
            
            <motion.div 
              initial={{ opacity: 0, scale: 0.9, y: 20 }} 
              animate={{ opacity: 1, scale: 1, y: 0 }} 
              exit={{ opacity: 0, scale: 0.9, y: 20 }}
              className="relative w-full max-w-3xl max-h-[85vh] bg-white rounded-[2.5rem] shadow-[0_20px_60px_rgba(0,0,0,0.6)] border border-white/10 flex flex-col overflow-hidden"
            >
              <div className="p-8 text-center space-y-2 shrink-0 border-b border-black/5 bg-black/[0.01]">
                <div className="w-12 h-12 bg-primary/10 rounded-2xl flex items-center justify-center mx-auto mb-1">
                  <Target className="w-6 h-6 text-primary" />
                </div>
                <h4 className="text-2xl font-headline font-black text-primary italic uppercase tracking-tight">Focus Protocol</h4>
                <p className="text-black/40 text-[9px] font-display font-bold uppercase tracking-[0.25em]">Select the athlete for precision biomechanical tracking</p>
              </div>
              
              <div className="flex-1 overflow-y-auto p-8 custom-scrollbar">
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                  {peopleOptions.map((person, idx) => (
                    <button
                      key={idx}
                      onClick={() => handlePersonSelect(person)}
                      className="cursor-pointer glass-panel p-5 rounded-2xl border border-black/5 hover:border-primary/40 transition-all text-left flex items-start gap-4 group bg-white shadow-sm hover:shadow-lg hover:-translate-y-1"
                    >
                      <div className="w-10 h-10 rounded-xl bg-black/5 flex items-center justify-center group-hover:bg-primary/20 transition-colors shrink-0">
                        <User className="w-4 h-4 text-black/40 group-hover:text-primary" />
                      </div>
                      <div className="flex-1">
                        <span className="text-[8px] font-bold text-black/20 uppercase tracking-[0.2em] block mb-1">ID {idx + 1}</span>
                        <p className="text-sm font-headline font-bold text-black/80 group-hover:text-black transition-colors italic uppercase tracking-tight line-clamp-1">{person}</p>
                        <p className="text-[8px] text-black/40 mt-1 font-display uppercase tracking-widest">Active Movement</p>
                      </div>
                    </button>
                  ))}
                </div>
              </div>

              <div className="p-6 border-t border-black/5 bg-black/[0.01] flex justify-center">
                <button 
                  onClick={() => setIsUploaded(false)}
                  className="text-black/30 text-[9px] font-bold uppercase tracking-[0.4em] hover:text-primary transition-colors py-2 cursor-pointer"
                >
                  ← Abort Ingestion
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default VolleyProCore;

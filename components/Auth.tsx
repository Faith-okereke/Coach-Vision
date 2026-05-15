import React, { useState } from 'react';
import { supabase } from '../lib/supabase';
import { motion, AnimatePresence } from 'motion/react';
import { Mail, Lock, User, Terminal, ArrowRight, Zap } from 'lucide-react';

interface AuthProps {
  onSuccess?: () => void;
}

export const Auth: React.FC<AuthProps> = ({ onSuccess }) => {
  const [isLogin, setIsLogin] = useState(true);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleGoogleSignIn = async () => {
    if (!supabase) {
      setError('Supabase is not configured.');
      return;
    }
    setLoading(true);
    setError(null);
    try {
      const { error } = await supabase.auth.signInWithOAuth({
        provider: 'google',
        options: {
          redirectTo: window.location.origin,
        },
      });
      if (error) throw error;
    } catch (err: any) {
      setError(err.message);
      setLoading(false);
    }
  };

  const handleAuth = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!supabase) {
      setError('Supabase is not configured. Please set up your environment variables.');
      return;
    }
    setLoading(true);
    setError(null);

    try {
      if (isLogin) {
        const { error } = await supabase.auth.signInWithPassword({ email, password });
        if (error) throw error;
      } else {
        const { error } = await supabase.auth.signUp({ email, password });
        if (error) throw error;
        alert('Check your email for the confirmation link!');
      }
      onSuccess?.();
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 w-full h-full flex flex-col lg:flex-row bg-background overflow-hidden z-[100]">
      {/* Left Side: Visual/Branding */}
      <div className="relative flex-1 hidden lg:flex items-center justify-center overflow-hidden bg-slate-900">
        <div className="absolute inset-0 z-0">
          <img
            src="/volleyball-image.jpg"
            alt="Volleyball Training"
            className="w-full h-full object-cover grayscale opacity-30 scale-105"
          />
          <div className="absolute inset-0 bg-gradient-to-r from-slate-900 via-transparent to-transparent" />
          <div className="absolute inset-0 bg-gradient-to-b from-primary/10 via-transparent to-slate-900/60" />
        </div>

        <div className="relative z-10 p-24 space-y-8 max-w-2xl">
          <motion.div
            initial={{ x: -20, opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            className="w-16 h-16 bg-primary rounded-2xl flex items-center justify-center shadow-2xl shadow-primary/40"
          >
            <Zap className="w-8 h-8 text-white" />
          </motion.div>
          <div className="space-y-4">
            <h1 className="text-7xl font-headline font-black italic uppercase tracking-tighter text-white leading-[0.9]">
              Level Up Your <span className="text-primary">Game</span>
            </h1>
            <p className="text-slate-400 text-lg font-display font-medium max-w-md leading-relaxed">
              Precision biomechanics and personal training powered by advanced Gemini Vision modeling.
            </p>
          </div>
          <div className="flex gap-4 pt-8">
            <div className="px-6 py-3 rounded-full bg-white/5 border border-white/10 text-[10px] font-bold text-white uppercase tracking-widest">Personal Coach</div>
            <div className="px-6 py-3 rounded-full bg-white/5 border border-white/10 text-[10px] font-bold text-white uppercase tracking-widest">Real-time Form</div>
            <div className="px-6 py-3 rounded-full bg-white/5 border border-white/10 text-[10px] font-bold text-white uppercase tracking-widest">Elite Analysis</div>
          </div>
        </div>
      </div>

      {/* Mobile Top Header (Small Screens Only) */}
      <div className="lg:hidden relative h-48 w-full shrink-0 overflow-hidden">
        <img
          src="/volleyball-image.jpg"
          alt="Volleyball Training"
          className="w-full h-full object-cover opacity-50 shadow-2xl"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-[#0a0a0a] to-transparent" />
        <div className="absolute bottom-6 left-8">
          <Zap className="w-10 h-10 text-primary mb-2" />
          <h2 className="text-3xl font-headline font-black text-white italic uppercase tracking-tighter">VOLLEY VISION</h2>
        </div>
      </div>

      {/* Right Side: Auth Form */}
      <div className="w-full lg:w-[500px] xl:w-[600px] h-full flex flex-col items-center justify-center p-8 lg:p-16 bg-background lg:border-l border-black/5 relative overflow-y-auto">
        <div className="w-full max-w-sm space-y-10 relative z-10">
          <div className="space-y-2">
            <h2 className="text-4xl font-headline font-black italic uppercase tracking-tight text-on-background">
              {isLogin ? 'Sign In' : 'Sign Up'}
            </h2>
            <p className="text-sm text-on-surface-variant font-display font-medium uppercase tracking-[0.2em]">
              {isLogin ? 'Enter your credentials to continue' : 'Create your personal profile'}
            </p>
          </div>

          <form onSubmit={handleAuth} className="space-y-6">
            <div className="space-y-2">
              <label className="text-[10px] font-bold text-on-surface-variant uppercase tracking-widest ml-1">Email Address</label>
              <div className="relative group">
                <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400 group-focus-within:text-primary transition-colors" />
                <input
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full bg-slate-50 border border-slate-200 rounded-2xl py-5 pl-12 pr-4 text-on-background focus:ring-2 focus:ring-primary/10 focus:border-primary outline-none transition-all placeholder:text-slate-300"
                  placeholder="volley@pro.com"
                />
              </div>
            </div>

            <div className="space-y-2">
              <label className="text-[10px] font-bold text-on-surface-variant uppercase tracking-widest ml-1">Password</label>
              <div className="relative group">
                <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400 group-focus-within:text-primary transition-colors" />
                <input
                  type="password"
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full bg-slate-50 border border-slate-200 rounded-2xl py-5 pl-12 pr-4 text-on-background focus:ring-2 focus:ring-primary/10 focus:border-primary outline-none transition-all placeholder:text-slate-300"
                  placeholder="••••••••"
                />
              </div>
            </div>

            <AnimatePresence>
              {error && (
                <motion.div
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                  className="p-4 bg-primary/5 border border-primary/20 rounded-xl flex items-center gap-3"
                >
                  <Terminal className="w-4 h-4 text-primary shrink-0" />
                  <p className="text-[10px] font-bold text-primary uppercase tracking-tight leading-tight">{error}</p>
                </motion.div>
              )}
            </AnimatePresence>

            <button
              type="submit"
              disabled={loading}
              className="w-full bg-primary text-white py-5 rounded-2xl font-display font-black text-[12px] uppercase tracking-[0.4em] shadow-[0_15px_40px_rgba(245,90,60,0.3)] hover:scale-[1.02] active:scale-95 transition-all flex items-center justify-center gap-4 disabled:opacity-50 cursor-pointer"
            >
              {loading ? 'Authenticating...' : (
                <>
                  {isLogin ? 'LOGIN' : 'CREATE PROFILE'}
                  <ArrowRight className="w-4 h-4" />
                </>
              )}
            </button>
          </form>

          <div className="relative py-4">
            <div className="absolute inset-0 flex items-center"><div className="w-full border-t border-black/5"></div></div>
            <div className="relative flex justify-center text-[9px] uppercase tracking-[0.4em] font-bold">
              <span className="bg-background px-4 text-on-surface-variant/40">Or Sign in with</span>
            </div>
          </div>

          <div className="grid grid-cols-1 gap-4">
            <button 
              onClick={handleGoogleSignIn}
              disabled={loading}
              className="flex items-center justify-center gap-3 py-4 bg-slate-50 rounded-2xl border border-slate-200 hover:bg-slate-100 transition-colors group cursor-pointer disabled:opacity-50"
            >
              <div className="transistion-colors w-5 h-5">
              <svg xmlns="http://www.w3.org/2000/svg" width="1em" height="1em" viewBox="0 0 256 256">
                <path d="M0 0h256v256H0z" fill="none" />
                <path fill="#fff" d="M128.003 199.216c39.335 0 71.221-31.888 71.221-71.223S167.338 56.77 128.003 56.77S56.78 88.658 56.78 127.993s31.887 71.223 71.222 71.223" />
                <path fill="#229342" d="M35.89 92.997Q27.92 79.192 17.154 64.02a127.98 127.98 0 0 0 110.857 191.981q17.671-24.785 23.996-35.74q12.148-21.042 31.423-60.251v-.015a63.993 63.993 0 0 1-110.857.017Q46.395 111.19 35.89 92.998" />
                <path fill="#fbc116" d="M128.008 255.996A127.97 127.97 0 0 0 256 127.997A128 128 0 0 0 238.837 64q-36.372-3.585-53.686-3.585q-19.632 0-57.152 3.585l-.014.01a63.99 63.99 0 0 1 55.444 31.987a63.99 63.99 0 0 1-.001 64.01z" />
                <path fill="#1a73e8" d="M128.003 178.677c27.984 0 50.669-22.685 50.669-50.67s-22.685-50.67-50.67-50.67c-27.983 0-50.669 22.686-50.669 50.67s22.686 50.67 50.67 50.67" />
                <path fill="#e33b2e" d="M128.003 64.004H238.84a127.973 127.973 0 0 0-221.685.015l55.419 95.99l.015.008a63.993 63.993 0 0 1 55.415-96.014z" />
              </svg>
            </div>
              <span className="text-[10px] font-bold uppercase tracking-widest text-slate-500 group-hover:text-slate-700">Continue with Google</span>
            </button>
          </div>

          <div className="text-center pt-8">
            <button
              onClick={() => setIsLogin(!isLogin)}
              className="cursor-pointer text-[11px] font-bold text-on-surface-variant hover:text-primary transition-all uppercase tracking-widest"
            >
              {isLogin ? "Don't have a profile? Create one" : "Already training? Sign in here"}
            </button>
          </div>
        </div>

        {/* Footer info */}
        <div className="absolute bottom-8 text-center w-full left-0 opacity-40 hidden lg:block">
          <p className="text-[8px] font-bold uppercase tracking-[0.5em] text-on-surface-variant">GeminiSlingShot Technical Protocol v2.5</p>
        </div>
      </div>
    </div>
  );
};

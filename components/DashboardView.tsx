import React from 'react';
import { 
  TrendingUp, 
  Users, 
  Activity, 
  PlayCircle, 
  AlertTriangle,
  ChevronRight,
  Zap,
  Clock,
  Search
} from 'lucide-react';
import { motion } from 'motion/react';

export const DashboardView: React.FC = () => {
  return (
    <div className="w-full h-full overflow-y-auto p-12 bg-transparent custom-scrollbar">
      <div className="max-w-7xl mx-auto space-y-12">
        
        {/* Top App Bar Search Area */}
        <div className="flex justify-between items-center w-full pb-8 border-b border-black/5 mb-8 bg-background/40 backdrop-blur-md -mx-4 px-4 sticky top-0 z-30">
          <div className="flex items-center gap-10">
            <h2 className="font-headline text-2xl font-bold text-on-background tracking-tight italic">Dashboard</h2>
            <div className="hidden lg:flex relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-on-surface-variant w-4 h-4" />
              <input 
                className="bg-surface-container-high border-none rounded-full py-2 pl-10 pr-4 w-64 text-on-surface placeholder:text-on-surface-variant focus:ring-1 focus:ring-primary text-xs" 
                placeholder="Search athletes or sessions..." 
                type="text"
              />
            </div>
          </div>
          <div className="flex items-center gap-6">
             <button className="px-8 py-2.5 bg-secondary text-white font-display font-bold rounded-full hover:scale-95 transition-transform active:scale-100 text-[10px] uppercase tracking-widest shadow-lg">
                Upload Video
             </button>
          </div>
        </div>

        {/* Stats Bento Grid */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          <div className="md:col-span-2 glass-panel rounded-3xl p-8 relative overflow-hidden flex flex-col justify-between h-52 group">
            <div className="relative z-10">
              <h3 className="font-display text-[10px] font-bold text-tertiary mb-3 uppercase tracking-[0.2em]">Team Biomechanics Score</h3>
              <div className="flex items-baseline gap-3">
                <p className="font-headline text-5xl font-bold text-on-background tracking-tighter">88.4</p>
                <span className="text-primary text-sm font-bold flex items-center gap-1">
                  <TrendingUp className="w-4 h-4" /> 3.2%
                </span>
              </div>
            </div>
            
            {/* Sparkline Mockup */}
            <div className="absolute right-0 bottom-0 w-3/4 h-32 opacity-20 pointer-events-none group-hover:opacity-40 transition-opacity">
              <svg className="w-full h-full text-primary" viewBox="0 0 100 50" fill="none">
                <motion.path 
                  initial={{ pathLength: 0 }}
                  animate={{ pathLength: 1 }}
                  transition={{ duration: 2 }}
                  d="M0,45 Q15,40 25,30 T50,25 T75,10 T100,5" 
                  stroke="currentColor" 
                  strokeWidth="2" 
                  strokeLinecap="round"
                />
              </svg>
            </div>
            <p className="text-xs text-on-surface-variant z-10 max-w-[280px]">Improving significantly in Spike Elevation across all starters.</p>
          </div>

          <div className="glass-panel rounded-3xl p-8 flex flex-col justify-between h-52 border-l-4 border-primary">
            <h3 className="font-display text-[10px] font-bold text-on-surface-variant mb-2 uppercase tracking-widest">Active Athletes</h3>
            <p className="font-headline text-4xl font-bold text-on-background tracking-tighter">24</p>
            <div className="flex -space-x-3">
              {[1, 2, 3].map((i) => (
                <div key={i} className="w-10 h-10 rounded-full border-2 border-background overflow-hidden bg-surface-container-high">
                  <img src={`https://i.pravatar.cc/100?img=${i+10}`} alt="avatar" />
                </div>
              ))}
              <div className="w-10 h-10 rounded-full border-2 border-background flex items-center justify-center bg-surface-container-high text-[10px] font-bold text-white">
                +21
              </div>
            </div>
          </div>

          <div className="glass-panel rounded-3xl p-8 flex flex-col justify-between h-52 border-l-4 border-tertiary">
            <h3 className="font-display text-[10px] font-bold text-on-surface-variant mb-2 uppercase tracking-widest">Sessions Analyzed</h3>
            <p className="font-headline text-4xl font-bold text-on-background tracking-tighter">152</p>
            <p className="text-[10px] font-bold text-tertiary uppercase tracking-widest">Last 30 days: +42 sessions</p>
          </div>
        </div>

        {/* Content Section: Recent Sessions & Alerts */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
          
          {/* Recent Sessions (2/3) */}
          <div className="lg:col-span-2 space-y-8">
            <div className="flex items-center justify-between">
              <h2 className="font-headline text-2xl font-bold text-on-background italic tracking-tight">Recent Sessions</h2>
              <button className="text-tertiary font-display text-[10px] font-bold uppercase tracking-widest hover:underline flex items-center gap-2">
                View All <ChevronRight className="w-3 h-3" />
              </button>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {[
                { name: 'Sarah Jenkins', type: 'Spike Velocity Drill', pct: 92, time: '2m ago', img: 'https://lh3.googleusercontent.com/aida-public/AB6AXuC6e4sktip1SuuR5ePU1gWdxpMLnry1_CFRTUlfVB2h2k1GZd6Q2nipMcfjL3RSqVy7RZv-FJ0Eakne6zEm7nipxl2JGNKmWIOO-O0WF2nushmsmwcSdV85xraDy1VlZJkrg8u7MdoIgw00wn76LkCV46_ktPokV29eF55f_rSBOUAUGXsRhkdwItEz1BwTGesFn6SvnrMyiuiEUtUw7IcUsl-l0-BnF646ihCaNOxW_M5b_BSOFBkB_iVWIT-F7Mvonnmjqmi1Qg' },
                { name: 'Marcus Zhao', type: 'Jump Serve Sequence', pct: 87, time: '1h ago', img: 'https://lh3.googleusercontent.com/aida-public/AB6AXuCIa_ieY7dE1x64ng_fyUb2ULumZNcnDZi_wvur_CeHv995R2zcB1vM8rkWCu7eA9HQ6NekNnp9BDBNqufDI-pOQLoig8E629PU5-wwkXADj1HwpsZDtk86XDHTSyyX3IIhzhKydVJ5sdvzNCN1nffNI2cnMjunYW7pPAajo79cNBzc1gTsMfRi7JsoPA793JfpwMQ-ezZTnK64zao0IOUWMz81EHTaV3SE5sNhfuhSoShyCo9idGR9C-v7RogfyGN_CNHfoZqyYQ' },
                { name: 'Team Practice', type: 'Defensive Alignment', pct: 64, time: '4h ago', img: 'https://lh3.googleusercontent.com/aida-public/AB6AXuC0HN6Ck2P9niiSeHoqIxW0Zca2oHTQmPhhooPsYAw5vSM8tBoGAHhqr8MibmX84ScZaI4yDwiY0VWOm0f_UbOmbBiDWWLP0SAgnJZah6bcUYoDXT37I-99Cs11x703TkH1G4MxmabaaCvcfut8H0fEPJ2tbh8_8_8bsmmHG05o7hb_l0iOP-iE0363-BUR1bFBCtXEnQ0K3_cfBYG-XBp3qFF8KaEovIXiqJlC0VTHeIJGPOeH4pTULzSi8zU-gicPUqbyMtuG7w' },
                { name: 'Elena Rodriguez', type: 'Floor Defense Drill', pct: 95, time: 'Yesterday', img: 'https://lh3.googleusercontent.com/aida-public/AB6AXuCatTHpBBToE2TYD-BtzkNzv_MOYXKQohBvLpsDjPOTulFCTNcTo03MDiBYrBteXVE-gAU9jtNN5H097tH7yn9n1g-ycd9LkbYPe4x8X64bNcA0Xm5XJ13KRWFIrCrt7ASG3tga0kd465N5PI5vSsrtABHO7ncUDWSLMv6RSSVGHqwEkTG6t9GfeHS0c9VYgPJPz3M9bX78_9pWJU1tyB7s9omFVm2LFA81b2pcEoImVaFMrtAIbarmYPbWPLVUyF8fQV9HpM9VRg' }
              ].map((session, idx) => (
                <motion.div 
                  key={idx}
                  whileHover={{ y: -4 }}
                  className="glass-panel rounded-3xl overflow-hidden group cursor-pointer border border-black/5 bg-gradient-to-br from-black/5 to-transparent shadow-sm"
                >
                  <div className="relative aspect-video">
                    <img className="w-full h-full object-cover opacity-80 group-hover:opacity-100 transition-opacity" src={session.img} alt={session.name} />
                    <div className="absolute inset-0 bg-gradient-to-t from-background/90 via-transparent to-transparent" />
                    <div className="absolute top-4 right-4 bg-primary text-white px-2.5 py-1 rounded-full text-[10px] font-bold shadow-xl">
                      {session.pct}% Form
                    </div>
                    <div className="absolute bottom-4 left-4">
                      <p className="font-bold text-on-background text-sm">{session.name}</p>
                      <p className="text-[10px] text-on-surface-variant font-display font-bold uppercase tracking-widest">{session.type} • {session.time}</p>
                    </div>
                    <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                      <div className="w-12 h-12 rounded-full bg-primary flex items-center justify-center shadow-[0_0_20px_rgba(245,90,60,0.5)]">
                        <PlayCircle className="w-6 h-6 text-white fill-current" />
                      </div>
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>
          </div>

          {/* Athlete Alerts (1/3) */}
          <div className="space-y-8">
            <h2 className="font-headline text-2xl font-bold text-on-background italic tracking-tight">Athlete Alerts</h2>
            <div className="space-y-4">
              {[
                { name: 'Kevin Miller', status: 'CRITICAL', color: 'red-500', icon: AlertTriangle, desc: 'Landed on one leg 5 times in a row. This can be hard on the knees, so try to use both legs to land safely.', tags: ['Safe Landing', 'Balance'] },
                { name: 'Lila Thorne', status: 'REVIEW', color: 'primary', icon: Activity, desc: 'Your elbow is dropping a bit when you are swinging to hit. Keep it high to get more power and a better hit.', tags: ['High Elbow'] },
                { name: 'David Park', status: 'OPTIMIZATION', color: 'tertiary', icon: Zap, desc: 'Jumping a little lower than usual in the last few matches. Might be time for some rest!', tags: ['Jump Height'] }
              ].map((alert, idx) => (
                <div key={idx} className={`glass-panel rounded-3xl p-5 border-l-4 border-${alert.color} relative overflow-hidden group hover:bg-black/5 transition-all`}>
                  <div className="flex items-start gap-4">
                    <div className={`w-12 h-12 rounded-full bg-${alert.color}/10 flex-shrink-0 flex items-center justify-center text-${alert.color}`}>
                      <alert.icon className="w-6 h-6" />
                    </div>
                    <div className="flex-1">
                      <div className="flex justify-between items-center mb-1">
                        <p className="font-bold text-on-background text-sm">{alert.name}</p>
                        <span className="text-[8px] font-display font-bold text-on-surface-variant uppercase tracking-widest">{alert.status}</span>
                      </div>
                      <p className="text-xs text-on-surface-variant leading-relaxed line-clamp-2">{alert.desc}</p>
                      <div className="flex gap-2 mt-3">
                        {alert.tags.map(tag => (
                          <span key={tag} className={`bg-black/5 text-on-surface-variant/60 text-[8px] px-2 py-1 rounded-sm border border-black/5 font-display font-bold uppercase tracking-widest`}>{tag}</span>
                        ))}
                      </div>
                    </div>
                  </div>
                </div>
              ))}
              <button className="w-full py-4 border border-black/10 rounded-2xl text-on-surface-variant font-display text-[10px] font-bold uppercase tracking-widest hover:bg-black/5 hover:text-on-background transition-all shadow-sm active:scale-95">
                Open Correction Workspace
              </button>
            </div>
          </div>
        </div>

      </div>
      <div className="max-w-7xl mx-auto pt-12 pb-6 text-center border-t border-black/5 mt-12">
        <p className="text-[8px] font-display font-bold text-on-surface-variant/20 uppercase tracking-[0.5em]">Powered by GeminiSlingShot Technical Library v2.5.0</p>
      </div>
    </div>
  );
};

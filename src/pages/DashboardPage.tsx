import { motion } from 'framer-motion';
import EcosystemViewer from '@/components/game/EcosystemViewer';
import { Link } from 'react-router-dom';
import { useEffect, useState, useRef, useCallback } from 'react';

// ── Inline Mock Data ──
const user = {
  name: 'Rohan',
  level: 3,
  levelTitle: 'Sprout',
  ecoPoints: 2180,
  streakDays: 14,
  rank: 4,
  treesPlanted: 7,
  co2Saved: 24,
  ecosystemHealth: 72,
};

const missions = [
  { id: 1, title: 'Plant a Sapling', desc: 'Visit a local park and plant one native tree sapling', category: 'planting', icon: '🌱', bg: 'linear-gradient(135deg, #52B788, #1B4332)', difficulty: 'easy' as const, time: '30 min', points: 50, progress: 0, status: 'available' as const },
  { id: 2, title: 'Segregate Waste', desc: 'Sort your household waste into recyclable and organic bins', category: 'waste', icon: '♻️', bg: 'linear-gradient(135deg, #48CAE4, #0369A1)', difficulty: 'medium' as const, time: '20 min', points: 100, progress: 65, status: 'in_progress' as const },
  { id: 3, title: 'Bike to Campus', desc: 'Skip the car or bus and cycle to school today', category: 'transport', icon: '🚲', bg: 'linear-gradient(135deg, #F4A261, #C2410C)', difficulty: 'hard' as const, time: '45 min', points: 200, progress: 0, status: 'available' as const },
];

const leaderboard = [
  { rank: 1, name: 'Priya Sharma', school: 'Delhi Public School', points: 3240, change: '+2', avatar: '👩' },
  { rank: 2, name: 'Arjun Mehta', school: "St. Xavier's College", points: 2890, change: '+1', avatar: '👨' },
  { rank: 3, name: 'Ananya Iyer', school: 'Greenfield Academy', points: 2450, change: '-1', avatar: '👩' },
  { rank: 4, name: 'Rohan (You)', school: 'EcoQuest High', points: 2180, change: '+3', avatar: '🧑', isYou: true },
  { rank: 5, name: 'Meera Nair', school: 'Sunrise School', points: 1980, change: '—', avatar: '👩' },
];

const weeklyChart = [
  { day: 'Mon', value: 35 }, { day: 'Tue', value: 55 }, { day: 'Wed', value: 40 },
  { day: 'Thu', value: 70 }, { day: 'Fri', value: 90 }, { day: 'Sat', value: 60 },
  { day: 'Sun', value: 45, isToday: true },
];

const activity = [
  { icon: '🌊', bg: '#EFF6FF', action: 'Completed Water Challenge', time: '2 hours ago', pts: '+100 pts' },
  { icon: '🏆', bg: '#FEF3C7', action: 'Reached Top 10 Leaderboard', time: 'Yesterday', pts: '+Badge' },
  { icon: '🌱', bg: '#D1FAE5', action: 'Planted 2 Trees', time: '2 days ago', pts: '+150 pts' },
  { icon: '📚', bg: '#F3E8FF', action: 'Completed Climate Quiz', time: '3 days ago', pts: '+30 pts' },
];

const badges = [
  { icon: '🌱', name: 'First Steps', bg: '#D1FAE5', earned: true },
  { icon: '🔥', name: 'On Fire', bg: '#FEF3C7', earned: true },
  { icon: '💧', name: 'Water Guard', bg: '#EFF6FF', earned: true },
  { icon: '🌳', name: 'Tree Hugger', bg: '#D1FAE5', earned: false },
  { icon: '🏆', name: 'Top 10', bg: '#FEF3C7', earned: false },
  { icon: '♻️', name: 'Recycler', bg: '#F0FFF4', earned: false },
];

// ── Animation variants ──
const stagger = { hidden: {}, visible: { transition: { staggerChildren: 0.08 } } };
const fadeUp = { hidden: { opacity: 0, y: 20 }, visible: { opacity: 1, y: 0, transition: { duration: 0.5 } } };

// ── CountUp hook ──
function useCountUp(target: number, duration = 1200) {
  const [value, setValue] = useState(0);
  const started = useRef(false);
  
  useEffect(() => {
    if (started.current) return;
    started.current = true;
    const start = performance.now();
    const tick = (now: number) => {
      const progress = Math.min((now - start) / duration, 1);
      setValue(Math.round(target * progress));
      if (progress < 1) requestAnimationFrame(tick);
    };
    requestAnimationFrame(tick);
  }, [target, duration]);
  
  return value;
}

// ── Difficulty chip colors ──
const difficultyStyles = {
  easy: 'bg-accent text-jungle-bright',
  medium: 'bg-sun-gold/10 text-sun-gold',
  hard: 'bg-coral/10 text-coral',
};

export default function DashboardPage() {
  const ecoCount = useCountUp(user.ecoPoints);
  const streakCount = useCountUp(user.streakDays, 800);
  const rankCount = useCountUp(user.rank, 600);

  return (
    <motion.div className="p-4 md:p-7 max-w-[1400px] mx-auto space-y-5" variants={stagger} initial="hidden" animate="visible">
      
      {/* ── GREETING BAR ── */}
      <motion.div variants={fadeUp} className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
        <div>
          <h1 className="font-heading font-black text-2xl md:text-[26px] text-foreground">
            Good morning, {user.name}! 🌞
          </h1>
          <p className="text-sm text-muted-foreground mt-1">
            You're on a {user.streakDays}-day streak — don't break it today 🔥
          </p>
        </div>
        <div className="shrink-0 bg-card rounded-full px-4 py-2 shadow-card text-sm font-heading font-bold text-foreground">
          📅 Sun, 8 Mar 2026
        </div>
      </motion.div>

      {/* ── TWO-COLUMN GRID ── */}
      <div className="grid grid-cols-1 xl:grid-cols-[380px_1fr] gap-6">

        {/* ══════ LEFT COLUMN ══════ */}
        <div className="space-y-5">
          {/* Ecosystem Viewer Card */}
          <motion.div variants={fadeUp} className="rounded-3xl bg-bg-dark-panel p-4 shadow-float overflow-hidden relative">
            {/* Fireflies */}
            {[0, 0.7, 1.4, 2.1, 2.8, 3.5].map((delay, i) => (
              <div
                key={i}
                className="absolute w-1 h-1 rounded-full animate-firefly z-10"
                style={{
                  background: '#FFE566',
                  boxShadow: '0 0 6px 2px #FFE566',
                  top: `${15 + (i * 13) % 55}%`,
                  left: `${10 + (i * 17) % 75}%`,
                  animationDelay: `${delay}s`,
                }}
              />
            ))}
            
            <EcosystemViewer ecoPoints={user.ecoPoints} className="aspect-[16/10]" />
            
            <div className="mt-4 px-2 pb-2">
              <div className="flex items-center justify-between mb-2">
                <h2 className="font-heading font-extrabold text-base text-bg-elevated">🌳 Your Ecosystem</h2>
                <span className="inline-flex items-center gap-1.5 rounded-full bg-jungle-mid/30 px-3 py-1 text-xs font-heading font-bold text-jungle-pale">
                  🌿 {user.levelTitle} · Lv {user.level}
                </span>
              </div>
              
              <p className="text-[10px] font-heading font-extrabold uppercase tracking-[0.14em] text-jungle-light/60 mb-1.5">Ecosystem Health</p>
              <div className="h-3 rounded-full bg-white/10 overflow-hidden">
                <motion.div
                  className="h-full rounded-full"
                  style={{ background: 'linear-gradient(90deg, hsl(var(--jungle-bright)), hsl(var(--jungle-light)))', boxShadow: '0 0 12px hsl(var(--jungle-bright) / 0.5)' }}
                  initial={{ width: 0 }}
                  animate={{ width: `${user.ecosystemHealth}%` }}
                  transition={{ duration: 1.2, ease: 'easeOut', delay: 0.3 }}
                />
              </div>
              
              <div className="grid grid-cols-2 gap-2 mt-3">
                {[
                  { emoji: '🌳', label: `${user.treesPlanted} Trees Planted` },
                  { emoji: '💨', label: `${user.co2Saved}kg CO₂ Saved` },
                ].map((s, i) => (
                  <div key={i} className="flex items-center gap-2 rounded-xl bg-white/5 px-3 py-2 text-xs font-heading font-bold text-jungle-light">
                    <span>{s.emoji}</span>{s.label}
                  </div>
                ))}
              </div>
            </div>
          </motion.div>

          {/* Mini Leaderboard */}
          <motion.div variants={fadeUp} className="rounded-[20px] bg-card shadow-card p-5">
            <div className="flex items-center justify-between mb-4">
              <h2 className="font-heading font-extrabold text-foreground text-sm">🏆 Class Leaderboard</h2>
              <Link to="/leaderboard" className="text-xs text-primary font-heading font-bold hover:underline">View All →</Link>
            </div>
            <div className="space-y-1">
              {leaderboard.map((row) => {
                const medal = row.rank === 1 ? '🥇' : row.rank === 2 ? '🥈' : row.rank === 3 ? '🥉' : `${row.rank}`;
                const isPositive = row.change.startsWith('+');
                return (
                  <div
                    key={row.rank}
                    className={`flex items-center gap-3 px-3 py-2.5 rounded-xl transition-colors hover:bg-accent/30 ${
                      row.isYou ? 'bg-accent/40 border-l-[3px] border-primary' : ''
                    }`}
                  >
                    <span className="text-sm w-6 text-center font-heading font-black">{medal}</span>
                    <div className="w-8 h-8 rounded-lg bg-accent flex items-center justify-center text-base">{row.avatar}</div>
                    <div className="flex-1 min-w-0">
                      <p className="font-heading font-bold text-xs text-foreground truncate">{row.name}</p>
                      <p className="text-[10px] text-muted-foreground truncate">{row.school}</p>
                    </div>
                    <span className="font-heading font-black text-xs text-primary">{row.points.toLocaleString()}</span>
                    <span className={`text-[10px] font-heading font-bold ${isPositive ? 'text-primary' : row.change === '—' ? 'text-muted-foreground' : 'text-coral'}`}>
                      {row.change.startsWith('+') ? `↑${row.change}` : row.change.startsWith('-') ? `↓${row.change}` : row.change}
                    </span>
                  </div>
                );
              })}
            </div>
          </motion.div>
        </div>

        {/* ══════ RIGHT COLUMN ══════ */}
        <div className="space-y-5">
          
          {/* ── STAT CARDS ── */}
          <motion.div variants={fadeUp} className="grid grid-cols-2 lg:grid-cols-4 gap-3">
            {[
              { emoji: '🌿', label: 'EcoPoints', value: ecoCount.toLocaleString(), trend: '↑ +320 this week', borderClass: 'border-l-primary' },
              { emoji: '🔥', label: 'Day Streak', value: String(streakCount), trend: '🏆 Personal best!', borderClass: 'border-l-sun-gold' },
              { emoji: '⭐', label: 'Level', value: `Lv ${user.level}`, trend: `${user.levelTitle} rank`, borderClass: 'border-l-sky-blue' },
              { emoji: '🏆', label: 'Rank', value: `#${rankCount}`, trend: '↑ 3 places this week', borderClass: 'border-l-lavender' },
            ].map((card, i) => (
              <motion.div
                key={card.label}
                className={`relative rounded-[18px] bg-card shadow-card p-4 border-l-4 ${card.borderClass} overflow-hidden`}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.45 + i * 0.08, duration: 0.5 }}
                whileHover={{ y: -4, boxShadow: '0 10px 40px rgba(27,67,50,0.18)' }}
                whileTap={{ scale: 0.97 }}
              >
                <span className="absolute top-2 right-3 text-[28px] opacity-[0.12] pointer-events-none">{card.emoji}</span>
                <p className="font-heading font-extrabold text-[10px] uppercase tracking-[0.14em] text-muted-foreground">{card.label}</p>
                <p className="font-heading font-black text-[28px] text-foreground mt-1 leading-none">{card.value}</p>
                <p className="text-[11px] text-muted-foreground mt-1.5 font-body">{card.trend}</p>
              </motion.div>
            ))}
          </motion.div>

          {/* ── SEASONAL CHALLENGE ── */}
          <motion.div
            variants={fadeUp}
            className="relative rounded-[20px] p-5 overflow-hidden shadow-float"
            style={{ background: 'linear-gradient(135deg, hsl(var(--jungle-deep)) 0%, hsl(var(--jungle-mid)) 50%, hsl(var(--jungle-bright)) 100%)' }}
          >
            {/* Decorative rotating leaf */}
            <span className="absolute right-8 top-1/2 -translate-y-1/2 text-[48px] opacity-10 animate-rotate-slow pointer-events-none">🌿</span>
            
            <div className="flex flex-col sm:flex-row items-start gap-4">
              <span className="text-4xl shrink-0">🌧️</span>
              <div className="flex-1 min-w-0">
                <p className="text-[10px] font-heading font-extrabold uppercase tracking-[0.14em] text-jungle-light">
                  🏆 Seasonal Challenge · Active
                </p>
                <h3 className="font-heading font-extrabold text-base text-primary-foreground mt-1">Monsoon Water Save Challenge</h3>
                <div className="mt-3 h-2 rounded-full bg-white/15 overflow-hidden">
                  <motion.div
                    className="h-full rounded-full"
                    style={{ background: 'linear-gradient(90deg, hsl(var(--jungle-light)), white)' }}
                    initial={{ width: 0 }}
                    animate={{ width: '58%' }}
                    transition={{ duration: 1, delay: 0.5 }}
                  />
                </div>
                <p className="text-[11px] text-jungle-pale/60 mt-1.5 font-body">
                  School progress: 580 / 1000 liters · 1.5× EcoPoints active
                </p>
              </div>
              <div className="shrink-0 text-center sm:text-right">
                <p className="font-heading font-black text-[22px] text-primary-foreground leading-none">5d</p>
                <p className="text-[10px] text-jungle-pale/50 font-heading mt-0.5">remaining</p>
              </div>
            </div>
          </motion.div>

          {/* ── TODAY'S QUESTS ── */}
          <motion.div variants={fadeUp}>
            <div className="flex items-center justify-between mb-3">
              <h2 className="font-heading font-extrabold text-foreground text-sm">🎯 Today's Quests</h2>
              <Link to="/missions" className="text-xs text-primary font-heading font-bold hover:underline">View All Missions →</Link>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {missions.map((m, i) => (
                <motion.div
                  key={m.id}
                  className="rounded-[20px] bg-card shadow-card border border-border/30 overflow-hidden group"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.65 + i * 0.1, duration: 0.5 }}
                  whileHover={{ y: -5, boxShadow: '0 10px 40px rgba(27,67,50,0.18)', borderColor: 'hsl(var(--jungle-light))' }}
                  whileTap={{ scale: 0.97 }}
                >
                  {/* Gradient banner */}
                  <div className="h-[72px] flex items-center justify-center relative" style={{ background: m.bg }}>
                    <span className="text-3xl animate-bob" style={{ animationDelay: `${i * 0.3}s`, filter: 'drop-shadow(0 2px 4px rgba(0,0,0,0.2))' }}>
                      {m.icon}
                    </span>
                    <span className={`absolute top-2 right-2 text-[10px] font-heading font-bold px-2 py-0.5 rounded-full ${
                      m.status === 'in_progress' ? 'bg-sun-gold/90 text-foreground' : 'bg-card text-primary'
                    }`}>
                      {m.status === 'in_progress' ? 'In Progress' : 'Available'}
                    </span>
                  </div>
                  
                  {/* Card body */}
                  <div className="p-4">
                    <h3 className="font-heading font-bold text-sm text-foreground">{m.title}</h3>
                    <p className="text-xs text-muted-foreground mt-1 line-clamp-2 font-body">{m.desc}</p>
                    
                    <div className="flex items-center gap-2 mt-3">
                      <span className={`text-[10px] px-2 py-0.5 rounded-full font-heading font-bold ${difficultyStyles[m.difficulty]}`}>
                        {m.difficulty}
                      </span>
                      <span className="text-[10px] px-2 py-0.5 rounded-full font-heading font-bold bg-sky-blue/10 text-sky-blue">
                        {m.time}
                      </span>
                    </div>
                    
                    <div className="flex items-center justify-between mt-4">
                      <span className="font-heading font-black text-sm text-primary">🌿 +{m.points} pts</span>
                      <button className="bg-primary hover:bg-primary/80 text-primary-foreground text-xs font-heading font-bold px-3 py-1.5 rounded-[10px] transition-all hover:scale-[1.04]">
                        {m.status === 'in_progress' ? 'Continue' : 'Accept'}
                      </button>
                    </div>
                    
                    {m.status === 'in_progress' && (
                      <div className="mt-3 h-1.5 rounded-full bg-muted overflow-hidden">
                        <motion.div
                          className="h-full rounded-full bg-primary"
                          initial={{ width: 0 }}
                          animate={{ width: `${m.progress}%` }}
                          transition={{ duration: 0.8, delay: 0.8 }}
                        />
                      </div>
                    )}
                  </div>
                </motion.div>
              ))}
            </div>
          </motion.div>

          {/* ── WEEKLY CHART + ACTIVITY ── */}
          <motion.div variants={fadeUp} className="grid grid-cols-1 md:grid-cols-5 gap-4">
            {/* Weekly Chart */}
            <div className="md:col-span-3 rounded-[20px] bg-card shadow-card p-5">
              <div className="flex items-center justify-between mb-4">
                <h2 className="font-heading font-extrabold text-foreground text-sm">📈 Weekly EcoPoints</h2>
                <span className="font-heading font-black text-sm text-primary">+395 pts</span>
              </div>
              <div className="flex items-end justify-between gap-2 h-[140px]">
                {weeklyChart.map((bar, i) => (
                  <div key={bar.day} className="flex-1 flex flex-col items-center gap-1.5">
                    <div className="w-full flex-1 flex items-end">
                      <div
                        className="w-full rounded-t-lg animate-grow-bar"
                        style={{
                          height: `${bar.value}%`,
                          background: bar.isToday
                            ? 'linear-gradient(180deg, hsl(var(--jungle-light)), hsl(var(--jungle-bright)))'
                            : 'hsl(var(--jungle-pale))',
                          boxShadow: bar.isToday ? '0 0 12px hsl(var(--jungle-bright) / 0.4)' : 'none',
                          animationDelay: `${i * 0.06}s`,
                        }}
                      />
                    </div>
                    <span className="text-[10px] text-muted-foreground font-body">{bar.day}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Activity Feed */}
            <div className="md:col-span-2 rounded-[20px] bg-card shadow-card p-5">
              <h2 className="font-heading font-extrabold text-foreground text-sm mb-4">⚡ Recent Activity</h2>
              <div className="space-y-0">
                {activity.map((a, i) => (
                  <div key={i} className={`flex items-center gap-3 py-3 hover:bg-accent/20 rounded-lg px-2 transition-colors ${i < activity.length - 1 ? 'border-b border-border/50' : ''}`}>
                    <div className="w-10 h-10 rounded-xl flex items-center justify-center text-lg shrink-0" style={{ background: a.bg }}>
                      {a.icon}
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="font-heading font-bold text-xs text-foreground truncate">{a.action}</p>
                      <p className="text-[10px] text-muted-foreground font-body">{a.time}</p>
                    </div>
                    <span className="font-heading font-black text-xs text-primary shrink-0">{a.pts}</span>
                  </div>
                ))}
              </div>
            </div>
          </motion.div>

          {/* ── BADGE GALLERY ── */}
          <motion.div variants={fadeUp}>
            <div className="flex items-center justify-between mb-3">
              <h2 className="font-heading font-extrabold text-foreground text-sm">🏅 Your Badges</h2>
              <Link to="/profile" className="text-xs text-primary font-heading font-bold hover:underline">View All →</Link>
            </div>
            <div className="flex gap-3 overflow-x-auto pb-2 scrollbar-hide">
              {badges.map((b, i) => (
                <motion.div
                  key={i}
                  className={`shrink-0 flex flex-col items-center gap-1.5 cursor-pointer ${!b.earned ? 'grayscale opacity-40' : ''}`}
                  whileHover={b.earned ? { scale: 1.12, rotate: -3 } : {}}
                  whileTap={b.earned ? { scale: 0.95 } : {}}
                >
                  <div
                    className={`w-14 h-14 rounded-2xl flex items-center justify-center text-2xl relative ${b.earned ? 'shadow-card' : ''}`}
                    style={{ background: b.bg }}
                  >
                    {b.icon}
                    {!b.earned && <span className="absolute -bottom-0.5 -right-0.5 text-xs">🔒</span>}
                  </div>
                  <p className="text-[10px] text-muted-foreground font-body text-center max-w-[64px] truncate">{b.name}</p>
                </motion.div>
              ))}
            </div>
          </motion.div>

        </div>
      </div>
    </motion.div>
  );
}

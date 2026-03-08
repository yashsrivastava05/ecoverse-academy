import { motion } from 'framer-motion';
import EcosystemViewer from '@/components/game/EcosystemViewer';
import { Link } from 'react-router-dom';
import { useEffect, useState, useRef } from 'react';

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
  { day: 'Mon', value: 35, pts: 245 },
  { day: 'Tue', value: 55, pts: 385 },
  { day: 'Wed', value: 40, pts: 280 },
  { day: 'Thu', value: 70, pts: 490 },
  { day: 'Fri', value: 90, pts: 630 },
  { day: 'Sat', value: 60, pts: 420 },
  { day: 'Sun', value: 45, pts: 320, isToday: true },
];

const activity = [
  { icon: '🌊', bg: '#EFF6FF', action: 'Completed Water Challenge', time: '2 hours ago', pts: '+100 pts' },
  { icon: '🏆', bg: '#FEF3C7', action: 'Reached Top 10 Leaderboard', time: 'Yesterday', pts: '+Badge' },
  { icon: '🌱', bg: '#D1FAE5', action: 'Planted 2 Trees', time: '2 days ago', pts: '+150 pts' },
  { icon: '📚', bg: '#F3E8FF', action: 'Completed Climate Quiz', time: '3 days ago', pts: '+30 pts' },
];

const badges = [
  { icon: '🌱', name: 'First Steps', bg: '#D1FAE5', earned: true, glowColor: 'rgba(52,211,153,0.35)' },
  { icon: '🔥', name: 'On Fire', bg: '#FEF3C7', earned: true, glowColor: 'rgba(244,162,97,0.35)' },
  { icon: '💧', name: 'Water Guard', bg: '#EFF6FF', earned: true, glowColor: 'rgba(72,202,228,0.35)' },
  { icon: '🌳', name: 'Tree Hugger', bg: '#D1FAE5', earned: false, glowColor: '' },
  { icon: '🏆', name: 'Top 10', bg: '#FEF3C7', earned: false, glowColor: '' },
  { icon: '♻️', name: 'Recycler', bg: '#F0FFF4', earned: false, glowColor: '' },
];

// ── Difficulty chip colors ──
const difficultyStyles = {
  easy: 'bg-accent text-jungle-bright',
  medium: 'bg-sun-gold/10 text-sun-gold',
  hard: 'bg-coral/10 text-coral',
};

// ── Stat card gradient backgrounds ──
const statCardBgs = [
  'linear-gradient(135deg, #ffffff 60%, #f0fdf4 100%)',
  'linear-gradient(135deg, #ffffff 60%, #fff7ed 100%)',
  'linear-gradient(135deg, #ffffff 60%, #eff6ff 100%)',
  'linear-gradient(135deg, #ffffff 60%, #f5f3ff 100%)',
];

// ── CountUp hook ──
function useCountUp(target: number, duration = 1200) {
  const [value, setValue] = useState(0);
  const started = useRef(false);

  useEffect(() => {
    if (started.current) return;
    started.current = true;
    const start = performance.now();
    const tick = (now: number) => {
      const elapsed = now - start;
      const progress = Math.min(elapsed / duration, 1);
      // ease-out: 1 - (1 - t)^3
      const eased = 1 - Math.pow(1 - progress, 3);
      setValue(Math.round(target * eased));
      if (progress < 1) requestAnimationFrame(tick);
    };
    requestAnimationFrame(tick);
  }, [target, duration]);

  return value;
}

// ── Stagger delay helper ──
const sd = (base: number, i = 0, step = 0.07) => base + i * step;

export default function DashboardPage() {
  const ecoCount = useCountUp(user.ecoPoints);
  const streakCount = useCountUp(user.streakDays, 800);
  const rankCount = useCountUp(user.rank, 600);
  const [hoveredBar, setHoveredBar] = useState<number | null>(null);

  return (
    <div className="p-4 md:p-7 max-w-[1400px] mx-auto space-y-5">

      {/* ── GREETING BAR ── */}
      <motion.div
        className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3"
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.1 }}
      >
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
          <motion.div
            className="rounded-3xl bg-bg-dark-panel p-4 shadow-float overflow-hidden relative"
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
            style={{ animation: 'cardGlow 4s ease-in-out infinite' }}
          >
            {/* Fireflies */}
            {[0, 0.5, 1.0, 1.5, 2.0, 2.5, 3.0, 3.5].map((delay, i) => (
              <div
                key={i}
                className="absolute w-1 h-1 rounded-full animate-firefly z-10"
                style={{
                  background: '#FFE566',
                  boxShadow: '0 0 6px 3px rgba(255,229,102,0.75)',
                  top: `${15 + (i * 11) % 55}%`,
                  left: `${10 + (i * 13) % 75}%`,
                  animationDelay: `${delay}s`,
                  animationDuration: `${1.8 + (i % 4) * 0.4}s`,
                }}
              />
            ))}

            {/* Drifting leaves */}
            <span className="absolute text-sm pointer-events-none z-10 animate-leaf-drift-1" style={{ left: '25%', top: '-5%' }}>🍃</span>
            <span className="absolute text-sm pointer-events-none z-10 animate-leaf-drift-2" style={{ left: '65%', top: '-5%' }}>🍃</span>

            <EcosystemViewer ecoPoints={user.ecoPoints} className="aspect-[16/10]" />

            <div className="mt-4 px-2 pb-2">
              <div className="flex items-center justify-between mb-1">
                <h2 className="font-heading font-extrabold text-base text-bg-elevated">🌳 {user.name}'s Forest</h2>
                <span className="inline-flex items-center gap-1.5 rounded-full bg-jungle-mid/30 px-3 py-1 text-xs font-heading font-bold text-jungle-pale">
                  🌿 {user.levelTitle} · Lv {user.level}
                </span>
              </div>
              <p className="text-xs text-jungle-light/50 font-body mb-3">Growing since Day 1 · {user.treesPlanted} trees strong</p>

              <p className="text-[10px] font-heading font-extrabold uppercase tracking-[0.14em] text-jungle-light/60 mb-1.5">Ecosystem Health</p>
              <div className="h-3 rounded-full bg-white/10 overflow-hidden">
                <motion.div
                  className="h-full rounded-full animate-shimmer"
                  style={{
                    background: 'linear-gradient(90deg, #40916C 0%, #74C69D 40%, #D8F3DC 50%, #74C69D 60%, #40916C 100%)',
                    backgroundSize: '200% auto',
                  }}
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
          <motion.div
            className="rounded-[20px] bg-card shadow-card p-5"
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.35 }}
          >
            <div className="flex items-center justify-between mb-4">
              <h2 className="font-heading font-extrabold text-foreground text-sm">🏆 Class Leaderboard</h2>
              <Link to="/leaderboard" className="text-xs text-primary font-heading font-bold hover:underline transition-colors duration-[120ms]">View All →</Link>
            </div>
            <div className="space-y-1">
              {leaderboard.map((row) => {
                const medal = row.rank === 1 ? '🥇' : row.rank === 2 ? '🥈' : row.rank === 3 ? '🥉' : `${row.rank}`;
                const isPositive = row.change.startsWith('+');
                return (
                  <div
                    key={row.rank}
                    className={`flex items-center gap-3 px-3 py-2.5 rounded-xl transition-all duration-150 hover:bg-accent/30 ${
                      row.isYou ? 'border-l-[4px] border-primary' : ''
                    }`}
                    style={row.isYou ? { background: 'linear-gradient(90deg, #f0fff4, #ffffff)' } : {}}
                  >
                    <span className="text-sm w-6 text-center font-heading font-black">{medal}</span>
                    <div className="w-8 h-8 rounded-lg bg-accent flex items-center justify-center text-base">{row.avatar}</div>
                    <div className="flex-1 min-w-0">
                      <p className={`font-heading text-xs text-foreground truncate ${row.isYou ? 'font-extrabold' : 'font-bold'}`}>{row.name}</p>
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
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
            {[
              { emoji: '🌿', label: 'EcoPoints', value: ecoCount.toLocaleString(), trend: '↑ +320 this week', trendColor: '#40916C', borderClass: 'border-l-primary', numColor: '#1B4332' },
              { emoji: '🔥', label: 'Day Streak', value: String(streakCount), trend: '🏆 Personal best!', trendColor: '#D97706', borderClass: 'border-l-sun-gold', numColor: '#C2410C' },
              { emoji: '⭐', label: 'Level', value: `Lv ${user.level}`, trend: `${user.levelTitle} rank`, trendColor: '#40916C', borderClass: 'border-l-sky-blue', numColor: '#1B4332' },
              { emoji: '🏆', label: 'Rank', value: `#${rankCount}`, trend: '↑ 3 places this week', trendColor: '#4338CA', borderClass: 'border-l-lavender', numColor: '#4338CA' },
            ].map((card, i) => (
              <motion.div
                key={card.label}
                className={`relative rounded-[18px] shadow-card p-4 border-l-[5px] ${card.borderClass} overflow-hidden`}
                style={{ background: statCardBgs[i] }}
                initial={{ opacity: 0, y: 16 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: sd(0.2, i) }}
                whileHover={{ y: -4, boxShadow: '0 10px 40px rgba(27,67,50,0.18)', transition: { duration: 0.15 } }}
                whileTap={{ scale: 0.97, transition: { duration: 0.08 } }}
              >
                <span className="absolute top-3 right-3.5 text-[36px] opacity-[0.08] pointer-events-none" style={{ transform: 'rotate(10deg)' }}>{card.emoji}</span>
                <p className="font-heading font-extrabold text-[10px] uppercase tracking-[0.14em] text-muted-foreground">{card.label}</p>
                <p className="font-heading font-black text-[32px] leading-none mt-1" style={{ color: card.numColor }}>{card.value}</p>
                <p className="text-xs mt-1.5 font-heading font-bold" style={{ color: card.trendColor }}>{card.trend}</p>
              </motion.div>
            ))}
          </div>

          {/* ── SEASONAL CHALLENGE ── */}
          <motion.div
            className="relative rounded-[20px] overflow-hidden shadow-float"
            style={{
              background: 'linear-gradient(135deg, hsl(var(--jungle-deep)) 0%, hsl(var(--jungle-mid)) 50%, hsl(var(--jungle-bright)) 100%)',
              padding: '22px 26px',
            }}
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.35 }}
          >
            {/* Decorative rotating leaf */}
            <span className="absolute right-8 top-1/2 -translate-y-1/2 text-[80px] opacity-[0.14] pointer-events-none" style={{ animation: 'rotate-slow 12s linear infinite' }}>🌿</span>

            <div className="flex flex-col sm:flex-row items-start gap-4">
              <span className="text-4xl shrink-0">🌧️</span>
              <div className="flex-1 min-w-0">
                <p className="text-[10px] font-heading font-extrabold uppercase tracking-[0.14em] text-jungle-light flex items-center gap-2">
                  <span className="inline-block w-2 h-2 rounded-full bg-jungle-light animate-live-pulse shrink-0" />
                  Seasonal Challenge · Active
                </p>
                <h3 className="font-heading font-extrabold text-base text-primary-foreground mt-1">Monsoon Water Save Challenge</h3>
                <div className="mt-3 h-2 rounded-full bg-white/15 overflow-hidden">
                  <motion.div
                    className="h-full rounded-full animate-shimmer"
                    style={{
                      background: 'linear-gradient(90deg, #74C69D 0%, #D8F3DC 40%, #ffffff 50%, #D8F3DC 60%, #74C69D 100%)',
                      backgroundSize: '200% auto',
                      boxShadow: '0 0 10px rgba(116,198,157,0.7)',
                    }}
                    initial={{ width: 0 }}
                    animate={{ width: '58%' }}
                    transition={{ duration: 1.5, delay: 0.5, ease: 'easeOut' }}
                  />
                </div>
                <p className="text-[11px] text-jungle-pale/60 mt-1.5 font-body">
                  School progress: 580 / 1000 liters · 1.5× EcoPoints active
                </p>
              </div>
              <div className="shrink-0" style={{ background: 'rgba(255,255,255,0.1)', border: '1px solid rgba(255,255,255,0.15)', borderRadius: 14, padding: '10px 16px', textAlign: 'center' }}>
                <p className="font-heading font-black text-[28px] text-primary-foreground leading-none">5d</p>
                <p className="text-[11px] text-jungle-pale/60 font-body mt-0.5">remaining</p>
              </div>
            </div>
          </motion.div>

          {/* ── TODAY'S QUESTS ── */}
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.4 }}
          >
            <div className="flex items-center justify-between mb-3">
              <h2 className="font-heading font-extrabold text-foreground text-sm">🎯 Today's Quests</h2>
              <Link to="/missions" className="text-xs text-primary font-heading font-bold hover:underline transition-colors duration-[120ms]">View All Missions →</Link>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {missions.map((m, i) => (
                <motion.div
                  key={m.id}
                  className="rounded-[20px] bg-card shadow-card border border-border/30 overflow-hidden group"
                  initial={{ opacity: 0, y: 16 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: sd(0.45, i, 0.08), duration: 0.5 }}
                  whileHover={{ y: -4, boxShadow: '0 10px 40px rgba(27,67,50,0.18)', transition: { duration: 0.15 } }}
                  whileTap={{ scale: 0.97, transition: { duration: 0.08 } }}
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
                      <button className="bg-primary hover:bg-primary/80 text-primary-foreground text-xs font-heading font-bold px-3 py-1.5 rounded-[10px] transition-all duration-[120ms] hover:scale-[1.04] active:scale-[0.97]">
                        {m.status === 'in_progress' ? 'Continue' : 'Accept'}
                      </button>
                    </div>

                    {m.status === 'in_progress' && (
                      <div className="mt-3 h-[5px] rounded-full bg-muted overflow-hidden">
                        <motion.div
                          className="h-full rounded-full animate-shimmer"
                          style={{
                            background: 'linear-gradient(90deg, #40916C 0%, #74C69D 40%, #D8F3DC 50%, #74C69D 60%, #40916C 100%)',
                            backgroundSize: '200% auto',
                          }}
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
          <motion.div
            className="grid grid-cols-1 md:grid-cols-5 gap-4"
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.55 }}
          >
            {/* Weekly Chart */}
            <div className="md:col-span-3 rounded-[20px] bg-card shadow-card p-5">
              <div className="flex items-center justify-between mb-4">
                <h2 className="font-heading font-extrabold text-foreground text-sm">📈 Weekly EcoPoints</h2>
                <span className="font-heading font-black text-sm text-primary">+395 pts</span>
              </div>
              <div className="flex items-end gap-2 px-1" style={{ height: 130 }}>
                {weeklyChart.map((bar, i) => (
                  <div key={bar.day} className="flex-1 flex flex-col items-center relative">
                    {/* Tooltip */}
                    {hoveredBar === i && (
                      <div
                        className="absolute -top-8 z-20 whitespace-nowrap rounded-full px-2.5 py-1 text-[11px] font-heading font-bold text-white pointer-events-none"
                        style={{
                          background: '#1B4332',
                          opacity: 1,
                          transition: 'opacity 0.15s ease',
                        }}
                      >
                        {bar.pts} pts
                      </div>
                    )}
                    <div className="w-full flex items-end justify-center" style={{ height: 100 }}>
                      <div
                        className="w-full rounded-t-lg cursor-pointer"
                        onMouseEnter={() => setHoveredBar(i)}
                        onMouseLeave={() => setHoveredBar(null)}
                        style={{
                          height: (bar.value / 100) * 100,
                          minHeight: 4,
                          background: bar.isToday
                            ? 'linear-gradient(180deg, #74C69D, #40916C)'
                            : '#D8F3DC',
                          boxShadow: bar.isToday ? '0 -4px 16px rgba(64,145,108,0.45)' : 'none',
                          borderRadius: '8px 8px 0 0',
                          animation: `growBar 0.7s cubic-bezier(0.16, 1, 0.3, 1) ${i * 0.06}s both`,
                          transformOrigin: 'bottom',
                          transition: 'box-shadow 0.15s ease',
                        }}
                      />
                    </div>
                    <span className="text-[11px] text-muted-foreground font-body mt-1.5">{bar.day}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Activity Feed */}
            <div className="md:col-span-2 rounded-[20px] bg-card shadow-card p-5">
              <h2 className="font-heading font-extrabold text-foreground text-sm mb-4">⚡ Recent Activity</h2>
              <div className="space-y-0">
                {activity.map((a, i) => (
                  <div key={i} className={`flex items-center gap-3 py-3 hover:bg-accent/20 rounded-xl px-2 transition-all duration-150 ${i < activity.length - 1 ? 'border-b border-border/50' : ''}`}>
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
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.65 }}
          >
            <div className="flex items-center justify-between mb-3">
              <h2 className="font-heading font-extrabold text-foreground text-sm">🏅 Your Badges</h2>
              <Link to="/profile" className="text-xs text-primary font-heading font-bold hover:underline transition-colors duration-[120ms]">View All →</Link>
            </div>
            <div className="flex gap-3 overflow-x-auto pb-2 scrollbar-hide items-end">
              {badges.map((b, i) => (
                <motion.div
                  key={i}
                  className="shrink-0 flex flex-col items-center gap-1.5 cursor-pointer"
                  whileHover={b.earned ? { scale: 1.15, rotate: -4, transition: { type: 'spring', stiffness: 500, damping: 15 } } : {}}
                  whileTap={b.earned ? { scale: 0.95 } : {}}
                >
                  {b.earned ? (
                    <div
                      className="w-16 h-16 rounded-[18px] flex items-center justify-center text-[28px] border-2 border-white/80"
                      style={{ background: b.bg, boxShadow: `0 4px 16px ${b.glowColor}` }}
                    >
                      {b.icon}
                    </div>
                  ) : (
                    <div
                      className="w-[52px] h-[52px] rounded-[14px] flex items-center justify-center relative"
                      style={{ background: b.bg, filter: 'grayscale(1) opacity(0.35)' }}
                    >
                      <span className="text-sm">🔒</span>
                    </div>
                  )}
                  <p className={`text-center max-w-[64px] truncate ${
                    b.earned
                      ? 'text-[11px] font-heading font-bold text-foreground'
                      : 'text-[10px] font-heading font-semibold text-muted-foreground'
                  }`}>
                    {b.name}
                  </p>
                </motion.div>
              ))}
              {/* More badges pill */}
              <div className="shrink-0 flex items-center self-center">
                <span
                  className="inline-flex items-center gap-1 rounded-full px-3 py-1.5 text-xs font-heading font-bold cursor-pointer transition-all duration-[120ms] hover:bg-jungle-bright hover:text-white"
                  style={{ background: '#D8F3DC', color: '#40916C' }}
                >
                  🔒 3 more to unlock →
                </span>
              </div>
            </div>
          </motion.div>

        </div>
      </div>
    </div>
  );
}

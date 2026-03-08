import { motion } from 'framer-motion';
import { useEffect, useState, useCallback } from 'react';
import EcosystemViewer from '@/components/game/EcosystemViewer';
import { Leaf, ArrowRight, Clock, Bell, TreePine, Wind } from 'lucide-react';
import { Link } from 'react-router-dom';

// ── Inline mock data ──
const user = { name: 'Rohan', level: 3, levelTitle: 'Sprout', ecoPoints: 2180, streakDays: 14, rank: 4, treesPlanted: 7, co2Saved: 24, ecosystemHealth: 72 };

const missions = [
  { id: 1, title: 'Plant a Sapling', desc: 'Visit a local park and plant one native tree sapling', icon: '🌱', bg: 'linear-gradient(135deg,#52B788,#1B4332)', difficulty: 'easy' as const, time: '30 min', points: 50, progress: 0, status: 'available' as const },
  { id: 2, title: 'Segregate Waste', desc: 'Sort your household waste into recyclable and organic bins', icon: '♻️', bg: 'linear-gradient(135deg,#48CAE4,#0369A1)', difficulty: 'medium' as const, time: '20 min', points: 100, progress: 65, status: 'in_progress' as const },
  { id: 3, title: 'Bike to Campus', desc: 'Skip the car or bus and cycle to school today', icon: '🚲', bg: 'linear-gradient(135deg,#F4A261,#C2410C)', difficulty: 'hard' as const, time: '45 min', points: 200, progress: 0, status: 'available' as const },
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

const activityData = [
  { icon: '🌊', bg: 'hsl(210 100% 95%)', action: 'Completed Water Challenge', time: '2 hours ago', pts: '+100 pts' },
  { icon: '🏆', bg: 'hsl(45 100% 92%)', action: 'Reached Top 10 Leaderboard', time: 'Yesterday', pts: '+Badge' },
  { icon: '🌱', bg: 'hsl(140 49% 90%)', action: 'Planted 2 Trees', time: '2 days ago', pts: '+150 pts' },
  { icon: '📚', bg: 'hsl(270 100% 95%)', action: 'Completed Climate Quiz', time: '3 days ago', pts: '+30 pts' },
];

const badges = [
  { icon: '🌱', name: 'First Steps', bg: 'hsl(140 49% 90%)', earned: true },
  { icon: '🔥', name: 'On Fire', bg: 'hsl(45 100% 92%)', earned: true },
  { icon: '💧', name: 'Water Guard', bg: 'hsl(210 100% 95%)', earned: true },
  { icon: '🌳', name: 'Tree Hugger', bg: 'hsl(140 49% 90%)', earned: false },
  { icon: '🏆', name: 'Top 10', bg: 'hsl(45 100% 92%)', earned: false },
  { icon: '♻️', name: 'Recycler', bg: 'hsl(140 60% 96%)', earned: false },
];

const statCards = [
  { emoji: '🌿', label: 'ECOPOINTS', value: 2180, trend: '↑ +320 this week', borderClass: 'border-l-jungle-bright', format: (n: number) => n.toLocaleString() },
  { emoji: '🔥', label: 'DAY STREAK', value: 14, trend: '🏆 Personal best!', borderClass: 'border-l-sun-gold', format: (n: number) => String(n) },
  { emoji: '⭐', label: 'LEVEL', value: 3, trend: 'Sprout rank', borderClass: 'border-l-sky-blue', format: (n: number) => `Lv ${n}` },
  { emoji: '🏆', label: 'RANK', value: 4, trend: '↑ 3 places this week', borderClass: 'border-l-lavender', format: (n: number) => `#${n}` },
];

// ── Animations ──
const stagger = { hidden: {}, visible: { transition: { staggerChildren: 0.08 } } };
const fadeUp = { hidden: { opacity: 0, y: 20 }, visible: { opacity: 1, y: 0, transition: { duration: 0.5 } } };

// ── Counter Hook ──
function useCountUp(target: number, duration = 1200) {
  const [val, setVal] = useState(0);
  useEffect(() => {
    const start = performance.now();
    const tick = (now: number) => {
      const p = Math.min((now - start) / duration, 1);
      setVal(Math.round(target * p));
      if (p < 1) requestAnimationFrame(tick);
    };
    requestAnimationFrame(tick);
  }, [target, duration]);
  return val;
}

// ── Sub-components ──

function Fireflies() {
  return (
    <div className="absolute inset-0 pointer-events-none overflow-hidden">
      {Array.from({ length: 8 }).map((_, i) => (
        <div
          key={i}
          className="absolute w-1 h-1 rounded-full animate-firefly"
          style={{
            background: 'hsl(50 100% 70%)',
            boxShadow: '0 0 6px 2px hsl(50 100% 70% / 0.6)',
            left: `${15 + Math.random() * 70}%`,
            top: `${10 + Math.random() * 60}%`,
            animationDelay: `${i * 0.5}s`,
            animationDuration: `${2.5 + Math.random() * 1.5}s`,
          }}
        />
      ))}
    </div>
  );
}

function CountUpStat({ card }: { card: typeof statCards[0] }) {
  const count = useCountUp(card.value);
  return (
    <motion.div
      variants={fadeUp}
      whileHover={{ y: -4, boxShadow: 'var(--shadow-hover)' }}
      whileTap={{ scale: 0.97 }}
      className={`relative overflow-hidden rounded-[18px] bg-card shadow-card p-4 border-l-4 ${card.borderClass}`}
    >
      <span className="absolute top-2 right-3 text-[28px] opacity-[0.12] pointer-events-none">{card.emoji}</span>
      <p className="font-label text-muted-foreground">{card.label}</p>
      <p className="font-heading font-black text-[28px] text-foreground leading-tight mt-1">{card.format(count)}</p>
      <p className="text-xs text-muted-foreground mt-1 font-body">{card.trend}</p>
    </motion.div>
  );
}

function MissionCard({ m, i }: { m: typeof missions[0]; i: number }) {
  const diffColors = { easy: 'bg-jungle-pale text-jungle-bright', medium: 'bg-sun-gold/10 text-sun-gold', hard: 'bg-coral/10 text-coral' };

  return (
    <motion.div
      variants={fadeUp}
      whileHover={{ y: -5, boxShadow: 'var(--shadow-hover)' }}
      whileTap={{ scale: 0.97 }}
      className="rounded-[20px] bg-card shadow-card border border-border/30 overflow-hidden hover:border-jungle-light/50 transition-colors"
    >
      {/* Gradient banner */}
      <div className="h-[72px] flex items-center justify-center relative" style={{ background: m.bg }}>
        <span className="text-3xl animate-bob" style={{ animationDelay: `${i * 0.3}s` }}>{m.icon}</span>
        <span className={`absolute top-2 right-2 text-[10px] font-heading font-bold px-2 py-0.5 rounded-full ${
          m.status === 'in_progress' ? 'bg-sun-gold/90 text-foreground' : 'bg-card text-jungle-bright'
        }`}>
          {m.status === 'in_progress' ? 'In Progress' : 'Available'}
        </span>
      </div>

      {/* Body */}
      <div className="p-4 space-y-3">
        <h4 className="font-heading font-bold text-sm text-foreground">{m.title}</h4>
        <p className="text-xs text-muted-foreground line-clamp-2 font-body">{m.desc}</p>
        <div className="flex gap-2">
          <span className={`text-[10px] font-heading font-bold px-2 py-0.5 rounded-full ${diffColors[m.difficulty]}`}>{m.difficulty}</span>
          <span className="text-[10px] font-heading font-bold px-2 py-0.5 rounded-full bg-sky-blue/10 text-sky-blue flex items-center gap-1">
            <Clock className="w-2.5 h-2.5" /> {m.time}
          </span>
        </div>
        <div className="flex items-center justify-between pt-1">
          <span className="text-xs font-heading font-black text-jungle-bright flex items-center gap-1">
            <Leaf className="w-3 h-3" /> +{m.points} pts
          </span>
          <Link to="/missions">
            <button className="text-xs font-heading font-bold text-primary-foreground bg-primary hover:bg-jungle-mid px-3 py-1.5 rounded-[10px] transition-colors hover:scale-[1.04] active:scale-95">
              {m.status === 'in_progress' ? 'Continue' : 'Accept'}
            </button>
          </Link>
        </div>
        {m.status === 'in_progress' && (
          <div className="h-1.5 rounded-full bg-muted overflow-hidden">
            <motion.div className="h-full rounded-full bg-jungle-bright" initial={{ width: 0 }} animate={{ width: `${m.progress}%` }} transition={{ duration: 1, delay: 0.5 }} />
          </div>
        )}
      </div>
    </motion.div>
  );
}

function WeeklyChartSection() {
  const maxVal = Math.max(...weeklyChart.map(d => d.value));
  return (
    <motion.div variants={fadeUp} className="rounded-[20px] bg-card shadow-card p-5">
      <div className="flex items-center justify-between mb-4">
        <h3 className="font-heading font-bold text-foreground">📈 Weekly EcoPoints</h3>
        <span className="font-heading font-black text-jungle-bright text-sm">+395 pts</span>
      </div>
      <div className="flex items-end gap-2 h-[120px]">
        {weeklyChart.map((d, i) => {
          const h = (d.value / maxVal) * 100;
          return (
            <div key={d.day} className="flex-1 flex flex-col items-center gap-1">
              <div
                className={`w-full rounded-t-lg ${d.isToday ? 'bg-gradient-to-t from-primary to-jungle-light shadow-[0_0_12px_hsl(var(--jungle-bright)/0.4)]' : 'bg-jungle-pale'}`}
                style={{ '--bar-height': `${h}%`, height: `${h}%`, animation: `growBar 0.8s ease-out ${i * 0.06}s both` } as React.CSSProperties}
              />
              <span className="text-[10px] text-muted-foreground font-body">{d.day}</span>
            </div>
          );
        })}
      </div>
    </motion.div>
  );
}

function ActivityFeed() {
  return (
    <motion.div variants={fadeUp} className="rounded-[20px] bg-card shadow-card p-5">
      <h3 className="font-heading font-bold text-foreground mb-4">⚡ Recent Activity</h3>
      <div className="space-y-0">
        {activityData.map((a, i) => (
          <div key={i} className={`flex items-center gap-3 py-2.5 hover:bg-jungle-pale/30 rounded-lg px-2 transition-colors ${i < activityData.length - 1 ? 'border-b border-border/40' : ''}`}>
            <div className="w-10 h-10 rounded-full flex items-center justify-center text-lg shrink-0" style={{ background: a.bg }}>{a.icon}</div>
            <div className="flex-1 min-w-0">
              <p className="text-[13px] font-heading font-bold text-foreground truncate">{a.action}</p>
              <p className="text-[11px] text-muted-foreground font-body">{a.time}</p>
            </div>
            <span className="text-xs font-heading font-black text-jungle-bright shrink-0">{a.pts}</span>
          </div>
        ))}
      </div>
    </motion.div>
  );
}

function BadgeGallery() {
  return (
    <motion.div variants={fadeUp} className="rounded-[20px] bg-card shadow-card p-5">
      <div className="flex items-center justify-between mb-4">
        <h3 className="font-heading font-bold text-foreground">🏅 Your Badges</h3>
        <Link to="/profile" className="text-sm text-primary font-heading font-semibold hover:underline flex items-center gap-1">View All <ArrowRight className="w-3.5 h-3.5" /></Link>
      </div>
      <div className="flex gap-3 overflow-x-auto pb-2 scrollbar-hide">
        {badges.map((b, i) => (
          <motion.div
            key={i}
            whileHover={b.earned ? { scale: 1.12, rotate: -3, boxShadow: 'var(--shadow-hover)' } : {}}
            className={`shrink-0 flex flex-col items-center gap-1.5 ${!b.earned ? 'grayscale opacity-40' : ''}`}
          >
            <div className="w-14 h-14 rounded-2xl flex items-center justify-center text-2xl shadow-card relative" style={{ background: b.bg }}>
              {b.icon}
              {!b.earned && <span className="absolute inset-0 flex items-center justify-center text-sm">🔒</span>}
            </div>
            <span className="text-[10px] text-muted-foreground font-body text-center max-w-[64px] truncate">{b.name}</span>
          </motion.div>
        ))}
      </div>
    </motion.div>
  );
}

function MiniLeaderboard() {
  const medals = ['🥇', '🥈', '🥉'];
  return (
    <motion.div variants={fadeUp} className="rounded-[20px] bg-card shadow-card p-5">
      <div className="flex items-center justify-between mb-4">
        <h3 className="font-heading font-bold text-foreground">🏆 Class Leaderboard</h3>
        <Link to="/leaderboard" className="text-sm text-primary font-heading font-semibold hover:underline flex items-center gap-1">View All <ArrowRight className="w-3.5 h-3.5" /></Link>
      </div>
      <div className="space-y-1">
        {leaderboard.map((r) => (
          <div
            key={r.rank}
            className={`flex items-center gap-3 py-2 px-2 rounded-lg transition-colors hover:bg-jungle-pale/30 ${
              r.isYou ? 'bg-jungle-pale/40 border-l-[3px] border-l-primary' : ''
            }`}
          >
            <span className="w-6 text-center text-sm font-heading font-bold">
              {r.rank <= 3 ? medals[r.rank - 1] : r.rank}
            </span>
            <div className="w-8 h-8 rounded-lg bg-jungle-pale flex items-center justify-center text-sm">{r.avatar}</div>
            <div className="flex-1 min-w-0">
              <p className="text-sm font-heading font-bold text-foreground truncate">{r.name}</p>
              <p className="text-[11px] text-muted-foreground font-body truncate">{r.school}</p>
            </div>
            <span className="font-heading font-black text-sm text-jungle-bright">{r.points.toLocaleString()}</span>
            <span className={`text-xs font-heading font-bold ${r.change.startsWith('+') ? 'text-jungle-bright' : r.change.startsWith('-') ? 'text-coral' : 'text-muted-foreground'}`}>
              {r.change.startsWith('+') ? `↑${r.change}` : r.change.startsWith('-') ? `↓${r.change}` : r.change}
            </span>
          </div>
        ))}
      </div>
    </motion.div>
  );
}

// ── Main Dashboard ──
export default function DashboardPage() {
  return (
    <motion.div className="p-4 md:p-7 max-w-[1400px] mx-auto space-y-6" variants={stagger} initial="hidden" animate="visible">

      {/* Greeting Bar */}
      <motion.div variants={fadeUp} className="flex items-center justify-between flex-wrap gap-3">
        <div>
          <h1 className="font-heading font-black text-2xl md:text-[26px] text-foreground">
            Good morning, <span className="text-primary">{user.name}</span>! 🌞
          </h1>
          <p className="text-sm text-muted-foreground font-body mt-1">
            You're on a {user.streakDays}-day streak — don't break it today 🔥
          </p>
        </div>
        <div className="bg-card rounded-full shadow-card px-4 py-2 text-sm font-heading font-semibold text-foreground flex items-center gap-2">
          📅 Sun, 8 Mar 2026
        </div>
      </motion.div>

      {/* Two-column layout */}
      <div className="grid grid-cols-1 lg:grid-cols-[380px_1fr] gap-6">

        {/* ─── Left Column ─── */}
        <div className="space-y-5">
          {/* Ecosystem Card */}
          <motion.div variants={fadeUp} className="rounded-3xl bg-bg-dark-panel shadow-float overflow-hidden">
            <div className="relative">
              <EcosystemViewer ecoPoints={user.ecoPoints} className="aspect-[4/3]" />
              <Fireflies />
            </div>
            <div className="p-4 space-y-3">
              <div className="flex items-center justify-between">
                <h2 className="font-heading font-bold text-base" style={{ color: 'hsl(var(--bg-elevated))' }}>🌳 Your Ecosystem</h2>
                <span className="text-xs font-heading font-bold px-2.5 py-1 rounded-full" style={{ background: 'hsl(var(--jungle-mid) / 0.4)', color: 'hsl(var(--jungle-light))' }}>
                  🌿 {user.levelTitle} · Lv {user.level}
                </span>
              </div>
              <div>
                <p className="font-label" style={{ color: 'hsl(var(--jungle-light) / 0.7)' }}>ECOSYSTEM HEALTH</p>
                <div className="mt-1.5 h-3 rounded-full overflow-hidden" style={{ background: 'hsl(0 0% 100% / 0.12)' }}>
                  <motion.div
                    className="h-full rounded-full"
                    style={{ background: 'linear-gradient(90deg, hsl(var(--jungle-bright)), hsl(var(--jungle-light)))', boxShadow: '0 0 10px hsl(var(--jungle-bright) / 0.5)' }}
                    initial={{ width: 0 }}
                    animate={{ width: `${user.ecosystemHealth}%` }}
                    transition={{ duration: 1.2, ease: 'easeOut' }}
                  />
                </div>
              </div>
              <div className="grid grid-cols-2 gap-2">
                {[
                  { icon: <TreePine className="w-3.5 h-3.5" />, text: `${user.treesPlanted} Trees Planted` },
                  { icon: <Wind className="w-3.5 h-3.5" />, text: `${user.co2Saved}kg CO₂ Saved` },
                ].map((s, i) => (
                  <div key={i} className="flex items-center gap-1.5 rounded-xl px-3 py-2 text-xs font-heading font-bold" style={{ background: 'hsl(0 0% 100% / 0.08)', color: 'hsl(var(--jungle-light))' }}>
                    {s.icon} {s.text}
                  </div>
                ))}
              </div>
            </div>
          </motion.div>

          {/* Mini Leaderboard */}
          <MiniLeaderboard />
        </div>

        {/* ─── Right Column ─── */}
        <div className="space-y-5">

          {/* Stat Cards */}
          <motion.div variants={stagger} className="grid grid-cols-2 md:grid-cols-4 gap-3">
            {statCards.map((card, i) => (
              <CountUpStat key={i} card={card} />
            ))}
          </motion.div>

          {/* Seasonal Challenge Banner */}
          <motion.div
            variants={fadeUp}
            className="relative overflow-hidden rounded-[20px] p-5 shadow-float"
            style={{ background: 'linear-gradient(135deg, hsl(var(--jungle-deep)), hsl(var(--jungle-mid)), hsl(var(--primary)))' }}
          >
            <span className="absolute right-6 top-1/2 -translate-y-1/2 text-6xl opacity-10 animate-rotate-slow pointer-events-none">🌿</span>
            <div className="flex items-center gap-4 flex-wrap">
              <span className="text-4xl">🌧️</span>
              <div className="flex-1 min-w-0">
                <p className="font-label" style={{ color: 'hsl(var(--jungle-light))' }}>🏆 SEASONAL CHALLENGE · ACTIVE</p>
                <h3 className="font-heading font-bold text-base text-primary-foreground mt-0.5">Monsoon Water Save Challenge</h3>
                <div className="mt-2 h-2 rounded-full overflow-hidden" style={{ background: 'hsl(0 0% 100% / 0.15)' }}>
                  <motion.div className="h-full rounded-full bg-primary-foreground" initial={{ width: 0 }} animate={{ width: '58%' }} transition={{ duration: 1, delay: 0.4 }} />
                </div>
                <p className="text-[11px] mt-1.5 font-body" style={{ color: 'hsl(var(--jungle-pale) / 0.8)' }}>
                  School progress: 580 / 1000 liters · 1.5× EcoPoints active
                </p>
              </div>
              <div className="text-center shrink-0">
                <p className="font-heading font-black text-[22px] text-primary-foreground">5d</p>
                <p className="font-label text-primary-foreground/60">remaining</p>
              </div>
            </div>
          </motion.div>

          {/* Today's Quests */}
          <motion.div variants={fadeUp}>
            <div className="flex items-center justify-between mb-3">
              <h2 className="font-heading font-bold text-foreground">🎯 Today's Quests</h2>
              <Link to="/missions" className="text-sm text-primary font-heading font-semibold hover:underline flex items-center gap-1">
                View All Missions <ArrowRight className="w-3.5 h-3.5" />
              </Link>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {missions.map((m, i) => (
                <MissionCard key={m.id} m={m} i={i} />
              ))}
            </div>
          </motion.div>

          {/* Weekly Chart + Activity */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <WeeklyChartSection />
            <ActivityFeed />
          </div>

          {/* Badge Gallery */}
          <BadgeGallery />
        </div>
      </div>
    </motion.div>
  );
}

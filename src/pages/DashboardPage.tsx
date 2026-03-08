import { motion } from 'framer-motion';
import { Area, AreaChart, ResponsiveContainer, Tooltip, XAxis, YAxis } from 'recharts';
import EcosystemViewer from '@/components/game/EcosystemViewer';
import { EcoPointsBadge, StreakFlame, RankBadge, StatCard, BadgeCard, ProgressRing } from '@/components/game/GameUI';
import { MOCK_USER, MOCK_MISSIONS, MOCK_BADGES, WEEKLY_POINTS } from '@/lib/mock-data';
import { getLevelForPoints } from '@/lib/types';
import { Flame, Star, Trophy, Leaf, Target, ArrowRight, Clock, Zap, TreePine, Wind } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Link } from 'react-router-dom';

const stagger = { hidden: {}, visible: { transition: { staggerChildren: 0.08 } } };
const fadeUp = { hidden: { opacity: 0, y: 20 }, visible: { opacity: 1, y: 0, transition: { duration: 0.5 } } };

export default function DashboardPage() {
  const user = MOCK_USER;
  const levelInfo = getLevelForPoints(user.eco_points);
  const dailyMissions = MOCK_MISSIONS.slice(0, 3);
  const completedToday = 1;
  const dailyGoal = user.daily_goal;

  return (
    <motion.div className="p-4 md:p-6 max-w-7xl mx-auto space-y-6" variants={stagger} initial="hidden" animate="visible">
      {/* Welcome header with daily goal */}
      <motion.div variants={fadeUp} className="flex items-center justify-between">
        <div>
          <h1 className="font-display font-bold text-2xl md:text-3xl text-foreground">
            Welcome back, <span className="text-primary">{user.full_name.split(' ')[0]}</span> 👋
          </h1>
          <p className="text-sm text-muted-foreground mt-1">Let's make today count for the planet</p>
        </div>
        <div className="hidden md:flex items-center gap-3">
          <ProgressRing percent={Math.round((completedToday / dailyGoal) * 100)} size={52} strokeWidth={5} />
          <div>
            <p className="text-xs text-muted-foreground font-heading font-semibold uppercase tracking-wider">Daily Goal</p>
            <p className="font-mono-stat font-bold text-primary text-lg">{completedToday}/{dailyGoal}</p>
          </div>
        </div>
      </motion.div>

      <div className="grid grid-cols-1 lg:grid-cols-5 gap-6">
        {/* Left Panel — Ecosystem Viewer */}
        <motion.div variants={fadeUp} className="lg:col-span-2 space-y-4">
          <div className="rounded-3xl bg-bg-dark-panel p-4 shadow-float overflow-hidden">
            <EcosystemViewer ecoPoints={user.eco_points} className="aspect-video" />
            <div className="mt-4 px-2">
              <h2 className="font-heading font-bold text-lg" style={{ color: 'hsl(var(--bg-elevated))' }}>Your Forest</h2>
              {/* Health bar */}
              <div className="mt-2 h-3 rounded-full bg-jungle-mid/30 overflow-hidden">
                <motion.div
                  className="h-full rounded-full bg-jungle-light"
                  initial={{ width: 0 }}
                  animate={{ width: `${levelInfo.progress * 100}%` }}
                  transition={{ duration: 1.2, ease: 'easeOut' }}
                />
              </div>
              <p className="text-xs mt-1.5 font-heading" style={{ color: 'hsl(var(--jungle-light))' }}>
                {Math.round(levelInfo.progress * 100)}% to next level
              </p>
              <div className="flex items-center justify-center mt-3">
                <div className="inline-flex items-center gap-2 rounded-full bg-jungle-mid/30 px-3 py-1 text-sm font-heading font-bold" style={{ color: 'hsl(var(--jungle-pale))' }}>
                  {levelInfo.title} — Level {levelInfo.level}
                </div>
              </div>
              <div className="flex items-center justify-around mt-3 text-xs font-heading" style={{ color: 'hsl(var(--jungle-light))' }}>
                <span className="flex items-center gap-1"><TreePine className="w-3.5 h-3.5" /> 3 Trees Planted</span>
                <span className="flex items-center gap-1"><Wind className="w-3.5 h-3.5" /> 12kg CO₂ Saved</span>
              </div>
            </div>
          </div>

          {/* Seasonal Challenge Card */}
          <motion.div variants={fadeUp} className="rounded-2xl bg-gradient-to-br from-sun-gold/10 to-coral/10 border border-sun-gold/20 p-5 shadow-card">
            <div className="flex items-center justify-between mb-3">
              <div className="flex items-center gap-2">
                <span className="text-xl">🌧️</span>
                <h3 className="font-heading font-bold text-foreground text-sm">Monsoon Water Challenge</h3>
              </div>
              <span className="bg-sun-gold/20 text-sun-gold text-xs font-heading font-bold px-2.5 py-1 rounded-full flex items-center gap-1">
                <Zap className="w-3 h-3" /> 1.5x XP
              </span>
            </div>
            <p className="text-xs text-muted-foreground mb-3">Complete water conservation missions for bonus rewards</p>
            <div className="h-2 rounded-full bg-background overflow-hidden mb-2">
              <motion.div className="h-full rounded-full bg-sun-gold" initial={{ width: 0 }} animate={{ width: '35%' }} transition={{ duration: 1, delay: 0.5 }} />
            </div>
            <div className="flex items-center justify-between text-xs text-muted-foreground">
              <span>7/20 missions</span>
              <span className="flex items-center gap-1"><Clock className="w-3 h-3" /> 5 days left</span>
            </div>
          </motion.div>
        </motion.div>

        {/* Right Panel */}
        <div className="lg:col-span-3 space-y-6">
          {/* Stats Row */}
          <motion.div variants={fadeUp} className="grid grid-cols-2 md:grid-cols-4 gap-3">
            <StatCard icon={<Leaf className="w-5 h-5 text-jungle-bright" />} label="EcoPoints" value={<EcoPointsBadge points={user.eco_points} size="sm" />} borderColor="border-l-jungle-bright" />
            <StatCard icon={<Flame className="w-5 h-5 text-sun-gold" />} label="Streak" value={<StreakFlame days={user.streak_days} />} borderColor="border-l-sun-gold" />
            <StatCard icon={<Star className="w-5 h-5 text-lavender" />} label="Level" value={<span className="font-mono-stat font-bold text-primary">{levelInfo.level}</span>} borderColor="border-l-lavender" />
            <StatCard icon={<Trophy className="w-5 h-5 text-sun-gold" />} label="Rank" value={<RankBadge rank={4} />} borderColor="border-l-sun-gold" />
          </motion.div>

          {/* Daily Missions */}
          <motion.div variants={fadeUp} className="rounded-2xl bg-card shadow-card p-5">
            <div className="flex items-center justify-between mb-4">
              <h2 className="font-heading font-bold text-foreground flex items-center gap-2">
                <Target className="w-5 h-5 text-primary" /> Today's Quests
              </h2>
              <Link to="/missions" className="text-sm text-primary font-heading font-semibold hover:underline flex items-center gap-1">
                View All <ArrowRight className="w-3.5 h-3.5" />
              </Link>
            </div>
            <div className="space-y-3">
              {dailyMissions.map((m, i) => (
                <Link key={m.id} to="/missions">
                  <motion.div
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: i * 0.1 }}
                    whileHover={{ y: -2, boxShadow: 'var(--shadow-hover)' }}
                    whileTap={{ scale: 0.97 }}
                    className="flex items-center justify-between p-3 rounded-xl border border-border/50 bg-card hover:border-primary/30 transition-all cursor-pointer"
                  >
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-xl bg-jungle-pale flex items-center justify-center text-xl">{m.icon_url}</div>
                      <div>
                        <p className="font-heading font-bold text-sm text-foreground">{m.title}</p>
                        <div className="flex items-center gap-2 mt-0.5">
                          <span className={`text-xs px-2 py-0.5 rounded-full font-medium ${
                            m.difficulty === 'easy' ? 'bg-jungle-pale text-jungle-bright' :
                            m.difficulty === 'medium' ? 'bg-sun-gold/10 text-sun-gold' :
                            'bg-coral/10 text-coral'
                          }`}>{m.difficulty}</span>
                        </div>
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      <span className="bg-jungle-pale text-jungle-bright text-xs font-mono-stat font-bold px-2 py-1 rounded-full flex items-center gap-1">
                        <Leaf className="w-3 h-3" /> {m.eco_points_reward}
                      </span>
                      <ArrowRight className="w-4 h-4 text-muted-foreground" />
                    </div>
                  </motion.div>
                </Link>
              ))}
            </div>
          </motion.div>

          {/* Weekly Chart + Activity */}
          <motion.div variants={fadeUp} className="grid grid-cols-1 md:grid-cols-5 gap-4">
            <div className="md:col-span-3 rounded-2xl bg-card shadow-card p-5">
              <h2 className="font-heading font-bold text-foreground mb-4">This Week's EcoPoints</h2>
              <ResponsiveContainer width="100%" height={160}>
                <AreaChart data={WEEKLY_POINTS}>
                  <defs>
                    <linearGradient id="greenFill" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="0%" stopColor="hsl(var(--jungle-bright))" stopOpacity={0.3} />
                      <stop offset="100%" stopColor="hsl(var(--jungle-bright))" stopOpacity={0} />
                    </linearGradient>
                  </defs>
                  <XAxis dataKey="day" axisLine={false} tickLine={false} tick={{ fill: 'hsl(var(--muted-foreground))', fontSize: 12 }} />
                  <YAxis hide />
                  <Tooltip
                    contentStyle={{ background: 'hsl(var(--card))', border: '1px solid hsl(var(--border))', borderRadius: '12px', color: 'hsl(var(--foreground))' }}
                    cursor={{ fill: 'hsl(var(--jungle-pale))' }}
                  />
                  <Area type="monotone" dataKey="points" stroke="hsl(var(--jungle-bright))" strokeWidth={2} fill="url(#greenFill)" />
                </AreaChart>
              </ResponsiveContainer>
            </div>
            <div className="md:col-span-2 rounded-2xl bg-card shadow-card p-5">
              <h2 className="font-heading font-bold text-foreground mb-4">Recent Activity</h2>
              <div className="space-y-3">
                {[
                  { icon: '🌱', text: 'Planted a native tree', time: '2h ago' },
                  { icon: '📝', text: 'Completed climate quiz', time: '5h ago' },
                  { icon: '🔥', text: '12-day streak!', time: '1d ago' },
                ].map((a, i) => (
                  <div key={i} className="flex items-start gap-3">
                    <div className="w-8 h-8 rounded-full bg-jungle-pale flex items-center justify-center text-sm shrink-0">{a.icon}</div>
                    <div className="border-l-2 border-dashed border-border pl-3 pb-3">
                      <p className="text-sm font-heading font-semibold text-foreground">{a.text}</p>
                      <p className="text-xs text-muted-foreground">{a.time}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </motion.div>

          {/* Badges */}
          <motion.div variants={fadeUp} className="rounded-2xl bg-card shadow-card p-5">
            <div className="flex items-center justify-between mb-4">
              <h2 className="font-heading font-bold text-foreground">Recent Badges</h2>
              <Link to="/profile" className="text-sm text-primary font-heading font-semibold hover:underline">View All</Link>
            </div>
            <div className="flex gap-3 overflow-x-auto pb-2">
              {MOCK_BADGES.slice(0, 8).map(b => (
                <div key={b.id} className="shrink-0">
                  <BadgeCard badge={b} />
                </div>
              ))}
            </div>
          </motion.div>
        </div>
      </div>
    </motion.div>
  );
}

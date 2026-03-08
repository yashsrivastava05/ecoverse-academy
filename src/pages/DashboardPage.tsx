import { motion } from 'framer-motion';
import { BarChart, Bar, XAxis, YAxis, ResponsiveContainer, Tooltip, Area, AreaChart } from 'recharts';
import EcosystemViewer from '@/components/game/EcosystemViewer';
import { EcoPointsBadge, StreakFlame, LevelBadge, RankBadge, StatCard, BadgeCard, ProgressRing } from '@/components/game/GameUI';
import { MOCK_USER, MOCK_MISSIONS, MOCK_BADGES, WEEKLY_POINTS } from '@/lib/mock-data';
import { getLevelForPoints } from '@/lib/types';
import { Flame, Star, Trophy, Leaf, Target, ArrowRight } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Link } from 'react-router-dom';

const stagger = { hidden: {}, visible: { transition: { staggerChildren: 0.08 } } };
const fadeUp = { hidden: { opacity: 0, y: 20 }, visible: { opacity: 1, y: 0 } };

export default function DashboardPage() {
  const user = MOCK_USER;
  const levelInfo = getLevelForPoints(user.eco_points);
  const dailyMissions = MOCK_MISSIONS.slice(0, 3);

  return (
    <motion.div className="p-4 md:p-6 max-w-7xl mx-auto space-y-6" variants={stagger} initial="hidden" animate="visible">
      <motion.h1 variants={fadeUp} className="font-display font-bold text-2xl text-jungle-deep">
        Welcome back, <span className="text-primary">{user.full_name.split(' ')[0]}</span> 👋
      </motion.h1>

      <div className="grid grid-cols-1 lg:grid-cols-5 gap-6">
        {/* Ecosystem Viewer — Left panel */}
        <motion.div variants={fadeUp} className="lg:col-span-2 space-y-4">
          <div className="rounded-3xl bg-bg-dark-panel p-4 shadow-float">
            <EcosystemViewer ecoPoints={user.eco_points} className="aspect-video" />
            <div className="mt-4 px-2">
              <h2 className="font-heading font-bold text-lg" style={{ color: 'hsl(var(--bg-elevated))' }}>Your Forest</h2>
              {/* Health bar */}
              <div className="mt-2 h-3 rounded-full bg-jungle-mid/30 overflow-hidden">
                <motion.div
                  className="h-full rounded-full bg-jungle-light"
                  initial={{ width: 0 }}
                  animate={{ width: `${levelInfo.progress * 100}%` }}
                  transition={{ duration: 1, ease: 'easeOut' }}
                />
              </div>
              <div className="flex items-center justify-center mt-3">
                <div className="inline-flex items-center gap-2 rounded-full bg-jungle-mid/30 px-3 py-1 text-sm font-heading font-bold" style={{ color: 'hsl(var(--jungle-pale))' }}>
                  {levelInfo.title} — Level {levelInfo.level}
                </div>
              </div>
              <div className="flex items-center justify-around mt-3 text-xs font-heading" style={{ color: 'hsl(var(--jungle-light))' }}>
                <span>🌳 3 Trees Planted</span>
                <span>💨 12kg CO₂ Saved</span>
              </div>
            </div>
          </div>
        </motion.div>

        {/* Right panel */}
        <div className="lg:col-span-3 space-y-6">
          {/* Stats row */}
          <motion.div variants={fadeUp} className="grid grid-cols-2 md:grid-cols-4 gap-3">
            <StatCard icon={<Leaf className="w-5 h-5 text-jungle-bright" />} label="EcoPoints" value={<EcoPointsBadge points={user.eco_points} size="sm" />} borderColor="border-l-jungle-bright" />
            <StatCard icon={<Flame className="w-5 h-5 text-sun-gold" />} label="Streak" value={<StreakFlame days={user.streak_days} />} borderColor="border-l-sun-gold" />
            <StatCard icon={<Star className="w-5 h-5 text-lavender" />} label="Level" value={<span className="font-mono-stat text-jungle-bright">{levelInfo.level}</span>} borderColor="border-l-lavender" />
            <StatCard icon={<Trophy className="w-5 h-5 text-sun-gold" />} label="Rank" value={<RankBadge rank={4} />} borderColor="border-l-sun-gold" />
          </motion.div>

          {/* Daily Missions */}
          <motion.div variants={fadeUp} className="rounded-2xl bg-card shadow-card p-5">
            <div className="flex items-center justify-between mb-4">
              <h2 className="font-heading font-bold text-foreground flex items-center gap-2">
                <Target className="w-5 h-5 text-primary" /> Today's Quests
              </h2>
              <Link to="/missions" className="text-sm text-primary font-heading font-semibold hover:underline">View All</Link>
            </div>
            <div className="space-y-3">
              {dailyMissions.map((m, i) => (
                <motion.div
                  key={m.id}
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
            <div className="grid grid-cols-3 md:grid-cols-5 gap-3">
              {MOCK_BADGES.slice(0, 5).map(b => (
                <BadgeCard key={b.id} badge={b} />
              ))}
            </div>
          </motion.div>
        </div>
      </div>
    </motion.div>
  );
}

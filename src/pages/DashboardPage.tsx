import { motion } from 'framer-motion';
import { BarChart, Bar, XAxis, YAxis, ResponsiveContainer, Tooltip } from 'recharts';
import EcosystemViewer from '@/components/game/EcosystemViewer';
import { EcoPointsBadge, StreakFlame, LevelBadge, RankBadge, StatCard, BadgeCard, ProgressRing } from '@/components/game/GameUI';
import { MOCK_USER, MOCK_MISSIONS, MOCK_BADGES, WEEKLY_POINTS } from '@/lib/mock-data';
import { getLevelForPoints } from '@/lib/types';
import { Flame, Star, Trophy, Leaf, Target, Clock } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Link } from 'react-router-dom';

export default function DashboardPage() {
  const user = MOCK_USER;
  const levelInfo = getLevelForPoints(user.eco_points);
  const dailyMissions = MOCK_MISSIONS.slice(0, 3);
  const earnedBadges = MOCK_BADGES.filter(b => b.earned);

  return (
    <div className="p-4 md:p-6 space-y-6">
      <motion.h1
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
        className="font-display font-bold text-2xl text-foreground"
      >
        Welcome back, <span className="text-primary">{user.full_name.split(' ')[0]}</span> 👋
      </motion.h1>

      <div className="grid grid-cols-1 lg:grid-cols-5 gap-6">
        {/* Ecosystem Viewer */}
        <div className="lg:col-span-2 space-y-4">
          <div className="rounded-2xl border border-border bg-card/60 p-4">
            <div className="flex items-center justify-between mb-3">
              <h2 className="font-heading font-bold text-foreground">Your Ecosystem</h2>
              <LevelBadge level={levelInfo.level} title={levelInfo.title} />
            </div>
            <EcosystemViewer ecoPoints={user.eco_points} className="aspect-video" />
            <div className="flex items-center justify-center gap-3 mt-4">
              <ProgressRing progress={levelInfo.progress} size={50} strokeWidth={3}>
                <span className="text-xs font-mono-stat text-primary">{Math.round(levelInfo.progress * 100)}%</span>
              </ProgressRing>
              <div>
                <p className="text-xs text-muted-foreground">Next level</p>
                <p className="text-sm font-heading font-bold text-foreground">
                  {levelInfo.nextLevel ? levelInfo.nextLevel.title : 'Max Level!'}
                </p>
                {levelInfo.nextLevel && (
                  <p className="text-xs text-muted-foreground">
                    {levelInfo.nextLevel.points - user.eco_points} pts to go
                  </p>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* Right panel */}
        <div className="lg:col-span-3 space-y-6">
          {/* Stats row */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
            <StatCard icon={<Leaf className="w-5 h-5 text-primary" />} label="EcoPoints" value={<EcoPointsBadge points={user.eco_points} size="sm" />} />
            <StatCard icon={<Flame className="w-5 h-5 text-amber-sun" />} label="Streak" value={<StreakFlame days={user.streak_days} />} />
            <StatCard icon={<Star className="w-5 h-5 text-primary" />} label="Level" value={<span className="font-mono-stat text-primary">{levelInfo.level}</span>} />
            <StatCard icon={<Trophy className="w-5 h-5 text-amber-sun" />} label="Rank" value={<RankBadge rank={4} />} />
          </div>

          {/* Daily Missions */}
          <div className="rounded-2xl border border-border bg-card/60 p-4">
            <div className="flex items-center justify-between mb-4">
              <h2 className="font-heading font-bold text-foreground flex items-center gap-2">
                <Target className="w-5 h-5 text-primary" /> Daily Missions
              </h2>
              <Link to="/missions" className="text-sm text-primary hover:underline">View All</Link>
            </div>
            <div className="space-y-3">
              {dailyMissions.map((m, i) => (
                <motion.div
                  key={m.id}
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: i * 0.1 }}
                  className="flex items-center justify-between p-3 rounded-xl border border-border bg-card/40 hover:border-primary/30 transition-all group"
                >
                  <div className="flex items-center gap-3">
                    <span className="text-2xl">{m.icon_url}</span>
                    <div>
                      <p className="font-heading font-bold text-sm text-foreground">{m.title}</p>
                      <div className="flex items-center gap-2 mt-0.5">
                        <span className={`text-xs px-2 py-0.5 rounded-full border ${
                          m.difficulty === 'easy' ? 'border-primary/30 text-primary' :
                          m.difficulty === 'medium' ? 'border-amber-sun/30 text-amber-sun' :
                          'border-coral-bloom/30 text-coral-bloom'
                        }`}>{m.difficulty}</span>
                        <span className="text-xs text-muted-foreground flex items-center gap-1">
                          <Leaf className="w-3 h-3" /> {m.eco_points_reward}
                        </span>
                      </div>
                    </div>
                  </div>
                  <Button size="sm" variant="outline" className="border-primary/30 text-primary hover:bg-accent group-hover:glow-sm">Start</Button>
                </motion.div>
              ))}
            </div>
          </div>

          {/* Weekly Chart */}
          <div className="rounded-2xl border border-border bg-card/60 p-4">
            <h2 className="font-heading font-bold text-foreground mb-4">This Week's EcoPoints</h2>
            <ResponsiveContainer width="100%" height={160}>
              <BarChart data={WEEKLY_POINTS}>
                <XAxis dataKey="day" axisLine={false} tickLine={false} tick={{ fill: 'hsl(210 10% 60%)', fontSize: 12 }} />
                <YAxis hide />
                <Tooltip
                  contentStyle={{ background: 'hsl(215 50% 8%)', border: '1px solid hsl(215 30% 16%)', borderRadius: '12px', color: 'white' }}
                  cursor={{ fill: 'hsl(153 100% 50% / 0.05)' }}
                />
                <Bar dataKey="points" fill="hsl(153 100% 50%)" radius={[6, 6, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>

          {/* Badges */}
          <div className="rounded-2xl border border-border bg-card/60 p-4">
            <div className="flex items-center justify-between mb-4">
              <h2 className="font-heading font-bold text-foreground">Recent Badges</h2>
              <Link to="/profile" className="text-sm text-primary hover:underline">View All</Link>
            </div>
            <div className="grid grid-cols-3 md:grid-cols-5 gap-3">
              {MOCK_BADGES.slice(0, 5).map(b => (
                <BadgeCard key={b.id} badge={b} />
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

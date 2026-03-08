import { motion } from 'framer-motion';
import { MOCK_USER, MOCK_BADGES, MOCK_SCHOOLS } from '@/lib/mock-data';
import { getLevelForPoints } from '@/lib/types';
import EcosystemViewer from '@/components/game/EcosystemViewer';
import { EcoPointsBadge, StreakFlame, LevelBadge, ProgressRing, BadgeCard } from '@/components/game/GameUI';
import { Target, BookOpen, Flame, Award, Leaf } from 'lucide-react';

export default function ProfilePage() {
  const user = MOCK_USER;
  const levelInfo = getLevelForPoints(user.eco_points);
  const school = MOCK_SCHOOLS.find(s => s.id === user.school_id);

  return (
    <div className="p-4 md:p-6 space-y-6 max-w-3xl mx-auto">
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="rounded-2xl border border-border bg-card/60 p-6 text-center"
      >
        <div className="w-20 h-20 mx-auto rounded-full bg-accent border-2 border-primary glow-md flex items-center justify-center text-3xl font-bold text-primary mb-4">
          {user.full_name.charAt(0)}
        </div>
        <h1 className="font-display font-bold text-2xl text-foreground">{user.full_name}</h1>
        <p className="text-sm text-muted-foreground">{school?.name} · {school?.city}</p>
        <div className="flex items-center justify-center gap-3 mt-4">
          <LevelBadge level={levelInfo.level} title={levelInfo.title} />
          <EcoPointsBadge points={user.eco_points} size="sm" />
        </div>
      </motion.div>

      {/* Ecosystem mini-view */}
      <div className="rounded-2xl border border-border bg-card/60 p-4">
        <h2 className="font-heading font-bold text-foreground mb-3">Your Ecosystem</h2>
        <EcosystemViewer ecoPoints={user.eco_points} className="aspect-[2/1]" />
        <div className="flex items-center justify-center gap-3 mt-4">
          <ProgressRing progress={levelInfo.progress} size={45} strokeWidth={3}>
            <span className="text-[10px] font-mono-stat text-primary">{Math.round(levelInfo.progress * 100)}%</span>
          </ProgressRing>
          <p className="text-sm text-muted-foreground">
            {levelInfo.nextLevel ? `${levelInfo.nextLevel.points - user.eco_points} pts to ${levelInfo.nextLevel.title}` : 'Max Level!'}
          </p>
        </div>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
        {[
          { icon: <Leaf className="w-5 h-5 text-primary" />, label: 'EcoPoints', value: user.eco_points.toLocaleString() },
          { icon: <Target className="w-5 h-5 text-primary" />, label: 'Missions', value: '18' },
          { icon: <Flame className="w-5 h-5 text-amber-sun" />, label: 'Streak', value: `${user.streak_days} days` },
          { icon: <Award className="w-5 h-5 text-amber-sun" />, label: 'Badges', value: String(MOCK_BADGES.filter(b => b.earned).length) },
        ].map((s, i) => (
          <motion.div
            key={i}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.1 }}
            className="rounded-xl border border-border bg-card/60 p-4 text-center"
          >
            <div className="flex justify-center mb-2">{s.icon}</div>
            <p className="font-mono-stat font-bold text-foreground">{s.value}</p>
            <p className="text-xs text-muted-foreground uppercase tracking-wider font-display">{s.label}</p>
          </motion.div>
        ))}
      </div>

      {/* Badge Gallery */}
      <div className="rounded-2xl border border-border bg-card/60 p-4">
        <h2 className="font-heading font-bold text-foreground mb-4">Badge Gallery</h2>
        <div className="grid grid-cols-3 md:grid-cols-4 gap-3">
          {MOCK_BADGES.map(b => (
            <BadgeCard key={b.id} badge={b} />
          ))}
        </div>
      </div>
    </div>
  );
}

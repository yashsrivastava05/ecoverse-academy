import { motion } from 'framer-motion';
import { MOCK_USER, MOCK_BADGES, MOCK_SCHOOLS } from '@/lib/mock-data';
import { getLevelForPoints } from '@/lib/types';
import EcosystemViewer from '@/components/game/EcosystemViewer';
import { EcoPointsBadge, StreakFlame, LevelBadge, ProgressRing, BadgeCard } from '@/components/game/GameUI';
import { Target, BookOpen, Flame, Award, Leaf } from 'lucide-react';

const stagger = { hidden: {}, visible: { transition: { staggerChildren: 0.08 } } };
const fadeUp = { hidden: { opacity: 0, y: 20 }, visible: { opacity: 1, y: 0 } };

export default function ProfilePage() {
  const user = MOCK_USER;
  const levelInfo = getLevelForPoints(user.eco_points);
  const school = MOCK_SCHOOLS.find(s => s.id === user.school_id);

  return (
    <motion.div className="p-4 md:p-6 space-y-6 max-w-3xl mx-auto" variants={stagger} initial="hidden" animate="visible">
      {/* Header */}
      <motion.div variants={fadeUp} className="rounded-2xl bg-card shadow-card p-6 text-center">
        <div className="w-20 h-20 mx-auto rounded-full bg-jungle-pale border-3 border-jungle-light flex items-center justify-center text-3xl font-bold text-jungle-deep mb-4 shadow-card">
          {user.full_name.charAt(0)}
        </div>
        <h1 className="font-display font-bold text-2xl text-jungle-deep">{user.full_name}</h1>
        <p className="text-sm text-muted-foreground">{school?.name} · {school?.city}</p>
        <div className="flex items-center justify-center gap-3 mt-4">
          <LevelBadge level={levelInfo.level} title={levelInfo.title} />
          <EcoPointsBadge points={user.eco_points} size="sm" />
        </div>
      </motion.div>

      {/* Ecosystem mini-view */}
      <motion.div variants={fadeUp}>
        <div className="rounded-3xl bg-bg-dark-panel p-4 shadow-float">
          <EcosystemViewer ecoPoints={user.eco_points} className="aspect-[2/1]" />
          <div className="flex items-center justify-center gap-3 mt-4">
            <ProgressRing progress={levelInfo.progress} size={45} strokeWidth={3}>
              <span className="text-[10px] font-mono-stat text-jungle-light">{Math.round(levelInfo.progress * 100)}%</span>
            </ProgressRing>
            <p className="text-sm" style={{ color: 'hsl(var(--jungle-light))' }}>
              {levelInfo.nextLevel ? `${levelInfo.nextLevel.points - user.eco_points} pts to ${levelInfo.nextLevel.title}` : 'Max Level!'}
            </p>
          </div>
        </div>
      </motion.div>

      {/* Stats Grid */}
      <motion.div variants={fadeUp} className="grid grid-cols-2 md:grid-cols-4 gap-3">
        {[
          { icon: <Leaf className="w-5 h-5 text-jungle-bright" />, label: 'EcoPoints', value: user.eco_points.toLocaleString(), border: 'border-l-jungle-bright' },
          { icon: <Target className="w-5 h-5 text-sky-blue" />, label: 'Missions', value: '18', border: 'border-l-sky-blue' },
          { icon: <Flame className="w-5 h-5 text-sun-gold" />, label: 'Streak', value: `${user.streak_days} days`, border: 'border-l-sun-gold' },
          { icon: <Award className="w-5 h-5 text-lavender" />, label: 'Badges', value: String(MOCK_BADGES.filter(b => b.earned).length), border: 'border-l-lavender' },
        ].map((s, i) => (
          <motion.div
            key={i}
            variants={fadeUp}
            whileHover={{ y: -4, boxShadow: 'var(--shadow-hover)' }}
            className={`rounded-2xl bg-card shadow-card p-4 text-center border-l-4 ${s.border}`}
          >
            <div className="flex justify-center mb-2">{s.icon}</div>
            <p className="font-mono-stat font-bold text-foreground">{s.value}</p>
            <p className="font-label text-muted-foreground">{s.label}</p>
          </motion.div>
        ))}
      </motion.div>

      {/* Badge Gallery */}
      <motion.div variants={fadeUp} className="rounded-2xl bg-card shadow-card p-5">
        <h2 className="font-heading font-bold text-foreground mb-4">Badge Gallery</h2>
        <div className="grid grid-cols-3 md:grid-cols-4 gap-3">
          {MOCK_BADGES.map(b => (
            <BadgeCard key={b.id} badge={b} />
          ))}
        </div>
      </motion.div>
    </motion.div>
  );
}

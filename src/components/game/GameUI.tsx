import { motion } from 'framer-motion';
import { Leaf, Flame, Star, Trophy } from 'lucide-react';
import { useEffect, useState } from 'react';

export function EcoPointsBadge({ points, size = 'default' }: { points: number; size?: 'sm' | 'default' | 'lg' }) {
  const [display, setDisplay] = useState(0);
  useEffect(() => {
    const duration = 1000;
    const start = display;
    const diff = points - start;
    if (diff === 0) return;
    const startTime = performance.now();
    const animate = (now: number) => {
      const elapsed = now - startTime;
      const progress = Math.min(elapsed / duration, 1);
      setDisplay(Math.round(start + diff * progress));
      if (progress < 1) requestAnimationFrame(animate);
    };
    requestAnimationFrame(animate);
  }, [points]);

  const sizes = {
    sm: 'text-sm px-2 py-1 gap-1',
    default: 'text-lg px-3 py-1.5 gap-1.5',
    lg: 'text-2xl px-4 py-2 gap-2',
  };

  return (
    <motion.div
      className={`inline-flex items-center rounded-full bg-accent border border-primary/30 font-mono-stat font-bold text-primary glow-sm ${sizes[size]}`}
      whileHover={{ scale: 1.05 }}
    >
      <Leaf className={size === 'sm' ? 'w-3 h-3' : size === 'lg' ? 'w-6 h-6' : 'w-4 h-4'} />
      {display.toLocaleString()}
    </motion.div>
  );
}

export function StreakFlame({ days }: { days: number }) {
  return (
    <div className="inline-flex items-center gap-1 font-mono-stat font-bold text-amber-sun">
      <Flame className="w-5 h-5 animate-pulse" />
      <span>{days}</span>
    </div>
  );
}

export function LevelBadge({ level, title }: { level: number; title: string }) {
  return (
    <div className="inline-flex items-center gap-1.5 rounded-full bg-accent border border-primary/20 px-3 py-1 text-sm font-heading font-bold text-primary">
      <Star className="w-4 h-4" />
      <span>Lv.{level}</span>
      <span className="text-foreground/70">{title}</span>
    </div>
  );
}

export function RankBadge({ rank }: { rank: number }) {
  return (
    <div className="inline-flex items-center gap-1 font-mono-stat font-bold text-amber-sun">
      <Trophy className="w-4 h-4" />
      <span>#{rank}</span>
    </div>
  );
}

export function ProgressRing({ progress, size = 60, strokeWidth = 4, children }: { progress: number; size?: number; strokeWidth?: number; children?: React.ReactNode }) {
  const radius = (size - strokeWidth) / 2;
  const circumference = radius * 2 * Math.PI;
  const offset = circumference - progress * circumference;

  return (
    <div className="relative inline-flex items-center justify-center" style={{ width: size, height: size }}>
      <svg width={size} height={size} className="-rotate-90">
        <circle cx={size / 2} cy={size / 2} r={radius} stroke="hsl(var(--border))" strokeWidth={strokeWidth} fill="none" />
        <motion.circle
          cx={size / 2} cy={size / 2} r={radius}
          stroke="hsl(var(--primary))"
          strokeWidth={strokeWidth}
          fill="none"
          strokeLinecap="round"
          initial={{ strokeDashoffset: circumference }}
          animate={{ strokeDashoffset: offset }}
          transition={{ duration: 1, ease: 'easeOut' }}
          strokeDasharray={circumference}
        />
      </svg>
      {children && <div className="absolute inset-0 flex items-center justify-center">{children}</div>}
    </div>
  );
}

export function StatCard({ icon, label, value, color = 'primary' }: { icon: React.ReactNode; label: string; value: React.ReactNode; color?: string }) {
  return (
    <motion.div
      className="rounded-xl bg-card border border-border p-4 animate-breathe"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      whileHover={{ y: -4, boxShadow: '0 0 20px hsl(153 100% 50% / 0.2)' }}
      transition={{ duration: 0.3 }}
    >
      <div className="flex items-center gap-3">
        <div className="text-2xl">{icon}</div>
        <div>
          <p className="text-xs uppercase tracking-wider text-muted-foreground font-display">{label}</p>
          <div className="text-xl font-mono-stat font-bold text-foreground">{value}</div>
        </div>
      </div>
    </motion.div>
  );
}

export function BadgeCard({ badge }: { badge: { name: string; icon: string; description: string; earned?: boolean } }) {
  return (
    <motion.div
      className={`flex flex-col items-center gap-2 rounded-xl border p-4 text-center transition-all ${
        badge.earned ? 'bg-card border-primary/30 glow-sm' : 'bg-card/30 border-border opacity-40 grayscale'
      }`}
      whileHover={badge.earned ? { scale: 1.05, boxShadow: '0 0 25px hsl(153 100% 50% / 0.3)' } : {}}
    >
      <span className="text-3xl">{badge.icon}</span>
      <p className="text-sm font-heading font-bold text-foreground">{badge.name}</p>
      <p className="text-xs text-muted-foreground">{badge.description}</p>
    </motion.div>
  );
}

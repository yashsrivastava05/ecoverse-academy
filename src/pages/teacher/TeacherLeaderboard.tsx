import { useState } from 'react';
import { motion } from 'framer-motion';
import { useTeacherData } from '@/hooks/useTeacherData';
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';

const fadeUp = { hidden: { opacity: 0, y: 20 }, visible: { opacity: 1, y: 0 } };

export default function TeacherLeaderboard() {
  const { students, submissions } = useTeacherData();
  const [period, setPeriod] = useState<'week' | 'month' | 'all'>('all');

  // Fetch approved submissions with points for time-based filtering
  const { data: approvedSubs = [] } = useQuery({
    queryKey: ['teacher-leaderboard-subs'],
    queryFn: async () => {
      const { data } = await supabase
        .from('mission_submissions')
        .select('user_id, reviewed_at, missions(eco_points_reward)')
        .eq('status', 'approved');
      return data ?? [];
    },
  });

  // Calculate points per student based on period
  const getPointsForPeriod = (userId: string): number => {
    if (period === 'all') {
      return students.find(s => s.id === userId)?.eco_points ?? 0;
    }

    const now = new Date();
    let cutoff: Date;
    if (period === 'week') {
      cutoff = new Date(now);
      cutoff.setDate(cutoff.getDate() - 7);
    } else {
      cutoff = new Date(now.getFullYear(), now.getMonth(), 1);
    }

    return approvedSubs
      .filter(s => s.user_id === userId && s.reviewed_at && new Date(s.reviewed_at) >= cutoff)
      .reduce((sum, s) => sum + ((s.missions as any)?.eco_points_reward ?? 0), 0);
  };

  // Sort students by points for selected period
  const sorted = [...students]
    .map(s => ({ ...s, periodPoints: getPointsForPeriod(s.id) }))
    .sort((a, b) => b.periodPoints - a.periodPoints);

  const top3 = sorted.slice(0, 3);
  const rest = sorted.slice(3);

  const completedCount = (userId: string) =>
    submissions.filter(s => s.user_id === userId && s.status === 'approved').length;

  return (
    <motion.div className="p-4 md:p-6 max-w-4xl mx-auto space-y-6" initial="hidden" animate="visible" variants={{ hidden: {}, visible: { transition: { staggerChildren: 0.05 } } }}>
      <motion.h1 variants={fadeUp} className="font-display font-bold text-3xl text-jungle-deep text-center">
        Class Leaderboard 🏆
      </motion.h1>

      <motion.div variants={fadeUp} className="flex justify-center gap-2">
        {(['week', 'month', 'all'] as const).map(p => (
          <button
            key={p}
            onClick={() => setPeriod(p)}
            className={`px-4 py-2 rounded-full text-sm font-heading font-semibold transition-all ${
              period === p ? 'bg-jungle-bright text-white shadow-card' : 'bg-card border border-border text-muted-foreground'
            }`}
          >
            {p === 'week' ? 'This Week' : p === 'month' ? 'This Month' : 'All Time'}
          </button>
        ))}
      </motion.div>

      {/* Podium */}
      {top3.length >= 3 && (
        <motion.div variants={fadeUp} className="flex items-end justify-center gap-4 pt-8 pb-4">
          {[top3[1], top3[0], top3[2]].map((student, i) => {
            const pos = i === 1 ? 1 : i === 0 ? 2 : 3;
            const heights = { 1: 'h-36', 2: 'h-28', 3: 'h-24' };
            const badges = { 1: '👑', 2: '🥈', 3: '🥉' };

            return (
              <motion.div
                key={student.id}
                initial={{ y: 40, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ delay: (3 - pos) * 0.15, type: 'spring' }}
                className="flex flex-col items-center"
              >
                <div className="text-2xl mb-2">{badges[pos as keyof typeof badges]}</div>
                <div className={`w-16 h-16 rounded-full bg-jungle-pale border-3 ${pos === 1 ? 'border-sun-gold shadow-hover' : 'border-border'} flex items-center justify-center text-xl`}>
                  {student.avatar_emoji}
                </div>
                <p className="text-sm font-heading font-bold text-foreground text-center max-w-[100px] truncate mt-2">{student.full_name}</p>
                <p className="text-xs text-jungle-bright font-mono-stat font-bold">{student.periodPoints.toLocaleString()}</p>
                <div className={`w-24 ${heights[pos as keyof typeof heights]} mt-2 rounded-t-2xl bg-gradient-to-t ${
                  pos === 1 ? 'from-sun-gold/40 to-sun-gold/10 border-sun-gold/50' :
                  pos === 2 ? 'from-muted/50 to-muted/20 border-muted-foreground/30' :
                  'from-earth-warm/30 to-earth-warm/10 border-earth-warm/40'
                } border-t border-x`} />
              </motion.div>
            );
          })}
        </motion.div>
      )}

      {/* Ranked list */}
      <div className="space-y-2">
        {rest.map((student, i) => (
          <motion.div
            key={student.id}
            variants={fadeUp}
            className={`flex items-center justify-between p-4 rounded-[20px] transition-all ${
              i % 2 === 0 ? 'bg-card shadow-card' : 'bg-muted/30'
            }`}
          >
            <div className="flex items-center gap-3">
              <span className="w-8 text-center font-mono-stat text-sm text-muted-foreground font-bold">{i + 4}</span>
              <span className="w-10 h-10 rounded-full bg-jungle-pale border border-border flex items-center justify-center text-sm">
                {student.avatar_emoji}
              </span>
              <div>
                <p className="text-sm font-heading font-bold text-foreground">{student.full_name}</p>
                <p className="text-xs text-muted-foreground">{completedCount(student.id)} missions</p>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <span className="text-sm font-mono-stat font-bold text-jungle-bright">{student.periodPoints.toLocaleString()}</span>
              <span className="text-xs text-muted-foreground">🔥 {student.streak_days}d</span>
            </div>
          </motion.div>
        ))}
      </div>

      {/* Class standing */}
      <motion.div variants={fadeUp} className="bg-card rounded-[20px] shadow-card p-6 text-center">
        <span className="text-4xl block mb-2">🌍</span>
        <p className="font-heading font-bold text-foreground">Your class is leading the way!</p>
        <p className="text-sm text-muted-foreground mt-1">
          {students.length} students · {students.reduce((sum, s) => sum + s.eco_points, 0).toLocaleString()} total EcoPoints
        </p>
      </motion.div>
    </motion.div>
  );
}

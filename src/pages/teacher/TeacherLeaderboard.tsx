import { useState } from 'react';
import { motion } from 'framer-motion';
import { useTeacherLeaderboardData, TimePeriod } from '@/hooks/useLeaderboardData';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';

const fadeUp = { hidden: { opacity: 0, y: 20 }, visible: { opacity: 1, y: 0 } };
const stagger = { hidden: {}, visible: { transition: { staggerChildren: 0.05 } } };

export default function TeacherLeaderboard() {
  const [period, setPeriod] = useState<TimePeriod>('all_time');
  const { data, isLoading } = useTeacherLeaderboardData(period);

  const top3 = data?.top3 ?? [];
  const rest = data?.rest ?? [];
  const allEntries = data?.entries ?? [];

  return (
    <motion.div className="p-4 md:p-6 max-w-4xl mx-auto space-y-6" initial="hidden" animate="visible" variants={stagger}>
      <motion.h1 variants={fadeUp} className="font-display font-bold text-3xl text-jungle-deep text-center">
        Class Leaderboard 🏆
      </motion.h1>

      <motion.div variants={fadeUp} className="flex justify-center gap-2">
        {([['all_time', 'All Time'], ['this_week', 'This Week'], ['this_month', 'This Month']] as const).map(([key, label]) => (
          <button
            key={key}
            onClick={() => setPeriod(key as TimePeriod)}
            className={`px-4 py-2 rounded-full text-sm font-heading font-semibold transition-all ${
              period === key
                ? 'bg-primary text-primary-foreground shadow-card'
                : 'bg-card border border-border text-muted-foreground'
            }`}
          >
            {label}
          </button>
        ))}
      </motion.div>

      {isLoading ? (
        <div className="text-center py-12 text-muted-foreground">Loading...</div>
      ) : (
        <>
          {/* Top 3 highlight cards */}
          {top3.length >= 3 && (
            <motion.div variants={fadeUp} className="flex items-end justify-center gap-4 pt-8 pb-4">
              {[top3[1], top3[0], top3[2]].map((student, i) => {
                const pos = i === 1 ? 1 : i === 0 ? 2 : 3;
                const heights = { 1: 'h-36', 2: 'h-28', 3: 'h-24' };
                const badges = { 1: '👑', 2: '🥈', 3: '🥉' };

                return (
                  <motion.div
                    key={student.user_id}
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
                    <p className="text-xs text-jungle-bright font-mono-stat font-bold">{student.eco_points.toLocaleString()}</p>
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

          {/* Table for remaining students */}
          {rest.length > 0 && (
            <motion.div variants={fadeUp} className="bg-card rounded-2xl shadow-card overflow-hidden">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead className="w-16">Rank</TableHead>
                    <TableHead>Student</TableHead>
                    <TableHead>Level</TableHead>
                    <TableHead className="text-center">Streak</TableHead>
                    <TableHead className="text-right">Points</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {rest.map(student => (
                    <TableRow key={student.user_id}>
                      <TableCell className="font-mono-stat font-bold text-muted-foreground">{student.rank}</TableCell>
                      <TableCell>
                        <div className="flex items-center gap-2">
                          <span className="w-8 h-8 rounded-full bg-jungle-pale border border-border flex items-center justify-center text-sm">
                            {student.avatar_emoji}
                          </span>
                          <span className="font-heading font-bold text-sm">{student.full_name}</span>
                        </div>
                      </TableCell>
                      <TableCell className="text-xs text-muted-foreground">{student.level_title}</TableCell>
                      <TableCell className="text-center text-xs">🔥 {student.streak_days}d</TableCell>
                      <TableCell className="text-right font-mono-stat font-bold text-jungle-bright">{student.eco_points.toLocaleString()}</TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </motion.div>
          )}

          {allEntries.length === 0 && (
            <div className="text-center py-12 text-muted-foreground">No student data for this period.</div>
          )}

          {/* Class summary */}
          {allEntries.length > 0 && (
            <motion.div variants={fadeUp} className="bg-card rounded-2xl shadow-card p-6 text-center">
              <span className="text-4xl block mb-2">🌍</span>
              <p className="font-heading font-bold text-foreground">Your class is leading the way!</p>
              <p className="text-sm text-muted-foreground mt-1">
                {allEntries.length} students · {allEntries.reduce((sum, s) => sum + s.eco_points, 0).toLocaleString()} total EcoPoints
              </p>
            </motion.div>
          )}
        </>
      )}
    </motion.div>
  );
}

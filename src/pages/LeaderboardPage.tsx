import { useState } from 'react';
import { motion } from 'framer-motion';
import { MOCK_LEADERBOARD, MOCK_SCHOOLS, MOCK_USER } from '@/lib/mock-data';
import { ArrowUp, ArrowDown, Minus, Trophy } from 'lucide-react';

export default function LeaderboardPage() {
  const [tab, setTab] = useState<'individual' | 'school'>('individual');
  const [period, setPeriod] = useState('all_time');

  const top3 = MOCK_LEADERBOARD.slice(0, 3);
  const rest = MOCK_LEADERBOARD.slice(3);
  const userEntry = MOCK_LEADERBOARD.find(e => e.user_id === MOCK_USER.id);

  return (
    <div className="p-4 md:p-6 space-y-6">
      <motion.h1 initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="font-display font-bold text-2xl text-foreground">
        Leaderboard 🏆
      </motion.h1>

      <div className="flex items-center justify-between flex-wrap gap-3">
        <div className="flex gap-2">
          {(['individual', 'school'] as const).map(t => (
            <button key={t} onClick={() => setTab(t)} className={`px-4 py-2 rounded-full text-sm font-medium transition-all ${tab === t ? 'bg-primary text-primary-foreground glow-sm' : 'bg-card border border-border text-muted-foreground hover:text-foreground'}`}>
              {t === 'individual' ? '👤 Individual' : '🏫 School'}
            </button>
          ))}
        </div>
        <div className="flex gap-2">
          {['weekly', 'monthly', 'all_time'].map(p => (
            <button key={p} onClick={() => setPeriod(p)} className={`px-3 py-1.5 rounded-full text-xs font-medium transition-all ${period === p ? 'bg-accent text-primary border border-primary/30' : 'text-muted-foreground hover:text-foreground'}`}>
              {p === 'all_time' ? 'All Time' : p === 'weekly' ? 'This Week' : 'This Month'}
            </button>
          ))}
        </div>
      </div>

      {tab === 'individual' ? (
        <>
          {/* Podium */}
          <div className="flex items-end justify-center gap-4 pt-8 pb-4">
            {[top3[1], top3[0], top3[2]].map((entry, i) => {
              if (!entry) return null;
              const pos = i === 1 ? 1 : i === 0 ? 2 : 3;
              const heights = { 1: 'h-32', 2: 'h-24', 3: 'h-20' };
              const colors = { 1: 'from-amber-sun/30 to-amber-sun/10 border-amber-sun/50', 2: 'from-muted/50 to-muted/20 border-muted-foreground/30', 3: 'from-earth-warm/30 to-earth-warm/10 border-earth-warm/50' };
              const badges = { 1: '👑', 2: '🥈', 3: '🥉' };

              return (
                <motion.div
                  key={entry.user_id}
                  initial={{ y: 40, opacity: 0 }}
                  animate={{ y: 0, opacity: 1 }}
                  transition={{ delay: (3 - pos) * 0.15, type: 'spring' }}
                  className="flex flex-col items-center"
                >
                  <div className="text-2xl mb-2">{badges[pos as keyof typeof badges]}</div>
                  <div className={`w-14 h-14 rounded-full bg-accent border-2 ${pos === 1 ? 'border-amber-sun glow-sun' : 'border-border'} flex items-center justify-center text-lg font-bold text-foreground mb-2`}>
                    {entry.user_name.charAt(0)}
                  </div>
                  <p className="text-sm font-heading font-bold text-foreground text-center max-w-[100px] truncate">{entry.user_name}</p>
                  <p className="text-xs text-primary font-mono-stat">{entry.eco_points.toLocaleString()}</p>
                  <div className={`w-20 ${heights[pos as keyof typeof heights]} mt-2 rounded-t-xl bg-gradient-to-t border-t border-x ${colors[pos as keyof typeof colors]}`} />
                </motion.div>
              );
            })}
          </div>

          {/* Rest of list */}
          <div className="space-y-2">
            {rest.map((entry, i) => (
              <motion.div
                key={entry.user_id}
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: i * 0.05 }}
                className={`flex items-center justify-between p-3 rounded-xl border bg-card/60 ${entry.user_id === MOCK_USER.id ? 'border-primary/40 glow-sm' : 'border-border'}`}
              >
                <div className="flex items-center gap-3">
                  <span className="w-8 text-center font-mono-stat text-sm text-muted-foreground">{entry.rank}</span>
                  <div className="w-8 h-8 rounded-full bg-accent border border-border flex items-center justify-center text-sm font-bold text-foreground">
                    {entry.user_name.charAt(0)}
                  </div>
                  <div>
                    <p className="text-sm font-heading font-bold text-foreground">{entry.user_name}</p>
                    <p className="text-xs text-muted-foreground">{entry.school_name}</p>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <span className="text-sm font-mono-stat text-primary">{entry.eco_points.toLocaleString()}</span>
                  {entry.rank_change > 0 && <ArrowUp className="w-4 h-4 text-primary" />}
                  {entry.rank_change < 0 && <ArrowDown className="w-4 h-4 text-coral-bloom" />}
                  {entry.rank_change === 0 && <Minus className="w-4 h-4 text-muted-foreground" />}
                </div>
              </motion.div>
            ))}
          </div>

          {/* Your position */}
          {userEntry && (
            <div className="sticky bottom-20 md:bottom-4">
              <div className="rounded-xl border border-primary/40 bg-card p-3 glow-sm flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <Trophy className="w-5 h-5 text-primary" />
                  <span className="text-sm font-heading font-bold text-foreground">Your Position</span>
                </div>
                <div className="flex items-center gap-2">
                  <span className="font-mono-stat text-primary">#{userEntry.rank}</span>
                  <span className="text-sm text-muted-foreground">{userEntry.eco_points.toLocaleString()} pts</span>
                </div>
              </div>
            </div>
          )}
        </>
      ) : (
        <div className="space-y-3">
          {MOCK_SCHOOLS.sort((a, b) => b.total_eco_points - a.total_eco_points).map((school, i) => (
            <motion.div
              key={school.id}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.1 }}
              className="flex items-center justify-between p-4 rounded-xl border border-border bg-card/60"
            >
              <div className="flex items-center gap-3">
                <span className="w-8 text-center font-mono-stat text-lg">{i === 0 ? '🥇' : i === 1 ? '🥈' : '🥉'}</span>
                <div>
                  <p className="font-heading font-bold text-foreground">{school.name}</p>
                  <p className="text-xs text-muted-foreground">{school.city}, {school.country} · {school.student_count} students</p>
                </div>
              </div>
              <span className="font-mono-stat text-primary font-bold">{school.total_eco_points.toLocaleString()}</span>
            </motion.div>
          ))}
        </div>
      )}
    </div>
  );
}

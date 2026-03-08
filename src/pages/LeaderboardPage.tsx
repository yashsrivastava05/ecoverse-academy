import { useState } from 'react';
import { motion } from 'framer-motion';
import { MOCK_LEADERBOARD, MOCK_SCHOOLS, MOCK_USER } from '@/lib/mock-data';
import { ArrowUp, ArrowDown, Minus, Trophy } from 'lucide-react';

const stagger = { hidden: {}, visible: { transition: { staggerChildren: 0.05 } } };
const fadeUp = { hidden: { opacity: 0, y: 20 }, visible: { opacity: 1, y: 0 } };

export default function LeaderboardPage() {
  const [tab, setTab] = useState<'individual' | 'school'>('individual');
  const [period, setPeriod] = useState('all_time');
  const top3 = MOCK_LEADERBOARD.slice(0, 3);
  const rest = MOCK_LEADERBOARD.slice(3);
  const userEntry = MOCK_LEADERBOARD.find(e => e.user_id === MOCK_USER.id);

  return (
    <motion.div className="p-4 md:p-6 max-w-4xl mx-auto space-y-6" variants={stagger} initial="hidden" animate="visible">
      <motion.h1 variants={fadeUp} className="font-display font-bold text-3xl text-jungle-deep text-center">
        Who's Saving the Planet?
      </motion.h1>

      <motion.div variants={fadeUp} className="flex items-center justify-between flex-wrap gap-3">
        <div className="flex gap-2">
          {(['individual', 'school'] as const).map(t => (
            <button key={t} onClick={() => setTab(t)} className={`px-4 py-2 rounded-full text-sm font-heading font-semibold transition-all ${tab === t ? 'bg-primary text-primary-foreground shadow-card' : 'bg-card border border-border text-muted-foreground hover:text-foreground'}`}>
              {t === 'individual' ? '👤 Individual' : '🏫 School'}
            </button>
          ))}
        </div>
        <div className="flex gap-2">
          {['weekly', 'monthly', 'all_time'].map(p => (
            <button key={p} onClick={() => setPeriod(p)} className={`px-3 py-1.5 rounded-full text-xs font-heading font-semibold transition-all ${period === p ? 'bg-jungle-pale text-jungle-bright' : 'text-muted-foreground hover:text-foreground'}`}>
              {p === 'all_time' ? 'All Time' : p === 'weekly' ? 'Week' : 'Month'}
            </button>
          ))}
        </div>
      </motion.div>

      {tab === 'individual' ? (
        <>
          {/* Podium */}
          <motion.div variants={fadeUp} className="flex items-end justify-center gap-4 pt-8 pb-4">
            {[top3[1], top3[0], top3[2]].map((entry, i) => {
              if (!entry) return null;
              const pos = i === 1 ? 1 : i === 0 ? 2 : 3;
              const heights = { 1: 'h-36', 2: 'h-28', 3: 'h-24' };
              const gradients = {
                1: 'from-sun-gold/40 to-sun-gold/10 border-sun-gold/50',
                2: 'from-muted/50 to-muted/20 border-muted-foreground/30',
                3: 'from-earth-warm/30 to-earth-warm/10 border-earth-warm/40'
              };
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
                  <div className={`w-16 h-16 rounded-full bg-jungle-pale border-3 ${pos === 1 ? 'border-sun-gold shadow-hover' : 'border-border'} flex items-center justify-center text-xl font-bold text-jungle-deep mb-2`}>
                    {entry.user_name.charAt(0)}
                  </div>
                  <p className="text-sm font-heading font-bold text-foreground text-center max-w-[100px] truncate">{entry.user_name}</p>
                  <p className="text-xs text-jungle-bright font-mono-stat font-bold">{entry.eco_points.toLocaleString()}</p>
                  <div className={`w-24 ${heights[pos as keyof typeof heights]} mt-2 rounded-t-2xl bg-gradient-to-t border-t border-x ${gradients[pos as keyof typeof gradients]} animate-shimmer`}
                    style={{ backgroundImage: pos === 1 ? 'linear-gradient(90deg, transparent, hsl(var(--sun-gold) / 0.1), transparent)' : undefined, backgroundSize: '200% 100%' }}
                  />
                </motion.div>
              );
            })}
          </motion.div>

          {/* Ranked list */}
          <div className="space-y-2">
            {rest.map((entry, i) => (
              <motion.div
                key={entry.user_id}
                variants={fadeUp}
                className={`flex items-center justify-between p-4 rounded-2xl transition-all ${
                  entry.user_id === MOCK_USER.id
                    ? 'bg-jungle-pale border-2 border-jungle-bright shadow-card'
                    : i % 2 === 0 ? 'bg-card shadow-card' : 'bg-muted/30'
                }`}
              >
                <div className="flex items-center gap-3">
                  <span className="w-8 text-center font-mono-stat text-sm text-muted-foreground font-bold">{entry.rank}</span>
                  <div className="w-10 h-10 rounded-full bg-jungle-pale border border-border flex items-center justify-center text-sm font-bold text-jungle-deep">
                    {entry.user_name.charAt(0)}
                  </div>
                  <div>
                    <p className="text-sm font-heading font-bold text-foreground">{entry.user_name}</p>
                    <p className="text-xs text-muted-foreground">{entry.school_name}</p>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <span className="text-sm font-mono-stat font-bold text-jungle-bright">{entry.eco_points.toLocaleString()}</span>
                  {entry.rank_change > 0 && <span className="flex items-center gap-0.5 text-xs text-jungle-bright font-heading font-bold"><ArrowUp className="w-3 h-3" />+{entry.rank_change}</span>}
                  {entry.rank_change < 0 && <span className="flex items-center gap-0.5 text-xs text-coral font-heading font-bold"><ArrowDown className="w-3 h-3" />{entry.rank_change}</span>}
                  {entry.rank_change === 0 && <Minus className="w-3 h-3 text-muted-foreground" />}
                </div>
              </motion.div>
            ))}
          </div>

          {/* Your position */}
          {userEntry && (
            <div className="sticky bottom-20 md:bottom-4">
              <div className="rounded-2xl bg-card shadow-float p-4 border-l-4 border-l-jungle-bright flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <Trophy className="w-5 h-5 text-primary" />
                  <span className="text-sm font-heading font-bold text-foreground">Your Position</span>
                </div>
                <div className="flex items-center gap-2">
                  <span className="font-mono-stat font-bold text-jungle-bright">#{userEntry.rank}</span>
                  <span className="text-sm text-muted-foreground">{userEntry.eco_points.toLocaleString()} pts</span>
                </div>
              </div>
            </div>
          )}
        </>
      ) : (
        <motion.div className="space-y-3" variants={stagger}>
          {MOCK_SCHOOLS.sort((a, b) => b.total_eco_points - a.total_eco_points).map((school, i) => (
            <motion.div
              key={school.id}
              variants={fadeUp}
              whileHover={{ y: -2, boxShadow: 'var(--shadow-hover)' }}
              className="flex items-center justify-between p-4 rounded-2xl bg-card shadow-card"
            >
              <div className="flex items-center gap-3">
                <span className="w-8 text-center font-mono-stat text-lg">{i === 0 ? '🥇' : i === 1 ? '🥈' : '🥉'}</span>
                <div>
                  <p className="font-heading font-bold text-foreground">{school.name}</p>
                  <p className="text-xs text-muted-foreground">{school.city}, {school.country} · {school.student_count} students</p>
                </div>
              </div>
              <span className="font-mono-stat text-jungle-bright font-bold">{school.total_eco_points.toLocaleString()}</span>
            </motion.div>
          ))}
        </motion.div>
      )}
    </motion.div>
  );
}

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { MOCK_MISSIONS, CATEGORY_INFO } from '@/lib/mock-data';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Leaf, MapPin, Camera, X, Sparkles } from 'lucide-react';
import type { Mission, MissionCategory } from '@/lib/types';

function MissionDetailModal({ mission, onClose }: { mission: Mission; onClose: () => void }) {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-background/80 backdrop-blur-sm"
      onClick={onClose}
    >
      <motion.div
        initial={{ scale: 0.9, y: 20 }}
        animate={{ scale: 1, y: 0 }}
        exit={{ scale: 0.9, y: 20 }}
        onClick={e => e.stopPropagation()}
        className="w-full max-w-lg rounded-2xl border border-border bg-card p-6 space-y-4 max-h-[80vh] overflow-y-auto"
      >
        <div className="flex items-start justify-between">
          <div className="flex items-center gap-3">
            <span className="text-4xl">{mission.icon_url}</span>
            <div>
              <h2 className="font-heading font-bold text-xl text-foreground">{mission.title}</h2>
              <div className="flex items-center gap-2 mt-1">
                <span className={`text-xs px-2 py-0.5 rounded-full border ${
                  mission.difficulty === 'easy' ? 'border-primary/30 text-primary' :
                  mission.difficulty === 'medium' ? 'border-amber-sun/30 text-amber-sun' :
                  'border-coral-bloom/30 text-coral-bloom'
                }`}>{mission.difficulty}</span>
                <span className="text-sm text-primary font-mono-stat flex items-center gap-1"><Leaf className="w-3 h-3" /> {mission.eco_points_reward} pts</span>
              </div>
            </div>
          </div>
          <button onClick={onClose} className="p-1 rounded-lg hover:bg-accent"><X className="w-5 h-5 text-muted-foreground" /></button>
        </div>

        <p className="text-muted-foreground text-sm leading-relaxed">{mission.description}</p>

        {mission.steps && (
          <div>
            <h3 className="font-heading font-bold text-foreground text-sm mb-2">Steps</h3>
            <ol className="space-y-1.5 text-sm text-muted-foreground">
              {mission.steps.map((s, i) => (
                <li key={i} className="flex items-start gap-2">
                  <span className="w-5 h-5 rounded-full bg-accent text-primary text-xs flex items-center justify-center shrink-0 mt-0.5">{i + 1}</span>
                  {s}
                </li>
              ))}
            </ol>
          </div>
        )}

        <div className="flex gap-2 text-xs text-muted-foreground">
          {mission.requires_photo && <span className="flex items-center gap-1 bg-accent rounded-full px-2 py-1"><Camera className="w-3 h-3" /> Photo required</span>}
          {mission.requires_location && <span className="flex items-center gap-1 bg-accent rounded-full px-2 py-1"><MapPin className="w-3 h-3" /> Location required</span>}
        </div>

        {/* Upload area */}
        {mission.requires_photo && (
          <div className="border-2 border-dashed border-border rounded-xl p-8 text-center hover:border-primary/30 transition-colors cursor-pointer">
            <Camera className="w-8 h-8 text-muted-foreground mx-auto mb-2" />
            <p className="text-sm text-muted-foreground">Drag & drop a photo or click to upload</p>
          </div>
        )}

        <div className="space-y-2">
          <label className="text-sm font-medium text-foreground">Notes (optional)</label>
          <textarea className="w-full rounded-xl border border-border bg-card p-3 text-sm text-foreground min-h-[80px] resize-none" placeholder="Add any notes about your mission..." />
        </div>

        <Button className="w-full glow-sm font-heading font-bold">Submit Proof</Button>
      </motion.div>
    </motion.div>
  );
}

export default function MissionsPage() {
  const [category, setCategory] = useState<string>('all');
  const [selected, setSelected] = useState<Mission | null>(null);
  const categories = ['all', ...Object.keys(CATEGORY_INFO)];

  const filtered = category === 'all' ? MOCK_MISSIONS : MOCK_MISSIONS.filter(m => m.category === category);

  return (
    <div className="p-4 md:p-6 space-y-6">
      <motion.h1 initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="font-display font-bold text-2xl text-foreground">
        Eco Missions 🎯
      </motion.h1>

      {/* AI Recommended */}
      <div className="rounded-2xl border border-violet-dusk/30 bg-card/60 p-4">
        <h2 className="font-heading font-bold text-foreground flex items-center gap-2 mb-3">
          <Sparkles className="w-5 h-5 text-violet-dusk" /> Recommended for You
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
          {MOCK_MISSIONS.slice(3, 6).map(m => (
            <motion.div
              key={m.id}
              whileHover={{ y: -4 }}
              onClick={() => setSelected(m)}
              className="p-3 rounded-xl border border-violet-dusk/20 bg-card/40 cursor-pointer hover:border-violet-dusk/40 transition-all"
            >
              <div className="flex items-center gap-2 mb-2">
                <span className="text-xl">{m.icon_url}</span>
                <span className="text-xs px-2 py-0.5 rounded-full bg-violet-dusk/20 text-violet-dusk border border-violet-dusk/30">AI Pick</span>
              </div>
              <p className="font-heading font-bold text-sm text-foreground">{m.title}</p>
              <p className="text-xs text-muted-foreground mt-1">{m.eco_points_reward} pts</p>
            </motion.div>
          ))}
        </div>
      </div>

      {/* Category filters */}
      <div className="flex gap-2 overflow-x-auto pb-2">
        {categories.map(c => (
          <button
            key={c}
            onClick={() => setCategory(c)}
            className={`px-4 py-2 rounded-full text-sm font-medium whitespace-nowrap transition-all ${
              category === c ? 'bg-primary text-primary-foreground glow-sm' : 'bg-card border border-border text-muted-foreground hover:text-foreground hover:border-primary/30'
            }`}
          >
            {c === 'all' ? '🌍 All' : `${CATEGORY_INFO[c]?.icon} ${CATEGORY_INFO[c]?.label}`}
          </button>
        ))}
      </div>

      {/* Mission grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {filtered.map((m, i) => (
          <motion.div
            key={m.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.05 }}
            whileHover={{ y: -6, boxShadow: '0 0 20px hsl(153 100% 50% / 0.15)' }}
            onClick={() => setSelected(m)}
            className="rounded-2xl border border-border bg-card/60 p-4 cursor-pointer transition-all animate-breathe"
            style={{ animationDelay: `${i * 0.3}s` }}
          >
            <div className="flex items-center justify-between mb-3">
              <span className="text-3xl">{m.icon_url}</span>
              <span className={`text-xs px-2 py-0.5 rounded-full border font-medium ${
                m.difficulty === 'easy' ? 'border-primary/30 text-primary bg-primary/10' :
                m.difficulty === 'medium' ? 'border-amber-sun/30 text-amber-sun bg-amber-sun/10' :
                'border-coral-bloom/30 text-coral-bloom bg-coral-bloom/10'
              }`}>{m.difficulty}</span>
            </div>
            <h3 className="font-heading font-bold text-foreground mb-1">{m.title}</h3>
            <p className="text-xs text-muted-foreground line-clamp-2 mb-3">{m.description}</p>
            <div className="flex items-center justify-between">
              <span className="text-sm text-primary font-mono-stat font-bold flex items-center gap-1">
                <Leaf className="w-3 h-3" /> {m.eco_points_reward} pts
              </span>
              <Button size="sm" variant="outline" className="border-primary/30 text-primary hover:bg-accent">
                Start
              </Button>
            </div>
          </motion.div>
        ))}
      </div>

      <AnimatePresence>
        {selected && <MissionDetailModal mission={selected} onClose={() => setSelected(null)} />}
      </AnimatePresence>
    </div>
  );
}

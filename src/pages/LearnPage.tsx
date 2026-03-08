import { useState } from 'react';
import { motion } from 'framer-motion';
import { MOCK_LESSONS, TOPIC_INFO } from '@/lib/mock-data';
import type { Lesson, QuizContent, QuizQuestion } from '@/lib/types';
import { Button } from '@/components/ui/button';
import { CheckCircle, XCircle, Leaf, ArrowLeft, Clock } from 'lucide-react';
import { ProgressRing } from '@/components/game/GameUI';

const TOPIC_GRADIENTS: Record<string, string> = {
  climate_change: 'from-[#1B4332] to-[#2D6A4F]',
  pollution: 'from-[#4A5568] to-[#2D3748]',
  waste: 'from-[#065F46] to-[#059669]',
  energy: 'from-[#92400E] to-[#D97706]',
  water: 'from-[#0369A1] to-[#0284C7]',
  biodiversity: 'from-[#4338CA] to-[#6D28D9]',
};

function QuizView({ questions, onComplete }: { questions: QuizQuestion[]; onComplete: (score: number) => void }) {
  const [idx, setIdx] = useState(0);
  const [selected, setSelected] = useState<number | null>(null);
  const [score, setScore] = useState(0);
  const [showResult, setShowResult] = useState(false);
  const q = questions[idx];

  const handleSelect = (optIdx: number) => {
    if (selected !== null) return;
    setSelected(optIdx);
    const correct = optIdx === q.correct_index;
    if (correct) setScore(s => s + 1);
    setTimeout(() => {
      if (idx < questions.length - 1) { setIdx(i => i + 1); setSelected(null); }
      else { setShowResult(true); onComplete(score + (correct ? 1 : 0)); }
    }, 1500);
  };

  if (showResult) {
    const pct = Math.round((score / questions.length) * 100);
    return (
      <motion.div initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} className="text-center py-8">
        <div className="text-6xl mb-4">{pct >= 80 ? '🎉' : pct >= 50 ? '👍' : '💪'}</div>
        <h3 className="font-display font-bold text-2xl text-jungle-deep mb-2">Quiz Complete!</h3>
        <p className="text-lg font-mono-stat text-jungle-bright mb-2">{score}/{questions.length} correct ({pct}%)</p>
        <p className="text-sm text-jungle-bright flex items-center justify-center gap-1"><Leaf className="w-4 h-4" /> +{score * 10} EcoPoints earned</p>
      </motion.div>
    );
  }

  return (
    <div className="space-y-4">
      <div className="flex gap-1">
        {questions.map((_, i) => (
          <div key={i} className={`h-2 flex-1 rounded-full transition-all ${i < idx ? 'bg-primary' : i === idx ? 'bg-primary/50' : 'bg-border'}`} />
        ))}
      </div>
      <p className="text-xs text-muted-foreground font-label">Question {idx + 1} of {questions.length}</p>
      <h3 className="font-display font-bold text-xl text-jungle-deep">{q.question}</h3>
      <div className="space-y-3">
        {q.options.map((opt, i) => {
          let style = 'border-border bg-card hover:border-primary/30 hover:bg-jungle-pale/30';
          if (selected !== null) {
            if (i === q.correct_index) style = 'border-jungle-bright bg-jungle-pale shadow-card';
            else if (i === selected) style = 'border-coral bg-coral/10';
          }
          return (
            <motion.button
              key={i}
              onClick={() => handleSelect(i)}
              className={`w-full text-left p-4 rounded-2xl border-2 text-sm font-heading font-semibold text-foreground transition-all ${style}`}
              animate={selected === i && i !== q.correct_index ? { x: [0, -5, 5, -5, 0] } : {}}
              transition={{ duration: 0.4 }}
              whileTap={{ scale: 0.97 }}
            >
              <div className="flex items-center justify-between">
                <span>{opt}</span>
                {selected !== null && i === q.correct_index && <CheckCircle className="w-5 h-5 text-jungle-bright" />}
                {selected === i && i !== q.correct_index && <XCircle className="w-5 h-5 text-coral" />}
              </div>
            </motion.button>
          );
        })}
      </div>
      {selected !== null && (
        <motion.p initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="text-sm text-muted-foreground bg-jungle-pale rounded-2xl p-4">
          {q.explanation}
        </motion.p>
      )}
    </div>
  );
}

const stagger = { hidden: {}, visible: { transition: { staggerChildren: 0.08 } } };
const fadeUp = { hidden: { opacity: 0, y: 20 }, visible: { opacity: 1, y: 0 } };

export default function LearnPage() {
  const [selectedTopic, setSelectedTopic] = useState<string | null>(null);
  const [selectedLesson, setSelectedLesson] = useState<Lesson | null>(null);
  const topics = Object.entries(TOPIC_INFO);

  if (selectedLesson) {
    return (
      <div className="p-4 md:p-6 max-w-2xl mx-auto space-y-6">
        <button onClick={() => setSelectedLesson(null)} className="flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground transition-colors font-heading font-semibold">
          <ArrowLeft className="w-4 h-4" /> Back to lessons
        </button>
        <div className="rounded-2xl bg-card shadow-card p-6">
          <h2 className="font-display font-bold text-2xl text-jungle-deep mb-2">{selectedLesson.title}</h2>
          <div className="flex items-center gap-3 text-xs text-muted-foreground mb-6">
            <span className="flex items-center gap-1"><Clock className="w-3 h-3" /> {selectedLesson.estimated_minutes} min</span>
            <span className="flex items-center gap-1"><Leaf className="w-3 h-3 text-jungle-bright" /> {selectedLesson.eco_points_reward} pts</span>
          </div>
          {selectedLesson.content_type === 'quiz' ? (
            <QuizView questions={(selectedLesson.content_json as QuizContent).questions} onComplete={() => {}} />
          ) : (
            <div className="prose max-w-none">
              <p className="text-foreground/80 leading-relaxed">{(selectedLesson.content_json as any).body}</p>
            </div>
          )}
        </div>
      </div>
    );
  }

  if (selectedTopic) {
    const topicLessons = MOCK_LESSONS.filter(l => l.topic === selectedTopic);
    const info = TOPIC_INFO[selectedTopic];
    return (
      <div className="p-4 md:p-6 max-w-3xl mx-auto space-y-6">
        <button onClick={() => setSelectedTopic(null)} className="flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground transition-colors font-heading font-semibold">
          <ArrowLeft className="w-4 h-4" /> Back to topics
        </button>
        <h1 className="font-display font-bold text-2xl text-jungle-deep">{info.icon} {info.label}</h1>
        <div className="space-y-3">
          {topicLessons.map((l, i) => (
            <motion.div
              key={l.id}
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: i * 0.1 }}
              onClick={() => setSelectedLesson(l)}
              whileHover={{ y: -2, boxShadow: 'var(--shadow-hover)' }}
              whileTap={{ scale: 0.97 }}
              className="flex items-center justify-between p-4 rounded-2xl bg-card shadow-card cursor-pointer transition-all"
            >
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-jungle-pale flex items-center justify-center text-lg font-heading font-bold text-jungle-bright">
                  {i + 1}
                </div>
                <div>
                  <p className="font-heading font-bold text-sm text-foreground">{l.title}</p>
                  <div className="flex items-center gap-3 text-xs text-muted-foreground mt-0.5">
                    <span className="bg-muted rounded-full px-2 py-0.5">{l.content_type === 'quiz' ? 'Quiz' : 'Article'}</span>
                    <span>{l.estimated_minutes} min</span>
                    <span className="flex items-center gap-1"><Leaf className="w-3 h-3 text-jungle-bright" /> {l.eco_points_reward}</span>
                  </div>
                </div>
              </div>
              <Button size="sm" className="rounded-lg font-heading font-bold">Start</Button>
            </motion.div>
          ))}
          {topicLessons.length === 0 && <p className="text-muted-foreground text-sm text-center py-8">More lessons coming soon! 🌱</p>}
        </div>
      </div>
    );
  }

  return (
    <div className="p-4 md:p-6 max-w-7xl mx-auto space-y-6">
      <motion.h1 initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="font-display font-bold text-2xl text-jungle-deep">
        Learning Hub 📚
      </motion.h1>
      <p className="text-muted-foreground">Choose a topic to start learning about sustainability</p>
      <motion.div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4" variants={stagger} initial="hidden" animate="visible">
        {topics.map(([key, info], i) => {
          const lessonCount = MOCK_LESSONS.filter(l => l.topic === key).length;
          return (
            <motion.div
              key={key}
              variants={fadeUp}
              whileHover={{ scale: 1.03, boxShadow: 'var(--shadow-hover)' }}
              whileTap={{ scale: 0.97 }}
              onClick={() => setSelectedTopic(key)}
              className={`relative rounded-2xl bg-gradient-to-br ${TOPIC_GRADIENTS[key] || 'from-primary to-primary/70'} p-6 cursor-pointer h-48 flex flex-col justify-between shadow-card overflow-hidden`}
            >
              <div className="flex items-start justify-between">
                <span className="text-4xl">{info.icon}</span>
                <ProgressRing progress={lessonCount > 0 ? 0.3 : 0} size={40} strokeWidth={3}>
                  <span className="text-[9px] font-mono-stat text-white/80">30%</span>
                </ProgressRing>
              </div>
              <div>
                <h3 className="font-display font-bold text-white text-lg">{info.label}</h3>
                <span className="text-xs bg-white/20 text-white rounded-full px-2 py-0.5 font-heading font-bold mt-1 inline-block">{lessonCount} lesson{lessonCount !== 1 ? 's' : ''}</span>
              </div>
            </motion.div>
          );
        })}
      </motion.div>
    </div>
  );
}

import { useState } from 'react';
import { motion } from 'framer-motion';
import { MOCK_LESSONS, TOPIC_INFO } from '@/lib/mock-data';
import type { Lesson, QuizContent, QuizQuestion } from '@/lib/types';
import { Button } from '@/components/ui/button';
import { BookOpen, CheckCircle, XCircle, Leaf, ArrowLeft, Clock } from 'lucide-react';

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
      if (idx < questions.length - 1) {
        setIdx(i => i + 1);
        setSelected(null);
      } else {
        setShowResult(true);
        onComplete(score + (correct ? 1 : 0));
      }
    }, 1500);
  };

  if (showResult) {
    const pct = Math.round(((score) / questions.length) * 100);
    return (
      <motion.div initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} className="text-center py-8">
        <div className="text-6xl mb-4">{pct >= 80 ? '🎉' : pct >= 50 ? '👍' : '💪'}</div>
        <h3 className="font-display font-bold text-2xl text-foreground mb-2">Quiz Complete!</h3>
        <p className="text-lg font-mono-stat text-primary mb-2">{score}/{questions.length} correct ({pct}%)</p>
        <p className="text-sm text-primary flex items-center justify-center gap-1"><Leaf className="w-4 h-4" /> +{score * 10} EcoPoints earned</p>
      </motion.div>
    );
  }

  return (
    <div className="space-y-4">
      {/* Progress */}
      <div className="flex gap-1">
        {questions.map((_, i) => (
          <div key={i} className={`h-1.5 flex-1 rounded-full transition-all ${i < idx ? 'bg-primary' : i === idx ? 'bg-primary/50' : 'bg-border'}`} />
        ))}
      </div>

      <p className="text-xs text-muted-foreground">Question {idx + 1} of {questions.length}</p>
      <h3 className="font-heading font-bold text-lg text-foreground">{q.question}</h3>

      <div className="space-y-2">
        {q.options.map((opt, i) => {
          let style = 'border-border bg-card/40 hover:border-primary/30';
          if (selected !== null) {
            if (i === q.correct_index) style = 'border-primary bg-primary/10 glow-sm';
            else if (i === selected) style = 'border-coral-bloom bg-coral-bloom/10';
          }
          return (
            <motion.button
              key={i}
              onClick={() => handleSelect(i)}
              className={`w-full text-left p-3 rounded-xl border text-sm font-medium text-foreground transition-all ${style}`}
              animate={selected === i && i !== q.correct_index ? { x: [0, -5, 5, -5, 0] } : {}}
              transition={{ duration: 0.4 }}
            >
              <div className="flex items-center justify-between">
                <span>{opt}</span>
                {selected !== null && i === q.correct_index && <CheckCircle className="w-4 h-4 text-primary" />}
                {selected === i && i !== q.correct_index && <XCircle className="w-4 h-4 text-coral-bloom" />}
              </div>
            </motion.button>
          );
        })}
      </div>

      {selected !== null && (
        <motion.p initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="text-sm text-muted-foreground bg-accent rounded-xl p-3">
          {q.explanation}
        </motion.p>
      )}
    </div>
  );
}

export default function LearnPage() {
  const [selectedTopic, setSelectedTopic] = useState<string | null>(null);
  const [selectedLesson, setSelectedLesson] = useState<Lesson | null>(null);
  const topics = Object.entries(TOPIC_INFO);

  if (selectedLesson) {
    return (
      <div className="p-4 md:p-6 max-w-2xl mx-auto space-y-6">
        <button onClick={() => setSelectedLesson(null)} className="flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground transition-colors">
          <ArrowLeft className="w-4 h-4" /> Back to lessons
        </button>
        <div className="rounded-2xl border border-border bg-card/60 p-6">
          <h2 className="font-display font-bold text-2xl text-foreground mb-2">{selectedLesson.title}</h2>
          <div className="flex items-center gap-3 text-xs text-muted-foreground mb-6">
            <span className="flex items-center gap-1"><Clock className="w-3 h-3" /> {selectedLesson.estimated_minutes} min</span>
            <span className="flex items-center gap-1"><Leaf className="w-3 h-3" /> {selectedLesson.eco_points_reward} pts</span>
          </div>

          {selectedLesson.content_type === 'quiz' ? (
            <QuizView questions={(selectedLesson.content_json as QuizContent).questions} onComplete={() => {}} />
          ) : (
            <div className="prose prose-invert prose-sm max-w-none">
              <p className="text-foreground/80 leading-relaxed">
                {(selectedLesson.content_json as any).body}
              </p>
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
      <div className="p-4 md:p-6 space-y-6">
        <button onClick={() => setSelectedTopic(null)} className="flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground transition-colors">
          <ArrowLeft className="w-4 h-4" /> Back to topics
        </button>
        <h1 className="font-display font-bold text-2xl text-foreground">{info.icon} {info.label}</h1>
        <div className="space-y-3">
          {topicLessons.map((l, i) => (
            <motion.div
              key={l.id}
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: i * 0.1 }}
              onClick={() => setSelectedLesson(l)}
              className="flex items-center justify-between p-4 rounded-xl border border-border bg-card/60 cursor-pointer hover:border-primary/30 transition-all"
            >
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-accent flex items-center justify-center text-lg">
                  {l.content_type === 'quiz' ? '📝' : l.content_type === 'mini_game' ? '🎮' : '📖'}
                </div>
                <div>
                  <p className="font-heading font-bold text-sm text-foreground">{l.title}</p>
                  <div className="flex items-center gap-3 text-xs text-muted-foreground mt-0.5">
                    <span>{l.estimated_minutes} min</span>
                    <span className="flex items-center gap-1"><Leaf className="w-3 h-3 text-primary" /> {l.eco_points_reward} pts</span>
                  </div>
                </div>
              </div>
              <Button size="sm" variant="outline" className="border-primary/30 text-primary">Start</Button>
            </motion.div>
          ))}
          {topicLessons.length === 0 && <p className="text-muted-foreground text-sm text-center py-8">More lessons coming soon! 🌱</p>}
        </div>
      </div>
    );
  }

  return (
    <div className="p-4 md:p-6 space-y-6">
      <motion.h1 initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="font-display font-bold text-2xl text-foreground">
        Learning Hub 📚
      </motion.h1>
      <p className="text-muted-foreground">Choose a topic to start learning about sustainability</p>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {topics.map(([key, info], i) => {
          const lessonCount = MOCK_LESSONS.filter(l => l.topic === key).length;
          return (
            <motion.div
              key={key}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.1 }}
              whileHover={{ y: -6, boxShadow: '0 0 20px hsl(153 100% 50% / 0.15)' }}
              onClick={() => setSelectedTopic(key)}
              className="rounded-2xl border border-border bg-card/60 p-6 cursor-pointer transition-all animate-breathe"
              style={{ animationDelay: `${i * 0.5}s` }}
            >
              <span className="text-4xl mb-4 block">{info.icon}</span>
              <h3 className="font-heading font-bold text-lg text-foreground mb-1">{info.label}</h3>
              <p className="text-sm text-muted-foreground">{lessonCount} lesson{lessonCount !== 1 ? 's' : ''} available</p>
            </motion.div>
          );
        })}
      </div>
    </div>
  );
}

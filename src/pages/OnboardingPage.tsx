import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { Button } from '@/components/ui/button';
import confetti from 'canvas-confetti';

const AVATARS = ['🧑‍🌾', '👩‍🔬', '🧑‍🏫', '🌿', '🦊', '🐢'];
const INTERESTS = [
  { id: 'climate_change', label: 'Climate Change', icon: '🌡️' },
  { id: 'water', label: 'Water', icon: '💧' },
  { id: 'waste', label: 'Waste', icon: '♻️' },
  { id: 'energy', label: 'Energy', icon: '⚡' },
  { id: 'biodiversity', label: 'Biodiversity', icon: '🦋' },
  { id: 'transport', label: 'Transport', icon: '🚲' },
];

export default function OnboardingPage() {
  const navigate = useNavigate();
  const [step, setStep] = useState(0);
  const [avatar, setAvatar] = useState('');
  const [interests, setInterests] = useState<string[]>([]);
  const [goal, setGoal] = useState(2);

  const toggleInterest = (id: string) => {
    setInterests(prev => prev.includes(id) ? prev.filter(i => i !== id) : prev.length < 6 ? [...prev, id] : prev);
  };

  const finish = () => {
    confetti({ particleCount: 150, spread: 70, origin: { y: 0.6 }, colors: ['#40916C', '#F4A261', '#48CAE4', '#52B788'] });
    setTimeout(() => navigate('/dashboard'), 2000);
  };

  const steps = [
    <motion.div key="avatar" initial={{ opacity: 0, x: 50 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -50 }} className="text-center">
      <h2 className="font-display font-bold text-2xl text-jungle-deep mb-2">Choose Your Avatar</h2>
      <p className="text-muted-foreground mb-8">Pick the character that represents you</p>
      <div className="grid grid-cols-3 gap-4 max-w-xs mx-auto mb-8">
        {AVATARS.map(a => (
          <button key={a} onClick={() => setAvatar(a)} className={`text-5xl p-4 rounded-2xl border-2 transition-all ${avatar === a ? 'border-primary bg-jungle-pale scale-110 shadow-card' : 'border-border bg-card hover:border-primary/30'}`}>
            {a}
          </button>
        ))}
      </div>
      <Button onClick={() => setStep(1)} disabled={!avatar} className="font-heading font-bold rounded-xl shadow-card">Next</Button>
    </motion.div>,

    <motion.div key="interests" initial={{ opacity: 0, x: 50 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -50 }} className="text-center">
      <h2 className="font-display font-bold text-2xl text-jungle-deep mb-2">What interests you?</h2>
      <p className="text-muted-foreground mb-8">Choose the areas you care about</p>
      <div className="grid grid-cols-2 gap-3 max-w-sm mx-auto mb-8">
        {INTERESTS.map(i => (
          <button key={i.id} onClick={() => toggleInterest(i.id)} className={`flex items-center gap-2 p-3 rounded-xl border-2 text-sm font-heading font-semibold transition-all ${interests.includes(i.id) ? 'border-primary bg-jungle-pale text-jungle-bright shadow-card' : 'border-border bg-card text-foreground hover:border-primary/30'}`}>
            <span className="text-xl">{i.icon}</span>{i.label}
          </button>
        ))}
      </div>
      <div className="flex gap-3 justify-center">
        <Button variant="outline" onClick={() => setStep(0)} className="rounded-xl">Back</Button>
        <Button onClick={() => setStep(2)} disabled={interests.length === 0} className="font-heading font-bold rounded-xl shadow-card">Next</Button>
      </div>
    </motion.div>,

    <motion.div key="goal" initial={{ opacity: 0, x: 50 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -50 }} className="text-center">
      <h2 className="font-display font-bold text-2xl text-jungle-deep mb-2">Set Your Daily Goal</h2>
      <p className="text-muted-foreground mb-8">How many missions per day?</p>
      <div className="flex gap-4 justify-center mb-8">
        {[1, 2, 3].map(g => (
          <button key={g} onClick={() => setGoal(g)} className={`w-20 h-20 rounded-2xl border-2 text-2xl font-mono-stat font-bold transition-all ${goal === g ? 'border-primary bg-jungle-pale text-jungle-bright scale-110 shadow-card' : 'border-border bg-card text-foreground hover:border-primary/30'}`}>
            {g}
          </button>
        ))}
      </div>
      <p className="text-sm text-muted-foreground mb-8">{goal === 1 ? 'Casual' : goal === 2 ? 'Regular' : 'Hardcore'} — {goal * 50}+ EcoPoints/day</p>
      <div className="flex gap-3 justify-center">
        <Button variant="outline" onClick={() => setStep(1)} className="rounded-xl">Back</Button>
        <Button onClick={() => setStep(3)} className="font-heading font-bold rounded-xl shadow-card">Next</Button>
      </div>
    </motion.div>,

    <motion.div key="welcome" initial={{ opacity: 0, scale: 0.8 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0 }} className="text-center">
      <motion.div initial={{ scale: 0 }} animate={{ scale: 1 }} transition={{ type: 'spring', delay: 0.3 }} className="text-8xl mb-6">🌱</motion.div>
      <h2 className="font-display font-bold text-3xl text-jungle-deep mb-3">Welcome to EcoQuest!</h2>
      <p className="text-muted-foreground mb-4">Your journey begins here. This tiny seedling is your ecosystem.</p>
      <p className="text-primary font-heading font-bold text-lg mb-8">Level 1 — 🌱 Seed</p>
      <Button onClick={finish} className="font-heading font-bold text-lg px-8 py-6 rounded-xl shadow-card">
        Enter My Ecosystem 🌍
      </Button>
    </motion.div>,
  ];

  return (
    <div className="min-h-screen bg-gradient-warm flex flex-col items-center justify-center p-6">
      <div className="flex gap-2 mb-12">
        {[0, 1, 2, 3].map(i => (
          <div key={i} className={`h-2 rounded-full transition-all duration-500 ${i <= step ? 'w-12 bg-primary' : 'w-6 bg-border'}`} />
        ))}
      </div>
      <div className="w-full max-w-lg">
        <AnimatePresence mode="wait">{steps[step]}</AnimatePresence>
      </div>
    </div>
  );
}

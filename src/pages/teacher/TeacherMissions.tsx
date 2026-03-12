import { useState } from 'react';
import { motion } from 'framer-motion';
import { useTeacherData } from '@/hooks/useTeacherData';
import { useAuth } from '@/hooks/useAuth';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Leaf, Plus, Camera, MapPin, Users } from 'lucide-react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Checkbox } from '@/components/ui/checkbox';

const CATEGORIES = [
  { value: 'planting', label: '🌱 Planting' },
  { value: 'waste', label: '♻️ Waste' },
  { value: 'energy', label: '⚡ Energy' },
  { value: 'water', label: '💧 Water' },
  { value: 'transport', label: '🚲 Transport' },
  { value: 'biodiversity', label: '🦋 Biodiversity' },
  { value: 'campus', label: '🏫 Campus' },
];

const DIFFICULTY_POINTS: Record<string, number> = { easy: 50, medium: 100, hard: 200 };
const fadeUp = { hidden: { opacity: 0, y: 20 }, visible: { opacity: 1, y: 0 } };

export default function TeacherMissions() {
  const { user } = useAuth();
  const { missions, missionCompletions, createMission } = useTeacherData();
  const [tab, setTab] = useState<'all' | 'custom'>('all');
  const [modalOpen, setModalOpen] = useState(false);

  const [form, setForm] = useState({
    title: '',
    description: '',
    category: 'planting',
    difficulty: 'easy',
    eco_points_reward: 50,
    requires_photo: true,
    requires_location: false,
    school_only: true,
    expires_at: '',
  });

  // All Missions tab: show everything, custom at top
  const allMissionsSorted = [...missions].sort((a, b) => {
    const aCustom = !!a.created_by;
    const bCustom = !!b.created_by;
    if (aCustom && !bCustom) return -1;
    if (!aCustom && bCustom) return 1;
    return 0;
  });
  const customMissions = missions.filter(m => m.created_by === user?.id);

  const handleCreate = () => {
    createMission.mutate({
      ...form,
      expires_at: form.expires_at || undefined,
    });
    setModalOpen(false);
    setForm({ title: '', description: '', category: 'planting', difficulty: 'easy', eco_points_reward: 50, requires_photo: true, requires_location: false, school_only: true, expires_at: '' });
  };

  const displayed = tab === 'all' ? allMissions : customMissions;

  return (
    <div className="p-4 md:p-6 max-w-6xl mx-auto space-y-6">
      <div className="flex items-center justify-between flex-wrap gap-3">
        <h1 className="font-display font-bold text-3xl text-jungle-deep">Missions</h1>
        <Button onClick={() => setModalOpen(true)} className="rounded-xl font-heading font-bold bg-jungle-bright hover:bg-jungle-mid text-white">
          <Plus className="w-4 h-4 mr-2" /> Create Mission
        </Button>
      </div>

      <div className="flex gap-2">
        {(['all', 'custom'] as const).map(t => (
          <button
            key={t}
            onClick={() => setTab(t)}
            className={`px-4 py-2 rounded-full text-sm font-heading font-semibold transition-all ${
              tab === t ? 'bg-primary text-primary-foreground shadow-card' : 'bg-card border border-border text-muted-foreground'
            }`}
          >
            {t === 'all' ? 'All Missions' : 'My Custom Missions'}
          </button>
        ))}
      </div>

      {displayed.length === 0 ? (
        <div className="bg-card rounded-[20px] shadow-card p-12 text-center">
          <span className="text-5xl block mb-4">🌿</span>
          <p className="font-heading font-bold text-foreground text-lg">
            {tab === 'custom' ? 'No custom missions yet' : 'No missions found'}
          </p>
          <p className="text-sm text-muted-foreground">
            {tab === 'custom' ? 'Create one for your class! 🌿' : ''}
          </p>
        </div>
      ) : (
        <motion.div
          className="grid grid-cols-1 md:grid-cols-2 gap-4"
          initial="hidden" animate="visible"
          variants={{ hidden: {}, visible: { transition: { staggerChildren: 0.05 } } }}
        >
          {displayed.map(m => (
            <motion.div key={m.id} variants={fadeUp} className="bg-card rounded-[20px] shadow-card p-5">
              <div className="flex items-start justify-between mb-3">
                <div className="flex items-center gap-3">
                  <span className="text-2xl">{m.icon}</span>
                  <div>
                    <p className="font-heading font-bold text-foreground">{m.title}</p>
                    <span className={`text-xs px-2 py-0.5 rounded-full font-heading font-bold ${
                      m.difficulty === 'easy' ? 'bg-jungle-pale text-jungle-bright' :
                      m.difficulty === 'medium' ? 'bg-sun-gold/10 text-sun-gold' :
                      'bg-coral/10 text-coral'
                    }`}>{m.difficulty}</span>
                  </div>
                </div>
                <span className="font-mono-stat text-sm font-bold text-jungle-bright flex items-center gap-1">
                  <Leaf className="w-3 h-3" /> {m.eco_points_reward}
                </span>
              </div>
              <p className="text-sm text-muted-foreground line-clamp-2 mb-3">{m.description}</p>
              <div className="flex items-center justify-between">
                <div className="flex gap-2 text-xs text-muted-foreground">
                  {m.requires_photo && <span className="flex items-center gap-1"><Camera className="w-3 h-3" /> Photo</span>}
                  {m.requires_location && <span className="flex items-center gap-1"><MapPin className="w-3 h-3" /> Location</span>}
                </div>
                <span className="flex items-center gap-1 text-xs text-muted-foreground">
                  <Users className="w-3 h-3" /> {missionCompletions[m.id] || 0} completed
                </span>
              </div>
            </motion.div>
          ))}
        </motion.div>
      )}

      {/* Create Mission Modal */}
      <Dialog open={modalOpen} onOpenChange={setModalOpen}>
        <DialogContent className="max-w-lg">
          <DialogHeader>
            <DialogTitle className="font-display font-bold text-xl">Create Mission</DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            <div className="space-y-2">
              <Label>Mission Title *</Label>
              <Input value={form.title} onChange={e => setForm({ ...form, title: e.target.value })} placeholder="e.g. Plant a school garden" className="rounded-xl" />
            </div>
            <div className="space-y-2">
              <Label>Description *</Label>
              <textarea
                value={form.description}
                onChange={e => setForm({ ...form, description: e.target.value })}
                placeholder="Describe what students need to do..."
                className="w-full rounded-xl border border-input bg-background p-3 text-sm min-h-[80px] resize-none focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none"
              />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label>Category</Label>
                <Select value={form.category} onValueChange={v => setForm({ ...form, category: v })}>
                  <SelectTrigger className="rounded-xl"><SelectValue /></SelectTrigger>
                  <SelectContent>
                    {CATEGORIES.map(c => (
                      <SelectItem key={c.value} value={c.value}>{c.label}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label>Difficulty</Label>
                <Select value={form.difficulty} onValueChange={v => setForm({ ...form, difficulty: v, eco_points_reward: DIFFICULTY_POINTS[v] })}>
                  <SelectTrigger className="rounded-xl"><SelectValue /></SelectTrigger>
                  <SelectContent>
                    <SelectItem value="easy">Easy (50pts)</SelectItem>
                    <SelectItem value="medium">Medium (100pts)</SelectItem>
                    <SelectItem value="hard">Hard (200pts)</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
            <div className="space-y-2">
              <Label>Custom EcoPoints (10–300)</Label>
              <Input
                type="number"
                min={10}
                max={300}
                value={form.eco_points_reward}
                onChange={e => setForm({ ...form, eco_points_reward: Math.min(300, Math.max(10, parseInt(e.target.value) || 10)) })}
                className="rounded-xl"
              />
            </div>
            <div className="flex gap-6">
              <label className="flex items-center gap-2 text-sm">
                <Checkbox checked={form.requires_photo} onCheckedChange={v => setForm({ ...form, requires_photo: !!v })} />
                Photo required
              </label>
              <label className="flex items-center gap-2 text-sm">
                <Checkbox checked={form.requires_location} onCheckedChange={v => setForm({ ...form, requires_location: !!v })} />
                Location required
              </label>
            </div>
            <div className="flex gap-6">
              <label className="flex items-center gap-2 text-sm">
                <Checkbox checked={form.school_only} onCheckedChange={v => setForm({ ...form, school_only: !!v })} />
                My class only
              </label>
            </div>
            <div className="space-y-2">
              <Label>Expiry Date (optional)</Label>
              <Input type="date" value={form.expires_at} onChange={e => setForm({ ...form, expires_at: e.target.value })} className="rounded-xl" />
            </div>
            <Button
              onClick={handleCreate}
              disabled={!form.title || !form.description || createMission.isPending}
              className="w-full rounded-xl font-heading font-bold bg-jungle-bright hover:bg-jungle-mid text-white"
            >
              Save Mission
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}

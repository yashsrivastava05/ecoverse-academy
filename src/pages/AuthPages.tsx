import { useState, useRef } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';

const SUGGESTED_SCHOOLS = ['Maharana Pratap School', 'Green Valley Academy', 'Sunrise International', 'Nordic Nature School'];

export default function LoginPage() {
  const navigate = useNavigate();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    navigate('/dashboard');
  };

  return (
    <div className="min-h-screen bg-background flex">
      <div className="hidden lg:flex flex-1 items-center justify-center p-12 bg-jungle-pale/30">
        <div className="text-center">
          <motion.div initial={{ scale: 0 }} animate={{ scale: 1 }} transition={{ type: 'spring', duration: 1 }} className="text-8xl mb-6">🌍</motion.div>
          <h2 className="font-display font-bold text-3xl text-jungle-deep mb-3">Welcome Back, Explorer</h2>
          <p className="text-muted-foreground max-w-sm">Your ecosystem misses you. Continue your journey to save the planet.</p>
        </div>
      </div>

      <div className="flex-1 flex items-center justify-center p-6">
        <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} className="w-full max-w-md">
          <div className="flex items-center gap-2 mb-8">
            <span className="text-2xl">🌿</span>
            <span className="font-display font-bold text-jungle-deep text-xl">EcoQuest</span>
          </div>
          <h1 className="font-display font-bold text-3xl text-jungle-deep mb-2">Log In</h1>
          <p className="text-muted-foreground mb-8">Enter your credentials to continue</p>

          <form onSubmit={handleLogin} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="email">Email</Label>
              <Input id="email" type="email" placeholder="your@email.com" value={email} onChange={e => setEmail(e.target.value)} className="rounded-xl" />
            </div>
            <div className="space-y-2">
              <Label htmlFor="password">Password</Label>
              <Input id="password" type="password" placeholder="••••••••" value={password} onChange={e => setPassword(e.target.value)} className="rounded-xl" />
            </div>
            <Button type="submit" className="w-full font-heading font-bold rounded-xl shadow-card">Log In</Button>
          </form>

          <p className="text-center text-sm text-muted-foreground mt-6">
            Don't have an account? <Link to="/signup" className="text-primary hover:underline font-semibold">Sign Up</Link>
          </p>
        </motion.div>
      </div>
    </div>
  );
}

export function SignupPage() {
  const navigate = useNavigate();
  const [form, setForm] = useState({ name: '', email: '', password: '', role: 'student', school: '' });
  const [showSuggestions, setShowSuggestions] = useState(false);
  const filteredSchools = SUGGESTED_SCHOOLS.filter(s => s.toLowerCase().includes(form.school.toLowerCase()) && form.school.length > 0);

  const handleSignup = (e: React.FormEvent) => {
    e.preventDefault();
    navigate('/onboarding');
  };

  return (
    <div className="min-h-screen bg-background flex">
      <div className="hidden lg:flex flex-1 items-center justify-center p-12 bg-jungle-pale/30">
        <div className="text-center">
          <motion.div initial={{ scale: 0 }} animate={{ scale: 1 }} transition={{ type: 'spring', duration: 1 }} className="text-8xl mb-6">🌱</motion.div>
          <h2 className="font-display font-bold text-3xl text-jungle-deep mb-3">Start as a Seed</h2>
          <p className="text-muted-foreground max-w-sm">Your journey to Planet Guardian begins here. Grow your ecosystem one mission at a time.</p>
          <div className="mt-6 inline-flex items-center gap-2 rounded-full bg-jungle-pale px-4 py-2 text-sm text-jungle-bright font-heading font-bold">
            You'll start as 🌱 Seed — Level 1
          </div>
        </div>
      </div>

      <div className="flex-1 flex items-center justify-center p-6">
        <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} className="w-full max-w-md">
          <div className="flex items-center gap-2 mb-8">
            <span className="text-2xl">🌿</span>
            <span className="font-display font-bold text-jungle-deep text-xl">EcoQuest</span>
          </div>
          <h1 className="font-display font-bold text-3xl text-jungle-deep mb-2">Create Account</h1>
          <p className="text-muted-foreground mb-8">Join the movement to save the planet</p>

          <form onSubmit={handleSignup} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="name">Full Name</Label>
              <Input id="name" placeholder="Your name" value={form.name} onChange={e => setForm({ ...form, name: e.target.value })} className="rounded-xl" />
            </div>
            <div className="space-y-2">
              <Label htmlFor="s-email">Email</Label>
              <Input id="s-email" type="email" placeholder="your@email.com" value={form.email} onChange={e => setForm({ ...form, email: e.target.value })} className="rounded-xl" />
            </div>
            <div className="space-y-2">
              <Label htmlFor="s-password">Password</Label>
              <Input id="s-password" type="password" placeholder="••••••••" value={form.password} onChange={e => setForm({ ...form, password: e.target.value })} className="rounded-xl" />
            </div>
            <div className="space-y-2">
              <Label htmlFor="role">I am a</Label>
              <select id="role" value={form.role} onChange={e => setForm({ ...form, role: e.target.value })}
                className="flex h-10 w-full rounded-xl border border-input bg-card px-3 py-2 text-sm text-foreground">
                <option value="student">Student</option>
                <option value="teacher">Teacher</option>
                <option value="school_admin">School Admin</option>
              </select>
            </div>
            <div className="space-y-2">
              <Label htmlFor="school">School</Label>
              <select id="school" value={form.school_id} onChange={e => setForm({ ...form, school_id: e.target.value })}
                className="flex h-10 w-full rounded-xl border border-input bg-card px-3 py-2 text-sm text-foreground">
                <option value="">Select a school</option>
                {MOCK_SCHOOLS.map(s => (
                  <option key={s.id} value={s.id}>{s.name} — {s.city}</option>
                ))}
              </select>
            </div>
            <Button type="submit" className="w-full font-heading font-bold rounded-xl shadow-card">Create Account</Button>
          </form>

          <p className="text-center text-sm text-muted-foreground mt-6">
            Already have an account? <Link to="/login" className="text-primary hover:underline font-semibold">Log In</Link>
          </p>
        </motion.div>
      </div>
    </div>
  );
}

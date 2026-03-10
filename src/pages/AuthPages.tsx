import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useAuth } from '@/hooks/useAuth';
import { useToast } from '@/hooks/use-toast';
import { Loader2 } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';

export default function LoginPage() {
  const navigate = useNavigate();
  const { signIn } = useAuth();
  const { toast } = useToast();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    const { error } = await signIn(email, password);
    if (error) {
      setLoading(false);
      toast({ title: 'Login failed', description: error.message, variant: 'destructive' });
      return;
    }
    // Check role to determine redirect
    const { data: { user } } = await supabase.auth.getUser();
    if (user) {
      const { data: roles } = await supabase
        .from('user_roles')
        .select('role')
        .eq('user_id', user.id);
      const roleList = (roles ?? []).map(r => r.role);
      if (roleList.includes('teacher') || roleList.includes('school_admin')) {
        navigate('/teacher');
      } else {
        navigate('/dashboard');
      }
    } else {
      navigate('/dashboard');
    }
    setLoading(false);
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
              <Input id="email" type="email" placeholder="your@email.com" value={email} onChange={e => setEmail(e.target.value)} className="rounded-xl" required />
            </div>
            <div className="space-y-2">
              <Label htmlFor="password">Password</Label>
              <Input id="password" type="password" placeholder="••••••••" value={password} onChange={e => setPassword(e.target.value)} className="rounded-xl" required />
            </div>
            <Button type="submit" className="w-full font-heading font-bold rounded-xl shadow-card" disabled={loading}>
              {loading && <Loader2 className="w-4 h-4 animate-spin mr-2" />} Log In
            </Button>
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
  const { signUp } = useAuth();
  const { toast } = useToast();
  const [form, setForm] = useState({ name: '', email: '', password: '', school: '' });
  const [loading, setLoading] = useState(false);

  const handleSignup = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    const { error } = await signUp(form.email, form.password, form.name);
    setLoading(false);
    if (error) {
      toast({ title: 'Signup failed', description: error.message, variant: 'destructive' });
    } else {
      navigate('/onboarding');
    }
  };

  return (
    <div className="min-h-screen bg-background flex">
      <div className="hidden lg:flex flex-1 items-center justify-center p-12 bg-jungle-pale/30">
        <div className="text-center">
          <motion.div initial={{ scale: 0 }} animate={{ scale: 1 }} transition={{ type: 'spring', duration: 1 }} className="text-8xl mb-6">🌱</motion.div>
          <h2 className="font-display font-bold text-3xl text-jungle-deep mb-3">Start as a Seed</h2>
          <p className="text-muted-foreground max-w-sm">Your journey to Planet Guardian begins here.</p>
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
              <Input id="name" placeholder="Your name" value={form.name} onChange={e => setForm({ ...form, name: e.target.value })} className="rounded-xl" required />
            </div>
            <div className="space-y-2">
              <Label htmlFor="s-email">Email</Label>
              <Input id="s-email" type="email" placeholder="your@email.com" value={form.email} onChange={e => setForm({ ...form, email: e.target.value })} className="rounded-xl" required />
            </div>
            <div className="space-y-2">
              <Label htmlFor="s-password">Password</Label>
              <Input id="s-password" type="password" placeholder="••••••••" value={form.password} onChange={e => setForm({ ...form, password: e.target.value })} className="rounded-xl" required minLength={6} />
            </div>
            <div className="space-y-2">
              <Label htmlFor="school">School (optional)</Label>
              <Input id="school" placeholder="Your school name" value={form.school} onChange={e => setForm({ ...form, school: e.target.value })} className="rounded-xl" />
            </div>
            <Button type="submit" className="w-full font-heading font-bold rounded-xl shadow-card" disabled={loading}>
              {loading && <Loader2 className="w-4 h-4 animate-spin mr-2" />} Create Account
            </Button>
          </form>

          <p className="text-center text-sm text-muted-foreground mt-6">
            Already have an account? <Link to="/login" className="text-primary hover:underline font-semibold">Log In</Link>
          </p>
        </motion.div>
      </div>
    </div>
  );
}

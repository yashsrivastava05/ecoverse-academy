import { useState } from 'react';
import { motion } from 'framer-motion';
import { useAuth } from '@/hooks/useAuth';
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Pencil, X, Check, Users, CheckCircle, Target } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { format } from 'date-fns';

const AVATARS = ['🌿', '🌻', '🦉', '🌊', '🌍', '🦋'];
const fadeUp = { hidden: { opacity: 0, y: 20 }, visible: { opacity: 1, y: 0 } };

export default function TeacherProfile() {
  const { profile, user, refreshProfile } = useAuth();
  const { toast } = useToast();
  const [editing, setEditing] = useState(false);
  const [avatarPicking, setAvatarPicking] = useState(false);
  const [form, setForm] = useState({
    full_name: profile?.full_name ?? '',
    school_name: profile?.school_name ?? '',
    city: profile?.city ?? '',
  });

  // Stats
  const { data: studentCount = 0 } = useQuery({
    queryKey: ['teacher-profile-students', profile?.school_name],
    queryFn: async () => {
      let q = supabase.from('profiles').select('id', { count: 'exact', head: true });
      if (profile?.school_name) q = q.eq('school_name', profile.school_name);
      q = q.neq('id', user!.id);
      const { count } = await q;
      return count ?? 0;
    },
    enabled: !!user,
  });

  const { data: approvedCount = 0 } = useQuery({
    queryKey: ['teacher-profile-approved', user?.id],
    queryFn: async () => {
      const { count } = await supabase
        .from('mission_submissions')
        .select('id', { count: 'exact', head: true })
        .eq('reviewed_by', user!.id)
        .eq('status', 'approved');
      return count ?? 0;
    },
    enabled: !!user,
  });

  const { data: customMissionCount = 0 } = useQuery({
    queryKey: ['teacher-profile-missions', user?.id],
    queryFn: async () => {
      const { count } = await supabase
        .from('missions')
        .select('id', { count: 'exact', head: true })
        .eq('created_by', user!.id);
      return count ?? 0;
    },
    enabled: !!user,
  });

  // Recent activity
  const { data: recentActivity = [] } = useQuery({
    queryKey: ['teacher-profile-activity', user?.id],
    queryFn: async () => {
      const { data } = await supabase
        .from('mission_submissions')
        .select('id, status, reviewed_at, user_id, missions(title, eco_points_reward)')
        .eq('reviewed_by', user!.id)
        .in('status', ['approved', 'rejected'])
        .order('reviewed_at', { ascending: false })
        .limit(10);
      if (!data || data.length === 0) return [];
      const userIds = [...new Set(data.map(d => d.user_id))];
      const { data: profiles } = await supabase.from('profiles').select('id, full_name').in('id', userIds);
      const profileMap = Object.fromEntries((profiles ?? []).map(p => [p.id, p.full_name]));
      return data.map(d => ({
        id: d.id,
        status: d.status,
        reviewed_at: d.reviewed_at,
        student_name: profileMap[d.user_id] ?? 'Student',
        mission_title: (d.missions as any)?.title ?? 'Mission',
        points: (d.missions as any)?.eco_points_reward ?? 0,
      }));
    },
    enabled: !!user,
  });

  const handleSave = async () => {
    const { error } = await supabase.from('profiles').update(form).eq('id', user!.id);
    if (error) {
      toast({ title: 'Error saving', description: error.message, variant: 'destructive' });
    } else {
      toast({ title: 'Profile updated! 🌿' });
      await refreshProfile();
      setEditing(false);
    }
  };

  const handleAvatarChange = async (emoji: string) => {
    await supabase.from('profiles').update({ avatar_emoji: emoji }).eq('id', user!.id);
    await refreshProfile();
    setAvatarPicking(false);
    toast({ title: 'Avatar updated! ' + emoji });
  };

  const stats = [
    { label: 'Total Students', value: studentCount, icon: Users, color: '#40916C' },
    { label: 'Missions Approved', value: approvedCount, icon: CheckCircle, color: '#48CAE4' },
    { label: 'Custom Missions', value: customMissionCount, icon: Target, color: '#F4A261' },
  ];

  if (!profile) return null;

  return (
    <motion.div className="p-4 md:p-6 max-w-3xl mx-auto space-y-6" initial="hidden" animate="visible" variants={{ hidden: {}, visible: { transition: { staggerChildren: 0.08 } } }}>
      {/* Hero */}
      <motion.div variants={fadeUp} className="bg-card rounded-[20px] shadow-card p-6 text-center">
        <div className="relative inline-block">
          <span className="w-20 h-20 rounded-full bg-jungle-pale border-4 border-jungle-light flex items-center justify-center text-4xl mx-auto">
            {profile.avatar_emoji}
          </span>
          <button
            onClick={() => setAvatarPicking(!avatarPicking)}
            className="absolute -bottom-1 -right-1 w-7 h-7 rounded-full bg-primary text-primary-foreground flex items-center justify-center text-xs shadow-card"
          >
            <Pencil className="w-3 h-3" />
          </button>
        </div>

        {avatarPicking && (
          <div className="flex justify-center gap-3 mt-3">
            {AVATARS.map(a => (
              <button key={a} onClick={() => handleAvatarChange(a)} className="w-10 h-10 rounded-full bg-muted hover:bg-jungle-pale transition-colors flex items-center justify-center text-xl">
                {a}
              </button>
            ))}
          </div>
        )}

        {editing ? (
          <div className="mt-4 space-y-3 max-w-sm mx-auto text-left">
            <div>
              <label className="text-xs font-heading font-bold text-muted-foreground">Full Name</label>
              <Input value={form.full_name} onChange={e => setForm({ ...form, full_name: e.target.value })} className="rounded-xl mt-1" />
            </div>
            <div>
              <label className="text-xs font-heading font-bold text-muted-foreground">School Name</label>
              <Input value={form.school_name} onChange={e => setForm({ ...form, school_name: e.target.value })} className="rounded-xl mt-1" />
            </div>
            <div>
              <label className="text-xs font-heading font-bold text-muted-foreground">City</label>
              <Input value={form.city} onChange={e => setForm({ ...form, city: e.target.value })} className="rounded-xl mt-1" />
            </div>
            <div className="flex gap-2 justify-center">
              <Button onClick={handleSave} size="sm" className="rounded-xl font-heading font-bold bg-jungle-bright hover:bg-jungle-mid text-white">
                <Check className="w-3 h-3 mr-1" /> Save
              </Button>
              <Button onClick={() => setEditing(false)} size="sm" variant="outline" className="rounded-xl font-heading font-bold">
                <X className="w-3 h-3 mr-1" /> Cancel
              </Button>
            </div>
          </div>
        ) : (
          <>
            <h1 className="font-display font-black text-[28px] text-foreground mt-3">{profile.full_name}</h1>
            <p className="text-sm text-muted-foreground">{profile.school_name}{profile.city ? ` · ${profile.city}` : ''}</p>
            <span className="inline-block mt-2 text-xs font-heading font-bold px-3 py-1 rounded-full bg-muted text-muted-foreground">
              Member since {format(new Date(profile.created_at), 'MMMM yyyy')}
            </span>
            <div className="mt-3">
              <Button onClick={() => { setForm({ full_name: profile.full_name, school_name: profile.school_name, city: profile.city }); setEditing(true); }} size="sm" variant="outline" className="rounded-xl font-heading font-bold">
                <Pencil className="w-3 h-3 mr-1" /> Edit Profile
              </Button>
            </div>
          </>
        )}
      </motion.div>

      {/* Stats */}
      <motion.div variants={fadeUp} className="grid grid-cols-3 gap-4">
        {stats.map(s => (
          <div key={s.label} className="bg-card rounded-[20px] shadow-card p-5 text-center" style={{ borderTop: `4px solid ${s.color}` }}>
            <s.icon className="w-6 h-6 mx-auto mb-2" style={{ color: s.color }} />
            <p className="font-display font-bold text-2xl text-foreground">{s.value}</p>
            <p className="text-xs text-muted-foreground font-heading font-semibold mt-1">{s.label}</p>
          </div>
        ))}
      </motion.div>

      {/* Recent Activity */}
      <motion.div variants={fadeUp} className="bg-card rounded-[20px] shadow-card p-5">
        <h2 className="font-heading font-bold text-foreground mb-4">Recent Activity</h2>
        {recentActivity.length === 0 ? (
          <p className="text-sm text-muted-foreground text-center py-6">No review activity yet 🌱</p>
        ) : (
          <div className="space-y-3">
            {recentActivity.map(a => (
              <div key={a.id} className="flex items-center justify-between p-3 rounded-xl bg-muted/30">
                <div className="min-w-0 flex-1">
                  <p className="text-sm font-heading font-bold text-foreground truncate">{a.student_name}</p>
                  <p className="text-xs text-muted-foreground truncate">{a.mission_title}</p>
                </div>
                <div className="flex items-center gap-2 shrink-0 ml-3">
                  <span className={`text-xs px-2 py-0.5 rounded-full font-heading font-bold ${
                    a.status === 'approved' ? 'bg-jungle-pale text-jungle-bright' : 'bg-coral/10 text-coral'
                  }`}>
                    {a.status === 'approved' ? '✓ Approved' : '✗ Rejected'}
                  </span>
                  {a.status === 'approved' && (
                    <span className="text-xs font-mono-stat font-bold text-jungle-bright">+{a.points}</span>
                  )}
                  {a.reviewed_at && (
                    <span className="text-xs text-muted-foreground">{format(new Date(a.reviewed_at), 'MMM d')}</span>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}
      </motion.div>
    </motion.div>
  );
}

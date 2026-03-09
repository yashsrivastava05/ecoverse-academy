import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from './useAuth';
import { useToast } from './use-toast';

export function useTeacherData() {
  const { user, profile } = useAuth();
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const userId = user?.id;
  const schoolName = profile?.school_name;

  // All students (same school or all if no school set)
  const studentsQuery = useQuery({
    queryKey: ['teacher-students', schoolName],
    queryFn: async () => {
      let query = supabase
        .from('profiles')
        .select('*')
        .order('eco_points', { ascending: false });
      
      if (schoolName) {
        query = query.eq('school_name', schoolName);
      }
      
      const { data } = await query;
      // Filter out the teacher themselves
      return (data ?? []).filter(p => p.id !== userId);
    },
    enabled: !!userId,
  });

  // All submissions (for teacher review)
  const submissionsQuery = useQuery({
    queryKey: ['teacher-submissions'],
    queryFn: async () => {
      const { data } = await supabase
        .from('mission_submissions')
        .select('*, missions(*)')
        .order('submitted_at', { ascending: false });
      return data ?? [];
    },
    enabled: !!userId,
  });

  // Pending count
  const pendingCount = (submissionsQuery.data ?? []).filter(s => s.status === 'pending').length;

  // Weekly approved count
  const weeklyApprovedQuery = useQuery({
    queryKey: ['teacher-weekly-approved'],
    queryFn: async () => {
      const sevenDaysAgo = new Date();
      sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7);
      const { data } = await supabase
        .from('mission_submissions')
        .select('id')
        .eq('status', 'approved')
        .gte('submitted_at', sevenDaysAgo.toISOString());
      return data?.length ?? 0;
    },
    enabled: !!userId,
  });

  // Class total eco points
  const classTotalPoints = (studentsQuery.data ?? []).reduce((sum, s) => sum + s.eco_points, 0);

  // Active students this week
  const activeThisWeekQuery = useQuery({
    queryKey: ['teacher-active-week'],
    queryFn: async () => {
      const sevenDaysAgo = new Date();
      sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7);
      const { data } = await supabase
        .from('daily_points')
        .select('user_id')
        .gte('date', sevenDaysAgo.toISOString().split('T')[0]);
      const uniqueUsers = new Set((data ?? []).map(d => d.user_id));
      return uniqueUsers.size;
    },
    enabled: !!userId,
  });

  // Class daily points for chart (last 7 days)
  const classWeeklyQuery = useQuery({
    queryKey: ['teacher-class-weekly'],
    queryFn: async () => {
      const sevenDaysAgo = new Date();
      sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 6);
      const { data } = await supabase
        .from('daily_points')
        .select('date, points_earned')
        .gte('date', sevenDaysAgo.toISOString().split('T')[0])
        .order('date', { ascending: true });
      
      // Aggregate by date
      const byDate: Record<string, number> = {};
      (data ?? []).forEach(d => {
        byDate[d.date] = (byDate[d.date] || 0) + d.points_earned;
      });
      
      // Fill 7 days
      const result = [];
      for (let i = 6; i >= 0; i--) {
        const date = new Date();
        date.setDate(date.getDate() - i);
        const key = date.toISOString().split('T')[0];
        const dayName = date.toLocaleDateString('en', { weekday: 'short' });
        result.push({ date: key, day: dayName, points: byDate[key] || 0 });
      }
      return result;
    },
    enabled: !!userId,
  });

  // Top 5 students this week
  const topStudentsWeekQuery = useQuery({
    queryKey: ['teacher-top-students-week'],
    queryFn: async () => {
      const sevenDaysAgo = new Date();
      sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7);
      const { data } = await supabase
        .from('daily_points')
        .select('user_id, points_earned')
        .gte('date', sevenDaysAgo.toISOString().split('T')[0]);
      
      const byUser: Record<string, number> = {};
      (data ?? []).forEach(d => {
        byUser[d.user_id] = (byUser[d.user_id] || 0) + d.points_earned;
      });
      
      const sorted = Object.entries(byUser)
        .sort(([, a], [, b]) => b - a)
        .slice(0, 5);
      
      // Get profiles for these users
      if (sorted.length === 0) return [];
      const userIds = sorted.map(([id]) => id);
      const { data: profiles } = await supabase
        .from('profiles')
        .select('id, full_name, avatar_emoji, eco_points')
        .in('id', userIds);
      
      return sorted.map(([id, weekPoints], i) => {
        const p = (profiles ?? []).find(pr => pr.id === id);
        return {
          rank: i + 1,
          user_id: id,
          full_name: p?.full_name ?? 'Unknown',
          avatar_emoji: p?.avatar_emoji ?? '🌱',
          eco_points: p?.eco_points ?? 0,
          week_points: weekPoints,
        };
      });
    },
    enabled: !!userId,
  });

  // Approve submission
  const approveSubmission = useMutation({
    mutationFn: async ({ submissionId, missionId, studentId, feedback }: { submissionId: string; missionId: string; studentId: string; feedback?: string }) => {
      // Get mission points
      const { data: mission } = await supabase
        .from('missions')
        .select('eco_points_reward, title')
        .eq('id', missionId)
        .single();
      
      if (!mission) throw new Error('Mission not found');

      // Update submission
      const { error: updateErr } = await supabase
        .from('mission_submissions')
        .update({
          status: 'approved' as const,
          reviewed_at: new Date().toISOString(),
          reviewed_by: userId,
          teacher_feedback: feedback || null,
        })
        .eq('id', submissionId);
      if (updateErr) throw updateErr;

      // Award points to student
      const { error: pointsErr } = await supabase
        .from('profiles')
        .update({ eco_points: (await supabase.from('profiles').select('eco_points').eq('id', studentId).single()).data!.eco_points + mission.eco_points_reward })
        .eq('id', studentId);
      if (pointsErr) throw pointsErr;

      // Track daily points
      const today = new Date().toISOString().split('T')[0];
      const { data: existing } = await supabase
        .from('daily_points')
        .select('*')
        .eq('user_id', studentId)
        .eq('date', today)
        .single();
      
      if (existing) {
        await supabase.from('daily_points').update({ points_earned: existing.points_earned + mission.eco_points_reward }).eq('id', existing.id);
      } else {
        await supabase.from('daily_points').insert({ user_id: studentId, date: today, points_earned: mission.eco_points_reward });
      }

      // Send notification to student
      await supabase.from('notifications').insert({
        user_id: studentId,
        title: `Mission approved! +${mission.eco_points_reward} EcoPoints 🌿`,
        body: `Your mission "${mission.title}" was approved by ${profile?.full_name ?? 'your teacher'}.${feedback ? ` Feedback: ${feedback}` : ''}`,
        type: 'mission' as const,
      });

      return { studentName: '', points: mission.eco_points_reward };
    },
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: ['teacher-submissions'] });
      queryClient.invalidateQueries({ queryKey: ['teacher-students'] });
      queryClient.invalidateQueries({ queryKey: ['teacher-weekly-approved'] });
      queryClient.invalidateQueries({ queryKey: ['teacher-class-weekly'] });
      queryClient.invalidateQueries({ queryKey: ['teacher-top-students-week'] });
      toast({ title: `Approved! 🌿`, description: `Student earned ${data.points} EcoPoints` });
    },
    onError: (err: Error) => {
      toast({ title: 'Error approving', description: err.message, variant: 'destructive' });
    },
  });

  // Reject submission
  const rejectSubmission = useMutation({
    mutationFn: async ({ submissionId, missionId, studentId, reason, feedback }: { submissionId: string; missionId: string; studentId: string; reason: string; feedback?: string }) => {
      const { data: mission } = await supabase
        .from('missions')
        .select('title')
        .eq('id', missionId)
        .single();

      const { error } = await supabase
        .from('mission_submissions')
        .update({
          status: 'rejected' as const,
          reviewed_at: new Date().toISOString(),
          reviewed_by: userId,
          teacher_feedback: `${reason}${feedback ? `. ${feedback}` : ''}`,
        })
        .eq('id', submissionId);
      if (error) throw error;

      await supabase.from('notifications').insert({
        user_id: studentId,
        title: 'Mission needs revision',
        body: `${reason}${feedback ? `. ${feedback}` : ''}. Try again! 💪`,
        type: 'mission' as const,
      });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['teacher-submissions'] });
      toast({ title: 'Submission rejected', description: 'Student has been notified' });
    },
    onError: (err: Error) => {
      toast({ title: 'Error rejecting', description: err.message, variant: 'destructive' });
    },
  });

  // Award bonus points
  const awardBonusPoints = useMutation({
    mutationFn: async ({ studentId, points, reason }: { studentId: string; points: number; reason: string }) => {
      if (points > 50 || points < 1) throw new Error('Points must be 1-50');

      const { data: student } = await supabase
        .from('profiles')
        .select('eco_points, full_name')
        .eq('id', studentId)
        .single();
      if (!student) throw new Error('Student not found');

      await supabase
        .from('profiles')
        .update({ eco_points: student.eco_points + points })
        .eq('id', studentId);

      // Track daily points
      const today = new Date().toISOString().split('T')[0];
      const { data: existing } = await supabase
        .from('daily_points')
        .select('*')
        .eq('user_id', studentId)
        .eq('date', today)
        .single();

      if (existing) {
        await supabase.from('daily_points').update({ points_earned: existing.points_earned + points }).eq('id', existing.id);
      } else {
        await supabase.from('daily_points').insert({ user_id: studentId, date: today, points_earned: points });
      }

      await supabase.from('notifications').insert({
        user_id: studentId,
        title: `You received ${points} bonus EcoPoints! 🎉`,
        body: `From ${profile?.full_name ?? 'your teacher'}. Reason: ${reason}`,
        type: 'reward' as const,
      });

      return student.full_name;
    },
    onSuccess: (name) => {
      queryClient.invalidateQueries({ queryKey: ['teacher-students'] });
      queryClient.invalidateQueries({ queryKey: ['teacher-class-weekly'] });
      toast({ title: `Bonus points awarded to ${name}! 🎉` });
    },
    onError: (err: Error) => {
      toast({ title: 'Error', description: err.message, variant: 'destructive' });
    },
  });

  // Create custom mission
  const createMission = useMutation({
    mutationFn: async (mission: {
      title: string;
      description: string;
      category: string;
      difficulty: string;
      eco_points_reward: number;
      requires_photo: boolean;
      requires_location: boolean;
      school_only: boolean;
      expires_at?: string;
    }) => {
      const xpMap: Record<string, number> = { easy: 25, medium: 50, hard: 100 };
      const { error } = await supabase.from('missions').insert({
        ...mission,
        category: mission.category as any,
        difficulty: mission.difficulty as any,
        xp_reward: xpMap[mission.difficulty] ?? 25,
        created_by: userId,
        is_active: true,
        icon: '🌿',
        expires_at: mission.expires_at || null,
      });
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['teacher-missions'] });
      toast({ title: 'Mission created! 🌿', description: 'Your students can now see it' });
    },
    onError: (err: Error) => {
      toast({ title: 'Error creating mission', description: err.message, variant: 'destructive' });
    },
  });

  // All missions
  const missionsQuery = useQuery({
    queryKey: ['teacher-missions'],
    queryFn: async () => {
      const { data } = await supabase
        .from('missions')
        .select('*')
        .eq('is_active', true)
        .order('created_at', { ascending: false });
      return data ?? [];
    },
    enabled: !!userId,
  });

  // Student submission counts per mission
  const missionCompletionQuery = useQuery({
    queryKey: ['teacher-mission-completions'],
    queryFn: async () => {
      const { data } = await supabase
        .from('mission_submissions')
        .select('mission_id, status')
        .eq('status', 'approved');
      const counts: Record<string, number> = {};
      (data ?? []).forEach(d => {
        counts[d.mission_id] = (counts[d.mission_id] || 0) + 1;
      });
      return counts;
    },
    enabled: !!userId,
  });

  return {
    students: studentsQuery.data ?? [],
    submissions: submissionsQuery.data ?? [],
    pendingCount,
    weeklyApproved: weeklyApprovedQuery.data ?? 0,
    classTotalPoints,
    activeThisWeek: activeThisWeekQuery.data ?? 0,
    classWeekly: classWeeklyQuery.data ?? [],
    topStudentsWeek: topStudentsWeekQuery.data ?? [],
    missions: missionsQuery.data ?? [],
    missionCompletions: missionCompletionQuery.data ?? {},
    isLoading: studentsQuery.isLoading || submissionsQuery.isLoading,
    approveSubmission,
    rejectSubmission,
    awardBonusPoints,
    createMission,
  };
}

import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from './useAuth';
import { useToast } from './use-toast';

export function useDashboardData() {
  const { user, profile, refreshProfile } = useAuth();
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const userId = user?.id;

  // Rank: count users with more eco_points + 1
  const rankQuery = useQuery({
    queryKey: ['rank', userId, profile?.eco_points],
    queryFn: async () => {
      if (!userId || !profile) return 999;
      const { count } = await supabase
        .from('profiles')
        .select('*', { count: 'exact', head: true })
        .gt('eco_points', profile.eco_points);
      return (count ?? 0) + 1;
    },
    enabled: !!userId && !!profile,
  });

  // Top 5 leaderboard
  const leaderboardQuery = useQuery({
    queryKey: ['leaderboard'],
    queryFn: async () => {
      const { data } = await supabase
        .from('profiles')
        .select('id, full_name, avatar_emoji, eco_points, school_name')
        .order('eco_points', { ascending: false })
        .limit(5);
      return data ?? [];
    },
    enabled: !!userId,
  });

  // Missions (first 3 for dashboard)
  const missionsQuery = useQuery({
    queryKey: ['dashboard-missions'],
    queryFn: async () => {
      const { data } = await supabase
        .from('missions')
        .select('*')
        .eq('is_active', true)
        .limit(3);
      return data ?? [];
    },
    enabled: !!userId,
  });

  // User's submissions
  const submissionsQuery = useQuery({
    queryKey: ['submissions', userId],
    queryFn: async () => {
      if (!userId) return [];
      const { data } = await supabase
        .from('mission_submissions')
        .select('*, missions(*)')
        .eq('user_id', userId);
      return data ?? [];
    },
    enabled: !!userId,
  });

  // Weekly points (last 7 days)
  const weeklyQuery = useQuery({
    queryKey: ['weekly-points', userId],
    queryFn: async () => {
      if (!userId) return [];
      const sevenDaysAgo = new Date();
      sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 6);
      const { data } = await supabase
        .from('daily_points')
        .select('date, points_earned')
        .eq('user_id', userId)
        .gte('date', sevenDaysAgo.toISOString().split('T')[0])
        .order('date', { ascending: true });
      return data ?? [];
    },
    enabled: !!userId,
  });

  // Recent activity (last 4 approved/pending submissions)
  const activityQuery = useQuery({
    queryKey: ['activity', userId],
    queryFn: async () => {
      if (!userId) return [];
      const { data } = await supabase
        .from('mission_submissions')
        .select('*, missions(title, icon, eco_points_reward)')
        .eq('user_id', userId)
        .in('status', ['approved', 'pending', 'in_progress'])
        .order('submitted_at', { ascending: false })
        .limit(4);
      return data ?? [];
    },
    enabled: !!userId,
  });

  // Notifications
  const notificationsQuery = useQuery({
    queryKey: ['notifications', userId],
    queryFn: async () => {
      if (!userId) return [];
      const { data } = await supabase
        .from('notifications')
        .select('*')
        .eq('user_id', userId)
        .order('created_at', { ascending: false })
        .limit(10);
      return data ?? [];
    },
    enabled: !!userId,
  });

  const unreadCount = (notificationsQuery.data ?? []).filter(n => !n.is_read).length;

  // Accept mission mutation
  const acceptMission = useMutation({
    mutationFn: async (missionId: string) => {
      if (!userId) throw new Error('Not authenticated');
      const { error } = await supabase
        .from('mission_submissions')
        .insert({ user_id: userId, mission_id: missionId, status: 'in_progress' as const });
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['submissions'] });
      toast({ title: 'Quest accepted! 🌿', description: 'Complete it and submit proof to earn points' });
    },
    onError: (err: Error) => {
      toast({ title: 'Error', description: err.message, variant: 'destructive' });
    },
  });

  // Submit proof mutation
  const submitProof = useMutation({
    mutationFn: async ({ submissionId, photoUrl, notes, coords }: { submissionId: string; photoUrl?: string; notes?: string; coords?: { lat: number; lng: number } }) => {
      const { error } = await supabase
        .from('mission_submissions')
        .update({
          status: 'pending' as const,
          photo_url: photoUrl,
          notes,
          location_coords: coords ? coords as any : null,
          submitted_at: new Date().toISOString(),
        })
        .eq('id', submissionId);
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['submissions'] });
      queryClient.invalidateQueries({ queryKey: ['activity'] });
      toast({ title: 'Proof submitted! 📸', description: 'Your teacher will review it soon' });
    },
  });

  // Auto-approve check
  const checkAutoApprove = async () => {
    if (!userId) return;
    const { data } = await supabase.rpc('auto_approve_pending_submissions', { p_user_id: userId });
    if (data && (data as any[]).length > 0) {
      await refreshProfile();
      queryClient.invalidateQueries({ queryKey: ['submissions'] });
      queryClient.invalidateQueries({ queryKey: ['activity'] });
      queryClient.invalidateQueries({ queryKey: ['notifications'] });
      queryClient.invalidateQueries({ queryKey: ['weekly-points'] });
      queryClient.invalidateQueries({ queryKey: ['rank'] });
      toast({ title: 'Mission approved! 🎉', description: 'EcoPoints have been added to your account' });
    }
  };

  // Trees planted (approved planting missions)
  const treesPlantedQuery = useQuery({
    queryKey: ['trees-planted', userId],
    queryFn: async () => {
      if (!userId) return 0;
      const { data } = await supabase
        .from('mission_submissions')
        .select('id, missions!inner(category)')
        .eq('user_id', userId)
        .eq('status', 'approved')
        .eq('missions.category', 'planting');
      return data?.length ?? 0;
    },
    enabled: !!userId,
  });

  // Real user count (for badge logic)
  const realUserCountQuery = useQuery({
    queryKey: ['real-user-count'],
    queryFn: async () => {
      const { count } = await supabase
        .from('profiles')
        .select('*', { count: 'exact', head: true });
      return count ?? 0;
    },
    enabled: !!userId,
  });

  // Streak update
  const updateStreak = async () => {
    if (!userId) return;
    await supabase.rpc('update_streak', { p_user_id: userId });
    await refreshProfile();
  };

  // Mark all notifications read
  const markAllRead = async () => {
    if (!userId) return;
    await supabase
      .from('notifications')
      .update({ is_read: true })
      .eq('user_id', userId);
    queryClient.invalidateQueries({ queryKey: ['notifications'] });
  };

  return {
    profile,
    rank: rankQuery.data ?? 999,
    leaderboard: leaderboardQuery.data ?? [],
    missions: missionsQuery.data ?? [],
    submissions: submissionsQuery.data ?? [],
    weeklyPoints: weeklyQuery.data ?? [],
    activity: activityQuery.data ?? [],
    notifications: notificationsQuery.data ?? [],
    unreadCount,
    isLoading: !profile || missionsQuery.isLoading,
    acceptMission,
    submitProof,
    checkAutoApprove,
    updateStreak,
    markAllRead,
    refreshProfile,
  };
}

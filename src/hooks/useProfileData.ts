import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from './useAuth';
import { useToast } from './use-toast';

export function useProfileData() {
  const { user, profile, refreshProfile } = useAuth();
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const userId = user?.id;

  // Missions completed (approved)
  const missionsCompletedQuery = useQuery({
    queryKey: ['profile-missions-completed', userId],
    queryFn: async () => {
      if (!userId) return 0;
      const { count } = await supabase
        .from('mission_submissions')
        .select('*', { count: 'exact', head: true })
        .eq('user_id', userId)
        .eq('status', 'approved');
      return count ?? 0;
    },
    enabled: !!userId,
  });

  // Trees planted (approved planting missions)
  const treesPlantedQuery = useQuery({
    queryKey: ['profile-trees-planted', userId],
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

  // Water missions (approved)
  const waterMissionsQuery = useQuery({
    queryKey: ['profile-water-missions', userId],
    queryFn: async () => {
      if (!userId) return 0;
      const { data } = await supabase
        .from('mission_submissions')
        .select('id, missions!inner(category)')
        .eq('user_id', userId)
        .eq('status', 'approved')
        .eq('missions.category', 'water');
      return data?.length ?? 0;
    },
    enabled: !!userId,
  });

  // Waste missions (approved)
  const wasteMissionsQuery = useQuery({
    queryKey: ['profile-waste-missions', userId],
    queryFn: async () => {
      if (!userId) return 0;
      const { data } = await supabase
        .from('mission_submissions')
        .select('id, missions!inner(category)')
        .eq('user_id', userId)
        .eq('status', 'approved')
        .eq('missions.category', 'waste');
      return data?.length ?? 0;
    },
    enabled: !!userId,
  });

  // Category counts for badge logic (Globe Trotter)
  const categoriesQuery = useQuery({
    queryKey: ['profile-categories', userId],
    queryFn: async () => {
      if (!userId) return 0;
      const { data } = await supabase
        .from('mission_submissions')
        .select('missions!inner(category)')
        .eq('user_id', userId)
        .eq('status', 'approved');
      if (!data) return 0;
      const cats = new Set(data.map((d: any) => d.missions?.category));
      return cats.size;
    },
    enabled: !!userId,
  });

  // Weekly points for trend
  const weeklyPointsQuery = useQuery({
    queryKey: ['profile-weekly-points', userId],
    queryFn: async () => {
      if (!userId) return 0;
      const sevenDaysAgo = new Date();
      sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 6);
      const { data } = await supabase
        .from('daily_points')
        .select('points_earned')
        .eq('user_id', userId)
        .gte('date', sevenDaysAgo.toISOString().split('T')[0]);
      return data?.reduce((sum, d) => sum + d.points_earned, 0) ?? 0;
    },
    enabled: !!userId,
  });

  // Monthly missions for trend
  const monthlyMissionsQuery = useQuery({
    queryKey: ['profile-monthly-missions', userId],
    queryFn: async () => {
      if (!userId) return 0;
      const startOfMonth = new Date();
      startOfMonth.setDate(1);
      startOfMonth.setHours(0, 0, 0, 0);
      const { count } = await supabase
        .from('mission_submissions')
        .select('*', { count: 'exact', head: true })
        .eq('user_id', userId)
        .eq('status', 'approved')
        .gte('submitted_at', startOfMonth.toISOString());
      return count ?? 0;
    },
    enabled: !!userId,
  });

  // Real user count for badge logic
  const realUserCountQuery = useQuery({
    queryKey: ['profile-real-user-count'],
    queryFn: async () => {
      const { count } = await supabase
        .from('profiles')
        .select('*', { count: 'exact', head: true });
      return count ?? 0;
    },
    enabled: !!userId,
  });

  // Rank among real users
  const rankQuery = useQuery({
    queryKey: ['profile-rank', userId, profile?.eco_points],
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

  // Submissions with mission data (paginated)
  const submissionsQuery = (offset: number, limit: number, filter: 'all' | 'week' | 'month') => {
    let gte: string | undefined;
    if (filter === 'week') {
      const d = new Date(); d.setDate(d.getDate() - 7);
      gte = d.toISOString();
    } else if (filter === 'month') {
      const d = new Date(); d.setDate(1); d.setHours(0,0,0,0);
      gte = d.toISOString();
    }
    return useQuery({
      queryKey: ['profile-submissions', userId, offset, limit, filter],
      queryFn: async () => {
        if (!userId) return { data: [], count: 0 };
        let query = supabase
          .from('mission_submissions')
          .select('*, missions(title, icon, eco_points_reward, category)', { count: 'exact' })
          .eq('user_id', userId)
          .order('submitted_at', { ascending: false })
          .range(offset, offset + limit - 1);
        if (gte) query = query.gte('submitted_at', gte);
        const { data, count } = await query;
        return { data: data ?? [], count: count ?? 0 };
      },
      enabled: !!userId,
    });
  };

  // Update profile mutation
  const updateProfile = useMutation({
    mutationFn: async (updates: { full_name?: string; school_name?: string; city?: string }) => {
      if (!userId) throw new Error('Not authenticated');
      const { error } = await supabase
        .from('profiles')
        .update(updates)
        .eq('id', userId);
      if (error) throw error;
    },
    onSuccess: async () => {
      await refreshProfile();
      toast({ title: 'Profile updated! 🌿' });
    },
    onError: (err: Error) => {
      toast({ title: 'Error', description: err.message, variant: 'destructive' });
    },
  });

  // Update avatar mutation
  const updateAvatar = useMutation({
    mutationFn: async (avatar_emoji: string) => {
      if (!userId) throw new Error('Not authenticated');
      const { error } = await supabase
        .from('profiles')
        .update({ avatar_emoji })
        .eq('id', userId);
      if (error) throw error;
    },
    onSuccess: async () => {
      await refreshProfile();
      queryClient.invalidateQueries({ queryKey: ['leaderboard'] });
      toast({ title: 'Avatar updated! ✨' });
    },
    onError: (err: Error) => {
      toast({ title: 'Error', description: err.message, variant: 'destructive' });
    },
  });

  return {
    missionsCompleted: missionsCompletedQuery.data ?? 0,
    treesPlanted: treesPlantedQuery.data ?? 0,
    waterMissions: waterMissionsQuery.data ?? 0,
    wasteMissions: wasteMissionsQuery.data ?? 0,
    categoriesCount: categoriesQuery.data ?? 0,
    weeklyPoints: weeklyPointsQuery.data ?? 0,
    monthlyMissions: monthlyMissionsQuery.data ?? 0,
    realUserCount: realUserCountQuery.data ?? 0,
    rank: rankQuery.data ?? 999,
    submissionsQuery,
    updateProfile,
    updateAvatar,
    isLoading: missionsCompletedQuery.isLoading,
  };
}

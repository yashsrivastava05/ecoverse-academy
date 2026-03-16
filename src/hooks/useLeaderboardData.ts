import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from './useAuth';
import { getLevelForPoints } from '@/lib/types';

export type TimePeriod = 'all_time' | 'this_week' | 'this_month';
export type LeaderboardScope = 'global' | 'my_school';

export interface LeaderboardEntry {
  user_id: string;
  full_name: string;
  avatar_emoji: string;
  school_name: string;
  eco_points: number;
  streak_days: number;
  rank: number;
  level_title: string;
  is_bot?: boolean;
}

const ECO_BOTS: Omit<LeaderboardEntry, 'rank' | 'level_title'>[] = [
  { user_id: 'bot-maya', full_name: 'Maya 🌿', avatar_emoji: '🌿', school_name: 'EcoBot Academy', eco_points: 1850, streak_days: 12, is_bot: true },
  { user_id: 'bot-arjun', full_name: 'Arjun 🌱', avatar_emoji: '🌱', school_name: 'EcoBot Academy', eco_points: 1340, streak_days: 8, is_bot: true },
  { user_id: 'bot-priya', full_name: 'Priya 🍃', avatar_emoji: '🍃', school_name: 'EcoBot Academy', eco_points: 890, streak_days: 5, is_bot: true },
  { user_id: 'bot-sam', full_name: 'Sam 🌳', avatar_emoji: '🌳', school_name: 'EcoBot Academy', eco_points: 420, streak_days: 3, is_bot: true },
];

function getStartOfWeek(): string {
  const now = new Date();
  const day = now.getDay();
  const diff = now.getDate() - day;
  const sunday = new Date(now.getFullYear(), now.getMonth(), diff);
  return sunday.toISOString().split('T')[0];
}

function getStartOfMonth(): string {
  const now = new Date();
  return new Date(now.getFullYear(), now.getMonth(), 1).toISOString().split('T')[0];
}

async function fetchExcludedUserIds(): Promise<string[]> {
  const { data, error } = await supabase.rpc('get_non_student_user_ids');
  if (error || !data) return [];
  return data as string[];
}

async function fetchAllTimeLeaderboard(schoolFilter?: string, excludeIds?: string[]) {
  let query = supabase
    .from('profiles')
    .select('id, full_name, avatar_emoji, school_name, eco_points, streak_days')
    .order('eco_points', { ascending: false })
    .limit(50);

  if (schoolFilter) {
    query = query.eq('school_name', schoolFilter);
  }

  const { data, error } = await query;
  if (error) throw error;

  let results = (data ?? []).map(p => ({
    user_id: p.id,
    full_name: p.full_name,
    avatar_emoji: p.avatar_emoji,
    school_name: p.school_name ?? '',
    eco_points: p.eco_points,
    streak_days: p.streak_days,
  }));

  if (excludeIds && excludeIds.length > 0) {
    const excludeSet = new Set(excludeIds);
    results = results.filter(r => !excludeSet.has(r.user_id));
  }

  return results;
}

async function fetchTimePeriodLeaderboard(period: 'this_week' | 'this_month', schoolFilter?: string, excludeIds?: string[]) {
  const startDate = period === 'this_week' ? getStartOfWeek() : getStartOfMonth();

  const { data: pointsData, error: pointsError } = await supabase
    .from('daily_points')
    .select('user_id, points_earned')
    .gte('date', startDate);

  if (pointsError) throw pointsError;

  const userPoints = new Map<string, number>();
  const excludeSet = new Set(excludeIds ?? []);
  for (const row of pointsData ?? []) {
    if (excludeSet.has(row.user_id)) continue;
    userPoints.set(row.user_id, (userPoints.get(row.user_id) ?? 0) + row.points_earned);
  }

  if (userPoints.size === 0) return [];

  const userIds = Array.from(userPoints.keys());
  let query = supabase
    .from('profiles')
    .select('id, full_name, avatar_emoji, school_name, eco_points, streak_days')
    .in('id', userIds);

  if (schoolFilter) {
    query = query.eq('school_name', schoolFilter);
  }

  const { data: profiles, error: profilesError } = await query;
  if (profilesError) throw profilesError;

  return (profiles ?? [])
    .map(p => ({
      user_id: p.id,
      full_name: p.full_name,
      avatar_emoji: p.avatar_emoji,
      school_name: p.school_name ?? '',
      eco_points: userPoints.get(p.id) ?? 0,
      streak_days: p.streak_days,
    }))
    .sort((a, b) => b.eco_points - a.eco_points);
}

function rankEntries(
  entries: Omit<LeaderboardEntry, 'rank' | 'level_title'>[],
  injectBots: boolean
): LeaderboardEntry[] {
  let combined = [...entries];

  if (injectBots) {
    combined = [...combined, ...ECO_BOTS];
    combined.sort((a, b) => b.eco_points - a.eco_points);
  }

  return combined.map((e, i) => ({
    ...e,
    rank: i + 1,
    level_title: getLevelForPoints(e.eco_points).title,
  }));
}

export function useLeaderboardData(
  period: TimePeriod,
  scope: LeaderboardScope,
  injectBots: boolean = true
) {
  const { user, profile } = useAuth();
  const schoolName = profile?.school_name || undefined;

  const schoolFilter = scope === 'my_school' ? schoolName : undefined;
  const shouldInjectBots = injectBots && scope === 'global';

  return useQuery({
    queryKey: ['leaderboard', period, scope, schoolFilter, shouldInjectBots],
    queryFn: async () => {
      const excludeIds = await fetchExcludedUserIds();

      let raw: Omit<LeaderboardEntry, 'rank' | 'level_title'>[];

      if (period === 'all_time') {
        raw = await fetchAllTimeLeaderboard(schoolFilter, excludeIds);
      } else {
        raw = await fetchTimePeriodLeaderboard(period, schoolFilter, excludeIds);
      }

      const ranked = rankEntries(raw, shouldInjectBots);
      const top3 = ranked.slice(0, 3);
      const rest = ranked.slice(3, 20);
      const currentUserEntry = user ? ranked.find(e => e.user_id === user.id) : undefined;
      const isInTop20 = currentUserEntry ? currentUserEntry.rank <= 20 : false;

      return { entries: ranked, top3, rest, currentUserEntry, isInTop20 };
    },
    enabled: scope === 'global' || !!schoolName,
  });
}

export function useTeacherLeaderboardData(period: TimePeriod) {
  const { profile } = useAuth();
  const schoolName = profile?.school_name || undefined;

  return useQuery({
    queryKey: ['teacher-leaderboard', period, schoolName],
    queryFn: async () => {
      const { data: studentRoles } = await supabase
        .from('user_roles')
        .select('user_id')
        .eq('role', 'student');

      const studentIds = (studentRoles ?? []).map(r => r.user_id);
      if (studentIds.length === 0) return { entries: [], top3: [], rest: [] };

      let raw: Omit<LeaderboardEntry, 'rank' | 'level_title'>[];

      if (period === 'all_time') {
        const { data } = await supabase
          .from('profiles')
          .select('id, full_name, avatar_emoji, school_name, eco_points, streak_days')
          .eq('school_name', schoolName!)
          .in('id', studentIds)
          .order('eco_points', { ascending: false })
          .limit(50);

        raw = (data ?? []).map(p => ({
          user_id: p.id,
          full_name: p.full_name,
          avatar_emoji: p.avatar_emoji,
          school_name: p.school_name ?? '',
          eco_points: p.eco_points,
          streak_days: p.streak_days,
        }));
      } else {
        const startDate = period === 'this_week' ? getStartOfWeek() : getStartOfMonth();
        const { data: pointsData } = await supabase
          .from('daily_points')
          .select('user_id, points_earned')
          .gte('date', startDate)
          .in('user_id', studentIds);

        const userPoints = new Map<string, number>();
        for (const row of pointsData ?? []) {
          userPoints.set(row.user_id, (userPoints.get(row.user_id) ?? 0) + row.points_earned);
        }

        const uids = Array.from(userPoints.keys());
        if (uids.length === 0) return { entries: [], top3: [], rest: [] };

        const { data: profiles } = await supabase
          .from('profiles')
          .select('id, full_name, avatar_emoji, school_name, eco_points, streak_days')
          .eq('school_name', schoolName!)
          .in('id', uids);

        raw = (profiles ?? [])
          .map(p => ({
            user_id: p.id,
            full_name: p.full_name,
            avatar_emoji: p.avatar_emoji,
            school_name: p.school_name ?? '',
            eco_points: userPoints.get(p.id) ?? 0,
            streak_days: p.streak_days,
          }))
          .sort((a, b) => b.eco_points - a.eco_points);
      }

      const entries = raw.map((e, i) => ({
        ...e,
        rank: i + 1,
        level_title: getLevelForPoints(e.eco_points).title,
      }));

      return { entries, top3: entries.slice(0, 3), rest: entries.slice(3) };
    },
    enabled: !!schoolName,
  });
}

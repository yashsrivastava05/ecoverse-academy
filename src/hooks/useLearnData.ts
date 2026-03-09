import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/hooks/useAuth';
import type { Database } from '@/integrations/supabase/types';

type LessonTopic = Database['public']['Enums']['lesson_topic'];
type Lesson = Database['public']['Tables']['lessons']['Row'];
type LessonCompletion = Database['public']['Tables']['lesson_completions']['Row'];
type QuizAttempt = Database['public']['Tables']['quiz_attempts']['Row'];

export const TOPIC_INFO: Record<string, { label: string; icon: string }> = {
  climate_change: { label: 'Climate Change', icon: '🌡️' },
  pollution: { label: 'Pollution & Waste', icon: '🏭' },
  waste: { label: 'Waste Management', icon: '♻️' },
  energy: { label: 'Renewable Energy', icon: '⚡' },
  water: { label: 'Water Conservation', icon: '💧' },
  biodiversity: { label: 'Biodiversity', icon: '🦋' },
};

export const TOPIC_GRADIENTS: Record<string, string> = {
  climate_change: 'from-[hsl(152,44%,15%)] to-[hsl(153,43%,30%)]',
  pollution: 'from-[hsl(210,24%,24%)] to-[hsl(208,27%,34%)]',
  waste: 'from-[hsl(153,43%,30%)] to-[hsl(153,41%,42%)]',
  energy: 'from-[hsl(27,100%,25%)] to-[hsl(30,89%,38%)]',
  water: 'from-[hsl(201,100%,36%)] to-[hsl(193,100%,43%)]',
  biodiversity: 'from-[hsl(264,81%,31%)] to-[hsl(267,63%,46%)]',
};

export function useLessons(topic?: string) {
  return useQuery({
    queryKey: ['lessons', topic],
    queryFn: async () => {
      let query = supabase
        .from('lessons')
        .select('*')
        .order('order_index', { ascending: true });
      
      if (topic) {
        query = query.eq('topic', topic as LessonTopic);
      }
      
      const { data, error } = await query;
      if (error) throw error;
      return data as Lesson[];
    },
  });
}

export function useLesson(lessonId: string) {
  return useQuery({
    queryKey: ['lesson', lessonId],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('lessons')
        .select('*')
        .eq('id', lessonId)
        .single();
      
      if (error) throw error;
      return data as Lesson;
    },
    enabled: !!lessonId,
  });
}

export function useUserCompletions() {
  const { user } = useAuth();
  
  return useQuery({
    queryKey: ['lesson-completions', user?.id],
    queryFn: async () => {
      if (!user) return [];
      
      const { data, error } = await supabase
        .from('lesson_completions')
        .select('*')
        .eq('user_id', user.id);
      
      if (error) throw error;
      return data as LessonCompletion[];
    },
    enabled: !!user,
  });
}

export function useQuizAttempts(topic?: string) {
  const { user } = useAuth();
  
  return useQuery({
    queryKey: ['quiz-attempts', user?.id, topic],
    queryFn: async () => {
      if (!user) return [];
      
      let query = supabase
        .from('quiz_attempts')
        .select('*')
        .eq('user_id', user.id)
        .order('score', { ascending: false });
      
      if (topic) {
        query = query.eq('topic', topic as LessonTopic);
      }
      
      const { data, error } = await query;
      if (error) throw error;
      return data as QuizAttempt[];
    },
    enabled: !!user,
  });
}

export function useTopicProgress() {
  const { data: lessons } = useLessons();
  const { data: completions } = useUserCompletions();
  
  const progressByTopic: Record<string, { completed: number; total: number; percentage: number }> = {};
  
  if (lessons && completions) {
    const completedIds = new Set(completions.map(c => c.lesson_id));
    
    Object.keys(TOPIC_INFO).forEach(topic => {
      const topicLessons = lessons.filter(l => l.topic === topic);
      const completedCount = topicLessons.filter(l => completedIds.has(l.id)).length;
      progressByTopic[topic] = {
        completed: completedCount,
        total: topicLessons.length,
        percentage: topicLessons.length > 0 ? Math.round((completedCount / topicLessons.length) * 100) : 0,
      };
    });
  }
  
  return progressByTopic;
}

export function useCompleteLesson() {
  const { user, refreshProfile } = useAuth();
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: async ({ lessonId, ecoPoints }: { lessonId: string; ecoPoints: number }) => {
      if (!user) throw new Error('Not authenticated');
      
      // Check if already completed
      const { data: existing } = await supabase
        .from('lesson_completions')
        .select('id')
        .eq('user_id', user.id)
        .eq('lesson_id', lessonId)
        .single();
      
      if (existing) {
        return { alreadyCompleted: true };
      }
      
      // Insert completion
      const { error: completionError } = await supabase
        .from('lesson_completions')
        .insert({ user_id: user.id, lesson_id: lessonId });
      
      if (completionError) throw completionError;
      
      // Award EcoPoints
      const { error: pointsError } = await supabase
        .from('profiles')
        .update({ eco_points: (await supabase.from('profiles').select('eco_points').eq('id', user.id).single()).data!.eco_points + ecoPoints })
        .eq('id', user.id);
      
      if (pointsError) throw pointsError;
      
      // Track daily points
      const today = new Date().toISOString().split('T')[0];
      const { data: dailyData } = await supabase
        .from('daily_points')
        .select('*')
        .eq('user_id', user.id)
        .eq('date', today)
        .single();
      
      if (dailyData) {
        await supabase
          .from('daily_points')
          .update({ points_earned: dailyData.points_earned + ecoPoints })
          .eq('id', dailyData.id);
      } else {
        await supabase
          .from('daily_points')
          .insert({ user_id: user.id, date: today, points_earned: ecoPoints });
      }
      
      return { alreadyCompleted: false, pointsAwarded: ecoPoints };
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['lesson-completions'] });
      refreshProfile();
    },
  });
}

export function useSaveQuizAttempt() {
  const { user, refreshProfile } = useAuth();
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: async ({ topic, score, totalQuestions }: { topic: string; score: number; totalQuestions: number }) => {
      if (!user) throw new Error('Not authenticated');
      
      const pointsEarned = Math.round((score / totalQuestions) * 30 / 10) * 10;
      
      // Insert quiz attempt
      const { error: attemptError } = await supabase
        .from('quiz_attempts')
        .insert({
          user_id: user.id,
          topic: topic as LessonTopic,
          score,
          total_questions: totalQuestions,
          points_earned: pointsEarned,
        });
      
      if (attemptError) throw attemptError;
      
      // Award EcoPoints
      const { data: profile } = await supabase
        .from('profiles')
        .select('eco_points')
        .eq('id', user.id)
        .single();
      
      if (profile) {
        await supabase
          .from('profiles')
          .update({ eco_points: profile.eco_points + pointsEarned })
          .eq('id', user.id);
      }
      
      // Track daily points
      const today = new Date().toISOString().split('T')[0];
      const { data: dailyData } = await supabase
        .from('daily_points')
        .select('*')
        .eq('user_id', user.id)
        .eq('date', today)
        .single();
      
      if (dailyData) {
        await supabase
          .from('daily_points')
          .update({ points_earned: dailyData.points_earned + pointsEarned })
          .eq('id', dailyData.id);
      } else {
        await supabase
          .from('daily_points')
          .insert({ user_id: user.id, date: today, points_earned: pointsEarned });
      }
      
      return { pointsEarned };
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['quiz-attempts'] });
      refreshProfile();
    },
  });
}

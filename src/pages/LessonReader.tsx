import { useState, useEffect, useRef } from 'react';
import { motion } from 'framer-motion';
import { useParams, useNavigate } from 'react-router-dom';
import { ArrowLeft, Clock, Leaf, CheckCircle } from 'lucide-react';
import { useLesson, useUserCompletions, useCompleteLesson, TOPIC_INFO } from '@/hooks/useLearnData';
import { Button } from '@/components/ui/button';
import { Skeleton } from '@/components/ui/skeleton';
import { toast } from 'sonner';

interface FactBox {
  title: string;
  content: string;
}

export default function LessonReader() {
  const { topic, lessonId } = useParams<{ topic: string; lessonId: string }>();
  const navigate = useNavigate();
  const [scrollProgress, setScrollProgress] = useState(0);
  const contentRef = useRef<HTMLDivElement>(null);
  
  const { data: lesson, isLoading: lessonLoading } = useLesson(lessonId || '');
  const { data: completions, isLoading: completionsLoading } = useUserCompletions();
  const completeLesson = useCompleteLesson();
  
  const isLoading = lessonLoading || completionsLoading;
  const topicInfo = topic ? TOPIC_INFO[topic] : null;
  const isCompleted = completions?.some(c => c.lesson_id === lessonId) || false;

  useEffect(() => {
    const handleScroll = () => {
      if (!contentRef.current) return;
      const { scrollTop, scrollHeight, clientHeight } = document.documentElement;
      const contentTop = contentRef.current.offsetTop;
      const contentHeight = contentRef.current.offsetHeight;
      
      const scrolled = scrollTop - contentTop + clientHeight;
      const progress = Math.min(100, Math.max(0, (scrolled / contentHeight) * 100));
      setScrollProgress(progress);
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const handleComplete = async () => {
    if (!lesson || isCompleted) return;
    
    try {
      const result = await completeLesson.mutateAsync({
        lessonId: lesson.id,
        ecoPoints: lesson.eco_points_reward,
      });
      
      if (!result.alreadyCompleted) {
        toast.success(`Lesson complete! +${lesson.eco_points_reward} EcoPoints earned 🌿`);
      }
    } catch (error) {
      toast.error('Failed to mark lesson as complete');
    }
  };

  if (isLoading) {
    return (
      <div className="p-4 md:p-6 max-w-2xl mx-auto space-y-6">
        <Skeleton className="h-8 w-40" />
        <Skeleton className="h-[600px] rounded-2xl" />
      </div>
    );
  }

  if (!lesson || !topicInfo) {
    return (
      <div className="p-4 md:p-6 max-w-2xl mx-auto">
        <p className="text-muted-foreground">Lesson not found</p>
        <button onClick={() => navigate(`/learn/${topic}`)} className="text-primary hover:underline">
          ← Back to lessons
        </button>
      </div>
    );
  }

  const factBoxes = (lesson.fact_boxes as unknown as FactBox[]) || [];

  return (
    <div className="p-4 md:p-6 max-w-2xl mx-auto space-y-6">
      {/* Progress bar at top */}
      <div className="fixed top-0 left-0 right-0 h-1 bg-muted z-50">
        <motion.div 
          className="h-full bg-primary"
          style={{ width: `${scrollProgress}%` }}
        />
      </div>

      <button 
        onClick={() => navigate(`/learn/${topic}`)} 
        className="flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground transition-colors font-heading font-semibold"
      >
        <ArrowLeft className="w-4 h-4" /> Back to {topicInfo.label}
      </button>

      <div ref={contentRef} className="rounded-2xl bg-card shadow-card p-6 md:p-10">
        <div className="flex items-center gap-2 mb-4">
          <span className="bg-muted rounded-full px-3 py-1 text-xs font-heading font-bold text-muted-foreground">
            Article
          </span>
          {isCompleted && (
            <span className="bg-primary/10 text-primary rounded-full px-3 py-1 text-xs font-heading font-bold flex items-center gap-1">
              <CheckCircle className="w-3 h-3" /> Completed
            </span>
          )}
        </div>
        
        <h1 className="font-display font-black text-2xl md:text-3xl text-foreground mb-4">
          {lesson.title}
        </h1>
        
        <div className="flex items-center gap-4 text-sm text-muted-foreground mb-8">
          <span className="flex items-center gap-1">
            <Clock className="w-4 h-4" /> {lesson.estimated_minutes} min read
          </span>
          <span className="flex items-center gap-1">
            <Leaf className="w-4 h-4 text-primary" /> +{lesson.eco_points_reward} pts
          </span>
        </div>

        {/* Article Body */}
        <div className="prose prose-lg max-w-none">
          <p className="text-muted-foreground leading-relaxed mb-6">{lesson.summary}</p>
          
          <div 
            className="text-foreground/80 leading-relaxed space-y-4"
            dangerouslySetInnerHTML={{ 
              __html: lesson.body
                .split('\n\n')
                .map(p => `<p>${p}</p>`)
                .join('') 
            }}
          />
        </div>

        {/* Fact Boxes */}
        {factBoxes.length > 0 && (
          <div className="mt-8 space-y-4">
            {factBoxes.map((fact, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.2 + i * 0.1 }}
                className="bg-primary/5 border-l-4 border-primary rounded-r-lg p-4"
              >
                <p className="font-heading font-bold text-sm text-primary mb-1">
                  💡 {fact.title}
                </p>
                <p className="text-sm text-foreground/80 italic">{fact.content}</p>
              </motion.div>
            ))}
          </div>
        )}

        {/* Key Takeaways */}
        {lesson.key_takeaways.length > 0 && (
          <div className="mt-8 p-5 bg-muted/50 rounded-xl">
            <h3 className="font-heading font-bold text-foreground mb-3">Key Takeaways:</h3>
            <ul className="space-y-2">
              {lesson.key_takeaways.map((takeaway, i) => (
                <li key={i} className="flex items-start gap-2 text-sm text-foreground/80">
                  <span className="text-primary mt-0.5">✓</span>
                  {takeaway}
                </li>
              ))}
            </ul>
          </div>
        )}

        {/* Complete Button */}
        <div className="mt-10 pt-6 border-t">
          {isCompleted ? (
            <div className="flex items-center justify-center gap-2 text-primary font-heading font-bold">
              <CheckCircle className="w-5 h-5" />
              <span>Completed</span>
            </div>
          ) : (
            <Button
              onClick={handleComplete}
              disabled={completeLesson.isPending}
              className="w-full h-14 text-lg font-heading font-bold rounded-xl"
            >
              {completeLesson.isPending ? (
                'Saving...'
              ) : (
                <>
                  Mark as Complete · +{lesson.eco_points_reward} EcoPoints 🌿
                </>
              )}
            </Button>
          )}
        </div>
      </div>
    </div>
  );
}

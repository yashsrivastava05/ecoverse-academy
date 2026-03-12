import { motion } from 'framer-motion';
import { useAuth } from '@/hooks/useAuth';
import { useTeacherData } from '@/hooks/useTeacherData';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { Clock, Users, CheckCircle, Sparkles, ArrowRight } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useState } from 'react';
import { Link } from 'react-router-dom';
import { formatDistanceToNow } from 'date-fns';

const fadeUp = { hidden: { opacity: 0, y: 20 }, visible: { opacity: 1, y: 0 } };
const stagger = { hidden: {}, visible: { transition: { staggerChildren: 0.08 } } };

function getGreeting() {
  const h = new Date().getHours();
  if (h < 12) return 'Good morning';
  if (h < 17) return 'Good afternoon';
  return 'Good evening';
}

export default function TeacherOverview() {
  const { profile } = useAuth();
  const {
    students, submissions, pendingCount, weeklyApproved, classTotalPoints,
    activeThisWeek, classWeekly, topStudentsWeek,
    approveSubmission, rejectSubmission,
  } = useTeacherData();

  const pendingSubmissions = submissions.filter(s => s.status === 'pending').slice(0, 3);
  const avgPoints = students.length > 0 ? Math.round(classTotalPoints / students.length) : 0;

  // Get student profiles for pending submissions
  const getStudentName = (userId: string) => {
    const student = students.find(s => s.id === userId);
    return student?.full_name ?? 'Student';
  };
  const getStudentEmoji = (userId: string) => {
    const student = students.find(s => s.id === userId);
    return student?.avatar_emoji ?? '🌱';
  };

  const statCards = [
    {
      label: 'PENDING REVIEWS',
      value: pendingCount,
      borderColor: '#F4A261',
      subtext: pendingCount > 0 ? 'Needs your attention' : 'All caught up! ✓',
      subtextColor: pendingCount > 0 ? '#F4A261' : '#40916C',
    },
    {
      label: 'STUDENTS',
      value: students.length,
      borderColor: '#40916C',
      subtext: `${activeThisWeek} active this week`,
      subtextColor: undefined,
    },
    {
      label: 'THIS WEEK',
      value: weeklyApproved,
      borderColor: '#48CAE4',
      subtext: 'Missions completed',
      subtextColor: undefined,
    },
    {
      label: 'CLASS TOTAL',
      value: classTotalPoints.toLocaleString(),
      borderColor: '#B197FC',
      subtext: `Average: ${avgPoints} pts per student`,
      subtextColor: undefined,
    },
  ];

  return (
    <motion.div className="p-4 md:p-6 max-w-6xl mx-auto space-y-6" variants={stagger} initial="hidden" animate="visible">
      {/* Header */}
      <motion.div variants={fadeUp} className="flex items-start justify-between flex-wrap gap-4">
        <div>
          <h1 className="font-display font-bold text-3xl text-jungle-deep">
            {getGreeting()}, {profile?.full_name ?? 'Teacher'}! 👋
          </h1>
          <p className="text-muted-foreground mt-1">
            {profile?.school_name || 'EcoQuest'} {profile?.city ? `· ${profile.city}` : ''}
          </p>
        </div>
        <div className="bg-card rounded-xl px-4 py-2 shadow-card text-sm font-heading font-semibold text-muted-foreground">
          {new Date().toLocaleDateString('en', { weekday: 'long', month: 'long', day: 'numeric' })}
        </div>
      </motion.div>

      {/* Stat Cards */}
      <motion.div variants={fadeUp} className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {statCards.map((card, i) => (
          <div
            key={i}
            className="bg-card rounded-[20px] shadow-card p-5"
            style={{ borderLeft: `4px solid ${card.borderColor}` }}
          >
            <p className="font-label text-muted-foreground">{card.label}</p>
            <p className="font-display font-bold text-3xl text-foreground mt-1">{card.value}</p>
            <p className="text-xs mt-1 font-heading font-semibold" style={{ color: card.subtextColor || 'hsl(var(--muted-foreground))' }}>
              {card.subtext}
            </p>
          </div>
        ))}
      </motion.div>

      {/* Pending Submissions Preview */}
      <motion.div variants={fadeUp}>
        <div className="flex items-center justify-between mb-3">
          <h2 className="font-heading font-bold text-lg text-foreground">🔔 Needs Review</h2>
          {pendingCount > 3 && (
            <Link to="/teacher/submissions" className="text-sm text-primary font-heading font-semibold hover:underline flex items-center gap-1">
              View all <ArrowRight className="w-3 h-3" />
            </Link>
          )}
        </div>
        {pendingSubmissions.length === 0 ? (
          <div className="bg-card rounded-[20px] shadow-card p-8 text-center">
            <span className="text-4xl block mb-2">🌿</span>
            <p className="font-heading font-semibold text-foreground">Nothing pending!</p>
            <p className="text-sm text-muted-foreground">Your class is on track</p>
          </div>
        ) : (
          <div className="space-y-3">
            {pendingSubmissions.map(sub => (
              <PendingCard
                key={sub.id}
                submission={sub}
                studentName={getStudentName(sub.user_id)}
                studentEmoji={getStudentEmoji(sub.user_id)}
                onApprove={() => approveSubmission.mutate({ submissionId: sub.id, missionId: sub.mission_id, studentId: sub.user_id })}
                onReject={() => rejectSubmission.mutate({ submissionId: sub.id, missionId: sub.mission_id, studentId: sub.user_id, reason: 'Needs revision' })}
              />
            ))}
          </div>
        )}
      </motion.div>

      {/* Two column: Chart + Top Students */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Class Activity Chart */}
        <motion.div variants={fadeUp} className="bg-card rounded-[20px] shadow-card p-5">
          <h3 className="font-heading font-bold text-foreground mb-4">Class Activity This Week</h3>
          <ResponsiveContainer width="100%" height={220}>
            <BarChart data={classWeekly}>
              <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
              <XAxis dataKey="day" tick={{ fontSize: 12 }} stroke="hsl(var(--muted-foreground))" />
              <YAxis tick={{ fontSize: 12 }} stroke="hsl(var(--muted-foreground))" />
              <Tooltip
                contentStyle={{ borderRadius: '12px', border: '1px solid hsl(var(--border))', background: 'hsl(var(--card))' }}
              />
              <Bar dataKey="points" fill="#40916C" radius={[8, 8, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </motion.div>

        {/* Top Students */}
        <motion.div variants={fadeUp} className="bg-card rounded-[20px] shadow-card p-5">
          <h3 className="font-heading font-bold text-foreground mb-4">🏆 Top Students This Week</h3>
          {topStudentsWeek.length === 0 ? (
            <p className="text-sm text-muted-foreground text-center py-8">No activity this week yet</p>
          ) : (
            <div className="space-y-3">
              {topStudentsWeek.map((student, i) => (
                <Link
                  key={student.user_id}
                  to="/teacher/students"
                  className="flex items-center justify-between p-3 rounded-xl hover:bg-muted/50 transition-colors"
                >
                  <div className="flex items-center gap-3">
                    <span className="w-6 text-center font-mono-stat text-sm font-bold text-muted-foreground">{student.rank}</span>
                    <span className="w-8 h-8 rounded-full bg-jungle-pale flex items-center justify-center text-sm">
                      {student.avatar_emoji}
                    </span>
                    <span className="font-heading font-semibold text-sm text-foreground">{student.full_name}</span>
                  </div>
                  <span className="font-mono-stat text-sm font-bold text-jungle-bright">+{student.week_points}</span>
                </Link>
              ))}
            </div>
          )}
        </motion.div>
      </div>
    </motion.div>
  );
}

function PendingCard({ submission, studentName, studentEmoji, onApprove, onReject }: {
  submission: any;
  studentName: string;
  studentEmoji: string;
  onApprove: () => void;
  onReject: () => void;
}) {
  const missionTitle = (submission.missions as any)?.title ?? 'Mission';
  const photoUrl = submission.photo_url;

  return (
    <div className="bg-card rounded-[20px] shadow-card p-4 flex items-center gap-4">
      <span className="w-10 h-10 rounded-full bg-jungle-pale flex items-center justify-center text-lg shrink-0">
        {studentEmoji}
      </span>
      <div className="flex-1 min-w-0">
        <p className="font-heading font-bold text-sm text-foreground">{studentName}</p>
        <p className="text-xs text-muted-foreground truncate">{missionTitle}</p>
        <p className="text-xs text-muted-foreground">
          {formatDistanceToNow(new Date(submission.submitted_at), { addSuffix: true })}
        </p>
      </div>
      {photoUrl && (
        <img
          src={photoUrl}
          alt="Proof"
          className="w-[60px] h-[60px] rounded-xl object-cover shrink-0"
        />
      )}
      <div className="flex gap-2 shrink-0">
        <Button size="sm" onClick={onApprove} className="rounded-lg bg-jungle-bright hover:bg-jungle-mid text-white font-heading font-bold text-xs px-3">
          ✓
        </Button>
        <Button size="sm" variant="destructive" onClick={onReject} className="rounded-lg font-heading font-bold text-xs px-3">
          ✗
        </Button>
      </div>
    </div>
  );
}

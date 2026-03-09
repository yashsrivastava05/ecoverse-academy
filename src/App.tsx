import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { AuthProvider } from "@/hooks/useAuth";
import ProtectedRoute from "@/components/ProtectedRoute";
import TeacherRoute from "@/components/TeacherRoute";
import LandingPage from "./pages/LandingPage";
import LoginPage, { SignupPage } from "./pages/AuthPages";
import OnboardingPage from "./pages/OnboardingPage";
import DashboardPage from "./pages/DashboardPage";
import MissionsPage from "./pages/MissionsPage";
import LearnHub from "./pages/LearnHub";
import TopicLessons from "./pages/TopicLessons";
import LessonReader from "./pages/LessonReader";
import QuizExperience from "./pages/QuizExperience";
import LeaderboardPage from "./pages/LeaderboardPage";
import ProfilePage from "./pages/ProfilePage";
import AppLayout from "./components/layout/AppLayout";
import TeacherLayout from "./components/layout/TeacherLayout";
import TeacherOverview from "./pages/teacher/TeacherOverview";
import TeacherSubmissions from "./pages/teacher/TeacherSubmissions";
import TeacherStudents from "./pages/teacher/TeacherStudents";
import TeacherMissions from "./pages/teacher/TeacherMissions";
import TeacherLeaderboard from "./pages/teacher/TeacherLeaderboard";
import NotFound from "./pages/NotFound";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <AuthProvider>
      <TooltipProvider>
        <Toaster />
        <Sonner />
        <BrowserRouter>
          <Routes>
            <Route path="/" element={<LandingPage />} />
            <Route path="/login" element={<LoginPage />} />
            <Route path="/signup" element={<SignupPage />} />
            <Route path="/onboarding" element={<ProtectedRoute><OnboardingPage /></ProtectedRoute>} />
            <Route path="/dashboard" element={<ProtectedRoute><AppLayout><DashboardPage /></AppLayout></ProtectedRoute>} />
            <Route path="/missions" element={<ProtectedRoute><AppLayout><MissionsPage /></AppLayout></ProtectedRoute>} />
            <Route path="/learn" element={<ProtectedRoute><AppLayout><LearnHub /></AppLayout></ProtectedRoute>} />
            <Route path="/learn/:topic" element={<ProtectedRoute><AppLayout><TopicLessons /></AppLayout></ProtectedRoute>} />
            <Route path="/learn/:topic/quiz" element={<ProtectedRoute><AppLayout><QuizExperience /></AppLayout></ProtectedRoute>} />
            <Route path="/learn/:topic/:lessonId" element={<ProtectedRoute><AppLayout><LessonReader /></AppLayout></ProtectedRoute>} />
            <Route path="/leaderboard" element={<ProtectedRoute><AppLayout><LeaderboardPage /></AppLayout></ProtectedRoute>} />
            <Route path="/profile" element={<ProtectedRoute><AppLayout><ProfilePage /></AppLayout></ProtectedRoute>} />
            {/* Teacher routes */}
            <Route path="/teacher" element={<TeacherRoute><TeacherLayout><TeacherOverview /></TeacherLayout></TeacherRoute>} />
            <Route path="/teacher/submissions" element={<TeacherRoute><TeacherLayout><TeacherSubmissions /></TeacherLayout></TeacherRoute>} />
            <Route path="/teacher/students" element={<TeacherRoute><TeacherLayout><TeacherStudents /></TeacherLayout></TeacherRoute>} />
            <Route path="/teacher/missions" element={<TeacherRoute><TeacherLayout><TeacherMissions /></TeacherLayout></TeacherRoute>} />
            <Route path="/teacher/leaderboard" element={<TeacherRoute><TeacherLayout><TeacherLeaderboard /></TeacherLayout></TeacherRoute>} />
            <Route path="*" element={<NotFound />} />
          </Routes>
        </BrowserRouter>
      </TooltipProvider>
    </AuthProvider>
  </QueryClientProvider>
);

export default App;

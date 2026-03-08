import { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { Home, Target, BookOpen, Globe, Trophy, Gift, User, Bell, Menu, X } from 'lucide-react';
import { EcoPointsBadge } from '@/components/game/GameUI';
import { MOCK_USER, MOCK_NOTIFICATIONS } from '@/lib/mock-data';
import { useIsMobile } from '@/hooks/use-mobile';

const NAV_ITEMS = [
  { path: '/dashboard', icon: Home, label: 'Dashboard' },
  { path: '/missions', icon: Target, label: 'Missions' },
  { path: '/learn', icon: BookOpen, label: 'Learn' },
  { path: '/leaderboard', icon: Trophy, label: 'Leaderboard' },
  { path: '/profile', icon: User, label: 'Profile' },
];

export default function AppLayout({ children }: { children: React.ReactNode }) {
  const location = useLocation();
  const isMobile = useIsMobile();
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [notifOpen, setNotifOpen] = useState(false);
  const unread = MOCK_NOTIFICATIONS.filter(n => !n.is_read).length;

  return (
    <div className="min-h-screen bg-gradient-mesh">
      {/* Top bar */}
      <header className="sticky top-0 z-50 flex items-center justify-between border-b border-border/50 bg-card/80 backdrop-blur-xl px-4 h-14">
        <div className="flex items-center gap-3">
          {!isMobile && (
            <button onClick={() => setSidebarOpen(!sidebarOpen)} className="p-2 rounded-lg hover:bg-accent transition-colors">
              <Menu className="w-5 h-5 text-foreground" />
            </button>
          )}
          <Link to="/dashboard" className="flex items-center gap-2">
            <span className="text-xl">🌍</span>
            <span className="font-display font-bold text-primary text-lg hidden sm:inline">EcoQuest</span>
          </Link>
        </div>
        <div className="flex items-center gap-3">
          <EcoPointsBadge points={MOCK_USER.eco_points} size="sm" />
          <div className="relative">
            <button onClick={() => setNotifOpen(!notifOpen)} className="relative p-2 rounded-lg hover:bg-accent transition-colors">
              <Bell className="w-5 h-5 text-foreground" />
              {unread > 0 && (
                <span className="absolute -top-0.5 -right-0.5 w-4 h-4 rounded-full bg-primary text-primary-foreground text-[10px] flex items-center justify-center font-bold">{unread}</span>
              )}
            </button>
            <AnimatePresence>
              {notifOpen && (
                <motion.div
                  initial={{ opacity: 0, y: -10, scale: 0.95 }}
                  animate={{ opacity: 1, y: 0, scale: 1 }}
                  exit={{ opacity: 0, y: -10, scale: 0.95 }}
                  className="absolute right-0 top-12 w-80 rounded-xl border border-border bg-card shadow-xl p-4 z-50"
                >
                  <h3 className="font-heading font-bold text-foreground mb-3">Notifications</h3>
                  <div className="space-y-2 max-h-60 overflow-y-auto">
                    {MOCK_NOTIFICATIONS.map(n => (
                      <div key={n.id} className={`p-3 rounded-lg border text-sm ${n.is_read ? 'border-border bg-card/50' : 'border-primary/30 bg-accent'}`}>
                        <p className="font-bold text-foreground">{n.title}</p>
                        <p className="text-muted-foreground text-xs mt-1">{n.body}</p>
                      </div>
                    ))}
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
          <Link to="/profile" className="w-8 h-8 rounded-full bg-accent border border-primary/30 flex items-center justify-center text-sm font-bold text-primary">
            {MOCK_USER.full_name.charAt(0)}
          </Link>
        </div>
      </header>

      <div className="flex">
        {/* Desktop Sidebar */}
        {!isMobile && (
          <motion.aside
            initial={false}
            animate={{ width: sidebarOpen ? 220 : 64 }}
            className="sticky top-14 h-[calc(100vh-3.5rem)] border-r border-border/50 bg-card/40 backdrop-blur-sm flex flex-col py-4 overflow-hidden shrink-0"
          >
            <nav className="flex flex-col gap-1 px-2">
              {NAV_ITEMS.map(item => {
                const active = location.pathname === item.path;
                return (
                  <Link
                    key={item.path}
                    to={item.path}
                    className={`flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-all relative ${
                      active ? 'text-primary bg-accent glow-sm' : 'text-muted-foreground hover:text-foreground hover:bg-accent/50'
                    }`}
                  >
                    <item.icon className="w-5 h-5 shrink-0" />
                    <AnimatePresence>
                      {sidebarOpen && (
                        <motion.span
                          initial={{ opacity: 0 }}
                          animate={{ opacity: 1 }}
                          exit={{ opacity: 0 }}
                          className="whitespace-nowrap"
                        >
                          {item.label}
                        </motion.span>
                      )}
                    </AnimatePresence>
                  </Link>
                );
              })}
            </nav>
          </motion.aside>
        )}

        {/* Main Content */}
        <main className="flex-1 min-h-[calc(100vh-3.5rem)] pb-20 md:pb-6">
          <AnimatePresence mode="wait">
            <motion.div
              key={location.pathname}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              transition={{ duration: 0.3 }}
            >
              {children}
            </motion.div>
          </AnimatePresence>
        </main>
      </div>

      {/* Mobile Bottom Tab Bar */}
      {isMobile && (
        <nav className="fixed bottom-0 left-0 right-0 z-50 flex items-center justify-around border-t border-border/50 bg-card/90 backdrop-blur-xl h-16 px-2">
          {NAV_ITEMS.map(item => {
            const active = location.pathname === item.path;
            return (
              <Link
                key={item.path}
                to={item.path}
                className={`flex flex-col items-center gap-0.5 py-1 px-3 rounded-xl text-xs transition-all ${
                  active ? 'text-primary' : 'text-muted-foreground'
                }`}
              >
                <item.icon className="w-5 h-5" />
                <span className="font-medium">{item.label}</span>
                {active && (
                  <motion.div layoutId="tab-indicator" className="absolute bottom-1 w-8 h-1 rounded-full bg-primary glow-sm" />
                )}
              </Link>
            );
          })}
        </nav>
      )}
    </div>
  );
}

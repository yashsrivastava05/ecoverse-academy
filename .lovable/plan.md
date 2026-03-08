

# Fix: Dashboard Blank Screen — Double-Nested Routes

## Root Cause
`App.tsx` has outer routes like `<Route path="/dashboard" element={<AppRoutes />} />`. Inside `AppRoutes`, there's a second `<Routes>` component with `<Route path="/dashboard" ...>`. In React Router v6, without a `/*` wildcard on the parent route, the child `<Routes>` sees an empty remaining path and matches nothing — hence the blank screen.

## Fix (in `src/App.tsx`)
Eliminate the double `<Routes>` by inlining `<AppLayout>` directly in the outer routes instead of going through `AppRoutes`:

```tsx
const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<LandingPage />} />
          <Route path="/login" element={<LoginPage />} />
          <Route path="/signup" element={<SignupPage />} />
          <Route path="/onboarding" element={<OnboardingPage />} />
          <Route path="/dashboard" element={<AppLayout><DashboardPage /></AppLayout>} />
          <Route path="/missions" element={<AppLayout><MissionsPage /></AppLayout>} />
          <Route path="/learn" element={<AppLayout><LearnPage /></AppLayout>} />
          <Route path="/leaderboard" element={<AppLayout><LeaderboardPage /></AppLayout>} />
          <Route path="/profile" element={<AppLayout><ProfilePage /></AppLayout>} />
          <Route path="*" element={<NotFound />} />
        </Routes>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);
```

Remove the `AppRoutes` function entirely.

## Files Modified
- `src/App.tsx` — remove `AppRoutes`, inline `AppLayout` wrapping per route

This is a one-file, ~10-line change that fixes all app pages (Dashboard, Missions, Learn, Leaderboard, Profile).


import { lazy, Suspense } from 'react';
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route, useNavigate } from "react-router-dom";
const Index = lazy(() => import('./pages/Index'));
const NotFound = lazy(() => import('./pages/NotFound'));
const PrintSession = lazy(() => import('./pages/PrintSession'));
const TeamSetup = lazy(() => import('./components/TeamSetup'));
const SessionPlanner = lazy(() => import('./components/SessionPlanner'));
const PracticeLibrary = lazy(() => import('./components/PracticeLibrary'));
const AuthPage = lazy(() => import('./components/AuthPage'));
const CoachMode = lazy(() => import('./pages/CoachMode'));
const MySessions = lazy(() => import('./pages/MySessions'));
const BlockPlanner = lazy(() => import('./pages/BlockPlanner'));
const AccountRecovery = lazy(() => import('./pages/AccountRecovery'));

const Legal = lazy(() => import('./pages/Legal'));
const queryClient = new QueryClient();

const LibraryRoute = () => {
  const navigate = useNavigate();
  return <PracticeLibrary onBack={() => navigate('/')} />;
};
const AccountRoute = () => {
  const navigate = useNavigate();
  return <AuthPage onBack={() => navigate('/')} />;
};

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <Suspense fallback={<p className="p-8 text-muted-foreground">Loading…</p>}>
        <Routes>
          <Route path="/" element={<Index />} />
          <Route path="/plan" element={<TeamSetup />} />
          <Route path="/session/:id" element={<SessionPlanner />} />
          <Route path="/session/:id/print" element={<PrintSession />} />
          <Route path="/session/:id/coach" element={<CoachMode />} />
          <Route path="/sessions" element={<MySessions />} />
          <Route path="/block" element={<BlockPlanner />} />
          <Route path="/library" element={<LibraryRoute />} />
          <Route path="/account" element={<AccountRoute />} />
          <Route path="/account/recovery" element={<AccountRecovery />} />
          <Route path="/privacy" element={<Legal kind="privacy" />} />
          <Route path="/terms" element={<Legal kind="terms" />} />
          {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
          <Route path="*" element={<NotFound />} />
        </Routes>
        </Suspense>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;

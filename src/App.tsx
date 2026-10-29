import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route, useNavigate } from "react-router-dom";
import Index from "./pages/Index";
import NotFound from "./pages/NotFound";
import PrintSession from "./pages/PrintSession";
import TeamSetup from "./components/TeamSetup";
import SessionPlanner from "./components/SessionPlanner";
import PracticeLibrary from "./components/PracticeLibrary";
import AuthPage from "./components/AuthPage";

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
        <Routes>
          <Route path="/" element={<Index />} />
          <Route path="/plan" element={<TeamSetup />} />
          <Route path="/session/:id" element={<SessionPlanner />} />
          <Route path="/session/:id/print" element={<PrintSession />} />
          <Route path="/library" element={<LibraryRoute />} />
          <Route path="/account" element={<AccountRoute />} />
          {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
          <Route path="*" element={<NotFound />} />
        </Routes>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;

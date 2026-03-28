import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { Provider } from "react-redux";
import { store } from "@/store";

// Landing / marketing pages
import Index from "./pages/Index";
import Quests from "./pages/Quests";
import Arena from "./pages/Arena";
import Leaderboard from "./pages/Leaderboard";
import Docs from "./pages/Docs";
import CodeAnalysis from "./pages/CodeAnalysis";
import AnalysisResults from "./pages/AnalysisResults";

// DSA Adventure Hub pages (the actual app)
import ProtectedRoute from "./components/ProtectedRoute";
import LoginPage from "./pages/LoginPage";
import RegisterPage from "./pages/RegisterPage";
import AppDashboard from "./pages/AppDashboard";
import QuestMap from "./pages/QuestMap";
import ProblemPage from "./pages/ProblemPage";
import CodeWars from "./pages/CodeWars";
import AppLeaderboard from "./pages/AppLeaderboard";
import Profile from "./pages/Profile";

import NotFound from "./pages/NotFound";

const queryClient = new QueryClient();

const App = () => (
  <Provider store={store}>
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <Toaster />
        <Sonner />
        <BrowserRouter>
          <Routes>
            {/* ── Marketing / Landing ───────────────────── */}
            <Route path="/" element={<Index />} />
            <Route path="/explore/quests" element={<Quests />} />
            <Route path="/explore/arena" element={<Arena />} />
            <Route path="/explore/leaderboard" element={<Leaderboard />} />
            <Route path="/explore/docs" element={<Docs />} />
            <Route path="/analysis" element={<CodeAnalysis />} />
            <Route path="/analysis/project/:id" element={<AnalysisResults />} />

            {/* ── DSA Adventure Hub App ─────────────────── */}
            <Route path="/login" element={<LoginPage />} />
            <Route path="/register" element={<RegisterPage />} />
            <Route path="/dashboard" element={<ProtectedRoute><AppDashboard /></ProtectedRoute>} />
            <Route path="/quests" element={<ProtectedRoute><QuestMap /></ProtectedRoute>} />
            <Route path="/problem/:id" element={<ProtectedRoute><ProblemPage /></ProtectedRoute>} />
            <Route path="/battle" element={<ProtectedRoute><CodeWars /></ProtectedRoute>} />
            <Route path="/leaderboard" element={<ProtectedRoute><AppLeaderboard /></ProtectedRoute>} />
            <Route path="/profile" element={<ProtectedRoute><Profile /></ProtectedRoute>} />

            {/* ── Catch-all ─────────────────────────────── */}
            <Route path="*" element={<NotFound />} />
          </Routes>
        </BrowserRouter>
      </TooltipProvider>
    </QueryClientProvider>
  </Provider>
);

export default App;

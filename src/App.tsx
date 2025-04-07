
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { SidebarProvider } from "@/components/ui/sidebar";
import Dashboard from "./pages/Dashboard";
import AutomationRisk from "./pages/AutomationRisk";
import TrainingEffectiveness from "./pages/TrainingEffectiveness";
import ReskillSuccess from "./pages/ReskillSuccess";
import BudgetCut from "./pages/BudgetCut";
import ReskillPriority from "./pages/ReskillPriority";
import NotFound from "./pages/NotFound";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <SidebarProvider>
        <BrowserRouter>
          <Routes>
            <Route path="/" element={<Dashboard />} />
            <Route path="/automation-risk" element={<AutomationRisk />} />
            <Route path="/training-effectiveness" element={<TrainingEffectiveness />} />
            <Route path="/reskill-success" element={<ReskillSuccess />} />
            <Route path="/budget-cut" element={<BudgetCut />} />
            <Route path="/reskill-priority" element={<ReskillPriority />} />
            <Route path="*" element={<NotFound />} />
          </Routes>
        </BrowserRouter>
      </SidebarProvider>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;

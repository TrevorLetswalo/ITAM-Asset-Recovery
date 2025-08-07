import "./global.css";

import { Toaster } from "@/components/ui/toaster";
import { createRoot } from "react-dom/client";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { ModernLayout } from "./components/ModernLayout";
import { ModernDashboard } from "./pages/ModernDashboard";
import { RecoveryQueue } from "./pages/RecoveryQueue";
import { SlaBreaches } from "./pages/SlaBreaches";
import { SelfServicePortal } from "./pages/SelfServicePortal";
import { EmailTemplates } from "./pages/EmailTemplates";
import { Reports } from "./pages/Reports";
import { Settings } from "./pages/Settings";
import NotFound from "./pages/NotFound";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <ModernLayout>
          <Routes>
            <Route path="/" element={<ModernDashboard />} />
            <Route path="/recovery-queue" element={<RecoveryQueue />} />
            <Route path="/sla-breaches" element={<SlaBreaches />} />
            <Route path="/self-service" element={<SelfServicePortal />} />
            <Route path="/email-templates" element={<EmailTemplates />} />
            <Route path="/reports" element={<Reports />} />
            <Route path="/settings" element={<Settings />} />
            <Route path="*" element={<NotFound />} />
          </Routes>
        </ModernLayout>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

createRoot(document.getElementById("root")!).render(<App />);

import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { TimelineNav } from "@/components/ui/timeline-nav";
import { useNavigation } from "@/hooks/useScrollNavigation";
import Index from "./pages/Index";
import Story from "./pages/Story";
import Adventure from "./pages/Adventure";
import Treasure from "./pages/Treasure";
import NotFound from "./pages/NotFound";

const queryClient = new QueryClient();

const AppContent = () => {
  useNavigation(); // Initialize keyboard navigation
  
  return (
    <>
      <TimelineNav />
      <main className="page-container">
        <div className="main-content">
          <Routes>
            <Route path="/" element={<Index />} />
            <Route path="/story" element={<Story />} />
            <Route path="/adventure" element={<Adventure />} />
            <Route path="/treasure" element={<Treasure />} />
            {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
            <Route path="*" element={<NotFound />} />
          </Routes>
        </div>
      </main>
    </>
  );
};

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <AppContent />
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;

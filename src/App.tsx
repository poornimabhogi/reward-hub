import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { AuthProvider } from "./contexts/AuthContext";
import Navigation from "./components/layout/Navigation";
import * as Pages from "./pages";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <AuthProvider>
        <Toaster />
        <Sonner />
        <BrowserRouter>
          <Navigation />
          <Routes>
            <Route path="/" element={<Pages.Index />} />
            <Route path="/signup" element={<Pages.Signup />} />
            <Route path="/profile" element={<Pages.Profile />} />
            <Route path="/lucky-draw" element={<Pages.LuckyDraw />} />
            <Route path="/shop" element={<Pages.Shop />} />
            <Route path="/sell" element={<Pages.Sell />} />
            <Route path="/payment" element={<Pages.Payment />} />
            <Route path="/games" element={<Pages.Games />} />
            <Route path="/games/2048" element={<Pages.Game2048 />} />
            <Route path="/social" element={<Pages.Social />} />
            <Route path="/health" element={<Pages.Health />} />
          </Routes>
        </BrowserRouter>
      </AuthProvider>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { AuthProvider } from "./contexts/AuthContext";
import Navigation from "./components/Navigation";
import Index from "./pages/Index";
import Profile from "./pages/Profile";
import LuckyDraw from "./pages/LuckyDraw";
import Shop from "./pages/Shop";
import Games from "./pages/Games";
import Game2048 from "./pages/Game2048";
import Social from "./pages/Social";
import Health from "./pages/Health";

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
            <Route path="/" element={<Index />} />
            <Route path="/profile" element={<Profile />} />
            <Route path="/lucky-draw" element={<LuckyDraw />} />
            <Route path="/shop" element={<Shop />} />
            <Route path="/games" element={<Games />} />
            <Route path="/games/2048" element={<Game2048 />} />
            <Route path="/social" element={<Social />} />
            <Route path="/health" element={<Health />} />
          </Routes>
        </BrowserRouter>
      </AuthProvider>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
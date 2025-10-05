import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Index from "./pages/Index";
import Katrina from "./pages/Katrina";
import KangarooIsland from "./pages/KangarooIsland";
import NotFound from "./pages/NotFound";
import AustraliaPage from "./pages/AustraliaPage"; // <-- CAMBIO 1: Importa la nueva página

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Index />} />
          <Route path="/katrina" element={<Katrina />} />
          <Route path="/kangaroo-island" element={<KangarooIsland />} />
          <Route path="/australia" element={<AustraliaPage />} /> {/* <-- CAMBIO 2: Añade la nueva ruta */}
          {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
          <Route path="*" element={<NotFound />} />
        </Routes>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
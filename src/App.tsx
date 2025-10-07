// src/App.tsx

import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
// Import Navigate for redirects
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { ThemeProvider } from "@/components/theme-provider";
import Index from "./pages/Index"; // This page should render your MainApp component
import NotFound from "./pages/NotFound";

const queryClient = new QueryClient();

const App = () => (
  <ThemeProvider defaultTheme="light">
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <Toaster />
        <Sonner />
        <BrowserRouter>
          <Routes>
            {/* Redirect from the base URL to the dashboard */}
            <Route path="/" element={<Navigate to="/dashboard" replace />} />

            {/* All these routes will render the MainApp component, which contains the layout */}
            <Route path="/dashboard" element={<Index />} />
            <Route path="/test" element={<Index />} />
            <Route path="/chat" element={<Index />} />
            <Route path="/history" element={<Index />} />
            <Route path="/contact" element={<Index />} />
            
            <Route path="*" element={<NotFound />} />
          </Routes>
        </BrowserRouter>
      </TooltipProvider>
    </QueryClientProvider>
  </ThemeProvider>
);

export default App;

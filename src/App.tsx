// src/App.tsx

import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";

// FIX: theme-provider.tsx and MainApp.tsx are located directly in 'src', 
// so a relative path import './' is used.
import { ThemeProvider } from "@/components/theme-provider"; // CORRECTED PATH
import MainApp from "./MainApp.tsx"; // CORRECTED PATH

// These imports assume a working path alias where "@/components" resolves to "src/components"
import Dashboard from "@/components/dashboard/Dashboard";
import KidneyTest from "@/components/test/KidneyTest";
import ChatBot from "@/components/chat/ChatBot";
import TestHistory from "@/components/history/TestHistory";
import ContactPage from "@/components/contact/ContactPage";

// The folder 'pages' is not visible in the file structure images. 
// Assuming NotFound.tsx is supposed to be here, but this path might need 
// further correction if 'pages' folder does not exist.
import NotFound from "./pages/NotFound"; 

import { AuthProvider } from "./contexts/AuthContext";
import { AppContextProvider } from "./contexts/AppContext";

const queryClient = new QueryClient();

const App = () => (
  <ThemeProvider defaultTheme="light">
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <Toaster />
        <Sonner />
        <BrowserRouter>
          {/* Make sure providers wrap the Routes */}
          <AuthProvider>
            <AppContextProvider>
              <Routes>
                {/* MainApp is now the parent route for the entire authenticated app */}
                <Route path="/" element={<MainApp />}>
                  {/* Child routes will be rendered inside MainApp's <Outlet /> */}
                  {/* Redirect from "/" to "/dashboard" */}
                  <Route index element={<Navigate to="/dashboard" replace />} />
                  <Route path="dashboard" element={<Dashboard />} />
                  <Route path="test" element={<KidneyTest />} />
                  <Route path="chat" element={<ChatBot />} />
                  <Route path="history" element={<TestHistory />} />
                  <Route path="contact" element={<ContactPage />} />
                </Route>
                <Route path="*" element={<NotFound />} />
              </Routes>
            </AppContextProvider>
          </AuthProvider>
        </BrowserRouter>
      </TooltipProvider>
    </QueryClientProvider>
  </ThemeProvider>
);

export default App;

import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { ThemeProvider } from "next-themes";
import { AuthProvider } from "@/hooks/useAuth";
import { LanguageProvider } from "@/contexts/LanguageContext";
import { RouteGuard } from "@/components/RouteGuard";
import { ErrorBoundary } from "@/components/ui/error-boundary";
import Index from "./pages/Index";
import Family from "./pages/Family";
import Cosmos from "./pages/Cosmos";
import Auth from "./pages/Auth";
import Onboarding from "./pages/Onboarding";
import BabySetup from "./pages/BabySetup";
import Settings from "./pages/Settings";
import NotFound from "./pages/NotFound";

const queryClient = new QueryClient();

const App = () => (
  <ErrorBoundary>
    <QueryClientProvider client={queryClient}>
      <ThemeProvider
        attribute="class"
        defaultTheme="dusk"
        themes={["dusk"]}
        disableTransitionOnChange
      >
        <AuthProvider>
          <LanguageProvider>
            <TooltipProvider>
              <Toaster />
              <Sonner />
              <BrowserRouter>
                <RouteGuard>
                  <Routes>
                    <Route path="/" element={<Index />} />
                    <Route path="/app" element={<Index />} />
                    <Route path="/family" element={<Family />} />
                    <Route path="/cosmos" element={<Cosmos />} />
                    <Route path="/onboarding" element={<Onboarding />} />
                    <Route path="/baby-setup" element={<BabySetup />} />
                    <Route path="/settings" element={<Settings />} />
                    <Route path="/auth" element={<Auth />} />
                    <Route path="/login" element={<Auth />} />
                    <Route path="*" element={<NotFound />} />
                  </Routes>
                </RouteGuard>
              </BrowserRouter>
            </TooltipProvider>
          </LanguageProvider>
        </AuthProvider>
      </ThemeProvider>
    </QueryClientProvider>
  </ErrorBoundary>
);

export default App;

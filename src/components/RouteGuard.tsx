import { useEffect, useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { useAuth } from "@/hooks/useAuth";
import { LoadingSpinner } from "@/components/ui/loading-spinner";
import { NightSkyBackground } from "@/components/ui/NightSkyBackground";

export const RouteGuard = ({ children }: { children: React.ReactNode }) => {
  const navigate = useNavigate();
  const location = useLocation();
  const { user, loading } = useAuth();
  const [showContent, setShowContent] = useState(false);

  useEffect(() => {
    if (loading) return;

    const publicPaths = ["/auth", "/login", "/onboarding", "/profile-setup"];
    const isPublicPath = publicPaths.some(path => location.pathname.startsWith(path));

    // Redirect authenticated users away from auth/login pages
    if (user && (location.pathname === "/auth" || location.pathname === "/login")) {
      navigate("/", { replace: true });
      return;
    }

    // Redirect unauthenticated users to onboarding
    if (!user && !isPublicPath) {
      navigate("/onboarding", { replace: true });
      return;
    }

    // Small delay to ensure smooth transition after auth state resolves
    const timer = setTimeout(() => setShowContent(true), 50);
    return () => clearTimeout(timer);
  }, [user, loading, location.pathname, navigate]);

  // Reset content visibility on route change during loading
  useEffect(() => {
    if (loading) {
      setShowContent(false);
    }
  }, [loading]);

  if (loading || !showContent) {
    return (
      <NightSkyBackground>
        <motion.div 
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.3 }}
          className="flex flex-col items-center justify-center min-h-screen gap-4"
        >
          <LoadingSpinner size="lg" />
          <motion.p
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2, duration: 0.3 }}
            className="text-[11px] text-foreground/40 tracking-widest uppercase"
          >
            Loading
          </motion.p>
        </motion.div>
      </NightSkyBackground>
    );
  }

  return (
    <AnimatePresence mode="wait">
      <motion.div
        key={location.pathname}
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        transition={{ duration: 0.2 }}
      >
        {children}
      </motion.div>
    </AnimatePresence>
  );
};

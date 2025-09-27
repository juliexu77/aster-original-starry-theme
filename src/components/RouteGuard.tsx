import { useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { useAuth } from "@/hooks/useAuth";

export const RouteGuard = ({ children }: { children: React.ReactNode }) => {
  const navigate = useNavigate();
  const location = useLocation();
  const { user, loading } = useAuth();

  useEffect(() => {
    if (loading) return;

    const isGuest = localStorage.getItem('skipOnboarding') === 'true';

    // Don't interfere with the natural onboarding flow
    // Just protect /app route for non-authenticated, non-guest users
    if (!user && !isGuest && location.pathname.startsWith("/app")) {
      navigate("/", { replace: true });
    }

    // Mark demo seen only on true landing page
    if (location.pathname === "/" && !localStorage.getItem("hasSeenDemo")) {
      localStorage.setItem("hasSeenDemo", "true");
    }
  }, [user, loading, location.pathname, navigate]);

  return <>{children}</>;
};
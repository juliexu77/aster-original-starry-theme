import { useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { useAuth } from "@/hooks/useAuth";

export const RouteGuard = ({ children }: { children: React.ReactNode }) => {
  const navigate = useNavigate();
  const location = useLocation();
  const { user, loading } = useAuth();

  useEffect(() => {
    if (loading) return;

    // If authenticated, keep user in the app
    if (user) {
      if (location.pathname === "/" || location.pathname.startsWith("/onboarding") || location.pathname.startsWith("/auth")) {
        navigate("/app", { replace: true });
      }
      return;
    }

    // If not authenticated, block app routes
    if (!user) {
      if (location.pathname.startsWith("/app") || location.pathname.startsWith("/baby-setup")) {
        navigate("/auth", { replace: true });
      }
      // Mark demo seen only on true landing page
      if (location.pathname === "/" && !localStorage.getItem("hasSeenDemo")) {
        localStorage.setItem("hasSeenDemo", "true");
      }
    }
  }, [user, loading, location.pathname, navigate]);

  return <>{children}</>;
};
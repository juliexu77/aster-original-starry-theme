import { useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { useAuth } from "@/hooks/useAuth";
import { LoadingSpinner } from "@/components/ui/loading-spinner";

export const RouteGuard = ({ children }: { children: React.ReactNode }) => {
  const navigate = useNavigate();
  const location = useLocation();
  const { user, loading } = useAuth();

  useEffect(() => {
    if (loading) return;

    const publicPaths = ["/auth", "/login", "/onboarding"];
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
  }, [user, loading, location.pathname, navigate]);

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <LoadingSpinner />
      </div>
    );
  }

  return <>{children}</>;
};

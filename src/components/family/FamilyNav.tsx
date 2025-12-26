import { useNavigate, useLocation } from "react-router-dom";
import { Sparkles, Users, Settings } from "lucide-react";

export const FamilyNav = () => {
  const navigate = useNavigate();
  const location = useLocation();
  
  const isFamily = location.pathname === "/family";
  const isChart = location.pathname === "/" || location.pathname === "/app";
  const isSettings = location.pathname === "/settings";

  return (
    <nav className="fixed bottom-0 left-0 right-0 z-40 bg-background/80 backdrop-blur-xl border-t border-border/20">
      <div className="flex items-center justify-around py-2 pb-[max(0.5rem,env(safe-area-inset-bottom))]">
        <button 
          onClick={() => navigate("/family")}
          className="flex flex-col items-center gap-1 px-6 py-1"
        >
          <Users className={`w-5 h-5 ${isFamily ? "text-foreground" : "text-muted-foreground"}`} />
          <span className={`text-[10px] ${isFamily ? "text-foreground" : "text-muted-foreground"}`}>
            Child
          </span>
        </button>

        <button 
          onClick={() => navigate("/")}
          className="flex flex-col items-center gap-1 px-6 py-1"
        >
          <Sparkles className={`w-5 h-5 ${isChart ? "text-foreground" : "text-muted-foreground"}`} />
          <span className={`text-[10px] ${isChart ? "text-foreground" : "text-muted-foreground"}`}>
            Chart
          </span>
        </button>

        <button 
          onClick={() => navigate("/settings")}
          className="flex flex-col items-center gap-1 px-6 py-1"
        >
          <Settings className={`w-5 h-5 ${isSettings ? "text-foreground" : "text-muted-foreground"}`} />
          <span className={`text-[10px] ${isSettings ? "text-foreground" : "text-muted-foreground"}`}>
            Settings
          </span>
        </button>
      </div>
    </nav>
  );
};

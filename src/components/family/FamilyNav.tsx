import { useNavigate, useLocation } from "react-router-dom";
import { Sparkles, Users, Settings } from "lucide-react";
import { IconZodiacSagittarius } from "@tabler/icons-react";

export const FamilyNav = () => {
  const navigate = useNavigate();
  const location = useLocation();
  
  const isCosmos = location.pathname === "/" || location.pathname === "/cosmos";
  const isChart = location.pathname === "/chart";
  const isFamily = location.pathname === "/family" || location.pathname === "/relationships";
  const isSettings = location.pathname === "/settings";

  return (
    <nav className="fixed bottom-0 left-0 right-0 z-40 border-t border-border/10 backdrop-blur-sm bg-transparent">
      <div className="flex items-center justify-around py-3 pb-[max(0.75rem,env(safe-area-inset-bottom))]">
        <button 
          onClick={() => navigate("/")}
          className="flex flex-col items-center gap-1 px-4 py-1"
        >
          <IconZodiacSagittarius className={`w-5 h-5 ${isCosmos ? "text-foreground" : "text-muted-foreground"}`} strokeWidth={1.5} />
          <span className={`text-[10px] ${isCosmos ? "text-foreground" : "text-muted-foreground"}`}>
            Cosmos
          </span>
        </button>

        <button 
          onClick={() => navigate("/chart")}
          className="flex flex-col items-center gap-1 px-4 py-1"
        >
          <Sparkles className={`w-5 h-5 ${isChart ? "text-foreground" : "text-muted-foreground"}`} />
          <span className={`text-[10px] ${isChart ? "text-foreground" : "text-muted-foreground"}`}>
            Chart
          </span>
        </button>

        <button 
          onClick={() => navigate("/family")}
          className="flex flex-col items-center gap-1 px-4 py-1"
        >
          <Users className={`w-5 h-5 ${isFamily ? "text-foreground" : "text-muted-foreground"}`} />
          <span className={`text-[10px] ${isFamily ? "text-foreground" : "text-muted-foreground"}`}>
            Family
          </span>
        </button>

        <button 
          onClick={() => navigate("/settings")}
          className="flex flex-col items-center gap-1 px-4 py-1"
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

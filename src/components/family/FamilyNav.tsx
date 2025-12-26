import { useNavigate, useLocation } from "react-router-dom";
import { Sparkles, Users, Settings } from "lucide-react";

export const FamilyNav = () => {
  const navigate = useNavigate();
  const location = useLocation();
  
  const isFamily = location.pathname === "/family";
  const isChart = location.pathname === "/" || location.pathname === "/app";
  const isSettings = location.pathname === "/settings";

  return (
    <div className="fixed bottom-0 left-0 right-0 z-40">
      <div className="mx-4 mb-4 rounded-full bg-muted/60 backdrop-blur-xl border border-border/30 flex items-center justify-around px-2 py-2">
        <button 
          onClick={() => navigate("/family")}
          className={`flex items-center gap-1.5 px-4 py-1.5 rounded-full transition-colors ${
            isFamily ? "bg-muted/80" : ""
          }`}
        >
          <Users className={`w-4 h-4 ${isFamily ? "text-foreground" : "text-muted-foreground"}`} />
          <span className={`text-xs ${isFamily ? "text-foreground" : "text-muted-foreground"}`}>
            Child
          </span>
        </button>

        <button 
          onClick={() => navigate("/")}
          className={`flex items-center gap-1.5 px-4 py-1.5 rounded-full transition-colors ${
            isChart ? "bg-muted/80" : ""
          }`}
        >
          <Sparkles className={`w-4 h-4 ${isChart ? "text-foreground" : "text-muted-foreground"}`} />
          <span className={`text-xs ${isChart ? "text-foreground" : "text-muted-foreground"}`}>
            Chart
          </span>
        </button>

        <button 
          onClick={() => navigate("/settings")}
          className={`flex items-center gap-1.5 px-4 py-1.5 rounded-full transition-colors ${
            isSettings ? "bg-muted/80" : ""
          }`}
        >
          <Settings className={`w-4 h-4 ${isSettings ? "text-foreground" : "text-muted-foreground"}`} />
          <span className={`text-xs ${isSettings ? "text-foreground" : "text-muted-foreground"}`}>
            Settings
          </span>
        </button>
      </div>
    </div>
  );
};

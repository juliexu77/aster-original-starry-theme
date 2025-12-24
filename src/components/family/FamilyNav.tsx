import { useNavigate, useLocation } from "react-router-dom";
import { Sparkles, Users, Settings } from "lucide-react";

export const FamilyNav = () => {
  const navigate = useNavigate();
  const location = useLocation();
  
  const isFamily = location.pathname === "/family";
  const isHome = location.pathname === "/" || location.pathname === "/app";

  return (
    <div className="fixed bottom-0 left-0 right-0 z-40">
      <div className="mx-4 mb-4 rounded-full bg-muted/60 backdrop-blur-xl border border-border/30 flex items-center justify-between px-2 py-2">
        {/* Chart tab */}
        <button 
          onClick={() => navigate("/")}
          className={`flex items-center gap-1.5 px-3 py-1.5 rounded-full transition-colors ${
            isHome ? "bg-muted/80" : ""
          }`}
        >
          <Sparkles className={`w-4 h-4 ${isHome ? "text-foreground" : "text-muted-foreground"}`} />
          <span className={`text-xs ${isHome ? "text-foreground" : "text-muted-foreground"}`}>
            Chart
          </span>
        </button>

        {/* Center spacer */}
        <div className="flex-1" />

        {/* Family tab */}
        <button 
          onClick={() => navigate("/family")}
          className={`flex items-center gap-1.5 px-3 py-1.5 rounded-full transition-colors ${
            isFamily ? "bg-muted/80" : ""
          }`}
        >
          <Users className={`w-4 h-4 ${isFamily ? "text-foreground" : "text-muted-foreground"}`} />
          <span className={`text-xs ${isFamily ? "text-foreground" : "text-muted-foreground"}`}>
            Family
          </span>
        </button>

        {/* Settings */}
        <button 
          onClick={() => navigate("/settings")}
          className="w-9 h-9 rounded-full flex items-center justify-center ml-1"
        >
          <Settings className="w-4 h-4 text-muted-foreground" />
        </button>
      </div>
    </div>
  );
};

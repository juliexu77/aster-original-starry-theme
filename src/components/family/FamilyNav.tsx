import { useNavigate, useLocation } from "react-router-dom";
import { MapPin, Users } from "lucide-react";

export const FamilyNav = () => {
  const navigate = useNavigate();
  const location = useLocation();
  
  const isFamily = location.pathname === "/family";
  const isHome = location.pathname === "/" || location.pathname === "/app";

  return (
    <div className="fixed bottom-0 left-0 right-0 z-40">
      <div className="mx-4 mb-4 rounded-full bg-muted/60 backdrop-blur-xl border border-border/30 flex items-center justify-center px-2 py-2 gap-6">
        {/* Today tab */}
        <button 
          onClick={() => navigate("/")}
          className={`flex flex-col items-center gap-0.5 px-4 py-1 rounded-full transition-colors ${
            isHome ? "bg-muted/80" : ""
          }`}
        >
          <MapPin className={`w-5 h-5 ${isHome ? "text-foreground" : "text-muted-foreground"}`} />
          <span className={`text-[10px] ${isHome ? "text-foreground" : "text-muted-foreground"}`}>
            Today
          </span>
        </button>

        {/* Family tab */}
        <button 
          onClick={() => navigate("/family")}
          className={`flex flex-col items-center gap-0.5 px-4 py-1 rounded-full transition-colors ${
            isFamily ? "bg-muted/80" : ""
          }`}
        >
          <Users className={`w-5 h-5 ${isFamily ? "text-foreground" : "text-muted-foreground"}`} />
          <span className={`text-[10px] ${isFamily ? "text-foreground" : "text-muted-foreground"}`}>
            Family
          </span>
        </button>
      </div>
    </div>
  );
};

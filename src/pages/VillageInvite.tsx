import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { useLanguage } from "@/contexts/LanguageContext";
import { Card, CardContent } from "@/components/ui/card";

const VillageInvite = () => {
  const navigate = useNavigate();
  const { t } = useLanguage();

  return (
    <div className="min-h-screen bg-background flex items-center justify-center p-6">
      <div className="w-full max-w-md space-y-8">
        {/* Header */}
        <div className="text-center space-y-4">
          <div className="flex items-center justify-center">
            <div className="text-4xl">👩‍👩‍👧‍👦</div>
          </div>
          <h1 className="text-2xl font-heading font-semibold text-foreground leading-tight">
            Who's in your village?
          </h1>
          <p className="text-sm text-muted-foreground font-light leading-relaxed">
            Parenting is easier when shared.<br />
            Invite your partner, grandparent, or nanny to stay in sync.
          </p>
        </div>

        <Card className="border-border bg-card/50 backdrop-blur shadow-card">
          <CardContent className="pt-6 space-y-4">
            <Button
              onClick={() => navigate("/app?tab=settings")}
              className="w-full font-semibold"
            >
              + Add someone
            </Button>
            
            <Button
              onClick={() => navigate("/onboarding/ready")}
              variant="ghost"
              className="w-full font-normal text-muted-foreground"
            >
              Skip for now — you can invite them anytime
            </Button>

            <p className="text-xs text-center text-muted-foreground italic leading-relaxed pt-2">
              Everyone sees the same daily rhythm — so care feels consistent and connected.
            </p>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default VillageInvite;

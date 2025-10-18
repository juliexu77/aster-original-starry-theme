import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { useLanguage } from "@/contexts/LanguageContext";
import { Users, ArrowRight } from "lucide-react";
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
            <Users className="w-8 h-8 text-primary/60" />
          </div>
          <h1 className="text-2xl font-heading font-semibold text-foreground leading-tight">
            {t('villageHeadline')}
          </h1>
          <p className="text-base text-foreground font-light leading-relaxed">
            {t('villageSubheadline')}
          </p>
          <p className="text-sm text-muted-foreground leading-relaxed">
            {t('villageDescription')}
          </p>
        </div>

        {/* Content */}
        <Card className="border-border bg-card/50 backdrop-blur shadow-card">
          <CardContent className="pt-6 space-y-6">
            <Button
              onClick={() => navigate("/app?openSettings=caregivers")}
              variant="outline"
              className="w-full justify-center gap-2 h-12 text-base font-medium"
            >
              <Users className="w-4 h-4" />
              {t('addSomeone')}
            </Button>

            <div className="space-y-4">
              <p className="text-xs text-warm-gray italic leading-relaxed">
                {t('villageSkip')}
              </p>
              <p className="text-xs text-muted-foreground leading-relaxed">
                {t('villageMicrocopy')}
              </p>
            </div>

            <Button
              onClick={() => navigate("/onboarding/ready")}
              className="w-full font-semibold gap-2"
            >
              {t('continue')}
              <ArrowRight className="w-4 h-4" />
            </Button>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default VillageInvite;

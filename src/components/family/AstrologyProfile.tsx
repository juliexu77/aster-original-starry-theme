import { ZodiacSign, getZodiacName } from "@/lib/zodiac";
import { 
  SUN_MECHANICS, 
  MOON_PATTERNS, 
  RISING_PRESENCE, 
  getSunRisingSynthesis,
  getSunSynthesis,
  getMoonSynthesis,
  getChartIntegration
} from "@/lib/astrology-content";
import { ZodiacIcon } from "@/components/ui/zodiac-icon";
import { Sun, Moon, Sparkles } from "lucide-react";

interface AstrologyProfileProps {
  sunSign: ZodiacSign;
  moonSign: ZodiacSign | null;
  risingSign: ZodiacSign | null;
  name: string;
  birthday?: string | null;
}

interface SectionProps {
  icon: React.ReactNode;
  title: string;
  subtitle: string;
  children: React.ReactNode;
  isFirst?: boolean;
}

const Section = ({ icon, title, subtitle, children, isFirst }: SectionProps) => (
  <div className={`px-4 py-5 ${isFirst ? '' : 'border-t border-foreground/[0.06]'}`}>
    <div className="flex items-start gap-3 mb-3">
      <div className="flex-shrink-0 w-8 h-8 rounded-full bg-foreground/[0.04] flex items-center justify-center text-foreground/50 mt-0.5">
        {icon}
      </div>
      <div className="flex-1">
        <h3 className="text-[13px] font-medium text-foreground/80 tracking-wide">
          {title}
        </h3>
        <p className="text-[10px] text-foreground/30 tracking-[0.1em] mt-0.5 uppercase">
          {subtitle}
        </p>
      </div>
    </div>
    <div className="pl-11">
      {children}
    </div>
  </div>
);

const TraitList = ({ traits }: { traits: string[] }) => (
  <ul className="space-y-1.5">
    {traits.map((trait, i) => (
      <li key={i} className="text-[13px] text-foreground/60 leading-relaxed">
        {trait}
      </li>
    ))}
  </ul>
);

export const AstrologyProfile = ({ sunSign, moonSign, risingSign, name, birthday }: AstrologyProfileProps) => {
  const sunMechanics = SUN_MECHANICS[sunSign];
  const moonPatterns = moonSign ? MOON_PATTERNS[moonSign] : null;
  const risingPresence = risingSign ? RISING_PRESENCE[risingSign] : null;
  const chartIntegration = getChartIntegration(sunSign, moonSign, risingSign, name, birthday || null);
  
  // Get first name for personalization
  const firstName = name.split(' ')[0];

  return (
    <div className="bg-foreground/[0.02] border border-foreground/[0.06] rounded-xl overflow-hidden">
      {/* SUN SECTION */}
      <Section
        icon={<Sun size={18} strokeWidth={1.5} />}
        title={`${firstName}'s Sun in ${getZodiacName(sunSign)}`}
        subtitle="Core identity"
        isFirst
      >
        <div className="space-y-3">
          <p className="text-[13px] text-foreground/60 leading-relaxed">
            {getSunSynthesis(sunSign)}
          </p>
          <ul className="space-y-1.5 pt-1">
            {sunMechanics.slice(0, 3).map((trait, i) => (
              <li key={i} className="text-[12px] text-foreground/50 leading-relaxed">
                {trait}
              </li>
            ))}
          </ul>
        </div>
      </Section>

      {/* MOON SECTION */}
      {moonSign && moonPatterns && (
        <Section
          icon={<Moon size={18} strokeWidth={1.5} />}
          title={`${firstName}'s Moon in ${getZodiacName(moonSign)}`}
          subtitle="Emotional needs"
        >
          <div className="space-y-3">
            <p className="text-[13px] text-foreground/60 leading-relaxed">
              {getMoonSynthesis(moonSign)}
            </p>
            <ul className="space-y-1.5 pt-1">
              {moonPatterns.slice(0, 3).map((trait, i) => (
                <li key={i} className="text-[12px] text-foreground/50 leading-relaxed">
                  {trait}
                </li>
              ))}
            </ul>
          </div>
        </Section>
      )}

      {/* RISING SECTION */}
      {risingSign && risingPresence && (
        <Section
          icon={<ZodiacIcon sign={risingSign} size={18} strokeWidth={1.5} />}
          title={`${firstName}'s ${getZodiacName(risingSign)} Rising`}
          subtitle="First impression"
        >
          <div className="space-y-3">
            <p className="text-[13px] text-foreground/60 leading-relaxed">
              {getSunRisingSynthesis(sunSign, risingSign)}
            </p>
            <ul className="space-y-1.5 pt-1">
              {risingPresence.modification.slice(0, 3).map((trait, i) => (
                <li key={i} className="text-[12px] text-foreground/50 leading-relaxed">
                  {trait}
                </li>
              ))}
            </ul>
          </div>
        </Section>
      )}

      {/* CHART INTEGRATION SECTION - The "So What" */}
      <Section
        icon={<Sparkles size={16} strokeWidth={1.5} />}
        title={chartIntegration.title}
        subtitle={chartIntegration.subtitle}
      >
        <div className="space-y-4">
          {/* Main Integration */}
          <p className="text-[13px] text-foreground/60 leading-relaxed">
            {chartIntegration.integration}
          </p>

          {/* Key Insight */}
          <div className="pt-3 border-t border-foreground/[0.04]">
            <p className="text-[10px] text-foreground/30 uppercase tracking-[0.15em] mb-2">
              What to remember
            </p>
            <p className="text-[13px] text-foreground/50 leading-relaxed italic">
              {chartIntegration.keyInsight}
            </p>
          </div>

          {/* Parenting Note */}
          <div className="pt-3 border-t border-foreground/[0.04]">
            <p className="text-[10px] text-foreground/30 uppercase tracking-[0.15em] mb-2">
              For you as parent
            </p>
            <p className="text-[13px] text-foreground/50 leading-relaxed">
              {chartIntegration.parentingNote}
            </p>
          </div>
        </div>
      </Section>
    </div>
  );
};

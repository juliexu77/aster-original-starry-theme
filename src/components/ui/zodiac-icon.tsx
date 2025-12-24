import {
  IconZodiacAries,
  IconZodiacTaurus,
  IconZodiacGemini,
  IconZodiacCancer,
  IconZodiacLeo,
  IconZodiacVirgo,
  IconZodiacLibra,
  IconZodiacScorpio,
  IconZodiacSagittarius,
  IconZodiacCapricorn,
  IconZodiacAquarius,
  IconZodiacPisces,
} from "@tabler/icons-react";
import { ZodiacSign } from "@/lib/zodiac";

interface ZodiacIconProps {
  sign: ZodiacSign;
  size?: number;
  strokeWidth?: number;
  className?: string;
}

const iconMap = {
  aries: IconZodiacAries,
  taurus: IconZodiacTaurus,
  gemini: IconZodiacGemini,
  cancer: IconZodiacCancer,
  leo: IconZodiacLeo,
  virgo: IconZodiacVirgo,
  libra: IconZodiacLibra,
  scorpio: IconZodiacScorpio,
  sagittarius: IconZodiacSagittarius,
  capricorn: IconZodiacCapricorn,
  aquarius: IconZodiacAquarius,
  pisces: IconZodiacPisces,
};

export const ZodiacIcon = ({ sign, size = 16, strokeWidth = 1.5, className }: ZodiacIconProps) => {
  const Icon = iconMap[sign];
  return <Icon size={size} strokeWidth={strokeWidth} className={className} />;
};

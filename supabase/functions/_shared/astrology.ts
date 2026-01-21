/**
 * Shared astrology calculation utilities
 * Used across multiple edge functions for consistent zodiac calculations
 */

export type ZodiacSign =
  | 'aries' | 'taurus' | 'gemini' | 'cancer'
  | 'leo' | 'virgo' | 'libra' | 'scorpio'
  | 'sagittarius' | 'capricorn' | 'aquarius' | 'pisces';

export type Element = 'fire' | 'earth' | 'air' | 'water';
export type Modality = 'cardinal' | 'fixed' | 'mutable';

/**
 * Get sun sign from birthday string (YYYY-MM-DD)
 */
export function getSunSign(birthday: string): ZodiacSign {
  const date = new Date(birthday + 'T12:00:00Z'); // Use noon UTC to avoid timezone issues
  const month = date.getUTCMonth() + 1;
  const day = date.getUTCDate();

  if ((month === 3 && day >= 21) || (month === 4 && day <= 19)) return 'aries';
  if ((month === 4 && day >= 20) || (month === 5 && day <= 20)) return 'taurus';
  if ((month === 5 && day >= 21) || (month === 6 && day <= 20)) return 'gemini';
  if ((month === 6 && day >= 21) || (month === 7 && day <= 22)) return 'cancer';
  if ((month === 7 && day >= 23) || (month === 8 && day <= 22)) return 'leo';
  if ((month === 8 && day >= 23) || (month === 9 && day <= 22)) return 'virgo';
  if ((month === 9 && day >= 23) || (month === 10 && day <= 22)) return 'libra';
  if ((month === 10 && day >= 23) || (month === 11 && day <= 21)) return 'scorpio';
  if ((month === 11 && day >= 22) || (month === 12 && day <= 21)) return 'sagittarius';
  if ((month === 12 && day >= 22) || (month === 1 && day <= 19)) return 'capricorn';
  if ((month === 1 && day >= 20) || (month === 2 && day <= 18)) return 'aquarius';
  return 'pisces';
}

/**
 * Get element for a zodiac sign
 */
export function getElement(sign: ZodiacSign): Element {
  const fireSigns: ZodiacSign[] = ['aries', 'leo', 'sagittarius'];
  const earthSigns: ZodiacSign[] = ['taurus', 'virgo', 'capricorn'];
  const airSigns: ZodiacSign[] = ['gemini', 'libra', 'aquarius'];
  const waterSigns: ZodiacSign[] = ['cancer', 'scorpio', 'pisces'];

  if (fireSigns.includes(sign)) return 'fire';
  if (earthSigns.includes(sign)) return 'earth';
  if (airSigns.includes(sign)) return 'air';
  return 'water';
}

/**
 * Get modality for a zodiac sign
 */
export function getModality(sign: ZodiacSign): Modality {
  const cardinalSigns: ZodiacSign[] = ['aries', 'cancer', 'libra', 'capricorn'];
  const fixedSigns: ZodiacSign[] = ['taurus', 'leo', 'scorpio', 'aquarius'];
  const mutableSigns: ZodiacSign[] = ['gemini', 'virgo', 'sagittarius', 'pisces'];

  if (cardinalSigns.includes(sign)) return 'cardinal';
  if (fixedSigns.includes(sign)) return 'fixed';
  return 'mutable';
}

/**
 * Generate member signature for caching
 * Sorts members by ID and birthday for consistent cache keys
 */
export function generateMemberSignature(
  members: Array<{ id: string; birthday?: string | null }>
): string {
  return members
    .filter((m) => m.birthday)
    .map((m) => `${m.id}:${m.birthday}`)
    .sort()
    .join('|');
}

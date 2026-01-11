// Zodiac sign utilities and compatibility system

export type ZodiacSign = 
  | 'aries' | 'taurus' | 'gemini' | 'cancer' 
  | 'leo' | 'virgo' | 'libra' | 'scorpio' 
  | 'sagittarius' | 'capricorn' | 'aquarius' | 'pisces';

export interface ZodiacInfo {
  sign: ZodiacSign;
  symbol: string;
  element: 'fire' | 'earth' | 'air' | 'water';
  modality: 'cardinal' | 'fixed' | 'mutable';
  traits: string[];
  rulingPlanet: string;
}

export const ZODIAC_DATA: Record<ZodiacSign, ZodiacInfo> = {
  aries: { sign: 'aries', symbol: '♈', element: 'fire', modality: 'cardinal', traits: ['bold', 'energetic', 'pioneering'], rulingPlanet: 'Mars' },
  taurus: { sign: 'taurus', symbol: '♉', element: 'earth', modality: 'fixed', traits: ['grounded', 'patient', 'sensory'], rulingPlanet: 'Venus' },
  gemini: { sign: 'gemini', symbol: '♊', element: 'air', modality: 'mutable', traits: ['curious', 'communicative', 'adaptable'], rulingPlanet: 'Mercury' },
  cancer: { sign: 'cancer', symbol: '♋', element: 'water', modality: 'cardinal', traits: ['nurturing', 'intuitive', 'protective'], rulingPlanet: 'Moon' },
  leo: { sign: 'leo', symbol: '♌', element: 'fire', modality: 'fixed', traits: ['confident', 'expressive', 'warm'], rulingPlanet: 'Sun' },
  virgo: { sign: 'virgo', symbol: '♍', element: 'earth', modality: 'mutable', traits: ['analytical', 'helpful', 'detail-oriented'], rulingPlanet: 'Mercury' },
  libra: { sign: 'libra', symbol: '♎', element: 'air', modality: 'cardinal', traits: ['harmonious', 'fair', 'social'], rulingPlanet: 'Venus' },
  scorpio: { sign: 'scorpio', symbol: '♏', element: 'water', modality: 'fixed', traits: ['intense', 'perceptive', 'transformative'], rulingPlanet: 'Pluto' },
  sagittarius: { sign: 'sagittarius', symbol: '♐', element: 'fire', modality: 'mutable', traits: ['adventurous', 'philosophical', 'optimistic'], rulingPlanet: 'Jupiter' },
  capricorn: { sign: 'capricorn', symbol: '♑', element: 'earth', modality: 'cardinal', traits: ['ambitious', 'disciplined', 'practical'], rulingPlanet: 'Saturn' },
  aquarius: { sign: 'aquarius', symbol: '♒', element: 'air', modality: 'fixed', traits: ['innovative', 'independent', 'humanitarian'], rulingPlanet: 'Uranus' },
  pisces: { sign: 'pisces', symbol: '♓', element: 'water', modality: 'mutable', traits: ['empathetic', 'imaginative', 'dreamy'], rulingPlanet: 'Neptune' },
};

export const getZodiacFromBirthday = (birthday: string | null | undefined): ZodiacSign | null => {
  if (!birthday) return null;
  const date = new Date(birthday);
  const month = date.getMonth() + 1;
  const day = date.getDate();
  
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
};

// City data with IANA timezone identifiers for DST-aware calculations
interface CityData {
  timezone: string;  // IANA timezone identifier
  longitude: number;
  latitude: number;
}

const CITY_DATA: Record<string, CityData> = {
  // North America
  'new york': { timezone: 'America/New_York', longitude: -74.006, latitude: 40.7128 },
  'nyc': { timezone: 'America/New_York', longitude: -74.006, latitude: 40.7128 },
  'smithtown': { timezone: 'America/New_York', longitude: -73.2004, latitude: 40.8559 },
  'smithtown ny': { timezone: 'America/New_York', longitude: -73.2004, latitude: 40.8559 },
  'manhattan': { timezone: 'America/New_York', longitude: -73.9712, latitude: 40.7831 },
  'brooklyn': { timezone: 'America/New_York', longitude: -73.9442, latitude: 40.6782 },
  'los angeles': { timezone: 'America/Los_Angeles', longitude: -118.2437, latitude: 34.0522 },
  'la': { timezone: 'America/Los_Angeles', longitude: -118.2437, latitude: 34.0522 },
  'hollywood': { timezone: 'America/Los_Angeles', longitude: -118.3287, latitude: 34.0928 },
  'san francisco': { timezone: 'America/Los_Angeles', longitude: -122.4194, latitude: 37.7749 },
  'sf': { timezone: 'America/Los_Angeles', longitude: -122.4194, latitude: 37.7749 },
  'oakland': { timezone: 'America/Los_Angeles', longitude: -122.2711, latitude: 37.8044 },
  'berkeley': { timezone: 'America/Los_Angeles', longitude: -122.2727, latitude: 37.8716 },
  'redwood city': { timezone: 'America/Los_Angeles', longitude: -122.2364, latitude: 37.4852 },
  'palo alto': { timezone: 'America/Los_Angeles', longitude: -122.1430, latitude: 37.4419 },
  'san jose': { timezone: 'America/Los_Angeles', longitude: -121.8863, latitude: 37.3382 },
  'mountain view': { timezone: 'America/Los_Angeles', longitude: -122.0839, latitude: 37.3861 },
  'cupertino': { timezone: 'America/Los_Angeles', longitude: -122.0322, latitude: 37.3229 },
  'sunnyvale': { timezone: 'America/Los_Angeles', longitude: -122.0363, latitude: 37.3688 },
  'santa clara': { timezone: 'America/Los_Angeles', longitude: -121.9552, latitude: 37.3541 },
  'fremont': { timezone: 'America/Los_Angeles', longitude: -121.9886, latitude: 37.5485 },
  'seattle': { timezone: 'America/Los_Angeles', longitude: -122.3321, latitude: 47.6062 },
  'portland': { timezone: 'America/Los_Angeles', longitude: -122.6765, latitude: 45.5152 },
  'denver': { timezone: 'America/Denver', longitude: -104.9903, latitude: 39.7392 },
  'phoenix': { timezone: 'America/Phoenix', longitude: -112.074, latitude: 33.4484 }, // No DST
  'salt lake': { timezone: 'America/Denver', longitude: -111.891, latitude: 40.7608 },
  'chicago': { timezone: 'America/Chicago', longitude: -87.6298, latitude: 41.8781 },
  'dallas': { timezone: 'America/Chicago', longitude: -96.797, latitude: 32.7767 },
  'houston': { timezone: 'America/Chicago', longitude: -95.3698, latitude: 29.7604 },
  'austin': { timezone: 'America/Chicago', longitude: -97.7431, latitude: 30.2672 },
  'miami': { timezone: 'America/New_York', longitude: -80.1918, latitude: 25.7617 },
  'atlanta': { timezone: 'America/New_York', longitude: -84.388, latitude: 33.749 },
  'boston': { timezone: 'America/New_York', longitude: -71.0589, latitude: 42.3601 },
  'philadelphia': { timezone: 'America/New_York', longitude: -75.1652, latitude: 39.9526 },
  'toronto': { timezone: 'America/Toronto', longitude: -79.3832, latitude: 43.6532 },
  'montreal': { timezone: 'America/Montreal', longitude: -73.5673, latitude: 45.5017 },
  'vancouver': { timezone: 'America/Vancouver', longitude: -123.1207, latitude: 49.2827 },
  'mexico city': { timezone: 'America/Mexico_City', longitude: -99.1332, latitude: 19.4326 },
  
  // Europe
  'london': { timezone: 'Europe/London', longitude: -0.1276, latitude: 51.5074 },
  'edinburgh': { timezone: 'Europe/London', longitude: -3.1883, latitude: 55.9533 },
  'dublin': { timezone: 'Europe/Dublin', longitude: -6.2603, latitude: 53.3498 },
  'paris': { timezone: 'Europe/Paris', longitude: 2.3522, latitude: 48.8566 },
  'berlin': { timezone: 'Europe/Berlin', longitude: 13.405, latitude: 52.52 },
  'amsterdam': { timezone: 'Europe/Amsterdam', longitude: 4.9041, latitude: 52.3676 },
  'brussels': { timezone: 'Europe/Brussels', longitude: 4.3517, latitude: 50.8503 },
  'vienna': { timezone: 'Europe/Vienna', longitude: 16.3738, latitude: 48.2082 },
  'rome': { timezone: 'Europe/Rome', longitude: 12.4964, latitude: 41.9028 },
  'milan': { timezone: 'Europe/Rome', longitude: 9.19, latitude: 45.4642 },
  'madrid': { timezone: 'Europe/Madrid', longitude: -3.7038, latitude: 40.4168 },
  'barcelona': { timezone: 'Europe/Madrid', longitude: 2.1734, latitude: 41.3851 },
  'stockholm': { timezone: 'Europe/Stockholm', longitude: 18.0686, latitude: 59.3293 },
  'oslo': { timezone: 'Europe/Oslo', longitude: 10.7522, latitude: 59.9139 },
  'copenhagen': { timezone: 'Europe/Copenhagen', longitude: 12.5683, latitude: 55.6761 },
  'athens': { timezone: 'Europe/Athens', longitude: 23.7275, latitude: 37.9838 },
  'istanbul': { timezone: 'Europe/Istanbul', longitude: 28.9784, latitude: 41.0082 },
  'moscow': { timezone: 'Europe/Moscow', longitude: 37.6173, latitude: 55.7558 },
  
  // Asia
  'tokyo': { timezone: 'Asia/Tokyo', longitude: 139.6917, latitude: 35.6895 },
  'osaka': { timezone: 'Asia/Tokyo', longitude: 135.5022, latitude: 34.6937 },
  'kyoto': { timezone: 'Asia/Tokyo', longitude: 135.7681, latitude: 35.0116 },
  'seoul': { timezone: 'Asia/Seoul', longitude: 126.978, latitude: 37.5665 },
  'busan': { timezone: 'Asia/Seoul', longitude: 129.0756, latitude: 35.1796 },
  'beijing': { timezone: 'Asia/Shanghai', longitude: 116.4074, latitude: 39.9042 },
  'shanghai': { timezone: 'Asia/Shanghai', longitude: 121.4737, latitude: 31.2304 },
  'guangzhou': { timezone: 'Asia/Shanghai', longitude: 113.2644, latitude: 23.1291 },
  'shenzhen': { timezone: 'Asia/Shanghai', longitude: 114.0579, latitude: 22.5431 },
  'hong kong': { timezone: 'Asia/Hong_Kong', longitude: 114.1694, latitude: 22.3193 },
  'taipei': { timezone: 'Asia/Taipei', longitude: 121.5654, latitude: 25.033 },
  'singapore': { timezone: 'Asia/Singapore', longitude: 103.8198, latitude: 1.3521 },
  'bangkok': { timezone: 'Asia/Bangkok', longitude: 100.5018, latitude: 13.7563 },
  'jakarta': { timezone: 'Asia/Jakarta', longitude: 106.8456, latitude: -6.2088 },
  'ho chi minh': { timezone: 'Asia/Ho_Chi_Minh', longitude: 106.6297, latitude: 10.8231 },
  'hanoi': { timezone: 'Asia/Ho_Chi_Minh', longitude: 105.8342, latitude: 21.0278 },
  'mumbai': { timezone: 'Asia/Kolkata', longitude: 72.8777, latitude: 19.076 },
  'delhi': { timezone: 'Asia/Kolkata', longitude: 77.1025, latitude: 28.7041 },
  'bangalore': { timezone: 'Asia/Kolkata', longitude: 77.5946, latitude: 12.9716 },
  'chennai': { timezone: 'Asia/Kolkata', longitude: 80.2707, latitude: 13.0827 },
  'dubai': { timezone: 'Asia/Dubai', longitude: 55.2708, latitude: 25.2048 },
  'abu dhabi': { timezone: 'Asia/Dubai', longitude: 54.3773, latitude: 24.4539 },
  'tel aviv': { timezone: 'Asia/Jerusalem', longitude: 34.7818, latitude: 32.0853 },
  'jerusalem': { timezone: 'Asia/Jerusalem', longitude: 35.2137, latitude: 31.7683 },
  
  // Oceania
  'sydney': { timezone: 'Australia/Sydney', longitude: 151.2093, latitude: -33.8688 },
  'melbourne': { timezone: 'Australia/Melbourne', longitude: 144.9631, latitude: -37.8136 },
  'brisbane': { timezone: 'Australia/Brisbane', longitude: 153.0251, latitude: -27.4698 }, // No DST
  'perth': { timezone: 'Australia/Perth', longitude: 115.8605, latitude: -31.9505 }, // No DST
  'auckland': { timezone: 'Pacific/Auckland', longitude: 174.7633, latitude: -36.8485 },
  'wellington': { timezone: 'Pacific/Auckland', longitude: 174.7762, latitude: -41.2865 },
  
  // South America
  'sao paulo': { timezone: 'America/Sao_Paulo', longitude: -46.6333, latitude: -23.5505 },
  'rio de janeiro': { timezone: 'America/Sao_Paulo', longitude: -43.1729, latitude: -22.9068 },
  'buenos aires': { timezone: 'America/Argentina/Buenos_Aires', longitude: -58.3816, latitude: -34.6037 },
  'lima': { timezone: 'America/Lima', longitude: -77.0428, latitude: -12.0464 },
  'bogota': { timezone: 'America/Bogota', longitude: -74.0721, latitude: 4.711 },
  'santiago': { timezone: 'America/Santiago', longitude: -70.6693, latitude: -33.4489 },
  
  // Africa
  'cairo': { timezone: 'Africa/Cairo', longitude: 31.2357, latitude: 30.0444 },
  'johannesburg': { timezone: 'Africa/Johannesburg', longitude: 28.0473, latitude: -26.2041 },
  'cape town': { timezone: 'Africa/Johannesburg', longitude: 18.4241, latitude: -33.9249 },
  'nairobi': { timezone: 'Africa/Nairobi', longitude: 36.8219, latitude: -1.2921 },
  'lagos': { timezone: 'Africa/Lagos', longitude: 3.3792, latitude: 6.5244 },
};

// Get timezone offset for a specific date using IANA timezone
// This properly handles DST transitions
const getTimezoneOffsetForDate = (timezone: string, date: Date): number => {
  try {
    // Create a formatter that shows the offset
    const formatter = new Intl.DateTimeFormat('en-US', {
      timeZone: timezone,
      timeZoneName: 'longOffset',
    });
    
    const parts = formatter.formatToParts(date);
    const offsetPart = parts.find(p => p.type === 'timeZoneName');
    
    if (offsetPart && offsetPart.value) {
      // Parse offset like "GMT-08:00" or "GMT+05:30"
      const match = offsetPart.value.match(/GMT([+-])(\d{2}):(\d{2})/);
      if (match) {
        const sign = match[1] === '+' ? 1 : -1;
        const hours = parseInt(match[2], 10);
        const minutes = parseInt(match[3], 10);
        const offset = sign * (hours + minutes / 60);
        console.log('[Zodiac] getTimezoneOffsetForDate:', { timezone, date: date.toISOString(), offset });
        return offset;
      }
      // Handle "GMT" (UTC+0)
      if (offsetPart.value === 'GMT') {
        return 0;
      }
    }
    
    // Fallback: use a different method
    const utcDate = new Date(date.toLocaleString('en-US', { timeZone: 'UTC' }));
    const tzDate = new Date(date.toLocaleString('en-US', { timeZone: timezone }));
    const offset = (tzDate.getTime() - utcDate.getTime()) / (1000 * 60 * 60);
    console.log('[Zodiac] getTimezoneOffsetForDate (fallback):', { timezone, offset });
    return offset;
  } catch (e) {
    console.warn(`Failed to get timezone offset for ${timezone}:`, e);
    return 0;
  }
};

// Get city data from location string
// Uses best match strategy - prioritizes longer city name matches
const getCityData = (birthLocation: string | null | undefined): CityData | null => {
  if (!birthLocation) return null;
  
  const normalizedLocation = birthLocation.toLowerCase().trim();
  
  let bestMatch: CityData | null = null;
  let bestMatchLength = 0;
  
  for (const [city, data] of Object.entries(CITY_DATA)) {
    if (normalizedLocation.includes(city) || city.includes(normalizedLocation)) {
      // Prefer longer city name matches (more specific)
      if (city.length > bestMatchLength) {
        bestMatch = data;
        bestMatchLength = city.length;
      }
    }
  }
  
  return bestMatch;
};

// Get timezone offset from city name for a specific date (returns hours from UTC)
// This is DST-aware and returns the correct offset for the given date
const getTimezoneOffset = (birthLocation: string | null | undefined, birthDate?: Date): number => {
  const cityData = getCityData(birthLocation);
  if (!cityData) return 0;
  
  // Use provided date or current date for offset calculation
  const date = birthDate || new Date();
  return getTimezoneOffsetForDate(cityData.timezone, date);
};

// Approximate moon sign calculation
// Note: This is an approximation. Accurate moon sign requires precise astronomical calculations.
// The moon changes signs roughly every 2.5 days.
export const getMoonSignFromBirthDateTime = (
  birthday: string | null | undefined, 
  birthTime: string | null | undefined,
  birthLocation?: string | null | undefined
): ZodiacSign | null => {
  if (!birthday) return null;
  
  // Parse date components directly from string to avoid timezone issues
  const dateParts = birthday.split('-');
  const year = parseInt(dateParts[0], 10);
  const month = parseInt(dateParts[1], 10) - 1; // 0-indexed
  const day = parseInt(dateParts[2], 10);
  
  // Create a date object for timezone offset calculation
  const date = new Date(year, month, day);
  
  // Get time in hours (0-24)
  let hours = 12; // Default to noon if no time provided
  if (birthTime) {
    const [h, m] = birthTime.split(':').map(Number);
    hours = h + (m / 60);
  }
  
  // Adjust for timezone - convert local time to UTC (DST-aware)
  const timezoneOffset = getTimezoneOffset(birthLocation, date);
  const utcHours = hours - timezoneOffset;
  
  // Julian day calculation (simplified)
  const a = Math.floor((14 - (month + 1)) / 12);
  const y = year + 4800 - a;
  const m = (month + 1) + 12 * a - 3;
  const jd = day + Math.floor((153 * m + 2) / 5) + 365 * y + Math.floor(y / 4) - Math.floor(y / 100) + Math.floor(y / 400) - 32045;
  
  // Add time component (using UTC hours)
  const jdWithTime = jd + (utcHours - 12) / 24;
  
  // Moon's mean longitude (simplified calculation)
  // Based on lunar cycle of approximately 27.3 days through 360 degrees
  const daysSinceEpoch = jdWithTime - 2451545.0; // Days since J2000.0
  const moonLongitude = (218.32 + 13.176396 * daysSinceEpoch) % 360;
  const normalizedLongitude = moonLongitude < 0 ? moonLongitude + 360 : moonLongitude;
  
  // Convert longitude to zodiac sign (30 degrees each)
  const signIndex = Math.floor(normalizedLongitude / 30);
  const signs: ZodiacSign[] = [
    'aries', 'taurus', 'gemini', 'cancer', 
    'leo', 'virgo', 'libra', 'scorpio', 
    'sagittarius', 'capricorn', 'aquarius', 'pisces'
  ];
  
  return signs[signIndex % 12];
};

// Rising sign (Ascendant) calculation
// Uses proper astronomical formulas with latitude consideration
export const getRisingSign = (
  birthday: string | null | undefined,
  birthTime: string | null | undefined,
  birthLocation?: string | null | undefined
): ZodiacSign | null => {
  if (!birthday || !birthTime) return null;
  
  // Parse date components directly from string to avoid timezone issues
  const dateParts = birthday.split('-');
  const year = parseInt(dateParts[0], 10);
  const month = parseInt(dateParts[1], 10) - 1; // 0-indexed
  const day = parseInt(dateParts[2], 10);
  
  // Create a date object for timezone offset calculation
  const date = new Date(year, month, day);
  
  // Parse birth time
  const [h, m] = birthTime.split(':').map(Number);
  const hours = h + (m / 60);
  
  // Get city data for accurate coordinates
  const cityData = getCityData(birthLocation);
  const longitude = cityData?.longitude ?? 0;
  const latitude = cityData?.latitude ?? 0;
  
  // Get DST-aware timezone offset for the birth date
  const timezoneOffset = cityData ? getTimezoneOffsetForDate(cityData.timezone, date) : 0;
  
  // Convert local time to UTC
  let utcHours = hours - timezoneOffset;
  let utcDay = day;
  let utcMonth = month;
  let utcYear = year;
  
  // Handle day overflow
  if (utcHours >= 24) {
    utcHours -= 24;
    utcDay += 1;
  } else if (utcHours < 0) {
    utcHours += 24;
    utcDay -= 1;
  }
  
  // Calculate Julian Day Number (JD)
  const a = Math.floor((14 - (utcMonth + 1)) / 12);
  const y = utcYear + 4800 - a;
  const mm = (utcMonth + 1) + 12 * a - 3;
  const jdn = utcDay + Math.floor((153 * mm + 2) / 5) + 365 * y + Math.floor(y / 4) - Math.floor(y / 100) + Math.floor(y / 400) - 32045;
  
  // Add time component to get Julian Date
  const jd = jdn + (utcHours - 12) / 24;
  
  // Calculate centuries since J2000.0
  const T = (jd - 2451545.0) / 36525;
  
  // Calculate Greenwich Mean Sidereal Time (GMST) in degrees
  let gmst = 280.46061837 + 360.98564736629 * (jd - 2451545.0) + 0.000387933 * T * T - T * T * T / 38710000;
  gmst = ((gmst % 360) + 360) % 360;
  
  // Calculate Local Sidereal Time (LST)
  let lst = gmst + longitude;
  lst = ((lst % 360) + 360) % 360;
  
  // Obliquity of the ecliptic
  const epsilon = 23.439291 - 0.0130042 * T;
  
  // Convert to radians
  const lstRad = (lst * Math.PI) / 180;
  const latRad = (latitude * Math.PI) / 180;
  const epsRad = (epsilon * Math.PI) / 180;
  
  // Calculate the Ascendant
  const sinLst = Math.sin(lstRad);
  const cosLst = Math.cos(lstRad);
  const sinEps = Math.sin(epsRad);
  const cosEps = Math.cos(epsRad);
  const tanLat = Math.tan(latRad);
  
  const ascY = cosLst;
  const ascX = -(sinLst * cosEps + tanLat * sinEps);
  
  let ascendantRad = Math.atan2(ascY, ascX);
  let ascendant = (ascendantRad * 180) / Math.PI;
  ascendant = ((ascendant % 360) + 360) % 360;
  
  // Convert to zodiac sign (30 degrees each)
  const signIndex = Math.floor(ascendant / 30);
  
  const signs: ZodiacSign[] = [
    'aries', 'taurus', 'gemini', 'cancer', 
    'leo', 'virgo', 'libra', 'scorpio', 
    'sagittarius', 'capricorn', 'aquarius', 'pisces'
  ];
  
  return signs[signIndex % 12];
};

// Test DST handling by comparing summer vs winter births
export const testDSTHandling = () => {
  const testCases = [
    // Winter (PST = UTC-8, no DST)
    { date: '2022-01-15', time: '15:00', location: 'San Francisco', label: 'Winter (Jan 15, 3PM SF)' },
    // Summer (PDT = UTC-7, DST active)
    { date: '2022-07-15', time: '15:00', location: 'San Francisco', label: 'Summer (Jul 15, 3PM SF)' },
    // Compare with Phoenix (no DST ever)
    { date: '2022-01-15', time: '15:00', location: 'Phoenix', label: 'Winter (Jan 15, 3PM Phoenix)' },
    { date: '2022-07-15', time: '15:00', location: 'Phoenix', label: 'Summer (Jul 15, 3PM Phoenix)' },
    // Sydney (Southern Hemisphere - DST in Jan, not in Jul)
    { date: '2022-01-15', time: '15:00', location: 'Sydney', label: 'Sydney Summer (Jan 15, 3PM)' },
    { date: '2022-07-15', time: '15:00', location: 'Sydney', label: 'Sydney Winter (Jul 15, 3PM)' },
    // New Bay Area cities
    { date: '2025-04-15', time: '05:00', location: 'Redwood City', label: 'Redwood City (Apr 15, 5AM)' },
    { date: '2025-04-15', time: '05:00', location: 'Palo Alto', label: 'Palo Alto (Apr 15, 5AM)' },
    // Original test case that was previously failing
    { date: '1988-12-16', time: '21:30', location: 'Shanghai', label: 'Shanghai (Dec 16 1988, 9:30PM)' },
  ];

  console.log('=== DST HANDLING TEST ===\n');
  
  testCases.forEach(({ date, time, location, label }) => {
    console.log(`\n--- ${label} ---`);
    
    // Parse date correctly (same way as the actual functions now do)
    const dateParts = date.split('-');
    const year = parseInt(dateParts[0], 10);
    const month = parseInt(dateParts[1], 10) - 1;
    const day = parseInt(dateParts[2], 10);
    const birthDate = new Date(year, month, day);
    
    console.log(`Parsed date: ${year}-${month + 1}-${day}`);
    
    const cityData = getCityData(location);
    
    if (cityData) {
      const offset = getTimezoneOffsetForDate(cityData.timezone, birthDate);
      console.log(`City found: ${location}`);
      console.log(`Timezone: ${cityData.timezone}`);
      console.log(`Coordinates: lat ${cityData.latitude}, lon ${cityData.longitude}`);
      console.log(`Offset for ${date}: UTC${offset >= 0 ? '+' : ''}${offset}`);
    } else {
      console.log(`⚠️ City NOT found: ${location}`);
    }
    
    // Run the ascendant calculation with debug
    const rising = getRisingSign(date, time, location);
    console.log(`Rising sign result: ${rising}`);
  });
  
  console.log('\n=== END DST TEST ===');
};

// Helper to get full ascendant info with degree
export const getAscendantWithDegree = (
  birthday: string | null | undefined,
  birthTime: string | null | undefined,
  birthLocation?: string | null | undefined
): { sign: ZodiacSign; degree: number } | null => {
  if (!birthday || !birthTime) return null;
  
  // Parse date components directly from string to avoid timezone issues
  const dateParts = birthday.split('-');
  const year = parseInt(dateParts[0], 10);
  const month = parseInt(dateParts[1], 10) - 1; // 0-indexed
  const day = parseInt(dateParts[2], 10);
  
  // Create a date object for timezone offset calculation
  const date = new Date(year, month, day);
  
  const [h, m] = birthTime.split(':').map(Number);
  const hours = h + (m / 60);
  
  const cityData = getCityData(birthLocation);
  const longitude = cityData?.longitude ?? 0;
  const latitude = cityData?.latitude ?? 0;
  const timezoneOffset = cityData ? getTimezoneOffsetForDate(cityData.timezone, date) : 0;
  
  let utcHours = hours - timezoneOffset;
  let utcDay = day;
  
  if (utcHours >= 24) {
    utcHours -= 24;
    utcDay += 1;
  } else if (utcHours < 0) {
    utcHours += 24;
    utcDay -= 1;
  }
  
  const a = Math.floor((14 - (month + 1)) / 12);
  const y = year + 4800 - a;
  const mm = (month + 1) + 12 * a - 3;
  const jdn = utcDay + Math.floor((153 * mm + 2) / 5) + 365 * y + Math.floor(y / 4) - Math.floor(y / 100) + Math.floor(y / 400) - 32045;
  const jd = jdn + (utcHours - 12) / 24;
  
  const T = (jd - 2451545.0) / 36525;
  let gmst = 280.46061837 + 360.98564736629 * (jd - 2451545.0) + 0.000387933 * T * T - T * T * T / 38710000;
  gmst = ((gmst % 360) + 360) % 360;
  
  let lst = gmst + longitude;
  lst = ((lst % 360) + 360) % 360;
  
  const epsilon = 23.439291 - 0.0130042 * T;
  
  const lstRad = (lst * Math.PI) / 180;
  const latRad = (latitude * Math.PI) / 180;
  const epsRad = (epsilon * Math.PI) / 180;
  
  const sinLst = Math.sin(lstRad);
  const cosLst = Math.cos(lstRad);
  const sinEps = Math.sin(epsRad);
  const cosEps = Math.cos(epsRad);
  const tanLat = Math.tan(latRad);
  
  // Correct formula: ASC = atan2(cos(LST), -(sin(LST) * cos(ε) + tan(φ) * sin(ε)))
  const ascY = cosLst;
  const ascX = -(sinLst * cosEps + tanLat * sinEps);
  
  let ascendantRad = Math.atan2(ascY, ascX);
  let ascendant = (ascendantRad * 180) / Math.PI;
  ascendant = ((ascendant % 360) + 360) % 360;
  
  const signIndex = Math.floor(ascendant / 30);
  const degreeInSign = ascendant % 30;
  
  const signs: ZodiacSign[] = [
    'aries', 'taurus', 'gemini', 'cancer', 
    'leo', 'virgo', 'libra', 'scorpio', 
    'sagittarius', 'capricorn', 'aquarius', 'pisces'
  ];
  
  return {
    sign: signs[signIndex % 12],
    degree: degreeInSign
  };
};

export const getZodiacSymbol = (birthday: string | null | undefined): string => {
  const sign = getZodiacFromBirthday(birthday);
  return sign ? ZODIAC_DATA[sign].symbol : '';
};

export const getZodiacGlyph = (sign: ZodiacSign): string => {
  return ZODIAC_DATA[sign].symbol;
};

export const getZodiacName = (sign: ZodiacSign): string => {
  return sign.charAt(0).toUpperCase() + sign.slice(1);
};

// Compatibility scoring based on elements and modalities
export type CompatibilityLevel = 'high' | 'medium' | 'challenging';

export interface CompatibilityResult {
  level: CompatibilityLevel;
  score: number; // 1-10
  strengths: string[];
  challenges: string[];
  tips: string[];
  summary: string;
}

// Element compatibility matrix
const ELEMENT_COMPATIBILITY: Record<string, CompatibilityLevel> = {
  'fire-fire': 'high',
  'fire-air': 'high',
  'fire-earth': 'challenging',
  'fire-water': 'medium',
  'earth-earth': 'high',
  'earth-water': 'high',
  'earth-air': 'medium',
  'air-air': 'high',
  'air-water': 'medium',
  'water-water': 'high',
};

// Detailed compatibility insights for parent-child relationships
const PARENT_CHILD_COMPATIBILITY: Record<string, CompatibilityResult> = {
  'fire-fire': {
    level: 'high',
    score: 9,
    strengths: ['Shared enthusiasm and energy', 'Mutual love of adventure', 'Natural understanding of each other\'s drive'],
    challenges: ['Power struggles can emerge', 'Both may be impatient', 'Tempers may clash'],
    tips: ['Give space for independence', 'Channel competitive energy into shared goals', 'Practice patience together'],
    summary: 'A dynamic duo with endless energy. You understand their bold spirit because you share it.'
  },
  'earth-fire': {
    level: 'medium',
    score: 6,
    strengths: ['You provide essential stability', 'Their energy livens your world', 'Balance of caution and courage'],
    challenges: ['Their impulsiveness challenges you', 'You may seem too slow for them', 'Risk vs security tension'],
    tips: ['Allow controlled risk-taking', 'Celebrate their boldness', 'Find joy in their spontaneity'],
    summary: 'You\'re the steady ground they can always return to. Let them run, knowing you\'re there.'
  },
  'fire-earth': {
    level: 'medium',
    score: 6,
    strengths: ['You inspire them to take risks', 'They ground your energy', 'Complementary approaches to life'],
    challenges: ['Different paces may frustrate both', 'Your spontaneity vs their need for routine', 'Communication styles differ'],
    tips: ['Respect their need for stability', 'Plan ahead but leave room for surprises', 'Celebrate their methodical wins'],
    summary: 'You light the spark, they build the fire. Balance adventure with their need for security.'
  },
  'air-fire': {
    level: 'high',
    score: 8,
    strengths: ['Intellectual connection', 'Shared love of excitement', 'You understand their boldness'],
    challenges: ['Grounding is needed', 'Routines may suffer', 'Scattered attention'],
    tips: ['Create some structure together', 'Channel energy into projects', 'Balance talking with doing'],
    summary: 'Ideas in motion. You fan their flames with curiosity and conversation.'
  },
  'fire-air': {
    level: 'high',
    score: 8,
    strengths: ['Ideas flow freely between you', 'Mutual enthusiasm for new experiences', 'You fuel their curiosity'],
    challenges: ['Both may struggle with follow-through', 'Scattered energy at times', 'Grounding may be needed'],
    tips: ['Create structure for your adventures', 'Listen to their many ideas', 'Help them focus without stifling creativity'],
    summary: 'Your spark ignites their mind. Together you dream big and explore fearlessly.'
  },
  'water-fire': {
    level: 'medium',
    score: 6,
    strengths: ['You sense their needs deeply', 'They energize your intuition', 'Passion meets compassion'],
    challenges: ['Their intensity can overwhelm', 'You may dampen their fire', 'Energy levels differ'],
    tips: ['Celebrate their boldness openly', 'Don\'t take their directness personally', 'Match their energy sometimes'],
    summary: 'Ocean and volcano. Your depths can hold their heat—with care.'
  },
  'fire-water': {
    level: 'medium',
    score: 6,
    strengths: ['You teach them courage', 'They soften your approach', 'Deep emotional growth for both'],
    challenges: ['Your intensity may overwhelm them', 'Their sensitivity needs gentle handling', 'Different emotional expressions'],
    tips: ['Tune into their emotional cues', 'Create safe spaces for feelings', 'Balance action with reflection'],
    summary: 'Steam rising. Your fire warms their waters, but gentleness is key.'
  },
  'earth-earth': {
    level: 'high',
    score: 9,
    strengths: ['Deep understanding of each other', 'Shared appreciation for routine', 'Building together comes naturally'],
    challenges: ['May resist change together', 'Stubbornness from both', 'Comfort zone can limit growth'],
    tips: ['Introduce gentle novelty', 'Encourage each other to stretch', 'Celebrate small adventures'],
    summary: 'Rooted and reliable. You speak the same language of love through actions.'
  },
  'air-earth': {
    level: 'medium',
    score: 6,
    strengths: ['You bring lightness to their solidity', 'They teach you patience', 'Different strengths combine well'],
    challenges: ['Your pace may feel too fast', 'Their stubbornness meets your flexibility', 'Communication gaps'],
    tips: ['Slow down to their rhythm sometimes', 'Appreciate their consistent nature', 'Find shared grounding activities'],
    summary: 'Breeze over mountains. Your ideas inspire them while they keep you grounded.'
  },
  'earth-air': {
    level: 'medium',
    score: 6,
    strengths: ['You ground their scattered energy', 'They bring new perspectives', 'Practical meets creative'],
    challenges: ['Their restlessness vs your routine', 'Different communication needs', 'You may seem too rigid to them'],
    tips: ['Be flexible with their changing interests', 'Engage with their ideas seriously', 'Create varied experiences'],
    summary: 'You\'re the container for their swirling thoughts. Your steadiness helps them land.'
  },
  'water-earth': {
    level: 'high',
    score: 8,
    strengths: ['Deep nurturing connection', 'They feel your love consistently', 'Stable emotional bond'],
    challenges: ['May enable over-dependence', 'Both can be too cautious', 'Change is hard for you both'],
    tips: ['Encourage their independence', 'Let them get messy and try', 'Trust their groundedness'],
    summary: 'River and shore. Your emotional attunement meets their solid presence.'
  },
  'earth-water': {
    level: 'high',
    score: 8,
    strengths: ['Nurturing flows naturally', 'Deep emotional security', 'You create a safe haven'],
    challenges: ['May enable over-dependence', 'Both can be too cautious', 'Change is hard for you both'],
    tips: ['Encourage their emotional expression', 'Push gently toward independence', 'Grow together gradually'],
    summary: 'Garden and rain. You nurture their sensitivity with exactly what they need.'
  },
  'air-air': {
    level: 'high',
    score: 9,
    strengths: ['Constant conversation and connection', 'Shared curiosity', 'Mental stimulation abundant'],
    challenges: ['May live too much in thoughts', 'Feelings sometimes overlooked', 'Structure is scarce'],
    tips: ['Make time for feelings, not just thoughts', 'Create anchoring rituals', 'Get physical together—walk, play'],
    summary: 'Two minds dancing. You understand their need to question everything.'
  },
  'water-air': {
    level: 'medium',
    score: 6,
    strengths: ['You teach emotional depth', 'They help you communicate', 'Heart meets mind'],
    challenges: ['May seem too emotional to them', 'Their detachment can hurt', 'Different processing speeds'],
    tips: ['Give them thinking space', 'Ask questions, don\'t assume feelings', 'Bridge feeling and thought'],
    summary: 'Mist rising. Your emotions find expression through their words.'
  },
  'air-water': {
    level: 'medium',
    score: 6,
    strengths: ['You help them articulate feelings', 'They deepen your emotional life', 'Growth in understanding'],
    challenges: ['Your logic vs their feelings', 'May seem dismissive of emotions', 'Different processing styles'],
    tips: ['Listen before analyzing', 'Validate their feelings first', 'Create emotional check-ins'],
    summary: 'Clouds and sea. You give words to their waves of feeling.'
  },
  'water-water': {
    level: 'high',
    score: 9,
    strengths: ['Profound emotional understanding', 'Intuitive connection', 'Nurturing flows both ways'],
    challenges: ['Can amplify each other\'s moods', 'May struggle with boundaries', 'Outside energy needed sometimes'],
    tips: ['Create emotional boundaries together', 'Bring in grounding activities', 'Celebrate joy as much as processing pain'],
    summary: 'Two oceans meeting. You feel everything together—the gift and the challenge.'
  },
};

// Sibling compatibility insights
const SIBLING_COMPATIBILITY: Record<string, CompatibilityResult> = {
  'fire-fire': {
    level: 'high',
    score: 8,
    strengths: ['Endless games and adventures', 'Natural playmates', 'Push each other to try new things'],
    challenges: ['Competition can get fierce', 'Both want to lead', 'Explosive arguments possible'],
    tips: ['Give each leadership roles', 'Teach conflict resolution early', 'Channel competition into team activities'],
    summary: 'Two flames burning bright. Exciting playmates who need room to both shine.'
  },
  'fire-earth': {
    level: 'medium',
    score: 6,
    strengths: ['Balance each other naturally', 'Fire inspires, earth builds', 'Different skills complement'],
    challenges: ['Pace differences cause friction', 'Fire may overlook earth\'s needs', 'Earth may slow fire down too much'],
    tips: ['Celebrate different strengths', 'Find activities both enjoy', 'Teach appreciation of differences'],
    summary: 'Campfire and ground. They learn balance from each other.'
  },
  'earth-fire': {
    level: 'medium',
    score: 6,
    strengths: ['Balance each other naturally', 'Fire inspires, earth builds', 'Different skills complement'],
    challenges: ['Pace differences cause friction', 'Fire may overlook earth\'s needs', 'Earth may slow fire down too much'],
    tips: ['Celebrate different strengths', 'Find activities both enjoy', 'Teach appreciation of differences'],
    summary: 'Campfire and ground. They learn balance from each other.'
  },
  'fire-air': {
    level: 'high',
    score: 8,
    strengths: ['Ideas spark constantly', 'Energetic play together', 'Mutual enthusiasm'],
    challenges: ['May ignore practical needs together', 'Can egg each other on', 'Grounding needed from outside'],
    tips: ['Provide structure for their adventures', 'Encourage follow-through', 'Join their brainstorms'],
    summary: 'Wildfire spreading. Exciting together—keep an eye on the sparks.'
  },
  'air-fire': {
    level: 'high',
    score: 8,
    strengths: ['Ideas spark constantly', 'Energetic play together', 'Mutual enthusiasm'],
    challenges: ['May ignore practical needs together', 'Can egg each other on', 'Grounding needed from outside'],
    tips: ['Provide structure for their adventures', 'Encourage follow-through', 'Join their brainstorms'],
    summary: 'Wildfire spreading. Exciting together—keep an eye on the sparks.'
  },
  'fire-water': {
    level: 'medium',
    score: 5,
    strengths: ['Learn from differences', 'Fire protects water\'s sensitivity', 'Water calms fire\'s intensity'],
    challenges: ['Fire may seem too loud', 'Water\'s feelings may confuse fire', 'Different needs in conflict'],
    tips: ['Teach fire to be gentle', 'Help water speak up', 'Create calm-down spaces'],
    summary: 'Steam and sizzle. Beautiful when balanced, challenging when not.'
  },
  'water-fire': {
    level: 'medium',
    score: 5,
    strengths: ['Learn from differences', 'Fire protects water\'s sensitivity', 'Water calms fire\'s intensity'],
    challenges: ['Fire may seem too loud', 'Water\'s feelings may confuse fire', 'Different needs in conflict'],
    tips: ['Teach fire to be gentle', 'Help water speak up', 'Create calm-down spaces'],
    summary: 'Steam and sizzle. Beautiful when balanced, challenging when not.'
  },
  'earth-earth': {
    level: 'high',
    score: 8,
    strengths: ['Play well side by side', 'Share toys and routines easily', 'Predictable and steady together'],
    challenges: ['May resist new activities', 'Can both be stubborn', 'Need outside stimulation'],
    tips: ['Introduce variety gently', 'Encourage trying new things together', 'Celebrate when they adapt'],
    summary: 'Two steady souls. Reliable friendship that builds over time.'
  },
  'earth-air': {
    level: 'medium',
    score: 6,
    strengths: ['Earth grounds air\'s ideas', 'Air lightens earth\'s routine', 'Can learn from each other'],
    challenges: ['Different interests may diverge', 'Air may seem flighty to earth', 'Earth may seem boring to air'],
    tips: ['Find overlapping interests', 'Celebrate their unique perspectives', 'Create shared rituals'],
    summary: 'Wind over fields. Different but complementary if given space.'
  },
  'air-earth': {
    level: 'medium',
    score: 6,
    strengths: ['Earth grounds air\'s ideas', 'Air lightens earth\'s routine', 'Can learn from each other'],
    challenges: ['Different interests may diverge', 'Air may seem flighty to earth', 'Earth may seem boring to air'],
    tips: ['Find overlapping interests', 'Celebrate their unique perspectives', 'Create shared rituals'],
    summary: 'Wind over fields. Different but complementary if given space.'
  },
  'earth-water': {
    level: 'high',
    score: 8,
    strengths: ['Deep emotional bond', 'Earth protects water', 'Water softens earth'],
    challenges: ['May resist outside friendships', 'Can become too intertwined', 'Need encouragement to branch out'],
    tips: ['Foster individual friendships too', 'Appreciate their closeness', 'Give each alone time'],
    summary: 'Garden growing. Nurturing connection that runs deep.'
  },
  'water-earth': {
    level: 'high',
    score: 8,
    strengths: ['Deep emotional bond', 'Earth protects water', 'Water softens earth'],
    challenges: ['May resist outside friendships', 'Can become too intertwined', 'Need encouragement to branch out'],
    tips: ['Foster individual friendships too', 'Appreciate their closeness', 'Give each alone time'],
    summary: 'Garden growing. Nurturing connection that runs deep.'
  },
  'air-air': {
    level: 'high',
    score: 8,
    strengths: ['Non-stop conversation', 'Shared curiosity about world', 'Understand each other\'s thoughts'],
    challenges: ['May talk instead of do', 'Feelings might be overlooked', 'Both need outside grounding'],
    tips: ['Encourage physical play', 'Teach emotional awareness', 'Create action-based activities'],
    summary: 'Conversation never ends. Best friends in thought and word.'
  },
  'air-water': {
    level: 'medium',
    score: 6,
    strengths: ['Air helps water express feelings', 'Water teaches air to feel', 'Growth through difference'],
    challenges: ['Air may dismiss water\'s emotions', 'Water may overwhelm air', 'Different processing styles'],
    tips: ['Teach both to listen', 'Validate different approaches', 'Create emotional vocabulary together'],
    summary: 'Clouds and ocean. They speak different languages but can learn.'
  },
  'water-air': {
    level: 'medium',
    score: 6,
    strengths: ['Air helps water express feelings', 'Water teaches air to feel', 'Growth through difference'],
    challenges: ['Air may dismiss water\'s emotions', 'Water may overwhelm air', 'Different processing styles'],
    tips: ['Teach both to listen', 'Validate different approaches', 'Create emotional vocabulary together'],
    summary: 'Clouds and ocean. They speak different languages but can learn.'
  },
  'water-water': {
    level: 'high',
    score: 8,
    strengths: ['Intuitive understanding', 'Play imaginatively together', 'Deep emotional bond'],
    challenges: ['Moods may amplify', 'May isolate together', 'Need lightness from outside'],
    tips: ['Bring in active, social play', 'Teach healthy boundaries', 'Celebrate their creative world'],
    summary: 'Two drops becoming one. Beautifully connected, needing outside light.'
  },
};

export const getCompatibility = (
  sign1: ZodiacSign, 
  sign2: ZodiacSign, 
  relationship: 'parent-child' | 'siblings'
): CompatibilityResult => {
  const element1 = ZODIAC_DATA[sign1].element;
  const element2 = ZODIAC_DATA[sign2].element;
  
  const key = `${element1}-${element2}`;
  const compatibilityMap = relationship === 'parent-child' ? PARENT_CHILD_COMPATIBILITY : SIBLING_COMPATIBILITY;
  
  // Get base compatibility from element pairing
  const baseResult = compatibilityMap[key];
  
  if (baseResult) {
    return baseResult;
  }
  
  // Fallback
  return {
    level: 'medium',
    score: 7,
    strengths: ['Unique connection to discover'],
    challenges: ['Different approaches to life'],
    tips: ['Embrace what makes you different'],
    summary: 'A special bond waiting to unfold.'
  };
};

// Get personalized insight based on specific sign combination
export const getSignSpecificInsight = (parentSign: ZodiacSign, childSign: ZodiacSign): string => {
  const insights: Record<string, string> = {
    'aries-aries': `Two warriors in one home! Your little Ram matches your fire. Channel that competitive spirit into team adventures.`,
    'aries-taurus': `Your bold energy meets their stubborn calm. They're teaching you patience, even when you want to charge ahead.`,
    'aries-gemini': `Your action fuels their curiosity. Keep up with their questions—they love your directness.`,
    'aries-cancer': `Your warrior heart must protect their tender shell. Slow down; they need your gentleness as much as your strength.`,
    'aries-leo': `Double fire drama! You're both stars. Give them the spotlight sometimes—they've inherited your charisma.`,
    'aries-virgo': `Your impulses meet their precision. They notice everything you miss. Value their careful observations.`,
    'aries-libra': `Opposite signs, magnetic connection. They bring balance to your intensity. Listen to their need for harmony.`,
    'aries-scorpio': `Two intense souls. Power struggles are possible but so is profound loyalty. Respect their depth.`,
    'aries-sagittarius': `Adventure buddies from day one. Your shared love of exploration makes every day an expedition.`,
    'aries-capricorn': `Your fire meets their mountain. They're ambitious like you but in their own steady way.`,
    'aries-aquarius': `You both value independence. They'll surprise you with their unique perspectives. Embrace the unexpected.`,
    'aries-pisces': `Your directness meets their dreams. Be gentle with their sensitivity—it's a superpower, not weakness.`,
    'taurus-aries': `Their fire rushes past your steady pace. Create safe spaces for their energy while keeping your grounding presence.`,
    'taurus-taurus': `Two peaceful souls building a cozy world. Watch for shared stubbornness but celebrate your mutual love of comfort.`,
    'taurus-gemini': `Their rapid thoughts circle your steady mind. Bring them back to earth with sensory experiences.`,
    'taurus-cancer': `A natural nurturing bond. You both treasure home and security. This connection runs deep.`,
    'taurus-leo': `Your quiet strength meets their need for attention. Celebrate them publicly; love them privately.`,
    'taurus-virgo': `Earth meeting earth. You understand each other's need for order and quality. A harmonious match.`,
    'taurus-libra': `Venus rules you both—beauty and harmony matter. Create aesthetic experiences together.`,
    'taurus-scorpio': `Opposite signs with magnetic pull. Intense loyalty possible. Both stubborn, both devoted.`,
    'taurus-sagittarius': `Their wanderlust challenges your roots. Travel together in small doses. Ground their adventures.`,
    'taurus-capricorn': `Earth supporting earth. You understand their ambitions. Practical love in every gesture.`,
    'taurus-aquarius': `Their innovation meets your tradition. They'll challenge your routines—let some fresh air in.`,
    'taurus-pisces': `Your stability holds their dreams. You're the shore to their ocean. Beautiful creative partnership.`,
  };
  
  const key = `${parentSign}-${childSign}`;
  return insights[key] || `Your ${getZodiacName(parentSign)} energy guides their ${getZodiacName(childSign)} journey in unique ways.`;
};

export const getElementEmoji = (element: string): string => {
  switch (element) {
    case 'fire': return '🔥';
    case 'earth': return '🌍';
    case 'air': return '💨';
    case 'water': return '💧';
    default: return '✨';
  }
};

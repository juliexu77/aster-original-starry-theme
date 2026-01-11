/**
 * Ephemeris calculations for planetary positions
 * Uses Moshier's ephemeris for accurate tropical zodiac positions
 * 
 * Configuration:
 * - Zodiac: Tropical
 * - House system: Whole Sign
 * - Reference: Geocentric
 * - Ephemeris: Moshier (based on Swiss Ephemeris algorithms)
 */

import { ZodiacSign } from './zodiac';

// Import ephemeris library (CommonJS module)
// @ts-ignore - ephemeris is a CommonJS module without types
import ephemeris from 'ephemeris';

export interface PlanetPosition {
  name: string;
  longitude: number;         // 0-360 degrees (tropical)
  sign: ZodiacSign;
  degreeInSign: number;      // 0-29.99 degrees within sign
  isRetrograde: boolean;
  formattedDegree: string;   // e.g., "15°22'"
}

export interface BirthChartData {
  sun: PlanetPosition;
  moon: PlanetPosition;
  mercury: PlanetPosition;
  venus: PlanetPosition;
  mars: PlanetPosition;
  jupiter: PlanetPosition;
  saturn: PlanetPosition;
  uranus: PlanetPosition;
  neptune: PlanetPosition;
  pluto: PlanetPosition;
  chiron?: PlanetPosition;
  ascendantDegree: number;    // Absolute degree of Ascendant (0-360)
  ascendantSign: ZodiacSign;
}

// Zodiac signs in order (0° = Aries)
const ZODIAC_ORDER: ZodiacSign[] = [
  'aries', 'taurus', 'gemini', 'cancer', 
  'leo', 'virgo', 'libra', 'scorpio', 
  'sagittarius', 'capricorn', 'aquarius', 'pisces'
];

/**
 * Convert longitude (0-360) to zodiac sign
 */
function longitudeToSign(longitude: number): ZodiacSign {
  const normalizedLong = ((longitude % 360) + 360) % 360;
  const signIndex = Math.floor(normalizedLong / 30);
  return ZODIAC_ORDER[signIndex];
}

/**
 * Get degree within sign (0-29.99)
 */
function getDegreeInSign(longitude: number): number {
  const normalizedLong = ((longitude % 360) + 360) % 360;
  return normalizedLong % 30;
}

/**
 * Format degree as DMS string
 */
function formatDegree(degreeInSign: number): string {
  const deg = Math.floor(degreeInSign);
  const minDecimal = (degreeInSign - deg) * 60;
  const min = Math.floor(minDecimal);
  return `${deg}°${min.toString().padStart(2, '0')}'`;
}

/**
 * Create PlanetPosition from ephemeris result
 */
function createPlanetPosition(
  name: string, 
  longitude: number, 
  isRetrograde: boolean = false
): PlanetPosition {
  const sign = longitudeToSign(longitude);
  const degreeInSign = getDegreeInSign(longitude);
  
  return {
    name,
    longitude,
    sign,
    degreeInSign,
    isRetrograde,
    formattedDegree: formatDegree(degreeInSign),
  };
}

// City data for coordinates lookup (matches zodiac.ts)
interface CityData {
  timezone: string;
  longitude: number;
  latitude: number;
}

const CITY_DATA: Record<string, CityData> = {
  // North America
  'new york': { timezone: 'America/New_York', longitude: -74.006, latitude: 40.7128 },
  'nyc': { timezone: 'America/New_York', longitude: -74.006, latitude: 40.7128 },
  'smithtown': { timezone: 'America/New_York', longitude: -73.2004, latitude: 40.8559 },
  'smithtown ny': { timezone: 'America/New_York', longitude: -73.2004, latitude: 40.8559 },
  'los angeles': { timezone: 'America/Los_Angeles', longitude: -118.2437, latitude: 34.0522 },
  'la': { timezone: 'America/Los_Angeles', longitude: -118.2437, latitude: 34.0522 },
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
  'seattle': { timezone: 'America/Los_Angeles', longitude: -122.3321, latitude: 47.6062 },
  'portland': { timezone: 'America/Los_Angeles', longitude: -122.6765, latitude: 45.5152 },
  'denver': { timezone: 'America/Denver', longitude: -104.9903, latitude: 39.7392 },
  'phoenix': { timezone: 'America/Phoenix', longitude: -112.074, latitude: 33.4484 },
  'chicago': { timezone: 'America/Chicago', longitude: -87.6298, latitude: 41.8781 },
  'dallas': { timezone: 'America/Chicago', longitude: -96.797, latitude: 32.7767 },
  'houston': { timezone: 'America/Chicago', longitude: -95.3698, latitude: 29.7604 },
  'austin': { timezone: 'America/Chicago', longitude: -97.7431, latitude: 30.2672 },
  'miami': { timezone: 'America/New_York', longitude: -80.1918, latitude: 25.7617 },
  'atlanta': { timezone: 'America/New_York', longitude: -84.388, latitude: 33.749 },
  'boston': { timezone: 'America/New_York', longitude: -71.0589, latitude: 42.3601 },
  'philadelphia': { timezone: 'America/New_York', longitude: -75.1652, latitude: 39.9526 },
  'toronto': { timezone: 'America/Toronto', longitude: -79.3832, latitude: 43.6532 },
  'vancouver': { timezone: 'America/Vancouver', longitude: -123.1207, latitude: 49.2827 },
  
  // Europe
  'london': { timezone: 'Europe/London', longitude: -0.1276, latitude: 51.5074 },
  'paris': { timezone: 'Europe/Paris', longitude: 2.3522, latitude: 48.8566 },
  'berlin': { timezone: 'Europe/Berlin', longitude: 13.405, latitude: 52.52 },
  'amsterdam': { timezone: 'Europe/Amsterdam', longitude: 4.9041, latitude: 52.3676 },
  'rome': { timezone: 'Europe/Rome', longitude: 12.4964, latitude: 41.9028 },
  'madrid': { timezone: 'Europe/Madrid', longitude: -3.7038, latitude: 40.4168 },
  'barcelona': { timezone: 'Europe/Madrid', longitude: 2.1734, latitude: 41.3851 },
  'moscow': { timezone: 'Europe/Moscow', longitude: 37.6173, latitude: 55.7558 },
  
  // Asia
  'tokyo': { timezone: 'Asia/Tokyo', longitude: 139.6917, latitude: 35.6895 },
  'seoul': { timezone: 'Asia/Seoul', longitude: 126.978, latitude: 37.5665 },
  'beijing': { timezone: 'Asia/Shanghai', longitude: 116.4074, latitude: 39.9042 },
  'shanghai': { timezone: 'Asia/Shanghai', longitude: 121.4737, latitude: 31.2304 },
  'hong kong': { timezone: 'Asia/Hong_Kong', longitude: 114.1694, latitude: 22.3193 },
  'singapore': { timezone: 'Asia/Singapore', longitude: 103.8198, latitude: 1.3521 },
  'mumbai': { timezone: 'Asia/Kolkata', longitude: 72.8777, latitude: 19.076 },
  'delhi': { timezone: 'Asia/Kolkata', longitude: 77.1025, latitude: 28.7041 },
  'dubai': { timezone: 'Asia/Dubai', longitude: 55.2708, latitude: 25.2048 },
  
  // Oceania
  'sydney': { timezone: 'Australia/Sydney', longitude: 151.2093, latitude: -33.8688 },
  'melbourne': { timezone: 'Australia/Melbourne', longitude: 144.9631, latitude: -37.8136 },
  'auckland': { timezone: 'Pacific/Auckland', longitude: 174.7633, latitude: -36.8485 },
  
  // South America
  'sao paulo': { timezone: 'America/Sao_Paulo', longitude: -46.6333, latitude: -23.5505 },
  'buenos aires': { timezone: 'America/Argentina/Buenos_Aires', longitude: -58.3816, latitude: -34.6037 },
};

/**
 * Get city coordinates from location string
 * Uses best match strategy - prioritizes exact matches and longer city name matches
 */
function getCityCoordinates(location: string | null | undefined): { longitude: number; latitude: number } | null {
  if (!location) return null;
  
  const normalizedLocation = location.toLowerCase().trim();
  
  // Find the best matching city (longest match wins to avoid "new york" matching before "smithtown")
  let bestMatch: { longitude: number; latitude: number } | null = null;
  let bestMatchLength = 0;
  let bestMatchCity = '';
  
  for (const [city, data] of Object.entries(CITY_DATA)) {
    if (normalizedLocation.includes(city) || city.includes(normalizedLocation)) {
      // Prefer longer city name matches (more specific)
      if (city.length > bestMatchLength) {
        bestMatch = { longitude: data.longitude, latitude: data.latitude };
        bestMatchLength = city.length;
        bestMatchCity = city;
      }
    }
  }
  
  console.log('[Ephemeris] getCityCoordinates:', { 
    input: location, 
    normalized: normalizedLocation,
    matchedCity: bestMatchCity, 
    coords: bestMatch 
  });
  
  return bestMatch;
}

/**
 * Get timezone offset for a specific date
 */
function getTimezoneOffsetForDate(timezone: string, date: Date): number {
  try {
    const formatter = new Intl.DateTimeFormat('en-US', {
      timeZone: timezone,
      timeZoneName: 'longOffset',
    });
    
    const parts = formatter.formatToParts(date);
    const offsetPart = parts.find(p => p.type === 'timeZoneName');
    
    if (offsetPart && offsetPart.value) {
      const match = offsetPart.value.match(/GMT([+-])(\d{2}):(\d{2})/);
      if (match) {
        const sign = match[1] === '+' ? 1 : -1;
        const hours = parseInt(match[2], 10);
        const minutes = parseInt(match[3], 10);
        return sign * (hours + minutes / 60);
      }
      if (offsetPart.value === 'GMT') return 0;
    }
    
    const utcDate = new Date(date.toLocaleString('en-US', { timeZone: 'UTC' }));
    const tzDate = new Date(date.toLocaleString('en-US', { timeZone: timezone }));
    return (tzDate.getTime() - utcDate.getTime()) / (1000 * 60 * 60);
  } catch (e) {
    console.warn(`Failed to get timezone offset for ${timezone}:`, e);
    return 0;
  }
}

/**
 * Get city timezone from location string
 * Uses best match strategy - prioritizes longer city name matches
 */
function getCityTimezone(location: string | null | undefined): string | null {
  if (!location) return null;
  
  const normalizedLocation = location.toLowerCase().trim();
  
  let bestMatch: string | null = null;
  let bestMatchLength = 0;
  
  for (const [city, data] of Object.entries(CITY_DATA)) {
    if (normalizedLocation.includes(city) || city.includes(normalizedLocation)) {
      if (city.length > bestMatchLength) {
        bestMatch = data.timezone;
        bestMatchLength = city.length;
      }
    }
  }
  
  return bestMatch;
}

/**
 * Calculate Ascendant (Rising Sign) degree
 * Uses proper astronomical formula for ascendant calculation
 */
function calculateAscendant(
  birthDate: Date,
  latitude: number,
  longitude: number
): number {
  // Get Julian Day
  const jd = getJulianDay(birthDate);
  const T = (jd - 2451545.0) / 36525;
  
  // Greenwich Mean Sidereal Time (in degrees)
  // Using IAU 1982 formula
  let GMST = 280.46061837 + 
             360.98564736629 * (jd - 2451545.0) + 
             0.000387933 * T * T - 
             T * T * T / 38710000;
  
  // Normalize GMST to 0-360
  GMST = ((GMST % 360) + 360) % 360;
  
  // Local Sidereal Time = GMST + longitude (longitude is already in the date via UTC conversion)
  // Since birthDate is in UTC and we already converted local time to UTC,
  // GMST is correct for that moment. We just need to add geographic longitude.
  const LST = ((GMST + longitude) % 360 + 360) % 360;
  
  // Mean obliquity of the ecliptic (Laskar formula)
  const obliquity = 23.439291 - 0.0130042 * T - 0.00000016 * T * T + 0.000000504 * T * T * T;
  
  // Convert to radians
  const oblRad = obliquity * Math.PI / 180;
  const latRad = latitude * Math.PI / 180;
  const lstRad = LST * Math.PI / 180;
  
  // Standard ascendant formula from astronomical references
  // ASC = atan2(cos(LST), -(sin(LST) * cos(ε) + tan(φ) * sin(ε)))
  const sinLST = Math.sin(lstRad);
  const cosLST = Math.cos(lstRad);
  const sinObl = Math.sin(oblRad);
  const cosObl = Math.cos(oblRad);
  const tanLat = Math.tan(latRad);
  
  // Standard ascendant formula: ASC = atan2(cos(LST), -(sin(LST) * cos(ε) + tan(φ) * sin(ε)))
  // atan2(y, x) where:
  //   y = cos(LST) 
  //   x = -(sin(LST) * cos(ε) + tan(φ) * sin(ε))
  const y = cosLST;
  const x = -(sinLST * cosObl + tanLat * sinObl);
  
  let ascendant = Math.atan2(y, x);
  
  // Convert from radians to degrees
  ascendant = ascendant * 180 / Math.PI;
  
  // Normalize to 0-360
  ascendant = ((ascendant % 360) + 360) % 360;
  
  // Debug: Log all intermediate values
  console.log('[Ephemeris] Ascendant FULL DEBUG:', {
    birthDateUTC: birthDate.toISOString(),
    jd,
    T,
    GMST,
    longitude,
    LST,
    latitude,
    obliquity,
    sinLST: sinLST.toFixed(6),
    cosLST: cosLST.toFixed(6),
    tanLat: tanLat.toFixed(6),
    y: y.toFixed(6),
    x: x.toFixed(6),
    atan2Result: Math.atan2(y, x).toFixed(6),
    ascendantDeg: ascendant.toFixed(2),
    sign: ZODIAC_ORDER[Math.floor(ascendant / 30)]
  });
  
  return ascendant;
}

/**
 * Calculate Julian Day from Date
 */
function getJulianDay(date: Date): number {
  const year = date.getUTCFullYear();
  const month = date.getUTCMonth() + 1;
  const day = date.getUTCDate();
  const hours = date.getUTCHours() + date.getUTCMinutes() / 60 + date.getUTCSeconds() / 3600;
  
  let y = year;
  let m = month;
  
  if (m <= 2) {
    y -= 1;
    m += 12;
  }
  
  const A = Math.floor(y / 100);
  const B = 2 - A + Math.floor(A / 4);
  
  const JD = Math.floor(365.25 * (y + 4716)) + 
             Math.floor(30.6001 * (m + 1)) + 
             day + B - 1524.5 + hours / 24;
  
  return JD;
}

/**
 * Convert local birth time to UTC Date object
 */
function birthTimeToUTC(
  birthday: string,
  birthTime: string,
  birthLocation: string | null | undefined
): Date {
  // Parse date parts
  const dateParts = birthday.split('-');
  const year = parseInt(dateParts[0], 10);
  const month = parseInt(dateParts[1], 10) - 1; // 0-indexed
  const day = parseInt(dateParts[2], 10);
  
  // Parse time parts (handle HH:MM or HH:MM:SS format)
  const timeParts = birthTime.split(':');
  const hours = parseInt(timeParts[0], 10);
  const minutes = parseInt(timeParts[1], 10) || 0;
  
  // Create local date for timezone calculation
  const localDate = new Date(year, month, day, hours, minutes);
  
  // Get timezone offset
  const timezone = getCityTimezone(birthLocation);
  let offsetHours = 0;
  
  if (timezone) {
    offsetHours = getTimezoneOffsetForDate(timezone, localDate);
  }
  
  // Convert to UTC
  const utcHours = hours - offsetHours;
  const utcDate = new Date(Date.UTC(year, month, day, Math.floor(utcHours), minutes + (utcHours % 1) * 60));
  
  console.log('[Ephemeris] birthTimeToUTC:', {
    birthday,
    birthTime,
    birthLocation,
    timezone,
    offsetHours,
    localHours: hours,
    utcHours,
    utcDateISO: utcDate.toISOString()
  });
  
  return utcDate;
}

/**
 * Calculate full birth chart with all planetary positions
 * 
 * @param birthday - Date string in YYYY-MM-DD format
 * @param birthTime - Time string in HH:MM format (24-hour)
 * @param birthLocation - City name for coordinates lookup
 * @returns Full birth chart data with all planets
 */
export function calculateBirthChart(
  birthday: string | null | undefined,
  birthTime: string | null | undefined,
  birthLocation: string | null | undefined
): BirthChartData | null {
  if (!birthday || !birthTime) {
    return null;
  }
  
  // Get coordinates
  const coords = getCityCoordinates(birthLocation);
  const longitude = coords?.longitude ?? 0;
  const latitude = coords?.latitude ?? 0;
  
  // Convert birth time to UTC
  const utcDate = birthTimeToUTC(birthday, birthTime, birthLocation);
  
  console.log('[Ephemeris] calculateBirthChart:', { 
    birthday, 
    birthTime, 
    birthLocation,
    coords,
    utcDate: utcDate.toISOString()
  });
  
  try {
    // Get all planetary positions from ephemeris
    const result = ephemeris.getAllPlanets(utcDate, longitude, latitude, 0);
    
    // Extract planet positions
    const observed = result.observed;
    
    // Calculate Ascendant
    const ascendantDegree = calculateAscendant(utcDate, latitude, longitude);
    const ascendantSign = longitudeToSign(ascendantDegree);
    
    console.log('[Ephemeris] Ascendant calculated:', { 
      ascendantDegree, 
      ascendantSign,
      latitude,
      longitude
    });
    
    // Build chart data with debug info
    const chartData: BirthChartData & { debugLST?: number } = {
      sun: createPlanetPosition('Sun', observed.sun.apparentLongitudeDd, observed.sun.is_retrograde),
      moon: createPlanetPosition('Moon', observed.moon.apparentLongitudeDd, observed.moon.is_retrograde),
      mercury: createPlanetPosition('Mercury', observed.mercury.apparentLongitudeDd, observed.mercury.is_retrograde),
      venus: createPlanetPosition('Venus', observed.venus.apparentLongitudeDd, observed.venus.is_retrograde),
      mars: createPlanetPosition('Mars', observed.mars.apparentLongitudeDd, observed.mars.is_retrograde),
      jupiter: createPlanetPosition('Jupiter', observed.jupiter.apparentLongitudeDd, observed.jupiter.is_retrograde),
      saturn: createPlanetPosition('Saturn', observed.saturn.apparentLongitudeDd, observed.saturn.is_retrograde),
      uranus: createPlanetPosition('Uranus', observed.uranus.apparentLongitudeDd, observed.uranus.is_retrograde),
      neptune: createPlanetPosition('Neptune', observed.neptune.apparentLongitudeDd, observed.neptune.is_retrograde),
      pluto: createPlanetPosition('Pluto', observed.pluto.apparentLongitudeDd, observed.pluto.is_retrograde),
      chiron: observed.chiron ? createPlanetPosition('Chiron', observed.chiron.apparentLongitudeDd, observed.chiron.is_retrograde) : undefined,
      ascendantDegree,
      ascendantSign,
      // Debug: expose UTC date for UI debugging
      debugUTC: utcDate.toISOString(),
    } as any;
    
    return chartData
  } catch (error) {
    console.error('[Ephemeris] Error calculating chart:', error);
    return null;
  }
}

/**
 * Get house number for a planet using Whole Sign house system
 * In Whole Sign houses, each sign is exactly one house, starting from the Ascendant's sign as the 1st house
 */
export function getWholeSignHouse(planetLongitude: number, ascendantSign: ZodiacSign): number {
  const planetSign = longitudeToSign(planetLongitude);
  const ascIndex = ZODIAC_ORDER.indexOf(ascendantSign);
  const planetIndex = ZODIAC_ORDER.indexOf(planetSign);
  
  // House 1 = Ascendant sign, House 2 = next sign, etc.
  let house = ((planetIndex - ascIndex + 12) % 12) + 1;
  return house;
}

/**
 * Test function for verifying ephemeris calculations
 */
export function testEphemeris(): void {
  console.log('=== EPHEMERIS TEST ===\n');
  
  // Test case: Known birth data
  const testCases = [
    { birthday: '1989-10-07', time: '06:00', location: 'Smithtown', label: 'User Test (Oct 7 1989, 6AM, Smithtown NY) - Expected: Aries Rising ~4°22\'' },
    { birthday: '2025-04-15', time: '05:00', location: 'Redwood City', label: 'Caleb (Apr 15 2025, 5AM, Redwood City)' },
    { birthday: '1988-12-16', time: '21:30', location: 'Shanghai', label: 'Shanghai Test (Dec 16 1988, 9:30PM)' },
    { birthday: '2000-01-01', time: '12:00', location: 'London', label: 'Y2K London Noon' },
  ];
  
  testCases.forEach(({ birthday, time, location, label }) => {
    console.log(`\n--- ${label} ---`);
    const chart = calculateBirthChart(birthday, time, location);
    
    if (chart) {
      console.log('Planets:');
      console.log(`  Sun: ${chart.sun.sign} ${chart.sun.formattedDegree} (${chart.sun.longitude.toFixed(2)}°)`);
      console.log(`  Moon: ${chart.moon.sign} ${chart.moon.formattedDegree} (${chart.moon.longitude.toFixed(2)}°)`);
      console.log(`  Mercury: ${chart.mercury.sign} ${chart.mercury.formattedDegree}${chart.mercury.isRetrograde ? ' ℞' : ''}`);
      console.log(`  Venus: ${chart.venus.sign} ${chart.venus.formattedDegree}${chart.venus.isRetrograde ? ' ℞' : ''}`);
      console.log(`  Mars: ${chart.mars.sign} ${chart.mars.formattedDegree}${chart.mars.isRetrograde ? ' ℞' : ''}`);
      console.log(`  Jupiter: ${chart.jupiter.sign} ${chart.jupiter.formattedDegree}${chart.jupiter.isRetrograde ? ' ℞' : ''}`);
      console.log(`  Saturn: ${chart.saturn.sign} ${chart.saturn.formattedDegree}${chart.saturn.isRetrograde ? ' ℞' : ''}`);
      console.log(`  Uranus: ${chart.uranus.sign} ${chart.uranus.formattedDegree}${chart.uranus.isRetrograde ? ' ℞' : ''}`);
      console.log(`  Neptune: ${chart.neptune.sign} ${chart.neptune.formattedDegree}${chart.neptune.isRetrograde ? ' ℞' : ''}`);
      console.log(`  Pluto: ${chart.pluto.sign} ${chart.pluto.formattedDegree}${chart.pluto.isRetrograde ? ' ℞' : ''}`);
      console.log(`  Ascendant: ${chart.ascendantSign} ${formatDegree(getDegreeInSign(chart.ascendantDegree))} (${chart.ascendantDegree.toFixed(2)}°)`);
    } else {
      console.log('  Failed to calculate chart');
    }
  });
  
  console.log('\n=== END EPHEMERIS TEST ===');
}

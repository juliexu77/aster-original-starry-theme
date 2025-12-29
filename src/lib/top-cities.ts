// Top 200 world cities for instant location search
export const TOP_CITIES = [
  // USA
  { name: "New York", region: "New York", country: "USA", lat: 40.7128, lon: -74.0060 },
  { name: "Los Angeles", region: "California", country: "USA", lat: 34.0522, lon: -118.2437 },
  { name: "Chicago", region: "Illinois", country: "USA", lat: 41.8781, lon: -87.6298 },
  { name: "Houston", region: "Texas", country: "USA", lat: 29.7604, lon: -95.3698 },
  { name: "Phoenix", region: "Arizona", country: "USA", lat: 33.4484, lon: -112.0740 },
  { name: "Philadelphia", region: "Pennsylvania", country: "USA", lat: 39.9526, lon: -75.1652 },
  { name: "San Antonio", region: "Texas", country: "USA", lat: 29.4241, lon: -98.4936 },
  { name: "San Diego", region: "California", country: "USA", lat: 32.7157, lon: -117.1611 },
  { name: "Dallas", region: "Texas", country: "USA", lat: 32.7767, lon: -96.7970 },
  { name: "San Jose", region: "California", country: "USA", lat: 37.3382, lon: -121.8863 },
  { name: "Austin", region: "Texas", country: "USA", lat: 30.2672, lon: -97.7431 },
  { name: "Jacksonville", region: "Florida", country: "USA", lat: 30.3322, lon: -81.6557 },
  { name: "Fort Worth", region: "Texas", country: "USA", lat: 32.7555, lon: -97.3308 },
  { name: "Columbus", region: "Ohio", country: "USA", lat: 39.9612, lon: -82.9988 },
  { name: "Charlotte", region: "North Carolina", country: "USA", lat: 35.2271, lon: -80.8431 },
  { name: "San Francisco", region: "California", country: "USA", lat: 37.7749, lon: -122.4194 },
  { name: "Indianapolis", region: "Indiana", country: "USA", lat: 39.7684, lon: -86.1581 },
  { name: "Seattle", region: "Washington", country: "USA", lat: 47.6062, lon: -122.3321 },
  { name: "Denver", region: "Colorado", country: "USA", lat: 39.7392, lon: -104.9903 },
  { name: "Washington", region: "D.C.", country: "USA", lat: 38.9072, lon: -77.0369 },
  { name: "Boston", region: "Massachusetts", country: "USA", lat: 42.3601, lon: -71.0589 },
  { name: "Nashville", region: "Tennessee", country: "USA", lat: 36.1627, lon: -86.7816 },
  { name: "Detroit", region: "Michigan", country: "USA", lat: 42.3314, lon: -83.0458 },
  { name: "Portland", region: "Oregon", country: "USA", lat: 45.5152, lon: -122.6784 },
  { name: "Las Vegas", region: "Nevada", country: "USA", lat: 36.1699, lon: -115.1398 },
  { name: "Memphis", region: "Tennessee", country: "USA", lat: 35.1495, lon: -90.0490 },
  { name: "Louisville", region: "Kentucky", country: "USA", lat: 38.2527, lon: -85.7585 },
  { name: "Baltimore", region: "Maryland", country: "USA", lat: 39.2904, lon: -76.6122 },
  { name: "Milwaukee", region: "Wisconsin", country: "USA", lat: 43.0389, lon: -87.9065 },
  { name: "Albuquerque", region: "New Mexico", country: "USA", lat: 35.0844, lon: -106.6504 },
  { name: "Tucson", region: "Arizona", country: "USA", lat: 32.2226, lon: -110.9747 },
  { name: "Fresno", region: "California", country: "USA", lat: 36.7378, lon: -119.7871 },
  { name: "Sacramento", region: "California", country: "USA", lat: 38.5816, lon: -121.4944 },
  { name: "Atlanta", region: "Georgia", country: "USA", lat: 33.7490, lon: -84.3880 },
  { name: "Miami", region: "Florida", country: "USA", lat: 25.7617, lon: -80.1918 },
  { name: "Oakland", region: "California", country: "USA", lat: 37.8044, lon: -122.2712 },
  { name: "Minneapolis", region: "Minnesota", country: "USA", lat: 44.9778, lon: -93.2650 },
  { name: "Cleveland", region: "Ohio", country: "USA", lat: 41.4993, lon: -81.6944 },
  { name: "New Orleans", region: "Louisiana", country: "USA", lat: 29.9511, lon: -90.0715 },
  { name: "Honolulu", region: "Hawaii", country: "USA", lat: 21.3069, lon: -157.8583 },
  
  // Canada
  { name: "Toronto", region: "Ontario", country: "Canada", lat: 43.6532, lon: -79.3832 },
  { name: "Montreal", region: "Quebec", country: "Canada", lat: 45.5017, lon: -73.5673 },
  { name: "Vancouver", region: "British Columbia", country: "Canada", lat: 49.2827, lon: -123.1207 },
  { name: "Calgary", region: "Alberta", country: "Canada", lat: 51.0447, lon: -114.0719 },
  { name: "Edmonton", region: "Alberta", country: "Canada", lat: 53.5461, lon: -113.4938 },
  { name: "Ottawa", region: "Ontario", country: "Canada", lat: 45.4215, lon: -75.6972 },
  
  // UK & Ireland
  { name: "London", region: "England", country: "United Kingdom", lat: 51.5074, lon: -0.1278 },
  { name: "Birmingham", region: "England", country: "United Kingdom", lat: 52.4862, lon: -1.8904 },
  { name: "Manchester", region: "England", country: "United Kingdom", lat: 53.4808, lon: -2.2426 },
  { name: "Glasgow", region: "Scotland", country: "United Kingdom", lat: 55.8642, lon: -4.2518 },
  { name: "Liverpool", region: "England", country: "United Kingdom", lat: 53.4084, lon: -2.9916 },
  { name: "Edinburgh", region: "Scotland", country: "United Kingdom", lat: 55.9533, lon: -3.1883 },
  { name: "Dublin", region: "Leinster", country: "Ireland", lat: 53.3498, lon: -6.2603 },
  
  // Europe
  { name: "Paris", region: "Île-de-France", country: "France", lat: 48.8566, lon: 2.3522 },
  { name: "Berlin", region: "Berlin", country: "Germany", lat: 52.5200, lon: 13.4050 },
  { name: "Madrid", region: "Community of Madrid", country: "Spain", lat: 40.4168, lon: -3.7038 },
  { name: "Rome", region: "Lazio", country: "Italy", lat: 41.9028, lon: 12.4964 },
  { name: "Amsterdam", region: "North Holland", country: "Netherlands", lat: 52.3676, lon: 4.9041 },
  { name: "Vienna", region: "Vienna", country: "Austria", lat: 48.2082, lon: 16.3738 },
  { name: "Barcelona", region: "Catalonia", country: "Spain", lat: 41.3851, lon: 2.1734 },
  { name: "Munich", region: "Bavaria", country: "Germany", lat: 48.1351, lon: 11.5820 },
  { name: "Milan", region: "Lombardy", country: "Italy", lat: 45.4642, lon: 9.1900 },
  { name: "Prague", region: "Prague", country: "Czech Republic", lat: 50.0755, lon: 14.4378 },
  { name: "Stockholm", region: "Stockholm", country: "Sweden", lat: 59.3293, lon: 18.0686 },
  { name: "Brussels", region: "Brussels", country: "Belgium", lat: 50.8503, lon: 4.3517 },
  { name: "Lisbon", region: "Lisbon", country: "Portugal", lat: 38.7223, lon: -9.1393 },
  { name: "Copenhagen", region: "Capital Region", country: "Denmark", lat: 55.6761, lon: 12.5683 },
  { name: "Warsaw", region: "Masovian", country: "Poland", lat: 52.2297, lon: 21.0122 },
  { name: "Budapest", region: "Budapest", country: "Hungary", lat: 47.4979, lon: 19.0402 },
  { name: "Zurich", region: "Zurich", country: "Switzerland", lat: 47.3769, lon: 8.5417 },
  { name: "Oslo", region: "Oslo", country: "Norway", lat: 59.9139, lon: 10.7522 },
  { name: "Helsinki", region: "Uusimaa", country: "Finland", lat: 60.1699, lon: 24.9384 },
  { name: "Athens", region: "Attica", country: "Greece", lat: 37.9838, lon: 23.7275 },
  { name: "Dublin", region: "Leinster", country: "Ireland", lat: 53.3498, lon: -6.2603 },
  
  // Asia
  { name: "Tokyo", region: "Tokyo", country: "Japan", lat: 35.6762, lon: 139.6503 },
  { name: "Beijing", region: "Beijing", country: "China", lat: 39.9042, lon: 116.4074 },
  { name: "Shanghai", region: "Shanghai", country: "China", lat: 31.2304, lon: 121.4737 },
  { name: "Hong Kong", region: "Hong Kong", country: "China", lat: 22.3193, lon: 114.1694 },
  { name: "Singapore", region: "Singapore", country: "Singapore", lat: 1.3521, lon: 103.8198 },
  { name: "Seoul", region: "Seoul", country: "South Korea", lat: 37.5665, lon: 126.9780 },
  { name: "Mumbai", region: "Maharashtra", country: "India", lat: 19.0760, lon: 72.8777 },
  { name: "Delhi", region: "Delhi", country: "India", lat: 28.7041, lon: 77.1025 },
  { name: "Bangalore", region: "Karnataka", country: "India", lat: 12.9716, lon: 77.5946 },
  { name: "Bangkok", region: "Bangkok", country: "Thailand", lat: 13.7563, lon: 100.5018 },
  { name: "Taipei", region: "Taipei", country: "Taiwan", lat: 25.0330, lon: 121.5654 },
  { name: "Osaka", region: "Osaka", country: "Japan", lat: 34.6937, lon: 135.5023 },
  { name: "Kuala Lumpur", region: "Federal Territory", country: "Malaysia", lat: 3.1390, lon: 101.6869 },
  { name: "Jakarta", region: "Jakarta", country: "Indonesia", lat: -6.2088, lon: 106.8456 },
  { name: "Manila", region: "Metro Manila", country: "Philippines", lat: 14.5995, lon: 120.9842 },
  { name: "Ho Chi Minh City", region: "Ho Chi Minh", country: "Vietnam", lat: 10.8231, lon: 106.6297 },
  { name: "Hanoi", region: "Hanoi", country: "Vietnam", lat: 21.0278, lon: 105.8342 },
  { name: "Shenzhen", region: "Guangdong", country: "China", lat: 22.5431, lon: 114.0579 },
  { name: "Guangzhou", region: "Guangdong", country: "China", lat: 23.1291, lon: 113.2644 },
  
  // Middle East
  { name: "Dubai", region: "Dubai", country: "United Arab Emirates", lat: 25.2048, lon: 55.2708 },
  { name: "Tel Aviv", region: "Tel Aviv", country: "Israel", lat: 32.0853, lon: 34.7818 },
  { name: "Jerusalem", region: "Jerusalem", country: "Israel", lat: 31.7683, lon: 35.2137 },
  { name: "Abu Dhabi", region: "Abu Dhabi", country: "United Arab Emirates", lat: 24.4539, lon: 54.3773 },
  { name: "Riyadh", region: "Riyadh", country: "Saudi Arabia", lat: 24.7136, lon: 46.6753 },
  { name: "Doha", region: "Doha", country: "Qatar", lat: 25.2854, lon: 51.5310 },
  { name: "Istanbul", region: "Istanbul", country: "Turkey", lat: 41.0082, lon: 28.9784 },
  { name: "Ankara", region: "Ankara", country: "Turkey", lat: 39.9334, lon: 32.8597 },
  { name: "Tehran", region: "Tehran", country: "Iran", lat: 35.6892, lon: 51.3890 },
  
  // Australia & New Zealand
  { name: "Sydney", region: "New South Wales", country: "Australia", lat: -33.8688, lon: 151.2093 },
  { name: "Melbourne", region: "Victoria", country: "Australia", lat: -37.8136, lon: 144.9631 },
  { name: "Brisbane", region: "Queensland", country: "Australia", lat: -27.4698, lon: 153.0251 },
  { name: "Perth", region: "Western Australia", country: "Australia", lat: -31.9505, lon: 115.8605 },
  { name: "Adelaide", region: "South Australia", country: "Australia", lat: -34.9285, lon: 138.6007 },
  { name: "Auckland", region: "Auckland", country: "New Zealand", lat: -36.8485, lon: 174.7633 },
  { name: "Wellington", region: "Wellington", country: "New Zealand", lat: -41.2865, lon: 174.7762 },
  
  // South America
  { name: "São Paulo", region: "São Paulo", country: "Brazil", lat: -23.5505, lon: -46.6333 },
  { name: "Rio de Janeiro", region: "Rio de Janeiro", country: "Brazil", lat: -22.9068, lon: -43.1729 },
  { name: "Buenos Aires", region: "Buenos Aires", country: "Argentina", lat: -34.6037, lon: -58.3816 },
  { name: "Lima", region: "Lima", country: "Peru", lat: -12.0464, lon: -77.0428 },
  { name: "Bogotá", region: "Bogotá", country: "Colombia", lat: 4.7110, lon: -74.0721 },
  { name: "Santiago", region: "Santiago", country: "Chile", lat: -33.4489, lon: -70.6693 },
  { name: "Caracas", region: "Capital District", country: "Venezuela", lat: 10.4806, lon: -66.9036 },
  { name: "Medellín", region: "Antioquia", country: "Colombia", lat: 6.2442, lon: -75.5812 },
  { name: "Montevideo", region: "Montevideo", country: "Uruguay", lat: -34.9011, lon: -56.1645 },
  { name: "Quito", region: "Pichincha", country: "Ecuador", lat: -0.1807, lon: -78.4678 },
  
  // Mexico & Central America
  { name: "Mexico City", region: "Mexico City", country: "Mexico", lat: 19.4326, lon: -99.1332 },
  { name: "Guadalajara", region: "Jalisco", country: "Mexico", lat: 20.6597, lon: -103.3496 },
  { name: "Monterrey", region: "Nuevo León", country: "Mexico", lat: 25.6866, lon: -100.3161 },
  { name: "Cancún", region: "Quintana Roo", country: "Mexico", lat: 21.1619, lon: -86.8515 },
  { name: "Panama City", region: "Panamá", country: "Panama", lat: 8.9824, lon: -79.5199 },
  { name: "San José", region: "San José", country: "Costa Rica", lat: 9.9281, lon: -84.0907 },
  { name: "Guatemala City", region: "Guatemala", country: "Guatemala", lat: 14.6349, lon: -90.5069 },
  
  // Africa
  { name: "Cairo", region: "Cairo", country: "Egypt", lat: 30.0444, lon: 31.2357 },
  { name: "Lagos", region: "Lagos", country: "Nigeria", lat: 6.5244, lon: 3.3792 },
  { name: "Johannesburg", region: "Gauteng", country: "South Africa", lat: -26.2041, lon: 28.0473 },
  { name: "Cape Town", region: "Western Cape", country: "South Africa", lat: -33.9249, lon: 18.4241 },
  { name: "Nairobi", region: "Nairobi", country: "Kenya", lat: -1.2921, lon: 36.8219 },
  { name: "Casablanca", region: "Casablanca-Settat", country: "Morocco", lat: 33.5731, lon: -7.5898 },
  { name: "Accra", region: "Greater Accra", country: "Ghana", lat: 5.6037, lon: -0.1870 },
  { name: "Addis Ababa", region: "Addis Ababa", country: "Ethiopia", lat: 9.0320, lon: 38.7469 },
  { name: "Dar es Salaam", region: "Dar es Salaam", country: "Tanzania", lat: -6.7924, lon: 39.2083 },
  { name: "Algiers", region: "Algiers", country: "Algeria", lat: 36.7538, lon: 3.0588 },
  
  // Russia & Eastern Europe
  { name: "Moscow", region: "Moscow", country: "Russia", lat: 55.7558, lon: 37.6173 },
  { name: "Saint Petersburg", region: "Saint Petersburg", country: "Russia", lat: 59.9311, lon: 30.3609 },
  { name: "Kyiv", region: "Kyiv", country: "Ukraine", lat: 50.4501, lon: 30.5234 },
  { name: "Bucharest", region: "Bucharest", country: "Romania", lat: 44.4268, lon: 26.1025 },
  { name: "Sofia", region: "Sofia", country: "Bulgaria", lat: 42.6977, lon: 23.3219 },
  { name: "Belgrade", region: "Belgrade", country: "Serbia", lat: 44.7866, lon: 20.4489 },
  { name: "Zagreb", region: "Zagreb", country: "Croatia", lat: 45.8150, lon: 15.9819 },
  
  // Caribbean
  { name: "San Juan", region: "Puerto Rico", country: "USA", lat: 18.4655, lon: -66.1057 },
  { name: "Havana", region: "Havana", country: "Cuba", lat: 23.1136, lon: -82.3666 },
  { name: "Kingston", region: "Kingston", country: "Jamaica", lat: 18.0179, lon: -76.8099 },
  { name: "Santo Domingo", region: "National District", country: "Dominican Republic", lat: 18.4861, lon: -69.9312 },
  { name: "Nassau", region: "New Providence", country: "Bahamas", lat: 25.0343, lon: -77.3963 },
  
  // More Europe
  { name: "Lyon", region: "Auvergne-Rhône-Alpes", country: "France", lat: 45.7640, lon: 4.8357 },
  { name: "Marseille", region: "Provence-Alpes-Côte d'Azur", country: "France", lat: 43.2965, lon: 5.3698 },
  { name: "Hamburg", region: "Hamburg", country: "Germany", lat: 53.5511, lon: 9.9937 },
  { name: "Frankfurt", region: "Hesse", country: "Germany", lat: 50.1109, lon: 8.6821 },
  { name: "Cologne", region: "North Rhine-Westphalia", country: "Germany", lat: 50.9375, lon: 6.9603 },
  { name: "Naples", region: "Campania", country: "Italy", lat: 40.8518, lon: 14.2681 },
  { name: "Turin", region: "Piedmont", country: "Italy", lat: 45.0703, lon: 7.6869 },
  { name: "Florence", region: "Tuscany", country: "Italy", lat: 43.7696, lon: 11.2558 },
  { name: "Venice", region: "Veneto", country: "Italy", lat: 45.4408, lon: 12.3155 },
  { name: "Seville", region: "Andalusia", country: "Spain", lat: 37.3891, lon: -5.9845 },
  { name: "Valencia", region: "Valencian Community", country: "Spain", lat: 39.4699, lon: -0.3763 },
  { name: "Porto", region: "Porto", country: "Portugal", lat: 41.1579, lon: -8.6291 },
  { name: "Rotterdam", region: "South Holland", country: "Netherlands", lat: 51.9244, lon: 4.4777 },
  { name: "Antwerp", region: "Antwerp", country: "Belgium", lat: 51.2194, lon: 4.4025 },
  { name: "Geneva", region: "Geneva", country: "Switzerland", lat: 46.2044, lon: 6.1432 },
  { name: "Krakow", region: "Lesser Poland", country: "Poland", lat: 50.0647, lon: 19.9450 },
  
  // More Asia
  { name: "Kyoto", region: "Kyoto", country: "Japan", lat: 35.0116, lon: 135.7681 },
  { name: "Yokohama", region: "Kanagawa", country: "Japan", lat: 35.4437, lon: 139.6380 },
  { name: "Nagoya", region: "Aichi", country: "Japan", lat: 35.1815, lon: 136.9066 },
  { name: "Fukuoka", region: "Fukuoka", country: "Japan", lat: 33.5904, lon: 130.4017 },
  { name: "Busan", region: "Busan", country: "South Korea", lat: 35.1796, lon: 129.0756 },
  { name: "Kolkata", region: "West Bengal", country: "India", lat: 22.5726, lon: 88.3639 },
  { name: "Chennai", region: "Tamil Nadu", country: "India", lat: 13.0827, lon: 80.2707 },
  { name: "Hyderabad", region: "Telangana", country: "India", lat: 17.3850, lon: 78.4867 },
  { name: "Pune", region: "Maharashtra", country: "India", lat: 18.5204, lon: 73.8567 },
  { name: "Chiang Mai", region: "Chiang Mai", country: "Thailand", lat: 18.7883, lon: 98.9853 },
  { name: "Phuket", region: "Phuket", country: "Thailand", lat: 7.8804, lon: 98.3923 },
  { name: "Bali", region: "Bali", country: "Indonesia", lat: -8.3405, lon: 115.0920 },
  { name: "Cebu City", region: "Central Visayas", country: "Philippines", lat: 10.3157, lon: 123.8854 },
];

export interface CityResult {
  name: string;
  region: string;
  country: string;
  lat: number;
  lon: number;
  displayName: string;
}

export function searchTopCities(query: string): CityResult[] {
  if (query.length < 2) return [];
  
  const lowerQuery = query.toLowerCase();
  
  return TOP_CITIES
    .filter(city => 
      city.name.toLowerCase().includes(lowerQuery) ||
      city.region.toLowerCase().includes(lowerQuery) ||
      city.country.toLowerCase().includes(lowerQuery)
    )
    .slice(0, 6)
    .map(city => ({
      ...city,
      displayName: city.country === "USA" 
        ? `${city.name}, ${city.region}, USA`
        : `${city.name}, ${city.country}`
    }));
}

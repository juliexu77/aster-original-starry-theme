import { useState, useRef, useEffect } from "react";
import { MapPin } from "lucide-react";
import { Input } from "@/components/ui/input";

// Common cities for autocomplete
const CITIES = [
  "New York, USA", "Los Angeles, USA", "Chicago, USA", "Houston, USA", "Phoenix, USA",
  "San Francisco, USA", "Seattle, USA", "Boston, USA", "Miami, USA", "Denver, USA",
  "Austin, USA", "San Diego, USA", "Dallas, USA", "Portland, USA", "Atlanta, USA",
  "London, UK", "Manchester, UK", "Birmingham, UK", "Edinburgh, UK", "Glasgow, UK",
  "Toronto, Canada", "Vancouver, Canada", "Montreal, Canada", "Calgary, Canada",
  "Sydney, Australia", "Melbourne, Australia", "Brisbane, Australia", "Perth, Australia",
  "Auckland, New Zealand", "Wellington, New Zealand",
  "Paris, France", "Lyon, France", "Marseille, France",
  "Berlin, Germany", "Munich, Germany", "Hamburg, Germany", "Frankfurt, Germany",
  "Amsterdam, Netherlands", "Rotterdam, Netherlands",
  "Madrid, Spain", "Barcelona, Spain", "Valencia, Spain",
  "Rome, Italy", "Milan, Italy", "Florence, Italy", "Naples, Italy",
  "Tokyo, Japan", "Osaka, Japan", "Kyoto, Japan", "Yokohama, Japan",
  "Beijing, China", "Shanghai, China", "Guangzhou, China", "Shenzhen, China",
  "Hong Kong", "Singapore", "Seoul, South Korea", "Taipei, Taiwan",
  "Mumbai, India", "Delhi, India", "Bangalore, India", "Chennai, India",
  "Dubai, UAE", "Abu Dhabi, UAE", "Tel Aviv, Israel", "Jerusalem, Israel",
  "São Paulo, Brazil", "Rio de Janeiro, Brazil", "Buenos Aires, Argentina",
  "Mexico City, Mexico", "Guadalajara, Mexico", "Bogotá, Colombia",
  "Cape Town, South Africa", "Johannesburg, South Africa", "Lagos, Nigeria",
  "Cairo, Egypt", "Nairobi, Kenya", "Casablanca, Morocco",
  "Stockholm, Sweden", "Oslo, Norway", "Copenhagen, Denmark", "Helsinki, Finland",
  "Vienna, Austria", "Zurich, Switzerland", "Geneva, Switzerland", "Brussels, Belgium",
  "Dublin, Ireland", "Lisbon, Portugal", "Prague, Czech Republic", "Warsaw, Poland",
  "Budapest, Hungary", "Athens, Greece", "Istanbul, Turkey", "Moscow, Russia",
  "Bangkok, Thailand", "Jakarta, Indonesia", "Manila, Philippines", "Kuala Lumpur, Malaysia"
];

interface LocationInputProps {
  id: string;
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
  disabled?: boolean;
  className?: string;
}

export const LocationInput = ({ 
  id, 
  value, 
  onChange, 
  placeholder = "Start typing a city...",
  disabled = false,
  className = ""
}: LocationInputProps) => {
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [filteredCities, setFilteredCities] = useState<string[]>([]);
  const inputRef = useRef<HTMLInputElement>(null);
  const suggestionsRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (value.length >= 2) {
      const filtered = CITIES.filter(city => 
        city.toLowerCase().includes(value.toLowerCase())
      ).slice(0, 6);
      setFilteredCities(filtered);
      setShowSuggestions(filtered.length > 0);
    } else {
      setFilteredCities([]);
      setShowSuggestions(false);
    }
  }, [value]);

  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (
        suggestionsRef.current && 
        !suggestionsRef.current.contains(e.target as Node) &&
        inputRef.current &&
        !inputRef.current.contains(e.target as Node)
      ) {
        setShowSuggestions(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleSelectCity = (city: string) => {
    onChange(city);
    setShowSuggestions(false);
  };

  return (
    <div className="relative">
      <Input
        ref={inputRef}
        id={id}
        type="text"
        placeholder={placeholder}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        onFocus={() => value.length >= 2 && filteredCities.length > 0 && setShowSuggestions(true)}
        disabled={disabled}
        className={className}
        autoComplete="off"
      />
      {showSuggestions && (
        <div 
          ref={suggestionsRef}
          className="absolute top-full left-0 right-0 mt-1 rounded-md border border-border shadow-lg z-50 max-h-48 overflow-y-auto"
          style={{ backgroundColor: 'hsl(var(--card))' }}
        >
          {filteredCities.map((city) => (
            <button
              key={city}
              type="button"
              onClick={() => handleSelectCity(city)}
              className="w-full px-3 py-2 text-left text-sm hover:bg-accent/50 transition-colors flex items-center gap-2"
            >
              <MapPin className="w-3 h-3 text-muted-foreground" />
              {city}
            </button>
          ))}
        </div>
      )}
    </div>
  );
};

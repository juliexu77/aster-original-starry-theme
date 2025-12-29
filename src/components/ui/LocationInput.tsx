import { useState, useRef, useEffect, useCallback } from "react";
import { MapPin, Loader2 } from "lucide-react";
import { Input } from "@/components/ui/input";
import { searchTopCities, CityResult } from "@/lib/top-cities";

interface NominatimResult {
  place_id: number;
  display_name: string;
  lat: string;
  lon: string;
  type: string;
}

interface LocationInputProps {
  id: string;
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
  disabled?: boolean;
  className?: string;
}

// Debounce function
function debounce<T extends (...args: unknown[]) => void>(func: T, wait: number): (...args: Parameters<T>) => void {
  let timeout: NodeJS.Timeout | null = null;
  return (...args: Parameters<T>) => {
    if (timeout) clearTimeout(timeout);
    timeout = setTimeout(() => func(...args), wait);
  };
}

interface Suggestion {
  id: string | number;
  displayName: string;
  isLocal: boolean;
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
  const [suggestions, setSuggestions] = useState<Suggestion[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);
  const suggestionsRef = useRef<HTMLDivElement>(null);

  // Search local cities first (instant)
  const searchLocal = useCallback((query: string): Suggestion[] => {
    const localResults = searchTopCities(query);
    return localResults.map((city, index) => ({
      id: `local-${index}`,
      displayName: city.displayName,
      isLocal: true
    }));
  }, []);

  // Fetch locations from OpenStreetMap Nominatim API
  const fetchLocations = useCallback(async (query: string) => {
    if (query.length < 2) {
      setSuggestions([]);
      setShowSuggestions(false);
      return;
    }

    // First show local results immediately
    const localSuggestions = searchLocal(query);
    if (localSuggestions.length > 0) {
      setSuggestions(localSuggestions);
      setShowSuggestions(true);
    }

    // If we have enough local results, don't hit the API
    if (localSuggestions.length >= 4) {
      setIsLoading(false);
      return;
    }

    setIsLoading(true);
    try {
      const response = await fetch(
        `https://nominatim.openstreetmap.org/search?` +
        `q=${encodeURIComponent(query)}&` +
        `format=json&` +
        `addressdetails=1&` +
        `limit=6&` +
        `featuretype=city`
      , {
        headers: {
          'Accept-Language': 'en',
          'User-Agent': 'BabyApp/1.0'
        }
      });

      if (!response.ok) throw new Error('Failed to fetch');

      const data: NominatimResult[] = await response.json();
      
      // Combine local and API results, avoiding duplicates
      const localDisplayNames = new Set(localSuggestions.map(s => s.displayName.toLowerCase()));
      const apiSuggestions: Suggestion[] = data
        .map(result => ({
          id: result.place_id,
          displayName: formatLocation(result.display_name),
          isLocal: false
        }))
        .filter(s => !localDisplayNames.has(s.displayName.toLowerCase()));

      const combined = [...localSuggestions, ...apiSuggestions].slice(0, 6);
      setSuggestions(combined);
      setShowSuggestions(combined.length > 0);
    } catch (error) {
      console.error('Error fetching locations:', error);
      // Keep local results on API error
      if (localSuggestions.length > 0) {
        setSuggestions(localSuggestions);
        setShowSuggestions(true);
      }
    } finally {
      setIsLoading(false);
    }
  }, [searchLocal]);

  // Debounced search (300ms delay to respect Nominatim usage policy)
  const debouncedFetch = useCallback(
    debounce((query: string) => fetchLocations(query), 300),
    [fetchLocations]
  );

  // Immediate local search on value change
  useEffect(() => {
    if (value.length >= 2) {
      const localSuggestions = searchLocal(value);
      if (localSuggestions.length > 0) {
        setSuggestions(localSuggestions);
        setShowSuggestions(true);
      }
    }
    debouncedFetch(value);
  }, [value, debouncedFetch, searchLocal]);

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

  // Format display name to be cleaner (City, Country)
  const formatLocation = (displayName: string): string => {
    const parts = displayName.split(',').map(p => p.trim());
    if (parts.length >= 2) {
      const city = parts[0];
      const country = parts[parts.length - 1];
      if (parts.length >= 3) {
        const region = parts[parts.length - 2];
        if (country === 'United States' && region.length <= 20) {
          return `${city}, ${region}, USA`;
        }
        return `${city}, ${country}`;
      }
      return `${city}, ${country}`;
    }
    return displayName;
  };

  const handleSelectLocation = (suggestion: Suggestion) => {
    onChange(suggestion.displayName);
    setShowSuggestions(false);
  };

  return (
    <div className="relative" style={{ overflow: 'visible' }}>
      <Input
        ref={inputRef}
        id={id}
        type="text"
        placeholder={placeholder}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        onFocus={() => suggestions.length > 0 && setShowSuggestions(true)}
        disabled={disabled}
        className={className}
        autoComplete="off"
      />
      {isLoading && (
        <div className="absolute right-3 top-1/2 -translate-y-1/2">
          <Loader2 className="w-4 h-4 animate-spin text-muted-foreground" />
        </div>
      )}
      {showSuggestions && suggestions.length > 0 && (
        <div 
          ref={suggestionsRef}
          className="absolute top-full left-0 right-0 mt-1 rounded-md border border-border shadow-lg z-50 max-h-48 overflow-y-auto"
          style={{ backgroundColor: 'hsl(var(--card))' }}
        >
          {suggestions.map((suggestion) => (
            <button
              key={suggestion.id}
              type="button"
              onClick={() => handleSelectLocation(suggestion)}
              className="w-full px-3 py-2 text-left text-sm hover:bg-accent/50 transition-colors flex items-center gap-2"
            >
              <MapPin className="w-3 h-3 text-muted-foreground flex-shrink-0" />
              <span className="truncate">{suggestion.displayName}</span>
            </button>
          ))}
        </div>
      )}
    </div>
  );
};
import { useState, useRef, useEffect } from "react";
import { Calendar, Clock, MapPin, Sparkles } from "lucide-react";
import { GlassCard } from "@/components/home/GlassCard";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useUserProfile } from "@/hooks/useUserProfile";
import { useToast } from "@/hooks/use-toast";

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

export const ParentBirthdayPrompt = ({ onSaved }: { onSaved?: () => void }) => {
  const [birthday, setBirthday] = useState("");
  const [birthTime, setBirthTime] = useState("");
  const [birthLocation, setBirthLocation] = useState("");
  const [saving, setSaving] = useState(false);
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [filteredCities, setFilteredCities] = useState<string[]>([]);
  const inputRef = useRef<HTMLInputElement>(null);
  const suggestionsRef = useRef<HTMLDivElement>(null);
  const { updateUserProfile } = useUserProfile();
  const { toast } = useToast();

  // Filter cities based on input
  useEffect(() => {
    if (birthLocation.length >= 2) {
      const filtered = CITIES.filter(city => 
        city.toLowerCase().includes(birthLocation.toLowerCase())
      ).slice(0, 6);
      setFilteredCities(filtered);
      setShowSuggestions(filtered.length > 0);
    } else {
      setFilteredCities([]);
      setShowSuggestions(false);
    }
  }, [birthLocation]);

  // Close suggestions when clicking outside
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
    setBirthLocation(city);
    setShowSuggestions(false);
  };

  const handleSave = async () => {
    if (!birthday) return;
    
    setSaving(true);
    try {
      await updateUserProfile({ 
        birthday,
        birth_time: birthTime || undefined,
        birth_location: birthLocation || undefined
      });
      toast({
        title: "Birthday saved",
        description: "Now we can show you cosmic insights!"
      });
      onSaved?.();
    } catch (error) {
      console.error("Error saving birthday:", error);
      toast({
        title: "Error",
        description: "Failed to save birthday",
        variant: "destructive"
      });
    } finally {
      setSaving(false);
    }
  };

  return (
    <GlassCard className="mx-4">
      <div className="p-5 text-center space-y-4">
        <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center mx-auto">
          <Sparkles className="w-5 h-5 text-primary" />
        </div>
        
        <div>
          <h3 className="font-serif text-base text-foreground mb-0.5">
            Unlock Family Dynamics
          </h3>
          <p className="text-xs text-muted-foreground">
            Add your birthday to see how you interact with your children
          </p>
        </div>
        
        <div className="flex flex-col gap-4 text-left">
          <div className="space-y-1.5">
            <Label htmlFor="parentBirthday" className="text-[10px] text-muted-foreground uppercase tracking-wide">Birthday</Label>
            <div className="relative">
              <Calendar className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground pointer-events-none" />
              <Input
                id="parentBirthday"
                type="date"
                value={birthday}
                onChange={(e) => setBirthday(e.target.value)}
                className="pl-10 h-10 text-sm"
              />
            </div>
          </div>
          
          <div className="space-y-1.5">
            <Label htmlFor="parentBirthTime" className="text-[10px] text-muted-foreground uppercase tracking-wide">
              Time <span className="normal-case opacity-60">(optional)</span>
            </Label>
            <div className="relative">
              <Clock className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground pointer-events-none" />
              <Input
                id="parentBirthTime"
                type="time"
                value={birthTime}
                onChange={(e) => setBirthTime(e.target.value)}
                className="pl-10 h-10 text-sm"
              />
            </div>
          </div>
          
          <div className="space-y-1.5">
            <Label htmlFor="parentBirthLocation" className="text-[10px] text-muted-foreground uppercase tracking-wide">
              Location <span className="normal-case opacity-60">(optional)</span>
            </Label>
            <div className="relative">
              <MapPin className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground pointer-events-none z-10" />
              <Input
                ref={inputRef}
                id="parentBirthLocation"
                type="text"
                placeholder="Start typing a city..."
                value={birthLocation}
                onChange={(e) => setBirthLocation(e.target.value)}
                onFocus={() => birthLocation.length >= 2 && filteredCities.length > 0 && setShowSuggestions(true)}
                className="pl-10 h-10 text-sm"
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
          </div>
          
          <Button 
            onClick={handleSave} 
            disabled={!birthday || saving}
            className="w-full h-10 text-sm mt-1"
          >
            {saving ? "Saving..." : "Save Birthday"}
          </Button>
        </div>
        
        <p className="text-[10px] text-muted-foreground/60">
          Time & location help calculate your moon sign accurately
        </p>
      </div>
    </GlassCard>
  );
};

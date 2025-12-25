import { useState, useRef, useEffect } from "react";
import { Calendar, Clock, MapPin, Sparkles, User, Users } from "lucide-react";
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

interface LocationInputProps {
  id: string;
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
}

const LocationInput = ({ id, value, onChange, placeholder = "Start typing a city..." }: LocationInputProps) => {
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
      <MapPin className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground pointer-events-none z-10" />
      <Input
        ref={inputRef}
        id={id}
        type="text"
        placeholder={placeholder}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        onFocus={() => value.length >= 2 && filteredCities.length > 0 && setShowSuggestions(true)}
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
  );
};

export const ParentBirthdayPrompt = ({ onSaved }: { onSaved?: () => void }) => {
  // Your info
  const [birthday, setBirthday] = useState("");
  const [birthTime, setBirthTime] = useState("");
  const [birthLocation, setBirthLocation] = useState("");
  
  // Partner info
  const [partnerName, setPartnerName] = useState("");
  const [partnerBirthday, setPartnerBirthday] = useState("");
  const [partnerBirthTime, setPartnerBirthTime] = useState("");
  const [partnerBirthLocation, setPartnerBirthLocation] = useState("");
  
  const [saving, setSaving] = useState(false);
  const { updateUserProfile } = useUserProfile();
  const { toast } = useToast();

  const handleSave = async () => {
    // At least one person's birthday is required
    if (!birthday && !partnerBirthday) return;
    
    setSaving(true);
    try {
      await updateUserProfile({ 
        birthday: birthday || undefined,
        birth_time: birthTime || undefined,
        birth_location: birthLocation || undefined,
        partner_name: partnerName || undefined,
        partner_birthday: partnerBirthday || undefined,
        partner_birth_time: partnerBirthTime || undefined,
        partner_birth_location: partnerBirthLocation || undefined
      });
      toast({
        title: "Saved",
        description: "Now we can show you cosmic insights!"
      });
      onSaved?.();
    } catch (error) {
      console.error("Error saving:", error);
      toast({
        title: "Error",
        description: "Failed to save",
        variant: "destructive"
      });
    } finally {
      setSaving(false);
    }
  };

  const hasAnyData = birthday || partnerBirthday;

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
            Add your birth info to see how you interact with your children
          </p>
        </div>
        
        {/* Your Info Section */}
        <div className="space-y-4 text-left">
          <div className="flex items-center gap-2 text-xs font-medium text-muted-foreground uppercase tracking-wide">
            <User className="w-3.5 h-3.5" />
            Your Info <span className="normal-case opacity-60">(optional)</span>
          </div>
          
          <div className="space-y-3 pl-1">
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
            
            <div className="grid grid-cols-2 gap-3">
              <div className="space-y-1.5">
                <Label htmlFor="parentBirthTime" className="text-[10px] text-muted-foreground uppercase tracking-wide">
                  Time
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
                  Location
                </Label>
                <LocationInput
                  id="parentBirthLocation"
                  value={birthLocation}
                  onChange={setBirthLocation}
                />
              </div>
            </div>
          </div>
        </div>

        {/* Divider */}
        <div className="border-t border-border/50 my-4" />

        {/* Partner Info Section */}
        <div className="space-y-4 text-left">
          <div className="flex items-center gap-2 text-xs font-medium text-muted-foreground uppercase tracking-wide">
            <Users className="w-3.5 h-3.5" />
            Partner's Info <span className="normal-case opacity-60">(optional)</span>
          </div>
          
          <div className="space-y-3 pl-1">
            <div className="space-y-1.5">
              <Label htmlFor="partnerName" className="text-[10px] text-muted-foreground uppercase tracking-wide">Name</Label>
              <div className="relative">
                <User className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground pointer-events-none" />
                <Input
                  id="partnerName"
                  type="text"
                  placeholder="Partner's name"
                  value={partnerName}
                  onChange={(e) => setPartnerName(e.target.value)}
                  className="pl-10 h-10 text-sm"
                />
              </div>
            </div>
            
            <div className="space-y-1.5">
              <Label htmlFor="partnerBirthday" className="text-[10px] text-muted-foreground uppercase tracking-wide">Birthday</Label>
              <div className="relative">
                <Calendar className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground pointer-events-none" />
                <Input
                  id="partnerBirthday"
                  type="date"
                  value={partnerBirthday}
                  onChange={(e) => setPartnerBirthday(e.target.value)}
                  className="pl-10 h-10 text-sm"
                />
              </div>
            </div>
            
            <div className="grid grid-cols-2 gap-3">
              <div className="space-y-1.5">
                <Label htmlFor="partnerBirthTime" className="text-[10px] text-muted-foreground uppercase tracking-wide">
                  Time
                </Label>
                <div className="relative">
                  <Clock className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground pointer-events-none" />
                  <Input
                    id="partnerBirthTime"
                    type="time"
                    value={partnerBirthTime}
                    onChange={(e) => setPartnerBirthTime(e.target.value)}
                    className="pl-10 h-10 text-sm"
                  />
                </div>
              </div>
              
              <div className="space-y-1.5">
                <Label htmlFor="partnerBirthLocation" className="text-[10px] text-muted-foreground uppercase tracking-wide">
                  Location
                </Label>
                <LocationInput
                  id="partnerBirthLocation"
                  value={partnerBirthLocation}
                  onChange={setPartnerBirthLocation}
                />
              </div>
            </div>
          </div>
        </div>
        
        <Button 
          onClick={handleSave} 
          disabled={!hasAnyData || saving}
          className="w-full h-10 text-sm mt-2"
        >
          {saving ? "Saving..." : "Save"}
        </Button>
        
        <p className="text-[10px] text-muted-foreground/60">
          Time & location help calculate moon signs accurately
        </p>
      </div>
    </GlassCard>
  );
};
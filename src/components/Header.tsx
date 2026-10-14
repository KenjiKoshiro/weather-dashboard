import { useState, useEffect, useRef } from "react";
import { Search, MapPin, Sun, Moon, Wind } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { searchLocations, GeoLocation } from "../services/geocoding";
import { UnitSystem } from "../types/weather";

interface HeaderProps {
  onSearch: (location: GeoLocation) => void;
  onUseLocation: () => void;
  onToggleUnit: () => void;
  onToggleTheme: () => void;
  unit: UnitSystem;
  theme: "light" | "dark";
  isSearching: boolean;
}

export function Header({
  onSearch,
  onUseLocation,
  onToggleUnit,
  onToggleTheme,
  unit,
  theme,
  isSearching,
}: HeaderProps) {
  const [query, setQuery] = useState("");
  const [suggestions, setSuggestions] = useState<GeoLocation[]>([]);
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [searchPending, setSearchPending] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    let active = true;
    const timer = setTimeout(async () => {
      if (query.length >= 2) {
        const results = await searchLocations(query);
        if (active) { setSuggestions(results); setSearchPending(false); }
      } else {
        setSuggestions([]);
        setSearchPending(false);
      }
    }, 300);

    return () => { active = false; clearTimeout(timer); };
  }, [query]);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setShowSuggestions(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  return (
    <header className="site-header">
      <a href="#forecast" className="brand" aria-label="Zenith weather home"><span className="brand-mark"><Wind size={26} aria-hidden="true" /></span><span><h1>zenith<span>.</span></h1><small>EVERY DAY, IN PERSPECTIVE</small></span></a>
      <div className="header-tools">
        <div className="search-wrap" ref={dropdownRef} onKeyDown={(event) => { if (event.key === "Escape") setShowSuggestions(false); }}>
          <label htmlFor="city-search" className="sr-only">Search for a city</label>
          <Search className="search-icon" size={18} aria-hidden="true" />
          <input id="city-search" type="search" value={query} autoComplete="off"
            onChange={(event) => { setQuery(event.target.value); setSearchPending(event.target.value.length >= 2); setSuggestions([]); setShowSuggestions(true); }}
            onFocus={() => setShowSuggestions(true)} placeholder="Find a city…" aria-describedby="search-help" />
          <span id="search-help" className="sr-only">Type at least two characters, then tab to a matching city.</span>
          <AnimatePresence>
            {showSuggestions && query.length >= 2 && (
              <motion.div className="search-results" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
                {suggestions.length === 0 ? <p role="status">{searchPending ? "Finding cities…" : "No matches available. Try a city and country, or check your connection."}</p> : suggestions.map((loc, index) => (
                  <button key={`${loc.lat}-${loc.lon}-${index}`} onClick={() => { onSearch(loc); setQuery(""); setShowSuggestions(false); }}>
                    <MapPin size={17} aria-hidden="true" /><span><strong>{loc.name}</strong><small>{[loc.state, loc.country].filter(Boolean).join(", ")}</small></span>
                  </button>
                ))}
              </motion.div>
            )}
          </AnimatePresence>
        </div>
        <div className="header-actions">
          <button className="icon-button" onClick={onUseLocation} disabled={isSearching} aria-label="Use current location" title="Use current location"><MapPin size={19} aria-hidden="true" /></button>
          <button className="unit-button" onClick={onToggleUnit} aria-label={`Switch to degrees ${unit === "c" ? "Fahrenheit" : "Celsius"}`} title="Change temperature units">°{unit.toUpperCase()}</button>
          <button className="icon-button" onClick={onToggleTheme} aria-label={`Switch to ${theme === "dark" ? "light" : "dark"} theme`} title="Change theme">{theme === "dark" ? <Sun size={19} aria-hidden="true" /> : <Moon size={19} aria-hidden="true" />}</button>
        </div>
      </div>
    </header>
  );
}

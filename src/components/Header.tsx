import { useState, useEffect, useRef } from "react";
import { Search, MapPin, Sun, Moon, Wind, Thermometer } from "lucide-react";
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
  const dropdownRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const timer = setTimeout(async () => {
      if (query.length >= 2) {
        const results = await searchLocations(query);
        setSuggestions(results);
      } else {
        setSuggestions([]);
      }
    }, 300);

    return () => clearTimeout(timer);
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
    <header className="flex flex-col gap-6 lg:flex-row lg:items-center lg:justify-between">
      <div className="flex items-center gap-3">
        <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-linear-to-br from-blue-500 to-cyan-400 text-white shadow-lg shadow-blue-500/20">
          <Wind className="h-6 w-6" />
        </div>
        <div>
          <h1 className="text-2xl font-bold tracking-tight">ZENITH</h1>
          <p className="text-[10px] font-bold uppercase tracking-[0.4em] text-slate-400 dark:text-slate-200">Weather Intelligence</p>
        </div>
      </div>

      <div className="flex flex-1 items-center gap-4 lg:max-w-2xl">
        <div className="relative flex-1" ref={dropdownRef}>
          <div className="group relative">
            <div className="absolute inset-y-0 left-4 flex items-center pointer-events-none">
              <Search className={`h-5 w-5 transition-colors ${isSearching ? "text-blue-500 animate-pulse" : "text-slate-400 dark:text-slate-300"}`} />
            </div>
            <input
              type="text"
              value={query}
              onChange={(e) => {
                setQuery(e.target.value);
                setShowSuggestions(true);
              }}
              onFocus={() => setShowSuggestions(true)}
              placeholder="Search location (e.g. Tokyo, JP)"
              className="zenith-glass w-full rounded-3xl py-4 pl-12 pr-4 text-sm font-medium outline-hidden ring-blue-500/20 focus:ring-4"
            />
          </div>

          <AnimatePresence>
            {showSuggestions && suggestions.length > 0 && (
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: 10 }}
                className="zenith-glass absolute left-0 right-0 z-50 mt-2 overflow-hidden rounded-[2rem] p-2"
              >
                {suggestions.map((loc, index) => (
                  <button
                    key={`${loc.lat}-${loc.lon}-${index}`}
                    onClick={() => {
                      onSearch(loc);
                      setQuery("");
                      setShowSuggestions(false);
                    }}
                    className="flex w-full items-center gap-3 rounded-2xl p-3 text-left transition-colors hover:bg-blue-500/10"
                  >
                    <div className="flex h-8 w-8 items-center justify-center rounded-xl bg-slate-100 dark:bg-white/5">
                      <MapPin className="h-4 w-4 text-slate-500" />
                    </div>
                    <div>
                      <p className="text-sm font-semibold">{loc.name}</p>
                      <p className="text-xs text-slate-500 dark:text-slate-300">{loc.country}</p>
                    </div>
                  </button>
                ))}
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        <button
          onClick={onUseLocation}
          className="zenith-glass hidden flex-shrink-0 items-center justify-center rounded-2xl p-4 text-blue-500 transition-transform active:scale-95 sm:flex"
          title="Use current location"
        >
          <MapPin className="h-5 w-5" />
        </button>

        <div className="flex shrink-0 items-center gap-2 rounded-[2rem] border border-white/20 bg-white/10 p-1.5 backdrop-blur-md dark:border-white/5 dark:bg-black/20">
          <button
            onClick={onToggleUnit}
            className="flex h-10 w-10 items-center justify-center rounded-xl transition-all hover:bg-white/10"
          >
            <Thermometer className="h-5 w-5" />
          </button>
          <div className="h-4 w-px bg-white/10" />
          <button
            onClick={onToggleTheme}
            className="flex h-10 w-10 items-center justify-center rounded-xl transition-all hover:bg-white/10"
          >
            {theme === "dark" ? <Sun className="h-5 w-5" /> : <Moon className="h-5 w-5" />}
          </button>
        </div>
      </div>
    </header>
  );
}

import { useState, useEffect, useCallback, useMemo } from "react";
import { 
  WeatherApiResponse, 
  UnitSystem, 
  RecentSearchItem 
} from "../types/weather";
import { fetchZenithWeather } from "../services/weatherApi";
import { reverseGeocode, GeoLocation } from "../services/geocoding";
import { 
  loadRecentSearches, 
  saveRecentSearches, 
  loadUnit, 
  saveUnit,
  loadTheme,
  saveTheme,
  AppTheme
} from "../utils/storage";
import { DEFAULT_CITY, DEFAULT_LAT, DEFAULT_LON, AUTO_REFRESH_INTERVAL } from "../constants";

export function useWeather() {
  const [weather, setWeather] = useState<WeatherApiResponse | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [unit, setUnit] = useState<UnitSystem>(() => loadUnit());
  const [theme, setTheme] = useState<AppTheme>(() => loadTheme());
  const [recentSearches, setRecentSearches] = useState<RecentSearchItem[]>(() => loadRecentSearches());

  const fetchWeather = useCallback(async (
    lat: number, 
    lon: number, 
    name: string, 
    country: string,
    persist = true
  ) => {
    setLoading(true);
    setError(null);
    try {
      const data = await fetchZenithWeather(lat, lon, name, country);
      setWeather(data);
      
      if (persist) {
        const newItem: RecentSearchItem = {
          id: `${lat},${lon}`,
          name: data.location.name,
          country: data.location.country,
          searchedAt: Date.now(),
        };
        
        setRecentSearches(prev => {
          const filtered = prev.filter(item => item.id !== newItem.id);
          const next = [newItem, ...filtered].slice(0, 8);
          saveRecentSearches(next);
          return next;
        });
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : "An error occurred");
    } finally {
      setLoading(false);
    }
  }, []);

  const handleSearch = useCallback((location: GeoLocation) => {
    fetchWeather(location.lat, location.lon, location.name, location.country);
  }, [fetchWeather]);

  const handleUseLocation = useCallback(() => {
    if (!navigator.geolocation) {
      setError("Geolocation is not supported by your browser");
      return;
    }

    setLoading(true);
    navigator.geolocation.getCurrentPosition(
      async (position) => {
        const { latitude, longitude } = position.coords;
        const geoInfo = await reverseGeocode(latitude, longitude);
        if (geoInfo) {
          fetchWeather(latitude, longitude, geoInfo.name, geoInfo.country);
        } else {
          fetchWeather(latitude, longitude, "Your Location", "Unknown");
        }
      },
      (err) => {
        setError(err.message);
        setLoading(false);
      }
    );
  }, [fetchWeather]);

  const toggleUnit = useCallback(() => {
    setUnit(prev => {
      const next = prev === "c" ? "f" : "c";
      saveUnit(next);
      return next;
    });
  }, []);

  const toggleTheme = useCallback(() => {
    setTheme(prev => {
      const next = prev === "light" ? "dark" : "light";
      saveTheme(next);
      return next;
    });
  }, []);

  // Initial load
  useEffect(() => {
    fetchWeather(DEFAULT_LAT, DEFAULT_LON, DEFAULT_CITY, "USA", false);
  }, [fetchWeather]);

  // Auto refresh
  useEffect(() => {
    if (!weather) return;
    
    const interval = setInterval(() => {
      fetchWeather(
        weather.location.lat, 
        weather.location.lon, 
        weather.location.name, 
        weather.location.country,
        false
      );
    }, AUTO_REFRESH_INTERVAL);

    return () => clearInterval(interval);
  }, [weather, fetchWeather]);

  // Apply theme to document
  useEffect(() => {
    document.documentElement.classList.toggle("dark", theme === "dark");
  }, [theme]);

  const removeRecentSearch = useCallback((id: string) => {
    setRecentSearches(prev => {
      const next = prev.filter(item => item.id !== id);
      saveRecentSearches(next);
      return next;
    });
  }, []);

  return {
    weather,
    loading,
    error,
    unit,
    theme,
    recentSearches,
    handleSearch,
    handleUseLocation,
    toggleUnit,
    toggleTheme,
    removeRecentSearch,
    refreshWeather: () => weather && fetchWeather(weather.location.lat, weather.location.lon, weather.location.name, weather.location.country, false),
  };
}

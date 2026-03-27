import { useCallback, useEffect, useMemo, useState } from "react";
import { CurrentWeather } from "./components/CurrentWeather";
import { DailyForecast } from "./components/DailyForecast";
import { ErrorMessage } from "./components/ErrorMessage";
import { Header } from "./components/Header";
import { HourlyForecast } from "./components/HourlyForecast";
import { Loader } from "./components/Loader";
import { RecentSearches } from "./components/RecentSearches";
import { WeatherHighlights } from "./components/WeatherHighlights";
import {
  fetchForecast,
  fetchForecastByCoords,
  fetchSearchSuggestions,
} from "./services/weatherApi";
import type {
  RecentSearchItem,
  UnitSystem,
  WeatherApiForecastResponse,
  WeatherApiHour,
  WeatherSearchSuggestion,
} from "./types/weather";
import {
  formatLocationLabel,
  getWeatherTheme,
} from "./utils/weatherFormat";
import {
  loadRecentSearches,
  loadTheme,
  loadUnit,
  saveRecentSearches,
  saveTheme,
  saveUnit,
  type AppTheme,
} from "./utils/storage";

const DEFAULT_CITY = "New York";
const AUTO_REFRESH_INTERVAL = 1000 * 60 * 5;
const RECENT_LIMIT = 8;

function buildRecentSearchItem(data: WeatherApiForecastResponse): RecentSearchItem {
  const label = formatLocationLabel(
    data.location.name,
    data.location.region,
    data.location.country
  );

  return {
    id: `${data.location.name}-${data.location.lat}-${data.location.lon}`,
    query: label,
    label,
    searchedAt: Date.now(),
  };
}

function getUpcomingHours(data?: WeatherApiForecastResponse | null) {
  if (!data) return [] as WeatherApiHour[];

  const nowEpoch = data.location.localtime_epoch;

  return data.forecast.forecastday
    .flatMap((day) => day.hour)
    .filter((hour) => hour.time_epoch >= nowEpoch)
    .slice(0, 12);
}

function getNextRainChance(data?: WeatherApiForecastResponse | null) {
  if (!data) return 0;

  const hourlyChance = getUpcomingHours(data)
    .slice(0, 6)
    .reduce((max, hour) => Math.max(max, hour.chance_of_rain ?? 0), 0);

  return Math.max(hourlyChance, data.forecast.forecastday[0]?.day.daily_chance_of_rain ?? 0);
}

export default function App() {
  const [query, setQuery] = useState(DEFAULT_CITY);
  const [activeQuery, setActiveQuery] = useState(DEFAULT_CITY);
  const [weather, setWeather] = useState<WeatherApiForecastResponse | null>(null);
  const [loading, setLoading] = useState(true);
  const [searching, setSearching] = useState(false);
  const [refreshing, setRefreshing] = useState(false);
  const [error, setError] = useState("");
  const [suggestions, setSuggestions] = useState<WeatherSearchSuggestion[]>([]);
  const [recentSearches, setRecentSearches] = useState<RecentSearchItem[]>(() => loadRecentSearches());
  const [unit, setUnit] = useState<UnitSystem>(() => loadUnit());
  const [theme, setTheme] = useState<AppTheme>(() => loadTheme());

  const persistRecentSearch = useCallback((data: WeatherApiForecastResponse) => {
    setRecentSearches((previous) => {
      const nextItem = buildRecentSearchItem(data);
      const nextItems = [nextItem, ...previous.filter((item) => item.id !== nextItem.id)].slice(
        0,
        RECENT_LIMIT
      );
      saveRecentSearches(nextItems);
      return nextItems;
    });
  }, []);

  const runSearch = useCallback(
    async (nextQuery: string, options?: { silent?: boolean; persist?: boolean }) => {
      const searchTerm = nextQuery.trim();
      if (!searchTerm) {
        setError("Please enter a city name to search.");
        return;
      }

      const silent = options?.silent ?? false;
      const persist = options?.persist ?? true;

      setError("");
      setSuggestions([]);
      setQuery(searchTerm);

      if (silent) {
        setRefreshing(true);
      } else {
        setLoading(true);
        setSearching(true);
      }

      try {
        const response = await fetchForecast(searchTerm);
        const locationLabel = formatLocationLabel(
          response.location.name,
          response.location.region,
          response.location.country
        );
        setWeather(response);
        setActiveQuery(locationLabel);
        setQuery(locationLabel);
        if (persist) {
          persistRecentSearch(response);
        }
      } catch (requestError) {
        const message =
          requestError instanceof Error
            ? requestError.message
            : "Unable to load weather data right now.";
        setError(message);
      } finally {
        setLoading(false);
        setSearching(false);
        setRefreshing(false);
      }
    },
    [persistRecentSearch]
  );

  const handleUseLocation = useCallback(async () => {
    if (!("geolocation" in navigator)) {
      setError("Geolocation is not supported by this browser.");
      return;
    }

    setError("");
    setSearching(true);
    setLoading(true);

    navigator.geolocation.getCurrentPosition(
      async ({ coords }) => {
        try {
          const response = await fetchForecastByCoords(coords.latitude, coords.longitude);
          const label = formatLocationLabel(
            response.location.name,
            response.location.region,
            response.location.country
          );
          setWeather(response);
          setActiveQuery(label);
          setQuery(label);
          persistRecentSearch(response);
        } catch (requestError) {
          const message =
            requestError instanceof Error
              ? requestError.message
              : "Unable to fetch weather for your location.";
          setError(message);
        } finally {
          setLoading(false);
          setSearching(false);
        }
      },
      (geoError) => {
        setError(geoError.message || "Unable to access your location.");
        setLoading(false);
        setSearching(false);
      },
      { enableHighAccuracy: true, timeout: 10000, maximumAge: 300000 }
    );
  }, [persistRecentSearch]);

  useEffect(() => {
    void runSearch(DEFAULT_CITY, { persist: false });
  }, [runSearch]);

  useEffect(() => {
    const trimmedQuery = query.trim();

    if (!trimmedQuery || trimmedQuery.length < 2) {
      setSuggestions([]);
      return;
    }

    let cancelled = false;
    const timeoutId = window.setTimeout(async () => {
      try {
        const results = await fetchSearchSuggestions(trimmedQuery);
        if (!cancelled) {
          setSuggestions(results.slice(0, 6));
        }
      } catch {
        if (!cancelled) {
          setSuggestions([]);
        }
      }
    }, 300);

    return () => {
      cancelled = true;
      window.clearTimeout(timeoutId);
    };
  }, [query]);

  useEffect(() => {
    if (!activeQuery) return;

    const intervalId = window.setInterval(() => {
      void runSearch(activeQuery, { silent: true });
    }, AUTO_REFRESH_INTERVAL);

    return () => window.clearInterval(intervalId);
  }, [activeQuery, runSearch]);

  useEffect(() => {
    saveUnit(unit);
  }, [unit]);

  useEffect(() => {
    saveTheme(theme);
    document.documentElement.classList.toggle("dark", theme === "dark");
  }, [theme]);

  const upcomingHours = useMemo(() => getUpcomingHours(weather), [weather]);
  const rainChance = useMemo(() => getNextRainChance(weather), [weather]);
  const themePalette = useMemo(() => {
    if (!weather) {
      return {
        app: theme === "dark" ? "from-slate-950 via-slate-900 to-indigo-950" : "from-sky-200 via-cyan-100 to-blue-50",
        panel: theme === "dark" ? "bg-slate-900/60 border-white/10" : "bg-white/65 border-white/60",
        accent: theme === "dark" ? "from-indigo-400/25 to-sky-400/10" : "from-yellow-100 to-sky-100",
        orbA: theme === "dark" ? "bg-indigo-500/30" : "bg-amber-300/40",
        orbB: theme === "dark" ? "bg-sky-500/20" : "bg-sky-300/35",
      };
    }

    if (theme === "dark") {
      return {
        app: "from-slate-950 via-slate-900 to-indigo-950",
        panel: "bg-slate-900/60 border-white/10",
        accent: "from-indigo-400/25 to-sky-400/10",
        orbA: "bg-indigo-500/30",
        orbB: "bg-sky-500/20",
      };
    }

    return getWeatherTheme(weather.current.condition.text, weather.current.is_day === 1);
  }, [theme, weather]);

  return (
    <div
      className={`min-h-screen bg-gradient-to-br ${themePalette.app} text-slate-900 transition-colors duration-700 dark:text-white`}
    >
      <div className="pointer-events-none fixed inset-0 overflow-hidden">
        <div className={`absolute left-[-5rem] top-[-4rem] h-56 w-56 rounded-full ${themePalette.orbA} blur-3xl`} />
        <div className={`absolute bottom-[-6rem] right-[-2rem] h-72 w-72 rounded-full ${themePalette.orbB} blur-3xl`} />
      </div>

      <div className="relative mx-auto flex min-h-screen w-full max-w-7xl flex-col gap-6 px-4 py-6 sm:px-6 lg:px-8 lg:py-8">
        <Header
          query={query}
          onQueryChange={setQuery}
          onSearch={(value) => void runSearch(value)}
          onUseLocation={handleUseLocation}
          onToggleUnit={() => setUnit((current) => (current === "c" ? "f" : "c"))}
          onToggleTheme={() => setTheme((current) => (current === "dark" ? "light" : "dark"))}
          unit={unit}
          theme={theme}
          suggestions={suggestions}
          recentSearches={recentSearches}
          isSearching={searching}
        />

        {error ? <ErrorMessage message={error} onRetry={() => void runSearch(activeQuery)} /> : null}

        {loading && !weather ? (
          <Loader />
        ) : weather ? (
          <main className="grid gap-6 xl:grid-cols-[minmax(0,1fr)_320px]">
            <div className="space-y-6">
              <CurrentWeather data={weather} unit={unit} />
              <HourlyForecast hours={upcomingHours} unit={unit} timeZone={weather.location.tz_id} />
              <DailyForecast days={weather.forecast.forecastday} unit={unit} />
              <WeatherHighlights data={weather} rainChance={rainChance} />
            </div>

            <div className="space-y-6">
              <RecentSearches items={recentSearches} onSelect={(value) => void runSearch(value)} />

              <aside className="rounded-[2rem] border border-white/30 bg-white/55 p-6 shadow-2xl shadow-slate-900/10 backdrop-blur-2xl dark:border-white/10 dark:bg-slate-900/45">
                <p className="text-xs font-semibold uppercase tracking-[0.3em] text-sky-600 dark:text-sky-300">
                  Status
                </p>
                <div className="mt-4 space-y-4">
                  <div className="rounded-[1.5rem] border border-white/30 bg-white/60 p-4 dark:border-white/10 dark:bg-slate-950/35">
                    <p className="text-sm font-medium text-slate-500 dark:text-slate-400">Live refresh</p>
                    <p className="mt-2 text-2xl font-semibold text-slate-900 dark:text-white">
                      Every 5 minutes
                    </p>
                  </div>
                  <div className="rounded-[1.5rem] border border-white/30 bg-white/60 p-4 dark:border-white/10 dark:bg-slate-950/35">
                    <p className="text-sm font-medium text-slate-500 dark:text-slate-400">Current city</p>
                    <p className="mt-2 text-lg font-semibold text-slate-900 dark:text-white">{activeQuery}</p>
                  </div>
                  <div className="rounded-[1.5rem] border border-white/30 bg-white/60 p-4 dark:border-white/10 dark:bg-slate-950/35">
                    <p className="text-sm font-medium text-slate-500 dark:text-slate-400">Connection state</p>
                    <p className="mt-2 text-lg font-semibold text-slate-900 dark:text-white">
                      {refreshing ? "Refreshing data..." : "Live data connected"}
                    </p>
                  </div>
                </div>
              </aside>
            </div>
          </main>
        ) : null}

        <footer className="rounded-[2rem] border border-white/30 bg-white/45 px-6 py-5 text-sm text-slate-600 shadow-xl shadow-slate-900/5 backdrop-blur-xl dark:border-white/10 dark:bg-slate-900/35 dark:text-slate-300">
          <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
            <p>
              Built with React, Vite, Tailwind CSS, and WeatherAPI live forecast data.
            </p>
            <a
              href="https://www.weatherapi.com/"
              target="_blank"
              rel="noreferrer"
              className="font-semibold text-sky-700 transition hover:text-sky-900 dark:text-sky-300 dark:hover:text-sky-200"
            >
              Powered by WeatherAPI.com
            </a>
          </div>
        </footer>
      </div>
    </div>
  );
}

import type { RecentSearchItem, UnitSystem, WeatherSearchSuggestion } from "../types/weather";
import { formatLocationLabel } from "../utils/weatherFormat";

interface HeaderProps {
  query: string;
  onQueryChange: (value: string) => void;
  onSearch: (value: string) => void;
  onUseLocation: () => void;
  onToggleUnit: () => void;
  onToggleTheme: () => void;
  unit: UnitSystem;
  theme: "light" | "dark";
  suggestions: WeatherSearchSuggestion[];
  recentSearches: RecentSearchItem[];
  isSearching: boolean;
}

export function Header({
  query,
  onQueryChange,
  onSearch,
  onUseLocation,
  onToggleUnit,
  onToggleTheme,
  unit,
  theme,
  suggestions,
  recentSearches,
  isSearching,
}: HeaderProps) {
  return (
    <header className="rounded-[2rem] border border-white/30 bg-white/55 p-5 shadow-2xl shadow-slate-900/10 backdrop-blur-2xl dark:border-white/10 dark:bg-slate-900/45">
      <div className="flex flex-col gap-6 xl:flex-row xl:items-center xl:justify-between">
        <div>
          <p className="text-xs font-semibold uppercase tracking-[0.4em] text-sky-600 dark:text-sky-300">
            Real-time weather
          </p>
          <h1 className="mt-2 text-3xl font-semibold tracking-tight text-slate-900 dark:text-white sm:text-4xl">
            Atmos Weather Dashboard
          </h1>
          <p className="mt-2 max-w-2xl text-sm leading-6 text-slate-600 dark:text-slate-300">
            Search cities worldwide, track current conditions, monitor hourly changes, and stay ahead with a live 7-day forecast.
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-3">
          <button
            type="button"
            onClick={onToggleTheme}
            className="inline-flex items-center gap-2 rounded-full border border-slate-200/80 bg-white/80 px-4 py-2 text-sm font-medium text-slate-700 transition hover:-translate-y-0.5 hover:bg-white dark:border-white/10 dark:bg-slate-800/70 dark:text-slate-200 dark:hover:bg-slate-800"
          >
            <span>{theme === "dark" ? "☀️" : "🌙"}</span>
            {theme === "dark" ? "Light mode" : "Dark mode"}
          </button>
          <button
            type="button"
            onClick={onToggleUnit}
            className="inline-flex items-center gap-2 rounded-full border border-slate-200/80 bg-white/80 px-4 py-2 text-sm font-medium text-slate-700 transition hover:-translate-y-0.5 hover:bg-white dark:border-white/10 dark:bg-slate-800/70 dark:text-slate-200 dark:hover:bg-slate-800"
          >
            <span>🌡️</span>
            Units: {unit === "c" ? "°C" : "°F"}
          </button>
        </div>
      </div>

      <div className="mt-6 grid gap-4 lg:grid-cols-[minmax(0,1.6fr)_minmax(280px,0.9fr)]">
        <div className="relative">
          <div className="flex flex-col gap-3 rounded-[1.75rem] border border-white/40 bg-white/70 p-3 shadow-lg shadow-slate-900/5 backdrop-blur dark:border-white/10 dark:bg-slate-950/40 sm:flex-row sm:items-center">
            <div className="flex-1">
              <label htmlFor="city-search" className="sr-only">
                Search weather by city
              </label>
              <input
                id="city-search"
                value={query}
                onChange={(event) => onQueryChange(event.target.value)}
                onKeyDown={(event) => {
                  if (event.key === "Enter") {
                    event.preventDefault();
                    onSearch(query);
                  }
                }}
                placeholder="Search by city, postcode, or coordinates"
                className="h-12 w-full rounded-2xl border border-transparent bg-transparent px-4 text-sm text-slate-900 outline-none placeholder:text-slate-400 dark:text-white dark:placeholder:text-slate-400"
              />
            </div>
            <div className="flex flex-wrap gap-3">
              <button
                type="button"
                onClick={() => onSearch(query)}
                disabled={isSearching}
                className="inline-flex h-12 items-center justify-center rounded-2xl bg-slate-900 px-5 text-sm font-semibold text-white transition hover:-translate-y-0.5 hover:bg-slate-800 disabled:cursor-not-allowed disabled:opacity-70 dark:bg-sky-500 dark:text-slate-950 dark:hover:bg-sky-400"
              >
                {isSearching ? "Searching..." : "Search"}
              </button>
              <button
                type="button"
                onClick={onUseLocation}
                className="inline-flex h-12 items-center justify-center rounded-2xl border border-slate-200/80 bg-white/80 px-5 text-sm font-semibold text-slate-700 transition hover:-translate-y-0.5 hover:bg-white dark:border-white/10 dark:bg-slate-800/70 dark:text-slate-100 dark:hover:bg-slate-800"
              >
                Use my location
              </button>
            </div>
          </div>

          {(suggestions.length > 0 || recentSearches.length > 0) && query.trim() ? (
            <div className="absolute z-20 mt-3 w-full overflow-hidden rounded-[1.5rem] border border-white/30 bg-white/90 shadow-2xl shadow-slate-900/10 backdrop-blur-xl dark:border-white/10 dark:bg-slate-900/90">
              {suggestions.length > 0 ? (
                <div className="border-b border-slate-200/70 p-3 dark:border-white/10">
                  <p className="px-3 pb-2 text-xs font-semibold uppercase tracking-[0.25em] text-slate-400 dark:text-slate-500">
                    Suggestions
                  </p>
                  <div className="space-y-1">
                    {suggestions.slice(0, 5).map((suggestion) => {
                      const label = formatLocationLabel(
                        suggestion.name,
                        suggestion.region,
                        suggestion.country
                      );

                      return (
                        <button
                          key={`${suggestion.id}-${suggestion.lat}-${suggestion.lon}`}
                          type="button"
                          onClick={() => onSearch(label)}
                          className="flex w-full items-center justify-between rounded-2xl px-3 py-2 text-left text-sm text-slate-700 transition hover:bg-slate-100 dark:text-slate-200 dark:hover:bg-slate-800/80"
                        >
                          <span>{label}</span>
                          <span className="text-xs text-slate-400 dark:text-slate-500">↗</span>
                        </button>
                      );
                    })}
                  </div>
                </div>
              ) : null}

              {recentSearches.length > 0 ? (
                <div className="p-3">
                  <p className="px-3 pb-2 text-xs font-semibold uppercase tracking-[0.25em] text-slate-400 dark:text-slate-500">
                    Recent searches
                  </p>
                  <div className="flex flex-wrap gap-2 px-3 pb-2">
                    {recentSearches.slice(0, 6).map((item) => (
                      <button
                        key={item.id}
                        type="button"
                        onClick={() => onSearch(item.query)}
                        className="rounded-full bg-slate-100 px-3 py-1.5 text-xs font-medium text-slate-600 transition hover:bg-slate-200 dark:bg-slate-800 dark:text-slate-200 dark:hover:bg-slate-700"
                      >
                        {item.label}
                      </button>
                    ))}
                  </div>
                </div>
              ) : null}
            </div>
          ) : null}
        </div>

      </div>
    </header>
  );
}

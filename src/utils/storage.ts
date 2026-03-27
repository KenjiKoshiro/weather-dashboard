import type { RecentSearchItem, UnitSystem } from "../types/weather";

const RECENT_SEARCHES_KEY = "weather-dashboard-recent-searches";
const THEME_KEY = "weather-dashboard-theme";
const UNIT_KEY = "weather-dashboard-unit";

export type AppTheme = "light" | "dark";

export function loadRecentSearches() {
  if (typeof window === "undefined") return [] as RecentSearchItem[];

  try {
    const value = window.localStorage.getItem(RECENT_SEARCHES_KEY);
    return value ? (JSON.parse(value) as RecentSearchItem[]) : [];
  } catch {
    return [] as RecentSearchItem[];
  }
}

export function saveRecentSearches(items: RecentSearchItem[]) {
  if (typeof window === "undefined") return;
  window.localStorage.setItem(RECENT_SEARCHES_KEY, JSON.stringify(items));
}

export function loadTheme(): AppTheme {
  if (typeof window === "undefined") return "light";
  const stored = window.localStorage.getItem(THEME_KEY);
  return stored === "dark" ? "dark" : "light";
}

export function saveTheme(theme: AppTheme) {
  if (typeof window === "undefined") return;
  window.localStorage.setItem(THEME_KEY, theme);
}

export function loadUnit(): UnitSystem {
  if (typeof window === "undefined") return "c";
  const stored = window.localStorage.getItem(UNIT_KEY);
  return stored === "f" ? "f" : "c";
}

export function saveUnit(unit: UnitSystem) {
  if (typeof window === "undefined") return;
  window.localStorage.setItem(UNIT_KEY, unit);
}

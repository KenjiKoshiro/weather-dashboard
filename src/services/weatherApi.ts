import type {
  WeatherApiForecastResponse,
  WeatherSearchSuggestion,
} from "../types/weather";

const API_BASE_URL = "https://api.weatherapi.com/v1";

// API key is read fresh on every call so hot-reload / env changes are picked up.
// Fallback to the hardcoded key so the app works even if .env isn't loaded by Vite.
function ensureApiKey(): string {
  return (
    import.meta.env.VITE_WEATHER_API_KEY ||
    "36ab9a4bd2c0c9b66b706b70930dd7b9"
  );
}

async function request<T>(path: string, params: Record<string, string | number>) {
  ensureApiKey();

  const searchParams = new URLSearchParams({
    key: API_KEY,
    ...Object.fromEntries(
      Object.entries(params).map(([key, value]) => [key, String(value)])
    ),
  });

  const response = await fetch(`${API_BASE_URL}${path}?${searchParams.toString()}`);

  if (!response.ok) {
    let message = "Failed to fetch weather data.";

    try {
      const errorData = await response.json();
      message = errorData?.error?.message ?? message;
    } catch {
      // Ignore JSON parse errors and keep fallback message.
    }

    throw new Error(message);
  }

  return (await response.json()) as T;
}

export async function fetchForecast(query: string) {
  return request<WeatherApiForecastResponse>("/forecast.json", {
    q: query,
    days: 7,
    aqi: "yes",
    alerts: "yes",
  });
}

export async function fetchForecastByCoords(lat: number, lon: number) {
  return fetchForecast(`${lat},${lon}`);
}

export async function fetchSearchSuggestions(query: string) {
  if (!query.trim()) return [] as WeatherSearchSuggestion[];

  return request<WeatherSearchSuggestion[]>("/search.json", {
    q: query.trim(),
  });
}

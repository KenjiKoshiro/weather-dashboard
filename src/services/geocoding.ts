export interface GeoLocation {
  name: string;
  lat: number;
  lon: number;
  country: string;
  state?: string;
  fullLabel: string;
}

const API_KEY = import.meta.env.VITE_WEATHER_API_KEY;
const GEO_BASE_URL = "https://api.openweathermap.org/geo/1.0";

/**
 * Fetch location suggestions from OpenWeatherMap Geocoding API
 */
export async function searchLocations(query: string): Promise<GeoLocation[]> {
  if (!query.trim() || query.length < 2) return [];

  const url = `${GEO_BASE_URL}/direct?q=${encodeURIComponent(query)}&limit=6&appid=${API_KEY}`;

  try {
    const response = await fetch(url);
    if (!response.ok) throw new Error("Search failed");

    const data = await response.json();

    return data.map((item: any) => ({
      name: item.name,
      lat: item.lat,
      lon: item.lon,
      country: item.country,
      state: item.state,
      fullLabel: [item.name, item.state, item.country].filter(Boolean).join(", "),
    }));
  } catch (error) {
    console.error("Geocoding error:", error);
    return [];
  }
}

/**
 * Reverse geocode coordinates using OpenWeatherMap
 */
export async function reverseGeocode(lat: number, lon: number): Promise<GeoLocation | null> {
  const url = `${GEO_BASE_URL}/reverse?lat=${lat}&lon=${lon}&limit=1&appid=${API_KEY}`;

  try {
    const response = await fetch(url);
    if (!response.ok) throw new Error("Reverse geocoding failed");

    const data = await response.json();
    const item = data[0];
    if (!item) return null;

    return {
      name: item.name,
      lat: lat,
      lon: lon,
      country: item.country,
      state: item.state,
      fullLabel: [item.name, item.state, item.country].filter(Boolean).join(", "),
    };
  } catch (error) {
    console.error("Reverse geocoding error:", error);
    return null;
  }
}

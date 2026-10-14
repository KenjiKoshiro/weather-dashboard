export interface GeoLocation {
  name: string;
  lat: number;
  lon: number;
  country: string;
  state?: string;
  fullLabel: string;
}

export async function searchLocations(query: string): Promise<GeoLocation[]> {
  const name = query.trim();
  if (name.length < 2) return [];
  const url = new URL("https://geocoding-api.open-meteo.com/v1/search");
  url.search = new URLSearchParams({ name, count: "6", language: "en", format: "json" }).toString();
  try {
    const response = await fetch(url, { signal: AbortSignal.timeout(10000) });
    if (!response.ok) return [];
    const data = await response.json();
    if (!Array.isArray(data.results)) return [];
    return data.results.flatMap((value: unknown) => {
      if (!value || typeof value !== "object") return [];
      const item = value as Record<string, unknown>;
      if (typeof item.name !== "string" || typeof item.latitude !== "number" || typeof item.longitude !== "number" || !Number.isFinite(item.latitude) || !Number.isFinite(item.longitude) || Math.abs(item.latitude) > 90 || Math.abs(item.longitude) > 180) return [];
      const country = typeof item.country === "string" ? item.country : "";
      const state = typeof item.admin1 === "string" ? item.admin1 : undefined;
      return [{ name: item.name, lat: item.latitude, lon: item.longitude, country, state,
        fullLabel: [item.name, state, country].filter(Boolean).join(", ") }];
    });
  } catch {
    return [];
  }
}

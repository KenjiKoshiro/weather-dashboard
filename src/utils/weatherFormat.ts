import type { UnitSystem, WeatherApiAirQuality } from "../types/weather";

export function formatFullDateTime(
  value: number | string,
  locale = "en-US",
  timeZone?: string
) {
  const date = typeof value === "number" ? new Date(value * 1000) : new Date(value);

  return new Intl.DateTimeFormat(locale, {
    weekday: "long",
    month: "long",
    day: "numeric",
    hour: "numeric",
    minute: "2-digit",
    ...(timeZone ? { timeZone } : {}),
  }).format(date);
}

export function formatHourLabel(
  value: number | string,
  locale = "en-US",
  timeZone?: string
) {
  const date = typeof value === "number" ? new Date(value * 1000) : new Date(value);

  return new Intl.DateTimeFormat(locale, {
    hour: "numeric",
    ...(timeZone ? { timeZone } : {}),
  }).format(date);
}

export function formatDayName(value: string, locale = "en-US") {
  return new Intl.DateTimeFormat(locale, {
    weekday: "short",
  }).format(new Date(`${value}T12:00:00`));
}

export function getTemperature(tempC: number, tempF: number, unit: UnitSystem) {
  return unit === "c" ? Math.round(tempC) : Math.round(tempF);
}

export function getTemperatureUnit(unit: UnitSystem) {
  return unit === "c" ? "°C" : "°F";
}

export function getWindSpeed(kph: number, mph: number, unit: UnitSystem) {
  return unit === "c"
    ? `${Math.round(kph)} km/h`
    : `${Math.round(mph)} mph`;
}

export function getVisibility(km: number, miles: number, unit: UnitSystem) {
  return unit === "c" ? `${km.toFixed(1)} km` : `${miles.toFixed(1)} mi`;
}

export function normalizeIconUrl(icon: string) {
  return icon.startsWith("//") ? `https:${icon}` : icon;
}

export function getAqiLabel(airQuality?: WeatherApiAirQuality) {
  const value = airQuality?.["us-epa-index"];

  switch (value) {
    case 1:
      return "Good";
    case 2:
      return "Moderate";
    case 3:
      return "Unhealthy for sensitive groups";
    case 4:
      return "Unhealthy";
    case 5:
      return "Very unhealthy";
    case 6:
      return "Hazardous";
    default:
      return "Unavailable";
  }
}

export function formatLocationLabel(name: string, region: string, country: string) {
  return [name, region, country].filter(Boolean).join(", ");
}

export function getWeatherTheme(conditionText: string, isDay: boolean) {
  const text = conditionText.toLowerCase();

  if (!isDay) {
    return {
      app: "from-slate-950 via-slate-900 to-indigo-950",
      panel: "bg-slate-900/60 border-white/10",
      accent: "from-indigo-400/25 to-sky-400/10",
      orbA: "bg-indigo-500/30",
      orbB: "bg-sky-500/20",
    };
  }

  if (text.includes("rain") || text.includes("drizzle") || text.includes("shower")) {
    return {
      app: "from-slate-900 via-sky-950 to-cyan-950",
      panel: "bg-slate-900/55 border-white/10",
      accent: "from-cyan-400/20 to-blue-500/10",
      orbA: "bg-cyan-500/25",
      orbB: "bg-blue-500/20",
    };
  }

  if (text.includes("snow") || text.includes("ice") || text.includes("sleet") || text.includes("blizzard")) {
    return {
      app: "from-slate-200 via-sky-100 to-white",
      panel: "bg-white/65 border-slate-200/70",
      accent: "from-white to-sky-100",
      orbA: "bg-sky-200/60",
      orbB: "bg-cyan-100/70",
    };
  }

  if (text.includes("thunder")) {
    return {
      app: "from-slate-950 via-violet-950 to-slate-900",
      panel: "bg-slate-900/60 border-white/10",
      accent: "from-violet-400/20 to-fuchsia-500/10",
      orbA: "bg-violet-500/25",
      orbB: "bg-fuchsia-500/20",
    };
  }

  if (text.includes("cloud") || text.includes("mist") || text.includes("fog") || text.includes("overcast")) {
    return {
      app: "from-slate-800 via-slate-700 to-blue-900",
      panel: "bg-slate-900/45 border-white/10",
      accent: "from-slate-200/20 to-blue-200/10",
      orbA: "bg-slate-300/20",
      orbB: "bg-sky-300/15",
    };
  }

  return {
    app: "from-sky-200 via-cyan-100 to-blue-50",
    panel: "bg-white/65 border-white/60",
    accent: "from-yellow-100 to-sky-100",
    orbA: "bg-amber-300/40",
    orbB: "bg-sky-300/35",
  };
}

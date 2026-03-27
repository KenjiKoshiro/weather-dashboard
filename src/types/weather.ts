export type UnitSystem = "c" | "f";

export interface WeatherApiCondition {
  text: string;
  icon: string;
  code: number;
}

export interface WeatherApiAirQuality {
  co?: number;
  no2?: number;
  o3?: number;
  so2?: number;
  pm2_5?: number;
  pm10?: number;
  "us-epa-index"?: number;
  "gb-defra-index"?: number;
}

export interface WeatherApiCurrent {
  temp_c: number;
  temp_f: number;
  feelslike_c: number;
  feelslike_f: number;
  humidity: number;
  wind_kph: number;
  wind_mph: number;
  pressure_mb: number;
  vis_km: number;
  vis_miles: number;
  uv: number;
  cloud: number;
  is_day: 0 | 1;
  precip_mm: number;
  condition: WeatherApiCondition;
  air_quality?: WeatherApiAirQuality;
}

export interface WeatherApiHour {
  time_epoch: number;
  time: string;
  temp_c: number;
  temp_f: number;
  feelslike_c: number;
  feelslike_f: number;
  chance_of_rain?: number;
  chance_of_snow?: number;
  will_it_rain: 0 | 1;
  will_it_snow: 0 | 1;
  humidity: number;
  cloud: number;
  uv: number;
  is_day: 0 | 1;
  wind_kph: number;
  wind_mph: number;
  vis_km: number;
  vis_miles: number;
  condition: WeatherApiCondition;
}

export interface WeatherApiForecastDay {
  date: string;
  date_epoch: number;
  day: {
    maxtemp_c: number;
    maxtemp_f: number;
    mintemp_c: number;
    mintemp_f: number;
    avghumidity: number;
    daily_chance_of_rain?: number;
    uv: number;
    condition: WeatherApiCondition;
  };
  astro: {
    sunrise: string;
    sunset: string;
  };
  hour: WeatherApiHour[];
}

export interface WeatherApiLocation {
  name: string;
  region: string;
  country: string;
  lat: number;
  lon: number;
  tz_id: string;
  localtime_epoch: number;
  localtime: string;
}

export interface WeatherApiForecastResponse {
  location: WeatherApiLocation;
  current: WeatherApiCurrent;
  forecast: {
    forecastday: WeatherApiForecastDay[];
  };
}

export interface WeatherSearchSuggestion {
  id: number;
  name: string;
  region: string;
  country: string;
  lat: number;
  lon: number;
  url: string;
}

export interface RecentSearchItem {
  id: string;
  query: string;
  label: string;
  searchedAt: number;
}

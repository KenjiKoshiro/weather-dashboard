export type UnitSystem = "c" | "f";

export interface WeatherCondition {
  text: string;
  code: number;
}

export interface AirQuality {
  pm2_5: number;
  pm10: number;
  o3: number;
  no2: number;
  so2: number;
  us_epa_index: number;
}

export interface CurrentWeather {
  temperature: number;
  feelsLike: number;
  humidity: number;
  windSpeed: number;
  windGusts: number;
  pressure: number;
  visibility: number;
  uvIndex: number;
  cloudCover: number;
  isDay: boolean;
  precipitation: number;
  rain: number;
  showers: number;
  snowfall: number;
  dewPoint: number;
  condition: WeatherCondition;
  airQuality?: AirQuality;
}

export interface HourlyForecast {
  time: number; // Unix timestamp
  temperature: number;
  feelsLike: number;
  precipitationProbability: number;
  condition: WeatherCondition;
  humidity: number;
  windSpeed: number;
  uvIndex: number;
  isDay: boolean;
}

export interface DailyForecast {
  date: string;
  maxTemp: number;
  minTemp: number;
  precipitationProbability: number;
  precipitationSum: number;
  uvIndex: number;
  sunrise: string;
  sunset: string;
  moonPhase: number; // 0-1
  condition: WeatherCondition;
}

export interface WeatherApiResponse {
  location: {
    name: string;
    country: string;
    lat: number;
    lon: number;
    timezone: string;
  };
  current: CurrentWeather;
  hourly: HourlyForecast[];
  daily: DailyForecast[];
}

export interface RecentSearchItem {
  id: string; // "lat,lon"
  name: string;
  country: string;
  searchedAt: number;
}

export type AppTheme = "light" | "dark";

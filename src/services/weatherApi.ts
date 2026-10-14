import type { WeatherApiResponse, AirQuality } from "../types/weather";
import { mapWmoCodeToText } from "../utils/wmoMapping";

type Values = Record<string, unknown>;
function object(value: unknown): Values {
  if (!value || typeof value !== "object" || Array.isArray(value)) throw new Error("Weather provider returned incomplete data.");
  return value as Values;
}
function number(value: unknown): number {
  if (typeof value !== "number" || !Number.isFinite(value)) throw new Error("Weather provider returned incomplete data.");
  return value;
}
function optionalNumber(value: unknown): number | null {
  return typeof value === "number" && Number.isFinite(value) ? value : null;
}
function series(value: unknown): unknown[] {
  if (!Array.isArray(value) || !value.length) throw new Error("Weather provider returned incomplete data.");
  return value;
}
async function request(url: URL): Promise<Values> {
  const response = await fetch(url, { signal: AbortSignal.timeout(15000) });
  if (!response.ok) throw new Error(response.status === 429 ? "Weather service is busy. Please try again shortly." : "Weather service is temporarily unavailable.");
  const data = object(await response.json());
  if (data.error) throw new Error("Weather service could not complete this request.");
  return data;
}

export async function fetchZenithWeather(lat: number, lon: number, locationName: string, countryName: string): Promise<WeatherApiResponse> {
  if (!Number.isFinite(lat) || !Number.isFinite(lon) || Math.abs(lat) > 90 || Math.abs(lon) > 180) throw new Error("Please choose a valid location.");
  const url = new URL("https://api.open-meteo.com/v1/forecast");
  url.search = new URLSearchParams({
    latitude: String(lat), longitude: String(lon), timezone: "auto", timeformat: "unixtime", forecast_days: "5",
    temperature_unit: "celsius", wind_speed_unit: "kmh", precipitation_unit: "mm",
    current: "temperature_2m,relative_humidity_2m,apparent_temperature,is_day,precipitation,rain,showers,snowfall,weather_code,cloud_cover,pressure_msl,wind_speed_10m,wind_gusts_10m,dew_point_2m,visibility,uv_index",
    hourly: "temperature_2m,apparent_temperature,relative_humidity_2m,precipitation_probability,weather_code,wind_speed_10m,uv_index,is_day",
    daily: "weather_code,temperature_2m_max,temperature_2m_min,precipitation_probability_max,precipitation_sum,uv_index_max",
  }).toString();
  const airUrl = new URL("https://air-quality-api.open-meteo.com/v1/air-quality");
  airUrl.search = new URLSearchParams({ latitude: String(lat), longitude: String(lon), current: "us_aqi,pm2_5,pm10,ozone,nitrogen_dioxide,sulphur_dioxide", timeformat: "unixtime" }).toString();
  // Air quality is optional: its outage must not hide a valid weather forecast.
  const [data, air] = await Promise.all([request(url), request(airUrl).catch(() => null)]);
  const current = object(data.current);
  const hourly = object(data.hourly);
  const daily = object(data.daily);
  const time = number(current.time);
  const timezone = typeof data.timezone === "string" ? data.timezone : "UTC";
  const offset = number(data.utc_offset_seconds);
  const hourTimes = series(hourly.time);
  const dayTimes = series(daily.time);
  const hour = (key: string, index: number) => number(series(hourly[key])[index]);
  const day = (key: string, index: number) => number(series(daily[key])[index]);
  const condition = (code: number) => ({ code, text: mapWmoCodeToText(code) });
  let airQuality: AirQuality | undefined;
  if (air?.current && typeof air.current === "object" && !Array.isArray(air.current)) {
    const values = object(air.current);
    const aqi = optionalNumber(values.us_aqi);
    if (aqi !== null && aqi >= 0) airQuality = {
      us_aqi: aqi, pm2_5: optionalNumber(values.pm2_5), pm10: optionalNumber(values.pm10),
      o3: optionalNumber(values.ozone), no2: optionalNumber(values.nitrogen_dioxide), so2: optionalNumber(values.sulphur_dioxide),
    };
  }
  const hours = hourTimes.map((value, index) => ({ time: number(value), index }))
    .filter((entry) => entry.time >= Math.floor(time / 3600) * 3600).slice(0, 24)
    .map(({ time, index }) => ({
      time, temperature: hour("temperature_2m", index), feelsLike: hour("apparent_temperature", index),
      humidity: hour("relative_humidity_2m", index), precipitationProbability: hour("precipitation_probability", index),
      condition: condition(hour("weather_code", index)), windSpeed: hour("wind_speed_10m", index),
      uvIndex: optionalNumber(series(hourly.uv_index)[index]), isDay: hour("is_day", index) === 1,
    }));
  if (!hours.length) throw new Error("No upcoming forecast is available. Please try again.");
  return {
    location: { name: locationName, country: countryName, lat, lon, timezone },
    current: {
      temperature: number(current.temperature_2m), feelsLike: number(current.apparent_temperature),
      humidity: number(current.relative_humidity_2m), windSpeed: number(current.wind_speed_10m),
      windGusts: number(current.wind_gusts_10m), pressure: number(current.pressure_msl),
      visibility: number(current.visibility) / 1000, uvIndex: optionalNumber(current.uv_index),
      cloudCover: number(current.cloud_cover), isDay: number(current.is_day) === 1,
      precipitation: number(current.precipitation), precipitationIntervalMinutes: number(current.interval) / 60,
      rain: number(current.rain), showers: number(current.showers), snowfall: number(current.snowfall),
      dewPoint: number(current.dew_point_2m), condition: condition(number(current.weather_code)), airQuality,
    },
    hourly: hours,
    daily: dayTimes.slice(0, 5).map((value, index) => ({
      // The API's daily boundaries use its fixed UTC offset, even across DST changes.
      date: new Date((number(value) + offset) * 1000).toISOString().slice(0, 10),
      maxTemp: day("temperature_2m_max", index), minTemp: day("temperature_2m_min", index),
      precipitationProbability: day("precipitation_probability_max", index), precipitationSum: day("precipitation_sum", index),
      uvIndex: optionalNumber(series(daily.uv_index_max)[index]), condition: condition(day("weather_code", index)),
    })),
  };
}

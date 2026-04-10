/**
 * Maps OpenWeatherMap condition codes to human-readable strings.
 * Reference: https://openweathermap.org/weather-conditions
 */
export function mapOwmCodeToText(code: number): string {
  if (code >= 200 && code < 300) return "Thunderstorm";
  if (code >= 300 && code < 400) return "Drizzle";
  if (code >= 500 && code < 600) return "Rain";
  if (code >= 600 && code < 700) return "Snow";
  if (code === 701) return "Mist";
  if (code === 711) return "Smoke";
  if (code === 721) return "Haze";
  if (code === 731) return "Dust";
  if (code === 741) return "Fog";
  if (code === 751) return "Sand";
  if (code === 761) return "Dust";
  if (code === 762) return "Ash";
  if (code === 771) return "Squall";
  if (code === 781) return "Tornado";
  if (code === 800) return "Clear sky";
  if (code === 801) return "Few clouds";
  if (code === 802) return "Scattered clouds";
  if (code === 803) return "Broken clouds";
  if (code === 804) return "Overcast clouds";
  
  return "Unknown";
}

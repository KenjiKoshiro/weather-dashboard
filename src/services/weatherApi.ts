import { WeatherApiResponse } from "../types/weather";
import { mapOwmCodeToText } from "../utils/owmMapping";

const API_KEY = import.meta.env.VITE_WEATHER_API_KEY;
const OWM_BASE_URL = "https://api.openweathermap.org/data/2.5";

/**
 * Main function to fetch all weather data from OpenWeatherMap
 */
export async function fetchZenithWeather(
  lat: number,
  lon: number,
  locationName: string,
  countryName: string
): Promise<WeatherApiResponse> {
  const currentUrl = `${OWM_BASE_URL}/weather?lat=${lat}&lon=${lon}&appid=${API_KEY}&units=metric`;
  const forecastUrl = `${OWM_BASE_URL}/forecast?lat=${lat}&lon=${lon}&appid=${API_KEY}&units=metric`;
  const pollutionUrl = `${OWM_BASE_URL}/air_pollution?lat=${lat}&lon=${lon}&appid=${API_KEY}`;

  try {
    const [currentRes, forecastRes, pollutionRes] = await Promise.all([
      fetch(currentUrl).then((r) => r.json()),
      fetch(forecastUrl).then((r) => r.json()),
      fetch(pollutionUrl).then((r) => r.json()),
    ]);

    if (currentRes.cod !== 200) throw new Error(currentRes.message || "Failed to fetch current weather");
    if (forecastRes.cod !== "200") throw new Error(forecastRes.message || "Failed to fetch forecast");

    // Map Current Weather
    const current = {
      temperature: currentRes.main.temp,
      feelsLike: currentRes.main.feels_like,
      humidity: currentRes.main.humidity,
      windSpeed: currentRes.wind.speed * 3.6, // Convert m/s to km/h
      windGusts: (currentRes.wind.gust || currentRes.wind.speed) * 3.6,
      pressure: currentRes.main.pressure,
      visibility: currentRes.visibility / 1000,
      uvIndex: 0, // Not available in Free Tier 2.5
      cloudCover: currentRes.clouds.all,
      isDay: currentRes.dt > currentRes.sys.sunrise && currentRes.dt < currentRes.sys.sunset,
      precipitation: (currentRes.rain?.["1h"] || currentRes.snow?.["1h"] || 0),
      rain: currentRes.rain?.["1h"] || 0,
      showers: 0,
      snowfall: currentRes.snow?.["1h"] || 0,
      dewPoint: currentRes.main.temp - ((100 - currentRes.main.humidity) / 5), // Approximation
      condition: {
        text: currentRes.weather[0].description.charAt(0).toUpperCase() + currentRes.weather[0].description.slice(1),
        code: currentRes.weather[0].id,
      },
      airQuality: {
        pm2_5: pollutionRes.list[0].components.pm2_5,
        pm10: pollutionRes.list[0].components.pm10,
        o3: pollutionRes.list[0].components.o3,
        no2: pollutionRes.list[0].components.no2,
        so2: pollutionRes.list[0].components.so2,
        us_epa_index: pollutionRes.list[0].main.aqi,
      },
    };

    // Map Hourly Forecast (3-hour slots)
    const hourly = forecastRes.list.slice(0, 12).map((item: any) => ({
      time: item.dt,
      temperature: item.main.temp,
      feelsLike: item.main.feels_like,
      precipitationProbability: Math.round(item.pop * 100),
      condition: {
        text: item.weather[0].main,
        code: item.weather[0].id,
      },
      humidity: item.main.humidity,
      windSpeed: item.wind.speed * 3.6,
      uvIndex: 0,
      isDay: true, // Simplified
    }));

    // Map Daily Forecast (Group 3-hour blocks by day)
    const dailyMap: Record<string, any> = {};
    forecastRes.list.forEach((item: any) => {
      const dateStr = item.dt_txt.split(" ")[0];
      if (!dailyMap[dateStr]) {
        dailyMap[dateStr] = {
          temps: [],
          pops: [],
          rain: 0,
          conditions: [],
          dt: item.dt,
        };
      }
      dailyMap[dateStr].temps.push(item.main.temp);
      dailyMap[dateStr].pops.push(item.pop);
      dailyMap[dateStr].rain += (item.rain?.["3h"] || 0);
      dailyMap[dateStr].conditions.push(item.weather[0].id);
    });

    const daily = Object.keys(dailyMap).slice(0, 5).map((date) => {
      const day = dailyMap[date];
      const mostFrequentCondition = day.conditions.sort((a: any, b: any) =>
        day.conditions.filter((v: any) => v === a).length - day.conditions.filter((v: any) => v === b).length
      ).pop();

      return {
        date: date,
        maxTemp: Math.max(...day.temps),
        minTemp: Math.min(...day.temps),
        precipitationProbability: Math.round(Math.max(...day.pops) * 100),
        precipitationSum: day.rain,
        uvIndex: 0,
        sunrise: new Date(currentRes.sys.sunrise * 1000).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', hour12: false }),
        sunset: new Date(currentRes.sys.sunset * 1000).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', hour12: false }),
        moonPhase: 0, // Not available
        condition: {
          text: mapOwmCodeToText(mostFrequentCondition),
          code: mostFrequentCondition,
        },
      };
    });

    return {
      location: {
        name: locationName,
        country: countryName,
        lat,
        lon,
        timezone: "UTC",
      },
      current,
      hourly,
      daily,
    };
  } catch (error) {
    console.error("Weather fetch error:", error);
    throw new Error("Failed to load weather data.");
  }
}
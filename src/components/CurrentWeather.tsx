import { Wind, Droplets, Eye, Umbrella, MapPin } from "lucide-react";
import type { CurrentWeather as CurrentWeatherType, UnitSystem } from "../types/weather";
import { WeatherIcon } from "./WeatherIcon";
import { getTemperature, getTemperatureUnit } from "../utils/weatherFormat";

interface CurrentWeatherProps {
  data: CurrentWeatherType;
  location: { name: string; country: string };
  unit: UnitSystem;
}
export function CurrentWeather({ data, location, unit }: CurrentWeatherProps) {
  const temp = (value: number) => getTemperature(value, value * 9 / 5 + 32, unit);
  return (
    <section className="current-weather" aria-label="Current weather">
      <div className="current-topline"><span className="eyebrow">CURRENT CONDITIONS</span><span className="weather-badge">{data.isDay ? "Daytime" : "Nighttime"}</span></div>
      <div className="current-location"><h3>{location.name}</h3><p><MapPin size={14} aria-hidden="true" />{location.country}</p></div>
      <div className="current-reading">
        <div><div className="temperature">{temp(data.temperature)}<span>{getTemperatureUnit(unit)}</span></div>
          <p className="condition-text">{data.condition.text}</p><p className="feels-like">Feels like {temp(data.feelsLike)}{getTemperatureUnit(unit)}</p>
        </div>
        <div className="weather-art" aria-hidden="true"><div className="weather-orbit" /><WeatherIcon code={data.condition.code} isDay={data.isDay} size={124} /></div>
      </div>
      <dl className="current-details">
        <div><dt><Wind size={16} />Wind</dt><dd>{data.windSpeed.toFixed(1)} <span>km/h</span></dd></div>
        <div><dt><Droplets size={16} />Humidity</dt><dd>{data.humidity}<span>%</span></dd></div>
        <div><dt><Eye size={16} />Visibility</dt><dd>{data.visibility.toFixed(1)} <span>km</span></dd></div>
        <div><dt><Umbrella size={16} />Precipitation</dt><dd>{data.precipitation.toFixed(1)} <span>mm</span></dd></div>
      </dl>
    </section>
  );
}

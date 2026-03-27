import type { UnitSystem, WeatherApiForecastResponse } from "../types/weather";
import {
  formatFullDateTime,
  formatLocationLabel,
  getTemperature,
  getTemperatureUnit,
  getVisibility,
  getWindSpeed,
} from "../utils/weatherFormat";
import { WeatherIcon } from "./WeatherIcon";

interface CurrentWeatherProps {
  data: WeatherApiForecastResponse;
  unit: UnitSystem;
}

export function CurrentWeather({ data, unit }: CurrentWeatherProps) {
  const { location, current } = data;
  const locationLabel = formatLocationLabel(location.name, location.region, location.country);
  const temperature = getTemperature(current.temp_c, current.temp_f, unit);
  const feelsLike = getTemperature(current.feelslike_c, current.feelslike_f, unit);
  const tempUnit = getTemperatureUnit(unit);

  return (
    <section className="relative overflow-hidden rounded-[2rem] border border-white/30 bg-white/55 p-6 shadow-2xl shadow-slate-900/10 backdrop-blur-2xl dark:border-white/10 dark:bg-slate-900/45 lg:p-8">
      <div className="absolute right-0 top-0 h-48 w-48 rounded-full bg-sky-300/20 blur-3xl dark:bg-sky-500/10" />
      <div className="relative grid gap-8 xl:grid-cols-[minmax(0,1.25fr)_minmax(320px,0.95fr)]">
        <div>
          <p className="text-xs font-semibold uppercase tracking-[0.3em] text-sky-600 dark:text-sky-300">
            Current conditions
          </p>
          <div className="mt-4 flex flex-wrap items-start justify-between gap-5">
            <div>
              <h2 className="text-3xl font-semibold tracking-tight text-slate-900 dark:text-white sm:text-4xl">
                {locationLabel}
              </h2>
              <p className="mt-2 text-sm text-slate-600 dark:text-slate-300">
                {formatFullDateTime(location.localtime_epoch, "en-US", location.tz_id)}
              </p>
              <p className="mt-4 max-w-xl text-base text-slate-700 dark:text-slate-200">
                {current.condition.text} with steady live updates for temperature, wind, visibility, and atmospheric conditions.
              </p>
            </div>

            <div className="rounded-[1.75rem] border border-white/30 bg-white/60 p-5 text-center shadow-lg shadow-slate-900/5 dark:border-white/10 dark:bg-slate-950/40">
              <WeatherIcon icon={current.condition.icon} alt={current.condition.text} size={96} className="mx-auto h-24 w-24" />
              <div className="mt-2 text-5xl font-semibold tracking-tight text-slate-900 dark:text-white">
                {temperature}
                <span className="text-2xl text-slate-400 dark:text-slate-500">{tempUnit}</span>
              </div>
              <p className="mt-2 text-sm font-medium text-slate-500 dark:text-slate-400">
                Feels like {feelsLike}
                {tempUnit}
              </p>
            </div>
          </div>
        </div>

        <div className="grid gap-4 sm:grid-cols-2">
          {[
            { label: "Humidity", value: `${current.humidity}%` },
            { label: "Wind", value: getWindSpeed(current.wind_kph, current.wind_mph, unit) },
            { label: "Pressure", value: `${Math.round(current.pressure_mb)} mb` },
            { label: "Visibility", value: getVisibility(current.vis_km, current.vis_miles, unit) },
            { label: "UV Index", value: `${current.uv}` },
            { label: "Cloud Cover", value: `${current.cloud}%` },
          ].map((item) => (
            <div
              key={item.label}
              className="rounded-[1.5rem] border border-white/30 bg-white/60 p-5 shadow-lg shadow-slate-900/5 backdrop-blur dark:border-white/10 dark:bg-slate-950/35"
            >
              <p className="text-xs font-semibold uppercase tracking-[0.25em] text-slate-400 dark:text-slate-500">
                {item.label}
              </p>
              <p className="mt-3 text-2xl font-semibold text-slate-900 dark:text-white">{item.value}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

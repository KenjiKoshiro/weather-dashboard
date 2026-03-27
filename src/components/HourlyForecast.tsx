import type { UnitSystem, WeatherApiHour } from "../types/weather";
import { formatHourLabel, getTemperature, getTemperatureUnit } from "../utils/weatherFormat";
import { SectionHeading } from "./SectionHeading";
import { WeatherIcon } from "./WeatherIcon";

interface HourlyForecastProps {
  hours: WeatherApiHour[];
  unit: UnitSystem;
  timeZone: string;
}

export function HourlyForecast({ hours, unit, timeZone }: HourlyForecastProps) {
  const tempUnit = getTemperatureUnit(unit);

  return (
    <section className="rounded-[2rem] border border-white/30 bg-white/55 p-6 shadow-2xl shadow-slate-900/10 backdrop-blur-2xl dark:border-white/10 dark:bg-slate-900/45">
      <SectionHeading
        eyebrow="Next hours"
        title="Hourly forecast"
        subtitle="The next 12 forecast points so you can monitor temperature swings and rain chances in real time."
      />

      <div className="mt-6 grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        {hours.map((hour) => (
          <article
            key={hour.time_epoch}
            className="rounded-[1.5rem] border border-white/30 bg-white/60 p-4 shadow-lg shadow-slate-900/5 transition hover:-translate-y-1 hover:shadow-xl dark:border-white/10 dark:bg-slate-950/35"
          >
            <div className="flex items-center justify-between gap-3">
              <p className="text-sm font-semibold text-slate-900 dark:text-white">
                {formatHourLabel(hour.time_epoch, "en-US", timeZone)}
              </p>
              <WeatherIcon icon={hour.condition.icon} alt={hour.condition.text} size={42} className="h-10 w-10" />
            </div>
            <p className="mt-4 text-3xl font-semibold tracking-tight text-slate-900 dark:text-white">
              {getTemperature(hour.temp_c, hour.temp_f, unit)}
              <span className="text-base text-slate-400 dark:text-slate-500">{tempUnit}</span>
            </p>
            <p className="mt-2 text-sm text-slate-600 dark:text-slate-300">{hour.condition.text}</p>
            <div className="mt-4 flex items-center justify-between text-xs text-slate-500 dark:text-slate-400">
              <span>Rain {hour.chance_of_rain ?? 0}%</span>
              <span>Clouds {hour.cloud}%</span>
            </div>
          </article>
        ))}
      </div>
    </section>
  );
}

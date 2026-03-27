import type { UnitSystem, WeatherApiForecastDay } from "../types/weather";
import { formatDayName, getTemperature, getTemperatureUnit } from "../utils/weatherFormat";
import { SectionHeading } from "./SectionHeading";
import { WeatherIcon } from "./WeatherIcon";

interface DailyForecastProps {
  days: WeatherApiForecastDay[];
  unit: UnitSystem;
}

export function DailyForecast({ days, unit }: DailyForecastProps) {
  const tempUnit = getTemperatureUnit(unit);

  return (
    <section className="rounded-[2rem] border border-white/30 bg-white/55 p-6 shadow-2xl shadow-slate-900/10 backdrop-blur-2xl dark:border-white/10 dark:bg-slate-900/45">
      <SectionHeading
        eyebrow="7-day trend"
        title="Daily forecast"
        subtitle="A weekly view with min and max temperatures, conditions, and rain probability."
      />

      <div className="mt-6 space-y-3">
        {days.map((day) => (
          <article
            key={day.date}
            className="grid items-center gap-4 rounded-[1.5rem] border border-white/30 bg-white/60 p-4 shadow-lg shadow-slate-900/5 transition hover:-translate-y-0.5 dark:border-white/10 dark:bg-slate-950/35 sm:grid-cols-[110px_minmax(0,1fr)_auto_auto]"
          >
            <div>
              <p className="text-base font-semibold text-slate-900 dark:text-white">{formatDayName(day.date)}</p>
              <p className="text-sm text-slate-500 dark:text-slate-400">{day.date}</p>
            </div>
            <div className="flex items-center gap-3">
              <WeatherIcon icon={day.day.condition.icon} alt={day.day.condition.text} size={48} className="h-12 w-12" />
              <p className="text-sm text-slate-700 dark:text-slate-200">{day.day.condition.text}</p>
            </div>
            <p className="text-sm text-slate-500 dark:text-slate-400">
              Rain {day.day.daily_chance_of_rain ?? 0}%
            </p>
            <p className="text-base font-semibold text-slate-900 dark:text-white">
              {getTemperature(day.day.mintemp_c, day.day.mintemp_f, unit)}{tempUnit} / {" "}
              {getTemperature(day.day.maxtemp_c, day.day.maxtemp_f, unit)}{tempUnit}
            </p>
          </article>
        ))}
      </div>
    </section>
  );
}

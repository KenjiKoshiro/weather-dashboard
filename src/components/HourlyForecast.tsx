import type { HourlyForecast as HourlyType, UnitSystem } from "../types/weather";
import { WeatherIcon } from "./WeatherIcon";
import { getTemperature, formatHourLabel } from "../utils/weatherFormat";

export function HourlyForecast({ hours, unit, timezone }: { hours: HourlyType[]; unit: UnitSystem; timezone: string }) {
  return (
    <section className="panel hourly-panel" aria-labelledby="hourly-title">
      <div className="section-title"><h3 id="hourly-title">Hourly outlook</h3><span>Hourly · {timezone.replace(/_/g, " ")}</span></div>
      <div className="hourly-scroll" tabIndex={0} role="region" aria-label="Scroll for upcoming forecast times">
        {hours.map((hour) => (
          <div className="hour-slot" key={hour.time}>
            <time dateTime={new Date(hour.time * 1000).toISOString()}>{formatHourLabel(hour.time, "en-US", timezone)}</time>
            <span className="sr-only">{hour.condition.text}</span>
            <WeatherIcon code={hour.condition.code} isDay={hour.isDay} size={30} />
            <strong>{getTemperature(hour.temperature, hour.temperature * 9 / 5 + 32, unit)}°{unit.toUpperCase()}</strong>
            <span className="rain-chance" aria-label={`${hour.precipitationProbability}% chance of precipitation`}>{hour.precipitationProbability}% rain</span>
          </div>
        ))}
      </div>
    </section>
  );
}

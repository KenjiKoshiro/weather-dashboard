import type { DailyForecast as DailyType, UnitSystem } from "../types/weather";
import { WeatherIcon } from "./WeatherIcon";
import { formatDayName, getTemperature } from "../utils/weatherFormat";

export function DailyForecast({ days, unit }: { days: DailyType[]; unit: UnitSystem }) {
  const temp = (value: number) => getTemperature(value, value * 9 / 5 + 32, unit);
  return (
    <section className="panel daily-panel" aria-labelledby="daily-title">
      <div className="section-title"><h3 id="daily-title">The next five days</h3></div>
      <p className="section-caption">A look at what’s ahead</p>
      <div className="daily-column-labels"><span>Forecast</span><span>High / Low · °{unit.toUpperCase()}</span></div>
      {days.map((day) => (
        <div className="daily-row" key={day.date}>
          <div><strong>{formatDayName(day.date)}</strong><time dateTime={day.date}>{new Date(`${day.date}T12:00:00`).toLocaleDateString("en-US", { month: "short", day: "numeric" })}</time></div>
          <div className="daily-condition"><WeatherIcon code={day.condition.code} size={28} /><span className="sr-only">{day.condition.text}</span><span aria-label={`${day.precipitationProbability}% chance of precipitation`}>{day.precipitationProbability}%</span></div>
          <div className="daily-temps"><strong>{temp(day.maxTemp)}°</strong><span>{temp(day.minTemp)}°</span></div>
        </div>
      ))}
      <p className="forecast-legend">Percentages show the chance of precipitation.</p>
    </section>
  );
}

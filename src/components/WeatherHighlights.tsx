import type { WeatherApiForecastResponse } from "../types/weather";
import { getAqiLabel } from "../utils/weatherFormat";
import { SectionHeading } from "./SectionHeading";

interface WeatherHighlightsProps {
  data: WeatherApiForecastResponse;
  rainChance: number;
}

export function WeatherHighlights({ data, rainChance }: WeatherHighlightsProps) {
  const today = data.forecast.forecastday[0];
  const airQuality = getAqiLabel(data.current.air_quality);

  const items = [
    { label: "Sunrise", value: today?.astro.sunrise ?? "--" },
    { label: "Sunset", value: today?.astro.sunset ?? "--" },
    { label: "UV Index", value: `${data.current.uv}` },
    { label: "Air quality", value: airQuality },
    { label: "Cloud percentage", value: `${data.current.cloud}%` },
    { label: "Rain chance", value: `${rainChance}%` },
  ];

  return (
    <section className="rounded-[2rem] border border-white/30 bg-white/55 p-6 shadow-2xl shadow-slate-900/10 backdrop-blur-2xl dark:border-white/10 dark:bg-slate-900/45">
      <SectionHeading
        eyebrow="Highlights"
        title="Weather insights"
        subtitle="Key atmospheric metrics designed to surface the most useful details at a glance."
      />

      <div className="mt-6 grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
        {items.map((item) => (
          <article
            key={item.label}
            className="rounded-[1.5rem] border border-white/30 bg-white/60 p-5 shadow-lg shadow-slate-900/5 transition hover:-translate-y-1 hover:shadow-xl dark:border-white/10 dark:bg-slate-950/35"
          >
            <p className="text-xs font-semibold uppercase tracking-[0.25em] text-slate-400 dark:text-slate-500">
              {item.label}
            </p>
            <p className="mt-3 text-2xl font-semibold text-slate-900 dark:text-white">{item.value}</p>
          </article>
        ))}
      </div>
    </section>
  );
}

import { Activity, CloudRain, Wind, Gauge, Sun, Droplets, Eye } from "lucide-react";
import type { CurrentWeather, UnitSystem } from "../types/weather";
import { getTemperature, getTemperatureUnit, getAqiLabel } from "../utils/weatherFormat";

export function WeatherHighlights({ data, unit }: { data: CurrentWeather; unit: UnitSystem }) {
  const aqi = data.airQuality;
  const airLabel = getAqiLabel(aqi);
  const metrics = [
    { icon: Wind, label: "Wind gusts", value: data.windGusts.toFixed(1), unit: "km/h", note: "Peak wind speed" },
    { icon: Gauge, label: "Pressure", value: Math.round(data.pressure), unit: "hPa", note: "Atmospheric pressure" },
    { icon: Droplets, label: "Dew point", value: getTemperature(data.dewPoint, data.dewPoint * 9 / 5 + 32, unit), unit: getTemperatureUnit(unit), note: "Estimated condensation point" },
    { icon: CloudRain, label: "Precipitation", value: data.precipitation.toFixed(1), unit: "mm", note: "Over the past hour" },
    { icon: Sun, label: "UV index", value: data.uvIndex > 0 ? data.uvIndex.toFixed(1) : "—", unit: "", note: data.uvIndex > 0 ? "Reported UV index" : "Not provided by this data source" },
    { icon: Eye, label: "Visibility", value: data.visibility.toFixed(1), unit: "km", note: "Horizontal viewing distance" },
  ];
  return (
    <section aria-labelledby="details-title">
      <div className="section-title details-heading"><h3 id="details-title">Today’s details</h3><span>Beyond the temperature</span></div>
      <div className="highlights-grid">
        <div className="panel air-quality">
          <div className="metric-label"><Activity size={18} aria-hidden="true" /><span>Air quality</span></div>
          <div className="air-summary"><strong>{airLabel}</strong><span>OpenWeather scale {aqi ? `${aqi.us_epa_index}/5` : "unavailable"}</span></div>
          <dl className="air-components"><div><dt>PM2.5</dt><dd>{aqi?.pm2_5 ?? "—"}</dd></div><div><dt>O₃</dt><dd>{aqi?.o3 ?? "—"}</dd></div><div><dt>NO₂</dt><dd>{aqi?.no2 ?? "—"}</dd></div></dl>
          <p className="section-caption">Pollutant concentrations in µg/m³</p>
        </div>
        {metrics.map(({ icon: Icon, label, value, unit: suffix, note }) => (
          <div className="panel metric" key={label}><div className="metric-label"><Icon size={18} aria-hidden="true" /><span>{label}</span></div><p className="metric-value">{value}<span>{suffix}</span></p><p className="section-caption">{note}</p></div>
        ))}
      </div>
    </section>
  );
}

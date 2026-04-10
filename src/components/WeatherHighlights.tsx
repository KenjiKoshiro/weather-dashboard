import { motion } from "framer-motion";
import { 
  Activity, 
  CloudRain, 
  Wind, 
  Gauge, 
  Sun, 
  Droplets, 
  Eye 
} from "lucide-react";
import { CurrentWeather } from "../types/weather";
import { MoonPhase } from "./MoonPhase";

interface WeatherHighlightsProps {
  data: CurrentWeather;
  moonPhase: number;
}

export function WeatherHighlights({ data, moonPhase }: WeatherHighlightsProps) {
  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0 }
  };

  const aqiLabel = (index: number) => {
    if (index <= 1) return { text: "Good", color: "text-green-500" };
    if (index <= 2) return { text: "Moderate", color: "text-yellow-500" };
    if (index <= 3) return { text: "Unhealthy for Sensitive Groups", color: "text-orange-500" };
    if (index <= 4) return { text: "Unhealthy", color: "text-red-500" };
    return { text: "Hazardous", color: "text-purple-500" };
  };

  const aqi = data.airQuality ? aqiLabel(data.airQuality.us_epa_index) : { text: "Unavailable", color: "text-slate-400" };

  return (
    <motion.section variants={itemVariants} className="space-y-6">
      <div className="flex items-center justify-between">
        <h3 className="text-sm font-bold uppercase tracking-widest text-blue-500">Weather Intelligence</h3>
        <div className="h-px flex-1 bg-white/10 mx-4" />
      </div>

      <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
        {/* AQI Card - Large */}
        <div className="zenith-glass zenith-card col-span-full flex flex-col justify-between gap-6 overflow-hidden sm:col-span-2">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-2xl bg-blue-500/10 text-blue-500">
                <Activity className="h-5 w-5" />
              </div>
              <div>
                <p className="text-[10px] font-bold uppercase tracking-widest text-slate-400 dark:text-slate-300">Air Quality Index</p>
                <p className={`text-lg font-bold ${aqi.color}`}>{aqi.text}</p>
              </div>
            </div>
            <div className="text-4xl font-black text-slate-200 dark:text-white/10">AQI</div>
          </div>
          
          <div className="space-y-4">
             <div className="relative h-2 w-full overflow-hidden rounded-full bg-slate-200 dark:bg-white/5">
                <motion.div 
                   initial={{ width: 0 }}
                   animate={{ width: `${(data.airQuality?.us_epa_index || 1) * 20}%` }}
                   className={`h-full bg-linear-to-r from-green-500 via-yellow-500 to-red-500`}
                />
             </div>
             <div className="grid grid-cols-3 gap-2 text-[10px] font-bold uppercase tracking-tighter text-slate-500 dark:text-slate-300">
                <div className="flex flex-col gap-1 rounded-xl bg-black/5 p-2 dark:bg-white/5">
                  <span>PM2.5</span>
                  <span className="text-xs text-slate-900 dark:text-white">{data.airQuality?.pm2_5}</span>
                </div>
                <div className="flex flex-col gap-1 rounded-xl bg-black/5 p-2 dark:bg-white/5">
                  <span>O3</span>
                  <span className="text-xs text-slate-900 dark:text-white">{data.airQuality?.o3}</span>
                </div>
                <div className="flex flex-col gap-1 rounded-xl bg-black/5 p-2 dark:bg-white/5">
                  <span>NO2</span>
                  <span className="text-xs text-slate-900 dark:text-white">{data.airQuality?.no2}</span>
                </div>
             </div>
          </div>
        </div>

        {/* Rain Card */}
        <HighlightCard 
          icon={<CloudRain className="h-5 w-5" />} 
          label="Precipitation" 
          value={`${data.precipitation.toFixed(1)}`}
          unit="mm"
          sub="Current hourly vol."
        />

        {/* Gusts Card */}
        <HighlightCard 
          icon={<Wind className="h-5 w-5" />} 
          label="Wind Gusts" 
          value={`${data.windGusts.toFixed(1)}`}
          unit="km/h"
          sub="Current peak speed"
        />

        <HighlightCard 
          icon={<Gauge className="h-5 w-5" />} 
          label="Pressure" 
          value={`${Math.round(data.pressure)}`}
          unit="hPa"
          sub="Atmospheric state"
        />

        <div className="col-span-full grid gap-6 sm:grid-cols-2">
          <MoonPhase phase={moonPhase} />
          
          <div className="flex items-center gap-4 rounded-3xl bg-black/5 p-4 dark:bg-white/5 transition-all hover:bg-black/10 dark:hover:bg-white/10">
            <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-linear-to-br from-indigo-500 to-purple-500 text-white shadow-lg">
              <span className="text-xl font-black">Z</span>
            </div>
            <div>
              <p className="text-[10px] font-bold uppercase tracking-widest text-indigo-500">Zenith Score</p>
              <p className="text-sm font-bold">{(100 - (Math.abs(22 - data.temperature) * 2 + (data.humidity > 60 ? (data.humidity - 60) : 0))).toFixed(0)}/100</p>
              <p className="text-[10px] text-slate-500">Thermal Comfort Index</p>
            </div>
          </div>
        </div>

        <HighlightCard 
          icon={<Sun className="h-5 w-5" />} 
          label="UV Index" 
          value={data.uvIndex > 0 ? `${data.uvIndex.toFixed(1)}` : "N/A"}
          unit=""
          sub={data.uvIndex > 0 ? (data.uvIndex > 5 ? "High risk" : "Low risk") : "Free Tier Limit"}
        />

        <HighlightCard 
          icon={<Droplets className="h-5 w-5" />} 
          label="Dew Point" 
          value={`${Math.round(data.dewPoint)}`}
          unit="°"
          sub="Condensation point"
        />

        <HighlightCard 
          icon={<Eye className="h-5 w-5" />} 
          label="Visibility" 
          value={`${data.visibility.toFixed(1)}`}
          unit="km"
          sub="Horizontal range"
        />
      </div>
    </motion.section>
  );
}

function HighlightCard({ icon, label, value, unit, sub }: { 
  icon: React.ReactNode, 
  label: string, 
  value: string, 
  unit: string,
  sub: string
}) {
  return (
    <div className="zenith-glass zenith-card flex flex-col justify-between gap-4">
      <div className="flex items-center gap-3 text-blue-500">
        <div className="flex h-10 w-10 items-center justify-center rounded-2xl bg-blue-500/10">
          {icon}
        </div>
        <p className="text-[10px] font-bold uppercase tracking-widest text-slate-400 dark:text-slate-300">{label}</p>
      </div>
      <div>
        <div className="flex items-baseline gap-1">
          <span className="text-3xl font-bold">{value}</span>
          <span className="text-sm font-semibold text-slate-500 dark:text-slate-400">{unit}</span>
        </div>
        <p className="mt-1 text-[10px] font-medium text-slate-500 dark:text-slate-400">{sub}</p>
      </div>
    </div>
  );
}

import { motion } from "framer-motion";
import { HourlyForecast as HourlyType, UnitSystem } from "../types/weather";
import { WeatherIcon } from "./WeatherIcon";

interface HourlyForecastProps {
  hours: HourlyType[];
  unit: UnitSystem;
}

export function HourlyForecast({ hours, unit }: HourlyForecastProps) {
  const formatTemp = (temp: number) => {
    const val = unit === "c" ? temp : (temp * 9/5) + 32;
    return Math.round(val);
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0 }
  };

  // Get next 24 hours
  const displayHours = hours.slice(0, 24);

  return (
    <motion.section variants={itemVariants} className="space-y-6">
      <div className="flex items-center justify-between">
        <h3 className="text-sm font-bold uppercase tracking-widest text-blue-500">Hourly Dynamics</h3>
        <div className="h-px flex-1 bg-white/10 mx-4" />
      </div>

      <div className="flex gap-4 overflow-x-auto pb-4 pt-2 -mx-4 px-4 scrollbar-hide lg:mx-0 lg:px-0">
        {displayHours.map((hour, i) => (
          <motion.div
            key={hour.time}
            whileHover={{ y: -5 }}
            className="zenith-glass flex min-w-[100px] flex-col items-center gap-4 rounded-[2rem] p-5"
          >
            <p className="text-xs font-bold text-slate-400">
              {i === 0 ? "NOW" : new Date(hour.time * 1000).toLocaleTimeString('en-US', { hour: 'numeric', hour12: true })}
            </p>
            
            <WeatherIcon 
              code={hour.condition.code} 
              isDay={hour.isDay} 
              size={32} 
            />
            
            <div className="text-center">
              <p className="text-lg font-bold">{formatTemp(hour.temperature)}°</p>
              {hour.precipitationProbability > 0 && (
                <p className="text-[10px] font-bold text-blue-500">{hour.precipitationProbability}%</p>
              )}
            </div>

            <div className="h-10 w-full relative group">
                {/* Visual indicator of temp relative to average */}
                <div className="absolute inset-x-0 bottom-0 h-1 bg-black/5 dark:bg-white/5 rounded-full" />
                <motion.div 
                   initial={{ height: 0 }}
                   animate={{ height: `${Math.min(100, Math.max(20, (hour.temperature / 40) * 100))}%` }}
                   className="absolute inset-x-0 bottom-0 bg-linear-to-t from-blue-500/50 to-cyan-400/50 rounded-full"
                />
            </div>
          </motion.div>
        ))}
      </div>
    </motion.section>
  );
}

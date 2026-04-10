import { motion } from "framer-motion";
import { DailyForecast as DailyType, UnitSystem } from "../types/weather";
import { WeatherIcon } from "./WeatherIcon";
import { CloudRain } from "lucide-react";

interface DailyForecastProps {
  days: DailyType[];
  unit: UnitSystem;
}

export function DailyForecast({ days, unit }: DailyForecastProps) {
  const formatTemp = (temp: number) => {
    const val = unit === "c" ? temp : (temp * 9/5) + 32;
    return Math.round(val);
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0 }
  };

  const formatDate = (dateStr: string) => {
    const date = new Date(dateStr);
    const today = new Date();
    if (date.toDateString() === today.toDateString()) return "Today";
    
    return date.toLocaleDateString('en-US', { weekday: 'short' });
  };

  return (
    <motion.section variants={itemVariants} className="space-y-6">
      <div className="flex items-center justify-between">
        <h3 className="text-sm font-bold uppercase tracking-widest text-blue-500">5-Day Forecast</h3>
        <div className="h-px flex-1 bg-white/10 mx-4" />
      </div>

      <div className="zenith-glass zenith-card overflow-hidden">
        <div className="divide-y divide-white/5">
          {days.map((day, i) => (
            <motion.div
              key={day.date}
              initial={{ opacity: 0, x: -10 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: i * 0.1 }}
              className="flex items-center justify-between py-4 px-2 first:pt-0 last:pb-0"
            >
              <div className="w-20">
                <p className="text-sm font-bold">{formatDate(day.date)}</p>
                <p className="text-[10px] font-bold text-slate-500 dark:text-slate-300">{new Date(day.date).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}</p>
              </div>

              <div className="flex flex-1 items-center justify-center gap-8 px-4">
                <div className="flex items-center gap-4">
                  <WeatherIcon code={day.condition.code} size={28} />
                  <span className="hidden text-sm font-medium sm:block">{day.condition.text}</span>
                </div>
                
                {day.precipitationProbability > 0 && (
                  <div className="flex items-center gap-1.5 text-blue-500">
                    <CloudRain className="h-3 w-3" />
                    <span className="text-[10px] font-bold">{day.precipitationProbability}%</span>
                  </div>
                )}
              </div>

              <div className="flex w-32 items-center justify-end gap-4">
                <div className="text-right">
                  <span className="text-sm font-bold">{formatTemp(day.maxTemp)}°</span>
                  <div className="relative mt-1 h-1 w-12 overflow-hidden rounded-full bg-slate-200 dark:bg-white/5">
                    <div className="absolute inset-y-0 left-1/4 right-1/4 bg-blue-500" />
                  </div>
                </div>
                <span className="text-sm font-bold text-slate-400">{formatTemp(day.minTemp)}°</span>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </motion.section>
  );
}

import { motion } from "framer-motion";
import { 
  Wind, 
  Droplets, 
  MapPin, 
  Calendar,
  Navigation,
  Thermometer,
  Eye,
  Umbrella
} from "lucide-react";
import { CurrentWeather as CurrentWeatherType, UnitSystem } from "../types/weather";
import { WeatherIcon } from "./WeatherIcon";

interface CurrentWeatherProps {
  data: CurrentWeatherType;
  location: {
    name: string;
    country: string;
  };
  unit: UnitSystem;
}

export function CurrentWeather({ data, location, unit }: CurrentWeatherProps) {
  const formatTemp = (temp: number) => {
    const val = unit === "c" ? temp : (temp * 9/5) + 32;
    return Math.round(val);
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0 }
  };

  return (
    <motion.section 
      variants={itemVariants}
      className="zenith-glass zenith-card relative overflow-hidden"
    >
      {/* Decorative Blur */}
      <div className="absolute -right-24 -top-24 h-64 w-64 rounded-full bg-blue-500/10 blur-[100px]" />
      
      <div className="relative flex flex-col gap-8 lg:flex-row lg:items-center lg:justify-between">
        <div className="space-y-6">
          <div className="flex flex-col gap-2">
            <div className="flex items-center gap-2 text-blue-500">
              <MapPin className="h-4 w-4" />
              <span className="text-xs font-bold uppercase tracking-widest">{location.country}</span>
            </div>
            <h2 className="text-4xl font-bold tracking-tight lg:text-5xl">{location.name}</h2>
            <div className="flex items-center gap-4 text-sm text-slate-500 dark:text-slate-200">
              <div className="flex items-center gap-1.5">
                <Calendar className="h-4 w-4" />
                <span>Today, {new Date().toLocaleDateString('en-US', { month: 'long', day: 'numeric' })}</span>
              </div>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4 sm:grid-cols-4">
            <DetailItem 
              icon={<Wind className="h-4 w-4" />} 
              label="Wind" 
              value={`${data.windSpeed} km/h`} 
            />
            <DetailItem 
              icon={<Droplets className="h-4 w-4" />} 
              label="Humidity" 
              value={`${data.humidity}%`} 
            />
            <DetailItem 
              icon={<Eye className="h-4 w-4" />} 
              label="Visibility" 
              value={`${data.visibility.toFixed(1)} km`} 
            />
            <DetailItem 
              icon={<Umbrella className="h-4 w-4" />} 
              label="Rain" 
              value={`${data.precipitation.toFixed(1)} mm`} 
            />
          </div>
        </div>

        <div className="flex items-center gap-8 lg:flex-col lg:items-end">
          <div className="flex items-center gap-6">
            <div className="text-right">
              <motion.div 
                initial={{ scale: 0.8 }}
                animate={{ scale: 1 }}
                className="text-7xl font-bold tracking-tighter lg:text-8xl"
              >
                {formatTemp(data.temperature)}°
              </motion.div>
              <p className="text-sm font-medium text-slate-500 dark:text-slate-300">
                Feels like {formatTemp(data.feelsLike)}°
              </p>
            </div>
            <WeatherIcon 
              code={data.condition.code} 
              isDay={data.isDay} 
              size={120} 
              className="lg:hidden"
            />
          </div>
          
          <div className="hidden items-center gap-3 rounded-[2rem] bg-black/5 p-4 dark:bg-white/5 lg:flex">
             <div className="text-right">
              <p className="text-[10px] font-bold uppercase tracking-widest text-blue-500">Condition</p>
              <p className="text-lg font-semibold">{data.condition.text}</p>
             </div>
             <WeatherIcon 
              code={data.condition.code} 
              isDay={data.isDay} 
              size={48} 
            />
          </div>
        </div>
      </div>
    </motion.section>
  );
}

function DetailItem({ icon, label, value }: { icon: React.ReactNode, label: string, value: string }) {
  return (
    <div className="flex flex-col gap-2 rounded-3xl bg-black/5 p-4 transition-colors hover:bg-black/10 dark:bg-white/5 dark:hover:bg-white/10">
      <div className="flex h-8 w-8 items-center justify-center rounded-xl bg-blue-500/10 text-blue-500">
        {icon}
      </div>
      <div>
        <p className="text-[10px] font-bold uppercase tracking-widest text-slate-400 dark:text-slate-300">{label}</p>
        <p className="text-sm font-semibold">{value}</p>
      </div>
    </div>
  );
}

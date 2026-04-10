import { 
  Sun, 
  Cloud, 
  CloudRain, 
  CloudLightning, 
  CloudSnow, 
  CloudFog, 
  CloudDrizzle,
  Moon,
  CloudMoon,
  Wind
} from "lucide-react";
import { motion } from "framer-motion";

interface WeatherIconProps {
  code: number;
  isDay?: boolean;
  className?: string;
  size?: number;
}

export function WeatherIcon({ code, isDay = true, className = "", size = 24 }: WeatherIconProps) {
  // WMO Weather Codes mapping to Lucide Icons
  const getIcon = () => {
    // OpenWeatherMap Codes
    if (code >= 200 && code < 300) return CloudLightning;
    if (code >= 300 && code < 400) return CloudDrizzle;
    if (code >= 500 && code < 600) return CloudRain;
    if (code >= 600 && code < 700) return CloudSnow;
    if (code >= 700 && code < 800) return CloudFog;
    if (code === 800) return isDay ? Sun : Moon;
    if (code === 801 || code === 802) return isDay ? CloudMoon : CloudMoon; // Partly cloudy
    if (code === 803 || code === 804) return Cloud; // Cloudy/Overcast

    // WMO Weather Codes mapping (Fallback for transition)
    if (code === 0) return isDay ? Sun : Moon;
    if (code === 1 || code === 2) return isDay ? CloudMoon : CloudMoon;
    if (code === 3) return Cloud;
    if (code === 45 || code === 48) return CloudFog;
    if (code >= 51 && code <= 57) return CloudDrizzle;
    if (code >= 61 && code <= 67) return CloudRain;
    if (code >= 80 && code <= 82) return CloudRain;
    if (code >= 71 && code <= 77) return CloudSnow;
    if (code >= 85 && code <= 86) return CloudSnow;
    if (code >= 95) return CloudLightning;

    return Wind; 
  };

  const IconComponent = getIcon();

  return (
    <motion.div
      initial={{ scale: 0.5, opacity: 0 }}
      animate={{ scale: 1, opacity: 1 }}
      className={`flex items-center justify-center ${className}`}
    >
      <IconComponent 
        size={size} 
        className={code === 0 && isDay ? "text-amber-400" : "text-blue-400"} 
        strokeWidth={1.5}
      />
    </motion.div>
  );
}

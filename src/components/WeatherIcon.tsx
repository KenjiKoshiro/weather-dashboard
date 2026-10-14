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
  CloudSun,
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
    if (code === 0) return isDay ? Sun : Moon;
    if (code === 1 || code === 2) return isDay ? CloudSun : CloudMoon;
    if (code === 3) return Cloud;
    if (code === 45 || code === 48) return CloudFog;
    if (code >= 51 && code <= 57) return CloudDrizzle;
    if (code >= 61 && code <= 67) return CloudRain;
    if (code >= 80 && code <= 82) return CloudRain;
    if (code >= 71 && code <= 77) return CloudSnow;
    if (code >= 85 && code <= 86) return CloudSnow;
    if ([95, 96, 97, 99].includes(code)) return CloudLightning;

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
        aria-hidden="true"
        className={code === 0 && isDay ? "text-amber-400" : "text-blue-400"}
        strokeWidth={1.5}
      />
    </motion.div>
  );
}

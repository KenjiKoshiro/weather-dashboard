import { normalizeIconUrl } from "../utils/weatherFormat";

interface WeatherIconProps {
  icon: string;
  alt: string;
  size?: number;
  className?: string;
}

export function WeatherIcon({ icon, alt, size = 48, className = "" }: WeatherIconProps) {
  return (
    <img
      src={normalizeIconUrl(icon)}
      alt={alt}
      width={size}
      height={size}
      className={`drop-shadow-sm ${className}`.trim()}
      loading="lazy"
    />
  );
}

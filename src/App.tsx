import { useEffect, useState, useMemo } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useWeather } from "./hooks/useWeather";
import { Header } from "./components/Header";
import { CurrentWeather } from "./components/CurrentWeather";
import { HourlyForecast } from "./components/HourlyForecast";
import { DailyForecast } from "./components/DailyForecast";
import { WeatherHighlights } from "./components/WeatherHighlights";
import { RecentSearches } from "./components/RecentSearches";
import { Loader } from "./components/Loader";
import { ErrorMessage } from "./components/ErrorMessage";
import { RefreshCw, MapPin } from "lucide-react";

export default function App() {
  const {
    weather,
    loading,
    error,
    unit,
    theme,
    recentSearches,
    handleSearch,
    handleUseLocation,
    toggleUnit,
    toggleTheme,
    removeRecentSearch,
    refreshWeather,
  } = useWeather();

  const [mousePos, setMousePos] = useState({ x: 0, y: 0 });

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      setMousePos({ x: e.clientX, y: e.clientY });
    };
    window.addEventListener("mousemove", handleMouseMove);
    return () => window.removeEventListener("mousemove", handleMouseMove);
  }, []);

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
      },
    },
  };

  return (
    <div className="relative min-h-screen selection:bg-blue-500/30">
      {/* Background Interactive Light */}
      <div
        id="zenith-cursor-light"
        style={{
          left: mousePos.x,
          top: mousePos.y,
        }}
      />

      <div className="relative z-10 mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
        <Header
          onSearch={handleSearch}
          onUseLocation={handleUseLocation}
          onToggleUnit={toggleUnit}
          onToggleTheme={toggleTheme}
          unit={unit}
          theme={theme}
          isSearching={loading}
        />

        <main className="mt-8">
          <AnimatePresence mode="wait">
            {loading && !weather ? (
              <motion.div
                key="loader"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="flex min-h-[60vh] flex-col items-center justify-center gap-4"
              >
                <Loader />
                <p className="animate-pulse text-sm font-medium text-slate-500 dark:text-slate-300">
                  Aligning stars and fetching weather...
                </p>
              </motion.div>
            ) : error ? (
              <motion.div
                key="error"
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.9 }}
              >
                <ErrorMessage message={error} onRetry={refreshWeather} />
              </motion.div>
            ) : weather ? (
              <motion.div
                key="content"
                variants={containerVariants}
                initial="hidden"
                animate="visible"
                className="grid gap-8 lg:grid-cols-[1fr_350px]"
              >
                <div className="space-y-8">
                  <CurrentWeather data={weather.current} location={weather.location} unit={unit} />
                  <HourlyForecast hours={weather.hourly} unit={unit} />
                  <DailyForecast days={weather.daily} unit={unit} />
                  <WeatherHighlights data={weather.current} moonPhase={weather.daily[0]?.moonPhase || 0} />
                </div>

                <div className="space-y-8">
                  <RecentSearches
                    items={recentSearches}
                    onSelect={(id) => {
                      const item = recentSearches.find((i) => i.id === id);
                      if (item) {
                        const [lat, lon] = id.split(",").map(Number);
                        handleSearch({
                          lat,
                          lon,
                          name: item.name,
                          country: item.country,
                          fullLabel: `${item.name}, ${item.country}`,
                        });
                      }
                    }}
                    onRemove={removeRecentSearch}
                  />

                  {/* Status Card */}
                  <motion.div
                    variants={{ hidden: { opacity: 0, y: 20 }, visible: { opacity: 1, y: 0 } }}
                    className="zenith-glass zenith-card space-y-6"
                  >
                    <div className="flex items-center justify-between">
                      <h3 className="text-sm font-semibold uppercase tracking-widest text-blue-500">Live Status</h3>
                      <button
                        onClick={refreshWeather}
                        className="rounded-full p-2 transition-colors hover:bg-black/5 dark:hover:bg-white/5"
                      >
                        <RefreshCw className={`h-4 w-4 ${loading ? "animate-spin" : ""}`} />
                      </button>
                    </div>
                    
                    <div className="space-y-4">
                      <div className="flex items-center gap-3">
                        <div className="flex h-10 w-10 items-center justify-center rounded-2xl bg-blue-500/10 text-blue-500">
                          <MapPin className="h-5 w-5" />
                        </div>
                        <div>
                          <p className="text-xs text-slate-500 dark:text-slate-300">Current Region</p>
                          <p className="text-sm font-semibold">{weather.location.name}</p>
                        </div>
                      </div>
                      
                      <div className="rounded-3xl bg-black/5 p-4 dark:bg-white/5">
                        <p className="text-[10px] font-bold uppercase tracking-tighter text-slate-400 dark:text-slate-200">System State</p>
                        <p className="mt-1 text-sm font-medium">
                          {loading ? "Syncing data..." : "Live Feed: Active"}
                        </p>
                        <div className="mt-3 h-1 w-full overflow-hidden rounded-full bg-slate-200 dark:bg-slate-800">
                          <motion.div
                            initial={{ x: "-100%" }}
                            animate={{ x: "100%" }}
                            transition={{ repeat: Infinity, duration: 2, ease: "linear" }}
                            className="h-full w-1/3 bg-blue-500"
                          />
                        </div>
                      </div>
                    </div>
                  </motion.div>
                </div>
              </motion.div>
            ) : null}
          </AnimatePresence>
        </main>

        <footer className="mt-12 flex flex-col items-center justify-between gap-4 border-t border-white/10 pt-8 text-xs text-slate-500 dark:text-slate-300 sm:flex-row">
          <p>© 2026 Zenith Weather Dashboard. High-resolution meteorological data.</p>
          <div className="flex items-center gap-6">
            <a href="https://openweathermap.org/" target="_blank" rel="noreferrer" className="hover:text-blue-500">Powered by OpenWeatherMap</a>
            <a href="https://www.openstreetmap.org/" target="_blank" rel="noreferrer" className="hover:text-blue-500">© OpenStreetMap contributors</a>
          </div>
        </footer>
      </div>
    </div>
  );
}

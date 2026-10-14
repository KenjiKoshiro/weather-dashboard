import { MotionConfig } from "framer-motion";
import { RefreshCw, ArrowUpRight } from "lucide-react";
import { useWeather } from "./hooks/useWeather";
import { Header } from "./components/Header";
import { CurrentWeather } from "./components/CurrentWeather";
import { HourlyForecast } from "./components/HourlyForecast";
import { DailyForecast } from "./components/DailyForecast";
import { WeatherHighlights } from "./components/WeatherHighlights";
import { RecentSearches } from "./components/RecentSearches";
import { Loader } from "./components/Loader";
import { ErrorMessage } from "./components/ErrorMessage";

export default function App() {
  const { weather, loading, error, unit, theme, recentSearches, handleSearch,
    handleUseLocation, toggleUnit, toggleTheme, removeRecentSearch, refreshWeather } = useWeather();
  return (
    <MotionConfig reducedMotion="user">
      <a className="skip-link" href="#forecast">Skip to forecast</a>
      <div className="app-shell">
        <Header onSearch={handleSearch} onUseLocation={handleUseLocation}
          onToggleUnit={toggleUnit} onToggleTheme={toggleTheme}
          unit={unit} theme={theme} isSearching={loading} />
        <main id="forecast" tabIndex={-1}>
          <div className="page-intro">
            <div><p className="eyebrow">YOUR DAILY OUTLOOK</p><h2>A little clarity, whatever the weather.</h2></div>
            <button className="refresh-button" onClick={refreshWeather} disabled={loading}>
              <RefreshCw size={16} aria-hidden="true" className={loading ? "animate-spin" : ""} />
              {loading ? "Updating…" : "Refresh forecast"}
            </button>
          </div>
          <p className="sr-only" role="status">{loading ? "Updating weather" : weather && !error ? `Weather loaded for ${weather.location.name}` : ""}</p>
          {error ? <ErrorMessage message={error} onRetry={refreshWeather} /> : !weather ? (
            <div className="loading-panel"><Loader /><p>Fetching your forecast…</p></div>
          ) : (
            <div className="dashboard-grid" aria-busy={loading}>
              <div className="forecast-main">
                <CurrentWeather data={weather.current} location={weather.location} unit={unit} />
                <HourlyForecast hours={weather.hourly} unit={unit} timezone={weather.location.timezone} />
                <WeatherHighlights data={weather.current} unit={unit} />
              </div>
              <aside className="forecast-aside" aria-label="Extended forecast and recent places">
                <DailyForecast days={weather.daily} unit={unit} />
                <RecentSearches items={recentSearches} onRemove={removeRecentSearch} onSelect={(id) => {
                  const item = recentSearches.find((entry) => entry.id === id);
                  if (item) {
                    const [lat, lon] = id.split(",").map(Number);
                    handleSearch({ lat, lon, name: item.name, country: item.country, fullLabel: `${item.name}, ${item.country}` });
                  }
                }} />
                <div className="forecast-note"><span className="status-dot" />
                  <div><strong>{loading ? "Updating forecast" : "Connected to Open-Meteo"}</strong><p>Forecasts refresh automatically. Forecast times use {weather.location.timezone.replace(/_/g, " ")}.</p></div>
                </div>
              </aside>
            </div>
          )}
        </main>
        <footer><span>ZENITH <span className="footer-divider">/</span> A window to the weather.</span>
          <a href="https://open-meteo.com/" target="_blank" rel="noreferrer">Weather by Open-Meteo <ArrowUpRight size={14} aria-hidden="true" /></a>
          <a href="https://www.geonames.org/" target="_blank" rel="noreferrer">Locations: GeoNames</a>
          <a href="https://atmosphere.copernicus.eu/" target="_blank" rel="noreferrer">Air quality: CAMS</a>
        </footer>
      </div>
    </MotionConfig>
  );
}

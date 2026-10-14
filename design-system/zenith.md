# Zenith weather dashboard

UI/UX Pro Max was consulted with weather dashboard and React queries. Its dashboard density, legibility, touch-target and accessible-state guidance applies here; the generated marketing-page structure does not.

## Direction
A calm weather station: warm neutral canvas, sage current-weather panel, restrained borders, editorial serif introduction and system sans-serif data. No new fonts, packages or image requests. Semantic light/dark tokens live in src/index.css.

## Behavior
Search uses Open-Meteo geocoding. Temperature control names the destination unit. City results are native buttons accessible with Tab/Enter; Escape dismisses them. Refresh and location controls disable while loading. Native horizontal scrolling has a keyboard-focusable region. Touch controls are at least 44px. Motion respects the system preference.

## Data honesty
Forecast timestamps use the selected location timezone and one-hour intervals. Unsupported moon-phase and unvalidated comfort-score displays are omitted; unavailable UV stays explicit. Pollutant units and the US AQI scale are shown.

## Verification
Run npm run build, npx tsc --noEmit, and npm test. Verify 375px, 768px and desktop layouts, both themes, search and its empty state, unit conversion, recent places, and error/retry. Geolocation requires the user's browser permission.
